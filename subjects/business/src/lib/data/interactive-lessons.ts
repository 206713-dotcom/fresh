/**
 * EcBiz Interactive Lessons
 *
 * Content is mapped to the Cambridge IGCSE Business 0264 syllabus for
 * examination in 2027–2029 and the chapter sequence of
 * Cambridge IGCSE & O Level Business, Sixth Edition (Borrington & Stimpson).
 *
 * Hidden terms inside concept text use the [[term]] token. The lesson reader
 * reveals the first 25% of hidden terms each time a Hint is requested.
 */

export type LessonSectionCode = "1" | "2" | "3" | "4" | "5" | "6";

export type SelfAssessment = "easy" | "medium" | "hard";

export interface LessonConcept {
  id: string;
  lead: string;
  text: string;
  note?: string;
}

export interface LessonPractice {
  commandWord: string;
  scenario: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  modelAnswer: string;
}

export interface InteractiveLesson {
  id: string;
  sectionCode: LessonSectionCode;
  chapter: string;
  syllabusCodes: string[];
  title: string;
  objective: string;
  minutes: number;
  concepts: LessonConcept[];
  examTip: string;
  practice: LessonPractice;
}

export interface LessonSection {
  code: LessonSectionCode;
  title: string;
  shortTitle: string;
  description: string;
  lessons: InteractiveLesson[];
}

export const LESSON_SECTIONS: LessonSection[] = [
  {
    code: "1",
    title: "Understanding business activity",
    shortTitle: "Business activity",
    description:
      "Purpose of business, economic sectors, enterprise, ownership, objectives and stakeholders.",
    lessons: [
      {
        id: "1.1",
        sectionCode: "1",
        chapter: "Book Ch 1",
        syllabusCodes: ["1.1", "1.2"],
        title: "Business activity, added value & economic sectors",
        objective:
          "Explain how businesses combine scarce resources, calculate added value and classify activity by sector.",
        minutes: 12,
        concepts: [
          {
            id: "1.1-c1",
            lead: "Scarcity and choice",
            text: "People have unlimited [[wants]] but resources are scarce. Choosing one use of a resource means giving up the next best alternative, known as the [[opportunity cost]].",
            note: "Opportunity cost is the value of the next best alternative forgone, not the money you actually spend.",
          },
          {
            id: "1.1-c2",
            lead: "Four factors of production",
            text: "Businesses combine [[land]] (natural resources), [[labour]] (people and their skills), [[capital]] (finance, machinery and equipment) and [[enterprise]] (the risk-taking, organising skill of the entrepreneur) to make goods and services.",
            note: "Specialisation and division of labour can raise output, but repetitive work may reduce motivation and create dependence between workers.",
          },
          {
            id: "1.1-c3",
            lead: "Adding value",
            text: "Added value is the difference between the [[selling price]] and the cost of [[bought-in materials]] and components. It can be increased through a stronger [[brand image]], better quality, improved customer service, effective packaging or lower material costs.",
            note: "Added value is not profit. Wages, energy, advertising, rent and other costs still have to be paid from it.",
          },
          {
            id: "1.1-c4",
            lead: "Economic sectors",
            text: "The [[primary sector]] extracts natural resources, the [[secondary sector]] manufactures goods, and the [[tertiary sector]] provides services. Many businesses operate across more than one sector.",
            note: "As economies develop, employment often shifts from primary to secondary and then tertiary activity.",
          },
          {
            id: "1.1-c5",
            lead: "Private and public sectors",
            text: "The private sector is owned by individuals and usually aims for [[profit]]. The public sector is owned and controlled by [[government]] and often provides essential services, sometimes free at the point of use.",
            note: "A mixed economy contains both private-sector and public-sector organisations.",
          },
        ],
        examTip:
          "When calculating added value, deduct only bought-in materials and components, never wages, rent or other running costs.",
        practice: {
          commandWord: "Calculate",
          scenario:
            "Hearth & Grain makes seeded loaves. Each loaf uses $0.80 of flour, seeds and yeast, plus $0.20 of bought-in packaging. It sells for $2.50.",
          question: "What is the added value per loaf?",
          options: ["$1.30", "$1.50", "$2.50"],
          correctIndex: 1,
          explanation:
            "Selling price $2.50 − bought-in materials and packaging $1.00 = $1.50. Wages and energy are not deducted when calculating added value.",
          modelAnswer:
            "Added value = selling price − cost of bought-in materials and components = $2.50 − ($0.80 + $0.20) = $1.50 per loaf. The baker's wages and energy costs are paid out of that added value.",
        },
      },
      {
        id: "1.2",
        sectionCode: "1",
        chapter: "Book Ch 2",
        syllabusCodes: ["1.3"],
        title: "Enterprise, growth & business size",
        objective:
          "Describe the entrepreneur's role, assess measures of business size and compare internal and external growth.",
        minutes: 13,
        concepts: [
          {
            id: "1.2-c1",
            lead: "The entrepreneur",
            text: "An entrepreneur [[organises resources]], takes [[risks]] and makes decisions in the hope of [[profit]]. Useful traits include resilience, creativity, confidence, determination and the ability to communicate.",
          },
          {
            id: "1.2-c2",
            lead: "The business plan",
            text: "A business plan sets out the [[business idea]], objectives, market research, marketing, operations, finance and people. It helps secure [[finance]] and forces the owner to test assumptions before launch.",
            note: "Governments may support start-ups with grants, business advice, low-cost loans and training schemes.",
          },
          {
            id: "1.2-c3",
            lead: "Measuring business size",
            text: "Business size can be measured by the [[number of employees]], the [[value or volume of output]] and sales, or [[capital employed]]. [[Profit]] is not a measure of business size.",
            note: "No single measure is perfect: a labour-intensive firm may look large by employees but small by sales value, and vice versa.",
          },
          {
            id: "1.2-c4",
            lead: "Internal and external growth",
            text: "[[Internal growth]] adds new products or new markets. [[External growth]] uses a [[merger or takeover]]. Horizontal integration joins competitors, while vertical integration joins firms at different stages of the same industry.",
          },
          {
            id: "1.2-c5",
            lead: "Why size varies",
            text: "Growth can raise profit, market share and bargaining power, but may bring [[poor communication]] and a loss of control. Some owners stay small to keep [[control]], limit risk or serve a [[niche market]].",
            note: "Businesses often fail because of poor management, insufficient cash, weak demand, unsuitable products or stronger competition.",
          },
        ],
        examTip:
          "A 4-mark 'explain' answer needs a point plus development. Reject profit as a method of measuring business size.",
        practice: {
          commandWord: "Identify",
          scenario:
            "Two bakeries compare their size. Bakery A employs 45 staff and has annual sales of $1.2m. Bakery B employs 20 staff but sells $2.4m of output through a small number of high-value contracts.",
          question: "Which statement is correct?",
          options: [
            "Bakery A is definitely larger because it has more employees",
            "Business size can be measured in different ways, which may give different rankings",
            "Profit is the best measure of business size",
          ],
          correctIndex: 1,
          explanation:
            "Employees, sales value and capital employed are all accepted size measures. They can rank firms differently, so no single measure is perfect; profit is not a size measure.",
          modelAnswer:
            "Business size may be measured by employees, output or sales value/volume, and capital employed. Here A is larger by employees while B is larger by sales value, so the measures conflict. Profit is not a method of measuring business size.",
        },
      },
      {
        id: "1.3",
        sectionCode: "1",
        chapter: "Book Ch 3",
        syllabusCodes: ["1.4"],
        title: "Types of business organisation",
        objective:
          "Compare ownership forms and recommend a suitable structure for a given business situation.",
        minutes: 13,
        concepts: [
          {
            id: "1.3-c1",
            lead: "Sole traders and partnerships",
            text: "A [[sole trader]] owns and controls the business but has [[unlimited liability]]. A [[partnership]] brings extra capital and skills, but partners usually share profit and may still face unlimited liability.",
            note: "A sole trader keeps all profit and decision-making power, but has limited capital and unlimited risk.",
          },
          {
            id: "1.3-c2",
            lead: "Limited companies",
            text: "A private limited company ([[Ltd]]) has a [[separate legal identity]] and limited liability; shares are sold privately. A [[public limited company]] (Plc) can sell shares to the public and raise more capital, but must disclose more information and the original owners may lose control.",
          },
          {
            id: "1.3-c3",
            lead: "Franchises",
            text: "A [[franchise]] lets the franchisee use an established [[brand]] and operating system. The franchisee pays fees and follows rules; the franchisor expands with less capital but must protect its reputation.",
            note: "Franchising gives the franchisee a proven model and support, but reduces independence and can be expensive.",
          },
          {
            id: "1.3-c4",
            lead: "Joint ventures and social enterprises",
            text: "A [[joint venture]] is a shared project between separate businesses, spreading cost and risk. A [[social enterprise]] trades to meet a social aim while covering its costs.",
            note: "A joint venture is not a merger: the businesses remain separate while sharing a specific project.",
          },
        ],
        examTip:
          "Recommendation questions need a decision plus justification. Weigh the options against the case facts: capital, control, liability and risk.",
        practice: {
          commandWord: "Recommend",
          scenario:
            "Two cousins run a successful catering business as a partnership. They want to raise $150,000, keep ownership within the family, and protect their personal assets if the business fails.",
          question: "Which form of organisation best fits their objectives?",
          options: [
            "Stay as an unlimited-liability partnership",
            "Convert to a private limited company (Ltd)",
            "Become a public limited company (Plc)",
          ],
          correctIndex: 1,
          explanation:
            "A Ltd gives limited liability and can issue shares privately to family investors. A partnership lacks limited liability; a Plc could raise more capital but would lose control and face public disclosure.",
          modelAnswer:
            "A private limited company (Ltd) is most suitable. It provides limited liability, protecting the cousins' personal assets, and shares can be sold privately to family members without a public listing. The partnership keeps control but not limited liability; a Plc is unnecessary and would dilute family control.",
        },
      },
      {
        id: "1.4",
        sectionCode: "1",
        chapter: "Book Ch 4",
        syllabusCodes: ["1.5"],
        title: "Business objectives & stakeholders",
        objective:
          "Explain common business objectives and analyse how stakeholder aims can conflict.",
        minutes: 11,
        concepts: [
          {
            id: "1.4-c1",
            lead: "Common objectives",
            text: "Businesses may pursue [[survival]], [[profit]], [[growth]] and a larger [[market share]]. Objectives give direction, coordinate decisions and provide a yardstick for measuring success.",
          },
          {
            id: "1.4-c2",
            lead: "Objectives change",
            text: "A new firm may prioritise [[survival]]; a mature firm may target growth or market share. Objectives can shift with the [[business cycle]], competition, owner values and stakeholder pressure.",
          },
          {
            id: "1.4-c3",
            lead: "Internal stakeholders",
            text: "[[Owners]], [[managers]] and [[employees]] are internal stakeholders. Owners may want profit, managers may want responsibility or bonuses, and employees may want higher pay and job security.",
          },
          {
            id: "1.4-c4",
            lead: "External stakeholders",
            text: "[[Customers]], [[suppliers]], [[lenders]], [[government]] and the [[local community]] are external stakeholders. Their aims include value, reliable payment, repayment, tax revenue and minimal disruption.",
          },
          {
            id: "1.4-c5",
            lead: "Stakeholder conflict",
            text: "Stakeholder aims can conflict. Raising wages may improve motivation but reduce [[profit]]; cutting prices may attract customers but squeeze [[margins]]; a factory may create jobs but cause [[pollution]].",
          },
        ],
        examTip:
          "For stakeholder questions, name the group, state its objective, then explain the effect on another group. Use 'whereas' to show the conflict.",
        practice: {
          commandWord: "Explain",
          scenario:
            "A clothing factory plans to automate its sewing line. It will cut unit costs and protect jobs at the plant, but 40 workers will be made redundant. The local community is concerned about unemployment.",
          question: "Which option best explains the stakeholder conflict?",
          options: [
            "Owners and managers want profit, while employees and the local community want job security",
            "All stakeholders benefit equally from lower costs",
            "The government is an internal stakeholder and wants redundancy",
          ],
          correctIndex: 0,
          explanation:
            "Owners may gain from lower costs and higher profit, while workers face lost income and the community faces unemployment. These aims conflict; the government is external, not internal.",
          modelAnswer:
            "The owners' objective of lower costs and higher profit conflicts with employees' need for job security and the local community's desire for employment. Redundancy creates that trade-off, even if the investment helps the firm survive.",
        },
      },
    ],
  },
  {
    code: "2",
    title: "People in business",
    shortTitle: "People",
    description:
      "Recruitment, contracts, training, organisation, leadership, communication and motivation.",
    lessons: [
      {
        id: "2.1",
        sectionCode: "2",
        chapter: "Book Ch 5",
        syllabusCodes: ["2.1"],
        title: "Human resource management: recruit, contract, train",
        objective:
          "Outline the recruitment process, evaluate selection and training methods, and explain legal controls over employment.",
        minutes: 14,
        concepts: [
          {
            id: "2.1-c1",
            lead: "Recruitment stages",
            text: "Recruitment begins with [[job analysis]], then a [[job description]] (duties) and [[person specification]] (qualities required), before advertising and [[selection]].",
          },
          {
            id: "2.1-c2",
            lead: "Internal versus external recruitment",
            text: "[[Internal recruitment]] is quicker, cheaper and motivates staff, but limits new ideas. [[External recruitment]] widens the talent pool but costs more and takes longer.",
          },
          {
            id: "2.1-c3",
            lead: "Selection and contracts",
            text: "Selection may use CVs, application forms, [[references]], tests, assessment centres and [[interviews]]. An [[employment contract]] sets out duties, hours, holiday entitlement and sick pay.",
            note: "Employment contracts protect both sides and reduce disputes about expectations.",
          },
          {
            id: "2.1-c4",
            lead: "Legal controls",
            text: "Law protects workers against [[unfair dismissal]], [[discrimination]], unsafe working conditions and pay below the [[minimum wage]]. These protections raise employer costs but improve fairness and retention.",
          },
          {
            id: "2.1-c5",
            lead: "Training",
            text: "[[Induction training]] introduces the organisation. [[On-the-job training]] happens while working and is cheaper; [[off-the-job training]] uses specialists and is broader but more expensive.",
          },
        ],
        examTip:
          "When recommending who to employ, match the person specification to the evidence in the case. Do not choose the friendliest applicant without justification.",
        practice: {
          commandWord: "Identify",
          scenario:
            "A busy hotel needs a receptionist who can start next week and already knows the booking system. A current housekeeper has done relief reception cover for six months and understands the system.",
          question: "Which recruitment route is most appropriate?",
          options: [
            "External recruitment through a national newspaper",
            "Internal recruitment of the existing housekeeper",
            "Use a head-hunting agency for a senior manager",
          ],
          correctIndex: 1,
          explanation:
            "Internal recruitment is quicker, cheaper and the candidate is already known to the hotel. She has relevant system experience and can start soon.",
          modelAnswer:
            "The hotel should recruit internally. The housekeeper already knows the booking system, has relevant cover experience and can start quickly, reducing induction time and cost. External advertising would take longer and bring an unknown candidate.",
        },
      },
      {
        id: "2.2",
        sectionCode: "2",
        chapter: "Book Ch 6",
        syllabusCodes: ["2.2"],
        title: "Organisation, leadership & workforce change",
        objective:
          "Interpret organisational structures, compare leadership styles and assess downsizing and trade-union roles.",
        minutes: 15,
        concepts: [
          {
            id: "2.2-c1",
            lead: "Functional areas",
            text: "Most businesses organise work into [[operations]], [[marketing]], [[finance]] and [[human resources]]. Clear functional areas improve coordination but can create departmental silos.",
          },
          {
            id: "2.2-c2",
            lead: "Hierarchy",
            text: "A [[tall structure]] has many levels and a narrow [[span of control]]; a [[flat structure]] has fewer levels and a wider span. The [[chain of command]] shows who reports to whom.",
          },
          {
            id: "2.2-c3",
            lead: "Flexible working",
            text: "[[Part-time work]] and [[flexible hours]] can cut costs and widen the labour pool, but may complicate scheduling and communication. Full-time staff often provide continuity.",
          },
          {
            id: "2.2-c4",
            lead: "Management and delegation",
            text: "Managers plan, organise, coordinate, command and control. [[Delegation]] passes authority to subordinates while [[responsibility]] remains with the manager; it develops staff but can cause [[inconsistency]].",
          },
          {
            id: "2.2-c5",
            lead: "Leadership styles",
            text: "[[Autocratic leaders]] decide alone; [[democratic leaders]] consult; [[laissez-faire leaders]] leave decisions to capable staff. The best style depends on urgency, risk and workforce skill.",
          },
          {
            id: "2.2-c6",
            lead: "Downsizing and trade unions",
            text: "[[Downsizing]] cuts staff numbers, often through [[redundancy]]. A [[trade union]] bargains collectively over pay and conditions and can take industrial action.",
            note: "Redundancy is not the same as dismissal: a redundancy arises when a job is no longer needed.",
          },
        ],
        examTip:
          "For leadership-style questions, link the style to the situation: a crisis often needs autocratic speed; skilled professionals may thrive under laissez-faire.",
        practice: {
          commandWord: "Recommend",
          scenario:
            "A factory faces a sudden fire-safety hazard and must evacuate all staff immediately. The workforce is new and unsure of the procedure.",
          question: "Which leadership style is most suitable for this situation?",
          options: [
            "Laissez-faire, so staff can decide for themselves",
            "Democratic, so everyone can debate the options",
            "Autocratic, so instructions are clear and immediate",
          ],
          correctIndex: 2,
          explanation:
            "A safety emergency requires quick, unambiguous decisions and clear instructions. Autocratic leadership is appropriate; consulting or leaving staff to decide could delay evacuation.",
          modelAnswer:
            "An autocratic style is best. Clear, immediate instructions reduce confusion and protect safety. Democratic or laissez-faire approaches may work for routine decisions but are unsafe when speed and compliance are essential.",
        },
      },
      {
        id: "2.3",
        sectionCode: "2",
        chapter: "Book Ch 7",
        syllabusCodes: ["2.3"],
        title: "Communication that gets the message across",
        objective:
          "Compare communication methods and explain how communication barriers can be reduced.",
        minutes: 11,
        concepts: [
          {
            id: "2.3-c1",
            lead: "Why communication matters",
            text: "Effective communication ensures instructions are understood, decisions are implemented and [[customer service]] is consistent. Poor communication causes [[errors]], conflict and [[wasted resources]].",
          },
          {
            id: "2.3-c2",
            lead: "Internal and external",
            text: "[[Internal communication]] is between people inside the business; [[external communication]] reaches customers, suppliers, investors and the public. The audience and purpose should shape the [[medium]].",
          },
          {
            id: "2.3-c3",
            lead: "Methods",
            text: "Meetings, [[email]], text messages, social media, phone calls, letters, posters and noticeboards differ in speed, cost, reach and [[written record]].",
          },
          {
            id: "2.3-c4",
            lead: "Barriers",
            text: "Barriers include [[unclear language]], information overload, the wrong choice of medium, noise, poor attitudes and [[cultural differences]].",
          },
          {
            id: "2.3-c5",
            lead: "Removing barriers",
            text: "Use plain language, choose the right channel, reduce [[information overload]], encourage [[feedback]] and check that the receiver understands.",
          },
        ],
        examTip:
          "A 4-mark 'explain' on communication needs a method plus its advantage or disadvantage in context, not just a list of apps.",
        practice: {
          commandWord: "Recommend",
          scenario:
            "A supermarket manager discovers a broken freezer at 6 p.m. Stock worth thousands of dollars could spoil overnight. The store closes at 9 p.m. and staff are on the shop floor.",
          question: "Which method is best for alerting staff quickly?",
          options: [
            "Post a notice on the staff noticeboard for next week",
            "Send a short text message and make a brief face-to-face announcement",
            "Write a detailed letter to each employee's home",
          ],
          correctIndex: 1,
          explanation:
            "The message is urgent and simple. A text plus face-to-face announcement reaches staff immediately; a noticeboard may be missed and a letter is far too slow.",
          modelAnswer:
            "Use a short text message backed up by a face-to-face briefing. Both are immediate and allow confirmation that the message has been received. The noticeboard and letter would not reach staff in time to save the stock.",
        },
      },
      {
        id: "2.4",
        sectionCode: "2",
        chapter: "Book Ch 8",
        syllabusCodes: ["2.4"],
        title: "Motivation: theory and practice",
        objective:
          "Explain why motivation matters and recommend financial or non-financial methods for a given workforce.",
        minutes: 14,
        concepts: [
          {
            id: "2.4-c1",
            lead: "Why people work",
            text: "People work for [[income]], [[security]], social contact, status and personal fulfilment. A motivated workforce is more productive, takes less time off and is more willing to accept [[change]].",
          },
          {
            id: "2.4-c2",
            lead: "Maslow's hierarchy",
            text: "[[Maslow's hierarchy]] runs from [[physiological needs]] through safety, social, [[esteem]] and [[self-actualisation]]. Businesses can meet needs at each level, but the order is not rigid.",
          },
          {
            id: "2.4-c3",
            lead: "Taylor and Herzberg",
            text: "[[Taylor]] linked pay to output through [[piece rates]]. [[Herzberg]] separated [[hygiene factors]] (pay, conditions) from [[motivators]] (achievement, responsibility, recognition).",
          },
          {
            id: "2.4-c4",
            lead: "Financial methods",
            text: "Financial rewards include time rates, piece rates, salaries, [[bonuses]], [[commission]], profit sharing and [[fringe benefits]]. They can boost effort but may not create lasting commitment.",
          },
          {
            id: "2.4-c5",
            lead: "Non-financial methods",
            text: "Non-financial methods include [[job enrichment]], [[job rotation]], training, promotion, praise and employee-of-the-month schemes. They can build responsibility and recognition at low cost.",
          },
        ],
        examTip:
          "For a 'recommend' question, choose one method and justify it against the job and the evidence. Repetitive work often suits job rotation or enrichment, not just more money.",
        practice: {
          commandWord: "Recommend",
          scenario:
            "Workers on a car assembly line repeat the same task every 45 seconds. They complain of boredom, high absenteeism and little pride in the finished car.",
          question: "Which non-financial method best addresses the root cause?",
          options: [
            "Increase the hourly time rate",
            "Introduce job rotation and give teams responsibility for checking their own work",
            "Increase the annual bonus",
          ],
          correctIndex: 1,
          explanation:
            "The problem is monotony and low responsibility. Job rotation adds variety, while ownership of quality builds responsibility and pride. Extra pay alone does not make the task less repetitive.",
          modelAnswer:
            "Introduce job rotation plus team responsibility for quality checks. This reduces boredom, adds variety and gives workers ownership of the finished car. Higher pay or bonuses may reduce dissatisfaction temporarily but do not enrich the work itself.",
        },
      },
    ],
  },
  {
    code: "3",
    title: "Marketing",
    shortTitle: "Marketing",
    description:
      "Markets, research, the marketing mix, ecommerce, strategy and legal controls.",
    lessons: [
      {
        id: "3.1",
        sectionCode: "3",
        chapter: "Book Ch 9",
        syllabusCodes: ["3.1"],
        title: "Marketing, markets & segmentation",
        objective:
          "Explain the role of marketing, calculate market share and evaluate mass, niche and segmented markets.",
        minutes: 12,
        concepts: [
          {
            id: "3.1-c1",
            lead: "Role of marketing",
            text: "Marketing identifies and satisfies [[customer needs]], builds [[customer loyalty]] and [[relationships]], and anticipates changes in what customers want.",
          },
          {
            id: "3.1-c2",
            lead: "Changing markets",
            text: "Spending patterns shift with [[income]], age, [[technology]], fashion and the [[economic climate]]. More competitors may force businesses to differentiate or lower prices.",
          },
          {
            id: "3.1-c3",
            lead: "Market share",
            text: "[[Market share]] = [[sales revenue]] of the business ÷ total market sales revenue × 100. It shows [[competitive strength]] but not necessarily profitability.",
          },
          {
            id: "3.1-c4",
            lead: "Mass versus niche markets",
            text: "A [[mass market]] sells to a large audience with high volume and economies of scale. A [[niche market]] targets a small, specialised segment with less competition but limited volume.",
          },
          {
            id: "3.1-c5",
            lead: "Segmentation",
            text: "Markets can be segmented by [[age]], [[income]], [[location]], [[gender]] and [[lifestyle]]. Segmentation improves targeting but can raise research and production costs.",
          },
        ],
        examTip:
          "Market share is based on sales revenue, not profit or number of customers. Show the formula before substituting figures.",
        practice: {
          commandWord: "Calculate",
          scenario:
            "Global sales in the market for reusable water bottles are $12 million. PureFlow's sales revenue is $2.4 million.",
          question: "What is PureFlow's market share?",
          options: ["5%", "20%", "38%"],
          correctIndex: 1,
          explanation:
            "Market share = ($2.4m ÷ $12m) × 100 = 20%. The other options confuse or combine the figures incorrectly.",
          modelAnswer:
            "Market share = sales revenue of the business ÷ total market sales revenue × 100 = $2.4m ÷ $12m × 100 = 20%.",
        },
      },
      {
        id: "3.2",
        sectionCode: "3",
        chapter: "Book Ch 10",
        syllabusCodes: ["3.2"],
        title: "Market research: ask before you launch",
        objective:
          "Compare primary and secondary research and judge how sampling affects accuracy.",
        minutes: 12,
        concepts: [
          {
            id: "3.2-c1",
            lead: "Why research?",
            text: "Market research reduces the risk of launching a product customers do not want. It can identify [[customer needs]], estimate [[demand]], test prices and monitor competitors.",
          },
          {
            id: "3.2-c2",
            lead: "Primary research",
            text: "Primary research collects new data through [[questionnaires]], interviews, [[focus groups]] and observation. It is specific and current but can be expensive and biased.",
          },
          {
            id: "3.2-c3",
            lead: "Sampling",
            text: "A [[sample]] is a group drawn from the [[target population]]. A larger, more [[representative sample]] improves reliability; a biased sample can make results misleading.",
          },
          {
            id: "3.2-c4",
            lead: "Secondary research",
            text: "Secondary research uses existing data such as [[competitor websites]], [[government statistics]], [[market reports]] and trade magazines. It is often quicker and cheaper but may be [[outdated]] or not specific.",
          },
          {
            id: "3.2-c5",
            lead: "Accuracy",
            text: "Accuracy depends on [[sample size]], [[sample bias]], question wording, timing and the age of the data. [[Leading questions]] can distort responses.",
          },
        ],
        examTip:
          "For a recommendation, match the method to the decision: a focus group is useful for detailed reactions, while a large survey is better for measuring a market.",
        practice: {
          commandWord: "Recommend",
          scenario:
            "A café owner wants detailed reactions to three new menu concepts, including why customers prefer one dish over another. The budget is modest and the café has loyal regulars.",
          question: "Which research method is most suitable?",
          options: [
            "A government report on national café spending",
            "A focus group of selected regular customers",
            "A few chats with friends of the owner",
          ],
          correctIndex: 1,
          explanation:
            "A focus group provides detailed discussion and reasons, using a small group of relevant customers at moderate cost. A national report lacks local detail, and friends may be biased.",
          modelAnswer:
            "Use a focus group of regular customers. It gives detailed, exploratory feedback on the three concepts and the reasons behind preferences at a modest cost. A national report is too general and close friends may not represent the target market.",
        },
      },
      {
        id: "3.3",
        sectionCode: "3",
        chapter: "Book Ch 11–15",
        syllabusCodes: ["3.3"],
        title: "The marketing mix: product, price, place & promotion",
        objective:
          "Apply the four Ps and ecommerce to a product decision, and evaluate extension and pricing strategies.",
        minutes: 16,
        concepts: [
          {
            id: "3.3-c1",
            lead: "Product",
            text: "[[Brand image]] and [[packaging]] shape perceptions and can support a higher price. The [[product life cycle]] moves through introduction, growth, maturity and decline.",
          },
          {
            id: "3.3-c2",
            lead: "Extension strategies",
            text: "At maturity, businesses can find new [[markets]], new uses, adapt the product or packaging, or increase [[advertising]] and sales promotion.",
          },
          {
            id: "3.3-c3",
            lead: "Price",
            text: "Common methods are [[cost-plus]], competitive, [[penetration]] (low launch price), [[skimming]] (high initial price) and [[dynamic pricing]].",
          },
          {
            id: "3.3-c4",
            lead: "Place",
            text: "Distribution can be direct, through [[retailers]], [[wholesalers]] or [[agents]]. Each choice affects reach, cost and control over the customer experience.",
          },
          {
            id: "3.3-c5",
            lead: "Promotion and ecommerce",
            text: "[[Sales promotion]] uses vouchers, competitions and special offers; advertising uses social media, email, leaflets and billboards. [[Ecommerce]] widens reach but adds delivery, returns and security costs.",
          },
        ],
        examTip:
          "The 4 Ps must fit together. A premium product with a penetration price or a budget image can confuse customers.",
        practice: {
          commandWord: "Recommend",
          scenario:
            "A small technology firm is launching a new smartwatch with unique health sensors. It wants to recover development costs quickly and position the product as premium.",
          question: "Which pricing method best fits the launch?",
          options: [
            "Penetration pricing",
            "Price skimming",
            "Cost-plus pricing based only on materials",
          ],
          correctIndex: 1,
          explanation:
            "Skimming sets a high initial price to capture customers willing to pay for innovation and recovers development costs. Penetration would signal a budget launch; cost-plus ignores perceived value.",
          modelAnswer:
            "Use price skimming. A high launch price suits the innovative, premium positioning and helps recover development costs before competitors enter. Penetration pricing would undermine the premium image.",
        },
      },
      {
        id: "3.4",
        sectionCode: "3",
        chapter: "Book Ch 16",
        syllabusCodes: ["3.3.6", "3.3.7", "3.4"],
        title: "Strategy, new markets & legal controls",
        objective:
          "Evaluate a coherent marketing mix, entering a new country, and the effects of legal controls on marketing.",
        minutes: 12,
        concepts: [
          {
            id: "3.4-c1",
            lead: "A coherent mix",
            text: "A successful [[marketing strategy]] aligns product, price, place and promotion with the chosen [[segment]] and brand position. Each element should reinforce the others.",
          },
          {
            id: "3.4-c2",
            lead: "Entering new countries",
            text: "International expansion can increase [[sales]] and spread [[risk]], but may face [[cultural differences]], legal requirements, tariffs and unfamiliar competition.",
          },
          {
            id: "3.4-c3",
            lead: "Legal controls",
            text: "Consumer law protects customers from [[misleading promotion]] and [[faulty goods]]. Businesses must keep claims accurate, handle complaints and meet safety and returns rules.",
          },
          {
            id: "3.4-c4",
            lead: "Effects of regulation",
            text: "Legal controls can raise [[costs]] and slow campaigns, but clear rules build [[trust]] and protect reputable businesses from unfair competitors.",
          },
        ],
        examTip:
          "In an evaluate question, give both sides and then decide. Legal controls are not only costs: they can strengthen trust and reduce returns.",
        practice: {
          commandWord: "Explain",
          scenario:
            "A supplement company advertises that its vitamin drink 'guarantees perfect health' and 'cures tiredness in one day'. It has no evidence for either claim.",
          question: "Which legal control is most directly relevant?",
          options: [
            "Rules against misleading promotion",
            "Health and safety rules for factory workers",
            "Employment discrimination law",
          ],
          correctIndex: 0,
          explanation:
            "The claims are unproven and likely to mislead customers. Consumer protection law targets misleading promotion; the other rules concern workplace safety and employment, not advertising claims.",
          modelAnswer:
            "The relevant control is consumer protection against misleading promotion. The company must not make claims it cannot substantiate, and could face penalties, forced corrections or lost trust. Health and safety and discrimination law apply to other business activities.",
        },
      },
    ],
  },
  {
    code: "4",
    title: "Operations management",
    shortTitle: "Operations",
    description:
      "Production, technology, sustainability, costs, break-even, quality and location.",
    lessons: [
      {
        id: "4.1",
        sectionCode: "4",
        chapter: "Book Ch 17",
        syllabusCodes: ["4.1"],
        title: "Production, productivity & lean operations",
        objective:
          "Calculate labour productivity, compare production methods and explain lean production and inventory decisions.",
        minutes: 14,
        concepts: [
          {
            id: "4.1-c1",
            lead: "Productivity",
            text: "[[Labour productivity]] = [[total output]] ÷ number of workers (or worker-hours). Higher productivity lowers [[unit costs]] and improves competitiveness.",
          },
          {
            id: "4.1-c2",
            lead: "Efficiency",
            text: "Efficiency means producing more from the same resources. It can improve through [[automation]], better training, improved layout and reduced [[waste]].",
          },
          {
            id: "4.1-c3",
            lead: "Job, batch and flow production",
            text: "[[Job production]] makes one bespoke item at a time; [[batch production]] makes groups of identical items; [[flow production]] uses a continuous line for large volumes.",
          },
          {
            id: "4.1-c4",
            lead: "Lean production",
            text: "[[Just-in-time (JIT)]] orders stock to arrive when needed, reducing storage but raising supply risk. [[Kaizen]] is continuous improvement driven by workers.",
          },
          {
            id: "4.1-c5",
            lead: "Inventory",
            text: "Businesses hold [[inventory]] to meet demand, protect against delays and benefit from bulk buying. Too much ties up [[working capital]]; too little risks stockouts.",
          },
        ],
        examTip:
          "For production-method questions, use the product's characteristics: uniqueness points to job, low volume/variety to batch, mass demand to flow.",
        practice: {
          commandWord: "Calculate",
          scenario:
            "A furniture factory produces 12,000 chairs in a month with 40 production workers.",
          question: "What is labour productivity per worker for the month?",
          options: ["300 chairs", "480 chairs", "12,040 chairs"],
          correctIndex: 0,
          explanation:
            "Labour productivity = total output ÷ number of workers = 12,000 ÷ 40 = 300 chairs per worker.",
          modelAnswer:
            "Labour productivity = 12,000 chairs ÷ 40 workers = 300 chairs per worker for the month. If output rises without adding workers, productivity increases.",
        },
      },
      {
        id: "4.2",
        sectionCode: "4",
        chapter: "Book Ch 18–19",
        syllabusCodes: ["4.2", "4.3"],
        title: "Technology & sustainable production",
        objective:
          "Assess the effects of automation and evaluate sustainable production methods.",
        minutes: 13,
        concepts: [
          {
            id: "4.2-c1",
            lead: "Automation and CAM",
            text: "[[Automation]] uses machinery with minimal human intervention; [[CAM]] uses computers to control machines. [[3D printing]] builds products layer by layer from digital designs.",
          },
          {
            id: "4.2-c2",
            lead: "Technology in services",
            text: "[[Contactless payments]], self-check-in and [[online booking]] improve speed and convenience, but depend on reliable systems and can reduce [[personal service]].",
          },
          {
            id: "4.2-c3",
            lead: "Effects of technology",
            text: "Technology can raise [[productivity]] and consistency and cut unit costs, but may displace workers, require expensive [[training]] and create [[downtime]] risk.",
          },
          {
            id: "4.2-c4",
            lead: "Sustainable production",
            text: "Businesses can use [[renewable energy]], reduce waste, reuse and recycle materials, and develop [[eco-friendly packaging]] and products.",
          },
          {
            id: "4.2-c5",
            lead: "Why sustainability?",
            text: "Sustainability can cut long-run [[costs]], satisfy customers and regulations, and build [[reputation]]. It may require upfront investment and higher material prices.",
          },
        ],
        examTip:
          "Technology questions often ask about both the business and employees. Separate the effects on costs/output from the effects on jobs/skills.",
        practice: {
          commandWord: "Explain",
          scenario:
            "A clothing factory installs automated cutting machines. Output rises by 30%, but 15 cutting staff are retrained for other roles and two leave the business.",
          question: "Which statement best explains the likely effect on the business?",
          options: [
            "Productivity should rise and unit costs may fall, but the firm must manage training and employee concerns",
            "Automation guarantees lower total costs with no drawbacks",
            "The only effect is that all employees lose their jobs",
          ],
          correctIndex: 0,
          explanation:
            "Automation can raise output per worker and cut unit costs, but it requires retraining, may cause job insecurity and can disrupt production during installation.",
          modelAnswer:
            "Automation should raise labour productivity and lower unit costs as output increases, but the business must invest in training and manage staff concerns about job security. It does not automatically guarantee lower total costs.",
        },
      },
      {
        id: "4.3",
        sectionCode: "4",
        chapter: "Book Ch 20",
        syllabusCodes: ["4.4"],
        title: "Costs, economies of scale & break-even",
        objective:
          "Classify costs, apply economies of scale and calculate break-even output and margin of safety.",
        minutes: 15,
        concepts: [
          {
            id: "4.3-c1",
            lead: "Cost classification",
            text: "[[Fixed costs]] do not change with output; [[variable costs]] rise with each unit; [[total cost]] = fixed + variable; [[average cost]] = total cost ÷ output.",
          },
          {
            id: "4.3-c2",
            lead: "Economies of scale",
            text: "Falling average costs as output rises include [[purchasing]], marketing, financial, managerial and [[technical economies]]. Beyond a point, [[diseconomies]] such as poor communication may appear.",
          },
          {
            id: "4.3-c3",
            lead: "Break-even",
            text: "[[Break-even output]] = [[fixed costs]] ÷ (selling price − variable cost per unit). At break-even, [[total revenue]] equals total cost and profit is zero.",
          },
          {
            id: "4.3-c4",
            lead: "Margin of safety",
            text: "[[Margin of safety]] = [[actual output]] − break-even output. It shows how far sales can fall before a [[loss]] is made.",
          },
          {
            id: "4.3-c5",
            lead: "Limitations",
            text: "Break-even analysis assumes [[constant prices]] and costs, one product and [[known demand]]. It is a planning aid, not a guarantee of [[profit]].",
          },
        ],
        examTip:
          "Show the formula, then substitute. Keep units consistent, and remember that contribution per unit is selling price minus variable cost per unit.",
        practice: {
          commandWord: "Calculate",
          scenario:
            "A workshop has fixed costs of $18,000. Each product sells for $30 and has variable costs of $18.",
          question: "What is the break-even output?",
          options: ["600 units", "1,000 units", "1,500 units"],
          correctIndex: 2,
          explanation:
            "Contribution per unit = $30 − $18 = $12. Break-even = $18,000 ÷ $12 = 1,500 units.",
          modelAnswer:
            "Break-even output = fixed costs ÷ (selling price − variable cost per unit) = $18,000 ÷ ($30 − $18) = $18,000 ÷ $12 = 1,500 units.",
        },
      },
      {
        id: "4.4",
        sectionCode: "4",
        chapter: "Book Ch 21–22",
        syllabusCodes: ["4.5", "4.6"],
        title: "Quality & location decisions",
        objective:
          "Compare quality control and quality assurance, and recommend a location using relevant factors.",
        minutes: 12,
        concepts: [
          {
            id: "4.4-c1",
            lead: "Why quality matters",
            text: "Quality means meeting customer expectations consistently. It builds [[reputation]], encourages repeat purchase, reduces [[returns]] and can justify a higher price.",
          },
          {
            id: "4.4-c2",
            lead: "Quality control",
            text: "[[Quality control]] inspects output at the end of production and rejects defects. It catches problems but can create [[waste]] and does not prevent them.",
          },
          {
            id: "4.4-c3",
            lead: "Quality assurance",
            text: "[[Quality assurance]] builds quality into every stage through standards, training and worker responsibility. It prevents defects but needs a supportive [[quality culture]].",
          },
          {
            id: "4.4-c4",
            lead: "Location: manufacturing",
            text: "Manufacturers weigh proximity to [[raw materials]], transport, labour, power, land and [[competitors]]. Government grants and taxes can also matter.",
          },
          {
            id: "4.4-c5",
            lead: "Location: services",
            text: "Service businesses focus on [[customers]], footfall, accessibility, competition, staff availability and technology. International location adds [[exchange rates]] and legal differences.",
          },
        ],
        examTip:
          "Location questions require a trade-off. A cheap site may be far from customers, raising transport costs and reducing convenience.",
        practice: {
          commandWord: "Identify",
          scenario:
            "A bakery checks a sample of loaves at the end of each shift and removes any that are underweight. Managers are considering a system where every worker checks quality at each stage.",
          question: "Which change is being proposed?",
          options: [
            "From quality control to quality assurance",
            "From quality assurance to quality control",
            "From quality control to quality control",
          ],
          correctIndex: 0,
          explanation:
            "End-of-line inspection is quality control. Building checks into every stage and giving workers responsibility is quality assurance, which aims to prevent defects rather than detect them.",
          modelAnswer:
            "The bakery is moving from quality control to quality assurance. The current end-of-line sampling detects defects; a stage-by-stage system with worker responsibility aims to prevent them.",
        },
      },
    ],
  },
  {
    code: "5",
    title: "Financial information and decisions",
    shortTitle: "Finance",
    description:
      "Finance needs and sources, cash flow, profit and loss, financial position and ratio analysis.",
    lessons: [
      {
        id: "5.1",
        sectionCode: "5",
        chapter: "Book Ch 23",
        syllabusCodes: ["5.1"],
        title: "Business finance: needs & sources",
        objective:
          "Match short- and long-term finance needs to suitable internal and external sources.",
        minutes: 15,
        concepts: [
          {
            id: "5.1-c1",
            lead: "Why finance is needed",
            text: "Businesses need finance for [[start-up capital]], expansion, replacing [[non-current assets]], new technology and [[working capital]].",
          },
          {
            id: "5.1-c2",
            lead: "Short versus long term",
            text: "Short-term needs include [[stock]] and monthly bills; long-term needs include [[machinery]], buildings and major expansion. The [[time period]] must match the source.",
          },
          {
            id: "5.1-c3",
            lead: "Internal sources",
            text: "[[Owners' investment]], [[retained profit]], sale of unwanted assets and working capital are internal sources. They avoid interest but may be limited or reduce liquidity.",
          },
          {
            id: "5.1-c4",
            lead: "External sources",
            text: "External sources include [[share capital]], venture capital, [[overdrafts]], leasing, hire purchase, bank loans, [[trade credit]], grants and crowdfunding.",
          },
          {
            id: "5.1-c5",
            lead: "Choosing a source",
            text: "Consider [[business size]], [[legal form]], amount, duration, existing loans, cost and purpose. A small sole trader may struggle to issue shares or obtain a large [[unsecured loan]].",
          },
        ],
        examTip:
          "Match the source to the purpose and duration. An overdraft funds a temporary cash gap; it is not suitable for a ten-year factory expansion.",
        practice: {
          commandWord: "Recommend",
          scenario:
            "A small sole trader needs $8,000 for extra stock before the holiday season. The stock will be sold within three months, and the owner wants flexibility to repay early.",
          question: "Which source is most suitable?",
          options: [
            "A bank overdraft",
            "Issuing shares to the public",
            "A ten-year bank loan secured on the shop",
          ],
          correctIndex: 0,
          explanation:
            "An overdraft is short-term, flexible and appropriate for a temporary stock gap. A sole trader cannot issue shares to the public; a long-term secured loan is costly and unnecessary.",
          modelAnswer:
            "Use a bank overdraft. It matches the three-month stock cycle, can be repaid early and provides flexibility. A public share issue is unavailable to a sole trader, and a ten-year loan ties the business to unnecessary long-term interest.",
        },
      },
      {
        id: "5.2",
        sectionCode: "5",
        chapter: "Book Ch 24",
        syllabusCodes: ["5.2"],
        title: "Cash flow forecasts & working capital",
        objective:
          "Distinguish cash from profit, complete cash-flow calculations and recommend remedies for a cash shortage.",
        minutes: 14,
        concepts: [
          {
            id: "5.2-c1",
            lead: "Cash versus profit",
            text: "[[Cash]] is money available now; [[profit]] is revenue minus costs over a period. A profitable business can still fail if cash is tied up in stock or [[receivables]].",
          },
          {
            id: "5.2-c2",
            lead: "Forecast features",
            text: "A cash-flow forecast records [[cash inflows]], [[cash outflows]], [[net cash flow]] and opening and closing balances, usually month by month.",
          },
          {
            id: "5.2-c3",
            lead: "Balances",
            text: "[[Net cash flow]] = inflows − outflows. [[Closing balance]] = opening balance + net cash flow. A negative closing balance signals a cash shortfall.",
          },
          {
            id: "5.2-c4",
            lead: "Remedies",
            text: "Short-term fixes include an [[overdraft]], [[delaying supplier payments]], asking customers to pay sooner, and delaying [[non-current asset]] purchases. These can harm relationships or growth.",
          },
          {
            id: "5.2-c5",
            lead: "Working capital",
            text: "[[Working capital]] = [[current assets]] − [[current liabilities]]. It funds day-to-day operations; too little risks insolvency, too much may be inefficient.",
          },
        ],
        examTip:
          "A cash-flow forecast is not a profit forecast. Show opening balance plus net cash flow to obtain the closing balance.",
        practice: {
          commandWord: "Calculate",
          scenario:
            "A business starts the month with a cash balance of $5,000. Cash inflows are $12,000 and cash outflows are $14,500.",
          question: "What is the closing balance?",
          options: ["$2,500", "$7,500", "$1,500"],
          correctIndex: 0,
          explanation:
            "Net cash flow = $12,000 − $14,500 = −$2,500. Closing balance = $5,000 + (−$2,500) = $2,500.",
          modelAnswer:
            "Net cash flow = cash inflows − cash outflows = $12,000 − $14,500 = −$2,500. Closing balance = opening balance + net cash flow = $5,000 − $2,500 = $2,500.",
        },
      },
      {
        id: "5.3",
        sectionCode: "5",
        chapter: "Book Ch 25",
        syllabusCodes: ["5.3"],
        title: "Profit, loss & the income statement",
        objective:
          "Explain why profit matters and calculate gross profit and profit from a statement of profit or loss.",
        minutes: 13,
        concepts: [
          {
            id: "5.3-c1",
            lead: "Why profit matters",
            text: "Profit rewards [[risk-taking]], provides [[retained profit]] for growth, measures success and attracts [[investors]] and lenders.",
          },
          {
            id: "5.3-c2",
            lead: "Statement of profit or loss",
            text: "The statement shows [[revenue]], [[cost of sales]], [[gross profit]], expenses and [[profit]]. It covers a period, unlike the statement of financial position.",
          },
          {
            id: "5.3-c3",
            lead: "Gross profit",
            text: "[[Gross profit]] = [[revenue]] − [[cost of sales]]. It shows the margin earned before operating expenses.",
          },
          {
            id: "5.3-c4",
            lead: "Profit",
            text: "[[Profit]] = [[gross profit]] − [[expenses]]. It is the bottom line available for owners, tax and retained earnings.",
          },
          {
            id: "5.3-c5",
            lead: "Using the statement",
            text: "Comparing years or product lines can reveal rising costs, [[pricing problems]] or weak [[expenses]] control. Profit alone does not show [[cash]] or assets.",
          },
        ],
        examTip:
          "Do not mix up revenue and profit. Revenue is total sales income; profit is what remains after costs. Show the calculation in two steps.",
        practice: {
          commandWord: "Calculate",
          scenario:
            "A retailer has revenue of $80,000, cost of sales of $45,000 and operating expenses of $22,000.",
          question: "What is the profit for the period?",
          options: ["$13,000", "$35,000", "$57,000"],
          correctIndex: 0,
          explanation:
            "Gross profit = $80,000 − $45,000 = $35,000. Profit = $35,000 − $22,000 = $13,000.",
          modelAnswer:
            "Gross profit = revenue − cost of sales = $80,000 − $45,000 = $35,000. Profit = gross profit − expenses = $35,000 − $22,000 = $13,000.",
        },
      },
      {
        id: "5.4",
        sectionCode: "5",
        chapter: "Book Ch 26–27",
        syllabusCodes: ["5.4", "5.5"],
        title: "Financial position & ratio analysis",
        objective:
          "Interpret a statement of financial position and calculate profitability and liquidity ratios.",
        minutes: 16,
        concepts: [
          {
            id: "5.4-c1",
            lead: "Statement of financial position",
            text: "It lists [[non-current assets]], [[current assets]], current and non-current [[liabilities]] and capital at a point in time.",
          },
          {
            id: "5.4-c2",
            lead: "Working capital and capital employed",
            text: "[[Working capital]] = current assets − current liabilities. [[Capital employed]] = total assets − current liabilities (or equity + non-current liabilities).",
          },
          {
            id: "5.4-c3",
            lead: "Profitability ratios",
            text: "[[Gross profit margin]] = gross profit ÷ revenue × 100; [[profit margin]] = profit ÷ revenue × 100; [[ROCE]] = operating profit ÷ capital employed × 100.",
          },
          {
            id: "5.4-c4",
            lead: "Liquidity ratios",
            text: "[[Current ratio]] = current assets ÷ current liabilities; [[acid test]] = (current assets − inventory) ÷ current liabilities. A low ratio signals liquidity risk.",
          },
          {
            id: "5.4-c5",
            lead: "Users and limitations",
            text: "Owners, managers, employees, lenders, suppliers and government use accounts. Comparisons are limited by different [[accounting policies]], [[historic cost]] and [[non-financial factors]].",
          },
        ],
        examTip:
          "For ratio questions, state the formula, calculate to two decimal places or a percentage, then interpret what the result means.",
        practice: {
          commandWord: "Calculate",
          scenario:
            "A business has current assets of $60,000 (including $20,000 inventory) and current liabilities of $30,000.",
          question: "What is the current ratio?",
          options: ["1.33 : 1", "2.00 : 1", "3.00 : 1"],
          correctIndex: 1,
          explanation:
            "Current ratio = current assets ÷ current liabilities = $60,000 ÷ $30,000 = 2.00 : 1. The acid-test ratio would be ($60,000 − $20,000) ÷ $30,000 = 1.33 : 1.",
          modelAnswer:
            "Current ratio = current assets ÷ current liabilities = $60,000 ÷ $30,000 = 2.0 : 1. The business has $2 of current assets for every $1 of current liabilities. The acid-test ratio is 1.33 : 1.",
        },
      },
    ],
  },
  {
    code: "6",
    title: "External influences on business activity",
    shortTitle: "External influences",
    description:
      "The economy, globalisation, exchange rates, the environment, ethics and pressure groups.",
    lessons: [
      {
        id: "6.1",
        sectionCode: "6",
        chapter: "Book Ch 28",
        syllabusCodes: ["6.1"],
        title: "Economic issues & government policy",
        objective:
          "Explain how the business cycle, inflation, employment and government policy affect business decisions.",
        minutes: 14,
        concepts: [
          {
            id: "6.1-c1",
            lead: "The business cycle",
            text: "The cycle moves through [[growth]], [[boom]], [[recession]] and [[slump]]. Demand, unemployment and confidence change at each stage.",
          },
          {
            id: "6.1-c2",
            lead: "Inflation and employment",
            text: "[[Inflation]] raises costs and can reduce purchasing power. High [[employment]] supports demand but may push wages up; unemployment weakens demand.",
          },
          {
            id: "6.1-c3",
            lead: "Taxes and spending",
            text: "Higher [[corporation tax]] reduces retained profit; higher [[income tax]] may reduce consumer spending. Government spending can create demand or competition for resources.",
          },
          {
            id: "6.1-c4",
            lead: "Interest rates",
            text: "Higher [[interest rates]] raise borrowing costs and can reduce demand; lower rates may stimulate spending and investment. Businesses can adjust [[stock]], prices and investment plans.",
          },
          {
            id: "6.1-c5",
            lead: "Responding to a downturn",
            text: "Firms may cut costs, delay expansion, [[change product mix]], [[negotiate supplier terms]] or target different segments during a [[downturn]].",
          },
        ],
        examTip:
          "Link the policy to the business through a chain: interest rate ↑ → loan repayments ↑ → profit ↓ → investment delayed.",
        practice: {
          commandWord: "Explain",
          scenario:
            "Country X enters a recession. Unemployment is rising, consumer confidence is low and interest rates remain high. A furniture retailer is deciding how to respond.",
          question: "Which response is most likely to protect cash flow?",
          options: [
            "Buy more inventory in anticipation of higher sales",
            "Delay store expansion and reduce discretionary costs",
            "Increase prices sharply to raise revenue",
          ],
          correctIndex: 1,
          explanation:
            "In a recession, demand is weak and cash is vulnerable. Delaying expansion and cutting discretionary costs protects cash. Stockpiling risks unsold inventory, and sharp price rises may reduce sales further.",
          modelAnswer:
            "Delay expansion and reduce discretionary costs. Demand is falling, so preserving cash is more important than growth. Stockpiling increases warehousing and obsolescence risk, while price rises may deter price-sensitive customers.",
        },
      },
      {
        id: "6.2",
        sectionCode: "6",
        chapter: "Book Ch 29",
        syllabusCodes: ["6.2"],
        title: "Globalisation, trade & exchange rates",
        objective:
          "Evaluate globalisation, trade barriers and exchange-rate movements for importing and exporting businesses.",
        minutes: 15,
        concepts: [
          {
            id: "6.2-c1",
            lead: "Globalisation",
            text: "[[Globalisation]] is the growing integration of world markets through transport, technology, free trade and [[multinational companies]]. It opens markets but increases competition.",
          },
          {
            id: "6.2-c2",
            lead: "Tariffs and quotas",
            text: "An import [[tariff]] is a tax on imports; an import [[quota]] limits their quantity. Both raise costs or restrict choice for importing businesses and can protect domestic producers.",
          },
          {
            id: "6.2-c3",
            lead: "Multinational companies",
            text: "[[Multinational companies]] operate in more than one country. Host countries gain jobs, investment, exports and choice, but may face [[profit repatriation]], environmental damage and pressure on local firms.",
          },
          {
            id: "6.2-c4",
            lead: "External costs and benefits",
            text: "[[External costs]] are third-party harms such as pollution; [[external benefits]] are third-party gains such as training or infrastructure. They are not included in the firm's own costs.",
          },
          {
            id: "6.2-c5",
            lead: "Exchange rates",
            text: "[[Appreciation]] makes exports dearer and imports cheaper. [[Depreciation]] makes exports cheaper and imports dearer. The effect depends on whether the firm buys or sells abroad.",
          },
        ],
        examTip:
          "Trace the exchange-rate effect through price and demand. A stronger currency is not automatically good or bad — it depends on the firm's imports and exports.",
        practice: {
          commandWord: "Explain",
          scenario:
            "A coffee roaster imports green beans from Brazil and sells most of its coffee domestically. The domestic currency appreciates against the Brazilian real.",
          question: "What is the most likely effect?",
          options: [
            "Import costs fall, potentially improving the roaster's margins",
            "Export prices rise, reducing foreign sales",
            "Imported beans become more expensive",
          ],
          correctIndex: 0,
          explanation:
            "Appreciation makes the domestic currency stronger, so imports become cheaper. The roaster's bean costs should fall. Export prices would rise in foreign currency, but it sells mostly domestically.",
          modelAnswer:
            "The appreciation makes imports cheaper. The roaster needs fewer domestic dollars to buy the same Brazilian beans, which can lower costs and improve margins if prices are held. It would make exports dearer, but the business sells mainly at home.",
        },
      },
      {
        id: "6.3",
        sectionCode: "6",
        chapter: "Book Ch 30",
        syllabusCodes: ["6.3"],
        title: "Business & the environment",
        objective:
          "Explain environmental impacts and evaluate business responses and legal controls.",
        minutes: 12,
        concepts: [
          {
            id: "6.3-c1",
            lead: "Environmental damage",
            text: "Business activity can cause [[pollution]], use up [[natural resources]], create waste and damage habitats. These are often [[external costs]] borne by society.",
          },
          {
            id: "6.3-c2",
            lead: "Why respond",
            text: "Firms may act to protect [[reputation]], meet customer expectations, comply with law and reduce long-term [[costs]] through energy efficiency.",
          },
          {
            id: "6.3-c3",
            lead: "How to respond",
            text: "Options include [[renewable energy]], reducing waste, [[reusing and recycling]], designing [[eco-friendly products]] and packaging, and auditing suppliers.",
          },
          {
            id: "6.3-c4",
            lead: "Legal controls",
            text: "Environmental law can control what is produced, how and where it is produced, and may impose [[fines]] or [[compliance costs]]. Benefits include cleaner outcomes and a level playing field.",
          },
        ],
        examTip:
          "Distinguish private costs (paid by the firm) from external costs (borne by society). A factory's clean-up equipment is a private cost; river pollution is an external cost.",
        practice: {
          commandWord: "Identify",
          scenario:
            "A textile factory discharges untreated dye into a river. Local residents lose access to clean water, and the business pays nothing for the damage.",
          question: "What is this an example of?",
          options: ["An external cost", "An internal economy of scale", "A fringe benefit"],
          correctIndex: 0,
          explanation:
            "The pollution harms third parties and is not paid for by the factory, so it is an external cost. Economies of scale and fringe benefits are unrelated.",
          modelAnswer:
            "The pollution is an external cost: it imposes a cost on local residents that is not reflected in the factory's private costs. Regulation could force the firm to internalise that cost through treatment or fines.",
        },
      },
      {
        id: "6.4",
        sectionCode: "6",
        chapter: "Book Ch 31",
        syllabusCodes: ["6.4", "6.5"],
        title: "Ethics, responsibility & pressure groups",
        objective:
          "Evaluate ethical business behaviour and explain how pressure groups influence decisions.",
        minutes: 13,
        concepts: [
          {
            id: "6.4-c1",
            lead: "Ethical issues",
            text: "Ethical concerns include [[child labour]], [[fair wages]], fair prices to suppliers, [[animal welfare]] and using suppliers that damage the environment.",
          },
          {
            id: "6.4-c2",
            lead: "Responding ethically",
            text: "Businesses can set a [[code of conduct]], audit suppliers, pay [[fair wages]] and source certified materials. These actions may raise costs and reduce flexibility.",
          },
          {
            id: "6.4-c3",
            lead: "Advantages and disadvantages",
            text: "Ethical behaviour can improve [[reputation]], attract customers and employees, and reduce [[legal risk]], but may increase costs and put the firm at a short-term [[price disadvantage]].",
          },
          {
            id: "6.4-c4",
            lead: "Pressure groups",
            text: "[[Pressure groups]] influence business through campaigns, media coverage, [[boycotts]], lobbying and legal action. They can change buying behaviour, investor confidence and regulation.",
          },
          {
            id: "6.4-c5",
            lead: "Business response",
            text: "Firms may engage with pressure groups, publish [[transparent reports]], [[change suppliers]] or challenge claims. Ignoring legitimate concerns can escalate [[reputational damage]].",
          },
        ],
        examTip:
          "Pressure groups are not all the same: some seek publicity and boycotts; others lobby governments or provide evidence. Match the method to the group's aims.",
        practice: {
          commandWord: "Explain",
          scenario:
            "An environmental group publishes a video showing plastic waste from a sportswear brand's supplier entering a river. The video is widely shared, and customers begin posting about boycotting the brand.",
          question: "Which pressure-group tactic is being used?",
          options: [
            "Lobbying government ministers",
            "Media campaigning to damage the brand's reputation and trigger a consumer boycott",
            "Offering the business a government grant",
          ],
          correctIndex: 1,
          explanation:
            "Publishing evidence and using social media to mobilise consumers is a media campaign, with a boycott as a follow-on tactic. Lobbying targets politicians, and grants are government support, not pressure-group action.",
          modelAnswer:
            "The group is using a media campaign. By publicising supplier pollution and encouraging consumers to boycott the brand, it seeks reputational and commercial pressure. Lobbying would target policymakers, not customers.",
        },
      },
    ],
  },
];

export const ALL_LESSONS: InteractiveLesson[] = LESSON_SECTIONS.flatMap(
  (section) => section.lessons,
);

export const TOTAL_LESSONS = ALL_LESSONS.length;

export function getLessonById(lessonId: string): InteractiveLesson | undefined {
  return ALL_LESSONS.find((lesson) => lesson.id === lessonId);
}

export function getSectionByCode(
  sectionCode: LessonSectionCode,
): LessonSection | undefined {
  return LESSON_SECTIONS.find((section) => section.code === sectionCode);
}

export function getSectionForLesson(
  lesson: InteractiveLesson,
): LessonSection | undefined {
  return getSectionByCode(lesson.sectionCode);
}
