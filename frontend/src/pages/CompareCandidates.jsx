import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { API_URL } from './api';


export default function CompareCandidates() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('job_id');
  const [candidates, setCandidates] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (jobId) {
      fetch(`\${API_URL}/jobs/${jobId}/candidates`)
        .then(r => r.json())
        .then(data => {
          setCandidates(data);
          // Auto select top 3 for comparison
          setSelectedIds(data.slice(0, 3).map(c => c.id));
        })
        .catch(console.error);
    }
  }, [jobId]);

  const toggleSelection = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      if (selectedIds.length >= 4) {
        alert("Maximum 4 candidates can be compared at once.");
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedCandidates = candidates.filter(c => selectedIds.includes(c.id));

  return (
    <div>
      <div className="mb-4">
        <Link to={`/jobs/${jobId}`} className="button-secondary"><ArrowLeft size={16} /> Back to Job</Link>
      </div>
      
      <h1>Compare Candidates</h1>
      
      <div className="card mb-4">
        <p><strong>Select candidates to compare:</strong></p>
        <div className="flex flex-wrap gap-2 mt-2">
          {candidates.map(c => (
            <button 
              key={c.id} 
              onClick={() => toggleSelection(c.id)}
              className={`btn ${selectedIds.includes(c.id) ? 'btn-primary' : 'btn-secondary'}`}
              style={{padding: '0.25rem 0.75rem', fontSize: '0.875rem'}}
            >
              {c.name} ({c.overall_score}%)
            </button>
          ))}
        </div>
      </div>

      {selectedCandidates.length > 0 ? (
        <div className="table-container card">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                {selectedCandidates.map(c => <th key={c.id}>{c.name}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Overall Score</strong></td>
                {selectedCandidates.map(c => <td key={c.id} style={{fontSize: '1.25rem', fontWeight: 'bold'}}>{c.overall_score}%</td>)}
              </tr>
              <tr>
                <td><strong>Status</strong></td>
                {selectedCandidates.map(c => <td key={c.id}>{c.status}</td>)}
              </tr>
              <tr>
                <td><strong>Skills Score</strong></td>
                {selectedCandidates.map(c => <td key={c.id}>{c.analysis?.required_skills_score}%</td>)}
              </tr>
              <tr>
                <td><strong>Experience Score</strong></td>
                {selectedCandidates.map(c => <td key={c.id}>{c.analysis?.experience_score}%</td>)}
              </tr>
              <tr>
                <td><strong>Projects Score</strong></td>
                {selectedCandidates.map(c => <td key={c.id}>{c.analysis?.projects_score}%</td>)}
              </tr>
              <tr>
                <td><strong>Mandatory Met</strong></td>
                {selectedCandidates.map(c => <td key={c.id}>{c.analysis?.mandatory_requirements_met ? 'Yes' : 'No'}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p>Select at least one candidate to compare.</p>
      )}
    </div>
  );
}
