import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function HomeServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const createSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/api/services?category=Home%20Services'
        )

        const data = await response.json()

        if (!response.ok) {
          setMessage(
            data.message ||
              'Unable to load home services.'
          )

          return
        }

        setServices(data.services || [])
      } catch (error) {
        console.error(
          'Home services error:',
          error
        )

        setMessage(
          'Unable to connect to server.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  if (loading) {
    return (
      <div className="category-services-page">
        <div className="category-services-header">
          <h1>Home Services</h1>

          <p>
            Choose a home service and book it easily.
          </p>
        </div>

        <p>Loading services...</p>
      </div>
    )
  }

  return (
    <div className="category-services-page">

      <div className="category-services-header">

        <h1>
          Home Services
        </h1>

        <p>
          Choose a home service and book it easily.
        </p>

      </div>

      {message && (
        <p>
          {message}
        </p>
      )}

      {!message &&
        services.length === 0 && (
          <p>
            No home services available.
          </p>
        )}

      <div className="category-services-grid">

        {services.map((service) => (

          <div
            className="category-service-card"
            key={service._id}
          >

            <h2>
              {service.name}
            </h2>

            <p>
              {service.description}
            </p>

            <div className="category-service-price">
              Starting from ₹{service.price}
            </div>

            <Link
              to={`/service/${createSlug(
                service.name
              )}`}
              className="book-service-button"
            >
              View Service
            </Link>

          </div>

        ))}

      </div>

    </div>
  )
}

export default HomeServices