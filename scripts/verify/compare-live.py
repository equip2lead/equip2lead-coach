#!/usr/bin/env python3
"""Diff a generator's output against the live row for the same module.

    python3 scripts/verify/compare-live.py <module_number> <generated.json> <live_snapshot.json>

<generated.json> is what scripts/content/generate_moduleN.js writes.
<live_snapshot.json> is the array of rows fetched by fetch-live.sh.

Block ids and assignment_key are ignored: ids are derived from position and
type, and assignment_key is assigned at ingest, so neither is authored content.
Exit status is 0 when the generator reproduces production exactly.
"""
import json, sys, difflib

if len(sys.argv) != 4:
    sys.exit(__doc__)

mod, generated_path, live_path = int(sys.argv[1]), sys.argv[2], sys.argv[3]

rows = [r for r in json.load(open(live_path)) if r['module_number'] == mod]
if not rows:
    sys.exit(f'  module {mod} not present in {live_path}')
live = rows[0]['body_blocks']

src = json.load(open(generated_path))
gen = [{'type': b['type'], **b.get('data', {})}
       for s in src['sections'] for b in s['blocks']]

drop = ('id', 'assignment_key')
A = [{k: v for k, v in b.items() if k not in drop} for b in live]
B = [{k: v for k, v in b.items() if k not in drop} for b in gen]

kf = lambda b: json.dumps(b, sort_keys=True, ensure_ascii=False)
sm = difflib.SequenceMatcher(None, [kf(x) for x in A], [kf(x) for x in B], autojunk=False)
ops = [o for o in sm.get_opcodes() if o[0] != 'equal']

print(f'  live {len(A)} | generated {len(B)} | diff hunks {len(ops)}')
if not ops:
    print('  ZERO DIFFERENCES')
    sys.exit(0)
for t, i1, i2, j1, j2 in ops[:10]:
    print(f'   {t} live[{i1}:{i2}] gen[{j1}:{j2}]')
    for x in A[i1:i2][:2]:
        print('     LIVE-', kf(x)[:115])
    for x in B[j1:j2][:2]:
        print('     GEN +', kf(x)[:115])
sys.exit(1)
