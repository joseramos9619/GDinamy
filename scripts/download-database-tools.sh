#!/usr/bin/env bash
# Descarga los binarios oficiales de MongoDB Database Tools (mongodump, mongorestore,
# mongoexport, mongoimport) y los coloca en src-tauri/binaries/ con el sufijo de
# target-triple que exige el mecanismo de sidecars de Tauri.
set -euo pipefail

VERSION="${MONGODB_TOOLS_VERSION:-100.14.0}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BIN_DIR="$ROOT_DIR/src-tauri/binaries"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

TOOLS=(mongodump mongorestore mongoexport mongoimport)

mkdir -p "$BIN_DIR"

download_linux() {
  local url="https://fastdl.mongodb.org/tools/db/mongodb-database-tools-ubuntu2204-x86_64-${VERSION}.tgz"
  local archive="$TMP_DIR/linux.tgz"
  echo "Descargando Database Tools para Linux (${VERSION})..."
  curl -fsSL "$url" -o "$archive"

  local extract_dir="$TMP_DIR/linux"
  mkdir -p "$extract_dir"
  tar -xzf "$archive" -C "$extract_dir" --strip-components=1

  for tool in "${TOOLS[@]}"; do
    cp "$extract_dir/bin/$tool" "$BIN_DIR/${tool}-x86_64-unknown-linux-gnu"
    chmod +x "$BIN_DIR/${tool}-x86_64-unknown-linux-gnu"
  done
}

download_windows() {
  local url="https://fastdl.mongodb.org/tools/db/mongodb-database-tools-windows-x86_64-${VERSION}.zip"
  local archive="$TMP_DIR/windows.zip"
  echo "Descargando Database Tools para Windows (${VERSION})..."
  curl -fsSL "$url" -o "$archive"

  local extract_dir="$TMP_DIR/windows"
  mkdir -p "$extract_dir"
  unzip -q "$archive" -d "$extract_dir"
  local bin_dir
  bin_dir="$(find "$extract_dir" -type d -name bin | head -1)"

  for tool in "${TOOLS[@]}"; do
    cp "$bin_dir/${tool}.exe" "$BIN_DIR/${tool}-x86_64-pc-windows-msvc.exe"
  done
}

download_linux
download_windows

echo "Binarios listos en $BIN_DIR:"
ls -la "$BIN_DIR"
