import { ConversationRepository } from "../repositories/conversation.repository";
import { MessageRepository } from "../repositories/message.repository";
import { getAIReply, LLMMessage } from "./llm.service";

const conversationRepo = new ConversationRepository();
const messageRepo = new MessageRepository();

export class ChatService {
  async handleMessage(sessionId: string | undefined, userMessage: string) {
    if (!userMessage || userMessage.trim() === "") {
      throw new Error("Message is required");
    }

    if (userMessage.length > 1000) userMessage = userMessage.slice(0, 1000);

    let conversationId = sessionId;
    if (!conversationId) {
      const conversation = await conversationRepo.createConversation();
      conversationId = conversation.id;
    }

    await messageRepo.createMessage(conversationId, "user", userMessage);

    const history = await messageRepo.getMessagesByConversation(conversationId);

    const llmMessages: LLMMessage[] = [
      {
        role: "system",
        content: `
        You are a helpful support agent for a small e-commerce store.
        Answer clearly and concisely.
        FAQs:
        - Shipping: 2-5 business days
        - Returns: 30-day refund policy
        - Support hours: 9am-6pm Mon-Fri
        - Products: electronics, apparel, home goods
        Provide links to relevant help articles when appropriate.
        Support payments via credit card, PayPal, and Apple Pay.
      `,
      },
      ...history.map((msg) => ({
        role: (msg.sender === "user" ? "user" : "assistant") as
          | "user"
          | "assistant",
        content: msg.text,
      })),
    ];

    let aiReply: string;
    try {
      aiReply = await getAIReply(llmMessages);
    } catch (err) {
      console.error("LLM Error:", err);
      aiReply = "Sorry, the AI failed to respond. Please try again.";
    }

    await messageRepo.createMessage(conversationId, "ai", aiReply);

    return {
      reply: aiReply,
      sessionId: conversationId,
      messages: [
        ...history.map((m) => ({
          sender: m.sender,
          text: m.text,
          createdAt: m.createdAt?.toISOString(),
        })),
        { sender: "ai", text: aiReply, createdAt: new Date().toISOString() },
      ],
    };
  }

  async getConversationHistory(sessionId: string) {
    const messages = await messageRepo.getMessagesByConversation(sessionId);
    return messages.map((msg) => ({
      sender: msg.sender,
      text: msg.text,
      createdAt: msg.createdAt?.toISOString(),
    }));
  }
}
