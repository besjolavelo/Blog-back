
const express = require('express');
const router = express.Router();
const likeController = require('../controllers/like.controller');

router.post('/', likeController.createLike);
router.get('/:id', likeController.getLikeById);
router.delete('/:id', likeController.deleteLike);

module.exports = router;
