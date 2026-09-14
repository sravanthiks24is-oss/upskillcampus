import { useEffect, useState } from 'react'

import { API_URL } from '../config'


function MerchantDashboard() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Home Services')
  const [price, setPrice] = useState('')
  const [duration, setDuration] = useState('')

  const [services, setServices] = useState([])
  const [bookings, setBookings] = useState([])

  const [message, setMessage] = useState('')
  const [loadingServices, setLoadingServices] = useState(true)
  const [loadingBookings, setLoadingBookings] = useState(true)

  const [editingService, setEditingService] = useState(null)

  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editCategory, setEditCategory] = useState('Home Services')
  const [editPrice, setEditPrice] = useState('')
  const [editDuration, setEditDuration] = useState('')

  const token = localStorage.getItem('token')


  const loadMyServices = async () => {
    if (!token) {
      setMessage('Please login as a merchant first.')
      setLoadingServices(false)
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/api/services`
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(
          data.message ||
            'Unable to load services.'
        )
        setLoadingServices(false)
        return
      }

      const loggedInUser =
        JSON.parse(
          localStorage.getItem('user')
        )

      const myServices =
        data.services.filter(
          (service) =>
            service.merchant?._id ===
            loggedInUser?.id
        )

      setServices(myServices)

    } catch (error) {
      console.error(
        'Load services error:',
        error
      )

      setMessage(
        'Unable to connect to the server.'
      )
    }

    setLoadingServices(false)
  }


  const loadMerchantBookings = async () => {
    if (!token) {
      setLoadingBookings(false)
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/api/bookings/merchant-bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(
          data.message ||
            'Unable to load bookings.'
        )
        setLoadingBookings(false)
        return
      }

      setBookings(
        data.bookings || []
      )

    } catch (error) {
      console.error(
        'Load bookings error:',
        error
      )

      setMessage(
        'Unable to connect to the server.'
      )
    }

    setLoadingBookings(false)
  }


  useEffect(() => {
    loadMyServices()
    loadMerchantBookings()
  }, [])


  const handleCreateService = async (event) => {
    event.preventDefault()

    setMessage('')

    if (!token) {
      setMessage(
        'Please login as a merchant first.'
      )
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/api/services`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name,
            description,
            category,
            price: Number(price),
            duration: Number(duration),
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(
          data.message ||
            'Unable to create service.'
        )
        return
      }

      setMessage(
        'Service created successfully!'
      )

      setName('')
      setDescription('')
      setCategory('Home Services')
      setPrice('')
      setDuration('')

      loadMyServices()

    } catch (error) {
      console.error(
        'Create service error:',
        error
      )

      setMessage(
        'Unable to connect to the server.'
      )
    }
  }


  const startEditing = (service) => {
    setEditingService(service)

    setEditName(service.name)
    setEditDescription(
      service.description
    )
    setEditCategory(service.category)
    setEditPrice(service.price)
    setEditDuration(service.duration)

    setMessage('')
  }


  const cancelEditing = () => {
    setEditingService(null)

    setEditName('')
    setEditDescription('')
    setEditCategory('Home Services')
    setEditPrice('')
    setEditDuration('')

    setMessage('')
  }


  const handleUpdateService = async (event) => {
    event.preventDefault()

    if (!token || !editingService) {
      return
    }

    setMessage('')

    try {
      const response = await fetch(
        `${API_URL}/api/services/${editingService._id}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: editName,
            description: editDescription,
            category: editCategory,
            price: Number(editPrice),
            duration: Number(editDuration),
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(
          data.message ||
            'Unable to update service.'
        )
        return
      }

      setMessage(
        'Service updated successfully!'
      )

      setEditingService(null)

      setEditName('')
      setEditDescription('')
      setEditCategory('Home Services')
      setEditPrice('')
      setEditDuration('')

      loadMyServices()

    } catch (error) {
      console.error(
        'Update service error:',
        error
      )

      setMessage(
        'Unable to connect to the server.'
      )
    }
  }


  const handleDeleteService = async (serviceId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this service?'
    )

    if (!confirmed) {
      return
    }

    if (!token) {
      setMessage(
        'Please login as a merchant first.'
      )
      return
    }

    setMessage('')

    try {
      const response = await fetch(
        `${API_URL}/api/services/${serviceId}`,
        {
          method: 'DELETE',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(
          data.message ||
            'Unable to delete service.'
        )
        return
      }

      setMessage(
        'Service deleted successfully!'
      )

      setServices(
        (currentServices) =>
          currentServices.filter(
            (service) =>
              service._id !== serviceId
          )
      )

    } catch (error) {
      console.error(
        'Delete service error:',
        error
      )

      setMessage(
        'Unable to connect to the server.'
      )
    }
  }


  return (
    <div className="merchant-dashboard">

      <div className="merchant-header">

        <h2>
          Merchant Dashboard
        </h2>

        <p>
          Manage your services and bookings from one place.
        </p>

      </div>


      {/* ADD SERVICE */}

      <section className="merchant-section">

        <h3>
          Add New Service
        </h3>

        <form
          onSubmit={
            handleCreateService
          }
        >

          <input
            type="text"
            placeholder="Service name"
            value={name}
            onChange={(event) =>
              setName(
                event.target.value
              )
            }
            required
          />

          <textarea
            placeholder="Service description"
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            required
          />

          <select
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value
              )
            }
          >

            <option value="Home Services">
              Home Services
            </option>

            <option value="Beauty">
              Beauty
            </option>

            <option value="Cleaning">
              Cleaning
            </option>

            <option value="Fitness">
              Fitness
            </option>

            <option value="Education">
              Education
            </option>

            <option value="Repairs">
              Repairs
            </option>

          </select>

          <input
            type="number"
            placeholder="Price"
            min="0"
            value={price}
            onChange={(event) =>
              setPrice(
                event.target.value
              )
            }
            required
          />

          <input
            type="number"
            placeholder="Duration in minutes"
            min="1"
            value={duration}
            onChange={(event) =>
              setDuration(
                event.target.value
              )
            }
            required
          />

          <button type="submit">
            Add Service
          </button>

        </form>


        {message && (
          <p>
            {message}
          </p>
        )}

      </section>


      {/* MY SERVICES */}

      <section className="merchant-section">

        <h3>
          My Services
        </h3>

        {loadingServices ? (

          <p>
            Loading services...
          </p>

        ) : services.length === 0 ? (

          <p>
            You have not created any services yet.
          </p>

        ) : (

          <div>

            {services.map(
              (service) => (

                <div
                  key={service._id}
                  className="merchant-service-card"
                >

                  <h4>
                    {service.name}
                  </h4>

                  <p>
                    {service.description}
                  </p>

                  <p>
                    <strong>
                      Category:
                    </strong>{' '}
                    {service.category}
                  </p>

                  <p>
                    <strong>
                      Price:
                    </strong>{' '}
                    ₹{service.price}
                  </p>

                  <p>
                    <strong>
                      Duration:
                    </strong>{' '}
                    {service.duration} minutes
                  </p>

                  <p>
                    <strong>
                      Status:
                    </strong>{' '}
                    {service.status}
                  </p>


                  <button
                    type="button"
                    onClick={() =>
                      startEditing(service)
                    }
                  >
                    Edit Service
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteService(
                        service._id
                      )
                    }
                  >
                    Delete Service
                  </button>


                  {/* EDIT SERVICE */}

                  {editingService?._id ===
                    service._id && (

                    <form
                      onSubmit={
                        handleUpdateService
                      }
                    >

                      <h4>
                        Edit Service
                      </h4>

                      <input
                        type="text"
                        value={editName}
                        onChange={(event) =>
                          setEditName(
                            event.target.value
                          )
                        }
                        required
                      />

                      <textarea
                        value={
                          editDescription
                        }
                        onChange={(event) =>
                          setEditDescription(
                            event.target.value
                          )
                        }
                        required
                      />

                      <select
                        value={
                          editCategory
                        }
                        onChange={(event) =>
                          setEditCategory(
                            event.target.value
                          )
                        }
                      >

                        <option value="Home Services">
                          Home Services
                        </option>

                        <option value="Beauty">
                          Beauty
                        </option>

                        <option value="Cleaning">
                          Cleaning
                        </option>

                        <option value="Fitness">
                          Fitness
                        </option>

                        <option value="Education">
                          Education
                        </option>

                        <option value="Repairs">
                          Repairs
                        </option>

                      </select>


                      <input
                        type="number"
                        min="0"
                        value={editPrice}
                        onChange={(event) =>
                          setEditPrice(
                            event.target.value
                          )
                        }
                        required
                      />


                      <input
                        type="number"
                        min="1"
                        value={
                          editDuration
                        }
                        onChange={(event) =>
                          setEditDuration(
                            event.target.value
                          )
                        }
                        required
                      />


                      <button type="submit">
                        Save Changes
                      </button>


                      <button
                        type="button"
                        onClick={
                          cancelEditing
                        }
                      >
                        Cancel
                      </button>

                    </form>
                  )}

                </div>
              )
            )}

          </div>
        )}

      </section>


      {/* MY BOOKINGS */}

      <section className="merchant-section">

        <h3>
          My Bookings
        </h3>

        {loadingBookings ? (

          <p>
            Loading bookings...
          </p>

        ) : bookings.length === 0 ? (

          <p>
            No customer bookings found.
          </p>

        ) : (

          <div>

            {bookings.map(
              (booking) => (

                <div
                  key={booking._id}
                  className="merchant-booking-card"
                >

                  <h4>
                    {booking.service?.name ||
                      'Service'}
                  </h4>

                  <p>
                    <strong>
                      Customer:
                    </strong>{' '}
                    {booking.customer?.name ||
                      'Customer'}
                  </p>

                  <p>
                    <strong>
                      Phone:
                    </strong>{' '}
                    {booking.phone}
                  </p>

                  <p>
                    <strong>
                      Date:
                    </strong>{' '}
                    {booking.bookingDate}
                  </p>

                  <p>
                    <strong>
                      Time:
                    </strong>{' '}
                    {booking.bookingTime}
                  </p>

                  <p>
                    <strong>
                      Address:
                    </strong>{' '}
                    {booking.address}
                  </p>

                  <p>
                    <strong>
                      Status:
                    </strong>{' '}
                    {booking.status}
                  </p>

                  {booking.latitude !==
                    undefined &&
                    booking.longitude !==
                      undefined && (

                    <p>
                      <strong>
                        Location:
                      </strong>{' '}

                      {booking.latitude},{' '}
                      {booking.longitude}
                    </p>
                  )}

                </div>
              )
            )}

          </div>
        )}

      </section>

    </div>
  )
}


export default MerchantDashboard