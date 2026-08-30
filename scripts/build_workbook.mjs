import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const repoRoot = path.resolve(import.meta.dirname, "..");
const outputPath = path.join(repoRoot, "finance", "makhana-gtm-model.xlsx");
const previewDir = path.join(repoRoot, "visuals", "workbook");

const wb = Workbook.create();
const dash = wb.worksheets.add("Decision Dashboard");
const assumptions = wb.worksheets.add("Assumptions");
const packs = wb.worksheets.add("Pack Economics");
const monthly = wb.worksheets.add("Monthly Pilot");
const sensitivity = wb.worksheets.add("Sensitivity");
const budget = wb.worksheets.add("Pilot Budget");
const sources = wb.worksheets.add("Sources and Notes");

const C = {
  ink: "#172033", green: "#17745C", dark: "#12382F", lime: "#DDF2E8",
  sand: "#F6F1E8", amber: "#F4B942", paleAmber: "#FFF3D6", red: "#B23A3A",
  paleRed: "#FBEAEA", gray: "#66716D", line: "#D7DED9", white: "#FFFFFF",
};

function title(sheet, range, text) {
  sheet.mergeCells(range);
  const start = range.split(":")[0];
  sheet.getRange(start).values = [[text]];
  sheet.getRange(range).format = { fill: C.dark, font: { bold: true, color: C.white, size: 18 }, verticalAlignment: "center" };
}

function header(range) {
  range.format = { fill: C.green, font: { bold: true, color: C.white }, verticalAlignment: "center", borders: { preset: "all", style: "thin", color: C.green } };
}

function section(range, text) {
  range.merge();
  range.values = [[text]];
  range.format = { fill: C.dark, font: { bold: true, color: C.white }, verticalAlignment: "center" };
}

// Assumptions
assumptions.showGridLines = false;
title(assumptions, "A1:G2", "Makhana pilot assumptions | blue cells are inputs");
assumptions.getRange("A4:G4").values = [["Section", "Input", "Downside", "Base", "Upside", "Unit", "Note"]];
header(assumptions.getRange("A4:G4"));
const assumptionRows = [
  ["Trial pack", "MRP", 50, 50, 50, "INR", "Planning assumption"],
  ["Trial pack", "Consumer discount", 0.05, 0.03, 0, "% MRP", "Planning assumption"],
  ["Trial pack", "GST", 0.12, 0.12, 0.12, "rate", "Confirm final HSN"],
  ["Trial pack", "Channel deduction", 0.38, 0.32, 0.25, "% ex-GST sales", "Replace with signed terms"],
  ["Trial pack", "Product cost", 29, 25, 22, "INR/pack", "Replace with quote"],
  ["Trial pack", "Fulfilment + variable ops", 4, 3.5, 3, "INR/pack", "Planning assumption"],
  ["Trial pack", "Variable marketing + samples", 5, 3.5, 2, "INR/pack", "Planning assumption"],
  ["Core pack", "MRP", 149, 149, 149, "INR", "Planning assumption"],
  ["Core pack", "Consumer discount", 0.10, 0.05, 0, "% MRP", "Planning assumption"],
  ["Core pack", "GST", 0.12, 0.12, 0.12, "rate", "Confirm final HSN"],
  ["Core pack", "Channel deduction", 0.38, 0.30, 0.25, "% ex-GST sales", "Replace with signed terms"],
  ["Core pack", "Product cost", 66, 57.5, 50, "INR/pack", "Replace with quote"],
  ["Core pack", "Fulfilment + variable ops", 7, 6, 5, "INR/pack", "Planning assumption"],
  ["Core pack", "Variable marketing + samples", 10, 7, 4, "INR/pack", "Planning assumption"],
  ["Pilot", "Quick-commerce nodes at peak", 40, 60, 80, "nodes", "Only after product and price gates"],
  ["Pilot", "Median core packs/node/week", 3, 6, 9, "packs", "Management scenario"],
  ["Pilot", "8-week repeat", 0.12, 0.20, 0.28, "rate", "Management scenario"],
  ["Pilot", "Fixed operating cost", 300000, 250000, 220000, "INR/month", "Lean pilot"],
];
assumptions.getRange("A5:G22").values = assumptionRows;
assumptions.getRange("C5:E22").format = { fill: "#E8F3FA", font: { color: C.ink }, numberFormat: "0.00" };
assumptions.getRange("C6:E8").format.numberFormat = "0%";
assumptions.getRange("C9:E9").format.numberFormat = '"INR "#,##0.00';
assumptions.getRange("C13:E15").format.numberFormat = "0%";
assumptions.getRange("C16:E18").format.numberFormat = '"INR "#,##0.00';
assumptions.getRange("C21:E21").format.numberFormat = "0%";
assumptions.getRange("C22:E22").format.numberFormat = '"INR "#,##0';
assumptions.getRange("A5:A22").format = { fill: C.lime, font: { bold: true, color: C.dark } };
assumptions.getRange("A4:G22").format.borders = { preset: "inside", style: "thin", color: C.line };
assumptions.getRange("A:A").format.columnWidth = 16;
assumptions.getRange("B:B").format.columnWidth = 32;
assumptions.getRange("C:E").format.columnWidth = 14;
assumptions.getRange("F:F").format.columnWidth = 18;
assumptions.getRange("G:G").format.columnWidth = 34;
assumptions.freezePanes.freezeRows(4);

// Pack economics
packs.showGridLines = false;
title(packs, "A1:M2", "Pack economics | contribution before fixed cost");
packs.getRange("A4:M4").values = [["Scenario", "Pack", "MRP", "Discount", "Selling price", "GST", "Ex-GST sales", "Channel %", "Channel INR", "Product cost", "CM1", "Fulfilment + marketing", "CM2"]];
header(packs.getRange("A4:M4"));
const scenarioDefs = [
  ["Downside", "Trial", 5], ["Downside", "Core", 12],
  ["Base", "Trial", 5], ["Base", "Core", 12],
  ["Upside", "Trial", 5], ["Upside", "Core", 12],
];
packs.getRange("A5:B10").values = scenarioDefs.map(([scenario, pack]) => [scenario, pack]);
for (let i = 0; i < scenarioDefs.length; i += 1) {
  const row = 5 + i;
  const scenarioColumn = i < 2 ? "C" : i < 4 ? "D" : "E";
  const inputStart = scenarioDefs[i][2];
  packs.getRange(`C${row}`).formulas = [[`=Assumptions!${scenarioColumn}${inputStart}`]];
  packs.getRange(`D${row}`).formulas = [[`=Assumptions!${scenarioColumn}${inputStart + 1}`]];
  packs.getRange(`E${row}`).formulas = [[`=C${row}*(1-D${row})`]];
  packs.getRange(`F${row}`).formulas = [[`=Assumptions!${scenarioColumn}${inputStart + 2}`]];
  packs.getRange(`G${row}`).formulas = [[`=E${row}/(1+F${row})`]];
  packs.getRange(`H${row}`).formulas = [[`=Assumptions!${scenarioColumn}${inputStart + 3}`]];
  packs.getRange(`I${row}`).formulas = [[`=G${row}*H${row}`]];
  packs.getRange(`J${row}`).formulas = [[`=Assumptions!${scenarioColumn}${inputStart + 4}`]];
  packs.getRange(`K${row}`).formulas = [[`=G${row}-I${row}-J${row}`]];
  packs.getRange(`L${row}`).formulas = [[`=Assumptions!${scenarioColumn}${inputStart + 5}+Assumptions!${scenarioColumn}${inputStart + 6}`]];
  packs.getRange(`M${row}`).formulas = [[`=K${row}-L${row}`]];
}
packs.getRange("C5:C10").format.numberFormat = '"INR "#,##0.00';
packs.getRange("D5:D10").format.numberFormat = "0%";
packs.getRange("E5:E10").format.numberFormat = '"INR "#,##0.00';
packs.getRange("F5:F10").format.numberFormat = "0%";
packs.getRange("G5:G10").format.numberFormat = '"INR "#,##0.00';
packs.getRange("H5:H10").format.numberFormat = "0%";
packs.getRange("I5:M10").format.numberFormat = '"INR "#,##0.00';
packs.getRange("A5:M10").format.borders = { preset: "all", style: "thin", color: C.line };
packs.getRange("A5:B10").format = { fill: C.sand, font: { bold: true, color: C.ink } };
packs.getRange("M5:M10").conditionalFormats.add("cellIs", { operator: "lessThan", formula: 0, format: { fill: C.paleRed, font: { bold: true, color: C.red } } });
packs.getRange("M5:M10").conditionalFormats.add("cellIs", { operator: "greaterThanOrEqual", formula: 0, format: { fill: C.lime, font: { bold: true, color: C.green } } });
packs.getRange("A:M").format.columnWidth = 15;
packs.getRange("B:B").format.columnWidth = 11;
packs.getRange("A1:M10").format.rowHeight = 24;

// Monthly pilot, base case
monthly.showGridLines = false;
title(monthly, "A1:J2", "Base-case pilot cash view | learning plan, not break-even forecast");
monthly.getRange("A4:J4").values = [["Month", "Ramp", "Active nodes", "Core units", "Trial units", "Core CM2", "Trial CM2", "CM2 before fixed", "Fixed cost", "Cash result"]];
header(monthly.getRange("A4:J4"));
monthly.getRange("A5:B10").values = [[1, 0], [2, 0], [3, 0.25], [4, 0.50], [5, 0.75], [6, 1.00]];
for (let row = 5; row <= 10; row += 1) {
  monthly.getRange(`C${row}`).formulas = [[`=ROUND(Assumptions!D19*B${row},0)`]];
  monthly.getRange(`D${row}`).formulas = [[`=ROUND(C${row}*Assumptions!D20*4.33,0)`]];
  monthly.getRange(`E${row}`).formulas = [[`=ROUND(D${row}*45%,0)`]];
  monthly.getRange(`F${row}`).formulas = [[`='Pack Economics'!M8`]];
  monthly.getRange(`G${row}`).formulas = [[`='Pack Economics'!M7`]];
  monthly.getRange(`H${row}`).formulas = [[`=D${row}*F${row}+E${row}*G${row}`]];
  monthly.getRange(`I${row}`).formulas = [[`=Assumptions!D22`]];
  monthly.getRange(`J${row}`).formulas = [[`=H${row}-I${row}`]];
}
monthly.getRange("K4:L10").values = [["Metric", "Value"], ["Six-month cash result", null], ["Core pack monthly fixed-cost break-even units", null], ["Base 8-week repeat gate", null], ["Peak nodes", null], ["Core packs/node/week", null], ["Interpretation", "Pilot buys evidence; it is not expected to cover the lean team at 60 nodes."]];
header(monthly.getRange("K4:L4"));
monthly.getRange("L5").formulas = [["=SUM(J5:J10)"]];
monthly.getRange("L6").formulas = [["=ROUNDUP(Assumptions!D22/'Pack Economics'!M8,0)"]];
monthly.getRange("L7").formulas = [["=Assumptions!D21"]];
monthly.getRange("L8").formulas = [["=Assumptions!D19"]];
monthly.getRange("L9").formulas = [["=Assumptions!D20"]];
monthly.getRange("B5:B10").format.numberFormat = "0%";
monthly.getRange("F5:J10").format.numberFormat = '"INR "#,##0.00';
monthly.getRange("L5").format.numberFormat = '"INR "#,##0';
monthly.getRange("L6").format.numberFormat = "#,##0";
monthly.getRange("L7").format.numberFormat = "0%";
monthly.getRange("A4:J10").format.borders = { preset: "all", style: "thin", color: C.line };
monthly.getRange("K4:L10").format.borders = { preset: "all", style: "thin", color: C.line };
monthly.getRange("K5:K10").format = { fill: C.sand, font: { bold: true, color: C.ink } };
monthly.getRange("L10").format.wrapText = true;
monthly.getRange("A:J").format.columnWidth = 14;
monthly.getRange("K:K").format.columnWidth = 38;
monthly.getRange("L:L").format.columnWidth = 44;
monthly.getRange("10:10").format.rowHeight = 50;

// Sensitivity
sensitivity.showGridLines = false;
title(sensitivity, "A1:G2", "Core-pack CM2 sensitivity | base price and 5% consumer discount");
sensitivity.getRange("A4:E4").values = [["Product cost / Channel", 0.25, 0.30, 0.38, "Read"]];
header(sensitivity.getRange("A4:E4"));
sensitivity.getRange("A5:A7").values = [[50], [57.5], [66]];
for (let row = 5; row <= 7; row += 1) {
  for (let col = 2; col <= 4; col += 1) {
    const channelCell = `${String.fromCharCode(64 + col)}$4`;
    const outputCell = `${String.fromCharCode(64 + col)}${row}`;
    sensitivity.getRange(outputCell).formulas = [[`=((Assumptions!D12*(1-Assumptions!D13))/(1+Assumptions!D14))*(1-${channelCell})-$A${row}-Assumptions!D17-Assumptions!D18`]];
  }
}
sensitivity.getRange("E5:E7").values = [["Upside product cost"], ["Base product cost"], ["Downside product cost"]];
sensitivity.getRange("B4:D4").format.numberFormat = "0%";
sensitivity.getRange("A5:A7").format.numberFormat = '"INR "#,##0.00';
sensitivity.getRange("B5:D7").format.numberFormat = '"INR "#,##0.00';
sensitivity.getRange("A4:E7").format.borders = { preset: "all", style: "thin", color: C.line };
sensitivity.getRange("B5:D7").conditionalFormats.add("colorScale", { colors: [C.paleRed, C.paleAmber, C.lime] });
sensitivity.getRange("A:A").format.columnWidth = 24;
sensitivity.getRange("B:D").format.columnWidth = 18;
sensitivity.getRange("E:E").format.columnWidth = 28;
sensitivity.mergeCells("A10:E12");
sensitivity.getRange("A10").values = [["Read this as a negotiation map. Product cost and channel terms can erase the pack's contribution even when MRP stays unchanged. Replace the row and column inputs with actual quotes before a launch decision."]];
sensitivity.getRange("A10:E12").format = { fill: C.sand, font: { color: C.gray, italic: true }, wrapText: true, verticalAlignment: "center", borders: { preset: "outside", style: "thin", color: C.line } };

// Budget
budget.showGridLines = false;
title(budget, "A1:E2", "Stage-gated pilot budget | total cap ₹30 lakh");
budget.getRange("A4:E4").values = [["Use", "Cap INR", "% total", "Release condition", "Owner"]];
header(budget.getRange("A4:E4"));
const budgetRows = [
  ["Research, formulation and lab work", 350000, null, "Interview and manufacturer briefs approved", "GTM + product"],
  ["Design, packaging plates and setup", 300000, null, "Taste gate passed", "Product"],
  ["Pilot inventory and deposits", 800000, null, "Final formula, label and batch plan approved", "Operations"],
  ["Sampling and field activation", 500000, null, "Saleable batch released", "Field lead"],
  ["Q-commerce listing, media and offer", 600000, null, "Price and early sell-through gates passed", "Channel lead"],
  ["Core team and operating overhead", 300000, null, "Monthly gate review", "GM"],
  ["Contingency", 150000, null, "Written exception approval", "GM + finance"],
];
budget.getRange("A5:E11").values = budgetRows;
for (let row = 5; row <= 11; row += 1) budget.getRange(`C${row}`).formulas = [[`=B${row}/SUM($B$5:$B$11)`]];
budget.getRange("A12:E12").values = [["Total", null, null, "", ""]];
budget.getRange("B12").formulas = [["=SUM(B5:B11)"]];
budget.getRange("C12").formulas = [["=SUM(C5:C11)"]];
budget.getRange("A12:E12").format = { fill: C.dark, font: { bold: true, color: C.white } };
budget.getRange("B5:B12").format.numberFormat = '"INR "#,##0';
budget.getRange("C5:C12").format.numberFormat = "0%";
budget.getRange("A4:E12").format.borders = { preset: "all", style: "thin", color: C.line };
budget.getRange("A:A").format.columnWidth = 36;
budget.getRange("B:C").format.columnWidth = 16;
budget.getRange("D:D").format.columnWidth = 50;
budget.getRange("E:E").format.columnWidth = 20;

// Dashboard
dash.showGridLines = false;
title(dash, "A1:L2", "Makhana launch decision dashboard");
dash.mergeCells("A3:L3");
dash.getRange("A3").values = [["12-week Delhi NCR pilot | assumptions are editable | no supplier or platform terms are claimed"]];
dash.getRange("A3:L3").format = { fill: C.sand, font: { color: C.gray, italic: true }, verticalAlignment: "center" };
const cards = [
  ["A5:C7", "Pilot cap", "='Pilot Budget'!B12", '"INR "#,##0'],
  ["D5:F7", "Base core CM2", "='Pack Economics'!M8", '"INR "#,##0.00'],
  ["G5:I7", "Base trial CM2", "='Pack Economics'!M7", '"INR "#,##0.00'],
  ["J5:L7", "8-week repeat gate", "=Assumptions!D21", "0%"],
];
for (const [range, label, formula, numberFormat] of cards) {
  const [start, end] = range.split(":");
  const left = start.match(/[A-Z]+/)[0];
  const right = end.match(/[A-Z]+/)[0];
  dash.mergeCells(`${left}5:${right}5`);
  dash.mergeCells(`${left}6:${right}7`);
  dash.getRange(`${left}5`).values = [[label]];
  dash.getRange(`${left}6`).formulas = [[formula]];
  dash.getRange(range).format = { fill: C.lime, borders: { preset: "outside", style: "thin", color: C.green } };
  dash.getRange(`${left}5:${right}5`).format = { fill: C.green, font: { bold: true, color: C.white }, horizontalAlignment: "center" };
  dash.getRange(`${left}6:${right}7`).format = { font: { bold: true, color: C.ink, size: 17 }, horizontalAlignment: "center", verticalAlignment: "center", numberFormat };
}
section(dash.getRange("A9:L9"), "Decision");
dash.mergeCells("A10:H14");
dash.getRange("A10").values = [["Fund a controlled pilot, not a national launch. Prove taste and price first, then enter 40 to 60 NCR quick-commerce nodes. Treat the ₹50 pack as paid trial because its base CM2 is negative."]];
dash.getRange("A10:H14").format = { fill: C.sand, font: { bold: true, color: C.ink, size: 15 }, wrapText: true, verticalAlignment: "center", borders: { preset: "outside", style: "thin", color: C.line } };
dash.mergeCells("I10:L14");
dash.getRange("I10").values = [["Scale only if:\n\n• taste reaches parity\n• price test passes\n• 8-week repeat ≥ 20%\n• second-order CM2 > 0\n• stock-age gate holds"]];
dash.getRange("I10:L14").format = { fill: C.paleAmber, font: { color: C.ink, size: 13 }, wrapText: true, verticalAlignment: "center", borders: { preset: "outside", style: "thin", color: C.amber } };
dash.getRange("N4:O10").values = [["Scenario / pack", "CM2 INR"], ["Downside trial", null], ["Downside core", null], ["Base trial", null], ["Base core", null], ["Upside trial", null], ["Upside core", null]];
for (let row = 5; row <= 10; row += 1) dash.getRange(`O${row}`).formulas = [[`='Pack Economics'!M${row}`]];
const cmChart = dash.charts.add("bar", dash.getRange("N4:O10"));
cmChart.title = "CM2 per pack by scenario";
cmChart.hasLegend = false;
cmChart.setPosition("A16", "F30");
dash.getRange("Q4:R10").values = [["Month", "Base cash result"], [1, null], [2, null], [3, null], [4, null], [5, null], [6, null]];
for (let row = 5; row <= 10; row += 1) dash.getRange(`R${row}`).formulas = [[`='Monthly Pilot'!J${row}`]];
const cashChart = dash.charts.add("line", dash.getRange("Q4:R10"));
cashChart.title = "Monthly pilot cash result";
cashChart.hasLegend = false;
cashChart.setPosition("G16", "L30");
dash.mergeCells("A32:L34");
dash.getRange("A32").values = [["Important: APEDA's ₹1,250/kg 2025 domestic average is market context, not a landed supplier quote. Replace product cost and channel cells with current written terms before committing inventory."]];
dash.getRange("A32:L34").format = { fill: C.paleRed, font: { color: C.red, italic: true }, wrapText: true, verticalAlignment: "center", borders: { preset: "outside", style: "thin", color: C.red } };
dash.getRange("A:L").format.columnWidth = 13;
dash.getRange("1:34").format.rowHeight = 23;

// Sources and notes
sources.showGridLines = false;
title(sources, "A1:D2", "Sources, scope and model definitions");
sources.getRange("A4:D4").values = [["Item", "Detail", "Source URL", "Treatment"]];
header(sources.getRange("A4:D4"));
sources.getRange("A5:D13").values = [
  ["Category and supply", "India and Bihar production concentration; data limitations", "https://apeda.gov.in/sites/default/files/study_reports/Makhana_Report_English.pdf", "Primary industry report"],
  ["Price context", "APEDA dashboard reports ₹1,250/kg average domestic price in 2025", "https://apeda.gov.in/sites/default/files/2026-01/MIC_November_Monthly_dashboard_Makhana_311225.pdf", "Market average, not quote"],
  ["Labelling", "Ingredients, nutrition, allergens, licence and ecommerce display", "https://www.fssai.gov.in/upload/uploadfiles/files/Comp_Labelling%20Display_Version%20VII_03042025.pdf", "Final pack needs review"],
  ["Claims", "Nutrition and health claims require applicable conditions", "https://www.fssai.gov.in/upload/uploadfiles/files/Compendium_Advertising_Claims_Regulations_04_10_2022.pdf", "Final formula needs lab proof"],
  ["Quick commerce", "Blinkit FY25 scale and economics context", "https://b.zmtcdn.com/investor-relations/Eternal_Annual_Report_2024-25.pdf", "No brand trade terms disclosed"],
  ["Competitor prices", "Observed on 30 August 2026", "https://www.bigbasket.com/pb/farmley/makhana/", "Snapshot; prices change"],
  ["CM1", "Ex-GST sales less channel deduction and product cost", "", "Model definition"],
  ["CM2", "CM1 less fulfilment, variable operations, marketing and samples", "", "Model definition"],
  ["Status", "All commercial inputs are planning assumptions until replaced with written quotes", "", "No launch outcome is claimed"],
];
sources.getRange("A5:A13").format = { fill: C.lime, font: { bold: true, color: C.dark } };
sources.getRange("A4:D13").format.borders = { preset: "all", style: "thin", color: C.line };
sources.getRange("A:A").format.columnWidth = 22;
sources.getRange("B:B").format.columnWidth = 50;
sources.getRange("C:C").format.columnWidth = 76;
sources.getRange("D:D").format.columnWidth = 30;
sources.getRange("B5:D13").format.wrapText = true;
sources.getRange("5:13").format.rowHeight = 42;

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.mkdir(previewDir, { recursive: true });

const checks = [];
for (const range of ["Decision Dashboard!A1:L34", "Assumptions!A1:G22", "Pack Economics!A1:M10", "Monthly Pilot!A1:L10", "Sensitivity!A1:E12", "Pilot Budget!A1:E12", "Sources and Notes!A1:D13"]) {
  const result = await wb.inspect({ kind: "table", range, include: "values,formulas", tableMaxRows: 40, tableMaxCols: 20 });
  checks.push(result.ndjson);
}
const errors = await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 200 }, summary: "formula error scan" });
checks.push(errors.ndjson);
await fs.writeFile(path.join(previewDir, "inspection.ndjson"), checks.join("\n"));

for (const [sheetName, range, fileName, scale] of [
  ["Decision Dashboard", "A1:L34", "decision-dashboard.png", 1.2],
  ["Assumptions", "A1:G22", "assumptions.png", 1.1],
  ["Pack Economics", "A1:M10", "pack-economics.png", 1.1],
  ["Monthly Pilot", "A1:L10", "monthly-pilot.png", 1.1],
  ["Sensitivity", "A1:G12", "sensitivity.png", 1.2],
  ["Pilot Budget", "A1:E12", "pilot-budget.png", 1.2],
  ["Sources and Notes", "A1:D13", "sources-and-notes.png", 1.0],
]) {
  const image = await wb.render({ sheetName, range, scale, format: "png" });
  await fs.writeFile(path.join(previewDir, fileName), new Uint8Array(await image.arrayBuffer()));
}

const file = await SpreadsheetFile.exportXlsx(wb);
await file.save(outputPath);
console.log(JSON.stringify({ outputPath, sheets: 7, previewDir }));
