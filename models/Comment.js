
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },//many to one
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },//many to one
    createdAt: { type: Date, default: Date.now }
});

CommentSchema.post('findOneAndDelete', async function(doc) {
    try {
        
        await mongoose.model('Post').updateOne(
            { _id: doc.post },
            { $pull: { comments: doc._id } }
        );
        // await mongoose.model('User').updateOne(
        //     { _id: doc.author },
        //     { $pull: { comments: doc._id } }
        // );

        console.log(`Comment ${doc._id} removed from post ${doc.post}.`);
    } catch (error) {
        console.error(`Error during cleanup: ${error.message}`);
    }
});

module.exports = mongoose.model('Comment', CommentSchema);
