
const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscription.controller');

router.post('/', subscriptionController.createSubscription);
router.get('/:id', subscriptionController.getSubscriptionById);
router.delete('/:id', subscriptionController.deleteSubscription);

module.exports = router;
