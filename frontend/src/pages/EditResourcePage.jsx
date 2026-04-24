import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchResourceById, updateResource } from '../services/resourceApi'
import { useAuth } from '../context/AuthContext'
import ResourceForm from '../components/resources/ResourceForm'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Toast from '../components/common/Toast'

export default function EditResourcePage() {
  const { id } = useParams()
  const { auth } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(null)
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)
  const [fetching, setFetching] = useState(true)
  const [toast, setToast]       = useState(null)
  const [resourceName, setResourceName] = useState('')

  useEffect(() => {
    fetchResourceById(auth, id)
      .then(res => {
        const r = res.data
        setResourceName(r.resourceName)
        setFormData({
          resourceCode:  r.resourceCode  || '',
          resourceName:  r.resourceName  || '',
          resourceType:  r.resourceType  || '',
          capacity:      r.capacity != null ? String(r.capacity) : '',
          location:      r.location      || '',
          availableFrom: r.availableFrom || '',
          availableTo:   r.availableTo   || '',
          status:        r.status        || 'ACTIVE',
          description:   r.description   || '',
        })
      })
      .catch(() => setToast({ message: 'Could not load resource.', type: 'error' }))
      .finally(() => setFetching(false))
  }, [auth, id])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    const payload = {
      ...formData,
      capacity: formData.capacity !== '' ? parseInt(formData.capacity, 10) : null,
      availableFrom: formData.availableFrom || null,
      availableTo:   formData.availableTo   || null,
      description:   formData.description   || null,
    }
    try {
      await updateResource(auth, id, payload)
      setToast({ message: 'Resource updated successfully!', type: 'success' })
      setTimeout(() => navigate(`/resources/${id}`), 1200)
    } catch (err) {
      const status = err.response?.status
      const body   = err.response?.data
      if (status === 400 && body?.data) setErrors(body.data)
      else if (status === 409) setErrors({ resourceCode: body?.message || 'This resource code already exists.' })
      else setToast({ message: body?.message || 'Failed to update resource.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <LoadingSpinner message="Loading resource…" />

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      <button
        onClick={() => navigate(`/resources/${id}`)}
        className="flex items-center gap-2 text-sm font-semibold text-ink-secondary hover:text-ink transition-colors group"
      >
        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Resource Details
      </button>

      <div className="card p-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-8 pb-6 border-b border-surface-border">
          <div className="w-12 h-12 rounded-2xl bg-gold-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-ink" style={{ fontFamily: 'Playfair Display, serif' }}>
              Edit Resource
            </h1>
            {resourceName && (
              <p className="text-sm text-ink-secondary mt-1">
                Editing: <span className="font-semibold text-ink">{resourceName}</span>
              </p>
            )}
          </div>
        </div>

        {formData && (
          <ResourceForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            errors={errors}
            loading={loading}
            submitLabel="Save Changes"
            onCancel={() => navigate(`/resources/${id}`)}
          />
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
