const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /.+\@.+\..+/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    age: {
      type: Number,
      min: 1,
      max: 150,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    healthGoals: {
      type: [String],
      default: [],
    },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
      default: 'moderate',
    },
    dietaryPreferences: {
      type: [String],
      default: [],
    },
    medicalConditions: {
      type: [String],
      default: [],
    },
    profilePicture: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);