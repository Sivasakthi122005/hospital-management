const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  expiryDate: { type: Date }
});

module.exports = mongoose.model("Medicine", medicineSchema);
