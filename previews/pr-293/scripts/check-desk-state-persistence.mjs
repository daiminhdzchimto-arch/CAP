import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { chromium } from '@playwright/test';

const rootDir = resolve(process.cwd());
const host = '127.0.0.1';
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
};

const server = createServer(async (req, res) => {
  try {
    const rawPath = req.url?.split('?')[0] || '/';
    const relativePath = rawPath === '/' ? 'index.html' : rawPath.slice(1);
    const filePath = join(rootDir, relativePath);
    const data = await readFile(filePath);
    const ext = extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
  }
});

async function run() {
  await new Promise((resolveListen) => server.listen(0, host, resolveListen));
  const address = server.address();
  const port = address && typeof address === 'object' ? address.port : 0;

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  page.on('pageerror', (err) => console.error(`[pageerror] ${err.message}`));

  try {
    const url = `http://${host}:${port}/index.html`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const deskBox = page
      .locator('#left-rows-container .desk-box[data-side="left"][data-r="0"][data-c="0"]')
      .first();
    await deskBox.waitFor({ state: 'visible', timeout: 60000 });

    const seatId = await deskBox.getAttribute('data-seat-id');
    if (!seatId) throw new Error('Không lấy được data-seat-id của ô bàn ghế kiểm thử.');

    await page.evaluate((id) => {
      window.toggleFixed(id);
      window.handleManualSave('e2e-seat-state-check');
    }, seatId);

    const savedState = await page.evaluate((id) => {
      const raw = localStorage.getItem('classApp_v28');
      if (!raw) return { hasStorage: false, includesSeat: false };
      const parsed = JSON.parse(raw);
      return {
        hasStorage: true,
        includesSeat: Array.isArray(parsed.fixedMembers) && parsed.fixedMembers.includes(id),
      };
    }, seatId);

    if (!savedState.hasStorage) throw new Error('Không thấy dữ liệu classApp_v28 trong localStorage.');
    if (!savedState.includesSeat) throw new Error('localStorage chưa lưu trạng thái ghim của ô bàn ghế.');

    await page.reload({ waitUntil: 'domcontentloaded' });
    const fixedAfterReload = page
      .locator('#left-rows-container .desk-box[data-side="left"][data-r="0"][data-c="0"].is-fixed')
      .first();

    await fixedAfterReload.waitFor({ state: 'visible', timeout: 60000 });

    console.log(`PASS: Trạng thái ghim đã được lưu và khôi phục cho ô có id ${seatId}.`);
  } finally {
    await context.close();
    await browser.close();
    await new Promise((resolveClose) => server.close(resolveClose));
  }
}

run().catch((error) => {
  console.error(`FAIL: ${error.message}`);
  process.exitCode = 1;
});
