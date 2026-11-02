'use strict';
/* ===== Topic: Gravity ===== */
const FTXT = { 0.111111: 'one-ninth as large', 0.25: 'one-fourth as large', 0.333333: 'one-third as large', 0.5: 'half as large',
  1: 'the same size', 2: 'twice as large', 3: 'three times as large', 4: 'four times as large', 9: 'nine times as large' };
function _ft(f) { const k = Object.keys(FTXT).find(x => Math.abs(Number(x) - f) < 0.001); return FTXT[k]; }
T('GRV-T1', 'grav', 55, 'How changing mass or distance changes gravity', function () {
  const cases = [
    { c: 'the mass of one object doubles', f: 2, w: [[0.5, 'More mass means more force, so the force cannot get smaller.'], [4, 'Only one mass doubled, so the force doubles. It does not quadruple.'], [1, 'Mass changes the force: more mass, more gravitational force.']] },
    { c: 'the mass of one object triples', f: 3, w: [[9, 'Only one mass tripled, so the force triples. It does not become nine times larger.'], [0.333333, 'More mass means more force, so the force cannot get smaller.'], [1, 'Mass changes the force: more mass, more gravitational force.']] },
    { c: 'both masses double', f: 4, w: [[2, 'Both masses doubled, so the force is 2 \u00d7 2 = 4 times larger.'], [0.25, 'More mass means more force, not less.'], [0.5, 'More mass means more force, not less.']] },
    { c: 'the distance between the objects doubles', f: 0.25, w: [[0.5, 'The force depends on the distance squared. Doubling the distance divides the force by 2\u00b2 = 4, not by 2.'], [2, 'More distance means a weaker force.'], [4, 'More distance means a weaker force.']] },
    { c: 'the distance between the objects triples', f: 0.111111, w: [[0.333333, 'The force depends on the distance squared. Tripling the distance divides the force by 3\u00b2 = 9.'], [3, 'More distance means a weaker force.'], [9, 'More distance means a weaker force.']] },
    { c: 'the distance between the objects is cut in half', f: 4, w: [[2, 'The force depends on the distance squared. Half the distance makes the force (2)\u00b2 = 4 times larger.'], [0.5, 'Less distance means a stronger force.'], [0.25, 'Less distance means a stronger force.']] },
    { c: 'one mass doubles and the distance doubles', f: 0.5, w: [[2, 'The doubled mass makes the force 2\u00d7 bigger, but the doubled distance makes it 4\u00d7 smaller, so the force gets weaker.'], [1, '2\u00d7 from the mass and 1/4 from the distance do not cancel. The result is 2 \u00d7 1/4 = 1/2.'], [0.25, 'The mass doubling raises the force by 2, so the force is not cut all the way to 1/4.']] }
  ];
  const k = pick(cases);
  return {
    prompt: 'Two objects attract each other with a gravitational force. What happens to the force between them if ' + k.c + '?',
    right: 'The force becomes ' + _ft(k.f),
    wrongs: k.w.map(w => ['The force becomes ' + _ft(w[0]), w[1]]),
    explain: 'Gravitational force grows with the product of the masses and shrinks with the square of the distance. For this change the force becomes ' + _ft(k.f) + '.',
    meta: { f: k.f }
  };
});
F('GRV-F01', 'grav', 15, 'Gravity is a force that exists between', 'all objects that have mass',
  [['only planets and moons', 'Every object with mass attracts every other object. Planets just have a lot of mass.'],
   ['only objects that touch', 'Gravity is a non-contact force.'],
   ['only objects that are falling', 'Objects at rest attract each other too.']],
  'Gravity is an attractive force between all objects with mass.');
F('GRV-F02', 'grav', 20, 'Two objects attract each other. One of them is replaced with a more massive object. What happens to the gravitational force between them?', 'It increases',
  [['It decreases', 'More mass means more gravitational pull.'],
   ['It stays the same', 'The force depends on the masses of the objects.'],
   ['It becomes zero', 'The force never becomes zero just because of a mass change.']],
  'Greater mass means a greater force of gravity.');
F('GRV-F03', 'grav', 20, 'Two objects move farther apart. What happens to the gravitational force between them?', 'It decreases',
  [['It increases', 'The farther apart objects are, the weaker the pull.'],
   ['It stays the same', 'The force depends on the distance between the objects.'],
   ['It turns into a push', 'Gravity only attracts. It never repels.']],
  'More distance means less gravitational force.');
F('GRV-F04', 'grav', 25, 'The pull of gravity between any two objects is set by which two things?', 'The masses of the objects and the distance between them',
  [['The sizes of the objects and their speeds', 'Speed and size do not set the gravitational force. Mass and distance do.'],
   ['The weights of the objects and their colors', 'Color has no effect on gravity.'],
   ['The temperature of the objects and the distance between them', 'Temperature does not affect gravity. Mass does.']],
  'Newton\u2019s law of universal gravitation: the force depends on the masses and on the distance.');
F('GRV-F05', 'grav', 15, 'Which scientist worked out that every pair of masses attracts, a rule called the law of universal gravitation?', 'Sir Isaac Newton',
  [['Albert Einstein', 'Einstein came later and developed relativity.'],
   ['Marie Curie', 'Curie studied radioactivity.'],
   ['Galileo Galilei', 'Galileo studied falling objects, but the law of universal gravitation is Newton\u2019s.']],
  'Newton developed the law of universal gravitation in the late 1600s.');
F('GRV-F06', 'grav', 65, 'Henry holds a sandwich in the air. Compared with Earth\u2019s pull on the sandwich, the sandwich\u2019s pull on Earth is',
  'equal in size and opposite in direction',
  [['much smaller, because the sandwich has so little mass', 'The two forces in a pair are always the same size. The sandwich\u2019s small mass only makes its effect on Earth tiny.'],
   ['zero, because Earth does not move', 'The sandwich really does pull on Earth. Earth just has so much mass that the same force barely moves it.'],
   ['equal in size and in the same direction', 'The forces in a pair point in opposite directions: the sandwich is pulled toward Earth, and Earth toward the sandwich.']],
  'Gravity is a force pair. Each object pulls on the other with the same size force. The effect on each object differs because their masses differ.');
F('GRV-F07', 'grav', 70, 'Why don\u2019t we feel Earth move when we pick up a sandwich?', 'Earth has so much mass that the same force gives it an extremely tiny acceleration',
  [['The sandwich does not pull on Earth at all', 'It does. The pull on Earth is equal to the pull on the sandwich.'],
   ['Earth is held in place by friction', 'Friction has nothing to do with it. Earth\u2019s huge mass makes its acceleration tiny.'],
   ['Gravity only pulls in one direction', 'Gravity is a mutual attraction. Both objects pull on each other.']],
  'Same force, but a = F \u00f7 m. With an enormous mass, Earth\u2019s acceleration is essentially zero.');
F('GRV-F08', 'grav', 55, 'Astronauts in orbit weigh about 90 percent of what they weigh on Earth. Why is the change so small?', 'They are still close to Earth compared with Earth\u2019s size',
  [['There is no gravity in space, but they have a little leftover', 'Gravity is still strong in orbit. That is why they stay in orbit.'],
   ['Their mass increases in space', 'Mass does not change with location.'],
   ['The ship\u2019s engines push them down', 'The engines are not the reason. The distance is small compared with Earth\u2019s size, so gravity changes little.']],
  'Orbit is not far enough away compared with Earth\u2019s size to change gravity much, so astronauts are not weightless.');
F('GRV-F09', 'grav', 45, 'Is there a gravitational force between you and a friend sitting next to you?', 'Yes, but it is very small because your masses are small',
  [['No, because gravity only exists between planets', 'Gravity exists between any two objects with mass.'],
   ['Yes, and it is as strong as Earth\u2019s pull on you', 'Earth has far more mass than your friend, so its pull is much greater.'],
   ['No, because you are touching the floor', 'Touching the floor does not turn off gravity between you and your friend.']],
  'All objects with mass attract each other, but the force is tiny unless one of them has a huge mass.');

/* ===== Topic: Weight and mass ===== */
const _objs = ['backpack', 'toolbox', 'bag of sand', 'telescope', 'microscope case', 'lab cart'];
function _wfmt(planet, x) { return planet === 'Earth' ? fmt(x, 2) : fmt(x, 3); }
T('WGT-T1', 'wgt', 40, 'Weight on a planet (W = mg)', function () {
  for (let tries = 0; tries < 200; tries++) {
    const planet = pick(Object.keys(PLANETS)), g = PLANETS[planet];
    const m = ri(20, 95) / 10, o = pick(_objs);
    if (planet === 'Earth' && !sameBoth(gg => m * gg, 2)) continue;
    const ans = m * g, wrongG = planet === 'Earth' ? 1.62 : 9.8;
    const vals = [ans, m / g, m * wrongG, m];
    const strs = vals.map(v => _wfmt(planet, v));
    if (new Set(strs).size < 4) continue;
    if ([1, 2, 3].some(i => Math.abs(vals[i] - ans) / ans < 0.06)) continue;
    if (planet === 'Earth' && [1, 2, 3].some(i => Math.abs(vals[i] - m * G_EARTH_ALT) / ans < 0.06)) continue;
    const owner = rand() < 0.5 ? oneName() + '\u2019s ' + o : 'A ' + o;
    return {
      prompt: owner + ' has a mass of ' + fmt(m, 2) + ' kg. What is its weight on ' + planet + '? (g on ' + planet + ' = ' + g + ' m/s\u00b2)',
      right: strs[0] + ' N',
      wrongs: [[strs[1] + ' N', 'Weight is mass \u00d7 g. Dividing mass by g gives the wrong result.'],
               [strs[2] + ' N', 'That used g = ' + wrongG + ' m/s\u00b2, which belongs to ' + (planet === 'Earth' ? 'the Moon' : 'Earth') + '. Use the g for ' + planet + '.'],
               [strs[3] + ' N', 'Mass and weight are different quantities. Weight in newtons is mass \u00d7 g.']],
      explain: 'W = mg = ' + fmt(m, 2) + ' kg \u00d7 ' + g + ' m/s\u00b2 = ' + strs[0] + ' N.' + (planet === 'Earth' ? ' (Using 9.81 gives the same value to 2 significant figures.)' : ''),
      meta: { m: m, planet: planet, g: g }
    };
  }
  throw new Error('WGT-T1 could not generate');
});
T('WGT-T2', 'wgt', 55, 'Find mass from weight on another planet', function () {
  for (let tries = 0; tries < 200; tries++) {
    const planet = pick(['Moon', 'Mars', 'Jupiter', 'Saturn']), g = PLANETS[planet];
    const m = ri(35, 90), W = Number((m * g).toPrecision(3));
    const ans = W / g, vals = [ans, W * g, W / 9.8, W];
    const strs = vals.map(v => fmt(v, 3));
    if (new Set(strs).size < 4) continue;
    if ([1, 2, 3].some(i => Math.abs(vals[i] - ans) / ans < 0.06)) continue;
    return {
      prompt: 'An astronaut weighs ' + fmt(W, 3) + ' N on ' + planet + '. What is the astronaut\u2019s mass? (g on ' + planet + ' = ' + g + ' m/s\u00b2)',
      right: strs[0] + ' kg',
      wrongs: [[strs[1] + ' kg', 'To find mass from weight you divide: m = W \u00f7 g. Multiplying gives a number that is much too big.'],
               [strs[2] + ' kg', 'That used Earth\u2019s g. The weight was measured on ' + planet + ', so divide by the g for ' + planet + '.'],
               [strs[3] + ' kg', 'Weight and mass are not the same number. Divide the weight by g to get the mass.']],
      explain: 'm = W \u00f7 g = ' + fmt(W, 3) + ' N \u00f7 ' + g + ' m/s\u00b2 = ' + strs[0] + ' kg. Use the g of the planet where the weight was measured.',
      meta: { W: W, g: g, m: ans }
    };
  }
  throw new Error('WGT-T2 could not generate');
});
T('WGT-T3', 'wgt', 60, 'Weight on Earth from weight on another planet', function () {
  for (let tries = 0; tries < 200; tries++) {
    const planet = pick(['Moon', 'Mars', 'Jupiter', 'Saturn']), g = PLANETS[planet];
    const m = ri(20, 200) / 10, W = Number((m * g).toPrecision(3)), o = pick(_objs);
    if (!sameBoth(gg => (W / g) * gg, 2)) continue;
    const ansV = (W / g) * G_EARTH, vals = [ansV, W, W * G_EARTH, W / G_EARTH];
    const strs = vals.map(v => fmt(v, 2));
    if (new Set(strs).size < 4) continue;
    if ([1, 2, 3].some(i => Math.abs(vals[i] - ansV) / ansV < 0.06)) continue;
    const eq = [1, 2, 3].some(i => Math.abs(vals[i] - (W / g) * G_EARTH_ALT) / ansV < 0.06);
    if (eq) continue;
    return {
      prompt: 'A ' + o + ' weighs ' + fmt(W, 3) + ' N on ' + planet + ' (g = ' + g + ' m/s\u00b2). What would it weigh on Earth?',
      right: strs[0] + ' N',
      wrongs: [[strs[1] + ' N', 'Weight changes from planet to planet. Only mass stays the same.'],
               [strs[2] + ' N', 'Weight is already a force. Multiplying it by g again does not give the weight on Earth.'],
               [strs[3] + ' N', 'Dividing the weight by g gives a mass, not a weight.']],
      explain: 'Mass stays the same. m = W \u00f7 g = ' + fmt(W, 3) + ' \u00f7 ' + g + ' = ' + fmt(W / g, 3) + ' kg. On Earth, W = mg = ' + fmt(W / g, 3) + ' \u00d7 9.8 = ' + strs[0] + ' N.',
      meta: { W: W, g: g }
    };
  }
  throw new Error('WGT-T3 could not generate');
});
T('WGT-T4', 'wgt', 50, 'Find g from weight and mass', function () {
  for (let tries = 0; tries < 200; tries++) {
    const m = ri(15, 90) / 10, gx = ri(25, 200) / 10, W = Number((m * gx).toPrecision(3)), o = pick(_objs);
    const ans = W / m, vals = [ans, W * m, m / W, W / 9.8];
    const strs = vals.map(v => fmt(v, 2));
    if (new Set(strs).size < 4) continue;
    if ([1, 2, 3].some(i => Math.abs(vals[i] - ans) / ans < 0.06)) continue;
    return {
      prompt: 'A ' + o + ' with a mass of ' + fmt(m, 2) + ' kg weighs ' + fmt(W, 3) + ' N on a new planet. What is the acceleration due to gravity (g) on that planet?',
      right: strs[0] + ' m/s\u00b2',
      wrongs: [[strs[1] + ' m/s\u00b2', 'Starting from W = mg, g = W \u00f7 m. Multiplying W and m is the wrong operation.'],
               [strs[2] + ' m/s\u00b2', 'This flipped the fraction. g = W \u00f7 m, with the weight on top.'],
               [strs[3] + ' m/s\u00b2', 'Dividing by 9.8 (Earth\u2019s g) does not find g on a different planet. Divide by the mass.']],
      explain: 'W = mg, so g = W \u00f7 m = ' + fmt(W, 3) + ' N \u00f7 ' + fmt(m, 2) + ' kg = ' + strs[0] + ' m/s\u00b2.',
      meta: { W: W, m: m }
    };
  }
  throw new Error('WGT-T4 could not generate');
});
F('WGT-F01', 'wgt', 15, 'Weight is', 'the gravitational force exerted on an object',
  [['the amount of matter in an object', 'That is mass.'],
   ['the speed an object falls at', 'That is a velocity, not weight.'],
   ['the same as mass, measured in kilograms', 'Weight is a force measured in newtons. Mass is measured in kilograms.']],
  'Weight is the gravitational force on an object, measured in newtons.');
F('WGT-F02', 'wgt', 15, 'Mass is', 'the amount of matter in an object',
  [['the pull of gravity on an object', 'That is weight.'],
   ['how fast an object moves', 'That is speed.'],
   ['measured in newtons', 'Mass is measured in kilograms. Newtons measure force.']],
  'Mass is the amount of matter in an object, measured in kilograms.');
F('WGT-F03', 'wgt', 30, 'A rock is moved from Earth to Mars. How do its mass and weight on Mars compare with its mass and weight on Earth?', 'The mass would be the same, but the weight would be less on Mars',
  [['The mass would be less on Mars, but the weight would be the same', 'It is the other way around: mass never changes with location.'],
   ['The mass and weight would both be the same on Mars', 'Weight changes because g on Mars (3.7 m/s\u00b2) is smaller than on Earth.'],
   ['The mass and weight would both be less on Mars', 'The rock\u2019s mass is the amount of matter in it, which does not change.']],
  'Mass is the same everywhere. Weight depends on g, which is smaller on the Moon.');
F('WGT-F04', 'wgt', 20, 'Which equation gives weight?', 'W = mg',
  [['W = m \u00f7 g', 'Weight is mass multiplied by g, not divided.'],
   ['W = g \u00f7 m', 'That would give a very small weight for a big mass.'],
   ['W = m + g', 'Mass and g are multiplied, not added.']],
  'Weight is the force of gravity on the object, so W = Fg = mg: mass times g.');
F('WGT-F05', 'wgt', 30, 'What does the little g stand for?', 'The acceleration due to gravity',
  [['The gravitational constant, 6.67 \u00d7 10\u207b\u00b9\u00b9', 'That is capital G. Little g is the acceleration due to gravity at a location.'],
   ['The mass of the planet', 'g depends on the planet\u2019s mass and size, but it is not the mass itself.'],
   ['The weight of one kilogram', 'g is an acceleration, in m/s\u00b2. It is not a weight.']],
  'Little g is the acceleration an object has when gravity is the only force acting on it.');
F('WGT-F06', 'wgt', 25, 'Which pair of units is correct for weight and mass?', 'Weight in newtons, mass in kilograms',
  [['Weight in kilograms, mass in newtons', 'Those units are swapped.'],
   ['Weight in kilograms, mass in kilograms', 'Weight is a force, so it is measured in newtons.'],
   ['Weight in newtons, mass in newtons', 'Mass is measured in kilograms.']],
  'Weight is a force (N). Mass is the amount of matter (kg).');
F('WGT-F07', 'wgt', 35, 'Why does the same rock weigh less on the Moon than on Earth?', 'The Moon\u2019s acceleration due to gravity is smaller',
  [['The rock has less mass on the Moon', 'The mass of the rock does not change.'],
   ['The Moon has no gravity', 'The Moon has gravity. Its g is 1.62 m/s\u00b2.'],
   ['The rock is farther from the Sun', 'Distance from the Sun is not the reason. The Moon\u2019s g is smaller.']],
  'Weight = mg. The mass stays the same, but g on the Moon is smaller, so the weight is smaller.');
F('WGT-F08', 'wgt', 40, 'Object A has twice the mass of object B. Both are on Earth. How do their weights compare?', 'A weighs twice as much as B',
  [['A weighs the same as B', 'Weight is proportional to mass. More mass means more weight.'],
   ['A weighs half as much as B', 'More mass means more weight, not less.'],
   ['A weighs four times as much as B', 'Weight is proportional to mass, so twice the mass is twice the weight.']],
  'W = mg, and g is the same for both. Doubling the mass doubles the weight.');

/* ===== Topic: Free fall ===== */
const _fallObjs = ['a coin', 'a tennis ball', 'a water balloon', 'a wrench', 'an apple', 'a marble'];
T('FFL-T1', 'fall', 40, 'Speed after falling for t seconds', function () {
  for (let tries = 0; tries < 200; tries++) {
    const planet = pick(['Earth', 'Earth', 'Moon', 'Mars']), g = PLANETS[planet], t = pick([1.5, 2, 2.5, 3, 4, 5, 6]);
    if (planet === 'Earth' && !sameBoth(gg => gg * t, 2)) continue;
    const vals = [g * t, g / t, g + t, g * t * t];
    const f = v => planet === 'Earth' ? fmt(v, 2) : fmt(v, 3);
    const strs = vals.map(f);
    if (new Set(strs).size < 4) continue;
    if ([1, 2, 3].some(i => Math.abs(vals[i] - vals[0]) / vals[0] < 0.06)) continue;
    const o = pick(_fallObjs);
    return {
      prompt: o.charAt(0).toUpperCase() + o.slice(1) + ' is dropped from rest on ' + planet + ' (g = ' + g + ' m/s\u00b2). Ignoring air resistance, what is its velocity after ' + t + ' s?',
      right: strs[0] + ' m/s downward',
      wrongs: [[strs[1] + ' m/s downward', 'Velocity is g \u00d7 t. Dividing g by t is the wrong operation.'],
               [strs[2] + ' m/s downward', 'Velocity is g \u00d7 t. Adding g and t mixes units that do not add.'],
               [strs[3] + ' m/s downward', 'The velocity grows in proportion to the time (v = g \u00d7 t). The time is not squared in this formula.']],
      explain: 'Starting from rest, v = g \u00d7 t = ' + g + ' \u00d7 ' + t + ' = ' + strs[0] + ' m/s downward.' + (planet === 'Earth' ? ' (9.81 gives the same value to 2 significant figures.)' : ''),
      meta: { planet: planet, g: g, t: t }
    };
  }
  throw new Error('FFL-T1 could not generate');
});
T('FFL-T2', 'fall', 55, 'Time to reach a speed', function () {
  for (let tries = 0; tries < 200; tries++) {
    const planet = pick(['Earth', 'Moon', 'Mars']), g = PLANETS[planet], t0 = pick([2, 3, 4, 5, 6, 8]);
    if (planet === 'Moon' && t0 === 5) continue;      // avoid the class homework's exact 8.1 m/s on the Moon
    const v = Number((g * t0).toPrecision(planet === 'Earth' ? 2 : 3));
    if (planet === 'Earth' && !sameBoth(gg => v / gg, 2)) continue;
    const vals = [v / g, v * g, g / v, v > g ? v - g : v + g];
    const strs = vals.map(x => fmt(x, 2));
    if (new Set(strs).size < 4) continue;
    if ([1, 2, 3].some(i => Math.abs(vals[i] - vals[0]) / vals[0] < 0.06)) continue;
    const o = pick(_fallObjs);
    return {
      prompt: o.charAt(0).toUpperCase() + o.slice(1) + ' is dropped from rest on ' + planet + ' (g = ' + g + ' m/s\u00b2). Ignoring air resistance, how long does it take to reach ' + fmt(v, 3) + ' m/s?',
      right: strs[0] + ' s',
      wrongs: [[strs[1] + ' s', 'Rearranging v = g \u00d7 t gives t = v \u00f7 g. Multiplying makes a number far too large.'],
               [strs[2] + ' s', 'This flipped the fraction. The speed goes on top: t = v \u00f7 g.'],
               [strs[3] + ' s', 'Subtracting or adding g does not solve v = g \u00d7 t. Divide the speed by g.']],
      explain: 't = v \u00f7 g = ' + fmt(v, 3) + ' \u00f7 ' + g + ' = ' + strs[0] + ' s.',
      meta: { planet: planet, g: g, v: v }
    };
  }
  throw new Error('FFL-T2 could not generate');
});
T('FFL-T3', 'fall', 55, 'Speed grows in proportion to time', function () {
  const t = pick([1, 2, 3]), k = pick([2, 3]), v = pick([8, 10, 12, 15]);
  return {
    prompt: 'A rock falls freely from rest on a distant planet. After ' + t + ' s its speed is ' + v + ' m/s. What is its speed after ' + (k * t) + ' s?',
    right: (k * v) + ' m/s',
    wrongs: [[(k * k * v) + ' m/s', 'Speed is proportional to time (v = g \u00d7 t). Doubling or tripling the time only doubles or triples the speed.'],
             [v + ' m/s', 'A falling object keeps speeding up as long as gravity acts, so the speed does not stay the same.'],
             [Number((v / k).toFixed(1)) + ' m/s', 'The speed keeps increasing. It does not decrease as time goes on.']],
    explain: 'The acceleration is constant, so speed grows in step with time. ' + k + ' times the time gives ' + k + ' times the speed: ' + (k * v) + ' m/s.',
    meta: { v: v, k: k }
  };
});
F('FFL-F01', 'fall', 30, 'An object is in free fall when', 'gravity is the only force acting on it',
  [['it is dropped from any height', 'A paper drifting down has air resistance acting on it, so it is not in free fall.'],
   ['no forces act on it', 'Gravity is acting on a free-falling object.'],
   ['it is falling through air', 'Air resistance is another force. Free fall means gravity is the only force.']],
  'Free fall means gravity is the only force on the object.');
F('FFL-F02', 'fall', 45, 'A hammer and a feather are dropped together from the same height on the Moon. What happens?', 'They hit the ground at the same time',
  [['The hammer lands first because it is heavier', 'Without air resistance, all objects fall with the same acceleration.'],
   ['The feather lands first because it is lighter', 'Objects do not fall faster because they are lighter.'],
   ['They float because the Moon has no gravity', 'The Moon has gravity. Its g is 1.62 m/s\u00b2.']],
  'The Moon has no air, so only gravity acts on both. They have the same acceleration and land together.');
F('FFL-F03', 'fall', 55, 'Which statement correctly explains why a hammer and a feather accelerate the same on the Moon?', 'There is no air resistance, and gravity gives every object the same acceleration',
  [['There is no gravity on the Moon', 'The Moon has gravity (1.62 m/s\u00b2). That is why things fall.'],
   ['The hammer and feather have the same mass', 'They do not. Gravity accelerates objects equally regardless of mass.'],
   ['Gravity pulls harder on the feather', 'Gravity pulls harder on the hammer (greater weight), but the hammer also has more mass, so their accelerations match.']],
  'No air resistance means gravity is the only force. Then g is the same for all objects at that place.');
F('FFL-F04', 'fall', 40, 'Why is a falling book a good example of free fall, but a flat sheet of paper is not?', 'The paper has a lot of air resistance compared with its weight, but the book does not',
  [['The book has no gravity acting on it', 'Both are pulled by gravity.'],
   ['The paper is too light to be pulled by gravity', 'Gravity pulls on the paper too. Air resistance is just large compared with its weight.'],
   ['The book falls through a vacuum', 'The book falls through air too, but air resistance is small compared with its weight.']],
  'Free fall needs air resistance to be small. It is for the book, not for the flat paper.');
F('FFL-F05', 'fall', 70, 'Two balls are dropped from the same height, one second apart. As they keep falling, the distance between them', 'increases',
  [['stays the same', 'The first ball is always moving faster than the second, so the gap grows.'],
   ['decreases', 'The first ball is ahead and speeding up at the same rate, so it pulls farther ahead.'],
   ['becomes zero when they land together', 'They are released a second apart, so they land a second apart, not together.']],
  'Both speed up at the same rate, but the first ball always has a one-second head start in speed. It moves faster, so the gap increases.');
F('FFL-F06', 'fall', 30, 'A bowling ball and a tennis ball are dropped from the same height in a room with no air. Which lands first?', 'They land at the same time',
  [['The bowling ball', 'Heavier objects do not fall faster when there is no air resistance.'],
   ['The tennis ball', 'Lighter objects do not fall faster either.'],
   ['It depends on the colors of the balls', 'Color has nothing to do with free fall.']],
  'Objects dropped from the same height at the same time land together when only gravity acts.');
F('FFL-F07', 'fall', 40, 'On Earth, a freely falling object\u2019s speed increases by about how much each second?', '9.8 m/s',
  [['9.8 m', 'The change in speed is in meters per second.'],
   ['98 m/s', 'That is ten times too much.'],
   ['It does not increase; the object falls at a constant speed', 'Gravity keeps pulling, so the speed keeps increasing.']],
  'g = 9.8 m/s\u00b2 means the speed increases by 9.8 m/s every second.');
F('FFL-F08', 'fall', 40, 'Why do a rock and a leaf accelerate at the same rate when they are dropped on the Moon?', 'There is no air resistance, and gravity gives all objects the same acceleration',
  [['the Moon has no gravity', 'The Moon has gravity. Its g is smaller than Earth\u2019s.'],
   ['all objects have the same weight', 'Weights differ. The accelerations are the same.'],
   ['the Moon is not round', 'The shape of the Moon has nothing to do with it.']],
  'On the Moon, gravity is the only force, so every object has an acceleration of 1.62 m/s\u00b2.');
