import React from 'react'

export default function StatusBadge({ status }) {
  const isActive = status === 'ACTIVE'
  return (
    <span className={`badge ${
      isActive
        ? 'bg-primary-50 text-primary-700 border-primary-200'
        : 'bg-rose-50 text-rose-600 border-rose-200'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse-dot ${
        isActive ? 'bg-primary-500' : 'bg-rose-400'
      }`} />
      {isActive ? 'Active' : 'Out of Service'}
    </span>
  )
}
