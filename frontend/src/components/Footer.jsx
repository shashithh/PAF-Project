import React from 'react'
import { BookOpen, Globe, Link, Mail } from 'lucide-react'
import '../styles/footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-logo-icon">
              <BookOpen size={16} color="#fff" strokeWidth={2.5} />
            </span>
            CampusBook
          </div>
          <p className="footer-tagline">
            Smart campus resource booking — reserve labs, rooms, and equipment in seconds.
          </p>
          <div style={{ display: 'flex', gap: '.75rem', marginTop: '.5rem' }}>
            {[
              { icon: <Globe size={16} />, href: '#' },
              { icon: <Link size={16} />, href: '#' },
              { icon: <Mail size={16} />, href: '#' },
            ].map(({ icon, href }, i) => (
              <a
                key={i} href={href}
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,.55)', transition: 'all .15s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.18)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.08)'; e.currentTarget.style.color = 'rgba(255,255,255,.55)' }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="footer-col">
          <h4>Platform</h4>
          <ul>
            <li><a href="/book">Browse Resources</a></li>
            <li><a href="/new-booking">New Booking</a></li>
            <li><a href="/">My Bookings</a></li>
            <li><a href="/admin">Admin Panel</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Resources</h4>
          <ul>
            <li><a href="#">Computer Labs</a></li>
            <li><a href="#">Meeting Rooms</a></li>
            <li><a href="#">Equipment</a></li>
            <li><a href="#">Physics Labs</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Contact IT</a></li>
            <li><a href="#">Booking Policy</a></li>
            <li><a href="#">Report Issue</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {year} CampusBook. All rights reserved.</span>
        <div className="footer-bottom-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </footer>
  )
}
