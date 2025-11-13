const mongoose = require('mongoose');

const foodRecommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    foodName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    servingSize: {
      type: String,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
      min: 0,
    },
    protein: {
      type: Number,
      min: 0,
    },
    carbs: {
      type: Number,
      min: 0,
    },
    fat: {
      type: Number,
      min: 0,
    },
    fiber: {
      type: Number,
      min: 0,
    },
    ingredients: {
      type: [String],
      default: [],
    },
    recipeUrl: {
      type: String,
      default: null,
    },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      required: true,
    },
    category: {
      type: String,
      enum: ['vegetarian', 'vegan', 'keto', 'high_protein', 'low_calorie', 'balanced'],
      default: 'balanced',
    },
    allergies: {
      type: [String],
      default: [],
    },
    prepTime: {
      type: Number,
      default: 0,
    },
    consumed: {
      type: Boolean,
      default: false,
    },
    consumedAt: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

foodRecommendationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('FoodRecommendation', foodRecommendationSchema);