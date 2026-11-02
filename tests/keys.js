'use strict';
/* prints the unit's question IDs in definition order (used by build.py) */
const load = require('./load.js');
const ctx = load(['roster', 'core', 'unit', 'qapi', 'banks']);
console.log(JSON.stringify(require('vm').runInContext('QDEFS.order', ctx)));
