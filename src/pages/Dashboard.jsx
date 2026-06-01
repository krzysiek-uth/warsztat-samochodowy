import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import '../styles/Dashboard.css'

function Dashboard() {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  const [stats, setStats] = useState({
    totalBookings: 0,
    totalClients: 0,
    totalRevenue: 0,
    avgRating: 0
  })

  const [bookingsByStatus, setBookingsByStatus] = useState({
    pending: 0,
    confirmed: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0
  })

  const [popularServices, setPopularServices] = useState([])
  const [recentBookings, setRecentBookings] = useState([])
  const [reviewStats, setReviewStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAdmin) {
      navigate('/')
      return
    }

    fetchDashboardData()
  }, [isAdmin, navigate])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      console.log(' Pobieranie danych dashboardu...')

      const [bookingsRes, clientsRes, reviewsRes] = await Promise.all([
        axios.get('/api/bookings', { withCredentials: true }),
        axios.get('/api/users', { withCredentials: true }),
        axios.get('/api/reviews/stats', { withCredentials: true })
      ])

      console.log(' Bookings response:', bookingsRes.data)
      console.log(' Clients response:', clientsRes.data)
      console.log(' Reviews response:', reviewsRes.data)

      const bookings = bookingsRes.data.bookings || []
      const clients = clientsRes.data.users || []
      const reviewData = reviewsRes.data

      console.log(' Parsed data:', {
        bookingsCount: bookings.length,
        clientsCount: clients.length,
        reviewData
      })

      calculateStats(bookings, clients, reviewData)
      calculateBookingsByStatus(bookings)
      calculatePopularServices(bookings)
      setRecentBookings(bookings.slice(0, 5))
      setReviewStats(reviewData)

      setLoading(false)
      console.log('✅ Dane załadowane pomyślnie')
    } catch (error) {
      console.error('❌ Błąd pobierania danych:', error)
      console.error('Error details:', error.response?.data || error.message)
      setLoading(false)
    }
  }

  const calculateStats = (bookings, clients, reviewData) => {
    const totalRevenue = bookings
      .filter(b => b.cost)
      .reduce((sum, b) => sum + parseFloat(b.cost), 0)

    const calculatedStats = {
      totalBookings: bookings.length,
      totalClients: clients.filter(c => c.role === 'client').length,
      totalRevenue: totalRevenue.toFixed(2),
      avgRating: reviewData.average_rating ? parseFloat(reviewData.average_rating).toFixed(1) : 'Brak'
    }

    console.log(' Obliczone statystyki:', calculatedStats)
    setStats(calculatedStats)
  }

  const calculateBookingsByStatus = (bookings) => {
    const statusCounts = {
      pending: 0,
      confirmed: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0
    }

    bookings.forEach(booking => {
      if (statusCounts.hasOwnProperty(booking.status)) {
        statusCounts[booking.status]++
      }
    })

    console.log('📊 Rezerwacje według statusu:', statusCounts)
    setBookingsByStatus(statusCounts)
  }

  const calculatePopularServices = (bookings) => {
    const serviceCounts = {}

    bookings.forEach(booking => {
      
      if (booking.service && booking.service.name) {
        const serviceName = booking.service.name
        serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1
      } else if (booking.service === null) {
        
        serviceCounts['Nieokreślona'] = (serviceCounts['Nieokreślona'] || 0) + 1
      }
    })

    const sorted = Object.entries(serviceCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    console.log('📊 Najpopularniejsze usługi:', sorted)
    setPopularServices(sorted)
  }

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Oczekuje',
      confirmed: 'Potwierdzona',
      in_progress: 'W trakcie',
      completed: 'Ukończona',
      cancelled: 'Anulowana'
    }
    return labels[status] || status
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      confirmed: '#2196f3',
      in_progress: '#ff9800',
      completed: '#4caf50',
      cancelled: '#f44336'
    }
    return colors[status] || '#999'
  }

  if (!isAdmin) {
    return null
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <p>Ładowanie statystyk...</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <h1>Dashboard - Statystyki</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{stats.totalBookings}</h3>
            <p>Wszystkie rezerwacje</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.totalClients}</h3>
            <p>Klienci</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>{stats.totalRevenue} zł</h3>
            <p>Łączne przychody</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <h3>{stats.avgRating}</h3>
            <p>Średnia ocena</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Rezerwacje według statusu</h2>
        <div className="status-bars">
          {Object.entries(bookingsByStatus).map(([status, count]) => {
            const total = Object.values(bookingsByStatus).reduce((a, b) => a + b, 0)
            const percentage = total > 0 ? (count / total * 100).toFixed(1) : 0

            return (
              <div key={status} className="status-bar-item">
                <div className="status-bar-label">
                  <span>{getStatusLabel(status)}</span>
                  <span className="status-count">{count}</span>
                </div>
                <div className="status-bar-track">
                  <div
                    className="status-bar-fill"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: getStatusColor(status)
                    }}
                  />
                </div>
                <span className="status-percentage">{percentage}%</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="dashboard-row">
        
        <div className="dashboard-section">
          <h2>Najpopularniejsze usługi</h2>
          {popularServices.length > 0 ? (
            <div className="popular-services-list">
              {popularServices.map((service, index) => (
                <div key={index} className="popular-service-item">
                  <span className="service-rank">#{index + 1}</span>
                  <span className="service-name">{service.name}</span>
                  <span className="service-count">{service.count} wizyt</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">Brak danych o usługach</p>
          )}
        </div>

        {reviewStats && reviewStats.total_reviews > 0 && (
          <div className="dashboard-section">
            <h2>Statystyki opinii</h2>
            <div className="review-stats">
              <div className="review-stat-item">
                <span className="review-label">Łącznie opinii:</span>
                <span className="review-value">{reviewStats.total_reviews}</span>
              </div>
              <div className="review-stat-item">
                <span className="review-label">⭐⭐⭐⭐⭐ (5 gwiazdek):</span>
                <span className="review-value">{reviewStats.five_star}</span>
              </div>
              <div className="review-stat-item">
                <span className="review-label">⭐⭐⭐⭐ (4 gwiazdki):</span>
                <span className="review-value">{reviewStats.four_star}</span>
              </div>
              <div className="review-stat-item">
                <span className="review-label">⭐⭐⭐ (3 gwiazdki):</span>
                <span className="review-value">{reviewStats.three_star}</span>
              </div>
              <div className="review-stat-item">
                <span className="review-label">⭐⭐ (2 gwiazdki):</span>
                <span className="review-value">{reviewStats.two_star}</span>
              </div>
              <div className="review-stat-item">
                <span className="review-label">⭐ (1 gwiazdka):</span>
                <span className="review-value">{reviewStats.one_star}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="dashboard-section">
        <h2>Ostatnie rezerwacje</h2>
        {recentBookings.length > 0 ? (
          <div className="recent-bookings-table">
            <table>
              <thead>
                <tr>
                  <th>Klient</th>
                  <th>Usługa</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Koszt</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(booking => (
                  <tr key={booking.id}>
                    <td>{booking.client.firstName} {booking.client.lastName}</td>
                    <td>{booking.service ? booking.service.name : 'Nieokreślona'}</td>
                    <td>{booking.preferredDate} {booking.preferredTime}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(booking.status) }}
                      >
                        {getStatusLabel(booking.status)}
                      </span>
                    </td>
                    <td>{booking.cost ? `${booking.cost} zł` : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-data">Brak rezerwacji</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard
