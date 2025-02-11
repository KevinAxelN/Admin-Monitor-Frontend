import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Monitor from './pages/Monitor';
import EditUserById from './pages/EditUserById'; 
import CreateUser from './pages/CreateUser';
import AttendaceByUser from './pages/AttendanceByUser';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem('userId') || null;
  });

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
    if (userId) {
      localStorage.setItem('userId', userId);
    }
  }, [isAuthenticated, userId]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserId={setUserId} />} />
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/monitor" /> : <Navigate to="/login" />
        } />
        <Route path="/monitor" element={
          isAuthenticated ? <Monitor userId={userId} /> : <Navigate to="/" />
        } />
        <Route path="/editUserById" element={
          isAuthenticated ? <EditUserById /> : <Navigate to="/" />
        } />              
        <Route path="/createUser" element={
          isAuthenticated ? <CreateUser /> : <Navigate to="/" />
        } />              
        <Route path="/attendaceByUser" element={
          isAuthenticated ? <AttendaceByUser /> : <Navigate to="/" />
        } />              
      </Routes>
    </Router>
  );
}

export default App;
