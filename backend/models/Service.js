const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Merchant's GPS location
    latitude: {
      type: Number,
      required: false,
    },

    longitude: {
      type: Number,
      required: false,
    },

    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
)

const Service = mongoose.model('Service', serviceSchema)

module.exports = Service