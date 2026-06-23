# Velo Onboarding Form — Design Spec

**Date:** 2026-06-23  
**Status:** Approved

---

## Overview

A multi-step onboarding form for a fictional AI productivity SaaS called **Velo**. One question per screen, 12 steps total, ending on a thank-you page. Built as a static site (HTML + CSS + JS) — no build step, no server required. Open `index.html` directly in a browser.

Primary purpose: demonstrate and test browser automation with Playwright.

---

## File Structure

```
form-site/
├── index.html    ← all step divs, font imports
├── style.css     ← layout, theme, animations
└── script.js     ← step controller, state, validation
```

---

## Architecture

### State

A single JS object holds all answers:

```js
const state = {
  firstName, lastName, phone, company,
  role, teamSize, challenge, goals,
  referral, tools, timeline, feature
}
```

Each step writes to `state` on "Continue". Back navigation reads from `state` to pre-fill previous answers. On the thank-you screen, `console.log(state)` outputs the full object for Playwright inspection.

### Step Controller

`script.js` tracks `currentStep` (1–12). `goTo(n)` hides the active step div, updates the progress bar and step counter, then shows the target step div. Forward transition slides left; backward slides right.

### Validation

Required before advancing:
- Text inputs: non-empty after trim
- Choice buttons: one selected
- Multi-select chips (steps 8, 10): at least one selected
- Phone (step 3): matches `/^\+?[\d\s\-().]{7,}$/`

On failure: shake animation on the input/button group, no step advance.

---

## Question Flow

| Step | Question | Input type |
|------|----------|------------|
| 1 | What's your first name? | Text input |
| 2 | And your last name? | Text input |
| 3 | What's your phone number? | Tel input |
| 4 | What's the name of your company? | Text input |
| 5 | What's your role? | Choice buttons: Founder / Developer / Designer / Marketer / Other |
| 6 | How big is your team? | Choice buttons: Just me / 2–10 / 11–50 / 50+ |
| 7 | What's your biggest challenge right now? | Choice buttons: Speed / Collaboration / Planning / Focus |
| 8 | What are your main goals with Velo? | Multi-select chips (pick any): Ship faster / Cut meetings / Automate busywork / Stay focused / Align the team |
| 9 | How did you hear about us? | Choice buttons: Twitter/X / Word of mouth / Search / Newsletter / Other |
| 10 | Which tools do you currently use? | Multi-select chips: Notion / Slack / Jira / Linear / Figma / Google Docs / Other |
| 11 | How soon do you want to get started? | Choice buttons: Today / This week / Just exploring |
| 12 | What feature excites you most? | Choice buttons: AI writing assist / Smart scheduling / Auto-summaries / Workflow builder |
| ✓ | Welcome to Velo! | Thank-you screen |

---

## Visual Design

### Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#F2F2F0` | Page background |
| `--surface` | `#FFFFFF` | Input fields |
| `--text` | `#111111` | Primary text |
| `--accent` | `#FF3D00` | CTA buttons, progress fill, selected state |
| `--muted` | `#909090` | Labels, back button, placeholder |
| `--ghost` | `#E8E8E5` | Background step number |

### Typography

- **Question headlines:** `Bricolage Grotesque`, 800 weight, 48–60px desktop / 32px mobile
- **All other text:** `Inter`, regular–medium weight
- Loaded from Google Fonts

### Layout

Full-viewport-height per step. Content is left-aligned, vertically centered. Top bar: Velo wordmark (left) + "N of 12" counter (right). Hairline progress bar at very top of screen.

```
┌──────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓░░░░░░░░░░░░░░  ← progress bar   │
│ Velo                          3 of 12    │
│                                          │
│  What's your                             │
│  phone number?                           │
│                                          │
│  ┌──────────────────────────┐            │
│  │ +1 (555) 000-0000        │            │
│  └──────────────────────────┘            │
│                                          │
│  ← Back          [ Continue → ]         │
└──────────────────────────────────────────┘
```

### Signature Element

A ghost step number (e.g. `03`) at ~20vw font size, color `#E8E8E5`, positioned absolutely behind the question text. Changes with each step. Pure atmosphere — gives each step spatial identity like a chapter page.

### Motion

- Step transition: 300ms ease slide (left→right forward, right→left backward)
- Progress bar: CSS `transition: width 300ms ease`
- Choice button select: background fills to `--accent`, text flips to white
- Validation error: 300ms shake keyframe on the input/group
- `@media (prefers-reduced-motion)`: all transitions disabled

---

## Thank-You Screen

Full-viewport. Centered. Large headline: **"You're in."** Subtext: *"Welcome to Velo, [firstName]. We'll be in touch."* Velo logo above. No buttons — flow is complete. `console.log(state)` fires on mount.

---

## Out of Scope

- No backend / form submission endpoint
- No persistent storage (localStorage, cookies)
- No email confirmation
- No mobile-specific gesture navigation (swipe)
