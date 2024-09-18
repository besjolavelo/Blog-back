const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    verificationCode: { type: String },  // Field for verification code
    isVerified: { type: Boolean, default: false } ,
    dateOfBirth: { type: Date, required: true },
    bio: { type: String },
    location: { type: String },
    profilePicture: { type: String },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], // one to many relationship
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // one-to-many relationship
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // one-to-many relationship
    subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' }], // one-to-many relationship
    badges: [{type: mongoose.Schema.Types.ObjectId, ref: 'Bages'}],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function(next) {
    if (this.isModified('passwordHash') || this.isNew) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
        } catch (error) {
            return next(error);
        }
    }
    next();
});

UserSchema.methods.comparePassword = async function(userPassword) {
    return bcrypt.compare(userPassword, this.passwordHash);
};


UserSchema.methods.calculateAge = function() {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
};
UserSchema.post('findOneAndDelete', async function(doc) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        await mongoose.model('Post').deleteMany({ author: doc._id },{session});
        await mongoose.model('Comment').deleteMany({ author: doc._id },{session});
        await mongoose.model('Like').deleteMany({ user: doc._id },{session});
        await mongoose.model('Subscription').deleteMany({ user: doc._id },{session});

        console.log(`User ${doc._id} and related data removed.`);
        await session.commitTransaction();
        session.endSession();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(`Error during cleanup: ${error.message}`);
    }
});

module.exports = mongoose.model('User', UserSchema); 


