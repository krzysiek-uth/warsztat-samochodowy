const express = require('express')
const router = express.Router()
const { runQuery, getAll, getOne } = require('../config/database')
const { requireAdmin } = require('../middleware/auth')

router.get('/', async (req, res) => {
  try {
    const { date } = req.query

    let query = `
      SELECT * FROM available_slots
      WHERE is_available = 1
        AND date >= date('now')
    `
    const params = []

    if (date) {
      query += ' AND date = ?'
      params.push(date)
    }

    query += ' ORDER BY date, time_slot'

    const slots = await getAll(query, params)
    res.json({
      success: true,
      count: slots.length,
      slots: slots
    })
  } catch (error) {
    console.error('Błąd pobierania slotów:', error)
    res.status(500).json({ error: 'Nie udało się pobrać dostępnych terminów' })
  }
})

router.get('/dates', async (req, res) => {
  try {
    const dates = await getAll(`
      SELECT DISTINCT date
      FROM available_slots
      WHERE is_available = 1
        AND date >= date('now')
      ORDER BY date
    `)
    res.json({
      success: true,
      count: dates.length,
      dates: dates.map(d => d.date)
    })
  } catch (error) {
    console.error('Błąd pobierania dat:', error)
    res.status(500).json({ error: 'Nie udało się pobrać dat' })
  }
})

router.get('/date/:date', async (req, res) => {
  try {
    const { date } = req.params
    const slots = await getAll(
      `SELECT * FROM available_slots
       WHERE date = ? AND is_available = 1
       ORDER BY time_slot`,
      [date]
    )
    res.json({
      success: true,
      count: slots.length,
      slots: slots
    })
  } catch (error) {
    console.error('Błąd pobierania slotów:', error)
    res.status(500).json({ error: 'Nie udało się pobrać dostępnych godzin' })
  }
})

router.post('/reserve', async (req, res) => {
  try {
    const { date, timeSlot } = req.body

    if (!date || !timeSlot) {
      return res.status(400).json({ error: 'Data i godzina są wymagane' })
    }

    const slot = await getOne(
      'SELECT * FROM available_slots WHERE date = ? AND time_slot = ?',
      [date, timeSlot]
    )

    if (!slot) {
      return res.status(404).json({ error: 'Slot nie istnieje' })
    }

    if (slot.is_available === 0) {
      return res.status(400).json({ error: 'Ten termin jest już zajęty' })
    }

    await runQuery(
      'UPDATE available_slots SET is_available = 0 WHERE date = ? AND time_slot = ?',
      [date, timeSlot]
    )

    res.json({ message: 'Slot zarezerwowany pomyślnie' })
  } catch (error) {
    console.error('Błąd rezerwacji slotu:', error)
    res.status(500).json({ error: 'Nie udało się zarezerwować terminu' })
  }
})

router.post('/release', async (req, res) => {
  try {
    const { date, timeSlot } = req.body

    if (!date || !timeSlot) {
      return res.status(400).json({ error: 'Data i godzina są wymagane' })
    }

    await runQuery(
      'UPDATE available_slots SET is_available = 1 WHERE date = ? AND time_slot = ?',
      [date, timeSlot]
    )

    res.json({ message: 'Slot zwolniony pomyślnie' })
  } catch (error) {
    console.error('Błąd zwalniania slotu:', error)
    res.status(500).json({ error: 'Nie udało się zwolnić terminu' })
  }
})

router.post('/generate', requireAdmin, async (req, res) => {
  try {
    const { days = 30 } = req.body

    const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']
    const today = new Date()
    let slotsAdded = 0

    for (let i = 0; i < days; i++) {
      const currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      const dayOfWeek = currentDate.getDay()
      if (dayOfWeek === 0 || dayOfWeek === 6) continue

      const dateStr = currentDate.toISOString().split('T')[0]

      for (const timeSlot of timeSlots) {
        try {
          await runQuery(
            'INSERT OR IGNORE INTO available_slots (date, time_slot, is_available) VALUES (?, ?, ?)',
            [dateStr, timeSlot, 1]
          )
          slotsAdded++
        } catch (err) {
        }
      }
    }

    res.json({
      message: `Wygenerowano ${slotsAdded} nowych slotów na ${days} dni`,
      slotsAdded
    })
  } catch (error) {
    console.error('Błąd generowania slotów:', error)
    res.status(500).json({ error: 'Nie udało się wygenerować slotów' })
  }
})

module.exports = router
