import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import './Booking.css'

function Booking() {
  const { serviceName } = useParams()

  const serviceNames = {
    // =========================
    // HOME SERVICES
    // =========================

    plumbing: 'Plumbing',
    electrical: 'Electrical',
    carpentry: 'Carpentry',
    painting: 'Painting',
    'ac-service': 'AC Service',
    'appliance-repair': 'Appliance Repair',

    // =========================
    // BEAUTY SERVICES
    // =========================

    'haircut-styling': 'Haircut & Styling',
    makeup: 'Makeup',
    facial: 'Facial',
    'manicure-pedicure': 'Manicure & Pedicure',
    'hair-spa': 'Hair Spa',
    'bridal-beauty': 'Bridal Beauty',

    // =========================
    // CLEANING SERVICES
    // =========================

    'house-cleaning': 'House Cleaning',
    'deep-cleaning': 'Deep Cleaning',
    'bathroom-cleaning': 'Bathroom Cleaning',
    'kitchen-cleaning': 'Kitchen Cleaning',
    'sofa-cleaning': 'Sofa Cleaning',
    'carpet-cleaning': 'Carpet Cleaning',

    // =========================
    // FITNESS SERVICES
    // =========================

    'personal-training': 'Personal Training',
    'yoga-classes': 'Yoga Classes',
    'zumba-classes': 'Zumba Classes',
    'gym-training': 'Gym Training',
    'weight-loss-program': 'Weight Loss Program',
    'fitness-consultation': 'Fitness Consultation',

    // =========================
    // EDUCATION SERVICES
    // =========================

    'home-tuition': 'Home Tuition',
    'online-tutoring': 'Online Tutoring',
    'spoken-english': 'Spoken English',
    'mathematics-tuition': 'Mathematics Tuition',
    'programming-classes': 'Programming Classes',
    'exam-preparation': 'Exam Preparation',

    // =========================
    // REPAIRS SERVICES
    // =========================

    'mobile-repair': 'Mobile Repair',
    'laptop-repair': 'Laptop Repair',
    'tv-repair': 'TV Repair',
    'washing-machine-repair': 'Washing Machine Repair',
    'refrigerator-repair': 'Refrigerator Repair',
    'ac-repair': 'AC Repair',
  }

  const service =
    serviceNames[serviceName] || serviceName

  const [booking, setBooking] = useState({
    name: '',
    phone: '',
    address: '',
    date: '',
    time: '',
    details: '',
  })

  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  })

  const [locationMessage, setLocationMessage] = useState('')

  const timeSlots = [
    '9:00 AM',
    '11:00 AM',
    '1:00 PM',
    '3:00 PM',
    '5:00 PM',
    '7:00 PM',
  ]

  // =========================
  // CONVERT TIME TO MINUTES
  // =========================

  const convertTimeToMinutes = (time) => {
    const [timePart, period] = time.split(' ')

    let [hours, minutes] = timePart
      .split(':')
      .map(Number)

    if (period === 'PM' && hours !== 12) {
      hours += 12
    }

    if (period === 'AM' && hours === 12) {
      hours = 0
    }

    return hours * 60 + minutes
  }

  // =========================
  // GET TODAY'S DATE
  // =========================

  const getTodayDate = () => {
    const today = new Date()

    const year = today.getFullYear()

    const month = String(
      today.getMonth() + 1
    ).padStart(2, '0')

    const day = String(
      today.getDate()
    ).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  // =========================
  // CHECK PAST BOOKING
  // =========================

  const isPastBooking = (date, time) => {
    if (!date || !time) {
      return false
    }

    const selectedDate = new Date(
      `${date}T00:00:00`
    )

    const today = new Date()

    today.setHours(
      0,
      0,
      0,
      0
    )

    if (selectedDate < today) {
      return true
    }

    if (selectedDate > today) {
      return false
    }

    const now = new Date()

    const currentMinutes =
      now.getHours() * 60 +
      now.getMinutes()

    const selectedMinutes =
      convertTimeToMinutes(time)

    return selectedMinutes <= currentMinutes
  }

  // =========================
  // HANDLE FORM CHANGES
  // =========================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target

    setBooking({
      ...booking,
      [name]: value,
    })

    if (
      name === 'date' ||
      name === 'time'
    ) {
      setError('')
    }
  }

  // =========================
  // GET CURRENT LOCATION
  // =========================

  const getCurrentLocation = () => {
    setLocationMessage('')
    setError('')

    if (!navigator.geolocation) {
      setLocationMessage(
        'GPS location is not supported by this browser.'
      )

      return
    }

    setLocationMessage(
      'Getting your location...'
    )

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude =
          position.coords.latitude

        const longitude =
          position.coords.longitude

        setLocation({
          latitude,
          longitude,
        })

        setLocationMessage(
          'Location detected successfully!'
        )
      },
      (error) => {
        if (error.code === 1) {
          setLocationMessage(
            'Location permission was denied. Please allow location access.'
          )
        } else if (error.code === 2) {
          setLocationMessage(
            'Unable to determine your location.'
          )
        } else {
          setLocationMessage(
            'Unable to get your location. Please try again.'
          )
        }
      }
    )
  }

  // =========================
  // SUBMIT BOOKING
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')

    if (
      isPastBooking(
        booking.date,
        booking.time
      )
    ) {
      setError(
        'You cannot book a service for a past date or time. Please select a future time.'
      )

      return
    }

    setLoading(true)

    try {
      // =========================
      // CHECK LOGIN TOKEN
      // =========================

      const token =
        localStorage.getItem('token')

      if (!token) {
        setError(
          'Please login before booking a service.'
        )

        setLoading(false)

        return
      }

      // =========================
      // FIND SERVICE IN DATABASE
      // =========================

      const serviceResponse =
        await fetch(
          `http://localhost:5000/api/services?search=${encodeURIComponent(
            service
          )}`
        )

      const serviceData =
        await serviceResponse.json()

      if (!serviceResponse.ok) {
        setError(
          'Unable to load services.'
        )

        setLoading(false)

        return
      }

      if (
        !serviceData.services ||
        serviceData.services.length === 0
      ) {
        setError(
          `Service "${service}" was not found in the database.`
        )

        setLoading(false)

        return
      }

      // =========================
      // FIND EXACT SERVICE NAME
      // =========================

      const selectedService =
        serviceData.services.find(
          (item) =>
            item.name.toLowerCase() ===
            service.toLowerCase()
        )

      if (!selectedService) {
        setError(
          `Service "${service}" was not found in the database.`
        )

        setLoading(false)

        return
      }

      // =========================
      // CREATE BOOKING
      // =========================

      const response =
        await fetch(
          'http://localhost:5000/api/bookings',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              service:
                selectedService._id,

              bookingDate:
                booking.date,

              bookingTime:
                booking.time,

              address:
                booking.address,

              phone:
                booking.phone,

              latitude:
                location.latitude,

              longitude:
                location.longitude,
            }),
          }
        )

      const data =
        await response.json()

      if (!response.ok) {
        setError(
          data.message ||
          'Booking failed.'
        )

        setLoading(false)

        return
      }

      setConfirmed(true)
    } catch (error) {
      setError(
        'Unable to connect to server.'
      )
    }

    setLoading(false)
  }

  // =========================
  // AVAILABLE TIME SLOTS
  // =========================

  const getAvailableTimeSlots = () => {
    if (
      booking.date !==
      getTodayDate()
    ) {
      return timeSlots
    }

    const now = new Date()

    const currentMinutes =
      now.getHours() * 60 +
      now.getMinutes()

    return timeSlots.filter(
      (time) =>
        convertTimeToMinutes(time) >
        currentMinutes
    )
  }

  const availableTimeSlots =
    getAvailableTimeSlots()

  // ===============================
  // CONFIRMATION PAGE
  // ===============================

  if (confirmed) {
    return (
      <div className="confirmation-page">

        <div className="confirmation-card">

          <div className="success-icon">
            ✓
          </div>

          <p className="confirmation-label">
            BOOKING CONFIRMED
          </p>

          <h1>
            Your service is booked!
          </h1>

          <p className="confirmation-message">
            Your booking request has been successfully submitted.
          </p>

          <div className="booking-summary">

            <div className="summary-row">
              <span>
                Service
              </span>

              <strong>
                {service}
              </strong>
            </div>

            <div className="summary-row">
              <span>
                Name
              </span>

              <strong>
                {booking.name}
              </strong>
            </div>

            <div className="summary-row">
              <span>
                Phone
              </span>

              <strong>
                {booking.phone}
              </strong>
            </div>

            <div className="summary-row">
              <span>
                Date
              </span>

              <strong>
                {booking.date}
              </strong>
            </div>

            <div className="summary-row">
              <span>
                Time
              </span>

              <strong>
                {booking.time}
              </strong>
            </div>

            <div className="summary-row">
              <span>
                Address
              </span>

              <strong>
                {booking.address}
              </strong>
            </div>

            {location.latitude !== null &&
              location.longitude !== null && (
                <div className="summary-row">

                  <span>
                    GPS Location
                  </span>

                  <strong>
                    {location.latitude.toFixed(6)}
                    {', '}
                    {location.longitude.toFixed(6)}
                  </strong>

                </div>
              )}

          </div>

          <Link
            to="/home-services"
            className="home-services-button"
          >
            Back to Home Services
          </Link>

        </div>

      </div>
    )
  }

  // ===============================
  // BOOKING FORM
  // ===============================

  return (
    <div className="booking-page">

      <div className="booking-card">

        <div className="booking-header">

          <p>
            BOOK YOUR SERVICE
          </p>

          <h1>
            {service}
          </h1>

          <span>
            Fill in your details to request a booking.
          </span>

        </div>

        <form onSubmit={handleSubmit}>

          {/* FULL NAME */}

          <div className="form-group">

            <label>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={booking.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />

          </div>

          {/* PHONE */}

          <div className="form-group">

            <label>
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={booking.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />

          </div>

          {/* ADDRESS */}

          <div className="form-group">

            <label>
              Address
            </label>

            <textarea
              name="address"
              value={booking.address}
              onChange={handleChange}
              placeholder="Enter your service address"
              rows="3"
              required
            />

          </div>

          {/* GPS LOCATION */}

          <div className="form-group">

            <label>
              Service Location
            </label>

            <button
              type="button"
              onClick={getCurrentLocation}
              style={{
                padding: '10px 15px',
                cursor: 'pointer',
                marginBottom: '10px',
              }}
            >
              📍 Use My Current Location
            </button>

            {locationMessage && (
              <p>
                {locationMessage}
              </p>
            )}

            {location.latitude !== null &&
              location.longitude !== null && (
                <p>
                  Latitude:{' '}
                  {location.latitude.toFixed(6)}

                  <br />

                  Longitude:{' '}
                  {location.longitude.toFixed(6)}
                </p>
              )}

          </div>

          {/* DATE AND TIME */}

          <div className="form-row">

            <div className="form-group">

              <label>
                Preferred Date
              </label>

              <input
                type="date"
                name="date"
                value={booking.date}
                onChange={handleChange}
                min={getTodayDate()}
                required
              />

            </div>

            <div className="form-group">

              <label>
                Preferred Time
              </label>

              <select
                name="time"
                value={booking.time}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select time
                </option>

                {availableTimeSlots.map(
                  (time) => (
                    <option
                      key={time}
                      value={time}
                    >
                      {time}
                    </option>
                  )
                )}

              </select>

              {booking.date ===
                getTodayDate() &&
                availableTimeSlots.length ===
                  0 && (
                  <p>
                    No more time slots are
                    available today. Please
                    choose tomorrow or a
                    future date.
                  </p>
                )}

            </div>

          </div>

          {/* ADDITIONAL DETAILS */}

          <div className="form-group">

            <label>
              Additional Details
            </label>

            <textarea
              name="details"
              value={booking.details}
              onChange={handleChange}
              placeholder="Tell us more about the service you need..."
              rows="4"
            />

          </div>

          {/* ERROR */}

          {error && (
            <p
              style={{
                color: 'red',
                marginBottom: '15px',
              }}
            >
              {error}
            </p>
          )}

          {/* CONFIRM BUTTON */}

          <button
            type="submit"
            className="confirm-booking-button"
            disabled={loading}
          >
            {loading
              ? 'Booking...'
              : 'Confirm Booking'}
          </button>

        </form>

      </div>

    </div>
  )
}

export default Booking