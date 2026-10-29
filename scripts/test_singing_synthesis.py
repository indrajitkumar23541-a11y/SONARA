import asyncio
import edge_tts
import subprocess
import os

FFMPEG_EXE = r"C:\Users\indra\AppData\Local\Programs\Python\Python310\lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
OUT_DIR = "public/audio"

async def test_singing():
    # 1. Melodic phrasing:
    # Instead of flat prose, we stretch key emotional words and format them musically
    # In singing, vowels are prolonged: "Tere binaaaa ... ye shaaam adhoooorii"
    lyrics_lines = [
        "Tere binaaa ... ye shaaam adhoori",
        "Baaton me kyun ... itnii doori",
        "Chalte chalte ... ruk gaye raste",
        "Aankhon me bas ... terii soorat thi"
    ]
    
    # We synthesize each line with musical pacing
    line_files = []
    pitches = ["+10Hz", "+18Hz", "+14Hz", "+8Hz"]  # Melodic contour (rising in middle, resolving at end)
    
    for i, line in enumerate(lyrics_lines):
        out_line = os.path.join(OUT_DIR, f"test_line_{i}.mp3")
        pitch = pitches[i % len(pitches)]
        comm = edge_tts.Communicate(text=line, voice="hi-IN-MadhurNeural", rate="-24%", pitch=pitch)
        await comm.save(out_line)
        line_files.append(out_line)
    
    # Concatenate lines with musical breath intervals
    concat_list = os.path.join(OUT_DIR, "concat.txt")
    with open(concat_list, "w") as f:
        for lf in line_files:
            f.write(f"file '{os.path.abspath(lf)}'\n")
            
    raw_vocal = os.path.join(OUT_DIR, "test_raw_vocal.mp3")
    subprocess.run([FFMPEG_EXE, "-y", "-f", "concat", "-safe", "0", "-i", concat_list, "-c", "copy", raw_vocal], check=True)
    
    # Apply Musical Studio Processing:
    # 1. Vibrato filter (5.4 Hz natural human singing vibrato)
    # 2. Presence EQ (3.2 kHz vocal clarity boost)
    # 3. Optical compression (smooth dynamic range)
    # 4. Studio plate reverb (tailored delay and decay for Bollywood romance)
    studio_vocal = os.path.join(OUT_DIR, "test_studio_singing_vocal.mp3")
    vocal_filter = (
        "vibrato=f=5.2:d=0.22,"
        "equalizer=f=3200:t=q:w=1.2:g=3.2,"
        "equalizer=f=12000:t=q:w=1:g=2.5,"
        "equalizer=f=220:t=q:w=1:g=-1.8,"
        "acompressor=threshold=-14dB:ratio=3:attack=10:release=180,"
        "aecho=0.8:0.7:55:0.25"
    )
    subprocess.run([FFMPEG_EXE, "-y", "-i", raw_vocal, "-af", vocal_filter, "-ar", "44100", "-b:a", "192k", studio_vocal], check=True)
    
    # Mix with the new authentic Bollywood acoustic instrumental!
    master_out = os.path.join(OUT_DIR, "test_master_new_song.mp3")
    backing_track = os.path.join(OUT_DIR, "backing_bollywood.mp3")
    
    # Mix vocal (prominent) + backing (flute + acoustic piano + strings)
    mix_filter = (
        "[0:a]volume=1.45[v];"
        "[1:a]volume=0.75[m];"
        "[v][m]amix=inputs=2:duration=first:dropout_transition=2,"
        "loudnorm=I=-14:TP=-1.5:LRA=10"
    )
    subprocess.run([
        FFMPEG_EXE, "-y",
        "-i", studio_vocal,
        "-i", backing_track,
        "-filter_complex", mix_filter,
        "-ar", "44100", "-b:a", "256k",
        master_out
    ], check=True)
    
    print("✓ Successfully generated test_master_new_song.mp3!")

asyncio.run(test_singing())
