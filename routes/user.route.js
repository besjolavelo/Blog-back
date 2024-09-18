const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller'); 
const checkAge = require('../middleware/checkAge')
const badgeMiddleware = require('../middleware/badgeMiddleware')
const authMiddleware = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware');


router.post('/register',  upload.single('profilePicture'), badgeMiddleware, checkAge, userController.createUser); 
router.post('/login', userController.loginUser); 
router.get('/profile/:id',  authMiddleware,userController.getUserById); 
router.put('/profile/:id', authMiddleware, badgeMiddleware, checkAge, userController.updateUser); 
router.delete('/profile/:id', authMiddleware, userController.deleteUser); 
router.get('/users',  userController.getAllUsers);
router.get('/my-profile', authMiddleware, userController.getUserProfile,);
router.delete('/my-profile', authMiddleware,userController.deleteUserProfile);
router.put('/my-profile', authMiddleware, upload.single('profilePicture'), userController.updateUserProfile);
router.post('/verify-email', userController.verifyEmail);
module.exports = router;
