import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function UnauthorizedPage() {
  const navigate = useNavigate()
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'70vh',padding:'2rem'}}>
      <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'3rem 2.5rem',maxWidth:420,width:'100%',textAlign:'center',boxShadow:'var(--shadow-md)'}}>
        <div style={{fontSize:'3rem',marginBottom:'1rem'}}>🔒</div>
        <h1 style={{fontSize:'1.5rem',fontWeight:800,marginBottom:'.5rem'}}>Access Denied</h1>
        <p style={{color:'var(--muted)',marginBottom:'1.5rem'}}>You don't have permission to view this page.</p>
        <button className="btn btn-primary btn-full" onClick={() => navigate('/')}>Go to My Bookings</button>
      </div>
    </div>
  )
}
