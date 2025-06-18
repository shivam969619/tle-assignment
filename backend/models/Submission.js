// File: models/Submission.js
const { Schema, model } = require('mongoose');

const SubmissionSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  problemId: { type: String, required: true },
  contestId: Number,
  rating: Number,
  timestamp: { type: Date, required: true },
});

module.exports = model('Submission', SubmissionSchema);