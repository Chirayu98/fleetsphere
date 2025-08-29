const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['company', 'delivery'],
    required: true
  },

  vehicle: String,
  age: Number,
  dob: String,
  birthplace: String,
  numberPlate: String,
  license: String,
  experience: [String],

  // Optional: for social or business networking
  connections: [
    {
      name: String,
      role: String
    }
  ]
});

// Avoid OverwriteModelError
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
