const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// GET all posts
router.get('/', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// POST a new post
router.post('/', async (req, res) => {
  const { userName, content, audience, allowComments, imageUrl } = req.body;
  const newPost = new Post({ userName, content, audience, allowComments, imageUrl });
  await newPost.save();
  res.status(201).json({ message: 'Post created', post: newPost });
});

module.exports = router;
