import { useEffect } from 'react';
export default function OAuthCallbackPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('sc_token', token);
      fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => {
          if (data.data) localStorage.setItem('sc_user', JSON.stringify(data.data));
          window.location.href = '/dashboard';
        })
        .catch(() => { window.location.href = '/dashboard'; });
    } else {
      window.location.href = '/login';
    }
  }, []);
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
