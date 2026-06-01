import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { getMyBookings } from '../services/api'
import '../styles/ClientPanel.css'

function ClientPanel() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [bookingImages, setBookingImages] = useState({})

  const [reviewForm, setReviewForm] = useState({
    bookingId: null,
    rating: 5,
    comment: ''
  })
  const [showReviewForm, setShowReviewForm] = useState(null) 
  const [reviewMessage, setReviewMessage] = useState({ type: '', text: '' })

  const [lightboxImage, setLightboxImage] = useState(null)
  const [lightboxImages, setLightboxImages] = useState([]) 
  const [lightboxIndex, setLightboxIndex] = useState(0) 

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    setError(null)

    const result = await getMyBookings()

    if (result.success) {
      setBookings(result.data.bookings)
      
      fetchAllImages(result.data.bookings)
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  const fetchAllImages = async (bookings) => {
    const imagesMap = {}

    for (const booking of bookings) {
      try {
        const response = await axios.get(
          `/api/bookings/${booking.id}/images`,
          { withCredentials: true }
        )

        if (response.data.success && response.data.images.length > 0) {
          imagesMap[booking.id] = response.data.images
        }
      } catch (error) {
        console.error(`Błąd pobierania zdjęć dla rezerwacji ${booking.id}:`, error)
      }
    }

    setBookingImages(imagesMap)
  }

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Oczekuje',
      'confirmed': 'Potwierdzona',
      'in_progress': 'W trakcie',
      'completed': 'Zakończona',
      'cancelled': 'Anulowana'
    }
    return labels[status] || status
  }

  const openReviewForm = (bookingId) => {
    setShowReviewForm(bookingId)
    setReviewForm({
      bookingId,
      rating: 5,
      comment: ''
    })
    setReviewMessage({ type: '', text: '' })
  }

  const closeReviewForm = () => {
    setShowReviewForm(null)
    setReviewForm({
      bookingId: null,
      rating: 5,
      comment: ''
    })
    setReviewMessage({ type: '', text: '' })
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        '/api/reviews',
        {
          bookingId: reviewForm.bookingId,
          rating: reviewForm.rating,
          comment: reviewForm.comment
        },
        { withCredentials: true }
      )

      if (response.status === 201) {
        setReviewMessage({
          type: 'success',
          text: 'Dziękujemy za opinię! 🎉'
        })

        setTimeout(() => {
          closeReviewForm()
          fetchBookings() 
        }, 2000)
      }
    } catch (error) {
      console.error('Błąd dodawania opinii:', error)
      console.error('Error details:', error.response?.data)
      setReviewMessage({
        type: 'error',
        text: error.response?.data?.error || 'Nie udało się dodać opinii'
      })
    }
  }

  const renderStarRating = () => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star-btn ${star <= reviewForm.rating ? 'active' : ''}`}
            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
          >
            {star <= reviewForm.rating ? '⭐' : '☆'}
          </button>
        ))}
      </div>
    )
  }

  const openLightbox = (images, index) => {
    setLightboxImages(images)
    setLightboxIndex(index)
    setLightboxImage(images[index].image_path)
  }

  const closeLightbox = () => {
    setLightboxImage(null)
    setLightboxImages([])
    setLightboxIndex(0)
  }

  const nextImage = () => {
    if (lightboxIndex < lightboxImages.length - 1) {
      const newIndex = lightboxIndex + 1
      setLightboxIndex(newIndex)
      setLightboxImage(lightboxImages[newIndex].image_path)
    }
  }

  const prevImage = () => {
    if (lightboxIndex > 0) {
      const newIndex = lightboxIndex - 1
      setLightboxIndex(newIndex)
      setLightboxImage(lightboxImages[newIndex].image_path)
    }
  }

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (lightboxImage) {
        if (e.key === 'ArrowRight') nextImage()
        if (e.key === 'ArrowLeft') prevImage()
        if (e.key === 'Escape') closeLightbox()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [lightboxImage, lightboxIndex, lightboxImages])

  return (
    <div className="client-panel">
      <h1>Panel klienta</h1>

      <section className="panel-section">
        <h2>Twoje dane</h2>
        <div className="user-info">
          <p><strong>Imię i nazwisko:</strong> {user?.firstName} {user?.lastName}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          {user?.phone && <p><strong>Telefon:</strong> {user.phone}</p>}
          <p><strong>Numer rejestracyjny:</strong> {user?.registrationNumber || 'Nie podano'}</p>
        </div>
      </section>

      <section className="panel-section">
        <h2>Historia wizyt</h2>

        {loading && (
          <div className="loading">Ładowanie wizyt...</div>
        )}

        {error && (
          <div className="error-message">{error}</div>
        )}

        {!loading && !error && (
          <div className="visits-list">
            {bookings.length === 0 ? (
              <p className="no-visits">Brak wizyt. Zarezerwuj swoją pierwszą wizytę!</p>
            ) : (
              bookings.map(booking => (
                <div key={booking.id} className="visit-card">
                  <div className="visit-header">
                    <h3>
                      {booking.service?.name || 'Wizyta'}
                    </h3>
                    <span className={`status-badge status-${booking.status.replace('_', '-')}`}>
                      {getStatusLabel(booking.status)}
                    </span>
                  </div>

                  <div className="visit-details">
                    <p><strong>Pojazd:</strong> {booking.car.brand} {booking.car.model}</p>
                    <p><strong>Data:</strong> {booking.preferredDate} {booking.preferredTime}</p>

                    {booking.service && (
                      <p><strong>Kategoria:</strong> {booking.service.category}</p>
                    )}

                    {booking.notes && (
                      <p><strong>Uwagi:</strong> {booking.notes}</p>
                    )}

                    <p className="visit-cost">
                      <strong>Koszt:</strong> {booking.cost || 'Wycena w trakcie'}
                    </p>

                    {booking.estimatedCompletionTime && (
                      <p className="visit-completion-time">
                        <strong>Szacowany czas realizacji:</strong> {booking.estimatedCompletionTime}
                      </p>
                    )}
                  </div>

                  <p className="visit-date-created">
                    <small>Utworzono: {new Date(booking.createdAt).toLocaleDateString('pl-PL')}</small>
                  </p>

                  {bookingImages[booking.id] && bookingImages[booking.id].length > 0 && (
                    <div className="booking-images">
                      <h4>Przesłane zdjęcia:</h4>
                      <div className="images-grid">
                        {bookingImages[booking.id].map((image, index) => (
                          <div key={image.id} className="image-thumbnail" onClick={() => openLightbox(bookingImages[booking.id], index)}>
                            <img
                              src={`http://localhost:5000${image.image_path}`}
                              alt={`Zdjęcie dla rezerwacji ${booking.id}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {booking.status === 'completed' && (
                    <div className="review-section">
                      {showReviewForm === booking.id ? (
                        
                        <form onSubmit={handleSubmitReview} className="review-form">
                          <h4>Dodaj opinię</h4>

                          <div className="form-group">
                            <label>Ocena:</label>
                            {renderStarRating()}
                          </div>

                          <div className="form-group">
                            <label htmlFor="comment">Komentarz (opcjonalnie):</label>
                            <textarea
                              id="comment"
                              rows="4"
                              placeholder="Podziel się swoją opinią o usłudze..."
                              value={reviewForm.comment}
                              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                            />
                          </div>

                          {reviewMessage.text && (
                            <div className={`review-message ${reviewMessage.type}`}>
                              {reviewMessage.text}
                            </div>
                          )}

                          <div className="form-buttons">
                            <button type="submit" className="btn btn-primary">
                              Wyślij opinię
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={closeReviewForm}>
                              Anuluj
                            </button>
                          </div>
                        </form>
                      ) : (
                        
                        <button
                          className="btn btn-review"
                          onClick={() => openReviewForm(booking.id)}
                        >
                          ⭐ Dodaj opinię
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {lightboxImage && (
        <div className="lightbox-modal" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              ✕
            </button>

            {lightboxIndex > 0 && (
              <button className="lightbox-arrow lightbox-arrow-left" onClick={prevImage}>
                ←
              </button>
            )}

            {lightboxIndex < lightboxImages.length - 1 && (
              <button className="lightbox-arrow lightbox-arrow-right" onClick={nextImage}>
                →
              </button>
            )}

            <img
              src={`http://localhost:5000${lightboxImage}`}
              alt="Powiększone zdjęcie"
              className="lightbox-image"
            />

            {lightboxImages.length > 1 && (
              <div className="lightbox-counter">
                {lightboxIndex + 1} / {lightboxImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientPanel
