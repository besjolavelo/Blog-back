
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const contentFilter = require('../middleware/contentFilter');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/',authMiddleware, contentFilter, commentController.createComment);
router.get('/:id', commentController.getCommentById);

router.put('/:id', authMiddleware, contentFilter, commentController.updateComment);
router.delete('/:id', authMiddleware, commentController.deleteComment);


module.exports = router;
