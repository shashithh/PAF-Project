import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchResources, deleteResource, updateResourceStatus } from '../services/resourceApi'
import { useAuth } from '../context/AuthContext'
import SearchFilterPanel from '../components/resources/SearchFilterPanel'
import ResourceCard from '../components/resources/ResourceCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ConfirmDialog from '../components/common/ConfirmDialog'
import Toast from '../components/common/Toast'

const EMPTY_FILTERS = { type: '', location: '', status: '', minCapacity: '' }

export default function ResourceListPage() {
  const { auth, isAdmin } = useAuth()
  const navigate = useNavigate()

  const [resources, setResources]         = useState([])
  const [loading, setLoading]             = useState(true)
  const [filters, setFilters]             = useState(EMPTY_FILTERS)
  const [toast, setToast]                 = useState(null)
  const [deleteId, setDeleteId]           = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [viewMode, setViewMode]           = useState('grid') // 'grid' | 'list'

  const loadResources = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchResources(auth, filters)
      setResources(res.data || [])
    } catch {
      showToast('Failed to load resources. Is the backend running?', 'error')
    } finally {
      setLoading(false)
    }
  }, [auth, filters])

  useEffect(() => { loadResources() }, [loadResources])

  const showToast = (message, type = 'success') => setToast({ message, type })

  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }))
  const handleResetFilters = () => setFilters(EMPTY_FILTERS)

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true)
    try {
      await deleteResource(auth, deleteId)
      setResources(prev => prev.filter(r => r.id !== deleteId))
      showToast('Resource deleted successfully.')
    } catch {
      showToast('Failed to delete resource.', 'error')
    } finally {
      setDeleteLoading(false)
      setDeleteId(null)
    }
  }

  const handleStatusToggle = async (id, newStatus) => {
    try {
      const res = await updateResourceStatus(auth, id, newStatus)
      setResources(prev => prev.map(r => r.id === id ? res.data : r))
      showToast(`Status updated to ${newStatus === 'ACTIVE' ? 'Active' : 'Out of Service'}.`)
    } catch {
      showToast('Failed to update status.', 'error')
    }
  }

  const activeCount   = resources.filter(r => r.status === 'ACTIVE').length
  const inactiveCount = resources.filter(r => r.status !== 'ACTIVE').length

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-slide-up">

      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-ink" style={{ fontFamily: 'Playfair Display, serif' }}>
            Resources Catalogue
          </h1>
          <p className="text-sm text-ink-secondary mt-1">
            {loading
              ? 'Loading resources…'
              : `${resources.length} resource${resources.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center bg-surface-muted border border-surface-border rounded-xl p-1 gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-surface-card shadow-sm text-ink' : 'text-ink-muted hover:text-ink'}`}
              title="Grid view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-surface-card shadow-sm text-ink' : 'text-ink-muted hover:text-ink'}`}
              title="List view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>

          {isAdmin && (
            <button
              onClick={() => navigate('/resources/new')}
              className="btn-primary flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Resource
            </button>
          )}
        </div>
      </div>

      {/* Summary pills */}
      {!loading && resources.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 bg-surface-card border border-surface-border px-3 py-1.5 rounded-full text-xs font-semibold text-ink-secondary shadow-sm">
            <span className="w-2 h-2 rounded-full bg-ink-muted" />
            Total: {resources.length}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-primary-50 border border-primary-200 px-3 py-1.5 rounded-full text-xs font-semibold text-primary-700">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse-dot" />
            Active: {activeCount}
          </span>
          {inactiveCount > 0 && (
            <span className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-600">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              Out of Service: {inactiveCount}
            </span>
          )}
        </div>
      )}

      {/* Filter panel */}
      <SearchFilterPanel filters={filters} onChange={handleFilterChange} onReset={handleResetFilters} />

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Fetching resources…" />
      ) : resources.length === 0 ? (
        <div className="card p-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-muted flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="font-bold text-ink text-base mb-1">No resources found</p>
          <p className="text-sm text-ink-secondary mb-5">Try adjusting your filters or add a new resource.</p>
          {isAdmin && (
            <button onClick={() => navigate('/resources/new')} className="btn-primary">
              Add First Resource
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {resources.map(resource => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              isAdmin={isAdmin}
              onDelete={setDeleteId}
              onStatusToggle={handleStatusToggle}
            />
          ))}
        </div>
      ) : (
        /* List view — table-style */
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border bg-surface-muted">
                <th className="text-left px-5 py-3 text-xs font-bold text-ink-secondary uppercase tracking-wider">Code</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-ink-secondary uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-ink-secondary uppercase tracking-wider hidden md:table-cell">Type</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-ink-secondary uppercase tracking-wider hidden lg:table-cell">Location</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-ink-secondary uppercase tracking-wider hidden lg:table-cell">Capacity</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-ink-secondary uppercase tracking-wider">Status</th>
                {isAdmin && <th className="text-right px-5 py-3 text-xs font-bold text-ink-secondary uppercase tracking-wider">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {resources.map(r => (
                <tr
                  key={r.id}
                  onClick={() => navigate(`/resources/${r.id}`)}
                  className="hover:bg-surface-hover cursor-pointer transition-colors group"
                >
                  <td className="px-5 py-4 font-mono text-xs text-ink-muted">{r.resourceCode}</td>
                  <td className="px-5 py-4 font-semibold text-ink group-hover:text-primary-700 transition-colors">{r.resourceName}</td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-xs font-medium text-ink-secondary bg-surface-muted px-2 py-1 rounded-lg">
                      {r.resourceType?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-ink-secondary hidden lg:table-cell">{r.location}</td>
                  <td className="px-5 py-4 text-ink hidden lg:table-cell">{r.capacity}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      r.status === 'ACTIVE'
                        ? 'bg-primary-50 text-primary-700 border-primary-200'
                        : 'bg-rose-50 text-rose-600 border-rose-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${r.status === 'ACTIVE' ? 'bg-primary-500' : 'bg-rose-400'}`} />
                      {r.status === 'ACTIVE' ? 'Active' : 'Out of Service'}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-5 py-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/resources/${r.id}/edit`)}
                          className="btn-icon"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleStatusToggle(r.id, r.status === 'ACTIVE' ? 'OUT_OF_SERVICE' : 'ACTIVE')}
                          className="btn-icon"
                          title="Toggle status"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteId(r.id)}
                          className="p-2 rounded-xl hover:bg-rose-50 text-ink-muted hover:text-rose-600 transition-all"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Resource"
        message="This action cannot be undone. The resource will be permanently removed from the catalogue."
        confirmLabel="Delete"
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
