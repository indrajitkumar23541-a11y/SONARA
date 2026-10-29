import time
from gradio_client import Client

print("Connecting to DiffRhythm2 Neural Music Generator...")
client = Client("ASLP-lab/DiffRhythm2")

lyrics = """[start]
[intro]
[verse]
Tere bina ye shaam adhoori
Baaton me kyu itni doori
Chalte chalte ruk gaye raste
Aankhon me bas teri soorat thi
[chorus]
Tu hi meri dhoon tu hi fasaana
Dil ne seekha tujhse muskurana
[outro]"""

style_prompt = "Indian acoustic romantic, emotional singing voice, acoustic guitar, soft piano, strings, 85 bpm"

print("Submitting inference request to DiffRhythm2...")
start_t = time.time()
try:
    result = client.predict(
        lrc=lyrics,
        audio_prompt=None,
        text_prompt=style_prompt,
        seed=101,
        randomize_seed=True,
        steps=16,
        cfg_strength=1.3,
        file_type="mp3",
        odeint_method="euler",
        api_name="/infer_music"
    )
    print(f"✓ DiffRhythm2 completed in {round(time.time() - start_t, 1)}s!")
    print("Result audio path:", result)
    
    import shutil
    shutil.copyfile(result, "public/audio/diffrhythm2_generated_song.mp3")
    print("✓ Saved to public/audio/diffrhythm2_generated_song.mp3 successfully!")
except Exception as e:
    print("DiffRhythm2 Error:", e)
