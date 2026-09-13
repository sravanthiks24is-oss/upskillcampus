import { Link } from 'react-router-dom'
import './HomeServices.css'

const services = [
  {
    name: 'Haircut & Styling',
    slug: 'haircut-styling',
    description: 'Professional haircuts, styling and grooming services.',
    price: 'Starting from ₹299',
  },
  {
    name: 'Makeup',
    slug: 'makeup',
    description: 'Professional makeup services for parties and special occasions.',
    price: 'Starting from ₹799',
  },
  {
    name: 'Facial',
    slug: 'facial',
    description: 'Relaxing facial treatments for healthy and glowing skin.',
    price: 'Starting from ₹499',
  },
  {
    name: 'Manicure & Pedicure',
    slug: 'manicure-pedicure',
    description: 'Complete nail care and relaxing manicure and pedicure services.',
    price: 'Starting from ₹399',
  },
  {
    name: 'Hair Spa',
    slug: 'hair-spa',
    description: 'Nourishing hair spa treatments for healthier hair.',
    price: 'Starting from ₹599',
  },
  {
    name: 'Bridal Beauty',
    slug: 'bridal-beauty',
    description: 'Complete beauty and makeup services for brides and special events.',
    price: 'Starting from ₹1999',
  },
]

function Beauty() {
  return (
    <div className="home-services-page">

      <section className="services-header">
        <p className="services-label">
          BEAUTY SERVICES
        </p>

        <h1>
          Find the right beauty professional for you
        </h1>

        <p>
          Choose a beauty service and connect with trusted professionals.
        </p>
      </section>

      <section className="services-section">

        <h2>
          Popular Beauty Services
        </h2>

        <div className="services-grid">

          {services.map((service) => (
            <div
              className="service-card"
              key={service.slug}
            >

              <div className="service-icon">
                💇
              </div>

              <h3>
                {service.name}
              </h3>

              <p>
                {service.description}
              </p>

              <strong>
                {service.price}
              </strong>

              <Link
                to={`/service/${service.slug}`}
                className="view-service-button"
              >
                View Service
              </Link>

            </div>
          ))}

        </div>

      </section>

    </div>
  )
}

export default Beauty