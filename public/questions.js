// All lesson content. Text conventions (see fmt() in app.js):
//   $...$   -> math / coordinates, rendered left-to-right inside the Hebrew text
//   **...** -> bold
// Figures are drawn by renderFigure() in app.js from plain data.

const LESSON = {
  title: "מערכת צירים",
  subtitle: "פרק 3: אורכי קטעים המקבילים לצירים, היקפים ושטחים",
};

// The explanatory material + the two worked examples from page 30.
const LEARN = {
  keyIdeas: [
    {
      title: "קטע המקביל לציר ה-$x$ (אופקי)",
      body:
        "לשתי נקודות הקצה יש **אותו שיעור $y$**.<br>" +
        "אורך הקטע = ההפרש בין שיעורי ה-$x$ (הגדול פחות הקטן).<br>" +
        "דוגמה: $(2,4)$ ו-$(7,4)$ ← אורך $7-2=5$",
    },
    {
      title: "קטע המקביל לציר ה-$y$ (אנכי)",
      body:
        "לשתי נקודות הקצה יש **אותו שיעור $x$**.<br>" +
        "אורך הקטע = ההפרש בין שיעורי ה-$y$.<br>" +
        "דוגמה: $(3,1)$ ו-$(3,6)$ ← אורך $6-1=5$",
    },
    {
      title: "מלבן / ריבוע שצלעותיו מקבילות לצירים",
      body:
        "נקודה נמצאת **בתוך** המלבן אם שיעור ה-$x$ שלה נמצא בין שני ה-$x$ של המלבן, " +
        "**וגם** שיעור ה-$y$ שלה נמצא בין שני ה-$y$ של המלבן.<br>" +
        "נקודה **על צלע**: אחד השיעורים שווה בדיוק לגבול, והשני בטווח.<br>" +
        "אחרת – הנקודה **מחוץ** למלבן.",
    },
    {
      title: "היקף ושטח",
      body:
        "היקף מלבן = סכום אורכי 4 הצלעות = 2 × אורך + 2 × רוחב<br>" +
        "שטח מלבן = אורך × רוחב<br>" +
        "בריבוע כל הצלעות שוות: היקף = 4 × צלע, שטח = צלע × צלע",
    },
  ],
  intro:
    "לעיתים נדרש למצוא שיעורי נקודת קצה של קטע המקביל לאחד מהצירים, כאשר נתון אורך הקטע " +
    "ונתונים שיעורי נקודת הקצה האחרת של הקטע.",
  examples: [
    {
      num: 1,
      text:
        "הקטע $MP$ הנתון בסרטוט מקביל לציר ה-$x$, ואורכו הוא $3$. " +
        "היעזרו בנתונים שבסרטוט, ומצאו את שיעורי הנקודה $P$.",
      figure: {
        xMax: 9, yMax: 4, grid: true, ticks: true,
        items: [
          { type: "segment", from: [4, 2], to: [7, 2] },
          { type: "point", x: 4, y: 2, label: "M(4,2)", pos: "n" },
          { type: "point", x: 7, y: 2, label: "P(__,__)", pos: "n" },
        ],
      },
      solution: [
        "הקטע $MP$ מקביל לציר ה-$x$, ולכן שיעור ה-$y$ של הנקודה $P$ שווה לשיעור ה-$y$ של הנקודה $M$, והוא $2$.",
        "הנקודה $P$ נמצאת **מימין** לנקודה $M$, ולכן שיעור ה-$x$ שלה **גדול ב-$3$** משיעור ה-$x$ של הנקודה $M$ ← $4+3=7$.",
        "שיעורי הנקודה $P$ הם $(7,2)$.",
      ],
    },
    {
      num: 2,
      text:
        "בסרטוט נתון ריבוע שצלעותיו מקבילות לצירים. שניים מקודקודי הריבוע הם $L$ ו-$K(3,4)$. " +
        "היקף הריבוע הוא $8$.<br>(א) מהו אורך הצלע $KL$? &nbsp; (ב) מצאו את שיעורי הנקודה $L$.",
      figure: {
        xMax: 5, yMax: 5, grid: true, ticks: true,
        items: [
          { type: "polygon", pts: [[1, 2], [3, 2], [3, 4], [1, 4]], fill: "soft" },
          { type: "point", x: 3, y: 4, label: "K(3,4)", pos: "ne" },
          { type: "point", x: 3, y: 2, label: "L", pos: "se" },
        ],
      },
      solution: [
        "(א) היקף הריבוע הוא סכום אורכי 4 הצלעות של הריבוע, והן שוות באורכן. לכן אורך הצלע $KL$ הוא $2$, לפי החישוב: $8:4=2$.",
        "(ב) הקטע $KL$ מקביל לציר ה-$y$, ולכן שיעור ה-$x$ של הנקודה $L$ **שווה** לשיעור ה-$x$ של הנקודה $K$, והוא $3$.",
        "הנקודה $L$ נמצאת **מתחת** לנקודה $K$, ולכן שיעור ה-$y$ שלה **קטן ב-$2$** משיעור ה-$y$ של הנקודה $K$ (כי אורך צלע הריבוע הוא $2$, כפי שחישבנו בסעיף (א)) ← $4-2=2$.",
        "שיעורי הנקודה $L$ הם $(3,2)$.",
      ],
    },
  ],
};

// Questions 16-22 (pages 29-30). Only Q16 has hints/solutions so far;
// the rest are the full question + drawing, with hints to be added.
const QUESTIONS = [
  {
    num: 16,
    page: 29,
    text:
      "הקטע $AB$ שבסרטוט מקביל לציר ה-$x$.<br>" +
      "נועם סרטט ריבוע ש-$AB$ הוא צלע שלו.<br>" +
      "אורך צלע של כל משבצת במערכת הצירים מייצג יחידה אחת.",
    figure: {
      xMax: 6, yMax: 7, grid: true,
      items: [
        { type: "point", x: 2, y: 4, label: "A", pos: "n" },
        { type: "point", x: 4, y: 4, label: "B", pos: "n" },
      ],
    },
    parts: [
      {
        label: "א",
        text: "בחרו את הנקודות היכולות להיות בתוך הריבוע שסרטט נועם.",
        check: {
          kind: "multi",
          options: [
            { text: "$(5,6)$", correct: false },
            { text: "$(2,6)$", correct: false },
            { text: "$(2½,2½)$", correct: true },
            { text: "$(3,1)$", correct: false },
          ],
          right: "כל הכבוד אופיר! 🎉 רק הנקודה $(2½,2½)$ יכולה להיות בתוך הריבוע.",
          wrong: "עוד לא… נסי לפתוח את הרמזים, ונבדוק כל נקודה בנפרד.",
        },
        hints: [
          {
            title: "רמז 1 – מה רואים בסרטוט?",
            body:
              "התחילי במציאת השיעורים של $A$ ושל $B$. " +
              "ספרי משבצות: כמה משבצות ימינה מהראשית (זה ה-$x$) וכמה משבצות למעלה (זה ה-$y$)?",
            figure: {
              xMax: 6, yMax: 7, grid: true, ticks: true,
              items: [
                { type: "point", x: 2, y: 4, label: "A(2,4)", pos: "nw" },
                { type: "point", x: 4, y: 4, label: "B(4,4)", pos: "ne" },
              ],
            },
          },
          {
            title: "רמז 2 – מה אורך הצלע?",
            body:
              "$AB$ מקביל לציר ה-$x$, ולכן אורכו הוא ההפרש בין שיעורי ה-$x$:<br>" +
              "$4-2=2$<br>" +
              "כלומר, הצלע של הריבוע של נועם היא באורך **$2$ יחידות**.",
          },
          {
            title: "רמז 3 – איפה יכול להיות הריבוע?",
            body:
              "נועם יכול היה לסרטט את הריבוע **מעל** הקטע $AB$ או **מתחת** לקטע $AB$. " +
              "אנחנו לא יודעים איזה מהם הוא בחר – לכן צריך לבדוק את **שתי האפשרויות**!",
            figure: {
              xMax: 6, yMax: 7, grid: true, ticks: true,
              items: [
                { type: "polygon", pts: [[2, 4], [4, 4], [4, 6], [2, 6]], fill: "blue", label: "אפשרות 1", labelAt: [3, 5] },
                { type: "polygon", pts: [[2, 2], [4, 2], [4, 4], [2, 4]], fill: "orange", label: "אפשרות 2", labelAt: [3, 3] },
                { type: "segment", from: [2, 4], to: [4, 4], strong: true },
                { type: "point", x: 2, y: 4, label: "A", pos: "w" },
                { type: "point", x: 4, y: 4, label: "B", pos: "e" },
              ],
            },
          },
          {
            title: "רמז 4 – מה הגבולות של כל אפשרות?",
            body:
              "<span class='tag blue'>אפשרות 1 (מעל)</span> קודקודים: $(2,4)$, $(4,4)$, $(4,6)$, $(2,6)$.<br>" +
              "בתוכו: $x$ בין $2$ ל-$4$ **וגם** $y$ בין $4$ ל-$6$.<br><br>" +
              "<span class='tag orange'>אפשרות 2 (מתחת)</span> קודקודים: $(2,2)$, $(4,2)$, $(4,4)$, $(2,4)$.<br>" +
              "בתוכו: $x$ בין $2$ ל-$4$ **וגם** $y$ בין $2$ ל-$4$.<br><br>" +
              "עכשיו נסי לבדוק כל אחת מארבע הנקודות!",
          },
        ],
        solution: {
          steps: [
            "$(5,6)$ – שיעור ה-$x$ הוא $5$, וזה **יותר מ-$4$**. הנקודה מימין לשני הריבועים ← **לא בתוך**.",
            "$(2,6)$ – זה בדיוק הקודקוד השמאלי-העליון של אפשרות 1. הנקודה **על** הריבוע (על הצלע), ולא **בתוכו** ← **לא בתוך**.",
            "$(2½,2½)$ – $x=2½$ בין $2$ ל-$4$ ✓, $y=2½$ בין $2$ ל-$4$ ✓ ← **בתוך** הריבוע של אפשרות 2!",
            "$(3,1)$ – שיעור ה-$y$ הוא $1$, וזה **פחות מ-$2$**. הנקודה מתחת לשני הריבועים ← **לא בתוך**.",
            "**התשובה:** רק הנקודה $(2½,2½)$ יכולה להיות בתוך הריבוע (אם נועם סרטט אותו מתחת ל-$AB$).",
          ],
          figure: {
            xMax: 6, yMax: 7, grid: true, ticks: true,
            items: [
              { type: "polygon", pts: [[2, 4], [4, 4], [4, 6], [2, 6]], fill: "blue" },
              { type: "polygon", pts: [[2, 2], [4, 2], [4, 4], [2, 4]], fill: "orange" },
              { type: "point", x: 5, y: 6, label: "(5,6) ✗", pos: "e", color: "bad" },
              { type: "point", x: 2, y: 6, label: "(2,6) ✗", pos: "nw", color: "bad" },
              { type: "point", x: 2.5, y: 2.5, label: "(2½,2½) ✓", pos: "se", color: "good" },
              { type: "point", x: 3, y: 1, label: "(3,1) ✗", pos: "e", color: "bad" },
            ],
          },
        },
      },
      {
        label: "ב",
        star: true,
        text:
          "נתונות הנקודות הבאות:<br>" +
          "<span class='nw'>① $(4,6)$</span> &nbsp;&nbsp; <span class='nw'>② $(5,4)$</span> &nbsp;&nbsp; <span class='nw'>③ $(3.5,4)$</span> &nbsp;&nbsp; <span class='nw'>④ $(2.5,1)$</span><br>" +
          "איזו נקודה נמצאת **בוודאות** על אחת מצלעות הריבוע?",
        check: {
          kind: "single",
          options: [
            { text: "<span class='nw'>① $(4,6)$</span>", correct: false },
            { text: "<span class='nw'>② $(5,4)$</span>", correct: false },
            { text: "<span class='nw'>③ $(3.5,4)$</span>", correct: true },
            { text: "<span class='nw'>④ $(2.5,1)$</span>", correct: false },
          ],
          right: "מצוין אופיר! ⭐ $(3.5,4)$ נמצאת על $AB$ – והצלע $AB$ נמצאת בריבוע בכל מקרה.",
          wrong: "לא בדיוק. רמז: מה המשמעות של המילה \"בוודאות\"? פתחי את הרמזים.",
        },
        hints: [
          {
            title: "רמז 1 – מה זה \"בוודאות\"?",
            body:
              "אנחנו לא יודעים אם נועם סרטט את הריבוע מעל $AB$ או מתחתיו. " +
              "נקודה נמצאת **בוודאות** על צלע של הריבוע רק אם היא על צלע **בשתי האפשרויות**.",
          },
          {
            title: "רמז 2 – איזו צלע משותפת לשתי האפשרויות?",
            body:
              "הסתכלי על הסרטוט: שתי האפשרויות נפגשות בצלע אחת – זו הצלע שנועם התחיל ממנה!",
            figure: {
              xMax: 6, yMax: 7, grid: true, ticks: true,
              items: [
                { type: "polygon", pts: [[2, 4], [4, 4], [4, 6], [2, 6]], fill: "blue" },
                { type: "polygon", pts: [[2, 2], [4, 2], [4, 4], [2, 4]], fill: "orange" },
                { type: "segment", from: [2, 4], to: [4, 4], strong: true },
                { type: "point", x: 2, y: 4, label: "A", pos: "w" },
                { type: "point", x: 4, y: 4, label: "B", pos: "e" },
              ],
            },
          },
          {
            title: "רמז 3 – מתי נקודה נמצאת על הקטע AB?",
            body:
              "הצלע המשותפת היא $AB$, מ-$(2,4)$ עד $(4,4)$.<br>" +
              "נקודה על $AB$ צריכה: שיעור $y$ **שווה בדיוק ל-$4$**, **וגם** שיעור $x$ בין $2$ ל-$4$.",
          },
        ],
        solution: {
          steps: [
            "<span class='nw'>① $(4,6)$</span> – זה קודקוד של אפשרות 1 בלבד. אם הריבוע מתחת ל-$AB$, הנקודה בכלל לא עליו ← **לא בוודאות**.",
            "<span class='nw'>② $(5,4)$</span> – $y=4$ ✓, אבל $x=5$ גדול מ-$4$: הנקודה על אותו קו כמו $AB$, אבל **אחרי** $B$ ← **לא על הריבוע**.",
            "<span class='nw'>③ $(3.5,4)$</span> – $y=4$ ✓, $x=3.5$ בין $2$ ל-$4$ ✓ ← הנקודה **על הקטע $AB$**, שהוא צלע בשתי האפשרויות!",
            "<span class='nw'>④ $(2.5,1)$</span> – $y=1$, מתחת לשני הריבועים ← **לא על הריבוע**.",
            "**התשובה: <span class='nw'>③ $(3.5,4)$</span>**",
          ],
          figure: {
            xMax: 6, yMax: 7, grid: true, ticks: true,
            items: [
              { type: "polygon", pts: [[2, 4], [4, 4], [4, 6], [2, 6]], fill: "blue" },
              { type: "polygon", pts: [[2, 2], [4, 2], [4, 4], [2, 4]], fill: "orange" },
              { type: "segment", from: [2, 4], to: [4, 4], strong: true },
              { type: "point", x: 4, y: 6, label: "①", pos: "ne", color: "bad" },
              { type: "point", x: 5, y: 4, label: "②", pos: "e", color: "bad" },
              { type: "point", x: 3.5, y: 4, label: "③ ✓", pos: "n", color: "good" },
              { type: "point", x: 2.5, y: 1, label: "④", pos: "e", color: "bad" },
            ],
          },
        },
      },
    ],
  },

  {
    num: 17,
    page: 29,
    text: "בסרטוט נתון מלבן שצלעותיו מקבילות לצירים.",
    figure: {
      xMax: 100, yMax: 60, width: 360,
      items: [
        { type: "polygon", pts: [[30, 10], [80, 10], [80, 50], [30, 50]], fill: "none" },
        { type: "point", x: 30, y: 50, label: "(__,50)", pos: "nw" },
        { type: "point", x: 80, y: 50, label: "(__,__)", pos: "ne" },
        { type: "point", x: 30, y: 10, label: "(30,10)", pos: "sw" },
        { type: "point", x: 80, y: 10, label: "(80,__)", pos: "se" },
      ],
    },
    parts: [
      { label: "א", text: "השלימו את השיעורים החסרים של קודקודי המלבן." },
      { label: "ב", text: "חשבו את שטח המלבן." },
      { label: "ג", text: "האם יכולתם לענות על סעיף (ב) לפני סעיף (א)? אם כן, הסבירו כיצד." },
    ],
  },

  {
    num: 18,
    page: 29,
    text: "נתון מלבן שצלעותיו מקבילות לצירים כמתואר בסרטוט.",
    figure: {
      xMax: 8, yMax: 14, width: 300, height: 340,
      items: [
        { type: "polygon", pts: [[1, 2], [6, 2], [6, 12], [1, 12]], fill: "none" },
        { type: "point", x: 1, y: 12, label: "A(1,__)", pos: "n" },
        { type: "point", x: 6, y: 12, label: "B(__,12)", pos: "n" },
        { type: "point", x: 1, y: 2, label: "D(__,2)", pos: "s" },
        { type: "point", x: 6, y: 2, label: "C(6,__)", pos: "s" },
      ],
    },
    parts: [
      { label: "א", text: "השלימו את שיעורי הקודקודים של המלבן." },
      { label: "ב", text: "כתבו שיעורי נקודה הנמצאת בתוך המלבן." },
      { label: "ג", text: "כתבו שיעורי נקודה הנמצאת על אחת מצלעות המלבן (ואיננה אחד מקודקודיו)." },
      { label: "ד", text: "חשבו את היקף המלבן." },
    ],
  },

  {
    num: 19,
    page: 29,
    text: "בסרטוט נתון מלבן שצלעותיו מקבילות לצירים.<br>חשבו את:",
    figure: {
      xMax: 15, yMax: 12, width: 340,
      items: [
        { type: "polygon", pts: [[7, 4], [12, 4], [12, 10], [7, 10]], fill: "none" },
        { type: "point", x: 12, y: 10, label: "(12,10)", pos: "ne" },
        { type: "point", x: 7, y: 4, label: "(7,4)", pos: "sw" },
      ],
    },
    parts: [
      { label: "א", text: "אורכי הצלעות של המלבן." },
      { label: "ב", text: "היקף המלבן." },
      { label: "ג", text: "שטח המלבן." },
    ],
  },

  {
    num: 20,
    page: 29,
    text:
      "במערכת הצירים שלפניכם נתון מלבן $AMIT$ שצלעותיו מקבילות לצירים.<br>" +
      "נתון: $M(7,4)$ , $T(2,1)$ .",
    figure: {
      xMax: 9, yMax: 6, width: 360,
      items: [
        { type: "polygon", pts: [[2, 1], [7, 1], [7, 4], [2, 4]], fill: "soft" },
        { type: "point", x: 2, y: 4, label: "A", pos: "nw" },
        { type: "point", x: 7, y: 4, label: "M(7,4)", pos: "ne" },
        { type: "point", x: 7, y: 1, label: "I", pos: "se" },
        { type: "point", x: 2, y: 1, label: "T(2,1)", pos: "sw" },
      ],
    },
    parts: [
      { label: "א", text: "חשבו את שטח המלבן." },
      { label: "ב", text: "על איזו צלע של המלבן נמצאות נקודות ששיעור ה-$y$ שלהן הוא $4$?" },
      { label: "ג", text: "האם הנקודה $(1,4)$ נמצאת על אחת מצלעות המלבן? נמקו את תשובתכם." },
    ],
  },

  {
    num: 21,
    page: 30,
    text:
      "בסרטוט נתון ריבוע שצלעותיו מקבילות לצירים.<br>" +
      "שניים מקודקודי הריבוע הם $A$ ו-$C$. השיעורים של קודקוד $A$ הם $(2,4)$.<br>" +
      "שיעור ה-$y$ של קודקוד $C$ הוא $6$.",
    figure: {
      xMax: 6, yMax: 7, width: 300,
      items: [
        { type: "polygon", pts: [[2, 4], [4, 4], [4, 6], [2, 6]], fill: "none" },
        { type: "point", x: 2, y: 4, label: "A(2,4)", pos: "sw" },
        { type: "point", x: 4, y: 6, label: "C(__,6)", pos: "ne" },
      ],
    },
    parts: [
      { label: "א", text: "חשבו את היקף הריבוע." },
      { label: "ב", text: "מהו שיעור ה-$x$ של קודקוד $C$?" },
      {
        label: "ג",
        text:
          "כתבו היכן נמצאת הנקודה הנתונה בכל סעיף:<br>" +
          "בתוך הריבוע / על צלע הריבוע / מחוץ לריבוע.<br>" +
          "<span class='nw'>1. $(3,5)$</span> &nbsp;&nbsp; <span class='nw'>2. $(4,7)$</span> &nbsp;&nbsp; <span class='nw'>3. $(2,5)$</span> &nbsp;&nbsp; <span class='nw'>4. $(6,4)$</span> &nbsp;&nbsp; <span class='nw'>5. $(3.25,6)$</span>",
      },
    ],
  },

  {
    num: 22,
    page: 30,
    text: "הקטע $PQ$ מקביל לציר ה-$y$ והוא אחת מצלעותיו של ריבוע.",
    figure: {
      xMax: 6, yMax: 7, width: 300,
      items: [
        { type: "segment", from: [3, 1], to: [3, 6] },
        { type: "point", x: 3, y: 6, label: "P(__,6)", pos: "e" },
        { type: "point", x: 3, y: 1, label: "Q(3,1)", pos: "e" },
      ],
    },
    parts: [
      { label: "א", text: "חשבו את:<br>1. שטח הריבוע.<br>2. היקף הריבוע." },
      { label: "ב", text: "מצאו את שיעור ה-$x$ של נקודה $P$." },
    ],
  },
];
