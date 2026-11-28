export const tables = {
  'trace-tables': [
    ['Running total', 'Record Total after each iteration.', 'Total ← 0\nFOR I ← 1 TO 4\n    Total ← Total + I\nNEXT I\nOUTPUT Total', ['I', 'Total'], [[1, 1], [2, 3], [3, 6], [4, 10]], 'Each iteration adds the current value of I to the previous total. The output is 10.'],
    ['Count values above a threshold', 'For Values[1:4] = [7, 12, 10, 15], record Count at the end of each iteration.', 'Count ← 0\nFOR I ← 1 TO 4\n    IF Values[I] > 10 THEN\n        Count ← Count + 1\n    ENDIF\nNEXT I\nOUTPUT Count', ['I', 'Count'], [[1, 0], [2, 1], [3, 1], [4, 2]], 'Only 12 and 15 satisfy > 10. The value 10 leaves Count unchanged.']
  ],
  'truth-tables': [
    ['NOT and AND', 'Complete intermediate column X and output Q.', 'X = NOT B\nQ = A AND X', ['A', 'B', 'X', 'Q'], [[0,0,1,0],[0,1,0,0],[1,0,1,1],[1,1,0,0]], 'Q is 1 only when A is 1 and B is 0.'],
    ['XOR and OR', 'Complete intermediate column X and output Q.', 'X = A XOR B\nQ = X OR C', ['A','B','C','X','Q'], [[0,0,0,0,0],[0,0,1,0,1],[0,1,0,1,1],[0,1,1,1,1],[1,0,0,1,1],[1,0,1,1,1],[1,1,0,0,0],[1,1,1,0,1]], 'X is 1 when A and B differ. Q is then 1 if X or C is 1.']
  ]
};

export const flowcharts = [
  {
    title: 'Validate an age',
    prompt: 'Input Age repeatedly until it is between 11 and 18 inclusive, then output “Accepted”. Complete the decision and its branches.',
    steps: [
      ['Start', 'terminal'], ['INPUT Age', 'io'],
      ['Decision condition', 'decision', ['Age >= 11 AND Age <= 18', 'Age > 11 AND Age < 18', 'Age >= 11 OR Age <= 18']],
      ['Yes branch', 'io', ['OUTPUT "Accepted", then end', 'Return to INPUT Age']],
      ['No branch', 'io', ['Return to INPUT Age', 'OUTPUT "Accepted", then end']],
      ['End', 'terminal']
    ],
    explanation: 'A decision diamond checks both inclusive bounds. Yes goes to the output and End. No loops back to the input parallelogram.'
  },
  {
    title: 'Total three values',
    prompt: 'Input exactly three values and output their sum. The chart starts with Count = 0 and checks Count before each input.',
    steps: [
      ['Start', 'terminal'], ['Total ← 0 and Count ← 0', 'process'],
      ['Decision condition', 'decision', ['Count < 3', 'Count <= 3', 'Count > 3']],
      ['Yes branch', 'process', ['Input a value, update Total, increment Count, and return to the decision', 'Output Total and end']],
      ['No branch', 'io', ['Output Total and end', 'Input another value and return to the decision']],
      ['End', 'terminal']
    ],
    explanation: 'The Yes path repeats at Count = 0, 1, and 2. At Count = 3, the No path outputs the sum and ends.'
  }
];

export const sql = [
  ['Filter and sort', 'Return Title and Price for books in the History category costing less than 15. Sort by Price ascending.',
    "SELECT Title, Price\nFROM Books\nWHERE Category = 'History' AND Price < 15\nORDER BY Price ASC;",
    ['Title', 'Price'], [['Ancient Roads', 9], ['Island History', 12]]],
  ['Count matching rows', 'Count how many books cost at least 12. Name the output column BookCount.',
    'SELECT COUNT(*) AS BookCount\nFROM Books\nWHERE Price >= 12;', ['BookCount'], [[3]]],
  ['Filter with two conditions', 'Return the Title of books whose category is Science or whose price is below 10. Sort the titles alphabetically.',
    "SELECT Title\nFROM Books\nWHERE Category = 'Science' OR Price < 10\nORDER BY Title ASC;", ['Title'], [['Ancient Roads'], ['Physics Lab']]]
];

export const books = [
  ['Ancient Roads', 'History', 9], ['Physics Lab', 'Science', 18],
  ['Island History', 'History', 12], ['Modern Cities', 'History', 20]
];
