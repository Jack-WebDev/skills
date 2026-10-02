---
name: single-commit-message
description: Generate one clear commit message based on the actual changes made. Use when summarizing completed code changes into a single Git commit message.
---

# Single Commit Message

Generate exactly one commit message for the changes.

## Rules

- Base the message on the actual changes made.
- Describe the main purpose of the change, not every file touched.
- Keep it concise and specific.
- Use imperative wording.
- Do not generate multiple options.
- Do not include explanations before or after the commit message.
- Do not invent changes that were not made.
- If several related changes were made, summarize them under the main intent.
- Prefer a meaningful message over vague wording.

Avoid:

```text
update files
```

Prefer:

```text
simplify provider configuration handling
```

If the project uses Conventional Commits, follow that format:

```text
feat: add provider configuration validation
```

Otherwise, use a normal concise commit message.

## Final output

Return only the single commit message.
