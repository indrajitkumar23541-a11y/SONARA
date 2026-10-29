import urllib.request
import re

for cat in ['romantic', 'flute', 'traditional', 'acoustic']:
    url = f'https://mixkit.co/free-stock-music/{cat}/'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        mp3s = re.findall(r'https://assets\.mixkit\.co/music/[^"\']+\.mp3', html)
        print(f'Category {cat} found {len(mp3s)} mp3s:')
        for m in list(set(mp3s))[:3]:
            print('  ', m)
    except Exception as e:
        print(f'Error fetching {cat}:', e)
