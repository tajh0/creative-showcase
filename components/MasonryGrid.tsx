import React from 'react';
import { Artwork } from '../types';
import { Link } from 'react-router-dom';

interface MasonryGridProps {
  artworks: Artwork[];
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ artworks }) => {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 px-4 py-6">
      {artworks.map((art) => (
        <div key={art._id} className="break-inside-avoid group relative rounded-xl overflow-hidden bg-slate-800 shadow-xl border border-slate-700 hover:border-indigo-500/50 transition-all duration-300">
          
          {/* Image */}
          <img 
            src={art.imageUrl} 
            alt={art.title} 
            className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
            <h3 className="text-lg font-bold font-serif text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{art.title}</h3>
            <div className="flex justify-between items-end mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
              <div>
                 <Link to={`/profile/${art.authorName.toLowerCase().replace(' ', '_')}`} className="text-sm text-indigo-300 hover:text-indigo-200">
                  by {art.authorName}
                </Link>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{art.description}</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {art.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full text-white/80">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;