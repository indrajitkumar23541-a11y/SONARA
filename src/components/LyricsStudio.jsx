import React, { useState } from 'react';
import { 
  GENRES, 
  LYRICS_PRESETS, 
  EASY_THEMES,
  MUSICAL_SCALES, 
  INSTRUMENT_LAYERS,
  QUICK_SONG_PROMPTS
} from '../utils/constants';
import { 
  Sparkles, 
  Music, 
  ArrowRight, 
  ArrowLeft,
  Layers, 
  Check, 
  Activity,
  Mic, 
  MicOff,
  Wand2, 
  Trash2, 
  RefreshCw,
  Lightbulb,
  UserCheck
} from 'lucide-react';

export default function LyricsStudio({
  lyrics,
  setLyrics,
  selectedGenre,
  setSelectedGenre,
  selectedScale,
  setSelectedScale,
  selectedInstruments,
  setSelectedInstruments,
  enableHarmonies,
  setEnableHarmonies,
  enableSidechain,
  setEnableSidechain,
  vocalTuning,
  setVocalTuning,
  vocalReverb,
  setVocalReverb,
  voiceProfile,
  onProceedToSynthesis,
  onBackToAvatar,
  isProMode,
}) {
  const [songPrompt, setSongPrompt] = useState('Ek romantic Bollywood geet barish ke mausam ke upar jisme dil ki baat ho');
  const [isGeneratingLyrics, setIsGeneratingLyrics] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState('romantic');
  const [isListening, setIsListening] = useState(false);

  // AI Prompt-to-Lyrics Generation
  const handleGenerateFromPrompt = async (promptToUse = songPrompt) => {
    if (!promptToUse || !promptToUse.trim()) return;

    setIsGeneratingLyrics(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/generate-lyrics-from-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToUse,
          genre_id: selectedGenre.id,
          mood: selectedThemeId,
          voice_avatar_name: voiceProfile.name
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.lyrics) {
          setLyrics(data.lyrics);
        }
        if (data.recommended_scale) {
          const matched = MUSICAL_SCALES.find(s => s.name.toLowerCase().includes(data.recommended_scale.toLowerCase()) || data.recommended_scale.includes(s.name));
          if (matched) setSelectedScale(matched);
        }
      } else {
        // Fallback local intelligent generator
        generateFallbackLyrics(promptToUse);
      }
    } catch (err) {
      console.warn("Using fallback local prompt generator:", err);
      generateFallbackLyrics(promptToUse);
    } finally {
      setIsGeneratingLyrics(false);
    }
  };

  const generateFallbackLyrics = (promptText) => {
    const textLower = promptText.toLowerCase();
    if (textLower.includes('barish') || textLower.includes('rain')) {
      const p = LYRICS_PRESETS.find(x => x.id === 'bolly_romantic');
      if (p) setLyrics(p.lyrics);
    } else if (textLower.includes('party') || textLower.includes('dance')) {
      const p = LYRICS_PRESETS.find(x => x.id === 'party_masti');
      if (p) setLyrics(p.lyrics);
    } else if (textLower.includes('birthday')) {
      const p = LYRICS_PRESETS.find(x => x.id === 'birthday_special');
      if (p) setLyrics(p.lyrics);
    } else {
      setLyrics(`[Verse 1]\nTere khayalon me kho gaya hai mera ye jahan\n${promptText.slice(0, 35)} jaise chhoo gayi meri jaan\nDheere se hawa ne kaha tu paas hai\nTere bina ye dil mera kitna udaas hai\n\n[Chorus]\nTu hi meri dhoon tu hi fasaana\nDil ne seekha tujhse muskurana\nSaansein judi hain tere naam se\nAb na juda ho ye aashiyana\n\n[Outro]\nTu hai toh sab sahi hai meri jaan`);
    }
  };

  const handleSelectQuickPrompt = (item) => {
    setSongPrompt(item.prompt);
    handleGenerateFromPrompt(item.prompt);
  };

  // Hindi Speech Recognition
  const handleSpeechInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Aapke browser me speech recognition support nahi hai. Google Chrome ya Microsoft Edge use karein!");
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
          setLyrics((prev) => (prev ? `${prev}\n${transcript}` : transcript));
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

  const handleSelectTheme = (theme) => {
    setSelectedThemeId(theme.id);
    const preset = LYRICS_PRESETS.find((p) => p.id === theme.presetId);
    if (preset) {
      setLyrics(preset.lyrics);
    }
    const matchedGenre = GENRES.find((g) => g.id === theme.genre);
    if (matchedGenre) {
      setSelectedGenre(matchedGenre);
    }
    const matchedScale = MUSICAL_SCALES.find((s) => s.id === theme.scale);
    if (matchedScale) {
      setSelectedScale(matchedScale);
    }
  };

  const insertTag = (tag) => {
    setLyrics((prev) => (prev ? `${prev}\n\n${tag}\n` : `${tag}\n`));
  };

  const toggleInstrument = (instId) => {
    setSelectedInstruments((prev) =>
      prev.includes(instId) ? prev.filter((id) => id !== instId) : [...prev, instId]
    );
  };

  const clearLyrics = () => {
    if (window.confirm("Kya aap lyrics clear karna chahte hain?")) {
      setLyrics("");
    }
  };

  const wordCount = lyrics.trim() ? lyrics.trim().split(/\s+/).length : 0;
  const lineCount = lyrics.trim() ? lyrics.trim().split('\n').filter(l => l.trim()).length : 0;
  const estimatedSeconds = Math.max(20, Math.min(180, Math.round(wordCount * 1.8)));

  return (
    <div className="studio-section-container">
      {/* Top Breadcrumb & Section Header */}
      <div className="studio-hero-card">
        <div className="studio-hero-badge-row">
          <span className="step-pill-indicator">
            <span className="pulse-dot-cyan"></span>
            STEP 02 / 04 • PROMPT & LYRICS STUDIO
          </span>

          {/* Active Voice Avatar Badge */}
          <div className="active-avatar-pill-top">
            <span className="avatar-mini-emoji">{voiceProfile.emoji || '🎙️'}</span>
            <span>Singing As: <strong>{voiceProfile.name}</strong></span>
            <button
              type="button"
              className="change-avatar-link-btn"
              onClick={onBackToAvatar}
              title="Change Voice Avatar"
            >
              Change
            </button>
          </div>
        </div>

        <div className="studio-hero-text">
          <h1 className="studio-hero-heading">
            Prompt Your Song Idea & Compose Lyrics
          </h1>
          <p className="studio-hero-desc">
            Type a song prompt or topic below. SONARA's AI lyricist will craft rhyming Bollywood stanzas tailored to your <strong>{voiceProfile.name}</strong> Voice Avatar!
          </p>
        </div>
      </div>

      {/* =========================================================================
          PROMPT-FIRST HERO BOX: Type Song Prompt + 1-Click AI Lyrics Generator
          ========================================================================= */}
      <div className="glass-panel song-prompt-composer-card">
        <div className="prompt-header-row">
          <div className="flex-center-gap">
            <div className="prompt-icon-ring">
              <Lightbulb size={18} className="text-amber" />
            </div>
            <div>
              <h3 className="card-heading-clean">Song Idea / Prompt</h3>
              <span className="prompt-sub-hint">Bataiye kaisa gaana chahiye (e.g. romantic barish, party, dard bhara, ya birthday geet)</span>
            </div>
          </div>

          <button
            type="button"
            className={`btn-luxury-primary generate-lyrics-magic-btn ${isGeneratingLyrics ? 'loading' : ''}`}
            onClick={() => handleGenerateFromPrompt()}
            disabled={isGeneratingLyrics || !songPrompt.trim()}
          >
            {isGeneratingLyrics ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Writing Lyrics...</span>
              </>
            ) : (
              <>
                <Wand2 size={16} className="text-amber" />
                <span>Generate Lyrics with AI</span>
              </>
            )}
          </button>
        </div>

        {/* Prompt Input Box */}
        <div className="prompt-input-row">
          <input
            type="text"
            className="song-prompt-input-field"
            value={songPrompt}
            onChange={(e) => setSongPrompt(e.target.value)}
            placeholder="E.g., Ek romantic barish ka geet jisme dil ki sacchi baat ho..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleGenerateFromPrompt();
            }}
          />
        </div>

        {/* Quick Inspiration Pills */}
        <div className="quick-prompts-ribbon">
          <span className="quick-prompt-label">Inspirations:</span>
          {QUICK_SONG_PROMPTS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="quick-prompt-pill"
              onClick={() => handleSelectQuickPrompt(item)}
              title={item.prompt}
            >
              <span>{item.emoji} {item.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 1. Curated Theme Cards */}
      <div className="themes-section">
        <div className="section-subhead-row">
          <span className="section-eyebrow">
            <Sparkles size={14} className="text-amber" /> QUICK MOOD THEMES
          </span>
          <span className="section-hint">Click any tile to auto-load matching lyrics & Raag scale</span>
        </div>

        <div className="themes-card-deck">
          {EASY_THEMES.map((theme) => {
            const isSelected = selectedThemeId === theme.id;
            return (
              <div
                key={theme.id}
                className={`luxury-theme-card ${isSelected ? 'active' : ''}`}
                onClick={() => handleSelectTheme(theme)}
              >
                <div className="theme-card-glow" style={{ background: theme.color }}></div>
                <div className="theme-card-top">
                  <span className="theme-emoji-badge">{theme.emoji}</span>
                  {isSelected && (
                    <span className="theme-check-chip" style={{ background: theme.color }}>
                      <Check size={12} /> Active
                    </span>
                  )}
                </div>
                <h3 className="theme-title">{theme.title}</h3>
                <p className="theme-desc">{theme.subtitle}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Main Studio Dual Grid (Lyrics Editor + Soundscape Rack) */}
      <div className="studio-dual-grid">
        {/* Left Column: Glass Lyrics Editor */}
        <div className="glass-panel editor-glass-card">
          <div className="editor-top-bar">
            <div className="editor-title-group">
              <Music size={16} className="text-cyan" />
              <span className="editor-title">Song Lyrics & Structure</span>
            </div>

            {/* Editor Actions Toolbar */}
            <div className="editor-actions-toolbar">
              <button
                type="button"
                className={`tool-pill-btn voice-pill ${isListening ? 'active-listening' : ''}`}
                onClick={handleSpeechInput}
                title="Microphone dabakar boliye (Voice Typing in Hindi/English)"
              >
                {isListening ? (
                  <>
                    <MicOff size={14} className="animate-pulse text-rose" />
                    <span>Listening...</span>
                  </>
                ) : (
                  <>
                    <Mic size={14} className="text-cyan" />
                    <span>Speak Lyrics</span>
                  </>
                )}
              </button>

              <button
                type="button"
                className="tool-icon-btn text-muted hover-rose"
                onClick={clearLyrics}
                title="Clear Lyrics"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Quick Structure Tags */}
          <div className="structure-tags-ribbon">
            <span className="tag-ribbon-label">Structure:</span>
            {['[Verse 1]', '[Chorus]', '[Verse 2]', '[Bridge]', '[Outro]'].map((tag) => (
              <button
                key={tag}
                type="button"
                className="struct-tag-chip"
                onClick={() => insertTag(tag)}
              >
                + {tag.replace('[', '').replace(']', '')}
              </button>
            ))}
          </div>

          {/* Textarea Workspace */}
          <div className="textarea-frame">
            <textarea
              id="lyrics-textarea"
              className="studio-lyrics-input"
              placeholder={`Write or paste your lyrics here, or click "Generate Lyrics with AI" above...

Example:
[Verse 1]
Tere bina ye shaam dhal na saki
Hawa bhi chupke se keh ke gayi

[Chorus]
Tu hi meri dhoon tu hi fasaana
Dil ne seekha tujhse muskurana`}
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              rows={12}
            />
          </div>

          {/* Editor Footer Telemetry */}
          <div className="editor-footer-telemetry">
            <div className="telemetry-pill">
              <span className="pill-dot green"></span>
              <span>{lineCount} Lines</span>
            </div>
            <div className="telemetry-pill">
              <span>{wordCount} Words</span>
            </div>
            <div className="telemetry-pill">
              <span>~{estimatedSeconds}s Runtime</span>
            </div>
            <div className="telemetry-pill cyan">
              <span>{selectedGenre.name}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Musical Soundscape & Pro Controls */}
        <div className="soundscape-sidebar">
          {/* Soundscape Summary Card */}
          <div className="glass-panel soundscape-card">
            <div className="sidebar-card-header">
              <div className="flex-center-gap">
                <Layers size={16} className="text-cyan" />
                <span className="card-heading-clean">Acoustic Orchestration</span>
              </div>
              <span className="badge badge-cyan">{selectedInstruments.length} Stems</span>
            </div>

            <p className="sidebar-explainer">
              Indian acoustic multi-track accompaniment tailored for emotional Bollywood delivery.
            </p>

            {/* Instrument Stacks */}
            <div className="instrument-stacks-list">
              {INSTRUMENT_LAYERS.map((inst) => {
                const isChecked = selectedInstruments.includes(inst.id);
                return (
                  <div
                    key={inst.id}
                    className={`instrument-row ${isChecked ? 'active' : ''}`}
                    onClick={() => toggleInstrument(inst.id)}
                  >
                    <div className="inst-check-box">
                      {isChecked && <Check size={12} color="#fff" />}
                    </div>
                    <div className="inst-text">
                      <span className="inst-title">{inst.name}</span>
                      <span className="inst-sub">{inst.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scale Lock & Pro DSP */}
          <div className="glass-panel soundscape-card">
            <div className="sidebar-card-header">
              <div className="flex-center-gap">
                <Activity size={16} className="text-pink" />
                <span className="card-heading-clean">Melodyne Raag / Scale Lock</span>
              </div>
              <span className="badge badge-purple">{selectedScale.name}</span>
            </div>

            <div className="scale-selector-grid-compact">
              {MUSICAL_SCALES.map((scale) => {
                const isSelected = selectedScale.id === scale.id;
                return (
                  <button
                    key={scale.id}
                    type="button"
                    className={`scale-btn-compact ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedScale(scale)}
                  >
                    <span className="scale-key-code">{scale.name}</span>
                    <span className="scale-key-mood">{scale.mood.split('(')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Pro DSP Sliders (Visible in Pro Mode) */}
            {isProMode && (
              <div className="pro-sliders-box" style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                <div className="pro-slider-group">
                  <div className="slider-label-row">
                    <span>Vocal Auto-Tune</span>
                    <span className="text-cyan">{vocalTuning}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={vocalTuning}
                    onChange={(e) => setVocalTuning(Number(e.target.value))}
                    className="stem-slider"
                  />
                </div>

                <div className="pro-slider-group" style={{ marginTop: '0.75rem' }}>
                  <div className="slider-label-row">
                    <span>Studio Plate Reverb</span>
                    <span className="text-pink">{vocalReverb}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={vocalReverb}
                    onChange={(e) => setVocalReverb(Number(e.target.value))}
                    className="stem-slider"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Sticky-Style Action Deck */}
      <div className="action-footer-deck">
        <button
          type="button"
          className="btn-secondary-clean"
          onClick={onBackToAvatar}
        >
          <ArrowLeft size={16} />
          <span>Change Voice Avatar</span>
        </button>

        <button
          id="btn-proceed-synthesis"
          className="btn-luxury-primary-lg animate-pulse-subtle"
          onClick={onProceedToSynthesis}
          disabled={!lyrics.trim()}
        >
          <Sparkles size={20} className="text-amber" />
          <span>Synthesize Song in {voiceProfile.name}</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
