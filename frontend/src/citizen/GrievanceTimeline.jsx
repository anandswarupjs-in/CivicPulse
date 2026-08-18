import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

const GrievanceTimeline = ({ currentStatus }) => {
  const steps = [
    { title: 'Grievance Submitted', date: 'Aug 15, 09:30 AM', status: 'completed' },
    { title: 'AI Classification', desc: 'Routed to Public Works', date: 'Aug 15, 09:31 AM', status: 'completed' },
    { title: 'Assigned to Officer', desc: 'Officer John Doe', date: 'Aug 16, 10:15 AM', status: 'completed' },
    { title: 'In Progress', desc: 'Repair work started', date: 'Aug 17, 08:00 AM', status: 'current' },
    { title: 'Resolved', desc: 'Awaiting citizen verification', date: 'Pending', status: 'upcoming' }
  ];

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <h3 style={{ marginBottom: '2rem', color: 'var(--text)' }}>Status Timeline</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {steps.map((step, index) => (
          <div key={index} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div style={{ position: 'absolute', left: '11px', top: '24px', bottom: '-24px', width: '2px', background: step.status === 'completed' ? 'var(--primary-light)' : 'var(--border)' }} />
            )}
            
            <div style={{ flexShrink: 0, zIndex: 1, background: 'var(--surface)' }}>
              {step.status === 'completed' ? (
                <CheckCircle2 size={24} style={{ color: 'var(--primary)', fill: 'var(--primary-light)' }} />
              ) : step.status === 'current' ? (
                <Clock size={24} style={{ color: 'var(--warning)', fill: 'var(--warning-light)' }} />
              ) : (
                <Circle size={24} style={{ color: '#CBD5E1', fill: '#F1F5F9' }} />
              )}
            </div>
            
            <div style={{ paddingBottom: '0.5rem', opacity: step.status === 'upcoming' ? 0.6 : 1 }}>
              <div style={{ fontWeight: 700, color: step.status === 'current' ? 'var(--primary)' : 'var(--text)', marginBottom: '0.25rem' }}>
                {step.title}
              </div>
              {step.desc && (
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  {step.desc}
                </div>
              )}
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {step.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GrievanceTimeline;
