import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/Home.css'

function Home() {
  return (
    <div className="home">
      
      <section className="hero">
        <div className="hero-content">
          <h1>Profesjonalny Serwis Samochodowy</h1>
          <p className="hero-subtitle">
            Twój samochód w dobrych rękach - szybko, sprawnie, profesjonalnie
          </p>
          <div className="hero-buttons">
            <Link to="/booking" className="btn btn-primary">
              Umów wizytę online
            </Link>
            <Link to="/services" className="btn btn-secondary">
              Zobacz usługi
            </Link>
          </div>
        </div>
      </section>

      <section className="about-us">
        <div className="about-us-container">
          <h2>O naszym warsztacie</h2>
          <div className="about-us-content">
            <div className="about-us-text">
              <h3>Pasja do motoryzacji od ponad 15 lat</h3>
              <p>
                Nasz warsztat samochodowy powstał z miłości do motoryzacji i chęci
                zapewnienia kierowcom usług najwyższej jakości. Od 2009 roku obsługujemy
                setki zadowolonych klientów, którzy cenią nas za profesjonalizm,
                rzetelność i indywidualne podejście do każdego zlecenia.
              </p>
              <p>
                Specjalizujemy się w kompleksowej obsłudze pojazdów wszystkich marek -
                od prostych przeglądów okresowych, przez naprawy mechaniczne, po
                skomplikowaną diagnostykę komputerową. Nasz zespół składa się z
                wykwalifikowanych mechaników z wieloletnim doświadczeniem, którzy
                na bieżąco podnoszą swoje kwalifikacje, uczestnicząc w szkoleniach
                organizowanych przez producentów części i narzędzi.
              </p>
            </div>

            <div className="about-us-highlights">
              <div className="highlight-item">
                <span className="highlight-number">15+</span>
                <span className="highlight-label">lat doświadczenia</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-number">5000+</span>
                <span className="highlight-label">zadowolonych klientów</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-number">100%</span>
                <span className="highlight-label">satysfakcji gwarantowanej</span>
              </div>
            </div>
          </div>

          <div className="about-us-values">
            <h3>Nasze wartości</h3>
            <div className="values-grid">
              <div className="value-item">
                <span className="value-icon">🎯</span>
                <h4>Profesjonalizm</h4>
                <p>Każde zlecenie traktujemy z najwyższą starannością. Wykorzystujemy
                nowoczesny sprzęt diagnostyczny oraz oryginalne części zamienne od
                sprawdzonych dostawców.</p>
              </div>
              <div className="value-item">
                <span className="value-icon">💬</span>
                <h4>Transparentność</h4>
                <p>Zanim rozpoczniemy jakąkolwiek naprawę, przedstawiamy szczegółową
                wycenę i dokładnie wyjaśniamy, co wymaga naprawy. Żadnych ukrytych kosztów
                - u nas wiesz za co płacisz.</p>
              </div>
              <div className="value-item">
                <span className="value-icon">⏱️</span>
                <h4>Punktualność</h4>
                <p>Szanujemy Twój czas. Naprawy realizujemy zgodnie z ustalonym terminem,
                a w razie nieprzewidzianych opóźnień, natychmiast informujemy o nowej dacie
                odbioru pojazdu.</p>
              </div>
              <div className="value-item">
                <span className="value-icon">🤝</span>
                <h4>Zaufanie</h4>
                <p>Budujemy długotrwałe relacje z naszymi klientami. Wielu z nich wraca
                do nas od lat, polecając nasz warsztat rodzinie i znajomym. To najlepsza
                rekomendacja naszej pracy.</p>
              </div>
            </div>
          </div>

          <div className="about-us-equipment">
            <h3>Nowoczesne wyposażenie</h3>
            <p>
              Inwestujemy w najnowocześniejszy sprzęt diagnostyczny i narzędzia, aby
              zapewnić precyzyjną diagnostykę i skuteczną naprawę każdego pojazdu.
              W naszym warsztacie znajdziesz:
            </p>
            <ul className="equipment-list">
              <li>Profesjonalne stanowisko diagnostyczne z oprogramowaniem dla wszystkich marek</li>
              <li>Nowoczesny podnośnik czterosłupowy i dwusłupowy</li>
              <li>Stację serwisową klimatyzacji z automatycznym odzyskiwaniem czynnika</li>
              <li>Urządzenie do programowania kluczy i kodowania sterowników</li>
              <li>Zestaw specjalistycznych narzędzi do napraw układu hamulcowego i zawieszenia</li>
              <li>Testery akumulatorów i alternatorów</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Dlaczego warto nas wybrać?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Szybka obsługa</h3>
            <p>Realizujemy naprawy w najkrótszym możliwym czasie</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔧</div>
            <h3>Doświadczenie</h3>
            <p>Ponad 15 lat na rynku usług motoryzacyjnych</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Konkurencyjne ceny</h3>
            <p>Najlepszy stosunek jakości do ceny w regionie</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3>Gwarancja</h3>
            <p>Gwarancja na wszystkie wykonane usługi</p>
          </div>
        </div>
      </section>

      <section className="quick-access">
        <h2>Szybki dostęp</h2>
        <div className="quick-access-grid">
          <Link to="/booking" className="quick-card">
            <span className="quick-icon">📅</span>
            <h3>Rezerwacja online</h3>
            <p>Umów wizytę w kilka kliknięć</p>
          </Link>

          <Link to="/services" className="quick-card">
            <span className="quick-icon">📋</span>
            <h3>Cennik usług</h3>
            <p>Sprawdź nasze usługi i ceny</p>
          </Link>

          <Link to="/client-panel" className="quick-card">
            <span className="quick-icon">👤</span>
            <h3>Panel klienta</h3>
            <p>Sprawdź status naprawy</p>
          </Link>
        </div>
      </section>

      <section className="contact-location">
        <div className="contact-container">
          <h2>Gdzie nas znajdziesz?</h2>

          <div className="contact-content">
            <div className="contact-info">
              <h3>Dane kontaktowe</h3>
              <div className="info-item">
                <span className="info-icon">📍</span>
                <div>
                  <strong>Adres:</strong>
                  <p>ul. Warsztatowa 15<br/>04-803 Warszawa</p>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">📞</span>
                <div>
                  <strong>Telefon:</strong>
                  <p><a href="tel:+48123456789">+48 123 456 789</a></p>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">📧</span>
                <div>
                  <strong>Email:</strong>
                  <p><a href="mailto:kontakt@autoserwis.pl">kontakt@autoserwis.pl</a></p>
                </div>
              </div>

              <div className="info-item">
                <span className="info-icon">🕒</span>
                <div>
                  <strong>Godziny otwarcia:</strong>
                  <p>Poniedziałek - Piątek: 8:00 - 18:00<br/>Sobota: 9:00 - 14:00<br/>Niedziela: Nieczynne</p>
                </div>
              </div>
            </div>

            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2446.7906548767636!2d21.15013127696468!3d52.18116597198772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471935d8c51e0c3d%3A0x3c3e8bb1b6e88f54!2sWarsztatowa%2015%2C%2004-803%20Warszawa!5e0!3m2!1spl!2spl!4v1704638400000!5m2!1spl!2spl"
                width="100%"
                height="400"
                style={{ border: 0, borderRadius: '12px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokalizacja warsztatu - ul. Warsztatowa 15, 04-803 Warszawa"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
