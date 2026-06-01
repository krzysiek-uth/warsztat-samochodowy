

const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const cors = require('cors')
const path = require('path')

const authRoutes = require('./routes/auth')
const bookingRoutes = require('./routes/bookings')
const userRoutes = require('./routes/users')
const serviceRoutes = require('./routes/services')
const reviewRoutes = require('./routes/reviews')
const slotRoutes = require('./routes/slots')

const { initializeDatabase } = require('./config/database')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({
  secret: 'warsztat-secret-key-2024',  
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,  
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24  
  }
}))

app.get('/api/test', (req, res) => {
  res.json({
    message: 'Backend działa!',
    timestamp: new Date().toISOString()
  })
})

app.post('/api/create-admin-direct', async (req, res) => {
  const bcrypt = require('bcrypt')
  const { runQuery, getOne } = require('./config/database')

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

app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use('/api/auth', authRoutes)        
app.use('/api/bookings', bookingRoutes) 
app.use('/api/users', userRoutes)       
app.use('/api/services', serviceRoutes) 
app.use('/api/reviews', reviewRoutes)   
app.use('/api/slots', slotRoutes)       

app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint nie znaleziony',
    path: req.path
  })
})

app.use((err, req, res, next) => {
  console.error('ERROR:', err.stack)
  res.status(500).json({
    error: 'Wystąpił błąd serwera',
    message: err.message
  })
})

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n${'='.repeat(50)}`)
      console.log(` Serwer Backend uruchomiony!`)
      console.log(` Port: ${PORT}`)
      console.log(` URL: http://localhost:${PORT}`)
      console.log(` Test endpoint: http://localhost:${PORT}/api/test`)
      console.log(`${'='.repeat(50)}\n`)
    })
  })
  .catch(err => {
    console.error('❌ Błąd inicjalizacji bazy danych:', err)
    process.exit(1)
  })

module.exports = app
