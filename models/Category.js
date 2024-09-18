
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],//many to many
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
CategorySchema.post('findOneAndDelete', async function(doc) {
    try {
       
        await mongoose.model('Post').updateMany(
            { _id: { $in: doc.posts } },
            { $pull: { categories: doc._id } }
        );
        console.log(`Category ${doc._id} and its references removed from posts.`);
    } catch (error) {
        console.error(`Error during cleanup: ${error.message}`);
    }
});
module.exports = mongoose.model('Category', CategorySchema);
