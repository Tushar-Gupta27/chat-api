import express from "express";
import Conversation from "../models/conversationModel.js";
const router = express.Router();

//New Conv

router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const savedConvo = await newConversation.save();
    res.status(200).json(savedConvo);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    const convoMembers = conversations.map((c) => {
      return c.members.filter((m) => m !== req.params.userId);
    });
    let temp = [];
    convoMembers.forEach((c) => temp.push(c[0]));
    return res.status(200).json({ conversations, convoMembers: temp });
  } catch (err) {
    return res.status(400).json(err);
  }
});

export default router;
