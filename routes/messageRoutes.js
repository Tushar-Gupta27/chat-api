import express from "express";
import Message from "../models/messageModel.js";
const router = express.Router();

router.post("/", async (req, res) => {
  const newMessage = new Message(req.body);
  try {
    const result = await newMessage.save();
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json(err);
  }
});

router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json(err);
  }
});
export default router;
