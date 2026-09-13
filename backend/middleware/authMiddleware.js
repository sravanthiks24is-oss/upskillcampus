const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Access denied. No token provided.',
      })
    }

    // Extract token
    const token = authHeader.split(' ')[1]

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    // Store decoded user information
    // userId is created when the user logs in
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      name: decoded.name,
      email: decoded.email,
    }

    next()
  } catch (error) {
    console.error('Authentication error:', error.message)

    return res.status(401).json({
      message: 'Invalid or expired token',
    })
  }
}

module.exports = authMiddleware