import React, { useState, useRef, useEffect } from 'react';
import { 
  Paperclip, 
  FileText, 
  Music, 
  Mic, 
  ChevronRight, 
  Sparkles,
  UploadCloud
} from 'lucide-react';

export default function GeminiToolsMenu({
  isOpen,
  onClose,
  onAudioSelected,
  onLyricsSelected,
  onGenreSelected,
  onOpenAvatarModal,
  direction = 'bottom' // 'bottom' for hero capsule, 'top' for followup capsule
}) {
  const [showGenreSubmenu, setShowGenreSubmenu] = useState(false);
  const audioInputRef = useRef(null);
  const lyricsInputRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAudioFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onAudioSelected(file);
      onClose();
    }
    e.target.value = '';
  };

  const handleLyricsFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result || '';
        onLyricsSelected(file.name, text);
        onClose();
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  };

  return (
    <div 
      ref={menuRef}
      className={`gemini-tools-menu ${direction === 'top' ? 'direction-top' : 'direction-bottom'} animate-fadeIn`}
    >
      {/* Hidden Native File Inputs */}
      <input 
        type="file" 
        ref={audioInputRef} 
        style={{ display: 'none' }} 
        accept="audio/*" 
        onChange={handleAudioFileChange} 
      />
      <input 
        type="file" 
        ref={lyricsInputRef} 
        style={{ display: 'none' }} 
        accept=".txt,.lrc,.md" 
        onChange={handleLyricsFileChange} 
      />

      {/* 1. Upload Audio / Vocals */}
      <button 
        type="button" 
        className="tools-menu-item"
        onClick={() => audioInputRef.current?.click()}
        title="Upload your vocal audio or melody stem"
      >
        <div className="menu-item-icon">
          <Paperclip size={18} />
        </div>
        <div className="menu-item-content">
          <span className="menu-item-title">Upload Audio / Vocals</span>
          <span className="menu-item-desc">MP3, WAV vocal track or recording</span>
        </div>
      </button>

      {/* 2. Upload Lyrics File */}
      <button 
        type="button" 
        className="tools-menu-item"
        onClick={() => lyricsInputRef.current?.click()}
        title="Upload lyrics file (.txt, .lrc)"
      >
        <div className="menu-item-icon">
          <FileText size={18} />
        </div>
        <div className="menu-item-content">
          <span className="menu-item-title">Upload Lyrics File</span>
          <span className="menu-item-desc">.txt or .lrc synchronized lyrics</span>
        </div>
      </button>

      <div className="tools-menu-divider" />

      {/* 3. Create Bollywood / Classical / Pop Track */}
      <div className="tools-menu-group">
        <button 
          type="button" 
          className={`tools-menu-item with-submenu ${showGenreSubmenu ? 'active' : ''}`}
          onClick={() => setShowGenreSubmenu(!showGenreSubmenu)}
          title="Choose Bollywood, Classical, or Pop track preset"
        >
          <div className="menu-item-icon text-red">
            <Music size={18} />
          </div>
          <div className="menu-item-content">
            <span className="menu-item-title">Create Bollywood / Classical / Pop Track</span>
            <span className="menu-item-desc">Pick genre melody preset</span>
          </div>
          <ChevronRight 
            size={16} 
            className={`chevron-indicator ${showGenreSubmenu ? 'rotated' : ''}`} 
          />
        </button>

        {/* Expandable Genre Preset Sub-items */}
        {showGenreSubmenu && (
          <div className="genre-subitems-container animate-fadeIn">
            <button 
              type="button" 
              className="genre-subitem"
              onClick={() => {
                onGenreSelected('bollywood');
                onClose();
              }}
            >
              <span className="genre-dot bollywood" />
              <div className="genre-subitem-text">
                <strong>Bollywood Track</strong>
                <span>Soulful romantic melody & acoustic strings</span>
              </div>
            </button>

            <button 
              type="button" 
              className="genre-subitem"
              onClick={() => {
                onGenreSelected('classical');
                onClose();
              }}
            >
              <span className="genre-dot classical" />
              <div className="genre-subitem-text">
                <strong>Classical / Sufi Track</strong>
                <span>Raag Yaman bandish, harmonium & tabla</span>
              </div>
            </button>

            <button 
              type="button" 
              className="genre-subitem"
              onClick={() => {
                onGenreSelected('pop');
                onClose();
              }}
            >
              <span className="genre-dot pop" />
              <div className="genre-subitem-text">
                <strong>Modern Pop / EDM Track</strong>
                <span>Upbeat punchy 808 bass & synth groove</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
