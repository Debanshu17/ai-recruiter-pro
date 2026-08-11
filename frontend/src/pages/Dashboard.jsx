import React, { useEffect, useState } from 'react';
import { Briefcase, Users, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({ total_jobs: 0, total_candidates: 0, shortlisted: 0, rejected: 0 });

  useEffect(() => {
    fetch('http://localhost:8000/analytics')
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      
      <div className="grid grid-cols-4">
        <div className="feature-card">
          <div className="flex justify-between items-center mb-4">
            <h3 style={{margin: 0, color: 'var(--muted)'}}>Total Jobs</h3>
            <Briefcase color="var(--primary-color)" />
          </div>
          <div style={{fontSize: '2rem', fontWeight: '700'}}>{stats.total_jobs}</div>
        </div>
        
        <div className="feature-card">
          <div className="flex justify-between items-center mb-4">
            <h3 style={{margin: 0, color: 'var(--muted)'}}>Candidates</h3>
            <Users color="#3b82f6" />
          </div>
          <div style={{fontSize: '2rem', fontWeight: '700'}}>{stats.total_candidates}</div>
        </div>
        
        <div className="feature-card">
          <div className="flex justify-between items-center mb-4">
            <h3 style={{margin: 0, color: 'var(--muted)'}}>Shortlisted</h3>
            <CheckCircle color="var(--success)" />
          </div>
          <div style={{fontSize: '2rem', fontWeight: '700'}}>{stats.shortlisted}</div>
        </div>
        
        <div className="feature-card">
          <div className="flex justify-between items-center mb-4">
            <h3 style={{margin: 0, color: 'var(--muted)'}}>Rejected</h3>
            <XCircle color="var(--error)" />
          </div>
          <div style={{fontSize: '2rem', fontWeight: '700'}}>{stats.rejected}</div>
        </div>
      </div>
      
      <div className="mt-4">
        <Link to="/jobs/create" className="button-primary">Create New Job</Link>
      </div>
    </div>
  );
}
