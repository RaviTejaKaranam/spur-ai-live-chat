import { prisma } from "../prisma";
import * as cuid2 from "@paralleldrive/cuid2";

export class ConversationRepository {
  async createConversation() {
    return prisma.conversation.create({
      data: {
        id: cuid2.createId(), // generates a unique ID
      },
    });
  }

  async getConversationById(id: string) {
    return prisma.conversation.findUnique({
      where: { id },
      include: { messages: true },
    });
  }
}
