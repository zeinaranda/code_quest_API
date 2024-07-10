const express = require('express');
const router = express.Router();
const { Post, Comment, User } = require('../models');

// Endpoint untuk membuat posting baru
router.post('/posts', async (req, res) => {
  const {  content, userId } = req.body;

  try {
    const newPost = await Post.create({
      content,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Endpoint untuk mendapatkan semua posting
router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [
                { 
                    model: User,
                    attributes: ['nama', 'profileAvatar'], // Pilih atribut yang ingin ditampilkan
                    as: 'user' // Sesuaikan dengan alias yang telah ditentukan dalam asosiasi
                }
            ],
            order: [['createdAt', 'DESC']] // Mengurutkan berdasarkan createdAt descending
        });

        // Mengubah format respon untuk menampilkan nama dan profileAvatar
        const formattedPosts = posts.map(post => ({
            postId: post.postId,
            content: post.content,
            userId: post.userId,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            nama: post.user ? post.user.nama : null,
            profileAvatar: post.user ? post.user.profileAvatar : null
        }));

        res.json(formattedPosts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// Endpoint untuk membuat komentar pada suatu posting
router.post('/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;
  const { content, userId } = req.body;

  try {
    const newComment = await Comment.create({
      content,
      postId,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

router.get('/posts/:userId', async (req, res) => {
    const { userId } = req.params;
    
    try {
      const posts = await Post.findAll({
        where: { userId },
        include: [
          { 
            model: User,
            attributes: ['nama', 'profileAvatar'], // Pilih atribut yang ingin ditampilkan
            as: 'user' // Sesuaikan dengan alias yang telah ditentukan dalam asosiasi
          }
        ],
        order: [['createdAt', 'DESC']] // Mengurutkan berdasarkan createdAt descending

      });
  
      // Mengubah format respon untuk menampilkan nama dan profileAvatar
      const formattedPosts = posts.map(post => ({
        postId: post.postId,
        content: post.content,
        userId: post.userId,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        nama: post.user ? post.user.nama : null,
        profileAvatar: post.user ? post.user.profileAvatar : null
      }));
  
      res.json(formattedPosts);
    } catch (error) {
      console.error('Error fetching posts by userId:', error);
      res.status(500).json({ error: 'Failed to fetch posts by userId' });
    }
  });

// Endpoint untuk mendapatkan komentar dari suatu posting
router.get('/posts/:postId/comments', async (req, res) => {
    const { postId } = req.params;
  
    try {
      const comments = await Comment.findAll({
        where: { postId },
        include: [
          { 
            model: User,
            attributes: ['nama', 'profileAvatar'], // Pilih atribut yang ingin ditampilkan
            as: 'user' // Sesuaikan dengan alias yang telah ditentukan dalam asosiasi
          }
        ],
        order: [['createdAt', 'DESC']] // Mengurutkan berdasarkan createdAt descending

      });
  
      // Mengubah format respon untuk menampilkan nama dan profileAvatar
      const formattedComments = comments.map(comment => ({
        commentId: comment.commentId,
        content: comment.content,
        userId: comment.userId,
        postId: comment.postId,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        nama: comment.user ? comment.user.nama : null,
        profileAvatar: comment.user ? comment.user.profileAvatar : null
      }));
  
      res.json(formattedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ error: 'Failed to fetch comments' });
    }
  });

  // Endpoint to delete a post
router.delete('/posts/:postId', async (req, res) => {
    const { postId } = req.params;
  
    try {
      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      await post.destroy();
      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ error: 'Failed to delete post' });
    }
  });
  
  
module.exports = router;
