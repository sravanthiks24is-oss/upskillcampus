import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { API_URL } from '../config'


function AllServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  useEffect(() => {
    loadServices()
  }, [])


  const loadServices = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/services`
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to load services'
        )
      }

      setServices(
        data.services || []
      )

    } catch (error) {
      console.error(
        'Services loading error:',
        error
      )

      setError(
        error.message ||
          'Unable to load services.'
      )

    } finally {
      setLoading(false)
    }
  }


  const createSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }


  return (
    <div className="all-services-page">

      {/* HEADER */}

      <div className="all-services-header">

        <div className="service-page-label">
          SERVICE COLLECTION
        </div>

        <h1>
          All Services
        </h1>

        <p>
          Explore and book trusted services
          available on ServiceHub.
        </p>

      </div>


      {/* LOADING */}

      {loading && (
        <div className="all-services-message">
          Loading services...
        </div>
      )}


      {/* ERROR */}

      {error && (
        <div className="all-services-message">
          {error}
        </div>
      )}


      {/* NO SERVICES */}

      {!loading &&
        !error &&
        services.length === 0 && (
          <div className="all-services-message">
            No services available.
          </div>
        )}


      {/* ALL SERVICES */}

      {!loading &&
        !error &&
        services.length > 0 && (

          <div className="all-services-grid">

            {services.map((service) => {

              const serviceSlug =
                createSlug(service.name)

              return (

                <div
                  className="all-service-card"
                  key={service._id}
                >

                  {/* ICON */}

                  <div className="all-service-icon">
                    🔧
                  </div>


                  {/* LABEL */}

                  <div className="all-service-label">
                    SERVICE
                  </div>


                  {/* NAME */}

                  <h2>
                    {service.name}
                  </h2>


                  {/* DESCRIPTION */}

                  <p className="all-service-description">
                    {service.description}
                  </p>


                  {/* PRICE */}

                  <div className="all-service-price">

                    <span>
                      Starting from
                    </span>

                    <strong>
                      ₹{service.price}
                    </strong>

                  </div>


                  {/* BOOK BUTTON */}

                  <Link
                    to={`/booking/${serviceSlug}`}
                    className="all-service-book-button"
                  >
                    Book Service
                  </Link>

                </div>

              )
            })}

          </div>

        )}

    </div>
  )
}


export default AllServices