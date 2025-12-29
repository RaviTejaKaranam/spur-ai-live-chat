import { Router } from "express";
import { ChatController } from "../controllers/chat.controller";

const router = Router();
const chatController = new ChatController();

router.post("/message", (req, res) => chatController.sendMessage(req, res));
router.get("/history", (req, res) => chatController.getHistory(req, res));

export default router;
