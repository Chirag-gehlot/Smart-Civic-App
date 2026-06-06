import e from "express";
import Chat from "../models/chat.js";
import Message from "../models/message.js";
import { generateAIResponse } from "../services/llmService.js";
import verifyToken from "../middleware/authmiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import { chatQueryLimiter } from "../middleware/rateLimiters.js";
import { chatMessagesSchema, chatQuerySchema } from "../validation/schemas.js";

const chatRouter = e.Router();

chatRouter.post("/create-chat", verifyToken, async (req, res) => {
  const userId = req.user.uid; // ✅ was req.user.id — token payload uses "uid"

  try {
    const chat = await Chat.create({ userId });

    res.status(200).json({
      success: true,
      chatId: chat._id,
    });
  } catch (err) {
    console.error("Chat create error:", err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

chatRouter.post(
  "/:chatId/query",
  verifyToken,
  chatQueryLimiter,
  validateRequest(chatQuerySchema),
  async (req, res) => {
    const { query } = req.body;
    const { chatId } = req.params;
    const userId = req.user.uid; // ✅ was req.user.id

    const valid = await Chat.exists({ _id: chatId, userId });
    if (!valid) {
      return res.status(403).json({
        success: false,
        message: "Invalid chat",
      });
    }

    const userMessage = await Message.create({
      chatId,
      role: "user",
      content: query,
    });

    try {
      const airesponse = await generateAIResponse(query);

      await Message.create({
        chatId,
        role: "assistant",
        content: airesponse,
        parentMessageId: userMessage._id,
      });

      await Chat.findByIdAndUpdate(chatId, { updatedAt: new Date() });

      return res.status(200).json({
        success: true,
        answer: airesponse,
      });
    } catch (err) {
      console.error("AI response error:", err.message);
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
);

// In chatRouter.js

chatRouter.get("/history", verifyToken, async (req, res) => {
  const userId = req.user.uid;

  try {
    const chats = await Chat.find({ userId })
      .sort({ updatedAt: -1 })
      .select("_id title createdAt updatedAt");

    return res.status(200).json({ success: true, chats });
  } catch (err) {
    console.error("History fetch error:", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

chatRouter.get(
  "/:chatId/messages",
  verifyToken,
  validateRequest(chatMessagesSchema),
  async (req, res) => {
    const { chatId } = req.params;
    const userId = req.user.uid;

    const valid = await Chat.exists({ _id: chatId, userId });
    if (!valid) {
      return res.status(403).json({ success: false, message: "Invalid chat" });
    }

    try {
      const messages = await Message.find({ chatId })
        .sort({ createdAt: 1 })
        .select("_id role content createdAt parentMessageId");

      return res.status(200).json({ success: true, messages });
    } catch (err) {
      console.error("Messages fetch error:", err.message);
      return res.status(500).json({ success: false, message: err.message });
    }
  },
);

export default chatRouter;
