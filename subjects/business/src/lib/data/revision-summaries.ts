import type { CompareNote } from "./compare-notes";

export interface RevisionSummary {
  section: CompareNote["section"];
  topic: string;
  title: string;
  points: string[];
}

export const REVISION_SUMMARIES: RevisionSummary[] = [
  {
    section: "1",
    topic: "1.1",
    title: "Business activity",
    points: [
      "Businesses combine land, labour, capital and enterprise to produce goods and services.",
      "Resources are scarce, so choosing one use means giving up the next best alternative: opportunity cost.",
      "Added value is the difference between the selling price and the cost of bought-in materials. It can be increased by branding, quality, convenience or design.",
      "Specialisation can raise output, but work may become boring and the process depends on each specialist.",
    ],
  },
  {
    section: "1",
    topic: "1.2",
    title: "Economic sectors",
    points: [
      "The primary sector extracts natural resources, the secondary sector manufactures, and the tertiary sector provides services.",
      "Private-sector firms are owned by individuals and usually aim at profit.",
      "Public-sector organisations are owned by the government and often supply essential services.",
      "As countries develop, employment often moves from primary towards secondary and then tertiary activity.",
    ],
  },
  {
    section: "1",
    topic: "1.3",
    title: "Enterprise, growth and size",
    points: [
      "An entrepreneur organises resources, takes risks and makes decisions in the hope of profit.",
      "A business plan sets out the idea, market, costs and finance, and helps when asking for a loan.",
      "Size can be measured by the number of employees, the value of output or sales, or the amount of capital employed. No single measure suits every firm.",
      "Internal growth expands the existing business. External growth is a merger or takeover.",
      "Horizontal integration joins firms at the same stage. Vertical integration joins firms at different stages of the same industry.",
      "Growth can bring higher profit, status and lower average costs, but also management problems, finance problems and loss of control.",
      "Some owners stay small to keep control, avoid risk, or because the market is a niche.",
      "Businesses fail because of poor management, lack of cash, a product customers do not want, or stronger competition.",
    ],
  },
  {
    section: "1",
    topic: "1.4",
    title: "Types of business organisation",
    points: [
      "A sole trader is easy to start and the owner keeps control and all the profit, but has unlimited liability and limited capital.",
      "A partnership brings more capital and skills. Partners usually still have unlimited liability and must share profit.",
      "A private limited company has limited liability and a separate legal identity. Shares are sold privately and accounts are filed.",
      "A public limited company can sell shares to the public. It can raise more capital, but accounts are public and the original owners may lose control.",
      "A franchise lets someone trade under an existing brand. The franchisee pays fees and follows the franchisor’s rules.",
      "A joint venture is a shared project. The businesses stay separate and share costs, risks and profit.",
      "A social enterprise trades in order to meet a social aim as well as cover its costs.",
    ],
  },
  {
    section: "1",
    topic: "1.5",
    title: "Business and stakeholder objectives",
    points: [
      "Common objectives are survival, profit, growth and a larger market share.",
      "Objectives can change as the business grows or as the economy changes.",
      "Stakeholders include owners, workers, customers, suppliers, lenders, the government and the local community.",
      "Their aims often conflict. A decision that raises wages or cuts prices can reduce profit for owners.",
    ],
  },
  {
    section: "2",
    topic: "2.1",
    title: "Human resource management",
    points: [
      "Recruitment starts with a job description and a person specification, then an advertisement, applications and selection.",
      "Internal recruitment is quicker and the person is known. External recruitment brings a wider choice and new ideas.",
      "In a given situation, recommend the person who best matches the job and the business facts, and justify that choice.",
      "An employment contract sets out duties, hours, pay, holiday and sick pay. It protects both sides.",
      "Legal controls cover unfair dismissal, discrimination, health and safety and a minimum wage. They protect workers and raise employers’ costs.",
      "Induction introduces the job. On-the-job training is cheaper and specific. Off-the-job training uses specialists but costs more.",
    ],
  },
  {
    section: "2",
    topic: "2.2",
    title: "Organisation and management",
    points: [
      "The main functional areas are operations, marketing, finance and human resources.",
      "A tall structure has many levels and a narrow span of control. A flat structure has fewer levels and a wider span.",
      "Part-time staff give flexibility. Full-time staff give a more stable, committed workforce.",
      "Delegation passes authority. The manager keeps responsibility.",
      "Autocratic leaders decide alone. Democratic leaders consult. Laissez-faire leaders leave skilled staff to decide.",
      "The suitable style depends on the task, the staff and how quickly a decision is needed.",
      "Downsizing reduces the workforce. Redundancy ends jobs that are no longer needed.",
      "A trade union bargains for members on pay and conditions. Industrial action can stop production.",
    ],
  },
  {
    section: "2",
    topic: "2.3",
    title: "Communication",
    points: [
      "Effective communication means the message is received, understood and acted on.",
      "Methods include meetings, telephone, email, letters, notices and social media. Each has a different speed, record and cost.",
      "Choose the method that fits the message: how urgent it is, how many people, and whether a written record is needed.",
      "Barriers include unclear language, the wrong medium, too much information, and a poor attitude from sender or receiver.",
    ],
  },
  {
    section: "2",
    topic: "2.4",
    title: "Motivation",
    points: [
      "A well-motivated workforce is more productive, stays longer and produces better quality.",
      "Financial methods include time rate, piece rate, salary, bonus, commission, profit sharing and fringe benefits.",
      "Non-financial methods include job rotation, job enrichment, training, promotion, praise and recognition.",
      "Taylor linked pay to output. Maslow ranked needs from safety up to self-actualisation. Herzberg separated hygiene factors from motivators.",
      "Recommend a method that fits the workers and the problem in the case, such as low output or high labour turnover.",
    ],
  },
  {
    section: "3",
    topic: "3.1",
    title: "Marketing and the market",
    points: [
      "Marketing identifies, anticipates and satisfies customer needs at a profit.",
      "Markets change with income, tastes, population, competition and technology.",
      "A mass market is large and standard. A niche market is a small group with specific needs.",
      "Segmentation splits a market by age, income, location, gender or lifestyle so the mix can be aimed more closely.",
    ],
  },
  {
    section: "3",
    topic: "3.2",
    title: "Market research",
    points: [
      "Research reduces the risk of producing a product customers will not buy.",
      "Primary research is collected for this purpose: questionnaires, interviews, focus groups and observation.",
      "Secondary research uses data that already exists. It is quicker and cheaper, but it may be out of date or collected for another reason.",
      "A sample stands for the whole market. A biased or too-small sample gives misleading results.",
    ],
  },
  {
    section: "3",
    topic: "3.3",
    title: "Marketing mix",
    points: [
      "The mix is product, price, place and promotion. It should fit the target customers.",
      "Brand and packaging help customers recognise the product and can add value.",
      "New products spread risk but cost money to develop. The product life cycle runs from introduction to decline.",
      "Extension strategies try to keep sales going, for example a new use, a new market or a changed design.",
      "Pricing methods include cost-plus, competitive, penetration, skimming and dynamic pricing.",
      "Channels run from selling direct, through retailers or wholesalers, to using agents.",
      "Promotion includes advertising and sales promotion. Ecommerce changes both place and promotion.",
      "Selling in another country can grow sales, but tastes, laws and costs differ.",
    ],
  },
  {
    section: "3",
    topic: "3.4",
    title: "Legal controls on marketing",
    points: [
      "Laws stop misleading advertising, unsafe products and unfair weights or labels.",
      "They protect customers and raise the costs of firms that must check claims and quality.",
      "A firm that breaks the rules risks fines, returned goods and a damaged reputation.",
    ],
  },
  {
    section: "4",
    topic: "4.1",
    title: "Production of goods and services",
    points: [
      "Job production makes one item to order. Batch production makes a group, then changes. Flow production makes a standard product continuously.",
      "The method depends on the size of demand, whether customers want variety, and how much capital the firm can spend.",
      "Lean production cuts waste. Just-in-time holds little stock. Kaizen uses small ongoing improvements.",
      "Holding inventory avoids lost sales, but it ties up cash and can become obsolete.",
    ],
  },
  {
    section: "4",
    topic: "4.2",
    title: "Technology in production",
    points: [
      "New technology can raise output, improve quality and cut unit cost.",
      "It needs capital, and workers may need retraining or may be made redundant.",
      "The gain depends on whether demand is high enough to use the equipment.",
    ],
  },
  {
    section: "4",
    topic: "4.3",
    title: "Sustainable production",
    points: [
      "Sustainable methods use fewer resources, create less waste and pollute less.",
      "They can cut waste costs and improve reputation.",
      "Cleaner materials, energy and processes often cost more at the start.",
    ],
  },
  {
    section: "4",
    topic: "4.4",
    title: "Costs, scale and break-even",
    points: [
      "Fixed costs do not change with output. Variable costs do. Total cost is the two added together.",
      "Economies of scale lower average cost as the firm grows. Diseconomies raise it, often through poor communication and control.",
      "Break-even output is where total revenue equals total cost. Below it the firm makes a loss. Above it, a profit.",
      "The margin of safety is actual output minus break-even output. Forecasts and costs can change, so the chart is only a guide.",
    ],
  },
  {
    section: "4",
    topic: "4.5",
    title: "Quality",
    points: [
      "Quality matters because faults cause returns, complaints and lost repeat sales.",
      "Quality control inspects the product, often at the end. Faulty goods may already have been made.",
      "Quality assurance builds checks into the process so faults are prevented. It needs training and commitment.",
      "Choose the approach that fits the cost of a fault and the skill of the workforce.",
    ],
  },
  {
    section: "4",
    topic: "4.6",
    title: "Location",
    points: [
      "A factory location is affected by raw materials, labour, transport, power, the market and government incentives.",
      "A shop or service is affected more by passing customers, rent and nearby competitors.",
      "Locating in another country can cut costs or open a market, but laws, culture and management become harder.",
    ],
  },
  {
    section: "5",
    topic: "5.1",
    title: "Sources of finance",
    points: [
      "Internal finance includes owners’ capital, retained profit, selling unwanted assets and reducing inventory or receivables.",
      "External finance includes shares, venture capital, overdrafts, loans, leasing, hire purchase, trade credit, grants and crowdfunding.",
      "The suitable source depends on the amount, how long it is needed, the cost, and whether the owners will give up control.",
      "Short-term needs suit trade credit or an overdraft. A long-term asset suits a loan, hire purchase, leasing or share capital.",
    ],
  },
  {
    section: "5",
    topic: "5.2",
    title: "Cash flow",
    points: [
      "Profit is not the same as cash. A profitable firm can still run out of cash.",
      "A cash-flow forecast shows expected inflows, outflows and the closing balance each month.",
      "A negative closing balance warns the firm to arrange finance before the shortage happens.",
      "Cash can be improved by collecting receivables sooner, delaying payables, or delaying the purchase of non-current assets.",
    ],
  },
  {
    section: "5",
    topic: "5.3",
    title: "Profit and the income statement",
    points: [
      "Profit is revenue minus costs. Gross profit is revenue minus the cost of sales.",
      "Profit for the year also deducts expenses such as wages, rent and interest.",
      "The statement of profit or loss shows these figures for a period.",
      "Profit can be retained or paid to owners. Retained profit is a source of finance.",
    ],
  },
  {
    section: "5",
    topic: "5.4",
    title: "Statement of financial position",
    points: [
      "It shows what the business owns and owes on one date.",
      "Assets equal equity plus liabilities.",
      "Non-current assets are kept for more than a year. Current assets include inventory, receivables and cash.",
      "Non-current liabilities are long-term debts. Current liabilities are due within a year.",
    ],
  },
  {
    section: "5",
    topic: "5.5",
    title: "Analysis of accounts",
    points: [
      "Gross profit margin and profit margin show profit as a percentage of revenue.",
      "Return on capital employed shows profit compared with the long-term capital used in the business.",
      "The current ratio and acid test ratio show whether current liabilities can be paid. The acid test leaves out inventory.",
      "One ratio, or one year, is not enough. Compare with earlier years and with similar firms, and remember accounts can be out of date.",
    ],
  },
  {
    section: "6",
    topic: "6.1",
    title: "Economic issues",
    points: [
      "The business cycle moves through growth, boom, recession and slump. Sales and unemployment change at each stage.",
      "Inflation raises costs and can cut the value of savings. Unemployment cuts demand for many products.",
      "Governments aim at growth, low inflation, low unemployment and a stable balance of payments.",
      "Higher income tax or higher interest rates leave customers with less to spend. Lower taxes or lower interest rates can raise demand.",
      "A business must link the change to its own sales, costs and borrowing.",
    ],
  },
  {
    section: "6",
    topic: "6.2",
    title: "Globalisation and international trade",
    points: [
      "Globalisation means firms buy, produce and sell across more countries.",
      "Tariffs raise the price of imports. Quotas limit the quantity. Both protect home firms and reduce customer choice.",
      "A multinational produces in more than one country. The host country may gain jobs and investment, and may lose if profits leave or local firms are squeezed.",
      "External costs, such as pollution, fall on people outside the firm. External benefits, such as training, help people outside the firm.",
      "An appreciation makes imports cheaper and exports dearer. A depreciation does the opposite.",
    ],
  },
  {
    section: "6",
    topic: "6.3",
    title: "Environmental issues",
    points: [
      "Business activity can create external costs such as pollution, and external benefits such as jobs and training.",
      "Pressure from customers, laws and costs can push a firm to waste less and pollute less.",
      "Cleaner methods can raise costs, and not every customer will pay more for them.",
    ],
  },
  {
    section: "6",
    topic: "6.4",
    title: "Ethical issues",
    points: [
      "Ethical issues include child labour, unfair pay, unfair prices to suppliers, and damage caused by suppliers.",
      "An ethical response can keep customers and workers loyal and avoid bad publicity.",
      "It usually costs more than the cheapest option.",
    ],
  },
  {
    section: "6",
    topic: "6.5",
    title: "Pressure groups",
    points: [
      "Pressure groups try to change business behaviour through publicity, protests and boycotts.",
      "A firm may change because the cost of lost sales is greater than the cost of meeting the demand.",
      "The group does not control the firm, and its campaign may continue even after a change.",
    ],
  },
];
