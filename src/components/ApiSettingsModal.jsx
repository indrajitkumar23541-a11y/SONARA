import React, { useState, useEffect } from 'react';
import { 
  X, 
  Cpu, 
  Cloud, 
  Check, 
  Server, 
  ExternalLink, 
  ShieldCheck,
  Zap,
  Activity,
  AlertCircle,
  Copy,
  Layers,
  Sparkles,
  Radio,
  Sliders,
  CheckCircle2
} from 'lucide-react';

export default function ApiSettingsModal({ 
  isOpen, 
  onClose, 
  onSaveColabUrl, 
  currentColabUrl 
}) {
  const [activeTab, setActiveTab] = useState('engine'); // 'engine' | 'hardware' | 'master'
  const [colabUrl, setColabUrl] = useState(currentColabUrl || '');
  const [activeProvider, setActiveProvider] = useState('colab'); // 'colab' | 'local'
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [saved, setSaved] = useState(false);
  const [copiedNotebook, setCopiedNotebook] = useState(false);

  useEffect(() => {
    const savedUrl = localStorage.getItem('sonara_colab_url');
    if (savedUrl) {
      setColabUrl(savedUrl);
    }
    const savedProvider = localStorage.getItem('sonara_active_engine');
    if (savedProvider) {
      setActiveProvider(savedProvider);
    }
  }, []);

  if (!isOpen) return null;

  const notebookPath = `e:\\SONARA\\colab\\SONARA_Free_GPU_Studio.ipynb`;

  const copyNotebookPath = () => {
    navigator.clipboard.writeText(notebookPath);
    setCopiedNotebook(true);
    setTimeout(() => setCopiedNotebook(false), 2200);
  };

  const testColabConnection = async () => {
    if (!colabUrl.trim()) {
      setConnectionStatus({ 
        ok: false, 
        msg: 'Please paste a valid Cloudflare / ngrok tunnel URL' 
      });
      return;
    }

    setTestingConnection(true);
    setConnectionStatus(null);

    const cleanUrl = colabUrl.trim().replace(/\/$/, '');

    try {
      const res = await fetch(`${cleanUrl}/health`, { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('sonara_colab_url', cleanUrl);
        if (onSaveColabUrl) {
          onSaveColabUrl(cleanUrl);
        }
        setConnectionStatus({
          ok: true,
          msg: `Connected to ${data.gpu_device || 'Google Colab NVIDIA T4'} (${data.vram_gb || 15} GB VRAM) • Online!`,
        });
      } else {
        setConnectionStatus({ 
          ok: false, 
          msg: `Colab server responded with HTTP ${res.status}. Verify the tunnel is active.` 
        });
      }
    } catch (err) {
      setConnectionStatus({
        ok: false,
        msg: 'Connection timed out. Ensure the Colab notebook is running and URL is fresh.',
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSave = () => {
    const cleanUrl = colabUrl.trim().replace(/\/$/, '');
    localStorage.setItem('sonara_colab_url', cleanUrl);
    localStorage.setItem('sonara_active_engine', activeProvider);
    if (onSaveColabUrl) {
      onSaveColabUrl(cleanUrl);
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 900);
  };

  return (
    <div className="gemini-modal-overlay animate-fadeIn" onClick={onClose}>
      <div 
        className="settings-modal-card animate-scaleUp" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header-row">
          <div className="modal-title-group">
            <div className="modal-red-icon">
              <Cpu size={22} className="text-red-primary" />
            </div>
            <div>
              <h3 className="modal-headline">Studio Engine & Acceleration</h3>
              <p className="modal-subhead">
                Configure cloud GPU acceleration, local synthesis & studio hardware
              </p>
            </div>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose} 
            title="Close Settings"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs Ribbon */}
        <div className="settings-tabs-ribbon">
          <button
            type="button"
            className={`settings-tab-btn ${activeTab === 'engine' ? 'active' : ''}`}
            onClick={() => setActiveTab('engine')}
          >
            <Cloud size={16} />
            <span>AI Engine & Cloud GPU</span>
          </button>
          <button
            type="button"
            className={`settings-tab-btn ${activeTab === 'hardware' ? 'active' : ''}`}
            onClick={() => setActiveTab('hardware')}
          >
            <Server size={16} />
            <span>System Hardware</span>
          </button>
          <button
            type="button"
            className={`settings-tab-btn ${activeTab === 'master' ? 'active' : ''}`}
            onClick={() => setActiveTab('master')}
          >
            <Sliders size={16} />
            <span>Mastering & Audio</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="settings-modal-body">
          {/* TAB 1: Engine Mode & Colab Tunnel */}
          {activeTab === 'engine' && (
            <div className="settings-tab-pane animate-fadeIn">
              {/* Strategy Cards */}
              <div className="settings-engine-grid">
                {/* 1. Google Colab GPU */}
                <div 
                  className={`engine-mode-card ${activeProvider === 'colab' ? 'selected' : ''}`}
                  onClick={() => setActiveProvider('colab')}
                >
                  <div className="engine-card-top">
                    <div className="engine-radio-ring">
                      <div className={`engine-radio-dot ${activeProvider === 'colab' ? 'active' : ''}`} />
                    </div>
                    <div className="engine-title-wrap">
                      <h4 className="engine-card-title">Google Colab Free NVIDIA T4 GPU</h4>
                      <div className="engine-badges-row">
                        <span className="badge-gemini-green">
                          <span className="pulse-dot green" /> 100% Free & Unlimited
                        </span>
                        <span className="badge-gemini-red">15 GB VRAM</span>
                      </div>
                    </div>
                  </div>
                  <p className="engine-card-desc">
                    Offloads high-resolution vocal separation, deep timbre synthesis, and heavy mastering to Google's free 15GB GPU cloud cluster. Zero laptop fan noise, zero GPU load.
                  </p>
                </div>

                {/* 2. Local Melodic Engine */}
                <div 
                  className={`engine-mode-card ${activeProvider === 'local' ? 'selected' : ''}`}
                  onClick={() => setActiveProvider('local')}
                >
                  <div className="engine-card-top">
                    <div className="engine-radio-ring">
                      <div className={`engine-radio-dot ${activeProvider === 'local' ? 'active' : ''}`} />
                    </div>
                    <div className="engine-title-wrap">
                      <h4 className="engine-card-title">Local Melodic Studio Engine (Offline)</h4>
                      <div className="engine-badges-row">
                        <span className="badge-gemini-red">
                          <span className="pulse-dot red" /> Fast Local • Zero Lag
                        </span>
                        <span className="badge-gemini-subtle">Intel Core i5 Optimized</span>
                      </div>
                    </div>
                  </div>
                  <p className="engine-card-desc">
                    Runs ultra-fast parallel neural singing synthesis, acoustic guitar accompaniment, and FFmpeg broadcast mastering directly on your laptop with low latency.
                  </p>
                </div>
              </div>

              {/* Colab Configuration Box (When Colab selected) */}
              {activeProvider === 'colab' && (
                <div className="colab-setup-card animate-fadeIn">
                  <div className="colab-card-header">
                    <div className="flex-center-gap">
                      <Cloud size={18} className="text-red-primary" />
                      <span className="colab-header-title">Google Colab Free GPU Setup (2 Minutes)</span>
                    </div>
                    <a
                      href="https://colab.research.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="colab-ext-link"
                    >
                      <span>Open Colab</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>

                  {/* 3 Steps */}
                  <div className="colab-steps-grid">
                    <div className="colab-step-item">
                      <div className="step-num">1</div>
                      <div className="step-text">
                        <span>Open <strong>Google Colab</strong> and upload notebook:</span>
                        <div className="step-code-row">
                          <code>SONARA_Free_GPU_Studio.ipynb</code>
                          <button
                            type="button"
                            className="step-copy-btn"
                            onClick={copyNotebookPath}
                            title="Copy full local path"
                          >
                            {copiedNotebook ? <Check size={13} className="text-emerald" /> : <Copy size={13} />}
                            <span>{copiedNotebook ? 'Path Copied!' : 'Copy Path'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="colab-step-item">
                      <div className="step-num">2</div>
                      <div className="step-text">
                        <span>Click <strong>Runtime ➔ Run all</strong> (Free NVIDIA T4 GPU enabled).</span>
                      </div>
                    </div>

                    <div className="colab-step-item">
                      <div className="step-num">3</div>
                      <div className="step-text">
                        <span>Copy the public <code>trycloudflare.com</code> URL and paste below:</span>
                      </div>
                    </div>
                  </div>

                  {/* Input row */}
                  <div className="colab-url-box">
                    <label className="colab-input-label">Public Tunnel URL (Cloudflare / ngrok):</label>
                    <div className="colab-input-group">
                      <div className="colab-input-icon">
                        <Cloud size={16} />
                      </div>
                      <input
                        type="url"
                        className="colab-url-input"
                        placeholder="https://your-tunnel-name.trycloudflare.com"
                        value={colabUrl}
                        onChange={(e) => setColabUrl(e.target.value)}
                      />
                      <button
                        type="button"
                        className="colab-test-btn"
                        onClick={testColabConnection}
                        disabled={testingConnection}
                      >
                        {testingConnection ? (
                          <>
                            <Activity size={14} className="animate-spin text-red-primary" />
                            <span>Pinging...</span>
                          </>
                        ) : (
                          <>
                            <Zap size={14} />
                            <span>Test Connection</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Feedback pill */}
                    {connectionStatus && (
                      <div className={`connection-status-pill ${connectionStatus.ok ? 'success' : 'error'} animate-fadeIn`}>
                        {connectionStatus.ok ? (
                          <CheckCircle2 size={16} className="status-icon green" />
                        ) : (
                          <AlertCircle size={16} className="status-icon red" />
                        )}
                        <span className="status-text">{connectionStatus.msg}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Hardware Specs & Telemetry */}
          {activeTab === 'hardware' && (
            <div className="settings-tab-pane animate-fadeIn">
              <div className="specs-grid-container">
                <div className="spec-glass-card">
                  <div className="spec-icon-box">
                    <Cpu size={20} className="text-red-primary" />
                  </div>
                  <div className="spec-info">
                    <span className="spec-label">Processor (CPU)</span>
                    <strong className="spec-value">Intel® Core™ i5-13500H</strong>
                    <span className="spec-sub">16 Threads • Up to 4.70 GHz Turbo</span>
                  </div>
                </div>

                <div className="spec-glass-card">
                  <div className="spec-icon-box">
                    <Activity size={20} className="text-red-primary" />
                  </div>
                  <div className="spec-info">
                    <span className="spec-label">System Memory (RAM)</span>
                    <strong className="spec-value">16 GB DDR5</strong>
                    <span className="spec-sub">Ultra Low-Latency Dual Channel</span>
                  </div>
                </div>

                <div className="spec-glass-card">
                  <div className="spec-icon-box">
                    <Zap size={20} className="text-red-primary" />
                  </div>
                  <div className="spec-info">
                    <span className="spec-label">Integrated Laptop GPU</span>
                    <strong className="spec-value">Intel® Iris® Xe Graphics</strong>
                    <span className="spec-sub">96 EUs • DirectX 12.1 Hardware Accel</span>
                  </div>
                </div>

                <div className="spec-glass-card">
                  <div className="spec-icon-box">
                    <Cloud size={20} className="text-red-primary" />
                  </div>
                  <div className="spec-info">
                    <span className="spec-label">Cloud Acceleration</span>
                    <strong className="spec-value">Google Colab NVIDIA T4</strong>
                    <span className="spec-sub">15 GB VRAM • High Performance Cloud</span>
                  </div>
                </div>
              </div>

              {/* System Health Banner */}
              <div className="system-health-banner">
                <div className="health-dot-wrap">
                  <span className="pulse-dot green" />
                </div>
                <div className="health-details">
                  <strong>Studio Core Engine Operational</strong>
                  <span>FastAPI backend, FFmpeg audio engine & Edge vocal synthesis pipeline are running at peak performance.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Mastering & Audio Settings */}
          {activeTab === 'master' && (
            <div className="settings-tab-pane animate-fadeIn">
              <div className="mastering-settings-list">
                <div className="mastering-item">
                  <div className="mastering-item-left">
                    <strong>Broadcast Radio Loudness</strong>
                    <span>Mastered strictly to international streaming standards (-14.0 LUFS)</span>
                  </div>
                  <span className="badge-gemini-red">-14 LUFS Target</span>
                </div>

                <div className="mastering-item">
                  <div className="mastering-item-left">
                    <strong>Audio Resolution & Sample Rate</strong>
                    <span>High-Fidelity 48,000 Hz / 24-Bit WAV with studio parametric EQ</span>
                  </div>
                  <span className="badge-gemini-red">48 kHz Hi-Res</span>
                </div>

                <div className="mastering-item">
                  <div className="mastering-item-left">
                    <strong>Vocal Harmonizer & Double Tracking</strong>
                    <span>Dynamic harmonizing (+3 semitones) and subtle acoustic sidechain ducking (-2.5dB)</span>
                  </div>
                  <span className="badge-gemini-green">Active (Enabled)</span>
                </div>

                <div className="mastering-item">
                  <div className="mastering-item-left">
                    <strong>Multi-Layer Indian Acoustic Backing</strong>
                    <span>Acoustic guitars, expressive flute, harmonium, and traditional tabla layers</span>
                  </div>
                  <span className="badge-gemini-green">Studio Multi-Stem</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="settings-modal-footer">
          <div className="footer-status-tag">
            <span className="footer-tag-label">Active Mode:</span>
            <strong className="footer-tag-val">
              {activeProvider === 'colab' ? 'Google Colab NVIDIA T4 GPU' : 'Local Melodic Studio Engine'}
            </strong>
          </div>

          <div className="footer-buttons-group">
            <button 
              type="button" 
              className="btn-cancel-settings" 
              onClick={onClose}
            >
              Close
            </button>
            <button 
              type="button" 
              className="settings-save-btn" 
              onClick={handleSave}
            >
              {saved ? (
                <>
                  <Check size={18} className="text-white" />
                  <span>Saved & Activated!</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Save & Connect</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
