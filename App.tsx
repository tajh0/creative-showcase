import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AuthPage from './pages/Auth';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';
import { AuthState } from './types';
import { db } from './services/storageService';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
        const currentUser = await db.auth.getSession();
        if (currentUser) {
            setAuth({
                user: currentUser,
                isAuthenticated: true,
                isLoading: false
            });
        } else {
            setAuth(prev => ({ ...prev, isLoading: false }));
        }
    };
    
    checkSession();
  }, []);

  if (auth.isLoading) {
      return (
          <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-500">
              Loading...
          </div>
      );
  }

  return (
    <Router>
      <Layout auth={auth} setAuth={setAuth}>
        <Routes>
          <Route path="/" element={<Home auth={auth} />} />
          <Route path="/auth" element={<AuthPage setAuth={setAuth} />} />
          <Route 
            path="/dashboard" 
            element={
              auth.isAuthenticated ? 
              <Dashboard auth={auth} /> : 
              <Navigate to="/auth" replace />
            } 
          />
          <Route path="/profile/:username" element={<UserProfile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;