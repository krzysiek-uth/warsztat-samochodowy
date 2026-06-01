

const express = require('express')
const router = express.Router()
const { getAll } = require('../config/database')

router.get('/', async (req, res) => {
  try {
    const services = await getAll('SELECT * FROM services ORDER BY category, name')

    res.json({
      success: true,
      count: services.length,
      services
    })
  } catch (error) {
    console.error('Get services error:', error)
    res.status(500).json({
      error: 'Internal server error',
      message: 'Błąd pobierania usług'
    })
  }
})

module.exports = router
