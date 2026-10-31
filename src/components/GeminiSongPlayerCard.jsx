import React, { useState, useEffect, useRef } from 'react';
import { sonaraAudio } from '../utils/audioEngine';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Download, 
  RotateCcw, 
  Sparkles, 
  Music, 
  Mic, 
  Layers, 
  Share2, 
  Check 
} from 'lucide-react';

export default function GeminiSongPlayerCard({ 
  songData, 
  lyrics, 
  voiceProfile, 
  selectedGenre,
  onReset 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(songData?.duration || 45);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [vocalVolume, setVocalVolume] = useState(1.0);
  const [musicVolume, setMusicVolume] = useState(0.85);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

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

  useEffect(() => {
    if (songData) {
      const dur = songData.duration || 45;
      setDuration(dur);
      const masterUrl = songData.master_url || songData.vocal_url || '/audio/master_bollywood_1793270569516.mp3';
      sonaraAudio.setRealAudioUrls(songData.vocal_url, songData.music_url, masterUrl, dur);

      // Instant online auto-play when song generation completes!
      const timer = setTimeout(() => {
        sonaraAudio.startStemPlayback(vocalVolume, musicVolume, (curr, total) => {
          setCurrentTime(curr);
          if (curr >= total) setIsPlaying(false);
        });
        setIsPlaying(true);
      }, 350);

      return () => {
        clearTimeout(timer);
        sonaraAudio.stopStemPlayback();
      };
    }
    return () => {
      sonaraAudio.stopStemPlayback();
    };
  }, [songData]);

  const togglePlay = () => {
    if (isPlaying) {
      sonaraAudio.stopStemPlayback();
      setIsPlaying(false);
    } else {
      sonaraAudio.startStemPlayback(vocalVolume, musicVolume, (curr, dur) => {
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

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = ratio * duration;
    setCurrentTime(newTime);
    sonaraAudio.seek(newTime);
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    const targetUrl = songData?.master_url || songData?.vocal_url || '/audio/master_bollywood_1793270569516.mp3';
    const a = document.createElement('a');
    a.href = targetUrl;
    a.download = `SONARA_${songData?.genre || 'bollywood'}_master.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleShare = () => {
    setCopiedLink(true);
    navigator.clipboard?.writeText(window.location.href);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formatTime = (timeInSec) => {
    const min = Math.floor(timeInSec / 60);
    const sec = Math.floor(timeInSec % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="gemini-song-card">
      {/* Top Banner Row */}
      <div className="song-card-header-row">
        <div className="song-badge-ribbon">
          <span className="red-pill-tag">
            <Sparkles size={12} className="text-red-primary" /> Master Audio
          </span>
          <span className="sub-badge">{songData?.musical_scale || 'E Minor'} Raag</span>
          <span className="sub-badge">🎙️ Voice: {voiceProfile?.name || 'Aarav'}</span>
        </div>

        <button className="reset-inline-btn" onClick={onReset} title="Compose Another Song">
          <RotateCcw size={14} />
          <span>New Song</span>
        </button>
      </div>

      {/* Main Track Presentation */}
      <div className="track-layout-grid">
        {/* Left: 3D Red Vinyl Disc */}
        <div className={`red-vinyl-disc ${isPlaying ? 'spinning' : ''}`} onClick={togglePlay}>
          <div className="vinyl-groove-ring"></div>
          <div className="vinyl-center-red-label">
            <img 
              src="/sonara_emblem.jpg" 
              alt="SONARA" 
              className="vinyl-center-emblem"
            />
          </div>
        </div>

        {/* Right: Metadata & Actions */}
        <div className="track-info-column">
          <h3 className="track-song-title">
            {lyrics.split('\n')[0].replace(/[\[\]]/g, '') || 'My AI Bollywood Song'}
          </h3>
          <p className="track-artist-sub">
            Vocals by <strong className="text-red-primary">{voiceProfile?.name || 'Aarav'}</strong> • Produced with Indian Acoustic Orchestration & -14 LUFS Limiter
          </p>

          {/* Quick Specs */}
          <div className="track-specs-row">
            <span className="spec-tag">Acoustic Guitar</span>
            <span className="spec-tag">Bansuri Flute</span>
            <span className="spec-tag">Tabla Taal</span>
            <span className="spec-tag highlight-red">Broadcast Polish</span>
          </div>
        </div>
      </div>

      {/* Karaoke Synchronized Lyrics Display */}
      <div className="gemini-karaoke-box">
        <div className="karaoke-title-bar">
          <span className="karaoke-badge">
            <Music size={13} className="text-red-primary" /> Synced Karaoke Lyrics
          </span>
          <span className="karaoke-sub-note">Live phrasing highlights in red</span>
        </div>

        <div className="karaoke-lines-scroll">
          {displayLines.map((line, idx) => {
            const isActive = idx === currentLineIndex && isPlaying;
            return (
              <p
                key={idx}
                className={`karaoke-line ${isActive ? 'active-singing-red' : ''}`}
              >
                {isActive && <span className="red-arrow-indicator">▶</span>}
                {line}
              </p>
            );
          })}
        </div>
      </div>

      {/* Master Transport Console */}
      <div className="red-transport-console">
        {/* Scrubber Seekbar */}
        <div className="scrubber-bar-container">
          <span className="time-code">{formatTime(currentTime)}</span>
          <div className="scrubber-track" onClick={handleSeek}>
            <div 
              className="scrubber-fill-red" 
              style={{ width: `${(currentTime / Math.max(1, duration)) * 100}%` }}
            >
              <span className="scrubber-glow-thumb"></span>
            </div>
          </div>
          <span className="time-code">{formatTime(duration)}</span>
        </div>

        {/* Transport Buttons Row */}
        <div className="transport-controls-row">
          {/* Main Glowing Play Button */}
          <button 
            id="gemini-main-play-btn"
            className={`gemini-play-btn ${isPlaying ? 'playing' : ''}`}
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play Song Online'}
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: '3px' }} />}
          </button>

          {/* Download & Share Actions */}
          <div className="transport-right-actions">
            <button 
              className="download-master-btn" 
              onClick={handleDownload}
            >
              <Download size={16} />
              <span>{downloadSuccess ? '✓ Downloading MP3' : 'Download Master (MP3)'}</span>
            </button>

            <button 
              className="share-clean-btn" 
              onClick={handleShare}
              title="Copy Song Link"
            >
              {copiedLink ? <Check size={16} className="text-emerald" /> : <Share2 size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
