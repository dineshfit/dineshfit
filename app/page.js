'use client';

import SecurityForm from '@/components/SecurityForm';
import { useState, useEffect, useRef } from 'react';
import { supabase } from './supabase'; 
import { 
  X, Flame, ChevronRight, ChevronLeft, Star, Plus, Key,
  Dumbbell, Target, Apple, Zap, Phone, Mail, Clock, Trash2, Image, UploadCloud, Film
} from 'lucide-react';

export default function Home() {
  // =========================================================================
  // CORE ENVIRONMENT SYSTEM CONFIGURATIONS
  // =========================================================================
  const uiColorMode = '#f59e0b'; 
  const coachWhatsAppNumber = '919177385668'; 
  const masterBackupKey = 'TEAM-DINESH-2026-RECOVERY';

  // =========================================================================
  // STATE MANAGEMENT SYSTEM
  // =========================================================================
  
  // Multi-Step Wizard Engine States
  const [formStep, setFormStep] = useState(1);
  const totalSteps = 4;

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
  const [generatedKey, setGeneratedKey] = useState('');

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

  // Edit Transformation State
  const [editingTransId, setEditingTransId] = useState(null);
  const swipeStartXRef = useRef(0);

  // Carousel Layout Pointers
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);
  const [activeTransIdx, setActiveTransIdx] = useState(0);

  // Dynamic Packages State
  const [packages, setPackages] = useState([
    { id: 'pkg_1', term: '3 Months Coaching Plan', price: '₹9,999', desc: 'Accelerated structural phase shifting framework ideal for short target resets.', points: ['Customized Meal Strategy Models', 'Full Workout Architecture Logs', 'Weekly Optimization Overhauls', 'Direct WhatsApp Line Connectivity'], high: false },
    { id: 'pkg_2', term: '6 Months Elite Strategy', price: '₹17,999', desc: 'Advanced dynamic recomposition system designed for high physical adaptation cycles.', points: ['Comprehensive Macronutrient Matrix Charts', 'Hypertrophy Structural Mapping Protocols', 'Bi-weekly Direct Physical Checks', 'Priority Communication Pathway Access'], high: true },
    { id: 'pkg_3', term: '12 Months Lifelong Legacy', price: '₹32,999', desc: 'Complete physical lifestyle conversion model tracking full permanent physiological upgrades.', points: ['Complete Multi-Phase Nutritional Cycles', 'Periodized Strength Training Formulas', 'Continuous Lifestyle Strategy Mapping', 'Direct Unlimited Matrix Coaching Access'], high: false }
  ]);
  const [editingPkgId, setEditingPkgId] = useState(null);

  // Schema Editor Staging Structs
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldType, setNewFieldType] = useState('text');
  const [newFieldStep, setNewFieldStep] = useState(3); 
  const [rawOptions, setRawOptions] = useState('');

  // =========================================================================
  // CLOUD DATA HYDRATION ENGINE (SUPABASE DATA FETCHES)
  // =========================================================================
  async function loadStoredData() {
    const { data: pwdData } = await supabase.from('settings').select('value').eq('key', 'system_pin').maybeSingle();
    if (pwdData && pwdData.value) setCurrentStoredPassword(pwdData.value);

    const { data: heroData } = await supabase.from('settings').select('value').eq('key', 'hero_pic').maybeSingle();
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

    const { data: schemaData } = await supabase.from('form_schema').select('fields').eq('key', 'custom_fields').maybeSingle();
    if (schemaData && schemaData.fields) setFormFields(schemaData.fields);

    const { data: pkgData } = await supabase.from('settings').select('value').eq('key', 'packages_config').maybeSingle();
    if (pkgData && pkgData.value) {
      try { setPackages(JSON.parse(pkgData.value)); } catch(_) {}
    }
  }

  useEffect(() => {
    loadStoredData();
  }, []);

  // Reset indices bounds if array updates live
  useEffect(() => {
    if (activeTransIdx >= transformations.length) {
      setActiveTransIdx(0);
    }
  }, [transformations, activeTransIdx]);

  // =========================================================================
  // TERMINAL SECURITY METRICS OPERATIONS
  // =========================================================================
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from('settings').select('is_default').limit(1).single();
      if (data && data.is_default === false && adminPassword === 'dinesh123') {
        setAuthError('INVALID ACCESS: THIS DEFAULT PASSWORD HAS BEEN DEACTIVATED.');
        return;
      }
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
    setGeneratedKey('');
    if (!pwdCurrentInput || !pwdNewInput) {
      setPwdStatusMessage({ text: 'Fill out all security fields.', isError: true });
      return;
    }
    try {
      const { data: adminData, error: fetchError } = await supabase.from('settings').select('is_default, password').limit(1).single();
      if (fetchError || !adminData) {
        setPwdStatusMessage({ text: 'Security Matrix Check Failed: Could not fetch validation metrics.', isError: true });
        return;
      }
      if (adminData.is_default === false && pwdCurrentInput === 'dinesh123') {
        setPwdStatusMessage({ text: "Action Denied: 'dinesh123' has been permanently deactivated.", isError: true });
        return;
      }
      if (pwdCurrentInput !== adminData.password && pwdCurrentInput !== masterBackupKey) {
        setPwdStatusMessage({ text: 'Current pin mismatch. Use valid backup key if forgotten.', isError: true });
        return;
      }
      const randomSegment = Math.random().toString(36).substring(2, 10).toUpperCase();
      const recoveryKey = `COACH-SEC-${randomSegment}`;
      const { error: updateError } = await supabase.from('settings').update({ password: pwdNewInput.trim(), is_default: false, recovery_key: recoveryKey }).eq('id', 1);
      if (updateError) throw updateError;
      setCurrentStoredPassword(pwdNewInput.trim());
      setGeneratedKey(recoveryKey); 
      setPwdStatusMessage({ text: 'Access credential completely remixed inside database!', isError: false });
      setPwdCurrentInput('');
      setPwdNewInput('');
    } catch (err) {
      setPwdStatusMessage({ text: `Update aborted: ${err.message}`, isError: true });
    }
  };

  // =========================================================================
  // SAFEST MULTIMEDIA CORE FILE STREAM STORAGE ROUTER
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
        if (targetBlock === 'sub_media_uploader' || targetBlock === 'sub_video_uploader') folderMapping = 'timeline';

        const cleanFolder = folderMapping.replace(/^\/+|\/+$/g, '').trim(); 
        const uniqueString = Math.random().toString(36).substring(2, 7);
        const cleanOriginalName = file.name.split('.')[0].toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');       
        const fileName = `${Date.now()}-${uniqueString}-${cleanOriginalName}.${fileExt}`;
        const filePath = `${cleanFolder}/${fileName}`.replace(/\/+/g, '/').replace(/^\/|\/$/g, '').trim();

        const { error: uploadError } = await supabase.storage.from('coach-media').upload(filePath, file, { cacheControl: '3600', upsert: true });
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('coach-media').getPublicUrl(filePath);

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

  // =========================================================================
  // ARCHIVE METRIC ACTION HANDLERS
  // =========================================================================
  const deleteGalleryItem = async (id) => {
    const updated = galleryList.filter(item => item.id !== id);
    setGalleryList(updated);
    await supabase.from('gallery').delete().eq('id', id);
  };

  const removeStagedMediaElement = (idx) => {
    setTempMediaArray(prev => prev.filter((_, i) => i !== idx));
  };

  const saveTransformationMetadata = async () => {
    if (!newTransMeta.name || !newTransMeta.beforeWeight || !newTransMeta.afterWeight) {
      alert('Please compile mandatory metric parameters: Name, Before, and After Weights.');
      return;
    }

    if (editingTransId) {
      const updatedItem = {
        name: newTransMeta.name,
        age: newTransMeta.age !== '' && newTransMeta.age !== undefined ? parseInt(newTransMeta.age) : '',
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
      await supabase.from('transformations').update(updatedItem).eq('id', editingTransId);
    } else {
      const uniqueId = Date.now();
      const compiledItem = {
        id: uniqueId,
        name: newTransMeta.name,
        age: newTransMeta.age !== '' && newTransMeta.age !== undefined ? parseInt(newTransMeta.age) : '',
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
    }

    await loadStoredData();

    setIsTransMetaModalOpen(false);
    setEditingTransId(null);
    setTempTransImage('');
    setTempMediaArray([]);
    setNewTransMeta({ name: '', age: '', rating: 5, beforeWeight: '', afterWeight: '', days: '', date: '', lossGainText: '', journeyText: '' });
  };

  const deleteTransformationItem = async (id, e) => {
    e.stopPropagation();
    setTransformations(prev => prev.filter(item => item.id !== id));
    await supabase.from('transformations').delete().eq('id', id);
  };

  const openEditTransformation = (item, e) => {
    e.stopPropagation();
    setEditingTransId(item.id);
    setTempTransImage(item.img);
    setTempMediaArray(item.mediaTimeline || []);
    setNewTransMeta({
      name: item.name,
      age: item.age !== undefined && item.age !== null ? String(item.age) : '',
      rating: item.rating || 5,
      beforeWeight: item.beforeWeight || '',
      afterWeight: item.afterWeight || '',
      days: item.days || '',
      date: item.date || '',
      lossGainText: item.lossGainText || '',
      journeyText: item.journeyText || ''
    });
    setIsTransMetaModalOpen(true);
  };

  // =========================================================================
  // CUSTOM INTAKE SCHEMA ENGINE COMPILER
  // =========================================================================
  const addNewCustomSchemaField = async () => {
    if (!newFieldLabel.trim()) return;
    
    const generatedId = 'field_' + Date.now();
    const cleanOptions = rawOptions
      ? rawOptions.split(',').map(o => o.trim()).filter(o => o.length > 0)
      : [];

    const cleanField = {
      id: generatedId,
      label: newFieldLabel,
      type: newFieldType || 'text', 
      step: parseInt(newFieldStep) || 3, 
      required: !!newFieldRequired,
      placeholder: `Enter ${newFieldLabel}`,
      ...(newFieldType === 'radio' && { options: cleanOptions })
    };

    const alteredSchema = [...formFields, cleanField];

    try {
      setFormFields(alteredSchema);
      const { error } = await supabase
        .from('form_schema')
        .upsert({ key: 'custom_fields', fields: alteredSchema });

      if (error) throw error;

      setNewFieldLabel('');
      setRawOptions('');
      setNewFieldRequired(false);
    } catch (err) {
      console.error("Database upsert failed:", err);
      alert("Transmission failed. Schema configuration could not sync.");
    }
  };

  const deleteSchemaFieldNode = async (id) => {
    const alteredSchema = formFields.filter(f => f.id !== id);
    setFormFields(alteredSchema);
    await supabase.from('form_schema').upsert({ key: 'custom_fields', fields: alteredSchema });
  };

  const savePackagesConfig = async (updatedPkgs) => {
    setPackages(updatedPkgs);
    await supabase.from('settings').upsert({ key: 'packages_config', value: JSON.stringify(updatedPkgs) });
  };

  const updatePackageField = (id, field, value) => {
    setPackages(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  // =========================================================================
  // DYNAMIC COMPILER INTAKE & DISPATCH OVERLAYS
  // =========================================================================
  const triggerEnquiryModal = (chosenPlanName = '') => {
    setFormStep(1);
    setSelectedPlanContext(chosenPlanName);
    const structuredBlankMap = {};
    formFields.forEach(f => { structuredBlankMap[f.id] = ''; });
    setDynamicEnquiryData(structuredBlankMap);
    setIsEnquiryOpen(true);
  };

  const handleDynamicEnquirySubmit = (e) => {
    if (e) e.preventDefault();
    let compiledMessage = `⚡ *NEW TEAM DINESH INTAKE ENTRY* ⚡\n\n` +
                          `🔥 *Program Route:* ${selectedPlanContext || 'General Elite Program Admission'}\n` +
                          `──────────────────────\n`;

    formFields.forEach(f => {
      const clientVal = dynamicEnquiryData[f.id] || 'Not specified';
      compiledMessage += `🔸 *${f.label}:* ${clientVal}\n`;
    });

    compiledMessage += `──────────────────────\n🚀 _Sent from Team Dinesh Platform._`;
    window.open(`https://wa.me/${coachWhatsAppNumber}?text=${encodeURIComponent(compiledMessage)}`, '_blank');
    setIsEnquiryOpen(false);
    setFormStep(1);
  };

  // =========================================================================
  // CORE COMPONENT GRAPHICS VIEW PLATFORM (JSX RETURN)
  // =========================================================================
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
          <button 
            onClick={() => triggerEnquiryModal('General Elite Program Admission')} 
            style={{ padding: '20px 38px', backgroundColor: uiColorMode, border: 'none', color: '#000000', fontWeight: '900', fontSize: '13px', letterSpacing: '0.5px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: `0 12px 30px rgba(245,158,11,0.25)` }}
          >
            START YOUR JOURNEY NOW <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* TRANSFORMATIONS PORTFOLIOS GRID */}
      <section className="trans-section" style={{ position: 'relative', zIndex: 10, padding: '60px 40px', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', padding: '0 4px' }}>
          <div>
            <span style={{ color: uiColorMode, fontSize: '11px', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>VERIFIED LIVE ARCHIVES</span>
            <h2 style={{ fontSize: '28px', fontWeight: '900', margin: '4px 0 0 0', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>CLIENT TRANSFORMATIONS</h2>
          </div>
          {transformations.length > 1 && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" onClick={() => setActiveTransIdx(p => p === 0 ? transformations.length - 1 : p - 1)} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', color: '#ffffff', cursor: 'pointer', padding: '12px', borderRadius: '8px' }}><ChevronLeft size={16} /></button>
              <button type="button" onClick={() => setActiveTransIdx(p => (p + 1) % transformations.length)} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', color: '#ffffff', cursor: 'pointer', padding: '12px', borderRadius: '8px' }}><ChevronRight size={16} /></button>
            </div>
          )}
        </div>

        {transformations.length > 0 ? (
          <>
            <style>{`
              @media (max-width: 768px) {
                .trans-section {
                  padding-left: 16px !important;
                  padding-right: 16px !important;
                }
                .trans-carousel-wrapper {
                  overflow: hidden !important;
                  margin: 0 -16px !important;
                  padding: 0 16px !important;
                  width: 100vw !important;
                }
                .trans-carousel-track {
                  display: flex !important;
                  flex-direction: row !important;
                  gap: 0 !important;
                  width: 100% !important;
                  transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1) !important;
                }
                .trans-carousel-card {
                  min-width: 100% !important;
                  width: 100% !important;
                  flex-shrink: 0 !important;
                  padding: 0 16px !important;
                  box-sizing: border-box !important;
                }
              }
              @media (min-width: 769px) {
                .trans-carousel-track {
                  display: grid !important;
                  grid-template-columns: repeat(auto-fit, minmax(330px, 1fr)) !important;
                  gap: 32px !important;
                  transform: none !important;
                  width: 100% !important;
                }
                .trans-carousel-card {
                  min-width: unset !important;
                  width: auto !important;
                  padding: 0 !important;
                }
              }
            `}</style>
            <div
              className="trans-carousel-wrapper"
              style={{ position: 'relative' }}
              onTouchStart={(e) => { 
                swipeStartXRef.current = e.touches[0].clientX; 
              }}
              onTouchMove={(e) => {
                if (swipeStartXRef.current !== 0) {
                  const currentX = e.touches[0].clientX;
                  const dx = currentX - swipeStartXRef.current;
                  if (Math.abs(dx) > 10) {
                    if (e.cancelable) e.preventDefault();
                  }
                }
              }}
              onTouchEnd={(e) => {
                const dx = e.changedTouches[0].clientX - swipeStartXRef.current;
                if (Math.abs(dx) > 40) {
                  if (dx < 0) {
                    setActiveTransIdx(p => (p + 1) % transformations.length);
                  } else {
                    setActiveTransIdx(p => p === 0 ? transformations.length - 1 : p - 1);
                  }
                }
                swipeStartXRef.current = 0;
              }}
            >
              <div
                className="trans-carousel-track"
                style={{ transform: `translateX(-${activeTransIdx * 100}%)` }}
              >
                {transformations.map((item) => (
                  <div key={item.id} className="trans-carousel-card">
                    <div onClick={() => { setSelectedTransformation(item); setActiveMediaIndex(0); }} style={{ backgroundColor: '#0c0c10', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '20px', overflow: 'hidden', cursor: 'pointer' }}>
                      <div style={{ width: '100%', height: '360px', position: 'relative' }}>
                        <img src={item.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                        <div style={{ position: 'absolute', bottom: '18px', left: '18px', backgroundColor: '#10b981', color: '#ffffff', fontSize: '11px', fontWeight: '900', padding: '6px 12px', borderRadius: '6px' }}>
                          {item.lossGainText ? item.lossGainText.toUpperCase() : 'METRIC'}
                        </div>
                        {item.mediaTimeline && item.mediaTimeline.length > 1 && (
                          <div style={{ position: 'absolute', top: '18px', left: '18px', backgroundColor: 'rgba(6,6,8,0.8)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.08)', color: '#ffffff', fontSize: '10px', fontWeight: '800', padding: '5px 10px', borderRadius: '6px' }}>
                            +{item.mediaTimeline.length - 1} INTERACTIVE LOGS
                          </div>
                        )}
                        <div style={{ position: 'absolute', top: '18px', right: '18px', backgroundColor: 'rgba(6,6,8,0.8)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.08)', padding: '5px 12px', borderRadius: '6px', fontSize: '11px', color: uiColorMode, fontWeight: '800' }}>
                          {item.days ? item.days.toUpperCase() : ''}
                        </div>
                      </div>

                      <div style={{ padding: '28px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '900' }}>{item.name} <span style={{ color: '#71717a', fontWeight: '500', fontSize: '15px' }}>• {item.age} yrs</span></h3>
                          <div style={{ display: 'flex', gap: '3px', color: uiColorMode }}>
                            {[...Array(item.rating || 5)].map((_, i) => <Star key={i} size={13} fill="currentColor" />)}
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', backgroundColor: 'rgba(255,255,255,0.01)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.03)' }}>
                          <div>
                            <span style={{ display: 'block', fontSize: '10px', color: '#52525b', textTransform: 'uppercase', fontWeight: '800', marginBottom: '2px' }}>BEFORE TRANSFORMATION</span>
                            <span style={{ fontSize: '16px', fontWeight: '800', color: '#e4e4e7' }}>{item.beforeWeight}</span>
                          </div>
                          <div>
                            <span style={{ display: 'block', fontSize: '10px', color: '#52525b', textTransform: 'uppercase', fontWeight: '800', marginBottom: '2px' }}>AFTER TRANSFORMATION</span>
                            <span style={{ fontSize: '16px', fontWeight: '800', color: uiColorMode }}>{item.afterWeight}</span>
                          </div>
                        </div>
                        <div style={{ marginTop: '16px', fontSize: '13px', color: '#a1a1aa', lineHeight: '1.5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.journeyText}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {transformations.length > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '20px' }}>
                {transformations.map((_, idx) => (
                  <button key={idx} type="button" onClick={() => setActiveTransIdx(idx)} style={{ width: idx === activeTransIdx ? '20px' : '8px', height: '8px', borderRadius: '4px', backgroundColor: idx === activeTransIdx ? uiColorMode : 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s ease' }} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ backgroundColor: '#0c0c10', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '20px', padding: '70px 20px', textAlign: 'center', color: '#52525b' }}>
            <UploadCloud size={40} style={{ color: 'rgba(255,255,255,0.06)', marginBottom: '14px' }} />
            <p style={{ margin: 0, fontSize: '14px' }}>No verification matrices deployed in dynamic storage yet.</p>
          </div>
        )}
      </section>

      {/* SERVICES MATRIX SYSTEM OVERVIEW */}
      <section style={{ position: 'relative', zIndex: 10, padding: '40px', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          {[
            { title: 'Customized Caloric Blueprint Plan', desc: 'Drop body fat percentages securely with customized nutrition guidelines.', icon: <Target size={22} /> },
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
          <h2 style={{ fontSize: '26px', fontWeight: '900', margin: '4px 0 0 0' }}>CHOOSE YOUR PREFERRED PLAN</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
          {packages.map((tier, idx) => (
            <div key={idx} style={{ backgroundColor: '#0c0c10', border: tier.high ? `1px solid ${uiColorMode}` : '1px solid rgba(255,255,255,0.04)', borderRadius: '20px', padding: '36px', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: tier.high ? `0 20px 40px rgba(245,158,11,0.05)` : 'none' }}>
              {tier.high && <span style={{ position: 'absolute', top: '18px', right: '24px', backgroundColor: uiColorMode, color: '#000000', fontSize: '9px', fontWeight: '900', padding: '4px 10px', borderRadius: '4px' }}>MOST POPULAR ROUTE</span>}
              <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '900' }}>{tier.term}</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '12px 0 16px 0' }}>
                <span style={{ fontSize: '32px', fontWeight: '900', color: tier.high ? uiColorMode : '#ffffff' }}>{tier.price}</span>
                <span style={{ color: '#71717a', fontSize: '13px' }}>/ execution lifecycle</span>
              </div>
              <p style={{ margin: '0 0 28px 0', fontSize: '13px', color: '#a1a1aa', lineHeight: '1.5' }}>{tier.desc}</p>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '24px' }}>
                {tier.points.map((pt, pIdx) => <div key={pIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#e4e4e7' }}><div style={{ width: '5px', height: '5px', backgroundColor: uiColorMode, borderRadius: '50%' }} /> {pt}</div>)}
              </div>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Mail size={16} style={{ color: uiColorMode }} /> <span>support@teamdinesh.com</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Phone size={16} style={{ color: uiColorMode }} /> <span>+91 91773 85668</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Clock size={16} style={{ color: uiColorMode }} /> <span>Active Matrix Monitoring Available Daily</span></div>
            </div>
          </div>
          {galleryList.length > 0 && (
            <div style={{ position: 'relative' }}>
              <div style={{ width: '100%', height: '360px', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                <img src={galleryList[activeGalleryIdx].img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
              </div>
              {galleryList.length > 1 && (
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '14px' }}>
                  {galleryList.map((_, gIdx) => (
                    <button key={gIdx} type="button" onClick={() => setActiveGalleryIdx(gIdx)} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: gIdx === activeGalleryIdx ? uiColorMode : 'rgba(255,255,255,0.15)', border: 'none', padding: 0, cursor: 'pointer' }} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* FIXED PLAYBACK PLATFORM MODAL */}
      {selectedTransformation && (
        <>
          <style>{`
            @media (max-width: 640px) {
              .trans-modal-inner { flex-direction: column !important; height: 100% !important; border-radius: 0 !important; max-width: 100% !important; }
              .trans-media-pane  { width: 100% !important; height: auto !important; flex-shrink: 0; aspect-ratio: 1 / 1; }
              .trans-media-pane img, .trans-media-pane video { object-fit: contain !important; }
              .trans-info-pane   { width: 100% !important; height: auto !important; border-left: none !important; border-top: 1px solid rgba(255,255,255,0.06) !important; flex: 1; }
              .trans-modal-bg    { padding: 0 !important; align-items: flex-start !important; }
            }
          `}</style>
          <div className="trans-modal-bg" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(4,4,6,0.96)', backdropFilter: 'blur(24px)', zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div className="trans-modal-inner" style={{ width: '100%', maxWidth: '900px', height: '520px', backgroundColor: '#0c0c10', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexWrap: 'nowrap', boxShadow: '0 40px 90px rgba(0,0,0,0.85)', boxSizing: 'border-box', overflowY: 'auto' }}>
              <div className="trans-media-pane" style={{ position: 'relative', backgroundColor: '#020204', width: '50%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <button type="button" onClick={() => setSelectedTransformation(null)} style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(6,6,8,0.75)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', cursor: 'pointer', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 30 }}><X size={18} /></button>

                {selectedTransformation.mediaTimeline && selectedTransformation.mediaTimeline.length > 0 ? (
                  <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                    {selectedTransformation.mediaTimeline[activeMediaIndex].type === 'image' ? (
                      <img src={selectedTransformation.mediaTimeline[activeMediaIndex].url} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', backgroundColor: '#000000' }}>
                        <video src={selectedTransformation.mediaTimeline[activeMediaIndex].url} style={{ width: '100%', height: '100%', objectFit: 'contain' }} controls autoPlay muted playsInline loop />
                      </div>
                    )}
                    {selectedTransformation.mediaTimeline.length > 1 && (
                      <>
                        <button type="button" onClick={(e) => { e.stopPropagation(); setActiveMediaIndex(p => p === 0 ? selectedTransformation.mediaTimeline.length - 1 : p - 1); }} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(6,6,8,0.75)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20 }}><ChevronLeft size={16} /></button>
                        <button type="button" onClick={(e) => { e.stopPropagation(); setActiveMediaIndex(p => (p + 1) % selectedTransformation.mediaTimeline.length); }} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(6,6,8,0.75)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20 }}><ChevronRight size={16} /></button>
                        
                        <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px', zIndex: 20 }}>
                          {selectedTransformation.mediaTimeline.map((_, idx) => (
                            <button key={idx} type="button" onClick={() => setActiveMediaIndex(idx)} style={{ width: '6px', height: '6px', borderRadius: '50%', border: 'none', backgroundColor: idx === activeMediaIndex ? uiColorMode : 'rgba(255,255,255,0.4)', padding: 0, cursor: 'pointer' }} />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <img src={selectedTransformation.img} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="" />
                )}
              </div>

              <div className="trans-info-pane" style={{ display: 'flex', flexDirection: 'column', width: '50%', padding: '28px', boxSizing: 'border-box', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '900' }}>{selectedTransformation.name}</h3>
                    <span style={{ color: '#71717a', fontSize: '11px', display: 'block', marginTop: '2px' }}>Client Index Status: Verified • {selectedTransformation.date}</span>
                  </div>
                  <button type="button" onClick={() => setSelectedTransformation(null)} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', flexShrink: 0 }}><X size={20} /></button>
                </div>

                <div style={{ display: 'inline-block', backgroundColor: 'rgba(16,185,129,0.08)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)', fontSize: '11px', fontWeight: '900', padding: '5px 12px', borderRadius: '6px', marginBottom: '20px' }}>
                  {selectedTransformation.lossGainText ? selectedTransformation.lossGainText.toUpperCase() : 'TRANSFORMATION'} ({selectedTransformation.days ? selectedTransformation.days.toUpperCase() : ''})
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
                    <span style={{ display: 'block', fontSize: '10px', color: '#52525b', textTransform: 'uppercase', fontWeight: '800', marginBottom: '2px' }}>BEFORE TRANSFORMATION</span>
                    <span style={{ fontSize: '16px', fontWeight: '800', color: '#e4e4e7' }}>{selectedTransformation.beforeWeight}</span>
                  </div>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '12px', borderRadius: '10px' }}>
                    <span style={{ display: 'block', fontSize: '10px', color: '#52525b', textTransform: 'uppercase', fontWeight: '800', marginBottom: '2px' }}>AFTER TRANSFORMATION</span>
                    <span style={{ fontSize: '16px', fontWeight: '800', color: uiColorMode }}>{selectedTransformation.afterWeight}</span>
                  </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '16px' }}>
                  <span style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>JOURNEY LOG DESCRIPTION</span>
                  <p style={{ margin: 0, fontSize: '13px', color: '#a1a1aa', lineHeight: '1.65', whiteSpace: 'pre-wrap' }}>{selectedTransformation.journeyText}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* DYNAMIC COMPILER FORM WIZARD SYSTEM OVERLAY MODAL */}
      {isEnquiryOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(4,4,6,0.95)', backdropFilter: 'blur(20px)', zIndex: 110000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ width: '100%', maxWidth: '480px', backgroundColor: '#0c0c10', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '24px', padding: '32px', boxSizing: 'border-box', boxShadow: '0 30px 70px rgba(0,0,0,0.5)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '900' }}>ADMISSION INTAKE WIZARD</h3>
                <span style={{ color: '#71717a', fontSize: '11px', display: 'block', marginTop: '2px' }}>Context: {selectedPlanContext || 'General Elite Program Admission'}</span>
              </div>
              <button type="button" onClick={() => { setIsEnquiryOpen(false); setFormStep(1); }} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', fontWeight: '800', color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>
                <span>Step {formStep} of {totalSteps}</span>
                <span style={{ color: uiColorMode }}>{Math.round(((formStep - 1) / (totalSteps - 1)) * 100)}% Complete</span>
              </div>
              <div style={{ display: 'flex', gap: '4px', width: '100%', height: '3px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                {[...Array(totalSteps)].map((_, idx) => (
                  <div key={idx} style={{ flex: 1, height: '100%', backgroundColor: idx + 1 <= formStep ? uiColorMode : 'transparent', transition: 'background-color 0.3s ease' }} />
                ))}
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); if (formStep === totalSteps) { handleDynamicEnquirySubmit(); } }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* STEP 1: INITIAL RECOGNITION DATA */}
              {formStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#ffffff', marginBottom: '4px' }}>Personal Identity</div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>Full Client Name *</label>
                    <input type="text" required placeholder="Enter your official name" value={dynamicEnquiryData.client_name || ''} onChange={(e) => setDynamicEnquiryData({ ...dynamicEnquiryData, client_name: e.target.value })} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '14px', color: '#ffffff', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>WhatsApp Number *</label>
                    <input type="tel" required placeholder="Format: e.g. 919876543210" value={dynamicEnquiryData.client_phone || ''} onChange={(e) => setDynamicEnquiryData({ ...dynamicEnquiryData, client_phone: e.target.value })} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '14px', color: '#ffffff', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>Age Status *</label>
                    <input type="number" required placeholder="Enter years" value={dynamicEnquiryData.client_age || ''} onChange={(e) => setDynamicEnquiryData({ ...dynamicEnquiryData, client_age: e.target.value })} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '14px', color: '#ffffff', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
                  </div>

                  {formFields && formFields.filter(f => f.step === 1).map((field) => (
                    <div key={field.id}>
                      <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>{field.label} {field.required && '*'}</label>
                      {field.type === 'radio' || (field.options && field.options.length > 0) ? (
                        <select required={field.required} value={dynamicEnquiryData[field.id] || ''} onChange={(e) => setDynamicEnquiryData({ ...dynamicEnquiryData, [field.id]: e.target.value })} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '14px', color: '#ffffff', borderRadius: '10px', boxSizing: 'border-box', fontSize: '13px', height: '48px' }}>
                          <option value="" disabled hidden>Select option...</option>
                          {field.options.map((option, idx) => <option key={idx} value={option}>{option}</option>)}
                        </select>
                      ) : (
                        <input type={field.type || 'text'} required={field.required} placeholder={`Enter ${field.label}`} value={dynamicEnquiryData[field.id] || ''} onChange={(e) => setDynamicEnquiryData({ ...dynamicEnquiryData, [field.id]: e.target.value })} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '14px', color: '#ffffff', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* STEP 2: PROFILE PHYSICAL VECTORS */}
              {formStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#ffffff', marginBottom: '4px' }}>Physical Vitals</div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>Current Weight (KG) *</label>
                    <input type="text" required placeholder="e.g. 78.5 kg" value={dynamicEnquiryData.client_weight || ''} onChange={(e) => setDynamicEnquiryData({ ...dynamicEnquiryData, client_weight: e.target.value })} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '14px', color: '#ffffff', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>Height Metric *</label>
                    <input type="text" required placeholder="e.g. 175 cm or 5'9\" value={dynamicEnquiryData.client_height || ''} onChange={(e) => setDynamicEnquiryData({ ...dynamicEnquiryData, client_height: e.target.value })} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '14px', color: '#ffffff', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
                  </div>

                  {formFields && formFields.filter(f => f.step === 2).map((field) => (
                    <div key={field.id}>
                      <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>{field.label} {field.required && '*'}</label>
                      {field.type === 'radio' || (field.options && field.options.length > 0) ? (
                        <select required={field.required} value={dynamicEnquiryData[field.id] || ''} onChange={(e) => setDynamicEnquiryData({ ...dynamicEnquiryData, [field.id]: e.target.value })} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '14px', color: '#ffffff', borderRadius: '10px', boxSizing: 'border-box', fontSize: '13px', height: '48px' }}>
                          <option value="" disabled hidden>Select option...</option>
                          {field.options.map((option, idx) => <option key={idx} value={option}>{option}</option>)}
                        </select>
                      ) : (
                        <input type={field.type || 'text'} required={field.required} placeholder={`Enter ${field.label}`} value={dynamicEnquiryData[field.id] || ''} onChange={(e) => setDynamicEnquiryData({ ...dynamicEnquiryData, [field.id]: e.target.value })} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '14px', color: '#ffffff', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* STEP 3: LIFESTYLE ASSESSMENT */}
              {formStep === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#ffffff', marginBottom: '4px' }}>Lifestyle Assessment</div>
                  
                  {formFields && formFields.filter(f => f.step === 3).map((field) => (
                    <div key={field.id}>
                      <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>{field.label} {field.required && '*'}</label>
                      {field.type === 'radio' || (field.options && field.options.length > 0) ? (
                        <select required={field.required} value={dynamicEnquiryData[field.id] || ''} onChange={(e) => setDynamicEnquiryData({ ...dynamicEnquiryData, [field.id]: e.target.value })} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '14px', color: '#ffffff', borderRadius: '10px', boxSizing: 'border-box', fontSize: '13px', height: '48px' }}>
                          <option value="" disabled hidden>Select option...</option>
                          {field.options.map((option, idx) => <option key={idx} value={option}>{option}</option>)}
                        </select>
                      ) : (
                        <input type={field.type || 'text'} required={field.required} placeholder={`Enter ${field.label}`} value={dynamicEnquiryData[field.id] || ''} onChange={(e) => setDynamicEnquiryData({ ...dynamicEnquiryData, [field.id]: e.target.value })} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '14px', color: '#ffffff', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
                      )}
                    </div>
                  ))}

                  {formFields.filter(f => f.step === 3).length === 0 && (
                    <div style={{ padding: '20px', backgroundColor: 'rgba(245,158,11,0.04)', border: '1px dashed rgba(245,158,11,0.2)', borderRadius: '10px', textAlign: 'center', color: '#71717a', fontSize: '12px' }}>
                      No fields added for Step 3 yet. Add them from the Coach Panel.
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: ROUTE SELECTION BLUEPRINT */}
              {formStep === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#ffffff', marginBottom: '4px' }}>Target Settings</div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>Primary Goal Selection *</label>
                    <input type="text" required placeholder="e.g. Fat Loss, Muscle Gain" value={dynamicEnquiryData.client_goal || ''} onChange={(e) => setDynamicEnquiryData({ ...dynamicEnquiryData, client_goal: e.target.value })} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '14px', color: '#ffffff', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
                  </div>

                  {formFields && formFields.filter(f => f.step === 4).map((field) => (
                    <div key={field.id}>
                      <label style={{ display: 'block', fontSize: '10px', fontWeight: '800', color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '6px' }}>{field.label} {field.required && '*'}</label>
                      {field.type === 'radio' || (field.options && field.options.length > 0) ? (
                        <select required={field.required} value={dynamicEnquiryData[field.id] || ''} onChange={(e) => setDynamicEnquiryData({ ...dynamicEnquiryData, [field.id]: e.target.value })} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '14px', color: '#ffffff', borderRadius: '10px', boxSizing: 'border-box', fontSize: '13px', height: '48px' }}>
                          <option value="" disabled hidden>Select option...</option>
                          {field.options.map((option, idx) => <option key={idx} value={option}>{option}</option>)}
                        </select>
                      ) : (
                        <input type={field.type || 'text'} required={field.required} placeholder={`Enter ${field.label}`} value={dynamicEnquiryData[field.id] || ''} onChange={(e) => setDynamicEnquiryData({ ...dynamicEnquiryData, [field.id]: e.target.value })} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '14px', color: '#ffffff', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box' }} />
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                {formStep > 1 && (
                  <button type="button" onClick={() => setFormStep(prev => prev - 1)} style={{ flex: 1, padding: '16px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#ffffff', borderRadius: '12px', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}>BACK</button>
                )}
                
                {formStep < totalSteps ? (
                  <button type="button" onClick={() => {
                    if (formStep === 1) {
                      if (!dynamicEnquiryData.client_name || !dynamicEnquiryData.client_phone || !dynamicEnquiryData.client_age) {
                        return alert('Compile all identity metric markers accurately before advancing.');
                      }
                    }
                    if (formStep === 2) {
                      if (!dynamicEnquiryData.client_weight || !dynamicEnquiryData.client_height) {
                        return alert('Compile all physical matrix configurations before advancing.');
                      }
                    }
                    
                    let activeFields = formFields.filter(f => f.step === formStep || (formStep === 1 && !f.step));
                    for (let f of activeFields) {
                      if (f.required && !dynamicEnquiryData[f.id]) {
                        return alert(`"${f.label}" is required before moving to the next step.`);
                      }
                    }
                    setFormStep(prev => prev + 1);
                  }} style={{ flex: 2, padding: '16px', backgroundColor: '#ffffff', border: 'none', color: '#000000', borderRadius: '12px', fontWeight: '900', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    NEXT STEP <ChevronRight size={16} />
                  </button>
                ) : (
                  <button type="submit" style={{ flex: 2, padding: '16px', backgroundColor: uiColorMode, border: 'none', color: '#000000', borderRadius: '12px', fontWeight: '900', fontSize: '13px', cursor: 'pointer' }}>SUBMIT PROFILE DATA TO COACH</button>
                )}
              </div>
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
                <span style={{ fontSize: '14px', fontWeight: '900', letterSpacing: '1px' }}>ADMIN CONTROL CENTER</span>
                <span style={{ display: 'block', color: '#71717a', fontSize: '11px', marginTop: '2px' }}>Real-time database mutations engine</span>
              </div>
              <button onClick={() => { setIsAdminOpen(false); if(adminPassword !== currentStoredPassword && adminPassword !== masterBackupKey) { setIsAuthenticated(false); setAdminPassword(''); setAuthError(''); } }} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            {!isAuthenticated ? (
              <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                <span style={{ fontSize: '12px', color: '#a1a1aa', lineHeight: '1.5' }}>Authentication required to gain read/write channel parameters over Supabase storage assets.</span>
                <input type="password" placeholder="ENTER CORE ADMINISTRATIVE KEY" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', padding: '16px', color: '#ffffff', borderRadius: '10px', fontSize: '13px', boxSizing: 'border-box', letterSpacing: '2px', textAlign: 'center' }} />
                {authError && <div style={{ color: '#ef4444', fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px' }}>{authError}</div>}
                <button type="submit" style={{ width: '100%', padding: '16px', backgroundColor: uiColorMode, border: 'none', color: '#000000', borderRadius: '10px', fontWeight: '900', fontSize: '12px', cursor: 'pointer' }}>ESTABLISH SECURITY CONNECTION</button>
              </form>
            ) : (
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '32px', paddingRight: '4px' }}>
                
                {/* CONFIG UNIT 1: SECURITY MANAGEMENT */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <label style={{ color: '#a1a1aa', fontSize: '10px', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '900' }}><Key size={14} /> 🔐 SECURITY CREDENTIAL MANAGEMENT</label>
                  <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input type="password" placeholder="Verify Current Password / Backup Key" value={pwdCurrentInput} onChange={(e) => setPwdCurrentInput(e.target.value)} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '10px 12px', color: '#ffffff', borderRadius: '8px', fontSize: '12px' }} required />
                    <input type="password" placeholder="Generate New Terminal Pass-Pin" value={pwdNewInput} onChange={(e) => setPwdNewInput(e.target.value)} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '10px 12px', color: '#ffffff', borderRadius: '8px', fontSize: '12px' }} required />
                    <button type="submit" style={{ width: '100%', backgroundColor: uiColorMode, color: '#000000', fontSize: '11px', padding: '10px', borderRadius: '8px', fontWeight: '900', border: 'none', cursor: 'pointer' }}>REWRITE SECURITY MATRIX</button>
                  </form>
                  {generatedKey && (
                    <div style={{ marginTop: '14px', backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px dashed #f59e0b', padding: '12px', borderRadius: '8px', color: '#ffffff' }}>
                      <div style={{ fontSize: '10px', fontWeight: '900', color: '#f59e0b', marginBottom: '4px' }}>⚠️ COPY EMERGENCY BACKUP CODE:</div>
                      <div style={{ fontSize: '14px', fontWeight: '900', textAlign: 'center', letterSpacing: '1px', color: uiColorMode }}>{generatedKey}</div>
                    </div>
                  )}
                  {pwdStatusMessage.text && <div style={{ fontSize: '11px', color: pwdStatusMessage.isError ? '#ef4444' : '#10b981', fontWeight: '700' }}>{pwdStatusMessage.text}</div>}
                </div>

                {/* CONFIG UNIT 2: APP ASSET ROUTERS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <label style={{ color: '#a1a1aa', fontSize: '10px', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '900' }}><UploadCloud size={14} /> 🌐 STATIC ASSETS STREAM UPLOADERS</label>
                  
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', color: '#e4e4e7', marginBottom: '6px', fontWeight: '700' }}>Background Hero Image (Replaces Old)</span>
                    <input type="file" accept="image/*" onChange={(e) => processFileUploadStream(e, 'hero')} style={{ color: '#ffffff', fontSize: '11px' }} />
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '12px' }}>
                    <span style={{ display: 'block', fontSize: '11px', color: '#e4e4e7', marginBottom: '6px', fontWeight: '700' }}>Append Training Log Slide to Head Gallery</span>
                    <input type="file" accept="image/*" onChange={(e) => processFileUploadStream(e, 'gallery')} style={{ color: '#ffffff', fontSize: '11px' }} />
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                      {galleryList.map((g) => (
                        <div key={g.id} style={{ position: 'relative', width: '46px', height: '46px', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <img src={g.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                          <button onClick={() => deleteGalleryItem(g.id)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(239,68,68,0.85)', color: '#ffffff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: 0, transition: 'opacity 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.opacity=1} onMouseLeave={(e)=>e.currentTarget.style.opacity=0}><Trash2 size={12} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CONFIG UNIT 3: SCHEMA EDITOR SYSTEM */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <label style={{ color: '#a1a1aa', fontSize: '10px', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '900' }}><Plus size={14} /> 🛠️ SCHEMA FRAMEWORK INTAKE MODIFIER</label>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.03)' }}>
                    <input type="text" placeholder="Field Label (e.g., Medical History)" value={newFieldLabel} onChange={(e) => setNewFieldLabel(e.target.value)} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '10px 12px', color: '#ffffff', borderRadius: '8px', fontSize: '12px', boxSizing: 'border-box' }} />
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <select value={newFieldType || 'text'} onChange={(e) => setNewFieldType(e.target.value)} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '10px 12px', color: '#ffffff', borderRadius: '8px', fontSize: '12px', boxSizing: 'border-box' }}>
                        <option value="text">Plain Text</option>
                        <option value="number">Number</option>
                        <option value="radio">Options Select</option>
                      </select>
                      
                      <select value={newFieldStep} onChange={(e) => setNewFieldStep(e.target.value)} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '10px 12px', color: uiColorMode, fontWeight: '700', borderRadius: '8px', fontSize: '12px', boxSizing: 'border-box' }}>
                        <option value={1}>Put on Step 1</option>
                        <option value={2}>Put on Step 2</option>
                        <option value={3}>Put on Step 3</option>
                        <option value={4}>Put on Step 4</option>
                      </select>
                    </div>

                    {newFieldType === 'radio' && (
                      <input type="text" placeholder="Options List (Separate with commas, e.g. Veg, Non-Veg)" value={rawOptions || ''} onChange={(e) => setRawOptions(e.target.value)} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '10px 12px', color: '#ffffff', borderRadius: '8px', fontSize: '11px', boxSizing: 'border-box' }} />
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0' }}>
                      <input type="checkbox" id="fieldReq" checked={newFieldRequired} onChange={(e) => setNewFieldRequired(e.target.checked)} />
                      <label htmlFor="fieldReq" style={{ fontSize: '11px', color: '#a1a1aa', cursor: 'pointer' }}>Enforce Mandatory Validation Check (*)</label>
                    </div>

                    <button type="button" onClick={addNewCustomSchemaField} style={{ backgroundColor: '#ffffff', color: '#000000', fontSize: '11px', fontWeight: '800', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer' }}>
                      INJECT INTO SYSTEM WIZARD
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '10px', color: '#71717a', fontWeight: '800' }}>ACTIVE CONTROL STRUCTURE SCHEMA FIELDS:</span>
                    {formFields.map((f) => (
                      <div key={f.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0c0c10', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ fontSize: '12px', color: '#e4e4e7' }}>{f.label} <span style={{ color: uiColorMode, fontSize: '10px', fontWeight: '700' }}>[Step {f.step || 3}]</span></span>
                        <button type="button" onClick={() => deleteSchemaFieldNode(f.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={13} /></button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CONFIG UNIT 3.5: PACKAGES DYNAMIC EDITOR */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <label style={{ color: '#a1a1aa', fontSize: '10px', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '900' }}><Zap size={14} /> 💎 PACKAGES DYNAMIC CONTROL PANEL</label>
                  
                  {packages.map((pkg) => (
                    <div key={pkg.id} style={{ backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', fontWeight: '900', color: uiColorMode }}>{pkg.term}</span>
                        <button type="button" onClick={() => setEditingPkgId(editingPkgId === pkg.id ? null : pkg.id)} style={{ background: 'none', border: `1px solid ${uiColorMode}`, color: uiColorMode, cursor: 'pointer', fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'rgba(245,158,11,0.06)' }}>
                          {editingPkgId === pkg.id ? 'COLLAPSE' : 'EDIT'}
                        </button>
                      </div>
                      {editingPkgId === pkg.id && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                          <div>
                            <span style={{ display: 'block', fontSize: '10px', color: '#71717a', fontWeight: '800', marginBottom: '4px' }}>PLAN NAME</span>
                            <input type="text" value={pkg.term} onChange={(e) => updatePackageField(pkg.id, 'term', e.target.value)} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.08)', padding: '8px 10px', color: '#ffffff', borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }} />
                          </div>
                          <div>
                            <span style={{ display: 'block', fontSize: '10px', color: '#71717a', fontWeight: '800', marginBottom: '4px' }}>PRICE</span>
                            <input type="text" value={pkg.price} onChange={(e) => updatePackageField(pkg.id, 'price', e.target.value)} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.08)', padding: '8px 10px', color: '#ffffff', borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }} />
                          </div>
                          <div>
                            <span style={{ display: 'block', fontSize: '10px', color: '#71717a', fontWeight: '800', marginBottom: '4px' }}>DESCRIPTION</span>
                            <textarea value={pkg.desc} onChange={(e) => updatePackageField(pkg.id, 'desc', e.target.value)} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.08)', padding: '8px 10px', color: '#ffffff', borderRadius: '6px', fontSize: '12px', resize: 'none', height: '60px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                          </div>
                          <button type="button" onClick={async () => { await savePackagesConfig(packages); setEditingPkgId(null); }} style={{ backgroundColor: uiColorMode, color: '#000000', fontSize: '11px', fontWeight: '900', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}>
                            SAVE CHANGES
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* CONFIG UNIT 4: TRANSFORMATION MATRICES REGISTRY */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <label style={{ color: '#a1a1aa', fontSize: '10px', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '900' }}><Image size={14} /> 🌌 CLIENT PORTFOLIO INSTANCE GENERATOR</label>
                  
                  <div style={{ padding: '20px', border: '2px dashed rgba(255,255,255,0.06)', borderRadius: '12px', textAlign: 'center', position: 'relative', cursor: 'pointer' }}>
                    <UploadCloud size={24} style={{ color: uiColorMode, marginBottom: '6px' }} />
                    <span style={{ display: 'block', fontSize: '11px', fontWeight: '700' }}>Upload Cover Face Photo Matrix</span>
                    <span style={{ display: 'block', fontSize: '9px', color: '#71717a', marginTop: '2px' }}>Triggers metadata deployment schema panel</span>
                    <input type="file" accept="image/*" onChange={(e) => processFileUploadStream(e, 'transformation')} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '10px', color: '#71717a', fontWeight: '800' }}>STORED ACTIVE INSTANCES:</span>
                    {transformations.map((item) => (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0c0c10', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={item.img} style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '6px' }} alt="" />
                          <span style={{ fontSize: '12px', fontWeight: '600' }}>{item.name} ({item.days})</span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button type="button" onClick={(e) => openEditTransformation(item, e)} style={{ background: 'none', border: 'none', color: uiColorMode, cursor: 'pointer', fontSize: '11px', fontWeight: '700', padding: '4px 8px', borderRadius: '4px', backgroundColor: 'rgba(245,158,11,0.08)' }}>EDIT</button>
                          <button type="button" onClick={(e) => deleteTransformationItem(item.id, e)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={15} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* ALBUM COMPILER MULTIMEDIA METADATA MODAL */}
      {isTransMetaModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(4,4,6,0.98)', zIndex: 130000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ width: '100%', maxWidth: '560px', backgroundColor: '#0c0c10', border: `1px solid ${uiColorMode}`, borderRadius: '24px', padding: '32px', maxHeight: '85vh', overflowY: 'auto', boxSizing: 'border-box' }}>
            
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '16px', fontWeight: '900', letterSpacing: '0.5px', color: '#ffffff' }}>
                {editingTransId ? 'EDIT INSTANCE MATRIX PARAMETERS' : 'COMPILE DEPLOYMENT METRICS'}
              </span>
              <span style={{ display: 'block', color: '#a1a1aa', fontSize: '11px', marginTop: '2px' }}>Attach relational multi-period updates metadata logs</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <input type="text" placeholder="Client Name Parameters *" value={newTransMeta.name} onChange={(e) => setNewTransMeta({...newTransMeta, name: e.target.value})} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '12px 14px', color: '#ffffff', borderRadius: '8px', boxSizing: 'border-box' }} />
                <input type="number" placeholder="Age" value={newTransMeta.age} onChange={(e) => setNewTransMeta({...newTransMeta, age: e.target.value})} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '12px 14px', color: '#ffffff', borderRadius: '8px', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input type="text" placeholder="Initial Base Mass *" value={newTransMeta.beforeWeight} onChange={(e) => setNewTransMeta({...newTransMeta, beforeWeight: e.target.value})} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '12px 14px', color: '#ffffff', borderRadius: '8px', boxSizing: 'border-box' }} />
                <input type="text" placeholder="After Weight Target *" value={newTransMeta.afterWeight} onChange={(e) => setNewTransMeta({...newTransMeta, afterWeight: e.target.value})} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '12px 14px', color: '#ffffff', borderRadius: '8px', boxSizing: 'border-box' }} />
              </div>

              <input type="text" placeholder="Metric Outcome Summary Label (e.g. 14KG Melted)" value={newTransMeta.lossGainText} onChange={(e) => setNewTransMeta({...newTransMeta, lossGainText: e.target.value})} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '12px 14px', color: '#ffffff', borderRadius: '8px', boxSizing: 'border-box' }} />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input type="text" placeholder="Execution Timeline (e.g. 12 Weeks)" value={newTransMeta.days} onChange={(e) => setNewTransMeta({...newTransMeta, days: e.target.value})} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '12px 14px', color: '#ffffff', borderRadius: '8px', boxSizing: 'border-box' }} />
                <input type="text" placeholder="Verified Phase Target Date" value={newTransMeta.date} onChange={(e) => setNewTransMeta({...newTransMeta, date: e.target.value})} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '12px 14px', color: '#ffffff', borderRadius: '8px', boxSizing: 'border-box' }} />
              </div>

              <div>
                <select value={newTransMeta.rating} onChange={(e) => setNewTransMeta({...newTransMeta, rating: parseInt(e.target.value)})} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '12px 14px', color: '#ffffff', borderRadius: '8px', fontSize: '13px', height: '44px', boxSizing: 'border-box' }}>
                  <option value={5}>⭐⭐⭐⭐⭐ 5 Star Score Rating</option>
                  <option value={4}>⭐⭐⭐⭐ 4 Star Score Rating</option>
                  <option value={3}>⭐⭐⭐ 3 Star Score Rating</option>
                </select>
              </div>

              <textarea placeholder="Write descriptive structural transformation journey logs..." value={newTransMeta.journeyText} onChange={(e) => setNewTransMeta({...newTransMeta, journeyText: e.target.value})} style={{ width: '100%', backgroundColor: '#060608', border: '1px solid rgba(255,255,255,0.06)', padding: '12px 14px', color: '#ffffff', borderRadius: '8px', height: '80px', fontFamily: 'inherit', fontSize: '13px', resize: 'none', boxSizing: 'border-box' }} />

              <div style={{ backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontSize: '11px', color: uiColorMode, fontWeight: '900', letterSpacing: '0.5px' }}>🔗 INTERACTIVE MULTIMEDIA TIMELINE STREAM ({tempMediaArray.length} items)</span>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {tempMediaArray.map((med, mIdx) => (
                    <div key={mIdx} style={{ position: 'relative', width: '54px', height: '54px', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#000000' }}>
                      {med.type === 'image' ? (
                        <img src={med.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: uiColorMode }}><Film size={18} /></div>
                      )}
                      <button type="button" onClick={() => removeStagedMediaElement(mIdx)} style={{ position: 'absolute', top: 0, right: 0, background: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '0 0 0 4px', width: '16px', height: '16px', fontSize: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900' }}>X</button>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '12px' }}>
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
              <button onClick={() => { setIsTransMetaModalOpen(false); setEditingTransId(null); setTempTransImage(''); setTempMediaArray([]); }} style={{ flex: 1, padding: '14px', backgroundColor: 'rgba(255,255,255,0.04)', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700' }}>Cancel</button>
              <button onClick={saveTransformationMetadata} style={{ flex: 1, padding: '14px', backgroundColor: uiColorMode, color: '#000000', border: 'none', borderRadius: '8px', fontWeight: '700' }}>Save</button>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}