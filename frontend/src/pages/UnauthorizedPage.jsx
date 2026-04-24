import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldOff, ArrowLeft } from 'lucide-react'

export default function UnauthorizedPage() {
  const navigate = useNavigate()
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: 'calc(100vh - var(--nav-h))', padding: '2rem',
      background: 'var(--bg)',
    }}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)', padding: '3.5rem 2.5rem',
        maxWidth: 420, width: '100%', textAlign: 'center',
        boxShadow: 'var(--shadow-md)', animation: 'fadeUp .35s ease both',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'var(--red-light)', color: 'var(--red)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem',
        }}>
          <ShieldOff size={32} strokeWidth={1.75} />
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '.5rem' }}>Access denied</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
          You don't have permission to view this page. Contact your administrator if you think this is a mistake.
        </p>
        <button className="btn btn-primary btn-full btn-lg" onClick={() => navigate('/')}>
          <ArrowLeft size={16} strokeWidth={2.5} />
          Go to my bookings
        </button>
      </div>
    </div>
  )
}
