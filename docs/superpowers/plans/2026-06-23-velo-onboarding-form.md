# Velo Onboarding Form — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 12-step, one-question-per-page onboarding form for the fictional SaaS "Velo" as a static HTML/CSS/JS site openable directly in a browser.

**Architecture:** A single `index.html` holds all step `<section>` divs; `style.css` owns every visual token, layout rule, and animation keyframe; `script.js` runs the step controller, maintains a shared `state` object, handles validation, and `console.log`s the finished state on the thank-you screen.

**Tech Stack:** HTML5, CSS3 (custom properties, keyframes), Vanilla JS (ES6+). No build step. Google Fonts: Bricolage Grotesque (800), Inter (400/500/600).

## Global Constraints

- No frameworks, no build tools, no npm — open `form-site/index.html` directly in Chrome
- Google Fonts via `<link>` in `<head>` (requires internet on first load)
- All files under `form-site/`
- Accent: `#FF3D00` · Background: `#F2F2F0` · Text: `#111111` · Ghost: `#E8E8E5`
- Question headlines: Bricolage Grotesque 800 · All other text: Inter
- `console.log('Velo onboarding complete:', state)` must fire when thank-you screen appears
- Steps numbered 1–12; thank-you screen is unnumbered
- Back button hidden (`.hidden`) on step 1

---

## File Map

| File | Responsibility |
|------|---------------|
| `form-site/index.html` | All HTML: progress bar, top bar, 12 step sections + thank-you section, font `<link>`s |
| `form-site/style.css` | CSS custom properties, layout, typography, animations, responsive, reduced-motion |
| `form-site/script.js` | `state` object, `goTo()`, `goNext()`, `goBack()`, `validate()`, `saveAnswer()`, `showThanks()`, event wiring |

---

### Task 1: HTML Scaffold

**Files:**
- Create: `form-site/index.html`

**Interfaces:**
- Produces: Fully-structured HTML with all 12 step `<section>` elements + thank-you section, font imports, CSS/JS links. Unstyled at this stage — console errors for missing `style.css` and `script.js` are expected.

- [ ] **Step 1: Create `form-site/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Velo — Get started</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <div class="progress-bar">
    <div class="progress-fill" id="progressFill"></div>
  </div>

  <header class="top-bar">
    <span class="logo">Velo</span>
    <span class="step-counter" id="stepCounter">1 of 12</span>
  </header>

  <main class="form-container">

    <!-- Step 1: First name -->
    <section class="step active" id="step-1" data-step="1">
      <span class="ghost-number">01</span>
      <div class="step-body">
        <h1 class="question">What's your<br>first name?</h1>
        <div class="input-group">
          <input type="text" id="firstName" class="text-input" placeholder="Jane" autocomplete="given-name">
        </div>
      </div>
      <div class="step-nav">
        <button class="btn-back" onclick="goBack()">← Back</button>
        <button class="btn-continue" onclick="goNext()">Continue →</button>
      </div>
    </section>

    <!-- Step 2: Last name -->
    <section class="step" id="step-2" data-step="2">
      <span class="ghost-number">02</span>
      <div class="step-body">
        <h1 class="question">And your<br>last name?</h1>
        <div class="input-group">
          <input type="text" id="lastName" class="text-input" placeholder="Smith" autocomplete="family-name">
        </div>
      </div>
      <div class="step-nav">
        <button class="btn-back" onclick="goBack()">← Back</button>
        <button class="btn-continue" onclick="goNext()">Continue →</button>
      </div>
    </section>

    <!-- Step 3: Phone -->
    <section class="step" id="step-3" data-step="3">
      <span class="ghost-number">03</span>
      <div class="step-body">
        <h1 class="question">What's your<br>phone number?</h1>
        <div class="input-group">
          <input type="tel" id="phone" class="text-input" placeholder="+1 (555) 000-0000" autocomplete="tel">
        </div>
      </div>
      <div class="step-nav">
        <button class="btn-back" onclick="goBack()">← Back</button>
        <button class="btn-continue" onclick="goNext()">Continue →</button>
      </div>
    </section>

    <!-- Step 4: Company -->
    <section class="step" id="step-4" data-step="4">
      <span class="ghost-number">04</span>
      <div class="step-body">
        <h1 class="question">What's the name<br>of your company?</h1>
        <div class="input-group">
          <input type="text" id="company" class="text-input" placeholder="Acme Inc." autocomplete="organization">
        </div>
      </div>
      <div class="step-nav">
        <button class="btn-back" onclick="goBack()">← Back</button>
        <button class="btn-continue" onclick="goNext()">Continue →</button>
      </div>
    </section>

    <!-- Step 5: Role -->
    <section class="step" id="step-5" data-step="5">
      <span class="ghost-number">05</span>
      <div class="step-body">
        <h1 class="question">What's<br>your role?</h1>
        <div class="choices" id="choices-5">
          <button class="choice" data-value="founder">Founder</button>
          <button class="choice" data-value="developer">Developer</button>
          <button class="choice" data-value="designer">Designer</button>
          <button class="choice" data-value="marketer">Marketer</button>
          <button class="choice" data-value="other">Other</button>
        </div>
      </div>
      <div class="step-nav">
        <button class="btn-back" onclick="goBack()">← Back</button>
        <button class="btn-continue" onclick="goNext()">Continue →</button>
      </div>
    </section>

    <!-- Step 6: Team size -->
    <section class="step" id="step-6" data-step="6">
      <span class="ghost-number">06</span>
      <div class="step-body">
        <h1 class="question">How big is<br>your team?</h1>
        <div class="choices" id="choices-6">
          <button class="choice" data-value="just-me">Just me</button>
          <button class="choice" data-value="2-10">2–10</button>
          <button class="choice" data-value="11-50">11–50</button>
          <button class="choice" data-value="50+">50+</button>
        </div>
      </div>
      <div class="step-nav">
        <button class="btn-back" onclick="goBack()">← Back</button>
        <button class="btn-continue" onclick="goNext()">Continue →</button>
      </div>
    </section>

    <!-- Step 7: Challenge -->
    <section class="step" id="step-7" data-step="7">
      <span class="ghost-number">07</span>
      <div class="step-body">
        <h1 class="question">What's your biggest<br>challenge right now?</h1>
        <div class="choices" id="choices-7">
          <button class="choice" data-value="speed">Speed</button>
          <button class="choice" data-value="collaboration">Collaboration</button>
          <button class="choice" data-value="planning">Planning</button>
          <button class="choice" data-value="focus">Focus</button>
        </div>
      </div>
      <div class="step-nav">
        <button class="btn-back" onclick="goBack()">← Back</button>
        <button class="btn-continue" onclick="goNext()">Continue →</button>
      </div>
    </section>

    <!-- Step 8: Goals (multi-select chips) -->
    <section class="step" id="step-8" data-step="8">
      <span class="ghost-number">08</span>
      <div class="step-body">
        <h1 class="question">What are your main<br>goals with Velo?</h1>
        <p class="sub-label">Pick as many as you like.</p>
        <div class="chips" id="chips-8">
          <button class="chip" data-value="ship-faster">Ship faster</button>
          <button class="chip" data-value="cut-meetings">Cut meetings</button>
          <button class="chip" data-value="automate">Automate busywork</button>
          <button class="chip" data-value="stay-focused">Stay focused</button>
          <button class="chip" data-value="align-team">Align the team</button>
        </div>
      </div>
      <div class="step-nav">
        <button class="btn-back" onclick="goBack()">← Back</button>
        <button class="btn-continue" onclick="goNext()">Continue →</button>
      </div>
    </section>

    <!-- Step 9: Referral -->
    <section class="step" id="step-9" data-step="9">
      <span class="ghost-number">09</span>
      <div class="step-body">
        <h1 class="question">How did you<br>hear about us?</h1>
        <div class="choices" id="choices-9">
          <button class="choice" data-value="twitter">Twitter / X</button>
          <button class="choice" data-value="word-of-mouth">Word of mouth</button>
          <button class="choice" data-value="search">Search</button>
          <button class="choice" data-value="newsletter">Newsletter</button>
          <button class="choice" data-value="other">Other</button>
        </div>
      </div>
      <div class="step-nav">
        <button class="btn-back" onclick="goBack()">← Back</button>
        <button class="btn-continue" onclick="goNext()">Continue →</button>
      </div>
    </section>

    <!-- Step 10: Tools (multi-select chips) -->
    <section class="step" id="step-10" data-step="10">
      <span class="ghost-number">10</span>
      <div class="step-body">
        <h1 class="question">Which tools do<br>you currently use?</h1>
        <p class="sub-label">Pick as many as you like.</p>
        <div class="chips" id="chips-10">
          <button class="chip" data-value="notion">Notion</button>
          <button class="chip" data-value="slack">Slack</button>
          <button class="chip" data-value="jira">Jira</button>
          <button class="chip" data-value="linear">Linear</button>
          <button class="chip" data-value="figma">Figma</button>
          <button class="chip" data-value="google-docs">Google Docs</button>
          <button class="chip" data-value="other">Other</button>
        </div>
      </div>
      <div class="step-nav">
        <button class="btn-back" onclick="goBack()">← Back</button>
        <button class="btn-continue" onclick="goNext()">Continue →</button>
      </div>
    </section>

    <!-- Step 11: Timeline -->
    <section class="step" id="step-11" data-step="11">
      <span class="ghost-number">11</span>
      <div class="step-body">
        <h1 class="question">How soon do you want<br>to get started?</h1>
        <div class="choices" id="choices-11">
          <button class="choice" data-value="today">Today</button>
          <button class="choice" data-value="this-week">This week</button>
          <button class="choice" data-value="exploring">Just exploring</button>
        </div>
      </div>
      <div class="step-nav">
        <button class="btn-back" onclick="goBack()">← Back</button>
        <button class="btn-continue" onclick="goNext()">Continue →</button>
      </div>
    </section>

    <!-- Step 12: Feature -->
    <section class="step" id="step-12" data-step="12">
      <span class="ghost-number">12</span>
      <div class="step-body">
        <h1 class="question">What feature<br>excites you most?</h1>
        <div class="choices" id="choices-12">
          <button class="choice" data-value="ai-writing">AI writing assist</button>
          <button class="choice" data-value="scheduling">Smart scheduling</button>
          <button class="choice" data-value="summaries">Auto-summaries</button>
          <button class="choice" data-value="workflow">Workflow builder</button>
        </div>
      </div>
      <div class="step-nav">
        <button class="btn-back" onclick="goBack()">← Back</button>
        <button class="btn-continue" onclick="goNext()">Continue →</button>
      </div>
    </section>

    <!-- Thank-you screen -->
    <section class="step" id="step-thanks">
      <div class="step-body thanks-body">
        <p class="thanks-logo">Velo</p>
        <h1 class="thanks-headline">You're in.</h1>
        <p class="thanks-sub" id="thanksMessage">Welcome to Velo. We'll be in touch.</p>
      </div>
    </section>

  </main>

  <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify the file opens**

Open `form-site/index.html` in Chrome. Expected: unstyled content, all step text stacked vertically, console errors for missing `style.css` and `script.js` (expected at this stage — confirms HTML is valid and loads).

---

### Task 2: CSS — Tokens, Layout, Animations

**Files:**
- Create: `form-site/style.css`

**Interfaces:**
- Consumes: Class names from Task 1 — `.step`, `.step.active`, `.progress-bar`, `.progress-fill`, `.top-bar`, `.logo`, `.step-counter`, `.form-container`, `.step-body`, `.ghost-number`, `.question`, `.sub-label`, `.input-group`, `.text-input`, `.choices`, `.choice`, `.chips`, `.chip`, `.step-nav`, `.btn-back`, `.btn-back.hidden`, `.btn-continue`, `.thanks-body`, `.thanks-logo`, `.thanks-headline`, `.thanks-sub`
- Produces: Classes that JS will add/remove at runtime — `.slide-in-forward`, `.slide-in-backward`, `.slide-out-forward`, `.slide-out-backward`, `.selected`, `.hidden`, `.error-shake` — all must be defined here

- [ ] **Step 1: Create `form-site/style.css`**

```css
/* ── Tokens ── */
:root {
  --bg:       #F2F2F0;
  --surface:  #FFFFFF;
  --text:     #111111;
  --accent:   #FF3D00;
  --muted:    #909090;
  --ghost:    #E8E8E5;
  --border:   #E0E0DC;
  --error:    #E84040;
  --radius:   10px;
  --speed:    300ms ease;
}

/* ── Reset ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', sans-serif;
  overflow: hidden;
}

/* ── Progress bar ── */
.progress-bar {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: var(--ghost);
  z-index: 100;
}
.progress-fill {
  height: 100%;
  background: var(--accent);
  width: 0%;
  transition: width var(--speed);
}

/* ── Top bar ── */
.top-bar {
  position: fixed;
  top: 3px; left: 0; right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 48px;
  z-index: 99;
}
.logo {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800;
  font-size: 1.25rem;
  letter-spacing: -0.02em;
}
.step-counter {
  font-size: 0.875rem;
  color: var(--muted);
  font-weight: 500;
}

/* ── Form container ── */
.form-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

/* ── Steps ── */
.step {
  position: absolute;
  inset: 0;
  display: none;
  flex-direction: column;
  justify-content: center;
  padding: 100px 48px 48px;
}
.step.active { display: flex; }

/* ── Transitions ── */
@keyframes slideInRight  { from { transform: translateX(60px);  opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes slideInLeft   { from { transform: translateX(-60px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes slideOutLeft  { from { transform: translateX(0); opacity: 1; } to { transform: translateX(-60px); opacity: 0; } }
@keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(60px);  opacity: 0; } }

.slide-in-forward  { animation: slideInRight  var(--speed) forwards; }
.slide-in-backward { animation: slideInLeft   var(--speed) forwards; }
.slide-out-forward  { animation: slideOutLeft  var(--speed) forwards; }
.slide-out-backward { animation: slideOutRight var(--speed) forwards; }

/* ── Ghost number ── */
.ghost-number {
  position: absolute;
  top: 50%;
  right: 48px;
  transform: translateY(-50%);
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800;
  font-size: 22vw;
  color: var(--ghost);
  line-height: 1;
  pointer-events: none;
  user-select: none;
  z-index: 0;
}

/* ── Step body ── */
.step-body {
  position: relative;
  z-index: 1;
  max-width: 640px;
}

/* ── Question ── */
.question {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800;
  font-size: clamp(2rem, 5vw, 3.75rem);
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: 2rem;
}

/* ── Sub-label ── */
.sub-label {
  font-size: 0.875rem;
  color: var(--muted);
  margin-top: -1.25rem;
  margin-bottom: 1.5rem;
}

/* ── Text inputs ── */
.input-group { display: flex; flex-direction: column; }
.text-input {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 20px;
  font-family: 'Inter', sans-serif;
  font-size: 1.125rem;
  color: var(--text);
  outline: none;
  width: 100%;
  max-width: 400px;
  transition: border-color var(--speed);
}
.text-input:focus { border-color: var(--accent); }
.text-input::placeholder { color: var(--muted); }

/* ── Choice buttons (single-select) ── */
.choices { display: flex; flex-wrap: wrap; gap: 12px; }
.choice {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 24px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text);
  cursor: pointer;
  transition: border-color var(--speed), background var(--speed), color var(--speed);
}
.choice:hover { border-color: var(--accent); }
.choice.selected { background: var(--accent); border-color: var(--accent); color: #fff; }

/* ── Chips (multi-select) ── */
.chips { display: flex; flex-wrap: wrap; gap: 10px; }
.chip {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: 999px;
  padding: 10px 20px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text);
  cursor: pointer;
  transition: border-color var(--speed), background var(--speed), color var(--speed);
}
.chip:hover { border-color: var(--accent); }
.chip.selected { background: var(--accent); border-color: var(--accent); color: #fff; }

/* ── Nav ── */
.step-nav {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 2.5rem;
}
.btn-back {
  background: none;
  border: none;
  color: var(--muted);
  font-family: 'Inter', sans-serif;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  transition: color var(--speed);
}
.btn-back:hover { color: var(--text); }
.btn-back.hidden { visibility: hidden; }
.btn-continue {
  background: var(--text);
  color: #fff;
  border: none;
  border-radius: var(--radius);
  padding: 14px 28px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background var(--speed);
}
.btn-continue:hover { background: var(--accent); }

/* ── Shake ── */
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%      { transform: translateX(-8px); }
  40%      { transform: translateX(8px); }
  60%      { transform: translateX(-6px); }
  80%      { transform: translateX(6px); }
}
.error-shake { animation: shake 0.35s ease; }

/* ── Thank-you screen ── */
.thanks-body { display: flex; flex-direction: column; gap: 12px; }
.thanks-logo {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800;
  font-size: 1.25rem;
  color: var(--muted);
}
.thanks-headline {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800;
  font-size: clamp(3rem, 8vw, 6rem);
  letter-spacing: -0.04em;
  line-height: 1;
}
.thanks-sub {
  font-size: 1.125rem;
  color: var(--muted);
  margin-top: 8px;
}

/* ── Responsive ── */
@media (max-width: 600px) {
  .top-bar      { padding: 16px 24px; }
  .step         { padding: 90px 24px 32px; }
  .ghost-number { font-size: 32vw; right: 16px; }
  .text-input   { max-width: 100%; }
}

/* ── Reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  .progress-fill, .text-input, .choice, .chip,
  .btn-back, .btn-continue { transition: none; }
  .slide-in-forward, .slide-in-backward,
  .slide-out-forward, .slide-out-backward,
  .error-shake { animation: none; }
}
```

- [ ] **Step 2: Verify styling in browser**

Open `form-site/index.html` in Chrome (still no `script.js`). Expected:
- Page background `#F2F2F0`, 3px orange progress bar at top
- "Velo" wordmark top-left in Bricolage Grotesque, "1 of 12" top-right in Inter
- Large question text "What's your first name?" in Bricolage Grotesque
- Ghost "01" visible faintly on the right side
- White input field below with muted placeholder
- Back (muted) and "Continue →" (dark pill) buttons below
- All other steps hidden

---

### Task 3: Step Controller (`script.js`)

**Files:**
- Create: `form-site/script.js`

**Interfaces:**
- Consumes: `#step-{1..12}`, `#step-thanks`, `#progressFill`, `#stepCounter`, `#thanksMessage`, `.btn-back` per step, `.choices` containers, `.chips` containers, `.text-input` inputs — all from Task 1
- Produces (called by `onclick` in HTML): `goNext()`, `goBack()`. Internal: `goTo(n, dir)`, `validate(n)`, `saveAnswer(n)`, `showThanks()`, `shake(el)`. Reads/writes: `state` object.

- [ ] **Step 1: Create `form-site/script.js`**

```js
const TOTAL_STEPS = 12;
let currentStep = 1;

const state = {
  firstName: '', lastName: '', phone: '',    company: '',
  role: '',      teamSize: '', challenge: '', goals: [],
  referral: '',  tools: [],    timeline: '',  feature: ''
};

const stepKey = {
  1: 'firstName', 2: 'lastName',  3: 'phone',    4: 'company',
  5: 'role',      6: 'teamSize',  7: 'challenge', 8: 'goals',
  9: 'referral',  10: 'tools',    11: 'timeline', 12: 'feature'
};

function getStepEl(n) {
  return document.getElementById(n === 'thanks' ? 'step-thanks' : `step-${n}`);
}

function updateUI(n) {
  document.getElementById('progressFill').style.width = `${(n / TOTAL_STEPS) * 100}%`;
  document.getElementById('stepCounter').textContent = `${n} of ${TOTAL_STEPS}`;
  const backBtn = getStepEl(n).querySelector('.btn-back');
  if (backBtn) backBtn.classList.toggle('hidden', n === 1);
}

function restoreAnswers(n) {
  const key = stepKey[n];
  if (!key) return;
  const val = state[key];
  if (n === 8 || n === 10) {
    getStepEl(n).querySelectorAll('.chip').forEach(c =>
      c.classList.toggle('selected', val.includes(c.dataset.value))
    );
  } else if (n >= 5) {
    getStepEl(n).querySelectorAll('.choice').forEach(c =>
      c.classList.toggle('selected', c.dataset.value === val)
    );
  } else {
    const input = getStepEl(n).querySelector('.text-input');
    if (input) input.value = val;
  }
}

function goTo(n, dir) {
  const outEl = getStepEl(currentStep);
  const inEl  = getStepEl(n);
  const outClass = dir === 'forward' ? 'slide-out-forward'  : 'slide-out-backward';
  const inClass  = dir === 'forward' ? 'slide-in-forward'   : 'slide-in-backward';

  outEl.classList.add(outClass);
  outEl.addEventListener('animationend', () => {
    outEl.classList.remove('active', outClass);
  }, { once: true });

  inEl.classList.add('active', inClass);
  inEl.addEventListener('animationend', () => {
    inEl.classList.remove(inClass);
  }, { once: true });

  currentStep = n;
  updateUI(n);
  restoreAnswers(n);
}

function validate(n) {
  if (n === 8 || n === 10) {
    const container = getStepEl(n).querySelector('.chips');
    const ok = [...container.querySelectorAll('.chip')].some(c => c.classList.contains('selected'));
    if (!ok) { shake(container); return false; }
  } else if (n >= 5) {
    const container = getStepEl(n).querySelector('.choices');
    const ok = [...container.querySelectorAll('.choice')].some(c => c.classList.contains('selected'));
    if (!ok) { shake(container); return false; }
  } else {
    const input = getStepEl(n).querySelector('.text-input');
    const val = input.value.trim();
    if (!val) { shake(input); return false; }
    if (n === 3 && !/^\+?[\d\s\-(). ]{7,}$/.test(val)) { shake(input); return false; }
  }
  return true;
}

function saveAnswer(n) {
  const key = stepKey[n];
  if (n === 8 || n === 10) {
    state[key] = [...getStepEl(n).querySelectorAll('.chip.selected')].map(c => c.dataset.value);
  } else if (n >= 5) {
    const sel = getStepEl(n).querySelector('.choice.selected');
    state[key] = sel ? sel.dataset.value : '';
  } else {
    state[key] = getStepEl(n).querySelector('.text-input').value.trim();
  }
}

function shake(el) {
  el.classList.remove('error-shake');
  void el.offsetWidth;
  el.classList.add('error-shake');
  el.addEventListener('animationend', () => el.classList.remove('error-shake'), { once: true });
}

function showThanks() {
  const outEl = getStepEl(currentStep);
  const inEl  = getStepEl('thanks');
  outEl.classList.add('slide-out-forward');
  outEl.addEventListener('animationend', () => {
    outEl.classList.remove('active', 'slide-out-forward');
  }, { once: true });
  inEl.classList.add('active', 'slide-in-forward');
  inEl.addEventListener('animationend', () => {
    inEl.classList.remove('slide-in-forward');
  }, { once: true });
  document.getElementById('progressFill').style.width = '100%';
  document.getElementById('stepCounter').textContent = '';
  document.getElementById('thanksMessage').textContent =
    `Welcome to Velo, ${state.firstName}. We'll be in touch.`;
  console.log('Velo onboarding complete:', state);
}

function goNext() {
  if (!validate(currentStep)) return;
  saveAnswer(currentStep);
  if (currentStep === TOTAL_STEPS) { showThanks(); return; }
  goTo(currentStep + 1, 'forward');
}

function goBack() {
  if (currentStep === 1) return;
  goTo(currentStep - 1, 'backward');
}

// Single-select choice wiring
document.querySelectorAll('.choices').forEach(group => {
  group.addEventListener('click', e => {
    const btn = e.target.closest('.choice');
    if (!btn) return;
    group.querySelectorAll('.choice').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});

// Multi-select chip wiring
document.querySelectorAll('.chips').forEach(group => {
  group.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    chip.classList.toggle('selected');
  });
});

// Init
updateUI(1);
```

- [ ] **Step 2: Full end-to-end test in browser**

Open `form-site/index.html` in Chrome and verify each of the following:

1. Step 1 loads. "← Back" is invisible. Type "Jane" → Continue → slides to step 2.
2. Step 2: "← Back" is visible. Click Back → slides back to step 1 with "Jane" pre-filled.
3. Step 3: Enter "abc" → Continue → shake, stays on step 3. Enter "+1 555 0000" → Continue → advances.
4. Steps 5–7, 9, 11, 12: Continue with nothing selected → shake. Click a button → fills orange. Continue → advances.
5. Step 8: Continue with nothing selected → shake. Select two chips → Continue → advances.
6. Step 10: Same multi-select behavior.
7. After step 12 Continue → thank-you screen slides in. "You're in." headline. Message shows "Welcome to Velo, Jane. We'll be in touch."
8. Open DevTools → Console → `Velo onboarding complete: { firstName: "Jane", ... }` with all 12 fields populated.
9. Progress bar reaches 100% on the thank-you screen.

- [ ] **Step 3: Commit**

```bash
cd form-site
git init
git add index.html style.css script.js
git commit -m "feat: Velo 12-step onboarding form"
```

---

## Self-Review

**Spec coverage:**
- ✅ 12 steps, one question per page
- ✅ Steps 1–4: text inputs; Steps 5–7, 9, 11, 12: single-select choice buttons; Steps 8, 10: multi-select chips
- ✅ Progress bar + "N of 12" counter
- ✅ Back button hidden on step 1 (`.hidden` → `visibility: hidden`)
- ✅ Back navigation pre-fills previous answers via `restoreAnswers()`
- ✅ Thank-you screen with `state.firstName` personalization
- ✅ `console.log('Velo onboarding complete:', state)` fires in `showThanks()`
- ✅ Validation with shake on empty text, no selection, invalid phone
- ✅ Phone regex: `/^\+?[\d\s\-(). ]{7,}$/`
- ✅ Ghost step numbers (`.ghost-number`) — atmospheric, `pointer-events: none`
- ✅ Slide transitions in both directions with `animationend` cleanup
- ✅ `@media (prefers-reduced-motion: reduce)` disables all transitions and animations
- ✅ Responsive at 600px breakpoint
- ✅ Palette matches spec exactly
- ✅ Bricolage Grotesque (questions, logo, ghost) + Inter (inputs, buttons, labels)

**Placeholders:** None.

**Type consistency:** `stepKey` maps exactly to `state` property names. `getStepEl()` used in every function that touches a step element. `.slide-in-forward`, `.slide-in-backward`, `.slide-out-forward`, `.slide-out-backward`, `.selected`, `.hidden`, `.error-shake` all defined in CSS and used in JS.
