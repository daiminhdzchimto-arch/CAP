import { expect, test } from '@playwright/test';
import { mainScenarioStudents } from './fixtures/students';

test.describe('Main classroom scenario', () => {
  test('create class diagram, shuffle, save and export image', async ({ page }) => {
    await page.goto('/');

    const deskInputs = page.locator('.desk-input');
    await expect(deskInputs.first()).toBeVisible();

    for (let i = 0; i < mainScenarioStudents.length; i += 1) {
      await deskInputs.nth(i).fill(mainScenarioStudents[i]);
    }

    await page.getByTitle('Sắp xếp').click();
    await page.getByRole('button', { name: 'Toàn bộ lớp' }).click();

    const classroomSnapshot = await page.locator('#classroom-area').screenshot();
    expect(classroomSnapshot.byteLength).toBeGreaterThan(0);

    await page.getByTitle('Lưu').click();
    const savedData = await page.evaluate(() => localStorage.getItem('classApp_v2.5'));
    expect(savedData).toBeTruthy();

    await page.evaluate(() => {
      (window as Window & { __e2eExportCalled?: boolean }).__e2eExportCalled = false;
      const original = (window as Window & { downloadImage: (id: string, prefix: string) => void }).downloadImage;
      (window as Window & { downloadImage: (id: string, prefix: string) => void }).downloadImage = (id: string, prefix: string) => {
        (window as Window & { __e2eExportCalled?: boolean }).__e2eExportCalled = true;
        return original(id, prefix);
      };
    });

    await page.getByTitle('Chụp ảnh').click();
    await expect.poll(async () => page.evaluate(() => (window as Window & { __e2eExportCalled?: boolean }).__e2eExportCalled)).toBe(true);
  });
});
