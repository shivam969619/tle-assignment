const nodemailer = require('nodemailer');

// pull in the vars you just set
const transporter = nodemailer.createTransport({
  host:     process.env.SMTP_HOST,
  port:     Number(process.env.SMTP_PORT),
  secure:   process.env.SMTP_SECURE === 'true',   // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


exports.sendReminder = (to, name) => {
  return transporter.sendMail({
    from: `"Your App" <${process.env.SMTP_FROM}>`,
    to,
    subject: "📝 Time to get back to problem solving!",
    text: `Hi ${name},

We noticed you haven’t made any submissions in the last week on Codeforces. Let’s keep that streak going! 🚀

— Your CodePractice Team`,
  });
};
