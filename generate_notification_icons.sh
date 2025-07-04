#!/bin/bash

# Source SVG
SRC="notification_icon.svg"

# Output base path
BASE="android/app/src/main/res"

# DPI scale map (dp = 24)
declare -A sizes
sizes=(
  [mdpi]=24
  [hdpi]=36
  [xhdpi]=48
  [xxhdpi]=72
  [xxxhdpi]=96
)

# Ensure rsvg-convert exists
if ! command -v rsvg-convert &> /dev/null; then
  echo "rsvg-convert not found. Install librsvg2-bin (Linux) or librsvg (Homebrew)."
  exit 1
fi

# Loop and export PNGs
for dpi in "${!sizes[@]}"; do
  outdir="${BASE}/drawable-${dpi}"
  outfile="${outdir}/ic_stat_notification.png"
  size="${sizes[$dpi]}"

  mkdir -p "$outdir"
  rsvg-convert "$SRC" -w "$size" -h "$size" -a -o "$outfile"

  echo "Generated: $outfile"
done

echo "All icons generated."
