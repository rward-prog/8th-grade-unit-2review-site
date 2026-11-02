'use strict';
/* ======================= USER INTERFACE ======================= */
const $ = (s, el) => (el || document).querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const LETTERS = ['A', 'B', 'C', 'D'];
const HOME = { panel: null, sel: {} };
let SESSION = null;
let CLASS_MODE = 'test';
const MURPHY_OK = ['Murphy wags his tail. Nice work!', 'Tail wag! That\u2019s the one.', 'Murphy gives that a happy bark.', 'Murphy approves.'];
const MURPHY_NO = ['Murphy tilts his head. Read the notes below, then try the next one.', 'Murphy nudges you with his nose: check why each choice is or isn\u2019t right.', 'Not this time, and that\u2019s how we learn it.'];

function go(h) { if (location.hash === h) render(); else location.hash = h; }
function gauge(d) { return '<span class="gauge" role="img" aria-label="Difficulty ' + d + ' out of 100"><i style="width:' + d + '%"></i></span>'; }
function chip(t) { return '<span class="chip">' + esc(UNIT.topicById[t].name) + '</span>'; }
function statusChip(t) { const s = topicStatus(t); return '<span class="status s-' + s.id + '">' + s.label + '</span>'; }

/* ---------- header / shell ---------- */
function shell(inner, opts) {
  opts = opts || {};
  return '<header class="top"><a class="brand" href="#/" aria-label="Home"><img class="dog" src="' + MURPHY_IMG + '" alt="Murphy the dog" width="48" height="48">' +
    '<span><b>' + esc(UNIT.title) + '</b><small>Grade ' + UNIT.grade + ' review</small></span></a>' +
    '<nav aria-label="Sections"><a href="#/">Home</a><a href="#/notes">Study notes</a><a href="#/tips">Test tips</a><a href="#/written">Written response</a><a href="#/insights">Class insights</a><a href="#/code">Save or restore</a></nav></header>' +
    '<main id="main" tabindex="-1" class="' + (opts.cls || '') + '">' + inner + '</main>';
}

/* ---------- home ---------- */
function homeView() {
  loadClassLocal();
  const anyProg = Object.keys(S.keys).length > 0;
  let panel = '';
  if (HOME.panel === 'quiz') {
    panel = '<div class="panel"><h3>Which homework quiz?</h3><div class="list">' + UNIT.quizzes.map(q =>
      '<button class="row" data-act="pick-quiz" data-id="' + q.id + '"><span class="rt"><b>' + esc(q.name) + '</b><small>' +
      q.topics.map(t => esc(UNIT.topicById[t].name)).join(', ') + '</small></span>' + gauge(Math.round(q.topics.reduce((s, t) => s + topicDifficulty(t), 0) / q.topics.length)) + '</button>').join('') + '</div></div>';
  } else if (HOME.panel === 'topics') {
    const n = Object.keys(HOME.sel).filter(k => HOME.sel[k]).length;
    panel = '<div class="panel"><h3>Pick any topics. Mix and match.</h3><div class="checks">' + UNIT.topics.map(t =>
      '<label class="chk"><input type="checkbox" data-act="topic-toggle" data-id="' + t.id + '"' + (HOME.sel[t.id] ? ' checked' : '') + '><span>' + esc(t.name) + '</span>' + statusChip(t.id) + '</label>').join('') +
      '</div><button class="btn" data-act="go-topics"' + (n ? '' : ' disabled') + '>Study ' + (n ? n + ' topic' + (n > 1 ? 's' : '') : 'these topics') + '</button></div>';
  }
  const ready = unitReadiness();
  return shell(
    '<section class="hero"><h1>What are you studying for?</h1><p class="lead">Pick one. Everything you do here is saved on this device, and you can move to another computer with a code.</p>' +
    '<div class="opts">' +
    optCard('quiz', 'A homework quiz', 'Practice just the topics from one homework and its quiz.') +
    optCard('topics', 'Topics I choose', 'Pick one topic or mix several, like weight and free fall together.') +
    optCard('unit', 'The whole unit test', 'Everything on the test. Starts with a quick pre-check to find your weak spots.') +
    optCard('chal', 'Challenge', 'Goes above and beyond the test, but it\u2019s good to know!') +
    '</div>' + panel + '</section>' +
    '<section class="where"><h2>Where you stand</h2>' + (anyProg
      ? '<p><b>' + ready + '%</b> of the test topics are marked Ready. Challenge questions don\u2019t count toward this.</p>' : '<p>Nothing yet. Start with any option above.</p>') +
    '<div class="tgrid">' + UNIT.topics.map(t => '<div class="tcell"><span>' + esc(t.name) + '</span>' + statusChip(t.id) + '<span class="tough">How tough: ' + topicDifficulty(t.id) + '/100</span></div>').join('') + '</div></section>');
}
function optCard(id, title, text) {
  const on = HOME.panel === id ? ' on' : '';
  return '<button class="opt' + on + '" data-act="opt" data-id="' + id + '"><b>' + title + '</b><span>' + text + '</span></button>';
}

/* ---------- plan (before the pre-check) ---------- */
function planView() {
  const sc = S.scope; if (!sc) return homeView();
  const chal = sc.type === 'chal';
  const rows = sc.topics.map(t => '<div class="trow"><div><b>' + esc(UNIT.topicById[t].name) + '</b>' + (chal ? '' : statusChip(t)) + '</div>' +
    '<div class="tough">How tough is this section? ' + topicDifficulty(t) + '/100 ' + gauge(topicDifficulty(t)) + '</div></div>').join('');
  const n = chal ? 0 : buildCheck(sc).length;
  return shell('<section class="card"><p class="kicker">' + (chal ? 'Beyond the test' : 'Your plan') + '</p><h1>' + esc(sc.label) + '</h1>' +
    (chal ? '<p class="banner">This goes beyond the test, but it\u2019s good to know! These questions are tracked separately and don\u2019t count toward your test readiness.</p>' : '') +
    '<div class="tlist">' + rows + '</div>' +
    (chal
      ? '<div class="btns"><button class="btn" data-act="start-practice">Start Challenge</button></div>'
      : '<p>A pre-check of ' + n + ' questions finds the topics that need the most work. Then your study plan pre-checks them for you. Hints are off during checks.</p>' +
        '<div class="btns"><button class="btn" data-act="pre">Take the ' + n + '-question pre-check</button><button class="btn ghost" data-act="start-practice">Skip to practice</button></div>') +
    '<p><a href="#/">\u2190 Pick something else</a></p></section>');
}

/* ---------- question ---------- */
function startCheck(kind) {
  const avoid = kind === 'post' ? (S._preKeys || null) : null;
  SESSION = { mode: kind, scope: S.scope, queue: buildCheck(S.scope, avoid), idx: 0, results: [], recent: [] };
  if (kind === 'pre') { S._preKeys = SESSION.queue.slice(); saveState(); }
  nextQuestion();
}
function startPractice(topics) {
  const base = S.scope || scopeUnit();
  const scope = topics ? Object.assign({}, base, { topics: topics }) : base;
  SESSION = { mode: base.type === 'chal' ? 'chal' : 'practice', scope: scope, results: [], recent: [] };
  nextQuestion();
}
function nextQuestion() {
  const sc = SESSION;
  let key;
  if (sc.mode === 'pre' || sc.mode === 'post') { if (sc.idx >= sc.queue.length) return finishCheck(); key = sc.queue[sc.idx]; }
  else { key = nextPracticeKey(sc.scope, sc.recent); sc.recent.push(key); if (sc.recent.length > 3) sc.recent.shift(); }
  Object.assign(sc, { q: makeQuestion(key), picked: null, conf: null, hints: 0, elim: [], hintTexts: [], showed: false, done: false });
  go('#/q');
}
function qView() {
  if (!SESSION || !SESSION.q) return homeView();
  const s = SESSION, q = s.q, check = s.mode === 'pre' || s.mode === 'post';
  const d = difficulty(q.key);
  const modeLbl = { pre: 'Pre-check', post: 'Post-check', practice: 'Practice', chal: 'Challenge' }[s.mode];
  const prog = check ? 'Question ' + (s.done ? s.idx : s.idx + 1) + ' of ' + s.queue.length : 'Question ' + (s.results.length + 1) + (s.results.length ? ' \u00b7 ' + s.results.filter(r => r.ok).length + ' of ' + s.results.length + ' right so far' : '');
  const choices = q.choices.map((c, i) => {
    let cls = 'ch';
    if (s.done) cls += c.ok ? ' right' : (i === s.picked ? ' wrong' : ' off');
    else { if (i === s.picked) cls += ' sel'; if (s.elim.indexOf(i) >= 0) cls += ' gone'; }
    return '<li><button class="' + cls + '" data-act="choose" data-i="' + i + '"' + ((s.done || s.elim.indexOf(i) >= 0) ? ' disabled' : '') + ' aria-pressed="' + (i === s.picked) + '">' +
      '<span class="ltr">' + LETTERS[i] + '</span><span class="ctext">' + c.html + '</span></button>' +
      (s.done && !c.ok ? '<div class="why"><b>Why not ' + LETTERS[i] + '?</b> ' + esc(c.why) + '</div>' : '') +
      (s.done && c.ok ? '<div class="why good"><b>Why ' + LETTERS[i] + ' is right:</b> ' + esc(q.explain.replace(/<[^>]+>/g, '')) + '</div>' : '') + '</li>';
  }).join('');
  const hintBox = s.hintTexts.map(t => '<p class="hint">' + t + '</p>').join('') + (s.showed && !s.done ? '<div class="how"><b>Show me how:</b> ' + q.explain + '</div>' : '');
  const conf = !s.done ? '<div class="conf" role="group" aria-label="How sure are you?"><span>How sure are you?</span>' +
    [['sure', 'Sure'], ['mid', 'Pretty sure'], ['guess', 'Guessing']].map(c => '<button class="pill' + (s.conf === c[0] ? ' on' : '') + '" data-act="conf" data-v="' + c[0] + '">' + c[1] + '</button>').join('') + '</div>' : '';
  let fb = '';
  if (s.done) {
    const c = s.q.choices[s.picked], ok = c && c.ok, last = s.results[s.results.length - 1];
    const d2 = difficulty(q.key);
    fb = '<div class="fb ' + (ok ? 'fb-ok' : 'fb-no') + '" role="status"><b>' + (ok ? 'Correct!' : (last && last.skipped ? 'Skipped.' : 'Not quite.')) + '</b> ' + (ok ? MURPHY_OK[ri(0, MURPHY_OK.length - 1)] : MURPHY_NO[ri(0, MURPHY_NO.length - 1)]) +
      (!ok && s.conf === 'sure' && !(last && last.skipped) ? ' You were sure, so this is a great one to learn from.' : '') +
      (s.showed ? ' (Used Show me how, so this one doesn\u2019t count toward class data.)' : '') +
      '<div class="tough">How tough: ' + d2 + '/100 \u00b7 ' + diffBand(d2) + ' \u00b7 ' + diffLabel(q.key) + '</div></div>';
  }
  const lastQ = check && s.done && s.idx >= s.queue.length;
  const action = s.done
    ? '<button class="btn" data-act="next">' + (lastQ ? 'See my results' : 'Next question') + '</button>' +
      (!check ? '<button class="btn ghost" data-act="finish-practice">I\u2019m done: check how I did</button>' : '')
    : '<button class="btn" data-act="check"' + (s.picked === null ? ' disabled' : '') + '>Check answer</button>' +
      (!check ? '<button class="btn ghost" data-act="hint"' + (s.hints >= 3 ? ' disabled' : '') + '>Hint (' + s.hints + ' of 3 used)</button><button class="btn ghost" data-act="how">Show me how</button>' : '') +
      '<button class="btn quiet" data-act="skip">Skip</button>';
  const diffLine = '<div class="tough">How tough: <b>' + d + '/100</b> \u00b7 ' + diffBand(d) + ' \u00b7 ' + diffLabel(q.key) + ' ' + gauge(d) + '</div>';
  return shell('<section class="card q' + (s.mode === 'chal' ? ' chalcard' : '') + '">' +
    (s.mode === 'chal' ? '<p class="banner">This goes beyond the test, but it\u2019s good to know!</p>' : '') +
    '<div class="qhead"><span class="mode">' + modeLbl + '</span>' + chip(q.topic) + '<span class="prog">' + prog + '</span></div>' +
    (s.done ? '' : diffLine) +
    '<div class="prompt">' + q.prompt + '</div>' + (check ? '' : hintBox) +
    '<ol class="choices' + (q.choices.every(c => c.html.indexOf('<svg') === 0) ? ' diag' : '') + '">' + choices + '</ol>' + conf + fb + '<div class="btns">' + action + '</div>' +
    (check ? '<p class="small">Hints are off during checks. Your answer still gets full feedback afterward.</p>' : '') +
    '<p class="small"><a href="#/">Stop and go home</a></p></section>', { cls: 'wide' });
}
function answer(skipped) {
  const s = SESSION, q = s.q;
  const c = skipped ? null : q.choices[s.picked], ok = !!(c && c.ok);
  const assisted = s.showed ? 'how' : (s.hints > 0 ? 'hint' : null);
  if (!skipped) {
    recordLocal(q.key, ok, assisted, s.conf);
    if (!assisted) reportClass(q.key, ok);
  }
  s.results.push({ key: q.key, topic: q.topic, ok: ok, skipped: !!skipped });
  s.done = true; if (skipped) s.picked = -1;
  if (s.mode === 'pre' || s.mode === 'post') s.idx += 1;
  render();
  const el = document.querySelector('.fb'); if (el) el.scrollIntoView({ block: 'nearest', behavior: 'auto' });
}
function finishCheck() {
  const s = SESSION, kind = s.mode, per = {};
  s.scope.topics.forEach(t => per[t] = [0, 0]);
  s.results.forEach(r => { if (per[r.topic]) { per[r.topic][1] += 1; if (r.ok) per[r.topic][0] += 1; } });
  Object.keys(per).forEach(t => { if (per[t][1]) S[kind][t] = per[t]; });
  saveState();
  s.finished = { kind: kind, per: per };
  go('#/result');
}

/* ---------- results: study plan (after pre) and growth view (after post) ---------- */
function resultView() {
  const s = SESSION; if (!s || !s.finished) return homeView();
  const f = s.finished, per = f.per, topics = Object.keys(per);
  const tot = topics.reduce((a, t) => [a[0] + per[t][0], a[1] + per[t][1]], [0, 0]);
  if (f.kind === 'pre') {
    const weak = topics.filter(t => per[t][1] && per[t][0] / per[t][1] < 0.75);
    const pick = weak.length ? weak : topics;
    const rows = topics.map(t => '<label class="chk"><input type="checkbox" data-act="plan-toggle" data-id="' + t + '"' + (pick.indexOf(t) >= 0 ? ' checked' : '') + '><span><b>' + esc(UNIT.topicById[t].name) + '</b>' +
      '<small>' + per[t][0] + ' of ' + per[t][1] + ' right on the pre-check</small></span><span class="tough">' + topicDifficulty(t) + '/100</span></label>').join('');
    return shell('<section class="card"><p class="kicker">Pre-check done</p><h1>' + tot[0] + ' of ' + tot[1] + ' right</h1>' +
      '<p>' + (weak.length ? 'Here is your study plan. The topics that need the most work are already checked.' : 'Every topic looks solid. Keep it sharp: all topics are checked for practice.') + '</p>' +
      '<div class="checks">' + rows + '</div><div class="btns"><button class="btn" data-act="start-plan">Start practice</button></div></section>');
  }
  const rows = topics.map(t => {
    const pre = S.pre[t], post = per[t];
    const dp = pre && pre[1] ? Math.round(100 * pre[0] / pre[1]) : null, dq = post[1] ? Math.round(100 * post[0] / post[1]) : 0;
    const delta = dp === null ? '' : (dq - dp > 0 ? '<span class="up">+' + (dq - dp) + ' points</span>' : dq - dp < 0 ? '<span class="down">' + (dq - dp) + ' points</span>' : '<span>same</span>');
    return '<div class="grow"><b>' + esc(UNIT.topicById[t].name) + '</b><div class="bars"><span>Before ' + (dp === null ? '\u2013' : dp + '%') + '</span><i class="bar b0" style="width:' + (dp || 0) + '%"></i>' +
      '<span>After ' + dq + '%</span><i class="bar b1" style="width:' + dq + '%"></i></div>' + delta + '</div>';
  }).join('');
  return shell('<section class="card"><p class="kicker">Post-check done</p><h1>' + tot[0] + ' of ' + tot[1] + ' right</h1><p>Here is how each topic changed from your pre-check. Everything is saved on this device.</p>' +
    '<div class="growth">' + rows + '</div><div class="btns"><button class="btn" data-act="start-practice">Practice more</button><a class="btn ghost" href="#/code">Save my code</a><a class="btn ghost" href="#/">Home</a></div></section>');
}

/* ---------- notes, tips, written ---------- */
function notesView() {
  const sec = t => '<article class="card note"><h2>' + esc(UNIT.topicById[t].name) + '</h2><ul>' + NOTES[t].map(x => '<li>' + x + '</li>').join('') + '</ul></article>';
  return shell('<h1>Study notes</h1><p class="lead">Short notes in the same words as your class notes.</p>' + UNIT.topics.map(t => sec(t.id)).join('') +
    '<article class="card note chalcard"><p class="banner">This goes beyond the test, but it\u2019s good to know!</p><h2>Challenge notes</h2><ul>' + NOTES.chal.map(x => '<li>' + x + '</li>').join('') + '</ul></article>');
}
function tipsView() {
  return shell('<h1>Test tips</h1><p class="lead">Habits that help on any test in this unit.</p><div class="tips">' + TIPS.map(t => '<article class="card"><h3>' + t[0] + '</h3><p>' + t[1] + '</p></article>').join('') + '</div>');
}
function writtenView() {
  return shell('<h1>Written-response practice</h1><p class="lead">Not graded and not tracked. Try writing your own answer first, then open the sample.</p>' +
    WRITTEN.map((w, i) => '<details class="card wr"><summary><b>' + esc(w.title) + '</b></summary><p class="prompt">' + w.prompt + '</p>' +
      '<h4>Ways you could approach it</h4><ul>' + w.approaches.map(a => '<li>' + a + '</li>').join('') + '</ul>' +
      '<h4>A strong sample answer</h4><blockquote>' + w.sample + '</blockquote><h4>What makes it strong</h4><ul>' + w.why.map(a => '<li>' + a + '</li>').join('') + '</ul></details>').join(''));
}

/* ---------- class insights ---------- */
function insightsView() {
  const topicRows = UNIT.topics.map(t => {
    const ks = keysOfTopic(t.id), tries = ks.reduce((a, k) => a + (CLASS[k] ? CLASS[k][0] : 0), 0);
    return '<tr><td>' + esc(t.name) + '</td><td>' + tries + '</td><td>' + (tries >= UNIT.minShow ? topicDifficulty(t.id) + '/100 ' + gauge(topicDifficulty(t.id)) : 'Starting estimate: ' + topicDifficulty(t.id) + '/100') + '</td></tr>';
  }).join('');
  const quizRows = UNIT.quizzes.map(q => {
    const ks = q.topics.reduce((a, t) => a.concat(keysOfTopic(t)), []), tries = ks.reduce((a, k) => a + (CLASS[k] ? CLASS[k][0] : 0), 0);
    const d = Math.round(q.topics.reduce((s, t) => s + topicDifficulty(t), 0) / q.topics.length);
    return '<tr><td>' + esc(q.name) + '</td><td>' + tries + '</td><td>' + d + '/100 ' + gauge(d) + '</td></tr>';
  }).join('');
  const itemRow = k => {
    const c = CLASS[k] || [0, 0], d = QDEFS.byKey[k], diff = difficulty(k), ex = expectation(k);
    const st = c[0] < UNIT.minShow ? '<span class="status s-new">Not enough data yet</span>' : ex === 'harder' ? '<span class="status s-work">Harder than expected</span>' : ex === 'easier' ? '<span class="status s-ready">Easier than expected</span>' : '<span class="status s-almost">About as expected</span>';
    return '<tr><td>' + esc(d.label) + '<small>' + (d.kind === 'template' ? 'Skill (new numbers each time) \u00b7 ' : '') + esc(k) + '</small></td><td>' + esc(UNIT.topicById[d.topic].name) + '</td><td>' + c[0] + '</td><td>' + c[1] + '</td><td>' + (c[0] < UNIT.minShow ? 'Estimate ' + d.prior : diff + '/100') + '</td><td>' + st + '</td></tr>';
  };
  const graded = QDEFS.order.filter(k => !QDEFS.byKey[k].chal).sort((a, b) => difficulty(b) - difficulty(a));
  const chal = QDEFS.order.filter(k => QDEFS.byKey[k].chal).sort((a, b) => difficulty(b) - difficulty(a));
  const banner = CLASS_MODE === 'live' ? '<p class="banner ok">Live class data. Every number here is anonymous: no names, no student information.</p>'
    : CLASS_MODE === 'offline' ? '<p class="banner">Could not reach the class data right now, so this page is showing estimates and this device only. Try again later.</p>'
    : '<p class="banner">Test mode: the class counters are not connected yet, so only answers from this device are counted here. When the site is connected, this page will show the whole class.</p>';
  return shell('<h1>Class insights</h1><p class="lead">What is hard in this unit, based on every student\u2019s answers. Nothing here identifies a student.</p>' + banner +
    '<div class="card"><h2>Unit difficulty: ' + unitDifficulty() + '/100 ' + gauge(unitDifficulty()) + '</h2><p class="small">Starts as my estimate and moves toward real class data. With about ' + UNIT.minTrust + ' tries on a question, the number is mostly real data. Challenge is not included.</p></div>' +
    '<div class="card"><h2>By homework quiz</h2><div class="scroll"><table><thead><tr><th>Quiz</th><th>Tries</th><th>How tough</th></tr></thead><tbody>' + quizRows + '</tbody></table></div></div>' +
    '<div class="card"><h2>By topic</h2><div class="scroll"><table><thead><tr><th>Topic</th><th>Tries</th><th>How tough</th></tr></thead><tbody>' + topicRows + '</tbody></table></div></div>' +
    '<div class="card"><h2>Every question and skill, hardest first</h2><div class="scroll"><table><thead><tr><th>Question</th><th>Topic</th><th>Tries</th><th>Misses</th><th>How tough</th><th>Compared with my estimate</th></tr></thead><tbody>' + graded.map(itemRow).join('') + '</tbody></table></div></div>' +
    '<div class="card chalcard"><p class="banner">This goes beyond the test, but it\u2019s good to know!</p><h2>Challenge (tracked separately)</h2><div class="scroll"><table><thead><tr><th>Question</th><th>Topic</th><th>Tries</th><th>Misses</th><th>How tough</th><th>Compared with my estimate</th></tr></thead><tbody>' + chal.map(itemRow).join('') + '</tbody></table></div></div>');
}

/* ---------- save and restore ---------- */
let CODE_MSG = '';
function codeView() {
  return shell('<h1>Save or restore my progress</h1><p class="lead">Your practice history lives on this device. To keep going on another computer, copy your code, open this unit there, and paste it in.</p>' +
    '<div class="card"><h2>My code</h2><textarea id="mycode" readonly rows="4" aria-label="My progress code">' + esc(encodeProgress(S)) + '</textarea>' +
    '<div class="btns"><button class="btn" data-act="copy-code">Copy my code</button></div><p class="small" id="copymsg" role="status"></p></div>' +
    '<div class="card"><h2>Restore from a code</h2><textarea id="incode" rows="4" placeholder="Paste a code that starts with ' + UNIT.codePrefix + '" aria-label="Paste a progress code"></textarea>' +
    '<div class="btns"><button class="btn" data-act="restore-code">Restore</button></div><p class="small" id="restoremsg" role="status">' + esc(CODE_MSG) + '</p></div>' +
    '<div class="card"><h2>Start over</h2><p class="small">Clears the practice history on this device. Class data is not affected.</p><div class="btns"><button class="btn quiet" data-act="reset">Clear my progress</button></div></div>');
}

/* ---------- router ---------- */
async function render() {
  const h = location.hash || '#/';
  const app = $('#app');
  let html;
  if (h === '#/plan') html = planView();
  else if (h === '#/q') html = qView();
  else if (h === '#/result') html = resultView();
  else if (h === '#/notes') html = notesView();
  else if (h === '#/tips') html = tipsView();
  else if (h === '#/written') html = writtenView();
  else if (h === '#/code') html = codeView();
  else if (h === '#/insights') { loadClassLocal(); app.innerHTML = shell('<p class="lead">Loading class data\u2026</p>'); CLASS_MODE = await refreshClass(); html = insightsView(); }
  else html = homeView();
  app.innerHTML = html;
  const nv = app.querySelectorAll('nav a'); nv.forEach(a => { if (a.getAttribute('href') === h) a.setAttribute('aria-current', 'page'); });
  if (!window.__noscroll) window.scrollTo(0, 0);
}

const ACT = {
  opt(el) {
    const id = el.dataset.id;
    if (id === 'quiz' || id === 'topics') { HOME.panel = HOME.panel === id ? null : id; render(); }
    else { S.scope = id === 'unit' ? scopeUnit() : scopeChal(); saveState(); go('#/plan'); }
  },
  'pick-quiz'(el) { S.scope = scopeQuiz(el.dataset.id); saveState(); go('#/plan'); },
  'topic-toggle'(el) { HOME.sel[el.dataset.id] = el.checked; const b = $('[data-act="go-topics"]'); const n = Object.keys(HOME.sel).filter(k => HOME.sel[k]).length; if (b) { b.disabled = !n; b.textContent = 'Study ' + (n ? n + ' topic' + (n > 1 ? 's' : '') : 'these topics'); } },
  'go-topics'() { const ids = UNIT.topics.map(t => t.id).filter(t => HOME.sel[t]); if (ids.length) { S.scope = scopeTopics(ids); saveState(); go('#/plan'); } },
  pre() { startCheck('pre'); },
  'start-practice'() { startPractice(); },
  'plan-toggle'(el) { el.dataset.on = el.checked ? '1' : '0'; },
  'start-plan'() { const ids = Array.prototype.map.call(document.querySelectorAll('[data-act="plan-toggle"]:checked'), x => x.dataset.id); if (!ids.length) return; startPractice(ids); },
  choose(el) { if (SESSION.done) return; SESSION.picked = Number(el.dataset.i); render(); },
  conf(el) { SESSION.conf = el.dataset.v; render(); },
  check() { if (SESSION.picked !== null && !SESSION.done) answer(false); },
  skip() { if (!SESSION.done) answer(true); },
  next() { nextQuestion(); },
  hint() {
    const s = SESSION, q = s.q; if (s.hints >= 3 || s.done) return; s.hints += 1;
    const wrongIdx = q.choices.map((c, i) => c.ok ? -1 : i).filter(i => i >= 0 && s.elim.indexOf(i) < 0 && i !== s.picked);
    if (s.hints === 1) s.hintTexts.push('<b>Hint 1:</b> ' + UNIT.topicById[q.topic].idea);
    else if (s.hints === 2 && q.hint) s.hintTexts.push('<b>Hint 2:</b> ' + q.hint);
    else if (wrongIdx.length) { const i = pick(wrongIdx); s.elim.push(i); s.hintTexts.push('<b>Hint ' + s.hints + ':</b> Choice ' + LETTERS[i] + ' is not right. I crossed it out.'); }
    else s.hintTexts.push('<b>Hint ' + s.hints + ':</b> Try reading the question again and compare the choices that are left.');
    render();
  },
  how() { if (!SESSION.done) { SESSION.showed = true; render(); } },
  'finish-practice'() { if (SESSION.results.length < 1) return; startCheck('post'); },
  'copy-code'() {
    const t = $('#mycode'); const msg = $('#copymsg');
    const ok = () => { msg.textContent = 'Copied. Paste it somewhere safe, or into this page on another computer.'; };
    try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(t.value).then(ok, () => { t.select(); document.execCommand('copy'); ok(); }); return; } } catch (e) {}
    t.select(); try { document.execCommand('copy'); ok(); } catch (e) { msg.textContent = 'Select the code and copy it yourself.'; }
  },
  'restore-code'() {
    const r = decodeProgress($('#incode').value), msg = $('#restoremsg');
    if (!r.ok) { msg.textContent = r.error; return; }
    if (Object.keys(S.keys).length && !window.confirm('This replaces the progress on this device with the code\u2019s progress. Continue?')) return;
    const scope = S.scope; S = r.state; S.scope = scope; saveState();
    const n = Object.keys(S.keys).length; msg.textContent = 'Restored! ' + n + ' question' + (n === 1 ? '' : 's') + ' of history came back.';
  },
  reset() { if (window.confirm('Clear all practice history on this device?')) { S = newState(); saveState(); go('#/'); } }
};
document.addEventListener('click', e => { const el = e.target.closest('[data-act]'); if (!el || el.tagName === 'INPUT') return; if (el.disabled) return; ACT[el.dataset.act] && ACT[el.dataset.act](el, e); });
document.addEventListener('change', e => { const el = e.target; if (el.tagName === 'INPUT' && el.dataset.act && ACT[el.dataset.act]) ACT[el.dataset.act](el, e); });
window.addEventListener('hashchange', render);
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => { loadState(); loadClassLocal(); render(); });
}
