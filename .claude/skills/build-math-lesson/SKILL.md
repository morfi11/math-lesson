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
   **Bonus questions** (when asked for extra practice):
   - Add them at the end of `QUESTIONS` with `bonus: n` and the next free `num`
     (they show as "⭐ בונוס n", gold, in their own home-page section).
   - Use the same question types as the book, but give the **minimum data**
     and let her find everything else. For example: one vertex and two lengths,
     one vertex and a perimeter, or two vertices and an area (working
     backwards: $30 : 6 = 5$).
   - Use fresh numbers and a different vertex position each time, e.g. top-left
     instead of bottom-left, so she has to subtract as well as add.
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

## Adding a new chapter

The app is a list of **chapters** (`CHAPTERS`). The start page is a chapter picker,
and the routes are `#/c/<id>`, `#/c/<id>/learn` and `#/q/<num>`.

- **Chapter 1** (coordinate system) lives in `public/questions.js`, which also
  creates `CHAPTERS`.
- **Every later chapter** is its own file. For example, `public/angles.js` builds
  its LEARN and QUESTIONS and ends with `CHAPTERS.push({ id, icon, short, title,
  subtitle, learnBlurb, learn, questions })`. Add a `<script>` tag for it in
  `index.html`, after `questions.js` and before `app.js`.
- **Question numbers must be unique across the whole app**, because they key the
  saved progress. Give each chapter its own block of hundreds (angles uses
  101–103, so the next chapter starts at 201). Set `shown: 1, 2, 3…` for the
  number she sees.
- When the user asks for questions "based on the book", write **new** questions
  of the same types as the book's, with explanations and hints built from the
  book's own definitions and examples. Say which book questions each one is
  modelled on.

## Reading the textbook

The user's textbook (Mishbetzet / Gabi Yekuel, "כיתה ז' – חלק א' – סדרת אולימפוס –
תוכנית חדשה") is a FlippingBook on www.yakoel.com, and that host must be in the
environment's allowed domains. See `references/lessons-learned.md` for how to
download and render its pages.

So far:
- **Unit א:** chapters 16–19, variables and algebraic expressions (that unit's
  summary ends on printed page 225).
- **Unit ב, זוויות:**
  - 20 זיהוי זוויות וסוגי זוויות (p. 227)
  - 21 סימון זוויות בכתיב מתמטי (p. 233)
  - 22 השוואה בין גדלים של זוויות (p. 239)
  - 23 מדידה של זוויות (p. 244)
  - 24 סכום והפרש זוויות (p. 252)
  - 25 (not checked yet)
  - 26 זוויות צמודות
  - 27 זוויות קודקודיות (p. 282)

The coordinate-system pages (29–30) came from a different Mishbetzet booklet.

**Done in the app's angles chapter:** chapter 20 (questions 1–3, nums 101–103) and
chapter 21 (questions 4–6, nums 104–106). The next is chapter 22, comparing angle
sizes (p. 239). Continue the numbering at 107, and add each chapter's key ideas to
the same explanation page.

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
