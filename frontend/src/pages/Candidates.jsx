import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, Users, Briefcase } from 'lucide-react';
import { API_URL } from '../api';


export default function Candidates() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [batchStatus, setBatchStatus] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_URL}/jobs`);
      const data = await res.json();
      setJobs(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (selectedJobId) {
      fetchCandidates(selectedJobId);
    } else {
      setCandidates([]);
      setBatchStatus(null);
    }
  }, [selectedJobId]);

  const fetchCandidates = async (jobId) => {
    try {
      const res = await fetch(`${API_URL}/jobs/${jobId}/candidates`);
      setCandidates(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleFileUpload = async (e) => {
    if (!selectedJobId) return;
    const files = e.target.files;
    if (!files.length) return;
    
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    
    try {
      const res = await fetch(`${API_URL}/jobs/${selectedJobId}/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if(data.batch_id) {
        pollBatchStatus(data.batch_id, selectedJobId);
      }
    } catch(err) { console.error(err); }
  };

  const pollBatchStatus = async (batchId, jobId) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/batches/${batchId}`);
        const data = await res.json();
        setBatchStatus(data);
        if (data.status === 'Completed') {
          clearInterval(interval);
          fetchCandidates(jobId);
        }
      } catch(err) { console.error(err); }
    }, 2000);
  };

  const selectedJob = jobs.find(j => j.id.toString() === selectedJobId);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>Candidates Dashboard</h1>
        {selectedJobId && (
          <Link to={`/compare?job_id=${selectedJobId}`} className="button-secondary">Compare Selected Candidates</Link>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="feature-card" style={{gridColumn: 'span 1'}}>
          <h3><Briefcase size={20} className="inline mr-2" style={{color: 'var(--primary-color)'}}/> Select a Job</h3>
          <p className="text-sm mb-4" style={{color: 'var(--muted)'}}>Choose a job to view candidates or upload new resumes.</p>
          <select 
            className="input-field" 
            value={selectedJobId} 
            onChange={(e) => setSelectedJobId(e.target.value)}
          >
            <option value="">-- Select a Job --</option>
            {jobs.map(job => (
              <option key={job.id} value={job.id}>{job.title} ({job.department})</option>
            ))}
          </select>

          {selectedJob && (
            <div className="mt-6 p-4 rounded" style={{backgroundColor: 'var(--canvas)', border: '1px solid var(--hairline)'}}>
              <p className="text-sm"><strong>Threshold:</strong> {selectedJob.threshold}%</p>
              <p className="text-sm mt-2"><strong>Location:</strong> {selectedJob.location}</p>
              <Link to={`/jobs/${selectedJob.id}`} className="text-sm mt-4 block" style={{color: 'var(--primary)'}}>View Full Job Details →</Link>
            </div>
          )}
        </div>

        <div className="feature-card" style={{gridColumn: 'span 2'}}>
          <h3><UploadCloud size={20} className="inline mr-2" style={{color: 'var(--primary-color)'}}/> Upload Resumes</h3>
          
          {!selectedJobId ? (
            <div className="flex items-center justify-center" style={{height: '150px', backgroundColor: 'var(--canvas)', borderRadius: 'var(--rounded)', border: '1px dashed var(--hairline)'}}>
              <p style={{color: 'var(--muted)'}}>Please select a job first to enable uploading.</p>
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm" style={{color: 'var(--muted)'}}>Upload PDF resumes to screen candidates against the selected job.</p>
              <div className="upload-zone" onClick={() => fileInputRef.current?.click()} style={{cursor: 'pointer', padding: '32px', textAlign: 'center', border: '2px dashed var(--primary-color)', borderRadius: 'var(--rounded-lg)', backgroundColor: 'var(--canvas)'}}>
                <UploadCloud size={32} color="var(--primary-color)" className="mb-2" style={{margin: '0 auto'}} />
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
            </>
          )}
        </div>
      </div>

      <div className="feature-card">
        <h3><Users size={20} className="inline mr-2" style={{color: 'var(--primary-color)'}}/> Candidates {selectedJobId ? `(${candidates.length})` : ''}</h3>
        {!selectedJobId ? (
          <p className="text-center mt-8 mb-8" style={{color: 'var(--muted)'}}>Select a job to view its candidates.</p>
        ) : (
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
                      <span className={`badge ${cand.overall_score >= selectedJob?.threshold ? 'badge-success' : 'badge-danger'}`}>
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
                {candidates.length === 0 && <tr><td colSpan="5" className="text-center">No candidates found for this job. Upload resumes to begin.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
