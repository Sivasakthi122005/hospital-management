const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  disease: { type: String },
  admittedOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Patient", patientSchema);
