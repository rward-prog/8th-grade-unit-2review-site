'use strict';
/* ======================= STUDENT STATE (stored on the student's device) ======================= */
const MEM = {};   // fallback store when localStorage is unavailable (and in tests)
function _store() { try { if (typeof localStorage !== 'undefined') { localStorage.setItem('__t', '1'); localStorage.removeItem('__t'); return localStorage; } } catch (e) {} return null; }
const STORE = _store();
function lsGet(k) { try { return STORE ? STORE.getItem(k) : (k in MEM ? MEM[k] : null); } catch (e) { return null; } }
function lsSet(k, v) { try { if (STORE) STORE.setItem(k, v); else MEM[k] = v; } catch (e) { MEM[k] = v; } }
const STATE_KEY = 'review:' + UNIT.grade + ':' + UNIT.id + ':student';
const CLASS_KEY = 'review:' + UNIT.grade + ':' + UNIT.id + ':class-test-mode';

function newState() { return { v: 1, keys: {}, pre: {}, post: {}, last: {}, conf: {}, scope: null }; }
let S = newState();
function loadState() {
  try { const raw = lsGet(STATE_KEY); if (raw) { const o = JSON.parse(raw); if (o && o.v === 1) S = Object.assign(newState(), o); } } catch (e) { S = newState(); }
  return S;
}
function saveState() { lsSet(STATE_KEY, JSON.stringify(S)); }
function recordLocal(key, correct, assisted, conf) {
  const k = S.keys[key] || (S.keys[key] = [0, 0]);
  k[0] += 1; if (!correct || assisted === 'how') k[1] += 1;
  S.last[key] = (correct && assisted !== 'how') ? 1 : 0;
  if (conf) S.conf[key] = conf;
  saveState();
}

/* ======================= CLASS STATS (anonymous counters) =======================
   Test mode: counters live on this device only, so the Insights page works before Firebase is connected.
   Live mode: set FIREBASE_URL (see README) and counters go to /review/{grade}/{unit}/{itemId}. No student identifier is ever sent. */
const FIREBASE_URL = '';      // e.g. 'https://YOUR-DATABASE.firebaseio.com' (set during setup)
const LIVE = !!FIREBASE_URL;
let CLASS = {};               // { key: [attempts, misses] }
function loadClassLocal() { try { const raw = lsGet(CLASS_KEY); CLASS = raw ? JSON.parse(raw) : {}; } catch (e) { CLASS = {}; } }
function reportClass(key, correct) {
  if (!LIVE) { const c = CLASS[key] || (CLASS[key] = [0, 0]); c[0] += 1; if (!correct) c[1] += 1; lsSet(CLASS_KEY, JSON.stringify(CLASS)); return; }
  const body = { attempts: { '.sv': { increment: 1 } } };
  if (!correct) body.misses = { '.sv': { increment: 1 } };
  try { fetch(FIREBASE_URL + '/review/' + UNIT.grade + '/' + UNIT.id + '/' + key + '.json', { method: 'PATCH', body: JSON.stringify(body), keepalive: true }).catch(function () {}); } catch (e) {}
}
async function refreshClass() {
  if (!LIVE) { loadClassLocal(); return 'test'; }
  try {
    const r = await fetch(FIREBASE_URL + '/review/' + UNIT.grade + '/' + UNIT.id + '.json');
    const o = await r.json(); CLASS = {};
    Object.keys(o || {}).forEach(k => { CLASS[k] = [o[k].attempts || 0, o[k].misses || 0]; });
    return 'live';
  } catch (e) { return 'offline'; }
}

/* ======================= DIFFICULTY (0 to 100) ======================= */
function priorOf(key) { return QDEFS.byKey[key].prior; }
function difficulty(key) {
  const c = CLASS[key] || [0, 0];
  return Math.round(100 * (c[1] + UNIT.k * priorOf(key) / 100) / (c[0] + UNIT.k));
}
function diffLabel(key) {
  const a = (CLASS[key] || [0, 0])[0];
  return a >= UNIT.minTrust ? 'based on ' + a + ' tries' : (a >= 1 ? 'mostly an estimate, ' + a + (a === 1 ? ' try' : ' tries') + ' so far' : 'starting estimate');
}
function keysOfTopic(t) { return QDEFS.order.filter(k => QDEFS.byKey[k].topic === t); }
function topicDifficulty(t) { const ks = keysOfTopic(t); return ks.length ? Math.round(ks.reduce((s, k) => s + difficulty(k), 0) / ks.length) : 0; }
function unitDifficulty() { const ts = UNIT.topics.map(t => topicDifficulty(t.id)); return Math.round(ts.reduce((a, b) => a + b, 0) / ts.length); }
function diffBand(d) { return d < 35 ? 'Easier' : d < 60 ? 'Medium' : 'Tough'; }
/* "harder/easier than expected": needs enough real data and a big gap between the raw miss rate and the estimate */
function expectation(key) {
  const c = CLASS[key] || [0, 0];
  if (c[0] < UNIT.minTrust) return null;
  const gap = 100 * c[1] / c[0] - priorOf(key);
  return gap >= 20 ? 'harder' : gap <= -20 ? 'easier' : null;
}

/* ======================= READINESS (local, graded topics only; Challenge excluded) ======================= */
function topicStats(t) {
  let a = 0, m = 0;
  keysOfTopic(t).forEach(k => { const c = S.keys[k]; if (c) { a += c[0]; m += c[1]; } });
  return { a: a, m: m, acc: a ? (a - m) / a : null };
}
function topicStatus(t) {
  const s = topicStats(t);
  if (s.a < 3) return { id: 'new', label: s.a ? 'Just started' : 'Not started' };
  if (s.acc >= 0.85) return { id: 'ready', label: 'Ready' };
  if (s.acc >= 0.65) return { id: 'almost', label: 'Almost there' };
  return { id: 'work', label: 'Needs work' };
}
function unitReadiness(topics) {
  const ts = topics || UNIT.topics.map(t => t.id);
  const ready = ts.filter(t => topicStatus(t).id === 'ready').length;
  return Math.round(100 * ready / ts.length);
}

/* ======================= SCOPES ======================= */
function scopeQuiz(id) { const q = UNIT.quizzes.find(x => x.id === id); return { type: 'quiz', id: id, topics: q.topics.slice(), label: q.name }; }
function scopeTopics(ids) { return { type: 'topics', topics: ids.slice(), label: ids.length === 1 ? UNIT.topicById[ids[0]].name : ids.length + ' topics I picked' }; }
function scopeUnit() { return { type: 'unit', topics: UNIT.topics.map(t => t.id), label: 'The whole unit test' }; }
function scopeChal() { return { type: 'chal', topics: ['chal'], label: 'Challenge: beyond the test' }; }

/* ======================= QUESTION SELECTION ======================= */
function weightedPick(items, weights) {
  const tot = weights.reduce((a, b) => a + b, 0); let r = rand() * tot;
  for (let i = 0; i < items.length; i++) { r -= weights[i]; if (r <= 0) return items[i]; }
  return items[items.length - 1];
}
function nextPracticeKey(scope, recent) {
  const keys = scope.topics.reduce((acc, t) => acc.concat(keysOfTopic(t)), []);
  const pool = keys.filter(k => recent.indexOf(k) < 0); const use = pool.length ? pool : keys;
  const w = use.map(k => {
    const d = QDEFS.byKey[k], c = S.keys[k], ts = topicStats(d.topic);
    let x = 1 + 4 * (ts.acc === null ? 0.5 : 1 - ts.acc);
    if (!c) x += 0.5;
    if (S.last[k] === 0) x += 3;
    if (c && c[0] >= 2 && c[1] === 0 && d.kind === 'fixed') x *= 0.35;
    if (d.kind === 'template') x *= 1.2;
    return x;
  });
  return weightedPick(use, w);
}
/* A fixed-length check (pre or post): a spread across the topics in scope, skipping keys in `avoid` when it can. */
function buildCheck(scope, avoid) {
  const topics = scope.topics, N = Math.max(4, Math.min(20, topics.length * 2));
  const used = {}; const out = [];
  let guard = 0, ti = 0;
  const order = shuffle(topics);
  while (out.length < N && guard++ < 500) {
    const t = order[ti++ % order.length], ks = shuffle(keysOfTopic(t));
    let k = ks.find(x => !used[x] && (!avoid || avoid.indexOf(x) < 0)) || ks.find(x => !used[x]);
    if (!k) continue;
    used[k] = 1; out.push(k);
  }
  return shuffle(out);
}
