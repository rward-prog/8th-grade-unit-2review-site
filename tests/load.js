'use strict';
/* Loads the site's JavaScript into a Node VM (no browser) so tests can run the real code.
   Same file order as build.py. Groups: roster, core, unit, qapi, banks, content, registry, engine, codes */
const fs = require('fs'), vm = require('vm'), path = require('path');
const ROOT = path.join(__dirname, '..');
const UNIT_DIR = process.env.UNIT_DIR || 'units/8-forces';
function files(groups) {
  const u = path.join(ROOT, UNIT_DIR), ul = fs.readdirSync(u).filter(f => f.endsWith('.js'));
  const grade = /grade:\s*(\d+)/.exec(fs.readFileSync(path.join(u, '00-unit.js'), 'utf8'))[1];
  const G = {
    roster: [path.join(ROOT, 'rosters', 'grade' + grade + '.js')],
    core: [path.join(ROOT, 'engine', '01-core.js')],
    unit: [path.join(u, '00-unit.js')],
    qapi: [path.join(ROOT, 'engine', '02-qapi.js')],
    banks: ul.filter(f => /^1\d-bank/.test(f)).sort().map(f => path.join(u, f)),
    content: ul.filter(f => f.startsWith('20-')).map(f => path.join(u, f)),
    registry: [path.join(u, 'registry.generated.js')],
    engine: [path.join(ROOT, 'engine', '40-engine.js')],
    codes: [path.join(ROOT, 'engine', '50-codes.js')]
  };
  const order = ['roster', 'core', 'unit', 'qapi', 'banks', 'content', 'registry', 'engine', 'codes'];
  return order.filter(g => groups.indexOf(g) >= 0).reduce((a, g) => a.concat(G[g]), []);
}
module.exports = function (groups) {
  const ctx = { console: console, Math: Math, JSON: JSON };
  vm.createContext(ctx);
  files(groups).forEach(f => vm.runInContext(fs.readFileSync(f, 'utf8') + '\n;', ctx, { filename: path.relative(ROOT, f) }));
  return ctx;
};
