import React from 'react'

export default function LoadingSpinner({ message = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-surface-border" />
        <div className="absolute inset-0 rounded-full border-2 border-t-primary-500 animate-spin" />
      </div>
      <p className="text-sm text-ink-secondary font-medium">{message}</p>
    </div>
  )
}
