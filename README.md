# Jack's Engineering Skills

Practical, reusable instructions for coding agents. Each skill is a portable
`SKILL.md` file that helps an agent make focused, maintainable changes without
adding a runtime dependency to your project.

## Quick start

Install interactively and choose the skills and agent you want to use:

```bash
npx skills@latest add Jack-WebDev/skills
```

Or install a specific skill directly:

```bash
npx skills@latest add Jack-WebDev/skills --skill code-engineering
```

## Included skills

| Skill | Use it for |
| --- | --- |
| [`branch-name`](skills/branch-name/SKILL.md) | Creating one concise Git branch name from planned or completed work. |
| [`code-engineering`](skills/code-engineering/SKILL.md) | Making production code changes that are focused, safe, and maintainable. |
| [`golang-best-practices`](skills/golang-best-practices/SKILL.md) | Writing, reviewing, and refactoring idiomatic Go. |
| [`layman-it`](skills/layman-it/SKILL.md) | Explaining technical work in plain, approachable language. |
| [`react-best-practices`](skills/react-best-practices/SKILL.md) | Building and reviewing accessible React code that fits the installed stack. |
| [`single-commit-message`](skills/single-commit-message/SKILL.md) | Generating one clear commit message for the actual changes. |
| [`typescript-best-practices`](skills/typescript-best-practices/SKILL.md) | Writing and reviewing clear, version-aware TypeScript. |

The language and framework skills complement `code-engineering`; install them
together when they match your project.

## Installation options

Preview the catalog without installing anything:

```bash
npx skills@latest add Jack-WebDev/skills --list
```

Install several skills at once:

```bash
npx skills@latest add Jack-WebDev/skills \
  --skill code-engineering typescript-best-practices react-best-practices
```

Target a supported agent or install globally:

```bash
npx skills@latest add Jack-WebDev/skills --agent codex
npx skills@latest add Jack-WebDev/skills --agent claude-code
npx skills@latest add Jack-WebDev/skills --global
```

Add `-y` to skip confirmation prompts.

## Claude Code plugin

This repository can also be loaded directly as a Claude Code plugin for a
development session:

```bash
git clone https://github.com/Jack-WebDev/skills.git
cd skills
claude plugin validate . --strict
claude --plugin-dir .
```

The skills are then available with the `skills` plugin namespace, such as
`/skills:code-engineering` and `/skills:react-best-practices`.

## Keeping skills current

Update all installed skills with:

```bash
npx skills@latest update
```

Use `npx skills@latest update <skill-name>` to update only one skill. Add
`--global` if the skills were installed globally.

## Contributing

Skills live in [`skills/`](skills) and must include valid frontmatter. Before
opening a pull request, run:

```bash
pnpm validate
```

For user-facing changes, create a changeset:

```bash
pnpm changeset
```

Maintainers can apply pending changesets and create a Git tag with:

```bash
pnpm run version
pnpm run release
```

The package is private; it is not published to npm. Changesets manages the
repository version, changelog, and Git tags.

## Principles

- Keep changes small, deliberate, and easy to review.
- Prefer clear, established practices over clever abstractions.
- Respect the existing project architecture and installed tool versions.
- Make important contracts and failure cases explicit.

## License

[MIT](LICENSE)
