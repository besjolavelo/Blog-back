const Tag = require('../models/Tag');
const Post = require('../models/Post')
const { StatusCodes } = require('http-status-codes');


exports.createTag = async (req, res) => {
    const { name, description } = req.body;

    try {
        const newTag = new Tag({ name, description });
        const tag = await newTag.save();
        


        res.status(StatusCodes.CREATED).json({ message: 'Tag created successfully', tag });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

exports.getTagById = async (req, res) => {
    try {
        const tag = await Tag.findById(req.params.id);
        if (!tag) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Tag not found' });
        res.status(StatusCodes.OK).json(tag);
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

exports.updateTag = async (req, res) => {
    const { name, description } = req.body;

    try {
        const updatedTag = await Tag.findByIdAndUpdate(
            req.params.id,
            { name, description, updatedAt: Date.now() },
            { new: true }
        );
        if (!updatedTag) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Tag not found' });
        res.status(StatusCodes.OK).json({ message: 'Tag updated successfully', tag: updatedTag });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

exports.deleteTag = async (req, res) => {
    try {
        const tag = await Tag.findByIdAndDelete(req.params.id);
        if (!tag) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Tag not found' });
        res.status(StatusCodes.OK).json({ message: 'Tag deleted successfully' });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};
