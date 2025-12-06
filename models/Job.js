const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  salary: Number,
  jobType: String,
  status: {
    type: String,
    default: 'Open'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employer', // This links the job to the employer
    required: true
  },
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
