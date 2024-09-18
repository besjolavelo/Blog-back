const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    //media: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }],
    image: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    publishedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

});

PostSchema.post('findOneAndDelete', async function(doc) {
    try {
        await mongoose.model('Comment').deleteMany({ _id: { $in: doc.comments } });
        await mongoose.model('Like').deleteMany({ _id: { $in: doc.likes } });
        await mongoose.model('Media').deleteMany({ _id: { $in: doc.media } });
        console.log(`Post ${doc._id} and related data removed.`);
    } catch (error) {
        console.error(`Error during cleanup: ${error.message}`);
    }
});

module.exports = mongoose.model('Post', PostSchema);
