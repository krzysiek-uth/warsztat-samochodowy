

const { runQuery, getOne, getAll } = require('../config/database')

async function createBooking(req, res) {
  try {
    const {
      serviceId,
      carBrand,
      carModel,
      preferredDate,
      preferredTime,
      notes
    } = req.body

    const userId = req.session.userId

    if (!carBrand || !carModel || !preferredDate || !preferredTime) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Marka, model, data i godzina są wymagane'
      })
    }

    const result = await runQuery(
      `INSERT INTO bookings
       (user_id, service_id, car_brand, car_model, preferred_date, preferred_time, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [userId, serviceId || null, carBrand, carModel, preferredDate, preferredTime, notes || null]
    )

    res.status(201).json({
      success: true,
      message: 'Rezerwacja utworzona pomyślnie',
      booking: {
        id: result.id,
        userId,
        serviceId,
        carBrand,
        carModel,
        preferredDate,
        preferredTime,
        notes,
        status: 'pending'
      }
    })

  } catch (error) {
    console.error('Create booking error:', error)
    res.status(500).json({
      error: 'Internal server error',
      message: 'Błąd podczas tworzenia rezerwacji'
    })
  }
}

async function getAllBookings(req, res) {
  try {
    const bookings = await getAll(`
      SELECT
        b.id, b.car_brand, b.car_model, b.preferred_date, b.preferred_time,
        b.notes, b.status, b.cost, b.estimated_completion_time, b.created_at,
        u.first_name, u.last_name, u.email, u.phone,
        s.name as service_name, s.category as service_category
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      LEFT JOIN services s ON b.service_id = s.id
      ORDER BY b.created_at DESC
    `)

    res.json({
      success: true,
      count: bookings.length,
      bookings: bookings.map(b => ({
        id: b.id,
        client: {
          firstName: b.first_name,
          lastName: b.last_name,
          email: b.email,
          phone: b.phone
        },
        service: b.service_name ? {
          name: b.service_name,
          category: b.service_category
        } : null,
        car: {
          brand: b.car_brand,
          model: b.car_model
        },
        preferredDate: b.preferred_date,
        preferredTime: b.preferred_time,
        notes: b.notes,
        status: b.status,
        cost: b.cost,
        estimatedCompletionTime: b.estimated_completion_time,
        createdAt: b.created_at
      }))
    })

  } catch (error) {
    console.error('Get all bookings error:', error)
    res.status(500).json({
      error: 'Internal server error',
      message: 'Błąd pobierania rezerwacji'
    })
  }
}

async function getMyBookings(req, res) {
  try {
    const userId = req.session.userId

    const bookings = await getAll(`
      SELECT
        b.id, b.car_brand, b.car_model, b.preferred_date, b.preferred_time,
        b.notes, b.status, b.cost, b.estimated_completion_time, b.created_at,
        s.name as service_name, s.category as service_category,
        s.price_min, s.price_max
      FROM bookings b
      LEFT JOIN services s ON b.service_id = s.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `, [userId])

    res.json({
      success: true,
      count: bookings.length,
      bookings: bookings.map(b => ({
        id: b.id,
        service: b.service_name ? {
          name: b.service_name,
          category: b.service_category,
          priceRange: `${b.price_min}-${b.price_max} zł`
        } : null,
        car: {
          brand: b.car_brand,
          model: b.car_model
        },
        preferredDate: b.preferred_date,
        preferredTime: b.preferred_time,
        notes: b.notes,
        status: b.status,
        cost: b.cost || 'Wycena w trakcie',
        estimatedCompletionTime: b.estimated_completion_time,
        createdAt: b.created_at
      }))
    })

  } catch (error) {
    console.error('Get my bookings error:', error)
    res.status(500).json({
      error: 'Internal server error',
      message: 'Błąd pobierania Twoich rezerwacji'
    })
  }
}

async function getBookingById(req, res) {
  try {
    const { id } = req.params
    const userId = req.session.userId
    const userRole = req.session.userRole

    const booking = await getOne(`
      SELECT
        b.*,
        u.first_name, u.last_name, u.email, u.phone,
        s.name as service_name
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      LEFT JOIN services s ON b.service_id = s.id
      WHERE b.id = ?
    `, [id])

    if (!booking) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Rezerwacja nie znaleziona'
      })
    }

    if (userRole !== 'admin' && booking.user_id !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Brak dostępu do tej rezerwacji'
      })
    }

    res.json({
      success: true,
      booking
    })

  } catch (error) {
    console.error('Get booking by ID error:', error)
    res.status(500).json({
      error: 'Internal server error',
      message: 'Błąd pobierania rezerwacji'
    })
  }
}

async function updateBooking(req, res) {
  try {
    const { id } = req.params
    const { carBrand, carModel, preferredDate, preferredTime, notes } = req.body
    const userId = req.session.userId
    const userRole = req.session.userRole

    const booking = await getOne('SELECT user_id FROM bookings WHERE id = ?', [id])
    if (!booking) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Rezerwacja nie znaleziona'
      })
    }

    if (userRole !== 'admin' && booking.user_id !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Brak dostępu do tej rezerwacji'
      })
    }

    await runQuery(
      `UPDATE bookings
       SET car_brand = ?, car_model = ?, preferred_date = ?, preferred_time = ?, notes = ?
       WHERE id = ?`,
      [carBrand, carModel, preferredDate, preferredTime, notes, id]
    )

    res.json({
      success: true,
      message: 'Rezerwacja zaktualizowana'
    })

  } catch (error) {
    console.error('Update booking error:', error)
    res.status(500).json({
      error: 'Internal server error',
      message: 'Błąd aktualizacji rezerwacji'
    })
  }
}

async function deleteBooking(req, res) {
  try {
    const { id } = req.params
    const userId = req.session.userId
    const userRole = req.session.userRole

    const booking = await getOne('SELECT user_id FROM bookings WHERE id = ?', [id])
    if (!booking) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Rezerwacja nie znaleziona'
      })
    }

    if (userRole !== 'admin' && booking.user_id !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Brak dostępu do tej rezerwacji'
      })
    }

    await runQuery('DELETE FROM bookings WHERE id = ?', [id])

    res.json({
      success: true,
      message: 'Rezerwacja usunięta'
    })

  } catch (error) {
    console.error('Delete booking error:', error)
    res.status(500).json({
      error: 'Internal server error',
      message: 'Błąd usuwania rezerwacji'
    })
  }
}

async function updateStatus(req, res) {
  try {
    const { id } = req.params
    const { status, cost, estimatedCompletionTime } = req.body

    const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Nieprawidłowy status'
      })
    }

    const booking = await getOne('SELECT id FROM bookings WHERE id = ?', [id])

    if (!booking) {
      return res.status(404).json({ error: 'Rezerwacja nie znaleziona' })
    }

    if (cost !== undefined && estimatedCompletionTime !== undefined) {
      await runQuery(
        'UPDATE bookings SET status = ?, cost = ?, estimated_completion_time = ? WHERE id = ?',
        [status, cost, estimatedCompletionTime, id]
      )
    } else if (cost !== undefined) {
      await runQuery(
        'UPDATE bookings SET status = ?, cost = ? WHERE id = ?',
        [status, cost, id]
      )
    } else if (estimatedCompletionTime !== undefined) {
      await runQuery(
        'UPDATE bookings SET status = ?, estimated_completion_time = ? WHERE id = ?',
        [status, estimatedCompletionTime, id]
      )
    } else {
      await runQuery(
        'UPDATE bookings SET status = ? WHERE id = ?',
        [status, id]
      )
    }

    res.json({
      success: true,
      message: 'Status zaktualizowany'
    })

  } catch (error) {
    console.error('Update status error:', error)
    res.status(500).json({
      error: 'Internal server error',
      message: 'Błąd zmiany statusu'
    })
  }
}

async function uploadImages(req, res) {
  try {
    const { id } = req.params
    const userId = req.session.userId
    const userRole = req.session.userRole

    const booking = await getOne('SELECT user_id FROM bookings WHERE id = ?', [id])
    if (!booking) {
      return res.status(404).json({ error: 'Rezerwacja nie znaleziona' })
    }

    if (userRole !== 'admin' && booking.user_id !== userId) {
      return res.status(403).json({ error: 'Brak dostępu do tej rezerwacji' })
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Nie przesłano żadnych plików' })
    }

    const uploadedImages = []
    for (const file of req.files) {
      const result = await runQuery(
        'INSERT INTO booking_images (booking_id, image_path) VALUES (?, ?)',
        [id, `/uploads/booking-images/${file.filename}`]
      )
      uploadedImages.push({
        id: result.id,
        path: `/uploads/booking-images/${file.filename}`
      })
    }

    res.status(201).json({
      success: true,
      message: `Przesłano ${uploadedImages.length} zdjęć`,
      images: uploadedImages
    })

  } catch (error) {
    console.error('Upload images error:', error)
    res.status(500).json({
      error: 'Internal server error',
      message: 'Błąd przesyłania zdjęć'
    })
  }
}

async function getImages(req, res) {
  try {
    const { id } = req.params
    const userId = req.session.userId
    const userRole = req.session.userRole

    const booking = await getOne('SELECT user_id FROM bookings WHERE id = ?', [id])
    if (!booking) {
      return res.status(404).json({ error: 'Rezerwacja nie znaleziona' })
    }

    if (userRole !== 'admin' && booking.user_id !== userId) {
      return res.status(403).json({ error: 'Brak dostępu do tej rezerwacji' })
    }

    const images = await getAll(
      'SELECT id, image_path, uploaded_at FROM booking_images WHERE booking_id = ? ORDER BY uploaded_at',
      [id]
    )

    res.json({
      success: true,
      count: images.length,
      images
    })

  } catch (error) {
    console.error('Get images error:', error)
    res.status(500).json({
      error: 'Internal server error',
      message: 'Błąd pobierania zdjęć'
    })
  }
}

module.exports = {
  createBooking,
  getAllBookings,
  getMyBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  updateStatus,
  uploadImages,
  getImages
}
