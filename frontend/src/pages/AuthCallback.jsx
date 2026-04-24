import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setJwtToken } = useAuth(); // expose setter from context

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('jwt', token);
      setJwtToken(token); // update context immediately
      navigate('/dashboard'); // go straight to dashboard
    }
  }, [navigate, setJwtToken]);

  return <div>Signing you in...</div>;
};

export default AuthCallback;



// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function AuthCallback() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const token = params.get('token');
//     if (token) {
//       localStorage.setItem('token', token);
//       // Force reload so AuthContext picks up the new token
//       window.location.href = '/dashboard';
//     } else {
//       navigate('/login');
//     }
//   }, []);

//   return (
//     <div style={{ padding: 40, textAlign: 'center', fontSize: '1.1rem' }}>
//       Logging in, please wait...
//     </div>
//   );
// }