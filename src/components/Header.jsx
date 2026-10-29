import React from 'react';
import { Sparkles, Mic, Music2, Settings2, Sliders, Wand2, Wrench } from 'lucide-react';

export default function Header({ 
  activeStep, 
  setActiveStep, 
  voiceReady, 
  songGenerated, 
  onOpenSettings,
  isProMode,
  setIsProMode
}) {
  const steps = [
    { id: 1, name: '1. Voice Avatar', icon: Mic },
    { id: 2, name: '2. Lyrics & Prompt', icon: Music2 },
    { id: 3, name: '3. Create', icon: Sparkles },
    { id: 4, name: '4. Studio', icon: Sliders },
  ];

  return (
    <header className="header-wrapper">
      <div className="header-container">
        {/* Brand Logo & Global Title */}
        <div className="brand-box" onClick={() => setActiveStep(1)} title="SONARA Global AI Studio">
          <div className="brand-logo-glow">
            <img 
              src="/sonara_emblem.jpg" 
              alt="SONARA" 
              className="brand-logo-img"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div className="brand-title-row">
            <span className="brand-title">SONARA</span>
            <span className="brand-badge">GLOBAL AI</span>
          </div>
        </div>

        {/* Floating Island Stepper */}
        <nav className="nav-stepper">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;
            const isCompleted = 
              (step.id === 1) || 
              (step.id === 2 && voiceReady) || 
              (step.id === 3 && songGenerated) ||
              (step.id === 4 && songGenerated);

            return (
              <button
                key={step.id}
                id={`nav-step-${step.id}`}
                className={`step-btn ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => setActiveStep(step.id)}
              >
                <Icon size={14} />
                <span>{step.name}</span>
                {isCompleted && !isActive && <span className="step-dot"></span>}
              </button>
            );
          })}
        </nav>

        {/* Global Action Tools */}
        <div className="header-actions">
          {/* Engine Live Status Pill */}
          <div 
            className="engine-status-pill"
            onClick={onOpenSettings}
            title="AI Engine Status: Online (Click to configure Cloud GPU)"
          >
            <span className="live-dot"></span>
            <span>Online</span>
          </div>

          {/* Mode Switch (Easy / Pro) */}
          <button
            className={`mode-toggle-btn ${isProMode ? 'pro-active' : 'easy-active'}`}
            onClick={() => setIsProMode(!isProMode)}
            title={isProMode ? 'Switch to Simple Mode' : 'Switch to Pro Studio Mode'}
          >
            {isProMode ? (
              <>
                <Wrench size={13} className="text-pink" />
                <span>Pro</span>
              </>
            ) : (
              <>
                <Wand2 size={13} className="text-cyan animate-pulse-glow" />
                <span>Easy</span>
              </>
            )}
          </button>

          {/* Settings Button */}
          <button
            id="settings-modal-btn"
            className="btn-settings-prominent"
            title="Configure Cloud GPU & Audio Settings"
            onClick={onOpenSettings}
          >
            <Settings2 size={14} />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
}
