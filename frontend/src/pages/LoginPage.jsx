import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const { login, user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif',
      background: '#f8f9f4',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '420px',
        padding: '20px'
      }}>
        {/* Shield Icon */}
        <div style={{
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#1a5c3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 7l-4 3h8l-4-3z" fill="#1a5c3a"/>
            <path d="M8 10h8v1.5H8z" fill="#1a5c3a"/>
            <rect x="8" y="11.5" width="1.2" height="4" fill="#1a5c3a"/>
            <rect x="10.26" y="11.5" width="1.2" height="4" fill="#1a5c3a"/>
            <rect x="12.53" y="11.5" width="1.2" height="4" fill="#1a5c3a"/>
            <rect x="14.8" y="11.5" width="1.2" height="4" fill="#1a5c3a"/>
            <path d="M7.5 15.5h9v1.5h-9z" fill="#1a5c3a"/>
          </svg>
        </div>

        {/* Welcome Text */}
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#103020',
          marginBottom: '12px',
          textAlign: 'center',
          letterSpacing: '-0.5px'
        }}>
          Welcome back
        </h1>
        <p style={{
          color: '#666',
          fontSize: '1.05rem',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          Sign in to access your campus dashboard
        </p>

        {/* Google Login Button */}
        <button
          onClick={login}
          style={{
            width: '100%',
            padding: '12px 20px',
            background: '#1a5c3a',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: '0 4px 12px rgba(26,92,58,0.25)',
            transition: 'background 0.2s',
            marginBottom: '32px'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#13452b'}
          onMouseOut={(e) => e.currentTarget.style.background = '#1a5c3a'}
        >
          <div style={{
            background: 'white',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </div>
          Sign in with Google
        </button>

        {/* Secure Auth Text */}
        <p style={{
          color: '#888',
          fontSize: '0.9rem',
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          Secure authentication powered by Google OAuth 2.0
        </p>

        {/* Divider */}
        <div style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          borderTop: '1px solid #e0e0e0'
        }}>
          <div style={{
            position: 'absolute',
            background: '#f8f9f4',
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#1a5c3a',
            fontWeight: '600',
            fontSize: '0.95rem'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#1a5c3a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8l-3 2h6l-3-2z" fill="#1a5c3a"/>
              <rect x="9" y="10.5" width="0.8" height="3" fill="#1a5c3a"/>
              <rect x="10.6" y="10.5" width="0.8" height="3" fill="#1a5c3a"/>
              <rect x="12.2" y="10.5" width="0.8" height="3" fill="#1a5c3a"/>
              <rect x="13.8" y="10.5" width="0.8" height="3" fill="#1a5c3a"/>
              <path d="M8.5 13.5h7v1h-7z" fill="#1a5c3a"/>
            </svg>
            Campusora
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;