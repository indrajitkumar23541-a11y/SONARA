import React, { useState, useEffect, useRef } from 'react';
import GeminiSidebar from './components/GeminiSidebar';
import GeminiTopNav from './components/GeminiTopNav';
import VoiceAvatarModal from './components/VoiceAvatarModal';
import HistoryDrawer from './components/HistoryDrawer';
import ApiSettingsModal from './components/ApiSettingsModal';
import GeminiSongPlayerCard from './components/GeminiSongPlayerCard';
import { sonaraAudio } from './utils/audioEngine';
import { 
  GENRES, 
  SAMPLE_VOICE_PROFILES, 
  MUSICAL_SCALES 
} from './utils/constants';
import { 
  Plus, 
  Mic, 
  MicOff, 
  ArrowUp, 
  Sparkles, 
  FileText, 
  ChevronDown, 
  Music,
  Compass,
  RefreshCw,
  RotateCcw
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

  // Main Prompt Submission & Song Synthesis
  const handleGenerateSong = async (promptToUse = promptInput) => {
    const cleanPrompt = promptToUse.trim();
    if (!cleanPrompt) return;

    setIsGenerating(true);
    setGeneratingStep('Calibrating lyrical theme & Raag scales...');

    try {
      // 1. Generate Lyrics from Prompt
      let songLyrics = '';
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
        }
      } catch (err) {
        console.warn("Using fallback lyrics generator:", err);
      }

      if (!songLyrics) {
        songLyrics = `[Verse 1]\nTere bina ye shaam dhal na saki\nHawa bhi chupke se keh ke gayi\n\n[Chorus]\nTu hi meri dhoon tu hi fasaana\nDil ne seekha tujhse muskurana\n\n[Outro]\nAb na juda ho ye aashiyana`;
      }
      setLyrics(songLyrics);

      // 2. Synthesize Song
      setGeneratingStep(`Synthesizing master vocals in ${voiceProfile.name} timbre...`);
      const songRes = await fetch('http://127.0.0.1:8000/api/generate-song', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lyrics: songLyrics,
          prompt: cleanPrompt,
          genre_id: 'bollywood',
          musical_scale: 'Em',
          voice_profile_id: voiceProfile.id,
          voice_gender: voiceProfile.voiceGender || 'male',
          vocal_tuning: 50,
          vocal_reverb: 40,
          enable_harmonies: true,
          enable_sidechain: true,
          enable_mastering: true
        }),
      });

      if (!songRes.ok) {
        throw new Error(`Server returned status ${songRes.status}`);
      }

      const songData = await songRes.json();
      const finalSong = {
        ...songData,
        title: cleanPrompt.slice(0, 36),
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
                <div className="capsule-input-row">
                  {/* Left Plus Button (Opens Voice Avatar / Options) */}
                  <button 
                    type="button"
                    className="capsule-plus-btn"
                    onClick={() => setIsAvatarModalOpen(true)}
                    title="Choose / Calibrate Voice Avatar"
                  >
                    <Plus size={18} />
                  </button>

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
                  <button 
                    type="button" 
                    className="capsule-plus-btn"
                    onClick={() => setIsAvatarModalOpen(true)}
                  >
                    <Plus size={18} />
                  </button>
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
