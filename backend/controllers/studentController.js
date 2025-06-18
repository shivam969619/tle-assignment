// File: controllers/studentController.js
const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const Contest = require('../models/Contest');
const Submission = require('../models/Submission');
const csv = require('csv-express');
const fetchCF = require('../services/fetchCF');

// @desc    Get all students
// @route   GET /api/students
exports.getAllStudents = asyncHandler(async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// @desc    Create student
// @route   POST /api/students

// File: controllers/studentController.js
const axios = require('axios');


//----------------------------------------------


// @desc    Add a new student and sync Codeforces rating data
// @route   POST /api/students
// @access  Public or Protected (as per your auth setup)

exports.addStudent = asyncHandler(async (req, res) => {
  const { name, email, phone, handle } = req.body;
  if (!name || !email || !handle) {
    return res.status(400).json({ message: 'Name, email and handle are required' });
  }

  const exists = await Student.findOne({ $or: [{ email }, { handle }] });
  if (exists) {
    return res.status(409).json({ message: 'Student with given email or handle already exists' });
  }

  // 1) Fetch & validate user info
  const { data: userInfo } = await axios.get(
    'https://codeforces.com/api/user.info',
    { params: { handles: handle, checkHistoricHandles: false } }
  );
  if (userInfo.status !== 'OK' || !userInfo.result.length) {
    return res.status(404).json({ message: 'Codeforces handle not found' });
  }
  const cfUser = userInfo.result[0];

  // 2) Create Student
  const student = await Student.create({
    name,
    email,
    phone,
    handle,
    currentRating: cfUser.rating || 0,
    maxRating: cfUser.maxRating || 0,
    lastSynced: Date.now(),
  });

  // 3) Fetch and save submissions
  const subsCount = 10000;
  const { data: subsData } = await axios.get(
    'https://codeforces.com/api/user.status',
    { params: { handle, from: 1, count: subsCount } }
  );
  let subsToInsert = [];
  if (subsData.status === 'OK' && subsData.result.length) {
    subsToInsert = subsData.result.map((s) => ({
      student: student._id,
      problemId: `${s.contestId}_${s.problem.index}`,
      contestId: s.contestId,
      rating: s.problem.rating || null,
      verdict: s.verdict,
      timestamp: new Date(s.creationTimeSeconds * 1000),
    }));
    await Submission.insertMany(subsToInsert);
  }

  // 4) Calculate unsolved per contest
  const unsolvedMap = {};
  if (subsToInsert.length) {
    // Group submissions by contest and problem
    const grouped = subsToInsert.reduce((acc, sub) => {
      acc[sub.contestId] = acc[sub.contestId] || {};
      acc[sub.contestId][sub.problemId] = acc[sub.contestId][sub.problemId] || [];
      acc[sub.contestId][sub.problemId].push(sub.verdict);
      return acc;
    }, {});
    // For each contest, count problems never solved (no 'OK')
    Object.keys(grouped).forEach((cid) => {
      const problems = grouped[cid];
      let count = 0;
      Object.values(problems).forEach((verdicts) => {
        if (!verdicts.includes('OK')) count++;
      });
      unsolvedMap[cid] = count;
    });
  }

  // 5) Fetch and save contest rating changes
  const { data: ratingData } = await axios.get(
    'https://codeforces.com/api/user.rating',
    { params: { handle } }
  );
  if (ratingData.status === 'OK' && ratingData.result.length) {
    const contestsToInsert = ratingData.result.map((c) => ({
      student: student._id,
      contestId: c.contestId,
      date: new Date(c.ratingUpdateTimeSeconds * 1000),
      oldRating: c.oldRating,
      newRating: c.newRating,
      rank: c.rank,
      delta: c.newRating - c.oldRating,
      unsolved: unsolvedMap[c.contestId] || 0,
    }));
    await Contest.insertMany(contestsToInsert);
  }

  // 6) Respond with created student
  res.status(201).json(student);
});




//-------------------------

// @desc    Get student by ID
// @route   GET /api/students/:id

exports.getStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }
  res.json(student);
});

// @desc    Update student
// @route   PUT /api/students/:id
exports.updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) throw new Error('Student not found');

  Object.assign(student, req.body);
  await student.save();

  if (req.body.handle) {
    // immediate refetch
    await fetchCF(student);
  }
  res.json(student);
});

// @desc    Delete student
// @route   DELETE /api/students/:id
// exports.deleteStudent = asyncHandler(async (req, res) => {
//   await Student.findByIdAndDelete(req.params.id);
//   res.json({ message: 'Student removed' });
// });
exports.deleteStudent = asyncHandler(async (req, res) => {
  const studentId = req.params.id;

  // 1) Remove all contests for this student
  await Contest.deleteMany({ student: studentId });

  // 2) Remove all submissions for this student
  await Submission.deleteMany({ student: studentId });

  // 3) Finally delete the student record itself
  const student = await Student.findByIdAndDelete(studentId);
  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  res.json({ message: 'Student and all related contests & submissions removed' });
});
// @desc    Export CSV
// @route   GET /api/students/export
exports.exportCSV = asyncHandler(async (req, res) => {
  const students = await Student.find().lean();
  res.setHeader('Content-Type', 'text/csv');
  res.csv(students, true);
});

// @desc    Get contest history
// @route   GET /api/students/:id/contests
exports.getContestHistory = asyncHandler(async (req, res) => {
  const days = +req.query.days || 365;
  const cutoff = new Date(Date.now() - days * 24*60*60*1000);
  const contests = await Contest.find({ student: req.params.id, date: { $gte: cutoff } }).sort('date');
  res.json(contests);
});

// @desc    Get problem solving data
// @route   GET /api/students/:id/problem-data
exports.getProblemData = asyncHandler(async (req, res) => {
  const days = +req.query.days || 90;
  const cutoff = new Date(Date.now() - days * 24*60*60*1000);
  const subs = await Submission.find({ student: req.params.id, timestamp: { $gte: cutoff } });

  const total = subs.length;
  const avgPerDay = +(total / days).toFixed(2);
  const ratings = subs.map(s => s.rating).filter(r => r != null);
  const avgRating = ratings.length ? +(ratings.reduce((a,b)=>a+b)/ratings.length).toFixed(2) : 0;
  const hardest = subs.reduce((h, s) => s.rating > (h.rating||0) ? s : h, {});

  const buckets = subs.reduce((acc, s) => {
    const key = Math.floor((s.rating||0)/100)*100;
    acc[key] = (acc[key]||0) + 1;
    return acc;
  }, {});

  res.json({ total, avgPerDay, avgRating, hardest, buckets });
});

// @desc    Get last synced timestamp
// @route   GET /api/students/:id/last-updated
exports.getLastSynced = asyncHandler(async (req, res) => {
  const { lastSynced } = await Student.findById(req.params.id).select('lastSynced');
  res.json({ lastSynced });
});

// @desc    Toggle reminder emails
// @route   PUT /api/students/:id/reminder

exports.toggleReminder = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  student.remindDisabled = !!req.body.disabled;
  await student.save();
  res.json(student);
});
exports.getReminderStats = asyncHandler(async (req, res) => {
  const st = await Student.findById(req.params.id).select('remindCount remindDisabled');
  if (!st) {
    return res.status(404).json({ message: 'Student not found' });
  }
  res.json({
    remindCount: st.remindCount,
    remindDisabled: st.remindDisabled,
  });
});