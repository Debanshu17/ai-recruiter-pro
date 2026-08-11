import { BrowserRouter as Router, Routes, Route, NavLink, Outlet } from 'react-router-dom';
import { Briefcase, Users, LayoutDashboard, Settings } from 'lucide-react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import CreateJob from './pages/CreateJob';
import JobDetail from './pages/JobDetail';
import CandidateDetail from './pages/CandidateDetail';
import CompareCandidates from './pages/CompareCandidates';

function AppLayout() {
  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Briefcase size={24} color="var(--primary)" />
          <span>AI Recruiter</span>
        </div>
        
        <nav>
          <NavLink to="/dashboard" end className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
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
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/create" element={<CreateJob />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/candidates/:id" element={<CandidateDetail />} />
          <Route path="/compare" element={<CompareCandidates />} />
          <Route path="/candidates" element={<div className="feature-card"><h1>Candidates</h1><p>Select a job to view candidates.</p></div>} />
          <Route path="/settings" element={<div className="feature-card"><h1>Settings</h1><p>System configuration.</p></div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
