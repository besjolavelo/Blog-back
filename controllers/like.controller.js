const { StatusCodes } = require('http-status-codes')
const Like = require('../models/Like');

exports.createLike = (req, res) => {
    const { user, post } = req.body;

    const newLike = new Like({ user, post });

    newLike.save((err, like) => {
        if (err) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
        res.status(StatusCodes.CREATED).json({ message: 'Like created successfully', like });
    });
};

exports.getLikeById = (req, res) => {
    Like.findById(req.params.id)
        .populate('user')
        .populate('post')
        .exec((err, like) => {
            if (err) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
            if (!like) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Like not found' });
            res.status(StatusCodes.OK).json(like);
        });
};

exports.deleteLike = (req, res) => {
    Like.findByIdAndDelete(req.params.id, (err, like) => {
        if (err) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
        if (!like) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Like not found' });
        res.status(StatusCodes.OK).json({ message: 'Like deleted successfully' });
    });
};
