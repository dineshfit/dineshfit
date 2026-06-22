'use client';

import { useState } from 'react';
import { supabase } from '../app/supabase'; // 👈 Change line 4 to this! // Adjust this import path to match your project

export default function SecurityForm({ adminRecordId }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [generatedKey, setGeneratedKey] = useState('');

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', text: '' });
    setGeneratedKey('');

    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', text: 'New passwords do not match.' });
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setStatus({ type: 'error', text: 'Password must be at least 6 characters long.' });
      setLoading(false);
      return;
    }

    try {
      // 1. Fetch current status flags from Supabase settings table
      const { data: adminData, error: fetchError } = await supabase
        .from('settings')
        .select('is_default, password')
        .eq('id', adminRecordId)
        .single();

      if (fetchError || !adminData) {
        throw new Error('Failed to verify security configuration. Make sure adminRecordId is valid.');
      }

      // 2. STRICT LOCKOUT CHECK: If password was already changed, prevent using dinesh123
      if (adminData.is_default === false && currentPassword === 'dinesh123') {
        throw new Error("Action Denied: The default password 'dinesh123' has been permanently deactivated.");
      }

      // 3. Verify that the current password input matches what is stored
      if (adminData.password !== currentPassword) {
        throw new Error("Incorrect current password.");
      }

      // 4. Generate a unique 8-character string for the Recovery Key
      const randomSegment = Math.random().toString(36).substring(2, 10).toUpperCase();
      const recoveryKey = `COACH-SEC-${randomSegment}`;

      // 5. Push updates to the database row
      const { error: updateError } = await supabase
        .from('settings')
        .update({
          password: newPassword,       
          is_default: false,           
          recovery_key: recoveryKey    
        })
        .eq('id', adminRecordId);

      if (updateError) throw updateError;

      // 6. Success State Update
      setStatus({ type: 'success', text: 'Password changed successfully! Your account is now secured.' });
      setGeneratedKey(recoveryKey);
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (err) {
      setStatus({ type: 'error', text: err.message || 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h3 style={{ marginTop: 0, borderBottom: '1px solid #eaeaea', paddingBottom: '10px' }}>Update Admin Password</h3>
      
      {status.text && (
        <div style={{
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px',
          backgroundColor: status.type === 'success' ? '#e6fffa' : '#fff5f5',
          color: status.type === 'success' ? '#234e52' : '#742a2a',
          border: `1px solid ${status.type === 'success' ? '#319795' : '#e53e3e'}`
        }}>
          {status.text}
        </div>
      )}

      {generatedKey && (
        <div style={{
          backgroundColor: '#feebc8',
          border: '1px solid #dd6b20',
          color: '#7b341e',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <h4 style={{ margin: '0 0 8px 0' }}>⚠️ Save Your Emergency Secret Key!</h4>
          <p style={{ margin: '0 0 12px 0', fontSize: '13px', lineHeight: '1.4' }}>
            The default password <strong>dinesh123</strong> is now dead. Copy and save this key somewhere safe. If you ever forget your password, this is the only way to reset it.
          </p>
          <div style={{
            backgroundColor: '#fff',
            padding: '10px',
            borderRadius: '4px',
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
            letterSpacing: '1px',
            border: '1px dashed #dd6b20'
          }}>
            {generatedKey}
          </div>
        </div>
      )}

      <form onSubmit={handlePasswordSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600' }}>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600' }}>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600' }}>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#3182ce',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Securing Account...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}