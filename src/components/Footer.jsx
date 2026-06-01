import React from 'react'
import '../styles/Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Kontakt</h3>
          <p>Email: kontakt@autoserwis.pl</p>
          <p>Telefon: +48 123 456 789</p>
          <p>Adres: ul. Warsztatowa 15, 04-803 Warszawa</p>
        </div>

        <div className="footer-section">
          <h3>Godziny otwarcia</h3>
          <p>Poniedziałek - Piątek: 8:00 - 18:00</p>
          <p>Sobota: 9:00 - 14:00</p>
          <p>Niedziela: Nieczynne</p>
        </div>

        <div className="footer-section">
          <h3>O nas</h3>
          <p>Profesjonalny serwis samochodowy</p>
          <p>z wieloletnim doświadczeniem</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Auto-Serwis Pro. Wszelkie prawa zastrzeżone.</p>
      </div>
    </footer>
  )
}

export default Footer
