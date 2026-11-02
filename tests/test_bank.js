'use strict';
/* Question validity + answer-key accuracy. Every template is generated many times and the correct answer is
   recomputed here with independent formulas (not by calling the generator's own math). */
const vm = require('vm');
const ctx = require('./load.js')(['roster', 'core', 'unit', 'qapi', 'banks', 'registry']);
const run = s => vm.runInContext(s, ctx);
let fails = 0, checks = 0;
function bad(msg) { fails++; if (fails <= 40) console.log('  FAIL:', msg); }
const strip = h => String(h).replace(/<[^>]+>/g, '').replace(/&times;/g, 'x').replace(/&minus;/g, '-').trim();
const keys = run('QDEFS.order');
const N = Number(process.env.N || 1500);
const G = 9.8, G2 = 9.81, P = { Earth: 9.8, Moon: 1.62, Mars: 3.7, Jupiter: 23.1, Saturn: 9.0 };
const f = (x, n) => run('fmt')(x, n);
const sci = (x, n) => run('sci')(x, n);
const correctOf = q => q.choices.find(c => c.ok).html;
const topics = run('UNIT.topics.map(t=>t.id)').concat(['chal']);

function structural(q, key) {
  checks++;
  if (q.choices.length !== 4) bad(key + ': needs exactly 4 choices, has ' + q.choices.length);
  if (q.choices.filter(c => c.ok).length !== 1) bad(key + ': needs exactly one correct choice');
  const seen = new Set(q.choices.map(c => c.html));
  if (seen.size !== 4) bad(key + ': duplicate choices: ' + q.choices.map(c => strip(c.html)).join(' | '));
  q.choices.forEach(c => { if (!c.ok && (!c.why || c.why.length < 8)) bad(key + ': wrong choice missing explanation'); });
  const blob = q.prompt + ' ' + q.explain + ' ' + q.choices.map(c => c.html + c.why).join(' ');
  if (/undefined|NaN|\[object|null\b/.test(blob)) bad(key + ': contains undefined/NaN/object text: ' + strip(blob).slice(0, 120));
  if (!q.explain || q.explain.length < 15) bad(key + ': missing explanation');
  if (topics.indexOf(q.topic) < 0) bad(key + ': unknown topic');
  if (!(q.prior >= 0 && q.prior <= 100)) bad(key + ': prior out of range');
}
const REG = run('REGISTRY');
keys.forEach(k => { if (REG.indexOf(k) < 0) bad(k + ' missing from registry'); });
if (keys.length !== new Set(keys).size) bad('duplicate IDs');
if (REG.length > 255) bad('registry over 255');

/* independent answer checks for templates (return expected correct text, and alternatives that must NOT appear among wrongs) */
const CHECK = {
  'WGT-T1'(m) { const { m: mm, planet, g } = m; const n = planet === 'Earth' ? 2 : 3; return { exp: f(mm * P[planet], n) + ' N', alt: planet === 'Earth' ? f(mm * G2, 2) + ' N' : null }; },
  'WGT-T2'(m) { return { exp: f(m.W / P[Object.keys(P).find(p => P[p] === m.g)], 3) + ' kg' }; },
  'WGT-T3'(m) { const mass = m.W / m.g; return { exp: f(mass * G, 2) + ' N', alt: f(mass * G2, 2) + ' N' }; },
  'WGT-T4'(m) { return { exp: f(m.W / m.m, 2) + ' m/s\u00b2' }; },
  'FFL-T1'(m) { const n = m.planet === 'Earth' ? 2 : 3; return { exp: f(P[m.planet] * m.t, n) + ' m/s downward', alt: m.planet === 'Earth' ? f(G2 * m.t, 2) + ' m/s downward' : null }; },
  'FFL-T2'(m) { return { exp: f(m.v / P[m.planet], 2) + ' s', alt: m.planet === 'Earth' ? f(m.v / G2, 2) + ' s' : null }; },
  'FFL-T3'(m) { return { exp: (m.k * m.v) + ' m/s' }; },
  '2ND-T1'(m) { return { exp: f(m.F / m.m, 3) + ' m/s\u00b2' }; },
  '2ND-T2'(m) { return { exp: f(m.m * m.a, 3) + ' N' }; },
  '2ND-T3'(m) { return { exp: f(m.F / m.a, 3) + ' kg' }; },
  'NET-T1'(m) { return { exp: Math.abs(m.A - m.B) + ' N to the ' + (m.A > m.B ? 'right' : 'left') }; },
  'NET-T2'(m) { return { exp: (m.A + m.B) + ' N' , prefix: true }; },
  'NET-T4'(m) { return { exp: m.W + ' N, down' }; },
  'WGT-T5'(m) { return { exp: f(m.W / m.g1, 3) + ' kg' }; },
  'FRI-T4'(m) { return { exp: (m.F / m.W).toFixed(2) }; },
  'CH-T1'(m) { return { exp: strip(sci(6.67e-11 * m.m1 * m.m2 / (m.r * m.r), 2)) + ' N' }; },
  'CH-T2'(m) { const R = { Earth: [5.98e24, 6.38e6], Mars: [6.42e23, 3.39e6] }[m.planet]; const g = 6.67e-11 * R[0] / (R[1] * R[1]); return { exp: f(g, 2) + ' m/s\u00b2' }; }
};
const dict = { 'GRV-T1': 1, 'FBD-T2': 1, 'FRI-T1': 1, 'FRI-T2': 1, 'FRI-T3': 1 };
const fmtF = x => f(x, 2);
function frictionCheck(key, q) {
  const m = q.meta; const p = m.p;
  for (const gg of [G, G2]) {
    const W = p.m * gg, maxS = p.mus * W, kin = p.muk * W;
    if (key === 'FRI-T2') { if (f(maxS, 2) + ' N' !== strip(correctOf(q))) bad(key + ' key mismatch at g=' + gg); }
    if (key === 'FRI-T3') { if (f(kin, 2) + ' N' !== strip(correctOf(q))) bad(key + ' key mismatch at g=' + gg); }
    if (key === 'FRI-T1') {
      const slide = m.F > maxS; if (slide !== m.slide) bad(key + ' static/slide classification differs at g=' + gg);
      const exp = m.slide ? 'Kinetic friction, ' + f(kin, 2) + ' N' : 'Static friction, ' + f(m.F, 2) + ' N';
      if (exp !== strip(correctOf(q))) bad(key + ' key mismatch at g=' + gg + ': expected ' + exp + ' got ' + strip(correctOf(q)));
    }
  }
}
let perKey = {};
keys.forEach(key => {
  const d = run('QDEFS.byKey["' + key + '"]');
  const reps = d.kind === 'template' ? N : 1;
  for (let i = 0; i < reps; i++) {
    run('setRng(mulberry32(' + (1000 + i * 7919 + key.length) + '))');
    const q = run('makeQuestion("' + key + '")');
    structural(q, key);
    if (d.kind !== 'template') continue;
    if (CHECK[key]) {
      const r = CHECK[key](q.meta), got = strip(correctOf(q));
      if (r.prefix ? !got.startsWith(r.exp) : got !== r.exp) bad(key + ': key mismatch. expected "' + r.exp + '" got "' + got + '" meta=' + JSON.stringify(q.meta));
      if (r.alt) q.choices.filter(c => !c.ok).forEach(c => { if (strip(c.html) === r.alt) bad(key + ': a wrong choice equals the 9.81 answer'); });
    }
    if (/^FRI-T[123]$/.test(key)) frictionCheck(key, q);
    if (key === 'GRV-T1' || key === '2ND-T4') {
      const exp = { 2: 'twice', 3: 'three times', 4: 'four times', 0.5: 'half', 0.25: 'one-fourth', 1: 'the same', 0.111111: 'one-ninth', 0.333333: 'one-third', 0.666667: 'two-thirds' };
      const k = Object.keys(exp).find(x => Math.abs(Number(x) - q.meta.f) < 0.001);
      if (!strip(correctOf(q)).includes(exp[k])) bad(key + ' ratio mismatch ' + q.meta.f + ' vs ' + strip(correctOf(q)));
    }
    if (key === 'FFL-T4') {
      const c = strip(correctOf(q));
      if (q.meta.falling ? c !== 'is constant and its speed increases' : c !== 'is constant and its speed decreases') bad(key + ' wrong key for mode ' + JSON.stringify(q.meta) + ': ' + c);
    }
    if (key === 'FBD-T4') {
      /* own physics table: each scenario's net-force direction and whether it has horizontal arrows */
      const TBL = { 'A person pushes': ['h', 0], 'A sled is dragged': ['h', 0], 'A car speeds up': ['h', 1], 'A shopping cart': ['h', 1], 'A hockey puck': ['h', -1], 'A soccer ball': ['h', -1], 'A lamp hangs': ['v', 0], 'An elevator': ['v', 0], 'A coconut': ['f', -1], 'A ball moves upward': ['f', -1] };
      const get = t => TBL[Object.keys(TBL).find(k => t.startsWith(k))];
      const fs = q.meta.forces, net = [fs.filter(x => x.dir === 'right').reduce((a, x) => a + x.len, 0) - fs.filter(x => x.dir === 'left').reduce((a, x) => a + x.len, 0), fs.filter(x => x.dir === 'up').reduce((a, x) => a + x.len, 0) - fs.filter(x => x.dir === 'down').reduce((a, x) => a + x.len, 0)];
      const hasH = fs.some(x => x.dir === 'left' || x.dir === 'right'), hasT = fs.some(x => x.t === 'FT');
      const fitsDiagram = t => { const [typ, sgn] = get(t); const sg = hasH ? Math.sign(net[0]) : Math.sign(net[1]); const kindOk = typ === 'h' ? hasH : typ === 'v' ? (!hasH && hasT) : (!hasH && !hasT); return kindOk && sg === sgn; };
      const fit = q.meta.texts.map(fitsDiagram);
      const exp = fit[0] && fit[1] ? 3 : fit.indexOf(true);
      if (q.choices.length !== 4 || strip(q.choices[3].html) !== 'Choices A and B') bad(key + ': last choice must be "Choices A and B"');
      const got = q.choices.findIndex(c => c.ok);
      if (got !== exp) bad(key + ': key says ' + 'ABCD'[got] + ' but physics says ' + 'ABCD'[exp] + ' for ' + JSON.stringify(q.meta.texts));
      if (fit[0] && fit[1] && fit[2]) bad(key + ': all three scenarios fit');
    }
    if (key === 'FBD-T2') {
      const m = q.meta, st = m.a > m.b ? 'increasing' : m.a < m.b ? 'decreasing' : 'staying the same';
      if (!strip(correctOf(q)).includes(st)) bad(key + ' speed state mismatch');
    }
    if (key === 'FBD-T1') {
      const good = q.meta.good, by = {}; good.forEach(f2 => by[f2.t] = f2);
      if (by.Fg && by.FN && by.Fg.len !== by.FN.len) bad('FBD-T1: Fg and FN lengths differ in the key');
      if (by.Fg && by.FT && by.Fg.len !== by.FT.len) bad('FBD-T1: Fg and FT lengths differ in the key');
      if (by.FFr && by.FFr.dir !== 'left') bad('FBD-T1: friction must oppose rightward motion');
      if (good.some(f2 => /motion/.test(f2.t))) bad('FBD-T1: key contains a force of motion');
      const sigs = q.choices.map(c => c.html);
      if (new Set(sigs).size !== 4) bad('FBD-T1: duplicate diagrams');
    }
  }
});
console.log('Checked ' + checks + ' generated questions across ' + keys.length + ' IDs (' + N + ' per template). Failures: ' + fails);
process.exit(fails ? 1 : 0);
