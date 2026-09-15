const express = require('express')
const mongoose = require('mongoose')

const Booking = require('../models/Booking')
const Service = require('../models/Service')

const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()


// Convert booking time to 24-hour format
const convertTimeTo24Hour = (time) => {

  // Frontend sends 24-hour format:
  // 09:30
  // 12:00
  // 18:45

  const match24 = time.match(/^(\d{2}):(\d{2})$/)

  if (match24) {

    const hour = Number(match24[1])
    const minute = Number(match24[2])

    if (
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59
    ) {
      return null
    }

    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
  }


  // Also accept 12-hour format:
  // 09:30 AM
  // 12:00 PM

  const match12 = time.match(
    /^(\d{1,2}):(\d{2})\s(AM|PM)$/i
  )

  if (!match12) {
    return null
  }


  let hour = Number(match12[1])
  const minute = Number(match12[2])
  const period = match12[3].toUpperCase()


  if (
    hour < 1 ||
    hour > 12 ||
    minute < 0 ||
    minute > 59
  ) {
    return null
  }


  if (period === 'AM') {

    if (hour === 12) {
      hour = 0
    }

  } else {

    if (hour !== 12) {
      hour += 12
    }

  }


  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}


// Check whether booking date/time is in the past
const isPastBooking = (
  bookingDate,
  bookingTime
) => {

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(
      bookingDate
    )
  ) {
    return true
  }


  const time24 =
    convertTimeTo24Hour(
      bookingTime
    )


  if (!time24) {
    return true
  }


  /*
    Booking times are treated as
    India Standard Time (IST).

    IST = UTC +05:30
  */

  const bookingDateTime =
    new Date(
      `${bookingDate}T${time24}:00+05:30`
    )


  if (
    Number.isNaN(
      bookingDateTime.getTime()
    )
  ) {
    return true
  }


  return bookingDateTime <= new Date()
}


// ===============================
// CUSTOMER ONLY - CREATE BOOKING
// ===============================

router.post(
  '/',
  authMiddleware,
  async (req, res) => {

    try {

      if (
        req.user.role !== 'Customer'
      ) {

        return res.status(403).json({
          message:
            'Only customers can create bookings.',
        })

      }


      const {
        service,
        bookingDate,
        bookingTime,
        address,
        phone,
        latitude,
        longitude,
      } = req.body


      // Check required fields

      if (
        !service ||
        !bookingDate ||
        !bookingTime ||
        !address ||
        !phone
      ) {

        return res.status(400).json({
          message:
            'Please provide all required booking details.',
        })

      }


      // Validate service ID

      if (
        !mongoose.Types.ObjectId.isValid(
          service
        )
      ) {

        return res.status(400).json({
          message:
            'Invalid service ID.',
        })

      }


      // Prevent past bookings

      if (
        isPastBooking(
          bookingDate,
          bookingTime
        )
      ) {

        return res.status(400).json({
          message:
            'You cannot book a service for a past date or past time',
        })

      }


      // Find active service

      const selectedService =
        await Service.findOne({
          _id: service,
          status: 'Active',
        })


      if (!selectedService) {

        return res.status(404).json({
          message:
            'Service not found or inactive.',
        })

      }


      // Create booking

      const booking =
        await Booking.create({

          customer:
            req.user.userId,

          service:
            service,

          bookingDate:
            bookingDate,

          bookingTime:
            bookingTime,

          address:
            address.trim(),

          phone:
            phone.trim(),

          latitude:
            latitude !== undefined &&
            latitude !== null
              ? Number(latitude)
              : undefined,

          longitude:
            longitude !== undefined &&
            longitude !== null
              ? Number(longitude)
              : undefined,

          status:
            'Pending',

        })


      // Return populated booking

      const populatedBooking =
        await Booking.findById(
          booking._id
        )
          .populate(
            'customer',
            'name email role'
          )
          .populate(
            'service',
            'name description category price duration merchant status'
          )


      res.status(201).json({

        message:
          'Booking created successfully',

        booking:
          populatedBooking,

      })


    } catch (error) {

      console.error(
        'Create booking error:',
        error
      )


      res.status(500).json({

        message:
          'Server error while creating booking.',

      })

    }

  }
)


// ===============================
// CUSTOMER ONLY - MY BOOKINGS
// ===============================

router.get(
  '/my-bookings',
  authMiddleware,
  async (req, res) => {

    try {

      if (
        req.user.role !== 'Customer'
      ) {

        return res.status(403).json({
          message:
            'Only customers can view their bookings.',
        })

      }


      const bookings =
        await Booking.find({
          customer:
            req.user.userId,
        })
          .populate(
            'service',
            'name description category price duration merchant status'
          )
          .sort({
            createdAt: -1,
          })


      res.status(200).json({

        message:
          'Bookings retrieved successfully',

        count:
          bookings.length,

        bookings:
          bookings,

      })


    } catch (error) {

      console.error(
        'Get customer bookings error:',
        error
      )


      res.status(500).json({

        message:
          'Server error while retrieving bookings.',

      })

    }

  }
)


// ===============================
// MERCHANT ONLY - BOOKINGS
// ===============================

router.get(
  '/merchant-bookings',
  authMiddleware,
  async (req, res) => {

    try {

      if (
        req.user.role !== 'Merchant'
      ) {

        return res.status(403).json({
          message:
            'Only merchants can view merchant bookings.',
        })

      }


      // Find services owned by merchant

      const merchantServices =
        await Service.find({
          merchant:
            req.user.userId,
        }).select('_id')


      const serviceIds =
        merchantServices.map(
          (item) => item._id
        )


      // Find bookings for merchant services

      const bookings =
        await Booking.find({

          service: {
            $in: serviceIds,
          },

        })
          .populate(
            'customer',
            'name email role'
          )
          .populate(
            'service',
            'name description category price duration merchant status'
          )
          .sort({
            createdAt: -1,
          })


      res.status(200).json({

        message:
          'Merchant bookings retrieved successfully',

        count:
          bookings.length,

        bookings:
          bookings,

      })


    } catch (error) {

      console.error(
        'Get merchant bookings error:',
        error
      )


      res.status(500).json({

        message:
          'Server error while retrieving bookings.',

      })

    }

  }
)


module.exports = router