#!/usr/bin/env bash
# Run every tracked generator and diff its output against production.
#
#   scripts/verify/check-generators.sh              # all tracked generators
#   scripts/verify/check-generators.sh 9 11         # just these Leadership modules
#   scripts/verify/check-generators.sh marriage:0   # a module in another track
#
# Leadership generators live at scripts/content/generate_moduleN.js. Other tracks
# live at scripts/content/<track>/generate_moduleN.js and write
# moduleN_<track>.json. Module numbers repeat across tracks, so a generator is
# only ever compared with the live row in its own track.
#
# Reads NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY from
# .env.local and fetches published lesson_modules through PostgREST, so the
# snapshot is pulled from the database rather than from any local file.
#
# Exits non-zero if any generator has drifted from production.
set -uo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$repo_root"

[ -f .env.local ] || { echo "ABORT: .env.local not found in $repo_root"; exit 1; }
set -a; . ./.env.local; set +a
: "${NEXT_PUBLIC_SUPABASE_URL:?missing in .env.local}"
: "${NEXT_PUBLIC_SUPABASE_ANON_KEY:?missing in .env.local}"

work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
snapshot="$work/all_live.json"

curl -sf "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/lesson_modules?select=module_number,slug,body_blocks,tracks(slug)&order=module_number" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -o "$snapshot" || { echo "ABORT: could not fetch live snapshot"; exit 1; }

# Each target is track:number.
targets=()
if [ "$#" -gt 0 ]; then
  for arg in "$@"; do
    case "$arg" in
      *:*) targets+=("$arg") ;;
      *)   targets+=("leadership:$arg") ;;
    esac
  done
else
  numbers=()
  for f in scripts/content/generate_module*.js; do
    n="${f##*generate_module}"; numbers+=("${n%.js}")
  done
  IFS=$'\n' numbers=($(sort -n <<<"${numbers[*]}")); unset IFS
  for n in "${numbers[@]}"; do targets+=("leadership:$n"); done
  for f in scripts/content/*/generate_module*.js; do
    [ -f "$f" ] || continue
    track="$(basename "$(dirname "$f")")"
    n="${f##*generate_module}"; targets+=("$track:${n%.js}")
  done
fi

status=0
for target in "${targets[@]}"; do
  track="${target%%:*}"; n="${target##*:}"
  if [ "$track" = leadership ]; then
    gen="scripts/content/generate_module${n}.js"; label="M${n}"
  else
    gen="scripts/content/${track}/generate_module${n}.js"; label="${track} M${n}"
  fi
  [ -f "$gen" ] || { echo "  ${label}: no generator at $gen"; status=1; continue; }
  d="$work/$track-$n"; mkdir -p "$d"; cp "$gen" "$d/g.js"
  if ! ( cd "$d" && node g.js >/dev/null 2>&1 ); then
    echo "  ${label}: GENERATOR FAILED TO RUN"; status=1; continue
  fi
  out="$d/module${n}_${track}.json"
  [ -f "$out" ] || { echo "  ${label}: generator wrote no module${n}_${track}.json"; status=1; continue; }
  # Captured first so the exit status is the comparison's. Reading PIPESTATUS
  # after an echo reported the echo's, so drift could never fail this script.
  result="$(python3 scripts/verify/compare-live.py "$n" "$out" "$snapshot" "$track" 2>&1)"
  rc=$?
  printf '  %-4s: ' "$label"
  printf '%s' "$result" | tr '\n' ' ' | sed 's/  */ /g'
  echo
  [ "$rc" -eq 0 ] || status=1
done

exit "$status"
