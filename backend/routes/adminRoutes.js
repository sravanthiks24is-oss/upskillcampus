const express = require('express')

const User = require('../models/User')
const Service = require('../models/Service')
const Booking = require('../models/Booking')

const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')

const router = express.Router()

/*
  ADMIN AUTHENTICATION
  Both middleware checks are required:
  1. User must be logged in.
  2. User must have Admin role.
*/

router.use(authMiddleware)
router.use(adminMiddleware)


/*
  GET ALL USERS
*/

router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({
        createdAt: -1,
      })

    res.status(200).json({
      message: 'Users retrieved successfully',
      count: users.length,
      users,
    })
  } catch (error) {
    console.error(
      'Admin get users error:',
      error
    )

    res.status(500).json({
      message:
        'Server error while retrieving users',
    })
  }
})


/*
  GET ALL SERVICES
*/

router.get('/services', async (req, res) => {
  try {
    const services = await Service.find()
      .populate(
        'merchant',
        'name email role'
      )
      .sort({
        createdAt: -1,
      })

    res.status(200).json({
      message: 'Services retrieved successfully',
      count: services.length,
      services,
    })
  } catch (error) {
    console.error(
      'Admin get services error:',
      error
    )

    res.status(500).json({
      message:
        'Server error while retrieving services',
    })
  }
})


/*
  GET ALL BOOKINGS
*/

router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate(
        'customer',
        'name email role'
      )
      .populate(
        {
          path: 'service',
          populate: {
            path: 'merchant',
            select: 'name email role',
          },
        }
      )
      .sort({
        createdAt: -1,
      })

    res.status(200).json({
      message: 'Bookings retrieved successfully',
      count: bookings.length,
      bookings,
    })
  } catch (error) {
    console.error(
      'Admin get bookings error:',
      error
    )

    res.status(500).json({
      message:
        'Server error while retrieving bookings',
    })
  }
})


/*
  ADMIN DASHBOARD SUMMARY
*/

router.get('/summary', async (req, res) => {
  try {
    const userCount =
      await User.countDocuments()

    const serviceCount =
      await Service.countDocuments()

    const bookingCount =
      await Booking.countDocuments()

    res.status(200).json({
      message:
        'Admin dashboard summary retrieved successfully',

      users: userCount,
      services: serviceCount,
      bookings: bookingCount,
    })
  } catch (error) {
    console.error(
      'Admin summary error:',
      error
    )

    res.status(500).json({
      message:
        'Server error while retrieving dashboard summary',
    })
  }
})


module.exports = router