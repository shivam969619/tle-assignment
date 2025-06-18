// File: controllers/reminderController.js
const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const Submission = require('../models/Submission');
const { sendReminder } = require('../services/emailService');

// @desc    Send reminder emails to students with no subs in last 7 days
// @route   POST /api/reminders/send
// @access  Private (cron or protected)
exports.sendWeeklyReminders = asyncHandler(async (req, res) => {
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // only students who haven’t disabled reminders
  const students = await Student.find({ remindDisabled: false });

  let emailsSent = 0;
  for (const st of students) {
    const recentCount = await Submission.countDocuments({
      student: st._id,
      timestamp: { $gte: cutoff },
    });

    if (recentCount === 0) {
      try {
        await sendReminder(st.email, st.name);
        st.remindCount += 1;
        await st.save();
        emailsSent++;
      } catch (err) {
        console.error(`Failed to send reminder to ${st.email}:`, err);
      }
    }
  }

  res.json({ message: `Sent reminders to ${emailsSent} students.` });
});
