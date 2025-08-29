const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');

// ✅ Send a message
router.post('/send', async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    const message = new Message({ sender: senderId, receiver: receiverId, content });
    await message.save();

    res.status(201).json({ success: true, message: 'Message sent!', data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send message', error });
  }
});

// ✅ Get all messages between two users
router.get('/:user1Id/:user2Id', async (req, res) => {
  try {
    const { user1Id, user2Id } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: user1Id, receiver: user2Id },
        { sender: user2Id, receiver: user1Id }
      ]
    }).sort({ timestamp: 1 });

    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch messages', error });
  }
});

module.exports = router;
