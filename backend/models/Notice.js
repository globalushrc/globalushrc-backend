const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 1000,
  },
  priority: {
    type: String,
    enum: ["normal", "high"],
    default: "normal",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notice", noticeSchema);
