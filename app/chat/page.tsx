"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Send, Menu, PlusCircle, Search } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatSession = {
  id: string;
  title: string;
};

const SUGGESTED_TOPICS = [
  "How do I register to vote?",
  "How does vote counting work?",
  "What is an EVM?",
  "How are constituencies decided?",
  "What is Model Code of Conduct?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const fetchSessions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("chats")
      .select("id, title")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && (data as any)) {
      setSessions(data as any);
    }
  };

  const loadSession = async (id: string) => {
    setActiveSessionId(id);
    const { data, error } = await supabase
      .from("messages")
      .select("id, role, content")
      .eq("chat_id", id)
      .order("created_at", { ascending: true });

    if (!error && (data as any)) {
      setMessages(data as any);
    }
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          chatId: activeSessionId,
        }),
      });

      if (!response.ok) throw new Error("Failed to send response");
      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      const assistantId = crypto.randomUUID();
      
      // Add empty assistant message first
      setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6).trim();
              if (jsonStr) {
                const data = JSON.parse(jsonStr);
                if (data.done) {
                  break;
                }
                if (data.text) {
                  assistantContent += data.text;
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    if (newMessages.length > 0) {
                      newMessages[newMessages.length - 1] = {
                        ...newMessages[newMessages.length - 1],
                        content: assistantContent,
                      };
                    }
                    return newMessages;
                  });
                }
              }
            } catch (e) {
              console.error("Parse error:", e);
            }
          }
        }
      }
      
      if (!activeSessionId) {
        fetchSessions();
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, there was an error processing your request. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#0D1B2A]">
      {/* Sidebar */}
      <aside
        className={`\${
          isSidebarOpen ? "w-72" : "w-0"
        } transition-all duration-300 border-r border-slate-800 bg-slate-900/50 flex flex-col overflow-hidden`}
      >
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <button
                onClick={handleNewChat}
                className="flex items-center gap-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors w-full justify-center"
            >
                <PlusCircle size={18} /> New Chat
            </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Chat History</h3>
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => loadSession(session.id)}
              className={`w-full text-left truncate px-3 py-2 rounded-md text-sm transition-colors \${
                activeSessionId === session.id
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              {session.title || "New Chat..."}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-slate-800 flex items-center px-4 gap-4 bg-slate-900/30">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="text-slate-400 hover:text-white p-2 rounded-md hover:bg-slate-800 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1 overflow-x-auto whitespace-nowrap scrollbar-hide flex gap-2">
            {SUGGESTED_TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => sendMessage(topic)}
                className="text-xs border border-slate-700 text-slate-300 px-3 py-1.5 rounded-full hover:bg-slate-800 hover:text-white transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <img src="https://img.icons8.com/isometric/100/parliament.png" alt="Emblem" className="w-24 h-24 mb-4 opacity-80 mix-blend-screen" />
                    <h2 className="text-3xl font-bold font-heading text-white">Ask CivicMind</h2>
                    <p className="text-slate-400 max-w-md">Your AI guide to understanding elections safely, neutrally, and with real-time web context.</p>
                </div>
            ) : (
                messages.map((msg, i) => (
                    <div
                    key={msg.id || i}
                    className={`flex \${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                    <div className={`max-w-[75%] rounded-2xl px-6 py-4 \${
                        msg.role === "user"
                        ? "bg-[#1E90FF] text-white rounded-br-none"
                        : "bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700/50 shadow-md"
                    }`}>
                        {msg.role === "assistant" && (
                            <div className="flex items-center gap-1.5 mb-3 text-[10px] uppercase tracking-wider font-semibold text-blue-300 bg-blue-900/30 w-max px-2.5 py-1 rounded-full border border-blue-800/50">
                                <Search size={12} />
                                Searched the web
                            </div>
                        )}
                        <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 max-w-none">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                    </div>
                    </div>
                ))
            )}
            {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-slate-800 text-slate-400 rounded-2xl rounded-bl-none px-6 py-4 border border-slate-700/50 flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-medium animate-pulse">Searching the web and synthesizing answer...</span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-slate-900/50 border-t border-slate-800 backdrop-blur-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="max-w-4xl mx-auto flex items-end gap-3"
          >
            <div className="relative flex-1 bg-slate-800/80 rounded-xl border border-slate-700 shadow-inner overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(input);
                    }
                }}
                placeholder="Ask about election processes, voting guidelines..."
                className="w-full bg-transparent text-white p-4 max-h-32 min-h-[56px] resize-none outline-none placeholder:text-slate-500"
                rows={1}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-[#1E90FF] hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-[#1E90FF] text-white p-4 rounded-xl transition-all shadow-lg shadow-blue-900/20 flex-shrink-0"
            >
              <Send size={20} className={isLoading ? "animate-pulse" : ""} />
            </button>
          </form>
          <div className="text-center mt-3 text-xs text-slate-500 font-medium">
            CivicMind can make mistakes. Consider verifying important information with official sources.
          </div>
        </div>
      </main>
    </div>
  );
}