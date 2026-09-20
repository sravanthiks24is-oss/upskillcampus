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

  // Service URL names mapped to actual database service names
  const serviceNames = {

    // HOME SERVICES
    plumbing: 'Plumbing',
    electrical: 'Electrical',
    carpentry: 'Carpentry',
    painting: 'Painting',
    'appliance-repair': 'Appliance Repair',
    'ac-service': 'AC Service',
    'home-maintenance': 'Home Maintenance',

    // BEAUTY
    haircut: 'Haircut',
    'hair-styling': 'Hair Styling',
    'haircut-styling': 'Haircut & Styling',
    makeup: 'Makeup',
    facial: 'Facial',
    manicure: 'Manicure',
    'bridal-beauty': 'Bridal Beauty',
    'manicure-pedicure': 'Manicure & Pedicure',
    'hair-spa': 'Hair Spa',

    // CLEANING
    'house-cleaning': 'House Cleaning',
    'deep-cleaning': 'Deep Cleaning',
    'bathroom-cleaning': 'Bathroom Cleaning',
    'kitchen-cleaning': 'Kitchen Cleaning',
    'sofa-cleaning': 'Sofa Cleaning',
    'office-cleaning': 'Office Cleaning',
    'carpet-cleaning': 'Carpet Cleaning',

    // FITNESS
    'personal-training': 'Personal Training',
    yoga: 'Yoga',
    zumba: 'Zumba',
    'yoga-classes': 'Yoga Classes',
    'zumba-classes': 'Zumba Classes',
    'gym-training': 'Gym Training',
    'fitness-consultation': 'Fitness Consultation',
    'weight-management': 'Weight Management',
    'weight-loss-program': 'Weight Loss Program',

    // EDUCATION
    'home-tuition': 'Home Tuition',
    'online-tutoring': 'Online Tutoring',
    'spoken-english': 'Spoken English',
    'mathematics-tuition': 'Mathematics Tuition',
    'programming-classes': 'Programming Classes',
    'exam-preparation': 'Exam Preparation',

    // REPAIRS
    'mobile-repair': 'Mobile Repair',
    'laptop-repair': 'Laptop Repair',
    'tv-repair': 'TV Repair',
    'ac-repair': 'AC Repair',
    'washing-machine-repair': 'Washing Machine Repair',
    'refrigerator-repair': 'Refrigerator Repair',
    'computer-repair': 'Computer Repair',

  }


  // Fetch selected service
  useEffect(() => {

    const fetchService = async () => {

      try {

        setLoading(true)
        setMessage('')
        setService(null)

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
              item.name &&
              item.name.toLowerCase() ===
              actualServiceName.toLowerCase()
          )


        if (!foundService) {

          setMessage(
            `Service "${actualServiceName}" was not found.`
          )

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


  // Get current location
  const handleGetLocation = () => {

    if (!navigator.geolocation) {

      alert(
        'Geolocation is not supported by your browser.'
      )

      return
    }


    navigator.geolocation.getCurrentPosition(

      (position) => {

        setLatitude(
          position.coords.latitude
        )

        setLongitude(
          position.coords.longitude
        )


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


  // Create booking
  const handleBooking = async (event) => {

    event.preventDefault()

    setMessage('')


    const token =
      localStorage.getItem('token')


    if (!token) {

      alert(
        'Please login before booking a service.'
      )

      navigate('/login')

      return
    }


    if (!service) {

      setMessage(
        'Service information is not available.'
      )

      return
    }


    if (!bookingDate || !bookingTime) {

      setMessage(
        'Please select booking date and time.'
      )

      return
    }


    const selectedDateTime =
      new Date(
        `${bookingDate}T${bookingTime}`
      )


    const currentDateTime =
      new Date()


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

      const response =
        await fetch(
          `${API_URL}/api/bookings`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',

              Authorization:
                `Bearer ${token}`,
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


      const data =
        await response.json()


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


  // Loading screen
  if (loading) {

    return (

      <div
        style={{
          padding: '40px'
        }}
      >

        <h2>
          Booking
        </h2>

        <p>
          Loading service...
        </p>

      </div>

    )
  }


  // Service loading error
  if (message && !service) {

    return (

      <div
        style={{
          padding: '40px'
        }}
      >

        <h2>
          Booking
        </h2>

        <p>
          {message}
        </p>


        <button
          type="button"
          onClick={() =>
            navigate('/categories')
          }
        >
          Back to Categories
        </button>

      </div>

    )
  }


  // Booking successful
  if (bookingSuccess) {

    return (

      <div
        style={{
          padding: '40px',
          maxWidth: '700px',
          margin: 'auto',
        }}
      >

        <h2>
          Booking Confirmed
        </h2>

        <p>
          Your service booking has been
          successfully created.
        </p>


        <p>
          <strong>
            Service:
          </strong>{' '}

          {service?.name}
        </p>


        <p>
          <strong>
            Date:
          </strong>{' '}

          {bookingDate}
        </p>


        <p>
          <strong>
            Time:
          </strong>{' '}

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


  // Booking form
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
        <strong>
          Price:
        </strong>{' '}

        ₹{service?.price}
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

        {/* Booking Date */}

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


        {/* Booking Time */}

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


        {/* Address */}

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


        {/* Phone */}

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


        {/* Location */}

        <div
          style={{
            marginBottom: '20px'
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


        {/* Confirm Booking */}

        <button
          type="submit"
        >
          Confirm Booking
        </button>

      </form>

    </div>

  )
}


export default Booking