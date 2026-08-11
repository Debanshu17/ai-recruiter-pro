import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Zap, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="landing-page" style={{ backgroundColor: 'var(--canvas)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Nav */}
      <nav style={{ padding: '24px 64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--hairline)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Briefcase size={28} color="var(--ink)" />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: '600', color: 'var(--ink)' }}>AI Recruiter Pro</span>
        </div>
        <div>
          <Link to="/dashboard" className="button-secondary" style={{ marginRight: '16px' }}>Sign In</Link>
          <Link to="/dashboard" className="button-primary">Try for free</Link>
        </div>
      </nav>

      {/* Hero Band */}
      <header className="hero-band" style={{ padding: '96px 64px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center', flex: 1 }}>
        <div>
          <span className="badge-coral" style={{ marginBottom: '24px' }}>NEW: BULK PROCESSING</span>
          <h1 className="display-xl" style={{ marginTop: '24px' }}>Meet your new<br/>thinking partner.</h1>
          <p className="body-md" style={{ fontSize: '20px', color: 'var(--body-strong)', marginBottom: '48px', maxWidth: '480px' }}>
            Scale your recruitment with AI that actually understands context. Score, rank, and analyze thousands of resumes against your job descriptions instantly.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link to="/dashboard" className="button-primary" style={{ padding: '16px 32px', height: 'auto', fontSize: '16px' }}>Go to Dashboard</Link>
            <a href="#features" className="button-secondary" style={{ padding: '16px 32px', height: 'auto', fontSize: '16px', border: 'none' }}>Explore features</a>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <img 
            src="/assets/hero.png" 
            alt="AI Neural Network" 
            style={{ width: '100%', borderRadius: 'var(--rounded-xl)', boxShadow: '0 20px 40px rgba(20,20,19,0.08)', objectFit: 'cover' }} 
          />
        </div>
      </header>

      {/* Feature Grid */}
      <section id="features" style={{ padding: '96px 64px', backgroundColor: 'var(--surface-soft)' }}>
        <h2 className="display-lg" style={{ textAlign: 'center', marginBottom: '64px' }}>Designed for scale.</h2>
        <div className="grid grid-cols-3">
          
          <div className="feature-card interactive-card">
            <img src="/assets/feature_upload.png" alt="Bulk Upload" style={{ width: '100%', borderRadius: '8px', marginBottom: '24px' }} />
            <h3 className="title-md">Bulk Processing</h3>
            <p className="body-md">Upload hundreds of resumes at once. Our background processor handles the heavy lifting so you never experience timeouts.</p>
          </div>

          <div className="feature-card interactive-card" style={{ backgroundColor: 'var(--surface-dark)', color: 'var(--on-dark)' }}>
            <img src="/assets/feature_ai.png" alt="AI Scoring" style={{ width: '100%', borderRadius: '8px', marginBottom: '24px' }} />
            <h3 className="title-md" style={{ color: 'var(--on-dark)' }}>Intelligent Scoring</h3>
            <p className="body-md" style={{ color: 'var(--on-dark-soft)' }}>Weighted scoring across skills, experience, and education. Mandatory requirements act as hard filters for instant rejection.</p>
          </div>

          <div className="feature-card interactive-card">
             <div style={{ height: '200px', backgroundColor: 'var(--canvas)', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <ShieldCheck size={64} color="var(--primary)" />
             </div>
            <h3 className="title-md">Explainable AI</h3>
            <p className="body-md">No black boxes. Every candidate gets a detailed "Why this candidate?" summary extracting exact strengths from their resume.</p>
          </div>

        </div>
      </section>

      {/* Pre-Footer CTA */}
      <section style={{ padding: '96px 64px' }}>
        <div style={{ backgroundColor: 'var(--primary)', borderRadius: 'var(--rounded-lg)', padding: '64px', textAlign: 'center', color: 'var(--on-primary)' }}>
          <h2 className="display-sm" style={{ color: 'var(--on-primary)', marginBottom: '16px' }}>Ready to hire faster?</h2>
          <p style={{ marginBottom: '32px', fontSize: '18px' }}>Join the companies using AI to find the perfect fit.</p>
          <Link to="/dashboard" className="button-secondary" style={{ padding: '16px 32px', height: 'auto', fontSize: '16px', color: 'var(--ink)' }}>Get Started Now</Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--surface-dark)', padding: '64px', color: 'var(--on-dark-soft)', textAlign: 'center' }}>
        <p className="body-sm">© 2026 AI Recruiter Pro. All rights reserved.</p>
      </footer>

    </div>
  );
}