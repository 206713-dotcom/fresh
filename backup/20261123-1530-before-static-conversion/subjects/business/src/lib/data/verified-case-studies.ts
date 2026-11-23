import type { VerifiedQuestion } from "./verified-questions";

export interface VerifiedCaseAppendix {
  label: string;
  body: string;
}

export interface VerifiedCaseStudy {
  businessTitle: string;
  mainCase: string;
  table?: string;
  appendices?: VerifiedCaseAppendix[];
}

export const VERIFIED_PAPER1_CASE_STUDIES: Record<string, VerifiedCaseStudy> = {
  "0450/12|2017|Feb/Mar|Q1": {
    "businessTitle": "TXE (Food Retailer)",
    "mainCase": "TXE is a large food retailer. The Finance Director is worried as last year profit fell by 10%. ‘I blame competition and increased taxes. We have spent more on sales promotions, but these have not been successful. We have to find ways to increase profits.’ TXE has 200 shops and plans to close 50 to lower costs. TXE may decide to sell a wider range of products, such as clothes, to help increase its profits."
  },
  "0450/12|2017|Feb/Mar|Q2": {
    "businessTitle": "QAC (Cleaning Products)",
    "mainCase": "QAC uses batch production to make 70 different cleaning products including soap and polish. To meet increased demand for two of its products, X and Y, QAC could invest $10m in flow production using new technology. The Finance Director is worried about QAC’s cash flow position as shown in Table 1. He thinks it is important to have a high level of inventory but he also wants to improve the cash flow position.",
    "table": "              Table 1: QAC’s cash flow forecast for April – June 2017 ($000)\n                                              April                             May                                June\nCash in:                                      300                               400                                 460\nCash out:\n  Labour costs                                 140                               140                                 140\n  Inventory costs                              120                               180                                 180\n  Fixed costs                                  100                               100                                 100\nTotal cash out                                 360                               420                                 420\nNet cash flow                                  (60)                              (20)                                  ?\nOpening balance                                 30                               (30)                                (50)\nClosing balance                                (30)                              (50)                                  ?"
  },
  "0450/12|2017|Feb/Mar|Q3": {
    "businessTitle": "Dipta & Ravi (Chocolates)",
    "mainCase": "Dipta and Ravi are friends. They want to start up a business making chocolates to sell at local markets. Most ingredients such as cocoa beans will be imported. Ravi’s primary market research shows that using ethical sources of supply for the ingredients will be popular with consumers. Ravi and Dipta have no business experience, but Dipta has written a business plan. They need $500 for equipment, but they cannot decide which source of finance to use."
  },
  "0450/12|2017|Feb/Mar|Q4": {
    "businessTitle": "BGN (Furniture Retailer)",
    "mainCase": "BGN sells furniture such as beds and tables. It started as a partnership but is now a private limited company. BGN has expanded quickly and has 10 shops located in different cities. Each shop manager is responsible for recruitment and decisions about inventory levels. They send the Board a monthly report. The Managing Director has a laissez-faire leadership style. There has been an increase in customer complaints and employees think internal communications need to be improved."
  },
  "0450/13|2017|May/Jun|Q1": {
    "businessTitle": "CFE (Steel Manufacturer)",
    "mainCase": "CFE makes high quality steel used in shipbuilding. 40% of its output is exported. CFE’s equipment is old and often breaks down. CFE plans to downsize (reduce) its workforce and 1200 of its 2100 skilled employees could be made redundant. The Managing Director blames reduced demand because of recession in some economies. A trade union spokeswoman said: ‘Where are the opportunities from globalisation? This decision will affect many stakeholder groups. There must be another way for CFE to reduce costs.’"
  },
  "0450/13|2017|May/Jun|Q2": {
    "businessTitle": "PCB (Mobile Phones)",
    "mainCase": "PCB is a public limited company. It makes a well-known brand of mobile (cell) phones. Pricing is important as it sells in a competitive market. PCB wants to increase its product range. It plans to make luxury headphones as the demand for these is growing fast. The Operations Director has to decide whether PCB should develop its own brand of headphones or take over an existing producer. For both options, the source of finance would be a share issue.",
    "table": "                                               Table 1: Information on the 2 options\n                                                 Option 1:                                             Option 2:\n                                                 Develop own headphones                                Buy existing producer of\n                                                                                                       headphones\nCost                                                            $12m – $15m                                                 $45m\nTime needed before product                                    12 – 18 months                                             3 months\nlaunch\nOther information                                Need to recruit 1 experienced                         Existing producer has different\n                                                 designer                                              leadership style and\n                                                                                                       organisational structure"
  },
  "0450/13|2017|May/Jun|Q3": {
    "businessTitle": "C&P Designs (Jewellery Partnership)",
    "mainCase": "C&P Designs is a business partnership between Cory and Phoebe. They make handmade jewellery. Phoebe works from home making all the jewellery such as necklaces and bracelets. C&P pays for materials when they are ordered, but allows their customers one month to pay. Cory manages the accounts and the shop. He is worried about cash flow, as shown in Table 2. Cory said: ‘The bank will not increase our overdraft. We should ask customers to pay more quickly.’ Phoebe thinks advertising would increase sales but is worried about legal controls on marketing.",
    "table": "                          Table 2: Cash flow forecast for C&P ($)\n                                                   June                    July                August\nCash inflow                                                480                    440                    460\nCash outflow:\nRaw materials                                              240                    260                    240\nShop rent and other costs                                  200                    200                    220\nTotal cash outflows                                        440                    460                    460\nNet cash flow                                                40                   (20)                       Y\nOpening balance                                            (60)                   (20)                   (40)\nClosing balance                                                X                  (40)                   (40)"
  },
  "0450/13|2017|May/Jun|Q4": {
    "businessTitle": "TUKAN (Soft Drinks)",
    "mainCase": "TUKAN makes a range of soft drinks using flow production. All employees are paid a good wage but do not receive non-financial rewards. A high percentage of employees leave the business each year. A common reason given for leaving is that they have no involvement in decision-making. Last year, TUKAN’s revenue increased by $25m but profit did not increase. The Managing Director said: ‘The economy is in the growth stage of the business cycle. However, we need to improve efficiency. Lean production methods might help. We need to recruit a new Operations manager who could have some ideas about this.’"
  },
  "0450/11|2025|May/Jun|Q1": {
    "businessTitle": "Brendan (Flower Shop)",
    "mainCase": "Brendan wants to be a successful entrepreneur. He plans to start up a flower shop using government support. Brendan’s brother has offered to form a business partnership with him. Brendan knows it is important for a new business to use a suitable pricing method. He has already identified ways the business can increase added value. Brendan wants to know how an economic boom might affect his business."
  },
  "0450/11|2025|May/Jun|Q2": {
    "businessTitle": "NSL (Food Manufacturer)",
    "mainCase": "NSL is a business based in country X. It manufactures food products including bread and breakfast cereals. NSL uses lean production in its factory. Maintaining quality is important. NSL imports 15% of its raw materials. Changes in country X’s exchange rate can affect businesses which import raw materials. NSL’s Marketing Manager knows the business should respond to changes in consumer spending patterns. She is aware that market research can be used to help make business decisions."
  },
  "0450/11|2025|May/Jun|Q3": {
    "businessTitle": "LFK (Coal Mining)",
    "mainCase": "LFK is a coal-mining business. It has 135 employees who are all provided with training. After the dismissal of one of LFK’s employees there is a job vacancy for a new supervisor. External recruitment will be used. The Managing Director is preparing a cash flow forecast for LFK. An extract is shown in Table 3.1.",
    "table": "                                                                   Table 3.1\n                  Extract from LFK’s cash flow forecast July - September 2025 $000\n                                                      July                               August                               September\nCash inflow                                           600                                   400                                     730\nCash outflow                                          720                                     X                                     590\nNet cash flow                                         (120)                                (100)                                    140\nOpening balance                                        40                                   (80)                                   (180)\nClosing balance                                       (80)                                 (180)                                      Y"
  },
  "0450/11|2025|May/Jun|Q4": {
    "businessTitle": "PKN (Glass Manufacturer)",
    "mainCase": "PKN manufactures glass. Contributing to sustainable development is important to the business. PKN has factories in 30 countries. It has 27 000 employees. The Managing Director knows PKN has benefited from globalisation. She plans to expand the business using external growth. Retained profit is one source of finance a business could use to fund expansion. Some of PKN’s directors are concerned about possible diseconomies of scale as the business grows."
  },
  "0450/11|2026|May/Jun|Q1": {
    "businessTitle": "Peter (Wedding Photographer)",
    "mainCase": "Peter wants to start up a small business as a photographer who takes photographs at weddings. He has been told that there is government support available for new businesses. Peter will operate his business as a sole trader. He is considering using crowdfunding as a source of finance. Peter knows that many businesses fail."
  },
  "0450/11|2026|May/Jun|Q2": {
    "businessTitle": "OBZ (Carpet Manufacturer)",
    "mainCase": "OBZ uses job production to manufacture carpets. The business has 80 employees. OBZ’s operations manager is considering different ways to maintain quality production in the factory. The finance manager knows OBZ needs to manage its cash. She is reviewing OBZ’s financial data. An extract is shown in Table 2.1.",
    "table": "                         Table 2.1\nExtract from OBZ’s financial data at 30 December 2025 ($000)\nnon-current assets                                                                                            800\ncurrent assets                                                                                                300\ncurrent liabilities                                                                                           240"
  },
  "0450/11|2026|May/Jun|Q3": {
    "businessTitle": "SDY (Hats & Scarves)",
    "mainCase": "SDY sells hats and scarves. One of SDY’s objectives is to increase the number of sales. SDY has 240 shops and 3000 employees. All its shop managers use a democratic leadership style. The human resources director is currently recruiting new employees to work in SDY’s shops. External recruitment will be used. All new employees will be given induction training."
  },
  "0450/11|2026|May/Jun|Q4": {
    "businessTitle": "TRC (Fruit Smoothies)",
    "mainCase": "TRC manufactures fruit smoothies in country X. Many of the ingredients used, including mangoes and strawberries, are imported. TRC will be affected by a depreciation in the exchange rate of country X. TRC is always developing new products. The marketing manager has to decide on suitable packaging for these new products. She also knows it is important that businesses respond to environmental pressures."
  },
  "0264/01|2027|2027 specimen|Q1": {
    "businessTitle": "TGD (Gold Mining)",
    "mainCase": "TGD is a large gold-mining business operating in the primary sector in country X. It runs six gold mines, employs 3,000 workers, and exports 80% of the gold it extracts."
  },
  "0264/01|2027|2027 specimen|Q2": {
    "businessTitle": "Oscar’s Nursery",
    "mainCase": "Oscar is an entrepreneur setting up a children’s nursery for children aged one to three. He needs start-up finance, plans to use printed leaflets for promotion, and is considering dynamic pricing.",
    "table": "Cash-flow forecast extract ($):\nMonth       Inflow   Outflow   Net cash flow   Opening balance   Closing balance\nOctober      1,200     1,500          (300)           (1,300)           (1,600)\nNovember     2,000       Y             500            (1,600)           (1,100)"
  },
  "0264/01|2027|2027 specimen|Q3": {
    "businessTitle": "HLC (Chocolate Manufacturer)",
    "mainCase": "HLC is a private limited company manufacturing chocolate. It employs 80 production workers and produces 400,000 units of chocolate per week. Maintaining high quality is a priority, and HLC is planning to expand."
  },
  "0264/01|2027|2027 specimen|Q4": {
    "businessTitle": "ZRE (International Fashion Retailer)",
    "mainCase": "ZRE is a multinational fashion retailer operating 2,700 clothing shops across 20 countries with 9,000 employees. ZRE competes in fast-moving markets and communicates frequently with international suppliers by email."
  }
};

export const VERIFIED_PAPER2_CASE_STUDIES: Record<string, VerifiedCaseStudy> = {
  "0450/22|2017|Feb/Mar": {
    "businessTitle": "Bags and Belts (BB)",
    "mainCase": "BB is a small private limited company. It manufactures leather handbags and belts. It only uses the best quality leather. BB sells the bags and belts using its own brand name to large retailers. BB currently does not use the Internet in its business operations.\n\nThe leather used by BB has always been purchased from the same local business since BB was set up. This supplier guarantees high quality leather and has always delivered on time.\n\nBB was started 35 years ago and is now managed by Abdullah, the grandson of the original owner. The other directors are all members of the family. BB employs workers from the local community to manufacture the handbags and belts.\n\nBB uses batch production. The workers who make the handbags and belts are skilled, but wage costs are kept low by employing young workers to pack the products. The production process has waste materials and these are put into the nearby river. However, local people complain that it affects their drinking water.\n\nThe directors want to increase profit. They are thinking of either increasing prices or making some of the handbags out of a material that looks like leather but is much cheaper to buy. The Marketing Director thinks the demand for their handbags is price inelastic as many consumers are loyal to the BB brand.",
    "appendices": [
      {
        "label": "Appendix 1",
        "body": "                                      Organisation chart for BB\n                                     Abdullah (Managing Director)\n  Marketing Director          Operations Director        Human Resources Director       Finance Director\n Sales           Purchasing    Factory manager              Administration officer    Financial accountant\nmanager           manager                                            [1]\nSales staff      Assistant         Production                                              Assistant\n    [3]             [1]             workers                                                   [1]\n                                     [100]"
      },
      {
        "label": "Appendix 2",
        "body": "From:    Abdullah\nTo:      BB directors\nI want BB to expand and I am considering the following two options.\nOption A:\nSell BB branded handbags to wholesalers. This will allow BB to sell its handbags all over the country.\nWe will need to spend a lot of money on advertising in magazines aimed at people on high incomes.\nThe economy has been growing rapidly and many people now have high incomes.\nOption B:\nTo accept a contract to manufacture luxury handbags for a major global business. This global business\nwill then sell these handbags using its own channels of distribution across the world. The global\nbusiness has a recognised luxury brand and its handbags sell at very high prices in exclusive shops\nall over the world. All the workers will need to be skilled and fully trained as the highest quality will\nbe expected. New equipment costing $20 000 will need to be purchased. BB will still make some BB\nbranded handbags.\nWe must meet to discuss which option you think we should choose."
      },
      {
        "label": "Appendix 3",
        "body": "                           Summary of BB balance sheet ($000)\n                                                    2015                2016\nNon-current assets                                  100                  120\nCurrent assets:\nInventories                                           10                  40\nCash                                                  10                  10\nTrade receivables                                     10                  40\nCurrent liabilities:\nTrade payables                                        40                  50\nNon-current liabilities:\nLong-term bank loan                                   80                  80"
      }
    ]
  },
  "0450/23|2017|May/Jun": {
    "businessTitle": "SC Cars (SC)",
    "mainCase": "SC is a public limited company that has been producing cars for 25 years in country M. It uses flow production with modern technology, such as robots, to manufacture the cars. This allows each car to be produced to the exact requirements of the customer who ordered it. To do this, each car has a bar-code that indicates how it is to be produced with slight differences from the next car. For example, one car may have black paint and 2 doors and the next car red paint and 4 doors.\n\nThe quality method used is quality control. The Operations manager believes that without a good reputation the business would fail. She knows that technology is important to keep the business efficient and competitive.\n\nSC employs 300 workers on the production line. There are two shifts each day: an early shift of 8 hours and a late shift of 8 hours. There is a 6-day working week. Few holidays are allowed apart from national holidays. The workers complain that the working conditions are not good.\n\nThe directors want the business to expand by starting to export cars to nearby countries. Finance is available for this expansion.",
    "appendices": [
      {
        "label": "Appendix 1",
        "body": "         Advert for SC produced by an advertising agency\n SC Cars\n                                    Fast\n                                    Fuel efficient\n                                  Suitable for all the family\n                                  Better than imported cars\n                         Loans available for the purchase of a new car\n               Car insurance free for a year\nVisit your local car showroom today to see our new range of cars."
      },
      {
        "label": "Appendix 2",
        "body": "                 Financial information for SC ($m)\n                                        2015                    2016\nRevenue                                 200                     250\nCost of sales                           160                     210\nExpenses                                 30                      30\nCapital employed                          40                     50\nOf which:\nLong-term bank loans                      20                     30\nAverage share price for SC        $14 per share             $15 per share"
      },
      {
        "label": "Appendix 3",
        "body": "                Graph of car\n                   Graph  of sales in selected\n                             car sales         countries\n                                       in selected       2015–2018\n                                                   countries 2015 – 2018\n                                                                              country L\n         300\n         250\nnumber of 200\ncars sold                                                                     country M\n (000’s)                                                                      country K\n          150\n         100                                                                  country J\n            0                                                                      time\n                        2015           2016              2017           2018\n                                                      (forecast)     (forecast)"
      }
    ]
  },
  "0450/22|2018|May/Jun": {
    "businessTitle": "Downtown Hotel (DH)",
    "mainCase": "Downtown Hotel (DH) is small hotel with 39 employees. It is a private limited company set up by Hilda 9 years ago in country X. Hilda owns 80% of the shares and the capital employed in the business is $100 000. It has been very successful with profit increasing each year. The demand for hotel accommodation in country X is also growing.\n\nDH is located next to the beach in Downtown. Half of the hotel rooms are booked for 6 months of the year and all the rooms are booked for 4 months of the year. DH is empty for the remaining 2 months as the weather is very bad. Most of the guests that stay at the hotel are tourists from country X on coach (bus) tours. Hilda thinks she needs to attract hotel guests all year round.\n\nA lot of litter is left on the beach next to the hotel and Hilda does not think she should pay to keep it clean. Local people also use the beach and it can be very busy, leading to hotel guests complaining about overcrowding and the amount of litter such as empty drinks bottles.\n\nHilda wants to expand the company by taking over another hotel. There are two hotels nearby that are for sale: ABC Hotel and XYZ Hotel.\n\nABC Hotel\n\nThis has been owned by a local family for over 30 years. It has not been redecorated for many years and needs updating if it is to attract tourists from other countries. The estimated cost of updating the hotel is $50 000. The hotel is for sale at a price of $100 000 as it is in a good location on the beach.\n\nXYZ Hotel\n\nThis is a modern hotel and has recently been redecorated to a high standard. The hotel is located in the centre of Main City which is 50 km from Downtown. It is near to restaurants, a train station and the airport. It is for sale at a price of $200 000. Technology is widely used in the hotel such as a computer based booking system and electronic key cards to access rooms and elevators.",
    "appendices": [
      {
        "label": "Appendix 1",
        "body": "                               Organisation chart for Downtown Hotel\n                                        Hilda\n                                      (General\n                                      Manager)\n Administration                  Hotel                                        Restaurant\n   Manager                      Manager                                        Manager\n                   Head          Head             Room            Head          Head             Bar\n                   Porter     Receptionist       Cleaning         Chef          Waiter        Supervisor\n                                                Supervisor\nFinance Clerks     Porters    Receptionists      Room           Kitchen         Waiters        Bar Staff\n     (2)             (3)          (2)           Cleaners       Assistants        (5)             (6)\n                                                   (7)             (5)"
      },
      {
        "label": "Appendix 2",
        "body": "Summary of financial information on the two hotels\n                            ABC Hotel         XYZ Hotel\n Non-current assets          $80 000           $150 000\n Current ratio                   3                 1\n Acid test ratio                 2                0.5"
      },
      {
        "label": "Appendix 3",
        "body": "From: Hilda\nTo: Hotel Manager\nI want to attract customers from abroad but none of our employees speak foreign languages. We\nshould set up our own hotel website so that customers from country X and other countries can\neasily make bookings at the hotel. This would help to increase demand for our hotel rooms at a\ntime when fewer people are demanding coach (bus) holidays.\nGuests from other countries expect additional facilities such as a gym and swimming pool but these\nare expensive. We could encourage local people to use the hotel by adding a café with access to\nthe hotel facilities and encourage weekend breaks at discount prices during quieter times of the\nyear."
      }
    ]
  },
  "0450/22|2019|May/Jun": {
    "businessTitle": "Wood Additions (WA)",
    "mainCase": "WA is a small private limited company that makes high-quality wooden furniture. It was started 10 years ago by the Singh family. Two brothers and one sister are the only shareholders and they are also the directors of the company. They carry out all the management functions in the business and there are two office workers to support them. As WA is a small business it buys in services from other businesses such as transport companies.\n\nWA makes many different designs of wooden furniture. WA only buys wood from forests that use sustainable methods so that new trees are planted when others are cut down. The cost of this wood is high but the directors think that this cost is justified as WA aims to be environmentally friendly.\n\nWA employs 20 highly skilled production workers in the factory. Each worker specialises in one task. All employees in the factory and the office are paid an hourly wage that is 10% above the legal minimum wage.\n\nWA uses batch production for most furniture designs with machinery that was purchased when the business was started. WA uses cost-plus pricing and has an average selling price of $200 per item of furniture. This price is higher than many of its competitors. Each year WA introduces new designs of furniture. In 2018, WA’s profit fell and the directors are worried about this. The directors want to increase productivity as a way to improve profit. The Operations Director is considering purchasing computer-controlled machines.\n\nIndividual furniture designs, when requested by a customer, are made using job production. These items of furniture have an average selling price of $250. Each item takes twice as long to make as the furniture made by batch production.",
    "appendices": [
      {
        "label": "Appendix 1",
        "body": "                                Advertisement for WA furniture\n                          All our furniture is up to date and modern.\n                      Buy WA furniture and be the envy of your friends.\n     Special promotion – buy two pieces of furniture and get a third one for half price.\nSign up to our list of satisfied customers and receive information and discounts on our new range\n                                             of furniture."
      },
      {
        "label": "Appendix 2",
        "body": "Market share of furniture manufacturers in 2018\n                  WA\n                  10%\n  company C\n     15%\n                                     company A\n                                       50%\n      company B\n         25%"
      },
      {
        "label": "Appendix 3",
        "body": "                                2018 cost information for WA\n                                                                         $\nAverage cost of wood per item of furniture                              100\nRent of factory per month                                              1200\nOther expenses per month                                                800\nWage costs per month                                                   4000\nAverage number of items of furniture produced per\n                                                                        100\nmonth"
      }
    ]
  },
  "0450/22|2020|May/Jun": {
    "businessTitle": "Eco Scooters (ES)",
    "mainCase": "ES makes scooters (small motorcycles) which are sold in country Z. ES is a public limited company which was founded 40 years ago. It has grown by taking over other smaller scooter manufacturers. This meant that ES could use the factories and skilled employees of these other businesses. ES is now planning to take over another scooter manufacturing business based in country Z, either company ABC or company FGH. Financial information about these companies is shown in Appendix 1.\n\nCurrently ES uses a flow production method with many workers and only a few machines. The work is boring and employees have to work long hours doing the same job. However, wages are calculated by using time rate and this is higher than the legal minimum wage. There are no other financial rewards for the workers.\n\nES currently has 30% market share in country Z. It is planning to export its products and has drawn up a business plan for this expansion. This plan includes the promotion methods ES is considering for its scooters in export markets. To start exporting, ES will have to increase production. It needs to recruit 100 additional production workers and invest $10m in new technology production machinery. This should ensure higher output as well as higher productivity.",
    "appendices": [
      {
        "label": "Appendix 1",
        "body": "      Financial information (2019) for the two companies ES is planning to take over.\n                                  ABC Company                         FGH Company\nRevenue                           $100m                               $400m\nCost of sales                     $50m                                $160m\nExpenses                          $40m                                $210m\nReturn on Capital Employed\n                                  20%                                 25%\n(ROCE)\nCurrent ratio                     2                                   3\nAcid test ratio                   1                                   1.5"
      },
      {
        "label": "Appendix 2",
        "body": "                           Article in the national newspaper\nMain News 10 April 2020\nThe economy of country Z has grown rapidly over the last 5 years and incomes are high. This has\nresulted in inflation. The Government is now taking action to stop inflation rising any further.\nUnemployment has now started to increase. This has been welcomed by some businesses but not\nall. The demand for luxury products is likely to fall if unemployment continues to rise."
      },
      {
        "label": "Appendix 3",
        "body": "                               Email to Managing Director\nTo: Managing Director\nFrom: Finance Director\nDate: 20 April 2020\nRe: New laws\nThe Government has introduced many new laws that will have an impact on ES. These legal controls\ninclude those affecting consumer protection, location decisions and environmental protection. We\nwill have to consider how each of these new laws will affect our costs and operations.\nPlease make sure you have carried out a full analysis of what these changes will mean for ES."
      }
    ]
  },
  "0450/22|2021|May/Jun": {
    "businessTitle": "Tandeep Toys (TT)",
    "mainCase": "Tandeep is planning to set up a toy shop in country Z. He worked for a toy manufacturer for 10 years. Tandeep thinks he has enough knowledge of toys and customer needs to start his own business.\n\nTandeep plans to sell a large range of toys which will include products for all ages of children from babies through to teenagers. The toys will all be well known brands and aimed at higher income groups. The most popular product is likely to be toy cars. Tandeep also plans to sell a range of accessories for babies such as pushchairs (strollers) which he may have to import. Making sure there is inventory to always meet demand is very important to the success of TT.\n\nTandeep has a loan of $40 000 from his family to invest in the business. He wants to set up as a private limited company. He knows that he will need working capital to run his business. He may offer credit to some customers for more expensive items such as nursery furniture. Tandeep knows that there are several legal controls to protect consumers.\n\nTandeep has been looking at locations for his toy shop. He has identified two locations to choose between as outlined in Appendix 1.\n\nTandeep will need to recruit several employees to work in his shop. He plans to recruit a shop manager and 5 sales assistants. Tandeep will carry out all the administration. As part of the recruitment process he will need to produce job descriptions, job specifications and then shortlist applicants.",
    "appendices": [
      {
        "label": "Appendix 1",
        "body": "                            Two possible locations for Tandeep’s shop\nLocation A\nThe shop is located in a popular shopping mall in the city centre. Parking is expensive and the rent\nis high. The mall is open from 8.00 to 22.00 every day. There are several other toy shops located\nin the mall as well as banks, a cinema and children’s playground.\nLocation B\nThe shop is located on a busy street in a local town. There are many other shops and a street\nmarket in the area. Local people frequently visit the shopping area to buy food. Parking is always\navailable and is free. The rent is low. There are no other toy shops in the town."
      },
      {
        "label": "Appendix 2",
        "body": "                       Information on channels of distribution for toy cars\n                                          Wholesaler in country Z       Manufacturer in country Z\nUnit cost of toy car                      $15                           $5\nDelivery time for orders                  1 day                         4 weeks\nMinimum quantity that must be ordered 10 units                          1000 units\nTrade credit                              1 month                       3 months"
      },
      {
        "label": "Appendix 3",
        "body": "             Cash-flow forecast for the first 6 months of trading for TT ($)\n             July         Aug            Sept            Oct        Nov        Dec\nCash sales   600          1 000          1000            1 000      2 000      2 000\nRent and\n             500          500            500             500        500        500\nwages\nPurchases of\n             300          100            100             100        100        100\ninventory\nShop\n             40 000\nequipment\nNet flow     (40 200)     400            400             400        1 400      1 400\nOpening\n             40 000       (200)          200             600        1000       2 400\nbalance\nClosing\n             (200)        200            600             1 000      2 400      3 800\nbalance"
      }
    ]
  },
  "0450/22|2022|May/Jun": {
    "businessTitle": "Titantic Toys (TT)",
    "mainCase": "TT is a large manufacturer of toys based in country Y. It is a public limited company and has been trading for 20 years. TT’s products are designed for children up to the age of 5.\n\nTT has benefited from economies of scale as it has grown. The company has been able to buy specialist new equipment for the flow production line in its factory. TT’s factory uses lean production methods, such as Kaizen and just-in-time inventory control. All of its employees are well-motivated and few leave each year. The company provides training for employees in all departments of the business whenever there are any changes such as introducing new equipment or new products.\n\nCurrently, TT only sells its products in country Y but it plans to expand into country Z and become a multinational company. TT could buy a toy manufacturer located in country Z or build its own factory there. The government of country Z will need to give permission for TT to build a new factory. Either option will cost $10 million. The directors are worried about liquidity as TT expands.\n\nTT has developed a new toy for children under 5. The toy is a soft, easy to hold doll which speaks 4 different languages. The Marketing Director thinks this new toy will help TT expand into country Z, as there are no other products like it in that country. TT is recruiting a new Marketing Manager for country Z. Details of the shortlisted applicants are in Appendix 3.\n\nThe marketing department has already carried out research in country Z and some results are shown in Appendix 1.",
    "appendices": [
      {
        "label": "Appendix 1",
        "body": "Market research results for country Z"
      },
      {
        "label": "Appendix 2",
        "body": "          Extract from TT’s statement of financial position, 2021 and 2022 (at 31 March)\n                                                                     2021 ($m)                                           2022 ($m)\nInventories                                                                 5                                                   5\nAccounts receivable (debtors)                                               5                                                   8\nCash                                                                        0                                                   2\nAccounts payable (creditors)                                                4                                                   5\nBank overdraft                                                              1                                                   0\nLong-term bank loans                                                        5                                                  10\nTotal Shareholder’s equity                                                 40                                                  50\nCurrent ratio                                                               2                                                   ?\nAcid test ratio                                                             1                                                   ?"
      },
      {
        "label": "Appendix 3",
        "body": "                             Three applicants for Marketing Manager for country Z\n                                Labiba                                   Shahin                                      Samihah\n                                                                         5 IGCSEs and 2 A levels\n                                10 IGCSEs and 3 A levels                                                             8 IGCSEs\nQualifications/Skills                                                    Degree in Business\n                                Speaks 2 languages                                                                   Speaks 6 languages\n                                                                         Management\n                                                                                                                     10 years as the\n                                5 years working for TT as 2 years as the Marketing\n                                                                                                                     Marketing Manager of a\nExperience                      the Assistant Marketing   Manager of a small food\n                                                                                                                     large toy company in\n                                Manager in country Y      company in country Z\n                                                                                                                     country Y"
      }
    ]
  },
  "0450/22|2023|May/Jun": {
    "businessTitle": "Everyone Theatre (ET)",
    "mainCase": "Zane and Zaara are both actors. They plan to start up a theatre in a low-income area of Main City. Zane and Zaara believe that helping the community is as important as being successful entrepreneurs.\n\nThe theatre will be a private sector business and Zane and Zaara have to decide whether to start up as an unincorporated business (partnership) or as a limited company. Zane is planning to prepare a cash-flow forecast for the first year. Zaara knows they will need to set business objectives for the theatre and also decide on a leadership style to use when managing employees. ET will have 24 part-time employees as shown in the organisational chart in Appendix 1.\n\nZane and Zaara plan to put on performances in the evenings for local people and tourists. There will be 100 seats in the theatre but not all the seats will be sold if the price is too high. The Marketing Manager, Zaara, will need to decide which performances to put on, what price to charge and which refreshments to sell. Zaara will also need to decide between the two possible options for the first performance when the theatre opens. Information on the two options is shown in Appendix 2.\n\nIn the daytime the theatre building will be used by Daycare, a local social enterprise. Daycare takes care of young children up to the age of 5 so that low-income family members can go out to work. It also provides education for the children which helps their development and progress before they start school. Some of Daycare’s objectives are different to those of ET.",
    "appendices": [
      {
        "label": "Appendix 1",
        "body": "                           Proposed organisational chart for the theatre\n                Marketing Manager (Zaara)                            Finance and Administration\n                                                                          Manager (Zane)\n      Backstage e.g.        Actors        Promotion                   Cleaners       Ticket office\n      costumes and           (10)            (2)                         (3)             (3)\n         scenery\n           (6)\nNote: The numbers in brackets are the number of part-time employees who work in each department."
      },
      {
        "label": "Appendix 2",
        "body": "       Forecast data for the two possible options for ET’s first performance at the theatre\nFor each performance                                       Option 1                 Option 2\nNumber of actors/employees                                        7                   24\nAverage wage cost per actor/employee                             $30                  $10\nAll other costs including scenery, costumes and\n                                                                $1000                $2000\npromotion\nForecast revenue assuming all 100 seats are sold                $1000                $2500"
      },
      {
        "label": "Appendix 3",
        "body": "                                    Email from Zane to Zaara\nTo: Zaara\nFrom: Zane\nDate: 1 April 2023\nWe want to support the local community and we need to make decisions about the following.\nShould we:"
      }
    ]
  },
  "0450/22|2024|May/Jun": {
    "businessTitle": "Jems Jewellery (JJ)",
    "mainCase": "JJ is a large manufacturer of jewellery such as bracelets, earrings and rings. JJ was set up 25 years ago in country X and is a public limited company. One of JJ’s objectives is for the business to expand and another objective is to increase profit each year.\n\nJJ manufactures all its jewellery in a factory in country X. All raw materials are purchased from local suppliers. JJ has 60 full-time and 25 part-time employees to make the jewellery. Most of these employees are skilled.\n\nJJ’s jewellery is beautiful but not expensive and therefore affordable for many people. The business has many competitors. JJ currently sells 70% of its products in country X through jewellery shops. The other 30% are sold using ecommerce and sold directly to customers in other countries. Demand for JJ’s jewellery is continuing to increase.\n\nJJ’s Marketing Manager is planning to launch a new item of jewellery in country X and needs to choose between two products. Information on these two products is shown in Appendix 1. They will also need to decide the most effective way to promote the new product in country X.",
    "appendices": [
      {
        "label": "Appendix 1",
        "body": "                  Information to calculate break-even for Product A and Product B\n                                                          Product A                 Product B\nType of product                                   Bracelet                   Ring\nFixed cost for each product per week              $50 000                    $50 000\nSelling price per product                         $50                        $120\nVariable cost per product                         $25                        $40\nForecast sales per week                           2500                       750"
      },
      {
        "label": "Appendix 2",
        "body": "                        Newspaper article from Main City News in country X\nAfter several years of economic growth the government is predicting a change in the economy this year.\nUnemployment is forecast to increase from 3% to 6% by the end of the year. Increases in unemployment\nare expected to continue for the next two years. Many businesses will be affected by this increase."
      },
      {
        "label": "Appendix 3",
        "body": "                      Email from Managing Director to Operations Director\nTo: Operations Director\nFrom: Managing Director\nDate: 1 May 2024\nPressure groups have identified two environmental issues when we manufacture our jewellery.\nThese two environmental issues are:\nmanufacturers also use coal. We know the price of coal is increasing and will continue to increase in\nthe future. However, the government in country X is encouraging businesses to invest in solar panels\nand is providing a 25% grant.\nthese mines cannot be returned to agricultural use after the mine is closed. However, pressure groups\nhave told us that we can buy gems from suppliers that use alternative ways of mining which do not\ndamage the environment. These mines are further away from our factory.\nWe need to respond to these issues or our sales and profit may be affected."
      }
    ]
  },
  "0450/21|2026|May/Jun": {
    "businessTitle": "Youth Clothes (YC)",
    "mainCase": "Ashanti has just completed a degree in business studies at university. She plans to start up her own clothes shop called YC in Main City in country X. Ashanti will be a sole trader and thinks she has the right characteristics to be a successful entrepreneur. Her target market is customers between 16 and 30 years of age.\n\nAshanti has written a business plan to help her when she starts YC. She has $20 000 in savings which she could invest in the business. Ashanti needs to decide whether to use owners’ savings, a bank loan or leasing to purchase the equipment for her shop.\n\nAshanti will employ an assistant manager and 3 more people to help her in the shop. She knows that legal controls over employment may benefit her employees. Ashanti wants to make sure her employees will be motivated, and she needs to decide the best way to do this.\n\nAshanti needs to decide on the product range to sell in her shop. Appendix 3 contains financial information about the two product ranges she is considering selling. Ashanti will only sell one of these product ranges when she first opens her shop and must decide which one to choose.",
    "appendices": [
      {
        "label": "Appendix 1",
        "body": "       Email from Ashanti’s friend to Ashanti\n       To:                       Ashanti\n       From:                     Ashanti’s friend\n       Date:                     2 April 2026\n       The marketing mix you choose for YC will be important to the success of your clothes shop. Most\n       people in country X live in Main City and 40% are in the 16 – 30 age group.\n       Here are my suggestions for the two elements of the marketing mix that you have asked me\n       to consider:\n       Let me know if you think these would be suitable as part of the marketing mix for the new shop.\n0450/21                       · papacambridge.com\n        Insert June 2026 | Source:  papacambridge.com                                                                                   0450/21 Insert June 2026"
      },
      {
        "label": "Appendix 2",
        "body": "Newspaper article in Main News, May 2026\nGood news for businesses and the unemployed!\nThe latest government report forecasts economic growth of 4% in country X, as the economy moves\ninto the boom stage of the business cycle.\nInterest rates are expected to increase from 2% to 5% in the next few months as the government tries\nto stop the economy growing too quickly."
      },
      {
        "label": "Appendix 3",
        "body": "       Forecast information about the two product ranges YC could sell\n                                                                                                                product range A                  product range B\n           average selling price                                                                 $50                                       $25\n           fixed cost per year                                                                   $30 000                                   $30 000\n           variable cost per item                                                                $30                                       $18\n           number of sales in the\n                                                                                                 3000                                      10 000\n           first year\n0450/21                       · papacambridge.com\n        Insert June 2026 | Source:  papacambridge.com                                                                                                              0450/21 Insert June 2026"
      }
    ]
  },
  "0264/02|2027|2027 specimen": {
    "businessTitle": "Tasty Treats (TT)",
    "mainCase": "Tasty Treats (TT) was founded ten years ago by two university friends as an equal partnership. Six years later, after reaching 20 retail outlets, the partners converted TT into a Private Limited Company (Ltd) to protect personal wealth and raise equity capital from three angel investors. Today, TT owns and operates 50 cafes across Country X. The founders remain majority shareholders and serve as Managing Director and Operations Director.\n\nTT has built a reputation for high-quality, premium desserts (such as Belgian chocolate ganache tortes and artisan fruit tarts) prepared offsite by a central bakery and delivered daily to each cafe. Cafe customers are predominantly middle-to-high income professionals and families seeking a relaxed, luxury dining experience. \n\nThe directors have approved an ambitious plan to open TT's 51st cafe in New Town, a rapidly growing commercial centre. This flagship site requires an initial capital investment of $500,000 for premises lease, commercial espresso machinery, temperature-controlled display refrigeration, and interior decoration. The directors must decide how to conduct market research in New Town, how to staff the site, and how to finance the project amidst tightening bank credit.\n\nEach TT cafe operates 7 days a week, from 08:00 to 20:00. The proposed New Town cafe will require 1 full-time cafe manager (annual salary $42,000) and 10 hourly cafe assistants. \n\nCurrent Operational & Cost Data for TT cafes:\n• Each dessert is purchased from TT's central wholesale supplier at a variable cost of $4.00 each.\n• Desserts are sold to retail cafe customers at an average selling price of $8.00 each.\n• Average weekly fixed overhead costs per cafe (rent, business rates, insurance, depreciation of fixtures): $1,000.\n• Total weekly variable costs per cafe: $20,000 when operating at current average volume of 5,000 desserts sold per week.\n\nHuman Resources and Staff Retention Challenges:\n• Cafe assistants are paid $14.00 per hour. Country X's legal statutory minimum wage is $12.00 per hour.\n• Despite above-minimum pay, TT's employee turnover across its 50 cafes reached 22% last year (industry average is 15%).\n• Exit interviews reveal that staff feel their work is repetitive and that store managers give little recognition.\n• The Human Resources Manager has proposed two motivational initiatives:\n  - Initiative 1: An 'Employee of the Month' scheme for each cafe, giving the winning worker public recognition and a $20 voucher for TT desserts.\n  - Initiative 2: 'Job Enrichment', redesigning assistant roles so they take responsibility for inventory orders, visual merchandising, and customer complaint resolution.\n\nCompetitor and Marketing Context in New Town:\nNew Town has three established boutique coffee houses and two franchise dessert parlours. To understand customer preferences, TT is evaluating three research methods:\n1. Analysing competitor websites and social media channels for pricing, menu offerings, and promotional campaigns.\n2. Organising two focus groups composed of local New Town office workers and university students.\n3. Conducting physical observational research outside competing cafes to record footfall, peak visiting times, and customer age demographics.\n\nEnvironmental Packaging Strategy:\nTT currently distributes takeaway cakes and hot beverages in single-use plastic containers and plastic-lined cups. In response to consumer pressure groups, TT is considering switching all 50 cafes to 100% biodegradable and recyclable cardboard packaging. This will increase packaging costs by $0.25 per customer order but will align TT with growing green consumerism.",
    "appendices": [
      {
        "label": "Appendix 1",
        "body": "Appendix 1: Extract from TT's Statement of Financial Position (at 31 March 2024 and 31 March 2025)\nOfficial balance sheet comparison for Tasty Treats Ltd (all figures in millions of dollars $m).\n\nNon-current assets (cafes, equipment): 2024=$25.0m | 2025=$28.0m\nInventories (ingredients, beverages, packaging): 2024=$10.0m | 2025=$8.0m\nTrade receivables (credit card payments pending): 2024=$3.0m | 2025=$1.5m\nCash and cash equivalents: 2024=$2.0m | 2025=$2.5m\nTotal Current Assets: 2024=$15.0m | 2025=$12.0m\nTrade payables (owed to central bakery supplier): 2024=$5.0m | 2025=$3.0m\nBank overdraft (short-term borrowing): 2024=$0.0m | 2025=$5.0m\nTotal Current Liabilities: 2024=$5.0m | 2025=$8.0m\nNon-current liabilities (long-term bank loans): 2024=$2.0m | 2025=$3.0m"
      },
      {
        "label": "Appendix 2",
        "body": "Appendix 2: Memorandum from Operations Director to Board\n\nTO: Board of Directors, Tasty Treats Ltd\nFROM: Marcus Vance, Operations Director\nDATE: 14 October 2026\nSUBJECT: Operational Metrics and Staffing for New Town Cafe\n\nOpening Cafe #51 in New Town will give us access to 45,000 potential daily customers. However, our reliance on the central commercial bakery means that quality must remain flawless. \n\nOur current cost breakdown for each dessert remains:\n• Purchase price from bakery: $4.00\n• Selling price to consumer: $8.00\n• Weekly fixed overhead per shop: $1,000\n• Typical weekly volume: 5,000 desserts\n\nWe need to decide immediately whether to issue written employment contracts to all 10 incoming cafe assistants in New Town. While our competitor in New Town uses zero-hours contracts without formal paperwork, our HR Manager believes contracts will significantly curb our 22% labour turnover."
      },
      {
        "label": "Appendix 3",
        "body": "Appendix 3: Economic Forecast Report for Country X\n\nThe Central Bank and Ministry of Finance of Country X have released three major economic policy adjustments following a period of economic slowdown:\n\n1. Personal Income Tax: Standard rate cut from 25% down to 20% to stimulate consumer disposable spending.\n2. Business Corporation Tax: Tax on company profits increased from 24% up to 26% to fund infrastructure upgrades.\n3. Monetary Policy & Interest Rates: Benchmark central bank interest rate reduced from 5.0% down to 3.5% to encourage business capital investment."
      }
    ]
  }
};

export function getVerifiedCaseStudy(vq: VerifiedQuestion): VerifiedCaseStudy | null {
  const qNumMatch = /^(\d+)/.exec(vq.question);
  const qNum = qNumMatch ? qNumMatch[1] : "1";
  if (vq.paper === 1) {
    const key = `${vq.paper_code}|${vq.year}|${vq.series}|Q${qNum}`;
    return VERIFIED_PAPER1_CASE_STUDIES[key] ?? null;
  }
  const key = `${vq.paper_code}|${vq.year}|${vq.series}`;
  return VERIFIED_PAPER2_CASE_STUDIES[key] ?? null;
}

export function getVerifiedFullContextText(vq: VerifiedQuestion): string {
  const cs = getVerifiedCaseStudy(vq);
  if (!cs) return vq.case_context || "General Cambridge business scenario.";
  const parts = [
    cs.businessTitle,
    cs.mainCase,
    cs.table || "",
    ...(cs.appendices?.map((a) => `${a.label}:\n${a.body}`) || []),
  ].filter(Boolean);
  return parts.join("\n\n");
}
