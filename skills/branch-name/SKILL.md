---
name: branch-name
description: Generate one concise Git branch name based on the actual changes made. Use when creating a branch name for completed or planned code changes.
---

# Branch Name

Generate exactly one branch name based on the changes.

## Rules

- Base the name on the main purpose of the changes.
- Keep it short, clear, and specific.
- Use lowercase.
- Use hyphens between words.
- Do not use spaces.
- Do not generate multiple options.
- Do not include explanations before or after the branch name.
- Do not invent work that is not part of the changes.
- If several related changes exist, summarize the main intent.

Prefer:

```text
fix/provider-config-validation
```

Avoid:

```text
changes
```

If the project uses branch prefixes, use the appropriate one:

- `feat/`
- `fix/`
- `refactor/`
- `chore/`
- `docs/`
- `test/`

## Final output

Return only the single branch name.
