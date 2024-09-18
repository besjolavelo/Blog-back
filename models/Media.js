
const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
    url: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },//one to one
    createdAt: { type: Date, default: Date.now }
});

MediaSchema.post('findOneAndDelete', async function(doc) {
    try {
        
        await mongoose.model('Post').updateOne(
            { _id: doc.post },
            { $pull: { media: doc._id } }
        );

        console.log(`Media ${doc._id} removed from post ${doc.post}.`);
    } catch (error) {
        console.error(`Error during cleanup: ${error.message}`);
    }
});

module.exports = mongoose.model('Media', MediaSchema);
