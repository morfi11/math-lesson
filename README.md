# Math lesson – coordinate system (grade 7)

A small standalone web app for Ofir: questions 16–22 from pages 29–30
(segments parallel to the axes, perimeters and areas). Each question shows
the full drawing and full text. Parts can have step-by-step hints (each one
can include its own drawing), a full solution and an answer check.

It's plain HTML/JS served by a zero-dependency Node server (`server.js`).

- Content: `public/questions.js` (`$...$` = math / coordinates, `**...**` = bold)
- Figures are data rendered to SVG by `renderFigure()` in `public/app.js`
- Run locally: `npm start`, then open http://localhost:3000

## Railway

Railway project `math-lesson`, deployed from `main` of this repo.
Railway detects Node and runs `npm start`. Health check: `/health`.
