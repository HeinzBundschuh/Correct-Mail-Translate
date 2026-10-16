#!/bin/sh
# Baut dist/correct_mail_translate-<version>.xpi aus src/ (Linux/macOS)
set -e
cd "$(dirname "$0")"
VERSION=$(sed -n 's/.*"version": *"\([^"]*\)".*/\1/p' src/manifest.json | head -n 1)
mkdir -p dist
OUT="$(pwd)/dist/correct_mail_translate-$VERSION.xpi"
rm -f "$OUT"
cp LICENSE src/LICENSE
(cd src && zip -q -r -X "$OUT" . -x '.*')
rm -f src/LICENSE
echo "Erstellt: $OUT"
