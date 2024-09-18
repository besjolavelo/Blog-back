const contentFilter = (req, res, next) => {
    const { title, content, comment, description } = req.body; 

    const violencePattern = /violence|assault|murder|fight|kill|war|shoot|attack/i;
    const eroticPattern = /nude|adult|erotic|xxx/i;
    const discriminationPattern = /white|black/i;

    const containsInappropriateContent = (text) => {
        return text && (violencePattern.test(text) || eroticPattern.test(text) || discriminationPattern.test(text));
    };

    console.log('Incoming data:', { title, content, comment, description });

    
    if ((title && containsInappropriateContent(title)) || (content && containsInappropriateContent(content))) {
        console.log('Inappropriate content detected in post title or content.');
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Your post contains inappropriate content' });
    }

   
    if (comment && containsInappropriateContent(comment)) {
        console.log('Inappropriate content detected in comment.');
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Your comment contains inappropriate content' });
    }


    if (description && containsInappropriateContent(description)) {
        console.log('Inappropriate content detected in tag description.');
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Your tag description contains inappropriate content' });
    }

    next();
};

module.exports = contentFilter;
