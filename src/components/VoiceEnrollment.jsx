import React, { useState, useEffect, useRef } from 'react';
import { SAMPLE_VOICE_PROFILES, SPEAKING_SCRIPTS } from '../utils/constants';
import { sonaraAudio } from '../utils/audioEngine';
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  Activity,
  Layers,
  Wand2,
  UserCheck,
  Disc,
  Radio,
  Sliders
} from 'lucide-react';

export default function VoiceEnrollment({
  voiceProfile,
  setVoiceProfile,
  onProceedToLyrics,
  isProMode
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const [micError, setMicError] = useState(null);
  const [recordedSuccess, setRecordedSuccess] = useState(false);
  const [customAvatarName, setCustomAvatarName] = useState('Mera AI Voice Avatar');
  const [activeTab, setActiveTab] = useState('create'); // 'create' | 'studio'

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
      : new Uint8Array(64).map((_, i) => Math.sin(Date.now() / 250 + i) * 16 + 22);

    ctx.clearRect(0, 0, width, height);

    const barWidth = (width / data.length) * 1.5;
    let x = 0;

    for (let i = 0; i < data.length; i++) {
      const barHeight = (data[i] / 255) * height * 0.85;
      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, '#00f2fe');
      gradient.addColorStop(0.5, '#a855f7');
      gradient.addColorStop(1, '#ec4899');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, height - barHeight - 4, barWidth - 2, barHeight + 4, 3);
      ctx.fill();

      x += barWidth;
    }

    animationFrameRef.current = requestAnimationFrame(renderVisualizer);
  };

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(renderVisualizer);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

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
      setMicError('Microphone access allow karein taaki aawaz scan ho sake.');
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
      setMicError('Audio save karne me samasya aayi.');
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

  const handleNameChange = (e) => {
    const val = e.target.value;
    setCustomAvatarName(val);
    if (voiceProfile.id === 'profile_user') {
      setVoiceProfile(prev => ({ ...prev, name: val || 'Mera AI Voice Avatar' }));
    }
  };

  return (
    <div className="studio-section-container">
      {/* Top Breadcrumb & Section Header */}
      <div className="studio-hero-card">
        <div className="studio-hero-badge-row">
          <span className="step-pill-indicator">
            <span className="pulse-dot-cyan"></span>
            STEP 01 / 04 • AI VOICE AVATAR CALIBRATION
          </span>
          <span className="studio-hero-meta">
            Active Avatar: <strong className="text-cyan">{voiceProfile.name}</strong>
          </span>
        </div>

        <div className="studio-hero-text">
          <h1 className="studio-hero-heading">
            Create Your Voice Avatar or Pick a Legend
          </h1>
          <p className="studio-hero-desc">
            Just like video AI creates an avatar from your face, SONARA creates your <strong>AI Singing Avatar</strong> from 5 seconds of your voice. Then, whenever you give a prompt and lyrics, your avatar will sing the song in your unique tone!
          </p>
        </div>
      </div>

      {micError && (
        <div className="mic-alert-banner">
          <AlertCircle size={18} className="text-rose" />
          <span>{micError}</span>
        </div>
      )}

      {/* Mode Segmented Switch: Create My Avatar vs Choose Studio Legend */}
      <div className="avatar-segment-wrapper">
        <div className="avatar-segment-tabs">
          <button
            type="button"
            className={`segment-tab-btn ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            <Mic size={16} />
            <span>Create My Voice Avatar (5s Mic)</span>
          </button>
          <button
            type="button"
            className={`segment-tab-btn ${activeTab === 'studio' ? 'active' : ''}`}
            onClick={() => setActiveTab('studio')}
          >
            <Sparkles size={16} />
            <span>Choose Studio Legend Avatars</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CREATE MY VOICE AVATAR (Front and Center) */}
      {activeTab === 'create' && (
        <div className="glass-panel voice-recorder-pod avatar-maker-core">
          <div className="pod-header">
            <div className="flex-center-gap">
              <div className="avatar-icon-badge">
                <Mic size={20} className="text-cyan" />
              </div>
              <div>
                <h3 className="card-heading-clean">5-Second Neural Voice Avatar Setup</h3>
                <span className="avatar-subtitle-note">Speak naturally into your microphone to calibrate your voice timbre</span>
              </div>
            </div>

            {recordedSuccess && (
              <span className="badge badge-emerald animate-pulse-subtle">
                <CheckCircle2 size={13} /> Voice Avatar Fingerprint Ready!
              </span>
            )}
          </div>

          {/* Reading Script for User */}
          <div className="voice-script-box">
            <span className="script-badge">PROMPT TO SPEAK:</span>
            <p className="script-text">
              "{SPEAKING_SCRIPTS[0].text}"
            </p>
          </div>

          <div className="recorder-hardware-core">
            {/* Recording Trigger Button */}
            {!isRecording ? (
              <button
                type="button"
                className={`hardware-mic-btn ${recordedSuccess ? 'success' : ''}`}
                onClick={startRecording}
                title="Microphone dabakar 5 second boliye"
              >
                <div className="mic-btn-icon-circle">
                  <Mic size={36} />
                </div>
                <span className="mic-btn-title">
                  {recordedSuccess ? '🔄 Re-Calibrate Voice Avatar' : '🎙️ Tap to Record Voice (5 Seconds)'}
                </span>
                <span className="mic-btn-hint">
                  {recordedSuccess ? 'Avatar updated with latest sample' : 'Click to start 5-second countdown'}
                </span>
              </button>
            ) : (
              <button
                type="button"
                className="hardware-mic-btn recording animate-pulse-glow"
                onClick={stopRecording}
                title="Tap to stop"
              >
                <div className="mic-btn-icon-circle">
                  <Square size={32} />
                </div>
                <span className="mic-btn-title">
                  Listening... ({recordSeconds}s / 6s)
                </span>
                <span className="mic-btn-hint text-rose">
                  Keep speaking clearly into your mic
                </span>
              </button>
            )}

            {/* Live FFT Canvas */}
            <div className="fft-canvas-container">
              <canvas
                ref={canvasRef}
                width={520}
                height={65}
                className="fft-canvas"
              />
            </div>

            {/* Post-Recording Telemetry & Avatar Profile Setup */}
            {recordedSuccess && (
              <div className="avatar-calibration-details">
                <div className="avatar-name-input-row">
                  <label className="avatar-input-label">Avatar Name:</label>
                  <input
                    type="text"
                    value={customAvatarName}
                    onChange={handleNameChange}
                    className="avatar-name-field"
                    placeholder="E.g. Rahul's Voice Avatar"
                  />
                </div>

                <div className="avatar-metrics-grid">
                  <div className="metric-cell">
                    <span className="metric-label">Pitch Range</span>
                    <span className="metric-val text-cyan">A2 - E4 (Warm Baritone)</span>
                  </div>
                  <div className="metric-cell">
                    <span className="metric-label">Resonance Match</span>
                    <span className="metric-val text-emerald">99% High-Fidelity</span>
                  </div>
                  <div className="metric-cell">
                    <span className="metric-label">Timbre Character</span>
                    <span className="metric-val text-pink">Natural Indian Singing</span>
                  </div>
                </div>

                {/* Recorded Playback Preview */}
                {recordedAudioUrl && (
                  <div className="recorded-audio-preview-strip">
                    <audio
                      ref={audioPreviewRef}
                      src={recordedAudioUrl}
                      onEnded={() => setIsPlayingRecorded(false)}
                    />
                    <button
                      type="button"
                      className="preview-audio-play-btn"
                      onClick={togglePlayRecording}
                    >
                      {isPlayingRecorded ? <Pause size={15} /> : <Play size={15} />}
                      <span>{isPlayingRecorded ? 'Pause Preview' : 'Listen Recorded Sample'}</span>
                    </button>
                    <span className="audio-ready-label">
                      ✓ Ready to sing any prompt in Step 2!
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2 or All Avatars Deck (Pick from Verified Studio Avatars) */}
      <div className="all-avatars-section">
        <div className="section-subhead-row">
          <span className="section-eyebrow">
            <UserCheck size={14} className="text-cyan" /> ALL AVAILABLE VOICE AVATARS
          </span>
          <span className="section-hint">Select the active avatar that will sing your song</span>
        </div>

        <div className="singers-deck-grid">
          {SAMPLE_VOICE_PROFILES.map((profile) => {
            const isSelected = voiceProfile.id === profile.id;
            const displayName = profile.id === 'profile_user' ? (customAvatarName || profile.name) : profile.name;

            return (
              <div
                key={profile.id}
                className={`luxury-singer-card ${isSelected ? 'active' : ''}`}
                onClick={() => setVoiceProfile({ ...profile, name: displayName })}
              >
                <div className="singer-card-glow" style={{ background: profile.avatarGradiant }}></div>
                
                <div className="singer-card-top-row">
                  <div className="singer-avatar-halo" style={{ background: profile.avatarGradiant }}>
                    <span className="singer-avatar-emoji">{profile.emoji}</span>
                  </div>
                  {isSelected && (
                    <span className="active-avatar-pill">
                      <CheckCircle2 size={12} /> Active Avatar
                    </span>
                  )}
                </div>

                <div className="singer-card-content">
                  <div className="singer-card-header">
                    <h3 className="singer-name">{displayName}</h3>
                    <span className="singer-tag-pill">{profile.tag}</span>
                  </div>
                  <span className="singer-role-text">{profile.role}</span>
                  <p className="singer-desc">{profile.desc}</p>

                  {/* Vocal Stats */}
                  {profile.vocalStats && (
                    <div className="singer-specs-strip">
                      <span className="spec-item">Range: {profile.vocalStats.pitchRange.split('(')[0]}</span>
                      <span className="spec-item text-cyan">{profile.vocalStats.warmth}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Sticky-Style Action Deck */}
      <div className="action-footer-deck">
        <div className="selected-avatar-footer-pill">
          <span>Singing Voice Avatar:</span>
          <strong className="text-cyan">{voiceProfile.name}</strong>
        </div>

        <button
          id="btn-proceed-to-lyrics"
          className="btn-luxury-primary-lg animate-pulse-subtle"
          onClick={onProceedToLyrics}
        >
          <Sparkles size={18} className="text-amber" />
          <span>Lock Avatar & Enter Prompt & Lyrics</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
