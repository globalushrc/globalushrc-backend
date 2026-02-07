const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  salary: { type: String },
  requirements: { type: String },
  isPublished: { type: Boolean, default: false },
  datePosted: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Job", JobSchema);
