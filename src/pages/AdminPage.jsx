import React from 'react'
import BookingList from '../components/BookingList.jsx'

function AdminPage({ bookings, onUpdateStatus, onNotify }) {
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

      <div className="admin-stats">
        <div className="stat-card">
          <span className="stat-number">{bookings.length}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{bookings.filter((b) => b.status === 'PENDING').length}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{bookings.filter((b) => b.status === 'APPROVED').length}</span>
          <span className="stat-label">Approved</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{bookings.filter((b) => b.status === 'REJECTED').length}</span>
          <span className="stat-label">Rejected</span>
        </div>
      </div>

      <BookingList
        bookings={bookings}
        onApprove={handleApprove}
        onReject={handleReject}
        showAdminControls={true}
      />
    </div>
  )
}

export default AdminPage
