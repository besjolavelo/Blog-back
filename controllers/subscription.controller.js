const Subscription = require('../models/Subscription');
const { StatusCodes } = require('http-status-codes')


exports.createSubscription = async (req, res) => {
    const { user, subscribedTo } = req.body;

    try {
        
        const existingSubscription = await Subscription.findOne({ user, subscribedTo });
        if (existingSubscription) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Subscription already exists' });
        }

        
        const newSubscription = new Subscription({
            user,
            subscribedTo
        });

        const subscription = await newSubscription.save();
        res.status(StatusCodes.CREATED).json({ message: 'Subscription created successfully', subscription });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};


exports.getSubscriptionById = async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id)
            .populate('user')
            .populate('subscribedTo')
            .exec();

        if (!subscription) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Subscription not found' });
        res.status(StatusCodes.OK).json(subscription);
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

exports.updateSubscription = async (req, res) => {
    const { user, subscribedTo } = req.body;

    try {
        const subscription = await Subscription.findByIdAndUpdate(
            req.params.id,
            { user, subscribedTo },
            { new: true }
        );

        if (!subscription) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Subscription not found' });
        res.status(StatusCodes.OK).json({ message: 'Subscription updated successfully', subscription });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

exports.deleteSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Subscription not found' });

      
        await Subscription.findByIdAndDelete(req.params.id);

        res.status(StatusCodes.OK).json({ message: 'Subscription deleted successfully' });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};
