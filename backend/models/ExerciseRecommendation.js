const mongoose = require('mongoose');

const exerciseRecommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    exerciseName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 5,
    },
    intensity: {
      type: String,
      enum: ['low', 'moderate', 'high'],
      default: 'moderate',
    },
    caloriesBurned: {
      type: Number,
      min: 0,
    },
    instructions: {
      type: [String],
      default: [],
    },
    equipmentNeeded: {
      type: [String],
      default: [],
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    videoUrl: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      enum: ['cardio', 'strength', 'flexibility', 'balance', 'sports'],
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

exerciseRecommendationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ExerciseRecommendation', exerciseRecommendationSchema);