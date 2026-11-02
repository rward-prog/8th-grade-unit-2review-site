'use strict';
/* ===== Challenge (beyond the test). Tracked separately. IDs start with CH- ===== */
const _G = 6.67e-11;
T('CH-T1', 'chal', 75, 'Universal gravitation calculation', function () {
  for (let tries = 0; tries < 200; tries++) {
    const [a, b] = twoNames();
    const m1 = ri(40, 90), m2 = ri(40, 90), r = pick([0.5, 1.0, 1.5, 2.0]);
    if (m1 === m2) continue;
    const vals = [_G * m1 * m2 / (r * r), _G * m1 * m2 / r, m1 * m2 / (r * r), _G * (m1 + m2) / (r * r)];
    const s = vals.map(v => sci(v, 2));
    if (new Set(s).size < 4) continue;
    if ([1, 2, 3].some(i => Math.abs(vals[i] - vals[0]) / vals[0] < 0.06)) continue;
    return {
      prompt: a + ' (' + m1 + ' kg) and ' + b + ' (' + m2 + ' kg) stand ' + fmt(r, 2) + ' m apart. Use F = G m\u2081m\u2082 \u00f7 r\u00b2 with G = 6.67 \u00d7 10<sup>\u221211</sup> N\u00b7m\u00b2/kg\u00b2. How big is the gravitational force between them?',
      right: s[0] + ' N',
      wrongs: [[s[1] + ' N', 'The distance must be squared: use r\u00b2, not r.'],
               [s[2] + ' N', 'This left out G. The tiny value of G makes gravity between people extremely small.'],
               [s[3] + ' N', 'The masses are multiplied (m\u2081 \u00d7 m\u2082), not added.']],
      explain: 'F = (6.67 \u00d7 10\u207b\u00b9\u00b9)(' + m1 + ')(' + m2 + ') \u00f7 (' + fmt(r, 2) + ')\u00b2 = ' + s[0] + ' N. Gravity between two people is tiny.', meta: { m1: m1, m2: m2, r: r }
    };
  }
  throw new Error('CH-T1');
});
T('CH-T2', 'chal', 80, 'Where g comes from', function () {
  const pl = pick([{ n: 'Earth', M: 5.98e24, R: 6.38e6 }, { n: 'Mars', M: 6.42e23, R: 3.39e6 }]);
  const g = _G * pl.M / (pl.R * pl.R);
  const fv = v => (v >= 0.01 && v < 1e4) ? fmt(v, 2) : sci(v, 2);
  const vals = [g, _G * pl.M / pl.R, pl.M / (pl.R * pl.R), _G * pl.R * pl.R / pl.M];
  return {
    prompt: 'For a 1.00 kg object on the surface of ' + pl.n + ' (mass ' + sci(pl.M, 3) + ' kg, radius ' + sci(pl.R, 3) + ' m), the force of gravity equals its weight. Which value of g do you get from g = G M \u00f7 R\u00b2?',
    right: fv(g) + ' m/s\u00b2',
    wrongs: [[fv(vals[1]) + ' m/s\u00b2', 'The radius must be squared in the formula.'],
             [fv(vals[2]) + ' m/s\u00b2', 'This left out G.'],
             [fv(vals[3]) + ' m/s\u00b2', 'This put R\u00b2 on top and M on the bottom. The mass of the planet goes on top.']],
    explain: 'g = G M \u00f7 R\u00b2 = (6.67 \u00d7 10\u207b\u00b9\u00b9)(' + sci(pl.M, 3) + ') \u00f7 (' + sci(pl.R, 3) + ')\u00b2 = ' + fv(g) + ' m/s\u00b2, which matches the g value in the table.', meta: { planet: pl.n, g: g }
  };
});
F('CH-F01', 'chal', 60, 'A skydiver reaches terminal velocity. What is true about the forces at that moment?', 'Air resistance equals the force of gravity, so the net force is zero',
  [['Gravity has stopped pulling on the skydiver', 'Gravity never stops. The air resistance has grown to match it.'],
   ['Air resistance is greater than gravity, so the skydiver is slowing', 'If air resistance were greater, the skydiver would slow down, not move at a constant speed.'],
   ['There is no air resistance at terminal velocity', 'Air resistance is exactly what balances gravity at terminal velocity.']],
  'Terminal velocity is the constant velocity reached when air resistance equals the force of gravity on a falling object.');
F('CH-F02', 'chal', 55, 'At terminal velocity, a falling object\u2019s acceleration is', 'zero',
  [['9.8 m/s\u00b2 downward', 'That is the acceleration of free fall. At terminal velocity the forces balance.'],
   ['9.8 m/s\u00b2 upward', 'The object is not accelerating upward.'],
   ['increasing', 'The net force is zero, so the acceleration is zero.']],
  'The net force is zero, so by Newton\u2019s second law the acceleration is zero. The speed is constant.');
F('CH-F03', 'chal', 60, 'A parachute with a bigger canopy has a slower terminal velocity. Why?', 'The bigger canopy has more air resistance at the same speed, so the forces balance at a lower speed',
  [['The bigger canopy is lighter', 'A bigger canopy does not reduce gravity. It increases air resistance.'],
   ['Gravity is weaker over a bigger area', 'Gravity does not depend on canopy size.'],
   ['The canopy removes air resistance', 'A canopy increases air resistance.']],
  'More surface area facing the air means more drag at any given speed, so drag equals weight sooner, at a lower speed.');
F('CH-F04', 'chal', 55, 'A skydiver jumps from a plane and falls until reaching terminal velocity. Which describes the speed over time?', 'It increases at first, then levels off',
  [['It stays constant from the start', 'At the start the skydiver is speeding up because gravity is greater than air resistance.'],
   ['It increases forever', 'Air resistance grows with speed until it balances gravity, so the speed stops increasing.'],
   ['It decreases the whole time', 'Gravity pulls the skydiver faster at the start, so the speed increases.']],
  'Drag grows as speed grows. When drag equals the weight, the speed levels off.');
F('CH-F05', 'chal', 55, 'What happens to the air resistance on a falling object as it speeds up?', 'It increases',
  [['It decreases', 'Faster motion through air means more air resistance.'],
   ['It stays zero', 'Air resistance exists whenever an object moves through air, and it grows with speed.'],
   ['It stays the same regardless of speed', 'Air resistance grows as the object speeds up.']],
  'Air resistance increases with speed, which is why a falling object eventually reaches terminal velocity.');
