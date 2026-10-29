import React, { useState, useEffect, useRef } from 'react';
import { sonaraAudio } from '../utils/audioEngine';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Download, 
  Share2, 
  Disc, 
  Sparkles, 
  Mic2, 
  Music, 
  Layers, 
  Check, 
  Award,
  Radio,
  SlidersHorizontal
} from 'lucide-react';

export default function StudioPlayer({
  lyrics,
  selectedGenre,
  voiceProfile,
  songData,
  onResetSong,
  isProMode
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(songData?.duration || 45);
  const [vocalVolume, setVocalVolume] = useState(1.0);
  const [musicVolume, setMusicVolume] = useState(0.85);
  const [isVocalMuted, setIsVocalMuted] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  const displayLines = songData?.lines?.length
    ? songData.lines.map((l) => l.text)
    : lyrics
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0 && !l.startsWith('['));

  const currentLineIndex = Math.min(
    displayLines.length - 1,
    Math.floor((currentTime / Math.max(1, duration)) * displayLines.length)
  );

  const renderVisualizer = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const data = isPlaying
      ? sonaraAudio.getPlaybackFrequencies()
      : new Uint8Array(32).fill(6);

    ctx.clearRect(0, 0, width, height);

    const barWidth = width / data.length;
    let x = 0;

    for (let i = 0; i < data.length; i++) {
      const barHeight = isPlaying
        ? Math.max(8, (data[i] / 255) * height * 0.95)
        : 6;

      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, '#00f2fe');
      gradient.addColorStop(0.5, '#a855f7');
      gradient.addColorStop(1, '#ec4899');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, height - barHeight, barWidth - 3, barHeight, 4);
      ctx.fill();

      x += barWidth;
    }

    animationFrameRef.current = requestAnimationFrame(renderVisualizer);
  };

  useEffect(() => {
    if (songData) {
      const dur = songData.duration || 45;
      setDuration(dur);
      const masterUrl = songData.master_url || songData.vocal_url || '/audio/master_bollywood_1793270569516.mp3';
      const vocalUrl = songData.vocal_url;
      const musicUrl = songData.music_url || '/audio/backing_bollywood.mp3';
      sonaraAudio.setRealAudioUrls(vocalUrl, musicUrl, masterUrl, dur);
    }
    animationFrameRef.current = requestAnimationFrame(renderVisualizer);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      sonaraAudio.stopStemPlayback();
    };
  }, [songData]);

  const togglePlay = () => {
    if (isPlaying) {
      sonaraAudio.stopStemPlayback();
      setIsPlaying(false);
    } else {
      const vVol = isVocalMuted ? 0 : vocalVolume;
      const mVol = isMusicMuted ? 0 : musicVolume;

      sonaraAudio.startStemPlayback(vVol, mVol, (curr, dur) => {
        setCurrentTime(curr);
        setDuration(dur);
        if (curr >= dur) {
          setIsPlaying(false);
          setCurrentTime(0);
        }
      });
      setIsPlaying(true);
    }
  };

  const handleVocalVolume = (newVol) => {
    setVocalVolume(newVol);
    if (!isVocalMuted) {
      sonaraAudio.setVocalVolume(newVol);
    }
  };

  const handleMusicVolume = (newVol) => {
    setMusicVolume(newVol);
    if (!isMusicMuted) {
      sonaraAudio.setMusicVolume(newVol);
    }
  };

  const toggleVocalMute = () => {
    const nextMute = !isVocalMuted;
    setIsVocalMuted(nextMute);
    sonaraAudio.setVocalVolume(nextMute ? 0 : vocalVolume);
  };

  const toggleMusicMute = () => {
    const nextMute = !isMusicMuted;
    setIsMusicMuted(nextMute);
    sonaraAudio.setMusicVolume(nextMute ? 0 : musicVolume);
  };

  const handleDownload = (stemType = 'master') => {
    setDownloadSuccess(true);
    let targetUrl = songData?.master_url || songData?.vocal_url || '/audio/master_bollywood_1793270569516.mp3';
    if (stemType === 'vocals') targetUrl = songData?.vocal_url || targetUrl;
    if (stemType === 'instrumental') targetUrl = songData?.music_url || '/audio/backing_bollywood.mp3';

    if (targetUrl) {
      const a = document.createElement('a');
      a.href = targetUrl;
      a.download = `SONARA_${selectedGenre?.id || 'bollywood'}_${stemType}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleShare = () => {
    setCopiedLink(true);
    navigator.clipboard?.writeText(window.location.href);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const formatTime = (timeInSec) => {
    const min = Math.floor(timeInSec / 60);
    const sec = Math.floor(timeInSec % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="studio-section-container">
      {/* Top Breadcrumb & Section Header */}
      <div className="studio-hero-card">
        <div className="studio-hero-badge-row">
          <span className="step-pill-indicator">
            <span className="pulse-dot-cyan"></span>
            STEP 04 / 04 • COMMERCIAL MASTER CONSOLE
          </span>
          <span className="badge badge-emerald">
            <Award size={12} /> -14 LUFS Broadcast Polish
          </span>
        </div>

        <div className="studio-hero-text">
          <h1 className="studio-hero-heading">
            Your Commercial Master is Ready
          </h1>
          <p className="studio-hero-desc">
            Produced in {songData?.musical_scale || selectedGenre.defaultScale || 'E Minor'} scale with double-tracked vocal harmonies, Indian acoustic orchestration, and broadcast loudness.
          </p>
        </div>
      </div>

      {/* Main Dual Grid */}
      <div className="studio-dual-grid">
        {/* Left Column: Vinyl Player & Teleprompter Karaoke */}
        <div className="glass-panel player-main-panel">
          {/* Track Header Card */}
          <div className="track-hero-card">
            <div className={`luxury-vinyl-box ${isPlaying ? 'spinning' : ''}`}>
              <div className="vinyl-reflection-grooves"></div>
              <div className="vinyl-center-disc">
                <img 
                  src="/sonara_emblem.jpg" 
                  alt="SONARA" 
                  className="vinyl-emblem-img"
                />
              </div>
            </div>

            <div className="track-hero-meta">
              <div className="meta-pills-row">
                <span className="badge badge-purple">{selectedGenre.emoji || '🎵'} {selectedGenre.name}</span>
                <span className="badge badge-pink">{songData?.musical_scale || 'E Minor'} Scale</span>
                <span className="badge badge-cyan">🎙️ Voice Avatar: {voiceProfile.name}</span>
              </div>

              <h2 className="track-master-title">
                {lyrics.split('\n')[0] || 'My Original AI Song'}
              </h2>

              <p className="track-master-sub">
                Lead Vocals by <strong className="text-cyan">{voiceProfile.name}</strong> • {voiceProfile.role || 'AI Voice Avatar'} • 102 BPM
              </p>

              <div className="master-specs-row">
                <span className="spec-badge">Acoustic Guitar</span>
                <span className="spec-badge">Bansuri Flute</span>
                <span className="spec-badge">Tabla Taal</span>
                <span className="spec-badge text-emerald">Radio Polish</span>
              </div>
            </div>
          </div>

          {/* Real-time Spectrum Canvas */}
          <div className="spectrum-canvas-wrapper">
            <canvas
              ref={canvasRef}
              width={600}
              height={85}
              className="spectrum-canvas"
            ></canvas>
          </div>

          {/* Karaoke Teleprompter Lyrics */}
          <div className="teleprompter-karaoke-box">
            <div className="teleprompter-header">
              <span className="teleprompter-badge">
                <Sparkles size={14} className="text-cyan" /> Synced Karaoke Lyrics
              </span>
              <span className="teleprompter-tip">Words highlight with professional vocal phrasing</span>
            </div>

            <div className="teleprompter-scroll">
              {displayLines.map((line, idx) => {
                const isActive = idx === currentLineIndex && isPlaying;
                const isPast = idx < currentLineIndex && isPlaying;

                return (
                  <p
                    key={idx}
                    className={`teleprompter-line ${
                      isActive ? 'active-singing' : ''
                    } ${isPast ? 'past' : ''}`}
                  >
                    {isActive && <span className="singing-arrow">▶</span>}
                    {line}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Precision Transport Controls */}
          <div className="transport-master-deck">
            {/* Scrubber Seekbar */}
            <div className="scrubber-bar-row">
              <span className="scrubber-time-code">{formatTime(currentTime)}</span>
              <div
                className="scrubber-track-line"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                  const newTime = ratio * duration;
                  setCurrentTime(newTime);
                  sonaraAudio.seek(newTime);
                }}
              >
                <div
                  className="scrubber-progress-fill"
                  style={{ width: `${(currentTime / Math.max(1, duration)) * 100}%` }}
                >
                  <span className="scrubber-thumb-glow"></span>
                </div>
              </div>
              <span className="scrubber-time-code">{formatTime(duration)}</span>
            </div>

            {/* Transport Buttons & Quick Volume */}
            <div className="transport-actions-row">
              <button
                id="btn-play-song"
                className={`luxury-play-btn ${isPlaying ? 'playing' : ''}`}
                onClick={togglePlay}
                title={isPlaying ? 'Pause Song' : 'Play Song'}
              >
                {isPlaying ? <Pause size={34} /> : <Play size={34} style={{ marginLeft: '3px' }} />}
              </button>

              <div className="transport-audio-pill">
                <button
                  type="button"
                  className="audio-pill-mute-btn"
                  onClick={toggleMusicMute}
                  title={isMusicMuted ? 'Unmute' : 'Mute'}
                >
                  {isMusicMuted ? <VolumeX size={18} className="text-rose" /> : <Volume2 size={18} className="text-cyan" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1.5"
                  step="0.05"
                  value={isMusicMuted ? 0 : musicVolume}
                  onChange={(e) => handleMusicVolume(Number(e.target.value))}
                  className="stem-slider"
                  style={{ width: '100px' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Master Export Deck & Multi-Track Stems */}
        <div className="export-and-stems-sidebar">
          {/* Master Export Card */}
          <div className="glass-panel master-export-card">
            <div className="sidebar-card-header">
              <div className="flex-center-gap">
                <Sparkles size={16} className="text-amber" />
                <span className="card-heading-clean">Export Studio Master</span>
              </div>
              <span className="badge badge-emerald">320kbps MP3</span>
            </div>

            <p className="sidebar-explainer">
              Master audio rendered at -14 LUFS with stereo double-tracking. Ready for Spotify, YouTube, or direct sharing.
            </p>

            {/* Primary Download Button */}
            <button
              id="btn-download-song"
              className="btn-luxury-green full-width"
              onClick={() => handleDownload('master')}
            >
              <Download size={20} />
              <span>{downloadSuccess ? '✓ Download Started!' : 'Download Master Song (MP3)'}</span>
            </button>

            {/* Sub Actions */}
            <div className="export-sub-buttons">
              <button
                id="btn-create-new-song"
                className="btn-secondary-clean full-width"
                onClick={onResetSong}
              >
                <RotateCcw size={16} />
                <span>Create Another Song</span>
              </button>

              <button
                className="btn-secondary-clean full-width"
                onClick={handleShare}
              >
                {copiedLink ? <Check size={16} className="text-emerald" /> : <Share2 size={16} />}
                <span>{copiedLink ? 'Link Copied!' : 'Share Track'}</span>
              </button>
            </div>
          </div>

          {/* Multi-Track Stem Console (Demucs v4 Dual Bus) */}
          <div className="glass-panel stems-mixer-card">
            <div className="sidebar-card-header">
              <div className="flex-center-gap">
                <Layers size={16} className="text-cyan" />
                <span className="card-heading-clean">Multi-Track Stem Console</span>
              </div>
              <span className="badge badge-cyan">Demucs v4</span>
            </div>

            <p className="sidebar-explainer">
              Independently adjust the lead vocals and acoustic accompaniment balance.
            </p>

            {/* Stem Channel 1: Vocals */}
            <div className="stem-channel-box vocal">
              <div className="channel-top">
                <div className="flex-center-gap">
                  <Mic2 size={15} className="text-cyan" />
                  <span className="channel-title">Singer Lead Vocals</span>
                </div>
                <button
                  type="button"
                  className={`channel-mute-badge ${isVocalMuted ? 'muted' : ''}`}
                  onClick={toggleVocalMute}
                >
                  {isVocalMuted ? 'MUTED' : `${Math.round(vocalVolume * 100)}%`}
                </button>
              </div>
              <input
                type="range"
                min="0"
                max="1.5"
                step="0.05"
                value={isVocalMuted ? 0 : vocalVolume}
                onChange={(e) => handleVocalVolume(Number(e.target.value))}
                className="stem-slider vocal-slider"
              />
            </div>

            {/* Stem Channel 2: Instruments */}
            <div className="stem-channel-box music" style={{ marginTop: '0.85rem' }}>
              <div className="channel-top">
                <div className="flex-center-gap">
                  <Music size={15} className="text-pink" />
                  <span className="channel-title">Acoustic Instrumental</span>
                </div>
                <button
                  type="button"
                  className={`channel-mute-badge ${isMusicMuted ? 'muted' : ''}`}
                  onClick={toggleMusicMute}
                >
                  {isMusicMuted ? 'MUTED' : `${Math.round(musicVolume * 100)}%`}
                </button>
              </div>
              <input
                type="range"
                min="0"
                max="1.5"
                step="0.05"
                value={isMusicMuted ? 0 : musicVolume}
                onChange={(e) => handleMusicVolume(Number(e.target.value))}
                className="stem-slider music-slider"
              />
            </div>

            {/* Isolated Stem Downloads */}
            <div className="isolated-downloads-row" style={{ marginTop: '1rem' }}>
              <button
                type="button"
                className="isolated-dl-chip"
                onClick={() => handleDownload('vocals')}
              >
                <Download size={12} /> Isolated Vocals
              </button>
              <button
                type="button"
                className="isolated-dl-chip"
                onClick={() => handleDownload('instrumental')}
              >
                <Download size={12} /> Instrumental Only
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
