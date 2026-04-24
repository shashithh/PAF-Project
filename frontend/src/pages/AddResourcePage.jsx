import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createResource } from '../services/resourceApi'
import { useAuth } from '../context/AuthContext'
import ResourceForm from '../components/resources/ResourceForm'
import Toast from '../components/common/Toast'

const INITIAL_FORM = {
  resourceCode: '', resourceName: '', resourceType: '',
  capacity: '', location: '', availableFrom: '',
  availableTo: '', status: 'ACTIVE', description: '',
}

export default function AddResourcePage() {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)
  const [toast, setToast]       = useState(null)

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
      availableTo: formData.availableTo || null,
      description: formData.description || null,
    }
    try {
      await createResource(auth, payload)
      setToast({ message: 'Resource created successfully!', type: 'success' })
      setTimeout(() => navigate('/resources'), 1200)
    } catch (err) {
      const status = err.response?.status
      const body   = err.response?.data
      if (status === 400 && body?.data) setErrors(body.data)
      else if (status === 409) setErrors({ resourceCode: body?.message || 'This resource code already exists.' })
      else if (status === 401) setToast({ message: 'Session expired. Please log in again.', type: 'error' })
      else setToast({ message: body?.message || 'Failed to create resource.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      <button
        onClick={() => navigate('/resources')}
        className="flex items-center gap-2 text-sm font-semibold text-ink-secondary hover:text-ink transition-colors group"
      >
        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Resources
      </button>

      <div className="card p-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-8 pb-6 border-b border-surface-border">
          <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-ink" style={{ fontFamily: 'Playfair Display, serif' }}>
              Add New Resource
            </h1>
            <p className="text-sm text-ink-secondary mt-1">
              Register a new facility or asset in the campus catalogue.
            </p>
          </div>
        </div>

        <ResourceForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          errors={errors}
          loading={loading}
          submitLabel="Create Resource"
          onCancel={() => navigate('/resources')}
        />
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
