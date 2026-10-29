import os
import requests
import subprocess

FFMPEG_EXE = r"C:\Users\indra\AppData\Local\Programs\Python\Python310\lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
OUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "audio"))
os.makedirs(OUT_DIR, exist_ok=True)

TRACKS = {
    "backing_bollywood": "File:Jason Shaw - ACOUSTIC MEDITATION.ogg",
    "backing_acoustic": "File:Jason Shaw - SOLO ACOUSTIC GUITAR.ogg",
    "backing_lofi": "File:Jason Shaw - GREEN LEAVES.ogg",
}

headers = {"User-Agent": "SonaraStudio/1.0 (contact@sonara.app)"}

for genre_key, title in TRACKS.items():
    print(f"Fetching metadata for {genre_key} ({title})...")
    api_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={requests.utils.quote(title)}&prop=imageinfo&iiprop=url&format=json"
    res = requests.get(api_url, headers=headers).json()
    pages = res.get("query", {}).get("pages", {})
    for page_id, page_data in pages.items():
        imageinfo = page_data.get("imageinfo", [])
        if imageinfo:
            direct_url = imageinfo[0]["url"]
            print(f"Downloading from {direct_url}...")
            audio_resp = requests.get(direct_url, headers=headers)
            temp_ogg = os.path.join(OUT_DIR, f"{genre_key}.ogg")
            with open(temp_ogg, "wb") as f:
                f.write(audio_resp.content)
            
            # Convert to MP3 using ffmpeg
            out_mp3 = os.path.join(OUT_DIR, f"{genre_key}.mp3")
            print(f"Converting to {out_mp3} via ffmpeg...")
            cmd = [
                FFMPEG_EXE, "-y", "-i", temp_ogg,
                "-vn", "-ar", "44100", "-ac", "2", "-b:a", "192k",
                out_mp3
            ]
            subprocess.run(cmd, check=True)
            if os.path.exists(temp_ogg):
                os.remove(temp_ogg)
            print(f"✓ {genre_key}.mp3 ready! ({os.path.getsize(out_mp3)} bytes)")

print("All studio instrumental backing tracks generated successfully!")
