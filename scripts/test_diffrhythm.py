import time
from gradio_client import Client, handle_file

print("Connecting to DiffRhythm Neural Music Engine...")
client = Client("ASLP-lab/DiffRhythm")

lyrics = """[00:00.00] Tere bina ye shaam adhoori
[00:06.00] Baaton me kyu itni doori
[00:12.00] Chalte chalte ruk gaye raste
[00:18.00] Aankhon me bas teri soorat thi"""

style_prompt = "Bollywood romantic acoustic, soulful male singing, acoustic guitar, soft strings, emotional vocal, 80 bpm"

print("Submitting song synthesis request...")
start_t = time.time()
try:
    result = client.predict(
        lrc=lyrics,
        ref_audio_path=handle_file("https://github.com/gradio-app/gradio/raw/main/test/test_files/audio_sample.wav"),
        text_prompt=style_prompt,
        seed=42,
        randomize_seed=False,
        steps=32,
        cfg_strength=4.0,
        file_type="mp3",
        odeint_method="euler",
        preference_infer="quality first",
        Music_Duration=95,
        api_name="/infer_music"
    )
    print(f"✓ DiffRhythm completed in {round(time.time() - start_t, 1)}s!")
    print("Generated audio path:", result)
    
    import shutil
    shutil.copyfile(result, "public/audio/diffrhythm_test.mp3")
    print("Saved to public/audio/diffrhythm_test.mp3 successfully!")
except Exception as e:
    print("DiffRhythm Error:", e)
