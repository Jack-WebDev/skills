---
name: layman-it
description: Rewrite comments, documentation, explanations, PR text, TODOs, and other developer-facing text in simple language that a non-expert can understand.
---

# Layman It

Write for understanding, not for sounding technical.

## Rules

- Use simple, everyday language.
- Keep sentences short and clear.
- Explain what something does before explaining how it works.
- Explain why something exists when the reason is not obvious.
- Avoid jargon where possible.
- If jargon is necessary, explain it immediately.
- Do not assume the reader understands the architecture, framework, protocol,
  database, runtime, or implementation.
- Prefer concrete examples over abstract explanations.
- Explain cause and effect clearly.
- Do not comment obvious code.

## Comments

Comments should explain what the code itself does not make obvious, especially
why something is being done.

Avoid:

```ts
// Invalidate the cache to prevent stale reads.
```
