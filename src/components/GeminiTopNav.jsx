import React from 'react';
import { Download, SquarePen, Sparkles } from 'lucide-react';

export default function GeminiTopNav({ onNewChat, onDownloadApp, onOpenSettings }) {
  return (
    <header className="gemini-top-nav">
      <div className="top-nav-left">
        {/* Subtle mobile brand indicator or spacer */}
      </div>

      <div className="top-nav-right">
        {/* 'Get app' Pill Button */}
        <button 
          className="get-app-pill-btn" 
          onClick={onDownloadApp}
          title="Export SONARA App or Download Master"
        >
          <Download size={15} />
          <span>Get app</span>
        </button>

        {/* New Chat / Song Icon Button */}
        <button 
          className="top-icon-btn" 
          onClick={onNewChat}
          title="New Song / Chat"
        >
          <SquarePen size={18} />
        </button>

        {/* User Avatar Circle */}
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
