import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../services/storageService';
import { User, Artwork } from '../types';
import MasonryGrid from '../components/MasonryGrid';

const UserProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userArtworks, setUserArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        if (username) {
            try {
                // Find user
                const user = await db.users.findOne({ username });
                if (user) {
                    setProfileUser(user);
                    const works = await db.artworks.findByUserId(user._id);
                    setUserArtworks(works);
                }
            } catch (e) {
                console.error(e);
            }
        }
        setLoading(false);
    };
    
    fetchData();
  }, [username]);

  if (loading) {
      return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading...</div>;
  }

  if (!profileUser) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-3xl font-serif font-bold text-slate-200 mb-4">Artist Not Found</h2>
            <p className="text-slate-400 mb-8">We couldn't find an artist with the username "{username}".</p>
            <Link to="/" className="px-6 py-2 bg-slate-800 rounded-full text-white hover:bg-slate-700 transition-colors">
                Return Home
            </Link>
        </div>
    );
  }

  return (
    <div>
         {/* Profile Header */}
         <div className="bg-slate-900 border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 p-1">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden relative">
                         {profileUser.avatar ? (
                            <img src={profileUser.avatar} alt={profileUser.username} className="w-full h-full object-cover" />
                         ) : (
                             <span className="text-4xl font-bold text-white">{profileUser.username.charAt(0).toUpperCase()}</span>
                         )}
                    </div>
                </div>
                
                <div className="text-center md:text-left">
                    <h1 className="text-4xl font-serif font-bold text-white mb-2">{profileUser.username}</h1>
                    <p className="text-lg text-slate-400 max-w-lg">{profileUser.bio || "No bio yet."}</p>
                    <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                         <div className="bg-slate-800 px-4 py-1 rounded-full text-sm text-slate-300">
                            <span className="font-bold text-white">{userArtworks.length}</span> Artworks
                         </div>
                    </div>
                </div>
            </div>
         </div>

         {/* Gallery */}
         <div className="max-w-7xl mx-auto px-4 py-12">
            <MasonryGrid artworks={userArtworks} />
         </div>
    </div>
  );
};

export default UserProfile;