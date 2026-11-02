'use strict';
/* ===== Topic: Types of forces ===== */
const FORCE_TYPES = {
  'applied force': 'a push or pull by direct contact',
  'tension force': 'the pulling force of a rope, string, or chain',
  'normal force': 'the support force from the surface an object sits on',
  'frictional force': 'a force that opposes the motion of surfaces that touch',
  'spring force': 'the push of a compressed spring or the pull of a stretched one',
  'gravitational force': 'the non-contact pull between objects with mass'
};
T('TYP-T1', 'types', 25, 'Name the force in a situation', function () {
  const n = oneName();
  const sc = pick([
    { q: 'A lamp hangs from the ceiling by a chain. What force does the chain exert on the lamp?', a: 'tension force' },
    { q: 'A backpack rests on a desk. What force does the desk exert upward on the backpack?', a: 'normal force' },
    { q: n + ' pushes a cart across the floor. What force is ' + n + ' applying to the cart?', a: 'applied force' },
    { q: 'A soccer ball rolls across grass and slows down. What force acts against its motion?', a: 'frictional force' },
    { q: 'A mug falls off a shelf. What force pulls it down even though nothing touches it?', a: 'gravitational force' },
    { q: 'A compressed spring in a toy launcher pushes a ball outward. What force is this?', a: 'spring force' }
  ]);
  const others = shuffle(Object.keys(FORCE_TYPES).filter(t => t !== sc.a)).slice(0, 3);
  return {
    prompt: sc.q, right: sc.a.charAt(0).toUpperCase() + sc.a.slice(1),
    wrongs: others.map(t => [t.charAt(0).toUpperCase() + t.slice(1),
      'The ' + t + ' is ' + FORCE_TYPES[t] + '. That is not the force described here.']),
    explain: 'The ' + sc.a + ' is ' + FORCE_TYPES[sc.a] + ', and that matches the situation.',
    meta: { ans: sc.a }
  };
});
F('TYP-F01', 'types', 20, 'Which force can act on an object from a distance, with no contact at all?', 'Gravitational force',
  [['Applied force', 'An applied force is a push or pull by direct contact.'],
   ['Spring force', 'A spring has to touch the object to push or pull on it.'],
   ['Kinetic friction', 'Friction happens only between surfaces that touch.']],
  'Gravity pulls on objects even when nothing touches them, so it is the non-contact force on our list.');
F('TYP-F02', 'types', 10, 'Forces are measured in which unit?', 'Newtons (N)',
  [['Kilograms (kg)', 'Kilograms measure mass, the amount of matter, not force.'],
   ['Meters per second (m/s)', 'That is a unit of speed or velocity.'],
   ['Meters per second squared (m/s\u00b2)', 'That is a unit of acceleration.']],
  'Force is measured in newtons. One newton is the force that gives 1 kg an acceleration of 1 m/s\u00b2.');
F('TYP-F03', 'types', 25, 'Which statement describes the normal force?', 'The support force a surface exerts on an object sitting on it',
  [['The pulling force of a rope or string', 'That describes tension.'],
   ['The force that opposes sliding between two surfaces', 'That describes friction.'],
   ['The attraction between all objects with mass', 'That describes gravity.']],
  'The normal force is the support from the surface an object sits on. It pushes up on a book resting on a table.');
F('TYP-F04', 'types', 25, 'A trampoline-style toy has a spring that is stretched and then pulls a flap back. What kind of force is that?', 'Spring force',
  [['Normal force', 'A normal force is the support from a surface, not a stretched or squeezed spring.'],
   ['Tension force', 'Tension is the pull of a rope, string, or chain. A spring has its own force type.'],
   ['Gravitational force', 'Gravity is a non-contact pull between masses. A spring pulls by touching.']],
  'A compressed or stretched spring pushes or pulls on whatever it touches. That is the spring force.');
F('TYP-F05', 'types', 35, 'Which list contains only contact forces?', 'Applied, tension, normal',
  [['Applied, gravitational, spring', 'Gravitational force is non-contact.'],
   ['Frictional, gravitational, normal', 'Gravitational force is non-contact.'],
   ['Tension, spring, gravitational', 'Gravitational force is non-contact.']],
  'Applied, tension, normal, frictional, and spring forces all need touching. Only gravity acts at a distance.');
F('TYP-F06', 'types', 20, 'A force is best described as', 'a push or a pull on an object',
  [['the speed of an object', 'Speed describes motion. A force can change motion.'],
   ['the amount of matter in an object', 'That is mass.'],
   ['the energy an object has stored', 'Energy is a different quantity. A force is a push or a pull.']],
  'A force is a push or a pull on an object that comes from its interaction with another object.');
F('TYP-F07', 'types', 30, 'Brake pads squeeze a spinning bike wheel and slow it down. Which force do the pads exert on the wheel?', 'Frictional force',
  [['Applied force', 'The pads do touch the wheel, but the force that slows it is friction opposing the motion.'],
   ['Normal force', 'A normal force supports an object from below. It does not slow the wheel.'],
   ['Gravitational force', 'Gravity does not depend on the pads touching the wheel.']],
  'Surfaces rubbing against each other produce friction, which opposes motion.');
F('TYP-F08', 'types', 30, 'Which statement about gravity is true?', 'It acts on objects even when nothing is touching them',
  [['It only works when two objects touch', 'Gravity is a non-contact force.'],
   ['It only pulls on objects that are moving', 'Gravity pulls on objects at rest too.'],
   ['It is measured in kilograms', 'Force is measured in newtons. Kilograms measure mass.']],
  'Gravity is an attractive force between all objects with mass, and no touching is needed.');

/* ===== Topic: Free-body diagrams ===== */
function _F(t, dir, len, src) { return { t: t, dir: dir, len: len, src: src || '' }; }
function _sig(fs) { return fs.map(f => f.t + f.dir + f.len).sort().join('|'); }
function _clone(fs) { return fs.map(f => Object.assign({}, f)); }
const FBD_MUT = {
  motionArrow: [fs => fs.concat([{ t: 'force of motion', dir: 'right', len: 2, src: '' }]),
    'Motion is not a force. Nothing exerts a "force of motion," so it does not get an arrow.'],
  noNormal: [fs => fs.filter(f => f.t !== 'FN'),
    'The surface touches the object and pushes up on it. The normal force is missing.'],
  noGravity: [fs => fs.filter(f => f.t !== 'Fg'),
    'Earth always pulls on the object. Gravity (Fg) is missing.'],
  bigGravity: [fs => { const c = _clone(fs); c.forEach(f => { if (f.t === 'Fg') f.len = 3; }); return c; },
    'The up and down arrows must be the same length when the object is not accelerating up or down.'],
  bigNormal: [fs => { const c = _clone(fs); c.forEach(f => { if (f.t === 'FN') f.len = 3; }); return c; },
    'The up and down arrows must be the same length when the object is not accelerating up or down.'],
  bigSupport: [fs => { const c = _clone(fs); c.forEach(f => { if (f.t === 'FT') f.len = 3; }); return c; },
    'The chain\u2019s pull and gravity must be the same length, because the object is not moving up or down.'],
  noTension: [fs => fs.filter(f => f.t !== 'FT'),
    'The chain pulls up on the object. The tension force is missing.'],
  extraNormal: [fs => fs.concat([_F('FN', 'up', 2, 'floor')]),
    'Nothing is underneath the object. The chain\u2019s upward pull is tension, not a normal force.'],
  extraApplied: [fs => fs.concat([_F('Fapp', 'right', 2, 'hand')]),
    'Nothing is pushing or pulling the object right now, so there is no applied force.'],
  addFriction: [fs => fs.concat([_F('FFr', 'left', 1, 'surface')]),
    'The problem says to ignore friction, so there is no friction arrow.'],
  flipFriction: [fs => { const c = _clone(fs); c.forEach(f => { if (f.t === 'FFr') f.dir = 'right'; }); return c; },
    'Friction opposes the motion, so it points the opposite way from the motion.'],
  noFriction: [fs => fs.filter(f => f.t !== 'FFr'),
    'The surface is rough, so friction acts against the motion. The friction arrow is missing.'],
  equalHorizontal: [fs => { const c = _clone(fs); const a = c.find(f => f.t === 'Fapp'); const r = c.find(f => f.t === 'FFr'); a.len = r.len; return c; },
    'Equal horizontal arrows mean balanced forces, so the speed would stay constant, not increase.'],
  weakApplied: [fs => { const c = _clone(fs); const a = c.find(f => f.t === 'Fapp' || f.t === 'FT'); const r = c.find(f => f.t === 'FFr'); a.len = Math.max(1, r.len - 1); return c; },
    'The friction arrow is longer than the pushing or pulling arrow, so the object would slow down.'],
  speedUp: [fs => { const c = _clone(fs); const a = c.find(f => f.t === 'FT'); a.len = 3; return c; },
    'The rope arrow is longer than friction, so the object would speed up. The problem says constant speed.'],
  slowDown: [fs => { const c = _clone(fs); const a = c.find(f => f.t === 'FT'); a.len = 1; return c; },
    'Friction is longer than the rope arrow, so the object would slow down. The problem says constant speed.']
};
const FBD_SC = [
  { s: o => 'A ' + o + ' rests on a table.', f: () => [_F('Fg', 'down', 2, 'Earth'), _F('FN', 'up', 2, 'table')],
    m: ['noNormal', 'bigGravity', 'bigNormal', 'extraApplied'] },
  { s: o => 'A ' + o + ' hangs at rest from the ceiling on a chain.', f: () => [_F('FT', 'up', 2, 'chain'), _F('Fg', 'down', 2, 'Earth')],
    m: ['noTension', 'bigSupport', 'extraApplied', 'noGravity'] },
  { s: o => 'A ' + o + ' glides to the right at a steady speed across smooth ice. Ignore friction and air resistance.',
    f: () => [_F('Fg', 'down', 2, 'Earth'), _F('FN', 'up', 2, 'ice')], m: ['motionArrow', 'noNormal', 'bigGravity', 'addFriction'] },
  { s: o => 'A student pushes a ' + o + ' to the right across the floor and it speeds up.',
    f: () => [_F('Fapp', 'right', 3, 'student'), _F('FFr', 'left', 2, 'floor'), _F('FN', 'up', 2, 'floor'), _F('Fg', 'down', 2, 'Earth')],
    m: ['flipFriction', 'equalHorizontal', 'weakApplied', 'noNormal', 'noFriction', 'motionArrow'] },
  { s: o => 'A rope pulls a ' + o + ' to the right across the floor at a steady speed.',
    f: () => [_F('FT', 'right', 2, 'rope'), _F('FFr', 'left', 2, 'floor'), _F('FN', 'up', 2, 'floor'), _F('Fg', 'down', 2, 'Earth')],
    m: ['speedUp', 'slowDown', 'flipFriction', 'noFriction', 'bigGravity'] },
  { s: o => 'A ' + o + ' rolls to the right across a carpet and slows down. Nobody is touching it.',
    f: () => [_F('FFr', 'left', 2, 'carpet'), _F('FN', 'up', 2, 'carpet'), _F('Fg', 'down', 2, 'Earth')],
    m: ['extraApplied', 'motionArrow', 'flipFriction', 'noFriction', 'noNormal'] }
];
T('FBD-T1', 'fbd', 50, 'Pick the correct free-body diagram', function () {
  const o = pick(['crate', 'ball', 'toy truck', 'box', 'cart', 'puck']);
  const sc = pick(FBD_SC);
  const good = sc.f();
  const muts = shuffle(sc.m).slice(0, 3);
  const wrongs = muts.map(mk => [fbd(FBD_MUT[mk][0](_clone(good))), FBD_MUT[mk][1]]);
  return {
    prompt: sc.s(o) + ' Which free-body diagram shows the forces on the ' + o + '?',
    right: fbd(good), wrongs: wrongs,
    explain: 'Draw one arrow for every force touching or pulling on the ' + o + ', label type and source, and make arrow lengths match the motion: equal lengths when the forces balance, a longer arrow in the direction of a speed-up.',
    meta: { good: good, wrongSigs: wrongs.map(w => w[0]) }
  };
});
T('FBD-T2', 'fbd', 45, 'Read speed from a free-body diagram', function () {
  const a = ri(1, 4), b = ri(1, 4);
  const obj = pick(['crate', 'sled', 'cart', 'box']);
  const fs = [_F('Fapp', 'right', a, 'student'), _F('FFr', 'left', b, 'floor'), _F('FN', 'up', 2, 'floor'), _F('Fg', 'down', 2, 'Earth')];
  const state = a > b ? 'up' : a < b ? 'down' : 'same';
  const T3 = { up: 'Its speed is increasing', down: 'Its speed is decreasing', same: 'Its speed is staying the same' };
  const whys = {
    up: 'The arrow pointing right (applied) is longer than the arrow pointing left (friction), so the net force is in the direction of motion and the speed increases.',
    down: 'The arrow pointing left (friction) is longer than the arrow pointing right (applied), so the net force is against the motion and the speed decreases.',
    same: 'The right and left arrows are the same length, so the forces are balanced and the speed stays the same.'
  };
  const wrongs = ['up', 'down', 'same'].filter(k => k !== state).map(k => [T3[k], 'Compare the right arrow and the left arrow. ' + whys[state]]);
  wrongs.push(['You cannot tell without knowing the mass of the ' + obj, 'The arrow lengths already show which forces are bigger, so you can tell. ' + whys[state]]);
  return {
    prompt: 'A ' + obj + ' is sliding to the right. Here is its free-body diagram.<div class="figure">' + fbd(fs) + '</div>What is happening to the speed of the ' + obj + '?',
    right: T3[state], wrongs: wrongs, explain: whys[state], meta: { a: a, b: b, state: state }
  };
});
T('FBD-T3', 'fbd', 55, 'Find the arrow that does not belong', function () {
  const sc = pick([
    { s: 'a football rising through the air after a quarterback released it (ignore air resistance)', obj: 'football',
      good: [_F('Fg', 'down', 2, 'Earth')], bad: { t: 'force of the release', dir: 'up', len: 2, src: '' },
      goodNames: ['gravity (Fg)'], badName: 'the force of the release',
      why: 'The quarterback is no longer touching the football, so nothing is pushing it upward. It keeps rising because of its velocity, not because of a force.' },
    { s: 'a puck gliding at a steady speed across ice (ignore friction)', obj: 'puck',
      good: [_F('Fg', 'down', 2, 'Earth'), _F('FN', 'up', 2, 'ice')], bad: { t: 'force of motion', dir: 'right', len: 2, src: '' },
      goodNames: ['gravity (Fg)', 'the normal force (FN)'], badName: 'the force of motion',
      why: 'Motion is not a force. Nothing exerts a force of motion, so only gravity and the normal force act on the puck.' },
    { s: 'a cart rolling to the right after a push has ended (ignore friction)', obj: 'cart',
      good: [_F('Fg', 'down', 2, 'Earth'), _F('FN', 'up', 2, 'floor')], bad: { t: 'Fapp', dir: 'right', len: 2, src: 'hand' },
      goodNames: ['gravity (Fg)', 'the normal force (FN)'], badName: 'the applied force (Fapp)',
      why: 'The hand stopped pushing, so there is no applied force anymore. Forces only act while something is touching or pulling.' },
    { s: 'a skater coasting at a steady speed (ignore friction)', obj: 'skater',
      good: [_F('Fg', 'down', 2, 'Earth'), _F('FN', 'up', 2, 'ice')], bad: { t: 'force of motion', dir: 'right', len: 2, src: '' },
      goodNames: ['gravity (Fg)', 'the normal force (FN)'], badName: 'the force of motion',
      why: 'A moving skater does not need a force to keep going. Motion is not a force, so the "force of motion" arrow does not belong.' }
  ]);
  const fs = sc.good.concat([sc.bad]);
  const wrongs = sc.goodNames.map(n => [n.charAt(0).toUpperCase() + n.slice(1), 'That force is real. ' + n.charAt(0).toUpperCase() + n.slice(1) + ' does act on the ' + sc.obj + '.']);
  if (sc.good.length === 1) { wrongs.push(['None of them. Both arrows belong', 'One arrow is a made-up force.']); wrongs.push(['Both of them', 'Gravity always pulls down on the ' + sc.obj + '.']); }
  else wrongs.push(['None of them. All the arrows belong', 'One arrow is not a real force. Check each arrow: is something touching or pulling the ' + sc.obj + ' that way?']);
  return {
    prompt: 'Murphy drew a free-body diagram for ' + sc.s + '. Only real forces should be shown.<div class="figure">' + fbd(fs) + '</div>Which arrow should be erased?',
    right: sc.badName.charAt(0).toUpperCase() + sc.badName.slice(1), wrongs: wrongs, explain: sc.why, meta: {}
  };
});
F('FBD-F01', 'fbd', 15, 'In a free-body diagram, what does a longer arrow mean?', 'A stronger force',
  [['A faster object', 'Arrow length shows force strength, not speed.'],
   ['A heavier object', 'The object is just a dot. The arrow length shows how strong the force is.'],
   ['A force that acts for a longer time', 'Arrow length shows strength, not time.']],
  'Longer arrow = stronger force.');
F('FBD-F02', 'fbd', 30, 'Which way should a force arrow point in a free-body diagram?', 'The direction the force acts ON the object',
  [['The direction the object is moving', 'The object might move one way while forces act in other directions.'],
   ['The direction the force came from', 'The arrow points the way the object is pushed or pulled, not back toward the source.'],
   ['Always upward', 'Arrows point the way each force acts, which can be any direction.']],
  'The arrow shows the direction the force acts on the object.');
F('FBD-F03', 'fbd', 30, 'What should each arrow in a free-body diagram be labeled with?', 'The type of force and what exerts it',
  [['Only the type of force', 'The source (what exerts the force) is part of a complete label.'],
   ['Only the number of newtons', 'The label names the type and the source.'],
   ['The object\u2019s speed', 'Speed is not a force, so it is not part of the label.']],
  'A good label gives both the type and the source, such as FN, normal, table.');
F('FBD-F04', 'fbd', 15, 'In a free-body diagram, how is the object usually drawn?', 'As a dot or a box',
  [['As a detailed picture', 'Free-body diagrams use a simple dot or box so the arrows are easy to see.'],
   ['As a long arrow', 'Arrows are used for forces. The object is a dot or box.'],
   ['It is not drawn at all', 'The arrows all act on the object, so a dot or box shows where they act.']],
  'A dot or a box stands for the object of interest.');
F('FBD-F05', 'fbd', 40, 'A book sits at rest on a table. Why are the gravity arrow and the normal force arrow the same length?', 'The forces are balanced, so the book\u2019s motion does not change',
  [['Gravity and the normal force are the same kind of force', 'They are different forces from different sources. Their arrows match because they balance.'],
   ['The table is stronger than the book', 'If the table\u2019s force were bigger, the book would accelerate upward.'],
   ['The book has no weight when it is resting', 'The book always has weight. The table\u2019s normal force matches it.']],
  'The net force is zero. The up arrow and the down arrow are equal so the book stays at rest.');
F('FBD-F06', 'fbd', 30, 'Two boxes are stacked and pushed together. How many free-body diagrams should you draw?', 'One for each object',
  [['Just one for the whole stack', 'If there are several objects, each gets its own diagram.'],
   ['One for the floor', 'The diagrams are for the objects of interest, not the floor.'],
   ['None, because the forces cancel', 'Even balanced forces are drawn in a diagram.']],
  'Identify each object of interest. If there are multiple objects, draw one free-body diagram for each.');

/* ===== Topic: Net force and balanced forces ===== */
T('NET-T1', 'net', 40, 'Net force: opposite directions', function () {
  const [n1, n2] = twoNames();
  let A, B;
  do { A = ri(2, 20) * 10; B = ri(2, 20) * 10; } while (A === B);
  const big = A > B ? 'right' : 'left', small = big === 'right' ? 'left' : 'right';
  const net = Math.abs(A - B);
  const txt = (d) => d === 'right' ? 'to the right' : 'to the left';
  return {
    prompt: n1 + ' pushes a crate to the right with ' + A + ' N. ' + n2 + ' pushes the same crate to the left with ' + B + ' N. What is the net force on the crate?',
    right: net + ' N ' + txt(big),
    wrongs: [[(A + B) + ' N ' + txt(big), 'Forces in opposite directions subtract. Only forces in the same direction add.'],
             [net + ' N ' + txt(small), 'The net force points the same way as the larger force.'],
             ['0 N, because the forces are balanced', 'Balanced forces must be equal. These two forces are different sizes, so the net force is not zero.']],
    explain: 'Call right positive. The net force is ' + A + ' + (\u2212' + B + ') = ' + (A - B < 0 ? '\u2212' : '') + net + ' N, which means ' + net + ' N ' + txt(big) + '.',
    meta: { A: A, B: B, net: net, big: big }
  };
});
T('NET-T2', 'net', 20, 'Net force: same direction', function () {
  const [n1, n2] = twoNames();
  const A = ri(2, 20) * 10, B = ri(2, 20) * 10;
  const dir = pick(['right', 'left']);
  const txt = d => d === 'right' ? 'to the right' : 'to the left';
  const opp = dir === 'right' ? 'left' : 'right';
  const diff = Math.abs(A - B);
  const wrongs = [[(A + B) + ' N ' + txt(opp), 'The size is right, but the net force points the same direction as the pushes.'],
                  ['0 N, because the forces are balanced', 'Forces in the same direction do not cancel. They add.'],
                  [(diff === 0 ? (A + B + 10) : diff) + ' N ' + txt(dir), 'When forces point the same way, you add them, you do not subtract them.']];
  return {
    prompt: n1 + ' and ' + n2 + ' both push a dresser ' + txt(dir).replace('to the ', '') + '. ' + n1 + ' pushes with ' + A + ' N and ' + n2 + ' pushes with ' + B + ' N. What is the net force on the dresser?',
    right: (A + B) + ' N ' + txt(dir), wrongs: wrongs,
    explain: 'Forces in the same direction add: ' + A + ' N + ' + B + ' N = ' + (A + B) + ' N ' + txt(dir) + '.', meta: { A: A, B: B }
  };
});
T('NET-T3', 'net', 40, 'What balanced forces do', function () {
  const rest = rand() < 0.5;
  const v = ri(2, 9);
  const obj = pick(['hockey puck', 'cart', 'box', 'toy car']);
  if (rest) return {
    prompt: 'A ' + obj + ' is at rest. The forces acting on it are balanced. What will happen to the ' + obj + '?',
    right: 'It stays at rest',
    wrongs: [['It starts moving in the direction of the strongest force', 'Balanced forces have no strongest force. They add up to a net force of zero.'],
             ['It slowly speeds up', 'A net force of zero cannot change the motion.'],
             ['It moves back and forth', 'Nothing is pushing it in a way that would make it move.']],
    explain: 'Net force zero means no change in motion. An object at rest stays at rest.', meta: { rest: true }
  };
  return {
    prompt: 'A ' + obj + ' is moving to the right at ' + v + ' m/s. The net force on it is 0 N. What will the ' + obj + ' do?',
    right: 'Keep moving to the right at ' + v + ' m/s',
    wrongs: [['Slow down and stop', 'An object only slows down when there is a net force against its motion.'],
             ['Speed up', 'It would speed up only if there were a net force in the direction of motion.'],
             ['Stop right away', 'Balanced forces do not stop an object. They leave its motion unchanged.']],
    explain: 'Newton\u2019s first law: if the net force is zero, the motion does not change. Same speed, same direction.', meta: { rest: false, v: v }
  };
});
F('NET-F01', 'net', 15, 'The net force on an object is', 'the combination of all the forces acting on it',
  [['the strongest single force acting on it', 'The net force counts every force, with direction.'],
   ['the force of gravity on it', 'Gravity is only one of the forces that might act.'],
   ['the force it exerts on other objects', 'The net force is about the forces acting on the object.']],
  'Add up all the forces on an object, taking direction into account, to get the net force.');
F('NET-F02', 'net', 25, 'Balanced forces', 'combine to make a net force of zero',
  [['always make an object stop moving', 'An object with balanced forces can be moving at a steady speed.'],
   ['are always equal to the weight of the object', 'Balanced forces just add to zero. They do not need to equal the weight.'],
   ['can only act on objects at rest', 'Moving objects can have balanced forces too.']],
  'Balanced forces add to a net force of zero, so the motion does not change.');
F('NET-F03', 'net', 25, 'What happens to an object when unbalanced forces act on it?', 'Its velocity changes',
  [['Nothing, the motion stays the same', 'That is what balanced forces do.'],
   ['It must start moving upward', 'The object accelerates in the direction of the net force, which can be any direction.'],
   ['Its mass changes', 'Forces change motion, not mass.']],
  'Unbalanced forces make a net force that is not zero. That changes the velocity: speed, direction, or both.');
F('NET-F04', 'net', 40, 'In a net-force equation, what does a negative force mean?', 'The force points opposite the reference direction',
  [['The force is weaker than zero', 'Force strength is not negative. The sign tells direction.'],
   ['The force is not acting', 'A force of 0 N means no force. A negative sign means opposite direction.'],
   ['The force is gravity', 'Any force can be negative if it points opposite the reference direction.']],
  'You choose a reference direction. Forces that point that way are positive, and forces that point the opposite way are negative.');
F('NET-F05', 'net', 35, 'An object is at rest and an unbalanced force acts on it. What does it do?', 'It starts moving in the direction of the net force',
  [['It stays at rest', 'It stays at rest only if the forces are balanced.'],
   ['It starts moving opposite the net force', 'Objects accelerate in the direction of the net force.'],
   ['It spins in place', 'A net force changes velocity in the direction of the net force.']],
  'An unbalanced force on an object at rest makes it start moving in the direction of the net force.');
F('NET-F06', 'net', 50, 'A crate has a 150 N push to the right and a 150 N push to the left. Which statement is true?', 'The net force is 0 N, so the crate\u2019s motion does not change',
  [['The net force is 300 N', 'The pushes point opposite ways, so you subtract, not add.'],
   ['The net force is 150 N to the right', 'Equal opposite forces cancel. The net force is 0 N.'],
   ['The crate must be moving to the right', 'With a net force of zero the crate keeps its motion, which could be rest.']],
  'Equal forces in opposite directions are balanced, so the net force is zero.');
