import {check as q, lesson as l} from './model.js';

export const data = [
  l('probability','Single events and complements','probability','core',
    'Use the probability scale and calculate complementary outcomes.',
    ['Probabilities range from 0 for impossible to 1 for certain. With equally likely outcomes, divide the number of favourable outcomes by the total.', 'The probability of the complement of A is 1 − P(A). Probabilities across mutually exclusive, exhaustive outcomes sum to 1.', 'Use tables, Venn diagrams or counts to find the relevant numerator and denominator.'],
    ['A bag contains 3 green counters and 7 blue counters. Find P(not green).','P(green) = 3/10, so P(not green) = 1 − 3/10 = 7/10.'],
    q('A fair die is rolled. Find P(a number greater than 4).','1/3',['1/6','1/2','2/3'],'Two of the six equally likely results, 5 and 6, are greater than 4.'),
    [
      q('P(rain) = 0.28. Find P(no rain).','0.72',['0.28','0.82','1.28'],'Subtract the probability of rain from 1.'),
      q('A spinner has 10 equal sectors and 4 are red. Find P(red).','2/5',['1/4','3/5','1/10'],'4 out of 10 simplifies to 2/5.'),
      q('One tile is drawn at random from a box with 4 white, 5 black and 3 orange tiles. Find P(white or orange).','7/12',['1/3','5/12','3/4'],'There are 4 + 3 = 7 favourable tiles out of 4 + 5 + 3 = 12 tiles.'),
      q('A spinner can land only on red, blue or green. P(red) = 0.27 and P(blue) = 0.31. Find P(green).','0.42',['0.58','0.04','0.69'],'The three disjoint outcomes sum to 1, so P(green) = 1 − 0.27 − 0.31 = 0.42.'),
      q('A spinner has eight sectors numbered 1 to 8. Which event has probability 1?','Landing on a number less than 9',['Landing on an even number','Landing on a number greater than 8','Landing on a multiple of 3'],'Every sector is numbered less than 9, so this event is certain.')
    ],['fractions']),
  l('frequency','Relative and expected frequency','probability','core',
    'Estimate probabilities from experiments and predict counts.',
    ['Relative frequency is the observed event count divided by the number of trials. Repeated random trials usually give a more stable estimate when the sample is larger.', 'Expected frequency is probability × number of trials. The observed count can differ from the expected count.', 'A random selection gives every eligible unit an appropriate chance. Systematic over- or under-representation can bias conclusions.'],
    ['A spinner lands on purple 27 times in 90 spins. Estimate the count in 300 spins.','The estimated probability is 27/90 = 0.3. The expected count is 0.3 × 300 = 90.'],
    q('A biased coin lands heads 36 times in 120 flips. Estimate P(heads).','0.3',['0.36','0.7','0.12'],'Divide 36 by 120.'),
    [
      q('A prize is won with probability 0.04. How many wins are expected in 250 plays?','10',['6.25','40','100'],'Expected count = 250 × 0.04.'),
      q('Which estimate usually has less random variation for the same spinner?','The fraction from 1000 independent spins',['The fraction from 10 independent spins','The fraction from 2 independent spins','The result of its first spin'],'A larger number of independent trials stabilises the relative frequency.'),
      q('A bus was late on 18 of 72 observed days. Use this relative frequency to predict how many times it will be late in 180 comparable days.','45',['18','25','72'],'The estimated probability is 18/72 = 0.25. Multiply by 180 to predict 45 late days.'),
      q('A spinner lands on red 14 times in its first 50 spins and 22 times in its next 70 spins. Find the relative frequency of red across both batches.','0.30',['0.28','0.31','0.36'],'Combine the counts and the trials before dividing: (14 + 22)/(50 + 70) = 36/120 = 0.30.'),
      q('A school council wants to estimate the chance that a student walks to school. Which sample is least likely to be biased?','Students picked randomly from the whole school register',['Students getting off the first school bus','Students who arrive before 7:45 a.m.','Students in one after-school club'],'A random sample of the entire register gives each student the same chance of selection, regardless of how they get to school.')
    ],['probability']),
  l('combined-prob','Sample spaces and tree diagrams','probability','core',
    'Find combined probabilities for independent events with replacement.',
    ['A sample-space table lists every combined outcome. A tree diagram shows successive stages, with probabilities from each node summing to 1.', 'Multiply probabilities along a branch for “and”. Add disjoint branches for “or”. With replacement, repeating a draw keeps its probabilities unchanged.'],
    ['A bag has 2 red and 3 blue counters. Draw twice with replacement. Find the probability of exactly one red.','Red then blue and blue then red are two disjoint routes. Add (2/5)(3/5) + (3/5)(2/5) = 12/25.'],
    q('A fair coin is tossed twice. Find P(two heads).','1/4',['1/2','3/4','1'],'Both tosses must be heads, so multiply 1/2 × 1/2.'),
    [
      q('Two fair dice are rolled. Find P(sum of 3).','1/18',['1/6','1/12','1/36'],'There are 36 equally likely ordered pairs. Exactly (1, 2) and (2, 1) work.'),
      q('A counter is blue with probability 2/5. Draw twice with replacement. Find P(no blue).','9/25',['4/25','6/25','3/5'],'Both draws must be non-blue, with probability (3/5)².'),
      q('A coin has P(heads) = 3/4. It is tossed twice independently. Find P(exactly one head).','3/8',['3/16','9/16','15/16'],'Heads then tails and tails then heads each have probability (3/4)(1/4) = 3/16. Add both branches to get 6/16 = 3/8.'),
      q('A coin is tossed and a six-sided die is rolled. How many different ordered pairs (coin result, die result) are possible?','12',['6','8','36'],'Each of the 2 coin outcomes can be paired with each of the 6 die outcomes, giving 2 × 6 = 12.'),
      q('Two independent spinners each have four equal sectors numbered 1 to 4. Find P(the sum is at least 7).','3/16',['1/16','1/8','1/4'],'Of the 16 equally likely ordered pairs, (3, 4), (4, 3) and (4, 4) give a sum of at least 7.')
    ],['probability']),
  l('conditional','Conditional probability and dependent events','probability','extended',
    'Update probabilities after a draw and reason with conditional information.',
    ['Without replacement, update both the remaining event count and the total after a draw.', 'P(A given B) = P(A ∩ B)/P(B) when P(B) > 0. In a frequency table, restrict the denominator to the group described by B.', 'Independent events satisfy P(A ∩ B) = P(A)P(B). Mutually exclusive events have no overlap. For overlapping events, subtract their intersection once when finding the union.'],
    ['A bag has 3 red and 2 green counters. Find P(two red without replacement).','P(first red) = 3/5. There are then 2 red out of 4. Multiply (3/5)(2/4) = 3/10.'],
    q('A club has 18 students, including 10 girls. Four of the girls play chess. Given a girl is selected, find P(she plays chess).','2/5',['2/9','5/9','7/9'],'The condition restricts the sample to 10 girls; 4/10 = 2/5.'),
    [
      q('A bag contains 4 yellow and 1 black counter. Draw twice without replacement. Find P(yellow then black).','1/5',['4/25','1/4','4/5'],'The probability is (4/5)(1/4) = 1/5.'),
      q('P(A) = 0.5 and P(B) = 0.4. The events are independent. Find P(A ∩ B).','0.2',['0.1','0.45','0.9'],'Multiply the probabilities for independent events.'),
      q('Of 60 learners, 24 bring a packed lunch, and 15 of those learners walk to school. One learner is picked at random. Given that they bring a packed lunch, find the probability they do not walk to school.','3/8',['5/8','3/20','1/4'],'Restrict the sample to the 24 learners who bring a packed lunch. Of those, 24 − 15 = 9 do not walk, so the probability is 9/24 = 3/8.'),
      q('P(A) = 0.55, P(B) = 0.38 and P(A ∩ B) = 0.23. Find P(A ∪ B).','0.70',['0.93','0.47','0.32'],'Adding P(A) and P(B) counts the overlap twice. Subtract the overlap once: 0.55 + 0.38 − 0.23 = 0.70.'),
      q('A box contains 5 blue and 3 white counters. Two are drawn at random without replacement. Given that the first is white, find the probability the second is white.','2/7',['3/8','3/7','1/4'],'Removing the first white counter leaves 2 white counters out of 7 in total.')
    ],['combined-prob','sets']),
  l('averages','Averages, range and frequency tables','statistics','core',
    'Calculate and compare averages, including estimates from grouped data.',
    ['Sort raw data to find the median. The mode is the most frequent value, and range is largest minus smallest. The mean is the total divided by the count.', 'For values with frequencies, use Σfx/Σf. With grouped data, use class midpoints as x-values and describe the result as an estimate.', 'The modal class has the greatest frequency. Use spread as well as a typical value when comparing two distributions.'],
    ['Find the mean of scores 2, 4 and 7 with respective frequencies 3, 2 and 1.','The weighted total is 2(3) + 4(2) + 7(1) = 21. Divide by 6 to get 3.5.'],
    q('A list is 4, 6, 6, 9, 10, 15. Find its median.','7.5',['6','9','8'],'With six values, average the third and fourth values: (6 + 9)/2.'),
    [
      q('A class in a grouped table covers 20 ≤ x < 30. Which midpoint is used to estimate the mean?','25',['20','29.5','30'],'Average the boundaries: (20 + 30)/2.'),
      q('Values 3 and 7 have frequencies 2 and 6. Find the mean.','6',['5','7','8'],'(3 × 2 + 7 × 6)/(2 + 6) = 48/8 = 6.'),
      q('The intervals 0 ≤ x < 10, 10 ≤ x < 20 and 20 ≤ x < 30 have frequencies 2, 5 and 3 respectively. Estimate the mean.','16',['15','11','21'],'Use midpoints 5, 15 and 25. The weighted total is 2 × 5 + 5 × 15 + 3 × 25 = 160. Divide by 2 + 5 + 3 = 10.'),
      q('Find the mode and range of 2, 5, 5, 8, 9, 9, 9, 12.','Mode 9, range 10',['Mode 5, range 10','Mode 9, range 12','Mode 8, range 7'],'9 appears three times, more than any other value. The range is 12 − 2 = 10.'),
      q('Four students have a mean score of 12. A fifth student who scored 17 joins the group. Find the new mean.','13',['12','14.5','16'],'The first four scores sum to 4 × 12 = 48. The new total is 48 + 17 = 65, so the mean is 65/5 = 13.')
    ],['fractions']),
  l('charts','Data collection and statistical charts','statistics','core',
    'Classify data and interpret bar charts, pie charts, pictograms and stem-and-leaf diagrams.',
    ['Categorical data are labels. Discrete numeric data are counted and continuous data are measured. Record results with tallies or frequencies and choose a representative sample.', 'Bar charts compare categories or discrete values. A dual bar chart shows two groups side by side, and a stacked chart shows their contributions within each bar.', 'A pie-chart angle is frequency ÷ total × 360°. A pictogram needs a key. For a stem-and-leaf diagram, order the leaves and include a key that states how to read them.'],
    ['12 of 48 learners chose cycling. Find its pie-chart sector angle.','Cycling is 12/48 = 1/4 of the total. The sector angle is 90°.'],
    q('In a survey of 60 students, a pie-chart sector is 72°. How many students does it represent?','12',['6','18','30'],'72/360 is one fifth. One fifth of 60 is 12.'),
    [
      q('A stem-and-leaf key says 4 | 7 means 47. Read 6 | 2.','62',['26','6.2','8'],'The stem gives the tens and the leaf gives the units.'),
      q('Which variable is continuous?','A runner’s time',['Number of runners','Shoe colour','Number of laps'],'Time can take any value in an interval, depending on measurement precision.'),
      q('A pictogram key says a whole symbol represents 12 bicycles. How many bicycles are represented by two whole symbols and one half-symbol?','30',['18','24','36'],'Two whole symbols represent 24 bicycles. Half a symbol represents 6 more, for a total of 30.'),
      q('A dual bar chart shows that Year 10 borrowed 14 fiction and 9 non-fiction books, while Year 11 borrowed 18 fiction and 6 non-fiction books. Which year borrowed more books in total?','Year 11, by 1',['Year 10, by 1','Year 11, by 4','The totals are equal'],'Year 10 borrowed 14 + 9 = 23 books. Year 11 borrowed 18 + 6 = 24 books, one more.'),
      q('In a stem-and-leaf diagram, 2 | 4 means 24. Stem 2 has leaves 1, 4, 9; stem 3 has leaves 2, 5. Find the median.','29',['24','30','32'],'The ordered values are 21, 24, 29, 32 and 35. The middle of five values is the third, 29.')
    ],['averages']),
  l('scatter','Scatter diagrams and correlation','statistics','core',
    'Recognise correlation and estimate values from a line of best fit.',
    ['Plot each paired observation as a point. A general upward trend suggests positive correlation; downward suggests negative. A patternless cloud suggests little linear correlation.', 'Draw a line of best fit through the overall trend, with points roughly balanced on either side across the data range.', 'Interpolation estimates within the range of observed data. Extrapolation outside that range is less reliable. A correlation alone cannot establish cause and effect.'],
    ['A best-fit line for a plant’s height is y = 2x + 5 over measured times x = 1 to 8 days. Estimate its height at day 6.','Use 2(6) + 5 = 17 units. Day 6 is within the measured range, so this is interpolation.'],
    q('On a scatter diagram, y generally decreases as x increases. What type of correlation is shown?','Negative',['Positive','Zero','Perfect positive'],'An overall downward trend indicates negative correlation.'),
    [
      q('Values of x were measured from 5 to 12. Which prediction uses interpolation?','x = 9',['x = 2','x = 15','x = 20'],'x = 9 is within the range 5 to 12.'),
      q('A line of best fit is y = 4x − 3. Estimate y at x = 5.','17',['20','23','8'],'Evaluate 4 × 5 − 3.'),
      q('A scatter diagram shows a positive correlation between outdoor temperature and ice-cream sales. What does that alone show?','Sales tend to be higher on hotter days.',['Temperature is the only cause of higher sales.','Sales always rise by the same amount per degree.','The variables have no association.'],'Positive correlation describes an overall tendency. It does not establish causation or a fixed increase.'),
      q('A best-fit line is y = 35 − 0.8x for observations with 10 ≤ x ≤ 30. Which result correctly extrapolates from the line?','x = 35 gives y = 7',['x = 20 gives y = 19','x = 25 gives y = 15','x = 35 gives y = 63'],'35 is outside the observed range. Substitution gives y = 35 − 0.8 × 35 = 7.'),
      q('Which line is the best choice for a scatter diagram with a near-linear trend?','A line following the trend with points roughly balanced above and below',['A line joining the two points with the largest y-values','A line through the origin even if all the points lie well above it','A line connecting points in the order they were recorded'],'A line of best fit represents the overall relationship. It need not pass through any particular point.')
    ],['charts','coordinates']),
  l('cumulative','Cumulative frequency and quartiles','statistics','extended',
    'Build cumulative frequencies and estimate medians, percentiles and IQR.',
    ['Add frequencies as running totals and plot at the upper class boundaries. Include the lowest boundary with cumulative frequency 0 when constructing a curve.', 'For a grouped curve with total N, read the median at cumulative frequency N/2, and quartiles at N/4 and 3N/4. The interquartile range is Q₃ − Q₁.', 'Read a pth percentile at cumulative frequency pN/100. Quantiles estimated from a grouped graph depend on its plotted curve.'],
    ['A curve for 80 observations gives x = 14 at cumulative frequency 20 and x = 32 at 60. Find the IQR.','These are Q₁ and Q₃ since 80/4 = 20 and 3 × 80/4 = 60. IQR = 32 − 14 = 18.'],
    q('For 120 values, at which cumulative frequency do you read the upper quartile?','90',['30','60','100'],'The upper quartile is at 75% of the total: 0.75 × 120.'),
    [
      q('A class has frequency 11 and the previous cumulative frequency is 19. Find the new cumulative frequency.','30',['19','8','209'],'Add 11 to the running total of 19.'),
      q('The lower and upper quartiles are 9 and 24. Find the IQR.','15',['33','16.5','24'],'IQR = 24 − 9.'),
      q('The cumulative frequencies at x = 12 and x = 18 are 24 and 57. How many observations satisfy 12 < x ≤ 18?','33',['24','57','81'],'57 observations are at most 18. Remove the 24 that are at most 12 to get 57 − 24 = 33.'),
      q('A cumulative frequency graph represents 160 observations. At which cumulative frequency do you read the 35th percentile?','56',['35','48','104'],'Take 35% of the total: 0.35 × 160 = 56. Read the x-value at this cumulative frequency.'),
      q('Group A has a median of 18 and an interquartile range of 6. Group B has a median of 16 and an interquartile range of 10. How does A compare with B?','Higher median and smaller spread for the middle half',['Higher median and larger spread for the middle half','Lower median and smaller spread for the middle half','Equal median and equal spread for the middle half'],'18 > 16, so A has the higher median. Its smaller IQR, 6 < 10, means its middle half is less spread out.')
    ],['averages','charts']),
  l('histograms','Histograms and frequency density','statistics','extended',
    'Use bar areas to represent frequencies when class widths differ.',
    ['Frequency density = frequency ÷ class width. In a histogram, the frequency is represented by the bar’s area.', 'Read class width from the interval boundaries. To recover a frequency from a histogram, multiply height (density) by width.', 'Adjacent continuous class intervals touch. Compare densities for the tallest bar and compare areas when asked which class has the most observations.'],
    ['A class from 20 to 35 has frequency 45. Find its density.','Its width is 35 − 20 = 15. Density = 45/15 = 3.'],
    q('A histogram bar has width 8 and density 2.5. Find the frequency.','20',['3.2','0.3125','10.5'],'Frequency is width × density.'),
    [
      q('Which has greater frequency? A has width 4 and density 5. B has width 10 and density 3.','B',['A','They are equal','It cannot be found'],'Areas are 20 and 30, so B has more observations.'),
      q('A class from 50 to 70 has frequency 32. Find the density.','1.6',['0.625','16','0.4'],'Divide 32 by the class width, 20.'),
      q('Class A has width 5 and frequency 30. Class B has width 14 and frequency 42. Which histogram bar is taller?','A, with frequency density 6',['B, with frequency density 3','B, with frequency density 42','They are the same height'],'Heights are the densities: 30/5 = 6 for A and 42/14 = 3 for B.'),
      q('A histogram has three bars of widths 5, 10 and 15 with respective frequency densities 4, 3 and 2. Find the total frequency.','80',['9','50','60'],'Add the areas: 5 × 4 + 10 × 3 + 15 × 2 = 20 + 30 + 30 = 80.'),
      q('A histogram bar starts at x = 25, has frequency 36 and has frequency density 2.4. Find its upper class boundary.','40',['27.4','37','61'],'Divide the frequency by the density to find width 36/2.4 = 15. The upper boundary is 25 + 15 = 40.')
    ],['charts'])
];
