import React, { useState, useRef, useEffect } from 'react';
import { 
  Gauge, 
  CreditCard, 
  Sparkles, 
  UserCheck, 
  Palette, 
  MapPin, 
  ChevronRight, 
  X,
  CheckCircle2,
  ShieldCheck,
  Check,
  Music,
  Mic,
  Sliders,
  Cpu,
  Radio,
  Activity
} from 'lucide-react';

export default function GeminiSettingsMenu({ 
  isOpen, 
  onClose, 
  onOpenAvatarModal
}) {
  const menuRef = useRef(null);
  const [activeSubModal, setActiveSubModal] = useState(null); // 'usage' | 'subscription' | 'upgrade' | 'theme' | 'location'
  const [selectedTheme, setSelectedTheme] = useState('obsidian-crimson');

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        if (!activeSubModal) {
          onClose();
        }
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose, activeSubModal]);

  if (!isOpen) return null;

  const handleOpenSubModal = (modalKey) => {
    setActiveSubModal(modalKey);
  };

  const handleCloseAll = () => {
    setActiveSubModal(null);
    onClose();
  };

  return (
    <>
      {/* 1. Anchored Menu (Shown only when no submodal is active, so screen stays clean and uncluttered) */}
      {!activeSubModal && (
        <div 
          ref={menuRef} 
          className="gemini-settings-menu animate-scaleUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Section 1: Account */}
          <div className="settings-menu-section">
            <span className="settings-section-heading">Account</span>
            
            {/* 1. Usage limits (Matches Gemini screenshot's white outline pill) */}
            <button 
              type="button" 
              className="settings-menu-item active-pill"
              onClick={() => handleOpenSubModal('usage')}
            >
              <div className="menu-item-left">
                <Gauge size={16} className="settings-item-icon" />
                <span className="settings-item-label">Usage limits</span>
              </div>
            </button>

            {/* 2. Manage subscription */}
            <button 
              type="button" 
              className="settings-menu-item"
              onClick={() => handleOpenSubModal('subscription')}
            >
              <div className="menu-item-left">
                <CreditCard size={16} className="settings-item-icon" />
                <span className="settings-item-label">Manage subscription</span>
              </div>
            </button>

            {/* 3. Upgrade to SONARA Pro */}
            <button 
              type="button" 
              className="settings-menu-item"
              onClick={() => handleOpenSubModal('upgrade')}
            >
              <div className="menu-item-left">
                <Sparkles size={16} className="settings-item-icon text-red-primary" />
                <span className="settings-item-label">Upgrade to SONARA Pro</span>
              </div>
            </button>
          </div>

          {/* Section 2: Preferences */}
          <div className="settings-menu-section">
            <span className="settings-section-heading">Preferences</span>

            {/* 4. Avatar (Opens Voice Avatar modal directly) */}
            <button 
              type="button" 
              className="settings-menu-item"
              onClick={() => {
                onClose();
                if (onOpenAvatarModal) onOpenAvatarModal();
              }}
            >
              <div className="menu-item-left">
                <UserCheck size={16} className="settings-item-icon" />
                <span className="settings-item-label">Avatar</span>
              </div>
            </button>

            {/* 5. Theme */}
            <button 
              type="button" 
              className="settings-menu-item with-chevron"
              onClick={() => handleOpenSubModal('theme')}
            >
              <div className="menu-item-left">
                <Palette size={16} className="settings-item-icon" />
                <span className="settings-item-label">Theme</span>
              </div>
              <ChevronRight size={14} className="chevron-right-muted" />
            </button>

            {/* 6. Location */}
            <button 
              type="button" 
              className="settings-menu-item with-chevron"
              onClick={() => handleOpenSubModal('location')}
            >
              <div className="menu-item-left">
                <MapPin size={16} className="settings-item-icon" />
                <span className="settings-item-label">Location</span>
              </div>
              <ChevronRight size={14} className="chevron-right-muted" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Ultra-Premium Studio Modals */}
      {activeSubModal && (
        <div className="gemini-modal-overlay animate-fadeIn" onClick={handleCloseAll}>
          <div className="luxury-settings-dialog animate-scaleUp" onClick={(e) => e.stopPropagation()}>
            
            {/* Dialog Header */}
            <div className="luxury-dialog-header">
              <div className="luxury-header-left">
                <div className="luxury-header-badge">
                  {activeSubModal === 'usage' && <Gauge size={18} className="text-red-primary" />}
                  {activeSubModal === 'subscription' && <CreditCard size={18} className="text-red-primary" />}
                  {activeSubModal === 'upgrade' && <Sparkles size={18} className="text-red-primary" />}
                  {activeSubModal === 'theme' && <Palette size={18} className="text-red-primary" />}
                  {activeSubModal === 'location' && <MapPin size={18} className="text-red-primary" />}
                </div>
                <div>
                  <h3 className="luxury-dialog-title">
                    {activeSubModal === 'usage' && 'Usage limits'}
                    {activeSubModal === 'subscription' && 'Manage subscription'}
                    {activeSubModal === 'upgrade' && 'SONARA Studio Pro'}
                    {activeSubModal === 'theme' && 'Studio Theme'}
                    {activeSubModal === 'location' && 'Server Location'}
                  </h3>
                  <p className="luxury-dialog-subtitle">
                    {activeSubModal === 'usage' && 'Real-time compute capacity & synthesis limits'}
                    {activeSubModal === 'subscription' && 'Your creator license & tier specifications'}
                    {activeSubModal === 'upgrade' && 'Pro neural engine privileges unlocked'}
                    {activeSubModal === 'theme' && 'Interface appearance & display contrast'}
                    {activeSubModal === 'location' && 'Local loopback & edge routing node'}
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                className="luxury-close-button"
                onClick={handleCloseAll}
                title="Close"
              >
                <X size={17} />
              </button>
            </div>

            {/* Dialog Body */}
            <div className="luxury-dialog-body">
              
              {/* 1. USAGE LIMITS (Modern Studio Telemetry Grid) */}
              {activeSubModal === 'usage' && (
                <div className="luxury-telemetry-container">
                  {/* Top Status Capsule */}
                  <div className="luxury-quota-banner">
                    <div className="quota-banner-left">
                      <span className="quota-tag">ACCOUNT QUOTA STATUS</span>
                      <strong className="quota-status-text">100% Unlimited Compute Active</strong>
                    </div>
                    <span className="luxury-pill-badge emerald">
                      <span className="live-pulse green" /> Perpetual Free Tier
                    </span>
                  </div>

                  {/* 2x2 Telemetry Grid */}
                  <div className="luxury-cards-grid">
                    <div className="luxury-stat-card">
                      <div className="stat-card-top">
                        <div className="stat-icon-wrap">
                          <Music size={16} />
                        </div>
                        <span className="luxury-badge green">Unlimited</span>
                      </div>
                      <h4 className="stat-card-title">AI Song Synthesis</h4>
                      <p className="stat-card-desc">Local Parallel Synthesis Engine + Google Colab Cloud GPU.</p>
                      <div className="stat-progress-bar">
                        <div className="progress-fill green" style={{ width: '100%' }} />
                      </div>
                    </div>

                    <div className="luxury-stat-card">
                      <div className="stat-card-top">
                        <div className="stat-icon-wrap">
                          <Mic size={16} />
                        </div>
                        <span className="luxury-badge green">Active</span>
                      </div>
                      <h4 className="stat-card-title">5-Second Voice Avatar</h4>
                      <p className="stat-card-desc">Real-time pitch contouring & neural timbre cloning.</p>
                      <div className="stat-progress-bar">
                        <div className="progress-fill green" style={{ width: '100%' }} />
                      </div>
                    </div>

                    <div className="luxury-stat-card">
                      <div className="stat-card-top">
                        <div className="stat-icon-wrap">
                          <Sliders size={16} />
                        </div>
                        <span className="luxury-badge subtle">-14 LUFS Target</span>
                      </div>
                      <h4 className="stat-card-title">Radio Mastering</h4>
                      <p className="stat-card-desc">EBU R128 international broadcast standard audio.</p>
                      <div className="stat-progress-bar">
                        <div className="progress-fill red" style={{ width: '100%' }} />
                      </div>
                    </div>

                    <div className="luxury-stat-card">
                      <div className="stat-card-top">
                        <div className="stat-icon-wrap">
                          <Cpu size={16} />
                        </div>
                        <span className="luxury-badge red">15 GB VRAM</span>
                      </div>
                      <h4 className="stat-card-title">Cloud GPU Acceleration</h4>
                      <p className="stat-card-desc">Google Colab NVIDIA T4 tunnel for infinite generations.</p>
                      <div className="stat-progress-bar">
                        <div className="progress-fill red" style={{ width: '100%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. MANAGE SUBSCRIPTION (Brushed Titanium Black Card) */}
              {activeSubModal === 'subscription' && (
                <div className="luxury-sub-container">
                  <div className="titanium-member-card">
                    <div className="member-card-header">
                      <div className="member-card-brand">
                        <span className="brand-dot" />
                        <span>SONARA STUDIO PRO</span>
                      </div>
                      <span className="member-tier-pill">LIFETIME CREATOR</span>
                    </div>

                    <div className="member-card-chip">
                      <div className="chip-micro-lines" />
                    </div>

                    <div className="member-card-details">
                      <div className="member-detail-col">
                        <span className="detail-label">CARDHOLDER</span>
                        <strong className="detail-value">INDRAJIT KUMAR</strong>
                      </div>
                      <div className="member-detail-col">
                        <span className="detail-label">ACCOUNT ID</span>
                        <span className="detail-value mono">indrajitkumar23541@gmail.com</span>
                      </div>
                      <div className="member-detail-col">
                        <span className="detail-label">VALID THRU</span>
                        <strong className="detail-value text-red-primary">PERPETUAL</strong>
                      </div>
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="license-perks-list">
                    <div className="license-perk-row">
                      <Check size={15} className="text-emerald" />
                      <span>Unlimited AI song generation with zero queue delays or credit limits</span>
                    </div>
                    <div className="license-perk-row">
                      <Check size={15} className="text-emerald" />
                      <span>Custom AI Voice Avatar recording with instant clone timbre synchronization</span>
                    </div>
                    <div className="license-perk-row">
                      <Check size={15} className="text-emerald" />
                      <span>Dual-Engine pipeline: Local Melodic Studio + Free Google Colab T4 Cloud GPU</span>
                    </div>
                    <div className="license-perk-row">
                      <Check size={15} className="text-emerald" />
                      <span>Broadcast -14 LUFS mastering with multi-layered Indian acoustic stems</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. UPGRADE TO SONARA PRO */}
              {activeSubModal === 'upgrade' && (
                <div className="luxury-upgrade-container">
                  <div className="pro-active-hero-banner">
                    <div className="pro-sparkle-halo">
                      <Sparkles size={32} className="text-red-primary animate-pulse" />
                    </div>
                    <h4 className="pro-hero-headline">You already have full SONARA Pro privileges</h4>
                    <p className="pro-hero-subtext">
                      Your studio workstation is configured with unrestricted parallel vocal synthesis, high-speed audio mastering, and unlimited cloud GPU cluster integration.
                    </p>
                  </div>
                  <div className="pro-metrics-strip">
                    <div className="pro-metric-box">
                      <span className="pro-metric-num">0s</span>
                      <span className="pro-metric-lbl">Queue Latency</span>
                    </div>
                    <div className="pro-metric-box">
                      <span className="pro-metric-num">15 GB</span>
                      <span className="pro-metric-lbl">Cloud VRAM</span>
                    </div>
                    <div className="pro-metric-box">
                      <span className="pro-metric-num">48 kHz</span>
                      <span className="pro-metric-lbl">Master Quality</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. THEME SETTINGS */}
              {activeSubModal === 'theme' && (
                <div className="luxury-theme-container">
                  <div 
                    className={`luxury-theme-card ${selectedTheme === 'obsidian-crimson' ? 'selected' : ''}`}
                    onClick={() => setSelectedTheme('obsidian-crimson')}
                  >
                    <div className="theme-swatch obsidian-crimson">
                      <div className="swatch-accent" />
                    </div>
                    <div className="theme-card-info">
                      <div className="flex-center-gap">
                        <strong>Obsidian & Crimson (Default)</strong>
                        <span className="badge-gemini-red">Studio Luxury</span>
                      </div>
                      <p>Deep obsidian dark mode with subtle glowing crimson borders and micro-reflections.</p>
                    </div>
                    <div className="theme-select-indicator">
                      {selectedTheme === 'obsidian-crimson' ? (
                        <CheckCircle2 size={18} className="text-red-primary" />
                      ) : (
                        <div className="empty-indicator-dot" />
                      )}
                    </div>
                  </div>

                  <div 
                    className={`luxury-theme-card ${selectedTheme === 'pure-dark' ? 'selected' : ''}`}
                    onClick={() => setSelectedTheme('pure-dark')}
                  >
                    <div className="theme-swatch pure-dark">
                      <div className="swatch-accent dark" />
                    </div>
                    <div className="theme-card-info">
                      <div className="flex-center-gap">
                        <strong>Midnight Onyx (OLED Pure Black)</strong>
                        <span className="badge-gemini-subtle">High Contrast</span>
                      </div>
                      <p>Ultra-deep pitch black theme crafted specifically for high-efficiency OLED screens.</p>
                    </div>
                    <div className="theme-select-indicator">
                      {selectedTheme === 'pure-dark' ? (
                        <CheckCircle2 size={18} className="text-red-primary" />
                      ) : (
                        <div className="empty-indicator-dot" />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 5. LOCATION & REGION */}
              {activeSubModal === 'location' && (
                <div className="luxury-location-container">
                  <div className="location-node-card">
                    <div className="location-node-header">
                      <div className="flex-center-gap">
                        <MapPin size={18} className="text-red-primary" />
                        <span className="node-title">Active Server Node</span>
                      </div>
                      <span className="luxury-pill-badge emerald">
                        <span className="live-pulse green" /> Connected
                      </span>
                    </div>

                    <div className="location-telemetry-rows">
                      <div className="loc-telemetry-row">
                        <span className="loc-label">Physical Region:</span>
                        <strong className="loc-val">India (Asia-South1 Local Loopback)</strong>
                      </div>
                      <div className="loc-telemetry-row">
                        <span className="loc-label">Host Endpoint:</span>
                        <code className="loc-val mono">http://localhost:5173 • http://127.0.0.1:8000</code>
                      </div>
                      <div className="loc-telemetry-row">
                        <span className="loc-label">Direct Bus Latency:</span>
                        <strong className="loc-val text-emerald">~1.2 ms (Zero network delay)</strong>
                      </div>
                      <div className="loc-telemetry-row">
                        <span className="loc-label">Streaming Protocol:</span>
                        <span className="loc-val">HTTP/2 + Edge Neural Coroutines</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Dialog Footer */}
            <div className="luxury-dialog-footer">
              <button 
                type="button" 
                className="luxury-done-btn"
                onClick={handleCloseAll}
              >
                Dismiss
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
