const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
  },
  service: {
    type: String,
    required: true,
    trim: true,
  },
  preferredDate: {
    type: String, // YYYY-MM-DD format
    required: true,
  },
  preferredTime: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: "",
  },
  location: {
    city: String,
    country: String,
    ip: String,
  },
  paymentId: {
    type: String,
    default: null,
  },
  paymentMethod: {
    type: String,
    default: "stripe",
  },
  amountPaid: {
    type: Number,
    default: 0,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: "Pending", // Pending, Pending Payment, Processed, Completed
    enum: ["Pending", "Pending Payment", "Processed", "Completed"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Consultation", consultationSchema);
