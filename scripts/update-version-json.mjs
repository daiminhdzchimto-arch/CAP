#!/usr/bin/env node
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const VERSION_PATH = "version.json";
const VERSION_PREFIX = "v2.5";

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

function getTimestampSequence(date = new Date()) {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const min = String(date.getUTCMinutes()).padStart(2, "0");
  const sec = String(date.getUTCSeconds()).padStart(2, "0");
  return `${yyyy}${mm}${dd}.${hh}${min}${sec}`;
}

function resolveHeadCommit() {
  const envSha =
    typeof process.env.GITHUB_SHA === "string"
      ? process.env.GITHUB_SHA.trim()
      : "";
  if (envSha) return envSha;
  return runGit("git rev-parse HEAD");
}

const existing = parseJsonFile(VERSION_PATH);
const headCommit = resolveHeadCommit();
const shortCommit =
  headCommit.slice(0, 7) || tryRunGit("git rev-parse --short HEAD");

const firstVersionCommit =
  typeof existing.firstVersionCommit === "string" && existing.firstVersionCommit
    ? existing.firstVersionCommit
    : headCommit;

const firstVersionDate =
  typeof existing.firstVersionDate === "string" && existing.firstVersionDate
    ? existing.firstVersionDate
    : tryRunGit(`git show -s --format=%cI ${firstVersionCommit}`) ||
      new Date().toISOString();

const nextSequence = getTimestampSequence();

const payload = {
  commit: headCommit,
  shortCommit,
  builtAt: new Date().toISOString(),
  firstVersionCommit,
  firstVersionDate,
  versionSequence: nextSequence,
  displayVersion: `${VERSION_PREFIX}.${nextSequence}-${shortCommit}`,
};

writeFileSync(VERSION_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
