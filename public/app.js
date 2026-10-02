// Single-page app: hash routes #/ (home), #/learn, #/q/<num>.

// ---------- text formatting ----------
function fmt(s) {
  return String(s)
    .replace(/\$([^$]+)\$/g, '<span class="m">$1</span>')
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
}

// ---------- coordinate-system figure renderer ----------
const COLORS = {
  point: "#1f2335",
  good: "#17a35a",
  bad: "#e0434b",
  edge: "#d97706",
  blue: ["rgba(59,130,246,0.18)", "#3b82f6"],
  orange: ["rgba(240,138,36,0.22)", "#f08a24"],
  soft: ["rgba(91,79,214,0.12)", "#1f2335"],
  none: ["none", "#1f2335"],
};
const LABEL_POS = {
  n: [0, -12, "middle"], s: [0, 22, "middle"], e: [10, 5, "start"], w: [-10, 5, "end"],
  ne: [8, -10, "start"], nw: [-8, -10, "end"], se: [8, 20, "start"], sw: [-8, 20, "end"],
};

function renderFigure(fig) {
  const W = fig.width || 320;
  const H = fig.height || Math.round(W * 0.85);
  const padL = 34, padR = 26, padT = 26, padB = 30;
  let sx = (W - padL - padR) / fig.xMax;
  let sy = (H - padT - padB) / fig.yMax;
  if (fig.grid) sx = sy = Math.min(sx, sy); // squares must look square on a grid
  const X = (x) => padL + x * sx;
  const Y = (y) => H - padB - y * sy;
  const out = [];

  if (fig.grid) {
    for (let i = 0; i <= fig.xMax; i++)
      out.push(`<line x1="${X(i)}" y1="${Y(0)}" x2="${X(i)}" y2="${Y(fig.yMax)}" stroke="#dcdbea" stroke-width="1"/>`);
    for (let j = 0; j <= fig.yMax; j++)
      out.push(`<line x1="${X(0)}" y1="${Y(j)}" x2="${X(fig.xMax)}" y2="${Y(j)}" stroke="#dcdbea" stroke-width="1"/>`);
  }
  if (fig.ticks) {
    // tall grids get every other number, or the labels run into each other
    const step = Math.max(fig.xMax, fig.yMax) > 10 ? 2 : 1;
    for (let i = step; i <= fig.xMax; i += step)
      out.push(`<text x="${X(i)}" y="${Y(0) + 16}" font-size="12" text-anchor="middle" fill="#6b7086">${i}</text>`);
    for (let j = step; j <= fig.yMax; j += step)
      out.push(`<text x="${X(0) - 8}" y="${Y(j) + 4}" font-size="12" text-anchor="end" fill="#6b7086">${j}</text>`);
  }

  // axes with arrow heads
  const ax = X(fig.xMax) + 14, ay = Y(fig.yMax) - 14;
  out.push(`<line x1="${X(0)}" y1="${Y(0)}" x2="${ax}" y2="${Y(0)}" stroke="#1f2335" stroke-width="1.6"/>`);
  out.push(`<line x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="${ay}" stroke="#1f2335" stroke-width="1.6"/>`);
  out.push(`<path d="M${ax},${Y(0)} l-8,-4 v8 z" fill="#1f2335"/>`);
  out.push(`<path d="M${X(0)},${ay} l-4,8 h8 z" fill="#1f2335"/>`);
  out.push(`<text x="${ax}" y="${Y(0) + 18}" font-size="15" font-style="italic" text-anchor="middle">x</text>`);
  out.push(`<text x="${X(0) - 12}" y="${ay + 4}" font-size="15" font-style="italic" text-anchor="middle">y</text>`);
  out.push(`<text x="${X(0) - 8}" y="${Y(0) + 16}" font-size="13" text-anchor="end">0</text>`);

  const labels = [];
  for (const it of fig.items || []) {
    if (it.type === "polygon") {
      const [fill, stroke] = COLORS[it.fill || "none"];
      const pts = it.pts.map(([x, y]) => `${X(x)},${Y(y)}`).join(" ");
      out.push(`<polygon points="${pts}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`);
      if (it.label) {
        const [lx, ly] = it.labelAt;
        labels.push(`<text x="${X(lx)}" y="${Y(ly) + 5}" font-size="13" text-anchor="middle" fill="${stroke}" font-weight="500" direction="rtl">${it.label}</text>`);
      }
    } else if (it.type === "guides") {
      // dashed lines from a point down to the x-axis and across to the y-axis
      const c = COLORS[it.color] || "#8b84e8";
      const dash = `stroke="${c}" stroke-width="1.5" stroke-dasharray="4 4"`;
      if (it.toX !== false) out.push(`<line x1="${X(it.x)}" y1="${Y(it.y)}" x2="${X(it.x)}" y2="${Y(0)}" ${dash}/>`);
      if (it.toY !== false) out.push(`<line x1="${X(it.x)}" y1="${Y(it.y)}" x2="${X(0)}" y2="${Y(it.y)}" ${dash}/>`);
    } else if (it.type === "dim") {
      // length marker next to a horizontal or vertical segment: |<-- text -->|
      const [x1, y1] = it.from, [x2, y2] = it.to;
      const c = COLORS[it.color] || "#d9480f";
      const off = it.off ?? -16; // pixels; horizontal: negative = above, vertical: positive = right
      const st = `stroke="${c}" stroke-width="1.6"`;
      const txt = (x, y, anchor) =>
        labels.push(`<text x="${x}" y="${y}" font-size="14" font-weight="700" text-anchor="${anchor}" fill="${c}" direction="ltr" ` +
          `paint-order="stroke" stroke="#fff" stroke-width="4" stroke-linejoin="round">${it.text}</text>`);
      if (y1 === y2) {
        const yy = Y(y1) + off, a = X(x1), b = X(x2);
        out.push(`<line x1="${a}" y1="${yy}" x2="${b}" y2="${yy}" ${st}/>`,
          `<line x1="${a}" y1="${yy - 5}" x2="${a}" y2="${yy + 5}" ${st}/>`,
          `<line x1="${b}" y1="${yy - 5}" x2="${b}" y2="${yy + 5}" ${st}/>`);
        txt((a + b) / 2, off < 0 ? yy - 7 : yy + 17, "middle");
      } else {
        const xx = X(x1) + off, a = Y(y1), b = Y(y2);
        out.push(`<line x1="${xx}" y1="${a}" x2="${xx}" y2="${b}" ${st}/>`,
          `<line x1="${xx - 5}" y1="${a}" x2="${xx + 5}" y2="${a}" ${st}/>`,
          `<line x1="${xx - 5}" y1="${b}" x2="${xx + 5}" y2="${b}" ${st}/>`);
        txt(off > 0 ? xx + 8 : xx - 8, (a + b) / 2 + 5, off > 0 ? "start" : "end");
      }
    } else if (it.type === "segment") {
      const [x1, y1] = it.from, [x2, y2] = it.to;
      const stroke = it.strong ? "#5b4fd6" : "#1f2335";
      out.push(`<line x1="${X(x1)}" y1="${Y(y1)}" x2="${X(x2)}" y2="${Y(y2)}" stroke="${stroke}" stroke-width="${it.strong ? 4 : 2}" stroke-linecap="round"/>`);
    } else if (it.type === "text") {
      // free label, e.g. a side length; Hebrew-safe because `rtl` only applies when asked
      labels.push(
        `<text x="${X(it.x)}" y="${Y(it.y) + 5}" font-size="14" text-anchor="middle" fill="${COLORS[it.color] || "#5b4fd6"}" font-weight="700" ` +
        `direction="${it.rtl ? "rtl" : "ltr"}" paint-order="stroke" stroke="#fff" stroke-width="4" stroke-linejoin="round">${it.text}</text>`
      );
    } else if (it.type === "point") {
      const color = COLORS[it.color] || COLORS.point;
      out.push(`<circle cx="${X(it.x)}" cy="${Y(it.y)}" r="4.5" fill="${color}"/>`);
      if (it.label) {
        const [dx, dy, anchor] = LABEL_POS[it.pos || "ne"];
        labels.push(
          `<text x="${X(it.x) + dx}" y="${Y(it.y) + dy}" font-size="15" text-anchor="${anchor}" fill="${color}" font-weight="500" ` +
          `direction="ltr" unicode-bidi="embed" paint-order="stroke" stroke="#fff" stroke-width="4" stroke-linejoin="round">${it.label}</text>`
        );
      }
    }
  }
  // labels last so they sit on top of shapes
  out.push(...labels);

  return `<div class="figure"><svg dir="ltr" viewBox="0 0 ${W} ${H}" font-family="Rubik, sans-serif" role="img">${out.join("")}</svg></div>`;
}

// ---------- views ----------
const app = document.getElementById("app");

function renderNav(active) {
  const links = [`<a href="#/learn" class="${active === "learn" ? "active" : ""}">📖 הסבר</a>`];
  for (const q of QUESTIONS)
    links.push(`<a href="#/q/${q.num}" class="${active === q.num ? "active" : ""}">${q.num}</a>`);
  document.getElementById("qnav").innerHTML = links.join("");
}

function viewHome() {
  renderNav(null);
  const cards = QUESTIONS.map((q) => {
    const ready = q.parts.some((p) => p.hints);
    const firstLine = q.text.split("<br>")[0];
    return `<a class="qcard" href="#/q/${q.num}">
      <div class="n">שאלה ${q.num}</div>
      <div class="t">${fmt(firstLine)}</div>
      <div>${ready ? '<span class="badge">💡 עם רמזים והסברים</span>' : '<span class="badge soon">רמזים – בקרוב</span>'}
        ${(() => { const sc = questionScore(q); return sc.ok ? `<span class="badge done">✔ ${sc.ok}/${sc.total}</span>` : ""; })()}</div>
    </a>`;
  }).join("");
  app.innerHTML = `
    <h1>${LESSON.title}</h1>
    <p class="sub">${LESSON.subtitle}</p>
    <a class="qcard" href="#/learn" style="margin-bottom:16px">
      <div class="n">📖 הסבר ודוגמאות</div>
      <div class="t">מה צריך לדעת: קטעים המקבילים לצירים, אורך, היקף ושטח – ושתי דוגמאות פתורות.</div>
    </a>
    <h2>שאלות</h2>
    <div class="grid-cards">${cards}</div>`;
}

// ---------- read aloud (Web Speech API, Hebrew voice) ----------
// Latin point names as a Hebrew reader says them.
const LETTER_NAMES = {
  A: "איי", B: "בי", C: "סי", D: "די", I: "איי", K: "קיי", L: "אל", M: "אם", P: "פי", Q: "קיו", T: "טי",
};

// Turn a content string ($math$, **bold**, html) into something a Hebrew voice reads naturally.
function toSpeech(str) {
  const math = (m) =>
    " " +
    m
      .replace(/\((-?[\d.½]+),(-?[\d.½]+)\)/g, " $1 פסיק $2 ")
      .replace(/\(__,__\)/g, " ")
      .replace(/(\d)½/g, "$1 וחצי")
      .replace(/½/g, "חצי")
      .replace(/\bx\b/g, " איקס ")
      .replace(/\by\b/g, " וואי ")
      .replace(/[A-Z]/g, (c) => " " + (LETTER_NAMES[c] || c) + " ")
      .replace(/(\d)\s*[-−]\s*(\d)/g, "$1 פחות $2")
      .replace(/\+/g, " ועוד ")
      .replace(/[×·]/g, " כפול ")
      .replace(/:/g, " חלקי ")
      .replace(/=/g, " שווה ")
      .replace(/</g, " קטן מ ")
      .replace(/>/g, " גדול מ ") +
    " ";
  return String(str)
    .replace(/<br\s*\/?>/g, ". ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\$([^$]+)\$/g, (_, m) => math(m))
    .replace(/\*\*/g, "")
    .replace(/(סעיף\s*)?\(([א-ד])\)/g, "סעיף $2")
    .replace(/ \+ /g, " ועוד ")
    .replace(/ = /g, " שווה ")
    .replace(/ × /g, " כפול ")
    .replace(/ \/ /g, " או ")
    .replace(/←/g, ", ולכן ")
    .replace(/[•✓✗]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/(^|\s)([הולבמש])-\s*/g, "$1$2") // "ה- איקס" -> "האיקס"
    .replace(/\s+([.,?])/g, "$1")
    .replace(/\.{2,}/g, ".")
    .trim();
}

const SAY = [];
let speakingBtn = null;

function sayBtn(text) {
  SAY.push(toSpeech(text));
  return `<button class="say" data-say="${SAY.length - 1}" title="הקראה" aria-label="הקראה">🔊</button>`;
}

function hebrewVoice() {
  return speechSynthesis.getVoices().find((v) => /^he|^iw/i.test(v.lang));
}

let currentAudio = null;

function stopSpeaking() {
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  if (window.speechSynthesis) speechSynthesis.cancel();
  if (speakingBtn) speakingBtn.classList.remove("on", "loading");
  speakingBtn = null;
}

// Speech is generated on our server (Hebrew neural voice), so it works on any device.
// If the server can't, fall back to the device's own Hebrew voice, if it has one.
function speak(btn) {
  const wasThis = speakingBtn === btn;
  stopSpeaking();
  if (wasThis) return; // second tap stops
  const text = SAY[btn.dataset.say];
  speakingBtn = btn;
  btn.classList.add("on", "loading");
  const audio = new Audio("/tts?t=" + encodeURIComponent(text));
  currentAudio = audio;
  const done = () => { if (currentAudio === audio) stopSpeaking(); };
  audio.addEventListener("playing", () => btn.classList.remove("loading"));
  audio.addEventListener("ended", done);
  audio.addEventListener("error", () => {
    if (currentAudio !== audio) return;
    currentAudio = null;
    speakOnDevice(btn, text);
  });
  audio.play().catch(() => {}); // a load failure is handled by the "error" listener
}

function speakOnDevice(btn, text) {
  const v = window.speechSynthesis && hebrewVoice();
  if (!v) { stopSpeaking(); return showNoVoiceHelp(); } // a non-Hebrew voice would read gibberish
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "he-IL";
  u.rate = 0.9;
  u.voice = v;
  u.onend = u.onerror = () => { if (speakingBtn === btn) stopSpeaking(); };
  btn.classList.remove("loading");
  speechSynthesis.speak(u);
}

// Which device is this, so the help names the right steps.
function deviceKind() {
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return "edge";
  if (/iPhone|iPad|Android/.test(ua)) return "phone";
  if (/Windows/.test(ua)) return "windows";
  if (/Mac OS X/.test(ua)) return "mac";
  return "other";
}

function showNoVoiceHelp() {
  const steps = {
    windows:
      "<b>הכי פשוט:</b> לפתוח את האתר בדפדפן <b>Microsoft Edge</b> – יש בו קולות עבריים מובנים.<br>" +
      "<b>או</b> להוסיף קול עברי ל-Windows: הגדרות ← זמן ושפה ← דיבור ← <b>הוספת קולות</b> ← עברית. אחר כך לסגור ולפתוח מחדש את הדפדפן.",
    mac:
      "הגדרות המערכת ← נגישות ← תוכן מוקרא ← קול המערכת ← <b>ניהול קולות</b> ← עברית ← להוריד את <b>Carmit</b>. " +
      "אחר כך לסגור ולפתוח מחדש את הדפדפן.",
    phone:
      "בטלפון: לוודא שבהגדרות ההקראה (טקסט לדיבור) מותקנת שפה עברית, ואז לרענן את הדף.",
    edge: "ב-Edge אמורים להיות קולות עבריים – נסו לרענן את הדף.",
    other: "אפשר לנסות לפתוח את האתר בדפדפן Microsoft Edge או בטלפון – שם בדרך כלל יש קול עברי.",
  };
  let box = document.getElementById("novoice");
  if (!box) {
    app.insertAdjacentHTML(
      "afterbegin",
      `<div class="card novoice" id="novoice">
        <button class="close" aria-label="סגירה">✕</button>
        <h3>🔇 ההקראה לא זמינה כרגע</h3>
        <div>שירות ההקראה של האתר לא הגיב, ובמכשיר הזה אין קול עברי מותקן לגיבוי.</div>
        <div style="margin-top:6px">${steps[deviceKind()]}</div>
      </div>`
    );
    box = document.getElementById("novoice");
    box.querySelector(".close").addEventListener("click", () => box.remove());
  }
  box.scrollIntoView({ behavior: "smooth", block: "start" });
}

if (window.speechSynthesis) speechSynthesis.getVoices(); // some browsers load voices lazily

function viewLearn() {
  renderNav("learn");
  SAY.length = 0;
  const row = (text, inner) => `<div class="say-row">${sayBtn(text)}<div>${inner}</div></div>`;
  const keys = LEARN.keyIdeas
    .map((k) => `<div class="card key"><div class="question">
        ${row(k.title + ". " + k.body, `<h3>${fmt(k.title)}</h3><div>${fmt(k.body)}</div>`)}
        ${k.figure ? renderFigure(k.figure) : ""}
      </div></div>`)
    .join("");
  const examples = LEARN.examples
    .map(
      (ex) => `<div class="card">
        <div class="question">
          <div>
            <h3 style="margin-top:0">דוגמה ${ex.num}</h3>
            ${row(ex.text, fmt(ex.text))}
            <div class="actions"><button class="hint-btn" data-toggle="ex${ex.num}">הצג פתרון</button></div>
          </div>
          ${renderFigure(ex.figure)}
        </div>
        <div class="solution" id="ex${ex.num}" hidden>
          <h4>פתרון</h4>
          ${ex.solution.map((s, i) => row(s, `<b>${i + 1}.</b> ${fmt(s)}`)).join("")}
          ${ex.solutionFigure ? renderFigure(ex.solutionFigure) : ""}
        </div>
      </div>`
    )
    .join("");
  app.innerHTML = `
    <h1>📖 הסבר ודוגמאות</h1>
    <p class="sub">${LESSON.subtitle}</p>
    <h2>מה חשוב לזכור</h2>
    ${keys}
    <h2>דוגמאות</h2>
    ${row(LEARN.intro, `<p style="margin:0">${fmt(LEARN.intro)}</p>`)}
    ${examples}
    <div class="pager"><span></span><a href="#/q/${QUESTIONS[0].num}">לשאלה ${QUESTIONS[0].num} ←</a></div>`;
  app.querySelectorAll("[data-say]").forEach((b) => b.addEventListener("click", () => speak(b)));
  app.querySelectorAll("[data-toggle]").forEach((b) =>
    b.addEventListener("click", () => {
      const el = document.getElementById(b.dataset.toggle);
      el.hidden = !el.hidden;
      b.textContent = el.hidden ? "הצג פתרון" : "הסתר פתרון";
    })
  );
}

// Answer checks. Kinds:
//   multi / single - choose option(s):    options: [{ text, correct }]
//   fields         - numeric blanks:      fields: [{ label, answer }]
//   point          - any valid point:     validate(x, y) -> "" when right, else the reason
//   table          - one choice per row:  choices: [...], rows: [{ label, answer: choiceIndex }]
function renderCheck(part, pid) {
  const c = part.check;
  if (!c) return "";
  let body = "";
  if (c.kind === "multi" || c.kind === "single") {
    const type = c.kind === "multi" ? "checkbox" : "radio";
    body = `<div class="options" id="${pid}-opts">${c.options
      .map((o, i) => `<label class="opt" data-i="${i}"><input type="${type}" name="${pid}" value="${i}"> ${fmt(o.text)}</label>`)
      .join("")}</div>`;
  } else if (c.kind === "fields") {
    body = `<div class="fields" id="${pid}-opts">${c.fields
      .map((f, i) => `<label class="field" data-i="${i}"><span>${fmt(f.label)}</span>
         <input type="text" inputmode="decimal" autocomplete="off" dir="ltr"></label>`)
      .join("")}</div>`;
  } else if (c.kind === "point") {
    body = `<div class="fields" id="${pid}-opts"><label class="field pointfield"><span class="m">(</span>
        <input type="text" inputmode="decimal" dir="ltr" aria-label="x" placeholder="x"><span class="m">,</span>
        <input type="text" inputmode="decimal" dir="ltr" aria-label="y" placeholder="y"><span class="m">)</span></label></div>`;
  } else if (c.kind === "table") {
    body = `<div class="ctable" id="${pid}-opts">${c.rows
      .map((r, i) => `<div class="crow" data-i="${i}"><span class="clabel">${fmt(r.label)}</span>${c.choices
        .map((ch, j) => `<label class="opt"><input type="radio" name="${pid}-r${i}" value="${j}"> ${fmt(ch)}</label>`)
        .join("")}</div>`)
      .join("")}</div>`;
  }
  return `${body}
    <div class="actions"><button class="primary" data-check="${pid}">בדיקה ✔</button></div>
    <div id="${pid}-fb"></div>`;
}

// Accepts "2.5", "2,5" isn't allowed (comma is the coordinate separator), "2½" and "5/2".
function parseNum(str) {
  let t = String(str).trim().replace(/\s+/g, "").replace("−", "-");
  if (!t) return NaN;
  const half = t.match(/^(-?\d*)½$/);
  if (half) return (half[1] === "" || half[1] === "-" ? 0 : Number(half[1])) + (t.startsWith("-") ? -0.5 : 0.5);
  const frac = t.match(/^(-?\d+)\/(\d+)$/);
  if (frac) return Number(frac[1]) / Number(frac[2]);
  return /^-?\d*\.?\d+$/.test(t) ? Number(t) : NaN;
}
const same = (a, b) => Math.abs(a - b) < 1e-9;

function runCheck(p, pid) {
  const c = p.check;
  const box = document.getElementById(`${pid}-opts`);
  const fb = document.getElementById(`${pid}-fb`);
  const say = (ok, msg) => { fb.innerHTML = `<div class="feedback ${ok ? "ok" : "no"}">${fmt(msg)}</div>`; return ok; };
  const mark = (el, ok) => { el.classList.remove("right", "wrong"); if (ok !== null) el.classList.add(ok ? "right" : "wrong"); };

  if (c.kind === "multi" || c.kind === "single") {
    let allRight = true, any = false;
    box.querySelectorAll(".opt").forEach((lab) => {
      const o = c.options[lab.dataset.i];
      const on = lab.querySelector("input").checked;
      any = any || on;
      mark(lab, on ? o.correct : null);
      if (on !== o.correct) allRight = false;
    });
    if (!any) return say(false, "בחרי קודם תשובה 🙂");
    return say(allRight, allRight ? c.right : c.wrong);
  }
  if (c.kind === "fields") {
    let allRight = true, empty = false;
    box.querySelectorAll(".field").forEach((lab) => {
      const f = c.fields[lab.dataset.i];
      const raw = lab.querySelector("input").value;
      if (!raw.trim()) { empty = true; allRight = false; return mark(lab, null); }
      const ok = same(parseNum(raw), f.answer);
      mark(lab, ok);
      if (!ok) allRight = false;
    });
    if (allRight) return say(true, c.right);
    return say(false, empty ? "יש עוד משבצות ריקות – מלאי את כולן 🙂" : c.wrong || "יש טעות במשבצות המסומנות באדום. נסי שוב, או פתחי רמז.");
  }
  if (c.kind === "point") {
    const [xi, yi] = box.querySelectorAll("input");
    const x = parseNum(xi.value), y = parseNum(yi.value);
    const lab = box.querySelector(".field");
    if (isNaN(x) || isNaN(y)) { mark(lab, null); return say(false, "כתבי מספר בכל אחת מהמשבצות (x וגם y) 🙂"); }
    const why = c.validate(x, y);
    mark(lab, !why);
    return say(!why, why ? why : c.right.replace("{p}", `$(${x},${y})$`));
  }
  if (c.kind === "table") {
    let allRight = true, empty = false;
    box.querySelectorAll(".crow").forEach((row) => {
      const r = c.rows[row.dataset.i];
      const sel = row.querySelector("input:checked");
      row.querySelectorAll(".opt").forEach((o) => mark(o, null));
      if (!sel) { empty = true; allRight = false; return; }
      const ok = Number(sel.value) === r.answer;
      mark(sel.closest(".opt"), ok);
      if (!ok) allRight = false;
    });
    if (allRight) return say(true, c.right);
    return say(false, empty ? "יש עוד שורות בלי תשובה 🙂" : c.wrong || "חלק מהתשובות לא נכונות (מסומנות באדום). נסי שוב!");
  }
}

// ---------- saved progress (this browser, survives closing the tab) ----------
// { parts: { [pid]: { v: inputs, checked, ok, hints: shownCount, closed: [i], min: [i], sol } } }
const STORE_KEY = "math-lesson:progress:v1";
let progress = { parts: {} };
try { progress = JSON.parse(localStorage.getItem(STORE_KEY)) || progress; } catch (e) {}
if (!progress.parts) progress.parts = {};

function saveProgress() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(progress)); } catch (e) {} // private mode etc: still works, just not saved
}
const partState = (pid) => (progress.parts[pid] = progress.parts[pid] || {});

// Read the current answer inputs of a part as plain data, and put them back.
function readInputs(p, pid) {
  const box = document.getElementById(`${pid}-opts`);
  const k = p.check.kind;
  if (k === "multi" || k === "single") return [...box.querySelectorAll("input")].map((i) => i.checked);
  if (k === "fields" || k === "point") return [...box.querySelectorAll("input")].map((i) => i.value);
  if (k === "table") return [...box.querySelectorAll(".crow")].map((r) => { const c = r.querySelector("input:checked"); return c ? Number(c.value) : null; });
}
function writeInputs(p, pid, v) {
  if (!v) return;
  const box = document.getElementById(`${pid}-opts`);
  const k = p.check.kind;
  if (k === "multi" || k === "single") box.querySelectorAll("input").forEach((i, n) => (i.checked = !!v[n]));
  else if (k === "fields" || k === "point") box.querySelectorAll("input").forEach((i, n) => (i.value = v[n] ?? ""));
  else if (k === "table") box.querySelectorAll(".crow").forEach((r, n) => {
    if (v[n] != null) { const c = r.querySelector(`input[value="${v[n]}"]`); if (c) c.checked = true; }
  });
}

// Count of parts answered correctly in a question, for the home page.
function questionScore(q) {
  let ok = 0, total = 0;
  q.parts.forEach((p, pi) => { if (!p.check) return; total++; if ((progress.parts[`q${q.num}p${pi}`] || {}).ok) ok++; });
  return { ok, total };
}

function viewQuestion(num) {
  const idx = QUESTIONS.findIndex((q) => q.num === num);
  if (idx < 0) return viewHome();
  const q = QUESTIONS[idx];
  renderNav(num);

  const parts = q.parts
    .map((p, pi) => {
      const pid = `q${q.num}p${pi}`;
      const hasHelp = p.hints && p.hints.length;
      const help = hasHelp
        ? `<div class="actions">
             <button class="hint-btn" data-hint="${pid}">💡 רמז (1 מתוך ${p.hints.length})</button>
             <button data-sol="${pid}">הצג פתרון מלא</button>
             <button class="linkish" data-reopen="${pid}" hidden></button>
           </div>
           <div id="${pid}-hints"></div>
           <div class="solution" id="${pid}-sol" hidden>
             <h4>✅ פתרון מלא</h4>
             <ol>${p.solution.steps.map((s) => `<li>${fmt(s)}</li>`).join("")}</ol>
             ${p.solution.figure ? renderFigure(p.solution.figure) : ""}
           </div>`
        : `<div class="soon-note">💡 רמזים והסברים לסעיף זה יתווספו בהמשך.</div>`;
      return `<div class="part">
        <div><span class="part-label">${p.label}</span>${p.star ? '<span class="star">★</span>' : ""}${fmt(p.text)}</div>
        ${renderCheck(p, pid)}
        ${help}
      </div>`;
    })
    .join("");

  const prev = QUESTIONS[idx - 1], next = QUESTIONS[idx + 1];
  app.innerHTML = `
    <div class="qhead"><h1>שאלה ${q.num}</h1><span class="page">עמוד ${q.page}</span></div>
    <div class="card">
      <div class="question">
        <div>${fmt(q.text)}</div>
        ${renderFigure(q.figure)}
      </div>
      ${parts}
    </div>
    <div class="reset-row"><button class="linkish" data-reset>🗑️ התחלה מחדש של השאלה הזו</button></div>
    <div class="pager">
      ${prev ? `<a href="#/q/${prev.num}">→ שאלה ${prev.num}</a>` : `<a href="#/learn">→ הסבר</a>`}
      ${next ? `<a href="#/q/${next.num}">שאלה ${next.num} ←</a>` : "<span></span>"}
    </div>`;

  // wire up hints / solutions / checks, restoring anything saved
  q.parts.forEach((p, pi) => {
    const pid = `q${q.num}p${pi}`;
    const st = partState(pid);
    if (p.hints) wireHelp(p, pid, st);
    if (p.check) {
      const box = document.getElementById(`${pid}-opts`);
      const fb = document.getElementById(`${pid}-fb`);
      writeInputs(p, pid, st.v);
      if (st.checked) runCheck(p, pid); // show the earlier result again
      const onEdit = () => {
        st.v = readInputs(p, pid);
        if (st.checked) { // answer changed: the old verdict no longer applies
          st.checked = false;
          fb.innerHTML = "";
          box.querySelectorAll(".right, .wrong").forEach((el) => el.classList.remove("right", "wrong"));
        }
        saveProgress();
      };
      box.addEventListener("input", onEdit);
      box.addEventListener("change", onEdit);
      app.querySelector(`[data-check="${pid}"]`).addEventListener("click", () => {
        st.v = readInputs(p, pid);
        const ok = runCheck(p, pid);
        st.checked = ok !== undefined;
        st.ok = !!ok;
        saveProgress();
      });
    }
  });

  app.querySelector("[data-reset]").addEventListener("click", () => {
    if (!confirm("למחוק את כל התשובות והרמזים בשאלה הזו ולהתחיל מחדש?")) return;
    q.parts.forEach((_, pi) => delete progress.parts[`q${q.num}p${pi}`]);
    saveProgress();
    viewQuestion(num);
  });
}

// Hints appear one at a time; each can be minimized or closed. All of it is remembered.
function wireHelp(p, pid, st) {
  st.hints = st.hints || 0;
  st.closed = st.closed || [];
  st.min = st.min || [];
  const btn = app.querySelector(`[data-hint="${pid}"]`);
  const box = document.getElementById(`${pid}-hints`);
  const reopen = app.querySelector(`[data-reopen="${pid}"]`);

  const refreshButtons = () => {
    if (st.hints >= p.hints.length) {
      btn.disabled = true;
      btn.textContent = "💡 אלה כל הרמזים";
    } else {
      btn.disabled = false;
      btn.textContent = st.hints ? `💡 רמז הבא (${st.hints + 1} מתוך ${p.hints.length})` : `💡 רמז (1 מתוך ${p.hints.length})`;
    }
    reopen.hidden = !st.closed.length;
    reopen.textContent = `↩ הצג רמזים שנסגרו (${st.closed.length})`;
  };

  const addHint = (i) => {
    const h = p.hints[i];
    box.insertAdjacentHTML(
      "beforeend",
      `<div class="hint" data-i="${i}">
        <div class="hint-head">
          <h4>${fmt(h.title)}</h4>
          <button class="mini" data-act="min" title="מזעור" aria-label="מזעור">−</button>
          <button class="mini" data-act="close" title="סגירה" aria-label="סגירה">✕</button>
        </div>
        <div class="hint-body"><div>${fmt(h.body)}</div>${h.figure ? renderFigure(h.figure) : ""}</div>
      </div>`
    );
    const el = box.lastElementChild;
    if (st.closed.includes(i)) el.hidden = true;
    if (st.min.includes(i)) el.classList.add("min");
    el.querySelector('[data-act="min"]').textContent = el.classList.contains("min") ? "+" : "−";
  };

  for (let i = 0; i < st.hints; i++) addHint(i);
  refreshButtons();

  btn.addEventListener("click", () => {
    addHint(st.hints++);
    saveProgress();
    refreshButtons();
  });

  box.addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]");
    const head = e.target.closest(".hint-head");
    if (!b && !head) return;
    const el = e.target.closest(".hint");
    const i = Number(el.dataset.i);
    if (b && b.dataset.act === "close") {
      el.hidden = true;
      if (!st.closed.includes(i)) st.closed.push(i);
    } else { // minimize button, or a click on the title bar
      el.classList.toggle("min");
      st.min = el.classList.contains("min") ? [...new Set([...st.min, i])] : st.min.filter((x) => x !== i);
      el.querySelector('[data-act="min"]').textContent = el.classList.contains("min") ? "+" : "−";
    }
    saveProgress();
    refreshButtons();
  });

  reopen.addEventListener("click", () => {
    box.querySelectorAll(".hint").forEach((el) => (el.hidden = false));
    st.closed = [];
    saveProgress();
    refreshButtons();
  });

  const solBtn = app.querySelector(`[data-sol="${pid}"]`);
  const sol = document.getElementById(`${pid}-sol`);
  const showSol = (on) => { sol.hidden = !on; solBtn.textContent = on ? "הסתר פתרון" : "הצג פתרון מלא"; };
  showSol(!!st.sol);
  solBtn.addEventListener("click", () => {
    st.sol = sol.hidden;
    showSol(st.sol);
    saveProgress();
  });
}

function route() {
  stopSpeaking();
  const h = location.hash.replace(/^#\/?/, "");
  window.scrollTo(0, 0);
  if (h === "learn") return viewLearn();
  const m = h.match(/^q\/(\d+)$/);
  if (m) return viewQuestion(Number(m[1]));
  viewHome();
}
window.addEventListener("hashchange", route);
route();
