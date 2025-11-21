#!/usr/bin/env bash
# AiCollabFortheKids - Atomic Release Activation Helper
# Usage: ./activate-release.sh dist-YYYYMMDD-HHmmss.tar.gz
# Performs: extract -> symlink switch -> permissions -> nginx reload
# Abort on error
set -euo pipefail

ARCHIVE="$1"
RELEASES_DIR="/var/www/youandinotai.online/releases"
CURRENT_LINK="/var/www/youandinotai.online/current"

if [[ -z "${ARCHIVE}" ]]; then
  echo "❌ Provide archive name, e.g. dist-20251121-155917.tar.gz" >&2
  exit 1
fi

cd "${RELEASES_DIR}" || { echo "❌ Releases dir missing"; exit 1; }

if [[ ! -f "${ARCHIVE}" ]]; then
  echo "❌ Archive ${ARCHIVE} not found in ${RELEASES_DIR}" >&2
  exit 1
fi

TS_DIR="${ARCHIVE%.tar.gz}" # strip extension

echo "📦 Extracting ${ARCHIVE}..."
tar -xzf "${ARCHIVE}"

if [[ ! -d "${TS_DIR}/dist" ]]; then
  echo "❌ Expected dist folder inside ${TS_DIR}" >&2
  exit 1
fi

echo "🔁 Atomic symlink switch -> ${CURRENT_LINK}"
ln -sfn "${RELEASES_DIR}/${TS_DIR}/dist" "${CURRENT_LINK}"

echo "🔐 Setting permissions"
chown -R www-data:www-data "${CURRENT_LINK}"
find "${CURRENT_LINK}" -type f -exec chmod 644 {} \;
find "${CURRENT_LINK}" -type d -exec chmod 755 {} \;

echo "🌐 Reloading nginx"
sudo systemctl reload nginx || { echo "⚠️ Nginx reload failed"; exit 1; }

echo "✅ Release activated: ${TS_DIR}"