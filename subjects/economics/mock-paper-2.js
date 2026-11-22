/* Original case studies grounded in real economic settings. All data are simulated. */
const numberedPaper2 = (() => {
  const marketCases = [
    ['Kenya','Urban maize markets','A dry growing season damages the maize harvest. Merchants supply less maize flour at every price.','maize flour','supply',-1,'grain mills','storage silos','release grain from a public reserve',
      'Releasing reserve grain increases the amount offered for sale and can reduce retail prices. Poor households can then afford more of a staple food.',
      'Replacing the reserve later costs public funds. If a release depresses prices for a long time, farmers may plant less maize, making future shortages more likely.'],
    ['Japan','Commuter rail','An increase in city-centre office attendance raises the number of people wanting to travel by rail.','commuter rail journeys','demand',1,'railway tracks','ticket machines','subsidise additional off-peak trains',
      'The subsidy lowers the effective cost of operating extra trains, so frequency could increase. More travel options may ease crowding and encourage switching from cars.',
      'Extra off-peak trains may do little to reduce rush-hour crowding. The subsidy would divert funds from improvements such as new platforms or maintenance.'],
    ['Spain','Water for horticulture','Farmers install efficient drip irrigation and can produce more peppers at each selling price.','peppers','supply',1,'irrigation pumps','packing machines','charge growers for each unit of water extracted',
      'A charge makes taking an extra unit of water more costly, encouraging farms to repair leaks or use efficient irrigation. Reduced extraction can preserve water for other users.',
      'Growers may have few short-run ways to adjust. The charge can raise costs and food prices while requiring meters and money for enforcement.'],
    ['Ghana','Local cocoa processing','An increase in overseas orders for chocolate raises manufacturers’ purchases of domestically processed cocoa.','processed cocoa','demand',1,'grinding machines','drying racks','offer a grant to new cocoa processors',
      'Grants can help firms pay for equipment and enter processing. More domestic processing could create skilled work and increase export earnings.',
      'The grant has an opportunity cost and may go to plants that would have opened anyway. If weak electricity supply constrains production, cheaper equipment alone may achieve little.'],
    ['Canada','Insulation services','Household heating bills rise, encouraging more homeowners to order loft insulation.','loft insulation services','demand',1,'insulation blowers','work vans','offer subsidies for household insulation',
      'A subsidy makes installation more affordable. Better insulated homes need less fuel, which can lower bills and reduce pollution costs imposed on others.',
      'Some households would have installed insulation anyway. If installers are in short supply, part of the subsidy may raise prices rather than lead to much extra installation.'],
    ['Denmark','Low-emission heating','Factories improve the method of assembling heat pumps, reducing the cost of each unit.','heat pumps','supply',1,'assembly robots','test benches','require all new homes to use low-emission heating',
      'A rule could reduce use of more polluting heating systems and make future emissions lower. A larger market can also encourage investment in supply and worker training.',
      'A requirement raises upfront building costs where alternatives are expensive. A rule can also be inefficient if it forces homes with different needs to adopt costly systems.'],
    ['United Kingdom','Refurbished tablets','Schools buy fewer refurbished tablets after the price of new tablets falls.','refurbished tablets','demand',-1,'battery testers','repair tools','introduce a grant for school repairs',
      'The grant can make repairs cheaper than replacement and extend the lives of school devices. Less disposal reduces waste and its costs to society.',
      'Repairs to very old tablets may offer little useful life and divert resources from other school needs. Limited repair capacity could lead to higher repair prices.'],
    ['Peru','Coastal fishing','Fishers make fewer trips because fuel costs have risen, reducing the fish offered at every price.','fresh fish','supply',-1,'motorboats','ice machines','fund more efficient boat engines',
      'Using less fuel per trip can reduce fishing costs and emissions. Lower costs may help fishing businesses stay open and preserve jobs.',
      'Financial support has a cost to taxpayers. Cheaper trips might increase fishing effort and put extra pressure on fish stocks without effective catch limits.'],
    ['Taiwan','Bicycle exports','Consumers in several overseas markets buy fewer bicycles when their real incomes fall.','bicycles','demand',-1,'welding machines','painting booths','fund training for workers in bicycle factories',
      'Training can make workers more productive and help firms lower unit costs. Transferable skills could also help workers move into other manufacturing jobs.',
      'Lower costs may not restore orders during a broad fall in foreign demand. Some workers may be better helped by training targeted at industries with growing vacancies.'],
    ['Morocco','Desalinated water','A new plant reduces the cost of converting seawater into usable water.','desalinated water','supply',1,'high-pressure pumps','filtration units','require developers to use more recycled water',
      'Reusing water can reduce demand for scarce fresh supplies. It may also reduce pressure to expand costly desalination capacity.',
      'Developers would need extra equipment and treatment to meet safety standards. Higher construction costs could raise rents or reduce new construction.']
  ];

  const firmCases = [
    ['Viet Nam','Furniture factories','Furniture producers sell tables and cabinets to shops at home and abroad.','computer-controlled saws','delivery lorries','introducing computer-controlled saws','cuts the time required to prepare each piece','give smaller manufacturers grants for new machinery',
      'A grant can make productive equipment affordable for credit-constrained firms. More output per hour can reduce unit costs and improve export competitiveness.',
      'Some purchases would happen without support, wasting public funds. Firms without trained operators may gain less from equipment than from investment in skills.'],
    ['Bangladesh','Garment workshops','Workshops make garments to order for overseas buyers.','sewing machines','pressing machines','organising work into separate tasks','reduce the time workers spend changing tools','require firms to raise the minimum hourly wage',
      'Workers who keep their jobs and hours earn more. Better pay may reduce staff turnover and help factories maintain quality.',
      'A higher wage floor may raise unit costs if productivity does not rise. If buyers have close alternatives abroad, orders and factory employment may fall.'],
    ['Italy','Specialist packaging','Packaging firms supply small food producers. Some firms are combining facilities.','label printers','carton cutters','training staff to adjust label printers','reduce stoppages between orders','allow two major packaging suppliers to merge',
      'The merged firm could spread administrative costs and use equipment more fully. It may be able to cut prices if enough competitors remain.',
      'With fewer suppliers, food producers have less choice and may pay more. Smaller customers could lose access to customised orders.'],
    ['Netherlands','Greenhouse growers','Greenhouse businesses grow vegetables for supermarkets.','climate-control units','grading equipment','using better climate controls','reduce crop losses per shift','provide loans for more efficient greenhouses',
      'Loans can help growers finance equipment that lowers heat and water cost per unit. Lower costs can improve competitiveness and reduce resource use.',
      'Repayments may be difficult if vegetable prices fall. Risk carried by government could absorb funds needed for services when loans default.'],
    ['Mexico','Appliance assembly','Appliance manufacturers buy components and sell finished products locally and abroad.','assembly robots','test equipment','using equipment that detects faults earlier','reduce the time needed to rework defective appliances','reduce taxes on machinery imports',
      'Cheaper machinery can encourage investment and raise output per worker. Lower production costs can help manufacturers sell at more competitive prices.',
      'The government receives less tax revenue and may have to cut other spending. Local machinery producers may lose orders when competing imports become cheaper.'],
    ['Poland','Warehouse operations','Online retailers use warehouses to store and dispatch goods.','forklift trucks','barcode readers','introducing barcode readers','reduce the time spent locating orders','fund courses in warehouse operations',
      'Training can help workers complete orders accurately and quickly. Recognised qualifications may also make it easier to find work in other firms.',
      'Courses use money that could pay for other services. Some employers may train their own workers anyway, and poorly matched courses may not increase employment.'],
    ['Sweden','Timber processing','Timber firms process logs into planks and components.','sawing lines','kilns','improving the layout of the production line','cuts the distance workers and materials move between tasks','pay a subsidy to timber processors for each unit produced',
      'The subsidy can reduce effective unit cost and support additional output and employment. Some processors could become more competitive in overseas markets.',
      'Higher output may put pressure on forests and can increase external costs. Paying for every unit also supports output that would have been produced anyway.'],
    ['South Korea','Electronics servicing','Electronics repair businesses service equipment for firms and households.','diagnostic scanners','soldering stations','introducing more accurate diagnostic scanners','reduce unnecessary replacement of working parts and time spent tracing faults','require manufacturers to sell replacement parts to independent repairers',
      'Better access to parts can reduce repair costs and expand consumer choice. More repairs can cut the amount of equipment thrown away.',
      'Providing parts and instructions for every model raises costs. If standards for repairs are weak, poor repairs may create costs or safety issues for consumers.'],
    ['Portugal','Hotel laundries','Laundries wash linen for hotels, some of which ask for deliveries on the same day.','industrial washers','drying machines','installing machines with larger drums','allow more linen to be washed with the same number of worker-hours','offer a subsidy for investment in water-efficient washing equipment',
      'A subsidy can speed up investment and reduce water use per load. Lower water and operating costs can help laundries provide cheaper services.',
      'Some firms would replace their equipment anyway. A subsidy also uses public funds, and laundries could use more total water if lower costs greatly expand output.'],
    ['Czechia','Components for transport','Component manufacturers compete to supply transport companies.','precision lathes','measuring benches','training workers to set up precision lathes','allow more components to be completed before each shift ends','use public funds to support small component makers',
      'Support can help small firms pay for equipment or training and compete with larger rivals. Keeping several viable suppliers can give buyers more choice.',
      'Long-term support can maintain inefficient businesses. The same funds might raise output more if invested in skills or infrastructure that many firms can use.']
  ];

  const labourCases = [
    ['Ireland','Care-sector recruitment','Care providers have vacancies for experienced staff. Added demand has pushed up pay in several areas.','care workers','rising',3,'introduce an employment grant for care providers',
      'The grant reduces the effective cost of employing staff, encouraging firms to add posts or improve shift coverage. More staff could allow more patients to receive care.',
      'If few qualified applicants are available, providers may compete for the same workers. Paying for posts that would already exist adds cost without increasing staffing.'],
    ['Finland','Employment after factory closures','Factory closures have reduced demand for some production skills. Displaced workers are searching for new jobs.','production workers','falling',2,'subsidise retraining for displaced workers',
      'Lower training fees allow more workers to gain skills demanded by expanding employers. Vacancies can be filled and structural unemployment can fall.',
      'Training takes time and cannot create vacancies by itself. People who cannot travel to new employers may still face unemployment after qualifying.'],
    ['Australia','Building-trade vacancies','Demand for new homes grows and builders seek more qualified workers.','construction workers','rising',4,'recognise relevant construction qualifications gained abroad',
      'Workers with equivalent qualifications can fill vacancies sooner. A larger available workforce can let firms complete more homes and relieve some wage pressure.',
      'Qualifications may not match all local standards, so verification and bridging courses use resources. Workers also need housing and services where shortages can already exist.'],
    ['South Africa','Work and commuting','Several local firms lose orders while some residents find new jobs beyond their own district.','manufacturing workers','falling',3,'subsidise travel to work for low-income residents',
      'Lower commuting costs make more vacancies worth accepting. Access to a wider labour market can increase employment and household earnings.',
      'Public funds are needed and some recipients would commute anyway. Cheaper travel will do little where the main problem is a shortage of jobs or suitable skills.'],
    ['Germany','Training for new machinery','Factories installing new machinery need technicians with specialist training.','maintenance technicians','rising',5,'co-finance technical apprenticeships',
      'Lower training costs encourage firms to accept more apprentices. As trained workers become available, firms can fill vacancies and keep machinery running.',
      'Apprentices take time to qualify, so subsidies do little for immediate shortages. Some firms may claim payments for places they already planned.'],
    ['Greece','Off-season hotel work','Fewer rooms are booked during the winter, and hotels offer fewer shifts.','hotel workers','falling',4,'fund events intended to attract visitors in winter',
      'More winter visitors can extend the season and create extra demand for hotel labour. Workers may receive steadier incomes.',
      'Events can be costly and may attract few additional visitors. The same funds could support year-round industries or help workers transfer to other jobs.'],
    ['France','Childcare and work','New services have opened in several towns. Some employers are trying to recruit trained childcare workers.','childcare workers','rising',2,'fund additional places on childcare training courses',
      'More training can enlarge the supply of qualified workers, helping providers to expand. Additional childcare can also enable more parents to work.',
      'Funded courses require trainers and money, and supply responds slowly. Where pay or hours drive workers away, extra qualifications alone may not close vacancies.'],
    ['Romania','Work in clothing production','Orders from large retailers have fallen and garment workshops are cutting shifts.','garment workers','falling',5,'temporarily reduce payroll taxes for employers',
      'A tax reduction lowers the cost of retaining workers. It may prevent some dismissals while demand is temporarily weak.',
      'If orders fall permanently, tax relief may delay movement into growing industries. It also reduces revenue that could be used for retraining or income support.'],
    ['Singapore','Jobs in freight handling','Warehouses and freight firms receive more orders and look for more logistics staff.','logistics workers','rising',3,'expand funded courses in logistics',
      'Training can give job seekers qualifications needed to fill vacancies. Firms can expand without being held back by a shortage of trained workers.',
      'Courses use public money and do not provide staff immediately. Firms may recruit successfully without the policy, reducing its additional benefits.'],
    ['Argentina','Manufacturing employment','Domestic orders for some manufactured goods weaken. Employers reduce overtime and recruitment.','assembly workers','falling',2,'increase government purchases from domestic factories',
      'New orders can encourage factories with spare capacity to raise production and retain workers. Employees’ spending can also support other local firms.',
      'Funding the purchases creates an opportunity cost or increases borrowing. If factories cannot deliver economically in the longer run, the employment gain may disappear when purchases stop.']
  ];

  const developmentCases = [
    ['India','Electricity in rural districts','New electricity connections allow small firms to run equipment for longer periods. Some clinics can now operate refrigerators reliably.','workshop production','access to health services','better access to electricity','helps clinics keep medicines at the required temperature','subsidise grid connections for remote households',
      'Affordable connections can improve access to lighting and refrigeration and allow more small businesses to use equipment. This may raise productivity and incomes in isolated areas.',
      'Remote connections are costly where households are far apart. Funds could instead support stand-alone power systems or services with greater benefits per household.'],
    ['Rwanda','Transport to produce markets','Some villages are improving roads to town markets. Farmers say spoiled produce and travel delays have fallen.','sales of farm produce','travel time to health services','better rural roads','allow patients to reach clinics more quickly','increase spending on local roads',
      'Roads reduce losses and the cost of moving goods, making more farm sales profitable. Better access to work and services can raise rural living standards.',
      'Construction and maintenance use funds that could improve schools or clinics directly. Roads alone may achieve little where poor households lack vehicles or affordable transport.'],
    ['Costa Rica','Nature tourism','Communities near parks have opened small accommodation businesses. Visitor revenues help support conservation jobs.','income from visitor services','employment opportunities','visitor spending on guides','creates paid work for local residents','restrict the number of visitors allowed in a popular park',
      'A limit can protect natural assets and reduce congestion or damage. Preserving the park can sustain tourism-related income in the longer run.',
      'Fewer visitors reduce current demand for guiding and accommodation. The loss of work may be substantial for workers who have few other sources of income.'],
    ['Indonesia','Transport for island communities','A ferry route connects island communities to a larger market and a hospital. Operating the route requires vessels and trained crews.','market access for island firms','access to health services','the ferry connection','makes hospital journeys possible for more residents','subsidise regular passenger ferry services',
      'Cheaper fares can improve access to work, education and medical services. Regular journeys can also help small producers find customers on other islands.',
      'Operating subsidies can be expensive on lightly used routes. The government could spend the same funds on services delivered on the islands, with fewer journeys needed.'],
    ['Brazil','Reliable access to clean water','Some districts are repairing water systems that supplied water only intermittently. Employers report fewer workdays lost to illness after repairs.','hours of work lost to illness','household access to safe water','more reliable safe water','reduce illness that can keep workers away from their jobs','provide basic household water at a subsidised price',
      'Affordable clean water can reduce illness and improve attendance at work or school. These benefits extend beyond the household when reduced illness improves community health.',
      'Underpriced water can encourage waste and make it harder to pay for repairs. A universal subsidy can also give larger benefits to households that use more water.'],
    ['Nepal','Secondary education in remote districts','Some students have to travel far to the nearest secondary school. Employers report difficulty recruiting workers with basic technical skills.','potential earnings','access to secondary education','improved access to secondary education','allow more students to gain skills valued by employers','fund transport for students in remote areas',
      'Lower travel costs can increase attendance and allow more students to gain qualifications. Better skills can improve later earnings and productive capacity.',
      'Transport support uses funds that could improve teaching or school facilities. It may achieve little if families still need children’s contribution to household work.'],
    ['Philippines','Local health and work','Mobile clinics visit communities that have few permanent medical facilities. Businesses report that illness affects the number of days worked.','productive days worked','access to regular health checks','earlier treatment at mobile clinics','reduce the time some workers are unable to work','expand a publicly funded mobile clinic programme',
      'Mobile clinics can reach patients who would delay treatment because travel is hard. Earlier treatment may improve wellbeing and reduce work or school time lost.',
      'Mobile teams require staff who might otherwise work in permanent facilities. Some conditions need equipment that mobile services cannot provide.'],
    ['Tunisia','Skills for new services','Employers offering digital services report difficulty recruiting workers with particular qualifications. Some job seekers cannot afford relevant training.','earnings from new service jobs','access to recognised training','a recognised digital qualification','enables some workers to apply for better-paid jobs','provide grants for digital skills training',
      'Financial support can allow unemployed workers to gain recognised skills. Better matching can fill vacancies and raise household incomes.',
      'Training may not lead to jobs if courses do not match changing requirements. Funding would have another use, such as improving access to transport or basic education.'],
    ['Egypt','Affordable urban housing','Some households live far from growing employment centres. New housing is planned near transport links.','household earnings opportunities','access to transport','better transport connections','allow residents to reach more employers within a suitable journey time','build publicly funded housing near major transport links',
      'Lower housing and commuting costs may help low-income workers access more jobs. Being closer to services can also save time and improve living standards.',
      'Urban land has competing uses and construction is expensive. If homes are poorly allocated or take years to build, targeted support or improvements to existing areas may help sooner.'],
    ['Thailand','Care in an ageing society','Some households reduce working hours to care for older relatives. Local authorities are considering expanded daytime care.','working time available to families','access to older-person care','additional daytime care','allow some family carers to take paid work','fund daytime care places for older residents',
      'Care services can improve wellbeing and enable some relatives to return to paid work. More employment can raise household incomes and tax revenue.',
      'Care costs require funding and trained staff. Some areas with severe staff shortages may gain more from support for home care or worker training.']
  ];

  const tradeCases = [
    ['Chile','Copper exports','Mining companies supply copper to overseas customers. Local machinery suppliers sell equipment to these companies.','copper','export contracts','port services','mining output','fund export promotion for other industries',
      'Developing additional exports can make export income less dependent on the price of copper. New activity can also provide more varied employment opportunities.',
      'Promotion costs public funds and may have little effect if other sectors lack skills or scale. Maintaining efficiency in an established export industry might offer larger short-term gains.'],
    ['Malaysia','Manufacturing in global supply chains','Domestic factories assemble goods for customers abroad and import some of their components.','electrical goods','component contracts','freight services','manufacturing output','reduce tariffs on imported components',
      'Cheaper inputs can reduce domestic firms’ production costs and improve the price competitiveness of exports. Increased sales can support output and employment.',
      'Local component producers can lose orders and government tariff revenue can fall. Benefits depend on whether manufacturers can expand and how much of the savings they retain.'],
    ['New Zealand','Dairy trade','Milk processors sell dairy products at home and overseas. They pay for transport and some imported equipment.','dairy products','cargo bookings','transport services','processing output','pay for producers to enter new overseas markets',
      'Access to additional markets can raise sales and make processors less dependent on demand in one country. Higher output can spread fixed costs over more units.',
      'Taxpayers may finance marketing that firms would have undertaken anyway. Production may also be constrained or impose environmental costs as it grows.'],
    ['Colombia','Coffee and overseas demand','Growers export coffee through local processors. Cafés and retailers abroad buy the final product.','coffee','grower contracts','processing services','coffee output','subsidise domestic processing before export',
      'Local processing can increase the value of each exported unit and create jobs beyond growing. It may help firms develop brands and new skills.',
      'Subsidies can support processing that is relatively costly compared with foreign producers. The extra jobs and earnings may be too small to justify public expenditure.'],
    ['Norway','International seafood sales','Seafood exporters sell to buyers in several currencies and use locally provided transport and cold storage.','seafood','cold-storage contracts','transport services','seafood output','offer financial support for exporters to meet overseas standards',
      'Support can reduce the cost of meeting different standards and make it possible for smaller firms to reach new customers. A wider market can raise sales and employment.',
      'Businesses that can already meet the standards may receive unnecessary support. Spending on broad infrastructure or training may help a larger range of firms.'],
    ['Kenya','Horticultural exports','Growers sell flowers abroad. Freight capacity is important because flowers cannot be stored for long.','cut flowers','freight bookings','grading services','horticultural output','fund additional refrigerated freight capacity',
      'More cold freight space can reduce spoilage and allow growers to accept more overseas orders. Higher sales can support employment and export receipts.',
      'Freight improvements are expensive and may be underused when foreign demand falls. Public money might raise more income if it improves transport for several sectors.'],
    ['Türkiye','International textile sales','Textile producers sell cloth abroad and rely partly on imported materials.','textiles','cotton purchases','finishing services','textile output','introduce a tariff on imported fabrics',
      'A tariff makes some imported fabrics more expensive, which can increase orders for domestic suppliers. This may support jobs and give new firms room to expand.',
      'Clothing producers that use imported fabrics can face higher costs and become less competitive abroad. Consumers may pay higher prices, and other countries could retaliate.'],
    ['Vietnam','Trade in processed food','Domestic food processors export finished products and use equipment sourced from several countries.','processed foods','warehouse bookings','shipping services','food-processing output','sign an agreement to reduce trade barriers with a major market',
      'Lower barriers can raise demand for exports and make imported machinery cheaper. Business expansion can create jobs and support productivity gains.',
      'Imports may compete more heavily with domestic producers, leading to closures or adjustment costs. Losing tariff revenue may reduce funds for public services.'],
    ['United Arab Emirates','International transport services','Port operators sell freight and storage services to customers in other countries.','freight services','storage bookings','local repair services','port activity','provide public funding to expand a freight terminal',
      'Extra capacity can enable operators to serve more foreign customers and increase export receipts. Quicker handling may also reduce costs for domestic importers.',
      'The terminal may be underused if shipping routes change. The funds have an opportunity cost and construction could impose environmental costs on local communities.'],
    ['Mexico','Overseas vehicle sales','Plants export vehicles and purchase components from both domestic and overseas suppliers.','vehicles','parts orders','testing services','vehicle output','offer incentives to develop local component suppliers',
      'More capable local suppliers can reduce delivery delays and create jobs. Manufacturers may buy fewer inputs abroad if local firms can meet cost and quality requirements.',
      'Incentives may protect inefficient suppliers or go to firms that would have expanded anyway. If domestic components are more expensive, the vehicle industry’s competitiveness could fall.']
  ];

  function part(marks, topic, prompt, markingPoints, model = markingPoints, diagram = false) {
    return {marks, topic, prompt, scheme:markingPoints, model, diagram};
  }

  function calculation(topic, prompt, working, answer) {
    return part(2,topic,prompt + ' Show your working.',
      'Award 1 mark for a correct method: ' + working + '. Award 1 mark for the correct answer: ' +
      answer + '. Award both marks for a correct final answer.',
      working + ' = ' + answer + '.');
  }

  function identification(topic, prompt, first, second) {
    return part(2,topic,prompt,'Award 1 mark for each: ' + first + '. ' + second + '.',
      first.charAt(0).toUpperCase() + first.slice(1) + ' and ' + second + '.');
  }

  function explanation(topic, prompt, point, link) {
    return part(2,topic,prompt,'Award 1 mark for the correct point and 1 for the linked explanation. ' +
      point + ' ' + link, point + ' ' + link);
  }

  function analysis(topic, prompt, paragraphs) {
    return part(4,topic,prompt,'Award up to 2 marks for each distinct developed point. Credit the point and its linked effect.\n\n' +
      paragraphs.join('\n\n'), paragraphs.join('\n\n'));
  }

  function demandSupplyDiagram(topic, market, event, curve, sign, labour = false) {
    const direction = sign > 0 ? 'right' : 'left';
    const price = (curve === 'demand' ? sign : -sign) > 0 ? 'higher' : 'lower';
    const quantity = sign > 0 ? 'higher' : 'lower';
    const vertical = labour ? 'wage rate' : 'price';
    const horizontal = labour ? 'quantity of labour' : 'quantity';
    const first = 'Label the vertical axis ' + vertical + ' and the horizontal axis ' + horizontal +
      '. Draw downward-sloping D and upward-sloping S, intersecting at E₁.';
    const second = 'Shift ' + curve + ' to the ' + direction + ' and keep the other curve fixed. Mark E₂ at the new ' +
      'intersection, with a ' + price + ' ' + vertical + ' and a ' + quantity + ' equilibrium ' + horizontal + '.';
    return part(4,topic,'Draw a demand and supply diagram to show the effect of ' + event + ' on the market for ' + market + '.',
      'Award 1 mark for both correctly labelled axes, 1 for both original curves correctly drawn and labelled, ' +
      '1 for shifting only the ' + curve + ' curve ' + direction + ', and 1 for showing the new equilibrium at a ' +
      price + ' ' + vertical + ' and a ' + quantity + ' equilibrium ' + horizontal + '.', first + ' ' + second, true);
  }

  function comparison(topic, xName, yName, x, y, serial, inverse = false) {
    const xStep = 2 + serial % 3;
    const yStep = 3 + serial % 4;
    const valuesX = [x, x+xStep, x+2*xStep, x+3*xStep];
    const sign = inverse ? -1 : 1;
    const outlier = serial % 2 === 0;
    const valuesY = [y, y+sign*yStep, y+sign*(outlier?-1:2)*yStep, y+sign*3*yStep];
    const data = {caption:'Indicators in four local areas', headers:['Area',xName,yName],
      rows:valuesX.map((value,index) => ['ABCD'[index],value,valuesY[index]])};
    const trend = 'There is generally a ' + (inverse ? 'negative' : 'positive') + ' relationship.';
    const evidence = 'Area A records ' + valuesX[0] + ' and ' + valuesY[0] + ' on the two indicators respectively, ' +
      'while Area D records ' + valuesX[3] + ' and ' + valuesY[3] + '.';
    const qualification = outlier ? 'Area C is an exception compared with area B: the first indicator is higher, while the second ' +
      (inverse ? 'also rises' : 'falls') + ' from ' + valuesY[1] + ' to ' + valuesY[2] + '.' :
      'The four observations support an association. They cannot establish causation because other factors may differ between the areas.';
    const item = part(4,topic,'Analyse the relationship between ' + xName.toLowerCase() + ' and ' +
      yName.toLowerCase() + ' in the four areas.',
      'Award 1 for the correct general relationship, 1 for an accurately paired comparison between areas, ' +
      '1 for other accurate paired evidence and 1 for identifying a valid exception or explaining a limitation. ' +
      'If the same data are used to support two points, avoid double credit. ' +
      trend + ' ' + evidence + ' For other evidence, area B records ' + valuesX[1] + ' and ' + valuesY[1] + '. ' + qualification,
      trend + ' ' + evidence + ' Area B also records ' + valuesX[1] + ' and ' + valuesY[1] + ', which are intermediate values. ' + qualification);
    return {data,item};
  }

  function caseQuestion(place, title, intro, proposal, forPolicy, againstPolicy, topic, tables, parts) {
    const discussion = part(6,topic,'Discuss whether the government in this case should ' + proposal + '.',
      'Award up to 4 marks per side and up to 6 in total. Credit each distinct point or link once. ' +
      'Accept other valid arguments applied to the source. Credit distinct reasoning on either side.\n\nPossible benefit: ' + forPolicy + '\n\nPossible drawback: ' + againstPolicy,
      forPolicy + '\n\n' + againstPolicy);
    return {title:'Section A · ' + place + ' and ' + title.charAt(0).toLowerCase() + title.slice(1),
      stimulus:intro + '\n\nThe government is considering a policy to ' + proposal + '.',
      simulated:true,tables, parts:[...parts,discussion]};
  }

  function marketCase(row, serial) {
    const [place,title,intro,market,curve,sign,capitalA,capitalB,proposal,forPolicy,againstPolicy] = row;
    const start = 1000 + 100 * serial;
    const increase = serial % 2 === 1;
    const percent = 12 + 2 * serial;
    const end = start + start * percent / 100 * (increase ? 1 : -1);
    const event = 'the change described in the first paragraph';
    const inverse = serial % 3 !== 1;
    const xMetric = inverse ? 'Average price ($ per unit)' : 'Local population (thousands)';
    const yMetric = 'Monthly sales (hundreds of units)';
    const {data,item} = comparison(inverse ? '2.2' : '5.3',xMetric,yMetric,10+serial,30+serial,serial,inverse);
    const capital = 'Local suppliers use ' + capitalA + ' and ' + capitalB + ' to provide the product.';
    const movement = sign > 0 ? 'more' : 'less';
    const firstEvent = intro.split(/(?<=\.) /)[0];
    const third = curve === 'demand' ?
      explanation('2.2','Explain one reason why demand for the product changes in the source.',
        firstEvent, 'This makes consumers willing and able to buy ' + movement + ' at each price, so demand shifts.') :
      explanation('2.3','Explain one reason why supply of the product changes in the source.',
        firstEvent, 'This changes the amount producers can profitably supply, so they offer ' + movement + ' at each price.');
    return caseQuestion(place,title,intro + '\n\n' + capital,proposal,forPolicy,againstPolicy,'2.10',[
      {caption:'Sales recorded by a group of suppliers',headers:['Period','Units sold'],rows:[['Earlier',start],['Later',end]]},data
    ], [
      calculation('2.2','Calculate the percentage ' + (increase?'rise':'fall') + ' in the recorded sales.',
        '(' + (increase ? end + ' − ' + start : start + ' − ' + end) + ') ÷ ' + start + ' × 100',percent + '%'),
      identification('1.2','Identify two capital goods mentioned in the source.',capitalA,capitalB),
      third,
      demandSupplyDiagram('2.5',market,event,curve,sign),
      item
    ]);
  }

  function firmCase(row, serial) {
    const [place,title,intro,capitalA,capitalB,method,productivity,proposal,forPolicy,againstPolicy] = row;
    const units = 1000+200*serial;
    const hours = (serial+5)*100;
    const price = 20+serial;
    const cost = units*(price-4-serial%4);
    const laterUnits = units+hours;
    const rate = (value) => Number((value / hours).toFixed(2));
    const perUnit = value => '$' + value.toFixed(2);
    const averageLater = cost / laterUnits;
    const {data,item} = comparison('3.5','Equipment spending ($ thousands)','Output per worker (units per shift)',16+serial,18+serial,serial);
    return caseQuestion(place,title,intro + '\n\nThe firms use ' + capitalA + ' and ' + capitalB + '. A local firm reports that ' +
      method + ' ' + productivity + '.',proposal,forPolicy,againstPolicy,'4.4',[
      {caption:'Monthly results of the local firm',headers:['Indicator','Before the change','After the change'],
        rows:[['Units produced and sold',units,laterUnits],['Worker-hours',hours,hours],['Price per unit ($)',price,price],['Total cost ($)',cost,cost]]},data
    ], [
      calculation('3.6','Calculate the profit of the local firm after the change.',
        '(' + laterUnits + ' × $' + price + ') − $' + cost,'$' + (laterUnits*price-cost)),
      identification('1.2','Identify two capital goods in the source.',capitalA,capitalB),
      explanation('3.5','Explain one reason why the change described in the source could raise labour productivity.',
        'The change ' + productivity + '.','This allows workers to produce more in the same amount of time, raising output per worker-hour.'),
      part(4,'3.6','Analyse how the change affected average total cost and labour productivity at the local firm. Round to two decimal places where appropriate.',
        'Award 1 mark for each correct before-and-after comparison and 1 mark for each valid explanation. ' +
        'Average cost fell from ' + perUnit(cost/units) + ' to ' + perUnit(averageLater) +
        ' because the same cost was spread over more units. Output per worker-hour rose from ' + rate(units) +
        ' to ' + rate(laterUnits) + ' because more units were produced using the same hours. Credit correct workings and rounded answers.',
        'Average total cost fell from ' + perUnit(cost/units) + ' to ' + perUnit(averageLater) +
        ' because total cost was spread over more units. Labour productivity rose from ' + rate(units) + ' to ' +
        rate(laterUnits) + ' units per worker-hour because output increased with unchanged worker-hours.'),
      item
    ]);
  }

  function labourCase(row, serial) {
    const [place,title,intro,workers,trend,change,proposal,forPolicy,againstPolicy] = row;
    const employment = 12000 + serial*1000;
    const rate = 4+serial%7;
    const jobless = employment*rate/100;
    const signed = trend === 'rising' ? 1 : -1;
    const inverse = serial % 3 === 2;
    const {data,item} = comparison('4.6','Vacancies (hundreds)',
      inverse ? 'Unemployment rate (%)' : 'Average hourly pay ($)',12+serial,inverse?16:30+serial,serial,inverse);
    const pay = 14+serial;
    const locality = 'One area reports that demand for ' + workers + ' is ' + trend + '. Long journeys to work and the cost of gaining new ' +
      'qualifications are barriers for some people looking for employment.';
    return caseQuestion(place,title,intro + '\n\n' + locality,proposal,forPolicy,againstPolicy,'4.6',[
      {caption:'Local labour market',headers:['Indicator','Earlier','Later'],
        rows:[['Labour force',employment,employment],['Number unemployed',jobless+300*signed,jobless],
          ['Average hourly pay ($)',pay,pay+change*signed]]},data
    ], [
      calculation('4.6','Calculate the local unemployment rate for the later period.',jobless + ' ÷ ' + employment + ' × 100',rate + '%'),
      identification('3.3','Identify two barriers to taking another job mentioned in the source.',
        'long journeys to work','the cost of gaining new qualifications'),
      explanation('3.3','Explain why the change in demand for ' + workers + ' could explain the direction of the change in hourly pay.',
        'The source reports ' + trend + ' demand for ' + workers + '.',
        signed > 0 ? 'Employers may need to offer more to attract a limited supply of workers.' :
          'With fewer employers competing for these workers, firms may be able to recruit at lower wages.'),
      demandSupplyDiagram('3.3',workers,'the reported ' + (signed > 0 ? 'increase' : 'decrease') + ' in labour demand','demand',signed,true),
      item
    ]);
  }

  function developmentCase(row, serial) {
    const [place,title,intro,incomeMetric,servicesMetric,change,outcome,proposal,forPolicy,againstPolicy] = row;
    const population = 100+(serial+1)*20;
    const perHead = 5000+serial*500;
    const gdp = perHead * population / 1000;
    const inverse = serial === 4;
    const xLabel = inverse ? 'Households with safe water (%)' :
      servicesMetric.charAt(0).toUpperCase() + servicesMetric.slice(1) + ' (index)';
    const yLabel = incomeMetric.charAt(0).toUpperCase() + incomeMetric.slice(1) + ' (index)';
    const {data,item} = comparison('5.4',xLabel,yLabel,inverse?48:28+serial,45+serial,serial,inverse);
    return caseQuestion(place,title,intro + '\n\nEconomists report that ' + change + ' ' + outcome +
      '. They also report differences in household incomes within each area and in life expectancy between areas.',
      proposal,forPolicy,againstPolicy,'5.4',[
        {caption:'Selected indicators in the region',headers:['Indicator','Value'],
          rows:[['Real GDP ($ million)',gdp],['Population (thousands)',population]]},data
      ], [
      calculation('5.1','Calculate real GDP per head for the region.',gdp + ' million dollars ÷ ' + population + ' thousand people','$' + perHead),
      part(2,'5.1','Identify one health indicator in the source and one feature of the distribution of income.',
        'Award 1 for life expectancy and 1 for differences in household incomes within each area.',
        'The health indicator is life expectancy. Household incomes differ within each area.'),
      explanation('5.4','Explain one way the change in the source could improve living standards.',
        change.charAt(0).toUpperCase() + change.slice(1) + ' ' + outcome + '.',
        ['This can improve health and help people take part in education or work.',
         'This can improve health through earlier access to treatment.',
         'The people gaining paid work may have higher incomes to buy goods and services.',
         'Patients may obtain treatment they would otherwise miss, improving their health.',
         'Fewer lost workdays can protect household earnings and the ability to buy essentials.',
         'Workers with sought-after skills can qualify for better-paid employment.',
         'A faster recovery can protect household earnings and reduce hardship.',
         'A higher wage can increase the goods and services workers can afford.',
         'Access to a wider labour market may raise employment and household earnings.',
         'Carers who enter paid work may have more income for essentials.'][serial]),
      analysis('5.1','Using the source, analyse two reasons why real GDP per head alone may give a limited view of living standards in the region.',[
        'Differences in household income mean that the average conceals who receives the income. High real GDP per head need not mean that people on low incomes can afford necessities.',
        'The source also reports differences in life expectancy. Real GDP per head measures output per person, so it does not directly capture differences in how long or how healthily people live.'
      ]),
      item
    ]);
  }

  function tradeCase(row, serial) {
    const [place,title,intro,goods,contracts,services,activity,proposal,forPolicy,againstPolicy] = row;
    const goodsX = 78+serial*4;
    const goodsM = 66+serial*7;
    const servicesX = 19+serial*2;
    const servicesM = 14+serial*3;
    const balance = goodsX - goodsM + servicesX - servicesM;
    const sign = serial % 2 === 0;
    const currencyChange = sign ? 'depreciated' : 'appreciated';
    const productType = goods === 'freight services' ? 'service' : 'good';
    const {data,item} = comparison('6.1','Overseas orders (index)',
      activity.charAt(0).toUpperCase() + activity.slice(1) + ' (index)',52+serial,58+serial,serial);
    return caseQuestion(place,title,intro + '\n\nForeign buyers pay local businesses for ' + goods + ' and ' + services +
      '. The industry’s spending includes ' + contracts + '. The currency has ' + currencyChange +
      ' against the currencies of major trading partners. The net balances on primary and secondary income are both zero for this exercise.',
      proposal,forPolicy,againstPolicy,'6.2',[
        {caption:'Trade flows during the year',headers:['Flow','Value ($ billion)'],
          rows:[['Exports of goods',goodsX],['Imports of goods',goodsM],['Exports of services',servicesX],['Imports of services',servicesM]]},data
      ], [
      calculation('6.4','Calculate the current account balance.',
        '$' + goodsX + 'bn − $' + goodsM + 'bn + $' + servicesX + 'bn − $' + servicesM + 'bn',
        balance === 0 ? '$0bn' : '$' + Math.abs(balance) + 'bn ' + (balance > 0 ? 'surplus' : 'deficit')),
      part(2,'6.4','Identify one export named in the source and state whether it is a good or a service.',
        'Award 1 for an export named in the source and 1 for the correct classification. Accept ' + goods +
        ' as a ' + productType + ' or ' + services + ' as a service.',
        'One export is ' + goods + '. The export is a ' + productType + '.'),
      explanation('6.4','Explain how an increase in overseas sales could affect the current account balance.',
        'Higher overseas sales can increase export receipts.',
        'If other items do not change, the current account balance improves because total receipts rise relative to payments.'),
      analysis('6.3','Analyse two effects of the exchange-rate change on domestic firms that export and purchase imported inputs.',
        sign ? ['A depreciation lowers foreign-currency export prices if firms keep their domestic prices unchanged. The goods or services become more price competitive and overseas sales may rise.',
           'Imported inputs cost more in domestic currency. Higher production costs may reduce profit margins or lead firms to increase prices.'] :
          ['An appreciation raises foreign-currency export prices at unchanged domestic prices. Overseas buyers may switch suppliers, reducing export sales.',
           'Imported inputs cost less in domestic currency. Lower costs can increase profit margins or allow firms to cut prices.']),
      item
    ]);
  }

  const cases = marketCases.map(marketCase).concat(firmCases.map(firmCase),labourCases.map(labourCase),
    developmentCases.map(developmentCase),tradeCases.map(tradeCase));
  const caseOffsets = [0, 9, 7, 3, 6];
  return Array.from({length:mockPaperCount}, (_, index) => {
    const family = index % 5;
    const row = Math.floor(index / 5);
    const source = cases[family * 10 + (row + caseOffsets[family]) % 10];
    const choices = mockSectionB.map((bank, strand) => bank[(row + family * [1,3,7,9][strand] + strand * 2) % bank.length]);
    return [source, ...choices];
  });
})();
