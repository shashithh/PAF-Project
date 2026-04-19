import React from 'react'
import BookingList from '../components/BookingList.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useBookingContext } from '../context/BookingContext.jsx'

function AdminPage() {
  const { currentUser } = useAuth()
  const { stats } = useBookingContext()

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-text">
          <h1 className="page-title">Admin Panel</h1>
          <p className="page-subtitle">
            Logged in as <strong>{currentUser.name}</strong> · Review and manage all campus bookings.
          </p>
        </div>
      </div>

      {/* Stats — reactive: update the moment a status changes */}
      <div className="admin-stats">
        <div className="stat-card">
          <span className="stat-number">{stats.TOTAL}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-card stat-card-pending">
          <span className="stat-number">{stats.PENDING}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card stat-card-approved">
          <span className="stat-number">{stats.APPROVED}</span>
          <span className="stat-label">Approved</span>
        </div>
        <div className="stat-card stat-card-rejected">
          <span className="stat-number">{stats.REJECTED}</span>
          <span className="stat-label">Rejected</span>
        </div>
      </div>

      <BookingList scope="admin" />
    </div>
  )
}

export default AdminPage
