#!/usr/bin/env node
// Copies package.json's version into each plugin manifest.
// Runs as part of `pnpm run version`, immediately after `changeset version`.
// With --check it changes nothing and exits 1 if any version differs.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..");
const pluginPaths = [
  join(repo, ".codex-plugin", "plugin.json"),
  join(repo, ".claude-plugin", "plugin.json"),
];

const { version } = JSON.parse(readFileSync(join(repo, "package.json"), "utf8"));
const checkOnly = process.argv.includes("--check");
let versionsMatch = true;

for (const pluginPath of pluginPaths) {
  const source = readFileSync(pluginPath, "utf8");
  const plugin = JSON.parse(source);
  const label = pluginPath.slice(repo.length + 1);

  if (plugin.version === version) {
    console.log(`${label} version is ${version} (already in sync)`);
    continue;
  }

  if (checkOnly) {
    console.error(
      `${label} version is ${plugin.version}, package.json is ${version}. Run \`node scripts/sync-plugin-version.mjs\`.`,
    );
    versionsMatch = false;
    continue;
  }

  // Rewrite only the version line, to keep the key order and formatting.
  const updated = source.replace(
    /("version"\s*:\s*")[^"]*(")/,
    `$1${version}$2`,
  );

  if (JSON.parse(updated).version !== version) {
    console.error(`Could not find a version field to replace in ${label}.`);
    process.exit(1);
  }

  writeFileSync(pluginPath, updated);
  console.log(`${label} version ${plugin.version} -> ${version}`);
}

if (!versionsMatch) {
  process.exit(1);
}
