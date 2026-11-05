const syllabusCharts = {
  2875:[['Movement along demand','Price','Quantity',[['D','M65 52L300 172']],[[123.75,82,'A'],[241.25,142,'B']],'A lower own price moves the market from A to B on the same demand curve.']],
  2877:[['Movement along supply','Price','Quantity',[['S','M65 172L300 52']],[[123.75,142,'A'],[241.25,82,'B']],'A higher own price moves the market from A to B on the same supply curve.']],
  2880:[['A fall in supply','Price','Quantity',[['D','M62 58L287 178'],['S','M62 178L287 58'],['S₁','M62 148L231 58']],[[174.5,118,'E'],[146.4,103,'E₁']],'With demand unchanged, the new intersection is higher and farther left. Price rises and sales fall.']],
  2881:[
    ['Extreme cases of PED','Price','Quantity',[['PED = 0','M135 48V178'],['Perfectly elastic','M55 114H303']],[],'Read the curves separately. A vertical curve has fixed quantity. A horizontal curve has a perfectly elastic response at the given price.'],
    ['Unit elastic demand','Price','Quantity',[['D','M90 52.86L99 80.91L110 102.73L125 121.43L145 136.67L175 150L215 160L270 167.67']],[],'A unit-elastic demand curve keeps price multiplied by quantity constant at every point.'],
    ['Comparing elastic and inelastic demand','Price','Quantity',[['Elastic example','M63 87L302 145'],['Inelastic example','M147 47L217 178']],[[105,97,'A'],[270,137,'B'],[174,97,'C'],[195,137,'D']],'Compare the same fall in price from A to B and from C to D. Relative to its starting quantity, the first curve changes by a much larger percentage. Use the percentage changes at the given points.']
  ],
  2882:[['Total expenditure at two prices','Price ($)','Quantity',[['D','M90 70L260 168']],[[120,87.3,'A'],[226,148.4,'B']],'Each rectangle’s area is price multiplied by quantity. In this illustration the lower price at B produces a larger rectangle because the quantity increase more than offsets the price cut.',[[120,87.3],[226,148.4]]]],
  2884:[
    ['Extreme cases of PES','Price','Quantity',[['PES = 0','M135 48V178'],['Perfectly elastic','M55 114H303']],[],'Read the curves separately. Vertical supply fixes the quantity. Horizontal supply illustrates a perfectly elastic response at that price.'],
    ['Comparing straight supply curves','Price','Quantity',[['Elastic','M55 150L303 48'],['Unitary','M55 190L272 48'],['Inelastic','M146 190L246 48']],[],'Extend the lines to the axes. A straight supply curve crossing the price axis above the origin is elastic, through the origin is unitary, and crossing the quantity axis to the right of the origin is inelastic.']
  ],
  2888:[['A minimum price above equilibrium','Price','Quantity',[['D','M62 58L287 178'],['S','M62 178L287 58'],['Price floor','M55 86H301']],[[114.5,86,'Qd'],[234.5,86,'Qs'],[174.5,118,'E']],'At the floor, supply exceeds demand. The horizontal distance from Qd to Qs measures the surplus.']],
  2889:[['A subsidy shifts supply to the right','Price','Quantity',[['D','M62 58L287 178'],['S','M62 178L287 58'],['S₁','M118 178L343 58']],[[174.5,118,'E'],[202.5,132.9,'E₁']],'At E₁ buyers pay a lower price and more is sold. A subsidy lowers effective production costs.']],
  2897:[['An increase in labour supply','Wage rate','Quantity of labour',[['D','M62 58L287 178'],['S','M62 178L287 58'],['S₁','M118 178L343 58']],[[174.5,118,'E'],[202.5,132.9,'E₁']],'A rightward labour supply shift lowers the equilibrium wage and raises employment if labour demand stays unchanged.']],
  2905:[['External changes in average total cost','Average total cost','Output',[['ATC','M64 65Q171 217 302 64'],['Lower ATC','M64 95Q171 239 302 94'],['Higher ATC','M64 43Q171 194 302 42']],[],'Compare costs at the same output. Industry-wide economies can lower a firm’s ATC curve, while industry-wide diseconomies can raise it.']],
  2909:[
    ['Total costs as output changes','Total cost','Output',[['FC','M55 151H294'],['VC','M55 190Q167 174 294 86'],['TC','M55 151Q167 135 294 47']],[],'The vertical gap between TC and VC equals fixed cost. At zero output, VC is zero and TC equals FC.'],
    ['Costs per unit as output changes','Cost per unit','Output',[['AFC','M65 88Q99 173 294 182'],['AVC','M65 114Q165 191 294 100'],['ATC','M65 43Q158 166 294 89']],[],'AFC falls as fixed costs are spread over more units. At each output, ATC equals AVC plus AFC.']
  ]
};

function syllabusVisuals(id) {
  return (syllabusCharts[id] || []).map(([title,y,x,curves,points,caption,areas=[]])=>{
    const colors=['#304eb0','#a34920','#087360'];
    const rectangles=areas.map(([px,py],i)=>'<rect x="55" y="'+py+'" width="'+(px-55)+'" height="'+(190-py)+'" fill="'+colors[i]+'" fill-opacity=".18" stroke="'+colors[i]+'" stroke-dasharray="4 3"/>').join('');
    const lines=curves.map(([label,path],i)=>{
      const coordinates=path.match(/[\d.]+/g).map(Number);
      let [lx,ly]=coordinates.slice(-2);
      if (path.includes('H')) [lx,ly]=[coordinates.at(-1),coordinates[1]];
      if (path.includes('V')) [lx,ly]=[coordinates[0],coordinates.at(-1)];
      return '<path d="'+path+'" fill="none" stroke="'+colors[i]+'" stroke-width="3"/><text x="'+(lx+5)+'" y="'+(ly-3)+'">'+escapeHtml(label)+'</text>';
    }).join('');
    const marks=points.map(([px,py,label])=>'<path d="M55 '+py+'H'+px+'V190" class="graph-guide"/><circle cx="'+px+'" cy="'+py+'" r="4"/><text x="'+(px+6)+'" y="'+(py-7)+'">'+label+'</text>').join('');
    return '<figure><svg class="figure" viewBox="0 0 435 223" role="img" aria-label="'+escapeHtml(caption)+'"><path d="M55 35V190H355" fill="none" stroke="#394d80" stroke-width="2"/><text x="54" y="23">'+y+'</text><text x="234" y="213">'+x+'</text>'+rectangles+lines+marks+'</svg><figcaption><strong>'+escapeHtml(title)+'</strong><p>'+escapeHtml(caption)+'</p></figcaption></figure>';
  }).join('');
}

function equilibriumSchedule() {
  return '<table class="syllabus-table"><caption>Example demand and supply schedule</caption><thead><tr><th scope="col">Price</th><th scope="col">Quantity demanded</th><th scope="col">Quantity supplied</th><th scope="col">Result</th></tr></thead><tbody><tr><td>$2</td><td>40</td><td>20</td><td>20-unit shortage</td></tr><tr><td>$3</td><td>30</td><td>30</td><td>Equilibrium</td></tr><tr><td>$4</td><td>20</td><td>40</td><td>20-unit surplus</td></tr></tbody></table>';
}
