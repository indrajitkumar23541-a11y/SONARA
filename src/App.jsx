import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LyricsStudio from './components/LyricsStudio';
import VoiceEnrollment from './components/VoiceEnrollment';
import SynthesisPipeline from './components/SynthesisPipeline';
import StudioPlayer from './components/StudioPlayer';
import ApiSettingsModal from './components/ApiSettingsModal';
import { sonaraAudio } from './utils/audioEngine';
import { 
  GENRES, 
  SAMPLE_VOICE_PROFILES, 
  MUSICAL_SCALES 
} from './utils/constants';
import './App.css';

const INITIAL_PROMPT_LYRICS = `[Verse 1]
Tere bina ye shaam dhal na saki
Hawa bhi chupke se keh ke gayi
Teri gali se guzri jo roshni
Dil me nayi ek aas jagi

[Chorus]
Tu hi meri dhoon tu hi fasaana
Dil ne seekha tujhse muskurana
Saansein judi hain tere naam se
Ab na juda ho ye aashiyana`;

const LATEST_GENERATED_SONG = {
  status: "success",
  engine: "DiffRhythm2 Neural Music Foundation Engine",
  duration: 124.4,
  master_url: "/audio/master_bollywood_1793270569516.mp3",
  vocal_url: "/audio/vocal_bollywood_1793270569516.mp3",
  music_url: "/audio/backing_bollywood.mp3",
  genre: "bollywood",
  musical_scale: "E Minor",
  harmonies_active: true,
  mastering_lufs: "-14 LUFS Radio Standard",
  message: "Full-Length Neural Bollywood Song Synthesized with Real Singing Melody!",
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
  const [activeStep, setActiveStep] = useState(1); // Start on Step 1: Voice Avatar!
  const [lyrics, setLyrics] = useState(INITIAL_PROMPT_LYRICS);
  const [selectedGenre, setSelectedGenre] = useState(GENRES[0]);
  const [selectedScale, setSelectedScale] = useState(MUSICAL_SCALES[0]); // E Minor Bollywood
  const [selectedInstruments, setSelectedInstruments] = useState(['guitar', 'tabla', 'flute', 'strings']);
  const [enableHarmonies, setEnableHarmonies] = useState(true);
  const [enableSidechain, setEnableSidechain] = useState(true);
  const [vocalTuning, setVocalTuning] = useState(50);
  const [vocalReverb, setVocalReverb] = useState(40);
  const [voiceProfile, setVoiceProfile] = useState(SAMPLE_VOICE_PROFILES[0]);
  const [songGenerated, setSongGenerated] = useState(true);
  const [songData, setSongData] = useState(LATEST_GENERATED_SONG);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProMode, setIsProMode] = useState(false); // Default: Easy Mode for everyone!

  useEffect(() => {
    // Configure audio engine with the latest generated masterpiece
    sonaraAudio.setRealAudioUrls(
      LATEST_GENERATED_SONG.vocal_url,
      LATEST_GENERATED_SONG.music_url,
      LATEST_GENERATED_SONG.master_url,
      LATEST_GENERATED_SONG.duration
    );
  }, []);

  const handleProceedToLyrics = () => {
    setActiveStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToAvatar = () => {
    setActiveStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToSynthesis = () => {
    setActiveStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSynthesisComplete = (generatedData) => {
    setSongData(generatedData);
    setSongGenerated(true);
    setActiveStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetSong = () => {
    setActiveStep(2); // Go to Prompt & Lyrics to easily compose another song with current avatar
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      {/* Top Studio Header */}
      <Header
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        voiceReady={true}
        songGenerated={songGenerated}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isProMode={isProMode}
        setIsProMode={setIsProMode}
      />

      {/* Main Studio Viewport */}
      <main className="main-content">
        {/* STEP 1: VOICE AVATAR (Input Voice Calibration & Avatar Creation) */}
        {activeStep === 1 && (
          <VoiceEnrollment
            voiceProfile={voiceProfile}
            setVoiceProfile={setVoiceProfile}
            onProceedToLyrics={handleProceedToLyrics}
            isProMode={isProMode}
          />
        )}

        {/* STEP 2: PROMPT & LYRICS STUDIO (Song Idea Prompt + AI Lyrics) */}
        {activeStep === 2 && (
          <LyricsStudio
            lyrics={lyrics}
            setLyrics={setLyrics}
            selectedGenre={selectedGenre}
            setSelectedGenre={setSelectedGenre}
            selectedScale={selectedScale}
            setSelectedScale={setSelectedScale}
            selectedInstruments={selectedInstruments}
            setSelectedInstruments={setSelectedInstruments}
            enableHarmonies={enableHarmonies}
            setEnableHarmonies={setEnableHarmonies}
            enableSidechain={enableSidechain}
            setEnableSidechain={setEnableSidechain}
            vocalTuning={vocalTuning}
            setVocalTuning={setVocalTuning}
            vocalReverb={vocalReverb}
            setVocalReverb={setVocalReverb}
            voiceProfile={voiceProfile}
            onProceedToSynthesis={handleProceedToSynthesis}
            onBackToAvatar={handleProceedToAvatar}
            isProMode={isProMode}
          />
        )}

        {/* STEP 3: CREATION & SYNTHESIS ENGINE */}
        {activeStep === 3 && (
          <SynthesisPipeline
            lyrics={lyrics}
            selectedGenre={selectedGenre}
            selectedScale={selectedScale}
            selectedInstruments={selectedInstruments}
            enableHarmonies={enableHarmonies}
            enableSidechain={enableSidechain}
            voiceProfile={voiceProfile}
            vocalTuning={vocalTuning}
            vocalReverb={vocalReverb}
            onComplete={handleSynthesisComplete}
          />
        )}

        {/* STEP 4: COMMERCIAL MASTER PLAYER */}
        {activeStep === 4 && (
          <StudioPlayer
            lyrics={lyrics}
            selectedGenre={selectedGenre}
            voiceProfile={voiceProfile}
            songData={songData}
            onResetSong={handleResetSong}
            isProMode={isProMode}
          />
        )}
      </main>

      {/* Cloud & AI API Configuration Modal */}
      <ApiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
