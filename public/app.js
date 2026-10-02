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
    for (let i = 1; i <= fig.xMax; i++)
      out.push(`<text x="${X(i)}" y="${Y(0) + 16}" font-size="12" text-anchor="middle" fill="#6b7086">${i}</text>`);
    for (let j = 1; j <= fig.yMax; j++)
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
    } else if (it.type === "segment") {
      const [x1, y1] = it.from, [x2, y2] = it.to;
      const stroke = it.strong ? "#5b4fd6" : "#1f2335";
      out.push(`<line x1="${X(x1)}" y1="${Y(y1)}" x2="${X(x2)}" y2="${Y(y2)}" stroke="${stroke}" stroke-width="${it.strong ? 4 : 2}" stroke-linecap="round"/>`);
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
      <div>${ready ? '<span class="badge">💡 עם רמזים והסברים</span>' : '<span class="badge soon">רמזים – בקרוב</span>'}</div>
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

function viewLearn() {
  renderNav("learn");
  const keys = LEARN.keyIdeas
    .map((k) => `<div class="card key"><h3>${fmt(k.title)}</h3><div>${fmt(k.body)}</div></div>`)
    .join("");
  const examples = LEARN.examples
    .map(
      (ex) => `<div class="card">
        <div class="question">
          <div>
            <h3 style="margin-top:0">דוגמה ${ex.num}</h3>
            <div>${fmt(ex.text)}</div>
            <div class="actions"><button class="hint-btn" data-toggle="ex${ex.num}">הצג פתרון</button></div>
          </div>
          ${renderFigure(ex.figure)}
        </div>
        <div class="solution" id="ex${ex.num}" hidden>
          <h4>פתרון</h4>
          <ol>${ex.solution.map((s) => `<li>${fmt(s)}</li>`).join("")}</ol>
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
    <p>${fmt(LEARN.intro)}</p>
    ${examples}
    <div class="pager"><span></span><a href="#/q/${QUESTIONS[0].num}">לשאלה ${QUESTIONS[0].num} ←</a></div>`;
  app.querySelectorAll("[data-toggle]").forEach((b) =>
    b.addEventListener("click", () => {
      const el = document.getElementById(b.dataset.toggle);
      el.hidden = !el.hidden;
      b.textContent = el.hidden ? "הצג פתרון" : "הסתר פתרון";
    })
  );
}

function renderCheck(part, pid) {
  const c = part.check;
  if (!c) return "";
  const type = c.kind === "multi" ? "checkbox" : "radio";
  const opts = c.options
    .map(
      (o, i) => `<label class="opt" data-i="${i}">
        <input type="${type}" name="${pid}" value="${i}"> ${fmt(o.text)}
      </label>`
    )
    .join("");
  return `<div class="options" id="${pid}-opts">${opts}</div>
    <div class="actions"><button class="primary" data-check="${pid}">בדיקה ✔</button></div>
    <div id="${pid}-fb"></div>`;
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
    <div class="pager">
      ${prev ? `<a href="#/q/${prev.num}">→ שאלה ${prev.num}</a>` : `<a href="#/learn">→ הסבר</a>`}
      ${next ? `<a href="#/q/${next.num}">שאלה ${next.num} ←</a>` : "<span></span>"}
    </div>`;

  // wire up hints / solutions / checks
  q.parts.forEach((p, pi) => {
    const pid = `q${q.num}p${pi}`;
    if (p.hints) {
      let shown = 0;
      const btn = app.querySelector(`[data-hint="${pid}"]`);
      const box = document.getElementById(`${pid}-hints`);
      btn.addEventListener("click", () => {
        const h = p.hints[shown++];
        box.insertAdjacentHTML(
          "beforeend",
          `<div class="hint"><h4>${fmt(h.title)}</h4><div>${fmt(h.body)}</div>${h.figure ? renderFigure(h.figure) : ""}</div>`
        );
        if (shown >= p.hints.length) {
          btn.disabled = true;
          btn.textContent = "💡 אלה כל הרמזים";
        } else {
          btn.textContent = `💡 רמז הבא (${shown + 1} מתוך ${p.hints.length})`;
        }
      });
      const solBtn = app.querySelector(`[data-sol="${pid}"]`);
      solBtn.addEventListener("click", () => {
        const el = document.getElementById(`${pid}-sol`);
        el.hidden = !el.hidden;
        solBtn.textContent = el.hidden ? "הצג פתרון מלא" : "הסתר פתרון";
      });
    }
    if (p.check) {
      app.querySelector(`[data-check="${pid}"]`).addEventListener("click", () => {
        const labels = [...document.querySelectorAll(`#${pid}-opts .opt`)];
        let allRight = true, any = false;
        labels.forEach((lab) => {
          const o = p.check.options[lab.dataset.i];
          const on = lab.querySelector("input").checked;
          any = any || on;
          lab.classList.remove("right", "wrong");
          if (on) lab.classList.add(o.correct ? "right" : "wrong");
          if (on !== o.correct) allRight = false;
        });
        const fb = document.getElementById(`${pid}-fb`);
        if (!any) {
          fb.innerHTML = `<div class="feedback no">בחרי קודם תשובה 🙂</div>`;
        } else {
          fb.innerHTML = `<div class="feedback ${allRight ? "ok" : "no"}">${fmt(allRight ? p.check.right : p.check.wrong)}</div>`;
        }
      });
    }
  });
}

function route() {
  const h = location.hash.replace(/^#\/?/, "");
  window.scrollTo(0, 0);
  if (h === "learn") return viewLearn();
  const m = h.match(/^q\/(\d+)$/);
  if (m) return viewQuestion(Number(m[1]));
  viewHome();
}
window.addEventListener("hashchange", route);
route();
