/* Competition maths lessons, part 2: combinatorics, geometry, proof and strategy. Written for Geodesic; answers checked in verify.py. */
WL.cmL({ id: 'co-count', area: 'co', title: 'Counting: arrangements, choices, stars and bars',
  hook: ['How many four-digit numbers have four different digits?',
    '9 choices for the first digit (it cannot be 0), then 9 for the second (any digit except the first), 8 for the third and 7 for the fourth: 9 × 9 × 8 × 7 = 4536.'],
  ideas: [
    ['Multiply and add', 'If a choice happens in stages, multiply the numbers of options at each stage (the product rule). If the outcomes split into separate cases, add the counts (the sum rule). Most counting is a careful mix of the two.'],
    ['Arrangements and selections', 'n different objects can be lined up in n! ways. Choosing k of them in order gives n!/(n − k)!; without order, C(n, k) = n!/(k!(n − k)!). Letters with repeats: BANANA has 6!/(3! × 2!) = 60 arrangements.'],
    ['Stars and bars', 'The number of ways to write n as an ordered sum of k non-negative integers is C(n + k − 1, k − 1): line up n stars and k − 1 bars. If every part must be positive, give each part 1 first: C(n − 1, k − 1).'],
    ['Count the complement', 'When “at least one” is awkward, count everything and subtract the cases with none.'],
    ['Count each object exactly once', 'Overcounting is the classic mistake. Either fix an order (count sets, not sequences), or count with repeats and divide by how many times each object was counted.']],
  ex: [
    { q: 'In how many ways can the letters of BANANA be arranged?', sol: ['6 letters, with A three times and N twice.', '6!/(3! × 2!) = 720/12 = 60.'], a: '60' },
    { q: 'How many solutions does a + b + c = 10 have in positive integers?', sol: ['Give each of a, b and c one unit first: then a′ + b′ + c′ = 7 with non-negative parts.', 'Stars and bars: C(7 + 2, 2) = C(9, 2) = 36.'], a: '36' }],
  pr: [
    { t: 'mc', lv: 1, q: 'How many three-digit positive integers have at least one digit equal to 7?', ch: ['225', '243', '252', '271', '300'], a: 2,
      hint: 'Count those with no 7.', sol: 'There are 900 three-digit numbers. Those with no 7: 8 choices for the first digit (1 to 9 except 7) and 9 for each of the others, 8 × 9 × 9 = 648. So 900 − 648 = 252 have a 7.' },
    { t: 'int', lv: 2, q: 'In how many ways can 12 identical sweets be shared among 4 children so that each gets at least 2?', a: 35,
      hint: 'Hand out 8 sweets first.', sol: 'Give each child 2 sweets. The remaining 4 can be shared freely: C(4 + 3, 3) = C(7, 3) = 35.' },
    { t: 'int', lv: 2, q: 'A path from (0, 0) to (5, 5) moves one unit right or one unit up at each step. How many such paths avoid the point (2, 2)?', a: 132,
      hint: 'Count all paths, then the ones through (2, 2).', sol: 'All paths: C(10, 5) = 252. Through (2, 2): C(4, 2) ways to get there times C(6, 3) ways to go on, 6 × 20 = 120. So 252 − 120 = 132 avoid it.' },
    { t: 'proof', lv: 2, q: 'Prove, by counting one set in two ways, that C(n, k) = C(n − 1, k − 1) + C(n − 1, k) for 1 ≤ k ≤ n − 1.',
      hint: 'Count the k-element subsets of {1, …, n} according to whether they contain n.',
      sol: 'C(n, k) counts the k-element subsets of {1, 2, …, n}. Split them into two kinds. Those containing n: choose the other k − 1 elements from {1, …, n − 1}, in C(n − 1, k − 1) ways. Those not containing n: all k elements come from {1, …, n − 1}, in C(n − 1, k) ways. Every subset is of exactly one kind, so the two counts add up to C(n, k).' }],
  traps: ['Forgetting that a number cannot start with 0.', 'Counting ordered selections when the question asks for unordered ones, or the other way round.', 'Stars and bars counts non-negative solutions; adjust first if the parts must be positive or have other lower bounds.'] });

WL.cmL({ id: 'co-pie', area: 'co', title: 'Inclusion–exclusion, bijections and recursion',
  hook: ['How many of the integers from 1 to 100 are divisible by 2, 3 or 5?',
    'Add the multiples of each: 50 + 33 + 20 = 103. Numbers divisible by two of them were counted twice, so subtract 16 (multiples of 6), 10 (of 10) and 6 (of 15). Multiples of 30 were added three times and subtracted three times, so add back 3. Total: 103 − 32 + 3 = 74.'],
  ideas: [
    ['Inclusion–exclusion', '|A ∪ B ∪ C| = |A| + |B| + |C| − |A ∩ B| − |B ∩ C| − |C ∩ A| + |A ∩ B ∩ C|. In general: add the single sets, subtract the pairs, add the triples, and so on.'],
    ['Derangements', 'The number of ways to arrange n objects so that none is in its own place is D_n = n!(1 − 1/1! + 1/2! − … ± 1/n!). For n = 2, 3, 4, 5, 6 this gives 1, 2, 9, 44, 265, and D_n = (n − 1)(D_{n−1} + D_{n−2}).'],
    ['Bijections', 'To count a set, match it one to one with a set that is easier to count. Lattice paths match strings of R’s and U’s; the subsets of an n-element set match the strings of n zeros and ones, so there are 2^n of them.'],
    ['Recursion', 'Count the objects of size n by what happens at one end, in terms of smaller sizes. Tilings of a 2 × n strip by dominoes: the strip ends either in one upright domino or in two flat ones, so a_n = a_{n−1} + a_{n−2}.'],
    ['Small cases first', 'Work out n = 1, 2, 3, 4 by hand. The numbers often reveal the recursion, or a familiar sequence: Fibonacci, powers of 2, or the Catalan numbers 1, 2, 5, 14, 42.']],
  ex: [
    { q: 'Five letters are put into five addressed envelopes at random. In how many ways does no letter go into its own envelope?',
      sol: ['This is D₅.', 'D₅ = 5! × (1/2! − 1/3! + 1/4! − 1/5!) = 60 − 20 + 5 − 1 = 44.'], a: '44' },
    { q: 'In how many ways can a 2 × 8 rectangle be tiled with 1 × 2 dominoes?',
      sol: ['a₁ = 1 and a₂ = 2, and a_n = a_{n−1} + a_{n−2}.', 'a₃ = 3, a₄ = 5, a₅ = 8, a₆ = 13, a₇ = 21, a₈ = 34.'], a: '34' }],
  pr: [
    { t: 'mc', lv: 1, q: 'How many integers from 1 to 60 are divisible by neither 2 nor 3?', ch: ['16', '18', '20', '22', '24'], a: 2,
      hint: 'Subtract the multiples of 2 and of 3, then correct the double count.', sol: '60 − 30 − 20 + 10 = 20.' },
    { t: 'int', lv: 2, q: 'How many subsets of {1, 2, …, 10}, including the empty set, contain no two consecutive integers?', a: 144,
      hint: 'Let s_n count such subsets of {1, …, n}, and split by whether n is in the subset.',
      sol: 'If n is not in the subset, the rest is any such subset of {1, …, n − 1}; if n is in it, n − 1 is not, and the rest is any such subset of {1, …, n − 2}. So s_n = s_{n−1} + s_{n−2}, with s₁ = 2 and s₂ = 3. Then s₃ = 5, s₄ = 8, and so on up to s₁₀ = 144.' },
    { t: 'int', lv: 3, q: 'How many functions from {1, 2, 3, 4, 5} to {1, 2, 3} take every value at least once?', a: 150,
      hint: 'Count all functions, then subtract those that miss a value, using inclusion–exclusion.',
      sol: 'All functions: 3⁵ = 243. Those missing a given value: 2⁵ = 32, with 3 values to choose. Those missing two given values: 1, with 3 pairs to choose. So 243 − 3 × 32 + 3 × 1 = 150.' },
    { t: 'int', lv: 3, q: 'How many strings of 10 letters, each A or B, contain no three consecutive A’s?', a: 504,
      hint: 'A good string ends in B, BA or BAA after a shorter good string.',
      sol: 'Let t_n be the number of good strings of length n, with t₀ = 1, t₁ = 2 and t₂ = 4. For n ≥ 3, a good string is a good string of length n − 1 followed by B, of length n − 2 followed by BA, or of length n − 3 followed by BAA. So t_n = t_{n−1} + t_{n−2} + t_{n−3}: 7, 13, 24, 44, 81, 149, 274, 504.' }],
  traps: ['In inclusion–exclusion the signs alternate; stopping after the pairs leaves an error.', 'A recursion needs correct starting values: check them by listing small cases.', 'For “every value at least once”, count the functions that miss a value and subtract.'] });

WL.cmL({ id: 'co-pigeon', area: 'co', title: 'Pigeonhole, invariants and the extremal principle',
  hook: ['Choose any six integers. Prove that two of them differ by a multiple of 5.',
    'There are only five possible remainders on division by 5, so two of the six numbers have the same remainder (the pigeonhole principle). Their difference is then a multiple of 5.'],
  ideas: [
    ['The pigeonhole principle', 'If more than n objects go into n boxes, some box holds at least two. More generally, if N objects go into k boxes, some box holds at least N/k of them, rounded up.'],
    ['Choosing the boxes', 'The art is in the boxes: remainders, pairs of numbers with a fixed sum, regions of a square, parity patterns. Ask: what would two objects in one box give me?'],
    ['Invariants', 'If a process never changes some quantity (a sum, a parity, a remainder, a colour count), every reachable state has the same value as the start. This proves that some targets can never be reached.'],
    ['Monovariants', 'A quantity that always moves the same way, say a positive integer that always decreases, cannot do so for ever, so the process must stop.'],
    ['The extremal principle', 'Look at the largest, smallest, closest or longest object. Its extremality often forces a contradiction or gives the structure you need, as in proofs by “minimal counterexample”.']],
  ex: [
    { q: 'Eleven numbers are chosen from {1, 2, …, 20}. Prove that one of them divides another.',
      sol: ['Write each number as 2^k × m with m odd. Here m is one of the ten odd numbers 1, 3, …, 19.', 'With eleven numbers and ten possible values of m, two of the chosen numbers have the same m.', 'They are 2^a × m and 2^b × m with a ≠ b, and the smaller divides the larger.'], a: 'Pigeonhole on the odd part.' },
    { q: 'Two opposite corner squares are cut from a chessboard. Can the remaining 62 squares be covered by 31 dominoes?',
      sol: ['Each domino covers one black and one white square, so 31 dominoes cover 31 of each.', 'Opposite corners have the same colour, so the board left has 32 squares of one colour and 30 of the other.', 'So the covering is impossible.'], a: 'No.' }],
  pr: [
    { t: 'mc', lv: 1, q: 'A drawer holds 10 red, 10 blue and 10 green socks. In the dark, what is the least number you must take out to be sure of a matching pair?', ch: ['2', '3', '4', '11', '21'], a: 2,
      hint: 'The three colours are three boxes.', sol: 'With 3 socks you might have one of each colour; with 4, two must share a colour.' },
    { t: 'int', lv: 2, q: 'What is the smallest n such that any n different integers chosen from {1, 2, …, 100} must include two whose sum is 101?', a: 51,
      hint: 'Pair the numbers up.', sol: 'The pairs {1, 100}, {2, 99}, …, {50, 51} contain every number once. Choosing 1, …, 50 (one from each pair) gives 50 numbers with no two summing to 101, so n > 50. Among any 51 numbers two come from the same pair, so n = 51.' },
    { t: 'proof', lv: 2, q: 'Prove that among any five points inside a square of side 2, there are two at distance at most √2.',
      hint: 'Cut the square into four.', sol: 'Divide the square into four unit squares. Two of the five points lie in the same unit square (a point on a shared edge can be counted in either). Two points in a unit square are at most its diagonal, √2, apart.' },
    { t: 'proof', lv: 3, q: 'The numbers 1, 2, …, 20 are written on a board. A move erases two numbers a and b and writes |a − b|. After 19 moves one number is left. Can it be 1? Can it be 0? Prove your answers.',
      hint: 'How does a move change the sum of the numbers, modulo 2?',
      sol: '|a − b| has the same parity as a + b, so a move does not change the parity of the total. The total starts at 1 + 2 + … + 20 = 210, which is even, so the last number is even: it cannot be 1. It can be 0: pair (1, 2), (3, 4), …, (19, 20) to get ten 1’s, pair those to get five 0’s, and combine the 0’s.' }],
  traps: ['Pigeonhole proves that two objects share a box; it does not tell you which.', 'An invariant shows what is impossible; to show something is possible, give a construction.', 'Boxes that are too big make the principle useless: aim for as many boxes as you can while still getting a useful conclusion.'] });

WL.cmL({ id: 'co-prob', area: 'co', title: 'Probability and expected value',
  hook: ['You roll a fair die until a 6 appears. On average, how many rolls does it take?',
    'Let E be the expected number. The first roll is a 6 with probability 1/6; otherwise you are back where you started, one roll later. So E = 1 + (5/6)E, and E = 6.'],
  ideas: [
    ['Count equally likely outcomes', 'When outcomes are equally likely, the probability is favourable/total. Make sure they really are equally likely: the totals of two dice are not.'],
    ['Complements and independence', 'P(at least one) = 1 − P(none). For independent events, multiply: the chance of no 6 in four rolls is (5/6)⁴.'],
    ['Linearity of expectation', 'E[X + Y] = E[X] + E[Y] always, even when X and Y depend on each other. Write a count as a sum of indicators (1 if something happens, 0 if not); the expected count is then the sum of the probabilities.'],
    ['States and equations', 'For processes that wander (runs of coin tosses, random walks), let E_s be the expected time to finish from state s, and write one equation per state from what happens at the first step. Then solve.'],
    ['Geometric probability', 'For a point chosen uniformly in a region, probability is a ratio of areas (or lengths). Draw the region where the event happens.']],
  ex: [
    { q: 'Ten people put their hats in a box and each takes one at random. What is the expected number who get their own hat back?',
      sol: ['Let X_i be 1 if person i gets their own hat and 0 if not. P(X_i = 1) = 1/10.', 'The number of matches is X₁ + … + X₁₀, so its expected value is 10 × 1/10 = 1.'], a: '1' },
    { q: 'A fair coin is tossed until two heads come up in a row. What is the expected number of tosses?',
      sol: ['Let E₀ be the expected number of tosses still needed at the start or after a tail, and E₁ the number needed just after a head.', 'E₀ = 1 + ½E₁ + ½E₀ and E₁ = 1 + ½ × 0 + ½E₀.', 'Substituting: E₀ = 1 + ½(1 + ½E₀) + ½E₀ = 3/2 + ¾E₀, so E₀ = 6.'], a: '6' }],
  pr: [
    { t: 'mc', lv: 1, q: 'Two fair dice are rolled. What is the probability that the total is 8?', ch: ['1/9', '5/36', '1/6', '7/36', '1/4'], a: 1,
      hint: 'List the pairs.', sol: 'The pairs (2, 6), (3, 5), (4, 4), (5, 3) and (6, 2): 5 out of 36.' },
    { t: 'int', lv: 2, q: 'A bag holds 4 red and 6 blue balls. Two are drawn without replacement. The probability that they are the same colour is m/n in lowest terms. Find m + n.', a: 22,
      hint: 'Count pairs of balls.', sol: 'Same-colour pairs: C(4, 2) + C(6, 2) = 6 + 15 = 21, out of C(10, 2) = 45. 21/45 = 7/15, so m + n = 22.' },
    { t: 'int', lv: 3, q: 'A fair die is rolled 4 times. The expected number of different values that appear is m/n in lowest terms. Find m + n.', a: 887,
      hint: 'Use an indicator for each face.', sol: 'Face k appears at least once with probability 1 − (5/6)⁴ = 671/1296. By linearity the expected number of faces seen is 6 × 671/1296 = 671/216, already in lowest terms (671 = 11 × 61). So m + n = 887.' },
    { t: 'int', lv: 2, q: 'A frog starts at 0 on a number line. Each second it jumps 1 to the left or 1 to the right, with equal probability. What is the expected number of jumps until it first reaches 2 or −2?', a: 4,
      hint: 'By symmetry only the distance from 0 matters.', sol: 'Let E₀ and E₁ be the expected numbers of jumps still needed at distance 0 and at distance 1. From 0 the frog always moves to distance 1: E₀ = 1 + E₁. From distance 1 it finishes with probability ½ or returns to 0: E₁ = 1 + ½E₀. So E₀ = 2 + ½E₀, and E₀ = 4.' }],
  traps: ['Treating unequal outcomes as equally likely, like the totals of two dice.', 'Multiplying the probabilities of events that are not independent.', 'An expected value is an average, not the most likely value.'] });

WL.cmL({ id: 'ge-angles', area: 'ge', title: 'Angles and circles',
  hook: ['Why is the angle in a semicircle always a right angle?',
    'Join the point on the circle to the centre. This makes two isosceles triangles, with base angles x and y. The angles of the whole triangle add up to 2x + 2y = 180°, so the angle at the point, x + y, is 90°.'],
  ideas: [
    ['The basic facts', 'Angles on a line add up to 180°, angles in a triangle add up to 180°, an exterior angle equals the sum of the two opposite interior angles, and the base angles of an isosceles triangle are equal. Most angle chases need nothing more.'],
    ['Inscribed angles', 'An angle at the circumference is half the angle at the centre standing on the same arc. So all angles standing on the same arc, on the same side, are equal, and the angle in a semicircle is 90°.'],
    ['Cyclic quadrilaterals', 'The opposite angles of a cyclic quadrilateral add up to 180°. Conversely, if they do, the four points lie on a circle; and if two points see a segment at equal angles from the same side, the four points lie on a circle. Spotting a hidden cyclic quadrilateral is the key to many problems.'],
    ['Tangents', 'A tangent is perpendicular to the radius at the point of contact; the two tangents from an outside point are equal in length; and the angle between a tangent and a chord equals the inscribed angle on the other side of the chord (the alternate segment theorem).'],
    ['How to chase', 'Draw a large, accurate figure and mark every equal angle. Call one unknown x and express the others in terms of it, until two expressions for the same angle meet.']],
  ex: [
    { q: 'ABCD is a cyclic quadrilateral with ∠A = 3∠C. Find ∠A.', sol: ['Opposite angles add up to 180°: ∠A + ∠C = 180°.', 'So 4∠C = 180°, ∠C = 45° and ∠A = 135°.'], a: '135°' },
    { q: 'Tangents from P touch a circle with centre O at A and B, and ∠APB = 50°. C is a point on the major arc AB. Find ∠ACB.',
      sol: ['OA ⟂ PA and OB ⟂ PB, so in the quadrilateral PAOB, ∠AOB = 360° − 90° − 90° − 50° = 130°.', 'An inscribed angle on the major arc is half the central angle on the minor arc: ∠ACB = 65°.'], a: '65°' }],
  pr: [
    { t: 'mc', lv: 1, q: 'Each interior angle of a regular polygon is 156°. How many sides does it have?', ch: ['12', '14', '15', '16', '18'], a: 2,
      hint: 'Look at the exterior angles.', sol: 'Each exterior angle is 180° − 156° = 24°, and the exterior angles add up to 360°, so there are 360/24 = 15 sides.' },
    { t: 'int', lv: 2, q: 'A, B, C and D lie on a circle in that order. ∠ABD = 35° and ∠DBC = 45°. Find ∠ADC in degrees.', a: 100,
      hint: 'BD splits the angle ABC.', sol: '∠ABC = 35° + 45° = 80°. ABCD is cyclic, so ∠ADC = 180° − 80° = 100°.' },
    { t: 'int', lv: 3, q: 'In triangle ABC, ∠A = 50° and ∠B = 60°. The tangent to the circumcircle at A meets the line BC at T. Find ∠ATB in degrees.', a: 10,
      hint: 'First decide on which side of BC the point T lies, then use the alternate segment theorem.',
      sol: '∠C = 70°. If T were beyond B, triangle TAB would have ∠TAB = ∠ACB = 70° (alternate segment theorem) and ∠ABT = 180° − 60° = 120°, more than 180° together, which is impossible. So T is beyond C. In triangle TAC, ∠TAC = ∠ABC = 60° (alternate segment theorem) and ∠ACT = 180° − 70° = 110°, so ∠ATC = 10°. ∠ATB is the same angle: 10°. (In general the tangent at A meets BC at an angle equal to the difference of the angles B and C.)' },
    { t: 'proof', lv: 2, q: 'In triangle ABC, BE and CF are altitudes, with E on AC and F on AB. Prove that B, C, E and F lie on a circle.',
      hint: 'Which segment do E and F both see at a right angle?', sol: '∠BEC = 90° and ∠BFC = 90°, so E and F both lie on the circle with diameter BC, by the converse of the angle in a semicircle. Hence B, C, E and F lie on one circle.' }],
  traps: ['Using a cyclic-quadrilateral fact before showing that the quadrilateral is cyclic.', 'The tangent–chord angle equals the inscribed angle on the other side of the chord, not on the same side.', 'Trusting a sketch: draw it large and accurate, and check that a special case is not misleading you.'] });

WL.cmL({ id: 'ge-lengths', area: 'ge', title: 'Lengths, similar triangles and the power of a point',
  hook: ['Two chords of a circle cross. One is cut into pieces 4 and 6; one piece of the other is 3. How long is the fourth piece?',
    'The products of the pieces are equal (the intersecting chords theorem): 4 × 6 = 3 × x, so x = 8.'],
  ideas: [
    ['Similar triangles', 'Two equal angles make two triangles similar, and then all corresponding lengths are in the same ratio. Look for them where there are parallel lines, equal angles in a circle or right angles.'],
    ['Pythagoras and special triangles', 'Know the families 3–4–5, 5–12–13, 8–15–17 and 7–24–25, and the 30–60–90 (1 : √3 : 2) and 45–45–90 (1 : 1 : √2) triangles. Dropping a perpendicular often creates right-angled triangles to work with.'],
    ['The power of a point', 'Through a point P, every line meeting a circle at X and Y gives the same product PX × PY. For chords crossing inside: PA × PB = PC × PD. For an outside point: PA × PB = PT², where PT is a tangent.'],
    ['Angle bisectors', 'The bisector of angle A meets BC at D with BD/DC = AB/AC.'],
    ['Areas', 'Area = ½ab sin C = rs (r the inradius, s the semi-perimeter) = abc/(4R), and Heron’s formula gives √(s(s − a)(s − b)(s − c)). Triangles with the same height have areas in the ratio of their bases.']],
  ex: [
    { q: 'From a point P, a tangent to a circle has length 12. A line through P meets the circle at A and B, with PA = 8. Find AB.',
      sol: ['Power of a point: PA × PB = PT², so 8 × PB = 144 and PB = 18.', 'AB = PB − PA = 10.'], a: '10' },
    { q: 'Find the area of the triangle with sides 13, 14 and 15, and the altitude to the side of length 14.',
      sol: ['s = 21, so by Heron the area is √(21 × 8 × 7 × 6) = √7056 = 84.', 'The altitude h to the side 14 satisfies ½ × 14 × h = 84, so h = 12.'], a: 'Area 84, altitude 12.' }],
  pr: [
    { t: 'mc', lv: 1, q: 'A right-angled triangle has legs 9 and 12. How long is the altitude to the hypotenuse?', ch: ['6', '6.5', '7.2', '7.5', '8'], a: 2,
      hint: 'Work out the area in two ways.', sol: 'The hypotenuse is 15. The area is ½ × 9 × 12 = 54 = ½ × 15 × h, so h = 108/15 = 7.2.' },
    { t: 'int', lv: 2, q: 'In triangle ABC, AB = 10 and AC = 15. The bisector of angle A meets BC at D, and BD = 6. Find BC.', a: 15,
      hint: 'Use the angle bisector theorem.', sol: 'BD/DC = AB/AC = 10/15, so DC = 9 and BC = 6 + 9 = 15.' },
    { t: 'int', lv: 3, q: 'A circle passes through two adjacent corners of a square of side 8 and touches the opposite side of the square. Find its radius.', a: 5,
      hint: 'Use coordinates, with the square from (0, 0) to (8, 8).',
      sol: 'Let the circle pass through (0, 0) and (8, 0) and touch the side y = 8. Its centre is (4, k) and its radius is 8 − k. The distance from the centre to (0, 0) gives 16 + k² = (8 − k)² = 64 − 16k + k², so k = 3 and the radius is 5.' },
    { t: 'proof', lv: 2, q: 'The chords AC and BD of a circle meet at X. Prove that XA × XC = XB × XD.',
      hint: 'Find two similar triangles.', sol: '∠XAB = ∠CAB = ∠CDB = ∠XDC, since ∠CAB and ∠CDB both stand on the arc BC. Also ∠AXB = ∠DXC (vertically opposite). So triangles XAB and XDC are similar, giving XA/XD = XB/XC, that is XA × XC = XB × XD.' }],
  traps: ['Pairing the wrong sides of similar triangles: write the vertices in matching order before forming ratios.', 'In the power of a point, all lengths are measured from P.', 'In the angle bisector theorem, BD goes with AB and DC with AC.'] });

WL.cmL({ id: 'ge-trig', area: 'ge', title: 'Trigonometry, coordinates and vectors',
  hook: ['A triangle has sides 5 and 8 with an angle of 60° between them. How long is the third side?',
    'By the cosine rule, c² = 25 + 64 − 2 × 5 × 8 × cos 60° = 89 − 40 = 49, so c = 7.'],
  ideas: [
    ['Sine and cosine rules', 'a/sin A = b/sin B = c/sin C = 2R, where R is the circumradius, and c² = a² + b² − 2ab cos C. The cosine rule finds an angle when all three sides are known; the sine rule links sides to the opposite angles.'],
    ['Three area formulas', 'Area = ½ab sin C = abc/(4R) = rs. Comparing them gives R and r quickly.'],
    ['Coordinates', 'Place the figure so the algebra is simple: a vertex at the origin, a side along an axis, a centre of symmetry at (0, 0). The shoelace formula gives the area of a polygon from its vertices, taken in order: half the absolute value of (x₁y₂ − x₂y₁) + (x₂y₃ − x₃y₂) + … + (x_ny₁ − x₁y_n).'],
    ['Vectors', 'The dot product a · b = |a||b| cos θ detects right angles: a · b = 0. The centroid of a triangle is (A + B + C)/3, which proves that the medians meet at one point and divide each other in the ratio 2 : 1.'],
    ['Complex numbers', 'Multiplying by cos θ + i sin θ rotates the plane by θ about the origin. Rotations by 60° or 90° turn many problems about equilateral triangles and squares into algebra.']],
  ex: [
    { q: 'Find the area of the triangle with vertices (1, 2), (4, 6) and (7, 1).', sol: ['Shoelace: ½|1 × (6 − 1) + 4 × (1 − 2) + 7 × (2 − 6)| = ½|5 − 4 − 28| = 27/2.'], a: '13.5' },
    { q: 'A triangle has sides 7, 8 and 13. Find its largest angle.', sol: ['The largest angle is opposite the side 13: cos C = (49 + 64 − 169)/(2 × 7 × 8) = −56/112 = −1/2.', 'So C = 120°.'], a: '120°' }],
  pr: [
    { t: 'mc', lv: 1, q: 'A triangle has sides 5, 7 and 8. What is the angle opposite the side of length 7?', ch: ['30°', '45°', '60°', '90°', '120°'], a: 2,
      hint: 'Use the cosine rule.', sol: 'cos θ = (25 + 64 − 49)/(2 × 5 × 8) = 40/80 = 1/2, so θ = 60°.' },
    { t: 'int', lv: 2, q: 'Find the area of the quadrilateral with vertices (0, 0), (6, 0), (8, 5) and (2, 7), taken in that order.', a: 38,
      hint: 'Use the shoelace formula.', sol: '½|(0 × 0 − 6 × 0) + (6 × 5 − 8 × 0) + (8 × 7 − 2 × 5) + (2 × 0 − 0 × 7)| = ½(0 + 30 + 46 + 0) = 38.' },
    { t: 'int', lv: 3, q: 'In triangle ABC, AB = 5, AC = 8 and ∠A = 60°. If R is the radius of the circumcircle, find 3R².', a: 49,
      hint: 'Find BC first.', sol: 'BC² = 25 + 64 − 40 = 49, so BC = 7. By the sine rule, 2R = 7/sin 60° = 14/√3, so R = 7/√3 and 3R² = 49.' },
    { t: 'proof', lv: 2, q: 'Prove with vectors that the three medians of a triangle pass through one point, which divides each median in the ratio 2 : 1.',
      hint: 'Consider the point G = (A + B + C)/3.', sol: 'Let A, B and C be position vectors, and M = (B + C)/2 the midpoint of BC. The point dividing AM in the ratio 2 : 1 is A + ⅔(M − A) = (A + B + C)/3 = G. This expression does not change when A, B and C are permuted, so the same point G divides each of the three medians in the ratio 2 : 1. In particular all three medians pass through G.' }],
  traps: ['Mixing degrees and radians.', 'The shoelace formula needs the vertices in order around the polygon; a crossed order gives nonsense.', 'The sine rule can give two possible angles, θ and 180° − θ: check which one fits.'] });

WL.cmL({ id: 'pr-proof', area: 'pr', title: 'Writing proofs, and contest strategy',
  hook: ['n² + n + 41 is prime for n = 0, 1, 2, …, 39. Is it prime for every n?',
    'No: at n = 40 it is 1681 = 41². Forty checked cases are evidence, not a proof. The gap between checking examples and proving a statement is what olympiad mathematics is about.'],
  ideas: [
    ['What a proof is', 'A chain of statements, each following from earlier ones or from facts everyone accepts, ending in what was asked. Define your notation, say what you are assuming, and make it clear when you have finished.'],
    ['The main methods', 'Direct argument; contradiction (assume the opposite and reach something impossible, as in “√2 is irrational”); induction (prove the first case, and that each case implies the next); the extremal principle; and splitting into cases that between them cover everything.'],
    ['“Find all” means two things', 'Show that every answer on your list works, and that nothing else does. At the BMO, many marks are lost by doing only one of these.'],
    ['Multiple-choice strategy', 'On the AMC a right answer scores 6 and a blank 1.5. A blind guess is worth 6/5 = 1.2 on average, worse than a blank; with one option ruled out it is 6/4 = 1.5, break-even; with two ruled out, 6/3 = 2, so guess. Under the traditional SMC rule (+4 right, −1 wrong) a blind guess is worth 0 on average and pays once one option is ruled out.'],
    ['Answers you can check', 'AIME answers are whole numbers from 0 to 999, so a fraction or a huge number means a slip. On every paper, test an answer against a small case or an estimate before you move on.']],
  ex: [
    { q: 'Prove that 1 + 3 + 5 + … + (2n − 1) = n² for every positive integer n.',
      sol: ['For n = 1 both sides are 1.', 'Suppose it holds for n = k. Then 1 + 3 + … + (2k − 1) + (2k + 1) = k² + 2k + 1 = (k + 1)², which is the statement for n = k + 1.', 'By induction it holds for every n.'], a: 'A proof by induction.' },
    { q: 'Find all primes p for which p² + 2 is also prime.',
      sol: ['If p ≠ 3, then p² ≡ 1 (mod 3), so p² + 2 is a multiple of 3 that is bigger than 3, and not prime.', 'If p = 3, then p² + 2 = 11, which is prime.', 'So p = 3 is the only one: it works, and every other prime fails.'], a: 'p = 3' }],
  pr: [
    { t: 'mc', lv: 1, q: 'On an AMC paper you can rule out two of the five options in a question but cannot solve it. What is your expected score if you guess among the other three?', ch: ['1.2', '1.5', '2', '3', '6'], a: 2,
      hint: 'A right answer scores 6.', sol: 'You are right with probability 1/3, so the expected score is 6/3 = 2 points, better than the 1.5 for a blank.' },
    { t: 'int', lv: 2, q: 'For how many primes p is p² + 14 also prime?', a: 1,
      hint: 'Work modulo 3.', sol: 'If p ≠ 3, then p² ≡ 1 (mod 3), so p² + 14 is a multiple of 3 bigger than 3, and not prime. For p = 3, p² + 14 = 23 is prime. So exactly 1 prime works.' },
    { t: 'proof', lv: 2, q: 'Prove that 4^n + 15n − 1 is divisible by 9 for every positive integer n.',
      hint: 'Induction: compare the expression for n + 1 with 4 times the expression for n.',
      sol: 'For n = 1: 4 + 15 − 1 = 18 = 2 × 9. Suppose 9 divides a_k = 4^k + 15k − 1. Then a_{k+1} = 4^{k+1} + 15k + 14 = 4a_k − 45k + 18 = 4a_k − 9(5k − 2), which is divisible by 9. By induction the statement holds for every n.' },
    { t: 'proof', lv: 1, q: 'Prove that √3 is irrational.',
      hint: 'Suppose √3 = p/q in lowest terms.', sol: 'Suppose √3 = p/q with p and q positive integers with no common factor. Then p² = 3q², so 3 divides p², and since 3 is prime, 3 divides p. Write p = 3m: then 9m² = 3q², so q² = 3m² and 3 divides q too. So p and q share the factor 3, a contradiction. Hence √3 is irrational.' }],
  traps: ['Checking examples instead of proving.', 'In an induction step, using the statement for n + 1 while proving it.', 'In a “find all” problem, leaving out why each answer works.'] });
