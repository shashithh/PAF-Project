import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function UnauthorizedPage() {
  const { currentUser } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname ?? '/'

  return (
    <div className="unauth-page">
      <div className="unauth-card">
        <span className="unauth-icon" aria-hidden="true">🔒</span>
        <h1 className="unauth-title">Access Denied</h1>
        <p className="unauth-message">
          {currentUser
            ? `Your account (${currentUser.role}) doesn't have permission to view this page.`
            : 'You need to be logged in to view this page.'}
        </p>
        <div className="unauth-actions">
          <button
            className="btn-primary unauth-btn"
            onClick={() => navigate('/')}
          >
            Go to My Bookings
          </button>
          {from !== '/' && (
            <button
              className="btn-secondary"
              onClick={() => navigate(-1)}
            >
              Go back
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default UnauthorizedPage
