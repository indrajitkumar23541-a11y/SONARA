import React, { useState, useEffect, useRef } from 'react';
import GeminiSidebar from './components/GeminiSidebar';
import GeminiTopNav from './components/GeminiTopNav';
import VoiceAvatarModal from './components/VoiceAvatarModal';
import HistoryDrawer from './components/HistoryDrawer';
import ApiSettingsModal from './components/ApiSettingsModal';
import GeminiSongPlayerCard from './components/GeminiSongPlayerCard';
import GeminiToolsMenu from './components/GeminiToolsMenu';
import { sonaraAudio } from './utils/audioEngine';
import { 
  GENRES, 
  SAMPLE_VOICE_PROFILES, 
  MUSICAL_SCALES 
} from './utils/constants';
import { 
  Plus, 
  X,
  Mic, 
  MicOff, 
  ArrowUp, 
  Sparkles, 
  FileText, 
  ChevronDown, 
  Music,
  Compass,
  RefreshCw,
  RotateCcw,
  CheckCircle2,
  Check
} from 'lucide-react';
import './App.css';

const DEFAULT_INITIAL_SONG = {
  status: "success",
  title: "Tere Bina Ye Shaam",
  duration: 124.4,
  master_url: "/audio/master_bollywood_1793270569516.mp3",
  vocal_url: "/audio/vocal_bollywood_1793270569516.mp3",
  music_url: "/audio/backing_bollywood.mp3",
  genre: "bollywood",
  musical_scale: "E Minor",
  harmonies_active: true,
  lines: [
    { text: "Tere bina ye shaam dhal na saki", start_time: 0.0, end_time: 15.6 },
    { text: "Hawa bhi chupke se keh ke gayi", start_time: 15.6, end_time: 31.1 },
    { text: "Teri gali se guzri jo roshni", start_time: 31.1, end_time: 46.7 },
    { text: "Dil me nayi ek aas jagi", start_time: 46.7, end_time: 62.2 },
    { text: "Tu hi meri dhoon tu hi fasaana", start_time: 62.2, end_time: 77.8 },
    { text: "Dil ne seekha tujhse muskurana", start_time: 77.8, end_time: 93.3 },
    { text: "Saansein judi hain tere naam se", start_time: 93.3, end_time: 108.9 },
    { text: "Ab na juda ho ye aashiyana", start_time: 108.9, end_time: 124.4 }
  ]
};

export default function App() {
  const [promptInput, setPromptInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('Flash-Lite');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Modals & Drawers
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Song Generation & Chat State
  const [voiceProfile, setVoiceProfile] = useState(SAMPLE_VOICE_PROFILES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingStep, setGeneratingStep] = useState('');
  const [generatedSong, setGeneratedSong] = useState(null);
  const [lyrics, setLyrics] = useState('');
  const [historySongs, setHistorySongs] = useState([DEFAULT_INITIAL_SONG]);

  const textareaRef = useRef(null);

  // Gemini + Tools Popup Menu States
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [isFollowupPlusOpen, setIsFollowupPlusOpen] = useState(false);
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
  const [uploadNotice, setUploadNotice] = useState('');
  const avatarDropdownRef = useRef(null);

  // Close avatar selector dropdown when clicking outside
  useEffect(() => {
    const handleAvatarOutside = (e) => {
      if (avatarDropdownRef.current && !avatarDropdownRef.current.contains(e.target)) {
        setIsAvatarDropdownOpen(false);
      }
    };
    if (isAvatarDropdownOpen) {
      document.addEventListener('mousedown', handleAvatarOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleAvatarOutside);
    };
  }, [isAvatarDropdownOpen]);

  // 1. Upload Audio / Vocals Handler
  const handleAudioSelected = async (file) => {
    const audioUrl = URL.createObjectURL(file);
    const avatarName = file.name.replace(/\.[^/.]+$/, "").slice(0, 18);
    const customProf = {
      id: 'profile_user',
      name: `${avatarName} (My Voice)`,
      tag: 'User Calibrated Avatar',
      role: 'Your Personal Vocal Identity',
      desc: `Custom voice calibrated from ${file.name}`,
      emoji: '🎙️',
      sampleUrl: audioUrl,
      customAudioUrl: audioUrl,
      voiceGender: 'male',
      isCustom: true
    };
    setVoiceProfile(customProf);
    setUploadNotice(`Voice Avatar set: ${file.name}`);
    setTimeout(() => setUploadNotice(''), 4500);

    // Sync to backend for synthesis engine
    try {
      const formData = new FormData();
      formData.append('file', file, file.name);
      await fetch('http://127.0.0.1:8000/api/upload-voice-avatar', {
        method: 'POST',
        body: formData
      });
    } catch (e) {
      console.warn("Backend voice avatar sync:", e);
    }
  };

  // 2. Upload Lyrics File Handler
  const handleLyricsSelected = (filename, content) => {
    setLyrics(content);
    const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
    const sampleLine = lines[0] || 'Original Lyrics';
    setPromptInput(`Sing lyrics: "${sampleLine.slice(0, 40)}..."`);
    setUploadNotice(`Lyrics loaded: ${filename} (${lines.length} lines)`);
    setTimeout(() => setUploadNotice(''), 4500);
    if (textareaRef.current) textareaRef.current.focus();
  };

  // 3. Create Bollywood / Classical / Pop Track Handler
  const handleGenreSelected = (genre) => {
    let presetPrompt = '';
    if (genre === 'bollywood') {
      presetPrompt = 'Soulful romantic Bollywood melody with acoustic guitar, emotive strings, and gentle flute';
    } else if (genre === 'classical') {
      presetPrompt = 'Classical Hindustani Raag Yaman bandish with harmonium, sitar, and expressive tabla';
    } else if (genre === 'pop') {
      presetPrompt = 'High-energy modern Bollywood Pop track with punchy 808 bass, synth groove, and catchy hook';
    }
    setPromptInput(presetPrompt);
    if (textareaRef.current) textareaRef.current.focus();
  };

  // Speech Recognition
  const handleSpeechInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Aapke browser me speech recognition support nahi hai. Chrome ya Edge use karein!");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setPromptInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  // Main Prompt Submission & Song Synthesis (Instant 1-step like Gemini)
  const handleGenerateSong = async (promptToUse = promptInput) => {
    const cleanPrompt = promptToUse.trim();
    if (!cleanPrompt) return;

    setIsGenerating(true);

    // 1. Detect if user entered raw multi-line lyrics or a theme prompt
    const rawLines = cleanPrompt.split('\n').map(l => l.trim()).filter(Boolean);
    const isDirectLyrics = rawLines.length >= 2 || /\[(verse|chorus|hook|bridge|outro|intro)\]/i.test(cleanPrompt);

    if (isDirectLyrics) {
      setGeneratingStep(`Composing music & meter for your lyrics with ${voiceProfile.name}...`);
    } else {
      setGeneratingStep(`Writing poetic Bollywood lyrics for "${cleanPrompt.slice(0, 30)}..."`);
    }

    try {
      let songLyrics = '';
      let genreToUse = 'bollywood';
      let scaleToUse = 'Em';
      let songTitle = cleanPrompt.split('\n')[0].replace(/\[.*?\]/g, '').trim().slice(0, 36) || 'My AI Song';

      if (isDirectLyrics) {
        // User provided direct lyrics! Keep them intact
        songLyrics = cleanPrompt;
        const lower = cleanPrompt.toLowerCase();
        if (/party|dance|club|dj|edm|nacho/i.test(lower)) {
          genreToUse = 'pop';
          scaleToUse = 'Am';
        } else if (/sad|dard|judai|tuta|roona|tanha|broken/i.test(lower)) {
          scaleToUse = 'C#m';
        } else if (/bhajan|bhakti|shiva|krishna|ram|prabhu|mandir|sukoon/i.test(lower)) {
          genreToUse = 'classical';
          scaleToUse = 'Cmaj';
        }
      } else {
        // Call backend lyrics generation
        try {
          const lyricRes = await fetch('http://127.0.0.1:8000/api/generate-lyrics-from-prompt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: cleanPrompt,
              genre_id: 'bollywood',
              voice_avatar_name: voiceProfile.name
            }),
          });
          if (lyricRes.ok) {
            const lData = await lyricRes.json();
            songLyrics = lData.lyrics;
            genreToUse = lData.genre || 'bollywood';
            scaleToUse = lData.recommended_scale || 'Em';
            if (lData.title) songTitle = lData.title;
          }
        } catch (err) {
          console.warn("Using fallback lyrics generator:", err);
        }

        if (!songLyrics) {
          songLyrics = `[Verse 1]\nTere bina ye shaam dhal na saki\nHawa bhi chupke se keh ke gayi\n\n[Chorus]\nTu hi meri dhoon tu hi fasaana\nDil ne seekha tujhse muskurana\n\n[Outro]\nAb na juda ho ye aashiyana`;
        }
      }
      setLyrics(songLyrics);

      // 2. Synthesize Song with Selected Voice Avatar
      setGeneratingStep(`Synthesizing singing vocals with ${voiceProfile.name}...`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const songRes = await fetch('http://127.0.0.1:8000/api/generate-song', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          lyrics: songLyrics,
          prompt: cleanPrompt,
          genre_id: genreToUse,
          musical_scale: scaleToUse,
          voice_avatar_name: voiceProfile.name,
          voice_profile_id: voiceProfile.id,
          voice_gender: voiceProfile.voiceGender || 'male',
          cloud_provider: selectedModel,
          vocal_tuning: 50,
          vocal_reverb: 40,
          enable_harmonies: true,
          enable_sidechain: true,
          enable_mastering: true
        }),
      });
      clearTimeout(timeoutId);

      if (!songRes.ok) {
        throw new Error(`Server returned status ${songRes.status}`);
      }

      const songData = await songRes.json();
      const finalSong = {
        ...songData,
        title: songTitle,
        voice_name: voiceProfile.name,
      };

      setGeneratedSong(finalSong);
      setHistorySongs((prev) => [finalSong, ...prev]);

    } catch (err) {
      console.warn("Synthesis fallback:", err);
      // Fallback preview
      const fallback = {
        ...DEFAULT_INITIAL_SONG,
        title: cleanPrompt.slice(0, 36) || 'Original AI Bollywood Track',
        voice_name: voiceProfile.name,
      };
      setGeneratedSong(fallback);
      setLyrics(DEFAULT_INITIAL_SONG.lines.map(l => l.text).join('\n'));
      setHistorySongs((prev) => [fallback, ...prev]);
    } finally {
      setIsGenerating(false);
      setGeneratingStep('');
    }
  };

  const handleSelectSuggestion = (suggestionText) => {
    setPromptInput(suggestionText);
    handleGenerateSong(suggestionText);
  };

  const handleResetToNewChat = () => {
    setGeneratedSong(null);
    setPromptInput('');
    sonaraAudio.stopStemPlayback();
  };

  return (
    <div className="gemini-app-layout">
      {/* 1. Left Slim Vertical Sidebar (Matches screenshot with red glow) */}
      <GeminiSidebar 
        onNewChat={handleResetToNewChat}
        onOpenLibrary={() => setIsHistoryDrawerOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        activeView={isHistoryDrawerOpen ? 'library' : 'chat'}
      />

      {/* 2. Main Workstation Area */}
      <div className="gemini-main-canvas">
        {/* Top Right Controls (Matches screenshot) */}
        <GeminiTopNav 
          onNewChat={handleResetToNewChat}
          onDownloadApp={() => {
            const a = document.createElement('a');
            a.href = generatedSong?.master_url || DEFAULT_INITIAL_SONG.master_url;
            a.download = 'SONARA_Master.mp3';
            a.click();
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Center Content Canvas */}
        <div className="gemini-center-content">
          {!generatedSong && !isGenerating ? (
            /* --- Initial "Where should we start?" State --- */
            <div className="gemini-hero-container">
              {/* Centered Large Title */}
              <h1 className="gemini-hero-title">
                Where should we start?
              </h1>

              {/* Iconic Center Capsule Input Box */}
              <div className="gemini-prompt-capsule-card">
                {/* Upload / Preset Status Toast Notice */}
                {uploadNotice && (
                  <div className="upload-notice-toast animate-fadeIn">
                    <CheckCircle2 size={16} className="text-red-primary" />
                    <span>{uploadNotice}</span>
                  </div>
                )}

                <div className="capsule-input-row">
                  {/* Left Plus Button (Opens Gemini Tools Menu) */}
                  <div className="capsule-plus-wrapper">
                    <button 
                      type="button"
                      className={`capsule-plus-btn ${isPlusMenuOpen ? 'active' : ''}`}
                      onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                      title={isPlusMenuOpen ? "Close menu" : "Upload Audio, Lyrics or Track Presets"}
                    >
                      {isPlusMenuOpen ? <X size={18} /> : <Plus size={18} />}
                    </button>

                    <GeminiToolsMenu 
                      isOpen={isPlusMenuOpen}
                      onClose={() => setIsPlusMenuOpen(false)}
                      onAudioSelected={handleAudioSelected}
                      onLyricsSelected={handleLyricsSelected}
                      onGenreSelected={handleGenreSelected}
                      onOpenAvatarModal={() => setIsAvatarModalOpen(true)}
                      direction="bottom"
                    />
                  </div>

                  {/* Main Text Input */}
                  <input
                    ref={textareaRef}
                    type="text"
                    className="capsule-text-input"
                    placeholder="Ask Sonara"
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleGenerateSong();
                      }
                    }}
                  />

                  {/* Model Selector Dropdown Pill */}
                  <div className="capsule-model-wrapper">
                    <button 
                      type="button"
                      className="capsule-model-pill"
                      onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                    >
                      <span>{selectedModel}</span>
                      <ChevronDown size={14} />
                    </button>

                    {isModelDropdownOpen && (
                      <div className="model-menu-dropdown">
                        <div 
                          className={`model-menu-item ${selectedModel === 'Flash-Lite' ? 'active' : ''}`}
                          onClick={() => {
                            setSelectedModel('Flash-Lite');
                            setIsModelDropdownOpen(false);
                          }}
                        >
                          <strong>Flash-Lite</strong>
                          <span>Fast synthesis with local acoustic studio</span>
                        </div>
                        <div 
                          className={`model-menu-item ${selectedModel === 'Sonara-Pro' ? 'active' : ''}`}
                          onClick={() => {
                            setSelectedModel('Sonara-Pro');
                            setIsModelDropdownOpen(false);
                          }}
                        >
                          <strong>Sonara-Pro (DiffRhythm2)</strong>
                          <span>High-fidelity neural singing foundation model</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Voice Avatar Selector Pill (1-Click Avatar Selection) */}
                  <div className="capsule-avatar-wrapper" ref={avatarDropdownRef}>
                    <button 
                      type="button"
                      className="capsule-avatar-pill"
                      onClick={() => setIsAvatarDropdownOpen(!isAvatarDropdownOpen)}
                      title={`Singing Avatar: ${voiceProfile.name}`}
                    >
                      <span className="avatar-pill-dot" />
                      <span className="avatar-pill-name">{voiceProfile.name.split(' ')[0]}</span>
                      <ChevronDown size={13} />
                    </button>

                    {isAvatarDropdownOpen && (
                      <div className="avatar-menu-dropdown animate-fadeIn">
                        <div className="avatar-dropdown-header">
                          <span>Select Singer Voice Avatar</span>
                        </div>
                        {SAMPLE_VOICE_PROFILES.map((profile) => (
                          <div 
                            key={profile.id}
                            className={`avatar-menu-item ${voiceProfile.id === profile.id ? 'active' : ''}`}
                            onClick={() => {
                              setVoiceProfile(profile);
                              setIsAvatarDropdownOpen(false);
                              setUploadNotice(`Singing Avatar: ${profile.name}`);
                              setTimeout(() => setUploadNotice(''), 3000);
                            }}
                          >
                            <span className="avatar-item-emoji">{profile.emoji || '🎙️'}</span>
                            <div className="avatar-item-info">
                              <strong>{profile.name}</strong>
                              <span>{profile.role || profile.desc}</span>
                            </div>
                            {voiceProfile.id === profile.id && (
                              <Check size={16} className="text-red-primary" />
                            )}
                          </div>
                        ))}
                        <div 
                          className="avatar-menu-calibrate-item"
                          onClick={() => {
                            setIsAvatarDropdownOpen(false);
                            setIsAvatarModalOpen(true);
                          }}
                        >
                          <Mic size={14} className="text-red-primary" />
                          <span>+ Record / Calibrate My Voice (5s)</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Microphone Button (Speech to text) */}
                  <button 
                    type="button"
                    className={`capsule-mic-btn ${isListening ? 'active-listening' : ''}`}
                    onClick={handleSpeechInput}
                    title="Microphone dabakar boliye"
                  >
                    {isListening ? (
                      <MicOff size={18} className="text-red-primary animate-pulse" />
                    ) : (
                      <Mic size={18} />
                    )}
                  </button>

                  {/* Send Button (Visible when text entered) */}
                  {promptInput.trim() && (
                    <button 
                      type="button"
                      className="capsule-send-btn animate-fadeIn"
                      onClick={() => handleGenerateSong()}
                      title="Generate Song"
                    >
                      <ArrowUp size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* 3 Suggestions below Prompt Box (Matches screenshot layout) */}
              <div className="gemini-suggestions-deck">
                {/* 1. Debug Python Code equivalent -> Compose Romantic Song */}
                <button 
                  className="suggestion-tile"
                  onClick={() => handleSelectSuggestion('Help me compose a romantic Bollywood rain song with acoustic guitar')}
                >
                  <FileText size={18} className="tile-icon" />
                  <span className="tile-text">Help me compose a romantic Bollywood rain song</span>
                </button>

                {/* 2. Design Poster equivalent -> Calibrate Voice Avatar */}
                <button 
                  className="suggestion-tile"
                  onClick={() => setIsAvatarModalOpen(true)}
                >
                  <Sparkles size={18} className="tile-icon" />
                  <span className="tile-text">Calibrate my 5-second AI Voice Avatar</span>
                </button>

                {/* 3. Big Life Decision equivalent -> Party Dance Track */}
                <button 
                  className="suggestion-tile"
                  onClick={() => handleSelectSuggestion('Help me create an energetic high-speed Bollywood party dance track')}
                >
                  <Compass size={18} className="tile-icon" />
                  <span className="tile-text">Help me create an energetic high-speed party anthem</span>
                </button>
              </div>

              {/* Current Active Avatar Mini-Badge */}
              <div className="active-avatar-pill-bottom" onClick={() => setIsAvatarModalOpen(true)}>
                <span>Active Singer Avatar:</span>
                <strong className="text-red-primary">{voiceProfile.name}</strong>
                <span className="change-link">Change</span>
              </div>
            </div>
          ) : isGenerating ? (
            /* --- Generating Song Status --- */
            <div className="gemini-generating-container">
              <div className="generating-red-spinner">
                <RefreshCw size={36} className="animate-spin text-red-primary" />
              </div>
              <h2 className="generating-headline">Composing & Synthesizing Master Audio</h2>
              <p className="generating-subtext">{generatingStep || 'Processing musical notes and vocal harmonics...'}</p>
              <button 
                type="button"
                className="generating-cancel-btn"
                onClick={() => {
                  setIsGenerating(false);
                  setGeneratingStep('');
                }}
              >
                Cancel / Return
              </button>
            </div>
          ) : (
            /* --- Song Generated State: Studio Player Card View --- */
            <div className="gemini-thread-container">
              {/* User Query Pill */}
              <div className="user-query-bubble">
                <span>{promptInput || 'Compose a romantic Bollywood song'}</span>
              </div>

              {/* Sonara AI Response with Master Audio Player */}
              <GeminiSongPlayerCard 
                songData={generatedSong}
                lyrics={lyrics}
                voiceProfile={voiceProfile}
                selectedGenre={GENRES[0]}
                onReset={handleResetToNewChat}
              />

              {/* Quick Follow-up Input Bar at bottom */}
              <div className="followup-input-container">
                <div className="capsule-input-row followup-capsule">
                  <div className="capsule-plus-wrapper">
                    <button 
                      type="button" 
                      className={`capsule-plus-btn ${isFollowupPlusOpen ? 'active' : ''}`}
                      onClick={() => setIsFollowupPlusOpen(!isFollowupPlusOpen)}
                      title={isFollowupPlusOpen ? "Close menu" : "Upload Audio, Lyrics or Track Presets"}
                    >
                      {isFollowupPlusOpen ? <X size={18} /> : <Plus size={18} />}
                    </button>

                    <GeminiToolsMenu 
                      isOpen={isFollowupPlusOpen}
                      onClose={() => setIsFollowupPlusOpen(false)}
                      onAudioSelected={handleAudioSelected}
                      onLyricsSelected={handleLyricsSelected}
                      onGenreSelected={handleGenreSelected}
                      onOpenAvatarModal={() => setIsAvatarModalOpen(true)}
                      direction="top"
                    />
                  </div>
                  <input 
                    type="text" 
                    className="capsule-text-input" 
                    placeholder="Ask Sonara to refine, change singer, or make another song..."
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleGenerateSong();
                    }}
                  />
                  <button 
                    type="button" 
                    className="capsule-send-btn"
                    onClick={() => handleGenerateSong()}
                  >
                    <ArrowUp size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Voice Avatar Calibration Modal */}
      <VoiceAvatarModal 
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        voiceProfile={voiceProfile}
        setVoiceProfile={setVoiceProfile}
      />

      {/* 4. History Drawer */}
      <HistoryDrawer 
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        historySongs={historySongs}
        onSelectSong={(song) => {
          setGeneratedSong(song);
          setLyrics(song.lines ? song.lines.map(l => l.text).join('\n') : '');
        }}
      />

      {/* 5. Cloud GPU & Engine Settings Modal */}
      <ApiSettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
