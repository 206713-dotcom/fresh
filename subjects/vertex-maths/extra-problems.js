const EXTRA_PROBLEMS = [
  {
    id: "ratios-drink", contest: "amc", track: "AMC 8", topic: "algebra", skill: "ratios", level: "Warm-up", format: "choice",
    title: "Mixing a fruit drink",
    prompt: "A recipe uses 3 parts concentrate to 7 parts water. How many millilitres of concentrate are needed to make 2.5 litres of the drink?",
    choices: ["450", "600", "750", "875", "1050"], answer: 2,
    hints: ["Find the amount of drink represented by one part of the ratio."],
    solution: ["There are 3 + 7 = 10 parts altogether. The total is 2500 mL, so each part is 250 mL.", "Concentrate accounts for three parts, or 3 × 250 = 750 mL."]
  },
  {
    id: "ratios-sale", contest: "ukmt", track: "UKMT Intermediate", topic: "algebra", skill: "ratios", level: "Intermediate", format: "choice",
    title: "Two price changes",
    prompt: "A shop reduces a price by 20%. Later it increases the reduced price by 15%. By what percentage is the final price below the original?",
    choices: ["5%", "8%", "10%", "15%", "20%"], answer: 1,
    hints: ["Take £100 as the original price, or multiply two scale factors."],
    solution: ["The reduction multiplies the price by 0.80. The increase multiplies that result by 1.15.", "The final price is 0.80 × 1.15 = 0.92 times the original, so it is 8% lower."]
  },
  {
    id: "ratios-solution", contest: "australian", track: "Australian AMC", topic: "algebra", skill: "ratios", level: "Intermediate", format: "integer",
    title: "Dilute to nine percent",
    prompt: "A 240 mL liquid mixture is 15% concentrate by volume. How many millilitres of water must be added to make the mixture 9% concentrate? Assume the volumes add.",
    answer: 160,
    hints: ["The volume of concentrate stays fixed while the total volume changes."],
    solution: ["The mixture contains 0.15 × 240 = 36 mL of concentrate. If that is 9% of the final volume, the final volume is 36/0.09 = 400 mL.", "The water added is 400 − 240 = 160 mL."]
  },
  {
    id: "divisibility-tiles", contest: "amc", track: "AMC 8", topic: "number", skill: "divisibility", level: "Warm-up", format: "choice",
    title: "The biggest square tiles",
    prompt: "A rectangular patio is 84 cm by 126 cm. It will be covered with identical square tiles with integer side lengths, laid in rows without gaps or cutting. What is the greatest possible side length of a tile, in centimetres?",
    choices: ["6", "14", "21", "28", "42"], answer: 4,
    hints: ["The tile side length must divide both dimensions of the patio."],
    solution: ["We need the greatest common divisor of 84 and 126. Subtracting gives 126 − 84 = 42, so any common divisor must divide 42.", "Since 84 = 2 × 42 and 126 = 3 × 42, the largest possible tile side is 42 cm."]
  },
  {
    id: "divisibility-flashes", contest: "kangaroo", track: "Math Kangaroo", topic: "number", skill: "divisibility", level: "Warm-up", format: "choice",
    title: "Two flashing lights",
    prompt: "Two lights flash together at time 0. One flashes every 6 seconds and the other every 8 seconds. How many times do they flash together after time 0 and within the first 100 seconds?",
    choices: ["2", "3", "4", "5", "6"], answer: 2,
    hints: ["Find the least positive time that is both a multiple of 6 and a multiple of 8."],
    solution: ["The least common multiple of 6 and 8 is 24. The lights flash together at 24, 48, 72 and 96 seconds before the time limit.", "There are 4 simultaneous flashes after the initial flash."]
  },
  {
    id: "divisibility-square", contest: "aime", track: "AIME", topic: "number", skill: "divisibility", level: "Intermediate", format: "integer",
    title: "Complete the square factorisation",
    prompt: "Find the smallest positive integer m such that 540m is a perfect square.",
    answer: 15,
    hints: ["In the prime factorisation of a perfect square, every exponent is even."],
    solution: ["Prime factorisation gives 540 = 2² × 3³ × 5. The powers of 3 and 5 have odd exponents.", "The least multiplier that makes both exponents even is 3 × 5 = 15. Indeed, 540 × 15 = 8100 = 90²."]
  },
  {
    id: "equations-tickets", contest: "amc", track: "AMC 8", topic: "algebra", skill: "equations", level: "Warm-up", format: "choice",
    title: "Tickets at the gate",
    prompt: "A group buys 18 tickets. Adult tickets cost $8 and student tickets cost $5. The total is $111. How many adult tickets did the group buy?",
    choices: ["6", "7", "8", "9", "11"], answer: 1,
    hints: ["Start with the price of 18 student tickets. How much does each adult ticket add?"],
    solution: ["If all the tickets were student tickets, the total would be 18 × $5 = $90. Each adult ticket adds $3 to that total.", "The extra amount is $111 − $90 = $21, so there are 21/3 = 7 adult tickets."]
  },
  {
    id: "equations-even", contest: "ukmt", track: "UKMT Junior", topic: "algebra", skill: "equations", level: "Warm-up", format: "choice",
    title: "Three even neighbours",
    prompt: "Three consecutive even integers sum to 78. What is the largest of the three?",
    choices: ["22", "24", "26", "28", "30"], answer: 3,
    hints: ["Write the integers using x for the middle one."],
    solution: ["The numbers are x − 2, x and x + 2. Their sum is 3x, so x = 78/3 = 26.", "The greatest is x + 2 = 28."]
  },
  {
    id: "equations-ages", contest: "euclid", track: "Euclid", topic: "algebra", skill: "equations", level: "Intermediate", format: "integer",
    title: "Six years either way",
    prompt: "In six years Ana will be twice Ben’s age. Six years ago Ana was four times Ben’s age. How old is Ana now?",
    answer: 30,
    hints: ["Use A and B for their current ages. Write a separate equation for each time."],
    solution: ["The future ages give A + 6 = 2(B + 6), so A = 2B + 6. The earlier ages give A − 6 = 4(B − 6), so A = 4B − 18.", "Equating the expressions gives 2B + 6 = 4B − 18, so B = 12 and A = 30."]
  },
  {
    id: "similarity-angles", contest: "kangaroo", track: "Math Kangaroo", topic: "geometry", skill: "similarity", level: "Warm-up", format: "choice",
    title: "Angles in proportion",
    prompt: "The angles of a triangle are in the ratio 2 : 3 : 4. What is the largest angle?",
    choices: ["70°", "75°", "80°", "90°", "100°"], answer: 2,
    hints: ["The three angles have a fixed sum, so find the size of one part."],
    solution: ["A triangle has 180° in total, and the ratio has 2 + 3 + 4 = 9 parts. One part is 20°.", "The largest angle has four parts, so it measures 80°."]
  },
  {
    id: "similarity-shadow", contest: "amc", track: "AMC 10", topic: "geometry", skill: "similarity", level: "Warm-up", format: "choice",
    title: "The flagpole’s shadow",
    prompt: "On level ground at the same time of day, a 1.2 m vertical stick casts a 0.9 m shadow and a vertical flagpole casts a 7.5 m shadow. How tall is the flagpole?",
    choices: ["7.5 m", "9 m", "10 m", "11.25 m", "12 m"], answer: 2,
    hints: ["The sun’s angle is the same, so the stick and flagpole form similar right triangles."],
    solution: ["Both right triangles have the same angle between a sun ray and the ground. The ratio of height to shadow length is therefore 1.2/0.9 = 4/3.", "The flagpole is 7.5 × 4/3 = 10 m tall."]
  },
  {
    id: "similarity-parallel", contest: "ukmt", track: "UKMT Senior", topic: "geometry", skill: "similarity", level: "Intermediate", format: "choice",
    title: "A slice of a triangle",
    prompt: "In triangle ABC, D lies on AB and E lies on AC, with DE parallel to BC. The ratio AD : DB is 2 : 3 and the area of triangle ADE is 24. What is the area of quadrilateral DBCE?",
    choices: ["36", "60", "96", "126", "150"], answer: 3,
    hints: ["The side ratio AD/AB is 2/5. What is the area ratio of the two similar triangles?"],
    solution: ["Triangles ADE and ABC are similar since DE is parallel to BC. The side scale factor from ABC to ADE is 2/5, so the area scale factor is (2/5)² = 4/25.", "Triangle ABC has area 24 × 25/4 = 150. Subtracting triangle ADE leaves 150 − 24 = 126."]
  },
  {
    id: "sequences-rows", contest: "australian", track: "Australian AMC", topic: "algebra", skill: "sequences", level: "Warm-up", format: "choice",
    title: "Seats in the last row",
    prompt: "The first row of a theatre has 7 seats. Each following row has 3 more seats than the row before it. How many seats are in the twelfth row?",
    choices: ["33", "36", "37", "40", "43"], answer: 3,
    hints: ["How many increases occur between the first row and the twelfth row?"],
    solution: ["There are 11 increases of 3 seats between the first and twelfth rows. The twelfth row has 7 + 11 × 3 = 40 seats."]
  },
  {
    id: "sequences-sum", contest: "amc", track: "AMC 10", topic: "algebra", skill: "sequences", level: "Intermediate", format: "choice",
    title: "Add every third number",
    prompt: "What is the sum of the first 20 positive integers that leave remainder 2 when divided by 3?",
    choices: ["590", "600", "610", "620", "630"], answer: 2,
    hints: ["The first number is 2 and the common difference is 3. Pair the terms from opposite ends."],
    solution: ["The last of these 20 numbers is 2 + 19 × 3 = 59. When we pair the first with the last, the second with the next-to-last, and so on, each pair sums to 61.", "Ten such pairs give a sum of 610."]
  },
  {
    id: "sequences-geometric", contest: "aime", track: "AIME", topic: "algebra", skill: "sequences", level: "Intermediate", format: "integer",
    title: "Recover a geometric sequence",
    prompt: "A geometric sequence of positive numbers has second term 6 and fifth term 162. Find the sum of its first five terms.",
    answer: 242,
    hints: ["The fifth term is three multiplications by the common ratio after the second term."],
    solution: ["The common ratio r satisfies 6r³ = 162, so r³ = 27 and r = 3.", "The terms are 2, 6, 18, 54 and 162. Their sum is 242."]
  },
  {
    id: "modular-weekday", contest: "amc", track: "AMC 8", topic: "number", skill: "modular", level: "Warm-up", format: "choice",
    title: "A hundred days from now",
    prompt: "Today is Wednesday. What day of the week will it be 100 days from today?",
    choices: ["Thursday", "Friday", "Saturday", "Sunday", "Monday"], answer: 1,
    hints: ["Every full group of seven days brings you back to Wednesday."],
    solution: ["Since 100 = 14 × 7 + 2, fourteen weeks bring us back to Wednesday and two more days bring us to Friday."]
  },
  {
    id: "modular-digits", contest: "aime", track: "AIME", topic: "number", skill: "modular", level: "Challenge", format: "integer",
    title: "The end of a large power",
    prompt: "Find the integer formed by the last two digits of 3<sup>77</sup>.",
    answer: 63,
    hints: ["Work modulo 100. Compute 3⁵, 3<sup>10</sup> and 3<sup>20</sup> modulo 100."],
    solution: ["The remainders of 3⁵ and 3<sup>10</sup> are 43 and 43² ≡ 49 (mod 100). Thus 3<sup>20</sup> ≡ 49² ≡ 1 (mod 100).", "Since 77 = 3 × 20 + 17, we only need 3<sup>17</sup>. That has the same remainder as 49 × 43 × 9. As 49 × 43 ≡ 7, the final remainder is 63."]
  },
  {
    id: "modular-seven", contest: "imo", track: "IMO Prep", topic: "number", skill: "modular", level: "Intermediate", format: "proof",
    title: "Two squares modulo seven",
    prompt: "Let a and b be integers. Prove that if 7 divides a² + b², then 7 divides both a and b.",
    hints: ["List the possible remainders of a square modulo 7.", "Which square remainders can add to 0 modulo 7?"],
    solution: ["Squaring residues 0, ±1, ±2 and ±3 modulo 7 gives the possible square residues 0, 1, 4 and 2 respectively.", "The additive inverses of 1, 2 and 4 modulo 7 are 6, 5 and 3, none of which is a square residue. Thus a² + b² can be 0 modulo 7 only when both squares are 0 modulo 7.", "Since 7 is prime, it divides each of a and b."]
  },
  {
    id: "circles-sector", contest: "ukmt", track: "UKMT Intermediate", topic: "geometry", skill: "circles", level: "Warm-up", format: "choice",
    title: "A sixth of a circle",
    prompt: "A circle has radius 6 cm. What is the area in square centimetres of a sector with central angle 60°?",
    choices: ["3π", "6π", "9π", "12π", "18π"], answer: 1,
    hints: ["The 60° sector is a fraction of the whole 360° circle."],
    solution: ["The circle has area π × 6² = 36π. The sector occupies 60/360 = 1/6 of the circle, so it has area 6π."]
  },
  {
    id: "circles-ring", contest: "australian", track: "Australian AMC", topic: "geometry", skill: "circles", level: "Intermediate", format: "integer",
    title: "The ring between two circles",
    prompt: "Two circles with a common centre have circumferences 26π and 10π. The area between them is kπ. Find k.",
    answer: 144,
    hints: ["Use the circumferences to find the radii, then subtract the two circle areas."],
    solution: ["Circumference equals 2πr, so the radii are 13 and 5.", "The ring has area π(13² − 5²) = 144π, hence k = 144."]
  },
  {
    id: "circles-tangent", contest: "euclid", track: "Euclid", topic: "geometry", skill: "circles", level: "Challenge", format: "integer",
    title: "The common tangent",
    prompt: "Circles with radii 8 and 5 touch externally. A line touches both circles at P and Q, and both centres lie on the same side of the line. Find PQ².",
    answer: 160,
    hints: ["The radii to P and Q are perpendicular to the line. The centres are 13 apart."],
    solution: ["The two centres are 13 apart because the circles touch externally. Along the direction perpendicular to the tangent, their distances from the line differ by 8 − 5 = 3.", "Along the tangent direction, their separation is PQ. The Pythagorean theorem gives PQ² + 3² = 13², so PQ² = 160."]
  },
  {
    id: "counting-friends", contest: "kangaroo", track: "Math Kangaroo", topic: "combinatorics", skill: "counting", level: "Warm-up", format: "choice",
    title: "Friends side by side",
    prompt: "Four different friends line up for a photograph. In how many lineups are Alice and Ben next to each other?",
    choices: ["6", "8", "10", "12", "24"], answer: 3,
    hints: ["Treat Alice and Ben as a single block, then count their orders inside that block."],
    solution: ["There are three objects to arrange, the block and the two other friends, giving 3! = 6 orders.", "Within the block Alice can stand before or after Ben, so there are 6 × 2 = 12 lineups."]
  },
  {
    id: "counting-schools", contest: "amc", track: "AMC 10", topic: "combinatorics", skill: "counting", level: "Intermediate", format: "choice",
    title: "A team from both schools",
    prompt: "Five students from one school and four students from another are available for a team of three. How many teams can be chosen with at least one student from each school?",
    choices: ["56", "60", "64", "70", "84"], answer: 3,
    hints: ["Count all three-person teams, then subtract the teams drawn entirely from one school."],
    solution: ["There are C(9, 3) = 84 teams of three. Of these, C(5, 3) = 10 come solely from the first school and C(4, 3) = 4 solely from the second school.", "Subtracting gives 84 − 10 − 4 = 70."]
  },
  {
    id: "counting-five", contest: "aime", track: "AIME", topic: "combinatorics", skill: "counting", level: "Challenge", format: "integer",
    title: "A four-digit multiple of five",
    prompt: "How many four-digit positive integers divisible by 5 can be formed using the digits 0 through 6 with no digit repeated?",
    answer: 220,
    hints: ["The last digit is either 0 or 5. The two cases have different choices for the first digit."],
    solution: ["For a last digit of 0, choose any of the six nonzero digits first, then pick the two middle digits in 5 × 4 ways. This gives 120 numbers.", "For a last digit of 5, there are five nonzero choices for the first digit, then 5 × 4 choices for the middle digits. This gives 100 numbers.", "The cases are disjoint, so the total is 220."]
  },
  {
    id: "probability-marbles", contest: "amc", track: "AMC 8", topic: "combinatorics", skill: "probability", level: "Warm-up", format: "choice",
    title: "Two red marbles",
    prompt: "A bag holds 4 red and 3 blue marbles. Two marbles are drawn at random without replacement. What is the probability both are red?",
    choices: ["1/7", "2/7", "3/7", "4/7", "5/7"], answer: 1,
    hints: ["After a red first draw, how many red marbles and total marbles remain?"],
    solution: ["The probability of red on the first draw is 4/7. Given that result, the chance of another red is 3/6.", "Multiplying the conditional probabilities gives (4/7)(3/6) = 2/7."]
  },
  {
    id: "probability-dice", contest: "amc", track: "AMC 10", topic: "combinatorics", skill: "probability", level: "Intermediate", format: "choice",
    title: "A six, given a nine",
    prompt: "Two fair six-sided dice are rolled. Given that their sum is 9, what is the probability that at least one shows a 6?",
    choices: ["1/6", "1/4", "1/3", "1/2", "2/3"], answer: 3,
    hints: ["The condition limits the sample space to ordered pairs whose entries sum to 9."],
    solution: ["The outcomes consistent with the sum are (3, 6), (4, 5), (5, 4) and (6, 3). They are equally likely, and exactly two contain a 6.", "The conditional probability is 2/4 = 1/2."]
  },
  {
    id: "probability-coins", contest: "aime", track: "AIME", topic: "combinatorics", skill: "probability", level: "Challenge", format: "integer",
    title: "Heads with space between",
    prompt: "A fair coin is flipped six times independently. The probability that no two heads are consecutive equals m/n in lowest terms. Find m + n.",
    answer: 85,
    hints: ["Count valid strings ending in T and those ending in H separately.", "A valid string ending in H is either the single letter H or ends in TH."],
    solution: ["Let f(k) count valid strings of k flips. Those ending in T can extend any valid string of length k − 1. Those ending in H must end in TH, and the first k − 2 flips can be any valid string.", "Thus f(k) = f(k − 1) + f(k − 2), with f(0) = 1 and f(1) = 2. The next counts are 3, 5, 8, 13 and 21.", "There are 64 equally likely outcomes, so the reduced probability is 21/64 and m + n = 85."]
  },
  {
    id: "coordinates-distance", contest: "amc", track: "AMC 8", topic: "geometry", skill: "coordinates", level: "Warm-up", format: "choice",
    title: "Across the grid",
    prompt: "What is the distance between the points (−2, 1) and (4, 9)?",
    choices: ["6", "8", "10", "12", "14"], answer: 2,
    hints: ["Use the horizontal and vertical changes as the legs of a right triangle."],
    solution: ["The horizontal change is 4 − (−2) = 6. The vertical change is 9 − 1 = 8.", "The Pythagorean theorem gives the distance √(6² + 8²) = 10."]
  },
  {
    id: "coordinates-crossing", contest: "euclid", track: "Euclid", topic: "geometry", skill: "coordinates", level: "Intermediate", format: "integer",
    title: "Where the line crosses",
    prompt: "The line through (−2, 3) and (4, 6) crosses the x-axis at (k, 0). Find k.",
    answer: -8,
    hints: ["Find the slope and work out how far left you must go from (−2, 3) to get down to height 0."],
    solution: ["The slope is (6 − 3)/(4 − (−2)) = 1/2. A decrease of 3 in y therefore means a decrease of 6 in x.", "Starting at x = −2 gives k = −2 − 6 = −8."]
  },
  {
    id: "coordinates-lattice", contest: "aime", track: "AIME", topic: "geometry", skill: "coordinates", level: "Challenge", format: "integer",
    title: "Integer points inside a circle",
    prompt: "How many points with integer coordinates lie strictly inside the circle with centre (0, 0) and radius 5?",
    answer: 69,
    hints: ["For each possible x, count integers y with x² + y² < 25.", "Use symmetry between x and −x. Points on the circle must be excluded."],
    solution: ["For x = 0, ±1 or ±2, the possible y values run from −4 to 4, so each such column has 9 points.", "For x = ±3, y² < 16, giving 7 points in each column. For x = ±4, y² < 9, giving 5 points in each column. No other integer x is possible.", "The total is 5 × 9 + 2 × 7 + 2 × 5 = 69."]
  },
  {
    id: "polynomials-reciprocals", contest: "amc", track: "AMC 12", topic: "algebra", skill: "polynomials", level: "Intermediate", format: "choice",
    title: "Reciprocals of the roots",
    prompt: "Let r and s be the roots of x² − 7x + 10 = 0. What is 1/r + 1/s?",
    choices: ["3/10", "1/2", "7/10", "1", "10/7"], answer: 2,
    hints: ["Use the sum and product of the roots to combine the two fractions."],
    solution: ["By Viète’s relations, r + s = 7 and rs = 10. In particular, both roots are nonzero.", "The reciprocal sum is (r + s)/(rs) = 7/10."]
  },
  {
    id: "polynomials-cubes", contest: "aime", track: "AIME", topic: "algebra", skill: "polynomials", level: "Challenge", format: "integer",
    title: "A difference of cubes",
    prompt: "Positive real numbers x and y satisfy x − y = 5 and x³ − y³ = 665. Find xy.",
    answer: 36,
    hints: ["Factor x³ − y³. Express the second factor in terms of (x − y)² and xy."],
    solution: ["We have x³ − y³ = (x − y)(x² + xy + y²) = (x − y)((x − y)² + 3xy).", "Substitution gives 665 = 5(25 + 3xy). Thus 133 − 25 = 3xy and xy = 36."]
  },
  {
    id: "polynomials-difference", contest: "imo", track: "IMO Prep", topic: "algebra", skill: "polynomials", level: "Challenge", format: "proof",
    title: "A polynomial from its differences",
    prompt: "A real polynomial P satisfies P(x + 1) − P(x) = 2x + 1 for every real x. Prove that P(x) = x² + c for some constant c.",
    hints: ["The polynomial x² already has the required difference. Subtract it.", "A nonconstant polynomial has a nonzero leading term in Q(x + 1) − Q(x)."],
    solution: ["Let Q(x) = P(x) − x². Because (x + 1)² − x² = 2x + 1, we get Q(x + 1) − Q(x) = 0 for every x.", "If Q has degree d ≥ 1 and leading coefficient a ≠ 0, the binomial expansion shows Q(x + 1) − Q(x) has x<sup>d−1</sup> coefficient ad. Terms of degree less than d in Q contribute only to degrees below d − 1 after subtraction.", "The coefficient ad is nonzero, which contradicts the zero difference. Hence Q is constant and P(x) = x² + c."]
  },
  {
    id: "inequalities-product", contest: "amc", track: "AMC 12", topic: "algebra", skill: "inequalities", level: "Intermediate", format: "choice",
    title: "The largest product",
    prompt: "Positive real numbers x and y satisfy x + y = 20. What is the largest possible value of xy?",
    choices: ["80", "90", "99", "100", "200"], answer: 3,
    hints: ["Compare (x + y)² with 4xy by subtracting one from the other."],
    solution: ["The identity (x + y)² − 4xy = (x − y)² ≥ 0 gives 4xy ≤ 400, so xy ≤ 100.", "The value 100 is achieved at x = y = 10."]
  },
  {
    id: "inequalities-fractions", contest: "imo", track: "IMO Prep", topic: "algebra", skill: "inequalities", level: "Intermediate", format: "proof",
    title: "Three fractions with a common pattern",
    prompt: "For positive real numbers a, b and c, prove that a/(b + c) + b/(c + a) + c/(a + b) ≥ 3/2. Determine when equality holds.",
    hints: ["Let S = a + b + c and rewrite a/(b + c) as S/(b + c) − 1.", "For positive x and y, x/y + y/x ≥ 2 follows from (x − y)² ≥ 0."],
    solution: ["For positive x, y and z, expand (x + y + z)(1/x + 1/y + 1/z). It is 3 plus three pairs of reciprocal ratios. Each pair is at least 2 by (x − y)² ≥ 0 and its analogues, so the product is at least 9, with equality exactly when x = y = z.", "Set x = b + c, y = c + a and z = a + b. Their sum is 2S. Therefore S(1/x + 1/y + 1/z) ≥ 9/2.", "The sum in the question equals S(1/x + 1/y + 1/z) − 3, so it is at least 3/2. Equality is equivalent to x = y = z, or a = b = c."]
  },
  {
    id: "inequalities-order", contest: "imo", track: "IMO Prep", topic: "algebra", skill: "inequalities", level: "Challenge", format: "proof",
    title: "A symmetric cubic inequality",
    prompt: "For positive real numbers a, b and c, prove that a³ + b³ + c³ + 3abc ≥ a²b + a²c + b²a + b²c + c²a + c²b. Determine when equality holds.",
    hints: ["The expression is symmetric, so you can assume a ≥ b ≥ c.", "Write the difference between the sides as a(a − b)(a − c) + b(b − a)(b − c) + c(c − a)(c − b)."],
    solution: ["The expression is symmetric, so assume a ≥ b ≥ c. The difference between the left and right sides is a(a − b)(a − c) + b(b − a)(b − c) + c(c − a)(c − b).", "The first two terms combine to (a − b)²(a + b − c), which is nonnegative. The third term is also nonnegative because both differences in it are nonpositive.", "Since a + b − c > 0, equality implies a = b. The third term is then c(c − a)², so equality requires c = a as well. Conversely, a = b = c gives equality."]
  },
  {
    id: "invariants-lamps", contest: "kangaroo", track: "Math Kangaroo", topic: "combinatorics", skill: "invariants", level: "Warm-up", format: "choice",
    title: "Switches in pairs",
    prompt: "Seven lamps are initially off. In one move you toggle exactly two different lamps, turning each on if it was off and off if it was on. Which number of lamps on is impossible to reach?",
    choices: ["0", "2", "3", "4", "6"], answer: 2,
    hints: ["A move changes the number of lamps on by −2, 0 or 2."],
    solution: ["The number of lamps on is initially even. Every move preserves its parity, since the change is −2, 0 or 2.", "Each listed even number can be reached by turning on pairs of lamps, using no moves for 0. The impossible number is 3."]
  },
  {
    id: "invariants-board", contest: "usamo", track: "USAJMO / USAMO Prep", topic: "combinatorics", skill: "invariants", level: "Intermediate", format: "proof",
    title: "The last number on the board",
    prompt: "The numbers 1 through 10 are written on a board. Each move replaces any two numbers a and b with the single number |a − b|. Prove that the final number is odd.",
    hints: ["Compare a + b and |a − b| modulo 2."],
    solution: ["The two quantities a + b and |a − b| differ by twice the smaller number, so they have the same parity. Therefore every move preserves the parity of the sum on the board.", "The original sum is 55, which is odd. When only one number remains, it equals the current sum, so that number is odd."]
  },
  {
    id: "invariants-colours", contest: "imo", track: "IMO Prep", topic: "combinatorics", skill: "invariants", level: "Challenge", format: "proof",
    title: "A checkerboard balance",
    prompt: "Every cell of a 4 × 4 grid starts at 0. In one move, choose two cells that share an edge and add 1 to each. Prove it is impossible to end with 2 in every cell except one cell that contains 4.",
    hints: ["Colour the grid like a checkerboard.", "Compare the sum on the black squares with the sum on the white squares after each move."],
    solution: ["Any cells sharing an edge have opposite colours. Each move therefore adds 1 to the black-square sum and 1 to the white-square sum, preserving the difference between the two sums.", "The sums start equal. A grid of all 2s would have both sums equal to 16, but raising one entry from 2 to 4 would make one sum 18 and leave the other 16.", "That target has unequal sums, so no sequence of moves reaches it."]
  },
  {
    id: "proof-square-sum", contest: "euclid", track: "Euclid", topic: "algebra", skill: "proof", level: "Intermediate", format: "proof",
    title: "The sum of the first squares",
    prompt: "Prove that 1² + 2² + ⋯ + n² = n(n + 1)(2n + 1)/6 for every positive integer n.",
    hints: ["Start at n = 1. In the induction step, add (k + 1)² to the formula you assumed for k."],
    solution: ["For n = 1 the formula gives 1 × 2 × 3/6 = 1. Suppose it holds at n = k.", "After adding (k + 1)², the sum is (k + 1)[k(2k + 1) + 6(k + 1)]/6.", "The bracket simplifies to 2k² + 7k + 6 = (k + 2)(2k + 3), so the result is (k + 1)(k + 2)(2k + 3)/6. This is the claimed expression for n = k + 1, completing the induction."]
  },
  {
    id: "proof-steps", contest: "imo", track: "IMO Prep", topic: "number", skill: "proof", level: "Intermediate", format: "proof",
    title: "Build every total with fours and fives",
    prompt: "Prove that every integer n ≥ 12 can be written as 4a + 5b for nonnegative integers a and b.",
    hints: ["Adding one more 4 preserves representability.", "Find four consecutive starting totals, then use strong induction."],
    solution: ["The four starting totals are 12 = 3 × 4, 13 = 2 × 4 + 5, 14 = 4 + 2 × 5, and 15 = 3 × 5.", "For n ≥ 16, assume all totals from 12 through n − 1 can be written in the required form. Since n − 4 ≥ 12, we have n − 4 = 4a + 5b for nonnegative integers a and b.", "Then n = 4(a + 1) + 5b, which completes the strong induction."]
  },
  {
    id: "proof-tiling", contest: "usamo", track: "USAJMO / USAMO Prep", topic: "combinatorics", skill: "proof", level: "Challenge", format: "proof",
    title: "A square board with a missing cell",
    prompt: "For every positive integer n, prove that a 2<sup>n</sup> × 2<sup>n</sup> board with any one cell removed can be tiled by L-shaped trominoes. Each tromino covers three cells of a 2 × 2 square and may be rotated.",
    hints: ["Divide the board into four equally sized quadrants.", "Place one tromino at the centre so that every quadrant has one unavailable cell."],
    solution: ["For n = 1, the three remaining cells of the 2 × 2 board form one L-shaped tromino.", "Assume the result for side length 2<sup>n</sup>. Split a board of side length 2<sup>n+1</sup> into four quadrants. The removed cell lies in one quadrant. Cover the other three quadrants’ innermost cells with one central tromino.", "Every quadrant now has exactly one unavailable cell. The induction hypothesis tiles the rest of each quadrant. These tilings and the central tromino cover precisely the cells required."]
  }
];
