import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, User, LogOut, Settings, X } from 'lucide-react';

// Import Context
import { CitizenProvider, useCitizen } from './citizen/CitizenContext';

// Import Citizen components
import CitizenLogin from './citizen/CitizenLogin';
import CitizenDashboard from './citizen/CitizenDashboard';
import SubmitGrievance from './citizen/SubmitGrievance';
import MyGrievances from './citizen/MyGrievances';
import GrievanceDetails from './citizen/GrievanceDetails';
import CitizenVerification from './citizen/CitizenVerification';

const EditProfileModal = ({ isOpen, onClose }) => {
  const { currentUser, updateProfile, loading } = useCitizen();
  const [formData, setFormData] = useState({ 
    name: currentUser?.name || '', 
    city: currentUser?.city || '', 
    password: '' 
  });
  
  if (!isOpen) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updates = {};
    if (formData.name !== currentUser.name) updates.name = formData.name;
    if (formData.city !== currentUser.city) updates.city = formData.city;
    if (formData.password) updates.password = formData.password;

    if (Object.keys(updates).length > 0) {
      await updateProfile(updates);
    }
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '2rem', width: '100%', maxWidth: '400px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <X size={24} />
        </button>
        
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--text)' }}>Edit Account</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email (Read Only)</label>
            <input type="email" value={currentUser?.email} disabled style={{ backgroundColor: '#F1F5F9', color: 'var(--text-muted)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>City</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>New Password (Optional)</label>
            <input type="password" name="password" placeholder="Leave blank to keep current" value={formData.password} onChange={handleChange} />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '1rem', marginTop: '1rem' }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useCitizen();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const isActive = (path) => location.pathname === path ? 'active' : '';

  if (location.pathname === '/login') return null;

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="nav-brand">
          <Activity size={28} />
          CivicPulse
        </Link>
        <div className="nav-links">
          <Link to="/" className={isActive('/')}>Dashboard</Link>
          <Link to="/submit" className={isActive('/submit')}>Report Issue</Link>
          <Link to="/my-grievances" className={isActive('/my-grievances')}>My Grievances</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text)', fontWeight: '600' }}>
            <div style={{ background: 'var(--primary-light)', padding: '0.5rem', borderRadius: '50%', color: 'var(--primary)' }}>
              <User size={20} />
            </div>
            <span>{currentUser ? currentUser.name : 'Guest'}</span>
          </div>
          
          {currentUser && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setIsEditModalOpen(true)} className="btn btn-secondary" style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem' }} title="Edit Account">
                <Settings size={16} />
              </button>
              <button onClick={() => { logout(); navigate('/login'); }} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', color: 'var(--danger)', borderColor: '#FECACA', background: 'var(--danger-light)' }}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {currentUser && (
        <EditProfileModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
        />
      )}
    </>
  );
};

function App() {
  return (
    <CitizenProvider>
      <Router>
        <Navigation />
        <main className="container animate-fade-in">
          <Routes>
            <Route path="/login" element={<CitizenLogin />} />
            <Route path="/" element={<CitizenDashboard />} />
            <Route path="/submit" element={<SubmitGrievance />} />
            <Route path="/my-grievances" element={<MyGrievances />} />
            <Route path="/grievance/:id" element={<GrievanceDetails />} />
            <Route path="/verify/:id" element={<CitizenVerification />} />
          </Routes>
        </main>
      </Router>
    </CitizenProvider>
  );
}

export default App;
