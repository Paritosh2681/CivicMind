import { tavily } from "@tavily/core";

const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY! });

export async function searchWeb(query: string, maxResults: number = 3) {
  try {
    const response = await tavilyClient.search(query, {
      searchDepth: "basic",
      includeAnswer: false,
      maxResults,
    });
    
    return response.results.map((r: any) => ({
      title: r.title,
      content: r.content,
      url: r.url
    }));
  } catch (error) {
    console.error("Tavily search error:", error);
    return [];
  }
}