#!/bin/bash
set -e

mkdir -p public/videos/work
mkdir -p public/videos/bts

WORK_IMAGES=(
  "work-01-trail-running.webp"
  "work-02-road-cycling.webp"
  "work-03-track-sprinter.webp"
  "work-04-basketball-court.webp"
  "work-05-swimmer-pool.webp"
  "work-06-soccer-pitch.webp"
  "work-07-boxer-gym.webp"
  "work-08-snowboarder-mountain.webp"
)

echo "Generating 8 work videos..."
for i in "${!WORK_IMAGES[@]}"; do
  idx=$((i + 1))
  num=$(printf "%02d" $idx)
  img="public/images/work/${WORK_IMAGES[$i]}"
  out="public/videos/work/work-${num}.mp4"
  ffmpeg -y -loop 1 -i "$img" -c:v libx264 -t 2 -pix_fmt yuv420p \
    -vf "scale=540:400:force_original_aspect_ratio=increase,crop=540:400" \
    -crf 28 -an "$out" 2>/dev/null
  echo "  Created $out ($(du -h "$out" | cut -f1))"
done

BTS_IMAGES=(
  "bts-01-camera-track.webp"
  "bts-02-camera-rooftop.webp"
  "bts-03-studio-lighting.webp"
  "bts-04-director-monitor.webp"
  "bts-05-drone-ground.webp"
  "bts-06-clapperboard.webp"
  "bts-07-gimbal-rig.webp"
  "bts-08-boom-mic.webp"
  "bts-09-editing-suite.webp"
  "bts-10-photographer-athlete.webp"
  "bts-11-equipment-cases.webp"
  "bts-12-crew-playback.webp"
)

echo "Generating 12 BTS videos..."
for i in "${!BTS_IMAGES[@]}"; do
  idx=$((i + 1))
  num=$(printf "%02d" $idx)
  img="public/images/bts/${BTS_IMAGES[$i]}"
  out="public/videos/bts/bts-${num}.mp4"
  ffmpeg -y -loop 1 -i "$img" -c:v libx264 -t 2 -pix_fmt yuv420p \
    -vf "scale=400:527:force_original_aspect_ratio=increase,crop=400:527" \
    -crf 28 -an "$out" 2>/dev/null
  echo "  Created $out ($(du -h "$out" | cut -f1))"
done

echo "All 20 videos generated successfully!"
