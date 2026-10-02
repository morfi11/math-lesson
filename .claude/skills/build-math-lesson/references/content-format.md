# Content format (public/questions.js)

All content is plain data. `app.js` renders it, so a new lesson is mostly data.

## Text conventions

| Write | Renders as |
|---|---|
| `$(2,4)$`, `$AB$`, `$7-2=5$`, `ה-$x$` | math, left-to-right isolated inside Hebrew text |
| `**מילה**` | bold |
| `<br>` | line break |
| `<span class='nw'>① $(4,6)$</span>` | an item that never wraps internally |
| `<span class='tag blue'>אפשרות 1</span>` | coloured tag (`blue` / `orange`) matching figure fills |
| `2½`, `3.25` | fractions/decimals (use ½ the way the book writes it) |

## Lesson shape

```js
const LESSON = { title: "מערכת צירים", subtitle: "פרק 3: ..." };

const LEARN = {
  keyIdeas: [{ title, body, figure }],          // "what to remember" cards
  intro: "the book's intro paragraph",
  examples: [{ num, text, figure, solution: ["step", ...], solutionFigure }],
};

const QUESTIONS = [{
  num: 16, page: 29,
  text: "question stem, verbatim",
  figure: { ... },
  parts: [{
    label: "א", star: true,                     // star = the book's ★
    text: "part text, verbatim",
    check: { ... },                             // see below
    hints: [{ title: "רמז 1 – ...", body, figure? }],
    solution: { steps: ["...", "**התשובה:** ..."], figure? },
  }],
}];
```

A part with no `hints` shows "רמזים והסברים יתווספו בהמשך" (for skeleton mode).

## Answer checks (`check.kind`)

| kind | Use for | Data |
|---|---|---|
| `single` | one choice, yes/no, which side | `options: [{ text, correct }]`, `right`, `wrong` |
| `multi` | "choose all the points that…" | same as `single` |
| `fields` | numeric blanks: missing coordinates, lengths, area, perimeter | `fields: [{ label: "$A$: $y=$", answer: 12 }]`, `right`, optional `wrong` |
| `point` | "write a point that…" (many right answers) | `validate: (x, y) => ""` when right, else **the reason** it's wrong; `right` may contain `{p}` |
| `table` | classify several items (inside / on a side / outside) | `choices: [...]`, `rows: [{ label, answer: choiceIndex }]`, `right` |

- Number input accepts `2.5`, `2½`, `5/2`.
- For `point`, write a specific reason for each kind of mistake (outside, on a side
  instead of inside, a vertex), and test `validate` in node with several points.
- For `fields`, split a calculation into its steps (side, side, then area) so the
  feedback shows which step is wrong.
- Feedback speaks to Ofir (feminine), and the `right` message restates the answer.

## Figures

```js
{ xMax, yMax,                 // world size; the origin is at the bottom-left
  grid: true, ticks: true,    // grid = equal scale and grid lines; ticks = axis numbers
  width: 320, height?,        // px; height defaults to 0.85 × width
  items: [ ... ] }
```

Tall grids (more than 10 units) automatically label every other tick.
Helper: `rect(x1, y1, x2, y2, fill)` makes an axis-parallel rectangle polygon.

| item | fields | notes |
|---|---|---|
| `point` | `x, y, label, pos, color` | `pos`: n s e w ne nw se sw. `color`: `good` (green), `bad` (red), `edge` (amber), or default ink. Labels are LTR. |
| `segment` | `from, to, strong` | `strong` = thick purple highlight |
| `polygon` | `pts, fill, label, labelAt` | `fill`: `none` / `soft` / `blue` / `orange`; `label` is Hebrew, drawn RTL |
| `guides` | `x, y, toX, toY, color` | dashed lines from the point to the axes, to show where its coordinates come from |
| `dim` | `from, to, text, off, color` | length marker beside a horizontal/vertical segment. `off` in px: horizontal −16 = above; vertical +16 = right |
| `text` | `x, y, text, rtl, color` | free label. Hebrew needs `rtl: true`; never mix Hebrew and numbers in one item |

Draw order: listed order, with all labels on top. Put `guides` first.

## Writing hints (pattern that worked)

1. **What does the drawing tell us?** Read off the coordinates, with a grid and ticks.
2. **The rule.** For example, parallel to the x-axis means the same y, and the
   length is the difference of the x values.
3. **The picture.** Show the cases or regions with coloured fills, e.g. "the square
   can be above *or* below AB".
4. **The bounds.** Spell out the ranges ("x between 2 and 4 **and** y between 4
   and 6"), then hand back with "עכשיו נסי לבדוק…".

The solution checks every option one by one (✓/✗ with the reason), and ends with
`**התשובה:** …`. Its figure marks right points green and wrong ones red.
