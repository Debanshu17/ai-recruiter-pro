import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UploadCloud, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { API_URL } from '../api';


export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [batchStatus, setBatchStatus] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchJobAndCandidates();
  }, [id]);

  const [error, setError] = useState(null);

  const fetchJobAndCandidates = async () => {
    try {
      const jobRes = await fetch(`${API_URL}/jobs/${id}`);
      if (!jobRes.ok) throw new Error(`Job fetch failed with status: ${jobRes.status}`);
      setJob(await jobRes.json());
      
      const candRes = await fetch(`${API_URL}/jobs/${id}/candidates`);
      if (!candRes.ok) throw new Error(`Candidates fetch failed with status: ${candRes.status}`);
      setCandidates(await candRes.json());
    } catch(err) { 
      console.error(err);
      setError(err.message);
    }
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    
    try {
      const res = await fetch(`\${API_URL}/jobs/${id}/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if(data.batch_id) {
        pollBatchStatus(data.batch_id);
      }
    } catch(err) { console.error(err); }
  };

  const pollBatchStatus = async (batchId) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`\${API_URL}/batches/${batchId}`);
        const data = await res.json();
        setBatchStatus(data);
        if (data.status === 'Completed') {
          clearInterval(interval);
          fetchJobAndCandidates();
        }
      } catch(err) { console.error(err); }
    }, 2000);
  };

  if (error) return <div className="feature-card m-8"><h2 style={{color: 'var(--error)'}}>Error Loading Job</h2><p>{error}</p><p className="mt-4">Please make sure your backend is running and you have hard-refreshed your browser to clear cache.</p></div>;
  if (!job) return <div className="m-8">Loading job details...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>{job.title}</h1>
        <Link to={`/compare?job_id=${id}`} className="button-secondary">Compare Candidates</Link>
      </div>

      <div className="grid grid-cols-3">
        <div className="feature-card" style={{gridColumn: 'span 2'}}>
          <h3>Bulk Resume Upload</h3>
          <p className="mb-4 text-sm" style={{color: 'var(--muted)'}}>Upload multiple PDF resumes to screen candidates against this job description.</p>
          
          <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
            <UploadCloud size={48} color="var(--primary-color)" className="mb-2" style={{margin: '0 auto'}} />
            <p><strong>Click to upload</strong> or drag and drop</p>
            <p style={{fontSize: '0.875rem', color: 'var(--muted)'}}>PDF only (Max 10MB per file)</p>
            <input type="file" multiple accept=".pdf" ref={fileInputRef} style={{display: 'none'}} onChange={handleFileUpload} />
          </div>

          {batchStatus && (
            <div className="mt-4 p-4 border rounded" style={{borderColor: 'var(--hairline)'}}>
              <div className="flex justify-between mb-2">
                <strong>Processing Resumes</strong>
                <span>{batchStatus.processed + batchStatus.failed} / {batchStatus.total_resumes}</span>
              </div>
              <div style={{width: '100%', backgroundColor: 'var(--canvas)', height: '8px', borderRadius: '4px'}}>
                <div style={{
                  width: `${((batchStatus.processed + batchStatus.failed) / batchStatus.total_resumes) * 100}%`,
                  backgroundColor: 'var(--primary-color)', height: '100%', borderRadius: '4px', transition: 'width 0.3s'
                }}></div>
              </div>
              {batchStatus.status === 'Completed' && <p className="text-sm mt-2" style={{color: 'var(--success)'}}>Batch processing complete!</p>}
            </div>
          )}
        </div>

        <div className="feature-card">
          <h3>Job Details</h3>
          <p><strong>Department:</strong> {job.department}</p>
          <p><strong>Location:</strong> {job.location}</p>
          <p><strong>Experience:</strong> {job.experience_required}</p>
          <p><strong>Threshold:</strong> {job.threshold}%</p>
          <div className="mt-4">
            <strong>Mandatory Skills:</strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {job.mandatory_requirements?.split(',').map(s => s.trim() ? <span key={s} className="badge-pill muted">{s}</span> : null)}
            </div>
          </div>
        </div>
      </div>

      <div className="feature-card">
        <h3>Candidates ({candidates.length})</h3>
        <div className="table-container mt-4">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Score</th>
                <th>Status</th>
                <th>Date Applied</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map(cand => (
                <tr key={cand.id}>
                  <td>{cand.name}</td>
                  <td>
                    <span className={`badge ${cand.overall_score >= job.threshold ? 'badge-success' : 'badge-danger'}`}>
                      {cand.overall_score}%
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${
                      cand.status === 'Shortlisted' ? 'badge-success' : 
                      cand.status === 'Rejected' ? 'badge-danger' : 
                      cand.status === 'Review' ? 'badge-warning' : 'badge-info'
                    }`}>
                      {cand.status}
                    </span>
                  </td>
                  <td>{new Date(cand.created_at).toLocaleDateString()}</td>
                  <td><Link to={`/candidates/${cand.id}`} className="button-secondary">Review</Link></td>
                </tr>
              ))}
              {candidates.length === 0 && <tr><td colSpan="5" className="text-center">No candidates yet. Upload resumes to begin.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
