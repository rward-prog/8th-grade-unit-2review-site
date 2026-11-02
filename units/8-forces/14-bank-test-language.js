'use strict';
/* ===== Questions written in the same language as the unit test (constant, neglecting, simultaneously,
   at its maximum height, "Choices A and B" ...). New IDs only: appended to the registry. ===== */

/* Net force when velocity is zero (the "maximum height" trap) */
T('NET-T4', 'net', 70, 'Net force at the top of a throw', function () {
  for (let tries = 0; tries < 100; tries++) {
    const W = pick([2, 3, 4, 6, 8, 12, 15]) + pick([0, 0.5]);
    if (W === 5 || W === 9.8) continue;
    const o = pick(['rock', 'tennis ball', 'water bottle', 'apple']);
    const when = pick(['at its highest point, where it stops for an instant', 'as it rises toward its highest point', 'just before it lands, as it falls back down']);
    const w = W.toFixed(1);
    return {
      prompt: 'A student tosses a ' + w + '-newton ' + o + ' straight up. Ignoring air resistance, what is the net force on the ' + o + ' ' + when + '?',
      right: w + ' N, down',
      wrongs: [['0.0 N', 'A speed of zero for an instant does not make the net force zero. Gravity still pulls on the ' + o + ', so the net force is its weight.'],
               [w + ' N, up', 'Nothing pushes the ' + o + ' up after it leaves the hand. The only force is gravity, which points down.'],
               ['9.8 N, down', '9.8 m/s\u00b2 is the acceleration due to gravity, not a force. The net force is the ' + o + '\u2019s weight, ' + w + ' N.']],
      explain: 'With air resistance ignored, gravity is the only force acting on the ' + o + ' the whole time, whether it is rising, stopped for an instant, or falling. The net force is its weight, ' + w + ' N, downward.',
      meta: { W: w }
    };
  }
  throw new Error('NET-T4');
});

/* Acceleration constant, speed changing */
T('FFL-T4', 'fall', 60, 'Acceleration and speed during free fall', function () {
  const falling = rand() < 0.5;
  if (falling) {
    const o = pick(['flower pot', 'rock', 'apple', 'water balloon']), from = pick(['a balcony', 'a cliff', 'a tree branch', 'a rooftop']);
    return {
      prompt: 'A ' + o + ' starts from rest and falls freely from ' + from + ' to the ground. As the ' + o + ' falls, its acceleration',
      right: 'is constant and its speed increases',
      wrongs: [['increases and its speed increases', 'In free fall the acceleration stays at g. Only the speed increases.'],
               ['increases and its speed is constant', 'In free fall the speed keeps increasing, and the acceleration stays constant.'],
               ['is constant and its speed is constant', 'The speed increases by about 9.8 m/s every second. The acceleration is the part that stays constant.']],
      explain: 'Gravity is the only force, so the acceleration is constant (g). A constant acceleration means the speed grows by the same amount each second.', meta: { falling: true }
    };
  }
  const o = pick(['baseball', 'rock', 'tennis ball', 'bean bag']);
  return {
    prompt: 'A ' + o + ' is thrown straight up and rises toward its highest point. Neglecting air resistance, as it rises, its acceleration',
    right: 'is constant and its speed decreases',
    wrongs: [['decreases and its speed decreases', 'The acceleration does not shrink. Gravity pulls with the same force the whole way, so the acceleration stays at g.'],
             ['is zero and its speed decreases', 'The acceleration is not zero. Gravity gives it an acceleration of g, downward, even while it slows.'],
             ['is constant and its speed is constant', 'The upward speed decreases because gravity pulls against the motion.']],
    explain: 'Gravity is the only force, so the acceleration is constant (g, downward). It points against the upward motion, so the speed decreases.', meta: { falling: false }
  };
});

/* Mass on a planet whose g is not given */
T('WGT-T5', 'wgt', 65, 'Mass on a planet with no g given', function () {
  for (let tries = 0; tries < 200; tries++) {
    const p1 = pick(['Mars', 'Moon', 'Jupiter']), g1 = PLANETS[p1], p2 = pick(['Saturn', 'Jupiter', 'Moon', 'Mars'].filter(x => x !== p1));
    const m = ri(5, 90) / 10, W = Number((m * g1).toPrecision(3)), o = pick(['pint of ice cream', 'bag of flour', 'science textbook', 'rock sample']);
    const ans = W / g1, vals = [ans, W * g1, W / 9.8];
    const s = vals.map(v => fmt(v, 3));
    if (new Set(s).size < 3) continue;
    if (Math.abs(vals[1] - ans) / ans < 0.06 || Math.abs(vals[2] - ans) / ans < 0.06) continue;
    return {
      prompt: 'A ' + o + ' weighs ' + fmt(W, 3) + ' N on ' + p1 + ' (g = ' + g1 + ' m/s\u00b2). The value of g on ' + p2 + ' is not given. What is the mass of the ' + o + ' on ' + p2 + '?',
      right: s[0] + ' kg',
      wrongs: [['It cannot be found because g for ' + p2 + ' is not given', 'Mass does not depend on location, so you do not need g for ' + p2 + '. Find the mass from the weight and g on ' + p1 + '.'],
               [s[1] + ' kg', 'To find mass from weight, divide: m = W \u00f7 g. Multiplying gives a number that is much too big.'],
               [s[2] + ' kg', 'The weight was measured on ' + p1 + ', so divide by the g for ' + p1 + ', not Earth\u2019s g.']],
      explain: 'Mass is the same everywhere. m = W \u00f7 g = ' + fmt(W, 3) + ' N \u00f7 ' + g1 + ' m/s\u00b2 = ' + s[0] + ' kg on ' + p1 + ', and also on ' + p2 + '.',
      meta: { W: W, g1: g1 }
    };
  }
  throw new Error('WGT-T5');
});

/* Coefficient of kinetic friction from a pull at constant velocity (weight given in newtons) */
T('FRI-T4', 'fric', 60, 'Find the coefficient of kinetic friction', function () {
  for (let tries = 0; tries < 300; tries++) {
    const W = pick([80, 90, 100, 150, 160, 200, 250, 300]), mu = pick([0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6]);
    const F_ = W * mu;
    if (Math.abs(F_ - Math.round(F_)) > 1e-9 || (W === 120 && F_ === 48)) continue;
    const vals = [F_ / W, W / F_, F_ / (W * 9.8), (W - F_) / W];
    const s = [vals[0].toFixed(2), vals[1].toFixed(2), vals[2].toFixed(3), vals[3].toFixed(2)];
    if (new Set(s).size < 4) continue;
    const o = pick(['crate', 'box', 'trunk', 'sled']);
    return {
      prompt: 'A ' + F_ + '-newton horizontal force pulls a ' + W + '-newton ' + o + ' across a level floor at constant velocity. What is the coefficient of kinetic friction between the ' + o + ' and the floor?',
      right: s[0],
      wrongs: [[s[1], 'This flipped the ratio. \u03bc = friction \u00f7 weight, with the weight on the bottom.'],
               [s[2], 'The weight is already in newtons, so there is no need to multiply by g again.'],
               [s[3], 'That subtracts instead of dividing. At constant velocity the friction equals the pull, so \u03bc = ' + F_ + ' \u00f7 ' + W + '.']],
      explain: 'Constant velocity means the net force is zero, so kinetic friction equals the pull: ' + F_ + ' N. Then \u03bc = F\u1d63 \u00f7 W = ' + F_ + ' \u00f7 ' + W + ' = ' + s[0] + '.',
      meta: { W: W, F: F_ }
    };
  }
  throw new Error('FRI-T4');
});

/* Which scenario could this free-body diagram represent? (includes the "Choices A and B" answer) */
const FBD4_K = {
  bal:  () => [_F('Fg', 'down', 2, 'Earth'), _F('FN', 'up', 2), _F('Fapp', 'right', 2), _F('FFr', 'left', 2)],
  acc:  () => [_F('Fg', 'down', 2, 'Earth'), _F('FN', 'up', 2), _F('Fapp', 'right', 4), _F('FFr', 'left', 2)],
  slow: () => [_F('Fg', 'down', 2, 'Earth'), _F('FN', 'up', 2), _F('FFr', 'left', 2)],
  hang: () => [_F('FT', 'up', 2), _F('Fg', 'down', 2, 'Earth')],
  fall: () => [_F('Fg', 'down', 2, 'Earth')]
};
const FBD4_S = [
  { id: 'static', kind: 'bal', t: 'A person pushes a heavy box to the right, but the box does not move.', why: 'the push equals the static friction, so the net force is zero' },
  { id: 'drag', kind: 'bal', t: 'A sled is dragged to the right across snow at a constant velocity.', why: 'the pull equals the friction, so the net force is zero' },
  { id: 'speed', kind: 'acc', t: 'A car speeds up to the right while friction acts against it.', why: 'the applied force is greater than friction, so the net force points right' },
  { id: 'cart', kind: 'acc', t: 'A shopping cart is pushed to the right and speeds up. Friction acts against it.', why: 'the push is greater than friction, so the net force points right' },
  { id: 'coast', kind: 'slow', t: 'A hockey puck slides to the right across a rough floor and slows down. Nobody is touching it.', why: 'only friction acts sideways, so the net force points left' },
  { id: 'roll', kind: 'slow', t: 'A soccer ball rolls to the right across carpet and slows to a stop.', why: 'only friction acts sideways, so the net force points left' },
  { id: 'hang', kind: 'hang', t: 'A lamp hangs at rest from a chain.', why: 'only the chain\u2019s pull and gravity act, and they balance' },
  { id: 'lift', kind: 'hang', t: 'An elevator hangs from its cable and moves upward at a constant speed.', why: 'only the cable\u2019s pull and gravity act, and they balance' },
  { id: 'drop', kind: 'fall', t: 'A coconut falls from a tree. Ignore air resistance.', why: 'only gravity acts, so the net force points down' },
  { id: 'toss', kind: 'fall', t: 'A ball moves upward just after it leaves a thrower\u2019s hand. Ignore air resistance.', why: 'only gravity acts, so the net force points down' }
];
T('FBD-T4', 'fbd', 65, 'Which scenario could this diagram show?', function () {
  const kind = pick(Object.keys(FBD4_K));
  const fit = FBD4_S.filter(s => s.kind === kind), non = FBD4_S.filter(s => s.kind !== kind);
  const compound = rand() < 0.6;
  let s3, correct;
  if (compound) { const f2 = shuffle(fit).slice(0, 2); s3 = [f2[0], f2[1], pick(non)]; correct = 3; }
  else { const f1 = pick(fit), ns = shuffle(non).slice(0, 2), p = ri(0, 2); s3 = []; let ni = 0; for (let i = 0; i < 3; i++) s3.push(i === p ? f1 : ns[ni++]); correct = p; }
  const L = ['A', 'B', 'C'];
  const ordered = s3.map((s, i) => {
    const fits = s.kind === kind;
    let why = '';
    if (i !== correct) why = fits ? 'This scenario does fit the diagram, but so does the other one in Choices A and B. The best answer is "Choices A and B."'
      : 'In this scenario ' + s.why + ', which does not match the arrows in the diagram.';
    return { html: s.t, ok: i === correct, why: why };
  });
  const dOk = correct === 3;
  const dWhy = dOk ? '' : (s3[0].kind !== kind && s3[1].kind !== kind ? 'Neither A nor B matches the diagram.' : 'Only one of A and B matches the diagram, so "Choices A and B" is not right.');
  ordered.push({ html: 'Choices A and B', ok: dOk, why: dWhy });
  const fs = FBD4_K[kind]();
  const rightScenarios = dOk ? 'both ' + L[0] + ' and ' + L[1] : 'only ' + L[correct];
  return {
    prompt: 'Which of these situations could the free-body diagram shown below represent?<div class="figure">' + fbd(fs) + '</div>',
    ordered: ordered,
    explain: 'Read the arrows first. ' + (kind === 'bal' ? 'The arrows are balanced both ways, so the net force is zero.' : kind === 'acc' ? 'The arrow to the right is longer than friction, so the net force points right.' : kind === 'slow' ? 'Only friction acts sideways, so the net force points left, against the motion.' : kind === 'hang' ? 'The up and down arrows balance, so the net force is zero.' : 'Gravity is the only force, so the net force points down.') + ' This diagram fits ' + rightScenarios + '.',
    meta: { kind: kind, texts: s3.map(s => s.t), correct: correct, forces: fs }
  };
});

F('TYP-F09', 'types', 35, 'Dynamics is the part of physics that studies', 'why objects move: the forces that cause changes in motion',
  [['how objects move: describing position, speed, and acceleration without the forces', 'That describes kinematics. Dynamics asks what forces cause the motion to change.'],
   ['where objects are located', 'Location is only part of describing motion. Dynamics is about the forces behind the motion.'],
   ['only the energy stored in moving objects', 'Dynamics is about forces and how they change motion, not only energy.']],
  'Kinematics describes how things move. Dynamics explains why: forces change motion.');
F('FFL-F09', 'fall', 55, 'A bowling ball and a golf ball are released simultaneously from the same height above the ground. Which statement is true if air resistance is neglected?',
  'They both accelerate at the same rate because the ratio of weight to mass is the same for both',
  [['The bowling ball accelerates faster because it has more mass', 'The bowling ball has more weight, but it also has more mass, so the extra weight is used up accelerating the extra mass.'],
   ['The golf ball accelerates faster because it has less mass', 'Less mass does not mean faster acceleration in free fall, because gravity pulls less on a smaller mass.'],
   ['The bowling ball accelerates more slowly because it has more inertia', 'More inertia is balanced by more gravitational force. The two effects cancel.']],
  'a = Fg \u00f7 m = mg \u00f7 m = g. The mass cancels, so every object in free fall has the same acceleration.');
