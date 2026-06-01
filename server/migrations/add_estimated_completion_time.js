

const { db } = require('../config/database')

function up() {
  return new Promise((resolve, reject) => {
    db.run(`
      ALTER TABLE bookings
      ADD COLUMN estimated_completion_time TEXT
    `, (err) => {
      if (err) {
        console.error('❌ Błąd dodawania kolumny estimated_completion_time:', err.message)
        reject(err)
      } else {
        console.log('✅ Dodano kolumnę estimated_completion_time do tabeli bookings')
        resolve()
      }
    })
  })
}

function down() {
  return new Promise((resolve, reject) => {

    console.log('⚠️ Cofnięcie migracji nie jest wspierane dla SQLite')
    resolve()
  })
}

module.exports = { up, down }
