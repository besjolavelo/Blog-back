const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

router.post('/sync', blogController.syncBlogs);

module.exports = router;
