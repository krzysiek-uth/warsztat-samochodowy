import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Login.css'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await login({
      email: formData.email,
      password: formData.password
    })

    setLoading(false)

    if (result.success) {

      const userRole = result.user?.role || 'client'
      if (userRole === 'admin') {
        navigate('/admin-panel')
      } else {
        navigate('/client-panel')
      }
    } else {
      
      setError(result.error)
    }
  }

  return (
    <div className="login">
      <div className="login-container">
        <h1>Logowanie</h1>
        <p>Zaloguj się, aby uzyskać dostęp do swojego panelu</p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Hasło</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-large"
            disabled={loading}
          >
            {loading ? 'Logowanie...' : 'Zaloguj się'}
          </button>
        </form>

        <div className="login-footer">
          <p>Nie masz konta? <Link to="/booking">Zarezerwuj wizytę</Link> i załóż konto podczas rejestracji.</p>
        </div>
      </div>
    </div>
  )
}

export default Login
