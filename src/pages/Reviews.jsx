import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import '../styles/Reviews.css'

function Reviews() {
  const { isAdmin } = useAuth()
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const [responseForm, setResponseForm] = useState({
    reviewId: null,
    text: ''
  })
  const [showResponseForm, setShowResponseForm] = useState(null)

  useEffect(() => {
    fetchReviewsData()
  }, [])

  const fetchReviewsData = async () => {
    try {
      setLoading(true)
      const [reviewsRes, statsRes] = await Promise.all([
        axios.get('/api/reviews', { withCredentials: true }),
        axios.get('/api/reviews/stats', { withCredentials: true })
      ])

      setReviews(reviewsRes.data)
      setStats(statsRes.data)
      setLoading(false)
    } catch (error) {
      console.error('Błąd pobierania opinii:', error)
      setLoading(false)
    }
  }

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const openResponseForm = (reviewId, existingResponse = '') => {
    setShowResponseForm(reviewId)
    setResponseForm({
      reviewId,
      text: existingResponse
    })
  }

  const closeResponseForm = () => {
    setShowResponseForm(null)
    setResponseForm({ reviewId: null, text: '' })
  }

  const handleSubmitResponse = async (e) => {
    e.preventDefault()

    try {
      await axios.post(
        `/api/reviews/${responseForm.reviewId}/response`,
        { response: responseForm.text },
        { withCredentials: true }
      )

      fetchReviewsData()
      closeResponseForm()
    } catch (error) {
      console.error('Błąd dodawania odpowiedzi:', error)
      alert('Nie udało się dodać odpowiedzi')
    }
  }

  const handleDeleteResponse = async (reviewId) => {
    if (!window.confirm('Czy na pewno chcesz usunąć swoją odpowiedź?')) return

    try {
      await axios.delete(
        `/api/reviews/${reviewId}/response`,
        { withCredentials: true }
      )

      fetchReviewsData()
    } catch (error) {
      console.error('Błąd usuwania odpowiedzi:', error)
      alert('Nie udało się usunąć odpowiedzi')
    }
  }

  if (loading) {
    return (
      <div className="reviews-loading">
        <p>Ładowanie opinii...</p>
      </div>
    )
  }

  return (
    <div className="reviews-page">
      <div className="reviews-header">
        <h1>Opinie naszych klientów</h1>
        <p className="reviews-subtitle">
          Zobacz co mówią o nas nasi klienci
        </p>
      </div>

      {stats && stats.total_reviews > 0 && (
        <div className="reviews-stats">
          <div className="stats-main">
            <div className="rating-big">
              {stats.average_rating ? parseFloat(stats.average_rating).toFixed(1) : 'N/A'}
            </div>
            <div className="rating-stars">
              {renderStars(Math.round(stats.average_rating || 0))}
            </div>
            <p className="rating-count">Na podstawie {stats.total_reviews} opinii</p>
          </div>

          <div className="stats-breakdown">
            <div className="stat-row">
              <span className="stat-label">5 gwiazdek</span>
              <div className="stat-bar">
                <div
                  className="stat-fill"
                  style={{
                    width: `${(stats.five_star / stats.total_reviews * 100)}%`,
                    backgroundColor: '#4caf50'
                  }}
                />
              </div>
              <span className="stat-count">{stats.five_star}</span>
            </div>

            <div className="stat-row">
              <span className="stat-label">4 gwiazdki</span>
              <div className="stat-bar">
                <div
                  className="stat-fill"
                  style={{
                    width: `${(stats.four_star / stats.total_reviews * 100)}%`,
                    backgroundColor: '#8bc34a'
                  }}
                />
              </div>
              <span className="stat-count">{stats.four_star}</span>
            </div>

            <div className="stat-row">
              <span className="stat-label">3 gwiazdki</span>
              <div className="stat-bar">
                <div
                  className="stat-fill"
                  style={{
                    width: `${(stats.three_star / stats.total_reviews * 100)}%`,
                    backgroundColor: '#ffc107'
                  }}
                />
              </div>
              <span className="stat-count">{stats.three_star}</span>
            </div>

            <div className="stat-row">
              <span className="stat-label">2 gwiazdki</span>
              <div className="stat-bar">
                <div
                  className="stat-fill"
                  style={{
                    width: `${(stats.two_star / stats.total_reviews * 100)}%`,
                    backgroundColor: '#ff9800'
                  }}
                />
              </div>
              <span className="stat-count">{stats.two_star}</span>
            </div>

            <div className="stat-row">
              <span className="stat-label">1 gwiazdka</span>
              <div className="stat-bar">
                <div
                  className="stat-fill"
                  style={{
                    width: `${(stats.one_star / stats.total_reviews * 100)}%`,
                    backgroundColor: '#f44336'
                  }}
                />
              </div>
              <span className="stat-count">{stats.one_star}</span>
            </div>
          </div>
        </div>
      )}

      <div className="reviews-list">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="review-author">
                  <div className="author-avatar">
                    {review.first_name.charAt(0)}{review.last_name.charAt(0)}
                  </div>
                  <div className="author-info">
                    <h3>{review.first_name} {review.last_name}</h3>
                    <p className="review-service">{review.service_name}</p>
                  </div>
                </div>
                <div className="review-meta">
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                  <p className="review-date">{formatDate(review.created_at)}</p>
                </div>
              </div>

              {review.comment && (
                <div className="review-body">
                  <p>{review.comment}</p>
                </div>
              )}

              {review.admin_response && (
                <div className="admin-response">
                  <div className="admin-response-header">
                    <span className="admin-badge">👤 Odpowiedź warsztatu</span>
                    <span className="response-date">
                      {formatDate(review.admin_response_date)}
                    </span>
                  </div>
                  <p className="admin-response-text">{review.admin_response}</p>

                  {isAdmin && (
                    <div className="admin-actions">
                      <button
                        className="btn-edit-response"
                        onClick={() => openResponseForm(review.id, review.admin_response)}
                      >
                         Edytuj
                      </button>
                      <button
                        className="btn-delete-response"
                        onClick={() => handleDeleteResponse(review.id)}
                      >
                         Usuń
                      </button>
                    </div>
                  )}
                </div>
              )}

              {isAdmin && showResponseForm === review.id && (
                <form onSubmit={handleSubmitResponse} className="response-form">
                  <h4>{review.admin_response ? 'Edytuj odpowiedź' : 'Dodaj odpowiedź'}</h4>
                  <textarea
                    rows="3"
                    placeholder="Napisz odpowiedź..."
                    value={responseForm.text}
                    onChange={(e) => setResponseForm({ ...responseForm, text: e.target.value })}
                    required
                  />
                  <div className="response-form-buttons">
                    <button type="submit" className="btn-submit">
                      Wyślij
                    </button>
                    <button type="button" className="btn-cancel" onClick={closeResponseForm}>
                      Anuluj
                    </button>
                  </div>
                </form>
              )}

              {isAdmin && !review.admin_response && showResponseForm !== review.id && (
                <button
                  className="btn-add-response"
                  onClick={() => openResponseForm(review.id)}
                >
                  💬 Odpowiedz na opinię
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="no-reviews">
            <p>Brak opinii do wyświetlenia</p>
            <p className="no-reviews-subtitle">
              Bądź pierwszą osobą, która podzieli się opinią!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Reviews
