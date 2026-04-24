import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jwtToken, setJwtToken] = useState(localStorage.getItem('jwt'));

  useEffect(() => {
    if (jwtToken) {
      axios.get('http://localhost:8080/api/auth/me', {
        headers: { Authorization: `Bearer ${jwtToken}` }
      })
        .then(res => { setUser(res.data); setLoading(false); })
        .catch(() => { setUser(null); setLoading(false); });
    } else {
      setLoading(false);
    }
  }, [jwtToken]);

  const login = () => {
    // Redirect the browser, not axios
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  const logout = () => {
    setUser(null);
    setJwtToken(null);
    localStorage.removeItem('jwt'); // clear token
    window.location.href = 'http://localhost:8080/logout';
  };

  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };

  const isAdmin = user?.role === 'ADMIN';

  const auth = user ? {
    username: user.name,
    email: user.email,
    role: user.role,
    picture: user.picture
  } : null;

  return (
    <AuthContext.Provider value={{
      user,
      auth,
      jwtToken,
      setJwtToken,
      loading,
      login,
      logout,
      hasRole,
      isAdmin,
      isAdminFn: () => user?.role === 'ADMIN'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios.get('http://localhost:8080/api/auth/me', { withCredentials: true })
//       .then(res => { setUser(res.data); setLoading(false); })
//       .catch(() => { setUser(null); setLoading(false); });
//   }, []);

//   const login = () => {
//     window.location.href = 'http://localhost:8080/oauth2/authorization/google';
//   };

//   const logout = () => {
//     setUser(null);
//     window.location.href = 'http://localhost:8080/logout';
//   };

//   const hasRole = (role) => {
//     if (!user) return false;
//     return user.role === role;
//   };

//   // isAdmin as boolean for MainLayout
//   const isAdmin = user?.role === 'ADMIN';

//   // auth object matching what MainLayout expects
//   const auth = user ? {
//     username: user.name,
//     email: user.email,
//     role: user.role,
//     picture: user.picture
//   } : null;

//   return (
//     <AuthContext.Provider value={{
//       user,
//       auth,
//       loading,
//       login,
//       logout,
//       hasRole,
//       isAdmin,
//       isAdminFn: () => user?.role === 'ADMIN'
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);