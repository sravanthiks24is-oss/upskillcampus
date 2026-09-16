import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { API_URL } from '../config'


function Booking() {
  const { serviceName } = useParams()
  const navigate = useNavigate()

  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const [bookingDate, setBookingDate] = useState('')
  const [bookingTime, setBookingTime] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')

  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)

  const [bookingSuccess, setBookingSuccess] = useState(false)


  const serviceNames = {
    plumbing: 'Plumbing',
    electrical: 'Electrical',
    carpentry: 'Carpentry',
    painting: 'Painting',
    'appliance-repair': 'Appliance Repair',

    haircut: 'Haircut',
    'hair-styling': 'Hair Styling',
    makeup: 'Makeup',
    facial: 'Facial',
    manicure: 'Manicure',
    'bridal-beauty': 'Bridal Beauty',

    'house-cleaning': 'House Cleaning',
    'deep-cleaning': 'Deep Cleaning',
    'bathroom-cleaning': 'Bathroom Cleaning',
    'kitchen-cleaning': 'Kitchen Cleaning',
    'sofa-cleaning': 'Sofa Cleaning',
    'office-cleaning': 'Office Cleaning',

    'personal-training': 'Personal Training',
    yoga: 'Yoga',
    zumba: 'Zumba',
    'gym-training': 'Gym Training',
    'fitness-consultation': 'Fitness Consultation',
    'weight-management': 'Weight Management',

    'school-tuition': 'School Tuition',
    'online-tutoring': 'Online Tutoring',
    tutoring: 'Tutoring',
    programming: 'Programming Classes',
    'spoken-english': 'Spoken English',
    'exam-preparation': 'Exam Preparation',
    'coding-classes': 'Coding Classes',

    'mobile-repair': 'Mobile Repair',
    'laptop-repair': 'Laptop Repair',
    'tv-repair': 'TV Repair',
    'ac-repair': 'AC Repair',
    'washing-machine-repair': 'Washing Machine Repair',
    'refrigerator-repair': 'Refrigerator Repair',
  }


  useEffect(() => {
    const fetchService = async () => {
      try {
        const actualServiceName =
          serviceNames[serviceName]

        if (!actualServiceName) {
          setMessage('Service not found.')
          setLoading(false)
          return
        }

        const response = await fetch(
          `${API_URL}/api/services?search=${encodeURIComponent(
            actualServiceName
          )}`
        )

        const data = await response.json()

        if (!response.ok) {
          setMessage(
            data.message ||
              'Unable to load service.'
          )
          setLoading(false)
          return
        }

        const foundService =
          (data.services || []).find(
            (item) =>
              item.name.toLowerCase() ===
              actualServiceName.toLowerCase()
          )

        if (!foundService) {
          setMessage('Service not found.')
          setLoading(false)
          return
        }

        setService(foundService)
      } catch (error) {
        console.error(
          'Service loading error:',
          error
        )

        setMessage(
          'Unable to connect to server.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchService()
  }, [serviceName])


  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert(
        'Geolocation is not supported by your browser.'
      )
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude)
        setLongitude(position.coords.longitude)

        alert(
          'Location captured successfully.'
        )
      },
      (error) => {
        console.error(
          'Location error:',
          error
        )

        alert(
          'Unable to get your location. Please allow location access.'
        )
      }
    )
  }


  const handleBooking = async (event) => {
    event.preventDefault()

    setMessage('')

    const token = localStorage.getItem('token')

    if (!token) {
      alert(
        'Please login before booking a service.'
      )
      navigate('/login')
      return
    }

    if (!bookingDate || !bookingTime) {
      setMessage(
        'Please select booking date and time.'
      )
      return
    }

    const selectedDateTime = new Date(
      `${bookingDate}T${bookingTime}`
    )

    const currentDateTime = new Date()

    if (
      isNaN(selectedDateTime.getTime()) ||
      selectedDateTime <= currentDateTime
    ) {
      setMessage(
        'Please select a future date and time.'
      )
      return
    }

    if (!address.trim()) {
      setMessage(
        'Please enter your address.'
      )
      return
    }

    if (!phone.trim()) {
      setMessage(
        'Please enter your phone number.'
      )
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/api/bookings`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            service: service._id,
            bookingDate,
            bookingTime,
            address,
            phone,
            latitude,
            longitude,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(
          data.message ||
            'Unable to create booking.'
        )
        return
      }

      setBookingSuccess(true)

    } catch (error) {
      console.error(
        'Booking error:',
        error
      )

      setMessage(
        'Unable to connect to server.'
      )
    }
  }


  if (loading) {
    return (
      <div style={{ padding: '40px' }}>
        <h2>Booking</h2>
        <p>Loading service...</p>
      </div>
    )
  }


  if (message && !service) {
    return (
      <div style={{ padding: '40px' }}>
        <h2>Booking</h2>
        <p>{message}</p>
      </div>
    )
  }


  if (bookingSuccess) {
    return (
      <div
        style={{
          padding: '40px',
          maxWidth: '700px',
          margin: 'auto',
        }}
      >
        <h2>Booking Confirmed</h2>

        <p>
          Your service booking has been
          successfully created.
        </p>

        <p>
          <strong>Service:</strong>{' '}
          {service?.name}
        </p>

        <p>
          <strong>Date:</strong>{' '}
          {bookingDate}
        </p>

        <p>
          <strong>Time:</strong>{' '}
          {bookingTime}
        </p>

        <button
          type="button"
          onClick={() =>
            navigate('/my-bookings')
          }
        >
          View My Bookings
        </button>
      </div>
    )
  }


  return (
    <div
      style={{
        padding: '40px',
        maxWidth: '700px',
        margin: 'auto',
      }}
    >

      <h2>
        Book {service?.name}
      </h2>

      <p>
        <strong>Price:</strong> ₹
        {service?.price}
      </p>

      <p>
        {service?.description}
      </p>


      {message && (
        <p
          style={{
            marginTop: '20px',
          }}
        >
          {message}
        </p>
      )}


      <form
        onSubmit={handleBooking}
        style={{
          marginTop: '30px',
        }}
      >

        <div
          style={{
            marginBottom: '20px',
          }}
        >
          <label>
            <strong>
              Booking Date
            </strong>
          </label>

          <br />

          <input
            type="date"
            value={bookingDate}
            onChange={(event) =>
              setBookingDate(
                event.target.value
              )
            }
            required
          />
        </div>


        <div
          style={{
            marginBottom: '20px',
          }}
        >
          <label>
            <strong>
              Booking Time
            </strong>
          </label>

          <br />

          <input
            type="time"
            value={bookingTime}
            onChange={(event) =>
              setBookingTime(
                event.target.value
              )
            }
            required
          />
        </div>


        <div
          style={{
            marginBottom: '20px',
          }}
        >
          <label>
            <strong>
              Address
            </strong>
          </label>

          <br />

          <textarea
            value={address}
            onChange={(event) =>
              setAddress(
                event.target.value
              )
            }
            placeholder="Enter your address"
            rows="4"
            required
          />
        </div>


        <div
          style={{
            marginBottom: '20px',
          }}
        >
          <label>
            <strong>
              Phone Number
            </strong>
          </label>

          <br />

          <input
            type="tel"
            value={phone}
            onChange={(event) =>
              setPhone(
                event.target.value
              )
            }
            placeholder="Enter your phone number"
            required
          />
        </div>


        <div
          style={{
            marginBottom: '20px',
          }}
        >

          <button
            type="button"
            onClick={handleGetLocation}
          >
            Get My Location
          </button>

          {latitude !== null &&
            longitude !== null && (
              <p>
                📍 Location captured
                successfully.
              </p>
            )}

        </div>


        <button type="submit">
          Confirm Booking
        </button>

      </form>

    </div>
  )
}


export default Booking