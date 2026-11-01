#!/usr/bin/env python3
import sys
import os
from PIL import Image

def prepare_asset(src_path, dest_path, target_aspect, min_w, max_size_kb, focal_x=0.5, focal_y=0.5):
    with Image.open(src_path) as img:
        img = img.convert("RGB")
        w, h = img.size
        print(f"Source {src_path}: {w}x{h}")

        # Crop to target aspect ratio (width / height)
        current_aspect = w / h
        if current_aspect > target_aspect:
            # Wider than target -> crop width
            new_w = int(h * target_aspect)
            new_h = h
            left = int((w - new_w) * focal_x)
            top = 0
            right = left + new_w
            bottom = h
        else:
            # Taller than target -> crop height
            new_w = w
            new_h = int(w / target_aspect)
            left = 0
            top = int((h - new_h) * focal_y)
            right = w
            bottom = top + new_h

        cropped = img.crop((left, top, right, bottom))
        print(f"Cropped to aspect {target_aspect:.4f}: {cropped.size}")

        # Ensure width is at least min_w (upscale with high-quality Lanczos if needed)
        if cropped.width < min_w:
            scale = min_w / cropped.width
            target_h = int(cropped.height * scale)
            cropped = cropped.resize((min_w, target_h), Image.Resampling.LANCZOS)
            print(f"Upscaled to min width {min_w}: {cropped.size}")
        elif cropped.width > min_w * 1.25:
            # If much larger than min_w, scale down slightly to save file size while staying well above min_w
            target_w = int(min_w * 1.1)
            target_h = int(target_w / target_aspect)
            cropped = cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)
            print(f"Resized to optimal dimension: {cropped.size}")

        os.makedirs(os.path.dirname(dest_path), exist_ok=True)

        quality = 85
        cropped.save(dest_path, "WEBP", quality=quality, method=6)
        size_kb = os.path.getsize(dest_path) / 1024

        while size_kb > max_size_kb and quality > 50:
            quality -= 5
            cropped.save(dest_path, "WEBP", quality=quality, method=6)
            size_kb = os.path.getsize(dest_path) / 1024

        print(f"Saved {dest_path}: {cropped.width}x{cropped.height}, {size_kb:.1f} KB (quality={quality})")
        return cropped.width, cropped.height, size_kb

if __name__ == "__main__":
    src = sys.argv[1]
    dest = sys.argv[2]
    aspect = float(sys.argv[3])
    min_w = int(sys.argv[4])
    max_kb = float(sys.argv[5])
    focal_x = float(sys.argv[6]) if len(sys.argv) > 6 else 0.5
    focal_y = float(sys.argv[7]) if len(sys.argv) > 7 else 0.5
    prepare_asset(src, dest, aspect, min_w, max_kb, focal_x, focal_y)
