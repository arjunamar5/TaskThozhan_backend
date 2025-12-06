const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },

  // ✅ New location structure
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
});

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
