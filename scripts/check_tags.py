import urllib.request
import re

for tag in ['india', 'indian', 'asian', 'eastern', 'meditation']:
    url = f'https://mixkit.co/free-stock-music/tag/{tag}/'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        titles = [t.strip() for t in re.findall(r'<h[23][^>]*>([^<]+)</h[23]>', html) if t.strip()]
        mp3s = re.findall(r'https://assets\.mixkit\.co/music/[^"\'\s]+\.mp3', html)
        print(f"Tag {tag}: {len(titles)} titles, {len(mp3s)} mp3s")
        if titles:
            print("  Titles:", titles[:5])
        if mp3s:
            print("  MP3:", mp3s[0])
    except Exception as e:
        print(f"Error {tag}:", e)
