const User = require('../models/User');
const mongoose = require('mongoose');
const moment = require('moment');
const { StatusCodes } = require('http-status-codes')

const MIN_AGE = 16;

const checkAge = async (req, res, next) => {
    const { dateOfBirth, userId } = req.body;
    const userIdParam = req.params.id;

   
    if (!dateOfBirth && !userId && !userIdParam) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Date of birth, User ID, or User ID parameter is required' });
    }
    try {
        let user;

        if (userId || userIdParam) {
            const id = userId || userIdParam;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid User ID format' });
            }

            user = await User.findById(id);
            if (!user) return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });

            const birthDate = moment(user.dateOfBirth); 
            const age = moment().diff(birthDate, 'years');
            if (age < MIN_AGE) return res.status(403).json({ message: `You must be ${MIN_AGE} or older.` });
        } 
        
        else if (dateOfBirth) {
            const birthDate = moment(dateOfBirth, 'YYYY-MM-DD'); 
            const age = moment().diff(birthDate, 'years');
            if (age < MIN_AGE) return res.status(403).json({ message: `You must be ${MIN_AGE} or older to register.` });
        }

        next();
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

module.exports = checkAge;
