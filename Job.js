const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // referring to the User model (company)
    required: true
  },
  company: { type: String, required: true },// optional, keeps the name
  title: { type: String, required: true },
  jobType: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String, required: true },
  postedOn: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model("Job", jobSchema);
