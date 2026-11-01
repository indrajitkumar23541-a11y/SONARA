import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  MessageSquare, 
  Music, 
  Trash2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function GeminiSearchModal({ 
  isOpen, 
  onClose, 
  historySongs = [], 
  onSelectSong,
  onSelectPrompt
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const inputRef = useRef(null);

  // Load real history from localStorage & historySongs
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);

      // 1. Fetch user search/prompt history from localStorage
      let storedPrompts = [];
      try {
        const raw = localStorage.getItem('sonara_search_history');
        if (raw) {
          storedPrompts = JSON.parse(raw);
        }
      } catch (e) {
        console.warn('Error reading search history:', e);
      }

      // 2. Format historySongs into unified recent items
      const songItems = (historySongs || []).map((song, idx) => ({
        id: song.id || `song_${song.song_id || idx}`,
        type: 'song',
        title: song.title || song.prompt || 'Original AI Bollywood Track',
        genre: song.genre || 'bollywood',
        timestamp: song.timestamp || (Date.now() - (idx + 1) * 3600 * 1000 * 14), // realistic recent timestamps
        songData: song
      }));

      // 3. Merge prompts and songs, removing duplicates by title
      const combined = [...storedPrompts, ...songItems];
      const seen = new Set();
      const deduped = [];

      for (const item of combined) {
        const cleanTitle = (item.title || item.prompt || '').trim().toLowerCase();
        if (cleanTitle && !seen.has(cleanTitle)) {
          seen.add(cleanTitle);
          deduped.push({
            id: item.id || `hist_${Math.random()}`,
            type: item.type || 'prompt',
            title: item.title || item.prompt,
            timestamp: item.timestamp || Date.now(),
            songData: item.songData || null
          });
        }
      }

      // Sort by newest first
      deduped.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      setSearchHistory(deduped);
      setSearchQuery('');
    }
  }, [isOpen, historySongs]);

  if (!isOpen) return null;

  // Format relative time like Gemini ("2w", "1mo", "3d", "5h", "Just now")
  const formatTimeAgo = (ts) => {
    if (!ts) return 'Just now';
    const now = Date.now();
    const diffMs = Math.max(0, now - ts);
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    if (diffWeeks < 4) return `${diffWeeks}w`;
    return `${diffMonths}mo`;
  };

  // Filter items based on active search query
  const filteredHistory = searchHistory.filter((item) => {
    if (!searchQuery.trim()) return true;
    return (item.title || '').toLowerCase().includes(searchQuery.toLowerCase().trim());
  });

  const handleItemClick = (item) => {
    if (item.songData && onSelectSong) {
      onSelectSong(item.songData);
    } else if (onSelectPrompt) {
      onSelectPrompt(item.title);
    }
    onClose();
  };

  const handleClearHistory = (e) => {
    e.stopPropagation();
    localStorage.removeItem('sonara_search_history');
    setSearchHistory([]);
  };

  return (
    <div className="gemini-search-overlay animate-fadeIn" onClick={onClose}>
      <div 
        className="gemini-search-palette animate-scaleUp" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Search Input Bar (Matches Gemini Screenshot) */}
        <div className="search-palette-header">
          <div className="search-input-wrapper">
            <Search size={18} className="search-palette-icon text-red-primary" />
            <input
              ref={inputRef}
              type="text"
              className="search-palette-input"
              placeholder="Search chats"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') onClose();
                if (e.key === 'Enter' && searchQuery.trim()) {
                  if (onSelectPrompt) {
                    onSelectPrompt(searchQuery.trim());
                    onClose();
                  }
                }
              }}
            />
          </div>
          <button 
            type="button" 
            className="search-palette-close-btn" 
            onClick={onClose}
            title="Close search"
          >
            <X size={18} />
          </button>
        </div>

        {/* Recents Section */}
        <div className="search-palette-body">
          <div className="search-section-header">
            <span className="search-section-label">Recents</span>
            {searchHistory.length > 0 && (
              <button 
                type="button" 
                className="clear-history-subtle-btn"
                onClick={handleClearHistory}
                title="Clear recent search history"
              >
                Clear
              </button>
            )}
          </div>

          <div className="search-items-list">
            {filteredHistory.length === 0 ? (
              <div className="search-empty-state">
                {searchQuery.trim() ? (
                  <p>No songs or chats found matching "{searchQuery}"</p>
                ) : (
                  <p>No recent songs yet. Ask Sonara to generate your first melody!</p>
                )}
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="search-item-row"
                  onClick={() => handleItemClick(item)}
                >
                  {/* Left Rounded Chat Bubble Icon (Matches Screenshot) */}
                  <div className="search-item-icon-box">
                    {item.type === 'song' ? (
                      <MessageSquare size={16} className="search-bubble-icon" />
                    ) : (
                      <MessageSquare size={16} className="search-bubble-icon" />
                    )}
                  </div>

                  {/* Title / Prompt text */}
                  <span className="search-item-title" title={item.title}>
                    {item.title}
                  </span>

                  {/* Right Relative Timestamp ("2w", "1mo", etc.) */}
                  <span className="search-item-timestamp">
                    {formatTimeAgo(item.timestamp)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
