const moment = require('moment');
const User = require('../models/User');
const Badge = require('../models/Badge');

const awardBadge = async (req, res, next) => {
    try {
        const threeYearsAgo = moment().subtract(3, 'years').toDate();//moment
        const users = await User.find({ createdAt: { $lte: threeYearsAgo } }).populate('badges');

        for (const user of users) {
            const hasBadge = user.badges.some(badge => badge.name === '3 Years');
            if (!hasBadge) {
                let badge = await Badge.findOne({ name: '3 Years' });
                if (!badge) {
                    badge = await Badge.create({ name: '3 Years', description: 'Awarded for being active for 3 years' });
                }
                user.badges.push(badge._id);
                await user.save();
                console.log(`Awarded 3 Years badge to user ${user._id}`);
            }
        }
        next();
    } catch (error) {
        console.error('Error in badge middleware:', error);
        next(error);
    }
};

module.exports = awardBadge;
