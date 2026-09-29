import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const skillsRoot = path.resolve("skills");
const skillNamePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const errors = [];
const names = new Map();

function readScalar(frontmatter, field) {
  const matches = frontmatter
    .map((line) => line.match(new RegExp(`^${field}:\\s*(.+?)\\s*$`)))
    .filter(Boolean);

  if (matches.length !== 1) {
    return null;
  }

  const value = matches[0][1];
  const quoted = value.match(/^(?:"([^"]*)"|'([^']*)')$/);
  return quoted ? (quoted[1] ?? quoted[2]) : value;
}

function validateSkill(directory, source) {
  const lines = source.replaceAll("\r\n", "\n").split("\n");

  if (lines[0] !== "---") {
    errors.push(`${directory}: SKILL.md must start with YAML frontmatter`);
    return;
  }

  const closingDelimiter = lines.indexOf("---", 1);
  if (closingDelimiter < 2) {
    errors.push(`${directory}: SKILL.md has no closing frontmatter delimiter`);
    return;
  }

  const frontmatter = lines.slice(1, closingDelimiter);
  const name = readScalar(frontmatter, "name");
  const description = readScalar(frontmatter, "description");

  if (!name) {
    errors.push(`${directory}: frontmatter must contain one non-empty name`);
  } else {
    if (!skillNamePattern.test(name)) {
      errors.push(`${directory}: name must use lowercase letters, numbers, and hyphens`);
    }

    if (name !== directory) {
      errors.push(`${directory}: frontmatter name must match its directory`);
    }

    const existingDirectory = names.get(name);
    if (existingDirectory) {
      errors.push(`${directory}: duplicate name '${name}' also used by ${existingDirectory}`);
    } else {
      names.set(name, directory);
    }
  }

  if (!description || description.trim().length < 10) {
    errors.push(`${directory}: frontmatter must contain one useful description`);
  }

  if (!lines.slice(closingDelimiter + 1).some((line) => line.trim())) {
    errors.push(`${directory}: SKILL.md must contain instructions after its frontmatter`);
  }
}

let entries;

try {
  entries = await readdir(skillsRoot, { withFileTypes: true });
} catch (error) {
  console.error(`Unable to read ${skillsRoot}: ${error.message}`);
  process.exit(1);
}

const skillDirectories = entries
  .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
  .map((entry) => entry.name)
  .sort();

if (skillDirectories.length === 0) {
  errors.push("skills: no skill directories found");
}

for (const directory of skillDirectories) {
  const skillFile = path.join(skillsRoot, directory, "SKILL.md");

  try {
    validateSkill(directory, await readFile(skillFile, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") {
      errors.push(`${directory}: missing SKILL.md`);
    } else {
      errors.push(`${directory}: unable to read SKILL.md: ${error.message}`);
    }
  }
}

if (errors.length > 0) {
  console.error("Skill validation failed:\n");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Validated ${skillDirectories.length} skills: ${[...names.keys()].join(", ")}`);
