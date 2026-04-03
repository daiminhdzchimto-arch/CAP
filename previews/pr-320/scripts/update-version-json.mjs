#!/usr/bin/env node
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const VERSION_PATH = "version.json";
const VERSION_PREFIX = "v2.5";

const shouldBumpForNextCommit = process.argv.includes("--bump");

function runGit(cmd) {
  return execSync(cmd, { encoding: "utf8" }).trim();
}

function tryRunGit(cmd) {
  try {
    return runGit(cmd);
  } catch {
    return "";
  }
}

function parseJsonFile(path) {
  try {
    const raw = readFileSync(path, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function toPositiveInt(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return 0;
  return Math.max(0, Math.floor(num));
}

function countSince(firstCommit, headCommit) {
  if (!firstCommit || !headCommit) return 1;
  if (firstCommit === headCommit) return 1;
  const count = toPositiveInt(
    tryRunGit(`git rev-list --count ${firstCommit}..${headCommit}`),
  );
  return count + 1;
}

const existing = parseJsonFile(VERSION_PATH);
const headCommit = runGit("git rev-parse HEAD");
const shortCommit = runGit("git rev-parse --short HEAD");

const firstVersionCommit =
  typeof existing.firstVersionCommit === "string" && existing.firstVersionCommit
    ? existing.firstVersionCommit
    : headCommit;

const firstVersionDate =
  typeof existing.firstVersionDate === "string" && existing.firstVersionDate
    ? existing.firstVersionDate
    : tryRunGit(`git show -s --format=%cI ${firstVersionCommit}`) ||
      new Date().toISOString();

const previousSequence = toPositiveInt(existing.versionSequence);
const headCount = countSince(firstVersionCommit, headCommit);
const existingCount = existing.commit
  ? countSince(firstVersionCommit, existing.commit)
  : Math.max(1, headCount - 1);

const sequenceOffset = previousSequence > 0 ? previousSequence - existingCount : 0;
let nextSequence = Math.max(1, headCount + sequenceOffset);

if (existing.commit === headCommit && previousSequence > 0) {
  nextSequence = shouldBumpForNextCommit
    ? previousSequence + 1
    : previousSequence;
}

const payload = {
  commit: headCommit,
  shortCommit,
  builtAt: new Date().toISOString(),
  firstVersionCommit,
  firstVersionDate,
  versionSequence: nextSequence,
  displayVersion: `${VERSION_PREFIX}.${String(nextSequence).padStart(4, "0")}-${shortCommit}`,
};

writeFileSync(VERSION_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
