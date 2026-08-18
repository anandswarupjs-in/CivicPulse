import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Building, AlertTriangle } from 'lucide-react';
import GrievanceTimeline from './GrievanceTimeline';
import { useCitizen } from './CitizenContext';

const GrievanceDetails = () => {
  const { id } = useParams();
  const { grievances } = useCitizen();
  
  // Find the specific grievance by ID from Context
  const grievance = grievances.find(g => g.id === id) || {
    id: id || 'GRV-UNKNOWN',
    title: 'Grievance not found',
    description: 'The requested grievance could not be found or has been removed.',
    status: 'Unknown',
    date: 'Unknown',
    department: 'Unknown',
    location: 'Unknown',
    priority: 'Unknown',
    affectedCitizens: 0
  };

  return (
    <div className="animate-fade-in">
      <Link to="/my-grievances" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', textDecoration: 'none', marginBottom: '2rem', fontWeight: 600 }}>
        <ArrowLeft size={20} /> Back to My Grievances
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <span className={`badge badge-${grievance.status.toLowerCase().replace(' ', '-')}`} style={{ marginBottom: '1rem', display: 'inline-flex' }}>
                  {grievance.status}
                </span>
                <h1 style={{ margin: 0, color: 'var(--text)' }}>{grievance.title}</h1>
              </div>
            </div>
            
            <p style={{ fontSize: '1.125rem', lineHeight: '1.7', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
              {grievance.description}
            </p>

            {grievance.image && (
              <div style={{ marginBottom: '2.5rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <img src={grievance.image} alt="Issue Attachment" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', display: 'block' }} />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div className="icon-container icon-indigo" style={{ padding: '0.5rem' }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Location</div>
                  <div style={{ fontWeight: 600, color: 'var(--text)' }}>{grievance.location || 'Reported Location'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div className="icon-container icon-amber" style={{ padding: '0.5rem' }}>
                  <Calendar size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Reported On</div>
                  <div style={{ fontWeight: 600, color: 'var(--text)' }}>{grievance.date}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div className="icon-container icon-mint" style={{ padding: '0.5rem' }}>
                  <Building size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Assigned Dept.</div>
                  <div style={{ fontWeight: 600, color: 'var(--text)' }}>{grievance.department}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div className="icon-container icon-coral" style={{ padding: '0.5rem' }}>
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Priority & Impact</div>
                  <div style={{ fontWeight: 600, color: 'var(--text)' }}>{grievance.priority || 'Normal'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <GrievanceTimeline currentStatus={grievance.status} />
        </div>

      </div>
    </div>
  );
};

export default GrievanceDetails;
