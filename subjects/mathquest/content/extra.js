import {check as q, lesson as l} from './model.js';

export const extra = [
  l('calculator','Calculator accuracy and compound rates','number','core',
    'Use calculator brackets, keep precision and calculate with density and pressure.',
    ['Enter a full numerator or denominator in brackets. Keep unrounded intermediate values and round only the final answer.', 'Density is mass ÷ volume; pressure is force ÷ area. Use the units in the formula before substituting and rearrange as with any other rate.', 'Convert decimal time carefully: 0.25 h = 15 min. Timetables can cross midnight or change time zones. Convert to one time zone before taking a difference.'],
    ['A sample has mass 270 g and volume 100 cm³. Find its density.','Divide mass by volume: 270/100 = 2.7 g/cm³.'],
    q('A force of 80 N acts over 0.4 m². Find its pressure.','200 Pa',['32 Pa','20 Pa','0.005 Pa'],'Pressure is force divided by area: 80/0.4 = 200.'),
    [
      q('What is 3.35 hours in hours and minutes?','3 h 21 min',['3 h 35 min','3 h 25 min','3 h 3.5 min'],'Multiply the fractional hour, 0.35, by 60.'),
      q('A circle has radius 2.64 cm. Find its area to 2 significant figures.','22 cm²',['21 cm²','23 cm²','21.9 cm²'],'Enter π × 2.64² then round the result, about 21.896 cm², to two significant figures.'),
      q('Evaluate (18.7 + 7.2) ÷ (3.2 + 0.8)² to 3 significant figures.','1.62',['1.61','6.48','0.405'],'Calculate the bracketed sums, then square the denominator. The value is 25.9/16 = 1.61875, which rounds to 1.62.'),
      q('A piece of equipment exerts a pressure of 1600 Pa on a surface of area 0.075 m². Find the force.','120 N',['12 N','21 N','240 N'],'Rearrange pressure = force ÷ area to get force = 1600 × 0.075 = 120 N.'),
      q('A flight leaves Airport A at 22:40 local time and lasts 3 h 35 min. Airport B is 2 hours ahead. At what local time does it arrive at B?','04:15 the next day',['00:15 the next day','02:15 the next day','05:15 the next day'],'In Airport A’s time zone the arrival is 02:15 the next day. Add 2 hours to get 04:15 at Airport B.')
    ],['rates-time']),
  l('power-patterns','Square and cube number patterns','algebra','core',
    'Recognise shifted square and cube patterns and write their nth terms.',
    ['Compare the terms with n² and n³ for n = 1, 2, 3, …. If subtracting the powers gives a constant c, add c to the power rule.', 'Test proposed rules against several listed terms. A rule that matches only the first term is not enough.', 'Triangular numbers count dots in successive rows and can be worked out by adding 1 + 2 + … + n.'],
    ['Find a rule for 3, 10, 29, 66, ….','Compare with 1, 8, 27, 64. Each term is 2 more than its cube, so the rule is n³ + 2.'],
    q('Find the nth term of 2, 5, 10, 17, ….','n² + 1',['2n','n² − 1','n³ + 1'],'Subtract 1, 4, 9 and 16 respectively to find a constant difference of 1.'),
    [
      q('Find the next term after 3, 10, 29, 66.','127',['125','121','100'],'The rule n³ + 2 gives 5³ + 2 = 127.'),
      q('What comes next in the triangular numbers 1, 3, 6, 10, 15?','21',['20','25','30'],'The differences are 2, 3, 4, 5, so next add 6.'),
      q('Find an nth-term rule for −2, 1, 6, 13, …, starting at n = 1.','n² − 3',['n² + 3','n³ − 3','3n − 5'],'Each displayed term is 3 less than the corresponding square 1, 4, 9 or 16.'),
      q('A sequence has nth term n³ − 4. Find its sixth term.','212',['32','216','220'],'Substitute n = 6: 6³ − 4 = 216 − 4 = 212.'),
      q('A dot pattern has 1 dot in row 1, 2 in row 2, and so on. How many dots are in the first 9 rows?','45',['36','54','81'],'Add the row counts from 1 to 9. Pair 1 + 9, 2 + 8, 3 + 7 and 4 + 6 to get 40, then add the middle 5.')
    ],['sequences','powers']),
  l('circle-right','Right angles in circles','geometry','core',
    'Use the tangent–radius and semicircle facts to calculate angles.',
    ['A tangent is a line touching the circle at a single point. The radius to that point meets the tangent at 90°.', 'If A and B are the endpoints of a diameter and P lies elsewhere on the circle, angle APB is 90°. Mark this angle before using triangle sums or Pythagoras.', 'In an angle problem, state the geometric reason for each step.'],
    ['AB is a diameter and P is on the circle. Angle PAB is 32°. Find angle PBA.','Angle APB is 90° because it subtends a diameter. Then angle PBA = 180° − 90° − 32° = 58°.'],
    q('AB is a diameter and C is on the circle. Find angle ACB.','90°',['45°','60°','180°'],'The angle at the circumference subtended by a diameter is a right angle.'),
    [
      q('Which fact relates the radius and tangent at their meeting point?','They are perpendicular.',['They are parallel.','They are equal in length.','They form a 45° angle.'],'The tangent makes a right angle with the radius at contact.'),
      q('A triangle inscribed in a semicircle has a 36° acute angle. Find its other acute angle.','54°',['36°','72°','144°'],'The angle opposite the diameter is 90°. The acute angles add to 90°.'),
      q('O is the centre of a circle. The tangent at T passes through P. Angle TOP is 37°. Find angle TPO.','53°',['37°','90°','143°'],'The radius OT meets the tangent TP at a right angle. The remaining angle is 180° − 90° − 37° = 53°.'),
      q('AB is a diameter of length 13 cm. Point C lies on the circle, and AC = 5 cm. Find BC.','12 cm',['8 cm','18 cm','√194 cm'],'Angle ACB is 90° because AB is a diameter. Pythagoras gives BC² = 13² − 5² = 144, so BC = 12 cm.'),
      q('AB is a diameter, and C is another point on the circle. Angle CAB is 28°. Find the acute angle between the tangent at A and the chord AC.','62°',['28°','90°','118°'],'The tangent at A is perpendicular to the diameter AB. Chord AC is 28° from AB, so it makes an acute angle of 90° − 28° = 62° with the tangent.')
    ],['angles']),
  l('motion-graphs','Speed–time graphs and changing gradients','algebra','extended',
    'Use the area and gradient of a speed–time graph.',
    ['On a speed–time graph, gradient is acceleration and area under the graph is distance. Split a piecewise graph into rectangles, triangles or trapezia.', 'Draw a tangent to estimate an instantaneous gradient on a curved graph. Estimate curved areas with strips, or compare upper and lower estimates.'],
    ['A car accelerates uniformly from rest to 12 m/s in 8 s. How far does it go?','The area below the graph is a triangle: ½ × 8 × 12 = 48 m. The acceleration is 12/8 = 1.5 m/s².'],
    q('Speed increases from 5 m/s to 17 m/s in 4 s at a constant rate. Find the acceleration.','3 m/s²',['4.25 m/s²','12 m/s²','44 m/s²'],'The speed changes by 12 m/s over 4 s.'),
    [
      q('A runner maintains 4 m/s for 12 s. Find the area under the speed–time graph.','48 m',['3 m','16 m','8 m'],'The area is a rectangle with width 12 s and height 4 m/s.'),
      q('Velocity is positive and rises linearly from 3 to 7 m/s over 5 s. How far does the object travel?','25 m',['20 m','35 m','50 m'],'The area of the trapezium is (3 + 7) × 5/2 = 25 m.'),
      q('A cyclist rides at 6 m/s for 5 s, then slows uniformly to rest over the next 4 s. Find the total distance.','42 m',['24 m','30 m','54 m'],'Add the rectangle area 6 × 5 = 30 m and the triangle area ½ × 4 × 6 = 12 m.'),
      q('A vehicle’s speed falls uniformly from 14 m/s to 5 m/s in 3 s. What acceleration does the gradient show?','−3 m/s²',['3 m/s²','−9 m/s²','−4.67 m/s²'],'The gradient is change in speed divided by time: (5 − 14)/3 = −3 m/s².'),
      q('A tangent to a curved speed–time graph passes through (2 s, 4 m/s) and (6 s, 16 m/s). What acceleration does this tangent estimate?','3 m/s²',['2 m/s²','4 m/s²','12 m/s²'],'Use the tangent’s gradient: (16 − 4)/(6 − 2) = 12/4 = 3 m/s².')
    ],['travel','coordinates']),
  l('gdc-graphs','Graphing calculator and function types','function-graphs','intl-core',
    'Use a graphic display calculator to identify roots, intersections and extrema.',
    ['Enter each equation in the graph editor and choose a window appropriate to the context. The table view shows outputs for selected inputs; plotting these pairs helps verify the graph.', 'Use zero/root to find an x-intercept, intersect for common solutions and minimum or maximum for turning points. Give a suitable interval or a starting point near the feature.', 'Recognise lines by constant gradient and quadratics by a parabola. Read values in context, with correct units and sensible rounding.'],
    ['Enter y = x² − 4 and y = 5. Which intersections should the graph show?','At the intersections, x² − 4 = 5, so x = −3 or 3. The points are (−3, 5) and (3, 5).'],
    q('Which graphing-calculator feature finds where f(x) = 0?','Zero or root',['Maximum','Y-intercept','Table step'],'A zero is the x-coordinate where the graph meets the x-axis.'),
    [
      q('Which window can display both roots of y = x² − 9?','−5 ≤ x ≤ 5, −10 ≤ y ≤ 10',['0 ≤ x ≤ 5, −10 ≤ y ≤ 10','−2 ≤ x ≤ 2, −10 ≤ y ≤ 10','−5 ≤ x ≤ 5, 9 ≤ y ≤ 10'],'Both x = −3 and x = 3 must be visible at y = 0.'),
      q('If the table shows a constant increase in y for each equal increase in x, which graph fits?','A line',['A parabola','An exponential curve','A circle'],'Constant rate of change means constant gradient.'),
      q('You have plotted y = f(x) and y = g(x) on a graphing calculator. Which feature finds a solution to f(x) = g(x)?','Intersection of the two curves',['Zero of the first curve','Minimum of the second curve','Y-intercept of the first curve'],'The curves meet where they give the same output at the same input. The x-coordinate of that intersection solves the equation.'),
      q('A calculator table for x = 0, 1, 2, 3 shows y-values 2, 6, 18, 54. Which type of function best fits these values?','Exponential',['Linear','Quadratic','Constant'],'For each increase of 1 in x, y is multiplied by 3. A constant multiplier indicates exponential change.'),
      q('What point should a graphing calculator return when asked for the minimum of y = (x − 4)² − 7?','(4, −7)',['(−4, −7)','(4, 7)','(0, 9)'],'The squared term is non-negative and becomes zero at x = 4, giving the minimum value of −7.')
    ],['graphs','coordinates']),
  l('gdc-stats','Quartiles and calculator statistics','statistics','intl-core',
    'Read one-variable statistics and use frequency lists on a GDC.',
    ['Enter values in one list and their frequencies in another. In one-variable statistics, choose both the values list and the frequency list so repeated observations are counted correctly.', 'For grouped data, enter the class midpoints as values and the class counts as frequencies. The mean displayed is an estimate.', 'Use the calculator’s median and quartiles to find the interquartile range Q₃ − Q₁. Use quartiles and medians to compare typical values and spread.'],
    ['For Q₁ = 8, median = 13 and Q₃ = 20, report the IQR.','IQR = 20 − 8 = 12. The middle half of observations lies between 8 and 20.'],
    q('What information belongs in the frequency list for a grouped table?','The number of observations in each class',['The class widths','The midpoints','The accumulated totals'],'Each midpoint must be weighted using the number in its own class.'),
    [
      q('Find the interquartile range when Q₁ = 17 and Q₃ = 32.','15',['24.5','49','17'],'Subtract 17 from 32.'),
      q('Which value represents the 10 ≤ x < 20 class when estimating a mean?','15',['10','20','19'],'Use the class midpoint.'),
      q('A calculator’s values list contains 2, 5 and 8. The matching frequency list contains 1, 3 and 2. What mean should one-variable statistics report?','5.5',['5','6','11'],'Use the frequencies as weights: (2 × 1 + 5 × 3 + 8 × 2)/(1 + 3 + 2) = 33/6 = 5.5.'),
      q('There are 4 observations in 0 ≤ x < 8 and 6 in 8 ≤ x < 16. What estimated mean should you get by entering class midpoints and frequencies?','8.8',['7.2','8','12'],'Enter midpoints 4 and 12 with frequencies 4 and 6. The estimated mean is (4 × 4 + 12 × 6)/10 = 8.8.'),
      q('Why does a graphing calculator’s mean from grouped data give only an estimate when the value list uses class midpoints?','The exact values within each class are unknown.',['The calculator ignores the frequency list.','The frequency for each class is halved.','The calculator uses the median instead of the mean.'],'The calculator treats every observation in a class as though it equalled the midpoint. The actual observations can differ from that midpoint.')
    ],['averages']),
  l('investigation','Investigating patterns','modelling','intl-core',
    'Build a table, test a conjecture and justify an investigation rule.',
    ['Record small cases in a systematic table, then look for an additive or multiplicative pattern. Keep units or counts clearly labelled.', 'State a conjecture that works for n in the intended domain. Test it with a case you did not use to find it.', 'Use the structure of the problem to justify the rule. A pattern matching early cases provides evidence but may not prove it.'],
    ['A row of n touching squares is made with sticks. The counts are 4, 7, 10, 13. Find and justify the rule.','The first square uses 4 sticks. Each added square shares one side and adds 3 sticks. Total = 4 + 3(n − 1) = 3n + 1.'],
    q('A pattern adds 5 pieces at each step. The first step has 8 pieces. Find the nth term.','5n + 3',['5n + 8','8n + 5','3n + 5'],'Start at 8 and add 5 exactly n − 1 times.'),
    [
      q('In the row-of-squares rule 3n + 1, how many sticks are needed for 10 squares?','31',['30','40','34'],'Substitute n = 10.'),
      q('What best justifies that 3n + 1 works for all positive integers n?','Show every added square shares an edge and uses three new sticks.',['Check n = 1 only.','Pick a large n at random.','Round the first four counts.'],'A structural explanation covers all positive integer cases.'),
      q('The first triangle in a stick pattern uses 3 sticks. Each new triangle shares exactly one existing side, so it adds 2 sticks. Find the total for n triangles.','2n + 1',['2n + 3','3n','3n − 2'],'The first triangle needs 3 sticks, then n − 1 more triangles need 2 each. The total is 3 + 2(n − 1) = 2n + 1.'),
      q('A conjecture predicts n² + 2n objects in case n. You count 34 objects in case 5. What does this test show?','Case 5 contradicts the conjecture because it predicts 35.',['Case 5 confirms the conjecture because it predicts 34.','Case 5 confirms the conjecture because all earlier cases match.','Case 5 is irrelevant because 5 is odd.'],'At n = 5 the rule predicts 25 + 10 = 35, which differs from 34. One counterexample is enough to disprove a conjecture claimed for every case.'),
      q('The first four counts in a pattern are 2, 6, 18 and 54. If the same multiplier continues, what count should you expect in case 5?','162',['72','108','216'],'Consecutive counts have ratio 3: 6/2 = 18/6 = 54/18 = 3. Multiply 54 by 3.')
    ],['sequences','expressions']),
  l('graph-transforms','Transforming function graphs','function-graphs','intl-extended',
    'Interpret shifts, reflections and stretches of y = f(x).',
    ['Adding k outside f moves the graph vertically by k. Replacing x with x − h moves it horizontally by h.', 'Multiplying the output scales vertical distances. Multiplying the input by b scales horizontal distances by 1/|b|. An outside minus reflects in the x-axis; an inside minus reflects in the y-axis.', 'Track a known point, intercept or asymptote through the change, then sketch the whole graph.'],
    ['The graph of y = f(x) passes through (2, 5). Find a corresponding point on y = 3f(x − 4).','Move right 4 and triple the output. The point becomes (6, 15).'],
    q('How does y = f(x + 2) transform y = f(x)?','Move left 2',['Move right 2','Move up 2','Move down 2'],'To give the same input, x must be 2 smaller.'),
    [
      q('Which rule reflects y = f(x) in the x-axis?','y = −f(x)',['y = f(−x)','y = f(x − 1)','y = f(x) − 1'],'A reflection in the x-axis changes the sign of the output.'),
      q('A point (8, 3) lies on y = f(x). Which point lies on y = f(2x)?','(4, 3)',['(16, 3)','(8, 6)','(8, 1.5)'],'The new x-value must satisfy 2x = 8.'),
      q('The point (−2, 4) lies on y = f(x). Where does it move on the graph y = f(−x) + 3?','(2, 7)',['(−2, 7)','(2, 1)','(−2, 1)'],'Changing the input to −x reflects in the y-axis, so x becomes 2. Adding 3 to the output changes y from 4 to 7.'),
      q('Which equation shifts y = f(x) two units to the right and four units down?','y = f(x − 2) − 4',['y = f(x + 2) − 4','y = f(x − 2) + 4','y = f(x − 4) − 2'],'Replacing x with x − 2 shifts every point 2 units right. Subtracting 4 from each output shifts the graph 4 units down.'),
      q('If y = f(x) has horizontal asymptote y = 2, what is the horizontal asymptote of y = −3f(x) + 1?','y = −5',['y = 7','y = −6','x = −5'],'The y-values near the asymptote are multiplied by −3 and then increased by 1. Their new limiting value is −3 × 2 + 1 = −5.')
    ],['gdc-graphs','functions']),
  l('function-models','Quadratic, exponential and logarithmic models','function-graphs','intl-extended',
    'Find parameters from graph features and recognise asymptotes.',
    ['A quadratic with roots p and q can be written a(x − p)(x − q). A zero that repeats gives a squared factor. A quadratic with vertex (h, k) can be written a(x − h)² + k.', 'Find the remaining parameter by substituting one other point. Check the direction of opening and the roots or vertex.', 'An asymptote is a line a curve approaches. For y = aˣ with a > 1, y = 0 is an asymptote. The inverse y = logₐ x has x = 0 as an asymptote and passes through (1, 0).'],
    ['A quadratic has roots 1 and 3 and passes through (0, 6). Find its equation.','Write y = a(x − 1)(x − 3). At x = 0, this gives 6 = 3a, so a = 2.'],
    q('What is the vertical asymptote of y = log₂ x?','x = 0',['y = 0','x = 1','y = 1'],'The logarithm is only defined for positive x and tends to negative infinity as x approaches 0 from the right.'),
    [
      q('A quadratic has vertex (3, 4) and passes through (4, 6). Find a in y = a(x − 3)² + 4.','2',['1','4','6'],'Substitute (4, 6) to get 6 = a + 4.'),
      q('Find log₂ 8.','3',['4','6','16'],'2³ = 8.'),
      q('A quadratic touches the x-axis at (2, 0) and passes through (0, 12). Which equation fits the graph?','y = 3(x − 2)²',['y = −3(x − 2)²','y = 3(x + 2)²','y = 12(x − 2)²'],'The repeated root x = 2 gives y = a(x − 2)². Substituting (0, 12) gives 12 = 4a, so a = 3.'),
      q('What is the horizontal asymptote of y = 4ˣ?','y = 0',['y = 1','y = 4','y = −4'],'As x becomes very negative, 4ˣ approaches 0 through positive values.'),
      q('The point (4, 16) lies on y = 2ˣ. Which point lies on the inverse graph y = log₂ x?','(16, 4)',['(4, 16)','(−4, 16)','(−16, 4)'],'An inverse swaps inputs and outputs. Since 2⁴ = 16, log₂ 16 = 4.')
    ],['quadratics','gdc-graphs']),
  l('model-check','Building and evaluating a model','modelling','intl-extended',
    'Build models from data, test predictions and explain limitations.',
    ['Choose variables with units and describe assumptions. A constant difference suggests a linear model, and a constant multiplier suggests exponential change.', 'Fit the model using given values or a GDC graph. Check it against a new observation and compute a residual as observed minus predicted.', 'Use a model to interpolate or compare scenarios. Explain when predictions outside the data range may fail, such as a physical limit on growth.'],
    ['A culture has 200 cells initially, 300 after an hour and 450 after two hours. Predict the count after three hours.','The multiplier is 1.5 per hour, suggesting C = 200 × 1.5ᵗ. The prediction at t = 3 is 675. Food and space may limit longer-term growth.'],
    q('A model predicted 42, but the observed value was 47. Find the residual.','5',['−5','42','89'],'Residual is observed minus predicted: 47 − 42 = 5.'),
    [
      q('Data at equal time steps are 80, 120 and 180. Which model fits these three values?','Multiply by 1.5 each step',['Add 40 each step','Add 60 each step','Multiply by 2 each step'],'120/80 and 180/120 both equal 1.5.'),
      q('Which statement best describes extrapolation?','Using a model outside the range of observed inputs',['Finding the difference between points','Using a model only inside its observed range','Calculating every observed value again'],'Extrapolation extends a model past the measured inputs.'),
      q('A model predicts the amount of water in a container as V = 45 − 3t litres after t minutes. At t = 8 the actual amount is 24 L. Find the residual.','3 L',['−3 L','21 L','45 L'],'The prediction is 45 − 3 × 8 = 21 L. Residual means observed minus predicted, so it is 24 − 21 = 3 L.'),
      q('The input values used to fit a production model are 2, 4, 6 and 8 hours. Which new prediction is an interpolation?','The amount produced after 5 hours',['The amount produced after 1 hour','The amount produced after 9 hours','The amount produced after 12 hours'],'5 is between the lowest and highest observed times. The other three inputs are outside that range.'),
      q('Data from the first 8 minutes of draining a tank fit the model V = 60 − 5t litres. Why is the prediction at t = 15 unreliable?','It gives a negative volume, so the model cannot still apply.',['It predicts a full tank at 15 minutes.','15 is one of the original observation times.','It gives the same volume as at t = 8.'],'The prediction is 60 − 5 × 15 = −15 L. A real tank cannot contain negative water, so the linear decrease cannot continue for that long.')
    ],['investigation','vary','function-models'])
];
