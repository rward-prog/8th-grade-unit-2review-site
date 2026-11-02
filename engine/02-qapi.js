'use strict';
/* ======================= QUESTION REGISTRY =======================
   Fixed items (F) are one question each. Templates (T) are skills that make fresh numbers/names each time.
   Every item or skill has a permanent ID. Never rename, renumber, or reuse an ID. */
const QDEFS = { byKey: {}, order: [] };
function _add(key, def) {
  if (QDEFS.byKey[key]) throw new Error('Duplicate ID: ' + key);
  QDEFS.byKey[key] = def; QDEFS.order.push(key);
}
/* F(id, topic, prior, prompt, rightHTML, [[wrongHTML, why],...], explain, {hint}) */
function F(id, topic, prior, prompt, right, wrongs, explain, opt) {
  opt = opt || {};
  _add(id, { kind: 'fixed', key: id, topic: topic, chal: topic === 'chal', prior: prior, prompt: prompt,
    right: right, wrongs: wrongs, explain: explain, hint: opt.hint || null,
    label: String(prompt).replace(/<[^>]+>/g, '').slice(0, 90) });
}
/* T(id, topic, prior, name, gen) where gen() returns {prompt, right, wrongs, explain, hint?, meta?} */
function T(id, topic, prior, name, gen) {
  _add(id, { kind: 'template', key: id, topic: topic, chal: topic === 'chal', prior: prior, label: name, gen: gen });
}
function makeQuestion(key) {
  const d = QDEFS.byKey[key];
  if (!d) throw new Error('Unknown question key: ' + key);
  const g = d.kind === 'fixed' ? d : d.gen();
  // g.ordered = a fixed A-D order (used when an answer says "Choices A and B"); otherwise choices are shuffled
  const choices = g.ordered ? g.ordered : [{ html: g.right, ok: true, why: '' }].concat(g.wrongs.map(w => ({ html: w[0], ok: false, why: w[1] })));
  return { key: key, kind: d.kind, topic: d.topic, chal: d.chal, prior: d.prior, label: d.label,
    prompt: g.prompt, choices: g.ordered ? choices : shuffle(choices), explain: g.explain, hint: g.hint || d.hint || null, meta: g.meta || null };
}
