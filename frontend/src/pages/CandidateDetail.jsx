import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { API_URL } from './api';


export default function CandidateDetail() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);

  useEffect(() => {
    fetch(`\${API_URL}/candidates/${id}`)
      .then(r => r.json())
      .then(data => setCandidate(data))
      .catch(console.error);
  }, [id]);

  const updateStatus = async (status) => {
    try {
      await fetch(`\${API_URL}/candidates/${id}/status?status=${status}`, { method: 'PUT' });
      setCandidate({...candidate, status});
    } catch(err) { console.error(err); }
  };

  if (!candidate) return <div>Loading...</div>;

  const { analysis } = candidate;

  return (
    <div>
      <div className="mb-4">
        <Link to={`/jobs/${candidate.job_id}`} className="button-secondary"><ArrowLeft size={16} /> Back to Job</Link>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h1>{candidate.name}</h1>
        <div className="flex gap-2">
          <button onClick={() => updateStatus('Shortlisted')} className={`btn ${candidate.status === 'Shortlisted' ? 'btn-primary' : 'btn-secondary'}`}>Shortlist</button>
          <button onClick={() => updateStatus('Rejected')} className={`btn ${candidate.status === 'Rejected' ? 'btn-primary' : 'btn-secondary'}`} style={candidate.status === 'Rejected' ? {backgroundColor: 'var(--error)'} : {}}>Reject</button>
          <button onClick={() => updateStatus('Review')} className={`btn ${candidate.status === 'Review' ? 'btn-primary' : 'btn-secondary'}`} style={candidate.status === 'Review' ? {backgroundColor: 'var(--muted)'} : {}}>Mark for Review</button>
        </div>
      </div>

      <div className="grid grid-cols-4">
        <div className="card text-center">
          <div style={{fontSize: '3rem', fontWeight: '700', color: candidate.overall_score >= 80 ? 'var(--success)' : 'var(--error)'}}>
            {candidate.overall_score}%
          </div>
          <div style={{color: 'var(--muted)'}}>Overall Match Score</div>
        </div>

        {analysis && (
          <>
            <div className="card text-center">
              <div style={{fontSize: '1.5rem', fontWeight: '700'}}>{analysis.required_skills_score}%</div>
              <div style={{color: 'var(--muted)'}}>Skills Score (40%)</div>
            </div>
            <div className="card text-center">
              <div style={{fontSize: '1.5rem', fontWeight: '700'}}>{analysis.experience_score}%</div>
              <div style={{color: 'var(--muted)'}}>Experience Score (30%)</div>
            </div>
            <div className="card text-center">
              <div style={{fontSize: '1.5rem', fontWeight: '700'}}>{analysis.projects_score}%</div>
              <div style={{color: 'var(--muted)'}}>Projects Score (20%)</div>
            </div>
          </>
        )}
      </div>

      {analysis && !analysis.mandatory_requirements_met && (
        <div className="feature-card" style={{backgroundColor: '#fef2f2', borderColor: '#f87171'}}>
          <h3 className="flex items-center gap-2" style={{color: '#991b1b'}}><AlertTriangle size={20} /> Mandatory Requirements Failed</h3>
          <p style={{color: '#991b1b'}}>{analysis.mandatory_failed_reason}</p>
        </div>
      )}

      {analysis && (
        <div className="grid grid-cols-2">
          <div className="code-window-card mt-4">
            <h3 style={{ color: 'var(--on-dark)' }}>AI Summary: Why this candidate?</h3>
            <div className="code-block">
              {analysis.summary}
            </div>
            
            <h4 className="mt-4 mb-2 flex items-center gap-2"><CheckCircle size={16} color="var(--success)" /> Strengths</h4>
            <ul style={{paddingLeft: '1.5rem', marginBottom: '1rem'}}>
              {analysis.strengths?.split(',').map((s, i) => s.trim() ? <li key={i}>{s}</li> : null)}
            </ul>
            
            <h4 className="mt-4 mb-2 flex items-center gap-2"><XCircle size={16} color="var(--error)" /> Weaknesses</h4>
            <ul style={{paddingLeft: '1.5rem'}}>
              {analysis.weaknesses?.split(',').map((s, i) => s.trim() ? <li key={i}>{s}</li> : null)}
            </ul>
          </div>

          <div className="feature-card">
            <h3>Skills Comparison</h3>
            <div className="mb-4">
              <strong>Matched Skills:</strong>
              <div className="flex flex-wrap gap-2 mt-2">
                {analysis.matched_skills?.split(',').map((s, i) => s.trim() ? <span key={i} className="badge-pill success">{s}</span> : null)}
              </div>
            </div>
            
            <div>
              <strong>Missing Skills:</strong>
              <div className="flex flex-wrap gap-2 mt-2">
                {analysis.missing_skills?.split(',').map((s, i) => s.trim() ? <span key={i} className="badge-pill error">{s}</span> : null)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
