#!/usr/bin/env bash
# Run every tracked generator and diff its output against production.
#
#   scripts/verify/check-generators.sh            # all tracked generators
#   scripts/verify/check-generators.sh 9 11       # just these module numbers
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

curl -sf "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/lesson_modules?select=module_number,slug,body_blocks&order=module_number" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -o "$snapshot" || { echo "ABORT: could not fetch live snapshot"; exit 1; }

if [ "$#" -gt 0 ]; then
  modules=("$@")
else
  modules=()
  for f in scripts/content/generate_module*.js; do
    n="${f##*generate_module}"; modules+=("${n%.js}")
  done
  IFS=$'\n' modules=($(sort -n <<<"${modules[*]}")); unset IFS
fi

status=0
for n in "${modules[@]}"; do
  gen="scripts/content/generate_module${n}.js"
  [ -f "$gen" ] || { echo "  M${n}: no generator at $gen"; status=1; continue; }
  d="$work/m$n"; mkdir -p "$d"; cp "$gen" "$d/g.js"
  if ! ( cd "$d" && node g.js >/dev/null 2>&1 ); then
    echo "  M${n}: GENERATOR FAILED TO RUN"; status=1; continue
  fi
  out="$d/module${n}_leadership.json"
  [ -f "$out" ] || { echo "  M${n}: generator wrote no module${n}_leadership.json"; status=1; continue; }
  printf '  M%-2s: ' "$n"
  python3 scripts/verify/compare-live.py "$n" "$out" "$snapshot" \
    | tr '\n' ' ' | sed 's/  */ /g'
  echo
  [ "${PIPESTATUS[0]}" -eq 0 ] || status=1
done

exit "$status"
