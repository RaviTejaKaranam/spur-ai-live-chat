import { Request, Response } from "express";
import { ChatService } from "../services/chat.service";

const chatService = new ChatService();

export class ChatController {
  async sendMessage(req: Request, res: Response) {
    try {
      const { message, sessionId } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      const result = await chatService.handleMessage(sessionId, message);
      res.json(result);
    } catch (err) {
      console.error("Error in /chat/message:", err);
      res
        .status(500)
        .json({ error: "Something went wrong. Please try again later." });
    }
  }

  async getHistory(req: Request, res: Response) {
    try {
      const sessionId = req.query.sessionId;
      if (!sessionId || typeof sessionId !== "string") {
        return res.status(400).json({ error: "sessionId is required" });
      }

      const messages = await chatService.getConversationHistory(sessionId);
      res.json({ sessionId, messages });
    } catch (err) {
      console.error("Error in /chat/history:", err);
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  }
}
