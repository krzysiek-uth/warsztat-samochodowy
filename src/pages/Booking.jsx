import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createBooking, getServices } from '../services/api'
import axios from 'axios'
import '../styles/Booking.css'

function Booking() {
  const navigate = useNavigate()
  const { user, isAuthenticated, register } = useAuth()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    carBrand: '',
    carModel: '',
    serviceId: '',
    customService: '',
    date: '',
    time: '',
    notes: ''
  })

  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const [availableSlots, setAvailableSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedImages, setSelectedImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

  const [currentPage, setCurrentPage] = useState(0)
  const slotsPerPage = 4

  useEffect(() => {
    fetchServices()
    fetchAvailableSlots()
  }, [])

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || ''
      }))
    }
  }, [isAuthenticated, user])

  const fetchServices = async () => {
    const result = await getServices()
    if (result.success) {
      setServices(result.data.services)
    }
  }

  const fetchAvailableSlots = async () => {
    setLoadingSlots(true)
    try {
      const response = await axios.get('/api/slots', { withCredentials: true })
      setAvailableSlots(response.data.slots || [])
    } catch (error) {
      console.error('Błąd pobierania dostępnych slotów:', error)
      setAvailableSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)

    if (files.length + selectedImages.length > 5) {
      setError('Możesz dodać maksymalnie 5 zdjęć')
      return
    }

    setSelectedImages(prev => [...prev, ...files])

    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })
    setError(null)
  }

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const uploadImages = async (bookingId) => {
    if (selectedImages.length === 0) {
      return { success: true }
    }

    try {
      const formData = new FormData()
      selectedImages.forEach(image => {
        formData.append('images', image)
      })

      const response = await axios.post(
        `/api/bookings/${bookingId}/images`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Błąd uploadu zdjęć:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Błąd przesyłania zdjęć'
      }
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError(null)
  }

  const totalPages = Math.ceil(availableSlots.length / slotsPerPage)
  const startIndex = currentPage * slotsPerPage
  const endIndex = startIndex + slotsPerPage
  const displayedSlots = availableSlots.slice(startIndex, endIndex)

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      
      if (!isAuthenticated) {
        
        if (!formData.password || formData.password.length < 6) {
          setError('Hasło musi mieć minimum 6 znaków')
          setLoading(false)
          return
        }

        const registerResult = await register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        })

        if (!registerResult.success) {
          setError(registerResult.error)
          setLoading(false)
          return
        }

      }

      let notes = formData.notes
      if (formData.serviceId === 'other' && formData.customService) {
        notes = `[USŁUGA NIESTANDARDOWA] ${formData.customService}\n\n${formData.notes}`
      }

      const bookingResult = await createBooking({
        serviceId: formData.serviceId === 'other' ? null : (formData.serviceId ? parseInt(formData.serviceId) : null),
        carBrand: formData.carBrand,
        carModel: formData.carModel,
        preferredDate: formData.date,
        preferredTime: formData.time,
        notes: notes
      })

      if (bookingResult.success) {
        const bookingId = bookingResult.data.booking.id

        if (selectedImages.length > 0) {
          const uploadResult = await uploadImages(bookingId)
          if (uploadResult.success) {
            setSuccessMessage('Rezerwacja utworzona wraz ze zdjęciami')
          } else {
            setSuccessMessage('Rezerwacja utworzona, ale wystąpił problem z przesyłaniem zdjęć')
          }
        } else {
          setSuccessMessage('Rezerwacja utworzona pomyślnie')
        }

        setSuccess(true)
        setLoading(false)
        setTimeout(() => {
          navigate('/client-panel')
        }, 2000)
      } else {
        setError(bookingResult.error)
        setLoading(false)
      }

    } catch (err) {
      setLoading(false)
      setError('Wystąpił nieoczekiwany błąd')
      console.error('Booking error:', err)
    }
  }

  if (success) {
    return (
      <div className="booking">
        <div className="booking-success">
          <h1>Rezerwacja przyjęta!</h1>
          <p>{successMessage}</p>
          <p>Za chwilę zostaniesz przekierowany do panelu klienta...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="booking">
      <div className="booking-header">
        <h1>Rezerwacja wizyty online</h1>
        <p>
          {isAuthenticated
            ? 'Wypełnij formularz, aby umówić wizytę'
            : 'Wypełnij formularz - podczas rezerwacji utworzymy dla Ciebie konto'}
        </p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form className="booking-form" onSubmit={handleSubmit}>
        
        {!isAuthenticated && (
          <section className="form-section">
            <h2>Dane kontaktowe</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Imię *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Nazwisko *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Telefon *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Hasło (min. 6 znaków) *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                minLength="6"
                placeholder="Ustaw hasło do konta"
                required
              />
              <small>To hasło będzie używane do logowania w przyszłości</small>
            </div>
          </section>
        )}

        {isAuthenticated && (
          <section className="form-section">
            <h2>Twoje dane</h2>
            <p><strong>Imię i nazwisko:</strong> {user?.firstName} {user?.lastName}</p>
            <p><strong>Email:</strong> {user?.email}</p>
          </section>
        )}

        <section className="form-section">
          <h2>Informacje o pojeździe</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="carBrand">Marka *</label>
              <input
                type="text"
                id="carBrand"
                name="carBrand"
                value={formData.carBrand}
                onChange={handleChange}
                placeholder="np. Toyota"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="carModel">Model *</label>
              <input
                type="text"
                id="carModel"
                name="carModel"
                value={formData.carModel}
                onChange={handleChange}
                placeholder="np. Corolla"
                required
              />
            </div>
          </div>
        </section>

        <section className="form-section">
          <h2>Rodzaj usługi</h2>
          <div className="form-group">
            <label htmlFor="serviceId">Wybierz usługę</label>
            <select
              id="serviceId"
              name="serviceId"
              value={formData.serviceId}
              onChange={handleChange}
            >
              <option value="">-- Wybierz usługę (opcjonalnie) --</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name} ({service.price_min}-{service.price_max} zł)
                </option>
              ))}
              <option value="other">Inne - opisz poniżej</option>
            </select>
          </div>

          {formData.serviceId === 'other' && (
            <div className="form-group">
              <label htmlFor="customService">Opisz czego potrzebujesz *</label>
              <textarea
                id="customService"
                name="customService"
                value={formData.customService || ''}
                onChange={handleChange}
                rows="4"
                placeholder="Opisz dokładnie, jaką usługę potrzebujesz..."
                required
              />
            </div>
          )}
        </section>

        <section className="form-section">
          <h2>Dostępne terminy</h2>
          {loadingSlots ? (
            <p>Ładowanie dostępnych terminów...</p>
          ) : availableSlots.length > 0 ? (
            <div className="available-slots">
              <p>Wybierz dostępny termin z listy:</p>
              <div className="slots-grid">
                {displayedSlots.map((slot, index) => (
                  <button
                    key={startIndex + index}
                    type="button"
                    className={`slot-button ${
                      formData.date === slot.date && formData.time === slot.time_slot
                        ? 'selected'
                        : ''
                    }`}
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        date: slot.date,
                        time: slot.time_slot
                      }))
                    }}
                  >
                    <div className="slot-date">{slot.date}</div>
                    <div className="slot-time">{slot.time_slot}</div>
                  </button>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="slots-pagination">
                  <button
                    type="button"
                    className="pagination-btn"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 0}
                  >
                    ← Poprzednie
                  </button>
                  <span className="pagination-info">
                    Strona {currentPage + 1} z {totalPages} (pokazano {displayedSlots.length} z {availableSlots.length} terminów)
                  </span>
                  <button
                    type="button"
                    className="pagination-btn"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages - 1}
                  >
                    Następne →
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p>Brak dostępnych terminów w kalendarzu. Możesz wpisać własny termin poniżej.</p>
          )}
        </section>

        <section className="form-section">
          <h2>Lub wpisz własny termin</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Data *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="time">Godzina *</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </section>

        <section className="form-section">
          <div className="form-group">
            <label htmlFor="notes">Dodatkowe uwagi</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Opisz problem lub inne istotne szczegóły dotyczące naprawy..."
            ></textarea>
          </div>
        </section>

        <section className="form-section">
          <h2>Zdjęcia pojazdu (opcjonalnie)</h2>
          <div className="form-group">
            <label htmlFor="images">
              Dodaj zdjęcia problemu lub pojazdu (max 5 zdjęć)
            </label>
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              disabled={selectedImages.length >= 5}
            />
            <small>
              Wybrano {selectedImages.length} z 5 zdjęć. Zdjęcia są opcjonalne i nie blokują rezerwacji.
            </small>
          </div>

          {imagePreviews.length > 0 && (
            <div className="image-previews">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="image-preview">
                  <img src={preview} alt={`Podgląd ${index + 1}`} />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => removeImage(index)}
                    title="Usuń zdjęcie"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <button
          type="submit"
          className="btn btn-primary btn-large"
          disabled={loading}
        >
          {loading ? 'Przetwarzanie...' : (isAuthenticated ? 'Zarezerwuj wizytę' : 'Zarejestruj się i zarezerwuj')}
        </button>

        {!isAuthenticated && (
          <p className="booking-note">
            Klikając przycisk akceptujesz utworzenie konta w naszym systemie.
          </p>
        )}
      </form>
    </div>
  )
}

export default Booking
