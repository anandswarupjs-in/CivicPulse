import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCitizen } from './CitizenContext';
import { Shield } from 'lucide-react';

const CitizenLogin = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', city: '' });
  const [error, setError] = useState('');
  
  const { login, register, loading } = useCitizen();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    let success = false;
    if (isRegistering) {
      success = await register(formData.name, formData.email, formData.password, formData.city);
    } else {
      success = await login(formData.email, formData.password);
    }

    if (success) {
      navigate('/');
    } else {
      setError(isRegistering ? 'Registration failed. Email might be in use.' : 'Invalid email or password.');
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ padding: '3rem', maxWidth: '450px', width: '100%', textAlign: 'center' }}>
        <div className="icon-container icon-indigo" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
          <Shield size={36} />
        </div>
        <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>{isRegistering ? 'Create Account' : 'Welcome Citizen'}</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
          {isRegistering ? 'Sign up to report issues in your city.' : 'Log in to track progress in your community.'}
        </p>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '1.5rem', background: 'var(--danger-light)', padding: '0.75rem', borderRadius: '8px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
          
          {isRegistering && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text)' }}>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text)' }}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text)' }}>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          {isRegistering && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text)' }}>City Name</label>
              <input type="text" name="city" placeholder="e.g. New York" value={formData.city} onChange={handleChange} required />
            </div>
          )}
          
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '1rem', width: '100%', fontSize: '1.125rem', marginTop: '0.5rem' }}>
            {loading ? 'Processing...' : (isRegistering ? 'Register' : 'Login')}
          </button>
        </form>

        <p style={{ marginTop: '2rem', fontSize: '0.875rem' }}>
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}
          <button 
            onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', marginLeft: '0.5rem' }}
          >
            {isRegistering ? 'Log in here' : 'Sign up here'}
          </button>
        </p>

      </div>
    </div>
  );
};

export default CitizenLogin;
