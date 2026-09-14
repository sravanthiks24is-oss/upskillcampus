import { useEffect, useState } from 'react'

import { API_URL } from '../config'


function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [services, setServices] = useState([])
  const [bookings, setBookings] = useState([])

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('overview')


  useEffect(() => {
    loadAdminData()
  }, [])


  const loadAdminData = async () => {
    try {
      setLoading(true)

      const token = localStorage.getItem('token')

      if (!token) {
        setMessage('Admin login required.')
        setLoading(false)
        return
      }


      const headers = {
        Authorization: `Bearer ${token}`,
      }


      const [
        usersResponse,
        servicesResponse,
        bookingsResponse,
      ] = await Promise.all([

        fetch(
          `${API_URL}/api/admin/users`,
          {
            headers,
          }
        ),

        fetch(
          `${API_URL}/api/admin/services`,
          {
            headers,
          }
        ),

        fetch(
          `${API_URL}/api/admin/bookings`,
          {
            headers,
          }
        ),

      ])


      const usersData =
        await usersResponse.json()

      const servicesData =
        await servicesResponse.json()

      const bookingsData =
        await bookingsResponse.json()


      if (!usersResponse.ok) {
        throw new Error(
          usersData.message ||
            'Failed to load users'
        )
      }


      if (!servicesResponse.ok) {
        throw new Error(
          servicesData.message ||
            'Failed to load services'
        )
      }


      if (!bookingsResponse.ok) {
        throw new Error(
          bookingsData.message ||
            'Failed to load bookings'
        )
      }


      setUsers(
        usersData.users || []
      )

      setServices(
        servicesData.services || []
      )

      setBookings(
        bookingsData.bookings || []
      )

      setMessage('')

    } catch (error) {

      console.error(
        'Admin dashboard error:',
        error
      )

      setMessage(
        error.message ||
          'Unable to load admin dashboard data.'
      )

    } finally {

      setLoading(false)

    }
  }


  const getRoleClass = (role) => {

    if (role === 'Admin') {
      return 'admin-role admin-role-admin'
    }


    if (role === 'Merchant') {
      return 'admin-role admin-role-merchant'
    }


    return 'admin-role admin-role-customer'
  }


  return (
    <div className="admin-dashboard">

      {/* HEADER */}

      <div className="admin-header">

        <h2>
          Admin Dashboard
        </h2>

        <p>
          Manage and monitor the ServiceHub platform.
        </p>

      </div>


      {/* MESSAGE */}

      {message && (
        <div className="admin-message">
          {message}
        </div>
      )}


      {/* SUMMARY */}

      <div className="admin-summary">

        <div className="admin-summary-card">

          <div className="admin-summary-icon">
            👥
          </div>

          <div>

            <div className="admin-summary-label">
              Total Users
            </div>

            <h3>
              {users.length}
            </h3>

          </div>

        </div>


        <div className="admin-summary-card">

          <div className="admin-summary-icon">
            🛠️
          </div>

          <div>

            <div className="admin-summary-label">
              Total Services
            </div>

            <h3>
              {services.length}
            </h3>

          </div>

        </div>


        <div className="admin-summary-card">

          <div className="admin-summary-icon">
            🗓️
          </div>

          <div>

            <div className="admin-summary-label">
              Total Bookings
            </div>

            <h3>
              {bookings.length}
            </h3>

          </div>

        </div>

      </div>


      {/* TABS */}

      <div className="admin-tabs">

        <button
          className={
            activeTab === 'overview'
              ? 'admin-tab admin-tab-active'
              : 'admin-tab'
          }
          onClick={() =>
            setActiveTab('overview')
          }
        >
          Overview
        </button>


        <button
          className={
            activeTab === 'users'
              ? 'admin-tab admin-tab-active'
              : 'admin-tab'
          }
          onClick={() =>
            setActiveTab('users')
          }
        >
          Users
        </button>


        <button
          className={
            activeTab === 'services'
              ? 'admin-tab admin-tab-active'
              : 'admin-tab'
          }
          onClick={() =>
            setActiveTab('services')
          }
        >
          Services
        </button>


        <button
          className={
            activeTab === 'bookings'
              ? 'admin-tab admin-tab-active'
              : 'admin-tab'
          }
          onClick={() =>
            setActiveTab('bookings')
          }
        >
          Bookings
        </button>

      </div>


      {/* LOADING */}

      {loading && (
        <div className="admin-message">
          Loading admin dashboard...
        </div>
      )}


      {!loading && (

        <>

          {/* OVERVIEW */}

          {activeTab === 'overview' && (

            <>

              {/* RECENT USERS */}

              <section className="admin-section">

                <div className="admin-section-header">

                  <h2>
                    Recent Users
                  </h2>

                  <p>
                    Latest registered users on ServiceHub
                  </p>

                  <span className="admin-count">
                    Showing latest 5 users
                  </span>

                </div>


                {users.length === 0 ? (

                  <div className="admin-empty">
                    No users found.
                  </div>

                ) : (

                  <div className="admin-table-wrapper">

                    <table className="admin-table">

                      <thead>

                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                        </tr>

                      </thead>


                      <tbody>

                        {users.slice(0, 5).map(
                          (user) => (

                            <tr key={user._id}>

                              <td>
                                <strong>
                                  {user.name}
                                </strong>
                              </td>

                              <td>
                                {user.email}
                              </td>

                              <td>

                                <span
                                  className={getRoleClass(
                                    user.role
                                  )}
                                >
                                  {user.role}
                                </span>

                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                )}

              </section>


              {/* RECENT SERVICES */}

              <section className="admin-section">

                <div className="admin-section-header">

                  <h2>
                    Recent Services
                  </h2>

                  <p>
                    Latest services available on ServiceHub
                  </p>

                  <span className="admin-count">
                    Showing latest 6 services
                  </span>

                </div>


                {services.length === 0 ? (

                  <div className="admin-empty">
                    No services found.
                  </div>

                ) : (

                  <div className="admin-service-grid">

                    {services.slice(0, 6).map(
                      (service) => (

                        <div
                          className="admin-service-card"
                          key={service._id}
                        >

                          <div className="admin-service-top">

                            <h3>
                              {service.name}
                            </h3>

                            <span className="admin-status">
                              {service.status}
                            </span>

                          </div>


                          <div className="admin-service-description">
                            {service.description}
                          </div>


                          <div className="admin-service-details">

                            <div>
                              <strong>
                                Category:
                              </strong>{' '}
                              {service.category}
                            </div>

                            <div>
                              <strong>
                                Price:
                              </strong>{' '}
                              ₹{service.price}
                            </div>

                            <div>
                              <strong>
                                Duration:
                              </strong>{' '}
                              {service.duration} minutes
                            </div>

                            <div>
                              <strong>
                                Merchant:
                              </strong>{' '}
                              {service.merchant?.name ||
                                'Unknown'}
                            </div>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                )}

              </section>


              {/* RECENT BOOKINGS */}

              <section className="admin-section">

                <div className="admin-section-header">

                  <h2>
                    Recent Bookings
                  </h2>

                  <p>
                    Latest bookings made by customers
                  </p>

                  <span className="admin-count">
                    Showing latest 5 bookings
                  </span>

                </div>


                {bookings.length === 0 ? (

                  <div className="admin-empty">
                    No bookings found.
                  </div>

                ) : (

                  <div className="admin-booking-list">

                    {bookings.slice(0, 5).map(
                      (booking) => (

                        <div
                          className="admin-booking-card"
                          key={booking._id}
                        >

                          <div className="admin-booking-header">

                            <h3>
                              {booking.service?.name ||
                                'Service no longer available'}
                            </h3>

                            <span className="admin-status">
                              {booking.status}
                            </span>

                          </div>


                          <div className="admin-booking-details">

                            <div>
                              <strong>
                                Customer:
                              </strong>{' '}
                              {booking.customer?.name ||
                                'Unknown'}
                            </div>

                            <div>
                              <strong>
                                Merchant:
                              </strong>{' '}
                              {booking.service?.merchant
                                ?.name ||
                                'Unknown'}
                            </div>

                            <div>
                              <strong>
                                Date:
                              </strong>{' '}
                              {booking.bookingDate}
                            </div>

                            <div>
                              <strong>
                                Time:
                              </strong>{' '}
                              {booking.bookingTime}
                            </div>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                )}

              </section>

            </>

          )}


          {/* USERS */}

          {activeTab === 'users' && (

            <section className="admin-section">

              <div className="admin-section-header">

                <h2>
                  All Users
                </h2>

                <p>
                  View all registered ServiceHub users
                </p>

                <span className="admin-count">
                  {users.length} Users
                </span>

              </div>


              {users.length === 0 ? (

                <div className="admin-empty">
                  No users found.
                </div>

              ) : (

                <div className="admin-table-wrapper">

                  <table className="admin-table">

                    <thead>

                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                      </tr>

                    </thead>


                    <tbody>

                      {users.map((user) => (

                        <tr key={user._id}>

                          <td>
                            <strong>
                              {user.name}
                            </strong>
                          </td>

                          <td>
                            {user.email}
                          </td>

                          <td>

                            <span
                              className={getRoleClass(
                                user.role
                              )}
                            >
                              {user.role}
                            </span>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              )}

            </section>

          )}


          {/* SERVICES */}

          {activeTab === 'services' && (

            <section className="admin-section">

              <div className="admin-section-header">

                <h2>
                  All Services
                </h2>

                <p>
                  View all services listed by merchants
                </p>

                <span className="admin-count">
                  {services.length} Services
                </span>

              </div>


              {services.length === 0 ? (

                <div className="admin-empty">
                  No services found.
                </div>

              ) : (

                <div className="admin-service-grid">

                  {services.map((service) => (

                    <div
                      className="admin-service-card"
                      key={service._id}
                    >

                      <div className="admin-service-top">

                        <h3>
                          {service.name}
                        </h3>

                        <span className="admin-status">
                          {service.status}
                        </span>

                      </div>


                      <div className="admin-service-description">
                        {service.description}
                      </div>


                      <div className="admin-service-details">

                        <div>
                          <strong>
                            Category:
                          </strong>{' '}
                          {service.category}
                        </div>

                        <div>
                          <strong>
                            Price:
                          </strong>{' '}
                          ₹{service.price}
                        </div>

                        <div>
                          <strong>
                            Duration:
                          </strong>{' '}
                          {service.duration} minutes
                        </div>

                        <div>
                          <strong>
                            Merchant:
                          </strong>{' '}
                          {service.merchant?.name ||
                            'Unknown'}
                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </section>

          )}


          {/* BOOKINGS */}

          {activeTab === 'bookings' && (

            <section className="admin-section">

              <div className="admin-section-header">

                <h2>
                  All Bookings
                </h2>

                <p>
                  View all customer bookings
                </p>

                <span className="admin-count">
                  {bookings.length} Bookings
                </span>

              </div>


              {bookings.length === 0 ? (

                <div className="admin-empty">
                  No bookings found.
                </div>

              ) : (

                <div className="admin-booking-list">

                  {bookings.map((booking) => (

                    <div
                      className="admin-booking-card"
                      key={booking._id}
                    >

                      <div className="admin-booking-header">

                        <h3>
                          {booking.service?.name ||
                            'Service no longer available'}
                        </h3>

                        <span className="admin-status">
                          {booking.status}
                        </span>

                      </div>


                      <div className="admin-booking-details">

                        <div>
                          <strong>
                            Customer:
                          </strong>{' '}
                          {booking.customer?.name ||
                            'Unknown'}
                        </div>

                        <div>
                          <strong>
                            Merchant:
                          </strong>{' '}
                          {booking.service?.merchant?.name ||
                            'Unknown'}
                        </div>

                        <div>
                          <strong>
                            Category:
                          </strong>{' '}
                          {booking.service?.category ||
                            'Unavailable'}
                        </div>

                        <div>
                          <strong>
                            Price:
                          </strong>{' '}
                          {booking.service
                            ? `₹${booking.service.price}`
                            : 'Unavailable'}
                        </div>

                        <div>
                          <strong>
                            Date:
                          </strong>{' '}
                          {booking.bookingDate}
                        </div>

                        <div>
                          <strong>
                            Time:
                          </strong>{' '}
                          {booking.bookingTime}
                        </div>

                        <div>
                          <strong>
                            Address:
                          </strong>{' '}
                          {booking.address}
                        </div>

                        <div>
                          <strong>
                            Phone:
                          </strong>{' '}
                          {booking.phone}
                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </section>

          )}

        </>

      )}

    </div>
  )
}


export default AdminDashboard