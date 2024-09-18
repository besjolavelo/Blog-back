
const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },//many to one
    subscribedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },//
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);


SubscriptionSchema.post('findOneAndDelete', async function(doc) {
    try {
        
        await mongoose.model('User').updateOne(
            { _id: doc.subscribedTo },
            { $pull: { subscriptions: doc._id } }
        );

        
        await mongoose.model('User').updateOne(
            { _id: doc.user },
            { $pull: { subscriptions: doc._id } }
        );

        console.log(`Subscription ${doc._id} removed from users.`);
    } catch (error) {
        console.error(`Error during cleanup: ${error.message}`);
    }
});



//user: Refers to the entity that is initiating the subscription. For instance, if User A is subscribing to User B, the user field would hold User A’s ID.
//subscribedTo: Refers to the entity being subscribed to. In the same example, the subscribedTo field would hold User B’s ID.