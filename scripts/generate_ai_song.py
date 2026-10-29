import os
import sys
import asyncio
from pathlib import Path

# Add project root to path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from backend.main import generate_song, SongGenerationRequest, get_audio_duration

async def main():
    print("=" * 60)
    print("🎵 SONARA AI Studio: Generating Full Song from Prompt...")
    print("=" * 60)

    prompt_lyrics = """[Verse 1]
Tere bina ye shaam dhal na saki
Hawa bhi chupke se keh ke gayi
Teri gali se guzri jo roshni
Dil me nayi ek aas jagi

[Chorus]
Tu hi meri dhoon tu hi fasaana
Dil ne seekha tujhse muskurana
Saansein judi hain tere naam se
Ab na juda ho ye aashiyana"""

    req = SongGenerationRequest(
        lyrics=prompt_lyrics,
        genre_id="bollywood",
        musical_scale="Em",
        voice_profile_id="profile_user",
        voice_gender="male",
        vocal_tuning=50,
        vocal_reverb=40,
        enable_harmonies=True,
        enable_sidechain=True,
        enable_mastering=True,
        instrument_layers=["guitar", "tabla", "flute", "strings"]
    )

    print(f"Lyrics Prompt:\n{prompt_lyrics}\n")
    print("Genre: Bollywood Romantic (102 BPM)")
    print("Musical Scale: E Minor (Arijit / Mohit Chauhan Style)")
    print("Harmonies: Double-Tracking Active (+3 semitones stereo chorus)")
    print("Mastering: -14 LUFS Broadcast Standard\n")
    print("🚀 Synthesizing audio pipeline...")

    result = await generate_song(req)

    print("\n" + "=" * 60)
    print("🎉 SONG GENERATION COMPLETE!")
    print("=" * 60)
    print(f"Song ID:        {result.get('song_id')}")
    print(f"Status:         {result.get('status')}")
    print(f"Engine:         {result.get('engine', 'Melodic Acoustic Studio Engine')}")
    print(f"Duration:       {result.get('duration')} seconds")
    print(f"Master URL:     {result.get('master_url')}")
    print(f"Vocals URL:     {result.get('vocal_url')}")
    print(f"Instrumental:   {result.get('music_url')}")
    print(f"Mastering:      {result.get('mastering_lufs')}")
    print(f"Message:        {result.get('message')}")

    master_path = PROJECT_ROOT / "public" / result.get('master_url').lstrip("/")
    if master_path.exists():
        size_kb = round(os.path.getsize(master_path) / 1024, 1)
        print(f"\n✓ Verified Output File: {master_path}")
        print(f"✓ Master File Size:    {size_kb} KB")
        # Copy to root as sonara_latest_generated_song.mp3 for easy user access
        shutil_dest = PROJECT_ROOT / "sonara_latest_generated_song.mp3"
        import shutil
        shutil.copyfile(master_path, shutil_dest)
        print(f"✓ Saved master copy to: {shutil_dest}")

    print("\nKaraoke Timed Lines:")
    for line in result.get("lines", []):
        print(f"  [{line['start_time']}s - {line['end_time']}s] {line['text']}")

if __name__ == "__main__":
    asyncio.run(main())
