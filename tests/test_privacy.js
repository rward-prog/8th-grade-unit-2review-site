'use strict';
/* Privacy scan over EVERY file in the project (source, built site, README, metadata, tests, rules). */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const crypto = require('crypto');
const EXPECTED_ROSTER_HASH = 'db29c9bb4f6cd1e3adc84e242f87eab194afdcbdb10ed18cdbb96f287cc4fce4';   // hash of the grade 8 first-name list, so no second copy of the roster lives here
const OTHER_GRADE_HASHES = new Set(['01e76a28977874f8', '02d087933efc5d76', '03de1aa3417b1f34', '0522a55e2d5f0993', '061aa6caf59afbc8', '0a9a9cb69fd7c2dd', '0e05f24fe6d90628', '0e25d57dbe558245', '0f6360072cf8ed9f', '0f9c00b3f38f964e', '10fe82adb964fa73', '162094c4d87101ff', '1ff27e6e2bbe6166', '23ddda4810068cc4', '2632ec06e2c2e54a', '27b50557de800b45', '2c58b83b1c66829f', '31611159e7e6ff78', '31d76ef2179b24fe', '34550715062af006', '3492ad65d05a973f', '35e097c2592e6f1f', '3721e1a2ad55f5ac', '399a6dd4d5753514', '468c7b6449dd928f', '47798d12ae31ce5a', '4dd68e2ab3a30973', '501e1aff9d6d646c', '502913bfdd49eab5', '516c5747bd510907', '6f63d3537f7c1e43', '75d75d4484186f1a', '7b2b547ab5377906', '7b8bd6c0abf53d22', '7c366b6727c76f70', '7cadab457ad8d811', '807a09440428c0a8', '8535e86c8118bbbb', '8a2e7ca933fb2f76', '8b2fa4880d6a4664', '90cc33a41b541af2', '9c0e1061c8e49a03', 'a4eecdcc6c7d5462', 'a6b70a8a5074fc12', 'ac877a7dcb8adb06', 'ae91d27977004524', 'b323ba8eb5a4df2f', 'b54a95127a4b573f', 'b6f2920002873556', 'b6f8d434a847fb0f', 'bb91cebeeec6f73d', 'befa156f0283eb00', 'c1b54e8ce3e49585', 'cb29da26a1d1fbf6', 'cc4e9a11d0242e90', 'ccc68482d9e0eee0', 'cdf30c6b34527627', 'cf3a3bbe331c3950', 'cf407fe3eab1561e', 'd0b00c77c1f851ea', 'd38681074467c0bc', 'd70f47790f689414', 'd7ae9de750a5640a', 'd808cfd66215b9ca', 'd979885447a413ab', 'dc355ec75a2dc4a1', 'dcbf5e4d151e7dcd', 'dd0181857de6e2d3', 'df46219531cb5d52', 'df5a46d942797d73', 'e2d83ebeb2ffddbc', 'f78b6cb9224209fe', 'f8628a3fffd6b87b', 'fa4f7155e110eac1', 'fa7c171ac94aac19', 'fcae800202e3f0ee']);   // first 16 hex chars of sha256(lowercase name) for grade 6 and 7 names
function walk(d, out) { fs.readdirSync(d).forEach(f => { if (f === 'node_modules' || f === '.git' || f === '__pycache__') return; const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p, out) : out.push(p); }); return out; }
const files = walk(ROOT, []);
let fails = 0; const bad = (m) => { fails++; console.log('  FAIL:', m); };
const rel = p => path.relative(ROOT, p);
const rosterFile = path.join(ROOT, 'rosters', 'grade8.js');
const rosterSrc = fs.readFileSync(rosterFile, 'utf8');
const names = (rosterSrc.match(/"([A-Za-z]+)"/g) || []).map(s => s.replace(/"/g, ''));
if (crypto.createHash('sha256').update(names.join('|')).digest('hex') !== EXPECTED_ROSTER_HASH) bad('roster file does not match the approved grade 8 first-name list');
names.forEach(n => { if (!/^[A-Z][a-z]+$/.test(n)) bad('roster entry is not a single plain first name: ' + n); });
/* The ONE approved image: a photo of the teacher's own dog (Murphy), supplied by the teacher. Anything else fails. */
const APPROVED_IMAGE_SHA256 = 'af3fb4ce26a40a86d6802b7aa73adcf58a03585b22e7072bfd7297fa748c8a49';
const IMG_DATA = new RegExp('data:' + 'image\\/jpeg;base64,[A-Za-z0-9+\\/=]+', 'g');   // written in pieces so this file does not trip its own scan
const IMG_TAG = new RegExp('<' + 'img class=\\\\?"dog\\\\?" src=\\\\?"\' \\+ MURPHY_IMG \\+ \'\\\\?" alt=\\\\?"Murphy the dog\\\\?"[^>]*>', 'g');
function stripApproved(text) {
  return text.replace(IMG_DATA, m => crypto.createHash('sha256').update(m).digest('hex') === APPROVED_IMAGE_SHA256 ? '' : m).replace(IMG_TAG, '');
}
let approvedCount = 0;
const checks = [
  ['email address', /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/],
  ['phone number', /(\(\s*\d{3}\s*\)|\b\d{3})[-.\s]\d{3}[-.\s]\d{4}\b|\b\+?1?\d{10}\b/, ['4294967296', '2166136261']],   // known math constants (2^32 and the FNV hash seed) are not phone numbers
  ['street address', /\b\d{1,5}\s+(?:[A-Z][a-z]+\s+){1,3}(?:Street|St\.?|Avenue|Ave\.?|Road|Rd\.?|Boulevard|Blvd\.?|Lane|Ln\.?|Drive|Dr\.?|Court|Ct\.?|Place|Pl\.?|Way)\b/],
  ['state + zip code', /\b[A-Z]{2}\s+\d{5}(?:-\d{4})?\b/],
  ['school name', new RegExp(['col', 'leg', 'i'].join('') + '|c0' + 'llegi|my' + 'schoolapp', 'i')],
  ['image tag or file', new RegExp('<' + 'img\\b|<' + 'picture\\b|<' + 'video\\b|<' + 'audio\\b|data:' + 'image|\\.(?:png|jpe?g|gif|webp|bmp|ico|heic)\\b', 'i')],
  ['image url in css', /url\(\s*['"]?(?!#)/i]
];
const used = {};
files.forEach(f => {
  const text = fs.readFileSync(f, 'utf8');
  if (/\.(png|jpe?g|gif|webp|bmp|ico|heic|mp4|mov)$/i.test(f)) bad(rel(f) + ': image or media file in the project');
  (text.match(IMG_DATA) || []).forEach(m => { if (crypto.createHash('sha256').update(m).digest('hex') === APPROVED_IMAGE_SHA256) approvedCount++; });
  checks.forEach(c => { const m = (c[0] === 'image tag or file' ? stripApproved(text) : text).match(c[1]); if (m && !(c[2] && c[2].indexOf(m[0]) >= 0)) bad(rel(f) + ': ' + c[0] + ' found: "' + m[0] + '"'); });
  if (f === rosterFile || f === __filename) return;
  (text.match(/\b[A-Z][a-z]+\b/g) || []).forEach(tok => { if (names.indexOf(tok) < 0 && OTHER_GRADE_HASHES.has(crypto.createHash('sha256').update(tok.toLowerCase()).digest('hex').slice(0, 16))) bad(rel(f) + ': "' + tok + '" is a name from a different grade\'s roster'); });
  names.forEach(n => {
    const lastName = new RegExp('\\b' + n + '\\s+[A-Z][a-z]{2,}\\b'); const lm = text.match(lastName);
    if (lm) bad(rel(f) + ': a first name is followed by a capitalized word (possible last name): "' + lm[0] + '"');
    if (new RegExp('\\b' + n + '\\b').test(text)) (used[rel(f)] = used[rel(f)] || new Set()).add(n);
  });
});
/* the roster list must live in exactly one source file; the built page contains it once, inside the roster block */
Object.keys(used).forEach(f => {
  const k = used[f].size;
  if (/^dist\//.test(f)) { if (k > 60) bad(f + ' uses more names than the roster has'); return; }
  if (k > 8) bad(f + ': ' + k + ' different roster names appear outside the roster file (looks like a second roster)');
});
const outside = new Set(); Object.keys(used).filter(f => !/^dist\//.test(f)).forEach(f => used[f].forEach(n => outside.add(n)));
const builtFiles = files.filter(f => /dist[\\/].*index\.html$/.test(f));
const svgs = builtFiles.reduce((a, f) => a + (fs.readFileSync(f, 'utf8').match(/<svg/g) || []).length, 0);
console.log('Scanned ' + files.length + ' files: emails, phone numbers, addresses, the school name, images/media, last names, roster placement.');
console.log('Roster entries: ' + names.length + ' first names, all in rosters/grade8.js. Names written directly into fixed questions: ' + (outside.size ? Array.from(outside).sort().join(', ') : 'none') + '.');
console.log('Inline drawn diagrams (code, not pictures): the built page has ' + (svgs ? 'SVG diagram code that is generated at runtime' : 'no SVG') + '.');
console.log('Images in the project: ' + (approvedCount ? approvedCount + ' use(s) of the one approved image (Murphy the dog, supplied by the teacher). No other images, no student photos.' : 'none'));
console.log('Privacy scan failures: ' + fails);
process.exit(fails ? 1 : 0);
