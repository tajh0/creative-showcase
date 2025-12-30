import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { db } from '../services/storageService';
import { AuthState, User } from '../types';
import { Palette, AlertCircle, Loader2 } from 'lucide-react';

interface AuthPageProps {
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
}

const AuthPage: React.FC<AuthPageProps> = ({ setAuth }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    setIsSignup(searchParams.get('mode') === 'signup');
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        if (isSignup) {
            // Validate
            if (!formData.username || !formData.email || !formData.password) {
                throw new Error("All fields are required");
            }
            
            // Check existence
            const existingUser = await db.users.findOne({ email: formData.email });
            if (existingUser) {
                throw new Error("User with this email already exists");
            }

            const objectId = Math.floor(Date.now() / 1000).toString(16) + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => (Math.random() * 16 | 0).toString(16)).toLowerCase();

            const newUser: User = {
                _id: objectId,
                username: formData.username,
                email: formData.email,
                bio: 'Just joined Creative Showcase!'
            };

            await db.users.insertOne(newUser);
            await db.auth.login(newUser.email);
            setAuth({ user: newUser, isAuthenticated: true, isLoading: false });
            navigate('/dashboard');

        } else {
            // Login
            const user = await db.auth.login(formData.email);
            if (user) {
                setAuth({ user, isAuthenticated: true, isLoading: false });
                navigate('/dashboard');
            } else {
                throw new Error("Invalid email or user not found. (Try creating an account)");
            }
        }
    } catch (err: any) {
        setError(err.message || "An error occurred");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
           <div className="inline-block p-3 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl mb-4">
             <Palette size={32} className="text-white" />
           </div>
          <h2 className="text-3xl font-serif font-bold text-white mb-2">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-slate-400">
            {isSignup ? 'Join the community of creators.' : 'Sign in to access your dashboard.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-lg flex items-center gap-2 mb-6 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
              <input 
                type="text" 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="pick_a_username"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input 
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-colors mt-4 shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isSignup ? 'Sign Up' : 'Log In')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <button 
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
              setFormData({ username: '', email: '', password: '' });
              navigate(isSignup ? '/auth' : '/auth?mode=signup');
            }}
            className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline"
          >
            {isSignup ? 'Log in' : 'Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;