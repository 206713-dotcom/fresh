const TOPICS = {
  algebra: { name: "Algebra", symbol: "ƒ", tone: "lime", skill: "Identities, inequalities and polynomials" },
  combinatorics: { name: "Combinatorics", symbol: "▦", tone: "peach", skill: "Counting, invariants and constructions" },
  geometry: { name: "Geometry", symbol: "△", tone: "lilac", skill: "Angle chasing, similarity and circles" },
  number: { name: "Number theory", symbol: "≡", tone: "sky", skill: "Divisibility, congruences and descent" }
};

const CONTESTS = [
  {
    id: "amc", name: "AMC", full: "American Mathematics Competitions", region: "US", tone: "lime", symbol: "∑",
    summary: "Multiple-choice problem solving, from AMC 8 to AMC 12.",
    description: "The MAA’s AMC 8, AMC 10 and AMC 12 are multiple-choice contests. Start at the level that fits your background and work up to the later questions as your speed improves.",
    facts: [["Papers", "AMC 8, AMC 10 and AMC 12"], ["Questions", "25 per paper"], ["Time", "40 min for AMC 8 · 75 min for AMC 10/12"]],
    approach: "Start with arithmetic, ratios and basic geometry for AMC 8. For AMC 10 and 12, add more algebra, counting and number theory. Practise finding a clean method before looking at the choices.",
    source: ["MAA competition guide", "https://maa.org/student-programs/amc/"],
    papers: ["MAA practice resources", "https://maa.org/student-programs/amc/information-for-students-and-parents/"]
  },
  {
    id: "aime", name: "AIME", full: "American Invitational Mathematics Examination", region: "US", tone: "peach", symbol: "≡",
    summary: "Integer-answer problems for qualifying AMC 10 and 12 students.",
    description: "AIME is an invitational round for students who earn a qualifying AMC 10 or AMC 12 score. Every answer is an integer from 0 to 999.",
    facts: [["Entry", "By AMC 10/12 qualification"], ["Questions", "15"], ["Answer format", "Integer from 0 to 999"]],
    approach: "Work without answer choices. Write down your intermediate results and check that your answer fits the requested format before moving on.",
    source: ["MAA invitational competitions", "https://maa.org/maa-invitational-competitions/"],
    papers: ["MAA practice resources", "https://maa.org/student-programs/amc/information-for-students-and-parents/"]
  },
  {
    id: "ukmt", name: "UKMT", full: "United Kingdom Mathematics Trust", region: "UK", tone: "lilac", symbol: "△",
    summary: "Junior, Intermediate and Senior Challenges, plus olympiad rounds.",
    description: "UKMT runs Junior, Intermediate and Senior Mathematical Challenges. Its follow-on events include Kangaroos and written olympiads, including the British Mathematical Olympiad.",
    facts: [["Challenge levels", "Junior, Intermediate and Senior"], ["Challenge format", "Multiple choice"], ["Other rounds", "Kangaroos and olympiads"]],
    approach: "Try a past paper for your level. Review any guesses alongside your misses, then try a written olympiad problem to practise explaining your reasoning.",
    source: ["UKMT competitions", "https://ukmt.org.uk/competitions"],
    papers: ["UKMT papers and solutions", "https://ukmt.org.uk/competition-papers"]
  },
  {
    id: "imo", name: "IMO", full: "International Mathematical Olympiad", region: "International", tone: "sky", symbol: "✦",
    summary: "Proof-based training across the four main olympiad topics.",
    description: "The International Mathematical Olympiad is a proof competition for secondary-school students selected by their country. It covers algebra, combinatorics, geometry and number theory.",
    facts: [["Questions", "6 proofs across two days"], ["Time", "4 hours 30 minutes per day"], ["Scoring", "7 points per problem"]],
    approach: "Develop proof techniques by topic. Write out complete arguments and compare them with solutions before attempting official papers under timed conditions.",
    source: ["Official IMO format", "https://www.imo-official.org/about/?language=en"],
    papers: ["Official IMO problem archive", "https://www.imo-official.org/problems/"]
  },
  {
    id: "kangaroo", name: "Math Kangaroo", full: "Kangourou Sans Frontières", region: "International", tone: "pink", symbol: "✳",
    summary: "Visual puzzles and clever reasoning for a wide range of ages.",
    description: "Math Kangaroo is an international competition coordinated by Kangourou Sans Frontières. National organizers run events for different age groups.",
    facts: [["Format", "Multiple choice"], ["Entry", "Through a national organizer"], ["Focus", "Logic, patterns and spatial reasoning"]],
    approach: "Draw what the question describes, look for symmetry and test a small case before committing to an answer.",
    source: ["Kangourou Sans Frontières", "https://www.aksf.org/"],
    papers: ["Math Kangaroo sample problems", "https://mathkangaroo.org/mks/practice/free-question-samples/"]
  },
  {
    id: "euclid", name: "Euclid", full: "University of Waterloo · CEMC", region: "Canada", tone: "yellow", symbol: "π",
    summary: "Senior secondary maths with short answers and full solutions.",
    description: "Waterloo’s Euclid Contest combines short-answer questions with problems that ask for a complete written solution.",
    facts: [["Questions", "10"], ["Time", "2 hours 30 minutes"], ["Format", "Short answers and full solutions"]],
    approach: "Practise putting every assumption and intermediate step on the page. Later questions reward a clear setup even when you cannot complete the solution.",
    source: ["CEMC Euclid contest guide", "https://cemc.uwaterloo.ca/contests/euclid"],
    papers: ["CEMC past contests and solutions", "https://cemc.uwaterloo.ca/resources/past-contests"]
  },
  {
    id: "australian", name: "Australian AMC", full: "Australian Mathematics Competition", region: "Australia", tone: "mint", symbol: "⌗",
    summary: "A problem-solving contest with year-level divisions.",
    description: "The Australian Maths Trust’s AMC is a separate contest from the American AMC. Its divisions span primary and secondary school, with multiple-choice and integer-answer questions.",
    facts: [["Questions", "30"], ["Format", "Multiple choice and integers"], ["Divisions", "Primary through senior secondary"]],
    approach: "Use the early problems to build accuracy, then spend time on the last integer-answer questions. Explore alternate methods after each attempt.",
    source: ["Australian Maths Trust contest guide", "https://amt.edu.au/amc"],
    papers: ["Australian Maths Trust past papers", "https://amt.edu.au/department/past-papers"]
  },
  {
    id: "usamo", name: "USAJMO & USAMO", full: "USA Junior and USA Mathematical Olympiads", region: "US", tone: "lilac", symbol: "∠",
    summary: "The proof-writing rounds in the MAA competition pathway.",
    description: "These invitational olympiads follow AMC 10/12 and AIME in the MAA pathway. Both ask students to write proofs over two days.",
    facts: [["Entry", "By MAA invitation"], ["Questions", "6 proofs"], ["Format", "Two days"]],
    approach: "Practise turning a promising observation into a complete proof. Record where you use each assumption and check that you cover all possible cases.",
    source: ["MAA olympiad information", "https://maa.org/maa-invitational-competitions/"]
  }
];

const PROBLEMS = [
  {
    id: "amc-stickers", contest: "amc", track: "AMC 8", topic: "algebra", skill: "ratios", level: "Warm-up", format: "choice",
    title: "The sticker swap",
    prompt: "Maya gives away one third of her stickers. She then gives away a quarter of what remains. If she has 18 stickers left, how many did she start with?",
    choices: ["24", "30", "32", "36", "48"], answer: 3,
    hints: ["What fraction of the original stickers does Maya keep after both rounds?"],
    solution: ["After the first round, Maya has 2/3 of her stickers. She keeps 3/4 of that amount in the second round.", "The fraction left is (2/3)(3/4) = 1/2. Since 18 is half the original total, she started with 36."]
  },
  {
    id: "amc-border", contest: "amc", track: "AMC 8", topic: "geometry", skill: "circles", level: "Warm-up", format: "choice",
    title: "Around the edges",
    prompt: "A 9 × 7 rectangle is made from unit squares. Every unit square sharing an edge with the outside of the rectangle is shaded. How many squares are shaded?",
    choices: ["24", "26", "28", "30", "32"], answer: 2,
    hints: ["Count the unshaded interior and subtract it from the whole rectangle."],
    solution: ["Removing a one-square border shortens each dimension by 2. The unshaded rectangle is therefore 7 × 5.", "There are 9 × 7 − 7 × 5 = 63 − 35 = 28 shaded squares."]
  },
  {
    id: "amc-pairs", contest: "amc", track: "AMC 10", topic: "combinatorics", skill: "probability", level: "Intermediate", format: "choice",
    title: "A multiple of three",
    prompt: "Two distinct integers are chosen uniformly at random from 1 through 10. What is the probability that their sum is a multiple of 3?",
    choices: ["1/3", "4/11", "2/5", "7/15", "1/2"], answer: 0,
    hints: ["Group the numbers by their remainders on division by 3. Which pairs of remainders add to a multiple of 3?"],
    solution: ["There are 3 numbers with remainder 0, 4 with remainder 1, and 3 with remainder 2. A successful pair has either two zero remainders or one each of 1 and 2.", "The number of successful pairs is 3 + 4 × 3 = 15. There are 10 × 9 / 2 = 45 unordered pairs in total, so the probability is 15/45 = 1/3."]
  },
  {
    id: "amc-squares", contest: "amc", track: "AMC 10", topic: "algebra", skill: "polynomials", level: "Intermediate", format: "choice",
    title: "The missing difference",
    prompt: "Positive real numbers x and y satisfy x + y = 10 and x² + y² = 58. What is |x − y|?",
    choices: ["1", "2", "3", "4", "6"], answer: 3,
    hints: ["Expand (x + y)² and (x − y)². What happens when you add them?"],
    solution: ["The identity (x − y)² + (x + y)² = 2(x² + y²) follows by expansion.", "Thus (x − y)² = 2 × 58 − 10² = 16, so |x − y| = 4."]
  },
  {
    id: "amc-remainder", contest: "amc", track: "AMC 12", topic: "number", skill: "modular", level: "Intermediate", format: "choice",
    title: "The last two digits",
    prompt: "What is the remainder when 7<sup>2026</sup> is divided by 100?",
    choices: ["43", "49", "57", "71", "93"], answer: 1,
    hints: ["Compute 7⁴ and look at its last two digits."],
    solution: ["Since 7⁴ = 2401, every power of 7⁴ is congruent to 1 modulo 100.", "Write 2026 = 4 × 506 + 2. The desired remainder is therefore the remainder of 7² = 49."]
  },
  {
    id: "aime-multiples", contest: "aime", track: "AIME", topic: "number", skill: "divisibility", level: "Intermediate", format: "integer",
    title: "Digits and divisibility",
    prompt: "How many three-digit positive integers are divisible by 7 and have a digit sum divisible by 3?",
    answer: 43,
    hints: ["An integer and its digit sum have the same remainder modulo 3.", "The numbers you want are the three-digit multiples of a single integer."],
    solution: ["The digit-sum condition is equivalent to divisibility by 3. Because 3 and 7 are coprime, the integers we want are exactly the multiples of 21.", "There are ⌊999/21⌋ = 47 positive multiples of 21 up to 999. Of these, ⌊99/21⌋ = 4 have fewer than three digits. The answer is 47 − 4 = 43, written 043 in AIME format."]
  },
  {
    id: "aime-paths", contest: "aime", track: "AIME", topic: "combinatorics", skill: "counting", level: "Intermediate", format: "integer",
    title: "A grid with a detour",
    prompt: "A path goes from (0, 0) to (6, 4) using unit steps right or up. How many such paths avoid the point (2, 2)?",
    answer: 120,
    hints: ["Count all paths first, then subtract paths that pass through (2, 2).", "A path through (2, 2) splits into two independently chosen paths."],
    solution: ["Every path has 10 steps, 4 of which are up, so there are C(10, 4) = 210 paths in total.", "There are C(4, 2) = 6 ways to reach (2, 2) and C(6, 2) = 15 ways to continue on to (6, 4). Therefore 6 × 15 = 90 paths pass through that point.", "The number that avoid it is 210 − 90 = 120."]
  },
  {
    id: "aime-inradius", contest: "aime", track: "AIME", topic: "geometry", skill: "circles", level: "Challenge", format: "integer",
    title: "The inscribed circle",
    prompt: "A right triangle has hypotenuse 65 and inradius 12. What is the area of the triangle?",
    answer: 924,
    hints: ["The area of any triangle is its inradius times its semiperimeter.", "Use equal tangent lengths from each vertex and the right angle to show that the sum of the legs is 65 + 2 × 12."],
    solution: ["The two tangency points on the legs sit 12 units from the right-angle vertex. From each of the other vertices, the two tangent segments to the incircle have equal length. So the sum of the legs is 2 × 12 + 65 = 89.", "The semiperimeter is (89 + 65)/2 = 77. Splitting the triangle into three triangles with bases along the sides and height 12 shows that its area is 12 × 77 = 924."]
  },
  {
    id: "aime-cubes", contest: "aime", track: "AIME", topic: "algebra", skill: "polynomials", level: "Challenge", format: "integer",
    title: "A symmetric identity",
    prompt: "Real numbers x, y and z satisfy x + y + z = 13, xy + yz + zx = 46 and x³ + y³ + z³ = 547. Find xyz.",
    answer: 48,
    hints: ["Expand (x + y + z)(xy + yz + zx) and compare the mixed terms with those in (x + y + z)³."],
    solution: ["Expansion gives x³ + y³ + z³ = (x + y + z)³ − 3(x + y + z)(xy + yz + zx) + 3xyz.", "Substituting the given values gives 547 = 2197 − 1794 + 3xyz = 403 + 3xyz. Therefore xyz = 48."]
  },
  {
    id: "ukmt-clock", contest: "ukmt", track: "UKMT Junior", topic: "geometry", skill: "similarity", level: "Warm-up", format: "choice",
    title: "Forty past three",
    prompt: "An analogue clock shows 3:40. What is the smaller angle between its hour and minute hands?",
    choices: ["110°", "120°", "130°", "140°", "150°"], answer: 2,
    hints: ["The hour hand moves between 3 and 4 as the minutes pass."],
    solution: ["The minute hand is 40 × 6° = 240° clockwise from 12. The hour hand has moved through 3 hours and 40 minutes. Its position is 3 × 30° + (40/60) × 30° = 110°.", "Their angular difference is 240° − 110° = 130°, which is the smaller angle."]
  },
  {
    id: "ukmt-jug", contest: "ukmt", track: "UKMT Intermediate", topic: "algebra", skill: "ratios", level: "Warm-up", format: "choice",
    title: "Diluting the mixture",
    prompt: "A jug holds 2 litres of a drink that is 30% concentrate by volume. After adding 500 mL of water, what percentage of the drink is concentrate?",
    choices: ["24%", "25%", "26%", "28%", "30%"], answer: 0,
    hints: ["The volume of concentrate stays fixed when you add water."],
    solution: ["The amount of concentrate is 0.30 × 2 = 0.6 litres. The total volume after adding the water is 2.5 litres.", "The fraction that is concentrate is 0.6/2.5 = 0.24, or 24%."]
  },
  {
    id: "ukmt-residues", contest: "ukmt", track: "UKMT Senior", topic: "number", skill: "modular", level: "Intermediate", format: "choice",
    title: "Counting the residues",
    prompt: "How many positive integers n less than 100 make n(n + 1) divisible by 12?",
    choices: ["24", "25", "32", "33", "34"], answer: 3,
    hints: ["Find the residues modulo 12 for which the product is divisible by both 3 and 4."],
    solution: ["One of n and n + 1 must be a multiple of 4, since one of them is odd. This gives n ≡ 0 or 3 modulo 4. Divisibility by 3 likewise requires n ≡ 0 or 2 modulo 3.", "The residues modulo 12 that satisfy both conditions are 0, 3, 8 and 11. From 0 through 95 there are 8 full blocks of 12. That gives 32 values, including 0. Then 96 and 99 contribute two more, so the count is 32 − 1 + 2 = 33."]
  },
  {
    id: "ukmt-reciprocals", contest: "ukmt", track: "British Mathematical Olympiad", topic: "number", skill: "divisibility", level: "Intermediate", format: "proof",
    title: "A reciprocal equation",
    prompt: "Find all positive integer pairs (a, b) with a ≤ b and 1/a + 1/b = 1/6. Prove your list is complete.",
    hints: ["Both a and b must exceed 6. Clear the denominators and look for a factorization.", "Rewrite the equation as (a − 6)(b − 6) = 36."],
    solution: ["Because both reciprocals are positive, each is less than 1/6. Hence a, b > 6.", "Multiplying by 6ab gives 6a + 6b = ab, or (a − 6)(b − 6) = 36. Since a ≤ b, the positive factor a − 6 is at most 6. The possible divisors are 1, 2, 3, 4 and 6.", "The corresponding pairs are (7, 42), (8, 24), (9, 18), (10, 15) and (12, 12). Each satisfies the factored equation, which is equivalent to the original equation for these positive values."]
  },
  {
    id: "imo-inequality", contest: "imo", track: "IMO Prep", topic: "algebra", skill: "inequalities", level: "Warm-up", format: "proof",
    title: "Three factors",
    prompt: "Let a, b and c be positive real numbers with abc = 1. Prove that (1 + a)(1 + b)(1 + c) ≥ 8 and determine when equality holds.",
    hints: ["Use the arithmetic–geometric mean inequality on 1 and each variable.", "Multiplication turns the three square roots into √(abc)."],
    solution: ["For every positive t, (√t − 1)² ≥ 0 gives 1 + t ≥ 2√t, with equality exactly when t = 1.", "Multiplying the inequalities for t = a, b and c gives (1 + a)(1 + b)(1 + c) ≥ 8√(abc) = 8.", "All factors are positive, so equality requires equality in every factor. This occurs exactly when a = b = c = 1."]
  },
  {
    id: "imo-polynomial", contest: "imo", track: "IMO Prep", topic: "algebra", skill: "polynomials", level: "Challenge", format: "proof",
    title: "A polynomial identity",
    prompt: "Let P be a real polynomial with P(1) = 1 and P(x²) = P(x)² for every real x. Prove that P(x) = x<sup>k</sup> for some nonnegative integer k.",
    hints: ["Factor out the lowest power of x in P. The remaining polynomial has a nonzero constant term.", "After cancelling that power, compare the lowest nonconstant coefficient on the two sides."],
    solution: ["Since P(1) = 1, P is nonzero. Write P(x) = xᵏQ(x), where Q(0) ≠ 0. The identity gives Q(x²) = Q(x)² for all nonzero x and therefore for all x, since the expressions are polynomials.", "At x = 0, Q(0) = Q(0)². Thus Q(0) = 1.", "If Q is nonconstant, let m > 0 be its smallest exponent with nonzero coefficient d. Then Q(x)² has coefficient 2d at xᵐ, while Q(x²) has no term of degree m because its first positive exponent is 2m. This is a contradiction. Therefore Q is the constant 1 and P(x) = xᵏ."]
  },
  {
    id: "imo-board", contest: "imo", track: "IMO Prep", topic: "combinatorics", skill: "invariants", level: "Warm-up", format: "proof",
    title: "A board that keeps its parity",
    prompt: "Every square of a 5 × 5 board is white. A move reverses the colours of all squares in a single row or column. Prove that no sequence of moves can leave exactly one black square.",
    hints: ["Look at the number of black squares inside a fixed 2 × 2 block.", "Any move changes either zero or two squares in the block."],
    solution: ["Fix any 2 × 2 block of adjacent squares. A row or column reversal flips either zero or two of its squares. Flipping two changes the number of black squares by −2, 0 or 2, so the parity stays even.", "Each 2 × 2 block starts with zero black squares. If the final board had just one black square, a 2 × 2 block containing it would have an odd number of black squares, a contradiction."]
  },
  {
    id: "imo-tournament", contest: "imo", track: "IMO Prep", topic: "combinatorics", skill: "proof", level: "Challenge", format: "proof",
    title: "Ordering the tournament",
    prompt: "In a tournament, each pair of players plays exactly once, with no draws. Prove that the players can be listed so that each player except the last beat the player immediately after them.",
    hints: ["Use induction. Set one player aside and order the others first.", "Insert the new player just before the first player they beat. What happens if they beat nobody?"],
    solution: ["The claim holds for one player. Suppose it holds for n players, and consider a tournament with n + 1 players. Set aside one player X and order the other n by induction.", "If X beat no one in the list, append X. Otherwise, insert X directly before the first player X beat. If this insertion has a predecessor, X did not beat that predecessor, so the predecessor beat X.", "All adjoining pairs meet the condition, since all other adjacencies are unchanged. The result follows by induction."]
  },
  {
    id: "imo-altitudes", contest: "imo", track: "IMO Prep", topic: "geometry", skill: "similarity", level: "Intermediate", format: "proof",
    title: "A smaller similar triangle",
    prompt: "In an acute triangle ABC, let D and E be the feet of the altitudes from B and C respectively. Prove that triangles ADE and ABC are similar and that DE = BC · cos ∠BAC.",
    hints: ["Express AD using the right triangle ABD and AE using the right triangle ACE.", "Compare AD/AB with AE/AC, and check the angle between those sides."],
    solution: ["D lies on AC and E lies on AB. In the two right triangles, AD = AB · cos ∠BAC and AE = AC · cos ∠BAC.", "Since AD/AB = AE/AC and the included angle at A is the same, triangles ADE and ABC are similar by side–angle–side, with D corresponding to B and E to C.", "The scale factor is cos ∠BAC, so DE = BC · cos ∠BAC."]
  },
  {
    id: "imo-reflection", contest: "imo", track: "IMO Prep", topic: "geometry", skill: "circles", level: "Challenge", format: "proof",
    title: "Reflecting the orthocentre",
    prompt: "Let H be the orthocentre of an acute triangle ABC. Reflect H across the line BC to obtain H′. Prove that H′ lies on the circumcircle of ABC.",
    hints: ["Use the perpendicular altitudes to show that ∠BHC = 180° − ∠BAC.", "Reflection preserves the angle at H. Where are H′ and A relative to BC?"],
    solution: ["Let D and E be the feet of the altitudes from B and C. The angles at D and E in quadrilateral ADHE are right angles, so ∠DHE = 180° − ∠BAC.", "Since the triangle is acute, H lies between B and D and between C and E. Therefore ∠BHC = ∠DHE. Reflecting across BC gives ∠BH′C = 180° − ∠BAC.", "A and H′ lie on opposite sides of BC, so the opposite angles ∠BAC and ∠BH′C being supplementary makes quadrilateral ABH′C cyclic. Thus H′ lies on the circumcircle of ABC."]
  },
  {
    id: "imo-divisibility", contest: "imo", track: "IMO Prep", topic: "number", skill: "modular", level: "Warm-up", format: "proof",
    title: "Divisible by thirty",
    prompt: "Prove that n⁵ − n is divisible by 30 for every integer n.",
    hints: ["Factor n⁵ − n and look for three consecutive integers.", "For divisibility by 5, consider the residues 0, ±1 and ±2."],
    solution: ["Factor n⁵ − n = n(n − 1)(n + 1)(n² + 1). Among the three consecutive integers n − 1, n and n + 1, at least one is even and one is divisible by 3. Thus the product is divisible by 6.", "Modulo 5, if n is 0, 1 or −1, one of the three consecutive factors is divisible by 5. If n is 2 or −2, then n² + 1 is divisible by 5.", "Since 5 and 6 are coprime, the product is divisible by 30."]
  },
  {
    id: "imo-descent", contest: "imo", track: "IMO Prep", topic: "number", skill: "modular", level: "Intermediate", format: "proof",
    title: "An equation with no solutions",
    prompt: "Prove that x² + y² = 3xy has no solution in positive integers x and y.",
    hints: ["A square is congruent to either 0 or 1 modulo 3.", "Assume a solution exists and choose one that minimizes x + y."],
    solution: ["Suppose a positive integer solution exists and choose one with the smallest x + y. Modulo 3, each square is 0 or 1 and their sum is 0. Hence both squares are 0 modulo 3, so both x and y are divisible by 3.", "Write x = 3u and y = 3v. Dividing the original equation by 9 gives u² + v² = 3uv. The positive pair (u, v) is another solution with a smaller sum. This contradicts minimality."]
  },
  {
    id: "imo-order", contest: "imo", track: "IMO Prep", topic: "number", skill: "modular", level: "Challenge", format: "proof",
    title: "A prime in the right residue class",
    prompt: "Let p > 3 be a prime divisor of n² + n + 1 for an integer n. Prove that p ≡ 1 (mod 3).",
    hints: ["Use (n − 1)(n² + n + 1) = n³ − 1. Show n is congruent to neither 0 nor 1 modulo p.", "If p ≡ 2 modulo 3, combine Fermat’s little theorem with n³ ≡ 1."],
    solution: ["The factorization gives n³ ≡ 1 modulo p. Also n ≢ 0 modulo p, since then n² + n + 1 ≡ 1. And n ≢ 1 modulo p, since then p would divide 3.", "Because p > 3, it is congruent to 1 or 2 modulo 3. If p = 3k + 2, then n<sup>p−1</sup> = (n³)ᵏn ≡ n modulo p. Fermat’s little theorem also gives n<sup>p−1</sup> ≡ 1 modulo p. This would imply n ≡ 1, which is impossible.", "Therefore p ≡ 1 modulo 3."]
  },
  {
    id: "kangaroo-fold", contest: "kangaroo", track: "Math Kangaroo", topic: "geometry", skill: "coordinates", level: "Warm-up", format: "choice",
    title: "Fold, punch, unfold",
    prompt: "A square sheet of paper is folded in half along a vertical midline, then in half along a horizontal midline. A single hole is punched through all layers, strictly inside the folded square. How many holes are visible when the sheet is fully unfolded?",
    choices: ["1", "2", "3", "4", "5"], answer: 3,
    hints: ["Think about how the number of visible holes changes when you undo each fold."],
    solution: ["The first unfold reflects the hole across the horizontal fold, giving two holes. The second unfold reflects both across the vertical fold. Since the punch was strictly inside the folded square, none of the holes coincide. There are 4 holes."]
  },
  {
    id: "kangaroo-cards", contest: "kangaroo", track: "Math Kangaroo", topic: "combinatorics", skill: "counting", level: "Warm-up", format: "choice",
    title: "Cards that add to twelve",
    prompt: "Six cards are labelled 1 through 6. How many different sets of three cards have labels that add up to 12?",
    choices: ["2", "3", "4", "5", "6"], answer: 1,
    hints: ["Sort each triple from smallest to largest and work through the possible smallest cards."],
    solution: ["If the smallest is 1, the remaining pair must sum to 11, giving {1, 5, 6}. If it is 2, the remaining pair sums to 10, giving {2, 4, 6}. If it is 3, the remaining pair sums to 9, giving {3, 4, 5}.", "A smallest card of 4 or more would give a sum of at least 4 + 5 + 6 = 15. So exactly three sets work."]
  },
  {
    id: "euclid-roots", contest: "euclid", track: "Euclid", topic: "algebra", skill: "polynomials", level: "Intermediate", format: "integer",
    title: "Roots three apart",
    prompt: "The two real roots of x² − 9x + c = 0 differ by 3. Find c.",
    answer: 18,
    hints: ["By Viète’s relations the roots sum to 9 and multiply to c."],
    solution: ["If the smaller root is r, the larger is r + 3. Their sum is 9, so 2r + 3 = 9 and r = 3. The roots are 3 and 6.", "Their product is the constant term, so c = 3 × 6 = 18."]
  },
  {
    id: "euclid-circles", contest: "euclid", track: "Euclid", topic: "geometry", skill: "coordinates", level: "Intermediate", format: "integer",
    title: "A quadrilateral from two circles",
    prompt: "Two circles with radius 5 have centres A = (0, 0) and B = (8, 0). The circles intersect at P and Q. Find the area of quadrilateral APBQ.",
    answer: 24,
    hints: ["The intersection points are equally far from A and B, so they lie on the line x = 4."],
    solution: ["Every common point is equidistant from A and B and therefore lies on their perpendicular bisector x = 4. The equation 4² + y² = 5² gives y = ±3.", "The diagonals AB and PQ are perpendicular and have lengths 8 and 6. The area is (1/2) × 8 × 6 = 24."]
  },
  {
    id: "euclid-odds", contest: "euclid", track: "Euclid", topic: "algebra", skill: "sequences", level: "Warm-up", format: "proof",
    title: "Adding the odd numbers",
    prompt: "Prove that 1 + 3 + 5 + ⋯ + (2n − 1) = n² for every positive integer n.",
    hints: ["Pair each term with the corresponding term from the end of the sum.", "You can also compare n² with (n − 1)²."],
    solution: ["Let S be the sum of the first n positive odd integers. Write the sum once in ascending order and again in descending order and add the two expressions term by term.", "The kth pair sums to (2k − 1) + (2(n + 1 − k) − 1) = 2n. There are n pairs, so 2S = 2n². Therefore S = n²."]
  },
  {
    id: "aus-seats", contest: "australian", track: "Australian AMC", topic: "algebra", skill: "ratios", level: "Warm-up", format: "choice",
    title: "Seats at the cinema",
    prompt: "A cinema has 120 seats. For every 5 occupied seats there are 3 empty seats. How many seats are empty?",
    choices: ["24", "30", "40", "45", "75"], answer: 3,
    hints: ["Think of the seats as 8 equal parts, with 3 parts empty."],
    solution: ["The ratio has 5 + 3 = 8 parts. Each part represents 120/8 = 15 seats, so 3 × 15 = 45 seats are empty."]
  },
  {
    id: "aus-cube", contest: "australian", track: "Australian AMC", topic: "geometry", skill: "counting", level: "Intermediate", format: "choice",
    title: "The painted cube",
    prompt: "A cube is painted on all six faces and cut into 4 × 4 × 4 equal small cubes. How many small cubes have exactly two painted faces?",
    choices: ["12", "16", "24", "36", "48"], answer: 2,
    hints: ["Which small cubes lie on an edge but away from both corners?"],
    solution: ["A cube with exactly two painted faces lies on an edge of the large cube, away from its corners. There are 4 − 2 = 2 such cubes per edge.", "The large cube has 12 edges, giving 12 × 2 = 24 small cubes."]
  },
  {
    id: "aus-remainders", contest: "australian", track: "Australian AMC", topic: "number", skill: "modular", level: "Warm-up", format: "integer",
    title: "Matching two remainders",
    prompt: "An integer leaves remainder 2 when divided by 5 and remainder 3 when divided by 7. What is the least positive integer with this property?",
    answer: 17,
    hints: ["List the positive integers with remainder 3 modulo 7 and check them modulo 5 in order."],
    solution: ["Numbers with remainder 3 modulo 7 start 3, 10, 17, 24, … . Their first three remainders modulo 5 are 3, 0 and 2.", "Thus 17 is the first positive integer satisfying both conditions."]
  },
  {
    id: "usamo-oddparts", contest: "usamo", track: "USAJMO / USAMO Prep", topic: "combinatorics", skill: "counting", level: "Intermediate", format: "proof",
    title: "One divides another",
    prompt: "Eleven distinct integers are chosen from 1 through 20. Prove that one of the chosen integers divides another.",
    hints: ["Divide each chosen number by 2 repeatedly until it is odd.", "There are only ten possible odd parts. What does sharing an odd part say about two numbers?"],
    solution: ["Write each chosen integer uniquely as 2ᵏm, where m is odd. The odd part m belongs to {1, 3, …, 19}, a set of ten values.", "By the pigeonhole principle, two of the eleven integers have the same odd part. Write them as 2ᵃm and 2ᵇm, with a < b since the integers are distinct. The second is 2<sup>b−a</sup> times the first, so the first divides the second."]
  },
  {
    id: "usamo-reciprocals", contest: "usamo", track: "USAJMO / USAMO Prep", topic: "algebra", skill: "inequalities", level: "Intermediate", format: "proof",
    title: "Products of reciprocal sums",
    prompt: "Let a, b and c be positive real numbers. Prove that (a + b + c)(1/a + 1/b + 1/c) ≥ 9, and determine the equality case.",
    hints: ["Expand the product and group each ratio with its reciprocal.", "For positive t, t + 1/t ≥ 2 with equality only at t = 1."],
    solution: ["The product expands to 3 + (a/b + b/a) + (a/c + c/a) + (b/c + c/b). For positive u and v, u/v + v/u − 2 = (u − v)²/(uv) ≥ 0.", "Thus the product is at least 3 + 2 + 2 + 2 = 9. Equality holds exactly when a = b = c, since every squared difference must vanish."]
  },
  {
    id: "usamo-equilateral", contest: "usamo", track: "USAJMO / USAMO Prep", topic: "geometry", skill: "circles", level: "Intermediate", format: "proof",
    title: "Three distances",
    prompt: "A point P lies inside an equilateral triangle ABC of altitude h. Prove that the sum of the perpendicular distances from P to the three sides is h.",
    hints: ["Join P to the three vertices and compare the areas of the resulting triangles."],
    solution: ["Let s be the side length, and let d₁, d₂ and d₃ be the distances from P to the three sides. The three triangles PAB, PBC and PCA partition ABC. Using their sides of length s as bases, their areas sum to (s/2)(d₁ + d₂ + d₃).", "The area of ABC is also (s/2)h. Cancelling the positive factor s/2 gives d₁ + d₂ + d₃ = h."]
  },
  ...EXTRA_PROBLEMS
];
