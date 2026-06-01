import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import '../styles/Profile.css'

function Profile() {
  const { user, setUser } = useAuth()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    registrationNumber: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        registrationNumber: user.registrationNumber || ''
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await axios.put(
        'http://localhost:5000/api/users/profile',
        formData,
        { withCredentials: true }
      )

      if (response.data.success) {
        
        setUser(response.data.user)

        setMessage({
          type: 'success',
          text: 'Profil został zaktualizowany pomyślnie! ✓'
        })
      }
    } catch (error) {
      console.error('Błąd aktualizacji profilu:', error)
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Nie udało się zaktualizować profilu'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>Edytuj profil</h1>
        <p className="profile-subtitle">
          Zaktualizuj swoje dane osobowe
        </p>

        {message.text && (
          <div className={`profile-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">
                Imię <span className="required">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Wprowadź imię"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">
                Nazwisko <span className="required">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Wprowadź nazwisko"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="przykład@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              Telefon
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="123-456-789"
            />
          </div>

          <div className="form-group">
            <label htmlFor="registrationNumber">
              Numer rejestracyjny pojazdu
            </label>
            <input
              type="text"
              id="registrationNumber"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              placeholder="np. WA 12345 (opcjonalnie)"
            />
            <small className="field-hint">
              Możesz podać numer rejestracyjny swojego pojazdu (opcjonalnie)
            </small>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
            </button>
          </div>

          <p className="form-note">
            <span className="required">*</span> Pola wymagane
          </p>
        </form>
      </div>
    </div>
  )
}

export default Profile
