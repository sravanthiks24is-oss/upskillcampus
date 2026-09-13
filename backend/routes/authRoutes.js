const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

const router = express.Router()

// ===============================
// CUSTOMER / MERCHANT REGISTRATION
// ===============================
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
    } = req.body

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required',
      })
    }

    // Only Customer and Merchant can register
    const userRole = role || 'Customer'

    if (!['Customer', 'Merchant'].includes(userRole)) {
      return res.status(400).json({
        message: 'Invalid role',
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    })

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists',
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    )

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: userRole,
    })

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)

    res.status(500).json({
      message: 'Registration failed',
      error: error.message,
    })
  }
})

// ===============================
// LOGIN
// ===============================
router.post('/login', async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      })
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase(),
    })

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    )

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    )

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)

    res.status(500).json({
      message: 'Login failed',
      error: error.message,
    })
  }
})

module.exports = router