import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const SignupPage = () => {
  const { login } = useAuth(); // login triggers the same google oauth flow which handles signup

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

      {/* Left Green Panel */}
      <div style={{
        width: '45%',
        background: 'linear-gradient(135deg, #1a5c3a 0%, #0d3d26 100%)',
        color: 'white',
        padding: '50px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background circles */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)'
        }}/>
        <div style={{
          position: 'absolute', bottom: '-50px', left: '-50px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)'
        }}/>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1 }}>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '10px', padding: '8px',
            fontSize: '1.5rem'
          }}>🏛️</div>
          <span style={{ fontSize: '1.2rem', fontWeight: '600' }}>Campusora</span>
        </div>

        {/* Main text */}
        <div style={{ zIndex: 1 }}>
          <h1 style={{
            fontSize: '2.8rem', fontWeight: '800',
            lineHeight: '1.2', marginBottom: '20px'
          }}>
            Join the Campus Hub
          </h1>
          <p style={{ fontSize: '1rem', opacity: 0.8, marginBottom: '40px', lineHeight: '1.6' }}>
            Get started by creating your account. Access facilities, assets, and schedule bookings seamlessly.
          </p>

          {/* Feature list */}
          {[
            { icon: '🏛️', text: 'Facilities & Assets Catalogue' },
            { icon: '📅', text: 'Smart Booking Management' },
            { icon: '🔧', text: 'Maintenance & Incident Tracking' },
            { icon: '🔐', text: 'Role-Based Access Control' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center',
              gap: '12px', marginBottom: '16px'
            }}>
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              <span style={{ fontSize: '0.95rem', opacity: 0.9 }}>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ fontSize: '0.8rem', opacity: 0.5, zIndex: 1 }}>
          IT3030 PAF Assignment 2026 — SLIIT Faculty of Computing
        </div>
      </div>

      {/* Right Signup Panel */}
      <div style={{
        width: '55%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8f9f4'
      }}>
        <div style={{ width: '400px' }}>
          <h2 style={{
            fontSize: '2rem', fontWeight: '700',
            marginBottom: '8px', color: '#1a1a1a'
          }}>Create an account</h2>
          <p style={{ color: '#666', marginBottom: '40px', fontSize: '0.95rem' }}>
            Sign up to get access to your campus dashboard
          </p>

          {/* Google Signup Button */}
          <button
            onClick={login}
            style={{
              width: '100%',
              padding: '16px',
              background: '#1a5c3a',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 4px 15px rgba(26,92,58,0.3)'
            }}>
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              style={{ width: '20px', height: '20px' }}
            />
            Sign up with Google
          </button>

          <p style={{
            textAlign: 'center', marginTop: '30px',
            fontSize: '0.9rem', color: '#666'
          }}>
            Already have an account? <Link to="/login" style={{ color: '#1a5c3a', fontWeight: 'bold', textDecoration: 'none' }}>Log in</Link>
          </p>
          
          <p style={{
            textAlign: 'center', marginTop: '10px',
            fontSize: '0.8rem', color: '#999'
          }}>
            Secure authentication powered by Google OAuth 2.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
