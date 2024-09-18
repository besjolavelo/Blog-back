
const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/media.controller');

router.post('/', mediaController.createMedia);
router.get('/:id', mediaController.getMediaById);
router.delete('/:id', mediaController.deleteMedia);

module.exports = router;
