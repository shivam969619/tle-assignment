// File: models/Student.js
const { Schema, model } = require('mongoose');

const StudentSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  handle: { type: String, required: true, unique: true },
  currentRating: { type: Number, default: 0 },
  maxRating: { type: Number, default: 0 },
  lastSynced: { type: Date, default: null },
  remindCount: { type: Number, default: 0 },
  remindDisabled: { type: Boolean, default: false },
  
}, { timestamps: true });

module.exports = model('Student', StudentSchema);