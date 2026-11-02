# Unit review site (one engine, many units)

The engine is written once. A **unit** is a folder of data files under `units/`. Grade 8, Unit 2 (forces and Newton's laws) is the first one.

## What students get
- **What are you studying for?** A homework quiz, topics they pick, the whole unit test, or Challenge.
- Pre-check, study plan, adaptive practice, and a post-check with a growth view.
- 3 hints, "Show me how," skip, confidence ratings, and a "why that's not it" note on every wrong choice.
- Study notes, test tips, ungraded written-response practice, and a public Class Insights page.
- A save-and-restore code so progress moves between computers. No accounts.

## Folder map
```
engine/            written once, shared by every unit
  01-core.js         random helpers, number formatting, free-body diagram drawing
  02-qapi.js         F(...) fixed question, T(...) skill with fresh numbers, makeQuestion()
  40-engine.js       student state, class counters, difficulty score, question picker
  50-codes.js        versioned save-and-restore code
  90-ui.js           every screen
  style.css, template.html
rosters/grade8.js  the ONLY place names live (first names, one grade per file)
units/8-forces/    one unit = these files
  00-unit.js         title, topics, homework-quiz groupings, planet g values
  1x-bank-*.js       the questions
  20-content.js      study notes, test tips, written-response practice
  registry.lock.json permanent list of every question/skill ID (append-only)
tests/             automated checks
dist/8/forces/     the built one-file site (this is what gets deployed)
firebase.rules.json  security rules for the anonymous class counters
```

## Rules that keep things safe
1. **IDs are permanent.** Never rename, renumber, or reuse a question ID. `build.py` refuses to build if an ID in `registry.lock.json` disappears. New IDs are appended.
2. **Save codes are versioned.** Never change how an already-issued code is read. If the layout must change, add version 2 beside version 1 in `engine/50-codes.js`.
3. **Every graded question** has exactly 4 choices and an explanation on every wrong choice.
4. **Privacy.** First names only. No last names, emails, phone numbers, addresses, or images of students. The only image allowed is the one photo of Murphy the dog (`engine/05-murphy.js`), which the teacher supplied; the privacy scan accepts exactly that image and fails on any other. Run `node tests/test_privacy.js` before every release.
5. The class counters store only `attempts` and `misses` per question or skill. No student identifier is ever stored or sent.
6. **Earth's g:** the site shows 9.8. Questions that use Earth's g are built so 9.8 and 9.81 give the same displayed answer, and the tests check it.

## Build and test
```
python3 build.py units/8-forces
node tests/test_bank.js        # every question: 4 choices, one key, answers recomputed independently
node tests/test_codes.js       # save-code round trips, typos, wrong unit
node tests/test_privacy.js     # privacy scan of every file
ORIGINALS=/path/to/your/originals node tests/test_duplicates.js   # compare with your own tests (keep those OFF this repo)
python3 tests/e2e.py           # browser click-through (needs Playwright)
```

## Connecting the class counters
1. In `engine/40-engine.js`, set `FIREBASE_URL` to the Realtime Database URL.
2. Merge the `review` section of `firebase.rules.json` into the existing database rules (do not overwrite rules for other projects) and test them in the Rules Playground.
3. Rebuild and deploy. Until then the site runs in test mode: Insights counts this device only.

## Adding the next unit
1. Copy `units/8-forces/` to `units/<grade>-<name>/`, change `00-unit.js`, write the bank files, and add the notes.
2. Make sure `rosters/grade<N>.js` exists for that grade (first names only).
3. `python3 build.py units/<grade>-<name>` writes `dist/<grade>/<id>/index.html`.
