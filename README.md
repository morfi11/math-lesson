# Math lesson – coordinate system (grade 7)

A small standalone web app for Ofir: questions 16–22 from pages 29–30
(segments parallel to the axes, perimeters and areas). Each question shows
the full drawing and full text. Parts can have step-by-step hints (each one
can include its own drawing), a full solution and an answer check.

Nothing here depends on the trading dashboard. It's plain HTML/JS served by a
zero-dependency Node server (`server.js`).

- Content: `public/questions.js` (`$...$` = math / coordinates, `**...**` = bold)
- Figures are data rendered to SVG by `renderFigure()` in `public/app.js`
- Run locally: `cd math-lesson && npm start`, then open http://localhost:3000

## Railway

A separate service in the same repo, with **Root Directory = `math-lesson`**.
Railway detects Node and runs `npm start`. Health check: `/health`.
