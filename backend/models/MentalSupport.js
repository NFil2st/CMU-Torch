const mongoose = require('mongoose');

const mentalSupportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: ['meditation', 'affirmation', 'breathing', 'gratitude', 'journaling', 'therapy'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    duration: {
      type: Number,
      default: 0,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    audioUrl: {
      type: String,
      default: null,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    moodBefore: {
      type: Number,
      min: 1,
      max: 5,
    },
    moodAfter: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
      default: null,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

mentalSupportSchema.index({ userId: 1, category: 1, createdAt: -1 });

module.exports = mongoose.model('MentalSupport', mentalSupportSchema);