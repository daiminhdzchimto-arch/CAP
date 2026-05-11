#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import Papa from "papaparse";
import xlsx from "xlsx";

const DEFAULT_SOURCE = "data/localstorage-fixtures/classApp_v2.5.json";

function parseArgs(argv) {
  const [command = "export", ...rest] = argv;
  const options = {};

  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i];
    if (!arg.startsWith("--")) continue;

    const [key, inlineValue] = arg.slice(2).split("=");
    if (inlineValue !== undefined) {
      options[key] = inlineValue;
      continue;
    }

    const next = rest[i + 1];
    if (!next || next.startsWith("--")) {
      options[key] = "true";
      continue;
    }

    options[key] = next;
    i += 1;
  }

  return { command, options };
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readSourcePayload(sourcePath) {
  if (!fs.existsSync(sourcePath)) {
    return {
      seating: { left: [], right: [] },
      fixedMembers: [],
      conflictGraph: {},
      dayOffs: [],
      excludedMembers: [],
      generatedAt: new Date().toISOString(),
    };
  }

  return JSON.parse(fs.readFileSync(sourcePath, "utf8"));
}

function collectSeatingRows(payload) {
  const fixedSet = new Set(payload.fixedMembers || []);
  const rows = [];

  for (const side of ["left", "right"]) {
    const sideRows = payload?.seating?.[side] || [];

    sideRows.forEach((row, rowIndex) => {
      (row || []).forEach((seat, seatIndex) => {
        rows.push({
          side,
          row: rowIndex + 1,
          seat: seatIndex + 1,
          id: seat?.id || "",
          name: seat?.name || "",
          width: seat?.width ?? 1,
          merged: Boolean(seat?.merged),
          fixed: fixedSet.has(seat?.id),
        });
      });
    });
  }

  return rows;
}

function collectShiftRows(payload) {
  const dayOffRows = (payload.dayOffs || []).map((entry, index) => ({
    type: "dayOff",
    order: index + 1,
    value: typeof entry === "string" ? entry : JSON.stringify(entry),
  }));

  const excludedRows = (payload.excludedMembers || []).map((entry, index) => ({
    type: "excludedMember",
    order: index + 1,
    value: typeof entry === "string" ? entry : JSON.stringify(entry),
  }));

  return [...dayOffRows, ...excludedRows];
}

function exportData({ sourcePath, outDir, formats }) {
  ensureDir(outDir);
  const payload = readSourcePayload(sourcePath);

  const seatingRows = collectSeatingRows(payload);
  const shiftRows = collectShiftRows(payload);

  if (formats.has("json")) {
    fs.writeFileSync(
      path.join(outDir, "fixtures.json"),
      JSON.stringify(payload, null, 2),
    );
    fs.writeFileSync(
      path.join(outDir, "seating.json"),
      JSON.stringify(seatingRows, null, 2),
    );
    fs.writeFileSync(
      path.join(outDir, "shifts.json"),
      JSON.stringify(shiftRows, null, 2),
    );
  }

  if (formats.has("csv")) {
    fs.writeFileSync(
      path.join(outDir, "seating.csv"),
      Papa.unparse(seatingRows),
    );
    fs.writeFileSync(path.join(outDir, "shifts.csv"), Papa.unparse(shiftRows));
  }

  if (formats.has("xlsx")) {
    const workbook = xlsx.utils.book_new();
    const seatingSheet = xlsx.utils.json_to_sheet(seatingRows);
    const shiftsSheet = xlsx.utils.json_to_sheet(shiftRows);
    xlsx.utils.book_append_sheet(workbook, seatingSheet, "Seating");
    xlsx.utils.book_append_sheet(workbook, shiftsSheet, "Shifts");
    xlsx.writeFile(workbook, path.join(outDir, "fixtures.xlsx"));
  }

  fs.writeFileSync(
    path.join(outDir, "manifest.json"),
    JSON.stringify(
      {
        source: sourcePath,
        formats: [...formats],
        generatedAt: new Date().toISOString(),
        counts: {
          seatingRows: seatingRows.length,
          shiftRows: shiftRows.length,
        },
      },
      null,
      2,
    ),
  );
}

function restoreData({ sourcePath, targetPath }) {
  const payload = readSourcePayload(sourcePath);
  ensureDir(path.dirname(targetPath));
  fs.writeFileSync(targetPath, JSON.stringify(payload, null, 2));
}

const { command, options } = parseArgs(process.argv.slice(2));

if (command === "export") {
  const sourcePath =
    options.source || process.env.BACKUP_SOURCE_JSON || DEFAULT_SOURCE;
  const outDir = options.outdir || path.join("backups", "latest");
  const formats = new Set(
    (options.formats || "json,csv,xlsx")
      .split(",")
      .map((item) => item.trim().toLowerCase()),
  );
  exportData({ sourcePath, outDir, formats });
  process.exit(0);
}

if (command === "restore") {
  const sourcePath =
    options.source || path.join("backups", "latest", "fixtures.json");
  const targetPath =
    options.target || path.join("backups", "latest", "restored.json");
  restoreData({ sourcePath, targetPath });
  process.exit(0);
}

console.error(`Unsupported command: ${command}`);
process.exit(1);
