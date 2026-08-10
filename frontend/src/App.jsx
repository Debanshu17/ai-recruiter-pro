import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Briefcase, Users, LayoutDashboard, Settings } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import CreateJob from './pages/CreateJob';
import JobDetail from './pages/JobDetail';
import CandidateDetail from './pages/CandidateDetail';
import CompareCandidates from './pages/CompareCandidates';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <Briefcase size={24} />
            <span>AI Recruiter</span>
          </div>
          
          <nav>
            <NavLink to="/" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={20} /> Dashboard
            </NavLink>
            <NavLink to="/jobs" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
              <Briefcase size={20} /> Jobs
            </NavLink>
            <NavLink to="/candidates" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
              <Users size={20} /> Candidates
            </NavLink>
            <NavLink to="/settings" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
              <Settings size={20} /> Settings
            </NavLink>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/create" element={<CreateJob />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/candidates/:id" element={<CandidateDetail />} />
            <Route path="/compare" element={<CompareCandidates />} />
            <Route path="/candidates" element={<div className="card"><h1>Candidates</h1><p>Select a job to view candidates.</p></div>} />
            <Route path="/settings" element={<div className="card"><h1>Settings</h1><p>System configuration.</p></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
