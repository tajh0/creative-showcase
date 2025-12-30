import React, { useState } from 'react';
import { X, Upload, Loader2, Tag } from 'lucide-react';
import { Artwork, User } from '../types';
import { db } from '../services/storageService';

interface UploadModalProps {
  user: User;
  onClose: () => void;
  onUploadSuccess: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ user, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preview || !title || !user) return;

    setIsSubmitting(true);

    // Create ObjectId-like string
    const objectId = Math.floor(Date.now() / 1000).toString(16) + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => (Math.random() * 16 | 0).toString(16)).toLowerCase();

    const newArtwork: Artwork = {
      _id: objectId,
      userId: user._id,
      authorName: user.username,
      title,
      description,
      imageUrl: preview,
      createdAt: new Date().toISOString(),
      tags
    };

    try {
      await db.artworks.insertOne(newArtwork);
      onUploadSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to upload", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl">
        
        {/* Close Button Mobile */}
        <button onClick={onClose} className="absolute top-4 right-4 md:hidden p-2 bg-slate-800 rounded-full z-10">
          <X size={20} />
        </button>

        {/* Left Side: Image Preview / Drop Area */}
        <div className="w-full md:w-1/2 bg-slate-950 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-800 relative">
          {preview ? (
            <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
              <img src={preview} alt="Preview" className="max-w-full max-h-[500px] rounded-lg shadow-lg object-contain" />
              <button onClick={() => { setFile(null); setPreview(null); }} className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors">
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-64 md:h-96 border-2 border-dashed border-slate-700 rounded-xl hover:border-indigo-500 hover:bg-slate-900 transition-all cursor-pointer group">
              <div className="p-4 bg-slate-900 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <Upload size={32} className="text-slate-400 group-hover:text-indigo-500" />
              </div>
              <p className="text-slate-400 font-medium">Click to upload image</p>
              <p className="text-xs text-slate-600 mt-2">JPG, PNG, GIF up to 5MB</p>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          )}
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif font-bold text-white">Share your art</h2>
            <button onClick={onClose} className="hidden md:block p-2 hover:bg-slate-800 rounded-full transition-colors">
              <X size={24} className="text-slate-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 flex-grow">
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your artwork a name"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell the story behind this piece..."
                rows={4}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Tags (Press Enter)</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                  <span key={tag} className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-sm flex items-center gap-1 border border-indigo-500/30">
                    #{tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-white"><X size={12} /></button>
                  </span>
                ))}
              </div>
              <div className="relative">
                <Tag className="absolute left-3 top-2.5 text-slate-500" size={16}/>
                <input 
                    type="text" 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={addTag}
                    placeholder="Add tags..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                />
              </div>
            </div>

            <div className="pt-4 mt-auto">
              <button 
                type="submit" 
                disabled={!preview || !title || isSubmitting}
                className="w-full py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        Publishing...
                    </>
                ) : (
                    "Publish Artwork"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;