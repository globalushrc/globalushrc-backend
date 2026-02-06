const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 200,
  },
  description: {
    type: String,
    default: "",
  },
  filename: {
    type: String,
    default: null,
  },
  url: {
    type: String,
    default: null,
  },
  type: {
    type: String,
    default: "text/plain",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("News", newsSchema);
