import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Search, Inbox } from 'lucide-react';
import { useCitizen } from './CitizenContext';

const MyGrievances = () => {
  const { grievances, currentUser } = useCitizen();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  if (!currentUser) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Please login first to view your grievances.</div>;
  }

  // Filter grievances specifically belonging to the logged-in user
  let myGrievances = grievances.filter(g => g.author_id == currentUser.id || g.authorId == currentUser.id);

  if (statusFilter !== 'All') {
    myGrievances = myGrievances.filter(g => g.status === statusFilter);
  }

  if (searchTerm) {
    myGrievances = myGrievances.filter(g => 
      g.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      g.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1>My Grievances</h1>
          <p>Track the status of issues you've reported.</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search by ID or keyword..." 
              style={{ paddingLeft: '3rem' }} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="btn btn-secondary" 
            style={{ width: 'auto', cursor: 'pointer' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Verified Closed">Verified Closed</option>
            <option value="Escalated">Escalated</option>
          </select>
        </div>

        {myGrievances.length === 0 ? (
           <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <Inbox size={48} style={{ opacity: 0.5, margin: '0 auto 1rem' }} />
              <h3>No grievances found</h3>
              <p>You haven't reported any issues matching this search.</p>
           </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {myGrievances.map((grievance) => (
              <Link to={`/grievance/${grievance.id}`} key={grievance.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none' }}>
                <div>
                  <h3 style={{ color: 'var(--text)', marginBottom: '0.5rem' }}>{grievance.title}</h3>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <span style={{ fontWeight: 600 }}>{grievance.id}</span>
                    <span>•</span>
                    <span>{grievance.department}</span>
                    <span>•</span>
                    <span>{grievance.date}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <span className={`badge badge-${grievance.status.toLowerCase().replace(' ', '-')}`}>
                    {grievance.status}
                  </span>
                  {grievance.status === 'Resolved' && (
                    <Link to={`/verify/${grievance.id}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} onClick={(e) => e.stopPropagation()}>
                      Verify Fix
                    </Link>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGrievances;
