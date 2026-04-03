import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const indexPath = resolve(process.cwd(), 'index.html');
const source = await readFile(indexPath, 'utf8');

const checks = [
  {
    name: 'saveData lưu fixedMembers',
    pattern: /const data\s*=\s*\{[\s\S]*?fixedMembers,[\s\S]*?\};\s*try\s*\{[\s\S]*?localStorage\.setItem\(key, serializedData\)/,
  },
  {
    name: 'loadData khôi phục fixedMembers',
    pattern: /function loadData\(\)\s*\{[\s\S]*?fixedMembers\s*=\s*data\.fixedMembers\s*\|\|\s*\[\];/,
  },
  {
    name: 'toggleFixed kích hoạt autosave',
    pattern: /function toggleFixed\(id\)\s*\{[\s\S]*?scheduleImmediateAutoSave\("seat-fixed-toggle"\);/,
  },
];

const failures = checks.filter((c) => !c.pattern.test(source));
if (failures.length > 0) {
  console.error('FAIL: Thiếu các điều kiện persistence sau:');
  for (const item of failures) console.error(`- ${item.name}`);
  process.exit(1);
}

console.log('PASS: Luồng lưu/khôi phục trạng thái ghim ô bàn ghế tồn tại trong mã nguồn.');
for (const item of checks) console.log(`- ${item.name}`);
