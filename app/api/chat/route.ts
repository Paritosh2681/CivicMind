import { NextRequest, NextResponse } from "next/server";
import { searchWeb } from "@/lib/tavily";
import { model } from "@/lib/gemini";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages, chatId } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    const userMessage = messages[messages.length - 1];

    if (userMessage.role !== "user") {
       return NextResponse.json({ error: "Last message must be from user" }, { status: 400 });
    }

    // Call Tavily Search API
    let searchContext = "";
    try {
      const searchResults = await searchWeb(userMessage.content, 3);
      if (searchResults && searchResults.length > 0) {
        searchContext = "**Real-time Web Search Results:**\n" + searchResults.map((r: any) => `- **${r.title}** (${r.url}): ${r.content}`).join("\n");
      }
    } catch (searchError) {
      console.warn("Search failed, continuing without context:", searchError);
    }

    const baseSystemPrompt = `You are CivicMind, an expert election literacy assistant. You help citizens understand election processes, voting rights, candidate information, party manifestos, and civic duties. You are factual, neutral, non-partisan, and cite sources when possible. Always encourage civic participation.`;

    const chatHistory = messages.slice(0, -1).map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const chatSession = model.startChat({
      history: chatHistory,
      systemInstruction: baseSystemPrompt,
    });

    // Build enhanced user message with web context
    const enhancedUserMessage = searchContext 
      ? `${searchContext}\n\n---\n\nQuestion: ${userMessage.content}` 
      : userMessage.content;
    
    const result = await chatSession.sendMessageStream([{text: enhancedUserMessage}]);

    let fullResponse = "";
    
    const encoder = new TextEncoder();
    const customReadable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            fullResponse += chunkText;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: chunkText })}\n\n`)
            );
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
        } catch (err) {
          console.error("Stream error:", err);
          controller.error(err);
        } finally {
          controller.close();
          // Save to Supabase after stream completes
          saveToSupabase(chatId, userMessage.content, fullResponse, user.id).catch(err => 
            console.error("Failed to save to Supabase:", err)
          );
        }
      }
    });

    return new Response(customReadable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error("AI Route Error:", error);
    console.error("Error details:", {
      message: error.message,
      status: error.status,
      code: error.code,
    });
    return NextResponse.json({ error: error.message || "Failed to process request" }, { status: 500 });
  }
}

async function saveToSupabase(
  chatId: string,
  userMessage: string,
  assistantMessage: string,
  userId: string
) {
  try {
    const supabase = await createClient();

    let finalChatId = chatId;

    if (!finalChatId) {
      const { data: chatData, error: chatError } = await supabase
        .from("chats")
        .insert([{ user_id: userId, title: userMessage.substring(0, 50) + "..." }])
        .select()
        .single();

      if (chatError || !chatData) {
        console.error("Error creating chat:", chatError);
        throw new Error("Failed to create chat");
      }
      finalChatId = chatData.id;
    }

    const { error: insertError } = await supabase.from("messages").insert([
      { chat_id: finalChatId, role: "user", content: userMessage },
      { chat_id: finalChatId, role: "assistant", content: assistantMessage },
    ]);

    if (insertError) {
      console.error("Error saving messages:", insertError);
    } else {
      console.log("Messages saved successfully");
    }
  } catch (error) {
    console.error("Error in saveToSupabase:", error);
  }
}