// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Chat from './components/Chat';
import Login from './components/Login';
import Register from './components/Register';

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check the session when the app loads
    const checkSession = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/session', {
          withCredentials: true,
        });

        if (response.data.loggedIn) {
          setLoggedIn(true);
          setUser(response.data.user);
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setLoggedIn(false); // Assume not logged in on error
      }
    };

    checkSession();
  }, []);

  // Wait for session check to complete before rendering the routes
  if (loggedIn === null) {
    return <div>Loading...</div>; // You can add a loading spinner here
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={loggedIn ? '/chat' : '/login'} replace />}
        />
        <Route
          path="/login"
          element={loggedIn ? <Navigate to="/chat" replace /> : <Login onLoginSuccess={(userData) => { setLoggedIn(true); setUser(userData); }} />}
        />
        <Route
          path="/register"
          element={loggedIn ? <Navigate to="/chat" replace /> : <Register />}
        />
        <Route
          path="/chat"
          element={
            loggedIn?
            <Chat user={user} /> 
            : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
