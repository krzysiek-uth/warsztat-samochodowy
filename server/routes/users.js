

const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const { requireAuth, requireAdmin } = require('../middleware/auth')
const { getAll, getOne, runQuery } = require('../config/database')

router.post('/create-admin', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, secretKey } = req.body

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Wszystkie pola są wymagane'
      })
    }

    const ADMIN_SECRET_KEY = 'WARSZTAT_ADMIN_2024' 
    if (secretKey !== ADMIN_SECRET_KEY) {
      return res.status(403).json({
        error: 'Invalid secret key',
        message: 'Nieprawidłowy klucz dostępu'
      })
    }

    const { getOne } = require('../config/database')
    const existingUser = await getOne('SELECT id FROM users WHERE email = ?', [email])
    if (existingUser) {
      return res.status(409).json({
        error: 'Email already exists',
        message: 'Użytkownik z tym adresem email już istnieje'
      })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const result = await runQuery(
      'INSERT INTO users (first_name, last_name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
      [firstName, lastName, email, passwordHash, phone || null, 'admin']
    )

    res.status(201).json({
      success: true,
      message: 'Administrator utworzony pomyślnie',
      admin: {
        id: result.id,
        firstName,
        lastName,
        email,
        role: 'admin'
      }
    })
  } catch (error) {
    console.error('Create admin error:', error)
    res.status(500).json({
      error: 'Internal server error',
      message: 'Błąd podczas tworzenia administratora'
    })
  }
})

router.get('/', requireAdmin, async (req, res) => {
  try {
    const users = await getAll(
      'SELECT id, first_name, last_name, email, phone, role, created_at FROM users'
    )

    res.json({
      success: true,
      count: users.length,
      users
    })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({
      error: 'Internal server error',
      message: 'Błąd pobierania użytkowników'
    })
  }
})

router.put('/profile', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId
    const { firstName, lastName, email, phone, registrationNumber } = req.body

    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Imię, nazwisko i email są wymagane'
      })
    }

    const existingUser = await getOne(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, userId]
    )
    if (existingUser) {
      return res.status(409).json({
        error: 'Email already exists',
        message: 'Podany adres email jest już używany przez innego użytkownika'
      })
    }

    await runQuery(
      'UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, registration_number = ? WHERE id = ?',
      [firstName, lastName, email, phone || null, registrationNumber || null, userId]
    )

    const updatedUser = await getOne(
      'SELECT id, first_name, last_name, email, phone, registration_number, role FROM users WHERE id = ?',
      [userId]
    )

    res.json({
      success: true,
      message: 'Profil został zaktualizowany pomyślnie',
      user: {
        id: updatedUser.id,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        registrationNumber: updatedUser.registration_number,
        role: updatedUser.role
      }
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({
      error: 'Internal server error',
      message: 'Błąd podczas aktualizacji profilu'
    })
  }
})

module.exports = router
