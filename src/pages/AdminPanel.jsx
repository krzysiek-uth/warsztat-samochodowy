import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { getAllBookings, updateBookingStatus, getUsers, getServices } from '../services/api'
import '../styles/AdminPanel.css'

function AdminPanel() {
  const { isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState('bookings')
  const [statusFilter, setStatusFilter] = useState('all')

  const [bookings, setBookings] = useState([])
  const [clients, setClients] = useState([])
  const [services, setServices] = useState([])
  const [bookingImages, setBookingImages] = useState({})

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [lightboxImage, setLightboxImage] = useState(null)
  const [lightboxImages, setLightboxImages] = useState([]) 
  const [lightboxIndex, setLightboxIndex] = useState(0) 

  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookings()
    } else if (activeTab === 'clients') {
      fetchClients()
    } else if (activeTab === 'services') {
      fetchServices()
    }
  }, [activeTab])

  const fetchBookings = async () => {
    setLoading(true)
    setError(null)

    const result = await getAllBookings()

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

  const fetchClients = async () => {
    setLoading(true)
    setError(null)

    const result = await getUsers()

    if (result.success) {
      setClients(result.data.users)
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  const fetchServices = async () => {
    setLoading(true)
    setError(null)

    const result = await getServices()

    if (result.success) {
      setServices(result.data.services)
    } else {
      setError(result.error)
    }

    setLoading(false)
  }

  const handleStatusChange = async (bookingId, newStatus) => {
    const result = await updateBookingStatus(bookingId, newStatus)

    if (result.success) {
      
      fetchBookings()
    } else {
      alert('Błąd zmiany statusu: ' + result.error)
    }
  }

  const handleConfirmWithCost = async (bookingId) => {
    const cost = prompt('Podaj koszt naprawy (zł):')
    if (!cost) return

    const estimatedTime = prompt('Podaj szacowany czas realizacji (np. "2 dni", "5 godzin"):')
    if (!estimatedTime) return

    const result = await updateBookingStatus(bookingId, 'confirmed', parseFloat(cost), estimatedTime)
    if (result.success) {
      fetchBookings()
    } else {
      alert('Błąd potwierdzania rezerwacji: ' + result.error)
    }
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

  if (!isAdmin) {
    return (
      <div className="admin-panel">
        <div className="access-denied">
          <h1>❌ Brak dostępu</h1>
          <p>Tylko administratorzy mają dostęp do tego panelu.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <h1>Panel Administracyjny</h1>

      <div className="admin-tabs">
        <button
          className={activeTab === 'bookings' ? 'active' : ''}
          onClick={() => setActiveTab('bookings')}
        >
          Rezerwacje ({bookings.length})
        </button>
        <button
          className={activeTab === 'clients' ? 'active' : ''}
          onClick={() => setActiveTab('clients')}
        >
          Klienci ({clients.length})
        </button>
        <button
          className={activeTab === 'services' ? 'active' : ''}
          onClick={() => setActiveTab('services')}
        >
          Usługi ({services.length})
        </button>
      </div>

      {loading && <div className="loading">Ładowanie...</div>}

      {error && <div className="error-message">{error}</div>}

      <div className="admin-content">
        
        {activeTab === 'bookings' && !loading && (
          <section>
            <h2>Wszystkie rezerwacje</h2>

            <div className="status-filters">
              <button
                className={statusFilter === 'all' ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setStatusFilter('all')}
              >
                Wszystkie ({bookings.length})
              </button>
              <button
                className={statusFilter === 'pending' ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setStatusFilter('pending')}
              >
                Oczekujące ({bookings.filter(b => b.status === 'pending').length})
              </button>
              <button
                className={statusFilter === 'confirmed' ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setStatusFilter('confirmed')}
              >
                Potwierdzone ({bookings.filter(b => b.status === 'confirmed').length})
              </button>
              <button
                className={statusFilter === 'in_progress' ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setStatusFilter('in_progress')}
              >
                W trakcie ({bookings.filter(b => b.status === 'in_progress').length})
              </button>
              <button
                className={statusFilter === 'completed' ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setStatusFilter('completed')}
              >
                Zakończone ({bookings.filter(b => b.status === 'completed').length})
              </button>
              <button
                className={statusFilter === 'cancelled' ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setStatusFilter('cancelled')}
              >
                Anulowane ({bookings.filter(b => b.status === 'cancelled').length})
              </button>
            </div>

            <div className="bookings-list">
              {bookings.filter(booking => statusFilter === 'all' || booking.status === statusFilter).length === 0 ? (
                <p className="no-data">Brak rezerwacji w tej kategorii</p>
              ) : (
                bookings.filter(booking => statusFilter === 'all' || booking.status === statusFilter).map(booking => (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-header-admin">
                      <h3>{booking.client.firstName} {booking.client.lastName}</h3>
                      <span className={`status-badge status-${booking.status.replace('_', '-')}`}>
                        {getStatusLabel(booking.status)}
                      </span>
                    </div>

                    <div className="booking-details-admin">
                      <p><strong>Email:</strong> {booking.client.email}</p>
                      <p><strong>Telefon:</strong> {booking.client.phone || 'Brak'}</p>
                      <p><strong>Pojazd:</strong> {booking.car.brand} {booking.car.model}</p>
                      <p><strong>Data:</strong> {booking.preferredDate} {booking.preferredTime}</p>

                      {booking.service && (
                        <p><strong>Usługa:</strong> {booking.service.name}</p>
                      )}

                      {booking.notes && (
                        <p><strong>Uwagi:</strong> {booking.notes}</p>
                      )}

                      <p className="booking-cost-admin">
                        <strong>Koszt:</strong> {booking.cost ? `${booking.cost} zł` : 'Nie ustalono'}
                      </p>

                      {booking.estimatedCompletionTime && (
                        <p className="booking-completion-time">
                          <strong>Szacowany czas realizacji:</strong> {booking.estimatedCompletionTime}
                        </p>
                      )}

                      <p className="booking-created">
                        <small>Utworzono: {new Date(booking.createdAt).toLocaleString('pl-PL')}</small>
                      </p>
                    </div>

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

                    <div className="booking-actions">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            className="btn btn-small btn-success"
                            onClick={() => handleConfirmWithCost(booking.id)}
                          >
                            Potwierdź + Wycena
                          </button>
                          <button
                            className="btn btn-small btn-danger"
                            onClick={() => handleStatusChange(booking.id, 'cancelled')}
                          >
                            Anuluj
                          </button>
                        </>
                      )}

                      {booking.status === 'confirmed' && (
                        <button
                          className="btn btn-small"
                          onClick={() => handleStatusChange(booking.id, 'in_progress')}
                        >
                          Rozpocznij naprawę
                        </button>
                      )}

                      {booking.status === 'in_progress' && (
                        <button
                          className="btn btn-small btn-success"
                          onClick={() => handleStatusChange(booking.id, 'completed')}
                        >
                          Zakończ
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {activeTab === 'clients' && !loading && (
          <section>
            <h2>Lista klientów</h2>
            <div className="clients-list">
              {clients.length === 0 ? (
                <p className="no-data">Brak klientów w systemie</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Imię i nazwisko</th>
                      <th>Email</th>
                      <th>Telefon</th>
                      <th>Rola</th>
                      <th>Data rejestracji</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map(client => (
                      <tr key={client.id}>
                        <td>{client.id}</td>
                        <td>{client.first_name} {client.last_name}</td>
                        <td>{client.email}</td>
                        <td>{client.phone || 'Brak'}</td>
                        <td>
                          <span className={`role-badge role-${client.role}`}>
                            {client.role === 'admin' ? 'Administrator' : 'Klient'}
                          </span>
                        </td>
                        <td>{new Date(client.created_at).toLocaleDateString('pl-PL')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {activeTab === 'services' && !loading && (
          <section>
            <h2>Lista usług</h2>
            <div className="services-list-admin">
              {services.length === 0 ? (
                <p className="no-data">Brak usług w systemie</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nazwa</th>
                      <th>Kategoria</th>
                      <th>Cena (zł)</th>
                      <th>Opis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map(service => (
                      <tr key={service.id}>
                        <td>{service.id}</td>
                        <td><strong>{service.name}</strong></td>
                        <td>
                          <span className="category-badge">{service.category}</span>
                        </td>
                        <td>{service.price_min} - {service.price_max} zł</td>
                        <td>{service.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

      </div>

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

export default AdminPanel
