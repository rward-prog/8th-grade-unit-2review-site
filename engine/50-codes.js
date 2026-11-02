'use strict';
/* ======================= SAVE-AND-RESTORE CODE =======================
   Bit layout (all numbers big-endian):
     6 bits  version (1)
     10 bits unit check (hash of unit id)
     8 bits  N = number of registry slots in this code
     N x 6   per slot: attempts (0-7), misses (0-7)   <- slot = position in REGISTRY (append-only)
     6 bits  T = number of topics in this code
     T x 8   pre-check  (correct 0-15, total 0-15)
     T x 8   post-check (correct 0-15, total 0-15)
     16 bits CRC-16 of everything above
   RULE: never change how version 1 is read. If the layout must change, add version 2 and keep the v1 reader. */
const B32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
function _hash10(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) & 1023; }
function _crc16(bits) {
  let crc = 0xFFFF;
  for (let i = 0; i < bits.length; i++) {
    const b = bits[i] ^ ((crc >> 15) & 1); crc = (crc << 1) & 0xFFFF; if (b) crc ^= 0x1021;
  }
  return crc;
}
function _pushBits(arr, val, n) { for (let i = n - 1; i >= 0; i--) arr.push((val >> i) & 1); }
function _readBits(arr, pos, n) { let v = 0; for (let i = 0; i < n; i++) v = (v << 1) | arr[pos.p++]; return v; }
function _scale(a, m) { if (a <= 7) return [a, Math.min(m, a)]; return [7, Math.min(7, Math.round(m * 7 / a))]; }
function _scale15(c, t) { if (t <= 15) return [Math.min(c, t), t]; return [Math.round(c * 15 / t), 15]; }
function encodeProgress(st) {
  const bits = [];
  _pushBits(bits, 1, 6); _pushBits(bits, _hash10(UNIT.id), 10);
  _pushBits(bits, REGISTRY.length, 8);
  REGISTRY.forEach(k => { const c = st.keys[k] || [0, 0]; const s = _scale(c[0], c[1]); _pushBits(bits, s[0], 3); _pushBits(bits, s[1], 3); });
  const tp = UNIT.topics.map(t => t.id);
  _pushBits(bits, tp.length, 6);
  ['pre', 'post'].forEach(w => tp.forEach(t => { const c = st[w][t] || [0, 0]; const s = _scale15(c[0], c[1]); _pushBits(bits, s[0], 4); _pushBits(bits, s[1], 4); }));
  _pushBits(bits, _crc16(bits), 16);
  while (bits.length % 5) bits.push(0);
  let out = '';
  for (let i = 0; i < bits.length; i += 5) out += B32[(bits[i] << 4) | (bits[i + 1] << 3) | (bits[i + 2] << 2) | (bits[i + 3] << 1) | bits[i + 4]];
  const grp = out.match(/.{1,5}/g).join('-');
  return UNIT.codePrefix + '-' + grp;
}
/* returns {ok:true, state} or {ok:false, error:'friendly message'} */
function decodeProgress(text) {
  let s = String(text || '').toUpperCase().replace(/[\s-]/g, '');
  const pre = UNIT.codePrefix.toUpperCase();
  if (!s) return { ok: false, error: 'Paste your code first.' };
  if (s.indexOf(pre) !== 0) return { ok: false, error: 'That does not look like a code from this unit. Codes start with ' + UNIT.codePrefix + '. If it came from a different unit, use this unit\u2019s code instead.' };
  s = s.slice(pre.length).replace(/I/g, '1').replace(/L/g, '1').replace(/O/g, '0').replace(/U/g, 'V');
  const bits = [];
  for (const ch of s) { const v = B32.indexOf(ch); if (v < 0) return { ok: false, error: 'That code has a character that is not allowed. Check for typos.' }; for (let i = 4; i >= 0; i--) bits.push((v >> i) & 1); }
  if (bits.length < 40) return { ok: false, error: 'That code is too short. Make sure you copied the whole thing.' };
  const pos = { p: 0 };
  const ver = _readBits(bits, pos, 6);
  if (ver !== 1) return { ok: false, error: 'This code was made by a newer version of the site. Refresh the page and try again.' };
  const unit = _readBits(bits, pos, 10);
  const n = _readBits(bits, pos, 8);
  const need = 6 + 10 + 8 + n * 6 + 6;
  if (bits.length < need + 16) return { ok: false, error: 'That code is too short. Make sure you copied the whole thing.' };
  const keysData = []; for (let i = 0; i < n; i++) keysData.push([_readBits(bits, pos, 3), _readBits(bits, pos, 3)]);
  const T = _readBits(bits, pos, 6);
  const total = need + T * 16;
  if (bits.length < total + 16) return { ok: false, error: 'That code is too short. Make sure you copied the whole thing.' };
  const pp = []; for (let i = 0; i < T; i++) pp.push([_readBits(bits, pos, 4), _readBits(bits, pos, 4)]);
  const qq = []; for (let i = 0; i < T; i++) qq.push([_readBits(bits, pos, 4), _readBits(bits, pos, 4)]);
  const crcPos = pos.p; const crc = _readBits(bits, pos, 16);
  if (_crc16(bits.slice(0, crcPos)) !== crc) return { ok: false, error: 'That code does not look right. Check for a mistyped or missing character.' };
  const rest = bits.slice(pos.p);
  if (rest.length >= 5) return { ok: false, error: 'That code is longer than expected. Make sure you copied only the code.' };
  if (rest.some(b => b !== 0)) return { ok: false, error: 'That code does not look right. Check for a mistyped or missing character.' };
  if (unit !== _hash10(UNIT.id)) return { ok: false, error: 'This code is from a different unit.' };
  const st = newState();
  keysData.forEach((c, i) => { if (REGISTRY[i] && (c[0] || c[1])) st.keys[REGISTRY[i]] = [c[0], c[1]]; });
  const tp = UNIT.topics.map(t => t.id);
  tp.forEach((t, i) => { if (i < T) { if (pp[i][1]) st.pre[t] = [pp[i][0], pp[i][1]]; if (qq[i][1]) st.post[t] = [qq[i][0], qq[i][1]]; } });
  return { ok: true, state: st };
}
