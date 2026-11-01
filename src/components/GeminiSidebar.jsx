import React from 'react';
import { 
  SquarePen, 
  Search, 
  LayoutGrid, 
  Settings, 
  Sparkles
} from 'lucide-react';

export default function GeminiSidebar({ 
  onNewChat, 
  onOpenSearch,
  onOpenLibrary, 
  onOpenSettings,
  activeView
}) {
  return (
    <aside className="gemini-sidebar">
      {/* Top Brand Logo - Sonara Liquid Emblem in Red Glow */}
      <div className="sidebar-top-section">
        <button 
          className="brand-emblem-btn" 
          onClick={onNewChat}
          title="SONARA AI - Where music begins"
        >
          <div className="emblem-halo">
            <img 
              src="/sonara_emblem.jpg" 
              alt="SONARA" 
              className="emblem-img"
            />
          </div>
        </button>

        {/* Navigation Action Icons */}
        <div className="sidebar-nav-group">
          {/* 1. New Song / Chat */}
          <button 
            className={`sidebar-icon-btn ${activeView === 'chat' ? 'active' : ''}`}
            onClick={onNewChat}
            title="New Song / Chat"
          >
            <SquarePen size={20} />
          </button>

          {/* 2. Explore & Search (Matches Screenshot Palette) */}
          <button 
            className={`sidebar-icon-btn ${activeView === 'search' ? 'active' : ''}`}
            onClick={onOpenSearch}
            title="Search chats & songs"
          >
            <Search size={20} />
          </button>

          {/* 3. Library (4-dots grid icon matching Gemini) */}
          <button 
            className={`sidebar-icon-btn ${activeView === 'library' ? 'active' : ''}`}
            onClick={onOpenLibrary}
            title="Library"
          >
            <LayoutGrid size={20} />
          </button>
        </div>
      </div>

      {/* Bottom Tools & User Avatar */}
      <div className="sidebar-bottom-section">
        {/* Settings Button inside Highlighted Circular Ring (matches screenshot) */}
        <div className="settings-ring-container">
          <button 
            id="settings-gear-btn"
            className="settings-circle-btn" 
            onClick={onOpenSettings}
            title="Settings & Cloud GPU"
          >
            <Settings size={18} />
          </button>
        </div>

        {/* User Profile Avatar */}
        <div 
          className="user-profile-circle" 
          title="Indrajit Kumar • Sonara Creator"
          onClick={onOpenSettings}
        >
          <div className="user-avatar-inner">
            <span className="user-initials">IK</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
