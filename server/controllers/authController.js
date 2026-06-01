

const bcrypt = require('bcrypt')
const { runQuery, getOne } = require('../config/database')

async function register(req, res) {
  try {
    const { firstName, lastName, email, password, phone } = req.body

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Wszystkie pola są wymagane'
      })
    }

    const existingUser = await getOne('SELECT id FROM users WHERE email = ?', [email])
    if (existingUser) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Użytkownik z tym adresem email już istnieje'
      })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const result = await runQuery(
      `INSERT INTO users (first_name, last_name, email, password_hash, phone, role)
       VALUES (?, ?, ?, ?, ?, 'client')`,
      [firstName, lastName, email, passwordHash, phone || null]
    )

    req.session.userId = result.id
    req.session.userRole = 'client'

    res.status(201).json({
      success: true,
      message: 'Rejestracja zakończona pomyślnie',
      user: {
        id: result.id,
        firstName,
        lastName,
        email,
        role: 'client'
      }
    })

  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({
      error: 'Internal server error',
      message: 'Błąd podczas rejestracji'
    })
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Email i hasło są wymagane'
      })
    }

    const user = await getOne(
      'SELECT id, first_name, last_name, email, password_hash, phone, registration_number, role FROM users WHERE email = ?',
      [email]
    )

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Nieprawidłowy email lub hasło'
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash)

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Nieprawidłowy email lub hasło'
      })
    }

    req.session.userId = user.id
    req.session.userRole = user.role

    res.json({
      success: true,
      message: 'Zalogowano pomyślnie',
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        registrationNumber: user.registration_number,
        role: user.role
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      error: 'Internal server error',
      message: 'Błąd podczas logowania'
    })
  }
}

function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Błąd podczas wylogowania'
      })
    }

    res.json({
      success: true,
      message: 'Wylogowano pomyślnie'
    })
  })
}

async function getCurrentUser(req, res) {
  try {
    const user = await getOne(
      'SELECT id, first_name, last_name, email, phone, registration_number, role FROM users WHERE id = ?',
      [req.session.userId]
    )

    if (!user) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Użytkownik nie znaleziony'
      })
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        registrationNumber: user.registration_number,
        role: user.role
      }
    })

  } catch (error) {
    console.error('Get current user error:', error)
    res.status(500).json({
      error: 'Internal server error',
      message: 'Błąd pobierania danych użytkownika'
    })
  }
}

module.exports = {
  register,
  login,
  logout,
  getCurrentUser
}
