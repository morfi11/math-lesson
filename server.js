// Tiny static server for the math lesson - no dependencies.
const http = require("http");
const fs = require("fs");
const path = require("path");
const { MsEdgeTTS, OUTPUT_FORMAT } = require("msedge-tts");

const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, "public");
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
};

// ---------- read aloud: Hebrew speech generated here, so it works on any device ----------
// Microsoft Edge's online read-aloud voices (no key). Unofficial endpoint: if it
// ever stops working, the page falls back to the device's own Hebrew voice.
const VOICES = { hila: "he-IL-HilaNeural", avri: "he-IL-AvriNeural" };
const MAX_TEXT = 1500;
const cache = new Map(); // key -> Promise<Buffer>; same paragraph is generated once
const CACHE_MAX = 500;

const xmlEscape = (t) =>
  t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

async function synthesize(text, voice) {
  const tts = new MsEdgeTTS();
  try {
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    const { audioStream } = tts.toStream(xmlEscape(text), { rate: "-10%" });
    const chunks = [];
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("speech timed out")), 30000);
      audioStream.on("data", (c) => chunks.push(c));
      audioStream.once("end", () => { clearTimeout(timer); resolve(); });
      audioStream.once("error", (e) => { clearTimeout(timer); reject(e); });
    });
    const buf = Buffer.concat(chunks);
    if (!buf.length) throw new Error("no audio received");
    return buf;
  } finally {
    tts.close();
  }
}

function speech(text, voice) {
  const key = voice + "|" + text;
  if (!cache.has(key)) {
    if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value);
    const p = synthesize(text, voice);
    p.catch(() => cache.delete(key)); // don't keep failures
    cache.set(key, p);
  }
  return cache.get(key);
}

function json(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

async function handleTts(req, res) {
  const params = new URL(req.url, "http://x").searchParams;
  const text = (params.get("t") || "").trim();
  const voice = VOICES[params.get("v")] || VOICES.hila;
  if (!text) return json(res, 400, { error: "missing text" });
  if (text.length > MAX_TEXT) return json(res, 413, { error: "text too long" });
  if (!/[\u0590-\u05FF]/.test(text)) return json(res, 400, { error: "Hebrew text only" });
  try {
    const audio = await speech(text, voice);
    res.writeHead(200, {
      "Content-Type": "audio/mpeg",
      "Content-Length": audio.length,
      "Cache-Control": "public, max-age=86400",
    });
    res.end(audio);
  } catch (e) {
    console.error("tts failed:", e && e.message);
    json(res, 502, { error: "speech service failed", detail: String(e && e.message) });
  }
}

let ttsStatus = { ok: null };
async function ttsSelfTest() {
  const t0 = Date.now();
  try {
    const buf = await speech("שלום אופיר", VOICES.hila);
    ttsStatus = { ok: true, bytes: buf.length, ms: Date.now() - t0 };
  } catch (e) {
    ttsStatus = { ok: false, error: String(e && e.message) };
  }
  console.log("tts self-test:", JSON.stringify(ttsStatus));
}

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);
    if (urlPath === "/health") return json(res, 200, { ok: true, tts: ttsStatus });
    if (urlPath === "/tts") {
      if (req.method !== "GET") return json(res, 405, { error: "GET only" });
      return handleTts(req, res);
    }
    let file = path.normalize(path.join(ROOT, urlPath));
    if (!file.startsWith(ROOT)) {
      res.writeHead(403);
      return res.end();
    }
    if (urlPath.endsWith("/")) file = path.join(file, "index.html");
    fs.readFile(file, (err, data) => {
      if (err) {
        // Single-page app: unknown paths fall back to the index page.
        return fs.readFile(path.join(ROOT, "index.html"), (err2, html) => {
          if (err2) {
            res.writeHead(500);
            return res.end("server error");
          }
          res.writeHead(200, { "Content-Type": TYPES[".html"] });
          res.end(html);
        });
      }
      res.writeHead(200, {
        "Content-Type": TYPES[path.extname(file)] || "application/octet-stream",
        "Cache-Control": "no-cache",
      });
      res.end(data);
    });
  })
  .listen(PORT, "0.0.0.0", () => {
    console.log(`math-lesson listening on ${PORT}`);
    ttsSelfTest();
  });
