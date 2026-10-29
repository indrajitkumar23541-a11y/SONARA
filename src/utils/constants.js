// Pre-loaded inspirations, genres, scales, instrument layers, and sample voice profiles

export const MUSICAL_SCALES = [
  { id: 'Em', name: 'E Minor', mood: 'Romantic Bollywood (Arijit Singh / Mohit Chauhan Vibe)', root: 'E' },
  { id: 'Am', name: 'A Minor', mood: 'Soulful & Melancholic (Kumar Sanu / Atif Aslam Vibe)', root: 'A' },
  { id: 'Dm', name: 'D Minor', mood: 'Deep Emotional Passion & Ghazal', root: 'D' },
  { id: 'Cmaj', name: 'C Major', mood: 'Uplifting, Bright & Celebratory', root: 'C' },
  { id: 'Gmaj', name: 'G Major', mood: 'Sweet Acoustic Romance & Unplugged', root: 'G' },
  { id: 'Fmaj', name: 'F Major', mood: 'Cinematic Dreamy & Ethereal', root: 'F' },
];

export const INSTRUMENT_LAYERS = [
  { id: 'guitar', name: 'Acoustic Fingerstyle Guitar', desc: 'Warm nylon & steel string arpeggios', icon: 'Music' },
  { id: 'tabla', name: 'Tabla & Dholak Percussion', desc: 'Traditional Indian rhythm & rhythmic taal', icon: 'Disc' },
  { id: 'flute', name: 'Indian Bamboo Flute (Bansuri)', desc: 'Soulful melodic fills between lyrical lines', icon: 'Wind' },
  { id: 'strings', name: 'Romantic Orchestral Strings', desc: 'Cinematic violin & cello swells on chorus', icon: 'Layers' },
  { id: 'piano', name: 'Grand Piano Chords', desc: 'Rich acoustic grand piano harmonies', icon: 'Grid' },
];

export const GENRES = [
  {
    id: 'bollywood',
    name: 'Bollywood Romantic',
    vibe: 'Arijit & Kumar Sanu Style (Strings, Guitar, Tabla)',
    emoji: '💖',
    bpm: 102,
    defaultScale: 'Em',
    color: '#ec4899',
    tags: ['Acoustic Guitar', 'Bansuri Flute', 'Tabla Taal', 'Strings Swell'],
  },
  {
    id: 'lofi',
    name: 'Lo-Fi Ghazal & Sukoon',
    vibe: 'Late Night Soulful Poetry with Warm Beats',
    emoji: '☕',
    bpm: 82,
    defaultScale: 'Am',
    color: '#a855f7',
    tags: ['Vinyl Crackle', 'Muted Piano', 'Warm Sub-Bass', 'Soft Echo'],
  },
  {
    id: 'acoustic',
    name: 'Unplugged Guitar & Lori',
    vibe: 'Pure Raw Emotional Guitar, Flute & Cello',
    emoji: '🎸',
    bpm: 92,
    defaultScale: 'Gmaj',
    color: '#f59e0b',
    tags: ['Fingerstyle Guitar', 'Warm Room Reverb', 'Organic Resonance'],
  },
  {
    id: 'pop',
    name: 'Bollywood Party & Pop',
    vibe: 'Modern Radio Hit (Punchy Beat & Synths)',
    emoji: '🎉',
    bpm: 124,
    defaultScale: 'Cmaj',
    color: '#00f2fe',
    tags: ['Punchy Kick', 'Bright Harmonies', 'Synth Strings'],
  },
  {
    id: 'cinematic',
    name: 'Epic Cinematic Romance',
    vibe: 'Grand Orchestral Film Climax',
    emoji: '✨',
    bpm: 112,
    defaultScale: 'Dm',
    color: '#10b981',
    tags: ['Full Symphony', 'Dramatic Timpani', 'Ethereal Harmonies'],
  },
];

export const EASY_THEMES = [
  {
    id: 'romantic',
    title: 'Romantic Geet',
    subtitle: 'Pyar aur jazbaat bhara gaana',
    emoji: '💖',
    color: '#ec4899',
    genre: 'bollywood',
    scale: 'Em',
    presetId: 'bolly_romantic'
  },
  {
    id: 'birthday',
    title: 'Birthday Song',
    subtitle: 'Janamdin ki dheron badhaiyan',
    emoji: '🎂',
    color: '#f59e0b',
    genre: 'pop',
    scale: 'Cmaj',
    presetId: 'birthday_special'
  },
  {
    id: 'bhajan',
    title: 'Bhajan & Sukoon',
    subtitle: 'Mann ki shanti aur bhakti',
    emoji: '🌸',
    color: '#10b981',
    genre: 'acoustic',
    scale: 'Gmaj',
    presetId: 'bhajan_peace'
  },
  {
    id: 'party',
    title: 'Party & Dholak',
    subtitle: 'Nacho gaao dhoom machao',
    emoji: '🥳',
    color: '#00f2fe',
    genre: 'pop',
    scale: 'Cmaj',
    presetId: 'party_masti'
  },
  {
    id: 'lori',
    title: 'Meethi Lori (Kids)',
    subtitle: 'Chanda mama aur pyari lori',
    emoji: '👶',
    color: '#a855f7',
    genre: 'acoustic',
    scale: 'Gmaj',
    presetId: 'lori_kids'
  },
  {
    id: 'dosti',
    title: 'Dosti & Yaari',
    subtitle: 'Sachhe yaar ke naam geet',
    emoji: '🤝',
    color: '#38bdf8',
    genre: 'bollywood',
    scale: 'Em',
    presetId: 'dosti_yaari'
  }
];

export const LYRICS_PRESETS = [
  {
    id: 'bolly_romantic',
    title: 'Tere Bina Ye Shaam',
    genre: 'bollywood',
    scale: 'Em',
    lyrics: `[Verse 1]
Tere bina ye shaam dhal na saki
Hawa bhi chupke se keh ke gayi
Teri gali se guzri jo roshni
Dil me nayi ek aas jagi

[Chorus]
Tu hi meri dhoon tu hi fasaana
Dil ne seekha tujhse muskurana
Saansein judi hain tere naam se
Ab na juda ho ye aashiyana`,
  },
  {
    id: 'birthday_special',
    title: 'Janamdin Ki Badhai (Birthday Song)',
    genre: 'pop',
    scale: 'Cmaj',
    lyrics: `[Verse 1]
Baar baar din ye aaye
Baar baar dil ye gaaye
Tu jiye hazaron saal
Yehi hai meri aarzoo

[Chorus]
Happy birthday to you
Khushiyon se bhare har pal
Aasman ke taare bhi
Tujhe dene aayein dua`,
  },
  {
    id: 'bhajan_peace',
    title: 'Mann Me Shanti (Peace & Devotion)',
    genre: 'acoustic',
    scale: 'Gmaj',
    lyrics: `[Verse 1]
Bhor bhaye pankhi bole
Mann mandir ke taare khule
Sur me dhoon aisi baje
Har mushkil aasan lage

[Chorus]
Shanti mile prem mile
Duniya me sabka bhala karein
Jeevan ek pyara sa geet
Prem se har dil ko jeetein`,
  },
  {
    id: 'party_masti',
    title: 'Dholak Baje (Party Dance)',
    genre: 'pop',
    scale: 'Cmaj',
    lyrics: `[Verse 1]
Dholak baje dhoom machi hai
Khushiyon ki ye shaam saji hai
Gham ko bhula ke jhoomo saare
Taaron jaisi raat jagi hai

[Chorus]
Nacho nacho dhoom machao
Sab milkar ye geet gungunao
Zindagi hai rang-birangi
Dil ki har ek baat batao`,
  },
  {
    id: 'lori_kids',
    title: 'Chanda Mama (Kids Sweet Lullaby)',
    genre: 'acoustic',
    scale: 'Gmaj',
    lyrics: `[Verse 1]
Chanda mama door ke
Puye pakayein boor ke
Aap khayein thali me
Munne ko de pyali me

[Chorus]
So ja mere nanhe pyare
Aankhon me khwab sajayein
Meethi meethi lori suno
Subah nayi roshni layein`,
  },
  {
    id: 'dosti_yaari',
    title: 'Yaaron Ki Yaari (Friendship)',
    genre: 'bollywood',
    scale: 'Em',
    lyrics: `[Verse 1]
Tere jaisa yaar kahan
Kahan aisa yaarana
Yaad karegi duniya
Tera mera afsaana

[Chorus]
Meri zindagi sawari
Mujhko gale lagake
Baitha diya falak pe
Mujhe khaak se uthake`,
  },
];

export const SPEAKING_SCRIPTS = [
  {
    id: 'hindi_warm',
    title: 'Hindi Pyara Geet (Recommended)',
    text: 'Namaste! Yeh meri aawaz hai jo SONARA AI Studio ke liye calibrate ho rahi hai. Sur aur taal ke saath meri aawaz ek naye gaane me rang bharegi.',
  },
  {
    id: 'english_modern',
    title: 'English Melody Script',
    text: 'Hello! I am recording my voice for SONARA AI Studio to sing a sweet song with wonderful music.',
  },
];

export const QUICK_SONG_PROMPTS = [
  {
    id: 'p1',
    emoji: '🌧️',
    title: 'Monsoon Romance',
    prompt: 'Ek romantic Bollywood geet barish ke mausam ke upar jisme dil ki baat ho',
    genre: 'bollywood',
    scale: 'Em',
  },
  {
    id: 'p2',
    emoji: '💔',
    title: 'Soulful Sad Song',
    prompt: 'Ruk si gayi hai zindagi tere jaane ke baad, dard aur yaadon bhara geet',
    genre: 'lofi',
    scale: 'Am',
  },
  {
    id: 'p3',
    emoji: '🎉',
    title: 'Party & Dance',
    prompt: 'Doston ke sath high-energy Bollywood dance party track, DJ beats aur masti',
    genre: 'pop',
    scale: 'Cmaj',
  },
  {
    id: 'p4',
    emoji: '🌸',
    title: 'Bhajan & Sukoon',
    prompt: 'Subah ki shanti, mann ka sukoon aur prabhu bhakti ka pyara geet',
    genre: 'acoustic',
    scale: 'Gmaj',
  },
  {
    id: 'p5',
    emoji: '🤝',
    title: 'Dosti Anthem',
    prompt: 'College aur school ke yaar, zindagi bhar sath nibhane wali sacchi dosti',
    genre: 'bollywood',
    scale: 'Em',
  },
  {
    id: 'p6',
    emoji: '🎂',
    title: 'Birthday Mubarak',
    prompt: 'Janamdin ki badhai, cake cutting aur dheron khushiyon bhara birthday song',
    genre: 'pop',
    scale: 'Cmaj',
  },
];

export const SAMPLE_VOICE_PROFILES = [
  {
    id: 'profile_user',
    name: 'Mera AI Voice Avatar',
    tag: 'Active Cloned Avatar',
    role: 'Your Personal Vocal Identity',
    desc: 'Aapki apni aawaz ka digital clone, jisme aapke jaisi dynamic singing hogi',
    emoji: '🎙️',
    avatarGradiant: 'linear-gradient(135deg, #00f2fe, #10b981)',
    voiceGender: 'male',
    isCustom: true,
    vocalStats: {
      pitchRange: 'A2 - E4 (Warm Baritone)',
      resonance: '99% Calibrated',
      warmth: 'Natural Indian Acoustic',
    },
  },
  {
    id: 'profile_aarav',
    name: 'Aarav (Bollywood Baritone)',
    tag: 'Studio Legend Avatar',
    role: 'Arijit & Mohit Chauhan Timbre',
    desc: 'Dil ko chhoo lene wali deep romantic aur acoustic vocal warmth',
    emoji: '👨‍🎤',
    avatarGradiant: 'linear-gradient(135deg, #00f2fe, #2563eb)',
    voiceGender: 'male',
    isCustom: false,
    vocalStats: {
      pitchRange: 'G2 - F4 (Lead Baritone)',
      resonance: '100% Studio Clean',
      warmth: 'Deep Romantic',
    },
  },
  {
    id: 'profile_zara',
    name: 'Zara (Melodic Soprano)',
    tag: 'Studio Legend Avatar',
    role: 'Shreya Ghoshal & Sunidhi Vibe',
    desc: 'Meethi, surili aur emotional melody jo har geet me jaan daal de',
    emoji: '👩‍🎤',
    avatarGradiant: 'linear-gradient(135deg, #ec4899, #f43f5e)',
    voiceGender: 'female',
    isCustom: false,
    vocalStats: {
      pitchRange: 'C4 - A5 (Melodic Soprano)',
      resonance: '100% Crystal Polish',
      warmth: 'Sweet Expressive',
    },
  },
  {
    id: 'profile_kabir',
    name: 'Kabir (90s Golden Sufi)',
    tag: 'Studio Legend Avatar',
    role: 'Kumar Sanu & Udit Narayan Vibe',
    desc: '90s ki classic romantic dhoon aur khuli aawaz me classical touches',
    emoji: '👨‍🦳',
    avatarGradiant: 'linear-gradient(135deg, #f59e0b, #d97706)',
    voiceGender: 'male',
    isCustom: false,
    vocalStats: {
      pitchRange: 'B2 - E4 (Golden Tenor)',
      resonance: '100% Vintage Warmth',
      warmth: 'Nostalgic Resonance',
    },
  },
];
