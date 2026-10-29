import subprocess

ffmpeg_exe = r'C:\Users\indra\AppData\Local\Programs\Python\Python310\lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe'

for track in ['romantic_acoustic.mp3', 'indian_meditation.mp3']:
    res = subprocess.run([ffmpeg_exe, '-i', f'public/audio/{track}'], stderr=subprocess.PIPE, text=True)
    for l in res.stderr.splitlines():
        if 'Duration' in l or 'Stream' in l:
            print(track, ':', l)
