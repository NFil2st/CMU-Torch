const mongoose = require('mongoose');

const moodLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    moodScore: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    emotion: {
      type: String,
      enum: ['very_sad', 'sad', 'neutral', 'happy', 'very_happy'],
      required: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    activities: {
      type: [String],
      default: [],
    },
    energyLevel: {
      type: Number,
      min: 1,
      max: 5,
    },
    sleepQuality: {
      type: Number,
      min: 1,
      max: 5,
    },
    tags: {
      type: [String],
      default: [],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for efficient querying
moodLogSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('MoodLog', moodLogSchema);