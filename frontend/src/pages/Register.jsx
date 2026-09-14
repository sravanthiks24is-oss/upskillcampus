import { useState } from 'react'

import { API_URL } from '../config'


function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Customer')
  const [message, setMessage] = useState('')


  const handleRegister = async (event) => {
    event.preventDefault()

    setMessage('')


    try {
      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            name,
            email,
            password,
            role,
          }),
        }
      )


      const data = await response.json()


      if (!response.ok) {
        setMessage(
          data.message ||
            'Registration failed'
        )

        return
      }


      setMessage(
        'Registration successful! You can now login.'
      )


      setName('')
      setEmail('')
      setPassword('')
      setRole('Customer')

    } catch (error) {
      console.error(
        'Registration error:',
        error
      )

      setMessage(
        'Unable to connect to the server.'
      )
    }
  }


  return (
    <div className="login-container">

      <div className="login-card">

        <h2>
          Create Account
        </h2>

        <p>
          Register with ServiceHub
        </p>


        <form onSubmit={handleRegister}>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            required
          />


          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />


          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />


          <select
            value={role}
            onChange={(event) =>
              setRole(event.target.value)
            }
          >

            <option value="Customer">
              Customer
            </option>

            <option value="Merchant">
              Merchant
            </option>

          </select>


          <button type="submit">
            Register
          </button>

        </form>


        {message && (
          <p>
            {message}
          </p>
        )}

      </div>

    </div>
  )
}


export default Register