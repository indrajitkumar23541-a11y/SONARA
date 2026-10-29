import React, { useState, useEffect } from 'react';
import { 
  X, 
  Cpu, 
  Cloud, 
  Key, 
  Check, 
  Server, 
  ExternalLink, 
  ShieldCheck,
  Zap,
  Activity,
  AlertCircle
} from 'lucide-react';

export default function ApiSettingsModal({ isOpen, onClose, onSaveColabUrl, currentColabUrl }) {
  const [colabUrl, setColabUrl] = useState(currentColabUrl || '');
  const [activeProvider, setActiveProvider] = useState('colab'); // default to Colab Free GPU!
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedUrl = localStorage.getItem('sonara_colab_url');
    if (savedUrl) {
      setColabUrl(savedUrl);
    }
  }, []);

  if (!isOpen) return null;

  const testColabConnection = async () => {
    if (!colabUrl.trim()) {
      setConnectionStatus({ ok: false, msg: 'Please paste a valid Cloudflare / ngrok tunnel URL' });
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
          msg: `Connected to ${data.gpu_device || 'Google Colab GPU'} (${data.vram_gb || 15} GB VRAM) • Online!`,
        });
      } else {
        setConnectionStatus({ ok: false, msg: `Colab returned HTTP ${res.status}` });
      }
    } catch (err) {
      setConnectionStatus({
        ok: false,
        msg: 'Could not connect. Ensure the Colab notebook is running and URL is correct.',
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSave = () => {
    const cleanUrl = colabUrl.trim().replace(/\/$/, '');
    localStorage.setItem('sonara_colab_url', cleanUrl);
    if (onSaveColabUrl) {
      onSaveColabUrl(cleanUrl);
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex-center-gap">
            <Cpu size={22} className="text-cyan" />
            <h3 className="modal-title">AI Engine & Google Colab Free GPU (Rasta 2)</h3>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Laptop Spec Summary */}
          <div className="spec-banner">
            <div className="spec-item">
              <span className="spec-label">Laptop CPU:</span>
              <span className="spec-val">Intel Core i5-13500H</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Laptop RAM:</span>
              <span className="spec-val">16 GB</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Laptop GPU:</span>
              <span className="spec-val">Intel Iris Xe (Integrated)</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Active Strategy:</span>
              <span className="badge badge-emerald">Free Google Colab T4 GPU</span>
            </div>
          </div>

          {/* Engine Modes */}
          <div className="engine-modes-list">
            <div
              className={`mode-card ${activeProvider === 'colab' ? 'selected' : ''}`}
              onClick={() => setActiveProvider('colab')}
            >
              <div className="mode-radio">
                <div className={`radio-dot ${activeProvider === 'colab' ? 'active' : ''}`} />
              </div>
              <div className="mode-info">
                <div className="flex-center-gap">
                  <h4 className="mode-name">Rasta 2: Google Colab Free NVIDIA T4 GPU</h4>
                  <span className="badge badge-emerald">100% Free & Unlimited</span>
                </div>
                <p className="mode-desc">
                  Runs heavy AI song generation, voice cloning, and mastering on Google's free 15GB T4 GPU cloud server without spending a single rupee.
                </p>
              </div>
            </div>

            <div
              className={`mode-card ${activeProvider === 'local' ? 'selected' : ''}`}
              onClick={() => setActiveProvider('local')}
            >
              <div className="mode-radio">
                <div className={`radio-dot ${activeProvider === 'local' ? 'active' : ''}`} />
              </div>
              <div className="mode-info">
                <div className="flex-center-gap">
                  <h4 className="mode-name">Local Studio Engine (Offline)</h4>
                  <span className="badge badge-cyan">Fast Local</span>
                </div>
                <p className="mode-desc">
                  Runs local FFmpeg studio reverb, acoustic guitar accompaniment, and neural vocal synthesizer on your laptop.
                </p>
              </div>
            </div>
          </div>

          {/* Colab Instructions & URL Input */}
          {activeProvider === 'colab' && (
            <div className="colab-config-box">
              <div className="colab-guide-steps">
                <span className="colab-guide-title">🚀 How to run in Google Colab (2 Minutes):</span>
                <ol className="colab-steps-list">
                  <li>
                    Open <strong>colab.research.google.com</strong> and upload{' '}
                    <code>e:\SONARA\colab\SONARA_Free_GPU_Studio.ipynb</code>.
                  </li>
                  <li>Click <strong>Runtime ➔ Run all</strong> (Free T4 GPU enabled).</li>
                  <li>Copy the generated <code>trycloudflare.com</code> URL and paste it below:</li>
                </ol>
              </div>

              <label className="input-label">Cloudflare / ngrok Public URL:</label>
              <div className="input-action-row">
                <input
                  type="text"
                  className="text-input"
                  placeholder="https://random-words.trycloudflare.com"
                  value={colabUrl}
                  onChange={(e) => setColabUrl(e.target.value)}
                />
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={testColabConnection}
                  disabled={testingConnection}
                >
                  {testingConnection ? 'Pinging...' : 'Test Link'}
                </button>
              </div>

              {connectionStatus && (
                <div
                  className={`connection-feedback ${
                    connectionStatus.ok ? 'connected' : 'error'
                  }`}
                >
                  {connectionStatus.ok ? (
                    <Check size={16} className="text-emerald" />
                  ) : (
                    <AlertCircle size={16} className="text-rose" />
                  )}
                  <span>{connectionStatus.msg}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn-primary" onClick={handleSave}>
            {saved ? <Check size={18} className="text-emerald" /> : <ShieldCheck size={18} />}
            <span>{saved ? 'Saved & Activated!' : 'Save & Connect'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
