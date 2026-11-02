'use strict';
const vm = require('vm');
const ctx = require('./load.js')(['roster', 'core', 'unit', 'qapi', 'banks', 'registry', 'engine', 'codes']);
const run = s => vm.runInContext(s, ctx);
let fails = 0, n = 0;
const ok = (c, m) => { n++; if (!c) { fails++; console.log('  FAIL:', m); } };
const REG = run('REGISTRY');
function rndState(seed) {
  run('setRng(mulberry32(' + seed + '))');
  return JSON.parse(run(`JSON.stringify((function(){
    const st = newState();
    REGISTRY.forEach(k => { if (rand() < 0.7) { const a = ri(0, 7), m = ri(0, a); if (a) st.keys[k] = [a, m]; } });
    UNIT.topics.forEach(t => { if (rand() < 0.8) { const tt = ri(2, 6), c = ri(0, tt); st.pre[t.id] = [c, tt]; } if (rand() < 0.6) { const tt = ri(2, 6), c = ri(0, tt); st.post[t.id] = [c, tt]; } });
    return st; })())`));
}
for (let i = 0; i < 300; i++) {
  const st = rndState(i + 1);
  ctx.__st = st;
  const code = run('encodeProgress(__st)');
  ctx.__code = code;
  const r = run('decodeProgress(__code)');
  ok(r.ok, 'round trip decode failed for seed ' + i + ': ' + r.error);
  if (r.ok) {
    ok(JSON.stringify(r.state.keys) === JSON.stringify(st.keys), 'keys differ seed ' + i);
    ok(JSON.stringify(r.state.pre) === JSON.stringify(st.pre), 'pre differs seed ' + i);
    ok(JSON.stringify(r.state.post) === JSON.stringify(st.post), 'post differs seed ' + i);
  }
}
const st0 = rndState(5); ctx.__st = st0; const code0 = run('encodeProgress(__st)');
console.log('  example code length:', code0.length, 'characters');
/* tolerance: lowercase, spaces, missing dashes */
ctx.__c = code0.toLowerCase().replace(/-/g, ' '); ok(run('decodeProgress(__c)').ok, 'lowercase/space tolerant');
/* every single-character typo is caught */
let caught = 0, total = 0;
const body = code0.slice(code0.indexOf('-') + 1);
for (let i = 0; i < body.length; i++) {
  if (body[i] === '-') continue;
  const alphabet = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  const other = alphabet[(alphabet.indexOf(body[i]) + 1) % 32];
  ctx.__c = code0.slice(0, code0.indexOf('-') + 1) + body.slice(0, i) + other + body.slice(i + 1);
  total++; const r = run('decodeProgress(__c)'); if (!r.ok) caught++;
}
ok(caught === total, 'typo detection: caught ' + caught + ' of ' + total);
/* friendly errors */
ctx.__c = 'G8F-12345-ABCDE'; ok(!run('decodeProgress(__c)').ok, 'short code rejected');
ctx.__c = 'XYZ-' + body; let r = run('decodeProgress(__c)'); ok(!r.ok && /different unit|does not look like/.test(r.error), 'wrong prefix: ' + r.error);
ctx.__c = ''; ok(!run('decodeProgress(__c)').ok, 'empty rejected');
ctx.__c = 'G8F-!!!!!-#####'; ok(/character/.test(run('decodeProgress(__c)').error), 'bad characters message');
ctx.__c = code0.slice(0, -6); ok(!run('decodeProgress(__c)').ok, 'truncated rejected');
/* wrong unit: same format, different unit hash */
run('UNIT.id = "other-unit"'); ctx.__c = code0; r = run('decodeProgress(__c)'); ok(!r.ok, 'code from another unit id rejected: ' + (r.error || 'accepted'));
run('UNIT.id = "forces"');
/* registry growth: a code issued earlier still reads after IDs are appended */
ctx.__st = st0; const old = run('encodeProgress(__st)'); run('REGISTRY.push("NEW-X1","NEW-X2")'); ctx.__c = old; r = run('decodeProgress(__c)');
ok(r.ok && JSON.stringify(r.state.keys) === JSON.stringify(st0.keys), 'older code still decodes after IDs were appended');
/* scaling of big counts */
const big = run('(function(){ const s = newState(); s.keys[REGISTRY[0]] = [40, 10]; s.pre.types = [30, 20]; return s; })()');
ctx.__st = big; r = run('decodeProgress(encodeProgress(__st))'); ok(r.ok && r.state.keys[REG[0]][0] === 7 && r.state.keys[REG[0]][1] >= 1, 'large counts scale down: ' + JSON.stringify(r.ok && r.state.keys[REG[0]]));
console.log(n + ' code checks, failures: ' + fails);
process.exit(fails ? 1 : 0);
