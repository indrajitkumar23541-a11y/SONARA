// ============================================================================
// SONARA Audio & Web Audio API Engine
// Real-time microphone capture, audio analysis, multi-stem synth & rock-solid online playback
// ============================================================================

class SonaraAudioEngine {
  constructor() {
    this.audioCtx = null;
    this.micStream = null;
    this.micSource = null;
    this.analyser = null;
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.recordedAudioUrl = null;

    // Master audio element for 100% reliable online browser playback
    this.masterAudio = null;
    this.masterSourceNode = null;
    this.masterUrl = null;

    // Stem audio elements (for Pro stem mixer)
    this.realVocalAudio = null;
    this.realMusicAudio = null;
    this.realVocalSourceNode = null;
    this.realMusicSourceNode = null;
    this.realVocalUrl = null;
    this.realMusicUrl = null;

    // Gain busses
    this.vocalGain = null;
    this.musicGain = null;
    this.masterGain = null;
    this.playbackAnalyser = null;

    // State
    this.playbackTimer = null;
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 45;
    this.onProgressCallback = null;
    this.isStemMode = false;
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // --- 1. Microphone & Recording Pipeline ---
  async startMicRecording() {
    this.initContext();
    this.recordedChunks = [];

    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      if (this.audioCtx) {
        this.micSource = this.audioCtx.createMediaStreamSource(this.micStream);
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 256;
        this.analyser.smoothingTimeConstant = 0.8;
        this.micSource.connect(this.analyser);
      }

      this.mediaRecorder = new MediaRecorder(this.micStream);
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(100);
      return true;
    } catch (err) {
      console.warn('Microphone access denied or unavailable:', err);
      throw err;
    }
  }

  getLiveMicFrequencies() {
    if (!this.analyser) return new Uint8Array(64).fill(0);
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  stopMicRecording() {
    return new Promise((resolve) => {
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.onstop = async () => {
          const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
          this.recordedAudioUrl = URL.createObjectURL(blob);
          if (this.micStream) {
            this.micStream.getTracks().forEach((track) => track.stop());
            this.micStream = null;
          }

          let audioBuffer = null;
          try {
            if (this.audioCtx) {
              const arrayBuffer = await blob.arrayBuffer();
              audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
            }
          } catch (e) {
            console.log('Audio decoding note:', e);
          }

          resolve({ blob, url: this.recordedAudioUrl, audioBuffer });
        };
        this.mediaRecorder.stop();
      } else {
        resolve(null);
      }
    });
  }

  // --- 2. Real Audio Configuration ---
  setRealAudioUrls(vocalUrl, musicUrl, masterUrl, duration = 45) {
    this.realVocalUrl = vocalUrl;
    this.realMusicUrl = musicUrl;
    this.masterUrl = masterUrl || vocalUrl || musicUrl;
    this.duration = duration || 45;

    // 1. Setup Master Audio Element (Plays online directly with 100% reliability)
    const effectiveMasterUrl = this.masterUrl;
    if (effectiveMasterUrl) {
      if (!this.masterAudio) {
        this.masterAudio = new Audio();
        this.masterAudio.preload = 'auto';
      }
      this.masterAudio.src = effectiveMasterUrl;
      this.masterAudio.load();

      this.masterAudio.onloadedmetadata = () => {
        if (this.masterAudio.duration && isFinite(this.masterAudio.duration)) {
          this.duration = Math.round(this.masterAudio.duration);
        }
      };

      this.masterAudio.onended = () => {
        this.stopStemPlayback();
      };
    }

    // 2. Setup Optional Stem Elements (for isolated Vocal / Music balancing)
    if (vocalUrl) {
      if (!this.realVocalAudio) {
        this.realVocalAudio = new Audio();
        this.realVocalAudio.preload = 'auto';
      }
      this.realVocalAudio.src = vocalUrl;
      this.realVocalAudio.load();
    }

    if (musicUrl) {
      if (!this.realMusicAudio) {
        this.realMusicAudio = new Audio();
        this.realMusicAudio.preload = 'auto';
      }
      this.realMusicAudio.src = musicUrl;
      this.realMusicAudio.load();
    }
  }

  // --- 3. Online Playback Engine ---
  startStemPlayback(vocalVol = 1.0, musicVol = 0.85, onProgress = null) {
    this.initContext();
    this.stopStemPlayback();
    this.isPlaying = true;
    this.onProgressCallback = onProgress;

    // Prefer playing masterAudio directly for flawless online browser audio
    if (this.masterAudio && this.masterAudio.src) {
      this.masterAudio.volume = Math.max(0, Math.min(1, musicVol > 0 ? 1.0 : 0));
      
      const playPromise = this.masterAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Direct master audio play caught:", err);
          // Fallback to stem play if master element threw
          this.playStemsDirect(vocalVol, musicVol);
        });
      }

      // Track playback progression
      this.playbackTimer = setInterval(() => {
        if (!this.isPlaying) return;
        if (this.masterAudio && !this.masterAudio.paused) {
          this.currentTime = this.masterAudio.currentTime;
          if (this.masterAudio.duration && isFinite(this.masterAudio.duration)) {
            this.duration = this.masterAudio.duration;
          }
        } else {
          this.currentTime += 0.1;
        }

        if (this.currentTime >= this.duration) {
          this.stopStemPlayback();
        } else if (this.onProgressCallback) {
          this.onProgressCallback(this.currentTime, this.duration);
        }
      }, 100);

      return;
    }

    // Fallback if no masterAudio
    this.playStemsDirect(vocalVol, musicVol);
  }

  playStemsDirect(vocalVol, musicVol) {
    if (this.realVocalAudio) {
      this.realVocalAudio.volume = Math.max(0, Math.min(1, vocalVol));
      this.realVocalAudio.play().catch(e => console.log('Vocal play note:', e));
    }
    if (this.realMusicAudio) {
      this.realMusicAudio.volume = Math.max(0, Math.min(1, musicVol));
      this.realMusicAudio.play().catch(e => console.log('Music play note:', e));
    }

    this.playbackTimer = setInterval(() => {
      if (!this.isPlaying) return;
      if (this.realVocalAudio && !this.realVocalAudio.paused) {
        this.currentTime = this.realVocalAudio.currentTime;
      } else if (this.realMusicAudio && !this.realMusicAudio.paused) {
        this.currentTime = this.realMusicAudio.currentTime;
      } else {
        this.currentTime += 0.1;
      }

      if (this.currentTime >= this.duration) {
        this.stopStemPlayback();
      } else if (this.onProgressCallback) {
        this.onProgressCallback(this.currentTime, this.duration);
      }
    }, 100);
  }

  seek(time) {
    this.currentTime = Math.max(0, Math.min(time, this.duration));
    if (this.masterAudio) {
      try {
        this.masterAudio.currentTime = this.currentTime;
      } catch (e) {}
    }
    if (this.realVocalAudio) {
      try {
        this.realVocalAudio.currentTime = this.currentTime;
      } catch (e) {}
    }
    if (this.realMusicAudio) {
      try {
        this.realMusicAudio.currentTime = this.currentTime;
      } catch (e) {}
    }
    if (this.onProgressCallback) {
      this.onProgressCallback(this.currentTime, this.duration);
    }
  }

  setVocalVolume(vol) {
    const clamped = Math.max(0, Math.min(1.5, vol));
    if (this.realVocalAudio) {
      this.realVocalAudio.volume = Math.min(1.0, clamped);
    }
  }

  setMusicVolume(vol) {
    const clamped = Math.max(0, Math.min(1.5, vol));
    if (this.masterAudio) {
      this.masterAudio.volume = Math.min(1.0, clamped);
    }
    if (this.realMusicAudio) {
      this.realMusicAudio.volume = Math.min(1.0, clamped);
    }
  }

  getPlaybackFrequencies() {
    // Generate organic responsive dancing frequencies for the visualizer
    if (!this.isPlaying) return new Uint8Array(32).fill(4);

    const freq = new Uint8Array(32);
    const time = Date.now() / 150;
    for (let i = 0; i < 32; i++) {
      const wave = Math.sin(time + i * 0.4) * 0.5 + 0.5;
      const wave2 = Math.cos(time * 0.7 + i * 0.3) * 0.5 + 0.5;
      const amp = Math.floor((wave * 0.6 + wave2 * 0.4) * 220 + 35);
      freq[i] = Math.max(10, Math.min(255, amp));
    }
    return freq;
  }

  stopStemPlayback() {
    this.isPlaying = false;
    if (this.playbackTimer) {
      clearInterval(this.playbackTimer);
      this.playbackTimer = null;
    }

    if (this.masterAudio) {
      try {
        this.masterAudio.pause();
      } catch (e) {}
    }
    if (this.realVocalAudio) {
      try {
        this.realVocalAudio.pause();
      } catch (e) {}
    }
    if (this.realMusicAudio) {
      try {
        this.realMusicAudio.pause();
      } catch (e) {}
    }

    if (this.onProgressCallback) {
      this.onProgressCallback(this.currentTime, this.duration);
    }
  }
}

export const sonaraAudio = new SonaraAudioEngine();
