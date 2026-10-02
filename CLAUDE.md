# Working notes for Claude

This repo is Ofir's interactive Hebrew math lesson app (grade 7), deployed by
Railway from `main` (https://math-lesson-production.up.railway.app).

For any new lesson, new questions, hints, drawings or read-aloud work, follow the
`build-math-lesson` skill in `.claude/skills/build-math-lesson/`. Read its
references before writing content or touching speech, SVG text or deploy settings.

- Push straight to `main`; Railway deploys it. No pull request is needed.
- Commit messages go through `git commit -F <file>`.
