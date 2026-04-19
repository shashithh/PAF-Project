import React from 'react'
import BookingList from '../components/BookingList.jsx'
import { useBookingContext } from '../context/BookingContext.jsx'

function AdminPage() {
  const { bookings, loading, stats, updateBookingStatus, notify } =
    useBookingContext()

  const handleApprove = (id) => {
    updateBookingStatus(id, 'APPROVED')
    notify('Booking approved.')
  }

  const handleReject = (id) => {
    updateBookingStatus(id, 'REJECTED')
    notify('Booking rejected.', 'error')
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Admin Panel</h1>
        <p className="page-subtitle">Review and manage all campus bookings.</p>
      </div>

      {/* Stats — reactive: update instantly when status changes */}
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
