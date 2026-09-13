const express = require('express')
const mongoose = require('mongoose')

const Service = require('../models/Service')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

// =====================================
// CREATE SERVICE
// =====================================

router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'Merchant') {
      return res.status(403).json({
        message: 'Only merchants can create services',
      })
    }

    const {
      name,
      description,
      category,
      price,
      duration,
      latitude,
      longitude,
    } = req.body

    if (
      !name ||
      !description ||
      !category ||
      price === undefined ||
      duration === undefined
    ) {
      return res.status(400).json({
        message: 'Please provide all required service details',
      })
    }

    if (
      latitude !== undefined &&
      (latitude < -90 || latitude > 90)
    ) {
      return res.status(400).json({
        message: 'Invalid latitude',
      })
    }

    if (
      longitude !== undefined &&
      (longitude < -180 || longitude > 180)
    ) {
      return res.status(400).json({
        message: 'Invalid longitude',
      })
    }

    const service = await Service.create({
      name,
      description,
      category,
      price,
      duration,
      merchant: req.user.userId,
      latitude,
      longitude,
      status: 'Active',
    })

    const populatedService = await Service.findById(
      service._id
    ).populate(
      'merchant',
      'name email role'
    )

    res.status(201).json({
      message: 'Service created successfully',
      service: populatedService,
    })
  } catch (error) {
    console.error('Create service error:', error)

    res.status(500).json({
      message: 'Server error while creating service',
    })
  }
})

// =====================================
// GET SERVICES
// =====================================

router.get('/', async (req, res) => {
  try {
    const {
      search,
      category,
    } = req.query

    const filter = {
      status: 'Active',
    }

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          description: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          category: {
            $regex: search,
            $options: 'i',
          },
        },
      ]
    }

    if (category) {
      filter.category = {
        $regex: `^${category}$`,
        $options: 'i',
      }
    }

    const services = await Service.find(filter)
      .populate(
        'merchant',
        'name email'
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
    console.error('Get services error:', error)

    res.status(500).json({
      message:
        'Server error while retrieving services',
    })
  }
})

// =====================================
// UPDATE SERVICE
// =====================================

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'Merchant') {
      return res.status(403).json({
        message: 'Only merchants can update services',
      })
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        message: 'Invalid service ID',
      })
    }

    const service = await Service.findOne({
      _id: req.params.id,
      merchant: req.user.userId,
    })

    if (!service) {
      return res.status(404).json({
        message:
          'Service not found or you are not the owner of this service',
      })
    }

    const {
      name,
      description,
      category,
      price,
      duration,
      latitude,
      longitude,
      status,
    } = req.body

    if (name !== undefined) {
      service.name = name
    }

    if (description !== undefined) {
      service.description = description
    }

    if (category !== undefined) {
      service.category = category
    }

    if (price !== undefined) {
      service.price = price
    }

    if (duration !== undefined) {
      service.duration = duration
    }

    if (latitude !== undefined) {
      if (
        latitude < -90 ||
        latitude > 90
      ) {
        return res.status(400).json({
          message: 'Invalid latitude',
        })
      }

      service.latitude = latitude
    }

    if (longitude !== undefined) {
      if (
        longitude < -180 ||
        longitude > 180
      ) {
        return res.status(400).json({
          message: 'Invalid longitude',
        })
      }

      service.longitude = longitude
    }

    if (status !== undefined) {
      if (
        !['Active', 'Inactive'].includes(
          status
        )
      ) {
        return res.status(400).json({
          message: 'Invalid service status',
        })
      }

      service.status = status
    }

    await service.save()

    const updatedService =
      await Service.findById(
        service._id
      ).populate(
        'merchant',
        'name email role'
      )

    res.status(200).json({
      message: 'Service updated successfully',
      service: updatedService,
    })
  } catch (error) {
    console.error(
      'Update service error:',
      error
    )

    res.status(500).json({
      message:
        'Server error while updating service',
    })
  }
})

// =====================================
// DELETE SERVICE
// =====================================

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'Merchant') {
      return res.status(403).json({
        message: 'Only merchants can delete services',
      })
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        message: 'Invalid service ID',
      })
    }

    const service = await Service.findOne({
      _id: req.params.id,
      merchant: req.user.userId,
    })

    if (!service) {
      return res.status(404).json({
        message:
          'Service not found or you are not the owner of this service',
      })
    }

    await Service.findByIdAndDelete(
      req.params.id
    )

    res.status(200).json({
      message:
        'Service deleted successfully',
      serviceId: req.params.id,
    })
  } catch (error) {
    console.error(
      'Delete service error:',
      error
    )

    res.status(500).json({
      message:
        'Server error while deleting service',
    })
  }
})

module.exports = router