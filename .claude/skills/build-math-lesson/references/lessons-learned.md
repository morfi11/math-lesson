# Lessons learned (each cost a round-trip — don't repeat them)

## Hebrew / RTL rendering
- **Coordinates flip in RTL.** `(2,4)` inside Hebrew text displays as `(4,2)` unless
  wrapped. That's what `$...$` is for (`.m { direction: ltr; unicode-bidi: isolate }`).
- **SVG text ignores `dir` on the `<svg>`.** Every point label needs
  `direction="ltr" unicode-bidi="embed"` (the renderer does this). Without it,
  `(__,50)` shows as `(50,__)` and neighbouring labels collide.
- **Hebrew + numbers in one SVG text element come out reversed**:
  "היקף: 5+3 = 16" renders as "16 = 3+5 :היקף". Use two items, a Hebrew one
  (`rtl: true`) and a math one.
- Colour names used for *points* must be plain strings in `COLORS`. `blue` and
  `orange` are `[fill, stroke]` pairs for polygons only; use `edge`/`good`/`bad`
  for points.
- On a phone, numbered point lists wrap mid-item unless each item is wrapped in
  `<span class='nw'>`.

## Read-aloud
- **The browser's own speech (Web Speech API) fails on many computers.** Chrome
  on Windows usually has no Hebrew voice, and the fix is buried in Windows settings
  (Time & language → Speech), not in Chrome, where the user looked. Don't rely on it.
- **The working setup is server-side speech on Railway.** `msedge-tts` with
  `he-IL-HilaNeural` (or `he-IL-AvriNeural`): free and natural, but an
  *unofficial* Microsoft endpoint. Tell the user that. Keep the fallback chain:
  server MP3 → device Hebrew voice → help card. If it breaks for good, the official
  options are Google Cloud TTS or Azure (paid, need a key on Railway).
- **Gemini TTS doesn't list Hebrew** among its supported languages. Don't build on
  it without verifying first.
- `msedge-tts` puts the text **unescaped** into SSML, so the server must XML-escape it.
- **It needs Node with global Web Crypto.** Railway ran Node 18 when `engines` said
  `>=18`, which failed with "crypto is not defined". Engines is pinned to `22.x`,
  and `globalThis.crypto` is set from `crypto.webcrypto`.
- The sandbox's network blocks Microsoft's speech service (403), so speech can
  **only** be verified on Railway. The server runs a self-test at startup; read it
  with `get-logs` and look for `tts self-test: {"ok":true,...}`.
- Server-side speech also means the spoken text must be good Hebrew. Print
  `toSpeech()` output for every new paragraph in node before shipping.

## Repo, GitHub, Railway
- This is a **separate repo** (morfi11/math-lesson). It was first built inside
  trading-dashboard and moved; don't put lessons back in that repo.
- **Claude can't create GitHub repos** (403 "Resource not accessible by
  integration"), and can't push to a new repo until the user adds it to the
  Claude GitHub App's repository list. Ask for both up front if a new repo is needed.
- Railway project `math-lesson`, service `math-lesson`, root `/`, deploys `main`,
  healthcheck `/health` (which also reports the speech status). Domain:
  https://math-lesson-production.up.railway.app
- Progress lives in `progress.json` on the Railway **volume** mounted at `/data`.
  Without the volume, a redeploy wipes it. `/health` reports
  `progress.volume: true/false`, and the server logs its data dir at startup.
- The sandbox can't open `*.up.railway.app`. Verify with `list-deployments` and
  `get-logs`, and say plainly that the live page wasn't opened.

## Sandbox testing
- Playwright: `chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })`.
  Never run `playwright install`.
- Run the local server with Bash `run_in_background` (`PORT=3123 node server.js`).
  `pkill -f "node server.js"` kills the calling shell too (its own command line
  matches). Kill by PID from `ps aux | grep "node server.js"`.
- Don't `sleep` to wait. Use `until curl -sf localhost:3123/health; do sleep 0.5; done`.
- When clicking buttons in tests, open the hidden solution first; a hidden button
  times out after 30s.
