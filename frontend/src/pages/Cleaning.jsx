import { Link } from 'react-router-dom'
import './Cleaning.css'

const services = [
  {
    name: 'House Cleaning',
    slug: 'house-cleaning',
    description:
      'Complete cleaning services for homes, rooms and living spaces.',
    price: 'Starting from ₹499',
  },
  {
    name: 'Deep Cleaning',
    slug: 'deep-cleaning',
    description:
      'Detailed deep cleaning for kitchens, bathrooms and entire homes.',
    price: 'Starting from ₹999',
  },
  {
    name: 'Bathroom Cleaning',
    slug: 'bathroom-cleaning',
    description:
      'Professional cleaning and sanitization of bathrooms.',
    price: 'Starting from ₹399',
  },
  {
    name: 'Kitchen Cleaning',
    slug: 'kitchen-cleaning',
    description:
      'Thorough cleaning of kitchen surfaces, cabinets and appliances.',
    price: 'Starting from ₹499',
  },
  {
    name: 'Sofa Cleaning',
    slug: 'sofa-cleaning',
    description:
      'Professional sofa and upholstery cleaning services.',
    price: 'Starting from ₹599',
  },
  {
    name: 'Carpet Cleaning',
    slug: 'carpet-cleaning',
    description:
      'Deep cleaning and maintenance for carpets and rugs.',
    price: 'Starting from ₹499',
  },
]

function Cleaning() {
  return (
    <div className="cleaning-page">

      <section className="cleaning-header">

        <p className="cleaning-label">
          CLEANING SERVICES
        </p>

        <h1>
          Keep your home clean and fresh
        </h1>

        <p>
          Choose a cleaning service and book
          trusted professionals easily.
        </p>

      </section>

      <section className="cleaning-section">

        <h2>
          Popular Cleaning Services
        </h2>

        <div className="cleaning-grid">

          {services.map((service) => (
            <div
              className="cleaning-card"
              key={service.slug}
            >

              <div className="cleaning-icon">
                🧹
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
                className="view-cleaning-button"
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

export default Cleaning