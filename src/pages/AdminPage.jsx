import React from 'react'
import BookingList from '../components/BookingList.jsx'

function AdminPage({ bookings, loading, stats, onUpdateStatus, onNotify }) {
  const handleApprove = (id) => {
    onUpdateStatus(id, 'APPROVED')
    onNotify('Booking approved.')
  }

  const handleReject = (id) => {
    onUpdateStatus(id, 'REJECTED')
    onNotify('Booking rejected.', 'error')
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Admin Panel</h1>
        <p className="page-subtitle">Review and manage all campus bookings.</p>
      </div>

      {/* Stats row — driven by live state via useBookings */}
      <div className="admin-stats">
        <div className="stat-card">
          <span className="stat-number">{stats.TOTAL}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.PENDING}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.APPROVED}</span>
          <span className="stat-label">Approved</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.REJECTED}</span>
          <span className="stat-label">Rejected</span>
        </div>
      </div>

      <BookingList
        bookings={bookings}
        loading={loading}
        onApprove={handleApprove}
        onReject={handleReject}
        showAdminControls={true}
      />
    </div>
  )
}

export default AdminPage
