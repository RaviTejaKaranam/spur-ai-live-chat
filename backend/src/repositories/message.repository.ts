import { prisma } from "../prisma";

export class MessageRepository {
  async createMessage(
    conversationId: string,
    sender: "user" | "ai",
    text: string
  ) {
    return prisma.message.create({
      data: { conversationId, sender, text },
    });
  }

  async getMessagesByConversation(conversationId: string) {
    return prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });
  }
}
