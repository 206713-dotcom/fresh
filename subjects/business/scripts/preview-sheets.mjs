import fs from "fs";

let src = fs.readFileSync("src/lib/data/one-page-sheets.ts", "utf8");
src = src.replace(/export interface[\s\S]*?^}\r?\n/gm, "");
src = src.replace(/export const ONE_PAGE_SHEETS[^=]*=/, "globalThis.ONE_PAGE_SHEETS =");
eval(src);
const sheets = globalThis.ONE_PAGE_SHEETS;

const pages = sheets
  .map((sheet) => {
    const blocks = sheet.blocks
      .map(
        (b) =>
          `<section class="block"><h3><span>${b.code}</span> ${b.title}</h3><ul>${b.lines
            .map((l) => `<li>${l}</li>`)
            .join("")}</ul></section>`
      )
      .join("");
    return `<article class="sheet" data-code="${sheet.code}"><header><div><div class="kicker">Cambridge IGCSE Business 0264 / 0450</div><h2>${sheet.code}. ${sheet.title}</h2><p>${sheet.strap}</p></div><div class="num">${sheet.code}/6<div>One-page sheet</div></div></header><div class="body">${blocks}</div><footer><span>EcBiz</span><span>One page</span></footer></article>`;
  })
  .join("");

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body { margin: 0; background: #eee; font-family: "Segoe UI", sans-serif; }
  .sheet { width: 210mm; height: 297mm; box-sizing: border-box; overflow: hidden; background: white; display: flex; flex-direction: column; margin: 12px auto; }
  header { padding: 7mm 9mm 2.5mm; border-bottom: 2.5px solid #0F2042; display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; }
  .kicker { font: 700 9px ui-monospace, monospace; letter-spacing: 0.14em; text-transform: uppercase; color: #8B1E1E; }
  h2 { font-family: Georgia, serif; font-size: 18px; line-height: 1.15; color: #0F2042; margin: 2px 0 0; }
  header p { font-size: 9.5px; color: #57534E; margin: 2px 0 0; }
  .num { text-align: right; font-family: Georgia, serif; font-size: 22px; font-weight: 700; color: #0F2042; line-height: 1; }
  .num div { font: 8px ui-monospace, monospace; text-transform: uppercase; color: #78716C; margin-top: 2px; }
  .body { flex: 1; min-height: 0; padding: 3.5mm 9mm; columns: 2; column-gap: 6mm; column-fill: balance; }
  .block { break-inside: avoid; margin-bottom: 3.2mm; }
  h3 { font-size: 10.5px; color: #0F2042; border-bottom: 1px solid #E7E5E4; margin: 0 0 1.5px; padding-bottom: 1px; }
  h3 span { font-family: ui-monospace, monospace; font-size: 9px; color: #8B1E1E; }
  ul { margin: 0; padding: 0; list-style: none; }
  li { font-size: 8.6px; line-height: 1.28; margin: 0 0 1.5px; padding-left: 7px; position: relative; }
  footer { padding: 2.5mm 9mm; border-top: 1px solid #E7E5E4; display: flex; justify-content: space-between; font: 8px ui-monospace, monospace; color: #78716C; }
</style></head><body>${pages}<script>
  const pxPerMm = 96 / 25.4;
  const limit = 297 * pxPerMm;
  const rows = [...document.querySelectorAll('.sheet')].map((sheet) => {
    const body = sheet.querySelector('.body');
    sheet.style.height = 'auto';
    sheet.style.overflow = 'visible';
    const h = sheet.getBoundingClientRect().height;
    return { code: sheet.dataset.code, heightMm: +(h / pxPerMm).toFixed(1), overflowMm: +((h - limit) / pxPerMm).toFixed(1), bodyH: Math.round(body.getBoundingClientRect().height) };
  });
  document.body.insertAdjacentHTML('afterbegin', '<pre id="measure">' + JSON.stringify(rows, null, 2) + '</pre>');
</script></body></html>`;

fs.writeFileSync("sheet-preview.html", html);
console.log("wrote", sheets.length);
