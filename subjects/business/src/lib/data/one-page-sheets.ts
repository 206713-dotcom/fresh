export type SheetIconName =
  | "alert"
  | "arrow"
  | "banknote"
  | "book"
  | "briefcase"
  | "building"
  | "calculator"
  | "cash"
  | "chart"
  | "check"
  | "clipboard"
  | "clock"
  | "coins"
  | "cycle"
  | "factory"
  | "gear"
  | "globe"
  | "graduation"
  | "handshake"
  | "landmark"
  | "layers"
  | "leaf"
  | "lightbulb"
  | "lock"
  | "megaphone"
  | "message"
  | "mountain"
  | "network"
  | "package"
  | "percent"
  | "recycle"
  | "scale"
  | "search"
  | "shield"
  | "spark"
  | "store"
  | "tag"
  | "target"
  | "trending"
  | "truck"
  | "unlock"
  | "userCheck"
  | "users"
  | "zap";

export type SheetTone = "green" | "rose" | "sand" | "sage";

export interface SheetPoint {
  title: string;
  text: string;
  icon?: SheetIconName;
}

export interface SheetVisualItem {
  title: string;
  text?: string;
  meta?: string;
  icon?: SheetIconName;
  tone?: SheetTone;
}

export interface SheetColumn {
  title: string;
  subtitle?: string;
  items: string[];
  footer?: string;
  tone?: SheetTone;
  icon?: SheetIconName;
}

export type SheetFormulaToken =
  | { kind: "operand"; label: string; text: string }
  | { kind: "operator"; value: string }
  | { kind: "result"; label: string; text: string };

interface SheetVisualBase {
  title: string;
  note?: string;
  wide?: boolean;
}

export type SheetVisual =
  | ({ kind: "formula"; tokens: SheetFormulaToken[] } & SheetVisualBase)
  | ({ kind: "flow"; steps: SheetVisualItem[] } & SheetVisualBase)
  | ({ kind: "quad"; items: SheetVisualItem[] } & SheetVisualBase)
  | ({ kind: "contrast"; columns: SheetColumn[] } & SheetVisualBase)
  | ({ kind: "table"; headers: string[]; rows: string[][]; compact?: boolean } & SheetVisualBase)
  | ({
      kind: "metrics";
      items: { label: string; formula: string; note?: string }[];
    } & SheetVisualBase)
  | ({ kind: "pills"; items: SheetVisualItem[]; columns?: 2 | 3 | 4 } & SheetVisualBase)
  | ({ kind: "channels"; channels: { label: string; steps: string[] }[] } & SheetVisualBase)
  | ({
      kind: "chart";
      chart: "businessCycle" | "productLifeCycle" | "maslow" | "orgChart" | "breakEven";
      stages?: SheetVisualItem[];
    } & SheetVisualBase)
  | ({
      kind: "waterfall";
      steps: { label: string; formula: string; tone: SheetTone }[];
    } & SheetVisualBase)
  | ({ kind: "externality"; costs: string[]; benefits: string[] } & SheetVisualBase);

export interface SheetBlock {
  code: string;
  title: string;
  eyebrow: string;
  visuals: SheetVisual[];
  points: SheetPoint[];
  takeaway: string;
}

export interface OnePageSheet {
  code: string;
  title: string;
  strap: string;
  blocks: SheetBlock[];
}

/** One visual revision sheet per Cambridge 0264 / 0450 section. */
export const ONE_PAGE_SHEETS: OnePageSheet[] = [
  {
    code: "1",
    title: "Understanding business activity",
    strap: "Purpose of business, sectors, enterprise, legal forms, objectives and stakeholders.",
    blocks: [
      {
        code: "1.1",
        title: "Business activity",
        eyebrow: "Scarcity, choice and added value",
        visuals: [
          {
            kind: "formula",
            title: "Added value formula",
            tokens: [
              { kind: "operand", label: "Selling price", text: "What the customer pays" },
              { kind: "operator", value: "−" },
              { kind: "operand", label: "Bought-in materials", text: "Cost of inputs from suppliers" },
              { kind: "operator", value: "=" },
              { kind: "result", label: "Added value", text: "The worth the business creates" },
            ],
            note: "Increase it with **quality**, **branding**, **packaging**, **convenience** or a **USP**.",
          },
          {
            kind: "quad",
            title: "Factors of production & rewards",
            items: [
              {
                title: "Land",
                meta: "Reward: rent",
                text: "Natural resources used in production.",
                icon: "mountain",
                tone: "sand",
              },
              {
                title: "Labour",
                meta: "Reward: wages",
                text: "Human effort, physical and mental.",
                icon: "users",
                tone: "green",
              },
              {
                title: "Capital",
                meta: "Reward: interest",
                text: "Machinery, equipment and finance invested.",
                icon: "factory",
                tone: "rose",
              },
              {
                title: "Enterprise",
                meta: "Reward: profit",
                text: "The risk-taker who organises the other factors.",
                icon: "spark",
                tone: "sage",
              },
            ],
          },
        ],
        points: [
          {
            title: "Need vs want",
            text: "A **need** is essential to survive; a **want** is not.",
            icon: "target",
          },
          {
            title: "Scarcity",
            text: "**Unlimited wants + limited resources = scarcity**, so choices must be made.",
            icon: "alert",
          },
          {
            title: "Opportunity cost",
            text: "The **next best alternative** given up when a choice is made.",
            icon: "cycle",
          },
          {
            title: "Specialisation",
            text: "Raises output, but can cause **boredom** and **dependence**.",
            icon: "users",
          },
        ],
        takeaway:
          "**Added value is not profit.** It is the difference between the selling price and bought-in materials, before other costs are paid.",
      },
      {
        code: "1.2",
        title: "Classification of businesses",
        eyebrow: "From raw materials to the customer",
        visuals: [
          {
            kind: "flow",
            title: "Chain of production",
            wide: true,
            steps: [
              {
                title: "Primary",
                text: "Extract natural resources — farming, mining, fishing.",
                icon: "mountain",
              },
              {
                title: "Secondary",
                text: "Manufacture or process — factories, construction.",
                icon: "factory",
              },
              {
                title: "Tertiary",
                text: "Provide services — retail, banking, transport.",
                icon: "store",
              },
            ],
            note: "Each stage adds value. **De-industrialisation** means the secondary sector shrinks while the tertiary sector grows as a country develops.",
          },
          {
            kind: "contrast",
            title: "Who owns the business?",
            wide: true,
            columns: [
              {
                title: "Private sector",
                subtitle: "Owned by individuals",
                items: ["Main aim: **profit**", "Examples: sole traders, companies"],
                tone: "green",
                icon: "briefcase",
              },
              {
                title: "Public sector",
                subtitle: "Owned by government",
                items: ["Main aim: **service**", "Examples: state schools, hospitals"],
                tone: "rose",
                icon: "landmark",
              },
              {
                title: "Mixed economy",
                subtitle: "Both sectors operate",
                items: ["Private and public sectors together", "Government may regulate or provide"],
                tone: "sand",
                icon: "scale",
              },
            ],
          },
        ],
        points: [
          {
            title: "Classify by activity",
            text: "Businesses are classified by their **stage of production**, not by size.",
            icon: "layers",
          },
          {
            title: "The chain links all three",
            text: "A product can pass through **primary → secondary → tertiary** before it reaches the customer.",
            icon: "arrow",
          },
        ],
        takeaway:
          "A business can operate at more than one stage — classify it by its **main activity**.",
      },
      {
        code: "1.3",
        title: "Enterprise, growth and size",
        eyebrow: "Start, grow or stay small",
        visuals: [
          {
            kind: "pills",
            title: "The entrepreneur",
            wide: true,
            columns: 4,
            items: [
              {
                title: "Risk-taker",
                text: "Puts money and reputation on the line.",
                icon: "zap",
                tone: "rose",
              },
              {
                title: "Innovative",
                text: "Spots a gap and creates a new idea.",
                icon: "lightbulb",
                tone: "sand",
              },
              {
                title: "Organised",
                text: "Combines land, labour, capital and enterprise.",
                icon: "layers",
                tone: "green",
              },
              {
                title: "Decisive",
                text: "Makes choices and acts quickly.",
                icon: "target",
                tone: "sage",
              },
            ],
          },
          {
            kind: "table",
            title: "Measuring business size",
            headers: ["Measure", "What it counts", "Watch out"],
            rows: [
              ["Employees", "Number of staff", "A highly automated firm may look small"],
              ["Value of output or sales", "Revenue or value produced", "Inflation can distort comparisons"],
              ["Volume of output or sales", "Units produced or sold", "Expensive goods can make a firm rank low"],
              ["Capital employed", "Long-term finance invested", "A service firm may need little capital"],
            ],
            note: "**Profit is not a measure of size.** Different methods can rank the same firm differently.",
          },
          {
            kind: "table",
            title: "Routes to growth",
            headers: ["Route", "Meaning"],
            rows: [
              ["Internal (organic)", "New products or new markets"],
              ["Merger", "Two firms agree to join"],
              ["Takeover", "One firm buys another"],
              ["Horizontal", "Same stage of production"],
              ["Vertical forward", "Closer to the customer"],
              ["Vertical backward", "Closer to the supplier"],
              ["Conglomerate", "Unrelated businesses join"],
            ],
          },
          {
            kind: "contrast",
            title: "Why grow, stay small or fail?",
            wide: true,
            columns: [
              {
                title: "Why grow",
                items: ["More **profit**", "Bigger **market share**", "**Economies of scale**"],
                tone: "green",
                icon: "trending",
              },
              {
                title: "Why stay small",
                items: ["A **niche** market", "The owner's **choice**", "The market is too small", "Lack of **finance**"],
                tone: "sand",
                icon: "target",
              },
              {
                title: "Why firms fail",
                items: [
                  "Weak **management**",
                  "No **finance**",
                  "Poor **product**",
                  "Falling **demand**",
                  "**Competition**",
                  "Economic downturn",
                ],
                tone: "rose",
                icon: "alert",
              },
            ],
          },
        ],
        points: [
          {
            title: "The business plan",
            text: "Covers **summary, objectives, market, marketing, finance, people and operations**; it wins finance and keeps the firm focused.",
            icon: "clipboard",
          },
          {
            title: "Government support",
            text: "Grants, advice, cheap loans and training; aims at **jobs, competition and new ideas**.",
            icon: "landmark",
          },
        ],
        takeaway:
          "**Internal growth** comes from new products or markets. **External growth** comes from a merger or takeover.",
      },
      {
        code: "1.4",
        title: "Types of business organisation",
        eyebrow: "Who owns it, and who pays if it fails?",
        visuals: [
          {
            kind: "contrast",
            title: "Liability: what happens if the business cannot pay?",
            wide: true,
            columns: [
              {
                title: "Unlimited liability",
                subtitle: "Sole traders & partnerships",
                items: [
                  "Owner's **personal assets** can be taken to pay business debts.",
                  "No **separate legal identity**.",
                  "No **continuity** if the owner dies or leaves.",
                ],
                tone: "rose",
                icon: "unlock",
              },
              {
                title: "Limited liability",
                subtitle: "Companies: Ltd & plc",
                items: [
                  "Owners lose only what they **invested**.",
                  "The company has a **separate legal identity**.",
                  "The business has **continuity**.",
                ],
                tone: "green",
                icon: "shield",
              },
            ],
          },
          {
            kind: "table",
            title: "Business organisation at a glance",
            wide: true,
            headers: ["Type", "Key advantage", "Key drawback"],
            rows: [
              ["Sole trader", "Easy and cheap to start; keeps all profit; full control", "Unlimited liability; hard to raise finance; no continuity"],
              ["Partnership", "More capital and skills", "Unlimited liability; disputes; shared profit"],
              ["Private limited company (Ltd)", "Limited liability; shares sold privately", "Accounts partly public; shares harder to sell"],
              ["Public limited company (plc)", "Sell shares to the public; raise large capital", "Owners can lose control; public accounts; ownership separated from control"],
              ["Franchise", "Known brand and support", "Fees and rules to follow"],
              ["Joint venture", "Share cost, risk and knowledge", "Conflict is possible"],
              ["Social enterprise", "Trades to meet a social aim", "Profit is a means, not the main goal"],
            ],
            note: "A **deed of partnership** sets the rules. A **franchisor** expands quickly but risks the brand's reputation.",
          },
        ],
        points: [
          {
            title: "Separate legal identity",
            text: "A company can own assets, make contracts and survive a change of owner; a sole trader cannot.",
            icon: "scale",
          },
          {
            title: "Continuity",
            text: "**Limited companies** continue after the owner leaves; **sole traders and partnerships** may not.",
            icon: "cycle",
          },
        ],
        takeaway:
          "**Liability** is about who pays if the business fails. **Continuity** is about whether the business survives its owners.",
      },
      {
        code: "1.5",
        title: "Objectives and stakeholders",
        eyebrow: "What the business wants — and who else cares",
        visuals: [
          {
            kind: "pills",
            title: "Business objectives",
            wide: true,
            columns: 3,
            items: [
              { title: "Survival", text: "Keep trading through a difficult period.", icon: "shield", tone: "rose" },
              { title: "Profit", text: "Reward owners for taking a risk.", icon: "coins", tone: "green" },
              { title: "Growth", text: "More sales, market share or scale.", icon: "trending", tone: "sage" },
              { title: "Market share", text: "A larger slice of the market.", icon: "chart", tone: "sand" },
              { title: "Service to the community", text: "Meet a social need, not only make money.", icon: "users", tone: "rose" },
              { title: "They change", text: "With size, competition and the economy.", icon: "cycle", tone: "green" },
            ],
            note: "Objectives **set direction, motivate people and let success be measured**.",
          },
          {
            kind: "contrast",
            title: "Internal vs external stakeholders",
            wide: true,
            columns: [
              {
                title: "Internal",
                subtitle: "Inside the business",
                items: [
                  "**Owners & shareholders** — profit, dividends",
                  "**Managers** — control, career, performance",
                  "**Employees** — pay, security, conditions",
                ],
                tone: "green",
                icon: "users",
              },
              {
                title: "External",
                subtitle: "Outside the business",
                items: [
                  "**Customers** — low prices, quality",
                  "**Suppliers** — prompt payment, fair prices",
                  "**Lenders** — interest and repayment",
                  "**Government** — tax, law, jobs",
                  "**Local community** — jobs, less pollution",
                ],
                tone: "sand",
                icon: "globe",
              },
            ],
          },
          {
            kind: "table",
            title: "When stakeholder wants collide",
            wide: true,
            headers: ["Conflict", "Why it happens"],
            rows: [
              ["Higher wages vs profit", "Employees want more pay; owners want higher profit"],
              ["Growth vs pollution", "Expansion can add jobs but damage the local environment"],
              ["Lower prices vs supplier income", "Customers want cheap goods; suppliers need fair prices"],
              ["Growth vs dividends", "Managers may reinvest; owners may want cash now"],
            ],
          },
        ],
        points: [
          {
            title: "Each group wants something different",
            text: "Owners want profit, employees want pay and security, customers want quality at a low price, and the community wants jobs and less pollution.",
            icon: "target",
          },
        ],
        takeaway:
          "Objectives are a **compromise**: a decision that satisfies one stakeholder can impose a cost on another.",
      },
    ],
  },
  {
    code: "2",
    title: "People in business",
    strap: "Motivation, organisation, leadership, recruitment, training and communication.",
    blocks: [
      {
        code: "2.1",
        title: "Motivating employees",
        eyebrow: "Why people work — and how to motivate them",
        visuals: [
          {
            kind: "chart",
            title: "Maslow: needs rise in order",
            chart: "maslow",
            wide: true,
            stages: [
              {
                title: "Physiological",
                text: "Food, water, warmth and rest.",
                meta: "At work: basic pay, breaks, heating.",
                tone: "sand",
              },
              {
                title: "Safety",
                text: "Security, a steady job and a safe workplace.",
                meta: "At work: contract, PPE, pension.",
                tone: "sage",
              },
              {
                title: "Social",
                text: "Belonging, friendship and being part of a team.",
                meta: "At work: teamwork, social events.",
                tone: "green",
              },
              {
                title: "Esteem",
                text: "Status, recognition and respect.",
                meta: "At work: praise, promotion, title.",
                tone: "rose",
              },
              {
                title: "Self-actualisation",
                text: "Reach full potential and grow.",
                meta: "At work: challenging work, autonomy.",
                tone: "rose",
              },
            ],
            note: "A need that is **already met no longer motivates**; the next level takes over.",
          },
          {
            kind: "contrast",
            title: "Two motivation theories",
            columns: [
              {
                title: "Taylor",
                subtitle: "Money is the main motivator",
                items: [
                  "Use **piece rate**: pay per unit produced.",
                  "Raises output, but can hurt **quality**.",
                  "Ignores social and esteem needs.",
                ],
                tone: "sand",
                icon: "coins",
              },
              {
                title: "Herzberg",
                subtitle: "Hygiene vs motivators",
                items: [
                  "**Hygiene factors** (pay, conditions, supervision) only stop dissatisfaction.",
                  "**Motivators** (achievement, recognition, responsibility, the work itself) create satisfaction.",
                  "Improving hygiene alone does not motivate.",
                ],
                tone: "green",
                icon: "spark",
              },
            ],
          },
          {
            kind: "contrast",
            title: "Rewards: financial vs non-financial",
            columns: [
              {
                title: "Financial",
                items: [
                  "Time rate, piece rate, salary",
                  "Commission, bonus, profit sharing",
                  "Fringe benefits",
                ],
                footer: "Piece rate speeds output, but can hurt quality.",
                tone: "sand",
                icon: "banknote",
              },
              {
                title: "Non-financial",
                items: [
                  "Job rotation, job enrichment",
                  "Training and a chance of promotion",
                  "Praise and employee of the month",
                ],
                footer: "Match the method to the worker and the job.",
                tone: "sage",
                icon: "spark",
              },
            ],
          },
        ],
        points: [
          {
            title: "Why motivation matters",
            text: "Raises **output and quality**; cuts **absenteeism** and **labour turnover**.",
            icon: "trending",
          },
          {
            title: "Match the reward",
            text: "A reward only motivates if the worker values it and it fits the job.",
            icon: "target",
          },
        ],
        takeaway:
          "Hygiene factors **prevent dissatisfaction**; motivators **create satisfaction**. More pay alone may not motivate.",
      },
      {
        code: "2.2",
        title: "Organisation and management",
        eyebrow: "Who reports to whom — and how decisions are made",
        visuals: [
          {
            kind: "chart",
            title: "Hierarchy, chain of command & span of control",
            chart: "orgChart",
            wide: true,
            note: "**Hierarchy** = levels of authority. **Chain of command** = the route orders take. **Span of control** = how many people one manager directly supervises.",
          },
          {
            kind: "contrast",
            title: "Tall vs flat structures",
            wide: true,
            columns: [
              {
                title: "Tall",
                subtitle: "Many levels, narrow span",
                items: ["Close **control**", "**Slow** decisions", "More promotion steps"],
                tone: "sand",
                icon: "layers",
              },
              {
                title: "Flat",
                subtitle: "Few levels, wide span",
                items: ["**Faster** decisions", "Managers can be **overloaded**", "Fewer promotion steps"],
                tone: "green",
                icon: "layers",
              },
            ],
          },
          {
            kind: "table",
            title: "Leadership styles",
            wide: true,
            headers: ["Style", "How it works", "Advantage", "Drawback"],
            rows: [
              ["Autocratic", "Leader decides alone", "Fast", "Can demotivate"],
              ["Democratic", "Workers are involved", "More ideas", "Slower"],
              ["Laissez-faire", "Workers decide", "Good for experts", "Weak if skill is missing"],
            ],
          },
        ],
        points: [
          {
            title: "Delegation",
            text: "A manager passes **authority** for a task but keeps **responsibility**. It develops staff and fails if the task or person is wrong.",
            icon: "network",
          },
          {
            title: "Trade unions",
            text: "Represent workers and help with **pay, conditions and job security**.",
            icon: "users",
          },
        ],
        takeaway: "**Delegation passes authority, never responsibility.**",
      },
      {
        code: "2.3",
        title: "Recruitment, selection and training",
        eyebrow: "Getting the right people — and keeping them capable",
        visuals: [
          {
            kind: "flow",
            title: "Recruitment & selection route",
            wide: true,
            steps: [
              { title: "Job analysis", text: "Produce job description + person specification.", icon: "search" },
              { title: "Advertise", text: "Internal or external.", icon: "megaphone" },
              { title: "Applications", text: "Forms, CVs and references.", icon: "clipboard" },
              { title: "Selection", text: "Interviews and tests.", icon: "users" },
              { title: "Appoint & induct", text: "Settle the new worker in.", icon: "userCheck" },
            ],
            note: "**Job description** = the duties. **Person specification** = the qualities needed.",
          },
          {
            kind: "table",
            title: "Internal vs external recruitment",
            headers: ["Internal", "External"],
            rows: [
              ["Cheap and quick", "Wider range of skills"],
              ["Person already known", "New ideas"],
              ["Motivates staff", "Slower and costlier"],
              ["Small choice; leaves a gap", "Longer induction"],
            ],
          },
          {
            kind: "table",
            title: "Training: on the job vs off the job",
            headers: ["On-the-job", "Off-the-job"],
            rows: [
              ["Cheap and specific", "Specialist courses"],
              ["Trainer's output falls", "Costs more"],
              ["Done at work", "Less specific"],
            ],
          },
          {
            kind: "contrast",
            title: "Dismissal vs redundancy",
            wide: true,
            columns: [
              {
                title: "Dismissal",
                subtitle: "The worker is at fault",
                items: ["Misconduct or poor performance", "The job continues", "Follow a fair procedure"],
                tone: "rose",
                icon: "alert",
              },
              {
                title: "Redundancy",
                subtitle: "The job no longer exists",
                items: [
                  "Demand fell, machines replaced people, relocation or merger",
                  "The person is not at fault",
                  "May be entitled to redundancy pay",
                ],
                tone: "sage",
                icon: "users",
              },
            ],
          },
        ],
        points: [
          {
            title: "Selection methods",
            text: "Application forms, CVs, interviews, tests and references. Interviews show communication but can be **biased**.",
            icon: "clipboard",
          },
          {
            title: "Employment law",
            text: "Covers **contracts, discrimination, health and safety, and unfair dismissal**.",
            icon: "scale",
          },
          {
            title: "Why a workforce shrinks",
            text: "Falling demand, **automation**, relocation, or a merger removing duplicate jobs.",
            icon: "trending",
          },
        ],
        takeaway: "**Dismissal = fault. Redundancy = the job, not the person.**",
      },
      {
        code: "2.4",
        title: "Internal and external communication",
        eyebrow: "Getting the message across",
        visuals: [
          {
            kind: "flow",
            title: "The communication process",
            wide: true,
            steps: [
              { title: "Sender", text: "Creates the message.", icon: "message" },
              { title: "Message", text: "Sent through a channel.", icon: "arrow" },
              { title: "Receiver", text: "Decodes the message.", icon: "users" },
              { title: "Feedback", text: "Confirms understanding.", icon: "cycle" },
            ],
            note: "Communication works only when the message is **sent, received and understood**.",
          },
          {
            kind: "table",
            title: "Verbal, written or visual?",
            wide: true,
            headers: ["Type", "Examples", "Strength", "Weakness"],
            rows: [
              ["Verbal", "Meetings, phone", "Fast; feedback", "No record"],
              ["Written", "Email, letter, report", "Record; re-readable", "Slower"],
              ["Visual", "Charts, video", "Makes data clear", "Can oversimplify"],
            ],
          },
          {
            kind: "contrast",
            title: "One-way vs two-way",
            columns: [
              {
                title: "One-way",
                subtitle: "No reply",
                items: ["Fast", "Risk of misunderstanding"],
                tone: "sand",
                icon: "arrow",
              },
              {
                title: "Two-way",
                subtitle: "Questions + feedback",
                items: ["Clearer", "Slower"],
                tone: "green",
                icon: "cycle",
              },
            ],
          },
        ],
        points: [
          {
            title: "Internal vs external",
            text: "**Internal** stays inside the firm; **external** reaches customers, suppliers, banks and government.",
            icon: "globe",
          },
          {
            title: "Barriers",
            text: "**Jargon, language, noise, a long chain of command, the wrong medium, no feedback, attitude.**",
            icon: "alert",
          },
          {
            title: "Reduce barriers",
            text: "Use **short messages**, the **right medium**, **feedback**, and **fewer layers**.",
            icon: "check",
          },
        ],
        takeaway: "Choose the medium by **audience, message and need for feedback**.",
      },
    ],
  },
  {
    code: "3",
    title: "Marketing",
    strap: "Customers, research, the four Ps, and a legal marketing strategy.",
    blocks: [
      {
        code: "3.1",
        title: "Marketing, competition and the customer",
        eyebrow: "Find a need, then meet it profitably",
        visuals: [
          {
            kind: "contrast",
            title: "Market-oriented vs product-oriented",
            columns: [
              {
                title: "Market-oriented",
                subtitle: "Starts with the customer",
                items: ["Research customer needs", "Design the mix to fit", "Lower risk of a flop"],
                tone: "green",
                icon: "users",
              },
              {
                title: "Product-oriented",
                subtitle: "Starts with the product",
                items: ["Make first, then sell", "Risk of missing what customers want"],
                tone: "sand",
                icon: "package",
              },
            ],
          },
          {
            kind: "formula",
            title: "Market share",
            tokens: [
              { kind: "operand", label: "Firm's sales", text: "Units or revenue" },
              { kind: "operator", value: "÷" },
              { kind: "operand", label: "Total market sales", text: "All competitors" },
              { kind: "operator", value: "×" },
              { kind: "operand", label: "100", text: "Turn it into a percentage" },
              { kind: "operator", value: "=" },
              { kind: "result", label: "Market share %", text: "The firm's slice" },
            ],
            note: "A higher share can mean greater **pricing power** and **scale**.",
          },
          {
            kind: "contrast",
            title: "Mass vs niche marketing",
            columns: [
              {
                title: "Mass",
                subtitle: "The whole market",
                items: ["High sales potential", "High cost", "Heavy competition"],
                tone: "sand",
                icon: "globe",
              },
              {
                title: "Niche",
                subtitle: "A small segment",
                items: ["Less competition", "Can charge a higher price", "The market is small"],
                tone: "green",
                icon: "target",
              },
            ],
          },
          {
            kind: "pills",
            title: "Segment the market by…",
            columns: 3,
            items: [
              { title: "Age", icon: "users", tone: "rose" },
              { title: "Gender", icon: "users", tone: "sand" },
              { title: "Income", icon: "coins", tone: "green" },
              { title: "Location", icon: "globe", tone: "sage" },
              { title: "Lifestyle", icon: "spark", tone: "rose" },
            ],
            note: "Segmentation lets the **marketing mix** fit the target customer.",
          },
        ],
        points: [
          {
            title: "What marketing is",
            text: "Finds **customer needs** and meets them **at a profit**.",
            icon: "target",
          },
        ],
        takeaway: "Marketing starts with the **customer**, not the product.",
      },
      {
        code: "3.2",
        title: "Market research",
        eyebrow: "Reduce the risk of guessing",
        visuals: [
          {
            kind: "contrast",
            title: "Primary vs secondary research",
            wide: true,
            columns: [
              {
                title: "Primary",
                subtitle: "Collected first-hand",
                items: [
                  "Questionnaires, interviews, focus groups, observation",
                  "**Up to date and specific**",
                  "**Slow and costly**",
                ],
                tone: "green",
                icon: "search",
              },
              {
                title: "Secondary",
                subtitle: "Already exists",
                items: [
                  "Internal records, government statistics, reports, the internet",
                  "**Cheap and fast**",
                  "May be **old or not exact**",
                ],
                tone: "sand",
                icon: "book",
              },
            ],
          },
          {
            kind: "contrast",
            title: "Quantitative vs qualitative",
            columns: [
              {
                title: "Quantitative",
                subtitle: "Numbers",
                items: ["How many? How often?", "Easy to compare"],
                tone: "sage",
                icon: "chart",
              },
              {
                title: "Qualitative",
                subtitle: "Opinions and reasons",
                items: ["Why? What do people think?", "Richer insight"],
                tone: "rose",
                icon: "message",
              },
            ],
          },
          {
            kind: "pills",
            title: "A sound sample",
            columns: 3,
            items: [
              { title: "Large enough", text: "Enough people to trust the result.", icon: "users", tone: "green" },
              { title: "Representative", text: "Reflects the target market.", icon: "target", tone: "sage" },
              { title: "Avoid bias", text: "Questions and selection must be fair.", icon: "scale", tone: "rose" },
            ],
          },
        ],
        points: [
          {
            title: "Why research?",
            text: "It **cuts the risk** of launching a product nobody wants.",
            icon: "shield",
          },
          {
            title: "Bad sample, bad data",
            text: "If the sample is too small or unrepresentative, the result is **biased**.",
            icon: "alert",
          },
        ],
        takeaway: "Primary is **specific but costly**; secondary is **cheap but may be dated**.",
      },
      {
        code: "3.3",
        title: "Product",
        eyebrow: "Managing the product over time",
        visuals: [
          {
            kind: "chart",
            title: "The product life cycle",
            chart: "productLifeCycle",
            wide: true,
            stages: [
              {
                title: "Introduction",
                text: "Low sales and high launch costs.",
                meta: "Price high (skimming) or low (penetration).",
                tone: "rose",
              },
              {
                title: "Growth",
                text: "Sales rise and competitors enter.",
                meta: "Build brand loyalty and distribution.",
                tone: "sage",
              },
              {
                title: "Maturity",
                text: "Sales level off; competition is intense.",
                meta: "Differentiate and defend market share.",
                tone: "green",
              },
              {
                title: "Decline",
                text: "Sales fall; extend or withdraw.",
                meta: "Use an extension strategy or replace the product.",
                tone: "sand",
              },
            ],
            note: "Be ready to **read the diagram** and explain what happens at each stage.",
          },
          {
            kind: "pills",
            title: "Extension strategies delay decline",
            wide: true,
            columns: 3,
            items: [
              { title: "New market", text: "Sell to a new segment or country.", icon: "globe", tone: "green" },
              { title: "New use", text: "Find another problem it solves.", icon: "lightbulb", tone: "sand" },
              { title: "Adapt the product", text: "Change features or quality.", icon: "gear", tone: "sage" },
              { title: "Adapt the packaging", text: "Refresh the look.", icon: "package", tone: "rose" },
              { title: "More advertising", text: "Remind the market.", icon: "megaphone", tone: "sand" },
              { title: "Sales promotion", text: "Add a short-term incentive.", icon: "tag", tone: "green" },
            ],
          },
        ],
        points: [
          {
            title: "Brand image",
            text: "Builds **loyalty** and can support a **higher price**.",
            icon: "spark",
          },
          {
            title: "Packaging",
            text: "**Protects** the product, **informs** the buyer and carries the **brand**.",
            icon: "package",
          },
          {
            title: "New product development",
            text: "Can raise sales, but **costs money** and can **fail**.",
            icon: "lightbulb",
          },
        ],
        takeaway: "Extension strategies **delay decline**; they do not change the underlying life cycle.",
      },
      {
        code: "3.4",
        title: "Price",
        eyebrow: "Turning value into revenue",
        visuals: [
          {
            kind: "table",
            title: "Pricing methods",
            headers: ["Method", "How it works", "Best used when"],
            rows: [
              ["Cost-plus", "Unit cost + markup", "The firm knows its costs"],
              ["Competitive", "Match rivals", "The market is price-sensitive"],
              ["Penetration", "Start low", "Launching to win share"],
              ["Skimming", "Start high", "A new or innovative product"],
              ["Dynamic", "Changes with demand", "Travel, events, ride-hailing"],
            ],
          },
          {
            kind: "metrics",
            title: "The cost-plus formula",
            items: [
              {
                label: "Cost-plus price",
                formula: "unit cost + markup",
                note: "The markup is the profit added to cost.",
              },
              {
                label: "Choose by",
                formula: "cost + competition + segment + life-cycle stage",
                note: "Price must fit the rest of the mix.",
              },
            ],
          },
        ],
        points: [
          {
            title: "Price is part of the mix",
            text: "It must be consistent with the **product**, **place**, **promotion** and target segment.",
            icon: "tag",
          },
        ],
        takeaway: "**Cost-plus** covers costs; **penetration** buys share; **skimming** captures willingness to pay.",
      },
      {
        code: "3.5",
        title: "Place",
        eyebrow: "Getting the product to the customer",
        visuals: [
          {
            kind: "channels",
            title: "Choosing a distribution channel",
            wide: true,
            channels: [
              { label: "Direct", steps: ["Producer", "Consumer"] },
              { label: "Retailer", steps: ["Producer", "Retailer", "Consumer"] },
              { label: "Wholesaler + retailer", steps: ["Producer", "Wholesaler", "Retailer", "Consumer"] },
              { label: "Agent", steps: ["Producer", "Agent", "Consumer"] },
            ],
            note: "More stages = **wider reach**, **less control**, and a **smaller share of the selling price**.",
          },
          {
            kind: "contrast",
            title: "E-commerce: opportunity vs cost",
            wide: true,
            columns: [
              {
                title: "Advantages",
                items: ["Open **all hours**", "Less **rent**", "Reaches a **wide market**"],
                tone: "green",
                icon: "globe",
              },
              {
                title: "Drawbacks",
                items: ["**Delivery** costs", "Website cost", "No chance to **try** the product", "More **competition**"],
                tone: "rose",
                icon: "alert",
              },
            ],
          },
        ],
        points: [
          {
            title: "Fit the channel to the product",
            text: "Consider the **customer**, the **product** and how much **control** the producer needs.",
            icon: "truck",
          },
        ],
        takeaway: "Every intermediary takes a **margin** — but can extend **reach**.",
      },
      {
        code: "3.6",
        title: "Promotion",
        eyebrow: "Communicating value",
        visuals: [
          {
            kind: "contrast",
            title: "Sales promotion vs advertising",
            columns: [
              {
                title: "Sales promotion",
                subtitle: "Short-term incentives",
                items: ["Vouchers", "Reward schemes", "Competitions", "Special offers"],
                tone: "sand",
                icon: "tag",
              },
              {
                title: "Advertising",
                subtitle: "Paid communication",
                items: ["Social media", "Targeted emails", "Leaflets", "Billboards"],
                tone: "green",
                icon: "megaphone",
              },
            ],
          },
          {
            kind: "pills",
            title: "Choose the method that…",
            columns: 3,
            items: [
              { title: "Reaches the target", text: "Where does the customer look?", icon: "target", tone: "green" },
              { title: "Fits the budget", text: "The firm must be able to afford it.", icon: "coins", tone: "sand" },
              { title: "Matches the brand", text: "The message must feel consistent.", icon: "spark", tone: "rose" },
            ],
          },
        ],
        points: [
          {
            title: "One clear message",
            text: "Promotion must reach the **target customer** at a cost the firm can afford, and match the **brand**.",
            icon: "megaphone",
          },
        ],
        takeaway: "Promotion must fit the **target segment**, the **message** and the **budget**.",
      },
      {
        code: "3.7",
        title: "Marketing strategy",
        eyebrow: "Making the four Ps work together",
        visuals: [
          {
            kind: "quad",
            title: "The marketing mix: the four Ps",
            wide: true,
            items: [
              { title: "Product", text: "Goods, services, features and brand.", icon: "package", tone: "green" },
              { title: "Price", text: "What the customer pays.", icon: "tag", tone: "sand" },
              { title: "Place", text: "How it reaches the customer.", icon: "truck", tone: "sage" },
              { title: "Promotion", text: "How the customer hears about it.", icon: "megaphone", tone: "rose" },
            ],
            note: "The four Ps must **work together** for the chosen segment, and change as the product, rivals and economy change.",
          },
          {
            kind: "contrast",
            title: "Entering a foreign market",
            wide: true,
            columns: [
              {
                title: "What may differ",
                items: ["Income level", "Culture", "Law", "Competitors"],
                tone: "sand",
                icon: "globe",
              },
              {
                title: "What may change",
                items: ["Product features", "Price", "Place or channel", "Promotion"],
                tone: "green",
                icon: "cycle",
              },
            ],
          },
          {
            kind: "pills",
            title: "Legal controls protect consumers",
            wide: true,
            columns: 3,
            items: [
              { title: "Honest descriptions", icon: "check", tone: "sage" },
              { title: "Safe products", icon: "shield", tone: "green" },
              { title: "No misleading ads", icon: "alert", tone: "rose" },
              { title: "Correct weights", icon: "scale", tone: "sand" },
              { title: "Right to a refund", icon: "cash", tone: "green" },
            ],
            note: "Breaking these rules brings **fines** and a **damaged brand**.",
          },
        ],
        points: [
          {
            title: "Consistency is the test",
            text: "A strategy works when all four Ps reinforce the **same target segment**.",
            icon: "target",
          },
        ],
        takeaway: "A marketing strategy is **consistent** only when the four Ps reinforce the same target segment.",
      },
    ],
  },
  {
    code: "4",
    title: "Operations management",
    strap: "How goods are made, what they cost, how quality is kept, and where to locate.",
    blocks: [
      {
        code: "4.1",
        title: "Production of goods and services",
        eyebrow: "How output is organised",
        visuals: [
          {
            kind: "table",
            title: "Job, batch or flow?",
            wide: true,
            headers: ["Method", "How it works", "Best for", "Trade-off"],
            rows: [
              ["Job", "One-off item", "Custom, low volume", "Skilled, high price, slow"],
              ["Batch", "Group of identical items, then switch", "Medium volume, some variety", "Setup time between batches"],
              ["Flow (mass)", "Continuous production", "High volume, standardised", "Low unit cost, high setup, little variety"],
            ],
          },
          {
            kind: "formula",
            title: "Productivity",
            tokens: [
              { kind: "operand", label: "Output", text: "Units produced" },
              { kind: "operator", value: "÷" },
              { kind: "operand", label: "Workers or hours", text: "The input used" },
              { kind: "operator", value: "=" },
              { kind: "result", label: "Productivity", text: "Output per worker or hour" },
            ],
            note: "Raise it with **training**, better **machines**, **motivation** and better **methods**.",
          },
          {
            kind: "contrast",
            title: "Automation & lean production",
            columns: [
              {
                title: "Automation",
                items: ["Raises **speed** and **consistency**", "Cuts **labour cost**", "Expensive", "Can cause **redundancy**"],
                tone: "sand",
                icon: "gear",
              },
              {
                title: "Lean production",
                items: [
                  "**Cuts waste**",
                  "**Kaizen**: small worker-led improvements",
                  "**JIT**: inventory arrives as needed",
                  "Less cash tied up, but a late supplier stops production",
                ],
                tone: "green",
                icon: "recycle",
              },
            ],
          },
        ],
        points: [
          {
            title: "Productivity is not output",
            text: "Output can rise while **productivity** falls if more workers are added.",
            icon: "chart",
          },
        ],
        takeaway: "**Productivity** is about output per input; **lean** is about removing waste.",
      },
      {
        code: "4.2",
        title: "Costs, scale of production and break-even",
        eyebrow: "Costs, scale and the break-even point",
        visuals: [
          {
            kind: "metrics",
            title: "The cost & break-even toolkit",
            wide: true,
            items: [
              { label: "Total cost", formula: "fixed costs + variable costs" },
              { label: "Average cost", formula: "total cost ÷ output" },
              { label: "Contribution", formula: "selling price − variable cost per unit" },
              { label: "Break-even output", formula: "fixed costs ÷ contribution" },
              { label: "Margin of safety", formula: "current output − break-even output" },
              { label: "Revenue", formula: "price × quantity" },
              { label: "Profit", formula: "revenue − total cost" },
            ],
          },
          {
            kind: "chart",
            title: "Reading a break-even chart",
            chart: "breakEven",
            wide: true,
            note: "A **higher price** or **lower costs** move the break-even point **down**. Break-even assumes one product and that all output is sold at one price.",
          },
          {
            kind: "contrast",
            title: "Economies vs diseconomies of scale",
            wide: true,
            columns: [
              {
                title: "Economies of scale",
                items: ["Purchasing", "Marketing", "Financial", "Managerial", "Technical"],
                tone: "green",
                icon: "trending",
              },
              {
                title: "Diseconomies of scale",
                items: ["Poor communication", "Lack of commitment", "Weak coordination", "Lack of control"],
                tone: "rose",
                icon: "alert",
              },
            ],
          },
        ],
        points: [
          {
            title: "Fixed vs variable",
            text: "**Fixed costs** do not change with output (rent); **variable costs** do (materials).",
            icon: "calculator",
          },
          {
            title: "Break-even assumptions",
            text: "One product; all output sold at one price.",
            icon: "scale",
          },
        ],
        takeaway: "Break-even tells you the **minimum output** needed to cover costs — not the profit at every level.",
      },
      {
        code: "4.3",
        title: "Achieving quality production",
        eyebrow: "Getting quality right the first time",
        visuals: [
          {
            kind: "contrast",
            title: "Quality control vs quality assurance",
            wide: true,
            columns: [
              {
                title: "Quality control",
                subtitle: "Inspect at the end",
                items: ["Faults found **late**", "Some faulty goods still get through", "Inspectors add cost"],
                tone: "sand",
                icon: "search",
              },
              {
                title: "Quality assurance",
                subtitle: "Check during production",
                items: ["Faults caught **earlier**", "Workers responsible for their own quality", "Prevention, not detection"],
                tone: "green",
                icon: "shield",
              },
            ],
          },
          {
            kind: "pills",
            title: "Why poor quality hurts",
            wide: true,
            columns: 4,
            items: [
              { title: "Returns", icon: "recycle", tone: "rose" },
              { title: "Complaints", icon: "message", tone: "sand" },
              { title: "Bad reputation", icon: "alert", tone: "rose" },
              { title: "Wasted materials", icon: "package", tone: "sage" },
            ],
          },
        ],
        points: [
          {
            title: "What quality means",
            text: "**Meeting what the customer expects** — not necessarily the highest possible specification.",
            icon: "target",
          },
        ],
        takeaway: "**QC detects faults at the end; QA prevents them during production.**",
      },
      {
        code: "4.4",
        title: "Location decisions",
        eyebrow: "Choosing where to operate",
        visuals: [
          {
            kind: "contrast",
            title: "What influences location?",
            wide: true,
            columns: [
              {
                title: "A factory",
                items: [
                  "Raw materials",
                  "Transport",
                  "Labour cost and skill",
                  "Rent and power",
                  "Government grants",
                  "How near the market is",
                ],
                tone: "sand",
                icon: "factory",
              },
              {
                title: "A service",
                items: ["Customers passing by", "Parking", "Nearby rivals", "Rent", "Can the work be done online?"],
                tone: "green",
                icon: "store",
              },
            ],
          },
          {
            kind: "contrast",
            title: "Moving abroad",
            wide: true,
            columns: [
              {
                title: "Opportunities",
                items: ["Cheaper labour", "A new market", "Government grants"],
                tone: "green",
                icon: "globe",
              },
              {
                title: "Risks",
                items: [
                  "Language and culture problems",
                  "Higher transport cost",
                  "Legal risk",
                  "A longer supply chain",
                ],
                tone: "rose",
                icon: "alert",
              },
            ],
          },
        ],
        points: [
          {
            title: "Regulation can decide the site",
            text: "**Planning permission** and **pollution rules** can block a site or raise its cost.",
            icon: "landmark",
          },
        ],
        takeaway: "Location is a **trade-off** between cost, reach and risk.",
      },
    ],
  },
  {
    code: "5",
    title: "Financial information and decisions",
    strap: "Where money comes from, cash versus profit, the accounts, and ratios.",
    blocks: [
      {
        code: "5.1",
        title: "Business finance: needs and sources",
        eyebrow: "Funding the plan",
        visuals: [
          {
            kind: "pills",
            title: "Why businesses need finance",
            wide: true,
            columns: 3,
            items: [
              { title: "Start up", text: "Set up the business.", icon: "spark", tone: "rose" },
              { title: "Expand", text: "Grow output or reach new markets.", icon: "trending", tone: "green" },
              { title: "Replace non-current assets", text: "Premises, machines, vehicles.", icon: "factory", tone: "sand" },
              { title: "Invest in new technology", text: "Automate or improve processes.", icon: "gear", tone: "sage" },
              { title: "Working capital", text: "Pay day-to-day bills.", icon: "recycle", tone: "green" },
            ],
            note: "Needs can be **short-term** or **long-term**.",
          },
          {
            kind: "contrast",
            title: "Internal vs external sources",
            wide: true,
            columns: [
              {
                title: "Internal",
                items: ["Owners' investment", "Retained profit", "Sale of unwanted assets", "Working capital"],
                tone: "green",
                icon: "building",
              },
              {
                title: "External",
                items: [
                  "Shares and venture capital",
                  "Bank overdraft and bank loan",
                  "Leasing and hire purchase",
                  "Trade credit",
                  "Government grants",
                  "Crowdfunding",
                ],
                tone: "sand",
                icon: "globe",
              },
            ],
          },
          {
            kind: "table",
            title: "Choosing a source",
            wide: true,
            headers: ["Question", "Why it matters"],
            rows: [
              ["How much is needed?", "The source must cover the need"],
              ["How long is it needed?", "Match short-term and long-term needs"],
              ["Interest and fees?", "The cost of finance"],
              ["Is security required?", "Some lenders require assets as security"],
              ["Do owners lose control?", "Selling shares **dilutes control**; a loan does not"],
            ],
          },
        ],
        points: [
          {
            title: "Who can sell shares?",
            text: "**Limited companies** can sell shares; **sole traders and partnerships** cannot.",
            icon: "briefcase",
          },
          {
            title: "New firms",
            text: "A brand-new firm usually has **no retained profit** yet.",
            icon: "alert",
          },
        ],
        takeaway: "Match the **source** to the **amount, duration and risk** — and check what it costs in control.",
      },
      {
        code: "5.2",
        title: "Cash-flow forecasting and working capital",
        eyebrow: "Cash is not the same as profit",
        visuals: [
          {
            kind: "metrics",
            title: "Cash-flow formulas",
            items: [
              { label: "Net cash flow", formula: "cash in − cash out" },
              { label: "Closing balance", formula: "opening balance + net cash flow" },
              { label: "Working capital", formula: "current assets − current liabilities" },
            ],
          },
          {
            kind: "contrast",
            title: "Cash vs profit",
            columns: [
              {
                title: "Cash",
                items: ["Money available **now**", "Timing matters", "A firm can be profitable and still run out of cash"],
                tone: "green",
                icon: "cash",
              },
              {
                title: "Profit",
                items: ["Revenue − costs **over a period**", "An accounting measure", "Does not guarantee cash is available"],
                tone: "sand",
                icon: "chart",
              },
            ],
          },
          {
            kind: "contrast",
            title: "Working capital: too little vs too much",
            wide: true,
            columns: [
              {
                title: "Too little",
                items: ["Cannot pay day-to-day bills", "Risk of **insolvency**"],
                tone: "rose",
                icon: "alert",
              },
              {
                title: "Too much",
                items: ["Cash tied up in **stock**", "Cash tied up in **unpaid invoices**"],
                tone: "sand",
                icon: "package",
              },
            ],
          },
          {
            kind: "pills",
            title: "If cash is short",
            wide: true,
            columns: 2,
            items: [
              { title: "Arrange an overdraft", icon: "banknote", tone: "green" },
              { title: "Ask customers to pay more quickly", icon: "clock", tone: "sage" },
              { title: "Delay payments to suppliers", icon: "handshake", tone: "sand" },
              { title: "Delay buying non-current assets", icon: "factory", tone: "rose" },
            ],
          },
        ],
        points: [
          {
            title: "Why forecast?",
            text: "A **cash-flow forecast** shows a future shortage early enough to act.",
            icon: "chart",
          },
        ],
        takeaway: "**Profit is not cash.** A profitable firm can still fail if the timing of cash is wrong.",
      },
      {
        code: "5.3",
        title: "Income statements",
        eyebrow: "From revenue to retained profit",
        visuals: [
          {
            kind: "waterfall",
            title: "The income statement",
            wide: true,
            steps: [
              { label: "Revenue", formula: "sales income", tone: "green" },
              { label: "− Cost of sales", formula: "cost of the goods sold", tone: "rose" },
              { label: "= Gross profit", formula: "revenue − cost of sales", tone: "sage" },
              { label: "− Expenses", formula: "running costs", tone: "rose" },
              { label: "= Profit for the year", formula: "gross profit − expenses", tone: "green" },
            ],
          },
          {
            kind: "contrast",
            title: "What happens to profit for the year?",
            wide: true,
            columns: [
              {
                title: "Retained profit",
                subtitle: "Kept in the business",
                items: ["Funds future investment", "Builds reserves"],
                tone: "green",
                icon: "lock",
              },
              {
                title: "Drawings or dividends",
                subtitle: "Paid to owners",
                items: ["Sole traders take **drawings**", "Companies pay **dividends**"],
                tone: "sand",
                icon: "coins",
              },
            ],
          },
        ],
        points: [
          {
            title: "What stakeholders learn",
            text: "Whether the firm is **profitable** and whether **profit is rising**.",
            icon: "chart",
          },
          {
            title: "What it does not show",
            text: "The **cash balance** or the **value of assets**.",
            icon: "alert",
          },
        ],
        takeaway: "Revenue → gross profit → profit for the year → retained profit or distributions.",
      },
      {
        code: "5.4",
        title: "Statement of financial position",
        eyebrow: "A snapshot of what the business owns and owes",
        visuals: [
          {
            kind: "formula",
            title: "The accounting equation",
            wide: true,
            tokens: [
              { kind: "operand", label: "Assets", text: "What the business owns" },
              { kind: "operator", value: "=" },
              { kind: "operand", label: "Liabilities", text: "What the business owes" },
              { kind: "operator", value: "+" },
              { kind: "result", label: "Equity", text: "Owners' claim" },
            ],
            note: "This is a **snapshot on one date**, not a measure of profit.",
          },
          {
            kind: "table",
            title: "Classifying the statement",
            wide: true,
            headers: ["Group", "Examples", "Time frame"],
            rows: [
              ["Non-current assets", "Premises, machines, intangibles such as a brand", "Kept more than 1 year"],
              ["Current assets", "Inventory, trade receivables, cash", "Within 1 year"],
              ["Current liabilities", "Trade payables, bank overdraft", "Due within 1 year"],
              ["Non-current liabilities", "Longer loans", "Due after 1 year"],
              ["Equity", "Share capital + retained profit", "Owners' claim"],
            ],
          },
          {
            kind: "metrics",
            title: "Two useful measures",
            wide: true,
            items: [
              { label: "Capital employed", formula: "equity + non-current liabilities", note: "Long-term capital in the business." },
              { label: "Working capital", formula: "current assets − current liabilities", note: "The day-to-day buffer." },
            ],
          },
        ],
        points: [
          {
            title: "Snapshot, not a flow",
            text: "It shows the position on **one date**, unlike the income statement which covers a period.",
            icon: "clock",
          },
        ],
        takeaway: "The statement is a **snapshot**, not a measure of profit.",
      },
      {
        code: "5.5",
        title: "Analysis of accounts",
        eyebrow: "Turning accounts into insight",
        visuals: [
          {
            kind: "metrics",
            title: "Profitability ratios",
            items: [
              { label: "Gross profit margin", formula: "gross profit ÷ revenue × 100" },
              { label: "Profit margin", formula: "profit for the year ÷ revenue × 100" },
              { label: "ROCE", formula: "profit for the year ÷ capital employed × 100" },
            ],
            note: "These measure **profitability**.",
          },
          {
            kind: "metrics",
            title: "Liquidity ratios",
            items: [
              { label: "Current ratio", formula: "current assets ÷ current liabilities" },
              { label: "Acid test", formula: "(current assets − inventory) ÷ current liabilities" },
            ],
            note: "**Below 1** = current liabilities are larger than the assets that can pay them.",
          },
          {
            kind: "contrast",
            title: "How to interpret",
            wide: true,
            columns: [
              {
                title: "Good practice",
                items: ["Compare with last year", "Compare with similar firms", "Look at the cause, not one ratio"],
                tone: "green",
                icon: "chart",
              },
              {
                title: "Limits",
                items: [
                  "Figures are **historical**",
                  "Can be **presented to look better**",
                  "Ignore non-financial factors",
                  "Accounting rules differ",
                ],
                tone: "rose",
                icon: "alert",
              },
            ],
          },
        ],
        points: [
          {
            title: "One ratio is not the answer",
            text: "A ratio is a **starting point for questions**, not a complete explanation.",
            icon: "search",
          },
        ],
        takeaway: "Compare ratios over time and against similar firms; then ask **why** they changed.",
      },
    ],
  },
  {
    code: "6",
    title: "External influences on business activity",
    strap: "The economy, ethics and the environment, and trade across borders.",
    blocks: [
      {
        code: "6.1",
        title: "Economic issues",
        eyebrow: "The economic weather",
        visuals: [
          {
            kind: "chart",
            title: "The business cycle",
            chart: "businessCycle",
            wide: true,
            stages: [
              {
                title: "Growth",
                text: "GDP is rising; sales improve.",
                meta: "Firms may invest and hire.",
                tone: "sage",
              },
              {
                title: "Boom",
                text: "Sales are high and unemployment is low.",
                meta: "Costs may rise; capacity is stretched.",
                tone: "green",
              },
              {
                title: "Recession",
                text: "Demand and profit fall.",
                meta: "Firms may cut output and jobs.",
                tone: "rose",
              },
              {
                title: "Slump",
                text: "A deep downturn; weak demand persists.",
                meta: "Unemployment is high; confidence is low.",
                tone: "sand",
              },
            ],
          },
          {
            kind: "table",
            title: "Economic indicators & the firm",
            wide: true,
            headers: ["Indicator", "What it means", "Business effect"],
            rows: [
              ["Inflation", "A general rise in prices", "Costs rise; exports get harder if home prices rise faster than abroad"],
              ["Unemployment", "People without work", "Holds wages down, but cuts demand for many products"],
              ["Economic growth", "A rising GDP", "Usually means higher sales"],
            ],
          },
          {
            kind: "contrast",
            title: "Policy tools",
            wide: true,
            columns: [
              {
                title: "Fiscal policy",
                subtitle: "Tax and government spending",
                items: [
                  "Higher income tax cuts consumer spending.",
                  "Higher corporation tax leaves less profit to reinvest.",
                  "Extra government spending can raise demand.",
                ],
                tone: "sand",
                icon: "landmark",
              },
              {
                title: "Monetary policy",
                subtitle: "Interest rates",
                items: [
                  "Higher rates make borrowing dearer.",
                  "Firms may invest less.",
                  "Consumers with loans may spend less.",
                ],
                tone: "green",
                icon: "banknote",
              },
            ],
          },
        ],
        points: [
          {
            title: "How a firm responds",
            text: "Change its **price, output or investment** as the economy changes.",
            icon: "gear",
          },
        ],
        takeaway: "The business cycle affects **demand, costs and confidence** — often at the same time.",
      },
      {
        code: "6.2",
        title: "Environmental and ethical issues",
        eyebrow: "Profit with a wider responsibility",
        visuals: [
          {
            kind: "externality",
            title: "Externalities: effects on outsiders",
            wide: true,
            costs: ["Pollution", "Congestion", "Noise"],
            benefits: ["Jobs", "Training", "Local spending"],
            note: "An **externality** is an effect on someone outside the business.",
          },
          {
            kind: "pills",
            title: "Ethical issues",
            columns: 2,
            items: [
              { title: "Child labour", icon: "alert", tone: "rose" },
              { title: "Fair wages", icon: "coins", tone: "green" },
              { title: "Fair prices to suppliers", icon: "handshake", tone: "sand" },
              { title: "Environmentally responsible suppliers", icon: "leaf", tone: "sage" },
            ],
          },
          {
            kind: "contrast",
            title: "Acting ethically: cost vs benefit",
            columns: [
              {
                title: "Costs",
                items: ["Higher production costs", "Slower sourcing", "Possible lower short-term profit"],
                tone: "rose",
                icon: "coins",
              },
              {
                title: "Benefits",
                items: ["Protects the **brand**", "Attracts new customers", "Avoids **legal penalties**", "Improves staff morale"],
                tone: "green",
                icon: "shield",
              },
            ],
          },
        ],
        points: [
          {
            title: "Pressure groups",
            text: "**Pressure groups and boycotts** can push a firm to act; ignoring them risks **lost sales** and **new laws**.",
            icon: "megaphone",
          },
          {
            title: "Sustainable development",
            text: "Meets **today's needs** without stopping **future generations** from meeting theirs. Recycle, use renewable energy, cut packaging.",
            icon: "leaf",
          },
          {
            title: "Social responsibility",
            text: "Think about **employees, customers, suppliers and the community**, not only owners' profit.",
            icon: "users",
          },
        ],
        takeaway: "Ethics can **raise costs** and **protect the brand** — weigh both.",
      },
      {
        code: "6.3",
        title: "Business and the international economy",
        eyebrow: "Business beyond borders",
        visuals: [
          {
            kind: "contrast",
            title: "Globalisation",
            columns: [
              {
                title: "Opportunities",
                items: ["A larger market", "Cheaper supplies", "New ideas"],
                tone: "green",
                icon: "globe",
              },
              {
                title: "Threats",
                items: ["More competition", "Dependence on foreign economies"],
                tone: "rose",
                icon: "alert",
              },
            ],
            note: "Helped by **freer trade, cheaper transport and the internet**.",
          },
          {
            kind: "contrast",
            title: "A multinational in the host country",
            columns: [
              {
                title: "Gains",
                items: ["Jobs", "Tax revenue", "Skills", "Exports"],
                tone: "green",
                icon: "building",
              },
              {
                title: "Costs",
                items: ["Profits sent home", "Local firms squeezed", "Pollution"],
                tone: "rose",
                icon: "alert",
              },
            ],
          },
          {
            kind: "table",
            title: "Trade barriers & currencies",
            wide: true,
            headers: ["Concept", "What it does"],
            rows: [
              ["Tariff", "A tax on imports, so imports become dearer"],
              ["Quota", "A limit on imports, so fewer are available"],
              ["Appreciation", "Imports become cheaper; exports become dearer"],
              ["Depreciation", "Imports become dearer; exports become cheaper"],
            ],
            note: "No exchange-rate calculation is required.",
          },
        ],
        points: [
          {
            title: "What is a multinational?",
            text: "A firm that produces in **more than one country**.",
            icon: "globe",
          },
        ],
        takeaway: "Trade and exchange rates change the **price** of competing at home and abroad.",
      },
    ],
  },
];
