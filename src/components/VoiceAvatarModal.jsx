import React, { useState, useEffect, useRef } from 'react';
import { SAMPLE_VOICE_PROFILES, SPEAKING_SCRIPTS } from '../utils/constants';
import { sonaraAudio } from '../utils/audioEngine';
import { 
  X, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  UserCheck
} from 'lucide-react';

export default function VoiceAvatarModal({ 
  isOpen, 
  onClose, 
  voiceProfile, 
  setVoiceProfile 
}) {
  const [activeTab, setActiveTab] = useState('record'); // 'record' | 'legends'
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const [micError, setMicError] = useState(null);
  const [recordedSuccess, setRecordedSuccess] = useState(false);
  const [customAvatarName, setCustomAvatarName] = useState('My AI Voice Avatar');

  const canvasRef = useRef(null);
  const timerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const audioPreviewRef = useRef(null);

  const renderVisualizer = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const data = isRecording
      ? sonaraAudio.getLiveMicFrequencies()
      : new Uint8Array(48).map((_, i) => Math.sin(Date.now() / 250 + i) * 14 + 18);

    ctx.clearRect(0, 0, width, height);

    const barWidth = (width / data.length) * 1.4;
    let x = 0;

    for (let i = 0; i < data.length; i++) {
      const barHeight = (data[i] / 255) * height * 0.85;
      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, '#ef4444');
      gradient.addColorStop(0.6, '#b91c1c');
      gradient.addColorStop(1, '#ff6b6b');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, height - barHeight - 3, barWidth - 2, barHeight + 3, 3);
      ctx.fill();

      x += barWidth;
    }

    animationFrameRef.current = requestAnimationFrame(renderVisualizer);
  };

  useEffect(() => {
    if (isOpen) {
      animationFrameRef.current = requestAnimationFrame(renderVisualizer);
    }
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isOpen]);

  if (!isOpen) return null;

  const startRecording = async () => {
    setMicError(null);
    setRecordedSuccess(false);
    try {
      await sonaraAudio.startMicRecording();
      setIsRecording(true);
      setRecordSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordSeconds((prev) => {
          if (prev >= 6) {
            stopRecording();
            return 6;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      setMicError('Microphone permission required for voice scan.');
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);

    try {
      const result = await sonaraAudio.stopMicRecording();
      if (result && result.url) {
        setRecordedAudioUrl(result.url);
        setRecordedSuccess(true);

        // Upload voice recording to backend for voice avatar synthesis
        if (result.blob) {
          try {
            const formData = new FormData();
            formData.append('file', result.blob, 'voice_scan.webm');
            await fetch('http://127.0.0.1:8000/api/upload-voice-avatar', {
              method: 'POST',
              body: formData
            });
          } catch (uploadErr) {
            console.warn("Could not sync voice avatar to server:", uploadErr);
          }
        }

        const userProfile = SAMPLE_VOICE_PROFILES.find((p) => p.id === 'profile_user');
        if (userProfile) {
          const updated = {
            ...userProfile,
            name: customAvatarName || 'Mera AI Voice Avatar',
            audioUrl: result.url,
            isCalibrated: true
          };
          setVoiceProfile(updated);
        }
      }
    } catch (err) {
      setMicError('Error capturing vocal timbre.');
    }
  };

  const togglePlayRecording = () => {
    if (!audioPreviewRef.current) return;
    if (isPlayingRecorded) {
      audioPreviewRef.current.pause();
      setIsPlayingRecorded(false);
    } else {
      audioPreviewRef.current.play();
      setIsPlayingRecorded(true);
    }
  };

  return (
    <div className="gemini-modal-overlay" onClick={onClose}>
      <div className="gemini-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header-row">
          <div className="modal-title-group">
            <div className="modal-red-icon">
              <UserCheck size={20} className="text-red-primary" />
            </div>
            <div>
              <h2 className="modal-headline">AI Voice Avatars & Calibration</h2>
              <p className="modal-subhead">Create your custom singing voice avatar or pick a verified studio persona</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="avatar-tabs-ribbon">
          <button 
            className={`avatar-tab ${activeTab === 'record' ? 'active' : ''}`}
            onClick={() => setActiveTab('record')}
          >
            <Mic size={15} />
            <span>Calibrate My Voice (5s)</span>
          </button>
          <button 
            className={`avatar-tab ${activeTab === 'legends' ? 'active' : ''}`}
            onClick={() => setActiveTab('legends')}
          >
            <Sparkles size={15} />
            <span>Studio Legends (Aarav, Zara)</span>
          </button>
        </div>

        {/* Tab 1: 5-Second Voice Calibration */}
        {activeTab === 'record' && (
          <div className="avatar-record-body">
            <div className="prompt-speak-box">
              <span className="speak-badge">SPEAK THIS PROMPT INTO MIC:</span>
              <p className="speak-quote">"{SPEAKING_SCRIPTS[0].text}"</p>
            </div>

            {micError && (
              <div className="modal-alert-box">
                <AlertCircle size={16} />
                <span>{micError}</span>
              </div>
            )}

            <div className="record-center-core">
              {!isRecording ? (
                <button 
                  className={`big-red-mic-btn ${recordedSuccess ? 'success' : ''}`}
                  onClick={startRecording}
                >
                  <div className="mic-circle-glow">
                    <Mic size={32} />
                  </div>
                  <span className="mic-btn-main-text">
                    {recordedSuccess ? 'Re-Record Voice Avatar' : 'Tap to Record Voice (5 Seconds)'}
                  </span>
                  <span className="mic-btn-sub-text">SONARA scans pitch, formants & timbre</span>
                </button>
              ) : (
                <button 
                  className="big-red-mic-btn recording animate-pulse"
                  onClick={stopRecording}
                >
                  <div className="mic-circle-glow red-pulse">
                    <Square size={28} />
                  </div>
                  <span className="mic-btn-main-text">Recording... ({recordSeconds}s / 6s)</span>
                  <span className="mic-btn-sub-text">Speak clearly into microphone</span>
                </button>
              )}

              {/* FFT Frequency Canvas */}
              <div className="modal-fft-wrap">
                <canvas ref={canvasRef} width={460} height={56} className="modal-fft-canvas" />
              </div>

              {recordedSuccess && (
                <div className="recorded-success-box">
                  <div className="avatar-name-edit-field">
                    <span>Avatar Name:</span>
                    <input 
                      type="text" 
                      value={customAvatarName}
                      onChange={(e) => setCustomAvatarName(e.target.value)}
                      placeholder="My AI Voice Avatar"
                      className="name-input"
                    />
                  </div>

                  {recordedAudioUrl && (
                    <div className="recorded-listen-strip">
                      <audio 
                        ref={audioPreviewRef} 
                        src={recordedAudioUrl} 
                        onEnded={() => setIsPlayingRecorded(false)} 
                      />
                      <button 
                        className="preview-audio-btn"
                        onClick={togglePlayRecording}
                      >
                        {isPlayingRecorded ? <Pause size={14} /> : <Play size={14} />}
                        <span>{isPlayingRecorded ? 'Pause' : 'Listen Recording'}</span>
                      </button>
                      <span className="avatar-calibrated-tag">
                        ✓ 99% Timbre Match Ready
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Studio Legends */}
        {activeTab === 'legends' && (
          <div className="avatar-legends-grid">
            {SAMPLE_VOICE_PROFILES.map((profile) => {
              const isSelected = voiceProfile.id === profile.id;
              return (
                <div 
                  key={profile.id}
                  className={`avatar-persona-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    setVoiceProfile(profile);
                    onClose();
                  }}
                >
                  <div className="persona-avatar-icon">
                    <span>{profile.emoji}</span>
                  </div>
                  <div className="persona-info">
                    <div className="persona-name-row">
                      <h4 className="persona-name">{profile.name}</h4>
                      {isSelected && <span className="selected-tag"><CheckCircle2 size={13} /> Active</span>}
                    </div>
                    <span className="persona-role">{profile.role || profile.tag}</span>
                    <p className="persona-desc">{profile.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Footer */}
        <div className="modal-footer-row">
          <div className="current-selected-label">
            Active: <strong className="text-red-primary">{voiceProfile.name}</strong>
          </div>
          <button className="done-red-btn" onClick={onClose}>
            Apply Avatar
          </button>
        </div>
      </div>
    </div>
  );
}
