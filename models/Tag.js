
const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],//many to many with posts
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

TagSchema.post('findOneAndDelete', async function(doc) {
    try {
       
        await mongoose.model('Post').updateMany(
            { _id: { $in: doc.posts } },
            { $pull: { tags: doc._id } }
        );

        console.log(`Tag ${doc._id} and its references removed from posts.`);
    } catch (error) {
        console.error(`Error during cleanup: ${error.message}`);
    }
});

module.exports = mongoose.model('Tag', TagSchema);
