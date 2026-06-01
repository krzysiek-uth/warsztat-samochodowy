

const express = require('express')
const router = express.Router()
const { runQuery, getAll, getOne } = require('../config/database')
const { requireAuth, requireAdmin } = require('../middleware/auth')

router.get('/', async (req, res) => {
  try {
    const reviews = await getAll(`
      SELECT
        r.*,
        u.first_name,
        u.last_name,
        COALESCE(s.name, 'Nieokreślona usługa') as service_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      LEFT JOIN services s ON r.service_id = s.id
      ORDER BY r.created_at DESC
    `)
    res.json(reviews)
  } catch (error) {
    console.error('Błąd pobierania opinii:', error)
    res.status(500).json({ error: 'Nie udało się pobrać opinii' })
  }
})

router.get('/my', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId
    const reviews = await getAll(`
      SELECT
        r.*,
        COALESCE(s.name, 'Nieokreślona usługa') as service_name,
        b.preferred_date,
        b.preferred_time,
        b.car_brand,
        b.car_model
      FROM reviews r
      LEFT JOIN services s ON r.service_id = s.id
      LEFT JOIN bookings b ON r.booking_id = b.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `, [userId])
    res.json(reviews)
  } catch (error) {
    console.error('Błąd pobierania opinii:', error)
    res.status(500).json({ error: 'Nie udało się pobrać opinii' })
  }
})

router.get('/service/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params
    const reviews = await getAll(`
      SELECT
        r.*,
        u.first_name,
        u.last_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.service_id = ?
      ORDER BY r.created_at DESC
    `, [serviceId])
    res.json(reviews)
  } catch (error) {
    console.error('Błąd pobierania opinii:', error)
    res.status(500).json({ error: 'Nie udało się pobrać opinii' })
  }
})

router.get('/stats', async (req, res) => {
  try {
    const stats = await getOne(`
      SELECT
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
      FROM reviews
    `)
    res.json(stats)
  } catch (error) {
    console.error('Błąd pobierania statystyk:', error)
    res.status(500).json({ error: 'Nie udało się pobrać statystyk' })
  }
})

router.post('/', requireAuth, async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body
    const userId = req.session.userId

    if (!bookingId || !rating) {
      return res.status(400).json({ error: 'booking_id i rating są wymagane' })
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Ocena musi być od 1 do 5' })
    }

    const booking = await getOne(
      'SELECT * FROM bookings WHERE id = ? AND user_id = ?',
      [bookingId, userId]
    )

    if (!booking) {
      return res.status(404).json({ error: 'Nie znaleziono rezerwacji' })
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ error: 'Możesz dodać opinię tylko po zakończeniu wizyty' })
    }

    const existingReview = await getOne(
      'SELECT * FROM reviews WHERE booking_id = ?',
      [bookingId]
    )

    if (existingReview) {
      return res.status(400).json({ error: 'Opinia dla tej wizyty już istnieje' })
    }

    let serviceId = booking.service_id
    if (!serviceId) {
      const firstService = await getOne('SELECT id FROM services LIMIT 1')
      serviceId = firstService ? firstService.id : 1
    }

    const result = await runQuery(
      'INSERT INTO reviews (booking_id, user_id, service_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [bookingId, userId, serviceId, rating, comment]
    )

    res.status(201).json({
      message: 'Dziękujemy za opinię!',
      reviewId: result.id
    })
  } catch (error) {
    console.error('Błąd dodawania opinii:', error)
    console.error('Error details:', error.message)
    console.error('Stack:', error.stack)
    res.status(500).json({ error: 'Nie udało się dodać opinii: ' + error.message })
  }
})

router.get('/can-review/:bookingId', requireAuth, async (req, res) => {
  try {
    const { bookingId } = req.params
    const userId = req.session.userId

    const booking = await getOne(
      'SELECT * FROM bookings WHERE id = ? AND user_id = ?',
      [bookingId, userId]
    )

    if (!booking) {
      return res.json({ canReview: false, reason: 'not_found' })
    }

    if (booking.status !== 'completed') {
      return res.json({ canReview: false, reason: 'not_completed' })
    }

    const existingReview = await getOne(
      'SELECT * FROM reviews WHERE booking_id = ?',
      [bookingId]
    )

    if (existingReview) {
      return res.json({ canReview: false, reason: 'already_reviewed' })
    }

    res.json({ canReview: true })
  } catch (error) {
    console.error('Błąd sprawdzania możliwości dodania opinii:', error)
    res.status(500).json({ error: 'Błąd serwera' })
  }
})

router.post('/:id/response', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { response } = req.body

    if (!response || response.trim() === '') {
      return res.status(400).json({ error: 'Odpowiedź nie może być pusta' })
    }

    const review = await getOne('SELECT * FROM reviews WHERE id = ?', [id])

    if (!review) {
      return res.status(404).json({ error: 'Nie znaleziono opinii' })
    }

    await runQuery(
      'UPDATE reviews SET admin_response = ?, admin_response_date = CURRENT_TIMESTAMP WHERE id = ?',
      [response, id]
    )

    res.json({
      success: true,
      message: 'Odpowiedź została dodana'
    })
  } catch (error) {
    console.error('Błąd dodawania odpowiedzi:', error)
    res.status(500).json({ error: 'Nie udało się dodać odpowiedzi' })
  }
})

router.delete('/:id/response', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params

    await runQuery(
      'UPDATE reviews SET admin_response = NULL, admin_response_date = NULL WHERE id = ?',
      [id]
    )

    res.json({
      success: true,
      message: 'Odpowiedź została usunięta'
    })
  } catch (error) {
    console.error('Błąd usuwania odpowiedzi:', error)
    res.status(500).json({ error: 'Nie udało się usunąć odpowiedzi' })
  }
})

module.exports = router
