import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, CalendarDays, PlusCircle, ArrowRight, Info } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useBookingContext } from '../context/BookingContext.jsx'

export default function DashboardPage() {
  const { currentUser, isAdmin } = useAuth()
  const { bookings, stats } = useBookingContext()
  const navigate = useNavigate()

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const myBookings = bookings.filter(b => b.userId === currentUser?.id)
  const myPending  = myBookings.filter(b => b.status === 'PENDING').length
  const myApproved = myBookings.filter(b => b.status === 'APPROVED').length

  return (
    <div style={{ maxWidth: 900, animation: 'fadeUp .3s ease both' }}>

      {/* Welcome hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1a3a1a 0%, #0f4a2a 50%, #0d3d35 100%)',
        borderRadius: 'var(--radius)', padding: '2rem 2.25rem',
        marginBottom: '1.75rem', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position:'absolute', top:-60, right:-60, width:220, height:220, borderRadius:'50%', background:'rgba(255,255,255,.04)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-40, left:'40%', width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,.03)', pointerEvents:'none' }} />

        <div style={{ position:'relative', zIndex:1 }}>
          <p style={{ color:'rgba(255,255,255,.55)', fontSize:'.875rem', marginBottom:'.25rem' }}>
            {greeting} 👋
          </p>
          <h1 style={{ color:'#fff', fontSize:'1.75rem', fontWeight:800, fontFamily:'var(--font-serif)', marginBottom:'.35rem', lineHeight:1.2 }}>
            {currentUser?.name}
          </h1>
          <p style={{ color:'rgba(255,255,255,.5)', fontSize:'.875rem' }}>
            Welcome to CampusBook — Smart Booking Management
          </p>
          <div style={{ marginTop:'1.25rem', display:'flex', gap:'.75rem', flexWrap:'wrap' }}>
            <span style={{
              display:'inline-flex', alignItems:'center', gap:'.4rem',
              background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.15)',
              borderRadius:'var(--radius-pill)', padding:'.25rem .85rem',
              fontSize:'.72rem', fontWeight:700, color:'rgba(255,255,255,.85)',
              textTransform:'uppercase', letterSpacing:'.05em',
            }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#6ee7b7', animation:'pulseDot 2s ease infinite' }} />
              {currentUser?.role} — Module B
            </span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px,1fr))', gap:'1rem', marginBottom:'1.75rem' }}>
        {[
          { label:'My Bookings',  val: myBookings.length, color:'var(--primary)' },
          { label:'Pending',      val: myPending,          color:'var(--amber)' },
          { label:'Approved',     val: myApproved,         color:'var(--green)' },
          ...(isAdmin ? [{ label:'Total (All)', val: stats.TOTAL, color:'var(--primary)' }] : []),
        ].map(({ label, val, color }) => (
          <div key={label} className="card" style={{ padding:'1.1rem 1.25rem' }}>
            <div style={{ fontSize:'1.75rem', fontWeight:800, color, lineHeight:1, fontFamily:'var(--font-serif)' }}>{val}</div>
            <div style={{ fontSize:'.75rem', fontWeight:600, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.06em', marginTop:'.3rem' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom:'1.75rem' }}>
        <div className="section-label" style={{ marginBottom:'.85rem' }}>Quick Actions</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px,1fr))', gap:'1rem' }}>

          <button
            onClick={() => navigate('/book')}
            style={{
              background:'var(--primary-light)', border:'1px solid var(--primary-200)',
              borderRadius:'var(--radius)', padding:'1.35rem',
              textAlign:'left', cursor:'pointer', transition:'all var(--t-fast)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='var(--shadow-md)' }}
            onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none' }}
          >
            <div style={{ width:40, height:40, borderRadius:'var(--radius-sm)', background:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'.85rem' }}>
              <Building2 size={20} color="#fff" strokeWidth={1.8} />
            </div>
            <div style={{ fontWeight:700, color:'var(--primary-800)', marginBottom:'.25rem' }}>Browse Resources</div>
            <div style={{ fontSize:'.82rem', color:'var(--primary-700)' }}>Find and book campus facilities</div>
            <div style={{ display:'flex', alignItems:'center', gap:'.3rem', marginTop:'.85rem', fontSize:'.78rem', fontWeight:600, color:'var(--primary-700)' }}>
              Open <ArrowRight size={13} strokeWidth={2.5} />
            </div>
          </button>

          <button
            onClick={() => navigate('/bookings')}
            style={{
              background:'var(--teal-50)', border:'1px solid var(--teal-100)',
              borderRadius:'var(--radius)', padding:'1.35rem',
              textAlign:'left', cursor:'pointer', transition:'all var(--t-fast)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='var(--shadow-md)' }}
            onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none' }}
          >
            <div style={{ width:40, height:40, borderRadius:'var(--radius-sm)', background:'var(--teal-600)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'.85rem' }}>
              <CalendarDays size={20} color="#fff" strokeWidth={1.8} />
            </div>
            <div style={{ fontWeight:700, color:'var(--teal-700)', marginBottom:'.25rem' }}>My Bookings</div>
            <div style={{ fontSize:'.82rem', color:'var(--teal-600)' }}>Track and manage your requests</div>
            <div style={{ display:'flex', alignItems:'center', gap:'.3rem', marginTop:'.85rem', fontSize:'.78rem', fontWeight:600, color:'var(--teal-600)' }}>
              Open <ArrowRight size={13} strokeWidth={2.5} />
            </div>
          </button>

          <button
            onClick={() => navigate('/new-booking')}
            style={{
              background:'#fff', border:'1px solid var(--border)',
              borderRadius:'var(--radius)', padding:'1.35rem',
              textAlign:'left', cursor:'pointer', transition:'all var(--t-fast)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='var(--shadow-md)'; e.currentTarget.style.borderColor='var(--primary)' }}
            onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor='var(--border)' }}
          >
            <div style={{ width:40, height:40, borderRadius:'var(--radius-sm)', background:'var(--bg-muted)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'.85rem' }}>
              <PlusCircle size={20} color="var(--primary)" strokeWidth={1.8} />
            </div>
            <div style={{ fontWeight:700, color:'var(--text)', marginBottom:'.25rem' }}>New Booking</div>
            <div style={{ fontSize:'.82rem', color:'var(--muted)' }}>Reserve a resource now</div>
            <div style={{ display:'flex', alignItems:'center', gap:'.3rem', marginTop:'.85rem', fontSize:'.78rem', fontWeight:600, color:'var(--muted)' }}>
              Open <ArrowRight size={13} strokeWidth={2.5} />
            </div>
          </button>
        </div>
      </div>

      {/* Info notice */}
      {!isAdmin && (
        <div style={{
          background:'var(--gold-50)', border:'1px solid var(--gold-200)',
          borderRadius:'var(--radius)', padding:'1rem 1.25rem',
          display:'flex', alignItems:'flex-start', gap:'.75rem',
        }}>
          <div style={{ width:32, height:32, borderRadius:'var(--radius-xs)', background:'var(--gold-100)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <Info size={16} color="var(--gold-600)" strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontWeight:700, color:'var(--gold-800)', marginBottom:'.2rem', fontSize:'.9rem' }}>User Access Level</div>
            <div style={{ fontSize:'.84rem', color:'var(--gold-700)', lineHeight:1.55 }}>
              You are logged in as a USER. You can browse resources and manage your own bookings.
              Admin features (approve/reject) require ADMIN privileges.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
