import React, { useEffect } from 'react';
import { 
  SquarePen, 
  Search, 
  LayoutGrid, 
  Settings, 
  Sparkles, 
  X, 
  Music,
  MessageSquare
} from 'lucide-react';

export default function MobileDrawer({
  isOpen,
  onClose,
  onNewChat,
  onOpenSearch,
  onOpenLibrary,
  onOpenSettings,
  historySongs = [],
  onSelectSong
}) {
  // Lock body scroll and handle Escape key on phone / tablet
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="mobile-drawer-overlay animate-fadeIn" onClick={onClose}>
      <aside 
        className="mobile-drawer-panel animate-slideRight" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Row (Matches Image 2: Brand + Search + Close) */}
        <div className="drawer-header-row">
          <div 
            className="drawer-header-brand" 
            onClick={() => {
              onNewChat();
              onClose();
            }}
          >
            <div className="drawer-brand-emblem">
              <img 
                src="/sonara_emblem.jpg" 
                alt="SONARA" 
                className="drawer-brand-emblem-img" 
              />
            </div>
            <span className="drawer-brand-name">SONARA</span>
          </div>

          <div className="drawer-header-actions">
            {/* Search Icon Button */}
            <button 
              type="button" 
              className="drawer-action-btn"
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              title="Search chats & songs"
            >
              <Search size={18} />
            </button>

            {/* Close Drawer Button */}
            <button 
              type="button" 
              className="drawer-action-btn close-btn"
              onClick={onClose}
              title="Close menu"
            >
              <X size={19} />
            </button>
          </div>
        </div>

        {/* Navigation Action Items (Sonara Features Only) */}
        <div className="drawer-nav-group">
          {/* 1. New Song / Chat */}
          <button 
            type="button" 
            className="drawer-nav-item active"
            onClick={() => {
              onNewChat();
              onClose();
            }}
          >
            <SquarePen size={18} className="drawer-nav-icon" />
            <span className="drawer-nav-label">New song</span>
          </button>

          {/* 2. Library */}
          <button 
            type="button" 
            className="drawer-nav-item"
            onClick={() => {
              onClose();
              onOpenLibrary();
            }}
          >
            <LayoutGrid size={18} className="drawer-nav-icon" />
            <span className="drawer-nav-label">Library</span>
          </button>
        </div>

        {/* Recent Songs History Section (Real Sonara History) */}
        <div className="drawer-recents-section">
          <div className="drawer-recents-header">
            <span className="drawer-recents-title">Recent Songs</span>
            {historySongs && historySongs.length > 0 && (
              <span className="drawer-recents-badge">{historySongs.length}</span>
            )}
          </div>

          <div className="drawer-recents-list">
            {!historySongs || historySongs.length === 0 ? (
              <div className="drawer-empty-recents">
                <Music size={16} className="text-dim" />
                <span>No songs composed yet</span>
              </div>
            ) : (
              historySongs.slice(0, 10).map((song, idx) => (
                <div 
                  key={song.id || idx}
                  className="drawer-recent-item"
                  onClick={() => {
                    if (onSelectSong) onSelectSong(song);
                    onClose();
                  }}
                  title={song.title || song.prompt}
                >
                  <MessageSquare size={15} className="drawer-recent-bubble-icon" />
                  <span className="drawer-recent-item-title">
                    {song.title || song.prompt || 'Bollywood Melody'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bottom Profile & Settings Row (Matches Image 2 Bottom) */}
        <div className="drawer-footer-user-row">
          <div 
            className="drawer-user-info"
            onClick={() => {
              onClose();
              onOpenSettings();
            }}
            title="Account Profile"
          >
            <div className="drawer-user-avatar">
              <span className="drawer-user-initials">IK</span>
            </div>
            <div className="drawer-user-text">
              <span className="drawer-user-name">INDRAJIT KUMAR</span>
              <span className="drawer-user-tier">Sonara Creator • Pro</span>
            </div>
          </div>

          {/* Settings Gear Button */}
          <button 
            type="button" 
            className="drawer-settings-gear-btn"
            onClick={() => {
              onClose();
              onOpenSettings();
            }}
            title="Studio Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </aside>
    </div>
  );
}
