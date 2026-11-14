export interface CompareNote {
  id: string;
  section: "1" | "2" | "3" | "4" | "5" | "6";
  topic: string;
  name: string;
  purpose: string[];
  advantages: string[];
  disadvantages: string[];
  /** Exam use, such as how to recommend and justify a choice. */
  uses?: string[];
}

function n(
  section: CompareNote["section"],
  topic: string,
  name: string,
  purpose: string[],
  advantages: string[],
  disadvantages: string[],
  uses?: string[],
): CompareNote {
  const id = `${topic}-${name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return { id, section, topic, name, purpose, advantages, disadvantages, uses };
}

export const COMPARE_SECTION_LABELS: Record<CompareNote["section"], string> = {
  "1": "Understanding business activity",
  "2": "People in business",
  "3": "Marketing",
  "4": "Operations management",
  "5": "Financial information and decisions",
  "6": "External influences on business activity",
};

export const COMPARE_NOTES: CompareNote[] = [
  n("1", "1.1", "Adding value", [
    "Widen the gap between the **selling price** and the cost of bought-in materials.",
    "Give customers a reason to pay more than the cost of the inputs.",
  ], [
    "A higher price can increase **profit** on each unit sold.",
    "Branding, design, quality or convenience can build **customer loyalty**.",
    "The business is less forced to compete only by cutting **price**.",
  ], [
    "The extra feature, service or packaging **costs money**.",
    "Customers may refuse the higher price if rivals offer similar **value**.",
    "Added value is not the same as **profit**, because other costs still have to be paid.",
  ]),
  n("1", "1.1", "Opportunity cost", [
    "Measure what is **given up** when one choice is made instead of the next best choice.",
    "Help owners compare uses of limited **resources**.",
  ], [
    "Decisions are clearer because the real **sacrifice** is identified.",
    "It stops a business spending scarce money on a weaker **option**.",
    "It applies to time and labour as well as **cash**.",
  ], [
    "The next best alternative is not always easy to **measure**.",
    "Estimates of the forgone benefit can be **wrong**.",
    "It does not by itself say which option customers will **buy**.",
  ]),
  n("1", "1.2", "Private sector", [
    "Show ownership by **private individuals**, usually aiming to make a profit.",
    "Distinguish these firms from organisations owned by the **government**.",
  ], [
    "Owners keep the **profit** and can decide quickly.",
    "Competition pushes firms to control **costs** and improve products.",
    "Owners have a direct reason to satisfy **customers**.",
  ], [
    "Unprofitable but useful services may **not** be provided.",
    "Owners may ignore costs imposed on **others**, such as pollution.",
    "Failure can leave workers and customers without that **service**.",
  ]),
  n("1", "1.2", "Public sector", [
    "Show ownership or control by the **government**.",
    "Supply services the community needs, such as parts of health, education or transport.",
  ], [
    "Essential services can continue even when they do not make a **profit**.",
    "Government can set standards that protect **consumers**.",
    "Large projects can create **jobs** and infrastructure.",
  ], [
    "There may be less pressure to cut **waste** if there is no competition.",
    "Decisions can be slow and affected by **politics**.",
    "Losses are often paid by **taxpayers**.",
  ]),
  n("1", "1.3", "Business plan", [
    "Set out **objectives**, the market, resources, finance, people and operations.",
    "Show lenders that the start-up has been thought through.",
  ], [
    "Risks are spotted before large sums are **spent**.",
    "Banks are more willing to lend against a clear **cash** plan.",
    "Later results can be checked against the **targets**.",
  ], [
    "A useful plan takes **time** and may need paid advice.",
    "Forecasts of sales and costs can be **wrong**.",
    "The plan stops helping if it is never **updated**.",
  ]),
  n("1", "1.3", "Government support for start-ups", [
    "Help new firms with **grants**, advice, training or low-cost loans.",
    "Encourage jobs and new **enterprise**.",
  ], [
    "Grants do not always have to be **repaid**.",
    "Advice and training reduce basic **mistakes**.",
    "Cheaper loans make the first equipment more **affordable**.",
  ], [
    "Support often comes with **conditions**, such as where the firm locates.",
    "The amount may be too **small** to fund the whole start-up.",
    "Applications take time and can be **refused**.",
  ]),
  n("1", "1.3", "Measuring business size", [
    "Compare firms using employees, **value or volume of output**, or **capital employed**.",
    "Profit is **not** a method of measuring size.",
  ], [
    "Employee numbers are easy to **obtain** and compare.",
    "Value of sales shows the size of the **market** served.",
    "Capital employed shows the scale of **assets** used.",
  ], [
    "A firm with few workers can still have high **sales** if it uses machines.",
    "High sales value may only reflect high **prices**, not a large output.",
    "Different measures can rank the same firms in a **different** order.",
  ]),
  n("1", "1.3", "Internal growth", [
    "Expand using the firm’s **own** resources, such as new products or new markets.",
    "Grow while the existing owners keep **control**.",
  ], [
    "Control is not shared with another **business**.",
    "Growth can be steady enough for staff to **adapt**.",
    "The firm keeps its own way of **working**.",
  ], [
    "It is often **slower** than buying another firm.",
    "It needs enough **profit** or finance.",
    "A rival may reach the market **first**.",
  ]),
  n("1", "1.3", "External growth by merger or takeover", [
    "Join with, or buy, **another business**.",
    "A **merger** is agreed. A **takeover** is when one firm buys control of another.",
  ], [
    "Market share and customers can increase **immediately**.",
    "The larger firm may gain **economies of scale**.",
    "Buying a firm in another market can spread **risk**.",
  ], [
    "The purchase price can be high and may need **borrowed** money.",
    "Managers and systems may **clash**.",
    "Overlapping jobs may lead to **redundancy**.",
  ]),
  n("1", "1.3", "Horizontal integration", [
    "Join with a firm at the **same stage** of production in the same industry.",
    "Increase size within the market the firm already **knows**.",
  ], [
    "**Market share** rises and power over suppliers can increase.",
    "Duplicate managers, depots or advertising can be **cut**.",
    "The industry is already understood, so the join is easier to **run**.",
  ], [
    "Authorities may block a deal that reduces **choice**.",
    "The two firms may have different **cultures**.",
    "The business is still exposed to a downturn in **one** industry.",
  ]),
  n("1", "1.3", "Vertical integration", [
    "Join with a firm at a **different stage** of the same industry.",
    "**Backward** integration buys a supplier. **Forward** integration buys a business closer to the customer.",
  ], [
    "Backward integration makes **supply** more reliable and can cut input cost.",
    "Forward integration secures **outlets** and information about customers.",
    "Profit that used to be taken by the supplier or retailer can be **kept**.",
  ], [
    "The new stage may need **skills** the firm does not have.",
    "Other retailers may stop stocking a product if the producer is now a **rival**.",
    "Buying the other firm ties up a large amount of **capital**.",
  ]),
  n("1", "1.3", "Problems of business growth", [
    "Explain the costs and control problems that appear as a firm gets **larger**.",
    "Show why growth does not automatically raise **profit**.",
  ], [
    "Spotting the problems early lets managers improve **communication**.",
    "Slower growth can avoid a **cash** crisis.",
    "Owners can decide that staying a manageable size protects **service**.",
  ], [
    "More layers make messages **slower** and easier to distort.",
    "Fast expansion can run out of **cash**.",
    "Workers may feel less loyal, which is a **diseconomy of scale**.",
  ]),
  n("1", "1.3", "Remaining small", [
    "Keep the business at a size the owner can **control** personally.",
    "Suit a small **market** that does not need mass production.",
  ], [
    "Decisions are **fast** and the owner knows customers.",
    "Overheads stay lower and service can stay **personal**.",
    "The owner keeps independence without the stress of a large **workforce**.",
  ], [
    "**Unit cost** may stay high because economies of scale are missed.",
    "Raising large amounts of **finance** is harder.",
    "A larger rival may undercut on **price**.",
  ]),
  n("1", "1.3", "Why businesses succeed or fail", [
    "Link results to management skill, **finance**, product suitability and demand.",
    "Also include the state of the **economy** and the level of competition.",
  ], [
    "Suitable products and enough finance let the firm meet **demand**.",
    "Skilled managers can change plans when the **economy** changes.",
    "Knowing the competition helps the firm keep **customers**.",
  ], [
    "Poor management or a lack of **finance** can stop a good idea.",
    "A product customers do not want will not **sell**.",
    "A recession or stronger rivals can cut **sales** even if the firm is well run.",
  ]),
  n("1", "1.4", "Sole trader", [
    "One person **owns and controls** an unincorporated business.",
    "A simple way to start trading.",
  ], [
    "There are few legal rules, so it is cheap and quick to **set up**.",
    "The owner keeps all the **profit** and has complete control of decisions.",
    "The owner can choose working **hours** and keep a close link with customers.",
    "Accounts stay **private**, apart from the tax authority.",
  ], [
    "The owner usually has **unlimited liability** for the business’s debts.",
    "Capital is limited to the owner’s **savings** and what lenders will provide.",
    "The business often lacks **continuity** if the owner is ill, retires or dies.",
    "One person may not have every **skill**, and there is nobody to share the workload or discuss problems with.",
  ]),
  n("1", "1.4", "Partnership", [
    "Two or more people own the business and usually agree how **profit** and work are shared.",
    "Combine capital and **skills**.",
  ], [
    "More owners bring extra **capital** and a wider range of skills.",
    "Losses, decisions and the **workload** are shared.",
    "Partners can cover for each other during **absence**.",
    "Accounts normally stay **private**.",
  ], [
    "Partners usually have **unlimited liability**, including for another partner’s debts.",
    "Disagreements slow decisions, and one partner’s mistakes bind the **others**.",
    "Profit must be **shared**.",
    "The partnership may end if a partner **leaves** or dies, unless an agreement says otherwise.",
  ]),
  n("1", "1.4", "Private limited company", [
    "A separate legal business whose **shares** are sold privately.",
    "Give owners **limited liability** while control stays with invited shareholders.",
  ], [
    "Shareholders have **limited liability**: they risk only the money they invested.",
    "The company is a separate **legal** body, so it continues if an owner dies.",
    "Selling shares to family or friends raises more **capital** than a sole trader usually can.",
    "The original owners can keep **control** if they keep most of the shares.",
  ], [
    "It costs more to set up, and accounts must be sent to the **authorities**.",
    "Shares cannot be advertised and sold freely to the **public**, so they are harder to sell.",
    "Profit paid as **dividends** is shared with the other shareholders.",
    "Legal rules on directors and records take **time** to follow.",
  ]),
  n("1", "1.4", "Public limited company", [
    "Offer **shares to the public**, often on a stock exchange.",
    "Raise very large amounts of **capital**.",
  ], [
    "Selling shares to the **public** can raise very large amounts of capital.",
    "**Limited liability** makes people more willing to buy the shares.",
    "A stock-exchange listing can raise the firm’s **status** with banks and suppliers.",
    "Existing shareholders can sell their shares more **easily**.",
  ], [
    "Issuing shares and meeting stock-exchange rules is **expensive**.",
    "Accounts are **public**, so rivals can see the results.",
    "The original owners can lose **control** if many new shares are sold.",
    "Directors may aim at a short-term **share price** rather than long-term growth.",
  ]),
  n("1", "1.4", "Franchise for the franchisee", [
    "Trade under an existing firm’s **brand** and methods in return for fees.",
    "Start with a **proven** business idea.",
  ], [
    "The brand, product and methods are already **known**, so the chance of failure is lower.",
    "The franchisor often provides **training**, advice and national advertising.",
    "Supplies may be cheaper because the franchisor buys in **bulk**.",
    "Lenders are often more willing to **lend** to a known brand.",
  ], [
    "An initial fee and an ongoing share of **revenue** must be paid.",
    "The franchisee has less freedom over **products**, prices and the way the outlet is run.",
    "A weak outlet or bad news about the brand can cut this outlet’s **sales**.",
    "The agreement may stop the franchisee selling the outlet freely or opening a **rival** business.",
  ]),
  n("1", "1.4", "Franchise for the franchisor", [
    "Expand the brand by letting others run **outlets**.",
    "Grow without paying for every new **shop**.",
  ], [
    "Expansion is faster because franchisees provide much of the **capital**.",
    "The franchisor receives fees and a share of each outlet’s **sales**.",
    "Franchisees work hard because their own **profit** depends on the outlet.",
    "The franchisor does not have the day-to-day **management** of every shop.",
  ], [
    "A weak franchisee can harm the whole **brand**.",
    "The franchisor keeps less of each outlet’s **profit** than if it owned the shop.",
    "Checking quality and the use of the brand takes **management** time.",
    "Franchisees may resent the rules and the share of sales they must **pay**.",
  ]),
  n("1", "1.4", "Joint venture", [
    "Two or more firms run a **shared project** while remaining separate businesses.",
    "Share the **cost**, risk and knowledge.",
  ], [
    "Each partner can supply **capital** or expertise the other lacks.",
    "Losses are **shared**.",
    "A local partner can make entry to a **foreign** market easier.",
  ], [
    "Profit is **shared**.",
    "Partners may disagree on decisions or on further **investment**.",
    "Methods or customers may leak to the **partner**.",
  ]),
  n("1", "1.4", "Social enterprise", [
    "Run a business that also pursues a **social** aim, not only profit.",
    "Use trading income to support a community or environmental **objective**.",
  ], [
    "Customers and workers who support the aim may stay **loyal**.",
    "Profit can be reinvested in the **social** goal.",
    "The enterprise can attract grants aimed at **social** projects.",
  ], [
    "The social spending can reduce the **surplus** available to grow.",
    "It must still cover **costs** or it cannot continue.",
    "Measuring the social result is harder than measuring **profit**.",
  ]),
  n("1", "1.5", "Survival", [
    "Keep the business **trading**, especially when it is new or demand is weak.",
    "Cover **cash** outflows so wages and bills can be paid.",
  ], [
    "Managers focus on **cash** when profit is not yet possible.",
    "The owners’ investment is not wiped out by **closure**.",
    "The firm gains time to build **customers**.",
  ], [
    "Prices may be set too low, so later **profit** is missed.",
    "Little is left for new **products**.",
    "Lenders may withdraw support if survival lasts without a **return**.",
  ]),
  n("1", "1.5", "Profit as an objective", [
    "Earn a surplus of **revenue over costs**.",
    "Reward risk-taking and provide finance for the **future**.",
  ], [
    "Retained profit is a source of **finance**.",
    "Investors are more willing to provide **capital**.",
    "Profit can pay for better products and **staff**.",
  ], [
    "Chasing short-term profit can damage **quality**.",
    "Higher prices may push customers to **rivals**.",
    "A profit on paper does not guarantee **cash** in the bank.",
  ]),
  n("1", "1.5", "Growth as an objective", [
    "Increase **sales**, output or the number of outlets.",
    "Gain **economies of scale** and a stronger position.",
  ], [
    "Larger output can lower **average cost**.",
    "A bigger firm may have more power over **suppliers**.",
    "Growth can create **promotion** chances.",
  ], [
    "Expansion can cause **cash-flow** problems.",
    "Control gets harder and **diseconomies of scale** may appear.",
    "Growth for its own sake can reduce **profit**.",
  ]),
  n("1", "1.5", "Market share as an objective", [
    "Raise the firm’s percentage of total **market sales**.",
    "Market share = business sales ÷ total market sales × **100**.",
  ], [
    "A larger share can increase influence over **price**.",
    "The brand becomes better **known**.",
    "Higher sales can spread **fixed costs**.",
  ], [
    "Share is often bought with lower prices or heavy **promotion**, which cuts profit at first.",
    "The figure helps little if the whole **market** is shrinking.",
    "Rivals’ sales are hard to **measure** exactly.",
  ]),
  n("1", "1.5", "Stakeholder objectives", [
    "Recognise what owners, managers, employees, customers, suppliers, lenders, government and the **local community** each want.",
    "Show where those aims **conflict**.",
  ], [
    "Meeting employee and customer aims can raise **loyalty**.",
    "Reliable payment keeps **suppliers** willing to deliver.",
    "Knowing each group’s aim helps managers explain a **decision**.",
  ], [
    "Higher wages or lower prices reduce **profit** for owners.",
    "One decision cannot satisfy every group at the **same** time.",
    "A powerful lender or large customer may force a choice others **dislike**.",
  ]),

  n("2", "2.1", "Internal recruitment", [
    "Fill a vacancy by **promoting** or transferring someone already employed.",
    "Use when the business already has a person who matches the **person specification**.",
  ], [
    "It is **quicker** and cheaper than advertising or using an agency.",
    "The person’s **reliability**, ability and attendance record are already known.",
    "The person already understands the firm’s **way of working**, so less induction is needed.",
    "Other employees can be **motivated** by seeing a real chance of promotion.",
  ], [
    "No new **ideas** or outside experience come into the business.",
    "The best person already inside the firm may still be weaker than an **external** applicant.",
    "Colleagues who were not chosen may feel **jealous**, which can hurt teamwork.",
    "Promoting someone leaves **another** vacancy that still has to be filled.",
  ]),
  n("2", "2.1", "External recruitment", [
    "Hire someone from **outside** the business.",
    "Reach applicants through advertisements, employment **agencies** or online recruitment.",
  ], [
    "There is a **wider** choice of applicants than inside one firm.",
    "The new person can bring skills, experience and **ideas** the business does not already have.",
    "The firm can hire someone who already has the required **skill**, so less training may be needed.",
    "It does not immediately leave another internal post **empty**.",
  ], [
    "Advertising, agencies and interviews cost **more** and take longer.",
    "The person’s real ability and **reliability** are less certain until they start.",
    "The new employee needs **induction** because they do not know the business.",
    "Existing staff may lose **motivation** if they expected the job themselves.",
  ]),
  n("2", "2.1", "Recommending who to employ", [
    "Choose which **applicant** should be given the job in a stated situation.",
    "Use the case facts, not a general claim that one method is always better.",
  ], [
    "A justified choice matches the **person specification**: the skills, qualifications and experience the job needs.",
    "The right person can start **sooner** or at a lower recruitment cost if those facts are in the case.",
    "Hiring the stronger match protects **quality**, safety or customer service in that business.",
  ], [
    "Choosing only because someone is cheaper can leave the firm with the wrong **skill**.",
    "Ignoring staff already in the firm can damage **motivation**.",
    "A famous name or a confident interview is not enough if the person fails the **job description**.",
  ], [
    "Read the vacancy: duties, wage, and whether the skill is already inside the firm.",
    "Compare the named applicants with the **job description** and **person specification**.",
    "Give one advantage of your choice using a fact from the case, then one disadvantage of the rejected person or method.",
    "Finish with a clear recommendation and a reason tied to that business, such as cost, speed, skill or the effect on existing staff.",
  ]),
  n("2", "2.1", "Employment contract", [
    "Set out **duties**, hours, holiday entitlement and sick pay.",
    "Give both employer and employee a clear record of the **agreement**.",
  ], [
    "Employees know their **rights** and what is expected.",
    "Employers can refer to the contract in a **dispute**.",
    "Clear hours and pay reduce **misunderstandings**.",
  ], [
    "Writing and updating contracts takes **time**.",
    "A rigid contract can make changes to hours harder to **introduce**.",
    "It does not by itself guarantee that either side will **perform** well.",
  ]),
  n("2", "2.1", "Legal controls on employment", [
    "Cover **unfair dismissal**, discrimination, health and safety, and a legal **minimum wage**.",
    "Protect employees and set rules for **employers**.",
  ], [
    "Safer workplaces reduce **accidents** and absence.",
    "Fair treatment can improve **motivation** and the firm’s reputation.",
    "A minimum wage can make jobs easier to **fill**.",
  ], [
    "Higher wages and safety equipment raise **costs**.",
    "Dismissal becomes slower because a fair **process** is required.",
    "Breaking the law leads to fines, cases and bad **publicity**.",
  ]),
  n("2", "2.1", "Induction training", [
    "Introduce a new employee to the **workplace**, people, rules and job.",
    "Help the person become safe and useful **quickly**.",
  ], [
    "New staff settle **faster** and make fewer early mistakes.",
    "**Health and safety** rules and the layout of the workplace are learned before an accident.",
    "The new person meets colleagues and learns the firm’s **rules**, so they feel more confident.",
    "Fewer people **leave** in the first weeks, so the cost of recruiting them is not wasted.",
  ], [
    "Wages are paid while the new person and the trainer produce less **output**.",
    "A short or poor induction wastes the cost of **recruitment**.",
    "Too much information on the first day is soon **forgotten**.",
    "It takes managers’ **time** away from their own work.",
  ]),
  n("2", "2.1", "On-the-job training", [
    "Teach the skill **at the workplace**, often by watching an experienced worker.",
    "Train someone on the firm’s own **equipment**.",
  ], [
    "It usually costs **less** than sending people to a college.",
    "Some **output** continues while the person learns.",
    "Training uses the firm’s own **equipment** and methods.",
    "It is easy to arrange inside the normal working **day**.",
  ], [
    "The trainer’s own output **falls** while they are teaching.",
    "The trainer’s bad habits can be **copied**.",
    "Production pressure **interrupts** the training, and mistakes can spoil real work.",
    "The worker does not gain a widely recognised **qualification**.",
  ]),
  n("2", "2.1", "Off-the-job training", [
    "Teach skills **away from** the normal job, such as at a college.",
    "Use specialist trainers or a wider **course**.",
  ], [
    "Specialist trainers can teach more up-to-date **skills** than a colleague.",
    "Learning is not interrupted by that day’s **production**, and mistakes do not spoil real output.",
    "A qualification can raise **motivation** and make the firm more attractive to recruits.",
    "Several workers can learn a broader skill than the firm’s current methods **alone**.",
  ], [
    "Course fees, travel and lost working time make it **expensive**.",
    "The course may not match the firm’s exact **equipment** or methods.",
    "A newly skilled worker may leave for a **better-paid** job elsewhere.",
    "Output is lost for the whole time the employee is **away**.",
  ]),
  n("2", "2.2", "Tall organisational structure", [
    "Use many **levels** and a long chain of command.",
    "Keep each manager’s **span of control** narrow.",
  ], [
    "Fewer people report to each manager, so supervision can be **closer**.",
    "There are more steps for **promotion**.",
    "Authority at each level is clearly **defined**.",
  ], [
    "Messages pass through many levels and become **slow**.",
    "More managers mean higher **wage** costs.",
    "Junior staff have less chance to **decide**.",
  ]),
  n("2", "2.2", "Flat organisational structure", [
    "Use few levels and a **short** chain of command.",
    "Give managers a **wider** span of control.",
  ], [
    "Communication is **faster**.",
    "Fewer managers reduce **overhead** cost.",
    "Staff often have more **responsibility**.",
  ], [
    "A wide span can leave some staff poorly **supervised**.",
    "There are fewer **promotion** posts.",
    "Managers may be overloaded with **people** to control.",
  ]),
  n("2", "2.2", "Part-time employees", [
    "Employ people for fewer than the normal full **weekly hours**.",
    "Match staffing to busy **periods**.",
  ], [
    "Hours can be increased at **peak** times and reduced when the business is quiet.",
    "Two part-time workers can cover a longer **day** than one full-time worker.",
    "The jobs attract people who cannot work **full time**, such as students or people with caring duties.",
    "Wage costs are lower than employing the same number of people **full time**.",
  ], [
    "Staff may be less available when a sudden **decision** is needed.",
    "Messages and training have to reach more **people**, and some may miss them.",
    "Part-time staff may feel less **committed** and be less likely to seek promotion.",
    "They may take longer to learn the job if they work fewer **hours**.",
  ]),
  n("2", "2.2", "Full-time employees", [
    "Employ people for the normal full working **week**.",
    "Build a stable core **workforce**.",
  ], [
    "Staff are available through the working **day** and learn the business more deeply.",
    "Communication and training are simpler with a stable **team**.",
    "Full-time work often brings stronger **commitment** and a clearer path to promotion.",
    "The firm can give them more **responsibility** because they are there all week.",
  ], [
    "Wages are paid even when sales are **low**.",
    "The firm is less flexible if demand is **seasonal** or only at certain hours.",
    "Recruiting a full-time specialist costs more if only a few hours of that skill are **needed**.",
    "A full-time vacancy is harder to fill if few people want those **hours**.",
  ]),
  n("2", "2.2", "Delegation", [
    "Pass **authority** for a task to a subordinate.",
    "The manager keeps overall **responsibility**.",
  ], [
    "Managers gain time for bigger **decisions**.",
    "Workers develop **skills** and may feel trusted.",
    "Decisions can be made closer to the **work**.",
  ], [
    "The manager is still **accountable** if the task is done badly.",
    "Some managers are unwilling to give up **control**.",
    "Untrained staff can make **mistakes**.",
  ]),
  n("2", "2.2", "Autocratic leadership", [
    "The leader decides **alone** and expects orders to be followed.",
    "Use direct control when speed matters.",
  ], [
    "Decisions are **fast**, which helps in a crisis.",
    "Workers know exactly **what** to do.",
    "It can control new or unskilled **staff**.",
  ], [
    "Staff are not asked for **ideas**, so motivation may fall.",
    "All decisions depend on one **leader**.",
    "If that leader is absent, others are unused to **deciding**.",
  ]),
  n("2", "2.2", "Democratic leadership", [
    "Involve workers in **discussion** before a decision.",
    "Use two-way communication.",
  ], [
    "Staff feel valued, so **motivation** often rises.",
    "More information can improve the **decision**.",
    "People accept a change they helped to **shape**.",
  ], [
    "Consultation makes decisions **slower**.",
    "It is a poor fit when an instant **order** is needed.",
    "Some workers would rather be **told** what to do.",
  ]),
  n("2", "2.2", "Laissez-faire leadership", [
    "Leave skilled staff wide **freedom** to decide how to work.",
    "Suit trusted specialists who need little day-to-day **direction**.",
  ], [
    "Creative staff can use their own **ideas**.",
    "Skilled workers often feel **trusted**.",
    "Managers spend less time on routine **instructions**.",
  ], [
    "Work can become **inconsistent**.",
    "Some staff drift if nobody sets **deadlines**.",
    "It is unclear who is responsible for a **mistake**.",
  ]),
  n("2", "2.2", "Downsizing", [
    "Reduce the **size of the workforce**.",
    "Respond to automation, falling demand or the need to lower **costs**.",
  ], [
    "Wage costs **fall**.",
    "The firm can match staffing to a smaller **demand**.",
    "Remaining roles can be reorganised around new **technology**.",
  ], [
    "Losing experienced people reduces **skill**.",
    "Remaining staff may fear more cuts and **motivation** falls.",
    "Redundancy payments are an immediate **cost**.",
  ]),
  n("2", "2.2", "Redundancy", [
    "End jobs because the **work** is no longer needed, not because of the person’s conduct.",
    "A method used when the workforce must be **reduced**.",
  ], [
    "The business stops paying wages for work it no longer **needs**.",
    "A fair selection process can be explained to the remaining **staff**.",
    "It is different from dismissal for **misconduct**, so the reason is the job, not the person.",
  ], [
    "Payments to redundant workers cost **money**.",
    "The firm may later lack those **skills** if demand recovers.",
    "A badly explained choice of who goes damages **trust**.",
  ]),
  n("2", "2.2", "Trade union membership", [
    "Give employees an organisation that bargains on **pay** and conditions.",
    "Provide support that one worker does not have **alone**.",
  ], [
    "Collective bargaining can improve **wages** and safety.",
    "Members get advice in a **dispute**.",
    "A group is harder for an employer to **ignore**.",
  ], [
    "Members pay **subscriptions**.",
    "Industrial action can stop **pay** as well as production.",
    "Talks can be slow, and action can harm the **business** the members work for.",
  ]),
  n("2", "2.3", "Meetings", [
    "Bring people together face to face or **virtually** to share information and decide.",
    "Allow questions at the **same** time.",
  ], [
    "Several views are heard before a **decision**.",
    "Questions are settled in one **place**.",
    "Virtual meetings avoid some **travel**.",
  ], [
    "People are paid while they are not doing their normal **work**.",
    "A poorly run meeting may decide **nothing**.",
    "A virtual meeting fails if the **connection** is poor.",
  ]),
  n("2", "2.3", "Email", [
    "Send a written message quickly inside or **outside** the business.",
    "Keep a record that can be **reread**.",
  ], [
    "It arrives **fast** and can include files.",
    "The same message can go to many **people**.",
    "There is a written **record** at low cost.",
  ], [
    "Important messages are lost among too many **emails**.",
    "Tone is easy to **misunderstand**.",
    "It is useless if the person does not **read** it.",
  ]),
  n("2", "2.3", "Text messages", [
    "Send a short message to a **mobile** phone.",
    "Reach someone quickly when a long email is unnecessary.",
  ], [
    "Short updates arrive **immediately**.",
    "People often read a text sooner than an **email**.",
    "It is useful for a simple instruction or change of **time**.",
  ], [
    "There is little room for a **detailed** explanation.",
    "It is easy to miss if the phone is **off**.",
    "A short text can sound **abrupt** and be misunderstood.",
  ]),
  n("2", "2.3", "Social media for communication", [
    "Share messages with employees or customers on platforms they already **use**.",
    "Reach a group quickly outside a formal **letter**.",
  ], [
    "A post can reach many people at **low** cost.",
    "Replies show whether the message was **understood**.",
    "It suits younger customers and some **staff**.",
  ], [
    "Comments are **public** and can spread a mistake.",
    "Not every employee uses the same **platform**.",
    "It is a weak record for a formal **contract** or warning.",
  ]),
  n("2", "2.3", "Phone calls", [
    "Speak directly, including by **mobile**.",
    "Deal with a question that needs an immediate **answer**.",
  ], [
    "Feedback is **instant**.",
    "Tone of voice adds **meaning**.",
    "A mobile call reaches people away from a **desk**.",
  ], [
    "There is often **no** written record.",
    "Details of a long call are easily **forgotten**.",
    "The person may not **answer**, and a noisy place makes it hard to hear.",
  ]),
  n("2", "2.3", "Letters", [
    "Send a formal written message to someone **outside** or inside the business.",
    "Provide a document that can be **kept**.",
  ], [
    "The wording is a formal **record**.",
    "It suits contracts, complaints and official **replies**.",
    "The receiver can read it more than **once**.",
  ], [
    "Post is **slower** than email or a call.",
    "Writing a careful letter takes **time**.",
    "It may never arrive, and a reply is not **immediate**.",
  ]),
  n("2", "2.3", "Posters and noticeboards", [
    "Display a message where many employees will **see** it.",
    "Pass on rules, safety points or **events**.",
  ], [
    "One notice reaches everyone who walks **past**.",
    "The message stays visible for days.",
    "The cost is **low**.",
  ], [
    "People may **ignore** a crowded board.",
    "There is no check that the message was **understood**.",
    "A notice is a poor way to handle a **private** or urgent individual matter.",
  ]),
  n("2", "2.4", "A well-motivated workforce", [
    "Encourage employees to work towards the business **objectives**.",
    "People work for pay, security, contact with others, esteem and a sense of **achievement**.",
  ], [
    "**Labour productivity** rises.",
    "**Absenteeism** and **labour turnover** fall.",
    "Staff are more willing to accept **change** and new ways of working.",
  ], [
    "Motivation methods themselves **cost** money or management time.",
    "A pay rise alone may not motivate if the work still feels **pointless**.",
    "The benefit disappears if the method is seen as **unfair**.",
  ]),
  n("2", "2.4", "Time-based pay", [
    "Pay workers for the **time** they work.",
    "Reward attendance rather than the number of units **made**.",
  ], [
    "Pay is easy to **calculate**.",
    "Staff are not pushed to rush, so **quality** can be protected.",
    "It suits work where output is hard to **count**.",
  ], [
    "There is little reward for working **faster**.",
    "Pay continues even when output is **low**.",
    "Supervisors must still check that time is used **productively**.",
  ]),
  n("2", "2.4", "Piece rate", [
    "Pay a fixed amount for each **unit** produced.",
    "Link earnings to **output**.",
  ], [
    "Faster workers earn **more**, so output often rises.",
    "Labour cost per unit is easier to **predict**.",
    "Less pressure is needed to keep people **working**.",
  ], [
    "Quality can fall if workers **rush**.",
    "Pay drops when machines stop or materials run **out**.",
    "It does not fit jobs where output cannot be **counted**.",
  ]),
  n("2", "2.4", "Salary", [
    "Pay a **fixed** yearly amount, usually each month.",
    "Give income that does not change with weekly **output**.",
  ], [
    "Employees can plan their **spending**.",
    "The firm can budget the wage **bill**.",
    "It fits jobs judged on **responsibility**, not units made.",
  ], [
    "Extra effort is not rewarded unless a **bonus** is added.",
    "The salary is paid even in a **quiet** month.",
    "Equal salaries can feel unfair if workloads **differ**.",
  ]),
  n("2", "2.4", "Bonus", [
    "Pay extra when a **target** is met.",
    "Reward a result above the normal wage.",
  ], [
    "The target gives a clear **goal**.",
    "The extra pay is due only if the result is **achieved**.",
    "It can reward quality, attendance or **profit**, not only speed.",
  ], [
    "An unrealistic target **demotivates**.",
    "Work that is not in the target may be **ignored**.",
    "Staff argue if the bonus seems **unfair**.",
  ]),
  n("2", "2.4", "Commission", [
    "Pay a **percentage of sales** the employee achieves.",
    "Encourage selling, often on top of a basic wage.",
  ], [
    "Sellers have a direct reason to increase **revenue**.",
    "The firm pays more only when a **sale** is made.",
    "Strong sellers can be **recruited** by the chance of high earnings.",
  ], [
    "Staff may pressure customers and ignore **service**.",
    "Earnings swing in a **quiet** period.",
    "Competition between sellers can damage **teamwork**.",
  ]),
  n("2", "2.4", "Profit sharing", [
    "Give employees a **share of profit**.",
    "Connect the reward to the result of the **whole** business.",
  ], [
    "Staff may support decisions that raise **profit**.",
    "It can reduce **labour turnover**.",
    "The payment falls when profit falls, unlike a permanent wage **rise**.",
  ], [
    "One worker has little effect on total **profit**.",
    "Profit can fall for reasons outside the workers’ **control**.",
    "Owners keep less profit, and the scheme must be **administered**.",
  ]),
  n("2", "2.4", "Fringe benefits", [
    "Offer rewards besides money, such as a **company car**, discounts or health care.",
    "Make the whole reward package more **attractive**.",
  ], [
    "They help **recruit** and keep staff.",
    "Some benefits are valued more than they cost in extra **wages**.",
    "Staff discounts can also promote the firm’s **products**.",
  ], [
    "Benefits still **cost** the business.",
    "A benefit some staff cannot use may seem **unfair**.",
    "They do not replace poor **working** conditions.",
  ]),
  n("2", "2.4", "Job rotation", [
    "Move workers between tasks at a **similar** level.",
    "Reduce repetition and teach more than one **job**.",
  ], [
    "Work is more **varied**.",
    "Absence is easier to cover because staff learn several **tasks**.",
    "Workers see more of the whole **process**.",
  ], [
    "Several jobs must be **taught**, which takes time.",
    "Output may fall while a task is still **new**.",
    "The jobs may still feel basic if none adds real **responsibility**.",
  ]),
  n("2", "2.4", "Job enrichment", [
    "Add **responsibility** and more difficult decisions to a job.",
    "Let workers use more of their **ability**.",
  ], [
    "Responsibility and achievement can increase **motivation**.",
    "Skilled staff may check their own **quality**.",
    "It prepares people for **promotion**.",
  ], [
    "Not everyone wants extra **responsibility**.",
    "Training and sometimes higher pay are **needed**.",
    "Managers must be willing to give up some **control**.",
  ]),
  n("2", "2.4", "Training as motivation", [
    "Use training so employees feel the business is investing in their **skills**.",
    "Improve the ability to do the **job**.",
  ], [
    "Staff feel **valued**.",
    "Better skills can raise **productivity**.",
    "Trained staff are more willing to take on new **methods**.",
  ], [
    "Courses and lost working time **cost** money.",
    "The person may then leave for another **employer**.",
    "Training does not motivate if it is irrelevant to the **job**.",
  ]),
  n("2", "2.4", "Opportunities for promotion", [
    "Show employees a route to a **more senior** job.",
    "Reward good performance with higher status and usually higher **pay**.",
  ], [
    "Ambitious staff have a reason to stay and work **well**.",
    "The business fills senior jobs with people who already know it.",
    "Recognition meets the need for **esteem**.",
  ], [
    "Only a few posts exist, so most staff will **not** be promoted.",
    "Those who are passed over may lose **motivation**.",
    "Promoting an unready person weakens that **department**.",
  ]),
  n("2", "2.4", "Praise", [
    "Tell an employee, specifically, that the work was **good**.",
    "Give recognition without a permanent increase in **wages**.",
  ], [
    "It costs little and can be given **immediately**.",
    "Recognition increases **motivation** for many people.",
    "It shows which behaviour the business wants **repeated**.",
  ], [
    "Vague or rare praise stops being **believed**.",
    "It will not keep staff if pay is far below **rivals**.",
    "Praising one person unfairly can upset the **team**.",
  ]),
  n("2", "2.4", "Employee of the month", [
    "Give public recognition to one employee for strong **performance**.",
    "A low-cost form of **praise**.",
  ], [
    "The award is a visible **recognition**.",
    "Other staff see what standard is **rewarded**.",
    "The cost is small compared with a general pay **rise**.",
  ], [
    "Only one person wins, so others may feel **ignored**.",
    "The choice can look **unfair** if the reason is unclear.",
    "The effect fades if the same people win every **month**.",
  ]),
  n("2", "2.4", "Taylor’s theory", [
    "Treat **money** as the main motivator and find an efficient way to do each task.",
    "Support targets and **piece-rate** pay.",
  ], [
    "Clear methods can raise **output**.",
    "Pay linked to output gives a direct **incentive**.",
    "It can fit simple, repetitive **tasks**.",
  ], [
    "It ignores the need for recognition and **achievement**.",
    "Workers may dislike being told there is only one **method**.",
    "Rushing for pay can reduce **quality**.",
  ]),
  n("2", "2.4", "Maslow’s theory", [
    "Explain needs from physical survival and **safety** up to belonging, esteem and self-actualisation.",
    "Help managers match the reward to the need a worker is trying to **meet**.",
  ], [
    "It shows that **pay** is not the only motivator.",
    "Different rewards can be used for different **workers**.",
    "It supports teamwork, security and **promotion**, not only wages.",
  ], [
    "People do not always move through the needs in one **order**.",
    "A need is hard to **measure**.",
    "A pay rise will not help someone whose real need is **recognition**.",
  ]),
  n("2", "2.4", "Herzberg’s theory", [
    "Separate **hygiene** factors, which prevent dissatisfaction, from **motivators**, which create satisfaction.",
    "Hygiene includes pay and conditions. Motivators include the work itself, recognition and **achievement**.",
  ], [
    "Fixing pay alone may only stop **complaints**.",
    "Enrichment and recognition can create real **motivation**.",
    "Managers look at the **job**, not only the wage.",
  ], [
    "Some people are motivated mainly by **pay**.",
    "What counts as hygiene varies between **people**.",
    "Redesigning jobs takes **time**.",
  ]),

  n("3", "3.1", "Mass marketing", [
    "Aim one marketing mix at a **large** market.",
    "Sell a standard product in high **volume**.",
  ], [
    "High sales can bring **economies of scale**.",
    "One campaign can cover a wide **audience**.",
    "The brand can become widely **known**.",
  ], [
    "Competition and **advertising** costs are often high.",
    "The product may not fit any group **perfectly**.",
    "A change in mass taste hits a large part of **sales**.",
  ]),
  n("3", "3.1", "Niche marketing", [
    "Aim at a **small** segment with a specific need.",
    "Design the product and promotion for that **group**.",
  ], [
    "Less direct competition can support a **higher** price.",
    "A small firm can succeed without matching a giant’s **spending**.",
    "Customers often stay **loyal** if the fit is close.",
  ], [
    "The number of possible customers is **small**.",
    "Output may be too low for **economies of scale**.",
    "If that niche shrinks, there are few other **buyers**.",
  ]),
  n("3", "3.1", "Market segmentation", [
    "Split a market by **age**, income, location, gender or lifestyle.",
    "Shape the marketing mix for the chosen **group**.",
  ], [
    "Products and adverts fit the target more **closely**.",
    "Spending is not wasted on people unlikely to **buy**.",
    "Gaps in the market are easier to **see**.",
  ], [
    "Researching the segments **costs** money.",
    "Too many segments complicate **stock** and production.",
    "People do not always behave like their **segment**.",
  ]),
  n("3", "3.2", "Questionnaires and surveys", [
    "Collect **primary** data with a set of questions.",
    "Find opinions or buying habits from a **sample**.",
  ], [
    "Many people can be asked and answers turned into **percentages**.",
    "The same questions make results easier to **compare**.",
    "Online surveys can be sent widely at fairly low **cost**.",
  ], [
    "Wording can **mislead** the answer.",
    "People who reply may not represent **everyone**.",
    "What people say they will buy is not always what they **buy**.",
  ]),
  n("3", "3.2", "Interviews", [
    "Ask questions in person or by phone and **follow up** the answers.",
    "Collect detailed primary **information**.",
  ], [
    "The interviewer can **explain** a question.",
    "More detail is gathered than from tick boxes.",
    "The response rate is often higher than a posted **survey**.",
  ], [
    "Each interview is **slow** and costly.",
    "The interviewer’s tone can **lead** the answer.",
    "A few interviews may not represent the **market**.",
  ]),
  n("3", "3.2", "Focus groups", [
    "Discuss a product or advert with a **small group**.",
    "Hear reasons, not only yes or no **answers**.",
  ], [
    "The talk shows **why** people like or dislike an idea.",
    "One comment can reveal a point the firm had not **asked**.",
    "Packaging or adverts can be shown and **discussed**.",
  ], [
    "A strong personality can **dominate** the group.",
    "The group is too **small** to represent the market.",
    "Running the groups is **costly**.",
  ]),
  n("3", "3.2", "Observation", [
    "Watch what customers **do**, rather than what they say.",
    "Collect behaviour as primary **research**.",
  ], [
    "It records real **behaviour**.",
    "Customers need not be stopped and **questioned**.",
    "It can show how a shop or website is **used**.",
  ], [
    "It does not explain **why** people acted that way.",
    "Watching people raises **privacy** issues.",
    "One time of day may be **untypical**.",
  ]),
  n("3", "3.2", "Secondary research", [
    "Use data that **already exists**, such as competitor websites, government sources, market reports or trade magazines.",
    "Get background on the market without a new **survey**.",
  ], [
    "It is usually **cheaper** and faster than primary research.",
    "Government sources can cover a **large** population.",
    "Competitor websites show prices and **products** already on sale.",
  ], [
    "The data may be **out of date**.",
    "It was collected for another **purpose**.",
    "Market reports can be **expensive**, and rivals can read the same ones.",
  ]),
  n("3", "3.2", "Sampling", [
    "Question or observe a **part** of the market instead of everyone.",
    "Make research possible when the population is too **large** to ask.",
  ], [
    "It saves **time** and money.",
    "A well-chosen sample can still represent the **market**.",
    "Results can be collected quickly enough to be **useful**.",
  ], [
    "A biased sample gives a **misleading** picture.",
    "A very small sample may be **untypical**.",
    "The way people are chosen affects the **accuracy** of the data.",
  ]),
  n("3", "3.3", "Brand image", [
    "Create a **name and image** that customers recognise and trust.",
    "Distinguish the product from **rivals**.",
  ], [
    "Customers may repeat-buy without comparing every **price**.",
    "A strong image can support a **higher** price.",
    "New products under the same brand are easier to **launch**.",
  ], [
    "Building the image takes sustained **promotion**.",
    "One failure or scandal can damage the **whole** brand.",
    "The image fails if **quality** does not match it.",
  ]),
  n("3", "3.3", "Packaging", [
    "Protect the product and carry **information**.",
    "Attract attention and support the **brand**.",
  ], [
    "Protection cuts **damage** in transit and in the shop.",
    "Design can encourage a first **purchase**.",
    "Instructions and legal information are where the buyer can **see** them.",
  ], [
    "Packaging adds **cost**.",
    "Excess packaging creates **waste** and can be criticised.",
    "A cheap or confusing pack puts buyers **off**.",
  ]),
  n("3", "3.3", "Developing new products", [
    "Create products the business does not **already** sell.",
    "Respond to new customer **needs** or replace products in decline.",
  ], [
    "A successful product can open a new source of **sales**.",
    "The firm can stay ahead of **rivals**.",
    "It spreads risk if older products are losing **demand**.",
  ], [
    "Research, design and launch **cost** a lot.",
    "Many new products **fail**.",
    "The new product may take sales from the firm’s **existing** one.",
  ]),
  n("3", "3.3", "Product life cycle", [
    "Track sales through **introduction, growth, maturity and decline**.",
    "Decide how the marketing mix should change at each **stage**.",
  ], [
    "Managers can plan cash and **promotion** before each stage.",
    "It warns them to prepare an **extension strategy** or a replacement.",
    "A mix of products at different stages spreads **risk**.",
  ], [
    "The current stage is hard to know until **later**.",
    "Not every product follows the same **shape**.",
    "A product may be withdrawn too **soon** if the forecast is wrong.",
  ]),
  n("3", "3.3", "Extension strategies", [
    "Prolong sales in **maturity** or near **decline**.",
    "Examples: a **new market**, a new use, adapting the product or packaging, or more advertising and sales promotion.",
  ], [
    "Sales can continue without a completely **new** product.",
    "The existing **brand** and equipment can still be used.",
    "The cost is often lower than starting from **scratch**.",
  ], [
    "The extra sales may last only a **short** time.",
    "New packaging or advertising still **costs** money.",
    "A refreshed old product can steal sales from a **newer** one.",
  ]),
  n("3", "3.3", "Cost-plus pricing", [
    "Add a **markup** to the unit cost to set the price.",
    "Try to cover the cost of the unit and contribute to **profit**.",
  ], [
    "The method is **simple**.",
    "Each unit’s price is linked to its **cost**.",
    "The markup makes the intended margin easy to **explain**.",
  ], [
    "It ignores **competitors’** prices.",
    "It ignores what customers are **willing** to pay.",
    "A wrong cost figure produces a wrong **price**.",
  ]),
  n("3", "3.3", "Competitive pricing", [
    "Set a price **near** the prices charged by rivals.",
    "Stay in the market when products are **similar**.",
  ], [
    "The firm is less likely to lose customers on **price** alone.",
    "The main information needed is what **rivals** charge.",
    "A price just below rivals can win **share**.",
  ], [
    "A price cut by rivals can start a **price** war.",
    "The price may not cover the firm’s own **costs**.",
    "If price and product match rivals, customers may see no reason to **switch**.",
  ]),
  n("3", "3.3", "Penetration pricing", [
    "Launch at a **low** price to gain sales quickly.",
    "Enter a market where customers notice **price**.",
  ], [
    "A low price encourages a first **trial**.",
    "Early sales can build the **habit** of buying.",
    "Rivals may be discouraged if the price looks hard to **match**.",
  ], [
    "Profit per unit is **low** at the start.",
    "Customers may leave when the price later **rises**.",
    "A very low price can suggest low **quality**.",
  ]),
  n("3", "3.3", "Price skimming", [
    "Launch at a **high** price, then lower it later.",
    "Earn a high margin from customers keen to buy **early**.",
  ], [
    "Early sales can help recover **development** costs.",
    "A high price can signal **quality**.",
    "The price can fall later to reach more **customers**.",
  ], [
    "The high price limits early **sales**.",
    "A cheaper rival may take the larger **market**.",
    "Early buyers may resent the later **cut**.",
  ]),
  n("3", "3.3", "Dynamic pricing", [
    "Change the price as **demand** changes.",
    "Charge more when demand is high and less when capacity would otherwise stay **empty**.",
  ], [
    "Scarce items sell at a **higher** price, raising revenue.",
    "Quiet periods still attract price-sensitive **buyers**.",
    "Online prices can be changed **quickly**.",
  ], [
    "Customers who later see a lower price may think the firm was **unfair**.",
    "Constant changes are harder to run in a physical **shop**.",
    "A sudden high price can send buyers to a **rival**.",
  ]),
  n("3", "3.3", "Selling direct to customers", [
    "Use a channel with **no** retailer, wholesaler or agent.",
    "Keep contact with the final **buyer**.",
  ], [
    "No middleman’s **margin** is taken.",
    "The firm controls **price** and service.",
    "Comments come straight from **customers**.",
  ], [
    "The firm must pay for its own selling and **delivery**.",
    "It may reach fewer buyers than a national **retail** chain.",
    "Storage becomes the producer’s **problem**.",
  ]),
  n("3", "3.3", "Selling through retailers", [
    "Use shops to sell to final **consumers**.",
    "Place the product where those customers already **shop**.",
  ], [
    "Retailers provide **locations** and displays.",
    "The producer reaches more buyers than with only its **own** shops.",
    "Shop staff can explain the **product**.",
  ], [
    "The retailer takes a **margin**.",
    "The producer loses some control of the final **price** and display.",
    "A retailer may prefer a **rival** brand.",
  ]),
  n("3", "3.3", "Using wholesalers", [
    "Sell in bulk to a wholesaler who supplies many **retailers**.",
    "Move large quantities without visiting every small **shop**.",
  ], [
    "The producer makes fewer small **deliveries**.",
    "The wholesaler **stores** goods.",
    "Small shops the producer could not serve still stock the **product**.",
  ], [
    "Both wholesaler and retailer take a share of the **price**.",
    "The producer learns less about the final **customer**.",
    "The wholesaler may not promote the brand **strongly**.",
  ]),
  n("3", "3.3", "Using agents", [
    "Pay an agent **commission** to sell, often in a market the firm does not know.",
    "Use someone who already has local **contacts**.",
  ], [
    "The agent brings local **knowledge**.",
    "The firm need not open its own office **immediately**.",
    "Commission is linked to **sales**.",
  ], [
    "The agent may also sell **rival** products.",
    "The firm depends on the agent’s **effort**.",
    "Commission reduces **profit**, and control of the brand is weaker.",
  ]),
  n("3", "3.3", "Sales promotion", [
    "Offer a short-term incentive such as **vouchers**, reward schemes, competitions, special offers or **discounts**.",
    "Give customers a reason to buy **now**.",
  ], [
    "Sales often rise during the **offer**.",
    "Vouchers and offers encourage a first **trial**.",
    "Reward schemes can bring customers **back**.",
  ], [
    "The discount or gift reduces **profit** on those sales.",
    "Sales may fall back as soon as the offer **ends**.",
    "Customers may wait for the next **discount**.",
  ]),
  n("3", "3.3", "Advertising", [
    "Pay to communicate through **social media**, targeted emails, **leaflets** or **billboards**.",
    "Inform customers and persuade them to **buy**.",
  ], [
    "Social media and email can be aimed at a chosen **group**.",
    "A billboard is seen repeatedly by people who pass it.",
    "Leaflets can be placed in a particular **area**.",
  ], [
    "Many people who see the advert will **not** buy.",
    "Design and placement still **cost** money.",
    "It is hard to prove the advert caused the extra **sales**.",
  ]),
  n("3", "3.3", "Ecommerce for the business", [
    "Sell through **online shopping**, apps, online ticketing or similar electronic channels.",
    "Take orders without a shop on every **street**.",
  ], [
    "The business can sell **all day** and to other regions.",
    "Some shop **rent** and counter staff costs are avoided.",
    "Online data helps later **promotion**.",
  ], [
    "The website, payment system and **delivery** must be paid for.",
    "Returns can be **high** because goods were not handled first.",
    "A site failure or cyber problem stops **sales**.",
  ]),
  n("3", "3.3", "Ecommerce for the customer", [
    "Let customers buy, book or bank by **phone or internet**.",
    "Examples include online shopping, ticketing and internet **banking**.",
  ], [
    "Customers can buy at any **time** without travelling to a shop.",
    "Prices and products are easy to **compare**.",
    "Tickets and some services arrive **immediately**.",
  ], [
    "The product cannot be handled before **purchase**.",
    "Delivery may be late or the goods may not **match** the picture.",
    "Payment online creates a **security** worry for some customers.",
  ]),
  n("3", "3.3", "Entering a market in another country", [
    "Sell in a **foreign** market as a way to grow.",
    "Increase sales and spread **risk** beyond the home country.",
  ], [
    "A new market can raise **sales**.",
    "Weak demand at home may be offset by demand **abroad**.",
    "The brand reaches customers it could not reach **locally**.",
  ], [
    "**Cultural differences** can make the home product unsuitable.",
    "The firm may lack **knowledge** of local tastes and rivals.",
    "Different **legal requirements** add cost and delay.",
  ]),
  n("3", "3.4", "Legal controls on marketing", [
    "Protect customers from **misleading promotion** and **faulty goods**.",
    "Set rules on what a business may claim and sell.",
  ], [
    "Honest marketing builds **trust**.",
    "Safety rules reduce fines and products being **banned**.",
    "Rivals are stopped from making legal false **claims** as well.",
  ], [
    "Checking claims, labels and product safety **costs** money.",
    "Some promotions the firm wants are **forbidden**.",
    "Different countries’ rules complicate selling **abroad**.",
  ]),

  n("4", "4.1", "Job production", [
    "Make **one** product at a time to a customer’s requirements.",
    "Suit unique goods.",
  ], [
    "The product can match the customer’s exact **needs**.",
    "Workers often use a wider range of **skills**.",
    "A higher **price** can be charged for a one-off item.",
  ], [
    "It is **slow** and labour cost per unit is high.",
    "There is little chance of **economies of scale**.",
    "A mistake on a one-off job is **expensive** to put right.",
  ]),
  n("4", "4.1", "Batch production", [
    "Make a **quantity** of one version, then switch to another version.",
    "Produce variety, such as different sizes or flavours, in groups.",
  ], [
    "Output is higher than **job** production, so unit cost can fall.",
    "The firm can still offer some **variety**.",
    "The next batch can change if demand for one version **rises**.",
  ], [
    "Machines stop while they are **reset**.",
    "Part-finished batches tie up **cash**.",
    "One fault can spoil the **whole** batch.",
  ]),
  n("4", "4.1", "Flow production", [
    "Make large quantities of a **standard** product on a continuous line.",
    "Keep work moving from one stage to the next.",
  ], [
    "High output lowers **average cost**.",
    "Goods can be supplied **quickly** from a steady flow.",
    "Each worker or machine repeats a limited **task**.",
  ], [
    "Changing the product is **difficult** and expensive.",
    "The line needs a large spending on **capital**.",
    "A breakdown at one point can stop the **whole** line, and the work can be boring.",
  ]),
  n("4", "4.1", "Lean production", [
    "Remove **waste** of time, materials and effort.",
    "Achieve it through **just-in-time** inventory control and **Kaizen**.",
  ], [
    "Less waste lowers **costs**.",
    "Less inventory frees **cash** and space.",
    "Faults are found sooner, so fewer bad goods reach **customers**.",
  ], [
    "Staff need **training** to change old habits.",
    "With little spare stock, a late **supplier** stops production.",
    "Cutting every spare minute can hurt **morale** if it is forced badly.",
  ]),
  n("4", "4.1", "Just-in-time inventory", [
    "Receive materials as they are **needed** rather than holding large stocks.",
    "A method of **lean** production.",
  ], [
    "Less cash is tied up in **inventory**.",
    "Storage cost and obsolete stock **fall**.",
    "The need for accurate supply can improve **quality**.",
  ], [
    "A late delivery **stops** production.",
    "Small frequent orders may lose **bulk** discounts.",
    "It needs reliable suppliers and accurate **forecasts**.",
  ]),
  n("4", "4.1", "Kaizen", [
    "Use **small, continuous improvements** from the people who do the work.",
    "Keep reducing waste instead of waiting for one large **project**.",
  ], [
    "Many small ideas can cut **cost** without a huge investment.",
    "Staff who are listened to may be more **motivated**.",
    "Improvement does not stop after a single **change**.",
  ], [
    "Each idea looks **minor**, so it is easy to ignore.",
    "Workers need time in which suggestions are **welcome**.",
    "It cannot replace a machine that is simply **worn out**.",
  ]),
  n("4", "4.1", "Holding inventory", [
    "Keep a stock of materials or finished **goods**.",
    "The amount held depends on demand, storage cost, suppliers and how quickly stock can be **replaced**.",
  ], [
    "Production can continue if a supplier is **late**.",
    "A sudden order can still be **met**.",
    "Buying a larger amount may earn a **discount**.",
  ], [
    "Cash is tied up in goods not yet **sold**.",
    "Storage, insurance and security **cost** money.",
    "Stock can be damaged or become **out of date**.",
  ]),
  n("4", "4.2", "Automation and new production technology", [
    "Change production through **automation**, mechanisation, **CAM** and **3D printing**.",
    "In services, technology such as **contactless** payments can raise productivity.",
  ], [
    "Machines can work with consistent **accuracy**.",
    "Output per worker can **rise** and wage cost per unit can fall.",
    "3D printing can make a new design without a full new **production line**.",
  ], [
    "The equipment needs a large amount of **capital**.",
    "Employees may be made **redundant** or must retrain.",
    "Breakdowns stop output until a specialist can **repair** the system.",
  ]),
  n("4", "4.3", "Sustainable production", [
    "Use **renewable** energy, fewer resources, less waste, reuse and **recycling**.",
    "Develop environmentally friendly products and **packaging**.",
  ], [
    "Less waste can lower material **costs** over time.",
    "A greener image can raise **sales** with some customers.",
    "The firm is better prepared if environmental **laws** tighten.",
  ], [
    "New equipment and materials need **capital** at the start.",
    "Some customers will not pay more for a greener **product**.",
    "Exaggerated green claims destroy **trust**.",
  ]),
  n("4", "4.4", "Economies of scale", [
    "Lower **average cost** as the scale of output rises.",
    "The types are **purchasing**, marketing, financial, managerial and **technical**.",
  ], [
    "**Purchasing** economies: bulk buying cuts the cost of materials per unit.",
    "**Technical** economies: specialist machines are worthwhile only at high output.",
    "**Financial** economies: large firms may borrow at a lower interest rate. Marketing and specialist managers also cost less **per unit**.",
  ], [
    "The saving appears only if output is actually **high**.",
    "Growing too far can create **diseconomies of scale**.",
    "A huge operation is risky if **demand** falls but fixed costs remain.",
  ]),
  n("4", "4.4", "Diseconomies of scale", [
    "Explain why **average cost** can rise when a firm is too large.",
    "The causes include poor **communication**, weak loyalty, weak coordination and lack of **control**.",
  ], [
    "Recognising them early can lead managers to improve **communication**.",
    "Smaller units can restore **control**.",
    "Owners may choose not to grow past the point where costs start to **rise**.",
  ], [
    "Messages are **slow** and get distorted.",
    "Employees feel less **commitment** to a huge organisation.",
    "Poor coordination and weak control mean more mistakes and higher **unit cost**.",
  ]),
  n("4", "4.4", "Break-even analysis", [
    "Find the output where **total revenue equals total cost**.",
    "Break-even output = **fixed costs ÷ contribution per unit**. Contribution = selling price − variable cost per unit.",
  ], [
    "Managers see how many units must be sold before a **profit**.",
    "The **margin of safety** shows how far sales can fall before a loss.",
    "The effect of a change in price, fixed cost or variable cost can be tested before money is **spent**.",
  ], [
    "It assumes all output is **sold** and that costs and price stay the same.",
    "It is harder when the firm makes **many** products.",
    "A chart based on wrong forecasts gives a wrong **decision**.",
  ]),
  n("4", "4.5", "Quality control", [
    "Inspect products, often at the **end**, and remove those that fail.",
    "Stop faulty goods reaching the **customer**.",
  ], [
    "Faults can be caught before they cause **returns**.",
    "Inspectors become skilled at finding particular **defects**.",
    "The check is easy to **explain**.",
  ], [
    "Faults are found **after** time and materials have been used.",
    "Inspection does not **stop** the next fault being made.",
    "Workers may leave quality to the **inspector**.",
  ]),
  n("4", "4.5", "Quality assurance", [
    "Check quality **during** the process, not only at the end.",
    "Make each stage responsible for getting the work **right**.",
  ], [
    "Faults are found **earlier**, so less work is scrapped.",
    "Workers take **responsibility**, which can motivate them.",
    "Customers gain confidence in a consistent **process**.",
  ], [
    "Setting standards and training staff **costs** time and money.",
    "Too many checks can slow **output**.",
    "It fails if workers are not trained to accept the **responsibility**.",
  ]),
  n("4", "4.6", "Choosing a manufacturing location", [
    "Pick a site using factors such as materials, **labour**, transport, power and the **cost** of land.",
    "Balance nearness to inputs against nearness to **customers**.",
  ], [
    "A site near heavy or perishable **materials** cuts transport cost and spoilage.",
    "A site near customers makes delivery of finished goods **faster**.",
    "Good transport links reduce the cost of both inputs and **outputs**.",
  ], [
    "The best site for materials may be far from **customers**.",
    "Sites with skilled labour or good roads often have higher **rent**.",
    "A wrong location is expensive to **reverse**.",
  ]),
  n("4", "4.6", "Choosing a service location", [
    "Pick a site for a service using **customers**, labour, rent and technology.",
    "Passing trade and access matter for many **shops** and personal services.",
  ], [
    "Being where customers already go raises **sales**.",
    "Some services can locate cheaply if customers contact them **online**.",
    "A supply of suitable **workers** nearby makes staffing easier.",
  ], [
    "The best customer sites have high **rent**.",
    "Nearby **competitors** can take the same passing trade.",
    "A quiet location saves rent but may leave the service **unknown**.",
  ]),
  n("4", "4.6", "Locating operations in another country", [
    "Choose a country using costs, **markets**, trade barriers and government incentives.",
    "Move production or offices **abroad**.",
  ], [
    "Wages or land may be **cheaper**.",
    "Producing inside a country can avoid **tariffs** and shorten delivery to those customers.",
    "A grant or lower tax may be offered by the **host** government.",
  ], [
    "Language, laws and customs are easy to **misjudge**.",
    "Control and communication from home are **harder**.",
    "Exchange rates and political change add **risk**, and jobs at home may be lost.",
  ]),

  n("5", "5.1", "Owners’ investment", [
    "Use the owners’ **own money** as capital.",
    "Finance a start-up or expansion without a new **lender**.",
  ], [
    "No **interest** is paid to a bank.",
    "The owner can keep **control** if no new shareholders are added.",
    "The money can be available **immediately**.",
  ], [
    "Savings are often too **small** for a large need.",
    "The owner can **lose** that personal money.",
    "The money is then unavailable for a private **emergency**.",
  ]),
  n("5", "5.1", "Retained profit", [
    "Reinvest **profit** kept in the business.",
    "Finance assets or growth without new **borrowing**.",
  ], [
    "No **interest** and no fixed repayment.",
    "Control is not given to new **shareholders**.",
    "It shows the firm can generate its own **finance**.",
  ], [
    "A new or loss-making firm has **none**.",
    "Owners may want the cash as **dividends** instead.",
    "The sum may be too **small** for a major project.",
  ]),
  n("5", "5.1", "Sale of unwanted assets", [
    "Turn an asset the business no longer **needs** into cash.",
    "An internal source of **finance**.",
  ], [
    "Cash is raised without **interest** or new owners.",
    "The cost of keeping an unused asset **stops**.",
    "It can be faster than a bank **application**.",
  ], [
    "The asset is gone if it is **needed** later.",
    "A quick sale may bring a **low** price.",
    "A firm can sell only assets it **has**.",
  ]),
  n("5", "5.1", "Freeing working capital", [
    "Release cash tied up in **inventory** or in money owed by customers.",
    "Use working capital more tightly as an internal source of **finance**.",
  ], [
    "Cash is freed without a **loan**.",
    "Less stock can cut storage **cost**.",
    "Faster payment by customers reduces the risk of a **bad** debt.",
  ], [
    "Too little stock can stop **production** or sales.",
    "Pressing customers to pay sooner may send them to a **rival**.",
    "There is a limit to how much cash can be **squeezed** out.",
  ]),
  n("5", "5.1", "Issuing shares", [
    "Raise permanent **capital** by selling shares.",
    "A long-term external source for a **limited company**.",
  ], [
    "Share capital does not have to be **repaid**.",
    "Dividends can be missed in a bad **year**, unlike loan interest.",
    "A large sum can be raised, especially by a **public** company.",
  ], [
    "New shareholders can **dilute** the original owners’ control.",
    "Dividends are expected when profit **allows**.",
    "A public issue is **expensive** and is not available to a sole trader.",
  ]),
  n("5", "5.1", "Venture capital", [
    "Obtain finance from investors who accept a **high risk** for a share of a growing firm.",
    "Fund a business a bank may **refuse**.",
  ], [
    "Large finance is possible with little **security**.",
    "Investors often add **advice** and contacts.",
    "There is no monthly bank **instalment**.",
  ], [
    "The investor takes a **share** of ownership and profit.",
    "Founders lose some **control**.",
    "Investors expect fast **growth** and may push for a later sale.",
  ]),
  n("5", "5.1", "Bank overdraft", [
    "Agree a limit to spend **more** than the account balance.",
    "Cover a **short-term** cash gap. It can also solve a short-term cash-flow problem.",
  ], [
    "Interest is charged only on the amount **used**.",
    "It can be arranged **quickly** for day-to-day bills.",
    "It falls again when cash **comes in**.",
  ], [
    "The interest rate is often **high**.",
    "The bank can demand repayment at **short** notice.",
    "It is a weak way to buy a **long-term** asset.",
  ]),
  n("5", "5.1", "Leasing", [
    "Rent an asset and pay regular **lease** charges.",
    "Use equipment without buying it **outright**.",
  ], [
    "A large cash sum is not needed at the **start**.",
    "The asset can be updated when the lease **ends**.",
    "Maintenance is often **included**.",
  ], [
    "The firm usually **never owns** the asset.",
    "Payments over time can exceed the **purchase** price.",
    "Ending the lease early can bring a **penalty**.",
  ]),
  n("5", "5.1", "Hire purchase", [
    "Pay a deposit and instalments, and **own** the asset after the last payment.",
    "Obtain a vehicle or machine without the full price **today**.",
  ], [
    "The asset can be **used** at once.",
    "The cost is **spread** over time.",
    "Ownership passes to the business at the **end**.",
  ], [
    "Interest makes the total paid higher than the **cash** price.",
    "Missed instalments can lead to **repossession**.",
    "The firm is committed for the whole **agreement**.",
  ]),
  n("5", "5.1", "Bank loan", [
    "Borrow a **fixed** sum and repay it with interest over an agreed time.",
    "Finance a medium- or long-term need such as **equipment**.",
  ], [
    "The full amount arrives **at once**.",
    "Repayments can be **planned**.",
    "Owners keep **control**, unlike a new share issue.",
  ], [
    "**Interest** must be paid even in a poor month.",
    "The bank may want **security**, and a small firm may be refused.",
    "Failure to repay can mean losing the asset used as **security**.",
  ]),
  n("5", "5.1", "Trade credit", [
    "Take goods now and **pay** the supplier later.",
    "Finance stock for a short time.",
  ], [
    "No interest is charged if the bill is paid **on time**.",
    "Cash stays in the business **longer**.",
    "It needs no share issue or bank **form**.",
  ], [
    "A discount for early payment is **lost**.",
    "Late payment damages future **supplies**.",
    "The time allowed may be shorter than the time customers take to **pay**.",
  ]),
  n("5", "5.1", "Government grants", [
    "Receive money that usually does not have to be **repaid**.",
    "Often tied to jobs, a location or a type of **investment**.",
  ], [
    "There is no **interest** if the conditions are met.",
    "Less money needs to be **borrowed**.",
    "A grant can make a project **possible**.",
  ], [
    "Conditions, such as a set number of **jobs**, must be met.",
    "The application takes time and may be **refused**.",
    "The grant is often too **small** to pay for everything.",
  ]),
  n("5", "5.1", "Crowdfunding", [
    "Raise many small sums, usually **online**, in return for rewards, loans or shares.",
    "Finance a project that a bank may not **support**.",
  ], [
    "Finance is possible without a traditional **loan**.",
    "The appeal itself **publicises** the idea.",
    "The response shows whether people will **back** it.",
  ], [
    "The target may not be **reached**, and the idea is then public.",
    "The platform charges a **fee**.",
    "Giving shares or large rewards reduces later **profit** and can complicate ownership.",
  ]),
  n("5", "5.2", "Cash-flow forecast", [
    "Estimate future **cash inflows**, **cash outflows**, net cash flow, and opening and closing balances.",
    "Closing balance = opening balance + **net cash flow**.",
  ], [
    "A future cash shortage is seen **before** it happens.",
    "Managers can test a new loan, a fall in sales or a delay in buying an **asset**.",
    "Banks often want a forecast before they **lend**.",
  ], [
    "It is only a **forecast**, so the figures can be wrong.",
    "It does not measure **profit**.",
    "An old forecast gives false **confidence**.",
  ]),
  n("5", "5.2", "Asking customers to pay more quickly", [
    "Shorten the time **credit customers** are given to pay.",
    "Bring cash **inflows** forward when there is a short-term cash problem.",
  ], [
    "Cash arrives **sooner**.",
    "Less money is at risk if a customer later **fails**.",
    "It uses no bank **interest**.",
  ], [
    "Customers may buy from a rival who still offers longer **credit**.",
    "Chasing payment takes **staff** time.",
    "A discount for fast payment reduces **revenue**.",
  ]),
  n("5", "5.2", "Delaying payment to suppliers", [
    "Take longer to pay **trade payables**.",
    "Hold cash for longer during a short-term **shortage**.",
  ], [
    "Cash outflows are **postponed**.",
    "No bank interest is paid if the supplier allows the extra **time**.",
    "It can bridge a gap until customers **pay**.",
  ], [
    "Suppliers may stop **deliveries**.",
    "Prompt-payment discounts are **lost**.",
    "The firm gets a reputation as a slow **payer**.",
  ]),
  n("5", "5.2", "Delaying purchase of non-current assets", [
    "Postpone buying **property, machinery or vehicles**.",
    "Avoid a large cash outflow during a short-term **problem**.",
  ], [
    "Cash is kept for **wages** and materials.",
    "The firm avoids new **borrowing** for that asset.",
    "The purchase can wait until the closing balance is **positive**.",
  ], [
    "Old equipment may break down and stop **output**.",
    "A rival who invests may gain a **cost** advantage.",
    "The delay only helps if the asset was not **essential** now.",
  ]),
  n("5", "5.3", "Profit", [
    "Measure the surplus when **revenue** is greater than costs.",
    "Profit = total revenue − total costs, or **gross profit − expenses**.",
  ], [
    "It **rewards** the owners for risk.",
    "Retained profit is a source of **finance**.",
    "It is a measure of **success** and can attract investors.",
  ], [
    "Profit is not the same as **cash**.",
    "A profit figure can fall even when the firm is still **useful** to customers.",
    "Chasing profit can conflict with employee or community **aims**.",
  ]),
  n("5", "5.3", "Statement of profit or loss", [
    "Report **revenue**, cost of sales, **gross profit**, expenses and profit for a period.",
    "Show whether the business made a **surplus**.",
  ], [
    "Profit can be compared with an earlier **period**.",
    "Gross profit and profit show whether the problem is **cost of sales** or expenses.",
    "Owners can decide how much profit to **retain**.",
  ], [
    "It looks **backward**.",
    "It does not show the **cash** balance.",
    "One strong year can hide a weak **trend**.",
  ]),
  n("5", "5.4", "Statement of financial position", [
    "List **assets**, **liabilities** and capital employed on one date.",
    "Working capital = **current assets − current liabilities**.",
  ], [
    "Users can see if short-term debts can be **paid**.",
    "The size of loans compared with owners’ capital shows **risk**.",
    "Non-current assets show the scale of long-term **resources**.",
  ], [
    "It is a picture of **one** day.",
    "Asset values may not equal today’s **selling** price.",
    "Skills and reputation may not appear as a **number**.",
  ]),
  n("5", "5.5", "Gross profit margin", [
    "Show gross profit as a **percentage of revenue**.",
    "Gross profit margin = **gross profit ÷ revenue × 100**.",
  ], [
    "It shows what is left from each sale after **cost of sales**.",
    "A fall suggests higher input costs, more waste or lower **prices**.",
    "It can be compared over **time**.",
  ], [
    "It ignores **expenses** such as rent and office wages.",
    "A high margin is not the same as good **liquidity**.",
    "A normal margin differs between **industries**.",
  ]),
  n("5", "5.5", "Profit margin", [
    "Show **profit** as a percentage of revenue, after expenses.",
    "Profit margin = **profit ÷ revenue × 100**.",
  ], [
    "It shows what is left from each sale after **all** the main costs.",
    "Compared with the gross margin, it shows whether **expenses** are too high.",
    "Owners can see if revenue is becoming **profit**.",
  ], [
    "A higher margin can still mean less profit if **sales** have fallen.",
    "One unusual year can **distort** it.",
    "It says nothing about **cash** or liquidity.",
  ]),
  n("5", "5.5", "Return on capital employed", [
    "Compare profit with the long-term **capital** used in the business.",
    "ROCE = **profit ÷ capital employed × 100**.",
  ], [
    "Owners see the **return** on the capital used.",
    "It can be compared with **interest** rates and with other firms.",
    "A fall warns that extra capital is not earning enough **profit**.",
  ], [
    "Capital employed comes from the **accounts**, not necessarily market value.",
    "A high return on very old assets may not **continue**.",
    "One year’s profit can be made to look better than the **long-term** position.",
  ]),
  n("5", "5.5", "Current ratio", [
    "Compare **current assets** with **current liabilities**.",
    "Current ratio = current assets ÷ current liabilities. It can be shown as a number or **: 1**.",
  ], [
    "It is a simple test of whether short-term debts can be **covered**.",
    "A falling trend warns of a **liquidity** problem.",
    "The figures come straight from the statement of **financial position**.",
  ], [
    "**Inventory** is included even if it is hard to sell quickly.",
    "A very high ratio can mean idle **cash** or too much stock.",
    "The figure is for one **date** only.",
  ]),
  n("5", "5.5", "Acid test ratio", [
    "Test liquidity **without inventory**.",
    "Acid test = **(current assets − inventory) ÷ current liabilities**.",
  ], [
    "It shows cover from **cash and receivables** only.",
    "It is stricter than the current ratio when a lot of **stock** is held.",
    "It can be shown as a number or as a ratio **: 1**.",
  ], [
    "Receivables may not be **collected** on time.",
    "A low result worries a cash retailer less, because stock sells **quickly**.",
    "It is still only a picture of one **date**.",
  ]),
  n("5", "5.5", "Limitations of accounts and ratios", [
    "Remind users that the figures describe the **past** and only what is measured in money.",
    "Users include owners, managers, employees, suppliers, government and **lenders**.",
  ], [
    "Several years and several **ratios** are safer than one number.",
    "The limits push users to look at customers and **rivals** as well.",
    "The accounts are still a shared starting point for a **decision** to lend or invest.",
  ], [
    "They omit **motivation**, brand strength and a new competitor.",
    "Different accounting choices make firms hard to **compare**.",
    "Figures can be arranged to look better on **one** day, and they are already out of date.",
  ]),

  n("6", "6.1", "Growth stage of the business cycle", [
    "A stage when output and spending are **rising** after a slump.",
    "Show how recovering demand affects **sales**.",
  ], [
    "Customers start to buy **more**, so sales can recover.",
    "It becomes easier to launch a new **product**.",
    "Unemployment starts to fall, which can raise consumer **confidence**.",
  ], [
    "Costs of materials and labour begin to **rise**.",
    "The recovery may be **slow**, so cash is still tight.",
    "Firms that cut too far in the slump may lack **capacity**.",
  ]),
  n("6", "6.1", "Boom", [
    "A stage of high spending, high output and low **unemployment**.",
    "Show the effect of very strong **demand**.",
  ], [
    "Sales and profit can **rise**.",
    "It is easier to raise **prices**.",
    "Customers feel secure enough to spend on non-essential **goods**.",
  ], [
    "Wages and material **prices** often rise.",
    "Skilled labour becomes **scarce**.",
    "Interest rates may be raised to slow **inflation**, which then raises borrowing costs.",
  ]),
  n("6", "6.1", "Recession", [
    "A stage when output **falls** and unemployment rises.",
    "Customers cut spending.",
  ], [
    "Weaker rivals may **leave**, so survivors can gain share later.",
    "Some labour and premises become **cheaper**.",
    "A firm with cash can buy assets at lower **prices**.",
  ], [
    "Sales of non-essential goods **fall**.",
    "Customers pay more **slowly**, so cash flow worsens.",
    "Redundancies may be needed, which harms **morale**.",
  ]),
  n("6", "6.1", "Slump", [
    "The low point of the **business cycle**, with very weak demand.",
    "A deeper fall than the start of a **recession**.",
  ], [
    "Only firms that control **cash** and costs are likely to survive to the recovery.",
    "Rent and some wages may be **negotiated** down.",
    "A firm that survives faces fewer **rivals** afterwards.",
  ], [
    "Sales can fall so far that even careful firms make **losses**.",
    "Bad debts rise as customers **fail**.",
    "Investment stops, so equipment becomes **out of date**.",
  ]),
  n("6", "6.1", "Inflation", [
    "A general rise in **prices**.",
    "Show the effect on costs, selling prices and the real value of **money**.",
  ], [
    "The real burden of a **fixed** loan can fall over time.",
    "Selling prices may be raised if customers still **buy**.",
    "Stock bought earlier can be sold at a higher **price**.",
  ], [
    "Wages, materials and rent **cost** more.",
    "Customers’ real income falls, so they may switch to **cheaper** goods.",
    "High inflation makes forecasts and export **prices** uncertain.",
  ]),
  n("6", "6.1", "Unemployment", [
    "People who want work cannot find a **job**.",
    "Change both the supply of **labour** and the demand for goods.",
  ], [
    "The firm can recruit more **easily**.",
    "Wage pressure may be **lower**.",
    "Staff are less likely to leave if other jobs are **scarce**.",
  ], [
    "Unemployed customers spend **less**.",
    "Local shops in a high-unemployment area lose **sales**.",
    "Government revenue falls, so **taxes** or spending may change.",
  ]),
  n("6", "6.1", "Economic growth", [
    "An increase in the country’s **output** over time.",
    "Usually raises incomes and **spending**.",
  ], [
    "Higher incomes can increase **sales**.",
    "New markets appear as people buy goods they could not **afford** before.",
    "A growing economy makes expansion easier to **justify**.",
  ], [
    "Demand for labour and materials can raise **costs**.",
    "Fast growth can bring **inflation**.",
    "The benefit is uneven if growth is in industries the firm does not **supply**.",
  ]),
  n("6", "6.1", "A rise in interest rates", [
    "Increase the **cost of borrowing** and the reward for saving.",
    "Often used to slow spending and **inflation**.",
  ], [
    "A firm with little debt is hurt less than a heavily **borrowed** rival.",
    "Slower demand can ease **wage** and skill shortages.",
    "Higher saving rates can help banks gather **funds**.",
  ], [
    "Interest on loans and overdrafts **rises**, which cuts profit.",
    "Customers with loans spend **less**, especially on houses, cars and luxury goods.",
    "Plans to buy new **machinery** are delayed.",
  ]),
  n("6", "6.1", "A fall in interest rates", [
    "Make borrowing **cheaper**.",
    "Encourage spending and **investment**.",
  ], [
    "Interest costs on loans and overdrafts **fall**.",
    "Customers may borrow and spend **more**.",
    "New equipment becomes more **affordable**.",
  ], [
    "Demand may rise so fast that costs and **inflation** return.",
    "Savers earn less and may cut some **spending**.",
    "Very low rates leave less room to cut them in the next **recession**.",
  ]),
  n("6", "6.1", "Higher tax on business profit", [
    "Take a larger share of company **profit** in tax.",
    "Reduce the profit left for owners and for **reinvestment**.",
  ], [
    "The same tax applies to **rivals**, so one firm is not singled out.",
    "The revenue may later fund roads or education that cut business **costs**.",
    "Firms that plan for the tax avoid a cash **surprise**.",
  ], [
    "Less profit is left for **dividends** and retained profit.",
    "Expansion may be **cancelled**.",
    "Investors may prefer a country with a **lower** tax on profit.",
  ]),
  n("6", "6.1", "Higher income tax", [
    "Reduce households’ **disposable income**.",
    "Show the effect of tax on people’s **income**, not on the firm’s profit.",
  ], [
    "Lower spending can ease **inflation**. ",
    "Some of the tax may fund government **contracts**.",
    "Demand may shift towards cheaper **home** products.",
  ], [
    "Customers have less money, so **sales** fall.",
    "Workers may demand higher **wages** to protect take-home pay.",
    "Non-essential goods are hit **hardest**.",
  ]),
  n("6", "6.1", "An increase in government spending", [
    "Government buys more goods and services or funds more **projects**.",
    "Add demand to the **economy**.",
  ], [
    "Firms that supply government gain **orders**.",
    "More public jobs can raise local **spending**.",
    "Better roads or education can cut business **costs** later.",
  ], [
    "The spending may later be paid for by higher **taxes**.",
    "Extra demand can cause **inflation** if the economy is already busy.",
    "Firms outside those projects may see **no** benefit.",
  ]),
  n("6", "6.2", "Globalisation", [
    "Trade and produce across **countries** more easily.",
    "Driven by better **transport**, communication technology, free-trade agreements and newly industrialised countries.",
  ], [
    "The firm can buy cheaper **materials** and reach more customers.",
    "Producing in several countries can lower **costs** and spread risk.",
    "Ideas and technology spread **faster**.",
  ], [
    "Foreign rivals can enter the home market and cut **sales**.",
    "The firm depends on distant **suppliers**.",
    "A crisis in one country can disrupt the whole **chain**.",
  ]),
  n("6", "6.2", "Import tariffs", [
    "A **tax on imports** that makes foreign goods more expensive in the home market.",
    "Protect home producers or raise **revenue**.",
  ], [
    "Home firms face less **price** pressure from imports.",
    "Government collects **tax**.",
    "A new home industry gets time to become **competitive**.",
  ], [
    "Imported **materials** cost home firms more.",
    "Customers pay **higher** prices.",
    "Other countries may reply with their own **tariffs**, which hurts exporters.",
  ]),
  n("6", "6.2", "Import quotas", [
    "A **limit on the quantity** of a good that may be imported.",
    "Reduce the volume of foreign **competition**.",
  ], [
    "Home producers can sell more because imports cannot exceed the **limit**.",
    "The effect on quantity is more **certain** than with a tariff.",
    "The home industry gets time to improve **efficiency**.",
  ], [
    "Prices often **rise** because supply is limited.",
    "Customers have less **choice**.",
    "Exporting countries may **retaliate**. A quota also raises no tax in the way a tariff does.",
  ]),
  n("6", "6.2", "Becoming a multinational", [
    "Produce in **more than one** country.",
    "Grow by operating inside foreign **markets**.",
  ], [
    "The firm can locate where costs are **lower**.",
    "It can sell inside countries that restrict **imports**.",
    "Profits from several countries **spread** risk.",
  ], [
    "Managing several countries is **complex**.",
    "Profits can be hit by **exchange** rates and local laws.",
    "A mistake in one country can damage the global **brand**.",
  ]),
  n("6", "6.2", "A multinational in the host country", [
    "Show the effect on the country where the multinational **locates**.",
    "Weigh jobs and investment against competition and **environmental** damage.",
  ], [
    "It creates **jobs** and may train local workers.",
    "It can increase **exports**, choice and investment.",
    "Local suppliers may gain **orders**.",
  ], [
    "Local firms face stronger **competition**.",
    "The activity may cause **environmental** damage or use up natural resources.",
    "**Profits** may be sent back to the home country.",
  ]),
  n("6", "6.2", "External costs and benefits", [
    "An **external cost** is a harm, such as pollution, suffered by people who did not choose the decision.",
    "An **external benefit** is a gain to others, such as a trained worker who later helps another employer.",
  ], [
    "Recognising external benefits can justify a decision that looks costly to the **firm** alone.",
    "Reducing external costs can improve **reputation**.",
    "Governments may support activities with external **benefits**.",
  ], [
    "External costs are not on the firm’s own **invoice**, so they are easy to ignore.",
    "Cleaning them up raises the firm’s **costs**.",
    "The size of the external effect is hard to **measure**.",
  ]),
  n("6", "6.2", "Appreciation of the currency", [
    "The exchange rate **rises**, so one unit buys more foreign currency.",
    "Imports become cheaper and exports become **dearer** abroad.",
  ], [
    "Imported materials cost **less**.",
    "Imported machinery and foreign services become **cheaper**.",
    "Lower import prices can ease **inflation**.",
  ], [
    "Exports become more **expensive** for foreign buyers, so export sales may fall.",
    "Home firms face cheaper **import** competition.",
    "Foreign revenue converts into less **home** currency.",
  ]),
  n("6", "6.2", "Depreciation of the currency", [
    "The exchange rate **falls**, so one unit buys less foreign currency.",
    "Exports become cheaper abroad and imports become more **expensive**.",
  ], [
    "Exports are **cheaper** for foreign buyers, so sales abroad can rise.",
    "Imported rival goods become **dearer**.",
    "Foreign earnings convert into more **home** currency.",
  ], [
    "Imported materials cost **more**.",
    "Higher import prices can cause **inflation**.",
    "A firm that depends on foreign components becomes less **competitive** if it cannot switch supplier.",
  ]),
  n("6", "6.3", "Responding to environmental issues", [
    "Change how, what or where the firm produces in order to cut **pollution** and the use of resources.",
    "Respond because of reputation, **sales**, or legal controls.",
  ], [
    "A better reputation can increase **sales**.",
    "Using fewer resources can cut **waste** costs.",
    "The firm avoids fines if it meets environmental **laws**.",
  ], [
    "Cleaner methods and different locations raise **costs**.",
    "Legal controls limit how, what and **where** the firm produces or sells.",
    "Customers may not pay a higher price for the cleaner **product**.",
  ]),
  n("6", "6.4", "Being ethical", [
    "Respond to issues such as **child labour**, unfair wages, unfair prices to suppliers, or suppliers who damage the **environment**.",
    "Choose a fair response even when a cheaper option exists.",
  ], [
    "Customers and workers who share the values stay **loyal**.",
    "The firm avoids boycotts and bad **publicity**.",
    "Ethical suppliers and some investors prefer to deal with the **firm**.",
  ], [
    "Fair wages and responsible suppliers raise **costs**.",
    "Prices may be higher than a less ethical **rival**.",
    "What counts as ethical differs between **countries** and stakeholders.",
  ]),
  n("6", "6.5", "Pressure groups", [
    "Organised groups try to change a business decision on issues such as **pollution** or pay.",
    "They use publicity, protests and **boycotts**.",
  ], [
    "Listening early can prevent a **boycott**.",
    "A real change can improve **reputation**.",
    "The campaign may reveal a risk the firm had **missed**.",
  ], [
    "Public criticism can cut **sales** before any law changes.",
    "Meeting the demand **costs** money.",
    "The group may demand more than the firm can **afford**, and the firm does not control the publicity.",
  ]),
];
