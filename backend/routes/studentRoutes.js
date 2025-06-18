// File: routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/studentController');

// List all students, add new student
router.route('/')
  .get(ctrl.getAllStudents)
  .post(ctrl.addStudent);

// Export students as CSV
router.get('/export', ctrl.exportCSV);

// Operations on a single student
router.route('/:id')
  .get(ctrl.getStudent)
  .put(ctrl.updateStudent)
  .delete(ctrl.deleteStudent);

// Additional endpoints
router.get('/:id/contests', ctrl.getContestHistory);
router.get('/:id/problem-data', ctrl.getProblemData);
router.get('/:id/last-updated', ctrl.getLastSynced);
router.put('/:id/reminder', ctrl.toggleReminder);

module.exports = router;
