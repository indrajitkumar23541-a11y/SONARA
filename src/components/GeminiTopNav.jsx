import React from 'react';
import { Download, SquarePen, Sparkles, Menu } from 'lucide-react';

export default function GeminiTopNav({ 
  onOpenMobileDrawer, 
  onNewChat, 
  onDownloadApp, 
  onOpenSettings 
}) {
  return (
    <header className="gemini-top-nav">
      <div className="top-nav-left">
        {/* Mobile Hamburger Button inside Circular Ring (Matches Image 1) */}
        <button 
          type="button"
          className="mobile-hamburger-btn"
          onClick={onOpenMobileDrawer}
          title="Open menu"
        >
          <Menu size={19} />
        </button>

        {/* Mobile Brand Logo & Name (Matches Image 1) */}
        <div className="mobile-brand-title-wrap" onClick={onNewChat}>
          <Sparkles size={16} className="text-red-primary mobile-brand-sparkle" />
          <span className="mobile-brand-title">SONARA</span>
        </div>
      </div>

      <div className="top-nav-right">
        {/* 'Get app' Pill Button (Desktop only) */}
        <button 
          className="get-app-pill-btn desktop-only" 
          onClick={onDownloadApp}
          title="Export SONARA App or Download Master"
        >
          <Download size={15} />
          <span>Get app</span>
        </button>

        {/* New Chat / Song Icon Button (Matches Image 1: Pencil / Edit icon) */}
        <button 
          className="top-icon-btn" 
          onClick={onNewChat}
          title="New Song / Chat"
        >
          <SquarePen size={18} />
        </button>

        {/* User Avatar Circle (Matches Image 1: Profile picture) */}
        <div 
          className="top-user-avatar" 
          onClick={onOpenSettings}
          title="Account & GPU Settings"
        >
          <span className="user-letter">IK</span>
        </div>
      </div>
    </header>
  );
}
