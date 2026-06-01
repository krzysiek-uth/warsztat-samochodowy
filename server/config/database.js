

const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const DB_PATH = path.join(__dirname, '../../database/warsztat.db')

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Błąd połączenia z bazą danych:', err.message)
  } else {
    console.log('✅ Połączono z bazą danych SQLite')
  }
})

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          phone TEXT,
          registration_number TEXT,
          role TEXT DEFAULT 'client',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('❌ Błąd tworzenia tabeli users:', err)
          reject(err)
        } else {
          console.log('✅ Tabela users gotowa')
        }
      })

      db.run(`
        CREATE TABLE IF NOT EXISTS services (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          description TEXT,
          price_min DECIMAL(10, 2),
          price_max DECIMAL(10, 2),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('❌ Błąd tworzenia tabeli services:', err)
          reject(err)
        } else {
          console.log('✅ Tabela services gotowa')
        }
      })

      db.run(`
        CREATE TABLE IF NOT EXISTS bookings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          service_id INTEGER,
          car_brand TEXT NOT NULL,
          car_model TEXT NOT NULL,
          preferred_date DATE NOT NULL,
          preferred_time TIME NOT NULL,
          notes TEXT,
          status TEXT DEFAULT 'pending',
          cost DECIMAL(10, 2),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (service_id) REFERENCES services(id)
        )
      `, (err) => {
        if (err) {
          console.error('❌ Błąd tworzenia tabeli bookings:', err)
          reject(err)
        } else {
          console.log('✅ Tabela bookings gotowa')
        }
      })

      db.run(`
        CREATE TABLE IF NOT EXISTS booking_images (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          booking_id INTEGER NOT NULL,
          image_path TEXT NOT NULL,
          uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) {
          console.error('❌ Błąd tworzenia tabeli booking_images:', err)
          reject(err)
        } else {
          console.log('✅ Tabela booking_images gotowa')
        }
      })

      db.run(`
        CREATE TABLE IF NOT EXISTS reviews (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          booking_id INTEGER NOT NULL UNIQUE,
          user_id INTEGER NOT NULL,
          service_id INTEGER NOT NULL,
          rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
          comment TEXT,
          admin_response TEXT,
          admin_response_date DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (service_id) REFERENCES services(id)
        )
      `, (err) => {
        if (err) {
          console.error('❌ Błąd tworzenia tabeli reviews:', err)
          reject(err)
        } else {
          console.log('✅ Tabela reviews gotowa')
        }
      })

      db.run(`
        CREATE TABLE IF NOT EXISTS available_slots (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date DATE NOT NULL,
          time_slot TEXT NOT NULL,
          is_available INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(date, time_slot)
        )
      `, (err) => {
        if (err) {
          console.error('❌ Błąd tworzenia tabeli available_slots:', err)
          reject(err)
        } else {
          console.log('✅ Tabela available_slots gotowa')

          insertInitialServices()

          generateAvailableSlots()

          resolve()
        }
      })
    })
  })
}

function insertInitialServices() {
  db.get('SELECT COUNT(*) as count FROM services', (err, row) => {
    if (row.count === 0) {
      const services = [
        { name: 'Wymiana oleju i filtrów', category: 'mechanika', description: 'Wymiana oleju silnikowego wraz z filtrem oleju i powietrza', price_min: 150, price_max: 250 },
        { name: 'Wymiana klocków hamulcowych', category: 'mechanika', description: 'Wymiana klocków hamulcowych przednich lub tylnych', price_min: 200, price_max: 400 },
        { name: 'Wymiana rozrządu', category: 'mechanika', description: 'Wymiana paska/łańcucha rozrządu wraz z rolkami', price_min: 800, price_max: 1500 },
        { name: 'Diagnostyka komputerowa', category: 'diagnostyka', description: 'Kompleksowa diagnostyka układów elektronicznych pojazdu', price_min: 100, price_max: 200 },
        { name: 'Przegląd techniczny', category: 'diagnostyka', description: 'Kontrola stanu technicznego pojazdu przed badaniem technicznym', price_min: 150, price_max: 150 },
        { name: 'Naprawa instalacji elektrycznej', category: 'elektryk', description: 'Diagnoza i naprawa usterek w instalacji elektrycznej', price_min: 200, price_max: 600 },
        { name: 'Wymiana akumulatora', category: 'elektryk', description: 'Wymiana akumulatora wraz z diagnostyką układu ładowania', price_min: 300, price_max: 800 },
        { name: 'Serwis klimatyzacji', category: 'klimatyzacja', description: 'Odgrzybianie, dezynfekcja i uzupełnienie czynnika', price_min: 200, price_max: 350 }
      ]

      const stmt = db.prepare('INSERT INTO services (name, category, description, price_min, price_max) VALUES (?, ?, ?, ?, ?)')
      services.forEach(service => {
        stmt.run(service.name, service.category, service.description, service.price_min, service.price_max)
      })
      stmt.finalize()

      console.log('✅ Dodano przykładowe usługi do bazy')
    }
  })
}

function generateAvailableSlots() {
  db.get('SELECT COUNT(*) as count FROM available_slots', (err, row) => {
    if (row.count === 0) {
      const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']
      const today = new Date()

      const stmt = db.prepare('INSERT OR IGNORE INTO available_slots (date, time_slot, is_available) VALUES (?, ?, ?)')

      for (let i = 0; i < 30; i++) {
        const currentDate = new Date(today)
        currentDate.setDate(today.getDate() + i)

        const dayOfWeek = currentDate.getDay()
        if (dayOfWeek === 0 || dayOfWeek === 6) continue

        const dateStr = currentDate.toISOString().split('T')[0]

        timeSlots.forEach(timeSlot => {
          stmt.run(dateStr, timeSlot, 1)
        })
      }

      stmt.finalize()
      console.log('✅ Wygenerowano dostępne sloty czasowe na 30 dni')
    }
  })
}

function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err)
      else resolve({ id: this.lastID, changes: this.changes })
    })
  })
}

function getOne(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err)
      else resolve(row)
    })
  })
}

function getAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

module.exports = {
  db,
  initializeDatabase,
  runQuery,
  getOne,
  getAll
}
