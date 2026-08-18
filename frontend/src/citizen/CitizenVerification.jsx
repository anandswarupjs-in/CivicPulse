import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useCitizen } from './CitizenContext';

const CitizenVerification = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { grievances, verifyGrievance, currentUser } = useCitizen();
  const [feedback, setFeedback] = useState('');
  
  const grievance = grievances.find(g => g.id === id);

  if (!currentUser) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Please login first to verify a grievance.</div>;
  }

  if (!grievance) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Grievance not found.</div>;
  }

  // Ensure only the author can verify their own grievance
  if (grievance.author_id != currentUser.id && grievance.authorId != currentUser.id) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h3>Access Denied</h3>
        <p>You can only verify grievances that you have reported.</p>
        <Link to="/my-grievances" className="btn btn-primary" style={{ marginTop: '1rem' }}>Go Back</Link>
      </div>
    );
  }

  const handleVerify = (isFixed) => {
    verifyGrievance(id, isFixed);
    alert(`Thank you! Issue marked as ${isFixed ? 'Verified Closed' : 'Escalated'}`);
    navigate('/my-grievances');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '650px', margin: '0 auto' }}>
      <Link to="/my-grievances" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', textDecoration: 'none', marginBottom: '2rem', fontWeight: 600 }}>
        <ArrowLeft size={20} /> Back to My Grievances
      </Link>

      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--text)' }}>Verify Resolution</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.125rem' }}>
          The authority has marked <strong style={{ color: 'var(--text)' }}>{grievance.id}</strong> as resolved. 
          Can you confirm if the issue has actually been fixed on the ground?
        </p>

        <div style={{ background: 'var(--primary-light)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2.5rem', textAlign: 'left', border: '1px solid #E0E7FF' }}>
          <h4 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>{grievance.title}</h4>
          <p style={{ fontSize: '0.875rem', margin: 0, color: '#4F46E5', fontWeight: 500 }}>
            Authority Note: "Replaced faulty components and tested working condition. Ready for citizen verification."
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <button 
            onClick={() => handleVerify(true)}
            className="btn" 
            style={{ padding: '1.5rem', background: 'var(--success-light)', color: 'var(--success)', border: '1px solid #A7F3D0', flexDirection: 'column', gap: '0.75rem', borderRadius: '16px' }}
          >
            <CheckCircle size={32} />
            <span style={{ fontSize: '1.125rem' }}>Yes, it's fixed</span>
          </button>
          
          <button 
            onClick={() => handleVerify(false)}
            className="btn" 
            style={{ padding: '1.5rem', background: 'var(--danger-light)', color: 'var(--danger)', border: '1px solid #FECACA', flexDirection: 'column', gap: '0.75rem', borderRadius: '16px' }}
          >
            <XCircle size={32} />
            <span style={{ fontSize: '1.125rem' }}>No, it's not fixed</span>
          </button>
        </div>

        <div style={{ textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 600, color: 'var(--text)' }}>
            Additional Feedback (Optional)
          </label>
          <textarea 
            rows="4"
            placeholder="Tell us about the quality of work or any lingering issues..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default CitizenVerification;
