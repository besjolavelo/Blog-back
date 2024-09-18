const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment'); 
const { StatusCodes } = require('http-status-codes');
 
exports.createPost = async (req, res) => {
    const { title, content } = req.body;
    const author = req.user.id;
    const image = req.file ? req.file.filename : null;

    if (!title || !content) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Title and content are required' });
    }

    try {
        const newPost = new Post({ title, content, author, image });
        await newPost.save();

        
        await User.findByIdAndUpdate(
            author,
            { $push: { posts: newPost._id } },
            { new: true, useFindAndModify: false }
        );

        res.status(StatusCodes.CREATED).json({ message: 'Post created successfully', post: newPost });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};


exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author')
            .populate({
                path: 'comments',
                populate: { path: 'author' }
            });
            console.log('Posts:', posts);
        res.status(StatusCodes.OK).json(posts);
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};


exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author')
            .populate({
                path: 'comments',
                populate: { path: 'author' }
            });
        if (!post) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Post not found' });
        res.status(StatusCodes.OK).json(post);
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};


exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id; 

    try {
        const post = await Post.findById(id);

        if (!post) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Post not found' });
        
        if (post.author.toString() !== userId) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: 'Unauthorized' });
        }

        const updatedPost = await Post.findByIdAndUpdate(id, 
            { title, content, updatedAt: Date.now() }, 
            { new: true }
        );

        res.status(StatusCodes.OK).json({ message: 'Post updated successfully', post: updatedPost });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

exports.deletePost = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; 

    try {
        const post = await Post.findById(id);

        if (!post) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Post not found' });

        if (post.author.toString() !== userId) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: 'Unauthorized' });
        }
 
        await Comment.deleteMany({ post: id });

        await Post.findByIdAndDelete(id);

        await User.findByIdAndUpdate(
            post.author,
            { $pull: { posts: post._id } },
            { new: true, useFindAndModify: false }
        );

        res.status(StatusCodes.OK).json({ message: 'Post and its comments deleted successfully' });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};
 
exports.getPostsByUser = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const userPosts = await Post.find({ author: userId })
        .populate('author')   
        .populate({
          path: 'comments',
          populate: { path: 'author' }
        });
  
      if (!userPosts) {
        return res.status(404).json({ message: 'No posts found for this user.' });
      }
  
      res.status(200).json(userPosts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  exports.likePost = async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user.id;
  
    try {
        const post = await Post.findById(req.params.postId);
        const userId = req.user.id; 
    
        if (!post.likes.includes(userId)) {
          post.likes.push(userId);
          await post.save();
          res.status(200).json({ message: 'Post liked', post });
        } else {
          res.status(400).json({ message: 'Post already liked' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Error liking post', error });
      }
    };
  exports.unlikePost = async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user.id;
  
    try {
        const post = await Post.findById(req.params.postId);
        const userId = req.user.id;  
    
        if (post.likes.includes(userId)) {
          post.likes = post.likes.filter(id => id !== userId);
          await post.save();
          res.status(200).json({ message: 'Post unliked', post });
        } else {
          res.status(400).json({ message: 'Post not liked' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Error unliking post', error });
      }
    };