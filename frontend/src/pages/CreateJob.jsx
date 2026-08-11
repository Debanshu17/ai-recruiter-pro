import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './api';


export default function CreateJob() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', department: '', location: '', experience_required: '',
    description: '', required_skills: '', preferred_skills: '',
    mandatory_requirements: '', threshold: 80
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL + '/jobs', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      });
      if(res.ok) navigate('/jobs');
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="feature-card" style={{maxWidth: '800px'}}>
      <h1>Create New Job</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-2">
        <div className="form-group">
          <label className="form-label">Job Title</label>
          <input name="title" className="text-input" required onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Department</label>
          <input name="department" className="text-input" required onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Location</label>
          <input name="location" className="text-input" required onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Experience Required</label>
          <input name="experience_required" className="text-input" placeholder="e.g. 3-5 years" required onChange={handleChange} />
        </div>
        <div className="form-group" style={{gridColumn: '1 / -1'}}>
          <label className="form-label">Job Description</label>
          <textarea name="description" className="text-input" rows="4" required onChange={handleChange}></textarea>
        </div>
        <div className="form-group" style={{gridColumn: '1 / -1'}}>
          <label className="form-label">Required Skills (comma separated)</label>
          <input name="required_skills" className="text-input" required onChange={handleChange} />
        </div>
        <div className="form-group" style={{gridColumn: '1 / -1'}}>
          <label className="form-label">Mandatory Requirements (comma separated)</label>
          <input name="mandatory_requirements" className="text-input" placeholder="Skills the candidate MUST have" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Threshold (%)</label>
          <input name="threshold" type="number" className="text-input" min="0" max="100" value={formData.threshold} onChange={handleChange} />
        </div>
        
        <div className="form-group mt-4" style={{gridColumn: '1 / -1'}}>
          <button type="submit" className="button-primary">Save Job</button>
        </div>
      </form>
    </div>
  );
}
