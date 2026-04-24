import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchResourceById, deleteResource, updateResourceStatus } from '../services/resourceApi'
import { useAuth } from '../context/AuthContext'
import StatusBadge from '../components/common/StatusBadge'
import ResourceTypeBadge from '../components/common/ResourceTypeBadge'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ConfirmDialog from '../components/common/ConfirmDialog'
import Toast from '../components/common/Toast'

const TYPE_ICONS = {
  LECTURE_HALL: '🏛️', LAB: '🔬', MEETING_ROOM: '🤝',
  PROJECTOR: '📽️', CAMERA: '📷', OTHER: '📦',
}

const TYPE_BG = {
  LECTURE_HALL: 'from-violet-500 to-purple-600',
  LAB:          'from-blue-500 to-cyan-600',
  MEETING_ROOM: 'from-amber-500 to-orange-600',
  PROJECTOR:    'from-cyan-500 to-teal-600',
  CAMERA:       'from-pink-500 to-rose-600',
  OTHER:        'from-slate-400 to-slate-500',
}

export default function ResourceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { auth, isAdmin } = useAuth()

  const [resource, setResource]           = useState(null)
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)
  const [showDelete, setShowDelete]       = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [toast, setToast]                 = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchResourceById(auth, id)
      .then(res => setResource(res.data))
      .catch(() => setError('Resource not found or could not be loaded.'))
      .finally(() => setLoading(false))
  }, [auth, id])

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await deleteResource(auth, id)
      navigate('/resources')
    } catch {
      setToast({ message: 'Failed to delete resource.', type: 'error' })
      setDeleteLoading(false)
      setShowDelete(false)
    }
  }

  const handleToggleStatus = async () => {
    const newStatus = resource.status === 'ACTIVE' ? 'OUT_OF_SERVICE' : 'ACTIVE'
    try {
      const res = await updateResourceStatus(auth, id, newStatus)
      setResource(res.data)
      setToast({ message: `Status changed to ${newStatus === 'ACTIVE' ? 'Active' : 'Out of Service'}.` })
    } catch {
      setToast({ message: 'Failed to update status.', type: 'error' })
    }
  }

  if (loading) return <LoadingSpinner message="Loading resource details…" />

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="font-bold text-ink mb-1">Resource Not Found</p>
          <p className="text-sm text-ink-secondary mb-5">{error}</p>
          <button onClick={() => navigate('/resources')} className="btn-secondary">
            Back to Resources
          </button>
        </div>
      </div>
    )
  }

  const gradBg = TYPE_BG[resource.resourceType] || TYPE_BG.OTHER

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">

      {/* Back */}
      <button
        onClick={() => navigate('/resources')}
        className="flex items-center gap-2 text-sm font-semibold text-ink-secondary hover:text-ink transition-colors group"
      >
        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Resources
      </button>

      {/* Hero card */}
      <div className={`rounded-2xl bg-gradient-to-br ${gradBg} p-8 relative overflow-hidden shadow-card`}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/10 -translate-y-12 translate-x-12 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/10 translate-y-10 -translate-x-10 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="text-4xl mb-3">{TYPE_ICONS[resource.resourceType] || '📦'}</div>
              <p className="text-white/70 text-sm font-mono mb-1">{resource.resourceCode}</p>
              <h1 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                {resource.resourceName}
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="badge bg-white/20 text-white border-white/30">
                  {resource.resourceType?.replace(/_/g, ' ')}
                </span>
                <span className={`badge border ${
                  resource.status === 'ACTIVE'
                    ? 'bg-white/20 text-white border-white/30'
                    : 'bg-rose-900/40 text-rose-200 border-rose-400/40'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${resource.status === 'ACTIVE' ? 'bg-green-300 animate-pulse-dot' : 'bg-rose-300'}`} />
                  {resource.status === 'ACTIVE' ? 'Active' : 'Out of Service'}
                </span>
              </div>
            </div>

            {/* Admin actions */}
            {isAdmin && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => navigate(`/resources/${id}/edit`)}
                  className="bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-all border border-white/20 backdrop-blur"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={handleToggleStatus}
                  className="bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-all border border-white/20 backdrop-blur"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Toggle
                </button>
                <button
                  onClick={() => setShowDelete(true)}
                  className="bg-rose-500/30 hover:bg-rose-500/50 text-white font-semibold px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-all border border-rose-300/30 backdrop-blur"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DetailCard icon="📍" label="Location" value={resource.location} />
        <DetailCard icon="👥" label="Capacity" value={`${resource.capacity} person${resource.capacity !== 1 ? 's' : ''}`} />
        <DetailCard icon="🕐" label="Available From" value={resource.availableFrom || '—'} />
        <DetailCard icon="🕕" label="Available To"   value={resource.availableTo || '—'} />
        <DetailCard
          icon="📅" label="Created At"
          value={resource.createdAt ? new Date(resource.createdAt).toLocaleString() : '—'}
        />
        <DetailCard
          icon="🔄" label="Last Updated"
          value={resource.updatedAt ? new Date(resource.updatedAt).toLocaleString() : '—'}
        />
      </div>

      {/* Description */}
      {resource.description && (
        <div className="card p-6">
          <h3 className="section-title mb-3">Description</h3>
          <p className="text-sm text-ink-secondary leading-relaxed">{resource.description}</p>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDelete}
        title="Delete Resource"
        message={`Are you sure you want to delete "${resource.resourceName}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

function DetailCard({ icon, label, value }) {
  return (
    <div className="card p-5 flex items-start gap-3">
      <span className="text-xl flex-shrink-0">{icon}</span>
      <div>
        <p className="text-xs font-semibold text-ink-muted mb-1">{label}</p>
        <p className="text-sm font-semibold text-ink">{value}</p>
      </div>
    </div>
  )
}
