import { Link } from 'react-router-dom'
import './Education.css'

const services = [
  {
    name: 'Home Tuition',
    slug: 'home-tuition',
    description:
      'Personalized home tuition from experienced tutors for different subjects and learning levels.',
    price: 'Starting from ₹399',
  },
  {
    name: 'Online Tutoring',
    slug: 'online-tutoring',
    description:
      'Interactive online tutoring sessions with qualified teachers from the comfort of your home.',
    price: 'Starting from ₹299',
  },
  {
    name: 'Spoken English',
    slug: 'spoken-english',
    description:
      'Improve your English speaking, vocabulary, pronunciation and communication skills.',
    price: 'Starting from ₹349',
  },
  {
    name: 'Mathematics Tuition',
    slug: 'mathematics-tuition',
    description:
      'Focused mathematics lessons to build strong concepts and problem-solving skills.',
    price: 'Starting from ₹399',
  },
  {
    name: 'Programming Classes',
    slug: 'programming-classes',
    description:
      'Learn programming fundamentals, coding concepts and practical problem-solving skills.',
    price: 'Starting from ₹499',
  },
  {
    name: 'Exam Preparation',
    slug: 'exam-preparation',
    description:
      'Structured coaching and guidance to help students prepare effectively for examinations.',
    price: 'Starting from ₹599',
  },
]

function Education() {
  return (
    <div className="education-page">

      <section className="education-header">

        <p className="education-label">
          EDUCATION SERVICES
        </p>

        <h1>
          Learn, improve and achieve your goals
        </h1>

        <p>
          Connect with experienced tutors and
          learning professionals for personalized
          education services.
        </p>

      </section>

      <section className="education-section">

        <h2>
          Popular Education Services
        </h2>

        <div className="education-grid">

          {services.map((service) => (
            <div
              className="education-card"
              key={service.slug}
            >

              <div className="education-icon">
                📚
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
                className="view-education-button"
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

export default Education