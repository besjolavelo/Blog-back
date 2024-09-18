
const { StatusCodes } = require('http-status-codes')
const Media = require('../models/Media');

exports.createMedia = (req, res) => {
    const { url, type, post } = req.body;

    const newMedia = new Media({ url, type, post });

    newMedia.save((err, media) => {
        if (err) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
        res.status(StatusCodes.CREATED).json({ message: 'Media created successfully', media });
    });
};

exports.getMediaById = (req, res) => {
    Media.findById(req.params.id)
        .populate('post')
        .exec((err, media) => {
            if (err) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
            if (!media) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Media not found' });
            res.status(StatusCodes.OK).json(media);
        });
};

exports.deleteMedia = async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);
        if (!media) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Media not found' });

        await media.remove();
        
        res.status(StatusCodes.OK).json({ message: 'Media deleted successfully' });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};
