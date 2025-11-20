import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Create from './pages/Create';
import Survey from './pages/Survey';
import Results from './pages/Results';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<Create />} />
          <Route path="/survey/:id" element={<Survey />} />
          <Route path="/results/:id" element={<Results />} />
          <Route path="/analytics/:id" element={<Analytics />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
