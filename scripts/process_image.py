#!/usr/bin/env python3
import sys
import os
import urllib.request
from PIL import Image

def process_image(src_url, dest_path, target_aspect, min_dim, max_size_kb, focal_y=0.5, focal_x=0.5):
    """
    target_aspect: width / height (e.g. 348/259 = 1.3436 for work; 400/527 = 0.759 for bts)
    min_dim: (min_w, min_h) minimum dimensions required
    max_size_kb: maximum file size in KB
    """
    tmp_file = "/tmp/raw_download.jpg"
    req = urllib.request.Request(
        src_url,
        headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}
    )
    with urllib.request.urlopen(req) as resp, open(tmp_file, "wb") as f:
        f.write(resp.read())

    with Image.open(tmp_file) as img:
        img = img.convert("RGB")
        w, h = img.size
        print(f"Downloaded image: {w}x{h}")
        if w < min_dim[0] or h < min_dim[1]:
            print(f"Warning: Image {w}x{h} smaller than requested min {min_dim[0]}x{min_dim[1]}")

        # Calculate crop box to match target_aspect (width / height)
        current_aspect = w / h
        if current_aspect > target_aspect:
            # Image is wider than needed: crop width
            new_w = int(h * target_aspect)
            new_h = h
            left = int((w - new_w) * focal_x)
            top = 0
            right = left + new_w
            bottom = h
        else:
            # Image is taller than needed: crop height
            new_w = w
            new_h = int(w / target_aspect)
            left = 0
            top = int((h - new_h) * focal_y)
            right = w
            bottom = top + new_h

        cropped = img.crop((left, top, right, bottom))

        # Determine reasonable export dimensions to maintain high resolution while keeping under max_size_kb
        # For work: target ~1200x893 (aspect 348/259)
        # For bts: target ~900x1186 (aspect 400/527)
        # For mosaic: ~1000-1400px
        # For og: 1200x630
        max_export_w = 1400 if target_aspect > 1 else 1000
        if cropped.width > max_export_w:
            scale = max_export_w / cropped.width
            cropped = cropped.resize((int(cropped.width * scale), int(cropped.height * scale)), Image.Resampling.LANCZOS)

        os.makedirs(os.path.dirname(dest_path), exist_ok=True)

        quality = 84
        cropped.save(dest_path, "WEBP", quality=quality, method=6)
        size_kb = os.path.getsize(dest_path) / 1024

        # If too large, lower quality slightly
        while size_kb > max_size_kb and quality > 60:
            quality -= 6
            cropped.save(dest_path, "WEBP", quality=quality, method=6)
            size_kb = os.path.getsize(dest_path) / 1024

        print(f"Saved {dest_path}: {cropped.width}x{cropped.height}, {size_kb:.1f} KB (quality={quality})")
        return cropped.width, cropped.height, size_kb

if __name__ == "__main__":
    url = sys.argv[1]
    dest = sys.argv[2]
    aspect = float(sys.argv[3])
    min_w = int(sys.argv[4])
    min_h = int(sys.argv[5])
    max_kb = float(sys.argv[6])
    process_image(url, dest, aspect, (min_w, min_h), max_kb)

