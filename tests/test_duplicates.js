'use strict';
/* Compares every question against YOUR originals (tests, quizzes, homework, warm-ups).
   Your originals are NOT stored in the repo. Point ORIGINALS at a folder of .txt files on your own computer.
   FAIL = essentially a copy.  REVIEW = very similar wording (fine for "near-parallel", but look at it). */
const fs = require('fs'), path = require('path'), vm = require('vm');
const dir = process.env.ORIGINALS || path.join(__dirname, '..', '..', 'originals');
if (!fs.existsSync(dir)) { console.log('No originals folder found at ' + dir + '. Skipping the duplicate check (set ORIGINALS=/path).'); process.exit(0); }
const ctx = require('./load.js')(['roster', 'core', 'unit', 'qapi', 'banks', 'registry']);
const run = s => vm.runInContext(s, ctx);
const norm = s => String(s).replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').toLowerCase().replace(/[^a-z0-9. ]+/g, ' ').replace(/\s+/g, ' ').trim();
const words = s => s.split(' ').filter(Boolean);
const roster = run('ROSTER.names').map(n => n.toLowerCase());
const stop = new Set(roster);
const origs = [];
fs.readdirSync(dir).filter(f => f.endsWith('.txt')).forEach(f => {
  fs.readFileSync(path.join(dir, f), 'utf8').split(/\n+/).forEach(line => {
    const n = norm(line); if (words(n).length >= 6) origs.push({ f: f, raw: line.trim(), n: n, w: new Set(words(n).filter(x => !stop.has(x))) });
  });
});
function sim(aN, bO) { const a = new Set(words(aN).filter(x => !stop.has(x))); let inter = 0; a.forEach(x => { if (bO.w.has(x)) inter++; }); const uni = a.size + bO.w.size - inter; return uni ? inter / uni : 0; }
let fail = 0, review = [];
const keys = run('QDEFS.order');
keys.forEach(key => {
  const d = run('QDEFS.byKey["' + key + '"]'); const reps = d.kind === 'template' ? 40 : 1;
  let best = { s: 0 };
  for (let i = 0; i < reps; i++) {
    run('setRng(mulberry32(' + (50 + i * 31) + '))');
    const q = run('makeQuestion("' + key + '")'); const pn = norm(q.prompt);
    origs.forEach(o => {
      let s = sim(pn, o); if (pn === o.n) s = 1;
      if (s > best.s) best = { s: s, o: o, p: q.prompt.replace(/<svg[\s\S]*?<\/svg>/g, '[diagram]').replace(/<[^>]+>/g, '') };
    });
  }
  if (best.s >= 0.85) { fail++; console.log('  FAIL (copy?) ' + key + ' ' + best.s.toFixed(2) + '\n    mine: ' + best.p + '\n    orig: ' + best.o.raw + ' [' + best.o.f + ']'); }
  else if (best.s >= 0.5) review.push({ key: key, s: best.s, mine: best.p, orig: best.o.raw, f: best.o.f });
});
review.sort((a, b) => b.s - a.s);
console.log(review.length + ' near-matches to review (similar wording, not copies):');
review.forEach(r => console.log('  ' + r.key + ' (' + r.s.toFixed(2) + ')\n    mine: ' + r.mine.slice(0, 160) + '\n    orig: ' + r.orig.slice(0, 160) + ' [' + r.f + ']'));
console.log('Compared ' + keys.length + ' IDs against ' + origs.length + ' original lines. Copies found: ' + fail);
process.exit(fail ? 1 : 0);
