
const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tag.controller');
const contentFilter = require('../middleware/contentFilter'); 

router.post('/', contentFilter, tagController.createTag);
router.get('/:id', tagController.getTagById);
router.put('/:id', contentFilter, tagController.updateTag);
router.delete('/:id',  tagController.deleteTag);

module.exports = router;
