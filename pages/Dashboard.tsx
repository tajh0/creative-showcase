import React, { useEffect, useState } from 'react';
import { AuthState, Artwork } from '../types';
import { db } from '../services/storageService';
import MasonryGrid from '../components/MasonryGrid';
import UploadModal from '../components/UploadModal';
import { Plus, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  auth: AuthState;
}

const Dashboard: React.FC<DashboardProps> = ({ auth }) => {
  const [userArtworks, setUserArtworks] = useState<Artwork[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated || !auth.user) {
      if (!auth.isLoading) {
         navigate('/auth');
      }
      return;
    }
    loadArtworks();
  }, [auth, navigate]);

  const loadArtworks = async () => {
    if (auth.user) {
        setIsLoading(true);
        try {
            const works = await db.artworks.findByUserId(auth.user._id);
            setUserArtworks(works);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }
  };

  if (!auth.isAuthenticated || !auth.user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-xl">
            {auth.user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-white">{auth.user.username}</h1>
            <p className="text-slate-400">{auth.user.email}</p>
            <div className="flex gap-4 mt-2 text-sm text-slate-500">
                <span>{userArtworks.length} Artworks</span>
                <span>•</span>
                <span>Member since {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>

        <button 
            onClick={() => setShowUpload(true)}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
        >
            <Plus size={20} />
            <span>Upload New Artwork</span>
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
             <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <ImageIcon size={20} className="text-indigo-400" />
                Your Gallery
            </h2>
        </div>
       
        {isLoading ? (
             <div className="text-center py-20 text-slate-500">Loading your collection...</div>
        ) : userArtworks.length > 0 ? (
          <MasonryGrid artworks={userArtworks} />
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/50">
             <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                <ImageIcon size={32} />
             </div>
             <h3 className="text-xl font-medium text-slate-300 mb-2">No artworks yet</h3>
             <p className="text-slate-500 max-w-sm mx-auto mb-6">Start building your portfolio by uploading your first piece of digital art.</p>
             <button onClick={() => setShowUpload(true)} className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline">
                Upload your first image
             </button>
          </div>
        )}
      </div>

      {showUpload && (
        <UploadModal 
          user={auth.user} 
          onClose={() => setShowUpload(false)} 
          onUploadSuccess={() => {
            loadArtworks();
          }} 
        />
      )}
    </div>
  );
};

export default Dashboard;