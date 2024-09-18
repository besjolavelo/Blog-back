const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const contentFilter = require('../middleware/contentFilter');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', authMiddleware, upload.single('image'), contentFilter, postController.createPost);
router.get('/', authMiddleware, postController.getPosts);
router.get('/:id', authMiddleware, postController.getPostById);
router.put('/:id', authMiddleware, contentFilter, postController.updatePost);
router.delete('/:id', authMiddleware, postController.deletePost);
router.get('/user/:userId', authMiddleware, postController.getPostsByUser);
router.post('/:postId/like', authMiddleware, postController.likePost);
router.post('/:postId/unlike', authMiddleware, postController.unlikePost);


module.exports = router;
