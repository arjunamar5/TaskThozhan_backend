const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  companyName: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true }

});

// Fix model name
const Employer = mongoose.model("Employer", employerSchema);

module.exports = Employer;
