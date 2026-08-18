import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, AlertCircle, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { useCitizen } from './CitizenContext';

const CitizenDashboard = () => {
  const { grievances, cityGrievances, currentUser } = useCitizen();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const stats = {
    pending: grievances.filter(g => g.status === 'Pending').length,
    active: grievances.filter(g => g.status === 'In Progress').length,
    resolved: grievances.filter(g => g.status === 'Resolved' || g.status === 'Verified Closed').length
  };

  return (
    <div>
      <section className="hero-section">
        <h1>Welcome back, {currentUser?.name || 'Citizen'} 👋</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
          Report issues. Track progress. Make an impact. Keep your community moving forward.
        </p>
        <Link to="/submit" className="btn btn-primary" style={{ textDecoration: 'none', padding: '1rem 2rem', fontSize: '1.125rem', borderRadius: '16px' }}>
          <PlusCircle size={22} />
          Report an Issue
        </Link>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div className="icon-container icon-amber">
            <Clock size={32} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--text)' }}>{stats.pending}</h2>
            <p style={{ margin: 0, fontWeight: 600, color: 'var(--text)' }}>Pending Issues</p>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>Awaiting action platform-wide</p>
          </div>
        </div>
        
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div className="icon-container icon-indigo">
            <AlertCircle size={32} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--text)' }}>{stats.active}</h2>
            <p style={{ margin: 0, fontWeight: 600, color: 'var(--text)' }}>Active Issues</p>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>Currently being resolved</p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div className="icon-container icon-mint">
            <CheckCircle2 size={32} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--text)' }}>{stats.resolved}</h2>
            <p style={{ margin: 0, fontWeight: 600, color: 'var(--text)' }}>Resolved Issues</p>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>Successfully fixed platform-wide</p>
          </div>
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* City Grievances Section */}
        <section className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ margin: 0 }}>My City: {currentUser?.city || 'Your City'}</h3>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>Issues in your local area.</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cityGrievances.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No issues reported in your city yet.</p>
            ) : (
              cityGrievances.slice(0, 5).map((grievance) => (
                <Link to={`/grievance/${grievance.id}`} key={grievance.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none' }}>
                  <div>
                    <h4 style={{ color: 'var(--text)', marginBottom: '0.5rem' }}>{grievance.title}</h4>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      <span style={{ fontWeight: 600 }}>{grievance.id}</span>
                      <span>•</span>
                      <span>{grievance.department}</span>
                    </div>
                  </div>
                  <span className={`badge badge-${grievance.status.toLowerCase().replace(' ', '-')}`}>
                    {grievance.status}
                  </span>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Global Recent Activity Section */}
        <section className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ margin: 0 }}>Global Activity</h3>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>Recent issues across all cities.</p>
            </div>
            <Link to="/my-grievances" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
              My Grievances
            </Link>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {grievances.slice(0, 5).map((grievance) => (
              <Link to={`/grievance/${grievance.id}`} key={grievance.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none' }}>
                <div>
                  <h4 style={{ color: 'var(--text)', marginBottom: '0.5rem' }}>{grievance.title}</h4>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <span style={{ fontWeight: 600 }}>{grievance.id}</span>
                    <span>•</span>
                    <span>{grievance.city}</span>
                  </div>
                </div>
                <span className={`badge badge-${grievance.status.toLowerCase().replace(' ', '-')}`}>
                  {grievance.status}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CitizenDashboard;
