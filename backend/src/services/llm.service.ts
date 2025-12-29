import OpenAI from "openai";

export type LLMMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function getAIReply(messages: LLMMessage[]): Promise<string> {
  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages,
      max_tokens: 500,
    });

    return response.choices[0].message?.content ?? "AI did not respond.";
  } catch (err) {
    console.error("Error calling Groq API:", err);
    return "AI encountered an error.";
  }
}
