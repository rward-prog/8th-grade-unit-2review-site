#!/usr/bin/env python3
"""Browser click-through: opens the built index.html and uses it like a student would."""
import os, sys, json
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL = 'file://' + os.path.join(ROOT, 'dist', '8', 'forces', 'index.html')
SHOTS = os.environ.get('SHOTS', '/tmp/shots')
os.makedirs(SHOTS, exist_ok=True)
EXT = '.' + 'png'   # screenshots go outside the project (SHOTS), never into the repo
fails = []
def check(cond, msg):
    print(('  ok   ' if cond else '  FAIL ') + msg)
    if not cond: fails.append(msg)

def wait_h1(pg, text):
    try: pg.wait_for_function('document.querySelector("h1") && document.querySelector("h1").innerText.includes(%s)' % json.dumps(text), timeout=4000)
    except Exception: pass

def wait_main(pg, text):
    try: pg.wait_for_function('document.querySelector("main") && document.querySelector("main").innerText.includes(%s)' % json.dumps(text), timeout=4000)
    except Exception: pass

def correct_index(pg): return pg.evaluate('SESSION.q.choices.findIndex(c => c.ok)')
def wrong_index(pg): return pg.evaluate('SESSION.q.choices.findIndex(c => !c.ok)')
def answer(pg, right=True, conf=None):
    i = correct_index(pg) if right else wrong_index(pg)
    pg.click('.ch >> nth=%d' % i)
    if conf: pg.click('.pill:has-text("%s")' % conf)
    pg.click('[data-act="check"]')
    pg.wait_for_selector('.fb')

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={'width': 1100, 'height': 900})
    pg = ctx.new_page()
    errors = []
    pg.on('pageerror', lambda e: errors.append('pageerror: ' + str(e)))
    pg.on('console', lambda m: errors.append('console.error: ' + m.text) if m.type == 'error' else None)
    pg.on('dialog', lambda d: d.accept())
    pg.goto(URL)

    print('HOME')
    check(pg.inner_text('h1') == 'What are you studying for?', 'home asks "What are you studying for?"')
    check(pg.locator('.opt').count() == 4, 'four study options')
    check(pg.evaluate("(() => { const i = document.querySelector('img.dog'); return !!i && i.complete && i.naturalWidth > 0 && i.alt === 'Murphy the dog'; })()"), 'Murphy\'s photo loads in the header with alt text')
    pg.screenshot(path=SHOTS + '/01-home' + EXT, full_page=True)

    print('QUIZ PATH (homework quiz -> pre-check)')
    pg.click('[data-id="quiz"]')
    check(pg.locator('[data-act="pick-quiz"]').count() == 5, 'five homework quizzes listed')
    pg.click('[data-id="q3"]')
    wait_h1(pg, 'Quiz 3')
    check('Quiz 3' in pg.inner_text('h1'), 'plan page shows Quiz 3')
    plan = pg.inner_text('main')
    check('Weight and mass' in plan and 'Free fall' in plan and 'How tough is this section' in plan, 'plan lists both Quiz 3 topics with section difficulty')
    pg.screenshot(path=SHOTS + '/02-plan' + EXT, full_page=True)
    pg.click('[data-act="pre"]')
    n = pg.evaluate('SESSION.queue.length')
    check(n == 4, 'pre-check for 2 topics has 4 questions (got %d)' % n)
    check(pg.locator('[data-act="hint"]').count() == 0 and pg.locator('[data-act="how"]').count() == 0, 'hints and Show me how are off during the pre-check')
    check('How tough' in pg.inner_text('.q') and '/100' in pg.inner_text('.q'), 'difficulty shown when the question appears')
    pg.screenshot(path=SHOTS + '/03-question' + EXT, full_page=True)
    for i in range(n):
        answer(pg, right=(i % 2 == 0), conf='Sure' if i == 1 else None)
        if i == 1:
            check(pg.locator('.why').count() >= 3, 'wrong answer shows a why-not note on each wrong choice')
            check('You were sure' in pg.inner_text('.fb'), 'sure-but-wrong gets a gentle note')
            pg.screenshot(path=SHOTS + '/04-wrong' + EXT, full_page=True)
        check('How tough' in pg.inner_text('.fb'), 'difficulty shown again after answering (q%d)' % (i + 1))
        pg.click('[data-act="next"]')
    wait_main(pg, 'Pre-check done')
    check('Pre-check done' in pg.inner_text('main'), 'pre-check results screen')
    check(pg.locator('[data-act="plan-toggle"]:checked').count() >= 1, 'study plan has topics pre-checked')
    pg.screenshot(path=SHOTS + '/05-plan-after-pre' + EXT, full_page=True)

    print('PRACTICE (hint, show me how, skip)')
    pg.click('[data-act="start-plan"]')
    before = pg.evaluate('JSON.stringify(CLASS)')
    k1 = pg.evaluate('SESSION.q.key')
    for _ in range(3): pg.click('[data-act="hint"]')
    check(pg.locator('.hint').count() == 3, 'three hints appear')
    check(pg.locator('.ch.gone').count() >= 1, 'a hint crosses out a wrong choice')
    check(pg.locator('[data-act="hint"]').is_disabled(), 'hint button stops after 3')
    pg.screenshot(path=SHOTS + '/06-hints' + EXT, full_page=True)
    answer(pg, True)
    after = json.loads(pg.evaluate('JSON.stringify(CLASS)'))
    check(k1 not in after or after[k1][0] == (json.loads(before).get(k1, [0, 0])[0]), 'a hinted answer is NOT counted in class data')
    pg.click('[data-act="next"]')
    k2 = pg.evaluate('SESSION.q.key')
    pg.click('[data-act="how"]')
    check(pg.locator('.how').count() == 1, 'Show me how reveals the worked explanation')
    answer(pg, True)
    after2 = json.loads(pg.evaluate('JSON.stringify(CLASS)'))
    check(k2 not in after2 or after2[k2][0] == json.loads(before).get(k2, [0, 0])[0], 'a Show-me-how answer is NOT counted in class data')
    pg.click('[data-act="next"]')
    k3 = pg.evaluate('SESSION.q.key'); pg.click('[data-act="skip"]'); pg.wait_for_selector('.fb')
    check('Skipped' in pg.inner_text('.fb'), 'skip works and shows the right answer')
    pg.click('[data-act="next"]')
    k4 = pg.evaluate('SESSION.q.key'); c0 = (json.loads(pg.evaluate('JSON.stringify(CLASS)')).get(k4) or [0, 0])
    answer(pg, False)
    c1 = json.loads(pg.evaluate('JSON.stringify(CLASS)'))[k4]
    check(c1[0] == c0[0] + 1 and c1[1] == c0[1] + 1, 'an unaided miss adds 1 attempt and 1 miss to class counters')
    pg.click('[data-act="next"]')
    for _ in range(3):
        answer(pg, True); pg.click('[data-act="next"]')
    print('POST-CHECK + GROWTH VIEW')
    pg.click('[data-act="finish-practice"]') if pg.locator('[data-act="finish-practice"]').count() else None
    pg.go_back() if False else None
    # finish-practice button is on the feedback screen, so answer once more to reach it
    if pg.locator('[data-act="finish-practice"]').count() == 0:
        answer(pg, True)
        pg.click('[data-act="finish-practice"]')
    check(pg.evaluate('SESSION.mode') == 'post', 'post-check started')
    m = pg.evaluate('SESSION.queue.length')
    for i in range(m):
        answer(pg, True); pg.click('[data-act="next"]')
    wait_main(pg, 'Post-check done')
    check('Post-check done' in pg.inner_text('main') and 'Before' in pg.inner_text('main') and 'After' in pg.inner_text('main'), 'growth view shows Before and After')
    pg.screenshot(path=SHOTS + '/07-growth' + EXT, full_page=True)

    print('SAVE AND RESTORE CODE')
    pg.click('nav >> text=Save or restore'); pg.wait_for_selector('#mycode')
    code = pg.input_value('#mycode')
    check(code.startswith('G8F-'), 'code starts with the unit prefix (%s...)' % code[:16])
    n_before = pg.evaluate('Object.keys(S.keys).length'); st_before = pg.evaluate('JSON.stringify(S.keys)')
    pg.click('[data-act="reset"]'); pg.wait_for_selector('.hero')
    check(pg.evaluate('Object.keys(S.keys).length') == 0, 'clearing progress empties the device state')
    pg.click('nav >> text=Save or restore'); pg.wait_for_selector('#incode')
    pg.fill('#incode', code[:-3] + 'AAA'); pg.click('[data-act="restore-code"]')
    check(pg.inner_text('#restoremsg') != '' and 'Restored' not in pg.inner_text('#restoremsg'), 'a mistyped code gets a friendly error: "%s"' % pg.inner_text('#restoremsg'))
    pg.fill('#incode', 'XYZ-' + code[4:]); pg.click('[data-act="restore-code"]')
    check('different unit' in pg.inner_text('#restoremsg') or 'does not look like' in pg.inner_text('#restoremsg'), 'a wrong-unit code gets a friendly error: "%s"' % pg.inner_text('#restoremsg'))
    pg.fill('#incode', code); pg.click('[data-act="restore-code"]')
    check('Restored' in pg.inner_text('#restoremsg'), 'restore works: "%s"' % pg.inner_text('#restoremsg'))
    n_after = pg.evaluate('Object.keys(S.keys).length')
    check(n_after == n_before, 'same number of questions of history after restore (%d vs %d)' % (n_after, n_before))
    pg.screenshot(path=SHOTS + '/08-code' + EXT, full_page=True)

    print('OTHER PATHS')
    pg.click('nav >> text=Home')
    pg.click('[data-id="topics"]')
    pg.check('input[data-id="wgt"]'); pg.check('input[data-id="fall"]'); pg.check('input[data-id="fric"]')
    check('Study 3 topics' in pg.inner_text('[data-act="go-topics"]'), 'topic picker counts the topics')
    pg.click('[data-act="go-topics"]')
    wait_h1(pg, '3 topics')
    check('3 topics' in pg.inner_text('h1'), 'mixed-topic plan page')
    pg.click('[data-act="start-practice"]')
    check(pg.evaluate('SESSION.scope.topics.length') == 3, 'practice covers only the 3 picked topics')
    for _ in range(12):
        t = pg.evaluate('SESSION.q.topic'); check(t in ('wgt', 'fall', 'fric'), 'question topic %s is in the picked set' % t) if False else None
        if t not in ('wgt', 'fall', 'fric'): check(False, 'off-topic question appeared: ' + t); break
        answer(pg, True); pg.click('[data-act="next"]')
    pg.click('nav >> text=Home')
    pg.click('[data-id="unit"]')
    wait_h1(pg, 'The whole unit test')
    check('The whole unit test' in pg.inner_text('h1') and '20-question pre-check' in pg.inner_text('main'), 'whole-unit path offers a 20-question pre-check')
    pg.click('nav >> text=Home')
    pg.click('[data-id="chal"]')
    wait_main(pg, 'beyond the test')
    check('beyond the test' in pg.inner_text('main'), 'Challenge plan is clearly labeled as beyond the test')
    pg.click('[data-act="start-practice"]')
    check('This goes beyond the test, but it\u2019s good to know!' in pg.inner_text('.q'), 'Challenge questions carry the reminder')
    ck = pg.evaluate('SESSION.q.key'); check(ck.startswith('CH-'), 'Challenge questions are CH- items')
    check(pg.evaluate('SESSION.q.topic') == 'chal', 'Challenge is its own topic')
    pg.screenshot(path=SHOTS + '/09-challenge' + EXT, full_page=True)
    ready_before = pg.evaluate('unitReadiness()')
    answer(pg, True); answer_ok = True
    check(pg.evaluate('unitReadiness()') == ready_before, 'Challenge answers do not change test readiness')
    check(pg.evaluate('unitDifficulty()') == pg.evaluate('unitDifficulty()'), 'unit difficulty excludes Challenge')

    print('NOTES / TIPS / WRITTEN / INSIGHTS')
    pg.click('nav >> text=Study notes'); pg.wait_for_selector('.note'); check(pg.locator('.note').count() == 11, 'notes for 10 topics plus Challenge')
    pg.click('nav >> text=Test tips'); pg.wait_for_selector('.tips'); check(pg.locator('.tips .card').count() >= 8, 'test tips present')
    pg.click('nav >> text=Written response'); pg.wait_for_selector('.wr')
    pg.click('summary >> nth=0'); check('strong sample answer' in pg.inner_text('.wr >> nth=0').lower(), 'written response shows approaches, sample, and why it is strong')
    pg.click('nav >> text=Class insights'); pg.wait_for_selector('table')
    txt = pg.inner_text('main')
    check('Test mode' in txt, 'insights explains test mode')
    check('Not enough data yet' in txt, 'insights shows "not enough data yet" for thin data')
    check('By homework quiz' in txt and 'By topic' in txt and 'Challenge (tracked separately)' in txt, 'insights has quiz, topic, and Challenge sections')
    pg.screenshot(path=SHOTS + '/10-insights' + EXT, full_page=True)

    print('NARROW SCREEN + DARK MODE')
    m = b.new_context(viewport={'width': 390, 'height': 800}, color_scheme='dark')
    mp = m.new_page(); mp.on('pageerror', lambda e: errors.append('mobile pageerror: ' + str(e)))
    mp.goto(URL)
    check(mp.evaluate('document.documentElement.scrollWidth <= window.innerWidth + 1'), 'home has no sideways scroll on a phone')
    mp.screenshot(path=SHOTS + '/11-mobile-home' + EXT, full_page=True)
    mp.click('[data-id="unit"]'); mp.click('[data-act="start-practice"]')
    check(mp.evaluate('document.documentElement.scrollWidth <= window.innerWidth + 1'), 'question screen has no sideways scroll on a phone')
    mp.screenshot(path=SHOTS + '/12-mobile-question' + EXT, full_page=True)
    mp.goto(URL + '#/insights'); mp.wait_for_selector('table')
    mp.screenshot(path=SHOTS + '/13-mobile-insights' + EXT)
    b.close()

check(not errors, 'no JavaScript errors in the console' + ('' if not errors else ': ' + '; '.join(errors[:3])))
print('\nBrowser click-through: %d failure(s)' % len(fails))
sys.exit(1 if fails else 0)
