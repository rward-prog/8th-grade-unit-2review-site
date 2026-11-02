'use strict';
/* ======================= UNIT DEFINITION =======================
   Everything unit-specific that is not a question. Another unit swaps this block and the question banks. */
const UNIT = {
  id: 'forces', grade: 8, codePrefix: 'G8F',
  title: 'Unit 2: Dynamics',
  subtitle: 'Forces, gravity, friction, and Newton\u2019s laws',
  minShow: 10,          // fewer attempts than this: "not enough data yet"
  minTrust: 20,         // about this many attempts and the score is mostly real data
  k: 20,                // prior weight in the difficulty blend
  topics: [
    { id: 'types', name: 'Types of forces', idea: 'A force is a push or pull measured in newtons (N). Applied, tension, normal, friction, and spring forces are contact forces. Gravity is the non-contact force.' },
    { id: 'fbd',   name: 'Free-body diagrams', idea: 'Draw the object as a dot. Draw one arrow per force, pointing the way the force acts ON the object. Label each arrow with the type and the source. Longer arrow = stronger force. Motion is not a force.' },
    { id: 'net',   name: 'Net force and balanced forces', idea: 'Net force is all the forces added together, with direction. Opposite directions subtract. Balanced forces make a net force of zero. Unbalanced forces change the motion.' },
    { id: 'grav',  name: 'Gravity', idea: 'Gravity is an attractive force between all objects with mass. More mass means more force. More distance means less force. The force on each object in a pair is the same size, but the effect depends on mass.' },
    { id: 'wgt',   name: 'Weight and mass', idea: 'Mass (kg) is the amount of matter and never changes. Weight (N) is the gravitational force: W = mg. Weight changes with the planet because g changes.' },
    { id: 'fall',  name: 'Free fall', idea: 'Free fall means gravity is the only force. Everything falls with the same acceleration g. Starting from rest, v = g \u00d7 t. Air resistance is why a feather and a hammer fall differently on Earth.' },
    { id: 'fric',  name: 'Friction', idea: 'Friction resists the motion of touching surfaces. Static friction matches your push up to a limit (\u03bcs \u00d7 weight). Once sliding, kinetic (sliding) friction stays constant (\u03bck \u00d7 weight).' },
    { id: 'n1',    name: 'Newton\u2019s 1st law and inertia', idea: 'If the net force is zero, the motion does not change. At rest stays at rest. Moving keeps the same speed and direction. Inertia is the tendency to resist a change in motion.' },
    { id: 'n2',    name: 'Newton\u2019s 2nd law', idea: 'a = F \u00f7 m, where F is the NET force. Acceleration points the same way as the net force. 1 N = 1 kg\u00b7m/s\u00b2.' },
    { id: 'n3',    name: 'Newton\u2019s 3rd law', idea: 'When object A pushes on object B, B pushes back on A with the same size force in the opposite direction. The two forces act on DIFFERENT objects, so they never cancel.' }
  ],
  chal: { id: 'chal', name: 'Challenge', idea: 'This goes beyond the test, but it\u2019s good to know!' },
  quizzes: [
    { id: 'q1', name: 'Quiz 1: Forces and free-body diagrams', topics: ['types', 'fbd', 'net'] },
    { id: 'q2', name: 'Quiz 2: Gravity', topics: ['grav'] },
    { id: 'q3', name: 'Quiz 3: Weight, mass, and free fall', topics: ['wgt', 'fall'] },
    { id: 'q4', name: 'Quiz 4: Friction', topics: ['fric'] },
    { id: 'q5', name: 'Quiz 5: Newton\u2019s laws', topics: ['n1', 'n2', 'n3'] }
  ]
};
UNIT.topicById = {}; UNIT.topics.forEach(t => UNIT.topicById[t.id] = t); UNIT.topicById.chal = UNIT.chal;

/* g values shown to students (Earth shows 9.8; 9.81 is accepted because Earth answers are built to match at 2 sig figs) */
const PLANETS = {
  Earth: 9.8, Moon: 1.62, Mars: 3.7, Jupiter: 23.1, Saturn: 9.0
};

