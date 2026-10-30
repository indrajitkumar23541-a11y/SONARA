import React from 'react';
import { X, Play, Music, Sparkles, Download } from 'lucide-react';

export default function HistoryDrawer({ 
  isOpen, 
  onClose, 
  historySongs, 
  onSelectSong 
}) {
  if (!isOpen) return null;

  return (
    <div className="gemini-modal-overlay" onClick={onClose}>
      <div className="gemini-drawer-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-row">
          <div className="modal-title-group">
            <h2 className="modal-headline">Library</h2>
            <p className="modal-subhead">Your synthesized songs, master tracks & creations</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="history-songs-list">
          {historySongs.length === 0 ? (
            <div className="empty-history-note">
              <Music size={32} className="text-muted" />
              <p>No songs generated yet. Prompt Sonara to create your first melody!</p>
            </div>
          ) : (
            historySongs.map((song, i) => (
              <div 
                key={song.id || i} 
                className="history-song-item"
                onClick={() => {
                  onSelectSong(song);
                  onClose();
                }}
              >
                <div className="song-play-mini">
                  <Play size={16} className="text-red-primary" />
                </div>
                <div className="song-details">
                  <h4 className="song-title">{song.title || 'Original AI Bollywood Track'}</h4>
                  <span className="song-meta">
                    {song.genre || 'Bollywood'} • {song.voice_name || 'Aarav'} • {song.duration || 45}s
                  </span>
                </div>
                <button 
                  className="song-dl-mini-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    const a = document.createElement('a');
                    a.href = song.master_url;
                    a.download = `SONARA_${song.title || 'song'}.mp3`;
                    a.click();
                  }}
                  title="Download MP3"
                >
                  <Download size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
