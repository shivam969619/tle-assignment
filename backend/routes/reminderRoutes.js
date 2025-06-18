// File: routes/reminderRoutes.js
const express = require('express');
const { sendWeeklyReminders } = require('../controllers/reminderController');
const router = express.Router();

// Protect this route in production (e.g. require an API key or JWT)
router.post('/send', sendWeeklyReminders);

module.exports = router;
