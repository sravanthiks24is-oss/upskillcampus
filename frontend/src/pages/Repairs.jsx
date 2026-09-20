import { Link } from 'react-router-dom'
import './Repairs.css'

const services = [
  {
    name: 'Mobile Repair',
    slug: 'mobile-repair',
    description:
      'Professional repair services for smartphones, screens, batteries and other mobile issues.',
    price: 'Starting from ₹299',
  },
  {
    name: 'Laptop Repair',
    slug: 'laptop-repair',
    description:
      'Reliable laptop repair services for hardware, software, performance and other issues.',
    price: 'Starting from ₹399',
  },
  {
    name: 'TV Repair',
    slug: 'tv-repair',
    description:
      'Professional television repair services for display, sound, power and other problems.',
    price: 'Starting from ₹399',
  },
  {
    name: 'Washing Machine Repair',
    slug: 'washing-machine-repair',
    description:
      'Expert repair and maintenance services for washing machines and common appliance problems.',
    price: 'Starting from ₹499',
  },
  {
    name: 'Refrigerator Repair',
    slug: 'refrigerator-repair',
    description:
      'Professional refrigerator repair and maintenance for cooling and other issues.',
    price: 'Starting from ₹499',
  },
  {
    name: 'Computer Repair',
    slug: 'computer-repair',
    description:
      'Professional computer repair and maintenance services.',
    price: 'Starting from ₹599',
  },
]

function Repairs() {
  return (
    <div className="repairs-page">

      <section className="repairs-header">

        <p className="repairs-label">
          REPAIR SERVICES
        </p>

        <h1>
          Get your devices and appliances repaired
        </h1>

        <p>
          Connect with skilled repair professionals
          and get your equipment working properly again.
        </p>

      </section>

      <section className="repairs-section">

        <h2>
          Popular Repair Services
        </h2>

        <div className="repairs-grid">

          {services.map((service) => (
            <div
              className="repairs-card"
              key={service.slug}
            >

              <div className="repairs-icon">
                🔧
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
                className="view-repairs-button"
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

export default Repairs