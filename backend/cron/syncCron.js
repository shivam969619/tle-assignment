// File: cron/syncCron.js
const cron = require('node-cron');
const Student = require('../models/Student');
const Submission = require('../models/Submission');
const fetchCF = require('../services/fetchCF');
const { sendReminder } = require('../services/emailService');

module.exports = function initCron() {
  // schedule according to CRON_SCHEDULE in .env (e.g. "0 2 * * *")
  cron.schedule(process.env.CRON_SCHEDULE, async () => {
    console.log(`[${new Date().toISOString()}] Starting daily sync & reminders`);

    try {
      const students = await Student.find();
      const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      for (let st of students) {
        try {
          // 1) fetch & update CF data (rating, submissions, contests, etc.)
          await fetchCF(st);

          // 2) skip if reminders are disabled
          if (st.remindDisabled) continue;

          // 3) check for any submission in the last 7 days
          const recentSub = await Submission.findOne({
            student: st._id,
            timestamp: { $gte: cutoff },
          });

          // 4) if none, send reminder email & increment counter
          if (!recentSub) {
            await sendReminder(st.email, st.name);
            st.remindCount = (st.remindCount || 0) + 1;
            await st.save();
            console.log(` → Reminder sent to ${st.handle} (${st.email}), total reminders: ${st.remindCount}`);
          }
        } catch (innerErr) {
          console.error(`Error processing student ${st.handle}:`, innerErr);
        }
      }

      console.log(`[${new Date().toISOString()}] Daily sync & reminders complete`);
    } catch (err) {
      console.error('Cron job failed:', err);
    }
  });
};
