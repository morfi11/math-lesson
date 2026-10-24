// Chapter 2: angles - identifying angles and types of angles.
// Based on book "כיתה ז' - חלק א' - סדרת אולימפוס", unit ב, chapter 20 (pp. 227-232):
// definitions and examples from the book; the three questions are new ones modelled
// on its questions 2+12 (types on graph paper), 5 (clocks) and 15-16 (angles on axes).
// Chapter 21 (pp. 233-238, notation): questions 4-6 modelled on its naming task + 6/8,
// 5 (points on axes, name + type) and 12/13/15 (Greek letters).

// A clock face with hands at a whole hour, as figure items. The smaller angle between
// the hands is marked (a square for a right angle).
function clock(cx, cy, r, hour, label) {
  const items = [{ type: "circle", x: cx, y: cy, r, stroke: "#2563eb", width: 3 }];
  for (let h = 1; h <= 12; h++) {
    const t = ((90 - 30 * h) * Math.PI) / 180;
    const [c, s] = [Math.cos(t), Math.sin(t)];
    items.push({ type: "segment", from: [cx + c * r * 0.82, cy + s * r * 0.82], to: [cx + c * r * 0.95, cy + s * r * 0.95] });
  }
  const th = ((90 - 30 * hour) * Math.PI) / 180;
  const hourTip = [cx + Math.cos(th) * r * 0.55, cy + Math.sin(th) * r * 0.55];
  const minTip = [cx, cy + r * 0.8];
  const h = hour % 12;
  // the smaller angle, counter-clockwise from a to b
  const [a, b] = h > 0 && h <= 6 ? [hourTip, minTip] : [minTip, hourTip];
  if (h !== 0) items.push({ type: "angle", at: [cx, cy], a, b, r: r * 6 });
  items.push({ type: "segment", from: [cx, cy], to: minTip, strong: false });
  items.push({ type: "segment", from: [cx, cy], to: hourTip, strong: true });
  items.push({ type: "point", x: cx, y: cy });
  if (label) items.push({ type: "text", x: cx, y: cy + r + 0.55, text: label, color: "point" });
  return items;
}

const ANGLES_LEARN = {
  keyIdeas: [
    {
      title: "קרן",
      body: "**קרן** היא חלק של ישר המוגבל על ידי נקודה על הישר. היא מתחילה בנקודה וממשיכה בלי סוף לכיוון אחד.",
      figure: {
        xMax: 8, yMax: 3, axes: false, width: 300, height: 110,
        items: [
          { type: "segment", from: [1, 1], to: [5.5, 2] },
          { type: "segment", from: [5.5, 2], to: [7.5, 2.45], dashed: true },
          { type: "point", x: 1, y: 1, label: "A", pos: "w" },
        ],
      },
    },
    {
      title: "זווית",
      body:
        "**זווית** היא צורה גאומטרית המורכבת מ**שתי קרניים** היוצאות מ**נקודה משותפת**.<br>" +
        "שתי הקרניים נקראות **שוקי הזווית**, והנקודה נקראת **קודקוד הזווית**.<br>" +
        "מסמנים זווית בקשת קטנה ליד הקודקוד.",
      figure: {
        xMax: 8, yMax: 5, axes: false, width: 300, height: 190,
        items: [
          { type: "angle", at: [1.5, 2.5], a: [7, 1], b: [7, 4.5], r: 26 },
          { type: "segment", from: [1.5, 2.5], to: [7, 1] },
          { type: "segment", from: [1.5, 2.5], to: [7, 4.5] },
          { type: "point", x: 1.5, y: 2.5 },
          { type: "text", x: 1.3, y: 1.6, text: "קודקוד", rtl: true, color: "edge" },
          { type: "text", x: 5.2, y: 4.3, text: "שוק", rtl: true, color: "bad" },
          { type: "text", x: 5.2, y: 0.8, text: "שוק", rtl: true, color: "bad" },
        ],
      },
    },
    {
      title: "זווית ישרה",
      body:
        "**זווית ישרה** היא הזווית הנוצרת בין שני ישרים המאונכים זה לזה. מסמנים אותה ב**ריבוע קטן**.<br>" +
        "רואים אותה בכל מקום: בפינה של דף מחברת, בין בניין לקרקע, באות \"ר\", " +
        "בין מחוגי השעון בשעה $9:00$, ובכל 4 הפינות של **מלבן**.<br>" +
        "אפשר לבדוק זווית ישרה עם חפץ שיש לו זווית ישרה – פינה של דף או סרגל משולש.",
      figure: {
        xMax: 8, yMax: 5, axes: false, width: 300, height: 190,
        items: [
          { type: "angle", at: [2, 1], a: [7, 1], b: [2, 4.5], r: 22, color: "edge" },
          { type: "segment", from: [2, 1], to: [7, 1] },
          { type: "segment", from: [2, 1], to: [2, 4.5] },
          { type: "point", x: 2, y: 1 },
        ],
      },
    },
    {
      title: "זווית חדה וזווית קהה",
      body:
        "משווים כל זווית ל**זווית ישרה**:<br>" +
        "**זווית חדה** היא זווית הקטנה מזווית ישרה.<br>" +
        "**זווית קהה** היא זווית הגדולה מזווית ישרה (וקטנה מזווית שטוחה).",
      figure: {
        xMax: 10, yMax: 5, axes: false, width: 320, height: 170,
        items: [
          // acute, on the right
          { type: "segment", from: [6, 1], to: [6, 4.5], dashed: true, color: "good" },
          { type: "angle", at: [6, 1], a: [9.5, 1], b: [7.8, 4.5], r: 22 },
          { type: "segment", from: [6, 1], to: [9.5, 1] },
          { type: "segment", from: [6, 1], to: [7.8, 4.5] },
          { type: "text", x: 8, y: 0.35, text: "חדה", rtl: true, color: "point" },
          // obtuse, on the left
          { type: "segment", from: [2, 1], to: [2, 4.5], dashed: true, color: "good" },
          { type: "angle", at: [2, 1], a: [5, 1], b: [0.4, 4.2], r: 22 },
          { type: "segment", from: [2, 1], to: [5, 1] },
          { type: "segment", from: [2, 1], to: [0.4, 4.2] },
          { type: "text", x: 3.2, y: 0.35, text: "קהה", rtl: true, color: "point" },
        ],
      },
    },
    {
      title: "זווית שטוחה",
      body:
        "**זווית שטוחה** היא זווית ששתי הקרניים שלה יוצרות **קו ישר**.<br>" +
        "אפשר לבדוק אם זווית היא שטוחה בעזרת סרגל.",
      figure: {
        xMax: 8, yMax: 3, axes: false, width: 300, height: 110,
        items: [
          { type: "angle", at: [4, 1], a: [7.5, 1], b: [0.5, 1], r: 18 },
          { type: "segment", from: [0.5, 1], to: [7.5, 1] },
          { type: "point", x: 4, y: 1 },
        ],
      },
    },
    {
      title: "להיעזר בדף המשבצות",
      body:
        "כל הזוויות בריבוע הן ישרות – ולכן כל פינה של משבצת היא **זווית ישרה**.<br>" +
        "• אם הקודקוד בפינה של משבצת ו**שתי** השוקיים על קווי המשבצות – הזווית **ישרה** או **שטוחה**.<br>" +
        "• אם הקודקוד בפינה של משבצת ורק **שוק אחת** על קו המשבצות – מותחים קו מקווקו מהקודקוד, " +
        "בניצב לשוק הזו. אם השוק השנייה **לפני** הקו – **חדה**, ואם **אחריו** – **קהה**.<br>" +
        "• אם הקודקוד לא בפינה של משבצת, או ששתי השוקיים לא על קווי המשבצות – אי אפשר לדעת בעזרת המשבצות.",
      figure: {
        xMax: 10, yMax: 5, grid: true, paper: true, axes: false, width: 320,
        items: [
          { type: "segment", from: [2, 1], to: [2, 4.5], dashed: true, color: "good" },
          { type: "angle", at: [2, 1], a: [5, 1], b: [3.5, 4], r: 18 },
          { type: "segment", from: [2, 1], to: [5, 1] },
          { type: "segment", from: [2, 1], to: [3.5, 4] },
          { type: "text", x: 3.5, y: 0.4, text: "חדה", rtl: true, color: "point" },
          { type: "segment", from: [7, 1], to: [7, 4.5], dashed: true, color: "good" },
          { type: "angle", at: [7, 1], a: [9.5, 1], b: [5.5, 4], r: 18 },
          { type: "segment", from: [7, 1], to: [9.5, 1] },
          { type: "segment", from: [7, 1], to: [5.5, 4] },
          { type: "text", x: 8.3, y: 0.4, text: "קהה", rtl: true, color: "point" },
        ],
      },
    },
    // ---- chapter 21: writing angles in math notation (book pp. 233-238) ----
    {
      title: "פרק 21: הסימון המתמטי לזווית הוא $∡$",
      body:
        "יש שלוש דרכים לכתוב זווית בכתיב מתמטי:<br>" +
        "באמצעות **אות הקודקוד**, באמצעות **שלוש אותיות**, ובאמצעות **אותיות יווניות**.",
    },
    {
      title: "כתיבה באמצעות אות הקודקוד",
      body:
        "לכל זווית יש קודקוד, והוא מסומן באות גדולה מהשפה האנגלית.<br>" +
        "הזווית נקראת לפי שם הקודקוד שלה. למשל, הזווית בסרטוט תיכתב כך: $∡G$.",
      figure: {
        xMax: 8, yMax: 4, axes: false, width: 300, height: 140,
        items: [
          { type: "angle", at: [2, 1], a: [7, 1], b: [5, 3.6], r: 22 },
          { type: "segment", from: [2, 1], to: [7, 1] },
          { type: "segment", from: [2, 1], to: [5, 3.6] },
          { type: "point", x: 2, y: 1, label: "G", pos: "sw" },
          { type: "text", x: 6.6, y: 2.6, text: "∡G" },
        ],
      },
    },
    {
      title: "כתיבה באמצעות שלוש אותיות",
      body:
        "כאשר נקודה היא קודקוד של **כמה** זוויות, אי אפשר לכתוב את שמן באמצעות אות הקודקוד בלבד.<br>" +
        "אז כותבים **שלוש אותיות**: האות האמצעית היא **תמיד** הקודקוד, ושתי האחרות הן נקודות על שתי השוקיים.<br>" +
        "את הזווית המסומנת בסרטוט כותבים $∡BAC$ או $∡CAB$ – שני השמות נכונים.<br>" +
        "אבל $∡A$ לא מספיק: מ-$A$ יוצאות גם $∡BAD$ וגם $∡CAD$.",
      figure: {
        xMax: 9, yMax: 6, axes: false, width: 300, height: 210,
        items: [
          { type: "angle", at: [1, 3], a: [8, 0.8], b: [8, 5.2], r: 26 },
          { type: "segment", from: [1, 3], to: [8.5, 5.4] },
          { type: "segment", from: [1, 3], to: [8.5, 3] },
          { type: "segment", from: [1, 3], to: [8.5, 0.6] },
          { type: "point", x: 1, y: 3, label: "A", pos: "w", color: "bad" },
          { type: "point", x: 6, y: 4.6, label: "B", pos: "n" },
          { type: "point", x: 7, y: 3, label: "D", pos: "n" },
          { type: "point", x: 6, y: 1.4, label: "C", pos: "s" },
        ],
      },
    },
    {
      title: "כתיבה באמצעות אותיות יווניות",
      body:
        "אפשר לסמן זווית גם באות יוונית. כשמסמנים זווית באות יוונית, **אין צורך** להקדים לפניה את $∡$.<br>" +
        "ארבע האותיות היווניות הראשונות: $α$ אַלְפָא, $β$ בֵּטָא, $γ$ גָּמָא, $δ$ דֶּלְתָּא.<br>" +
        "(השמות דומים לאותיות העבריות: אלף, בית, גימל, דלת.)",
    },
  ],
  intro: "דוגמאות מהספר – זוויות סביבנו, בדף המשבצות, ושמות של זוויות.",
  examples: [
    {
      num: 1,
      text: "איזו זווית נוצרת בין מחוגי השעון בשעה $9:00$?",
      figure: { xMax: 6, yMax: 6, axes: false, width: 220, items: clock(3, 3, 2.4, 9) },
      solution: [
        "בשעה $9:00$ המחוג הגדול מצביע על $12$, והמחוג הקטן מצביע על $9$.",
        "מ-$9$ עד $12$ זה **רבע** מהשעון – בדיוק כמו פינה של דף.",
        "לכן בשעה $9:00$ המחוגים יוצרים **זווית ישרה** (כך כתוב גם בספר).",
      ],
    },
    {
      num: 2,
      text:
        "בכל אחד מהסרטוטים הקודקוד נמצא בפינה של משבצת, ורק שוק אחת מונחת על קו המשבצות.<br>" +
        "קבעי את סוג כל זווית בעזרת דף המשבצות.",
      figure: {
        xMax: 10, yMax: 5, grid: true, paper: true, axes: false, width: 320,
        items: [
          { type: "angle", at: [1, 1], a: [4, 4], b: [1, 4.5], r: 18, mark: "arc" },
          { type: "segment", from: [1, 1], to: [1, 4.5] },
          { type: "segment", from: [1, 1], to: [4, 4] },
          { type: "text", x: 2.5, y: 0.4, text: "ג", rtl: true, color: "point" },
          { type: "angle", at: [8, 3], a: [5, 3], b: [9.5, 1], r: 18 },
          { type: "segment", from: [8, 3], to: [5, 3] },
          { type: "segment", from: [8, 3], to: [9.5, 1] },
          { type: "text", x: 7, y: 0.4, text: "ד", rtl: true, color: "point" },
        ],
      },
      solution: [
        "בסרטוט ג השוק האנכית על קו המשבצות. מהקודקוד יוצא קו המשבצות האופקי – הוא יוצר איתה זווית ישרה.",
        "השוק השנייה נמצאת **בין** השוק האנכית לקו האופקי – לכן הזווית קטנה מישרה: **חדה**.",
        "בסרטוט ד השוק האופקית על קו המשבצות. מותחים קו מקווקו **אנכי** למטה מהקודקוד.",
        "השוק השנייה נמצאת **מעבר** לקו המקווקו – לכן הזווית גדולה מישרה: **קהה**.",
      ],
      solutionFigure: {
        xMax: 10, yMax: 5, grid: true, paper: true, axes: false, width: 320,
        items: [
          { type: "segment", from: [1, 1], to: [5, 1], dashed: true, color: "good" },
          { type: "angle", at: [1, 1], a: [4, 4], b: [1, 4.5], r: 18, mark: "arc" },
          { type: "segment", from: [1, 1], to: [1, 4.5] },
          { type: "segment", from: [1, 1], to: [4, 4] },
          { type: "text", x: 3, y: 2.2, text: "חדה", rtl: true, color: "good" },
          { type: "segment", from: [8, 3], to: [8, 0.2], dashed: true, color: "good" },
          { type: "angle", at: [8, 3], a: [5, 3], b: [9.5, 1], r: 18 },
          { type: "segment", from: [8, 3], to: [5, 3] },
          { type: "segment", from: [8, 3], to: [9.5, 1] },
          { type: "text", x: 6.5, y: 4, text: "קהה", rtl: true, color: "good" },
        ],
      },
    },
    {
      num: 3,
      text:
        "בסרטוט משולש $ABC$, והנקודה $D$ על הצלע $AB$. הזווית המסומנת היא $α$.<br>" +
        "כתבי את כל השמות של הזווית $α$ באמצעות שלוש אותיות. האם אפשר לקרוא לה $∡C$?",
      figure: {
        xMax: 9, yMax: 6, axes: false, width: 300, height: 210,
        items: [
          { type: "polygon", pts: [[1, 1], [8.5, 1], [4, 5.5]], fill: "none" },
          { type: "segment", from: [1, 1], to: [6.25, 3.25] },
          { type: "angle", at: [1, 1], a: [8.5, 1], b: [6.25, 3.25], r: 30 },
          { type: "text", x: 3.4, y: 1.45, text: "α" },
          { type: "point", x: 1, y: 1, label: "C", pos: "sw" },
          { type: "point", x: 8.5, y: 1, label: "B", pos: "se" },
          { type: "point", x: 4, y: 5.5, label: "A", pos: "n" },
          { type: "point", x: 6.25, y: 3.25, label: "D", pos: "ne" },
        ],
      },
      solution: [
        "הקודקוד של $α$ הוא $C$, ולכן $C$ היא האות **האמצעית**.",
        "השוקיים של $α$ עוברות דרך $B$ ודרך $D$. לכן: $∡BCD = ∡DCB = α$ (כמו בספר).",
        "**אי אפשר** לכתוב $∡C$: מ-$C$ יוצאות עוד זוויות, למשל $∡ACD$ ו-$∡ACB$, ולא היה ברור לאיזו מהן התכוונו.",
      ],
    },
  ],
};

const TYPES = ["חדה", "ישרה", "קהה", "שטוחה"];

const ANGLES_QUESTIONS = [
  {
    num: 101,
    shown: 1,
    text:
      "לפנייך דף משבצות ועליו חמש זוויות.<br>" +
      "בכל זווית הקודקוד נמצא בפינה של משבצת.<br>" +
      "קבעי את סוג כל זווית: חדה / ישרה / קהה / שטוחה.",
    figure: {
      xMax: 15, yMax: 10, grid: true, paper: true, axes: false, width: 360,
      items: [
        // numbered right to left, like the book
        // ③ right
        { type: "angle", at: [1, 6], a: [4, 6], b: [1, 9], r: 16, color: "edge" },
        { type: "segment", from: [1, 6], to: [4, 6] }, { type: "segment", from: [1, 6], to: [1, 9] },
        { type: "text", x: 3, y: 8.4, text: "③", color: "point" },
        // ② obtuse
        { type: "angle", at: [7, 6], a: [10, 6], b: [5, 9], r: 16 },
        { type: "segment", from: [7, 6], to: [10, 6] }, { type: "segment", from: [7, 6], to: [5, 9] },
        { type: "text", x: 8.7, y: 8.4, text: "②", color: "point" },
        // ① acute
        { type: "angle", at: [11, 6], a: [14, 6], b: [13, 9], r: 16 },
        { type: "segment", from: [11, 6], to: [14, 6] }, { type: "segment", from: [11, 6], to: [13, 9] },
        { type: "text", x: 14.2, y: 8.4, text: "①", color: "point" },
        // ⑤ straight
        { type: "angle", at: [3, 2], a: [6, 2], b: [0.5, 2], r: 14 },
        { type: "segment", from: [0.5, 2], to: [6, 2] }, { type: "point", x: 3, y: 2 },
        { type: "text", x: 3, y: 3.6, text: "⑤", color: "point" },
        // ④ acute, opening downwards
        { type: "angle", at: [10, 4], a: [11, 1], b: [13, 4], r: 16 },
        { type: "segment", from: [10, 4], to: [13, 4] }, { type: "segment", from: [10, 4], to: [11, 1] },
        { type: "text", x: 8.6, y: 2.5, text: "④", color: "point" },
      ],
    },
    parts: [
      {
        label: "א",
        text: "לכל זווית, בחרי את הסוג שלה.",
        check: {
          kind: "table",
          choices: TYPES,
          rows: [
            { label: "①", answer: 0 },
            { label: "②", answer: 2 },
            { label: "③", answer: 1 },
            { label: "④", answer: 0 },
            { label: "⑤", answer: 3 },
          ],
          right: "כל הכבוד אופיר! 🌟 ① חדה, ② קהה, ③ ישרה, ④ חדה, ⑤ שטוחה.",
        },
        hints: [
          {
            title: "רמז 1 – ארבעת הסוגים",
            body:
              "**ישרה** – כמו פינה של דף (מסמנים בריבוע קטן).<br>" +
              "**חדה** – קטנה מישרה. **קהה** – גדולה מישרה.<br>" +
              "**שטוחה** – שתי השוקיים יוצרות קו ישר.",
          },
          {
            title: "רמז 2 – הטריק של דף המשבצות",
            body:
              "כל פינה של משבצת היא זווית ישרה. בזוויות ① ו-② השוק התחתונה על קו המשבצות.<br>" +
              "מותחים מהקודקוד קו מקווקו **למעלה** (אנכי). אם השוק השנייה **לפני** הקו – חדה. אם היא **עוברת** אותו – קהה.",
            figure: {
              xMax: 15, yMax: 5, grid: true, paper: true, axes: false, width: 340,
              items: [
                { type: "segment", from: [4, 1], to: [4, 4.5], dashed: true, color: "good" },
                { type: "angle", at: [4, 1], a: [7, 1], b: [2, 4], r: 16 },
                { type: "segment", from: [4, 1], to: [7, 1] }, { type: "segment", from: [4, 1], to: [2, 4] },
                { type: "text", x: 5.6, y: 3.6, text: "②", color: "point" },
                { type: "segment", from: [10, 1], to: [10, 4.5], dashed: true, color: "good" },
                { type: "angle", at: [10, 1], a: [13, 1], b: [12, 4], r: 16 },
                { type: "segment", from: [10, 1], to: [13, 1] }, { type: "segment", from: [10, 1], to: [12, 4] },
                { type: "text", x: 13.4, y: 3.6, text: "①", color: "point" },
              ],
            },
          },
          {
            title: "רמז 3 – ③, ④ ו-⑤",
            body:
              "בזווית ③ שתי השוקיים על קווי המשבצות – אחת אופקית ואחת אנכית.<br>" +
              "בזווית ④ השוק השנייה יורדת **למטה** – אז מותחים את הקו המקווקו מהקודקוד **למטה**, ומשווים אליו.<br>" +
              "בזווית ⑤ שתי השוקיים על **אותו קו ישר**.",
          },
        ],
        solution: {
          steps: [
            "① השוק השנייה **לפני** הקו האנכי (בינו לבין השוק האופקית): **חדה**.",
            "② השוק השנייה נוטה שמאלה ו**עוברת** את הקו האנכי שמהקודקוד: **קהה**.",
            "③ שתי השוקיים על קווי המשבצות, אחת אופקית ואחת אנכית – כמו פינה של משבצת: **ישרה**.",
            "④ השוק השנייה יורדת למטה, אבל **לפני** הקו האנכי שיורד מהקודקוד: **חדה**.",
            "⑤ שתי השוקיים יוצרות קו ישר אחד: **שטוחה**.",
          ],
        },
      },
    ],
  },

  {
    num: 102,
    shown: 2,
    text: "לפנייך שעונים עם מחוגים המראים שעות עגולות.",
    figure: {
      xMax: 10, yMax: 11, axes: false, width: 300, height: 320,
      items: [
        ...clock(7.5, 8, 2.1, 3, "①"),
        ...clock(2.5, 8, 2.1, 6, "②"),
        ...clock(7.5, 2.6, 2.1, 1, "③"),
        ...clock(2.5, 2.6, 2.1, 5, "④"),
      ],
    },
    parts: [
      {
        label: "א",
        text: "כתבי את סוג הזווית הנוצרת בין מחוגי השעון בכל שעון (חדה / ישרה / קהה / שטוחה).",
        check: {
          kind: "table",
          choices: TYPES,
          rows: [
            { label: "①", answer: 1 },
            { label: "②", answer: 3 },
            { label: "③", answer: 0 },
            { label: "④", answer: 2 },
          ],
          right: "מצוין! ⏰ ① $3:00$ ישרה, ② $6:00$ שטוחה, ③ $1:00$ חדה, ④ $5:00$ קהה.",
        },
        hints: [
          {
            title: "רמז 1 – דוגמה מהספר",
            body: "בשעה $9:00$ המחוגים יוצרים **זווית ישרה** – המרחק ביניהם הוא **רבע** שעון (3 שעות).",
            figure: { xMax: 6, yMax: 6, axes: false, width: 180, items: clock(3, 3, 2.4, 9) },
          },
          {
            title: "רמז 2 – סופרים שעות",
            body:
              "בכל שעון, ספרי כמה שעות יש בין המחוג הקטן למחוג הגדול (שמצביע על $12$):<br>" +
              "• בדיוק $3$ שעות (רבע שעון) ← **ישרה**<br>" +
              "• בדיוק $6$ שעות (חצי שעון) ← **שטוחה**<br>" +
              "• פחות מ-$3$ ← **חדה** &nbsp; • בין $3$ ל-$6$ ← **קהה**",
          },
        ],
        solution: {
          steps: [
            "① $3:00$ – $3$ שעות בין המחוגים, רבע שעון: **ישרה**.",
            "② $6:00$ – $6$ שעות, חצי שעון, המחוגים בקו ישר: **שטוחה**.",
            "③ $1:00$ – רק שעה אחת בין המחוגים, פחות מרבע: **חדה**.",
            "④ $5:00$ – $5$ שעות, יותר מרבע ופחות מחצי: **קהה**.",
          ],
        },
      },
      {
        label: "ב",
        text: "באיזו מהשעות הבאות תיווצר **זווית קהה** בין מחוגי השעון?",
        check: {
          kind: "single",
          options: [
            { text: "$2:00$", correct: false },
            { text: "$3:00$", correct: false },
            { text: "$4:00$", correct: true },
            { text: "$6:00$", correct: false },
          ],
          right: "נכון! 🎉 בשעה $4:00$ יש $4$ שעות בין המחוגים – יותר מרבע שעון ופחות מחצי: קהה.",
          wrong: "לא בדיוק. ספרי כמה שעות יש בין המחוגים בכל אפשרות – קהה זה בין $3$ ל-$6$.",
        },
        hints: [
          { title: "רמז", body: "זווית קהה = יותר מ-$3$ שעות בין המחוגים, אבל פחות מ-$6$." },
        ],
        solution: {
          steps: [
            "$2:00$ – $2$ שעות: חדה. $3:00$ – ישרה. $6:00$ – שטוחה.",
            "$4:00$ – $4$ שעות, בין $3$ ל-$6$: **קהה**. ✓",
          ],
          figure: { xMax: 6, yMax: 6, axes: false, width: 180, items: clock(3, 3, 2.4, 4) },
        },
      },
    ],
  },

  {
    num: 103,
    shown: 3,
    text:
      "במערכת הצירים מסורטט הקטע $AB$ שקצותיו בנקודות $A(1,2)$ ו-$B(7,2)$.<br>" +
      "בכל סעיף מוסיפים קטע נוסף, וכותבים שיעורי נקודה (שאינה $A$ או $B$) על הקטע שהוספנו.",
    figure: {
      xMax: 9, yMax: 6, grid: true, ticks: true, width: 320,
      items: [
        { type: "segment", from: [1, 2], to: [7, 2], strong: true },
        { type: "point", x: 1, y: 2, label: "A(1,2)", pos: "s" },
        { type: "point", x: 7, y: 2, label: "B(7,2)", pos: "s" },
      ],
    },
    parts: [
      {
        label: "א",
        text: "הוסיפי קטע מהנקודה $B$ כך שתתקבל **זווית ישרה** שקודקודה $B$. כתבי שיעורי נקודה על הקטע שהוספת.",
        check: {
          kind: "point",
          validate: (x, y) => {
            if (x === 7 && y === 2) return "זו הנקודה $B$ עצמה – צריך נקודה **אחרת** על הקטע החדש.";
            if (y === 2) return "הנקודה על אותו קו אופקי כמו $AB$ – כך לא נוצרת זווית ישרה.";
            if (x !== 7) return "הקטע מ-$B$ לנקודה הזו נוטה הצידה. לזווית ישרה הקטע צריך להיות **אנכי** – מקביל לציר ה-$y$. מה זה אומר על שיעור ה-$x$?";
            return "";
          },
          right: "נכון! 🎉 הקטע מ-$B$ אל {p} אנכי (אותו $x$ כמו $B$), ולכן הזווית ב-$B$ ישרה.",
        },
        hints: [
          {
            title: "רמז 1 – הקטע AB אופקי",
            body: "$AB$ מקביל לציר ה-$x$. כדי לקבל זווית ישרה ב-$B$, הקטע החדש צריך להיות **אנכי** – כמו פינה של משבצת.",
          },
          {
            title: "רמז 2 – מהפרק הקודם",
            body: "קטע **אנכי** מקביל לציר ה-$y$, ולכל הנקודות עליו יש **אותו $x$**. מה ה-$x$ של $B$?",
            figure: {
              xMax: 9, yMax: 6, grid: true, ticks: true, width: 300,
              items: [
                { type: "segment", from: [7, 0.3], to: [7, 5.7], dashed: true, color: "good" },
                { type: "segment", from: [1, 2], to: [7, 2], strong: true },
                { type: "point", x: 1, y: 2, label: "A", pos: "s" },
                { type: "point", x: 7, y: 2, label: "B", pos: "se" },
                { type: "text", x: 8, y: 5, text: "x = 7" },
              ],
            },
          },
        ],
        solution: {
          steps: [
            "$AB$ אופקי, אז לזווית ישרה ב-$B$ צריך קטע **אנכי** מ-$B$.",
            "לכל הנקודות על הקטע האנכי יש $x=7$, כמו ל-$B$.",
            "לדוגמה: $(7,5)$ או $(7,0)$ – כל נקודה עם $x=7$ ו-$y$ שונה מ-$2$.",
          ],
          figure: {
            xMax: 9, yMax: 6, grid: true, ticks: true, width: 300,
            items: [
              { type: "angle", at: [7, 2], a: [7, 5], b: [1, 2], r: 16, color: "edge" },
              { type: "segment", from: [1, 2], to: [7, 2], strong: true },
              { type: "segment", from: [7, 2], to: [7, 5] },
              { type: "point", x: 1, y: 2, label: "A", pos: "s" },
              { type: "point", x: 7, y: 2, label: "B", pos: "se" },
              { type: "point", x: 7, y: 5, label: "(7,5)", pos: "e", color: "good" },
            ],
          },
        },
      },
      {
        label: "ב",
        text: "הוסיפי קטע מהנקודה $A$ כך שתתקבל **זווית חדה** שקודקודה $A$ (ושוק אחת שלה היא $AB$). כתבי שיעורי נקודה על הקטע שהוספת.",
        check: {
          kind: "point",
          validate: (x, y) => {
            if (y === 2) return "הנקודה על אותו קו אופקי כמו $AB$ – זו לא זווית חדה. הקטע צריך לעלות או לרדת.";
            if (x === 1) return "קטע מ-$A$ עם $x=1$ הוא **אנכי** – זו זווית **ישרה**, לא חדה.";
            if (x < 1) return "הקטע נוטה **שמאלה**, מעבר לקו האנכי של $A$ – זו זווית **קהה**. נסי נקודה מימין לקו.";
            return "";
          },
          right: "נכון! 🎉 {p} נמצאת מימין לקו האנכי שעובר ב-$A$, ולכן הזווית חדה.",
        },
        hints: [
          {
            title: "רמז – הקו המקווקו",
            body:
              "כמו בדף המשבצות: מותחים קו אנכי דרך $A$ (שם $x=1$). הוא יוצר זווית ישרה עם $AB$.<br>" +
              "נקודה **מימין** לקו (בצד של $B$) – זווית **חדה**. נקודה **משמאל** לקו – זווית **קהה**.",
            figure: {
              xMax: 9, yMax: 6, grid: true, ticks: true, width: 300,
              items: [
                { type: "polygon", pts: [[1, 0], [9, 0], [9, 6], [1, 6]], fill: "blue", label: "חדה", labelAt: [5, 4.5] },
                { type: "polygon", pts: [[0, 0], [1, 0], [1, 6], [0, 6]], fill: "orange", label: "קהה", labelAt: [0.5, 4.5] },
                { type: "segment", from: [1, 0], to: [1, 6], dashed: true, color: "good" },
                { type: "segment", from: [1, 2], to: [7, 2], strong: true },
                { type: "point", x: 1, y: 2, label: "A", pos: "sw" },
                { type: "point", x: 7, y: 2, label: "B", pos: "se" },
              ],
            },
          },
        ],
        solution: {
          steps: [
            "צריך נקודה **מימין** לקו האנכי של $A$ ($x$ גדול מ-$1$), שאינה על הקו של $AB$ ($y$ שונה מ-$2$).",
            "לדוגמה: $(4,5)$ – הזווית בין $AB$ לקטע מ-$A$ אל $(4,5)$ קטנה מישרה: **חדה**.",
          ],
        },
      },
      {
        label: "ג",
        text: "הוסיפי קטע מהנקודה $A$ כך שתתקבל **זווית קהה** שקודקודה $A$. כתבי שיעורי נקודה על הקטע שהוספת.",
        check: {
          kind: "point",
          validate: (x, y) => {
            if (y === 2) return "הנקודה על אותו קו אופקי כמו $AB$ – כך מתקבלת זווית שטוחה (או שאין זווית בכלל), לא קהה.";
            if (x === 1) return "קטע מ-$A$ עם $x=1$ הוא **אנכי** – זו זווית **ישרה**, לא קהה.";
            if (x > 1) return "הנקודה מימין לקו האנכי של $A$ – זו זווית **חדה**. לזווית קהה הקטע צריך לנטות **שמאלה**.";
            return "";
          },
          right: "נכון! 🎉 {p} נמצאת משמאל לקו האנכי שעובר ב-$A$, ולכן הזווית קהה.",
        },
        hints: [
          {
            title: "רמז",
            body: "חזרי לקו המקווקו מסעיף ב: לזווית **קהה** הקטע צריך לעבור **משמאל** לקו האנכי של $A$ – כלומר $x$ קטן מ-$1$.",
          },
        ],
        solution: {
          steps: [
            "צריך נקודה **משמאל** לקו האנכי של $A$ ($x$ קטן מ-$1$), עם $y$ שונה מ-$2$.",
            "לדוגמה: $(0,5)$ – הקטע מ-$A$ נוטה שמאלה, מעבר לקו האנכי: **קהה**.",
          ],
          figure: {
            xMax: 9, yMax: 6, grid: true, ticks: true, width: 300,
            items: [
              { type: "segment", from: [1, 0], to: [1, 6], dashed: true, color: "good" },
              { type: "angle", at: [1, 2], a: [7, 2], b: [0, 5], r: 18 },
              { type: "segment", from: [1, 2], to: [7, 2], strong: true },
              { type: "segment", from: [1, 2], to: [0, 5] },
              { type: "point", x: 1, y: 2, label: "A", pos: "s" },
              { type: "point", x: 0, y: 5, label: "(0,5)", pos: "ne", color: "good" },
            ],
          },
        },
      },
      {
        label: "ד",
        text: "ואיזו נקודה תיתן **זווית שטוחה** שקודקודה $A$? כתבי שיעורי נקודה כזו.",
        check: {
          kind: "point",
          validate: (x, y) => {
            if (y !== 2) return "בזווית שטוחה שתי השוקיים יוצרות **קו ישר אחד**. הנקודה חייבת להיות על הקו של $AB$ – עם $y=2$.";
            if (x >= 1) return "הנקודה הזו על הקטע $AB$ עצמו (או ממשיכה אותו ימינה) – כך לא נוצרת זווית. צריך להמשיך את הקו **שמאלה**, אל מעבר ל-$A$.";
            return "";
          },
          right: "מצוין! 🌟 {p} נמצאת על המשך הקו של $AB$ אל מעבר ל-$A$ – יחד הם קו ישר: זווית שטוחה.",
        },
        hints: [
          {
            title: "רמז",
            body: "זווית שטוחה – שתי השוקיים יוצרות **קו ישר**. ממשיכים את הקו של $AB$ אל **מעבר** ל-$A$ (שמאלה). מה ה-$y$ של כל הנקודות על הקו הזה?",
          },
        ],
        solution: {
          steps: [
            "השוק החדשה צריכה להמשיך את $AB$ בקו ישר, אל מעבר ל-$A$: $y=2$ ו-$x$ קטן מ-$1$.",
            "לדוגמה: $(0,2)$.",
          ],
        },
      },
    ],
  },

  // ---- chapter 21: writing angles in math notation ----
  {
    num: 104,
    shown: 4,
    text:
      "בסרטוט משולש $ABC$. הנקודה $D$ נמצאת על הצלע $BC$, והקטע $AD$ מחבר אותה עם $A$.<br>" +
      "בסרטוט מסומנת זווית אחת.",
    figure: {
      xMax: 10, yMax: 6, axes: false, width: 320, height: 210,
      items: [
        { type: "polygon", pts: [[0.5, 1], [9.5, 1], [4, 5.4]], fill: "none" },
        { type: "segment", from: [4, 5.4], to: [5.5, 1] },
        { type: "angle", at: [5.5, 1], a: [9.5, 1], b: [4, 5.4], r: 22 },
        { type: "point", x: 4, y: 5.4, label: "A", pos: "n" },
        { type: "point", x: 0.5, y: 1, label: "B", pos: "sw" },
        { type: "point", x: 9.5, y: 1, label: "C", pos: "se" },
        { type: "point", x: 5.5, y: 1, label: "D", pos: "s" },
      ],
    },
    parts: [
      {
        label: "א",
        text: "בחרי את **כל** השמות המתאימים לזווית המסומנת.",
        check: {
          kind: "multi",
          options: [
            { text: "$∡ADC$", correct: true },
            { text: "$∡D$", correct: false },
            { text: "$∡CDA$", correct: true },
            { text: "$∡DAC$", correct: false },
            { text: "$∡ADB$", correct: false },
            { text: "$∡ACD$", correct: false },
          ],
          right: "כל הכבוד אופיר! 🌟 $∡ADC$ ו-$∡CDA$ – הקודקוד $D$ באמצע, ו-$A$, $C$ על השוקיים.",
          wrong: "עוד לא. בדקי בכל שם: האם האות **האמצעית** היא הקודקוד, והאם שתי האחרות על שוקי הזווית המסומנת?",
        },
        hints: [
          {
            title: "רמז 1 – מי הקודקוד?",
            body: "הקשת המסומנת יוצאת מהנקודה $D$ – היא הקודקוד. בשם של שלוש אותיות, $D$ צריכה להיות **באמצע**.",
          },
          {
            title: "רמז 2 – לאן הולכות השוקיים?",
            body:
              "שוק אחת הולכת מ-$D$ אל $A$, והשנייה מ-$D$ אל $C$.<br>" +
              "אז השם הוא $A$–$D$–$C$, ואפשר לקרוא אותו גם מהצד השני: $C$–$D$–$A$.",
            figure: {
              xMax: 10, yMax: 6, axes: false, width: 300, height: 200,
              items: [
                { type: "polygon", pts: [[0.5, 1], [9.5, 1], [4, 5.4]], fill: "none" },
                { type: "segment", from: [5.5, 1], to: [4, 5.4], color: "bad" },
                { type: "segment", from: [5.5, 1], to: [9.5, 1], color: "bad" },
                { type: "angle", at: [5.5, 1], a: [9.5, 1], b: [4, 5.4], r: 22 },
                { type: "point", x: 4, y: 5.4, label: "A", pos: "n", color: "bad" },
                { type: "point", x: 0.5, y: 1, label: "B", pos: "sw" },
                { type: "point", x: 9.5, y: 1, label: "C", pos: "se", color: "bad" },
                { type: "point", x: 5.5, y: 1, label: "D", pos: "s", color: "bad" },
              ],
            },
          },
          {
            title: "רמז 3 – ומה עם $∡D$?",
            body: "מהנקודה $D$ יוצאות **שתי** זוויות: $∡ADC$ וגם $∡ADB$. אם נכתוב רק $∡D$ – לא יהיה ברור לאיזו מהן התכוונו.",
          },
        ],
        solution: {
          steps: [
            "$∡ADC$ ✓ ו-$∡CDA$ ✓ – הקודקוד $D$ באמצע, ו-$A$, $C$ על השוקיים.",
            "$∡D$ ✗ – מ-$D$ יוצאות שתי זוויות ($∡ADC$ ו-$∡ADB$), אז אות אחת לא מספיקה.",
            "$∡DAC$ ✗ ו-$∡ACD$ ✗ – האות האמצעית היא $A$ או $C$, כלומר אלה זוויות **אחרות** (שהקודקוד שלהן $A$ או $C$).",
            "$∡ADB$ ✗ – זו הזווית **השנייה** ב-$D$, זו שמשמאל לקטע $AD$.",
          ],
        },
      },
      {
        label: "ב",
        text: "באיזו מהזוויות הבאות מותר לכתוב את השם באמצעות **אות אחת** בלבד?",
        check: {
          kind: "single",
          options: [
            { text: "הזווית שקודקודה $A$", correct: false },
            { text: "הזווית שקודקודה $B$", correct: true },
            { text: "הזווית שקודקודה $D$", correct: false },
          ],
          right: "נכון! 🎉 מ-$B$ יוצאת זווית אחת בלבד ($∡ABC$), ולכן מותר לכתוב $∡B$.",
          wrong: "לא בדיוק. ספרי כמה זוויות יוצאות מכל נקודה. אות אחת מספיקה רק כשיש **זווית אחת** בקודקוד.",
        },
        hints: [
          {
            title: "רמז",
            body:
              "כמה קטעים יוצאים מכל נקודה?<br>" +
              "מ-$A$ יוצאים 3 קטעים ($AB$, $AD$, $AC$) – יש שם כמה זוויות. ומ-$B$?",
          },
        ],
        solution: {
          steps: [
            "מ-$A$ יוצאים שלושה קטעים, ויש שם שלוש זוויות ($∡BAD$, $∡DAC$, $∡BAC$) – צריך שלוש אותיות.",
            "מ-$D$ יוצאות שתי זוויות ($∡ADB$, $∡ADC$) – צריך שלוש אותיות.",
            "מ-$B$ יוצאים רק שני קטעים ($BA$ ו-$BC$), יש שם זווית אחת – מותר לכתוב **$∡B$**.",
          ],
        },
      },
    ],
  },

  {
    num: 105,
    shown: 5,
    text:
      "במערכת הצירים מסומנות הנקודות $A(1,2)$, $B(6,2)$, $C(6,6)$, $D(3,6)$, $E(9,2)$.<br>" +
      "הנקודות מחוברות כמו בסרטוט.",
    figure: {
      xMax: 10, yMax: 7, grid: true, ticks: true, width: 340,
      items: [
        { type: "polygon", pts: [[1, 2], [6, 2], [6, 6], [3, 6]], fill: "none" },
        { type: "segment", from: [6, 2], to: [9, 2] },
        { type: "point", x: 1, y: 2, label: "A", pos: "sw" },
        { type: "point", x: 6, y: 2, label: "B", pos: "s" },
        { type: "point", x: 6, y: 6, label: "C", pos: "ne" },
        { type: "point", x: 3, y: 6, label: "D", pos: "nw" },
        { type: "point", x: 9, y: 2, label: "E", pos: "se" },
      ],
    },
    parts: [
      {
        label: "א",
        text: "קבעי את סוג כל זווית: חדה / ישרה / קהה / שטוחה.",
        check: {
          kind: "table",
          choices: TYPES,
          rows: [
            { label: "$∡BAD$", answer: 0 },
            { label: "$∡BCD$", answer: 1 },
            { label: "$∡ADC$", answer: 2 },
            { label: "$∡ABE$", answer: 3 },
          ],
          right: "מצוין! 🌟 $∡BAD$ חדה, $∡BCD$ ישרה, $∡ADC$ קהה, $∡ABE$ שטוחה.",
        },
        hints: [
          {
            title: "רמז 1 – איך קוראים שם של שלוש אותיות",
            body:
              "האות **האמצעית** היא הקודקוד. למשל ב-$∡BAD$ הקודקוד הוא $A$, והשוקיים הולכות מ-$A$ אל $B$ ומ-$A$ אל $D$.<br>" +
              "מצאי כל זווית בסרטוט לפי שלוש האותיות שלה.",
            figure: {
              xMax: 10, yMax: 7, grid: true, ticks: true, width: 300,
              items: [
                { type: "polygon", pts: [[1, 2], [6, 2], [6, 6], [3, 6]], fill: "none" },
                { type: "segment", from: [6, 2], to: [9, 2] },
                { type: "angle", at: [1, 2], a: [6, 2], b: [3, 6], r: 20 },
                { type: "segment", from: [1, 2], to: [6, 2], color: "bad" },
                { type: "segment", from: [1, 2], to: [3, 6], color: "bad" },
                { type: "point", x: 1, y: 2, label: "A", pos: "sw", color: "bad" },
                { type: "point", x: 6, y: 2, label: "B", pos: "s" },
                { type: "point", x: 3, y: 6, label: "D", pos: "nw" },
                { type: "text", x: 3, y: 2.6, text: "∡BAD", color: "bad" },
              ],
            },
          },
          {
            title: "רמז 2 – הכלים מפרק 20",
            body:
              "**שטוחה**: שלוש הנקודות על אותו קו ישר. **ישרה**: שוק אופקית ושוק אנכית – כמו פינה של משבצת.<br>" +
              "ל**חדה** או **קהה**: מותחים קו אנכי מקווקו מהקודקוד ובודקים אם השוק השנייה לפניו או מעבר לו.",
          },
        ],
        solution: {
          steps: [
            "$∡BAD$ – קודקוד $A$: שוק ימינה אל $B$, ושוק אל $D(3,6)$ שנמצאת **לפני** הקו האנכי של $A$: **חדה**.",
            "$∡BCD$ – קודקוד $C$: שוק למטה אל $B$ (אנכית) ושוק שמאלה אל $D$ (אופקית): **ישרה**.",
            "$∡ADC$ – קודקוד $D$: שוק ימינה אל $C$, והשוק אל $A(1,2)$ יורדת **מעבר** לקו האנכי שיורד מ-$D$: **קהה**.",
            "$∡ABE$ – קודקוד $B$: $A$, $B$, $E$ כולן על הקו $y=2$: **שטוחה**.",
          ],
          figure: {
            xMax: 10, yMax: 7, grid: true, ticks: true, width: 320,
            items: [
              { type: "segment", from: [3, 6], to: [3, 1], dashed: true, color: "good" },
              { type: "polygon", pts: [[1, 2], [6, 2], [6, 6], [3, 6]], fill: "none" },
              { type: "segment", from: [6, 2], to: [9, 2] },
              { type: "angle", at: [1, 2], a: [6, 2], b: [3, 6], r: 18 },
              { type: "angle", at: [6, 6], a: [3, 6], b: [6, 2], r: 18, color: "edge" },
              { type: "angle", at: [3, 6], a: [1, 2], b: [6, 6], r: 18 },
              { type: "angle", at: [6, 2], a: [9, 2], b: [1, 2], r: 14 },
              { type: "point", x: 1, y: 2, label: "A", pos: "sw" },
              { type: "point", x: 6, y: 2, label: "B", pos: "s" },
              { type: "point", x: 6, y: 6, label: "C", pos: "ne" },
              { type: "point", x: 3, y: 6, label: "D", pos: "nw" },
              { type: "point", x: 9, y: 2, label: "E", pos: "se" },
            ],
          },
        },
      },
      {
        label: "ב",
        text: "מהו שם נוסף לזווית $∡ADC$?",
        check: {
          kind: "single",
          options: [
            { text: "$∡DAC$", correct: false },
            { text: "$∡CDA$", correct: true },
            { text: "$∡ACD$", correct: false },
            { text: "$∡DCA$", correct: false },
          ],
          right: "נכון! 🎉 קוראים את אותן אותיות מהצד השני – הקודקוד $D$ נשאר באמצע.",
          wrong: "לא בדיוק. בשם הנוסף הקודקוד חייב להישאר **באמצע**.",
        },
        hints: [{ title: "רמז", body: "אפשר לקרוא את שלוש האותיות מהסוף להתחלה – אבל האות האמצעית (הקודקוד) לא זזה." }],
        solution: { steps: ["$∡ADC = ∡CDA$ – אותן שלוש אותיות בסדר הפוך, והקודקוד $D$ באמצע."] },
      },
    ],
  },

  {
    num: 106,
    shown: 6,
    text:
      "בסרטוט משולש $KLM$. הנקודה $N$ נמצאת על הצלע $LM$, והקטע $KN$ מחבר אותה עם $K$.<br>" +
      "ארבע זוויות מסומנות באותיות יווניות.",
    figure: {
      xMax: 10.5, yMax: 6.5, axes: false, width: 340, height: 230,
      items: [
        { type: "polygon", pts: [[0.5, 1], [10, 1], [4, 6]], fill: "none" },
        { type: "segment", from: [4, 6], to: [6, 1] },
        { type: "angle", at: [0.5, 1], a: [10, 1], b: [4, 6], r: 26 },
        { type: "angle", at: [4, 6], a: [0.5, 1], b: [6, 1], r: 26 },
        { type: "angle", at: [6, 1], a: [10, 1], b: [4, 6], r: 22 },
        { type: "angle", at: [10, 1], a: [4, 6], b: [0.5, 1], r: 30 },
        { type: "text", x: 1.9, y: 1.5, text: "α" },
        { type: "text", x: 4.2, y: 4.7, text: "β" },
        { type: "text", x: 6.8, y: 1.6, text: "γ" },
        { type: "text", x: 8.3, y: 1.4, text: "δ" },
        { type: "point", x: 4, y: 6, label: "K", pos: "n" },
        { type: "point", x: 0.5, y: 1, label: "L", pos: "sw" },
        { type: "point", x: 10, y: 1, label: "M", pos: "se" },
        { type: "point", x: 6, y: 1, label: "N", pos: "s" },
      ],
    },
    parts: [
      {
        label: "א",
        text: "לכל אות יוונית, בחרי את שם הזווית שהיא מסמנת.",
        check: {
          kind: "table",
          choices: ["$∡KLN$", "$∡LKN$", "$∡KNM$", "$∡KMN$"],
          rows: [
            { label: "$α$", answer: 0 },
            { label: "$β$", answer: 1 },
            { label: "$γ$", answer: 2 },
            { label: "$δ$", answer: 3 },
          ],
          right: "כל הכבוד! 🌟 $α=∡KLN$, $β=∡LKN$, $γ=∡KNM$, $δ=∡KMN$.",
        },
        hints: [
          {
            title: "רמז 1 – מתחילים מהקודקוד",
            body:
              "לכל אות יוונית, מצאי מאיזו נקודה יוצאת הקשת שלה – זה הקודקוד, והוא **האות האמצעית** בשם.<br>" +
              "למשל $α$ יוצאת מ-$L$, אז השם שלה הוא $?L?$.",
          },
          {
            title: "רמז 2 – $β$ ו-$γ$",
            body:
              "$β$ יוצאת מ-$K$, והשוקיים שלה הולכות אל $L$ ואל $N$.<br>" +
              "$γ$ יוצאת מ-$N$, והשוקיים שלה הולכות אל $K$ ואל $M$.",
          },
        ],
        solution: {
          steps: [
            "$α$ – קודקוד $L$, שוקיים אל $K$ ואל $N$: $α = ∡KLN$.",
            "$β$ – קודקוד $K$, שוקיים אל $L$ ואל $N$: $β = ∡LKN$.",
            "$γ$ – קודקוד $N$, שוקיים אל $K$ ואל $M$: $γ = ∡KNM$.",
            "$δ$ – קודקוד $M$, שוקיים אל $K$ ואל $N$: $δ = ∡KMN$.",
          ],
        },
      },
      {
        label: "ב",
        text: "איזו מהטענות הבאות **איננה** נכונה?",
        check: {
          kind: "single",
          options: [
            { text: "$α = ∡KLM$", correct: false },
            { text: "$β = ∡K$", correct: true },
            { text: "$γ = ∡MNK$", correct: false },
            { text: "$δ = ∡M$", correct: false },
          ],
          right: "נכון! 👏 מ-$K$ יוצאות כמה זוויות ($∡LKN$, $∡NKM$, $∡LKM$), ולכן אי אפשר לכתוב $β = ∡K$.",
          wrong: "לא בדיוק. בדקי בכל טענה: האם השם מתאר **רק** את הזווית המסומנת? כמה זוויות יש בכל קודקוד?",
        },
        hints: [
          {
            title: "רמז 1",
            body: "$N$ נמצאת על $LM$, ולכן הקרן מ-$L$ אל $N$ והקרן מ-$L$ אל $M$ הן **אותה קרן**. האם $∡KLM$ ו-$∡KLN$ הן אותה זווית?",
          },
          {
            title: "רמז 2",
            body: "שם של אות אחת מותר רק כשבקודקוד יש **זווית אחת**. ספרי כמה זוויות יש ב-$K$ וכמה ב-$M$.",
          },
        ],
        solution: {
          steps: [
            "$α = ∡KLM$ – נכון: $N$ על הקרן מ-$L$ אל $M$, אז $∡KLM$ ו-$∡KLN$ הן אותה זווית.",
            "$γ = ∡MNK$ – נכון: אותן אותיות של $∡KNM$ בסדר הפוך, והקודקוד $N$ באמצע.",
            "$δ = ∡M$ – נכון: ב-$M$ יש זווית אחת בלבד.",
            "$β = ∡K$ – **לא נכון**: ב-$K$ יש שלוש זוויות ($∡LKN$, $∡NKM$, $∡LKM$), ו-$∡K$ לא אומר לאיזו מהן התכוונו.",
          ],
        },
      },
    ],
  },
];

CHAPTERS.push({
  id: "angles",
  icon: "📐",
  short: "זוויות",
  title: "זוויות",
  subtitle: "פרקים 20–21: זיהוי זוויות, סוגי זוויות, וסימון זוויות בכתיב מתמטי",
  learnBlurb: "קרן, זווית, קודקוד ושוקיים; זווית ישרה, חדה, קהה ושטוחה; דף המשבצות; ואיך כותבים זווית: $∡B$, $∡ABC$, ו-$α$, $β$, $γ$, $δ$.",
  learn: ANGLES_LEARN,
  questions: ANGLES_QUESTIONS,
});
