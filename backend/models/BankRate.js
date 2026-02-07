const mongoose = require("mongoose");

const BankRateSchema = new mongoose.Schema({
  currency: { type: String, required: true },
  symbol: { type: String },
  unit: { type: Number, default: 1 },
  buy: { type: Number, required: true },
  sell: { type: Number, required: true },
  isPublished: { type: Boolean, default: false },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("BankRate", BankRateSchema);
