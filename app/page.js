'use client';
import SecurityForm from '@/components/SecurityForm';
import { useState, useEffect } from 'react';
import { supabase } from './supabase'; 
import { 
  X, Flame, ChevronRight, ChevronLeft, Star, Plus, Key,
  Dumbbell, Target, Apple, Zap, Phone, Mail, Clock, Trash2, Image, UploadCloud, Film
} from 'lucide-react';

export default function Home() {
  const uiColorMode = '#f59e0b'; 
  const coachWhatsAppNumber = '919177385668'; 
  const masterBackupKey = 'TEAM-DINESH-2026-RECOVERY';

  // Panel Control Management States
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

 // Dynamic Security States
 const [currentStoredPassword, setCurrentStoredPassword] = useState('dinesh123'); 
 const [pwdCurrentInput, setPwdCurrentInput] = useState('');
 const [pwdNewInput, setPwdNewInput] = useState('');
 const [pwdStatusMessage, setPwdStatusMessage] = useState({ text: '', isError: false });
 const [generatedKey, setGeneratedKey] = useState(''); // 👈 ADD THIS LINE HERE

  // Core Dynamic Application State Framework
  const [heroImage, setHeroImage] = useState('');
  const [galleryList, setGalleryList] = useState([]);
  const [transformations, setTransformations] = useState([]);
  const [formFields, setFormFields] = useState([]);

  // Modal State Controllers
  const [selectedTransformation, setSelectedTransformation] = useState(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isTransMetaModalOpen, setIsTransMetaModalOpen] = useState(false);
  
  // Dynamic Intake Accumulator State Engine
  const [dynamicEnquiryData, setDynamicEnquiryData] = useState({});
  const [selectedPlanContext, setSelectedPlanContext] = useState('');

  // Staging Matrix for incoming transform item creation
  const [tempTransImage, setTempTransImage] = useState('');
  const [newTransMeta, setNewTransMeta] = useState({
    name: '', age: '', rating: 5, beforeWeight: '', afterWeight: '', days: '', date: '', lossGainText: '', journeyText: ''
  });
  
  const [tempMediaArray, setTempMediaArray] = useState([]); 

  // Carousel Layout Pointers
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);
  const [activeTransIdx, setActiveTransIdx] = useState(0);

  // Schema Editor Staging Structs
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldRequired, setNewFieldRequired] = useState(false);

  // =========================================================================
  // CLOUD DATA HYDRATION ENGINE (SUPABASE DATA FETCHES)
  // =========================================================================
  async function loadStoredData() {
    // Fetch Dynamic Security Pin
    const { data: pwdData } = await supabase.from('settings').select('value').eq('key', 'system_pin').single();
    if (pwdData && pwdData.value) setCurrentStoredPassword(pwdData.value);

    const { data: heroData } = await supabase.from('settings').select('value').eq('key', 'hero_pic').single();
    if (heroData) setHeroImage(heroData.value);

    const { data: galleryData } = await supabase.from('gallery').select('*').order('created_at', { ascending: true });
    if (galleryData) setGalleryList(galleryData);

    const { data: transData } = await supabase.from('transformations').select('*').order('created_at', { ascending: true });
    if (transData) {
      const formatted = transData.map(item => ({
        id: item.id,
        name: item.name,
        age: item.age,
        rating: item.rating,
        beforeWeight: item.before_weight,
        afterWeight: item.after_weight,
        days: item.days,
        date: item.date,
        lossGainText: item.loss_gain_text,
        img: item.img,
        journeyText: item.journey_text,
        mediaTimeline: item.media_timeline || []
      }));
      setTransformations(formatted);
    }

    const { data: schemaData } = await supabase.from('form_schema').select('fields').eq('key', 'custom_fields').single();
    if (schemaData && schemaData.fields) setFormFields(schemaData.fields);
  }

  useEffect(() => {
    loadStoredData();
  }, []);
  
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    
    try {
      // Fetch the live default status flag directly from your settings table
      const { data, error } = await supabase
        .from('settings')
        .select('is_default')
        .limit(1)
        .single();
  
      // If he changed the password already, block "dinesh123" at the login gate
      if (data && data.is_default === false && adminPassword === 'dinesh123') {
        setAuthError('INVALID ACCESS: THIS DEFAULT PASSWORD HAS BEEN DEACTIVATED.');
        return;
      }
  
      // Standard authentication check (matches live password or master key)
      if (adminPassword === currentStoredPassword || adminPassword === masterBackupKey) {
        setIsAuthenticated(true);
        setAuthError('');
      } else {
        setAuthError('INVALID ADMINISTRATIVE ACCESS KEY');
      }
    } catch (err) {
      setAuthError('CRITICAL AUTH ERROR: Unable to verify matrix protocols.');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPwdStatusMessage({ text: '', isError: false });
    setGeneratedKey(''); // Clears any previous key on screen
  
    if (!pwdCurrentInput || !pwdNewInput) {
      setPwdStatusMessage({ text: 'Fill out all security fields.', isError: true });
      return;
    }
  
    try {
      // 1. Fetch current live security status directly from the Supabase row
      const { data: adminData, error: fetchError } = await supabase
        .from('settings')
        .select('is_default, password')
        .limit(1)
        .single();
  
      if (fetchError || !adminData) {
        setPwdStatusMessage({ text: 'Security Matrix Check Failed: Could not fetch validation metrics.', isError: true });
        return;
      }
  
      // 2. STRICT DEFAULT LOCKOUT: If they already changed the password, kill "dinesh123" forever
      if (adminData.is_default === false && pwdCurrentInput === 'dinesh123') {
        setPwdStatusMessage({ text: "Action Denied: 'dinesh123' has been permanently deactivated.", isError: true });
        return;
      }
  
      // 3. Validate authorization (Checks old password OR the old backup key)
      if (pwdCurrentInput !== adminData.password && pwdCurrentInput !== masterBackupKey) {
        setPwdStatusMessage({ text: 'Current pin mismatch. Use valid backup key if forgotten.', isError: true });
        return;
      }
  
      // 4. Generate a unique 8-character string for the new Emergency Recovery Key
      const randomSegment = Math.random().toString(36).substring(2, 10).toUpperCase();
      const recoveryKey = `COACH-SEC-${randomSegment}`;
  
      // 5. Update database: Rewrite password, set is_default to false, and store the new key
      const { error: updateError } = await supabase
        .from('settings')
        .update({ 
          password: pwdNewInput.trim(),
          is_default: false,           // Hard-locks 'dinesh123' from being used ever again
          recovery_key: recoveryKey    // Overwrites the backup storage matrix
        })
        .eq('id', 1);                  // Updates Dinesh's specific configurations row
  
      if (updateError) throw updateError;
  
      // 6. Update local app state variables on successful compilation
      setCurrentStoredPassword(pwdNewInput.trim());
      setGeneratedKey(recoveryKey); // Triggers the visual orange box display code we set up
      
      setPwdStatusMessage({ text: 'Access credential completely remixed inside database!', isError: false });
      setPwdCurrentInput('');
      setPwdNewInput('');
  
    } catch (err) {
      setPwdStatusMessage({ text: `Update aborted: ${err.message}`, isError: true });
    }
  };
  // =========================================================================
  // SAFEST HIGH-PERFORMANCE STORAGE ENGINE (PATH & FOLDER SANITIZED)
  // =========================================================================
  const processFileUploadStream = async (e, targetBlock) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop() || 'bin';
        
        let folderMapping = 'general';
        if (targetBlock === 'hero') folderMapping = 'hero';
        if (targetBlock === 'gallery') folderMapping = 'gallery';
        if (targetBlock === 'transformation') folderMapping = 'transformations';
        if (targetBlock === 'sub_media_uploader' || targetBlock === 'sub_video_uploader') {
          folderMapping = 'timeline';
        }

        // Sanitize folder names explicitly
        const cleanFolder = folderMapping.replace(/^\/+|\/+$/g, '').trim(); 
        
        const uniqueString = Math.random().toString(36).substring(2, 7);
        const cleanOriginalName = file.name.split('.')[0]
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-') 
          .replace(/-+/g, '-');       
        
        const fileName = `${Date.now()}-${uniqueString}-${cleanOriginalName}.${fileExt}`;
        
        // CRITICAL PATH CLEANSE SYSTEM
        const filePath = `${cleanFolder}/${fileName}`
          .replace(/\/+/g, '/')
          .replace(/^\/|\/$/g, '')
          .trim();

        const { error: uploadError } = await supabase.storage
          .from('coach-media')
          .upload(filePath, file, { cacheControl: '3600', upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('coach-media')
          .getPublicUrl(filePath);

        if (targetBlock === 'hero') {
          setHeroImage(publicUrl);
          await supabase.from('settings').upsert({ key: 'hero_pic', value: publicUrl });
        } else if (targetBlock === 'gallery') {
          const idStr = String(Date.now() + Math.random());
          const newItem = { id: idStr, title: file.name.split('.')[0] || 'Training Log', img: publicUrl };
          setGalleryList(prev => [...prev, newItem]);
          await supabase.from('gallery').insert([newItem]);
        } else if (targetBlock === 'transformation') {
          setTempTransImage(publicUrl);
          setTempMediaArray([{ type: 'image', url: publicUrl }]); 
          setIsTransMetaModalOpen(true);
        } else if (targetBlock === 'sub_media_uploader') {
          setTempMediaArray(prev => [...prev, { type: 'image', url: publicUrl }]);
        } else if (targetBlock === 'sub_video_uploader') {
          setTempMediaArray(prev => [...prev, { type: 'video', url: publicUrl }]);
        }
      }
    } catch (err) {
      console.error('Detailed Storage Routing Error Logs:', err);
      alert(`Storage Upload Rejected: ${err.message || 'Verify your bucket settings'}`);
    } finally {
      setIsUploading(false);
      e.target.value = ''; 
    }
  };

  const deleteGalleryItem = async (id) => {
    const updated = galleryList.filter(item => item.id !== id);
    setGalleryList(updated);
    await supabase.from('gallery').delete().eq('id', id);
    if (activeGalleryIdx >= updated.length && updated.length > 0) {
      setActiveGalleryIdx(updated.length - 1);
    }
  };

  const removeStagedMediaElement = (idx) => {
    setTempMediaArray(prev => prev.filter((_, i) => i !== idx));
  };

  const saveTransformationMetadata = async () => {
    if (!newTransMeta.name || !newTransMeta.beforeWeight || !newTransMeta.afterWeight) {
      alert('Please compile mandatory metric parameters: Name, Before, and After Weights.');
      return;
    }

    const uniqueId = Date.now();
    const compiledItem = {
      id: uniqueId,
      name: newTransMeta.name,
      age: parseInt(newTransMeta.age) || 22,
      rating: parseInt(newTransMeta.rating) || 5,
      before_weight: newTransMeta.beforeWeight,
      after_weight: newTransMeta.afterWeight,
      days: newTransMeta.days || '90 Days',
      date: newTransMeta.date || 'Recent Phase',
      loss_gain_text: newTransMeta.lossGainText || 'Weight Change Verified',
      img: tempTransImage, 
      journey_text: newTransMeta.journeyText || 'No narrative description logs initialized.',
      media_timeline: tempMediaArray
    };

    await supabase.from('transformations').insert([compiledItem]);
    await loadStoredData(); 

    setIsTransMetaModalOpen(false);
    setTempTransImage('');
    setTempMediaArray([]);
    setNewTransMeta({ name: '', age: '', rating: 5, beforeWeight: '', afterWeight: '', days: '', date: '', lossGainText: '', journeyText: '' });
  };

  const deleteTransformationItem = async (id, e) => {
    e.stopPropagation();
    setTransformations(prev => prev.filter(item => item.id !== id));
    await supabase.from('transformations').delete().eq('id', id);
  };

  const addNewCustomSchemaField = async () => {
    if (!newFieldLabel.trim()) return;
    const generatedId = 'field_' + Date.now();
    const cleanField = {
      id: generatedId,
      label: newFieldLabel,
      type: 'text',
      required: newFieldRequired,
      placeholder: `Enter ${newFieldLabel}`
    };
    const alteredSchema = [...formFields, cleanField];
    setFormFields(alteredSchema);
    await supabase.from('form_schema').upsert({ key: 'custom_fields', fields: alteredSchema });
    setNewFieldLabel('');
    setNewFieldRequired(false);
  };

  const deleteSchemaFieldNode = async (id) => {
    const alteredSchema = formFields.filter(f => f.id !== id);
    setFormFields(alteredSchema);
    await supabase.from('form_schema').upsert({ key: 'custom_fields', fields: alteredSchema });
  };

  const triggerEnquiryModal = (chosenPlanName = '') => {
    setSelectedPlanContext(chosenPlanName);
    const structuredBlankMap = {};
    formFields.forEach(f => { structuredBlankMap[f.id] = ''; });
    setDynamicEnquiryData(structuredBlankMap);
    setIsEnquiryOpen(true);
  };

  const handleDynamicEnquirySubmit = (e) => {
    e.preventDefault();
    let compiledMessage = `⚡ *NEW TEAM DINESH INTAKE ENTRY* ⚡\n\n` +
                          `🔥 *Program Route:* ${selectedPlanContext || 'General Elite Program Admission'}\n` +
                          `──────────────────────\n`;
    formFields.forEach(f => {
      const clientVal = dynamicEnquiryData[f.id] || 'Not specified';
      compiledMessage += `🔸 *${f.label}:* ${clientVal}\n`;
    });
    compiledMessage += `──────────────────────\n🚀 _Sent from Team Dinesh Platform. Waiting for review._`;
    window.open(`https://wa.me/${coachWhatsAppNumber}?text=${encodeURIComponent(compiledMessage)}`, '_blank');
    setIsEnquiryOpen(false);
  };

  return (
    <main style={{ backgroundColor: '#060608', color: '#ffffff', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', position: 'relative', overflowX: 'hidden' }}>
      
      {/* Upload Global Overlay */}
      {isUploading && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(6,6,8,0.85)', backdropFilter: 'blur(12px)', zIndex: 200000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', border: `3px solid rgba(245,158,11,0.2)`, borderTopColor: uiColorMode, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: '13px', fontWeight: '800', color: uiColorMode, letterSpacing: '1px' }}>UPLOADING ASSETS TO CLOUD LOGS...</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Background Hero Layer */}
      {heroImage ? (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 1, filter: 'brightness(0.35) contrast(1.05)' }} />
      ) : (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: '#060608', zIndex: 1 }} />
      )}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.003) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.003) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none', zIndex: 2 }} />

      {/* PREMIUM APP BAR */}
      <header style={{ position: 'fixed', top: 0, left: 0, width: '100%', borderBottom: '1px solid rgba(255, 255, 255, 0.04)', zIndex: 9999, padding: '18px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box', background: 'rgba(6,6,8,0.75)', backdropFilter: 'blur(20px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '8px', height: '8px', backgroundColor: uiColorMode, borderRadius: '50%', boxShadow: `0 0 12px ${uiColorMode}` }} />
          <span style={{ fontSize: '15px', fontWeight: '900', letterSpacing: '3px' }}>TEAM DINESH</span>
        </div>
        <button onClick={() => setIsAdminOpen(true)} style={{ background: 'rgba(245,158,11,0.04)', border: `1px solid rgba(245,158,11,0.35)`, color: uiColorMode, padding: '10px 20px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', borderRadius: '6px', letterSpacing: '1px' }}>
          COACH PANEL (UPLOAD CENTRE)
        </button>
      </header>

      {/* HERO SECTION BLOCK */}
      <section style={{ position: 'relative', zIndex: 10, minHeight: '90vh', display: 'flex', alignItems: 'center', padding: '140px 40px 40px 40px', boxSizing: 'border-box', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ maxWidth: '720px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(245,158,11,0.08)', border: `1px solid rgba(245,158,11,0.25)`, color: uiColorMode, fontSize: '11px', fontWeight: '800', padding: '6px 14px', borderRadius: '100px', marginBottom: '28px', letterSpacing: '0.8px' }}>
            <Flame size={13} /> ELITE METRIC-DRIVEN RESULTS ONLY
          </div>
          <h1 style={{ fontSize: 'clamp(38px, 5.5vw, 64px)', fontWeight: '900', letterSpacing: '-0.03em', lineHeight: '1.1', margin: '0 0 24px 0', textTransform: 'uppercase' }}>
            CHANGE YOUR BODY.<br/><span style={{ color: uiColorMode, textShadow: '0 0 40px rgba(245,158,11,0.15)' }}>REWRITE YOUR LIFE.</span>
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '16px', lineHeight: '1.65', margin: '0 0 40px 0', maxWidth: '560px' }}>
            The ultimate premium fitness engine built for peak transformation milestones. Custom nutrition mapping models, professional workout matrices, and daily structural accountability tracks.
          </p>
          <button onClick={() => triggerEnquiryModal('General Elite Program Admission')} style={{ padding: '20px 38px', backgroundColor: uiColorMode, border: 'none', color: '#000000', fontWeight: '900', fontSize: '13px', letterSpacing: '0.5px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: `0 12px 30px rgba(245,158,11,0.25)` }}>
            START YOUR JOURNEY NOW <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* GALLERY / ARCHIVE SECTION */}
      <section style={{ position: 'relative', zIndex: 10, padding: '60px 40px', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <span style={{ color: uiColorMode, fontSize: '11px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>CHAMPIONSHIP HISTORY ARCHIVE</span>
            <h2 style={{ fontSize: '26px', fontWeight: '900', margin: '4px 0 0 0', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>POSING, TRAINING & MEDALS</h2>
          </div>
          {galleryList.length > 1 && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setActiveGalleryIdx(p => p === 0 ? galleryList.length - 1 : p - 1)} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', color: '#ffffff', cursor: 'pointer', padding: '12px', borderRadius: '8px' }}><ChevronLeft size={16} /></button>
              <button onClick={() => setActiveGalleryIdx(p => (p + 1) % galleryList.length)} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', color: '#ffffff', cursor: 'pointer', padding: '12px', borderRadius: '8px' }}><ChevronRight size={16} /></button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '440px', height: '560px', overflow: 'hidden', borderRadius: '20px', backgroundColor: '#0d0d11', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 30px 60px rgba(0,0,0,0.7)' }}>
            {galleryList.length > 0 ? (
              galleryList.map((item, idx) => (
                <div key={item.id} style={{ position: 'absolute', inset: 0, opacity: idx === activeGalleryIdx ? 1 : 0, transform: `scale(${idx === activeGalleryIdx ? 1 : 0.96})`, transition: 'opacity 0.6s ease, transform 0.6s ease', zIndex: idx === activeGalleryIdx ? 5 : 1 }}>
                  <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '50px 24px 24px 24px', background: 'linear-gradient(to top, rgba(6,6,8,0.98) 20%, transparent 100%)', zIndex: 10 }}>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#ffffff', letterSpacing: '0.5px' }}>{item.title}</h4>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#52525b', textAlign: 'center', justifyContent: 'center' }}>
                <Image size={44} style={{ strokeWidth: '1', marginBottom: '16px', color: 'rgba(255,255,255,0.08)' }} />
                <p style={{ margin: 0, fontSize: '13px' }}>No archive presentation frames uploaded yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TRANSFORMATIONS PORTFOLIOS GRID */}
      <section style={{ position: 'relative', zIndex: 10, padding: '60px 40px', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px' }}>
          <div>
            <span style={{ color: uiColorMode, fontSize: '11px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>VERIFIED LIVE ARCHIVES</span>
            <h2 style={{ fontSize: '28px', fontWeight: '900', margin: '4px 0 0 0', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>CLIENT TRANSMUTATIONS</h2>
          </div>
          {transformations.length > 3 && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setActiveTransIdx(p => p === 0 ? transformations.length - 1 : p - 1)} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', color: '#ffffff', cursor: 'pointer', padding: '12px', borderRadius: '8px' }}><ChevronLeft size={16} /></button>
              <button onClick={() => setActiveTransIdx(p => (p + 1) % transformations.length)} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', color: '#ffffff', cursor: 'pointer', padding: '12px', borderRadius: '8px' }}><ChevronRight size={16} /></button>
            </div>
          )}
        </div>

        {transformations.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '32px' }}>
            {transformations.slice(activeTransIdx, activeTransIdx + 3).concat(transformations.slice(0, Math.max(0, 3 - (transformations.length - activeTransIdx)))).slice(0, Math.min(transformations.length, 3)).map((item) => (
              <div key={item.id} onClick={() => { setSelectedTransformation(item); setActiveMediaIndex(0); }} style={{ backgroundColor: '#0c0c10', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '20px', overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{ width: '100%', height: '360px', position: 'relative', backgroundColor: '#040406' }}>
                  <img src={item.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                  <div style={{ position: 'absolute', bottom: '18px', left: '18px', backgroundColor: '#10b981', color: '#ffffff', fontSize: '11px', fontWeight: '900', padding: '6px 12px', borderRadius: '6px' }}>
                    {item.lossGainText.toUpperCase()}
                  </div>
                  {item.mediaTimeline && item.mediaTimeline.length > 1 && (
                    <div style={{ position: 'absolute', top: '18px', left: '18px', backgroundColor: 'rgba(6,6,8,0.8)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.08)', color: '#ffffff', fontSize: '10px', fontWeight: '800', padding: '5px 10px', borderRadius: '6px' }}>
                      +{item.mediaTimeline.length - 1} INTERACTIVE LOGS
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: '18px', right: '18px', backgroundColor: 'rgba(6,6,8,0.8)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.08)', padding: '5px 12px', borderRadius: '6px', fontSize: '11px', color: uiColorMode, fontWeight: '800' }}>
                    {item.days.toUpperCase()}
                  </div>
                </div>

                <div style={{ padding: '28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '900' }}>{item.name} <span style={{ color: '#71717a', fontWeight: '500', fontSize: '15px' }}>• {item.age} yrs</span></h3>
                    <div style={{ display: 'flex', gap: '3px', color: uiColorMode }}>
                      {[...Array(item.rating)].map((_, i) => <Star key={i} size={13} fill="currentColor" />)}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', backgroundColor: 'rgba(255,255,255,0.01)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.03)' }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '10px', color: '#52525b', textTransform: 'uppercase', fontWeight: '800', marginBottom: '2px' }}>INITIAL MASS</span>
                      <span style={{ fontSize: '16px', fontWeight: '800', color: '#e4e4e7' }}>{item.beforeWeight}</span>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '10px', color: '#52525b', textTransform: 'uppercase', fontWeight: '800', marginBottom: '2px' }}>ATTAINED TARGET</span>
                      <span style={{ fontSize: '16px', fontWeight: '800', color: uiColorMode }}>{item.afterWeight}</span>
                    </div>
                  </div>
                  <div style={{ marginTop: '16px', fontSize: '13px', color: '#a1a1aa', lineHeight: '1.5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.journeyText}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ backgroundColor: '#0c0c10', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '20px', padding: '70px 20px', textAlign: 'center', color: '#52525b' }}>
            <UploadCloud size={40} style={{ color: 'rgba(255,255,255,0.06)', marginBottom: '14px' }} />
            <p style={{ margin: 0, fontSize: '14px' }}>No verification matrices deployed in dynamic storage yet.</p>
          </div>
        )}
      </section>

      {/* FIXED PLAYBACK PLATFORM MODAL */}
      {selectedTransformation && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(4,4,6,0.96)', backdropFilter: 'blur(24px)', zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ width: '100%', maxWidth: '960px', backgroundColor: '#0c0c10', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', overflow: 'hidden', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', boxShadow: '0 40px 90px rgba(0,0,0,0.85)' }}>
            
            <div style={{ position: 'relative', backgroundColor: '#020204', height: '520px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {selectedTransformation.mediaTimeline && selectedTransformation.mediaTimeline.length > 0 ? (
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                  {selectedTransformation.mediaTimeline[activeMediaIndex].type === 'image' ? (
                    <img src={selectedTransformation.mediaTimeline[activeMediaIndex].url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                  ) : (
                    <div style={{ width: '100%', height: '100%', backgroundColor: '#000000' }}>
                      <video src={selectedTransformation.mediaTimeline[activeMediaIndex].url} style={{ width: '100%', height: '100%', objectFit: 'contain' }} controls autoPlay muted playsInline loop />
                    </div>
                  )}

                  {selectedTransformation.mediaTimeline.length > 1 && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); setActiveMediaIndex(p => p === 0 ? selectedTransformation.mediaTimeline.length - 1 : p - 1); }} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(6,6,8,0.75)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20 }}><ChevronLeft size={18} /></button>
                      <button onClick={(e) => { e.stopPropagation(); setActiveMediaIndex(p => (p + 1) % selectedTransformation.mediaTimeline.length); }} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(6,6,8,0.75)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20 }}><ChevronRight size={18} /></button>
                      <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px', zIndex: 20 }}>
                        {selectedTransformation.mediaTimeline.map((_, i) => (
                          <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: i === activeMediaIndex ? uiColorMode : 'rgba(255,255,255,0.3)' }} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <img src={selectedTransformation.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
              )}
            </div>

            <div style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '1px solid rgba(255,255,255,0.04)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '900' }}>{selectedTransformation.name}</h3>
                    <span style={{ color: '#71717a', fontSize: '13px', display: 'block', marginTop: '2px' }}>Client Index Status: Verified • {selectedTransformation.date}</span>
                  </div>
                  <button onClick={() => setSelectedTransformation(null)} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer' }}><X size={24} /></button>
                </div>
                <div style={{ display: 'inline-block', backgroundColor: 'rgba(16,185,129,0.08)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)', fontSize: '11px', fontWeight: '900', padding: '6px 14px', borderRadius: '6px', marginBottom: '28px' }}>
                  {selectedTransformation.lossGainText.toUpperCase()} ({selectedTransformation.days.toUpperCase()})
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '16px', borderRadius: '10px' }}>
                    <span style={{ display: 'block', fontSize: '10px', color: '#52525b', textTransform: 'uppercase', fontWeight: '800', marginBottom: '2px' }}>Initial Base Mass</span>
                    <span style={{ fontSize: '18px', fontWeight: '900', color: '#ffffff' }}>{selectedTransformation.beforeWeight}</span>
                  </div>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '16px', borderRadius: '10px' }}>
                    <span style={{ display: 'block', fontSize: '10px', color: '#52525b', textTransform: 'uppercase', fontWeight: '800', marginBottom: '2px' }}>Target Attained</span>
                    <span style={{ fontSize: '18px', fontWeight: '900', color: uiColorMode }}>{selectedTransformation.afterWeight}</span>
                  </div>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '800' }}>Evolutionary Metric Narrative</h4>
                  <p style={{ margin: 0, color: '#d4d4d8', fontSize: '14px', lineHeight: '1.6', maxHeight: '130px', overflowY: 'auto' }}>{selectedTransformation.journeyText}</p>
                </div>
              </div>
              <button onClick={() => { setSelectedTransformation(null); triggerEnquiryModal(`Inspired by Result Profile: ${selectedTransformation.name}`); }} style={{ width: '100%', padding: '16px', backgroundColor: uiColorMode, color: '#000000', border: 'none', borderRadius: '10px', fontWeight: '900', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                GET RESULTS LIKE THIS <ChevronRight size={16} />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CORE SERVICES MATRIX */}
      <section style={{ position: 'relative', zIndex: 10, padding: '50px 40px', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <span style={{ color: uiColorMode, fontSize: '11px', fontWeight: '800', letterSpacing: '2px' }}>COMPREHENSIVE MODELING</span>
          <h2 style={{ fontSize: '26px', fontWeight: '900', margin: '4px 0 0 0', textTransform: 'uppercase' }}>GUIDELINES & SERVICES</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          {[
            { title: 'Fat Loss Plan', desc: 'Drop body fat percentages securely with customized nutrition guidelines.', icon: <Target size={22} /> },
            { title: 'Lean Muscle Amplification', desc: 'Build clean dense muscle tissue groups through progressive load mapping protocols.', icon: <Dumbbell size={22} /> },
            { title: 'Body Recomposition Tracker', desc: 'Simultaneously cycle out fat units while introducing lean mass volume segments.', icon: <Zap size={22} /> },
            { title: 'Natural Nutrition Models', desc: 'Balanced diet design formats built using standard accessible domestic organic foods.', icon: <Apple size={22} /> }
          ].map((srv, idx) => (
            <div key={idx} style={{ backgroundColor: '#0c0c10', border: '1px solid rgba(255,255,255,0.04)', padding: '28px', borderRadius: '16px' }}>
              <div style={{ color: uiColorMode, marginBottom: '16px' }}>{srv.icon}</div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '800' }}>{srv.title}</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#a1a1aa', lineHeight: '1.55' }}>{srv.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ENQUIRY & INVESTMENT TIERS */}
      <section style={{ position: 'relative', zIndex: 10, padding: '50px 40px', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <span style={{ color: uiColorMode, fontSize: '11px', fontWeight: '800', letterSpacing: '2px' }}>PREMIUM ENROLLMENT SLOTS</span>
          <h2 style={{ fontSize: '26px', fontWeight: '900', margin: '4px 0 0 0', textTransform: 'uppercase' }}>TRAINING INVESTMENTS</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          {[
            { term: '3 Months Plan', price: '₹12,000', note: 'Starter Transformation Pack' },
            { term: '6 Months Plan', price: '₹20,000', note: 'Most Popular Strategy Matrix', high: true },
            { term: '9 Months Plan', price: '₹30,000', note: 'Advanced Frame Structural Recode' },
            { term: '12 Months Plan', price: '₹35,000', note: 'Full Annual Accountability Track' }
          ].map((tier, i) => (
            <div key={i} style={{ backgroundColor: tier.high ? 'rgba(245,158,11,0.01)' : '#0c0c10', border: tier.high ? `2px solid ${uiColorMode}` : '1px solid rgba(255,255,255,0.04)', padding: '32px 24px', borderRadius: '16px', textAlign: 'center', position: 'relative' }}>
              {tier.high && <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: uiColorMode, color: '#000000', fontSize: '9px', fontWeight: '900', padding: '4px 10px', borderRadius: '4px' }}>RECOMMENDED</div>}
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '800' }}>{tier.term}</h3>
              <p style={{ margin: '0 0 20px 0', fontSize: '11px', color: '#52525b' }}>{tier.note}</p>
              <div style={{ fontSize: '32px', fontWeight: '900', color: tier.high ? uiColorMode : '#ffffff', marginBottom: '24px' }}>{tier.price}</div>
              <button onClick={() => triggerEnquiryModal(`${tier.term} Strategy Slot (${tier.price})`)} style={{ width: '100%', padding: '14px', backgroundColor: tier.high ? uiColorMode : 'rgba(255,255,255,0.03)', color: tier.high ? '#000000' : '#ffffff', border: tier.high ? 'none' : '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontWeight: '800', fontSize: '12px' }}>
                CHOOSE PROGRAM
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* HEAD COACH SECTION */}
      <section style={{ position: 'relative', zIndex: 10, padding: '60px 40px', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>
          <div>
            <span style={{ color: uiColorMode, fontSize: '12px', fontWeight: '800', letterSpacing: '1px' }}>THE ELITE HEAD COACH</span>
            <h2 style={{ fontSize: '30px', fontWeight: '900', margin: '4px 0 16px 0' }}>COACH DINESH</h2>
            <p style={{ color: '#a1a1aa', fontSize: '14px', lineHeight: '1.65', margin: '0 0 28px 0' }}>
              Over 6 years of professional fitness coaching experience, guiding hundreds of clients from zero to elite physical shape through simple natural foods and actionable routines.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Clock size={15} style={{ color: uiColorMode }} /> <span style={{ color: '#e4e4e7' }}>6+ Years Active Experience</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Phone size={15} style={{ color: uiColorMode }} /> <span style={{ color: '#e4e4e7' }}>+91 91773 85668</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Mail size={15} style={{ color: uiColorMode }} /> <span style={{ color: '#e4e4e7' }}>contact@teamdinesh.com</span></div>
            </div>
          </div>
          <div style={{ backgroundColor: '#0c0c10', border: '1px solid rgba(255,255,255,0.04)', padding: '32px', borderRadius: '16px', width: 'fit-content' }}>
            <div style={{ fontSize: '36px', fontWeight: '900', color: uiColorMode, letterSpacing: '-1px' }}>500+</div>
            <div style={{ fontSize: '11px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700', marginTop: '4px' }}>Verified Physique Transformations Completed</div>
          </div>
        </div>
      </section>

      {/* ENTRY ACQUISITION INTAKE FORM */}
      {isEnquiryOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(4,4,6,0.92)', backdropFilter: 'blur(20px)', zIndex: 110000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '480px', backgroundColor: '#0c0c10', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '32px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '900' }}>START TRANSFORMATION</h3>
                <span style={{ fontSize: '12px', color: uiColorMode, display: 'block', marginTop: '2px', fontWeight: '600' }}>Context: {selectedPlanContext}</span>
              </div>
              <button onClick={() => setIsEnquiryOpen(false)} style={{ background: 'none', border: 'none', color: '#52525b', cursor: 'pointer' }}><X size={22} /></button>
            </div>
            
            <form onSubmit={handleDynamicEnquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {formFields.map((field) => (
                <div key={field.id}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#a1a1aa', marginBottom: '6px', fontWeight: '700', textTransform: 'uppercase' }}>
                    {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
                  </label>
                  <input 
                    required={field.required}
                    type={field.type} 
                    placeholder={field.placeholder} 
                    value={dynamicEnquiryData[field.id] || ''} 
                    onChange={(e) => setDynamicEnquiryData({ ...dynamicEnquiryData, [field.id]: e.target.value })} 
                    style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '14px', color: '#ffffff', borderRadius: '10px', boxSizing: 'border-box', fontSize: '14px' }}
                  />
                </div>
              ))}
              <button type="submit" style={{ width: '100%', padding: '16px', backgroundColor: uiColorMode, color: '#000000', border: 'none', borderRadius: '10px', fontWeight: '900', marginTop: '10px', fontSize: '13px' }}>
                SUBMIT PROFILE DATA TO COACH
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADMINISTRATIVE CONFIG SIDE PANEL */}
      {isAdminOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)', zIndex: 120000, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '100%', maxWidth: '460px', backgroundColor: '#060608', borderLeft: '1px solid rgba(255,255,255,0.06)', height: '100%', padding: '32px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <div>
                <span style={{ fontSize: '14px', fontWeight: '900', letterSpacing: '1px' }}>COACH CONTROL TERMINAL</span>
                <span style={{ display: 'block', fontSize: '11px', color: '#52525b', marginTop: '2px' }}>Configure assets and custom data arrays.</span>
              </div>
              <button onClick={() => { setIsAdminOpen(false); setIsAuthenticated(false); setPwdStatusMessage({text:'', isError:false}); }} style={{ background: 'none', border: 'none', color: '#52525b', cursor: 'pointer' }}><X size={22} /></button>
            </div>

            {!isAuthenticated ? (
              <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input type="password" placeholder="ENTER SYSTEM PIN OR EMERGENCY KEY" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} style={{ width: '100%', backgroundColor: '#0c0c10', border: '1px solid rgba(255,255,255,0.06)', padding: '16px', color: '#ffffff', borderRadius: '10px', textAlign: 'center', letterSpacing: '1px', fontSize: '13px' }} />
                {authError && <div style={{ color: '#ef4444', fontSize: '11px', textAlign: 'center', fontWeight: '600' }}>{authError}</div>}
                <button type="submit" style={{ padding: '14px', backgroundColor: '#ffffff', color: '#000000', border: 'none', borderRadius: '10px', fontWeight: '900', fontSize: '12px', cursor: 'pointer' }}>AUTHENTICATE TERMINAL</button>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
                
               {/* DYNAMIC SECURITY MANAGEMENT MATRIX */}
<div style={{ backgroundColor: 'rgba(245,158,11,0.02)', padding: '18px', borderRadius: '14px', border: `1px solid rgba(245,158,11,0.15)` }}>
  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: uiColorMode, marginBottom: '14px', fontWeight: '900' }}>
    <Key size={14} /> 🔐 SECURITY CREDENTIAL MANAGEMENT
  </label>
  
  <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
    <input 
      type="password" 
      placeholder="Verify Current Password / Backup Key" 
      value={pwdCurrentInput}
      onChange={(e) => setPwdCurrentInput(e.target.value)}
      style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '10px 12px', color: '#ffffff', borderRadius: '8px', fontSize: '12px' }}
      required
    />
    <input 
      type="password" 
      placeholder="Generate New Terminal Pass-Pin" 
      value={pwdNewInput}
      onChange={(e) => setPwdNewInput(e.target.value)}
      style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '10px 12px', color: '#ffffff', borderRadius: '8px', fontSize: '12px' }}
      required
    />
    <button type="submit" style={{ width: '100%', backgroundColor: uiColorMode, color: '#000000', fontSize: '11px', padding: '10px', borderRadius: '8px', fontWeight: '900', border: 'none', cursor: 'pointer' }}>
      REWRITE SECURITY MATRIX
    </button>
  </form>

  {/* EMERGENCY RECOVERY KEY DISPLAY */}
  {generatedKey && (
    <div style={{
      marginTop: '14px',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      border: '1px dashed #f59e0b',
      padding: '12px',
      borderRadius: '8px',
      color: '#ffffff'
    }}>
      <div style={{ fontSize: '10px', fontWeight: '900', color: '#f59e0b', marginBottom: '4px' }}>
        ⚠️ COPY EMERGENCY BACKUP CODE:
      </div>
      <div style={{ fontSize: '14px', fontWeight: '900', textAlign: 'center', letterSpacing: '1px', color: uiColorMode }}>
        {generatedKey}
      </div>
      <div style={{ fontSize: '9px', marginTop: '6px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.3' }}>
        The default password 'dinesh123' has been permanently deactivated. Keep this backup key secure to restore access if forgotten.
      </div>
    </div>
  )}

  {pwdStatusMessage.text && (
    <div style={{ marginTop: '10px', fontSize: '11px', fontWeight: '700', textAlign: 'center', color: pwdStatusMessage.isError ? '#ef4444' : '#10b981' }}>
      {pwdStatusMessage.text}
    </div>
  )}
</div>

                {/* DYNAMIC SCHEMA FIELD CONFIGURATOR */}
                <div style={{ backgroundColor: 'rgba(255,255,255,0.01)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: uiColorMode, marginBottom: '10px', fontWeight: '900', textTransform: 'uppercase' }}>⚙️ ENTRY INTAKE SCHEMA ENGINE</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                    {formFields.map(f => (
                      <div key={f.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0c0c10', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ fontSize: '12px' }}>{f.label} {f.required && <span style={{ color: '#ef4444' }}>*</span>}</span>
                        <button onClick={() => deleteSchemaFieldNode(f.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
                    <input type="text" placeholder="Custom Target Field Label" value={newFieldLabel} onChange={(e) => setNewFieldLabel(e.target.value)} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '10px 12px', color: '#ffffff', borderRadius: '8px', fontSize: '12px' }} />
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#a1a1aa', cursor: 'pointer' }}>
                      <input type="checkbox" checked={newFieldRequired} onChange={(e) => setNewFieldRequired(e.target.checked)} />
                      Enforce verification requirement (*)
                    </label>
                    <button onClick={addNewCustomSchemaField} style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#ffffff', fontSize: '11px', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: '700' }}>
                      <Plus size={14} /> APPEND SCHEMA COMPONENT
                    </button>
                  </div>
                </div>

                <div style={{ backgroundColor: 'rgba(255,255,255,0.01)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#a1a1aa', marginBottom: '8px', fontWeight: '800', textTransform: 'uppercase' }}>1. Background Hero Target Graphic</label>
                  <input type="file" accept="image/*" onChange={(e) => processFileUploadStream(e, 'hero')} style={{ color: '#ffffff', fontSize: '12px' }} />
                </div>

                <div style={{ backgroundColor: 'rgba(255,255,255,0.01)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#a1a1aa', marginBottom: '12px', fontWeight: '800', textTransform: 'uppercase' }}>2. Archive Posing Slider Files</label>
                  <input type="file" accept="image/*" multiple onChange={(e) => processFileUploadStream(e, 'gallery')} style={{ color: '#ffffff', fontSize: '12px', marginBottom: '16px' }} />
                  
                  <div style={{ fontSize: '11px', fontWeight: '800', color: uiColorMode, marginBottom: '10px' }}>ACTIVE SLIDER STRUCTS ({galleryList.length})</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                    {galleryList.map((item) => (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0c0c10', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={item.img} style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '6px' }} alt="" />
                          <span style={{ fontSize: '12px', color: '#e4e4e7', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '220px' }}>{item.title}</span>
                        </div>
                        <button onClick={() => deleteGalleryItem(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={15} /></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ backgroundColor: 'rgba(255,255,255,0.01)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#a1a1aa', marginBottom: '8px', fontWeight: '800', textTransform: 'uppercase' }}>3. New Outcome Transformation Node</label>
                  <input type="file" accept="image/*" onChange={(e) => processFileUploadStream(e, 'transformation')} style={{ color: '#ffffff', fontSize: '12px', marginBottom: '16px' }} />
                  
                  <div style={{ fontSize: '11px', fontWeight: '800', color: uiColorMode, marginBottom: '10px' }}>PROFILES LIVE ARCHIVE ({transformations.length})</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                    {transformations.map((item) => (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0c0c10', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={item.img} style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '6px' }} alt="" />
                          <span style={{ fontSize: '12px', fontWeight: '600' }}>{item.name} ({item.days})</span>
                        </div>
                        <button onClick={(e) => deleteTransformationItem(item.id, e)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={15} /></button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* ALBUM COMPILER MULTIMEDIA FRAME */}
      {isTransMetaModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(4,4,6,0.98)', zIndex: 130000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ width: '100%', maxWidth: '560px', backgroundColor: '#0c0c10', border: `1px solid ${uiColorMode}`, borderRadius: '24px', padding: '32px', maxHeight: '85vh', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '17px', fontWeight: '900', color: uiColorMode, textTransform: 'uppercase' }}>Configure Transformation Metrics</h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '12px', color: '#52525b' }}>Complete profile metrics and link up sequence elements into the timeline.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <input type="text" placeholder="Client Name *" value={newTransMeta.name} onChange={(e) => setNewTransMeta({...newTransMeta, name: e.target.value})} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '12px 14px', color: '#ffffff', borderRadius: '8px' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input type="number" placeholder="Age Parameters" value={newTransMeta.age} onChange={(e) => setNewTransMeta({...newTransMeta, age: e.target.value})} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '12px 14px', color: '#ffffff', borderRadius: '8px' }} />
                <input type="text" placeholder="Duration Frame" value={newTransMeta.days} onChange={(e) => setNewTransMeta({...newTransMeta, days: e.target.value})} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '12px 14px', color: '#ffffff', borderRadius: '8px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input type="text" placeholder="Before Weight Matrix *" value={newTransMeta.beforeWeight} onChange={(e) => setNewTransMeta({...newTransMeta, beforeWeight: e.target.value})} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '12px 14px', color: '#ffffff', borderRadius: '8px' }} />
                <input type="text" placeholder="After Weight Target *" value={newTransMeta.afterWeight} onChange={(e) => setNewTransMeta({...newTransMeta, afterWeight: e.target.value})} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '12px 14px', color: '#ffffff', borderRadius: '8px' }} />
              </div>
              <input type="text" placeholder="Metric Outcome Summary Label" value={newTransMeta.lossGainText} onChange={(e) => setNewTransMeta({...newTransMeta, lossGainText: e.target.value})} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '12px 14px', color: '#ffffff', borderRadius: '8px' }} />
              <input type="text" placeholder="Verified Phase Target Date" value={newTransMeta.date} onChange={(e) => setNewTransMeta({...newTransMeta, date: e.target.value})} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '12px 14px', color: '#ffffff', borderRadius: '8px' }} />
              <textarea rows={2} placeholder="Transformation Evolutionary Journey Narrative Logs..." value={newTransMeta.journeyText} onChange={(e) => setNewTransMeta({...newTransMeta, journeyText: e.target.value})} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '12px 14px', color: '#ffffff', borderRadius: '8px', resize: 'none', lineHeight: '1.5' }} />
            </div>

            {/* INTERACTIVE TIMELINE ELEMENT ASSEMBLER */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '18px', marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: uiColorMode, fontWeight: '900', marginBottom: '12px', textTransform: 'uppercase' }}>📸 MULTI-MEDIA TIMELINE BUILDER</label>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                {tempMediaArray.map((med, idx) => (
                  <div key={idx} style={{ width: '64px', height: '64px', position: 'relative', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#000000' }}>
                    {med.type === 'image' ? (
                      <img src={med.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Film size={18} style={{ color: uiColorMode }} /></div>
                    )}
                    <button onClick={() => removeStagedMediaElement(idx)} style={{ position: 'absolute', top: '2px', right: '2px', background: '#ef4444', border: 'none', borderRadius: '50%', color: '#ffffff', width: '16px', height: '16px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900' }}>×</button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '11px', color: '#a1a1aa', marginBottom: '6px', fontWeight: '700' }}>Append Strategy Frames (Images):</span>
                  <input type="file" accept="image/*" onChange={(e) => processFileUploadStream(e, 'sub_media_uploader')} style={{ color: '#ffffff', fontSize: '11px' }} />
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '12px' }}>
                  <span style={{ display: 'block', fontSize: '11px', color: '#a1a1aa', marginBottom: '6px', fontWeight: '700' }}>Append Performance Logs (Videos):</span>
                  <input type="file" accept="video/*" onChange={(e) => processFileUploadStream(e, 'sub_video_uploader')} style={{ color: '#ffffff', fontSize: '11px' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => { setIsTransMetaModalOpen(false); setTempTransImage(''); setTempMediaArray([]); }} style={{ flex: 1, padding: '14px', backgroundColor: 'rgba(255,255,255,0.04)', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700' }}>Cancel</button>
              <button onClick={saveTransformationMetadata} style={{ flex: 1, padding: '14px', backgroundColor: uiColorMode, color: '#000000', border: 'none', borderRadius: '8px', fontWeight: '900' }}>Deploy Verification Card</button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}