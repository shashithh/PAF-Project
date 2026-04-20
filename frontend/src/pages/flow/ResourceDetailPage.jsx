import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchResources } from '../../services/bookingService.js'
import { useBookingFlow } from '../../context/BookingFlowContext.jsx'
import { useBookingContext } from '../../context/BookingContext.jsx'
import '../../styles/flow.css'

const TYPE_ICONS  = { lab:'🔬', room:'🏢', equipment:'📽️' }
const TYPE_LABELS = { lab:'LAB', room:'MEETING ROOM', equipment:'EQUIPMENT' }

export default function ResourceDetailPage() {
  const { resourceId } = useParams()
  const navigate = useNavigate()
  const { setSelectedResource, selectedResource } = useBookingFlow()
  const { bookings } = useBookingContext()
  const [resource, setResource] = useState(selectedResource)
  const [loading, setLoading]   = useState(!selectedResource)

  useEffect(() => {
    if (selectedResource?.id === resourceId) return
    fetchResources()
      .then(list => { const f=list.find(r=>r.id===resourceId); if(f){setSelectedResource(f);setResource(f)} })
      .finally(() => setLoading(false))
  }, [resourceId, selectedResource, setSelectedResource])

  const today = new Date().toISOString().split('T')[0]
  const upcoming = bookings
    .filter(b => b.resourceId===resourceId && ['APPROVED','PENDING'].includes(b.status) && b.date>=today)
    .sort((a,b) => `${a.date}T${a.startTime}` < `${b.date}T${b.startTime}` ? -1 : 1)
    .slice(0,5)

  if (loading) return <div className="flow-page"><div className="flow-inner"><div className="res-skel" style={{height:300}} /></div></div>
  if (!resource) return <div className="flow-page"><div className="flow-inner"><div className="error-box">Resource not found. <button className="btn btn-ghost" onClick={()=>navigate('/book')}>Go back</button></div></div></div>

  return (
    <div className="flow-page">
      <div className="flow-inner">
        <button className="back-link" onClick={() => navigate('/book')}>← Back to resources</button>

        {/* Hero card */}
        <div className="card" style={{padding:'1.75rem',marginBottom:'1.5rem',display:'flex',alignItems:'center',gap:'1.5rem'}}>
          <div className="res-icon-wrap" style={{width:64,height:64,fontSize:'1.75rem'}}>{TYPE_ICONS[resource.type]??'📦'}</div>
          <div>
            <span className="res-type-tag">{TYPE_LABELS[resource.type]??resource.type}</span>
            <h1 style={{fontSize:'1.5rem',fontWeight:800,margin:'.3rem 0 .25rem'}}>{resource.name}</h1>
            {resource.capacity>0 && <p style={{color:'var(--muted)',fontSize:'.9rem'}}>👥 Capacity: {resource.capacity} {resource.capacity===1?'unit':'people'}</p>}
          </div>
        </div>

        {/* Info row */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:'1rem',marginBottom:'1.75rem'}}>
          {[['🕐','Operating Hours','7:00 AM – 10:00 PM'],['⏱️','Booking Duration','30 min – 8 hours'],['📅','Advance Booking','Up to 30 days']].map(([icon,label,val])=>(
            <div key={label} className="card" style={{padding:'1rem',display:'flex',gap:'.75rem',alignItems:'flex-start'}}>
              <span style={{fontSize:'1.2rem'}}>{icon}</span>
              <div>
                <div style={{fontSize:'.72rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'.04em',color:'var(--muted)',marginBottom:'.2rem'}}>{label}</div>
                <div style={{fontSize:'.9rem',fontWeight:600}}>{val}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming */}
        <div style={{marginBottom:'2rem'}}>
          <h2 style={{fontSize:'1.1rem',fontWeight:700,marginBottom:'.75rem'}}>Upcoming bookings</h2>
          {upcoming.length===0
            ? <p style={{color:'var(--muted)',fontSize:'.9rem'}}>No upcoming bookings — this resource is wide open!</p>
            : <div style={{display:'flex',flexDirection:'column',gap:'.5rem'}}>
                {upcoming.map(b=>(
                  <div key={b.id} className="card" style={{padding:'.65rem 1rem',display:'flex',alignItems:'center',gap:'1rem',fontSize:'.875rem'}}>
                    <span style={{fontWeight:600,minWidth:110}}>{new Date(b.date+'T00:00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}</span>
                    <span style={{color:'var(--muted)',flex:1}}>{b.startTime} – {b.endTime}</span>
                    <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
                  </div>
                ))}
              </div>
          }
        </div>

        <button className="btn btn-primary btn-lg btn-full" onClick={() => navigate(`/book/${resourceId}/slots`)}>
          Select a time slot →
        </button>
      </div>
    </div>
  )
}
