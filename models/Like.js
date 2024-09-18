
const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },//many to one
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },//many to one
    createdAt: { type: Date, default: Date.now }
});
LikeSchema.post('findOneAndDelete', async function(doc) {
    try {
       
        await mongoose.model('Post').updateOne(
            { _id: doc.post },
            { $pull: { likes: doc._id } }
        );

        
        // await mongoose.model('User').updateOne(
        //     { _id: doc.user },
        //     { $pull: { likes: doc._id } }
        // );

        console.log(`Like ${doc._id} removed from post ${doc.post}.`);
    } catch (error) {
        console.error(`Error during cleanup: ${error.message}`);
    }
});
module.exports = mongoose.model('Like', LikeSchema);
