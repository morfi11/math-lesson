---
name: build-math-lesson
description: Build or extend an interactive Hebrew math lesson for Ofir (grade 7) from photos of textbook pages - every question with its full drawing and text, step-by-step hints, full solutions, answer checks, read-aloud, and drawings with coordinates and lengths - then deploy it on Railway. Use when the user sends workbook/textbook pages and asks for a lesson, practice app, hints or explanations, or asks to add questions or a new topic to the math lesson app.
---

# Building a math lesson

The app lives in **morfi11/math-lesson** (its own repo, deployed by Railway from `main`).
It is the template for every new lesson: reuse its renderer, check types, speech and
deploy setup rather than starting over. Read `references/content-format.md` before
writing content, and `references/lessons-learned.md` before touching speech, SVG text,
Railway or GitHub.

## Who it's for

- **Ofir, a girl in grade 7 (כיתה ז).** The material is usually brand new to her.
- Hints, feedback and solutions **speak to her directly, in feminine singular**
  (נסי, בחרי, כל הכבוד אופיר!). Question text stays **verbatim from the book**
  (usually plural: חשבו, מצאו).
- Tone: warm, short sentences, one idea per hint, emoji in feedback only (🎉 👏 ⭐).
- The parent reviews everything. Finish all of it, then hand over one link to check.

## Workflow

1. **Transcribe the pages exactly.** Every question number, part label (א, ב, ג…),
   star (★), page number, and every given value. Rebuild every drawing as data
   (see the figure format).
   - If a drawing has unlabelled points (e.g. two dots on a grid), read their
     coordinates from the photo and **tell the user which values you inferred**,
     so they can check them against the book.
   - Solve every part yourself before writing hints, and flag ambiguities. Example:
     "is a point on the side *inside* the square?" The book means no (inside means
     strictly inside), and the solution says so explicitly.
2. **Explanation page (הסבר ודוגמאות)** comes first:
   - "What to remember" cards: the key rules of the topic, each with a drawing.
   - The book's intro paragraph and worked examples, verbatim, each with a "show
     solution" toggle and a solution drawing.
   - A 🔊 read-aloud button next to every paragraph.
3. **Questions.** Each one gets its own page showing the full text, the drawing, and
   every part. Each part has:
   - an **answer check**: pick the check type that fits the part (see the format
     reference)
   - **progressive hints**, 2–4 per part, revealed one at a time ("רמז 1 מתוך 3").
     Each hint is one step of reasoning, and hints that show a picture get their
     own drawing.
   - a **full solution**: numbered steps, plus a drawing when it helps
   If the user asks for a skeleton first, put every question in with full text and
   drawings, and hints for one question only. Mark the rest "רמזים – בקרוב".
   Answers, checked results, opened/minimized/closed hints and open solutions are
   **saved automatically and shared across devices**:
   - Each part's state (id `q<num>p<partIndex>`) is kept in localStorage and synced
     to the server's `/api/progress` (a JSON file on the Railway volume at `/data`).
   - Merging is per part, and the newest change wins (`t` timestamp). A reset
     writes an empty, time-stamped state, not a delete, so it reaches the other
     devices too.
   - Never renumber questions or reorder parts in a lesson she has started, or her
     saved answers attach to the wrong part. Add new parts at the end instead.
   - When lessons become multiple, prefix ids with the lesson id
     (`<lesson>:q<num>p<n>`) and widen the server's id check (`/^q\d+p\d+$/`).
4. **Drawings everywhere they help.** Points labelled with coordinates, dashed
   guides to the axes, length markers labelled with the arithmetic (`7 − 2 = 5`).
   Question figures are drawn to scale. Use a grid only when the book has one,
   because a scaled grid can give the answer away.
5. **Test in a real browser** (Playwright with `/opt/pw-browsers/chromium`):
   - Click every hint and solution button.
   - Submit right *and* wrong answers to every check.
   - Screenshot at 1000px and 390px (phone), and look at the screenshots.
   - Look in particular at reversed text and overlapping labels.
6. **Commit and push to `main`** of morfi11/math-lesson. Railway deploys it in about
   a minute. Confirm with Railway `list-deployments` (status SUCCESS), and check
   `get-logs` for the `tts self-test` line. The sandbox can't open the live URL,
   so say what was verified and what wasn't.

## Adding a new lesson / topic

The app currently holds one lesson: `LESSON`, `LEARN`, `QUESTIONS` in
`public/questions.js`. The first time a second lesson is added:

- Move each lesson to `public/lessons/<id>.js`.
- Add a lesson picker on the home page.
- Route as `#/<lesson>/learn` and `#/<lesson>/q/<n>`.

Keep everything else shared (renderer, checks, speech). Ask the user only if they
want a separate app for some reason; by default it's one app.

## Hebrew math-text rules (summary — details in references)

- In content strings, `$...$` marks math/coordinates. It renders as an LTR-isolated
  span; without it, `(2,4)` flips to `(4,2)` in RTL text. Write `ה-$x$`, `$(2,4)$`,
  `$AB$`, `$7-2=5$`.
- In SVG, point labels are forced LTR. **Never put Hebrew and numbers in one SVG
  text element.** Use two text items: a Hebrew one with `rtl: true` and a math one.
- Keep numbered point lists from wrapping mid-item:
  `<span class='nw'>① $(4,6)$</span>`.

## Read-aloud (summary)

- Speech is generated **on the server**: `GET /tts?t=<text>` returns an MP3 from
  the Hebrew neural voice `he-IL-HilaNeural`, using the `msedge-tts` package with
  no key. Each paragraph is cached.
- The page falls back to the device's own Hebrew voice. If it has none, it shows a
  help card instead of reading gibberish.
- `toSpeech()` in `app.js` rewrites math for speaking:
  - `(2,4)` → "2 פסיק 4", `x`/`y` → איקס/וואי
  - point letters → their Hebrew names (אם, פי, קיי…)
  - operators → פחות/ועוד/כפול/חלקי/שווה, `←` → "ולכן", `(א)` → "סעיף א"
- When new notation appears (fractions, powers, angles, ≤, %), **extend `toSpeech`**
  and print the converted text in node to check it before shipping.
