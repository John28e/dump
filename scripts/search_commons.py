import urllib.request
import json
import re
import sys

def search_category(category, limit=20):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=Category:{urllib.parse.quote(category)}&gcmlimit={limit}&gcmtype=file&prop=imageinfo&iiprop=url|size|mime|extmetadata&format=json"
    req = urllib.request.Request(url, headers={"User-Agent": "AntigravityImageSearch/1.0 (john@example.com)"})
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    pages = data.get("query", {}).get("pages", {})
    results = []
    for pid, page in pages.items():
        title = page.get("title", "")
        ii = page.get("imageinfo", [{}])[0]
        mime = ii.get("mime", "")
        if not mime.startswith("image/jpeg") and not mime.startswith("image/png"):
            continue
        width = ii.get("width", 0)
        height = ii.get("height", 0)
        if width < 1000 and height < 1000:
            continue
        img_url = ii.get("url", "")
        desc_url = ii.get("descriptionurl", "")
        meta = ii.get("extmetadata", {})
        artist = meta.get("Artist", {}).get("value", "Unknown")
        artist = re.sub(r"<[^>]+>", "", artist).strip()
        license_name = meta.get("LicenseShortName", {}).get("value", "Unknown")
        results.append({
            "title": title,
            "width": width,
            "height": height,
            "url": img_url,
            "desc_url": desc_url,
            "artist": artist[:40],
            "license": license_name
        })
    return results

def search_query(query, limit=10):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrlimit={limit}&gsrnamespace=6&prop=imageinfo&iiprop=url|size|mime|extmetadata&format=json"
    req = urllib.request.Request(url, headers={"User-Agent": "AntigravityImageSearch/1.0 (john@example.com)"})
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    pages = data.get("query", {}).get("pages", {})
    results = []
    for pid, page in pages.items():
        title = page.get("title", "")
        ii = page.get("imageinfo", [{}])[0]
        mime = ii.get("mime", "")
        if not mime.startswith("image/jpeg") and not mime.startswith("image/png"):
            continue
        width = ii.get("width", 0)
        height = ii.get("height", 0)
        if width < 1000 and height < 1000:
            continue
        img_url = ii.get("url", "")
        desc_url = ii.get("descriptionurl", "")
        meta = ii.get("extmetadata", {})
        artist = meta.get("Artist", {}).get("value", "Unknown")
        artist = re.sub(r"<[^>]+>", "", artist).strip()
        license_name = meta.get("LicenseShortName", {}).get("value", "Unknown")
        results.append({
            "title": title,
            "width": width,
            "height": height,
            "url": img_url,
            "desc_url": desc_url,
            "artist": artist[:40],
            "license": license_name
        })
    return results

if __name__ == "__main__":
    mode = sys.argv[1]
    arg = sys.argv[2]
    limit = int(sys.argv[3]) if len(sys.argv) > 3 else 10
    if mode == "cat":
        res = search_category(arg, limit)
    else:
        res = search_query(arg, limit)
    for r in res:
        print(f"TITLE: {r['title']} ({r['width']}x{r['height']})")
        print(f"  ARTIST: {r['artist']} | LICENSE: {r['license']}")
        print(f"  URL: {r['url']}")
        print(f"  DESC: {r['desc_url']}")
