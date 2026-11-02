'use strict';
FTXT[0.666667] = 'two-thirds as large'; FTXT[1.5] = 'one and a half times as large'; FTXT[6] = 'six times as large';

/* ===== Topic: Friction (weights use g = 9.8; magnitudes shown to 2 sig figs so 9.81 gives the same display) ===== */
function _fricParams() {
  for (let tries = 0; tries < 400; tries++) {
    const m = pick([10, 15, 20, 25, 30, 40, 50]);
    const mus = pick([0.3, 0.4, 0.5, 0.6]);
    const muk = pick([0.2, 0.25, 0.3, 0.35, 0.4].filter(x => x < mus));
    if (!muk) continue;
    const W = gg => m * gg;
    const okDisp = sameBoth(gg => mus * W(gg), 2) && sameBoth(gg => muk * W(gg), 2) && sameBoth(gg => W(gg), 2);
    if (okDisp) return { m: m, mus: mus, muk: muk, W: m * G_EARTH, maxS: mus * m * G_EARTH, kin: muk * m * G_EARTH };
  }
  throw new Error('friction params');
}
T('FRI-T1', 'fric', 70, 'Static or sliding friction, and how big', function () {
  for (let tries = 0; tries < 400; tries++) {
    const p = _fricParams(), n = oneName();
    const slide = rand() < 0.5;
    let F = slide ? Math.round(p.maxS * 1.35 / 5) * 5 : Math.round(p.maxS * 0.6 / 5) * 5;
    if (F <= 0) continue;
    // classification must be the same for g = 9.8 and 9.81, with a clear margin
    const maxS81 = p.mus * p.m * G_EARTH_ALT;
    if (slide && (F < p.maxS * 1.08 || F < maxS81 * 1.08)) continue;
    if (!slide && (F > p.maxS * 0.92 || F > maxS81 * 0.92)) continue;
    const f2 = x => fmt(x, 2);
    const A = f2(F), S = f2(p.maxS), K = f2(p.kin);
    if (new Set([A, S, K]).size < 3) continue;
    const mk = (type, mag) => type + ' friction, ' + mag + ' N';
    let right, wrongs, explain;
    if (!slide) {
      right = mk('Static', A);
      wrongs = [[mk('Static', S), 'The maximum static friction is ' + S + ' N, but static friction only matches the push (' + A + ' N) until the push exceeds that limit.'],
                [mk('Kinetic', K), 'The push is smaller than the maximum static friction, so the crate does not move. Kinetic friction acts only on a sliding object.'],
                [mk('Kinetic', A), 'The crate is not sliding, so the friction is static, not kinetic.']];
      explain = 'Maximum static friction = \u03bcs \u00d7 W = ' + p.mus + ' \u00d7 ' + f2(p.W) + ' N = ' + S + ' N. The ' + A + ' N push is less than that, so the crate stays at rest and static friction matches the push: ' + A + ' N.';
    } else {
      right = mk('Kinetic', K);
      wrongs = [[mk('Static', S), 'The ' + A + ' N push is more than the maximum static friction (' + S + ' N), so the crate slides. Once sliding, the friction is kinetic.'],
                [mk('Kinetic', A), 'Kinetic friction does not match the push. It is \u03bck \u00d7 W = ' + K + ' N no matter how hard you push.'],
                [mk('Static', A), 'The crate is moving now, so the friction is kinetic, not static.']];
      explain = 'Maximum static friction = \u03bcs \u00d7 W = ' + p.mus + ' \u00d7 ' + f2(p.W) + ' N = ' + S + ' N. The ' + A + ' N push is more than that, so the crate slides, and kinetic friction = \u03bck \u00d7 W = ' + p.muk + ' \u00d7 ' + f2(p.W) + ' N = ' + K + ' N.';
    }
    return {
      prompt: 'A ' + p.m + ' kg crate sits on a floor. The coefficient of static friction is ' + p.mus + ' and the coefficient of kinetic friction is ' + p.muk + '. ' + n + ' pushes the crate horizontally with ' + F + ' N. What kind of friction acts on the crate, and how big is it? (Use g = 9.8 m/s\u00b2.)',
      right: right, wrongs: wrongs, explain: explain, meta: { p: p, F: F, slide: slide }
    };
  }
  throw new Error('FRI-T1 could not generate');
});
T('FRI-T2', 'fric', 55, 'Force needed to start something moving', function () {
  for (let tries = 0; tries < 400; tries++) {
    const p = _fricParams(), o = pick(['crate', 'box', 'trunk', 'cabinet']);
    const vals = [p.maxS, p.kin, p.W, p.mus * p.m];
    const strs = vals.map(v => fmt(v, 2));
    if (new Set(strs).size < 4) continue;
    if ([1, 2, 3].some(i => Math.abs(vals[i] - vals[0]) / vals[0] < 0.06)) continue;
    return {
      prompt: 'A ' + p.m + ' kg ' + o + ' rests on the floor. \u03bcs = ' + p.mus + ' and \u03bck = ' + p.muk + '. About how much horizontal force must be applied to just get the ' + o + ' moving? (Use g = 9.8 m/s\u00b2.)',
      right: strs[0] + ' N',
      wrongs: [[strs[1] + ' N', 'That is the kinetic friction once it is already sliding. To start the motion you need to beat the static friction.'],
               [strs[2] + ' N', 'That is the weight. The force needed depends on \u03bcs \u00d7 weight, not on the weight alone.'],
               [strs[3] + ' N', 'This used the mass instead of the weight. First find the weight, W = mg, then multiply by \u03bcs.']],
      explain: 'The push must exceed the maximum static friction: \u03bcs \u00d7 W = ' + p.mus + ' \u00d7 (' + p.m + ' \u00d7 9.8) = ' + strs[0] + ' N.',
      meta: { p: p }
    };
  }
  throw new Error('FRI-T2 could not generate');
});
T('FRI-T3', 'fric', 50, 'Sliding friction once it is moving', function () {
  for (let tries = 0; tries < 400; tries++) {
    const p = _fricParams(), o = pick(['crate', 'box', 'trunk', 'cabinet']);
    const vals = [p.kin, p.maxS, p.W, p.muk * p.m];
    const strs = vals.map(v => fmt(v, 2));
    if (new Set(strs).size < 4) continue;
    if ([1, 2, 3].some(i => Math.abs(vals[i] - vals[0]) / vals[0] < 0.06)) continue;
    return {
      prompt: 'A ' + p.m + ' kg ' + o + ' is sliding across the floor. \u03bcs = ' + p.mus + ' and \u03bck = ' + p.muk + '. What is the force of kinetic (sliding) friction on it? (Use g = 9.8 m/s\u00b2.)',
      right: strs[0] + ' N',
      wrongs: [[strs[1] + ' N', 'That used the static coefficient. Once the ' + o + ' is sliding, use \u03bck.'],
               [strs[2] + ' N', 'That is the weight. Friction is \u03bc \u00d7 weight.'],
               [strs[3] + ' N', 'This used the mass instead of the weight. Find W = mg first, then multiply by \u03bck.']],
      explain: 'Kinetic friction = \u03bck \u00d7 W = ' + p.muk + ' \u00d7 (' + p.m + ' \u00d7 9.8) = ' + strs[0] + ' N.',
      meta: { p: p }
    };
  }
  throw new Error('FRI-T3 could not generate');
});
F('FRI-F01', 'fric', 15, 'Friction is a force that', 'resists the motion of two surfaces that are touching',
  [['pulls objects toward the center of Earth', 'That is gravity.'],
   ['holds a rope tight', 'That is tension.'],
   ['pushes an object away from a spring', 'That is a spring force.']],
  'Friction resists the motion of two surfaces that touch each other.');
F('FRI-F02', 'fric', 25, 'Static friction is the friction that', 'keeps an object from starting to slide',
  [['acts only on objects that are already sliding', 'That is kinetic (sliding) friction.'],
   ['pulls an object toward the ground', 'That is gravity.'],
   ['speeds an object up', 'Friction opposes motion. It does not speed objects up.']],
  'Static friction prevents surfaces from sliding past each other. The applied force has to be greater than it before the object moves.');
F('FRI-F03', 'fric', 45, 'A box sits still while you push on it harder and harder. As you increase your push, but before the box moves, the static friction', 'increases to match your push',
  [['stays the same', 'Static friction changes to match the applied force, up to its limit.'],
   ['decreases', 'It does not shrink as you push harder. It grows to match you.'],
   ['becomes zero', 'The box stays still because static friction balances your push.']],
  'Up to its limit, the strength of static friction changes to match the applied force, so the box does not move.');
F('FRI-F04', 'fric', 45, 'Once a box is sliding, the sliding friction on it', 'stays about the same, even if the box speeds up',
  [['increases as the box speeds up', 'Sliding friction does not depend on speed. It stays the same.'],
   ['decreases to zero', 'Friction does not vanish while an object slides.'],
   ['becomes static friction', 'A sliding object has kinetic (sliding) friction.']],
  'Sliding friction does not change in value once the object is moving.');
F('FRI-F05', 'fric', 40, 'Which are two causes of friction between surfaces?', 'Microscopic bumps catching on each other and attraction between the particles of the surfaces',
  [['Gravity and magnetism', 'Those are different forces. Friction comes from surface roughness and particle attraction.'],
   ['The color and temperature of the surfaces', 'Those do not cause friction.'],
   ['Air pressure and light', 'Those do not cause friction between surfaces.']],
  'Microscopic dips and bumps catch on each other, and the surfaces\u2019 particles attract each other. Both slow sliding.');
F('FRI-F06', 'fric', 20, 'Which of these would reduce friction between two surfaces?', 'Adding a lubricant such as oil',
  [['Pressing the surfaces together harder', 'More contact means more friction.'],
   ['Roughening the surfaces', 'Rougher surfaces catch on each other more.'],
   ['Adding sand between them', 'Sand makes the surfaces rougher, so friction increases.']],
  'A lubricant such as oil or soap separates the surfaces and lowers friction.');
F('FRI-F07', 'fric', 30, 'Friction on a sliding object acts', 'in the direction opposite the object\u2019s motion',
  [['in the same direction as the motion', 'Friction slows objects down, so it opposes the motion.'],
   ['straight up', 'Straight up is the normal force. Friction runs along the surface.'],
   ['straight down', 'Straight down is gravity. Friction runs along the surface.']],
  'Friction opposes motion. It acts parallel to the surface, perpendicular to the normal force.');
F('FRI-F08', 'fric', 50, 'A crumpled sheet of paper falls faster than a flat sheet. Why?', 'The crumpled paper has less surface area facing the air, so it has less air resistance',
  [['The crumpled paper has more mass', 'Crumpling does not change the mass.'],
   ['Gravity pulls harder on crumpled paper', 'Gravity pulls with the same force. Air resistance is what differs.'],
   ['The flat paper has no air resistance', 'The flat paper has more air resistance because more surface faces the air.']],
  'Fluid friction (air resistance) is greater when more surface area faces the oncoming air.');
F('FRI-F09', 'fric', 45, 'In Ffr = \u03bcW, what does a larger coefficient of friction (\u03bc) tell you about two surfaces?', 'There is more friction between them',
  [['There is less friction between them', 'A bigger \u03bc multiplies the weight to make a bigger friction force.'],
   ['The object must be heavier', '\u03bc describes the surfaces, not the object\u2019s weight.'],
   ['The object must be moving', '\u03bc exists whether or not the object is moving.']],
  'The coefficient of friction measures how much friction the two surfaces produce. A larger \u03bc means a larger friction force.');
F('FRI-F10', 'fric', 55, 'A student slides a heavy filing cabinet across the floor. A bigger push is needed to get it moving than to keep it moving. Which comparison explains this?', 'The maximum static friction is greater than the kinetic friction',
  [['The maximum static friction is less than the kinetic friction', 'If that were true, keeping it moving would take the bigger push.'],
   ['The maximum static friction equals the kinetic friction', 'If they were equal, starting and keeping it moving would need the same push.'],
   ['There is no static friction on a heavy object', 'Static friction acts on every object at rest, and it is what the first push must beat.']],
  'The maximum static friction (\u03bcs W) is greater than sliding friction (\u03bck W), so starting needs more force than keeping it going.');
F('FRI-F11', 'fric', 25, 'Fluid friction is friction between', 'a surface and a fluid such as air or water',
  [['two solid surfaces', 'That is static or sliding friction.'],
   ['two magnets', 'Magnets exert a non-contact force.'],
   ['an object and Earth\u2019s core', 'Fluid friction involves air or water moving past a surface.']],
  'Air resistance is an example of fluid friction.');
F('FRI-F12', 'fric', 35, 'A swimmer wants to reduce fluid friction. Which change would help?', 'Making the body smaller and more streamlined against the water',
  [['Spreading the arms and legs wide', 'That increases the surface area facing the water.'],
   ['Wearing loose, baggy clothes', 'Baggy clothes catch water and add fluid friction.'],
   ['Swimming in thicker liquid', 'A thicker fluid increases fluid friction.']],
  'Reducing the surface area that faces the oncoming fluid reduces fluid friction.');

/* ===== Topic: Newton's 1st law and inertia ===== */
F('N1-F01', 'n1', 20, 'Newton\u2019s first law of motion says that', 'if the net force on an object is zero, its motion does not change',
  [['a force is needed to keep any object moving', 'A moving object keeps moving with no net force.'],
   ['the acceleration of an object equals force divided by mass', 'That is the second law.'],
   ['every force has an equal and opposite reaction force', 'That is the third law.']],
  'Zero net force means no change in motion: a resting object stays at rest and a moving object keeps its velocity.');
F('N1-F02', 'n1', 15, 'Inertia is', 'the tendency of an object to resist a change in its motion',
  [['a force that keeps objects moving', 'Inertia is a property of matter, not a force.'],
   ['the force of gravity on an object', 'That is weight.'],
   ['the speed an object has when it falls', 'That is velocity.']],
  'Inertia is the tendency of an object to resist a change in its motion.');
F('N1-F03', 'n1', 40, 'A backpack on the back seat slides forward when the driver brakes hard. Why?', 'The backpack keeps moving forward at its old speed because of inertia while the car slows',
  [['A force of motion pushes it forward', 'There is no force of motion. Inertia keeps its velocity the same until a force changes it.'],
   ['Gravity pulls it forward', 'Gravity pulls downward, not forward.'],
   ['The brakes pull it forward', 'The brakes act on the car, not on the backpack.']],
  'No unbalanced force acts on the backpack, so its velocity does not change. The car slows, so the backpack seems to slide forward.');
F('N1-F04', 'n1', 35, 'A ball rolling across the floor eventually stops. Which statement explains why?', 'Friction (an unbalanced force) acts against the motion',
  [['Objects naturally stop moving when no one pushes them', 'Objects stop only because a force acts on them, such as friction.'],
   ['The ball runs out of inertia', 'Inertia does not get used up.'],
   ['Gravity slows it down horizontally', 'Gravity pulls down, not backward along the floor.']],
  'Without friction, the ball would keep rolling at the same speed. Objects stop because friction or another force acts on them.');
F('N1-F05', 'n1', 55, 'A skater glides across frictionless ice at a steady speed in a straight line. What is needed to change the skater\u2019s speed or direction?', 'An unbalanced force',
  [['Nothing, because skaters change speed on their own', 'A skater cannot change motion without a net force from something else.'],
   ['Less inertia', 'Inertia does not change by itself, and it does not change the motion.'],
   ['More time', 'Waiting does not change the motion. A net force does.']],
  'By Newton\u2019s first law, only an unbalanced force can change an object\u2019s velocity.');
F('N1-F06', 'n1', 55, 'A moving object has no forces acting on it. What will it do?', 'Keep moving at the same speed in the same direction',
  [['Slow down and stop', 'Slowing needs a force such as friction. There are none here.'],
   ['Speed up', 'Speeding up needs an unbalanced force.'],
   ['Stop immediately', 'An object does not stop instantly when forces vanish.']],
  'With no net force, the object\u2019s velocity stays the same.');
F('N1-F07', 'n1', 40, 'A crash-test dummy keeps moving forward when the car hits a wall and stops. This is an example of', 'inertia',
  [['balanced forces', 'The wall exerts an unbalanced force on the car. The dummy just keeps moving.'],
   ['friction', 'Friction is not the cause. The dummy keeps moving because of inertia.'],
   ['weight', 'Weight is the pull of gravity, which acts downward.']],
  'The car stops because of an unbalanced force. The dummy has no such force, so it keeps moving forward by inertia.');
F('N1-F08', 'n1', 45, 'Which has more inertia?', 'A bowling ball, because it has more mass',
  [['A tennis ball, because it is smaller', 'Size does not set inertia. Mass does.'],
   ['They have the same inertia because both are round', 'Inertia depends on mass, not shape.'],
   ['Whichever is moving faster', 'Inertia depends on mass. Speed does not change it.']],
  'The more mass an object has, the more inertia it has.');

/* ===== Topic: Newton's 2nd law ===== */
const _n2objs = ['cart', 'wagon', 'sled', 'crate', 'toy car', 'shopping cart'];
function _distinct(vals, tol) {
  const strs = vals.map(v => fmt(v, 3));
  if (new Set(strs).size < vals.length) return false;
  for (let i = 1; i < vals.length; i++) if (Math.abs(vals[i] - vals[0]) / Math.abs(vals[0]) < (tol || 0.06)) return false;
  return true;
}
T('2ND-T1', 'n2', 30, 'Find acceleration (a = F/m)', function () {
  for (let tries = 0; tries < 200; tries++) {
    const m = pick([2, 3, 4, 5, 6, 8, 12, 15, 20, 24, 30, 40, 50]), a = pick([0.5, 1, 1.5, 2, 2.5, 3, 4, 5]);
    if ((m === 8 && a === 3) || (m === 10 && a === 0.2)) continue;      // avoid textbook/homework numbers
    const F_ = m * a, o = pick(_n2objs), who = pick(['Murphy', 'Mr. Ward', oneName()]);
    const vals = [a, F_ * m, m / F_, F_ > m ? F_ - m : F_ + m];
    if (!_distinct(vals)) continue;
    const s = vals.map(v => fmt(v, 3));
    return {
      prompt: who + ' pulls a ' + m + ' kg ' + o + ' with a net force of ' + F_ + ' N. What is the acceleration of the ' + o + '?',
      right: s[0] + ' m/s\u00b2',
      wrongs: [[s[1] + ' m/s\u00b2', 'Acceleration is force divided by mass. Multiplying them gives the wrong result.'],
               [s[2] + ' m/s\u00b2', 'This flipped the fraction. The force goes on top: a = F \u00f7 m.'],
               [s[3] + ' m/s\u00b2', 'You cannot add or subtract a force and a mass. Divide the force by the mass.']],
      explain: 'a = F \u00f7 m = ' + F_ + ' N \u00f7 ' + m + ' kg = ' + s[0] + ' m/s\u00b2.', meta: { m: m, F: F_, a: a }
    };
  }
  throw new Error('2ND-T1');
});
T('2ND-T2', 'n2', 30, 'Find net force (F = ma)', function () {
  for (let tries = 0; tries < 200; tries++) {
    const m = pick([2, 3, 4, 5, 6, 8, 12, 15, 20, 24, 30, 40, 50]), a = pick([0.5, 1, 1.5, 2, 2.5, 3, 4, 5]);
    const o = pick(_n2objs);
    const vals = [m * a, m / a, a / m, m + a];
    if (!_distinct(vals)) continue;
    const s = vals.map(v => fmt(v, 3));
    return {
      prompt: 'A ' + m + ' kg ' + o + ' speeds up at ' + a + ' m/s\u00b2. What net force acts on it?',
      right: s[0] + ' N',
      wrongs: [[s[1] + ' N', 'F = m \u00d7 a. Dividing mass by acceleration gives the wrong result.'],
               [s[2] + ' N', 'F = m \u00d7 a. Dividing acceleration by mass is the wrong operation.'],
               [s[3] + ' N', 'You cannot add mass and acceleration. Multiply them.']],
      explain: 'F = ma = ' + m + ' kg \u00d7 ' + a + ' m/s\u00b2 = ' + s[0] + ' N.', meta: { m: m, a: a }
    };
  }
  throw new Error('2ND-T2');
});
T('2ND-T3', 'n2', 45, 'Find mass (m = F/a)', function () {
  for (let tries = 0; tries < 200; tries++) {
    const m = pick([2, 3, 4, 5, 6, 8, 12, 15, 20, 24, 30, 40, 50]), a = pick([0.5, 1, 1.5, 2, 2.5, 3, 4, 5]);
    const F_ = m * a, o = pick(_n2objs);
    const vals = [m, F_ * a, a / F_, F_ > a ? F_ - a : F_ + a];
    if (!_distinct(vals)) continue;
    const s = vals.map(v => fmt(v, 3));
    return {
      prompt: 'A net force of ' + F_ + ' N makes a ' + o + ' accelerate at ' + a + ' m/s\u00b2. What is the mass of the ' + o + '?',
      right: s[0] + ' kg',
      wrongs: [[s[1] + ' kg', 'Rearranging a = F \u00f7 m gives m = F \u00f7 a. Multiplying is the wrong operation.'],
               [s[2] + ' kg', 'This flipped the fraction. m = F \u00f7 a, with the force on top.'],
               [s[3] + ' kg', 'You cannot subtract an acceleration from a force. Divide the force by the acceleration.']],
      explain: 'm = F \u00f7 a = ' + F_ + ' N \u00f7 ' + a + ' m/s\u00b2 = ' + s[0] + ' kg.', meta: { F: F_, a: a }
    };
  }
  throw new Error('2ND-T3');
});
T('2ND-T4', 'n2', 45, 'How force and mass change acceleration', function () {
  const cases = [
    { c: 'the net force on it doubles and its mass stays the same', f: 2, w: [[0.5, 'More force means more acceleration, not less.'], [4, 'Doubling the force doubles the acceleration. It does not quadruple it.'], [1, 'Acceleration depends on the net force, so it changes.']] },
    { c: 'its mass doubles and the net force stays the same', f: 0.5, w: [[2, 'More mass means less acceleration for the same force.'], [0.25, 'Doubling the mass halves the acceleration. It does not cut it to one-fourth.'], [1, 'Acceleration depends on mass, so it changes.']] },
    { c: 'the net force on it triples and its mass stays the same', f: 3, w: [[0.333333, 'More force means more acceleration.'], [9, 'Tripling the force triples the acceleration.'], [1, 'Acceleration depends on the net force, so it changes.']] },
    { c: 'its mass triples and the net force stays the same', f: 0.333333, w: [[3, 'More mass means less acceleration for the same force.'], [0.111111, 'Tripling the mass divides the acceleration by 3, not by 9.'], [1, 'Acceleration depends on mass, so it changes.']] },
    { c: 'both the net force and the mass double', f: 1, w: [[2, 'Doubling the force doubles a, but doubling the mass halves it. They cancel.'], [4, 'The two doublings work against each other, so they cancel.'], [0.5, 'The force doubling raises a by 2 and the mass doubling lowers it by 2, so a stays the same.']] },
    { c: 'the net force doubles and the mass triples', f: 0.666667, w: [[1.5, 'This flipped the ratio. The tripled mass divides the acceleration by 3 while the doubled force multiplies it by 2, so it ends up smaller, not larger.'], [6, 'Tripling the mass makes the acceleration smaller. It cannot multiply the acceleration by 3.'], [1, '2 \u00f7 3 is not 1. The acceleration changes by a factor of two-thirds.']] }
  ];
  const k = pick(cases), o = pick(_n2objs);
  return {
    prompt: 'A ' + o + ' is accelerating. What happens to its acceleration if ' + k.c + '?',
    right: 'The acceleration becomes ' + _ft(k.f),
    wrongs: k.w.map(w => ['The acceleration becomes ' + _ft(w[0]), w[1]]),
    explain: 'a = F \u00f7 m. Acceleration grows with the net force and shrinks with the mass, so the acceleration becomes ' + _ft(k.f) + '.', meta: { f: k.f }
  };
});
F('N2-F01', 'n2', 20, 'Newton\u2019s second law says that the acceleration of an object is', 'the net force on the object divided by its mass',
  [['the mass divided by the net force', 'This flips the equation. Acceleration is force over mass.'],
   ['the net force times the mass', 'That is F = ma, which gives the force, not the acceleration.'],
   ['equal to its weight', 'Weight is a force. Acceleration depends on the net force and mass.']],
  'a = F \u00f7 m, with F the net force.');
F('N2-F02', 'n2', 30, 'In which direction does an object accelerate?', 'In the direction of the net force',
  [['In the direction it was already moving', 'Acceleration points along the net force, which can be opposite to the motion.'],
   ['Opposite the net force', 'Acceleration is always in the direction of the net force.'],
   ['Straight down', 'Acceleration follows the net force, not gravity alone.']],
  'The direction of the acceleration is the same as the direction of the net force.');
F('N2-F03', 'n2', 45, 'One newton (N) is the same as', '1 kg\u00b7m/s\u00b2',
  [['1 kg\u00b7m/s', 'That is a unit of momentum, not force.'],
   ['1 kg/m\u00b7s\u00b2', 'The meters belong on top: kg\u00b7m/s\u00b2.'],
   ['1 m/s\u00b2', 'That is a unit of acceleration. A newton also includes mass in kilograms.']],
  'Since F = ma, force has units of kg \u00d7 m/s\u00b2. One newton accelerates 1 kg at 1 m/s\u00b2.');
F('N2-F04', 'n2', 25, 'You know the mass of an object and the net force on it. Which law helps you find its acceleration?', 'Newton\u2019s second law',
  [['Newton\u2019s first law', 'The first law only says what happens when the net force is zero.'],
   ['Newton\u2019s third law', 'The third law describes force pairs.'],
   ['The law of universal gravitation', 'That is about gravity between masses, not acceleration from a net force.']],
  'Newton\u2019s second law, a = F \u00f7 m, links force, mass, and acceleration.');
F('N2-F05', 'n2', 35, 'In the equation a = F \u00f7 m, what does each letter stand for?', 'a is acceleration, F is net force, m is mass',
  [['a is area, F is friction, m is momentum', 'These letters stand for acceleration, net force, and mass.'],
   ['a is speed, F is force, m is meters', 'a is acceleration, not speed. m is mass, not meters.'],
   ['a is weight, F is fall, m is motion', 'These letters stand for acceleration, net force, and mass.']],
  'a = acceleration (m/s\u00b2), F = net force (N), m = mass (kg).');
F('N2-F06', 'n2', 35, 'The same net force is applied to a heavy cart and a light cart. Which statement is true?', 'The light cart has the greater acceleration',
  [['The heavy cart has the greater acceleration', 'With the same force, more mass means less acceleration.'],
   ['Both carts have the same acceleration', 'With the same net force, the masses make the accelerations different.'],
   ['Neither cart accelerates', 'A net force always produces an acceleration.']],
  'a = F \u00f7 m. With the same F, the smaller mass gives the larger acceleration.');

/* ===== Topic: Newton's 3rd law ===== */
T('N3-T1', 'n3', 45, 'Describe a reaction force', function () {
  const sc = pick([
    ['A hand pushes on a wall', 'the wall pushes on the hand'],
    ['A foot pushes down on the ground', 'the ground pushes up on the foot'],
    ['A bat hits a baseball', 'the baseball pushes back on the bat'],
    ['A swimmer\u2019s hands push the water backward', 'the water pushes the swimmer\u2019s hands forward'],
    ['A tire pushes backward on the road', 'the road pushes the tire forward'],
    ['A hammer strikes a nail', 'the nail pushes back on the hammer']
  ]);
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  return {
    prompt: sc[0] + '. Which statement describes the reaction force?',
    right: cap(sc[1]) + ' with the same strength in the opposite direction',
    wrongs: [[cap(sc[1]) + ' with a weaker force, since it responds second', 'The two forces in a pair are always the same strength.'],
             ['Nothing pushes back unless something starts to move', 'Reaction forces exist the moment there is an action force, even if nothing moves.'],
             ['The action force continues in the same direction with the same strength', 'The reaction force acts on the other object and points in the opposite direction.']],
    explain: 'For every action force there is a reaction force of equal strength in the opposite direction, acting on the other object.', meta: {}
  };
});
F('N3-F01', 'n3', 20, 'Newton\u2019s third law says that', 'when one object pushes on a second, the second pushes back with a force of the same size in the opposite direction',
  [['an object at rest stays at rest', 'That is the first law.'],
   ['force equals mass times acceleration', 'That is the second law.'],
   ['the bigger object always pushes harder', 'The forces in a pair are always the same size, regardless of the objects\u2019 masses.']],
  'Forces come in pairs: equal in size, opposite in direction, acting on different objects.');
F('N3-F02', 'n3', 65, 'The action and reaction forces in a force pair do not cancel each other because', 'they act on different objects',
  [['they are different sizes', 'Forces in a pair are the same size.'],
   ['they point the same direction', 'Forces in a pair point in opposite directions.'],
   ['one of them is not really a force', 'Both are real forces.']],
  'Forces cancel only if they act on the same object. The action acts on one object and the reaction acts on the other.');
F('N3-F03', 'n3', 40, 'A swimmer pushes the water backward with their hands. What is the reaction force?', 'The water pushes the swimmer\u2019s hands forward',
  [['The swimmer\u2019s hands push forward on the swimmer', 'The reaction acts on the other object, the hands being pushed by the water.'],
   ['Gravity pulls the swimmer down', 'Gravity is not the reaction here. The reaction is the water pushing back on the hands.'],
   ['The water stops the swimmer', 'The water pushes the swimmer forward, which is the reaction force.']],
  'The swimmer pushes the water back (action) and the water pushes the swimmer forward (reaction).');
F('N3-F04', 'n3', 40, 'A rocket engine pushes hot gas downward. What is the reaction force?', 'The gas pushes the engine upward',
  [['The engine pushes the gas upward', 'The engine pushes the gas down. The gas pushes the engine up.'],
   ['Gravity pulls the rocket down', 'Gravity is a different force from Earth, not the reaction to the engine\u2019s push.'],
   ['Nothing, because the gas is not solid', 'Reaction forces happen with gases too.']],
  'The engine\u2019s push on the gas is the action. The gas pushes back on the engine, which accelerates the rocket upward.');
F('N3-F05', 'n3', 35, 'Dilan dribbles a basketball. When the ball pushes down on the floor, what is the reaction force?', 'The floor pushes up on the ball',
  [['Dilan pushes down on the ball', 'That is another force on the ball, not the reaction to the ball pushing on the floor.'],
   ['Gravity pulls the ball down', 'Gravity is not the reaction here. The floor pushes back on the ball.'],
   ['The ball pushes up on Dilan', 'The reaction to the ball pushing the floor is the floor pushing the ball.']],
  'The ball pushes on the floor (action). The floor pushes up on the ball (reaction).');
F('N3-F06', 'n3', 40, 'A diver springs off the end of a diving board. Which pair is a Newton\u2019s third law pair?', 'The diver pushes down on the board, and the board pushes up on the diver',
  [['The diver\u2019s weight and the board pushing up on the diver', 'Both of those act on the diver, so they are not an action-reaction pair.'],
   ['The board pushes up on the diver, and gravity pulls the diver down', 'Both act on the diver, so they are not a force pair.'],
   ['The diver pushes down, and the diver pushes up', 'A force pair acts on two different objects.']],
  'Action: the diver pushes down on the board. Reaction: the board pushes up on the diver.');
F('N3-F07', 'n3', 60, 'Which of these is a Newton\u2019s third law force pair?', 'Earth pulls on you, and you pull on Earth',
  [['Gravity pulls you down, and the floor pushes you up', 'Both act on you, so they are not a force pair.'],
   ['You push on a wall, and you push on the floor', 'Those are two different pushes by you. A pair involves the same two objects.'],
   ['Your weight and your mass', 'Weight is a force and mass is not.']],
  'In a force pair, A pushes or pulls on B, and B pushes or pulls on A.');
F('N3-F08', 'n3', 70, 'A large truck and a small car crash head-on. Which statement about the forces during the crash is true?', 'The truck and the car exert forces of the same size on each other',
  [['The truck exerts a larger force because it has more mass', 'The forces in a pair are always equal, no matter the masses.'],
   ['The car exerts a larger force because it is damaged more', 'The damage differs because the same force has different effects on different masses.'],
   ['Only the truck exerts a force', 'Each vehicle exerts a force on the other.']],
  'Newton\u2019s third law: the forces are equal and opposite. The car accelerates more because it has less mass.');
F('N3-F09', 'n3', 40, 'When you jump, you push down on the ground. What makes you accelerate upward?', 'The ground pushes up on you with a force of the same size',
  [['Your muscles push you upward directly', 'Your muscles push down on the ground. The ground pushing back accelerates you.'],
   ['Gravity pulls you upward', 'Gravity pulls you down.'],
   ['The ground does not push on you', 'The ground does push back, which is the reaction force.']],
  'You push down on the ground (action). The ground pushes up on you (reaction). If it is larger than your weight, you accelerate upward.');
