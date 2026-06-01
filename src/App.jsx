import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Services from './pages/Services'
import Booking from './pages/Booking'
import Login from './pages/Login'
import ClientPanel from './pages/ClientPanel'
import AdminPanel from './pages/AdminPanel'
import Dashboard from './pages/Dashboard'
import Reviews from './pages/Reviews'
import Profile from './pages/Profile'
import FAQ from './pages/FAQ'
import './styles/App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />

        <main className="main-content">
          <Routes>
            
            <Route path="/" element={<Home />} />

            <Route path="/services" element={<Services />} />

            <Route path="/booking" element={<Booking />} />

            <Route path="/login" element={<Login />} />

            <Route path="/client-panel" element={<ClientPanel />} />

            <Route path="/admin-panel" element={<AdminPanel />} />

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/reviews" element={<Reviews />} />

            <Route path="/profile" element={<Profile />} />

            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  )
}

export default App
