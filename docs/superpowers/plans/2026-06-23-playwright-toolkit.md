# Playwright CLI Toolkit — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up a lean Playwright CLI toolkit with TypeScript and real Chrome so `npx playwright test`, `codegen`, and `screenshot` work out of the box.

**Architecture:** `package.json` + `tsconfig.json` provide the TypeScript/Playwright foundation; `playwright.config.ts` configures real Chrome (`channel: 'chrome'`), output directories, and failure screenshots; `tests/` holds all automation scripts as `.spec.ts` files run via `npx playwright test`.

**Tech Stack:** Node.js 24, `@playwright/test` ^1.49, TypeScript ^5.7, Google Chrome (system install via `channel: 'chrome'`).

## Global Constraints

- Working directory: `c:\Users\Laptop\Documents\CLAUDE\Browser Automation`
- All Playwright files at the repo root (not inside `form-site/`)
- Browser: `channel: 'chrome'` (real Chrome, not bundled Chromium)
- Manual screenshots save to `screenshots/`; test-failure artifacts save to `test-results/`
- `test-results/` and `node_modules/` are gitignored; `screenshots/` is tracked
- TypeScript strict mode on
- No additional browsers beyond Chrome — keep it lean

---

## File Map

| File | Responsibility |
|------|---------------|
| `package.json` | Dependencies (`@playwright/test`, `typescript`), `test` script |
| `tsconfig.json` | TypeScript compiler config — strict, ES2022, targets `tests/` and `playwright.config.ts` |
| `playwright.config.ts` | Browser (`channel: 'chrome'`), `testDir`, `outputDir`, failure screenshot policy |
| `tests/example.spec.ts` | Starter script: navigate to a URL, assert title, save screenshot to `screenshots/` |
| `screenshots/.gitkeep` | Ensures `screenshots/` is tracked by git while staying empty |
| `.gitignore` | Ignores `node_modules/`, `test-results/`, `playwright-report/` |

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Run: `npm install` + `npx playwright install chrome`

**Interfaces:**
- Produces: `node_modules/@playwright/test` available; `npx playwright` CLI usable; TypeScript compiler available as `npx tsc`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "browser-automation",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "test": "playwright test"
  },
  "devDependencies": {
    "@playwright/test": "^1.49.0",
    "typescript": "^5.7.0"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["tests/**/*.ts", "playwright.config.ts"]
}
```

- [ ] **Step 3: Create `.gitignore`**

```
node_modules/
test-results/
playwright-report/
.playwright/
```

- [ ] **Step 4: Install dependencies**

Run:
```
npm install
```

Expected: `node_modules/` created, `package-lock.json` generated, no errors.

- [ ] **Step 5: Install Chrome browser for Playwright**

Run:
```
npx playwright install chrome
```

Expected: Output like `Downloading Chromium...` or `Chrome is already installed` — no errors.

- [ ] **Step 6: Verify Playwright CLI works**

Run:
```
npx playwright --version
```

Expected: `Version 1.49.x` (or higher).

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json tsconfig.json .gitignore
git commit -m "chore: scaffold Playwright TypeScript project"
```

---

### Task 2: Playwright Config + Example Test

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/example.spec.ts`
- Create: `screenshots/.gitkeep`

**Interfaces:**
- Consumes: `node_modules/@playwright/test` from Task 1
- Produces: `npx playwright test` runs successfully; `screenshots/playwright-dev.png` is created on first run

- [ ] **Step 1: Create `playwright.config.ts`**

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  use: {
    channel: 'chrome',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
});
```

- [ ] **Step 2: Create `screenshots/.gitkeep`**

Create an empty file at `screenshots/.gitkeep` so the `screenshots/` directory is tracked by git.

- [ ] **Step 3: Create `tests/example.spec.ts`**

```typescript
import { test, expect } from '@playwright/test';

test('playwright.dev loads with correct title', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page).toHaveTitle(/Playwright/);
  await page.screenshot({ path: 'screenshots/playwright-dev.png' });
});
```

- [ ] **Step 4: Run the test**

Run:
```
npx playwright test
```

Expected output:
```
Running 1 test using 1 worker
  ✓  1 [chrome] › example.spec.ts:3 › playwright.dev loads with correct title
  1 passed (Xs)
```

Also verify `screenshots/playwright-dev.png` was created.

- [ ] **Step 5: Commit**

```bash
git add playwright.config.ts tests/example.spec.ts screenshots/.gitkeep
git commit -m "feat: Playwright config with Chrome and starter example test"
```

---

## Self-Review

**Spec coverage:**
- ✅ `channel: 'chrome'` in config — real Chrome, not bundled Chromium
- ✅ `screenshots/` for manual screenshots — created and tracked
- ✅ `test-results/` for failure artifacts — configured in `outputDir`, gitignored
- ✅ TypeScript strict mode — `"strict": true` in tsconfig
- ✅ `npx playwright test` works — Task 2 Step 4 runs and passes
- ✅ `npx playwright codegen` and `npx playwright screenshot` available after install (no config needed — CLI commands work once Playwright is installed)
- ✅ `node_modules/` and `test-results/` gitignored

**Placeholders:** None.

**Type consistency:** `defineConfig`, `devices` imported from `@playwright/test` and used correctly. Test uses `page` from Playwright's `test` fixture — standard pattern.
