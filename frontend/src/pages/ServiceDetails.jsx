import { Link, useParams } from 'react-router-dom'
import './ServiceDetails.css'

const serviceData = {
  // =========================
  // HOME SERVICES
  // =========================

  plumbing: {
    name: 'Plumbing',
    description:
      'Professional plumbing services for leaks, taps, pipes and water-related problems.',
    price: '₹299',
    icon: '🔧',
  },

  electrical: {
    name: 'Electrical',
    description:
      'Professional electrical services for switches, wiring, fans, lights and more.',
    price: '₹399',
    icon: '⚡',
  },

  carpentry: {
    name: 'Carpentry',
    description:
      'Furniture repair, doors, shelves and other professional woodwork services.',
    price: '₹499',
    icon: '🪚',
  },

  painting: {
    name: 'Painting',
    description:
      'Professional interior and exterior painting services for your home.',
    price: '₹999',
    icon: '🎨',
  },

  'ac-service': {
    name: 'AC Service',
    description:
      'AC cleaning, maintenance and repair services by experienced professionals.',
    price: '₹499',
    icon: '❄️',
  },

  'appliance-repair': {
    name: 'Appliance Repair',
    description:
      'Repair and maintenance services for household appliances.',
    price: '₹399',
    icon: '🔧',
  },

  // =========================
  // BEAUTY SERVICES
  // =========================

  'haircut-styling': {
    name: 'Haircut & Styling',
    description:
      'Professional haircuts, styling and grooming services by experienced beauty professionals.',
    price: '₹299',
    icon: '💇',
  },

  makeup: {
    name: 'Makeup',
    description:
      'Professional makeup services for parties, celebrations and special occasions.',
    price: '₹799',
    icon: '💄',
  },

  facial: {
    name: 'Facial',
    description:
      'Relaxing facial treatments designed to help maintain healthy and glowing skin.',
    price: '₹499',
    icon: '✨',
  },

  'manicure-pedicure': {
    name: 'Manicure & Pedicure',
    description:
      'Complete nail care and relaxing manicure and pedicure services.',
    price: '₹399',
    icon: '💅',
  },

  'hair-spa': {
    name: 'Hair Spa',
    description:
      'Nourishing hair spa treatments for healthier, smoother and well-maintained hair.',
    price: '₹599',
    icon: '💆',
  },

  'bridal-beauty': {
    name: 'Bridal Beauty',
    description:
      'Complete beauty and makeup services for brides and special events.',
    price: '₹1999',
    icon: '👰',
  },

  // =========================
  // CLEANING SERVICES
  // =========================

  'house-cleaning': {
    name: 'House Cleaning',
    description:
      'Complete cleaning services for homes, rooms and living spaces.',
    price: '₹499',
    icon: '🧹',
  },

  'deep-cleaning': {
    name: 'Deep Cleaning',
    description:
      'Detailed deep cleaning for kitchens, bathrooms and entire homes.',
    price: '₹999',
    icon: '🧹',
  },

  'bathroom-cleaning': {
    name: 'Bathroom Cleaning',
    description:
      'Professional cleaning and sanitization of bathrooms.',
    price: '₹399',
    icon: '🧼',
  },

  'kitchen-cleaning': {
    name: 'Kitchen Cleaning',
    description:
      'Thorough cleaning of kitchen surfaces, cabinets and appliances.',
    price: '₹499',
    icon: '🧽',
  },

  'sofa-cleaning': {
    name: 'Sofa Cleaning',
    description:
      'Professional sofa and upholstery cleaning services.',
    price: '₹599',
    icon: '🛋️',
  },

  'carpet-cleaning': {
    name: 'Carpet Cleaning',
    description:
      'Deep cleaning and maintenance for carpets and rugs.',
    price: '₹499',
    icon: '🧹',
  },

  // =========================
  // FITNESS SERVICES
  // =========================

  'personal-training': {
    name: 'Personal Training',
    description:
      'One-on-one fitness training plans designed around your goals and fitness level.',
    price: '₹499',
    icon: '🏋️',
  },

  'yoga-classes': {
    name: 'Yoga Classes',
    description:
      'Guided yoga sessions to improve flexibility, strength, balance and relaxation.',
    price: '₹399',
    icon: '🧘',
  },

  'zumba-classes': {
    name: 'Zumba Classes',
    description:
      'Fun and energetic Zumba sessions combining fitness with dance movements.',
    price: '₹399',
    icon: '💃',
  },

  'gym-training': {
    name: 'Gym Training',
    description:
      'Professional gym training and workout guidance for different fitness goals.',
    price: '₹499',
    icon: '🏋️',
  },

  'weight-loss-program': {
    name: 'Weight Loss Program',
    description:
      'Structured fitness programs focused on healthy weight management and exercise.',
    price: '₹699',
    icon: '⚖️',
  },

  'fitness-consultation': {
    name: 'Fitness Consultation',
    description:
      'Personalized fitness consultation to understand your goals and plan your workouts.',
    price: '₹299',
    icon: '📋',
  },

  // =========================
  // EDUCATION SERVICES
  // =========================

  'home-tuition': {
    name: 'Home Tuition',
    description:
      'Personalized home tuition from experienced tutors for different subjects and learning levels.',
    price: '₹399',
    icon: '📚',
  },

  'online-tutoring': {
    name: 'Online Tutoring',
    description:
      'Interactive online tutoring sessions with qualified teachers from the comfort of your home.',
    price: '₹299',
    icon: '💻',
  },

  'spoken-english': {
    name: 'Spoken English',
    description:
      'Improve your English speaking, vocabulary, pronunciation and communication skills.',
    price: '₹349',
    icon: '🗣️',
  },

  'mathematics-tuition': {
    name: 'Mathematics Tuition',
    description:
      'Focused mathematics lessons to build strong concepts and problem-solving skills.',
    price: '₹399',
    icon: '➗',
  },

  'programming-classes': {
    name: 'Programming Classes',
    description:
      'Learn programming fundamentals, coding concepts and practical problem-solving skills.',
    price: '₹499',
    icon: '💻',
  },

  'exam-preparation': {
    name: 'Exam Preparation',
    description:
      'Structured coaching and guidance to help students prepare effectively for examinations.',
    price: '₹599',
    icon: '📝',
  },

  // =========================
  // REPAIRS SERVICES
  // =========================

  'mobile-repair': {
    name: 'Mobile Repair',
    description:
      'Professional repair services for smartphones, screens, batteries and other mobile issues.',
    price: '₹299',
    icon: '📱',
  },

  'laptop-repair': {
    name: 'Laptop Repair',
    description:
      'Reliable laptop repair services for hardware, software, performance and other issues.',
    price: '₹399',
    icon: '💻',
  },

  'tv-repair': {
    name: 'TV Repair',
    description:
      'Professional television repair services for display, sound, power and other problems.',
    price: '₹399',
    icon: '📺',
  },

  'washing-machine-repair': {
    name: 'Washing Machine Repair',
    description:
      'Expert repair and maintenance services for washing machines and common appliance problems.',
    price: '₹499',
    icon: '🧺',
  },

  'refrigerator-repair': {
    name: 'Refrigerator Repair',
    description:
      'Professional refrigerator repair and maintenance for cooling and other issues.',
    price: '₹499',
    icon: '🧊',
  },

  'ac-repair': {
    name: 'AC Repair',
    description:
      'Reliable air conditioner repair and maintenance services for cooling and performance issues.',
    price: '₹499',
    icon: '❄️',
  },
}

function ServiceDetails() {
  const { serviceName } = useParams()

  const service = serviceData[serviceName]

  if (!service) {
    return (
      <div className="service-not-found">
        <h1>Service not found</h1>

        <Link to="/home-services">
          ← Back to Home Services
        </Link>
      </div>
    )
  }

  return (
    <div className="service-details-page">

      <div className="service-details-card">

        <div className="service-details-icon">
          {service.icon}
        </div>

        <p className="service-details-label">
          SERVICE DETAILS
        </p>

        <h1>
          {service.name}
        </h1>

        <p className="service-details-description">
          {service.description}
        </p>

        <div className="service-price">
          Starting from{' '}
          <strong>{service.price}</strong>
        </div>

        <div className="service-actions">

          <Link
            to="/home-services"
            className="back-button"
          >
            ← Back
          </Link>

          <Link
            to={`/booking/${serviceName}`}
            className="book-button"
          >
            Book Service
          </Link>

        </div>

      </div>

    </div>
  )
}

export default ServiceDetails