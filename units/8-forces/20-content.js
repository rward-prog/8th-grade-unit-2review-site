'use strict';
/* ======================= STUDY NOTES (vocabulary matches the unit notes) ======================= */
const NOTES = {
  types: [
    'A <b>force</b> is a push or pull on an object that comes from its interaction with another object. Forces are measured in <b>newtons (N)</b>. One newton gives 1 kg an acceleration of 1 m/s\u00b2.',
    '<b>Applied force (F<sub>app</sub>)</b>: a contact force involving direct pushing or pulling.',
    '<b>Tension force (F<sub>T</sub>)</b>: a contact force involving pulling, such as a rope, string, or chain.',
    '<b>Normal force (F<sub>N</sub>)</b>: a contact force involving the support of an object, such as a table under a book.',
    '<b>Frictional force (F<sub>Fr</sub>)</b>: a contact force that slows down motion.',
    '<b>Spring force (F<sub>spring</sub>)</b>: a contact force from compressing or stretching a spring.',
    '<b>Gravitational force (F<sub>g</sub>)</b>: the <b>non-contact</b> force of attraction between two objects with mass. It is the one force on this list that acts without touching.',
    'A force that <b>acts at a distance</b> works <b>without contact</b>. Gravity does. Applied, tension, normal, friction, and spring forces all need contact.',
    '<b>Dynamics</b> is the study of <b>why</b> objects move: the forces that change motion. (Kinematics describes <b>how</b> they move.)'
  ],
  fbd: [
    'A free-body diagram shows every force acting on one object.',
    '1. Identify the object of interest. If there are several objects, draw one diagram for each.',
    '2. Identify all forces acting directly on the object, and the object exerting each one.',
    '3. Draw a dot or box for the object.',
    '4. Draw an arrow for each force, pointing in the direction the force acts <b>on</b> the object. Label each arrow with the type of force and its source. A longer arrow means a stronger force.',
    '<b>Common slips:</b> drawing a \u201cforce of motion\u201d (motion is not a force), leaving out the normal force or gravity, and drawing friction in the same direction as the motion. After something leaves your hand, there is no applied force anymore.'
  ],
  net: [
    'The <b>net force</b> is the combination of all the forces acting on an object.',
    '<b>Same direction:</b> add the forces. 200 N + 100 N = 300 N in that direction.',
    '<b>Opposite directions:</b> pick a reference direction. Forces that point that way are positive and forces that point the other way are negative. Add them: 200 N + (\u2212100 N) = 100 N.',
    '<b>Balanced forces</b> combine to make a net force of zero. They do not change the motion.',
    '<b>Unbalanced forces</b> combine to make a net force that is not zero. They change the velocity: the speed, the direction, or both.',
    '<b>Watch out:</b> a speed of zero does not mean a net force of zero. A ball thrown straight up stops for an instant at the top, but gravity still pulls on it, so the net force is its weight, downward.'
  ],
  grav: [
    '<b>Gravity</b> is an attractive force that exists between all objects that have mass. <b>Mass</b> is the amount of matter in an object.',
    'If the mass increases, the force of gravity increases. If the distance between the objects increases, the force of gravity decreases.',
    '<b>Newton\u2019s law of universal gravitation:</b> F<sub>G</sub> = G m<sub>1</sub>m<sub>2</sub> \u00f7 r\u00b2. The force is proportional to the product of the masses and inversely proportional to the square of the distance. Doubling the distance makes the force one-fourth as big.',
    '<b>Same force, different effect:</b> the gravitational force between two objects is the SAME on each, but the effect (acceleration) depends on mass. Earth pulls on you and you pull on Earth with equal force, but Earth\u2019s huge mass means it barely accelerates.'
  ],
  wgt: [
    '<b>Mass</b> (kg) is the amount of matter in an object. It is the same everywhere.',
    '<b>Weight</b> (N) is the gravitational force exerted on an object: <b>W = F<sub>g</sub> = mg</b>.',
    '<b>g</b> is the acceleration due to gravity. It is different on each planet, so weight changes with location. Earth 9.8 m/s\u00b2 (9.81 is also fine), Moon 1.62, Mars 3.7, Jupiter 23.1, Saturn 9.0.',
    '<b>Use the g for the place where the weight is measured.</b> To find a mass from a weight, divide by that place\u2019s g. Then use the mass, which does not change, to find the weight somewhere else.'
  ],
  fall: [
    '<b>Free fall:</b> if no other forces act on an object, it falls at the g value for its location. On Earth, that is about 9.8 m/s\u00b2. Without significant air resistance, objects dropped from the same height at the same time land at the same time.',
    'For an object dropped from rest: <b>v = g \u00d7 t</b>. In general, v<sub>2</sub> = v<sub>1</sub> + (g \u00d7 t).',
    'A falling book is a good example of free fall. A flat sheet of paper is not, because air resistance is large compared with its weight.',
    'On the Moon there is no air, so a hammer and a feather dropped together hit the ground at the same time.'
  ],
  fric: [
    '<b>Friction</b> is a force that acts between two solid surfaces when we try to move an object. It generally impedes motion. It acts parallel to the surface, perpendicular to the normal force.',
    '<b>Static friction</b> makes it difficult to start moving an object. It grows to match the applied force until the object finally starts to move. The push must be greater than the maximum static friction: F<sub>Fr</sub> \u2264 \u03bc<sub>s</sub>W.',
    '<b>Kinetic (sliding) friction</b> acts on a moving object. It does not change in value once the object is moving: F<sub>Fr</sub> = \u03bc<sub>k</sub>W. If you stop pushing, it slows the object to a stop.',
    '<b>\u03bc</b> is the coefficient of friction. A bigger \u03bc means more friction. \u03bc<sub>s</sub> is larger than \u03bc<sub>k</sub>, which is why starting takes more force than keeping going.',
    '<b>Fluid friction</b> is friction between a surface and a fluid such as air or water. Air resistance is an example. More surface area facing the fluid means more fluid friction. Lubricants like oil or soap reduce friction.'
  ],
  n1: [
    '<b>Newton\u2019s first law:</b> if the net force on an object is zero, the motion of the object does not change. At rest stays at rest. Moving keeps the same speed and direction.',
    '<b>Inertia</b> is the tendency of an object to resist a change in its motion. More mass means more inertia.',
    'Objects stop moving because friction or another force acts on them. With no friction, a moving object would keep going at the same speed in the same direction.',
    'When a car stops suddenly, a passenger keeps moving forward because of inertia.',
    '<b>Words that mean \u201cnot changing\u201d:</b> constant, uniform, and steady. Constant velocity means no acceleration, so the net force is zero, the same as for an object at rest.'
  ],
  n2: [
    '<b>Newton\u2019s second law:</b> the acceleration of an object is equal to the net force acting on it divided by its mass. <b>a = F \u00f7 m</b>.',
    'The acceleration points in the same direction as the net force.',
    '1 newton = 1 kg\u00b7m/s\u00b2.',
    'Use the NET force, not just one of the forces. Double the net force and the acceleration doubles. Double the mass and the acceleration is cut in half.'
  ],
  n3: [
    '<b>Newton\u2019s third law:</b> when one object exerts a force on a second object, the second object exerts a force of the same size but in the opposite direction on the first object.',
    'A <b>force pair</b> is the forces two objects apply to each other. One is the action force and the other is the reaction force.',
    'Force pairs do <b>not</b> cancel because each force acts on a <b>different object</b>.',
    'Examples: a swimmer pushes the water back and the water pushes the swimmer forward. A jumper pushes down on the ground and the ground pushes up. A rocket pushes gas down and the gas pushes the rocket up.'
  ],
  chal: [
    '<b>Terminal velocity</b> is the constant velocity reached when air resistance (drag) equals the force of gravity on a falling object. At that point the net force is 0 N, so the acceleration is 0 m/s\u00b2.',
    'A bigger canopy has more drag at the same speed, so a parachute reaches a slower terminal velocity.',
    'The universal gravitation formula F = G m\u2081m\u2082 \u00f7 r\u00b2 uses G = 6.67 \u00d7 10<sup>\u221211</sup> N\u00b7m\u00b2/kg\u00b2. Putting in Earth\u2019s mass and radius gives g = 9.8 m/s\u00b2.'
  ]
};

/* ======================= TEST TIPS ======================= */
const TIPS = [
  ['Read the whole question first', 'Underline what it asks for. A question about weight and a question about mass can look almost the same.'],
  ['Cover the choices, then try to answer', 'Make your own answer before you look at the options. It keeps tempting wrong choices from steering you.'],
  ['Eliminate what you know is wrong', 'Crossing out two choices turns a guess into a 50-50. Wrong choices often fall into patterns: the wrong operation, the wrong direction, or the wrong planet.'],
  ['Sketch a free-body diagram', 'For any question about forces, draw the dot and the arrows on scrap paper. Check each arrow: is something touching or pulling the object that way?'],
  ['Watch for the \u201cforce of motion\u201d trap', 'Motion is not a force. If an arrow only describes where the object is going, it does not belong.'],
  ['Check units and what the answer should be', 'Weight is in N, mass is in kg, g is in m/s\u00b2. Does the answer make sense? Things weigh less on the Moon than on Earth.'],
  ['Which g?', 'Use the g for the planet in the question. To go from a weight to a mass, divide by THAT planet\u2019s g. Then use the mass for any other planet.'],
  ['Net force means add with direction', 'Pick a reference direction. Forces in opposite directions subtract. Equal and opposite means net force zero.'],
  ['Same force does not mean same effect', 'In a force pair the forces are equal. The accelerations are different when the masses are different.'],
  ['Change an answer only for a reason', 'Your first idea is often right. Change it only if you find a specific mistake.'],
  ['Decode the wording', 'Constant, uniform, and steady all mean \u201cnot changing.\u201d Constant velocity means zero acceleration and a net force of zero. \u201cNeglecting\u201d or \u201cignoring\u201d air resistance means gravity is the only force. \u201cSimultaneously\u201d means at the same time. \u201cFree fall\u201d means only gravity acts. \u201cAt a distance\u201d means without contact.'],
  ['Zero speed is not zero force', 'At the top of a throw an object stops for an instant, but gravity is still pulling. Net force depends on the forces, not on the speed.'],
  ['Look for \u201cChoices A and B\u201d', 'When one choice says \u201cChoices A and B,\u201d check A and B separately. If both fit, that choice is the best answer. If only one fits, it is not.'],
  ['Use your confidence', 'If you were sure and still missed it, slow down: that is a misunderstanding worth fixing, not a typo.']
];

/* ======================= WRITTEN-RESPONSE PRACTICE (ungraded) ======================= */
const WRITTEN = [
  { title: 'Why doesn\u2019t Earth move?',
    prompt: 'Drew lifts a 0.5 kg textbook off a desk. Earth pulls down on the book with a force of 4.9 N. Does the book pull on Earth? Explain why Drew never sees or feels Earth move.',
    approaches: ['Start with Newton\u2019s third law: forces come in pairs.', 'Use a = F \u00f7 m for Earth and compare the mass of Earth to the mass of the book.'],
    sample: 'Yes. The book pulls up on Earth with a force of 4.9 N, the same size as Earth\u2019s pull on the book, but in the opposite direction. Even though the forces are equal, the effects are different. Acceleration equals force divided by mass, and Earth\u2019s mass is enormous, so a 4.9 N force gives Earth an acceleration that is basically zero. That is why nobody sees Earth move.',
    why: ['It answers the yes/no part first.', 'It names the equal and opposite forces.', 'It connects to a = F \u00f7 m and explains the effect, not just the force.'] },
  { title: 'Hammer and paper on the Moon',
    prompt: 'On the Moon, an astronaut drops a wrench and a sheet of paper from the same height at the same time. Predict what happens and explain it using forces.',
    approaches: ['Say what forces act on each object on the Moon.', 'Explain what air resistance does and whether the Moon has any.'],
    sample: 'They land at the same time. The Moon has no air, so there is no air resistance. The only force on each object is gravity, which is free fall, and gravity gives every object the same acceleration, 1.62 m/s\u00b2. The wrench weighs more, but it also has more mass, so the acceleration is the same.',
    why: ['It makes a clear prediction.', 'It names the force that is missing (air resistance) and the one that is left (gravity).', 'It explains why weight does not change the acceleration.'] },
  { title: 'Action-reaction pairs when kicking',
    prompt: 'Describe two action-reaction pairs when a player kicks a soccer ball.',
    approaches: ['Name the two objects in each pair.', 'State the direction of each force and say they are the same size.'],
    sample: 'Pair 1: the foot pushes forward on the ball, and the ball pushes backward on the foot with a force of the same size. Pair 2: the foot pushes down on the ground when the player plants it, and the ground pushes up on the foot. In each pair the forces are equal and opposite and act on different objects.',
    why: ['Each pair names two objects and both directions.', 'It says the forces are equal in size.', 'It notes they act on different objects.'] },
  { title: 'Pushing off the pool wall',
    prompt: 'A swimmer pushes off the wall to start a lap. Explain how this shows Newton\u2019s third law of motion.',
    approaches: ['Identify the action force and its direction.', 'Identify the reaction force and what it does to the swimmer.'],
    sample: 'The swimmer pushes backward on the wall, which is the action force. By Newton\u2019s third law, the wall pushes forward on the swimmer with a force of the same size in the opposite direction. This reaction force acts on the swimmer, so the net force is forward and the swimmer accelerates away from the wall.',
    why: ['Action and reaction are both stated with directions.', 'It points out which object each force acts on.', 'It links the reaction force to the swimmer\u2019s acceleration.'] },
  { title: 'What do the arrows say about speed?',
    prompt: 'A sled slides to the right. Its free-body diagram has a 3-unit arrow to the right (applied) and a 3-unit arrow to the left (friction). The up and down arrows are equal. What is happening to the sled\u2019s speed? How do you know from the arrows?',
    approaches: ['Compare the two horizontal arrows.', 'Say what the net force is and use Newton\u2019s first law.'],
    sample: 'The sled\u2019s speed is staying constant. The arrow to the right and the arrow to the left are the same length, so the forces are balanced and the net force is zero. By Newton\u2019s first law, a moving object with no net force keeps moving at the same speed in the same direction.',
    why: ['It answers with a clear claim.', 'It cites evidence from the arrows.', 'It names the law that supports the claim.'] },
  { title: 'Starting vs. keeping it moving',
    prompt: 'It takes a big push to start sliding a heavy bookcase, but a smaller push keeps it sliding. Explain why using static and kinetic friction.',
    approaches: ['Say which kind of friction acts before and after it starts moving.', 'Compare the sizes of the two kinds of friction.'],
    sample: 'Before the bookcase moves, static friction acts. It grows to match your push until it reaches its limit, so you must push harder than that limit to start the motion. After it starts sliding, kinetic friction acts. Kinetic friction is smaller than the maximum static friction, so a smaller push can keep the bookcase moving.',
    why: ['It names both kinds of friction and when each one acts.', 'It compares their sizes.', 'It explains the push needed in each case.'] },
  { title: 'Falling sloth: could it be on Earth?',
    prompt: 'A sloth with a mass of 4.0 kg has 36 N of gravitational force acting on it as it falls. Ignoring air resistance, determine its acceleration. Could the sloth be falling on Earth? Briefly explain. Then explain how a parachute would change the acceleration.',
    approaches: ['Use a = F \u00f7 m and show units.', 'Compare your answer with g on Earth (9.8 m/s\u00b2).', 'For the parachute, think about which forces act and what the net force becomes.'],
    sample: 'a = F \u00f7 m = 36 N \u00f7 4.0 kg = 9.0 m/s\u00b2. No, the sloth is not falling on Earth, because the acceleration due to gravity on Earth is 9.8 m/s\u00b2, which is different from 9.0 m/s\u00b2. With a parachute there is an upward air resistance force, so the net force is smaller than the gravitational force. By Newton\u2019s second law the acceleration would be smaller than 9.0 m/s\u00b2.',
    why: ['It shows the formula, the substitution, and the unit.', 'It compares the answer with a known value before deciding.', 'It explains the parachute using net force and the second law.'] },
  { title: 'Static or kinetic friction? Fill in the table',
    prompt: 'A 30 kg crate sits on the floor. \u03bcs = 0.50 and \u03bck = 0.30 (use g = 9.8 m/s\u00b2). For horizontal pushes of 90 N, 160 N, and 300 N, give the type and size of the friction force.',
    approaches: ['Find the weight first, then the maximum static friction.', 'Compare each push with the maximum static friction.', 'If it slides, use the kinetic friction formula.'],
    sample: 'W = mg = 30 \u00d7 9.8 = 294 N. Maximum static friction = \u03bcs W = 0.50 \u00d7 294 = 147 N. 90 N: less than 147 N, so the crate does not move. Static friction, 90 N. 160 N: more than 147 N, so the crate slides. Kinetic friction = \u03bck W = 0.30 \u00d7 294 = 88 N. 300 N: it slides, so kinetic friction, 88 N again.',
    why: ['It finds the weight before using the friction formulas.', 'It compares each push with the maximum static friction.', 'It notes that kinetic friction is the same for 160 N and 300 N.'] },
  { title: 'The bus stops suddenly',
    prompt: 'A bus brakes quickly and the standing passengers lurch forward. Explain why using Newton\u2019s first law and inertia.',
    approaches: ['Say what force acts on the bus and what force acts on the passengers.', 'Define inertia in your answer.'],
    sample: 'The brakes and road exert an unbalanced force on the bus, so the bus slows down. The passengers are not attached to the bus, so no unbalanced force acts on them right away. Because of inertia, they tend to keep moving forward at the same speed, so they lurch forward as the bus slows underneath them.',
    why: ['It separates what happens to the bus from what happens to the passengers.', 'It uses the word inertia correctly.', 'It connects to Newton\u2019s first law.'] },
  { title: 'Mass vs. weight on Mars',
    prompt: 'An astronaut travels from Earth to Mars. What happens to her mass and her weight? Explain.',
    approaches: ['Define mass and weight.', 'Use W = mg with the g of each planet.'],
    sample: 'Her mass stays the same because mass is the amount of matter in her. Her weight gets smaller because weight is the gravitational force, W = mg, and g on Mars (3.7 m/s\u00b2) is smaller than g on Earth (9.8 m/s\u00b2). The same mass multiplied by a smaller g gives a smaller weight.',
    why: ['It defines both quantities.', 'It uses the equation with real values.', 'It states what changes and what does not.'] }
];
