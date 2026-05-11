#!/usr/bin/env node
import { execFileSync } from 'node:child_process';

const requiredFiles = [
  'Lịch sử Phát triển và Quy tắc Cố định của Dự án CAP.md',
  'BASELINE_REFERENCE.md',
];

const baseSha = process.env.BASE_SHA;
const headSha = process.env.HEAD_SHA;

if (!baseSha || !headSha) {
  console.error('❌ Missing BASE_SHA or HEAD_SHA environment variable.');
  process.exit(2);
}

function runGit(args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

function objectExists(revPath) {
  try {
    execFileSync('git', ['cat-file', '-e', revPath], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

const violations = [];

for (const filePath of requiredFiles) {
  const baseObject = `${baseSha}:${filePath}`;
  const headObject = `${headSha}:${filePath}`;

  const existsInBase = objectExists(baseObject);
  const existsInHead = objectExists(headObject);

  if (!existsInBase) {
    violations.push(`- Required file missing in base ref: \`${filePath}\``);
    continue;
  }

  if (!existsInHead) {
    violations.push(`- Required file was removed or renamed: \`${filePath}\``);
    continue;
  }

  const baseBlob = runGit(['rev-parse', baseObject]);
  const headBlob = runGit(['rev-parse', headObject]);

  if (baseBlob !== headBlob) {
    violations.push(`- Required file content changed: \`${filePath}\``);

    const diff = runGit(['diff', '--unified=3', baseSha, headSha, '--', filePath]);
    if (diff) {
      violations.push(`\nDiff for \`${filePath}\`:\n\n\`\`\`diff\n${diff}\n\`\`\``);
    }
  }
}

if (violations.length > 0) {
  console.error('❌ Baseline / Guardrail Compliance Check failed.');
  console.error('The following required guardrail files must exist and remain unchanged in PRs:');
  for (const filePath of requiredFiles) {
    console.error(`  • ${filePath}`);
  }
  console.error('\nViolations:');
  console.error(violations.join('\n'));
  process.exit(1);
}

console.log('✅ Baseline / Guardrail Compliance Check passed.');
console.log('All required guardrail files exist and are unchanged.');
