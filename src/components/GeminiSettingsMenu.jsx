import React, { useState, useRef, useEffect } from 'react';
import { 
  Gauge, 
  CreditCard, 
  Sparkles, 
  Cpu, 
  Sliders, 
  UserCheck, 
  Diamond, 
  Palette, 
  UploadCloud, 
  Link2, 
  MessageSquare, 
  HelpCircle, 
  MapPin, 
  Clock, 
  ChevronRight, 
  X,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function GeminiSettingsMenu({ 
  isOpen, 
  onClose, 
  onOpenEngineSettings, 
  onOpenAvatarModal,
  onOpenHistoryDrawer
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

  return (
    <>
      {/* Floating Menu Anchored to Bottom-Left next to Sidebar (Matches Screenshot) */}
      <div 
        ref={menuRef} 
        className="gemini-settings-menu animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Section 1: Account */}
        <div className="settings-menu-section">
          <span className="settings-section-heading">Account</span>
          
          {/* 1. Usage limits (Highlighted pill in screenshot) */}
          <button 
            type="button" 
            className="settings-menu-item active-pill"
            onClick={() => setActiveSubModal('usage')}
          >
            <Gauge size={17} className="settings-item-icon" />
            <span className="settings-item-label">Usage limits</span>
          </button>

          {/* 2. Manage subscription */}
          <button 
            type="button" 
            className="settings-menu-item"
            onClick={() => setActiveSubModal('subscription')}
          >
            <CreditCard size={17} className="settings-item-icon" />
            <span className="settings-item-label">Manage subscription</span>
          </button>

          {/* 3. Upgrade to SONARA Pro */}
          <button 
            type="button" 
            className="settings-menu-item"
            onClick={() => setActiveSubModal('upgrade')}
          >
            <Sparkles size={17} className="settings-item-icon text-red-primary" />
            <span className="settings-item-label">Upgrade to SONARA Pro</span>
          </button>
        </div>

        {/* Section 2: Preferences */}
        <div className="settings-menu-section">
          <span className="settings-section-heading">Preferences</span>

          {/* 4. Personal Intelligence / Studio Engine & GPU */}
          <button 
            type="button" 
            className="settings-menu-item"
            onClick={() => {
              onClose();
              if (onOpenEngineSettings) onOpenEngineSettings();
            }}
          >
            <Cpu size={17} className="settings-item-icon" />
            <span className="settings-item-label">Studio Engine & GPU</span>
          </button>

          {/* 5. Skills / Music Stems */}
          <button 
            type="button" 
            className="settings-menu-item"
            onClick={() => {
              onClose();
              if (onOpenEngineSettings) onOpenEngineSettings();
            }}
          >
            <Sliders size={17} className="settings-item-icon" />
            <span className="settings-item-label">Skills & Mastering</span>
          </button>

          {/* 6. Avatar (Voice Avatar Modal) */}
          <button 
            type="button" 
            className="settings-menu-item"
            onClick={() => {
              onClose();
              if (onOpenAvatarModal) onOpenAvatarModal();
            }}
          >
            <UserCheck size={17} className="settings-item-icon" />
            <span className="settings-item-label">Avatar</span>
          </button>

          {/* 7. Gems (Bollywood & Classical Presets) */}
          <button 
            type="button" 
            className="settings-menu-item"
            onClick={() => {
              onClose();
              if (onOpenEngineSettings) onOpenEngineSettings();
            }}
          >
            <Diamond size={17} className="settings-item-icon" />
            <span className="settings-item-label">Gems & Presets</span>
          </button>

          {/* 8. Theme */}
          <button 
            type="button" 
            className="settings-menu-item with-chevron"
            onClick={() => setActiveSubModal('theme')}
          >
            <div className="flex-center-gap">
              <Palette size={17} className="settings-item-icon" />
              <span className="settings-item-label">Theme</span>
            </div>
            <ChevronRight size={15} className="chevron-right-muted" />
          </button>
        </div>

        {/* Section 3: Data & privacy */}
        <div className="settings-menu-section">
          <span className="settings-section-heading">Data & privacy</span>

          {/* 9. Import memory to SONARA */}
          <button 
            type="button" 
            className="settings-menu-item"
            onClick={() => {
              onClose();
              if (onOpenAvatarModal) onOpenAvatarModal();
            }}
          >
            <UploadCloud size={17} className="settings-item-icon" />
            <span className="settings-item-label">Import memory to SONARA</span>
          </button>

          {/* 10. Your public links */}
          <button 
            type="button" 
            className="settings-menu-item"
            onClick={() => {
              onClose();
              if (onOpenHistoryDrawer) onOpenHistoryDrawer();
            }}
          >
            <Link2 size={17} className="settings-item-icon" />
            <span className="settings-item-label">Your public links</span>
          </button>

          {/* 11. Send feedback */}
          <button 
            type="button" 
            className="settings-menu-item"
            onClick={() => {
              window.open('https://github.com/indrajitkumar23541-a11y/SONARA/issues', '_blank');
              onClose();
            }}
          >
            <MessageSquare size={17} className="settings-item-icon" />
            <span className="settings-item-label">Send feedback</span>
          </button>

          {/* 12. Help */}
          <button 
            type="button" 
            className="settings-menu-item with-chevron"
            onClick={() => {
              window.open('https://github.com/indrajitkumar23541-a11y/SONARA#readme', '_blank');
              onClose();
            }}
          >
            <div className="flex-center-gap">
              <HelpCircle size={17} className="settings-item-icon" />
              <span className="settings-item-label">Help</span>
            </div>
            <ChevronRight size={15} className="chevron-right-muted" />
          </button>

          {/* 13. Location */}
          <button 
            type="button" 
            className="settings-menu-item with-chevron"
            onClick={() => setActiveSubModal('location')}
          >
            <div className="flex-center-gap">
              <MapPin size={17} className="settings-item-icon" />
              <span className="settings-item-label">Location</span>
            </div>
            <ChevronRight size={15} className="chevron-right-muted" />
          </button>

          {/* 14. Activity */}
          <button 
            type="button" 
            className="settings-menu-item"
            onClick={() => {
              onClose();
              if (onOpenHistoryDrawer) onOpenHistoryDrawer();
            }}
          >
            <Clock size={17} className="settings-item-icon" />
            <span className="settings-item-label">Activity</span>
          </button>
        </div>
      </div>

      {/* Sub-modal Dialogs when clicking on Usage limits, Subscription, Location, etc. */}
      {activeSubModal && (
        <div className="gemini-modal-overlay animate-fadeIn" onClick={() => setActiveSubModal(null)}>
          <div className="gemini-settings-subcard animate-scaleUp" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <div className="modal-title-group">
                <div className="modal-red-icon">
                  {activeSubModal === 'usage' && <Gauge size={20} className="text-red-primary" />}
                  {activeSubModal === 'subscription' && <CreditCard size={20} className="text-red-primary" />}
                  {activeSubModal === 'upgrade' && <Sparkles size={20} className="text-red-primary" />}
                  {activeSubModal === 'theme' && <Palette size={20} className="text-red-primary" />}
                  {activeSubModal === 'location' && <MapPin size={20} className="text-red-primary" />}
                </div>
                <div>
                  <h3 className="modal-headline">
                    {activeSubModal === 'usage' && 'Usage limits'}
                    {activeSubModal === 'subscription' && 'Manage subscription'}
                    {activeSubModal === 'upgrade' && 'Upgrade to SONARA Pro'}
                    {activeSubModal === 'theme' && 'Theme Settings'}
                    {activeSubModal === 'location' && 'Location & Region'}
                  </h3>
                  <p className="modal-subhead">SONARA AI Studio Account & Engine Preferences</p>
                </div>
              </div>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setActiveSubModal(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="subcard-body">
              {/* 1. Usage limits content */}
              {activeSubModal === 'usage' && (
                <div className="subcard-info-stack">
                  <div className="subcard-stat-tile">
                    <div className="stat-tile-left">
                      <strong>AI Song Generation</strong>
                      <span>Local Studio Engine + Google Colab Cloud GPU</span>
                    </div>
                    <span className="badge-gemini-green">Unlimited</span>
                  </div>

                  <div className="subcard-stat-tile">
                    <div className="stat-tile-left">
                      <strong>5-Second Voice Avatar Synthesis</strong>
                      <span>Real-time pitch contouring & timbre cloning</span>
                    </div>
                    <span className="badge-gemini-green">Unlimited</span>
                  </div>

                  <div className="subcard-stat-tile">
                    <div className="stat-tile-left">
                      <strong>Broadcast Radio Mastering (-14 LUFS)</strong>
                      <span>EBU R128 loudness normalization & dynamic ducking</span>
                    </div>
                    <span className="badge-gemini-green">Unlimited</span>
                  </div>

                  <div className="subcard-stat-tile">
                    <div className="stat-tile-left">
                      <strong>Cloud GPU Acceleration (Colab T4)</strong>
                      <span>15GB NVIDIA T4 GPU via Cloudflare tunnel</span>
                    </div>
                    <span className="badge-gemini-red">100% Free</span>
                  </div>
                </div>
              )}

              {/* 2. Manage subscription content */}
              {activeSubModal === 'subscription' && (
                <div className="subcard-info-stack">
                  <div className="subscription-banner">
                    <ShieldCheck size={28} className="text-red-primary" />
                    <div>
                      <h4 className="text-white font-bold">SONARA Studio Pro Plan</h4>
                      <p className="text-muted text-sm">Registered to: Indrajit Kumar (indrajitkumar23541@gmail.com)</p>
                    </div>
                  </div>
                  <div className="subscription-perks">
                    <div className="perk-row"><Check size={16} className="text-emerald" /><span>Unlimited song synthesis & full-duration music generation</span></div>
                    <div className="perk-row"><Check size={16} className="text-emerald" /><span>Custom AI Voice Avatar recording with instant clone preview</span></div>
                    <div className="perk-row"><Check size={16} className="text-emerald" /><span>High-speed parallel vocal synthesis coroutines (~1.5s latency)</span></div>
                    <div className="perk-row"><Check size={16} className="text-emerald" /><span>Free lifetime access without monthly fees or credit deductions</span></div>
                  </div>
                </div>
              )}

              {/* 3. Upgrade to SONARA Pro content */}
              {activeSubModal === 'upgrade' && (
                <div className="subcard-info-stack">
                  <div className="upgrade-pro-hero">
                    <Sparkles size={36} className="text-red-primary animate-pulse" />
                    <h4>You are on SONARA Pro!</h4>
                    <p>All Google Gemini Studio features, unlimited Colab T4 cloud GPU tunnels, and neural Bollywood duet synthesis are already activated on your account.</p>
                  </div>
                </div>
              )}

              {/* 4. Theme content */}
              {activeSubModal === 'theme' && (
                <div className="subcard-info-stack">
                  <div 
                    className={`theme-option-card ${selectedTheme === 'obsidian-crimson' ? 'selected' : ''}`}
                    onClick={() => setSelectedTheme('obsidian-crimson')}
                  >
                    <div className="theme-color-preview obsidian-crimson" />
                    <div className="theme-option-info">
                      <strong>Obsidian & Crimson (Default Sonara Red)</strong>
                      <span>Luxury dark obsidian with glowing red borders & accents</span>
                    </div>
                    {selectedTheme === 'obsidian-crimson' && <CheckCircle2 size={18} className="text-red-primary" />}
                  </div>

                  <div 
                    className={`theme-option-card ${selectedTheme === 'pure-dark' ? 'selected' : ''}`}
                    onClick={() => setSelectedTheme('pure-dark')}
                  >
                    <div className="theme-color-preview pure-dark" />
                    <div className="theme-option-info">
                      <strong>Midnight Onyx</strong>
                      <span>Ultra-deep black background for OLED screens</span>
                    </div>
                    {selectedTheme === 'pure-dark' && <CheckCircle2 size={18} className="text-red-primary" />}
                  </div>
                </div>
              )}

              {/* 5. Location content */}
              {activeSubModal === 'location' && (
                <div className="subcard-info-stack">
                  <div className="subcard-stat-tile">
                    <div className="stat-tile-left">
                      <strong>Region / Server Location</strong>
                      <span>India (Asia-South1) • Direct Local Loopback</span>
                    </div>
                    <span className="badge-gemini-red">Active</span>
                  </div>
                  <div className="subcard-stat-tile">
                    <div className="stat-tile-left">
                      <strong>Local Host Endpoint</strong>
                      <span>http://127.0.0.1:8000 & http://localhost:5173</span>
                    </div>
                    <span className="badge-gemini-green">Online</span>
                  </div>
                  <div className="subcard-stat-tile">
                    <div className="stat-tile-left">
                      <strong>Network Latency</strong>
                      <span>~1.2 ms (Zero network delay)</span>
                    </div>
                    <span className="badge-gemini-green">Ultra Fast</span>
                  </div>
                </div>
              )}
            </div>

            <div className="subcard-footer">
              <button 
                type="button" 
                className="done-red-btn"
                onClick={() => setActiveSubModal(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
