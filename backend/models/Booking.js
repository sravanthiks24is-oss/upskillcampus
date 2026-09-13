const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },

    bookingDate: {
      type: String,
      required: true,
    },

    bookingTime: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    // Customer GPS location
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
      enum: [
        'Pending',
        'Confirmed',
        'Completed',
        'Cancelled',
      ],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
)

const Booking = mongoose.model('Booking', bookingSchema)

module.exports = Booking