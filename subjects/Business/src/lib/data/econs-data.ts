import { EconsGlossaryTerm } from "../types";

export const ECONS_GLOSSARY: EconsGlossaryTerm[] = [
  {
    id: "e-scarcity",
    term: "Scarcity & The Economic Problem",
    definition: "The fundamental economic problem of having unlimited human wants in a world with limited, finite productive resources.",
    unit: "Unit 1: The Basic Economic Problem",
    diagramName: "PPC Frontier",
    examAdvice: "Always link scarcity to the inevitable need for choice and opportunity cost.",
  },
  {
    id: "e-ppc",
    term: "Production Possibility Curve (PPC)",
    definition: "A curve showing the maximum possible combinations of two goods or services that an economy can produce when all resources are fully and efficiently employed.",
    unit: "Unit 1: The Basic Economic Problem",
    diagramName: "Production Possibility Curve",
    examAdvice: "Points inside = underutilised resources; Points on curve = productive efficiency; Points outside = currently unattainable.",
  },
  {
    id: "e-law-of-demand",
    term: "Law of Demand",
    definition: "As the price of a good or service falls, the quantity demanded increases, ceteris paribus (all other factors remaining constant).",
    unit: "Unit 2: The Allocation of Resources",
    diagramName: "Demand Curve Slope",
    examAdvice: "Price change causes movement along the demand curve; non-price factors (income, advertising, substitutes) cause a shift of the curve.",
  },
  {
    id: "e-law-of-supply",
    term: "Law of Supply",
    definition: "As the price of a good rises, producers are willing and able to supply a higher quantity, ceteris paribus.",
    unit: "Unit 2: The Allocation of Resources",
    diagramName: "Supply Curve Shift",
    examAdvice: "Shifts in supply are caused by changes in production costs, taxes, subsidies, weather, and technology.",
  },
  {
    id: "e-ped",
    term: "Price Elasticity of Demand (PED)",
    definition: "A numerical measure of the responsiveness of quantity demanded for a good to a change in its price.",
    unit: "Unit 2: The Allocation of Resources",
    formula: "PED = (% Change in Quantity Demanded) / (% Change in Price)",
    examAdvice: "If PED > 1: Elastic (cut price to raise revenue); If PED < 1: Inelastic (raise price to raise revenue).",
  },
  {
    id: "e-market-failure",
    term: "Market Failure",
    definition: "When the free market mechanism leads to a misallocation of resources, resulting in net welfare loss to society.",
    unit: "Unit 2: The Allocation of Resources",
    diagramName: "Negative Externalities",
    examAdvice: "Causes: public goods, merit/demerit goods, monopolies, and negative externalities (pollution).",
  },
  {
    id: "e-fiscal-policy",
    term: "Fiscal Policy",
    definition: "Government policy regarding taxation and public government spending to influence the level of aggregate demand and economic activity.",
    unit: "Unit 4: Government and the Macroeconomy",
    examAdvice: "Expansionary fiscal policy: cut taxes and increase spending to combat recession; contractionary fiscal policy to reduce inflation.",
  },
  {
    id: "e-monetary-policy",
    term: "Monetary Policy",
    definition: "Decisions made by the central bank regarding interest rates, the money supply, and exchange rates to control inflation and economic stability.",
    unit: "Unit 4: Government and the Macroeconomy",
    examAdvice: "Raising interest rates increases borrowing costs, reduces consumer spending and business investment, dampening inflation.",
  },
  {
    id: "e-inflation",
    term: "Inflation (Consumer Price Index)",
    definition: "A sustained, general increase in the average price level of goods and services in an economy over a given period of time.",
    unit: "Unit 4: Government and the Macroeconomy",
    formula: "Measured using weighted basket of consumer goods (CPI)",
    examAdvice: "Distinguish between demand-pull inflation (excess aggregate demand) and cost-push inflation (rising wage/oil costs).",
  },
  {
    id: "e-current-account",
    term: "Current Account Balance of Payments",
    definition: "A record of an economy's trade in goods and services with the rest of the world, plus net primary income and secondary transfers.",
    unit: "Unit 6: International Trade & Globalisation",
    formula: "Current Account = Trade in Goods + Trade in Services + Net Income + Net Transfers",
    examAdvice: "A persistent deficit can weaken the exchange rate and deplete foreign currency reserves.",
  },
];

export interface EconsBlueprint {
  id: string;
  title: string;
  marks: 2 | 4 | 6 | 8;
  unit: string;
  prompt: string;
  context: string;
  commandWord: string;
  indicativeRubric: string[];
}

export const ECONS_BLUEPRINTS: EconsBlueprint[] = [
  {
    id: "ebp-2m-ppc",
    title: "2-Mark Micro Definition: Opportunity Cost in PPC",
    marks: 2,
    unit: "Unit 1: The Basic Economic Problem",
    commandWord: "Define",
    context: "An agricultural country reallocates land from wheat farming to industrial manufacturing.",
    prompt: "Define what is meant by opportunity cost and give one example relevant to agricultural land.",
    indicativeRubric: [
      "1 mark: Next best alternative foregone/given up.",
      "1 mark: Clear contextual example (e.g. foregone wheat harvest).",
    ],
  },
  {
    id: "ebp-4m-elasticity",
    title: "4-Mark Micro Analysis: Price Elasticity of Demand (PED)",
    marks: 4,
    unit: "Unit 2: The Allocation of Resources",
    commandWord: "Analyse",
    context: "A national bus company faces a 10% increase in fuel costs and considers raising ticket fares by 15%. Research shows bus travel has a PED of -0.4.",
    prompt: "Analyse what will happen to the bus company's total revenue if it raises ticket prices. Explain your reasoning.",
    indicativeRubric: [
      "2 marks: Identifying that demand is price inelastic (PED < 1).",
      "2 marks: Explaining that % drop in passenger numbers is smaller than % price hike, so total revenue rises.",
    ],
  },
  {
    id: "ebp-6m-tariff",
    title: "6-Mark Trade Evaluation: Tariffs on Steel Imports",
    marks: 6,
    unit: "Unit 6: International Trade & Globalisation",
    commandWord: "Discuss",
    context: "The government of Country Z introduces a 20% import tariff on foreign manufactured steel.",
    prompt: "Discuss whether the government should introduce tariffs on imported steel. Consider domestic producers and consumer manufacturers.",
    indicativeRubric: [
      "2 marks: Advantages to domestic steel mills (protection from cheap imports, prevents job losses).",
      "2 marks: Disadvantages to steel consumers (car makers face higher input costs, potential retaliatory tariffs).",
      "2 marks: Balanced conclusion based on economic competitiveness.",
    ],
  },
  {
    id: "ebp-8m-fiscal",
    title: "8-Mark Macro Policy Essay: Combating Economic Recession",
    marks: 8,
    unit: "Unit 4: Government and the Macroeconomy",
    commandWord: "Discuss / Evaluate",
    context: "Country X experiences two consecutive quarters of negative GDP growth and unemployment rises to 8.5%.",
    prompt: "Discuss whether expansionary fiscal policy is the most effective government response to reduce unemployment during a recession. Justify your answer.",
    indicativeRubric: [
      "2 marks: Knowledge of expansionary fiscal tools (cutting income tax, increasing infrastructure spending).",
      "2 marks: Application to circular flow of income and aggregate demand stimulation.",
      "2 marks: Counteranalysis (time lags, rising national budget deficit, risk of demand-pull inflation).",
      "2 marks: Evaluative judgment comparing fiscal policy with monetary policy (interest rate cuts).",
    ],
  },
];
