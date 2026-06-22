'use client';

import { useState } from 'react';
import { X, Upload, Plus, Trash2, Loader2, ListPlus } from 'lucide-react';

export default function AdminPanel({ 
  isOpen, 
  onClose, 
  currentHero, 
  onUpdateHero, 
  transformations, 
  onAddTrans, 
  onDeleteTrans,
  formFields = [], // Managed in parent state (e.g., app/page.js)
  onUpdateFormFields 
}) {
  const [isHeroUploading, setIsHeroUploading] = useState(false);
  const [isTransUploading, setIsTransUploading] = useState(false);

  // States for configuring a new input field dynamically
  const [newLabel, setNewLabel] = useState('');
  const [newType, setNewType] = useState('text');
  const [rawOptions, setRawOptions] = useState('');

  if (!isOpen) return null;

  // Handles raw media ingestion to database storage bucket
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
        alert('Upload failed. Verify image formatting parameters.');
      }
    } catch (err) {
      console.error(err);
      alert('Network timeout during asset transmission.');
    } finally {
      setIsHeroUploading(false);
      setIsTransUploading(false);
    }
  };

  // Inject a customized field configurations block
  const handleAddField = (e) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    // Convert comma-separated user inputs into structured arrays
    const cleanOptions = rawOptions
      .split(',')
      .map(opt => opt.trim())
      .filter(opt => opt.length > 0);

    const newFieldObject = {
      id: `field_${Date.now()}`,
      label: newLabel,
      type: newType,
      ...(newType === 'radio' && { options: cleanOptions })
    };

    if (onUpdateFormFields) {
      onUpdateFormFields([...formFields, newFieldObject]);
    }

    // Reset setup configuration states
    setNewLabel('');
    setRawOptions('');
  };

  // Erase existing template field configurations block
  const handleDeleteField = (fieldId) => {
    if (onUpdateFormFields) {
      onUpdateFormFields(formFields.filter(f => f.id !== fieldId));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex justify-end">
      <div className="w-full max-w-lg bg-zinc-950 border-l border-zinc-900 h-full p-6 overflow-y-auto flex flex-col justify-between text-white">
        
        <div className="space-y-6">
          {/* Dashboard Title Header Block */}
          <div className="flex items-center justify-between pb-6 border-b border-zinc-900">
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-gymGold-400">TEAM DINESH CONTROL HUB</h2>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Live Content Management Studio</p>
            </div>
            <button onClick={onClose} className="p-2 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
              <X size={16} />
            </button>
          </div>

          {/* SECTION 1: HERO CONTAINER CONTROL */}
          <div className="py-2 border-b border-zinc-900 space-y-3">
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

          {/* SECTION 2: TRANSFORMATION SLIDES MANAGEMENT */}
          <div className="py-2 border-b border-zinc-900 space-y-4">
            <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400">2. Upload Transformation Cards</label>
            
            <div className="bg-zinc-900/20 border border-zinc-800/60 p-4 rounded-xl flex items-center justify-between">
              <span className="text-xs text-zinc-500 font-medium">Add a new poster flyer directly to the 3D slider</span>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-gymGold-500 text-black rounded-xl text-xs font-black uppercase tracking-wider hover:bg-gymGold-600 cursor-pointer transition">
                {isTransUploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                {isTransUploading ? 'Processing...' : 'Upload Flyer'}
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'trans')} className="hidden" />
              </label>
            </div>

            {/* List Array Render of Active Carousel Images */}
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 pt-1">
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

          {/* SECTION 3: CORE FORM FIELDS ENGINE */}
          <div className="py-2 space-y-4">
            <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400">3. Configure Leads Form Fields</label>
            
            {/* Entry Interactive Panel */}
            <div className="bg-zinc-900/30 border border-zinc-900 p-4 rounded-xl space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wide mb-1">Field Name / Label</label>
                  <input 
                    type="text" 
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="e.g., Age, Fitness Goal"
                    className="w-full bg-zinc-950 text-xs border border-zinc-800 p-2 rounded-lg focus:outline-none focus:border-gymGold-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wide mb-1">Data Type</label>
                  <select 
                    value={newType} 
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full bg-zinc-950 text-xs border border-zinc-800 p-2 rounded-lg focus:outline-none focus:border-gymGold-500 text-zinc-300"
                  >
                    <option value="text">Plain Text</option>
                    <option value="number">Number</option>
                    <option value="radio">Multiple Choice Options</option>
                  </select>
                </div>
              </div>

              {/* Renders conditionally if Choice Options type is requested */}
              {newType === 'radio' && (
                <div>
                  <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wide mb-1">Options (Separate options with commas)</label>
                  <input 
                    type="text" 
                    value={rawOptions}
                    onChange={(e) => setRawOptions(e.target.value)}
                    placeholder="e.g., Muscle Gain, Fat Loss, Monthly Plan"
                    className="w-full bg-zinc-950 text-xs border border-zinc-800 p-2 rounded-lg focus:outline-none focus:border-gymGold-500 text-white"
                  />
                </div>
              )}

              <button 
                onClick={handleAddField}
                className="w-full py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-bold text-zinc-300 hover:text-white hover:border-zinc-700 flex items-center justify-center gap-1.5 transition"
              >
                <ListPlus size={13} /> Add Configured Field
              </button>
            </div>

            {/* List Panel View of Currently Selected Elements */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '160px', overflowY: 'auto', paddingRight: '4px' }}>
              {formFields && formFields.map((field) => (
                <div key={field.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0c0c10', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '12px', color: '#ffffff', fontWeight: '700' }}>
                      {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
                    </span>
                    <span style={{ fontSize: '9px', color: '#a1a1aa', fontFamily: 'monospace', textTransform: 'uppercase', trackingWider: '1px' }}>
                      Type: {field.type || 'text'} {field.options ? `[${field.options.join(' | ')}]` : ''}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => deleteSchemaFieldNode(field.id)} 
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Global Action Publishing Block */}
        <div className="pt-4 border-t border-zinc-900">
          <button onClick={onClose} className="w-full py-3.5 bg-gradient-to-r from-gymGold-500 to-amber-600 text-black text-xs font-black uppercase tracking-widest rounded-xl shadow-lg transition">
            Publish System Updates Live
          </button>
        </div>

      </div>
    </div>
  );
}