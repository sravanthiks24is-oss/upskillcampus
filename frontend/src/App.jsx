import './App.css'
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom'

import { API_URL } from './config'

import Navbar from './components/Navbar'

import Categories from './pages/Categories'

import HomeServices from './pages/HomeServices'
import Beauty from './pages/Beauty'
import Cleaning from './pages/Cleaning'
import Fitness from './pages/Fitness'
import Education from './pages/Education'
import Repairs from './pages/Repairs'

import ServiceDetails from './pages/ServiceDetails'
import Booking from './pages/Booking'

import Login from './pages/Login'
import Register from './pages/Register'

import MyBookings from './pages/MyBookings'
import MerchantDashboard from './pages/MerchantDashboard'
import AdminDashboard from './pages/AdminDashboard'


function Home() {
  const navigate = useNavigate()

  const handleSearch = async (event) => {
    event.preventDefault()

    const searchValue =
      event.target.search.value.trim()

    if (!searchValue) {
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/api/services?search=${encodeURIComponent(
          searchValue
        )}`
      )

      const data = await response.json()

      if (
        response.ok &&
        data.services &&
        data.services.length > 0
      ) {
        const service = data.services[0]

        const serviceSlug = service.name
          .toLowerCase()
          .replace(/&/g, 'and')
          .replace(/\s+/g, '-')

        navigate(`/service/${serviceSlug}`)
      } else {
        alert('Service not found.')
      }
    } catch (error) {
      console.error('Search error:', error)
      alert(
        'Unable to search services. Please try again.'
      )
    }
  }

  return (
    <main>
      <section className="hero-section">
        <div className="hero-content">

          <h2>
            Find the Right Service for You
          </h2>

          <p>
            Discover trusted services from local
            service providers on ServiceHub.
          </p>

          <form
            className="search-box"
            onSubmit={handleSearch}
          >

            <input
              type="text"
              name="search"
              placeholder="Search for a service..."
            />

            <button type="submit">
              Search
            </button>

          </form>

        </div>
      </section>
    </main>
  )
}


function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/categories"
          element={<Categories />}
        />

        <Route
          path="/home-services"
          element={<HomeServices />}
        />

        <Route
          path="/beauty"
          element={<Beauty />}
        />

        <Route
          path="/cleaning"
          element={<Cleaning />}
        />

        <Route
          path="/fitness"
          element={<Fitness />}
        />

        <Route
          path="/education"
          element={<Education />}
        />

        <Route
          path="/repairs"
          element={<Repairs />}
        />

        <Route
          path="/service/:serviceName"
          element={<ServiceDetails />}
        />

        <Route
          path="/booking/:serviceName"
          element={<Booking />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/my-bookings"
          element={<MyBookings />}
        />

        <Route
          path="/merchant-dashboard"
          element={<MerchantDashboard />}
        />

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

      </Routes>

    </BrowserRouter>
  )
}


export default App