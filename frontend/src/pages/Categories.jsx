import { Link } from 'react-router-dom'

function Categories() {
  const categories = [
    {
      name: 'Home Services',
      icon: '🔧',
      description:
        'Professional home services including plumbing, electrical, carpentry, painting and appliance repair.',
      path: '/home-services',
    },
    {
      name: 'Beauty',
      icon: '💇‍♀️',
      description:
        'Personal beauty services including haircut, styling, makeup, facial, manicure and bridal beauty.',
      path: '/beauty',
    },
    {
      name: 'Cleaning',
      icon: '🧹',
      description:
        'Reliable cleaning services including house cleaning, deep cleaning, bathroom, kitchen and sofa cleaning.',
      path: '/cleaning',
    },
    {
      name: 'Fitness',
      icon: '🏋️',
      description:
        'Personal training, yoga, zumba and fitness programs for a healthier lifestyle.',
      path: '/fitness',
    },
    {
      name: 'Education',
      icon: '📚',
      description:
        'Tuition, tutoring, programming, spoken English and exam preparation services.',
      path: '/education',
    },
    {
      name: 'Repairs',
      icon: '🛠️',
      description:
        'Reliable repair services for mobile phones, laptops, televisions and home appliances.',
      path: '/repairs',
    },
  ]

  return (
    <main className="categories-page">

      <section className="categories-header">

        <div className="categories-label">
          SERVICE CATEGORIES
        </div>

        <h1>Explore Categories</h1>

        <p>
          Choose a category and explore available services.
        </p>

      </section>


      <section className="categories-grid">

        {categories.map((category) => (

          <article
            className="category-card"
            key={category.name}
          >

            <div className="category-icon">
              {category.icon}
            </div>


            <h2>
              {category.name}
            </h2>


            <p className="category-description">
              {category.description}
            </p>


            <div className="category-count">
              Explore 6 services
            </div>


            <Link
              to={category.path}
              className="category-button"
            >
              View Services
            </Link>

          </article>

        ))}

      </section>

    </main>
  )
}

export default Categories