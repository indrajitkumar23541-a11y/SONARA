import React from 'react';
import { 
  SquarePen, 
  Search, 
  Library, 
  Settings, 
  Sparkles
} from 'lucide-react';

export default function GeminiSidebar({ 
  onNewChat, 
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
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            {/* Fallback stylized red sparkle if image is loading */}
            <div className="emblem-sparkle-core">
              <Sparkles size={20} className="text-red-primary" />
            </div>
          </div>
        </button>

        {/* Navigation Action Icons */}
        <div className="sidebar-nav-group">
          {/* 1. New Song / Chat */}
          <button 
            className="sidebar-icon-btn" 
            onClick={onNewChat}
            title="New Song / Chat"
          >
            <SquarePen size={20} />
          </button>

          {/* 2. Explore & Search */}
          <button 
            className={`sidebar-icon-btn ${activeView === 'search' ? 'active' : ''}`}
            onClick={onNewChat}
            title="Search"
          >
            <Search size={20} />
          </button>

          {/* 3. Library (Search ke theek niche) */}
          <button 
            className={`sidebar-icon-btn ${activeView === 'library' ? 'active' : ''}`}
            onClick={onOpenLibrary}
            title="Library"
          >
            <Library size={20} />
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
