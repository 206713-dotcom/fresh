// Rewrites the four "plot twin" legacy sets (identified by >=2 identical
// question_texts with their counterparts) into fresh, non-overlapping scenarios.
// All model answers were re-tagged to the exact AO budget for each part.
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "..", "src", "lib", "data", "paper1-database.json");
const db = JSON.parse(readFileSync(dbPath, "utf8"));

const replacements = {
  "P1_U3_SET_31": {
    scenario_stem: "Aurora Pet Nutrition is a Private Limited Company manufacturing premium prescription dog food in Country X. Operating for 4 years, it employs 45 staff and generates $3.6m in annual revenue, selling 120,000 units at $30 per bag and holding a 6% share of the premium pet food market. The board allocated a $150,000 budget to launch its new renal-support kibble range next quarter. It exports some lines to Country Y.\n\nSales of every new pet food launch in the sector surge 80% in the first 3 months, then settle 50% below the launch peak. The marketing director is choosing a pricing approach for the renal-support range: a high launch price close to $48 per bag to recover research costs quickly, or a competitive mid-range price of $32 aligned with rival brands. They must decide before packaging and advertising are printed.",
    questions: [
      {
        part: "a", mark_value: 2,
        question_text: "Define the term 'price skimming'.",
        model_answer: "Setting a high price when a new product is launched, then lowering it later as competition increases [2].",
        mark_scheme: { knowledge_max_2: ["high launch price for a new product", "price is reduced over time as rivals enter"] },
        qwen_marking_keys: { valid_app_words: [] },
      },
      {
        part: "b", mark_value: 4,
        question_text: "Explain two possible benefits to Aurora Pet Nutrition of using price skimming when launching its renal-support kibble range.",
        model_answer: "Benefit 1: High profit margins early on [k], allowing Aurora to recover a large share of the $150,000 launch budget quickly from sales of $48 bags [app]. Benefit 2: Prestige brand image [k], as a $48 premium price signals a high-quality specialist product to vets and owners [app].",
        mark_scheme: {
          knowledge_max_2: ["recovers research and development costs quickly", "creates a prestigious, high-quality brand image"],
          application_max_2: ["$48 launch price per bag", "$150,000 launch budget", "renal-support kibble range", "premium pet food market", "120,000 units"],
        },
        qwen_marking_keys: { valid_app_words: ["$48", "$150,000", "renal-support", "120,000", "premium", "$30", "6%"] },
      },
      {
        part: "c", mark_value: 6,
        question_text: "Explain two possible disadvantages to Aurora Pet Nutrition of using a high $48 launch price for its renal-support range.",
        model_answer: "Disadvantage 1: Low sales volume at launch [k], because many owners will not pay $48 when rival premium bags cost $32 or less [app], so Aurora's small 6% market share could stop growing [an]. Disadvantage 2: Attracts rival launches [k], as the high margin signals a profitable niche and competing brands will copy the recipe quickly [app], eroding sales before Aurora has recovered its $150,000 investment [an].",
        mark_scheme: {
          knowledge_max_2: ["smaller number of buyers at a high price", "attracts competitors into the profitable niche"],
          application_max_2: ["$48 launch price", "$32 rival price", "6% market share", "$150,000 launch budget"],
          analysis_max_2: ["sales volume fails to grow", "rivals undercut before costs recovered"],
        },
        qwen_marking_keys: { valid_app_words: ["$48", "$32", "6%", "$150,000", "rival", "premium", "renal-support"] },
      },
      {
        part: "d", mark_value: 8,
        question_text: "Do you think price skimming is a better launch pricing strategy for the renal-support kibble range than a competitive $32 price? Justify your answer.",
        model_answer: "Skimming generates fast returns on the $150,000 budget [k], and early buyers who trust the renal-support formula will pay $48 each [app], recovering costs in months rather than years [an]. However, a $32 competitive price spurs mass-market trial [k], because a $16 saving per bag encourages far more first-time buyers [app] and would grow the 6% share faster against the dominant rivals [an]. Overall, skimming is the better choice for this specialist range [eval], because renal-support diet targets a small, price-insensitive group advised by vets [eval], and recovering the $150,000 investment quickly outweighs short-term volume.",
        mark_scheme: {
          knowledge_max_2: ["skimming recovers launch investment quickly", "competitive price drives trial and volume"],
          application_max_2: ["$48 price", "$32 rival price", "$150,000 budget", "6% market share"],
          analysis_max_2: ["fast cost recovery vs volume growth", "higher share vs higher margin per bag"],
          evaluation_max_2: ["weighs niche specialist buyers against mass-market adoption in this launch"],
        },
        qwen_marking_keys: {
          valid_app_words: ["$48", "$32", "$150,000", "6%", "renal-support", "120,000"],
          deterministic_rules: {
            if_app_words_missing: "Cap AO2 Application score at 0",
            if_no_eval_word: "Cap AO4 Evaluation score at 0",
          },
        },
      },
    ],
  },
  "P1_U3_SET_32": {
    scenario_stem: "Sentinel Home Security is a Public Limited Company offering smart-lock monitoring subscriptions across Country X cities. Operating for 6 years, it protects 9,000 homes and generates $5.4m in annual subscription revenue at $25 per month, holding an 11% share of the home security market. Sentinel employs 35 staff and allocates $300,000 a year to pricing and billing software development. Most subscribers are homeowners on annual contracts.\n\nThe director is deciding how to price security checks during local events that spike demand. Demand surges mid-evening on match days and during holidays, while midday demand is flat. The options are dynamic pricing that lifts monthly fees by up to 20% during peak hours, or a fixed $25 rate that never changes. Peak-hour subscribers pay in advance and complain loudly about unexpected bills.",
    questions: [
      {
        part: "a", mark_value: 2,
        question_text: "Define the term 'dynamic pricing'.",
        model_answer: "Changing prices based on demand at different times or situations [2].",
        mark_scheme: { knowledge_max_2: ["prices are not fixed/change regularly", "prices move with demand for the service"] },
        qwen_marking_keys: { valid_app_words: [] },
      },
      {
        part: "b", mark_value: 4,
        question_text: "Explain two possible benefits to Sentinel of using dynamic pricing for its subscription service.",
        model_answer: "Benefit 1: Maximises revenue at peak times [k], because subscribers pay up to 20% more during busy match days when demand is highest [app]. Benefit 2: Better use of monitoring capacity [k], as higher peak fees discourage casual cancellations and spread demand evenly [app].",
        mark_scheme: {
          knowledge_max_2: ["captures more revenue when demand is high", "smooths demand / matches capacity to need"],
          application_max_2: ["20% peak increase", "$25 monthly fee", "match days", "9,000 homes"],
        },
        qwen_marking_keys: { valid_app_words: ["20%", "$25", "match days", "9,000", "11%", "subscription", "peak"] },
      },
      {
        part: "c", mark_value: 6,
        question_text: "Explain two possible problems for Sentinel of using dynamic pricing for its subscription service.",
        model_answer: "Problem 1: Customer complaints about fairness [k], because peak subscribers are charged up to 20% more unexpectedly [app], which may damage trust and lead to cancellations [an]. Problem 2: Complexity for subscribers and staff [k], because variable bills make it harder for the call centre to explain charges [app], increasing complaints and administration costs from the $300,000 budget [an].",
        mark_scheme: {
          knowledge_max_2: ["customers perceive variable prices as unfair", "more complex to explain and administer"],
          application_max_2: ["20% peak increase", "$25 fixed rate", "$300,000 budget", "match days"],
          analysis_max_2: ["lost subscriber trust and cancellations", "higher complaint and administration costs"],
        },
        qwen_marking_keys: { valid_app_words: ["20%", "$25", "$300,000", "peak", "match days", "9,000"] },
      },
      {
        part: "d", mark_value: 8,
        question_text: "Do you think dynamic pricing is a better strategy for Sentinel than a fixed $25 monthly fee? Justify your answer.",
        model_answer: "Dynamic pricing captures more value at peak times [k], because match-day demand lets Sentinel charge 20% more to 9,000 homes [app], raising $5.4m revenue and funding better monitoring technology [an]. However, a fixed $25 fee protects subscriber trust [k], and price-sensitive subscribers may leave rather than accept variable bills [an], putting the 11% share at risk [app]. Overall, dynamic pricing is the better strategy for Sentinel [eval], because peaks are predictable and mild (20%) during events subscribers already expect [eval], and transparent pre-notification of peak fees should keep complaint levels low.",
        mark_scheme: {
          knowledge_max_2: ["varied prices can maximise peak revenue", "fixed prices are simpler and protect trust"],
          application_max_2: ["20% peak increase", "$25 fixed fee", "9,000 homes", "11% share"],
          analysis_max_2: ["higher revenue vs risk of losing price-sensitive subscribers", "peak loads predictable enough to manage"],
          evaluation_max_2: ["weighs peak-event revenue against subscriber trust and churn in this market"],
        },
        qwen_marking_keys: {
          valid_app_words: ["20%", "$25", "9,000", "11%", "match days", "$300,000"],
          deterministic_rules: {
            if_app_words_missing: "Cap AO2 Application score at 0",
            if_no_eval_word: "Cap AO4 Evaluation score at 0",
          },
        },
      },
    ],
  },
  "P1_U6_SET_36": {
    scenario_stem: "Heritage Cycle Works is a Private Limited Company manufacturing premium bicycle frames in Country X. Operating for 17 years, it employs 150 staff and generates $10.5m in annual turnover, exporting 45% of its frame output to 10 foreign countries. The home government recently signed a Free Trade Agreement (FTA) with a major trading partner, eliminating a 12% import tariff on imported aluminium tubing used in every frame.\n\nImported aluminium from the FTA partner costs much less now, but the same partner also sells cheaper finished bikes into Country X, undercutting domestic makers. The board must decide whether to switch all tubing sourcing to the partner, saving $900,000 a year on materials, or to keep its existing domestic supplier and prices. The FTA removes the tariff only for goods shipped from the partner itself.",
    questions: [
      {
        part: "a", mark_value: 2,
        question_text: "Define a 'Free Trade Agreement (FTA)'.",
        model_answer: "An agreement between countries to reduce or remove trade barriers between them [2].",
        mark_scheme: { knowledge_max_2: ["agreement between two or more countries", "reduces/removes trade barriers (tariffs/quotas)"] },
        qwen_marking_keys: { valid_app_words: [] },
      },
      {
        part: "b", mark_value: 4,
        question_text: "Explain two ways reduced import tariffs on aluminium tubing could affect Heritage Cycle Works.",
        model_answer: "Effect 1: Lower material costs [k], because the 12% tariff no longer applies to the partner's tubing, saving about $900,000 a year [app]. Effect 2: Cheaper frames for export [k], as lower input costs let Heritage price bikes more competitively abroad [app].",
        mark_scheme: {
          knowledge_max_2: ["lower cost of imported materials", "more price competitive in export markets"],
          application_max_2: ["12% tariff", "$900,000 saving", "aluminium tubing", "10 foreign countries"],
        },
        qwen_marking_keys: { valid_app_words: ["12%", "$900,000", "aluminium", "10", "45%", "$10.5m"] },
      },
      {
        part: "c", mark_value: 6,
        question_text: "Explain two threats to Heritage Cycle Works of the Free Trade Agreement with the partner country.",
        model_answer: "Threat 1: Cheaper foreign bikes in Country X [k], as the partner's manufacturers can now ship finished bicycles tariff-free into Heritage's home market [app], which could cut Heritage's 150-staff sales volume [an]. Threat 2: Reliance on one import source [k], because tariff-free shipping exists only from the partner itself [app], leaving Heritage exposed if the partner's prices or supply change [an].",
        mark_scheme: {
          knowledge_max_2: ["increased competition from tariff-free imports at home", "over-dependence on a single supply source"],
          application_max_2: ["partner country", "finished bicycles", "150 staff", "10 foreign countries"],
          analysis_max_2: ["reduced domestic sales and profit", "vulnerable to supply/price changes abroad"],
        },
        qwen_marking_keys: { valid_app_words: ["150", "10", "partner", "aluminium", "45%", "$900,000"] },
      },
      {
        part: "d", mark_value: 8,
        question_text: "Do you think Heritage Cycle Works should switch all tubing sourcing to the FTA partner country? Justify your answer.",
        model_answer: "Switching saves $900,000 a year [k], because the 12% tariff no longer applies to the partner's tubing [app], lifting Heritage's $10.5m margin and funding plant upgrades [an]. However, relying on one partner supplier is risky [k], and keeping the domestic source protects continuity [app], since any tariff or shipping change would hit every frame the 150 staff build [an]. Overall, Heritage should switch, but gradually [eval], dual-sourcing most tubing from the partner while keeping domestic capacity as backup [eval].",
        mark_scheme: {
          knowledge_max_2: ["lower material cost improves margin", "single-source dependence is risky"],
          application_max_2: ["$900,000 saving", "12% tariff", "150 staff", "$10.5m turnover"],
          analysis_max_2: ["higher profit vs supply risk", "protect continuity with dual sourcing"],
          evaluation_max_2: ["weighs tariff savings against supply security in this market"],
        },
        qwen_marking_keys: {
          valid_app_words: ["$900,000", "12%", "150", "$10.5m", "partner", "aluminium"],
          deterministic_rules: {
            if_app_words_missing: "Cap AO2 Application score at 0",
            if_no_eval_word: "Cap AO4 Evaluation score at 0",
          },
        },
      },
    ],
  },
  "P1_U6_SET_38": {
    scenario_stem: "Crescent Ceramic Exports is a Public Limited Company manufacturing porcelain tableware in Country X. Operating for 21 years, it employs 310 staff and generates $14m in annual revenue, exporting 60% of its output to 12 foreign countries. Economic growth and strong foreign investment raised Country X's export demand, and the domestic currency appreciated 10% over the past year, squeezing export margins.\n\nImported clay and kiln fuel now cost 10% less, helping domestic production costs. The board is deciding whether to raise prices for foreign buyers to protect margins, or to hold prices and defend market share. Their 5 biggest customers buy 40% of output and are negotiating hard. Export orders have slipped 5% since January, and competitors may match any price rise within a month.",
    questions: [
      {
        part: "a", mark_value: 2,
        question_text: "Define the term 'currency appreciation'.",
        model_answer: "An increase in the value of a currency against other currencies [2].",
        mark_scheme: { knowledge_max_2: ["currency becomes stronger/increases in value", "against other currencies"] },
        qwen_marking_keys: { valid_app_words: [] },
      },
      {
        part: "b", mark_value: 4,
        question_text: "Explain two effects of the currency appreciation on Crescent Ceramic Exports.",
        model_answer: "Effect 1: Exports become more expensive abroad [k], because a 10% stronger currency means foreign buyers pay more in their own money [app]. Effect 2: Imported raw materials cost less [k], because clay and kiln fuel bought from abroad are 10% cheaper [app].",
        mark_scheme: {
          knowledge_max_2: ["stronger currency raises export prices abroad", "cheaper imports cut input costs"],
          application_max_2: ["10% appreciation", "foreign buyers", "clay and kiln fuel", "12 foreign countries"],
        },
        qwen_marking_keys: { valid_app_words: ["10%", "60%", "12", "clay", "kiln", "$14m"] },
      },
      {
        part: "c", mark_value: 6,
        question_text: "Explain two ways the currency appreciation could affect Crescent Ceramic Exports' profits.",
        model_answer: "Effect 1: Lower export revenue [k], because foreign buyers face higher prices and may switch suppliers [app], so the 60% export share of $14m revenue could fall [an]. Effect 2: Higher profit margins on domestic materials [k], as imported clay and fuel are 10% cheaper [app], partially offsetting the export squeeze [an].",
        mark_scheme: {
          knowledge_max_2: ["export demand falls with a stronger currency", "import cost reductions improve margins"],
          application_max_2: ["60% export share", "$14m revenue", "10% cheaper clay and fuel", "foreign buyers"],
          analysis_max_2: ["lower export volume reduces revenue", "cheaper inputs partly protect profit"],
        },
        qwen_marking_keys: { valid_app_words: ["60%", "$14m", "10%", "clay", "fuel", "12"] },
      },
      {
        part: "d", mark_value: 8,
        question_text: "Do you think Crescent Ceramic Exports should raise prices for foreign buyers to protect profits? Justify your answer.",
        model_answer: "Raising prices protects margins [k], and because Crescent's 5 biggest customers buy 40% of output, losing some volume to rivals still preserves profit on the remaining sales [app], offsetting 10% cheaper input costs [an]. However, holding prices defends market share when the currency move reverses [k], since higher volume spreads 310 staff's fixed costs across more units [an], keeping Crescent's place in 12 foreign countries [app]. Overall, raising prices modestly is the better option [eval], as the 10% appreciation is recent and likely temporary [eval], and short-term margin defence matters more than volume right now.",
        mark_scheme: {
          knowledge_max_2: ["higher prices defend margins but risk volume", "holding price defends share and spreads fixed costs"],
          application_max_2: ["40% of output from top 5 buyers", "60% export share", "310 staff", "12 foreign countries"],
          analysis_max_2: ["margin defence vs market share defence", "fixed costs spread over more units at hold price"],
          evaluation_max_2: ["weighs short-term margin protection against long-term share in export markets"],
        },
        qwen_marking_keys: {
          valid_app_words: ["40%", "60%", "310", "12", "clay", "10%"],
          deterministic_rules: {
            if_app_words_missing: "Cap AO2 Application score at 0",
            if_no_eval_word: "Cap AO4 Evaluation score at 0",
          },
        },
      },
    ],
  },
};

for (const [id, replacement] of Object.entries(replacements)) {
  const idx = db.findIndex((s) => s.scenario_id === id);
  if (idx === -1) throw new Error(`Set ${id} not found`);
  const unit = db[idx].unit;
  db[idx] = { scenario_id: id, unit, ...replacement };
}
writeFileSync(dbPath, JSON.stringify(db, null, 2) + "\n");
console.log("Twin sets rewritten:", Object.keys(replacements).join(", "));
