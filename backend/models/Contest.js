// File: models/Contest.js
const { Schema, model } = require('mongoose');

const ContestSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  contestId: { type: Number, required: true },
  date: { type: Date, required: true },
  oldRating: Number,
  newRating: Number,
  rank: Number,
  delta: Number,
  unsolved:Number,
});

module.exports = model('Contest', ContestSchema);