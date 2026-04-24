import React from 'react'

const TYPE_CONFIG = {
  LECTURE_HALL: { label: 'Lecture Hall', cls: 'bg-violet-50 text-violet-700 border-violet-200', icon: '🏛️' },
  LAB:          { label: 'Lab',          cls: 'bg-blue-50 text-blue-700 border-blue-200',     icon: '🔬' },
  MEETING_ROOM: { label: 'Meeting Room', cls: 'bg-amber-50 text-amber-700 border-amber-200',  icon: '🤝' },
  PROJECTOR:    { label: 'Projector',    cls: 'bg-cyan-50 text-cyan-700 border-cyan-200',     icon: '📽️' },
  CAMERA:       { label: 'Camera',       cls: 'bg-pink-50 text-pink-700 border-pink-200',     icon: '📷' },
  OTHER:        { label: 'Other',        cls: 'bg-surface-muted text-ink-secondary border-surface-border', icon: '📦' },
}

export default function ResourceTypeBadge({ type }) {
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.OTHER
  return (
    <span className={`badge ${cfg.cls}`}>
      <span className="text-xs">{cfg.icon}</span>
      {cfg.label}
    </span>
  )
}
