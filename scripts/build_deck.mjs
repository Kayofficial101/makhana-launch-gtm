import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const repoRoot = path.resolve(import.meta.dirname, "..");
const outDir = path.join(repoRoot, "deck");
const previewDir = path.join(repoRoot, "visuals", "deck");
const heroPath = path.join(repoRoot, "assets", "makhana-bowl.jpg");
const heroBytes = await fs.readFile(heroPath);
const W = 1280;
const H = 720;
const C = {
  ink: "#15201D", muted: "#68716E", rule: "#D7DED9", panel: "#F4F2EC",
  green: "#1D7A5C", dark: "#103B30", lime: "#DDF2E8", amber: "#F0B640",
  paleAmber: "#FFF2D1", red: "#B23A3A", paleRed: "#FBEAEA", white: "#FFFFFF",
  blue: "#4D9BC6",
};

function addText(slide, text, x, y, w, h, size, options = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    name: options.name || `text-${Math.random().toString(36).slice(2)}`,
    position: { left: x, top: y, width: w, height: h },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = text;
  shape.text.style = {
    fontSize: size,
    typeface: "Arial",
    color: options.color || C.ink,
    bold: options.bold || false,
    italic: options.italic || false,
    alignment: options.align || "left",
    verticalAlignment: options.valign || "top",
    autoFit: "shrinkText",
  };
  return shape;
}

function rect(slide, x, y, w, h, fill, line = "none") {
  return slide.shapes.add({
    geometry: "rect",
    position: { left: x, top: y, width: w, height: h },
    fill,
    line: line === "none" ? { style: "solid", fill: "none", width: 0 } : { style: "solid", fill: line, width: 1 },
  });
}

function rule(slide, x, y, w, color = C.rule, width = 1) {
  slide.shapes.add({
    geometry: "straightConnector1",
    position: { left: x, top: y, width: w, height: 0 },
    fill: "none",
    line: { style: "solid", fill: color, width },
  });
}

function header(slide, title, number, eyebrow = "MAKHANA LAUNCH GTM") {
  addText(slide, eyebrow, 54, 30, 760, 22, 13, { color: C.green, bold: true });
  addText(slide, title, 54, 65, 1160, 78, 38, { bold: true });
  addText(slide, String(number).padStart(2, "0"), 1170, 664, 50, 18, 12, { color: C.muted, align: "right" });
}

function notes(slide, urls, note = "") {
  const lines = ["[Sources]", ...urls, "[/Sources]"];
  if (note) lines.push("", note);
  slide.speakerNotes.textFrame.setText(lines);
  slide.speakerNotes.setVisible(true);
}

function footer(slide, text) {
  addText(slide, text, 54, 658, 1020, 20, 12, { color: C.muted });
}

async function saveBlob(filePath, blob) {
  await fs.writeFile(filePath, new Uint8Array(await blob.arrayBuffer()));
}

const p = Presentation.create({ slideSize: { width: W, height: H } });

// 1 Cover
{
  const s = p.slides.add();
  s.background.fill = C.white;
  rect(s, 0, 0, 22, H, C.green);
  addText(s, "MAKHANA SNACK LAUNCH", 64, 50, 610, 24, 14, { color: C.green, bold: true });
  addText(s, "A launch plan that earns the right to scale", 64, 136, 665, 180, 55, { bold: true });
  addText(s, "Delhi NCR | 12-week pilot | taste, price, repeat and contribution gates", 64, 352, 620, 94, 23, { color: C.muted });
  addText(s, "I rebuilt an early college model around evidence and stop rules.", 64, 520, 610, 48, 18, { color: C.green, bold: true });
  s.images.add({ blob: heroBytes, contentType: "image/jpeg", alt: "A bowl of popped makhana", fit: "cover", position: { left: 790, top: 0, width: 490, height: 720 }, crop: { left: 0.02, top: 0, right: 0.20, bottom: 0 } });
  rect(s, 748, 0, 42, H, C.lime);
  addText(s, "Keshav Kapoor | 2026", 64, 650, 420, 22, 14, { color: C.muted });
  notes(s, ["https://images.herzindagi.info/image/2021/Sep/fox-nuts-protein-powder.jpg"], "Image used for editorial illustration. Strategy and financial model are the author's work.");
}

// 2 Decision
{
  const s = p.slides.add();
  s.background.fill = C.white;
  header(s, "Fund the pilot, not the national launch", 2);
  rect(s, 54, 176, 730, 330, C.dark);
  addText(s, "₹30 lakh", 90, 212, 330, 76, 54, { color: C.white, bold: true });
  addText(s, "maximum staged commitment", 92, 287, 390, 34, 21, { color: C.lime });
  addText(s, "Prove taste and willingness to pay before quick commerce. Enter 40 to 60 NCR nodes only after those gates pass.", 92, 354, 620, 116, 27, { color: C.white, bold: true });
  const calls = [
    ["2 flavours", "Chatpata Masala + Cream & Onion"],
    ["2 packs", "20 g at ₹50 + 50 g at ₹149"],
    ["4 gates", "taste, price, repeat, CM2"],
  ];
  for (let i = 0; i < calls.length; i += 1) {
    const y = 182 + i * 120;
    addText(s, calls[i][0], 846, y, 300, 40, 28, { bold: true, color: C.green });
    addText(s, calls[i][1], 846, y + 43, 330, 58, 18, { color: C.muted });
    if (i < calls.length - 1) rule(s, 846, y + 103, 330);
  }
  footer(s, "Commercial terms and thresholds are planning assumptions until replaced with actual evidence.");
  notes(s, [], "The recommendation is the author's proposal based on the evidence and model in this repository.");
}

// 3 Old audit
{
  const s = p.slides.add();
  s.background.fill = C.white;
  header(s, "The first version had ambition but skipped proof", 3);
  addText(s, "OLD MODEL", 54, 175, 300, 24, 14, { color: C.red, bold: true });
  addText(s, "REBUILT MODEL", 680, 175, 360, 24, 14, { color: C.green, bold: true });
  const rows = [
    ["1,000 stores by calendar", "40-60 nodes after product and price gates"],
    ["15 packs/store/day assumed", "Velocity learned from a controlled cell"],
    ["60 g at ₹99", "20 g trial + 50 g core, both price-tested"],
    ["35% called standard", "Actual terms modelled by channel and scenario"],
    ["₹3.5 crore upfront", "₹30 lakh in tranches with stop rules"],
  ];
  for (let i = 0; i < rows.length; i += 1) {
    const y = 218 + i * 76;
    rect(s, 54, y, 500, 58, i % 2 ? C.white : C.paleRed, C.rule);
    addText(s, rows[i][0], 76, y + 14, 450, 30, 20, { color: C.ink, bold: i === 2 });
    rect(s, 680, y, 520, 58, i % 2 ? C.white : C.lime, C.rule);
    addText(s, rows[i][1], 702, y + 14, 474, 34, 20, { color: C.ink, bold: i === 2 });
  }
  footer(s, "The original appendix is preserved in the repository. Nothing has been rewritten after the fact.");
  notes(s, [], "Arithmetic audit based on the attached four-page GTM appendix.");
}

// 4 Category and input price
{
  const s = p.slides.add();
  s.background.fill = C.white;
  header(s, "The category is growing, but the input is not cheap", 4);
  const chart = s.charts.add("line", {
    position: { left: 54, top: 174, width: 705, height: 390 },
    title: "Reported average domestic makhana price (₹/kg)",
    categories: ["2020", "2021", "2022", "2023", "2024", "2025"],
    series: [{ name: "₹/kg", values: [500, 550, 500, 800, 900, 1250], line: { fill: C.green, width: 3 }, marker: { symbol: "circle", size: 8 } }],
    hasLegend: false,
    yAxis: { minimumScale: 0, maximumScale: 1400, majorUnit: 200, numberFormatCode: "₹0" },
    dataLabels: { showValue: true, position: "top" },
    chartFill: C.white,
    plotAreaFill: C.white,
  });
  rect(s, 816, 185, 366, 145, C.lime);
  addText(s, "90%+", 850, 213, 160, 62, 44, { color: C.dark, bold: true });
  addText(s, "of global makhana supply comes from India, according to APEDA-ICRIER", 850, 277, 286, 44, 17);
  rect(s, 816, 353, 366, 180, C.paleAmber);
  addText(s, "Cost check", 850, 380, 260, 30, 19, { color: C.dark, bold: true });
  addText(s, "At ₹1,250/kg, 60 g of raw makhana implies ₹75 before loss, seasoning, pack, conversion or freight.", 850, 426, 286, 90, 20, { bold: true });
  footer(s, "APEDA reports market averages and also notes gaps in official category data. This is context, not a supplier quote.");
  notes(s, ["https://apeda.gov.in/sites/default/files/study_reports/Makhana_Report_English.pdf", "https://apeda.gov.in/sites/default/files/2026-01/MIC_November_Monthly_dashboard_Makhana_311225.pdf"]);
}

// 5 Price architecture
{
  const s = p.slides.add();
  s.background.fill = C.white;
  header(s, "The shelf already has a clear trial and core ladder", 5);
  const bands = [
    ["TRIAL", "16-20 g", "₹50 MRP", "Too Yumm, Farmley, Happilo", C.lime],
    ["CORE", "52-60 g", "₹139-150 MRP", "MOM, Happilo, Mr Makhana, Taali", C.paleAmber],
    ["LARGER", "77-80 g", "₹230-239 MRP", "Farmley, Mr Makhana", C.panel],
  ];
  for (let i = 0; i < bands.length; i += 1) {
    const x = 54 + i * 391;
    rect(s, x, 188, 352, 312, bands[i][4]);
    addText(s, bands[i][0], x + 28, 218, 200, 22, 14, { color: C.green, bold: true });
    addText(s, bands[i][1], x + 28, 270, 260, 52, 34, { bold: true });
    addText(s, bands[i][2], x + 28, 334, 270, 48, 28, { bold: true, color: C.dark });
    addText(s, bands[i][3], x + 28, 413, 280, 64, 18, { color: C.muted });
  }
  rect(s, 54, 534, 1134, 76, C.dark);
  addText(s, "Working architecture: 20 g at ₹50 for trial, 50 g at ₹149 for the core pack. Final choice follows the price test and manufacturer quotes.", 82, 553, 1080, 42, 21, { color: C.white, bold: true });
  footer(s, "MRP and observed selling prices were recorded separately on 30 August 2026 because discounts move.");
  notes(s, ["https://www.bigbasket.com/pb/farmley/makhana/", "https://mrmakhana.com/collections/mr-makhana", "https://tooyumm.com/collections/makhana"], "Pack and price snapshot collected on 30 August 2026.");
}

// 6 Customer and position
{
  const s = p.slides.add();
  s.background.fill = C.white;
  header(s, "Start with an occasion, not a broad age label", 6);
  rect(s, 54, 178, 475, 372, C.dark);
  addText(s, "PRIMARY HYPOTHESIS", 88, 210, 310, 24, 14, { color: C.lime, bold: true });
  addText(s, "Late-afternoon or evening desk and streaming snack", 88, 266, 365, 136, 35, { color: C.white, bold: true });
  addText(s, "Urban 22-35 professionals in Delhi NCR who already order snacks online.", 88, 434, 370, 72, 20, { color: C.lime });
  addText(s, "What must be learned", 602, 188, 350, 38, 25, { bold: true });
  const questions = [
    "Does it beat a familiar competitor on crunch and seasoning?",
    "Will the buyer pay ₹149 without a permanent discount?",
    "What snack does it replace?",
    "What makes the same person buy again?",
  ];
  for (let i = 0; i < questions.length; i += 1) {
    const y = 250 + i * 72;
    addText(s, String(i + 1).padStart(2, "0"), 604, y, 42, 28, 16, { color: C.green, bold: true });
    addText(s, questions[i], 665, y, 500, 50, 21, { bold: true });
    rule(s, 604, y + 52, 570);
  }
  rect(s, 602, 562, 572, 58, C.lime);
  addText(s, "60 interviews + 120 blind tests before broad inventory", 630, 579, 520, 27, 20, { color: C.dark, bold: true });
  notes(s, [], "The target segment is a hypothesis to validate, not a claimed research finding.");
}

// 7 Product and claims
{
  const s = p.slides.add();
  s.background.fill = C.white;
  header(s, "Taste first, with nutrition language that can be proved", 7);
  const flavors = [["01", "Chatpata Masala", "Familiar, savoury and easy to understand"], ["02", "Cream & Onion", "A broad salty-snack reference point"]];
  for (let i = 0; i < 2; i += 1) {
    const x = 54 + i * 576;
    rect(s, x, 188, 526, 196, i === 0 ? C.lime : C.paleAmber);
    addText(s, flavors[i][0], x + 28, 216, 52, 32, 18, { color: C.green, bold: true });
    addText(s, flavors[i][1], x + 28, 260, 440, 50, 30, { bold: true });
    addText(s, flavors[i][2], x + 28, 327, 430, 38, 18, { color: C.muted });
  }
  addText(s, "Do not print these without proof", 54, 434, 470, 36, 24, { bold: true });
  const claims = ["high protein", "low fat", "gluten-free", "healthy"];
  for (let i = 0; i < claims.length; i += 1) {
    const x = 54 + i * 278;
    rect(s, x, 493, 240, 60, C.paleRed, C.red);
    addText(s, claims[i], x + 12, 510, 216, 28, 19, { color: C.red, bold: true, align: "center" });
  }
  addText(s, "Final formula, lab result and applicable FSSAI condition decide the claim.", 54, 590, 980, 32, 20, { color: C.green, bold: true });
  notes(s, ["https://www.fssai.gov.in/upload/uploadfiles/files/Comp_Labelling%20Display_Version%20VII_03042025.pdf", "https://www.fssai.gov.in/upload/uploadfiles/files/Compendium_Advertising_Claims_Regulations_04_10_2022.pdf"]);
}

// 8 Channel roles
{
  const s = p.slides.add();
  s.background.fill = C.white;
  header(s, "Each channel has one job in the pilot", 8);
  const channels = [
    ["TASTINGS", "Find product defects", "Blind score + paid conversion"],
    ["20-30 STORES", "Read physical discovery", "Velocity + reorder + expiry"],
    ["40-60 Q-COM NODES", "Test convenience repeat", "Full-price velocity + CM2"],
    ["D2C BUNDLE", "Own feedback and gifting", "Bundle conversion + cohort"],
  ];
  for (let i = 0; i < channels.length; i += 1) {
    const x = 54 + (i % 2) * 575;
    const y = 180 + Math.floor(i / 2) * 214;
    rect(s, x, y, 526, 174, i === 2 ? C.dark : C.panel);
    addText(s, channels[i][0], x + 28, y + 24, 445, 24, 14, { color: i === 2 ? C.lime : C.green, bold: true });
    addText(s, channels[i][1], x + 28, y + 67, 445, 40, 27, { color: i === 2 ? C.white : C.ink, bold: true });
    addText(s, channels[i][2], x + 28, y + 121, 445, 30, 17, { color: i === 2 ? C.lime : C.muted });
  }
  rect(s, 54, 622, 1100, 34, C.paleAmber);
  addText(s, "D2C is for bundles and learning. It is not an assumed migration away from quick commerce.", 76, 629, 1060, 22, 17, { bold: true });
  notes(s, ["https://b.zmtcdn.com/investor-relations/Eternal_Annual_Report_2024-25.pdf", "https://www.swiggy.com/corporate/wp-content/uploads/2025/07/Swiggy-Annual-Report-FY-2024-25.pdf"], "Channel roles are the author's recommendation. Brand-specific trade terms are not public.");
}

// 9 Conversion and recovery
{
  const s = p.slides.add();
  s.background.fill = C.white;
  header(s, "The journey ends at repeat, not at awareness", 9);
  const steps = [
    ["TRIGGER", "4-8 pm snack occasion", "Qualified reach"],
    ["EVALUATE", "Taste + price", "Blind score"],
    ["PAID TRIAL", "₹50 pack", "Paid conversion"],
    ["CORE", "₹149 pack", "Trial-to-core"],
    ["REPEAT", "No deep discount", "8-week cohort"],
  ];
  rule(s, 86, 306, 1080, C.dark, 2);
  for (let i = 0; i < steps.length; i += 1) {
    const x = 70 + i * 236;
    rect(s, x, 290, 34, 34, i === 4 ? C.green : C.dark);
    addText(s, steps[i][0], x, 194, 205, 22, 13, { color: C.green, bold: true });
    addText(s, steps[i][1], x, 232, 205, 40, 20, { bold: true });
    addText(s, steps[i][2], x, 358, 205, 34, 17, { color: C.muted });
  }
  addText(s, "Three recoveries worth testing", 54, 444, 480, 34, 24, { bold: true });
  const recoveries = [
    ["Tasted, no buy", "Ask taste vs price vs pack. Change only the failed variable."],
    ["Bought once", "Capture reason: flavour, texture, portion, price or no occasion."],
    ["Offer-only repeat", "Read separately. It is not healthy repeat."],
  ];
  for (let i = 0; i < recoveries.length; i += 1) {
    const x = 54 + i * 380;
    rect(s, x, 500, 340, 102, i === 2 ? C.paleRed : C.panel);
    addText(s, recoveries[i][0], x + 20, 520, 300, 24, 16, { color: i === 2 ? C.red : C.green, bold: true });
    addText(s, recoveries[i][1], x + 20, 554, 300, 40, 15, { color: C.ink });
  }
  footer(s, "Out-of-stock is an operations failure. Pause paid media in affected nodes instead of blaming conversion.");
  notes(s, [], "The conversion path and recovery actions are the author's recommendation. The structure was cross-checked against the user-provided GTM reference.");
}

// 10 Economics
{
  const s = p.slides.add();
  s.background.fill = C.white;
  header(s, "The core pack works in base; the trial pack does not", 10);
  const cards = [
    ["BASE CORE", "₹17.97", "CM2 per pack", C.lime, C.dark],
    ["BASE TRIAL", "-₹2.55", "CM2 per pack", C.paleRed, C.red],
    ["DOWNSIDE CORE", "-₹8.77", "CM2 per pack", C.paleRed, C.red],
  ];
  for (let i = 0; i < cards.length; i += 1) {
    const x = 54 + i * 390;
    rect(s, x, 180, 350, 205, cards[i][3]);
    addText(s, cards[i][0], x + 28, 207, 280, 22, 14, { color: cards[i][4], bold: true });
    addText(s, cards[i][1], x + 28, 254, 280, 64, 44, { color: cards[i][4], bold: true });
    addText(s, cards[i][2], x + 28, 326, 280, 26, 18, { color: C.muted });
  }
  addText(s, "What this changes", 54, 438, 300, 34, 24, { bold: true });
  const rules = [
    "Use the ₹50 pack as a measured acquisition cost, not a profit engine.",
    "Negotiate product cost and channel deductions before locking MRP.",
    "Do not mistake pilot GMV for a viable business.",
  ];
  for (let i = 0; i < rules.length; i += 1) {
    addText(s, String(i + 1), 58, 493 + i * 48, 28, 26, 16, { color: C.green, bold: true });
    addText(s, rules[i], 98, 490 + i * 48, 1040, 32, 20, { bold: true });
  }
  footer(s, "Base inputs: 50 g core at ₹149 MRP, 5% discount, 12% working GST, 30% channel deduction and ₹57.50 product cost.");
  notes(s, ["https://apeda.gov.in/sites/default/files/2026-01/MIC_November_Monthly_dashboard_Makhana_311225.pdf"], "All commercial inputs are editable planning assumptions. CM2 excludes fixed operating cost.");
}

// 11 Plan
{
  const s = p.slides.add();
  s.background.fill = C.white;
  header(s, "Twelve weeks, with a decision every two", 11);
  rule(s, 92, 326, 1050, C.dark, 2);
  const stages = [
    ["W1-2", "Problem + price", "60 interviews\n3 price cells\n3 manufacturer quotes"],
    ["W3-4", "Product", "2 formulation rounds\n120 blind tests\nlab plan"],
    ["W5-8", "Controlled sale", "pilot batch\n20-30 stores\nD2C bundle"],
    ["W9-12", "Q-commerce cell", "40-60 nodes\none launch offer\ncohort read"],
  ];
  for (let i = 0; i < stages.length; i += 1) {
    const x = 80 + i * 292;
    rect(s, x, 310, 34, 34, i === 3 ? C.green : C.dark);
    addText(s, stages[i][0], x, 188, 220, 22, 14, { color: C.green, bold: true });
    addText(s, stages[i][1], x, 225, 235, 58, 27, { bold: true });
    addText(s, stages[i][2], x, 380, 230, 120, 19, { color: C.muted });
  }
  rect(s, 54, 548, 1135, 78, C.dark);
  addText(s, "At week 12 the answer is one of four words: stop, reformulate, continue or scale.", 82, 569, 1080, 40, 24, { color: C.white, bold: true });
  notes(s, ["https://www.mckinsey.com/industries/consumer-packaged-goods/our-insights/agile-innovation-how-to-create-far-more-value"], "The 12-week sequence and gate cadence are the author's recommendation.");
}

// 12 Gates
{
  const s = p.slides.add();
  s.background.fill = C.white;
  header(s, "Scale is an output of six gates", 12);
  const gates = [
    ["TASTE", "Parity with control", "Reformulate"],
    ["PRICE", "≥35% top-two intent", "Change pack or price"],
    ["VELOCITY", "Median ≥5/node/week", "Fix or remove nodes"],
    ["REPEAT", "≥20% in 8 weeks", "Diagnose product/occasion"],
    ["ECONOMICS", "Second-order CM2 > 0", "Renegotiate or stop"],
    ["INVENTORY", "70% sold with 60% life left", "Cut next batch"],
  ];
  addText(s, "GATE", 54, 173, 190, 22, 13, { color: C.muted, bold: true });
  addText(s, "PASS RULE", 300, 173, 320, 22, 13, { color: C.muted, bold: true });
  addText(s, "IF IT FAILS", 760, 173, 360, 22, 13, { color: C.muted, bold: true });
  rule(s, 54, 202, 1130, C.dark, 1);
  for (let i = 0; i < gates.length; i += 1) {
    const y = 216 + i * 66;
    addText(s, gates[i][0], 54, y, 190, 26, 15, { color: C.green, bold: true });
    addText(s, gates[i][1], 300, y, 400, 32, 20, { bold: true });
    addText(s, gates[i][2], 760, y, 390, 32, 19, { color: C.muted });
    rule(s, 54, y + 44, 1130);
  }
  footer(s, "Thresholds are management choices for this pilot, not industry benchmarks. Lock them before reading results.");
  notes(s, [], "The gate thresholds are the author's proposed decision rules.");
}

// 13 Budget and risks
{
  const s = p.slides.add();
  s.background.fill = C.white;
  header(s, "Spend follows evidence", 13);
  const chart = s.charts.add("bar", {
    position: { left: 54, top: 176, width: 650, height: 390 },
    title: "Pilot budget cap (₹ lakh)",
    categories: ["Inventory", "Q-com", "Sampling", "Research/lab", "Pack setup", "Team", "Contingency"],
    series: [{ name: "₹ lakh", values: [8, 6, 5, 3.5, 3, 3, 1.5], fill: C.green }],
    hasLegend: false,
    barOptions: { direction: "bar", grouping: "clustered", gapWidth: 65 },
    xAxis: { minimumScale: 0, maximumScale: 9, majorUnit: 1 },
    dataLabels: { showValue: true, position: "outEnd" },
    chartFill: C.white,
    plotAreaFill: C.white,
  });
  addText(s, "Three risks that can kill the plan", 760, 185, 400, 64, 27, { bold: true });
  const risks = [
    ["INPUT", "Raw price moves beyond the model range"],
    ["DISCOUNT", "Full-price velocity disappears"],
    ["EXPIRY", "Stock sells too late in shelf life"],
  ];
  for (let i = 0; i < risks.length; i += 1) {
    const y = 278 + i * 104;
    addText(s, risks[i][0], 762, y, 100, 22, 13, { color: C.red, bold: true });
    addText(s, risks[i][1], 875, y, 300, 54, 20, { bold: true });
    rule(s, 760, y + 66, 420);
  }
  footer(s, "The pilot can use the full ₹30 lakh only if the earlier release conditions are met.");
  notes(s, [], "Budget and risk controls are the author's proposed operating plan.");
}

// 14 Close
{
  const s = p.slides.add();
  s.background.fill = C.dark;
  addText(s, "THE RECOMMENDATION", 60, 52, 420, 22, 14, { color: C.lime, bold: true });
  addText(s, "Launch small enough to learn, but real enough to decide", 60, 136, 1040, 130, 50, { color: C.white, bold: true });
  addText(s, "1  Prove taste and price\n\n2  Protect contribution and shelf life\n\n3  Scale nodes only when repeat holds", 60, 322, 750, 235, 29, { color: C.white });
  rect(s, 900, 320, 270, 210, C.lime);
  addText(s, "Week 12", 930, 352, 220, 42, 24, { color: C.dark, bold: true });
  addText(s, "stop\nreformulate\ncontinue\nscale", 930, 414, 220, 100, 22, { color: C.dark, bold: true });
  rule(s, 60, 605, 1110, C.lime, 1);
  addText(s, "Keshav Kapoor | Public-source strategy case | 2026", 60, 630, 780, 26, 16, { color: C.lime });
  notes(s, ["https://apeda.gov.in/sites/default/files/study_reports/Makhana_Report_English.pdf", "https://apeda.gov.in/sites/default/files/2026-01/MIC_November_Monthly_dashboard_Makhana_311225.pdf", "https://b.zmtcdn.com/investor-relations/Eternal_Annual_Report_2024-25.pdf"], "Closing recommendation is the author's work.");
}

await fs.mkdir(outDir, { recursive: true });
await fs.mkdir(previewDir, { recursive: true });
for (const [index, slide] of p.slides.items.entries()) {
  const stem = `slide-${String(index + 1).padStart(2, "0")}`;
  await saveBlob(path.join(previewDir, `${stem}.png`), await p.export({ slide, format: "png", scale: 1 }));
  await fs.writeFile(path.join(previewDir, `${stem}.layout.json`), await (await slide.export({ format: "layout" })).text());
}
await saveBlob(path.join(previewDir, "montage.webp"), await p.export({ format: "webp", montage: true, scale: 1 }));
const inspection = await p.inspect({ kind: "slide,textbox,shape,chart,notes", maxChars: 30000 });
await fs.writeFile(path.join(previewDir, "inspection.ndjson"), inspection.ndjson);
const pptx = await PresentationFile.exportPptx(p);
await pptx.save(path.join(outDir, "makhana-launch-gtm.pptx"));
console.log(JSON.stringify({ slides: p.slides.items.length, pptx: path.join(outDir, "makhana-launch-gtm.pptx"), previewDir }));
