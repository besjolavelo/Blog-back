const Comment = require('../models/Comment');
const { StatusCodes } = require('http-status-codes');
const Post = require('../models/Post');
const User = require('../models/User');



exports.createComment = async (req, res) => {
    const { content, post } = req.body;
    const author = req.user.id; // Get the author's ID from the authenticated user

    if (!content || !post) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Content and post are required' });
    }

    try {
        // Create a new comment
        const newComment = new Comment({
            content,
            post,
            author
        });

        // Save the new comment
        await newComment.save();

        // Update the Post's comments array
        await Post.findByIdAndUpdate(
            post,
            { $push: { comments: newComment._id } },
            { new: true, useFindAndModify: false }
        );

        // Update the User's comments array
        await User.findByIdAndUpdate(
            author,
            { $push: { comments: newComment._id } },
            { new: true, useFindAndModify: false }
        );

        // Populate the comment author details
        const populatedComment = await Comment.findById(newComment._id).populate('author');

        res.status(StatusCodes.CREATED).json({ message: 'Comment created successfully', comment: populatedComment });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};


exports.getCommentById = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id).populate('author');
        if (!comment) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Comment not found' });
        res.status(StatusCodes.OK).json(comment);
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

exports.updateComment = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Content is required' });
    }

    try {
        const updatedComment = await Comment.findByIdAndUpdate(
            id,
            { content, updatedAt: Date.now() },
            { new: true }
        );

        if (!updatedComment) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Comment not found' });
        res.status(StatusCodes.OK).json({ message: 'Comment updated successfully', comment: updatedComment });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);

        if (!comment) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Comment not found' });

        // Optionally remove comment reference from the post and user
        await Post.findByIdAndUpdate(
            comment.post,
            { $pull: { comments: comment._id } },
            { new: true, useFindAndModify: false }
        );

        await User.findByIdAndUpdate(
            comment.author,
            { $pull: { comments: comment._id } },
            { new: true, useFindAndModify: false }
        );

        res.status(StatusCodes.OK).json({ message: 'Comment deleted successfully' });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};
