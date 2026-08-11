import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Briefcase, MapPin } from 'lucide-react';
import { API_URL } from '../api';


export default function Jobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch(API_URL + '/jobs')
      .then(r => r.json())
      .then(data => setJobs(data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>Jobs</h1>
        <Link to="/jobs/create" className="button-primary"><Plus size={16} /> New Job</Link>
      </div>
      
      <div className="grid grid-cols-2">
        {jobs.map(job => (
          <div key={job.id} className="feature-card">
            <h2>{job.title}</h2>
            <div className="flex gap-4 mb-4 text-sm" style={{color: 'var(--muted)'}}>
              <span className="flex items-center gap-2"><Briefcase size={14} /> {job.department}</span>
              <span className="flex items-center gap-2"><MapPin size={14} /> {job.location}</span>
            </div>
            <p className="mb-4" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{job.description}</p>
            <div className="flex justify-between items-center">
              <span className="badge-pill">Threshold: {job.threshold}%</span>
              <Link to={`/jobs/${job.id}`} className="button-secondary">View Details</Link>
            </div>
          </div>
        ))}
        {jobs.length === 0 && <p>No jobs found. Create one to get started.</p>}
      </div>
    </div>
  );
}
