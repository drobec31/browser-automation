import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';
const next = (page: import('@playwright/test').Page) =>
  page.locator('.step.active .btn-continue').click();

test('Velo onboarding — complete 12-step flow', async ({ page }) => {
  await page.goto(BASE);

  // Step 1: First name
  await expect(page.locator('#step-1')).toBeVisible();
  await page.fill('#firstName', 'Rod');
  await next(page);
  await page.waitForTimeout(400);

  // Step 2: Last name
  await expect(page.locator('#step-2')).toBeVisible();
  await page.fill('#lastName', 'Smith');
  await next(page);
  await page.waitForTimeout(400);

  // Step 3: Phone
  await expect(page.locator('#step-3')).toBeVisible();
  await page.fill('#phone', '+1 555 123 4567');
  await next(page);
  await page.waitForTimeout(400);

  // Step 4: Company
  await expect(page.locator('#step-4')).toBeVisible();
  await page.fill('#company', 'Acme Inc');
  await next(page);
  await page.waitForTimeout(400);

  // Step 5: Role
  await expect(page.locator('#step-5')).toBeVisible();
  await page.click('#step-5 .choice[data-value="founder"]');
  await next(page);
  await page.waitForTimeout(400);

  // Step 6: Team size
  await expect(page.locator('#step-6')).toBeVisible();
  await page.click('#step-6 .choice[data-value="2-10"]');
  await next(page);
  await page.waitForTimeout(400);

  // Step 7: Challenge
  await expect(page.locator('#step-7')).toBeVisible();
  await page.click('#step-7 .choice[data-value="speed"]');
  await next(page);
  await page.waitForTimeout(400);

  // Step 8: Goals (multi-select)
  await expect(page.locator('#step-8')).toBeVisible();
  await page.click('#step-8 .chip[data-value="ship-faster"]');
  await page.click('#step-8 .chip[data-value="stay-focused"]');
  await next(page);
  await page.waitForTimeout(400);

  // Step 9: Referral
  await expect(page.locator('#step-9')).toBeVisible();
  await page.click('#step-9 .choice[data-value="word-of-mouth"]');
  await next(page);
  await page.waitForTimeout(400);

  // Step 10: Tools (multi-select)
  await expect(page.locator('#step-10')).toBeVisible();
  await page.click('#step-10 .chip[data-value="notion"]');
  await page.click('#step-10 .chip[data-value="slack"]');
  await next(page);
  await page.waitForTimeout(400);

  // Step 11: Timeline
  await expect(page.locator('#step-11')).toBeVisible();
  await page.click('#step-11 .choice[data-value="today"]');
  await next(page);
  await page.waitForTimeout(400);

  // Step 12: Feature
  await expect(page.locator('#step-12')).toBeVisible();
  await page.click('#step-12 .choice[data-value="ai-writing"]');
  await next(page);
  await page.waitForTimeout(700);

  // Thank-you screen
  await expect(page.locator('.thanks-headline')).toBeVisible();
  await expect(page.locator('.thanks-headline')).toHaveText("You're in.");
  await expect(page.locator('#thanksMessage')).toContainText('Rod');
  await page.screenshot({ path: 'screenshots/velo-form-complete.png' });
});

test('Velo onboarding — validation: empty field blocks advance', async ({ page }) => {
  await page.goto(BASE);
  await expect(page.locator('#step-1')).toBeVisible();
  await next(page);
  await page.waitForTimeout(500);
  await expect(page.locator('#step-1')).toBeVisible();
  await page.screenshot({ path: 'screenshots/velo-validation-empty.png' });
});

test('Velo onboarding — validation: invalid phone blocked', async ({ page }) => {
  await page.goto(BASE);
  await page.fill('#firstName', 'Rod');
  await next(page);
  await page.waitForTimeout(400);
  await page.fill('#lastName', 'Smith');
  await next(page);
  await page.waitForTimeout(400);
  await page.fill('#phone', 'abc');
  await next(page);
  await page.waitForTimeout(500);
  await expect(page.locator('#step-3')).toBeVisible();
  await page.screenshot({ path: 'screenshots/velo-validation-phone.png' });
});
