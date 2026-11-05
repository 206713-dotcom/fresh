const flowFigures = {
  2864:[['Limited resources','Competing wants','Choices'], 'Scarcity forces households, firms and governments to decide which wants to satisfy first.'],
  2868:[['What to make','How to make it','Who receives it'], 'An allocation decision involves the output, the production method and who gets to use the output.'],
  2901:[['Split the process','Repeat one task','Raise output per worker'], 'Specialisation can raise productivity as workers become faster at a smaller range of tasks.'],
  2919:[['Interest rates rise','Borrowing costs rise','Spending may fall'], 'The change in the cost of credit can transmit monetary policy to household consumption and business investment.'],
  2928:[['Find the cause','Identify the constraint','Choose a policy'], 'Weak spending, a skills mismatch and poor vacancy information require different responses.'],
  2936:[['Births minus deaths','Add net migration','Population change'], 'Net migration is arrivals minus departures. It can reinforce or offset natural population change.'],
  2939:[['Resource or cost advantage','Concentrate production','Export and import'], 'A country can sell specialised output abroad and use trade to obtain goods it produces less of at home.'],
  2948:[['Goods and services','Primary income','Secondary income'], 'Add the balances on these categories to calculate the current account balance.']
};

const workedNotes = {
  2870:['Finding the next best alternative','A student can spend an afternoon revising, working a paid shift or watching a film. If revising is first choice and working is second, the opportunity cost is the value of the shift given up. The film was a lower-ranked alternative.'],
  2875:['Checking what changed','Suppose cinema attendance rises after a cut in the ticket price. Show a movement along the curve. If attendance instead rises at the old price because cinema-going becomes more popular, show the entire demand curve moving right.'],
  2877:['Checking which curve moves','If a bakery can buy flour more cheaply, it can supply more loaves at each existing bread price. Draw a rightward shift of the supply curve. A rise in the price of bread itself would instead cause a movement along the curve.'],
  2881:['Calculating PED','If price rises by 10% and quantity demanded falls by 20%, PED is −20 ÷ 10 = −2. The magnitude is 2, so demand is elastic.'],
  2882:['Comparing total revenue','At $10 a firm sells 100 units, earning $1,000. After a price cut to $9 it sells 120 units, earning $1,080. In this example the increase in sales outweighs the fall in price.'],
  2884:['Calculating PES','Suppose price rises by 10% and quantity supplied rises by 5%. PES is 5 ÷ 10 = 0.5, so supply is inelastic.'],
  2905:['Reading the cost curve','Read cost per unit on the vertical axis. Where the curve falls, higher output is associated with a lower average cost. Where it rises, expanding output is associated with a higher average cost.'],
  2908:['Comparing productivity','Eight workers make 160 units a day, or 20 per worker. Ten workers making 180 units produce more in total but only 18 per worker, so labour productivity has fallen.'],
  2909:['Calculating average cost','Fixed cost is $200 and variable cost is $300 for 50 units. Total cost is $500. Divide by 50 to get an average cost of $10 per unit.'],
  2916:['Identifying a budget deficit','If public spending is $84 billion and revenue is $80 billion in the same year, the budget deficit is $4 billion.'],
  2922:['Calculating real growth','Real GDP rises from $200 billion to $210 billion. Divide the $10 billion increase by the original $200 billion and multiply by 100. Real output grew by 5%.'],
  2926:['Using the correct denominator','If 600 people are unemployed and 9,400 are employed, the labour force is 10,000. The unemployment rate is 600 ÷ 10,000 × 100 = 6%.'],
  2929:['Calculating inflation','If the index rises from 125 to 130, prices rose by 5 index points. The inflation rate is 5 ÷ 125 × 100 = 4%.'],
  2936:['Combining natural change and migration','A country records 900 births and 700 deaths, a natural increase of 200. If 50 more people leave than arrive, net migration is −50 and the population rises by 150.'],
  2939:['Weighing the trade-off','A country with a strong textile industry may build expertise and spread costs over more units. If foreign orders fall, however, employment and export earnings can drop. Workers and equipment may take time to move into other industries, while reliance on imported essentials can leave the country exposed to supply disruptions.'],
  2945:['Converting currency','If one home unit buys four foreign units, 25 home units buy 100 foreign units. To convert 100 foreign units back to home currency, divide by four.'],
  2947:['Following the effect through','An appreciation makes imports cheaper in home currency, all else equal. Whether total import expenditure falls depends on how much extra buyers purchase at the lower price.'],
  2957:['Linking the steps in an answer','If asked how a rise in input costs affects a market, explain why firms offer less at each price. Then use the leftward supply shift to explain the rise in equilibrium price and fall in equilibrium quantity.']
};

const marketFigures = {
  2874:['Price','Quantity',['d'],'Read down the demand curve. At a lower price, buyers are willing and able to purchase more.'],
  2875:['Price','Quantity',['d','dRight'],'At the same price, the point on D₁ is farther right than the point on D. That is a rise in demand.'],
  2876:['Price','Quantity',['s'],'Read up the supply curve. At a higher price, producers are willing and able to sell more.'],
  2877:['Price','Quantity',['s','sRight'],'At the same price, the point on S₁ is farther right than the point on S. That is a rise in supply.'],
  2879:['Price','Quantity',['d','s'],'The intersection E shows the price at which buyers and sellers agree on the quantity traded.'],
  2880:['Price','Quantity',['d','dRight','s'],'A rise in demand moves equilibrium up the supply curve. Both equilibrium price and quantity rise.'],
  2888:['Price','Quantity',['d','s'],'At the ceiling below equilibrium, Qs is less than Qd. The difference is the shortage.'],
  2889:['Price','Quantity',['d','s','sLeft'],'An indirect tax shifts supply left to S₁. The price paid by buyers rises and the traded quantity falls.'],
  2896:['Wage rate','Quantity of labour',['d','s'],'The intersection shows the wage at which the quantity of labour firms want equals the quantity workers offer.'],
  2897:['Wage rate','Quantity of labour',['d','dRight','s'],'An increase in labour demand from D to D₁ raises both the wage rate and employment when supply is unchanged.'],
  2898:['Wage rate','Quantity of labour',['d','s'],'At the wage floor above equilibrium, the quantity of labour supplied exceeds the quantity demanded.'],
  2946:['Exchange rate','Quantity of currency',['d','dRight','s'],'Higher demand for the domestic currency raises its price in foreign currency. This is an appreciation.']
};

const marketCurves = {
  d:[62,58,287,178,'D'],
  dRight:[118,58,343,178,'D₁'],
  s:[62,178,287,58,'S'],
  sRight:[118,178,343,58,'S₁'],
  sLeft:[62,148,231,58,'S₁']
};

function drawMarket(id) {
  const [vertical,horizontal,curves,note] = marketFigures[id];
  const lines = curves.map(key=>{
    const [x1,y1,x2,y2,label] = marketCurves[key];
    const color = key.startsWith('d') ? '#304eb0' : '#a34920';
    return '<path d="M'+x1+' '+y1+'L'+x2+' '+y2+'" stroke="'+color+'" stroke-width="3" '+(key.length>1?'stroke-dasharray="7 4"':'')+'/><text x="'+(x2+5)+'" y="'+(y2+4)+'">'+label+'</text>';
  }).join('');
  let markers = '';
  if (id===2875 || id===2877) {
    markers = '<path d="M54 118H230.5M174.5 118V195M230.5 118V195" class="graph-guide"/><circle cx="174.5" cy="118" r="4"/><circle cx="230.5" cy="118" r="4"/><text x="165" y="211">Q₀</text><text x="222" y="211">Q₁</text>';
  } else if (curves.includes('d') && curves.includes('s')) {
    markers = '<path d="M54 118H174.5V195" class="graph-guide"/><circle cx="174.5" cy="118" r="4"/><text x="182" y="121">E</text>';
    if (curves.includes('dRight')) markers += '<circle cx="202.5" cy="103.1" r="4"/><text x="207" y="94">E₁</text>';
    if (curves.includes('sLeft')) markers += '<circle cx="146.4" cy="103" r="4"/><text x="136" y="92">E₁</text>';
    if (id===2888 || id===2898) {
      const floor = id===2898;
      const y = floor ? 86 : 150;
      markers += '<path d="M54 '+y+'H345M114.5 '+y+'V195M234.5 '+y+'V195" class="graph-guide"/><circle cx="114.5" cy="'+y+'" r="4"/><circle cx="234.5" cy="'+y+'" r="4"/><text x="270" y="'+(y-7)+'">'+(floor?'Wage floor':'Price ceiling')+'</text><text x="105" y="211">'+(floor?'Qd':'Qs')+'</text><text x="225" y="211">'+(floor?'Qs':'Qd')+'</text>';
    }
  }
  return '<figure><svg class="figure" viewBox="0 0 380 245" role="img" aria-label="'+escapeHtml(note)+'"><path d="M54 36v159h300" stroke="#394d80" stroke-width="2" fill="none"/><text x="48" y="25">'+vertical+'</text><text x="216" y="231">'+horizontal+'</text>'+lines+markers+'</svg><figcaption><strong>Reading the diagram</strong><p>'+escapeHtml(note)+'</p></figcaption></figure>';
}

function lessonVisual(id) {
  if ([2871,2872].includes(id)) return diagram(id===2872);
  if (marketFigures[id]) return drawMarket(id);
  if (id===2905) {
    return '<figure><svg class="figure" viewBox="0 0 380 225" role="img" aria-label="Average cost falls as output grows, reaches a low point, and then rises."><path d="M54 35v153h285" stroke="#394d80" stroke-width="2" fill="none"/><path d="M72 65C112 195 235 193 310 67" stroke="#304eb0" stroke-width="3" fill="none"/><text x="48" y="24">Average cost</text><text x="290" y="210">Output</text><text x="312" y="64">AC</text></svg><figcaption>As output rises, average cost falls with economies of scale and can rise with diseconomies of scale.</figcaption></figure>';
  }
  const flow = flowFigures[id];
  if (!flow) return '';
  const [steps,note] = flow;
  return '<figure><ol class="note-flow">'+steps.map(step=>'<li>'+escapeHtml(step)+'</li>').join('')+'</ol><figcaption>'+escapeHtml(note)+'</figcaption></figure>';
}
