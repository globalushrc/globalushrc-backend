const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
