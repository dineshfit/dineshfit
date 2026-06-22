'use client';

import { useState } from 'react';
import { X, Upload, Plus, Trash2, Loader2 } from 'lucide-react';

export default function AdminPanel({ isOpen, onClose, currentHero, onUpdateHero, transformations, onAddTrans, onDeleteTrans }) {
  const [isHeroUploading, setIsHeroUploading] = useState(false);
  const [isTransUploading, setIsTransUploading] = useState(false);

  if (!isOpen) return null;

  // Handles communicating with our native file storage system
  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'hero') setIsHeroUploading(true);
    if (type === 'trans') setIsTransUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      if (result.success) {
        if (type === 'hero') {
          onUpdateHero(result.url);
        } else {
          onAddTrans(result.url);
        }
      } else {
        alert('Upload matrix failed. Check file type.');
      }
    } catch (err) {
      console.error(err);
      alert('Network transmission error during upload.');
    } finally {
      setIsHeroUploading(false);
      setIsTransUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex justify-end">
      <div className="w-full max-w-lg bg-zinc-950 border-l border-zinc-900 h-full p-6 overflow-y-auto flex flex-col justify-between text-white">
        
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-zinc-900">
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-gymGold-400">TEAM DINESH CONTROL HUB</h2>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Live Content Management Studio</p>
            </div>
            <button onClick={onClose} className="p-2 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
              <X size={16} />
            </button>
          </div>

          {/* 1. HERO IMAGE UPLOAD */}
          <div className="py-6 border-b border-zinc-900 space-y-3">
            <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400">1. Upload Hero Showcase Image</label>
            <div className="flex items-center gap-4 bg-zinc-900/40 border border-zinc-800/80 p-4 rounded-xl">
              <img src={currentHero} className="w-20 h-12 object-cover rounded-md bg-black border border-zinc-800" alt="Hero View" />
              <div className="flex-1">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-300 hover:border-gymGold-500 cursor-pointer transition">
                  {isHeroUploading ? <Loader2 size={14} className="animate-spin text-gymGold-500" /> : <Upload size={14} />}
                  {isHeroUploading ? 'Uploading...' : 'Choose Photo'}
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'hero')} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* 2. TRANSFORMATION FLYER UPLOAD */}
          <div className="py-6 border-b border-zinc-900 space-y-4">
            <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400">2. Upload Transformation Cards</label>
            
            <div className="bg-zinc-900/20 border border-zinc-800/60 p-4 rounded-xl flex items-center justify-between">
              <span className="text-xs text-zinc-500 font-medium">Add a new poster flyer directly to the 3D slider</span>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-gymGold-500 text-black rounded-xl text-xs font-black uppercase tracking-wider hover:bg-gymGold-600 cursor-pointer transition">
                {isTransUploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                {isTransUploading ? 'Processing...' : 'Upload Flyer'}
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'trans')} className="hidden" />
              </label>
            </div>

            {/* Live active carousel checklist management */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 pt-2">
              {transformations.map((item, idx) => (
                <div key={item.id || idx} className="flex items-center justify-between p-2.5 bg-zinc-900/40 border border-zinc-800/60 rounded-xl">
                  <div className="flex items-center gap-3">
                    <img src={item.img} className="w-10 h-12 object-contain bg-zinc-950 rounded border border-zinc-800" alt="" />
                    <span className="text-[10px] font-mono text-zinc-500 max-w-[180px] truncate">{item.img}</span>
                  </div>
                  <button onClick={() => onDeleteTrans(item.id)} className="p-2 text-zinc-600 hover:text-red-400 transition">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sync Panel Confirmation */}
        <div className="pt-4 border-t border-zinc-900">
          <button onClick={onClose} className="w-full py-3.5 bg-gradient-to-r from-gymGold-500 to-amber-600 text-black text-xs font-black uppercase tracking-widest rounded-xl shadow-lg transition">
            Publish System Updates Live
          </button>
        </div>

      </div>
    </div>
  );
}