import urllib.request
import re
import json

req = urllib.request.Request('https://mixkit.co/free-stock-music/romantic/', headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')

# Find music cards or JSON data
titles = re.findall(r'data-audio-player-title="([^"]+)"', html)
urls = re.findall(r'data-audio-player-preview-url="([^"]+)"', html)

print(f"Found {len(titles)} tracks:")
for t, u in zip(titles[:10], urls[:10]):
    print(f"Title: {t} | URL: {u}")
