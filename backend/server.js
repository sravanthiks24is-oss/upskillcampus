const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/authRoutes')
const serviceRoutes = require('./routes/serviceRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const adminRoutes = require('./routes/adminRoutes')

const authMiddleware = require('./middleware/authMiddleware')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/admin', adminRoutes)

app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'You have accessed a protected route!',
    user: req.user,
  })
})

app.get('/', (req, res) => {
  res.json({
    message: 'ServiceHub backend is running successfully!',
  })
})

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully!')

    const PORT = process.env.PORT || 5000

    app.listen(PORT, () => {
      console.log(
        `ServiceHub backend running on http://localhost:${PORT}`
      )
    })
  })
  .catch((error) => {
    console.error('MongoDB connection failed:')
    console.error(error.message)
  })