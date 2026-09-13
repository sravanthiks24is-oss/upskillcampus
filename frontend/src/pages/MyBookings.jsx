import { useEffect, useState } from 'react'

function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token')

        if (!token) {
          setMessage(
            'Please login to view your bookings.'
          )

          setLoading(false)

          return
        }

        const response = await fetch(
          'http://localhost:5000/api/bookings/my-bookings',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()

        if (!response.ok) {
          setMessage(
            data.message ||
              'Unable to load your bookings.'
          )

          setLoading(false)

          return
        }

        setBookings(data.bookings || [])
      } catch (error) {
        setMessage(
          'Unable to connect to server.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '40px' }}>
        <h2>My Bookings</h2>

        <p>
          Loading your bookings...
        </p>
      </div>
    )
  }

  return (
    <div
      style={{
        padding: '40px',
        maxWidth: '900px',
        margin: 'auto',
      }}
    >
      <h2>My Bookings</h2>

      <p>
        View your booked services, appointment
        details, and booking location.
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

      {!message &&
        bookings.length === 0 && (
          <p
            style={{
              marginTop: '20px',
            }}
          >
            You have no bookings yet.
          </p>
        )}

      {bookings.length > 0 && (
        <div>
          {bookings.map((booking) => (
            <div
              key={booking._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                marginTop: '20px',
              }}
            >
              <h3>
                {booking.service?.name ||
                  'Service'}
              </h3>

              <p>
                <strong>
                  Category:
                </strong>{' '}
                {booking.service?.category ||
                  'N/A'}
              </p>

              <p>
                <strong>
                  Price:
                </strong>{' '}
                ₹
                {booking.service?.price ||
                  0}
              </p>

              <p>
                <strong>
                  Date:
                </strong>{' '}
                {booking.bookingDate}
              </p>

              <p>
                <strong>
                  Time:
                </strong>{' '}
                {booking.bookingTime}
              </p>

              <p>
                <strong>
                  Address:
                </strong>{' '}
                {booking.address}
              </p>

              <p>
                <strong>
                  Phone:
                </strong>{' '}
                {booking.phone}
              </p>

              <p>
                <strong>
                  Status:
                </strong>{' '}
                {booking.status}
              </p>

              {/* =========================
                  BOOKING GPS LOCATION
              ========================= */}

              {booking.latitude !== null &&
                booking.latitude !== undefined &&
                booking.longitude !== null &&
                booking.longitude !== undefined && (
                  <div
                    style={{
                      marginTop: '15px',
                      padding: '12px',
                      background:
                        '#f5f5f5',
                      borderRadius: '6px',
                    }}
                  >
                    <strong>
                      📍 Booking Location
                    </strong>

                    <p>
                      Latitude:{' '}
                      {booking.latitude}
                    </p>

                    <p>
                      Longitude:{' '}
                      {booking.longitude}
                    </p>
                  </div>
                )}

              {/* =========================
                  NO GPS LOCATION
              ========================= */}

              {(booking.latitude === null ||
                booking.latitude ===
                  undefined ||
                booking.longitude === null ||
                booking.longitude ===
                  undefined) && (
                <div
                  style={{
                    marginTop: '15px',
                    padding: '12px',
                    background:
                      '#f5f5f5',
                    borderRadius: '6px',
                  }}
                >
                  <strong>
                    📍 Booking Location
                  </strong>

                  <p>
                    GPS location was not
                    saved for this booking.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyBookings