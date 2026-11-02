'use strict';
/* ---------- random helpers (seedable so tests can replay) ---------- */
let _rng = Math.random;
function setRng(f) { _rng = f; }
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const rand = () => _rng();
const ri = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const pick = a => a[Math.floor(rand() * a.length)];
function shuffle(a) {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
  return b;
}

/* ---------- number formatting ---------- */
function sig(x, n) { return Number(Number(x).toPrecision(n)); }
function fmt(x, n) {                       // n significant figures, trailing zeros trimmed
  let s = Number(x).toPrecision(n);
  if (s.indexOf('e') >= 0) s = String(Number(s));
  if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
  return s;
}
function sci(x, n) {                       // 1.8 x 10^-7 as HTML
  n = n || 2;
  let e = Math.floor(Math.log10(Math.abs(x)));
  let m = Number((x / Math.pow(10, e)).toPrecision(n));
  if (m >= 10) { m = Number((m / 10).toPrecision(n)); e += 1; }
  return m.toFixed(n - 1) + ' &times; 10<sup>' + String(e).replace('-', '&minus;') + '</sup>';
}
const G_EARTH = 9.8, G_EARTH_ALT = 9.81;   // site shows 9.8; both are accepted
/* true when a quantity computed with g=9.8 and g=9.81 shows the same value at n sig figs */
function sameBoth(fn, n) { return fmt(fn(G_EARTH), n) === fmt(fn(G_EARTH_ALT), n); }

/* ---------- names (first names only; staff/Murphy play anyone who makes a mistake) ---------- */
function oneName() { return pick(ROSTER.names); }
function twoNames() {
  const a = oneName(); let b;
  do { b = oneName(); } while (b[0] === a[0]);      // never near-identical names in one scenario
  return [a, b];
}

/* ---------- free-body diagram SVG ---------- */
const FCLS = { Fapp: 'app', FT: 't', FN: 'n', FFr: 'fr', Fspring: 'sp', Fg: 'g' };
function _label(t) {
  const m = /^F(app|T|N|Fr|spring|g)$/.exec(t);
  if (!m) return t;                                   // custom label, e.g. "force of motion"
  return 'F<tspan class="sub" dy="3">' + m[1] + '</tspan>';
}
function fbd(forces, o) {
  o = o || {};
  const W = 440, H = 180, cx = 220, cy = 90, u = 20, r = 7;
  const lanes = { up: 0, down: 0, left: 0, right: 0 }, LANE = [0, 22, -22];   // same-direction arrows sit side by side
  let body = '', desc = [];
  forces.forEach(f => {
    const maxLen = (f.dir === 'up' || f.dir === 'down') ? 3 : 4;
    const len = Math.min(f.len, maxLen);
    const cls = FCLS[f.t] || 'x';
    const off = LANE[Math.min(lanes[f.dir]++, 2)];
    const L = r + 2 + len * u;                       // tip distance from center
    const s = r + 2;
    let x1 = cx, y1 = cy, x2 = cx, y2 = cy, lx, ly, anchor = 'middle';
    if (f.dir === 'up')    { x1 = x2 = cx + off; y1 = cy - s; y2 = cy - L; lx = x2 + 10; ly = y2 + 6; anchor = 'start'; }
    if (f.dir === 'down')  { x1 = x2 = cx + off; y1 = cy + s; y2 = cy + L; lx = x2 + 10; ly = y2 - 2; anchor = 'start'; }
    if (f.dir === 'left')  { y1 = y2 = cy + off; x1 = cx - s; x2 = cx - L; lx = x2 - 6; ly = y2 - 8; anchor = 'end'; }
    if (f.dir === 'right') { y1 = y2 = cy + off; x1 = cx + s; x2 = cx + L; lx = x2 + 6; ly = y2 - 8; anchor = 'start'; }
    const hs = 6;                                    // arrowhead half-size
    let head;
    if (f.dir === 'up')    head = [x2, y2, x2 - hs, y2 + 10, x2 + hs, y2 + 10];
    if (f.dir === 'down')  head = [x2, y2, x2 - hs, y2 - 10, x2 + hs, y2 - 10];
    if (f.dir === 'left')  head = [x2, y2, x2 + 10, y2 - hs, x2 + 10, y2 + hs];
    if (f.dir === 'right') head = [x2, y2, x2 - 10, y2 - hs, x2 - 10, y2 + hs];
    const shaftEnd = { up: [x2, y2 + 9], down: [x2, y2 - 9], left: [x2 + 9, y2], right: [x2 - 9, y2] }[f.dir];
    const lead = off ? '<line class="lead" x1="' + cx + '" y1="' + cy + '" x2="' + x1 + '" y2="' + y1 + '" />' : '';
    body += '<g class="fa f-' + cls + '">' + lead +
      '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + shaftEnd[0] + '" y2="' + shaftEnd[1] + '" />' +
      '<polygon points="' + head.join(' ') + '" />' +
      '<text x="' + lx + '" y="' + ly + '" text-anchor="' + anchor + '">' + _label(f.t) +
      (f.src ? '<tspan class="src" dx="4"> (' + f.src + ')</tspan>' : '') + '</text></g>';
    desc.push(f.t + ' ' + f.dir + (f.src ? ' (' + f.src + ')' : '') + ', length ' + len);
  });
  const label = 'Free-body diagram: ' + (desc.length ? desc.join('; ') : 'no arrows');
  return '<svg class="fbd" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + label + '">' +
    '<title>' + label + '</title><circle class="dot" cx="' + cx + '" cy="' + cy + '" r="' + r + '" />' + body + '</svg>';
}
