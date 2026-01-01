import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Upload, Menu, X, Palette } from 'lucide-react';
import { db } from '../services/storageService';
import { AuthState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
}

const Layout: React.FC<LayoutProps> = ({ children, auth, setAuth }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await db.auth.logout();
    setAuth({ user: null, isAuthenticated: false, isLoading: false });
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg group-hover:rotate-6 transition-transform">
                <Palette size={24} className="text-white" />
              </div>
              <span className="text-xl font-bold font-serif tracking-tight">Creative<span className="text-indigo-400">Showcase</span></span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-indigo-400' : 'text-slate-300 hover:text-white'}`}>
                Discover
              </Link>
              
              {auth.isAuthenticated ? (
                <>
                  <Link to="/dashboard" className={`text-sm font-medium transition-colors ${isActive('/dashboard') ? 'text-indigo-400' : 'text-slate-300 hover:text-white'}`}>
                    Dashboard
                  </Link>
                   <Link to={`/profile/${auth.user?.username}`} className={`text-sm font-medium transition-colors ${isActive(`/profile/${auth.user?.username}`) ? 'text-indigo-400' : 'text-slate-300 hover:text-white'}`}>
                    My Profile
                  </Link>
                  <button onClick={handleLogout} className="flex items-center space-x-1 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-sm transition-colors border border-slate-700">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                  <Link to="/dashboard" className="flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all shadow-lg shadow-indigo-500/20">
                    <Upload size={16} />
                    <span>Upload Art</span>
                  </Link>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/auth" className="text-slate-300 hover:text-white font-medium text-sm">Log In</Link>
                  <Link to="/auth?mode=signup" className="px-5 py-2 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm transition-colors">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-300 hover:text-white p-2">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-800 border-b border-slate-700">
            <div className="px-4 pt-2 pb-6 space-y-2">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-slate-700">Discover</Link>
              {auth.isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-slate-700">Dashboard</Link>
                  <Link to={`/profile/${auth.user?.username}`} onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-slate-700">My Profile</Link>
                  <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-slate-700">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-slate-700">Log In</Link>
                  <Link to="/auth?mode=signup" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-indigo-400 hover:bg-slate-700">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-950 border-t border-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Creative Showcase by Naimul.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
