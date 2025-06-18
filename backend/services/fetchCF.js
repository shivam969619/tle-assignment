// File: services/fetchCF.js
const axios = require('axios');
const Contest = require('../models/Contest');
const Submission = require('../models/Submission');

module.exports = async function fetchCF(student) {
  const url = `${process.env.CF_API_URL}/user.status?handle=${student.handle}`;
  const { data } = await axios.get(url);
  if (data.status !== 'OK') return;

  // Parse submissions
  const subs = data.result;
  // (Upsert logic omitted for brevity)

  // Example: update lastSynced
  student.lastSynced = new Date();
  await student.save();
};