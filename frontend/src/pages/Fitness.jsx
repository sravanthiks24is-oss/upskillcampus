import { Link } from 'react-router-dom'
import './Fitness.css'

const services = [
  {
    name: 'Personal Training',
    slug: 'personal-training',
    description:
      'One-on-one fitness training plans designed around your goals and fitness level.',
    price: 'Starting from ₹499',
  },
  {
    name: 'Yoga Classes',
    slug: 'yoga-classes',
    description:
      'Guided yoga sessions to improve flexibility, strength, balance and relaxation.',
    price: 'Starting from ₹399',
  },
  {
    name: 'Zumba Classes',
    slug: 'zumba-classes',
    description:
      'Fun and energetic Zumba sessions combining fitness with dance movements.',
    price: 'Starting from ₹399',
  },
  {
    name: 'Gym Training',
    slug: 'gym-training',
    description:
      'Professional gym training and workout guidance for different fitness goals.',
    price: 'Starting from ₹499',
  },
  {
    name: 'Weight Loss Program',
    slug: 'weight-loss-program',
    description:
      'Structured fitness programs focused on healthy weight management and exercise.',
    price: 'Starting from ₹699',
  },
  {
    name: 'Fitness Consultation',
    slug: 'fitness-consultation',
    description:
      'Personalized fitness consultation to understand your goals and plan your workouts.',
    price: 'Starting from ₹299',
  },
]

function Fitness() {
  return (
    <div className="fitness-page">

      <section className="fitness-header">

        <p className="fitness-label">
          FITNESS SERVICES
        </p>

        <h1>
          Stay fit, active and healthy
        </h1>

        <p>
          Choose a fitness service and connect
          with professional trainers easily.
        </p>

      </section>

      <section className="fitness-section">

        <h2>
          Popular Fitness Services
        </h2>

        <div className="fitness-grid">

          {services.map((service) => (
            <div
              className="fitness-card"
              key={service.slug}
            >

              <div className="fitness-icon">
                🏋️
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
                className="view-fitness-button"
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

export default Fitness