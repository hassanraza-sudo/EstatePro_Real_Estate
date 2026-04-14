const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Notification = require("../models/Notification");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

// GET all conversations for logged-in user (unique senders/receivers)
router.get("/conversations", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "name email role")
      .populate("receiver", "name email role")
      .sort({ createdAt: -1 });

    // Build unique conversation list
    const seen = new Set();
    const conversations = [];
    for (const msg of messages) {
      const other = msg.sender._id.toString() === userId.toString() ? msg.receiver : msg.sender;
      const key = other._id.toString();
      if (!seen.has(key)) {
        seen.add(key);
        const unread = await Message.countDocuments({
          sender: other._id,
          receiver: userId,
          read: false,
        });
        conversations.push({ user: other, lastMessage: msg, unread });
      }
    }
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET messages between two users
router.get("/:userId", auth, async (req, res) => {
  try {
    const me = req.user._id;
    const other = req.params.userId;
    const messages = await Message.find({
      $or: [
        { sender: me, receiver: other },
        { sender: other, receiver: me },
      ],
    })
      .populate("sender", "name role")
      .populate("receiver", "name role")
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { sender: other, receiver: me, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST send a message
router.post("/", auth, async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    if (!receiverId || !text)
      return res.status(400).json({ message: "receiverId and text required" });

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      text,
    });

    const populated = await message.populate([
      { path: "sender", select: "name role" },
      { path: "receiver", select: "name role" },
    ]);

    // Create notification for receiver
    await Notification.create({
      user: receiverId,
      type: "message",
      title: `New message from ${req.user.name}`,
      body: text.length > 60 ? text.substring(0, 60) + "..." : text,
      link: "/dashboard/messages",
    });

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all users to start a new conversation (exclude self)
router.get("/users/all", auth, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select("name email role");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
