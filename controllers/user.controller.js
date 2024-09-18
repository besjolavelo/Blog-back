const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');  
const Comment = require('../models/Comment');   
const fs = require('fs');  
const transporter = require('../services/emailService')
const nodemailer = require('nodemailer')

exports.createUser = async (req, res) => {
    const { username, email, passwordHash, dateOfBirth, bio, location } = req.body;
    const profilePicture = req.file ? req.file.filename : null;
  
    try {
      // Step 1: Create the user
      const newUser = new User({
        username,
        email,
        passwordHash,
        bio,
        location,
        dateOfBirth,
        profilePicture,
      });
  
      const verificationCode = Math.floor(100000 + Math.random() * 900000); 
  
      newUser.verificationCode = verificationCode;
      await newUser.save();
  
      const mailOptions = {
        from: 'besjolavelo@gmail.com', 
        to: newUser.email,            
        subject: 'Email Verification Code',
        text: `Your verification code is: ${verificationCode}`,
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(StatusCodes.CREATED).json({
        message: 'User created successfully. Please verify your email.',
        user: newUser,
      });
    } catch (err) {
      console.error(err); // Log the error for debugging
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
  };
 
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      console.log('Login attempt:', { email, password });  
  
     
      const user = await User.findOne({ email: email });
  
      if (!user) {
        console.log('User not found:', email);
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
      }
  
      const isMatch = await user.comparePassword(password);
  
      if (!isMatch) {
        console.log('Invalid credentials:', email);
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });
      }
   
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  
      console.log('Login successful:', email);
      res.status(StatusCodes.OK).json({ message: 'Login successful', token });
    } catch (err) {
      console.error('Error in loginUser:', err.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
  };

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('posts')
            .populate('comments')
            .populate('likes')
            .populate('subscriptions')
            .exec();

       
        if (!user) return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        console.log('User:', user);
        res.status(StatusCodes.OK).json(user);
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};
 
exports.updateUser = async (req, res) => {
    const { username, email, bio, location } = req.body;
    const userId = req.params.id;

    try {
        if (req.user.id !== userId) return res.status(StatusCodes.FORBIDDEN).json({ message: 'Not authorized' });

        const user = await User.findByIdAndUpdate(userId,
            { username, email, bio, location, updatedAt: Date.now() },
            { new: true }
        );

        if (!user) return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        res.status(StatusCodes.OK).json({ message: 'User updated successfully', user });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};
 
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });

        res.status(StatusCodes.OK).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};
 
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .populate('posts')
            .populate('comments')
            .populate('likes')
            .populate('subscriptions')
            .exec();

        res.status(StatusCodes.OK).json(users);
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};


exports.getUserProfile = async (req, res) => {
    try {
        
        const user = await User.findById(req.user.id).select('-password'); 

        if (!user) return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });

        res.status(StatusCodes.OK).json(user);
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};
 
exports.updateUserProfile = async (req, res) => {
    const { username, email, bio, location } = req.body;
    const userId = req.user.id;
    const profilePicture = req.file ? req.file.filename : null;

    try {
       
        if (!username && !email && !bio && !location && !profilePicture) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No fields to update' });
        }

        
        const updateFields = { username, email, bio, location, profilePicture, updatedAt: Date.now() };
        const user = await User.findByIdAndUpdate(userId, updateFields, { new: true, runValidators: true });

        if (!user) return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        res.status(StatusCodes.OK).json({ message: 'Profile updated successfully', user });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};
exports.deleteUserProfile = async (req, res) => {
    const userId = req.user.id;  

    try {
      
        const user = await User.findById(userId);

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        }

      
        await Post.deleteMany({ author: userId });

 
        await Comment.deleteMany({ author: userId });

        
        if (user.profilePicture) {
            const filePath = `./uploads/profilePictures/${user.profilePicture}`;
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Error deleting profile picture:", err);
                }
            });
        }
 
        await User.findByIdAndDelete(userId);

        res.status(StatusCodes.OK).json({ message: 'Account and associated data deleted successfully' });
    } catch (err) {
        console.error("Error deleting user account:", err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to delete account. Please try again.' });
    }
};
exports.verifyEmail = async (req, res) => {
    const { email, code } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
  
      if (user.verificationCode !== code) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid verification code' });
      }
  
      user.isVerified = true;
      user.verificationCode = null; // Clear the verification code
      await user.save();
  
      res.status(StatusCodes.OK).json({ message: 'Email verified successfully' });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};