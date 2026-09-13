import { useState } from 'react'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message || 'Login failed')
        return
      }

      // Save login information in browser
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      setMessage('Login successful!')
    } catch (error) {
      setMessage('Unable to connect to server')
    }
  }

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: 'auto' }}>
      <h2>Login to ServiceHub</h2>

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>

        <button type="submit">
          Login
        </button>
      </form>

      {message && (
        <p style={{ marginTop: '20px' }}>
          {message}
        </p>
      )}
    </div>
  )
}

export default Login