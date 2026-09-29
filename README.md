# Jack's Agent Skills

A collection of reusable software-engineering skills for coding agents. Each skill is plain Markdown and can be installed independently with the existing [`skills`](https://skills.sh/) CLI.

## Installation

Run the following command and choose the skills and target agents interactively:

```bash
npx skills@latest add Jack-WebDev/skills
```

No runtime package or custom installer is added to your application.

## Claude Code plugin

The repository root is also a Claude Code plugin. Clone it, validate it, and load it for a development session:

```bash
git clone https://github.com/Jack-WebDev/skills.git
cd skills
claude plugin validate . --strict
claude --plugin-dir .
```

The skills are available as `/skills:code-engineering`, `/skills:typescript-best-practices`, and `/skills:react-best-practices`.

## Available skills

| Skill | Purpose |
| --- | --- |
| `code-engineering` | General standards for focused, maintainable production code. |
| `typescript-best-practices` | Version-aware TypeScript guidance for safe contracts and understandable types. |
| `react-best-practices` | Version-aware React guidance for components, state, effects, and accessibility. |

The specialized TypeScript and React skills are designed to compose with `code-engineering`.

## Choose what to install

List the available skills without installing them:

```bash
npx skills@latest add Jack-WebDev/skills --list
```

Install one skill:

```bash
npx skills@latest add Jack-WebDev/skills --skill typescript-best-practices
```

Install several skills:

```bash
npx skills@latest add Jack-WebDev/skills \
  --skill code-engineering typescript-best-practices react-best-practices
```

Add `-y` to skip confirmation prompts.

## Choose an agent or scope

Target a specific supported agent:

```bash
npx skills@latest add Jack-WebDev/skills --agent codex
npx skills@latest add Jack-WebDev/skills --agent claude-code
```

Install globally instead of in the current project:

```bash
npx skills@latest add Jack-WebDev/skills --global
```

## Updates

Update installed skills through the same CLI:

```bash
npx skills@latest update
```

Use `npx skills@latest update <skill-name>` to update one skill, or add `--global` to update global installations.

## Repository validation

Validate every skill's frontmatter, name, description, and directory consistency:

```bash
pnpm validate
```

## Releases

Record a user-facing change before merging it:

```bash
pnpm changeset
```

Set `GITHUB_TOKEN` in the environment, then apply pending changesets to the repository version and changelog:

```bash
pnpm run version
```

After committing the version changes, create the release tag:

```bash
pnpm run release
```

The package is private and is not published to npm. Changesets manages the repository version, changelog, and Git tags.

## Philosophy

- Skills are portable `SKILL.md` files with one clear responsibility.
- General and specialized guidance should compose without unnecessary duplication.
- Existing project architecture and sound conventions should be respected.
- Installed language, framework, and tool versions take precedence over newer conventions.
- Agents should make the smallest coherent change that fully solves the task.
- Consuming projects do not need a runtime dependency from this repository.

## License

[MIT](LICENSE)
