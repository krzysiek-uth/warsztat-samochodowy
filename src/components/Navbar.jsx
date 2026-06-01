import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Navbar.css'

function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🔧</span>
          Auto-Serwis Pro
        </Link>

        <ul className="navbar-menu">
          <li>
            <Link to="/" className="navbar-link">
              Strona główna
            </Link>
          </li>
          <li>
            <Link to="/services" className="navbar-link">
              Usługi i cennik
            </Link>
          </li>
          <li>
            <Link to="/booking" className="navbar-link">
              Rezerwacja
            </Link>
          </li>
          <li>
            <Link to="/reviews" className="navbar-link">
              Opinie
            </Link>
          </li>
          <li>
            <Link to="/faq" className="navbar-link">
              FAQ
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              
              <li className="dropdown">
                <button
                  className="navbar-link dropdown-toggle"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  Cześć, {user?.firstName}! ▼
                </button>

                {showUserMenu && (
                  <div className="dropdown-menu">
                    <Link
                      to="/client-panel"
                      className="dropdown-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      📊 Mój panel
                    </Link>
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      👤 Edytuj profil
                    </Link>

                    {isAdmin && (
                      <>
                        <div className="dropdown-divider"></div>
                        <Link
                          to="/dashboard"
                          className="dropdown-item admin-item"
                          onClick={() => setShowUserMenu(false)}
                        >
                          📈 Dashboard
                        </Link>
                        <Link
                          to="/admin-panel"
                          className="dropdown-item admin-item"
                          onClick={() => setShowUserMenu(false)}
                        >
                          ⚙️ Panel admina
                        </Link>
                      </>
                    )}

                    <div className="dropdown-divider"></div>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item logout-item"
                    >
                      🚪 Wyloguj
                    </button>
                  </div>
                )}
              </li>
            </>
          ) : (
            
            <li>
              <Link to="/login" className="navbar-link navbar-link-login">
                Zaloguj się
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
