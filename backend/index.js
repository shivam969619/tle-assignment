
// File: index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');    
const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const syncCron = require('./cron/syncCron');
const reminderRoutes = require('./routes/reminderRoutes');
const { getReminderStats, toggleReminder } = require('./controllers/studentController');
const initCron = require('./cron/syncCron');

// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json());
app.use(cors());      

// Routes
app.use('/api/students', studentRoutes);

// 404 and Error Middleware
app.use(notFound);
app.use(errorHandler);
app.use('/api/reminders', reminderRoutes);

// existing toggleReminder:
// PUT /api/students/:id/reminder
// GET  /api/students/:id/reminder-stats
app.get('/api/students/:id/reminder-stats', getReminderStats);
// Start Cron Jobs
// syncCron();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
initCron();