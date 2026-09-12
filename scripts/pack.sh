#!/usr/bin/env bash
# Pack every package under packages/ into dist/ as a tarball, for attaching to a
# GitHub release. Tarballs are build output: dist/ is gitignored.
#
#   ./scripts/pack.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/dist"

command -v pnpm >/dev/null || { echo "pack.sh: pnpm is required" >&2; exit 1; }
rm -rf "$OUT"
mkdir -p "$OUT"

for dir in "$ROOT"/packages/*/; do
  name="$(basename "$dir")"
  echo "packing $name"
  ( cd "$dir" && pnpm pack --pack-destination "$OUT" >/dev/null )
done

echo
echo "tarballs in $OUT:"
ls -l "$OUT" | tail -n +2 | awk '{print "  " $5 " bytes  " $9}'
