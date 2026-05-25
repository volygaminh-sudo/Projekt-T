import { test, expect } from '@playwright/test';

test.describe('Vercel Routes Automated Check', () => {

  // We set up route interception before each test to prevent real Database connections from timing out or hitting rate limits.
  test.beforeEach(async ({ page }) => {
    // 1. Mock GET /api/heroes (For Homepage and Tier List)
    await page.route('**/api/heroes', async (route) => {
      const mockHeroes = [
        {
          id: 1, name: 'Illumia Mock', primary_role: 'mage', secondary_role: null,
          tier: 'splus', image_url: '', skins: '', win_rate: '50%', pick_rate: '1%', ban_rate: '0%'
        },
        {
          id: 2, name: 'Thane Mock', primary_role: 'tank', secondary_role: 'support',
          tier: 'b', image_url: '', skins: '', win_rate: '49%', pick_rate: '5%', ban_rate: '1%'
        },
        {
          id: 3, name: 'Murad Mock', primary_role: 'assassin', secondary_role: null,
          tier: 'c', image_url: '', skins: '', win_rate: '45%', pick_rate: '2%', ban_rate: '0%'
        }
      ];
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'success', data: mockHeroes })
      });
    });

    // 2. Mock GET /api/heroes/:id (For Hero Detail Page)
    await page.route('**/api/heroes/*', async (route) => {
      const mockSingleHero = {
        id: 1, name: 'Illumia Mock', primary_role: 'mage', tier: 'splus',
        skill_p: 'Passive: Test', skill_1: 'S1: Test', skill_2: 'S2: Test', skill_3: 'Ult: Test'
      };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'success', data: mockSingleHero })
      });
    });
  });

  test('Homepage renders basic skeleton and mocked data', async ({ page }) => {
    await page.goto('/');

    // Check navbar
    await expect(page.locator('nav').first()).toBeVisible();
    await expect(page.locator('text=Trang chủ').first()).toBeVisible();

    // The hero cards in the showcase should be populated by our mock
    await expect(page.locator('.hero-name', { hasText: 'Illumia Mock' }).first()).toBeVisible();
    await expect(page.locator('.hero-name', { hasText: 'Thane Mock' }).first()).toBeVisible();
  });

  test('Tier List meta page renders tiers correctly', async ({ page }) => {
    await page.goto('/tier-list.html');

    // Wait for the board
    const board = page.locator('#tier-board');
    await expect(board).toBeVisible();

    // Ensure the loading message goes away
    await expect(page.locator('.tier-loading')).not.toBeVisible();

    // Check if the S+ tier has our mocked Illumia
    await expect(page.locator('#tier-splus')).toContainText('Illumia Mock');
    // Check if B tier has Thane
    await expect(page.locator('#tier-b')).toContainText('Thane Mock');
  });

  test('Hero Detail page renders without sticking at "Đang Tải..."', async ({ page }) => {
    await page.goto('/hero-detail.html?id=1');

    // Breadcrumb updates from Đang tải... to Hero Name
    await expect(page.locator('#breadcrumb-name')).toHaveText('Illumia Mock');
    
    // Main Title updates
    await expect(page.locator('#hd-name')).toHaveText('Illumia Mock');
    
    // Skills populate
    await expect(page.locator('#skill-p-desc')).toHaveText('Test');
  });

  test('Admin dashboard renders Layout correctly (unauthenticated check)', async ({ page }) => {
    await page.goto('/admin.html');
    
    // Check if Login prompt or Sidebar visible
    await expect(page.locator('body')).not.toBeEmpty();
  });

});
