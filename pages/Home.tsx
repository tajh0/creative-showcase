import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MasonryGrid from '../components/MasonryGrid';
import { db } from '../services/storageService';
import { Artwork, AuthState } from '../types';
import { ArrowRight, Loader2 } from 'lucide-react';

interface HomeProps {
    auth: AuthState;
}

const Home: React.FC<HomeProps> = ({ auth }) => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const all = await db.artworks.find();
        // Shuffle for "random selection" feel
        const shuffled = [...all].sort(() => 0.5 - Math.random());
        setArtworks(shuffled);
      } catch (error) {
        console.error("Failed to load artworks", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-32 lg:pb-28">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900 -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400 mb-6 tracking-tight">
            Showcase your <br className="hidden md:block" /> digital memories.
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-400 mb-10 leading-relaxed">
            A community for artists to share their vision. Upload, organize, and inspire. 
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {!auth.isAuthenticated && (
                <Link to="/auth?mode=signup" className="px-8 py-4 rounded-full bg-white text-slate-900 font-bold hover:bg-slate-100 transition-all hover:scale-105 flex items-center justify-center gap-2">
                Start Creating <ArrowRight size={18} />
                </Link>
            )}
             <Link to={auth.isAuthenticated ? "/dashboard" : "/auth"} className="px-8 py-4 rounded-full bg-slate-800 text-white font-medium border border-slate-700 hover:border-indigo-500 hover:bg-slate-800/80 transition-all">
              {auth.isAuthenticated ? "Go to Dashboard" : "Log In"}
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-serif font-bold text-white">Featured Works</h2>
            <div className="h-px flex-grow bg-slate-800"></div>
        </div>

        {loading ? (
           <div className="flex justify-center py-20">
             <Loader2 className="animate-spin text-indigo-500" size={40} />
           </div>
        ) : (
           <MasonryGrid artworks={artworks} />
        )}
      </section>
    </div>
  );
};

export default Home;