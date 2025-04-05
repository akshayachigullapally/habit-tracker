const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const authRoutes = require('./auth');
const habitRoutes = require('./habits');
const userRoutes = require('./users');
const achievementRoutes = require('./achievements');
const notificationRoutes = require('./notifications');
const communityRoutes = require('./community');

// For now, a simple test route to verify it works
router.get('/test', (req, res) => {
  res.json({ message: 'Users route is working' });
});

module.exports = router;