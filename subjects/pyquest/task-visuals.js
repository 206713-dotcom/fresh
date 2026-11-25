// The first entry is the starting data. Each following entry describes a step
// the learner can build. Lesson output comes from the same task used for grading.
const core = {
  hello: [{Message: '"Hello, Python!"'}, 'Pass the message to print() so it appears in the console.'],
  variables: [{name: '"Alex"', Greeting: '"Hi, "'}, 'Store Alex in name.', 'Join the greeting and the value of name. Print the joined text.'],
  maths: [{Number: '7', Multiplier: '3'}, 'Multiply the two values to get 21. Print the calculated result.'],
  conditions: [{age: '16', 'Teen age starts at': '13'}, 'Compare 16 with 13. The condition is true.', 'Follow the if branch and print Teen coder. The else branch is for ages below 13.'],
  loops: [{First: '1', Last: '5'}, 'Take the numbers in order, starting at 1. Print one number on each pass through the loop.'],
  lists: [{pets: '["cat", "dog", "rabbit"]', 'Indexes': '0, 1, 2'}, 'The second item is at index 1. Read that item and print its value.'],
  functions: [{Call: 'double(9)', number: '9'}, 'Inside the function, multiply the parameter by 2.', 'Return the doubled value to the caller, then print it.'],
  dictionary: [{student: '{"name": "Mia", "score": 95}', Key: '"score"'}, 'Look up the score key in the dictionary. Print the value stored under it.'],
  strings: [{word: '"python"'}, 'Make an uppercase version of the string. Print the new string.'],
  project: [{points: '40', bonus: '15', 'Level-up threshold': '50'}, 'Add the points and bonus to get 55.', '55 reaches the threshold. Print the level-up message with that total.'],
  while: [{count: '3', 'Keep looping while': 'count > 0'}, 'Print the current count and subtract 1 after each pass. Stop when the count reaches 0.'],
  booleans: [{points: '15', lives: '2', 'Required checks': 'points ≥ 10 and lives > 0'}, 'Check the two comparisons separately. Both are true.', 'Combine them with and and print the Boolean result.'],
  tuples: [{colours: '("red", "green", "blue")'}, 'Read the item at the end of the tuple. Its value is blue.'],
  sets: [{numbers: '[1, 1, 2, 3]'}, 'Make a set from the list. Repeated 1s become a single value.', 'Count the items in the set {1, 2, 3} and print the length.'],
  slicing: [{word: '"computer"', 'Start and stop': '0 to 4'}, 'Select indexes 0, 1, 2 and 3. The stop index 4 is excluded.'],
  fstrings: [{name: '"Kai"', points: '12'}, 'Use an f-string to place the name and the point total into the sentence.'],
  'nested-loops': [{Rows: '3', 'Stars per row': '2'}, 'Use the outer loop to start a row. The inner loop adds two stars to that row.', 'Print a complete row before going to the next one.'],
  sorting: [{numbers: '[9, 2, 5]'}, 'Order the numbers from smallest to largest. Print the sorted list.'],
  comprehensions: [{numbers: '[1, 2, 3, 4]'}, 'Take each number in order and multiply it by itself. Collect those values into a new list.'],
  exceptions: [{Text: '"oops"', Conversion: 'Integer'}, 'Try converting the text to an integer. Python raises ValueError for this text.', 'Catch that error and print the supplied message.'],
  modules: [{Module: 'math', Value: '144'}, 'Use the square root function from math. The result is the floating-point value 12.0.'],
  randomness: [{Seed: '1', 'Possible draws': '1 through 10'}, 'Set the seed before drawing a random integer. The given seed makes this draw repeatable.'],
  enumerate: [{colours: '["red", "blue"]', 'First index': '0'}, 'Enumerate produces an index and a colour together for each item. Print each pair on its own line.'],
  zip: [{Names: '["Mia", "Ben"]', Scores: '[9, 8]'}, 'Zip pairs entries at matching positions. Print each name with its paired score.'],
  'sets-advanced': [{First: '{2, 4, 6}', Second: '{4, 6, 8}'}, 'Keep values that belong to both sets. Sort the shared values before printing them.'],
  recursion: [{Call: 'factorial(5)', 'Base value': '1'}, 'Each call uses a smaller value of n until the base case returns 1.', 'Multiply as the calls return. The final product is 5 × 4 × 3 × 2 × 1.'],
  classes: [{Class: 'Player', Name: '"Alex"'}, 'Create a Player and store the supplied name as an attribute.', 'Read the name attribute from the new Player and print it.'],
  inheritance: [{Parent: 'Animal', Child: 'Dog', Method: 'sound()'}, 'Give Dog its own version of sound().', 'When you call it on a Dog, the Dog version prints woof.'],
  lambda: [{Call: 'triple(7)', Argument: '7'}, 'The lambda takes one value and returns that value multiplied by 3. Print the returned value.'],
  generators: [{Generator: 'count_three()', 'Values to yield': '1, 2, 3'}, 'Yield the values one at a time. Collect them into a list and print the list.'],
  regex: [{Text: '"A12 B7"', Matches: 'Groups of digits'}, 'Scan the text in order. The digit groups are 12 and 7. Print them as strings in a list.'],
  json: [{JSON: '{"coins": 15}', Key: '"coins"'}, 'Parse the JSON text into a Python dictionary. Read the coins key and print its value.'],
  testing: [{Expression: '3 + 4', 'Required result': '7'}, 'Calculate 3 + 4 and assert that the result equals 7.', 'When the assertion passes, execution continues to the print statement.'],
  csv: [{CSV: 'name,score\nMia,9', 'Target row': 'Second row'}, 'Read the text as comma-separated rows. Pick the row after the header.', 'Print the two fields as a list. The CSV reader gives you strings.'],
  'binary-search': [{numbers: '[1, 3, 5, 7, 9]', Target: '7'}, 'Find where the target occurs in the sorted list. The first position is index 0.', '7 is the fourth item, so print index 3.'],
  'type-hints': [{Call: 'add(4, 6)', Types: 'int, int → int'}, 'The function adds its two integer parameters and returns their sum. Print the returned value.'],
  bitwise: [{First: '6 (110)', Second: '3 (011)', Operation: 'Bitwise AND'}, 'Align the bits. Only the middle column has a 1 in both numbers.', 'The result is 010 in binary. Print its decimal value.'],
  'binary-convert': [{Decimal: '13'}, 'Convert 13 to base two. The bits 1101 represent 8 + 4 + 1.', 'Print the binary text with Python’s 0b prefix.'],
  'hex-convert': [{Decimal: '255'}, 'Divide into hexadecimal place values. 255 is 15 × 16 + 15.', 'The digit f means 15. Print ff with Python’s 0x prefix.'],
  'format-round': [{Value: '3.14159', 'Decimal places': '2'}, 'Use a fixed-point format in the f-string so the displayed value has two decimal places.'],
  'sorting-key': [{Words: '["elephant", "cat", "dog"]', Lengths: '8, 3, 3'}, 'Sort using length as the key. cat and dog tie, so their original order is kept.'],
  'any-all': [{Flags: '[True, False, True]'}, 'Check whether every value is true. The middle value is false, so the whole test returns False.'],
  'lambda-func': [{Call: 'triple(7)', Argument: '7'}, 'The lambda takes one value and returns that value multiplied by 3. Print the returned value.'],
  'dict-comprehension': [{Keys: '1, 2, 3', 'Value for each key': 'Its square'}, 'For each number, use the number as the key and its square as the value. Print the completed dictionary.'],
  'regex-intro': [{Text: '"A12 B3"', Matches: 'Groups of digits'}, 'Scan the text for consecutive digits. Keep the two matched groups as strings.'],
  'classes-init': [{Class: 'Book', Title: '"Python"'}, 'Pass the title into the constructor. Save it as an attribute of the new book.', 'Read and print the title attribute.'],
  'file-like': [{Text: 'cat\ndog', 'Target line': 'First'}, 'Make a file-like object from the string and read the first line.', 'Print cat as the result.'],
  'binary-search-idea': [{numbers: '[2, 4, 6, 8, 10]', Length: '5'}, 'Use integer division by 2 to get the middle index, 2.', 'Read the item at index 2 and print it.'],
  'enumerate-plus': [{colours: '["red", "blue"]', 'First index': '0'}, 'Take one index and colour at a time. Print the pair before going to the next item.'],
  'zip-plus': [{Names: '["A", "B"]', Marks: '[90, 80]'}, 'Pair the first name with the first mark, then the second name with the second mark. Print each pair.'],
  'unpack-plus': [{Pair: '(8, 3)', Variables: 'left, right'}, 'Put the first value in left and the second in right. Print each label beside its value.'],
  'round-plus': [{pi: '3.14159', 'Decimal places': '2'}, 'Round the number to two decimal places and print the rounded number.'],
  'min-max-plus': [{numbers: '[5, 2, 9]'}, 'Find the smallest and largest values. Print them in that order with a space between them.'],
  'string-count-plus': [{Text: '"banana"', 'Count this': '"a"'}, 'Check the letters for matches. The letter a appears at indexes 1, 3 and 5.'],
  'counter-plus': [{Text: '"banana"', 'Count this': '"a"'}, 'Build a Counter from the text. Read the entry for a and print that count.'],
  'json-load-plus': [{JSON: '{"score": 7}', Key: '"score"'}, 'Convert the JSON text to a dictionary. Read and print the score field.'],
  'json-write-plus': [{Dictionary: '{"ready": True}'}, 'Serialize the Python dictionary into JSON. A Python Boolean True becomes JSON true.'],
  'date-plus': [{Date: '17 November 2026', 'Week starts with': 'Monday = 0'}, 'Find which day of the week the date lands on. Tuesday is day 1.'],
  'combinations-plus': [{numbers: '[1, 2, 3]', 'Items per pair': '2'}, 'Choose each pair once. Collect the pairs into a list before printing.'],
  'binary-convert-plus': [{Decimal: '13'}, 'Convert 13 to base two. Print the resulting digits with Python’s 0b prefix.'],
  'hex-convert-plus': [{Hexadecimal: '2A', Base: '16'}, 'A stands for 10. Convert the two places to 2 × 16 and 10, then add them.'],
  'filter-comprehension-plus': [{Range: '0 through 9', 'Keep values divisible by': '3'}, 'Keep numbers with remainder zero when divided by 3. Collect them into a list in order.'],
  'pathlib-plus': [{Path: 'projects/pyquest.py'}, 'Make a Path object. Read the suffix of its final filename and print it with the dot.'],
  'exceptions-plus': [{Error: 'ValueError', Message: '"handled"'}, 'Raise a ValueError inside the code you are trying.', 'Catch that error and print handled.']
};

const independent = {
  hello: [{Name: '"Coder"', Calculation: '6 × 7'}, 'Print the name on the first line. Calculate and print the product on the next line.'],
  variables: [{'Starting points': '10', Add: '5', Subtract: '3'}, 'Update the total to 15 after adding 5.', 'Subtract 3 from the updated total and print it.'],
  maths: [{Seconds: '250', 'Seconds in a minute': '60'}, 'Use whole-number division to find the four full minutes.', 'Use the remainder to find the ten leftover seconds. Print both numbers.'],
  conditions: [{'Example score': '72', 'Grade bands': 'A from 80 · B from 60 · C below 60'}, 'Check the highest band first. 72 is below 80, so continue to the B check.', '72 reaches 60. Print B.'],
  loops: [{First: '2', Last: '12', 'Step size': '2'}, 'Use a range that advances by two. Take one value per pass through the loop and print it.'],
  lists: [{'Example list': '["milk", "bread"]', Append: '"apples"', 'Replace first with': '"rice"'}, 'Append apples, then change the first item to rice.', 'Read and print the last item in the updated list.'],
  functions: [{'First call': 'area_rectangle(5, 3)', 'Second call': 'area_rectangle(7, 2)'}, 'Use the same function for both calls. Each call returns its width multiplied by its height.', 'Print the two returned areas on separate lines.'],
  dictionary: [{'Example scores': '{"Maths": 80, "Python": 90, "English": 75}', Update: 'English → 85'}, 'Replace the English score and add the three updated scores.', 'Divide by 3 and display the average as 85.'],
  strings: [{Text: '"  hello WORLD  "'}, 'Remove spaces from both ends.', 'Change the remaining words to title case and print the result.'],
  project: [{'Example correct': '7', Incorrect: '3'}, 'Add the answer counts to find the total of 10.', 'Divide correct answers by the total and multiply by 100. Display the percentage as 70.'],
  while: [{'Starting number': '1', Threshold: '100'}, 'Double the number as long as it is below 100.', 'The last value below the threshold is 64. Doubling it gives 128, so stop and print that value.'],
  booleans: [{'Has pass': 'True', 'Safety check complete': 'True'}, 'Both conditions have to pass. Combine them and print the result for this example.'],
  tuples: [{RGB: '(120, 60, 240)'}, 'Unpack the three positions into red, green and blue. Print their values in that order.'],
  sets: [{Word: '"banana"'}, 'Keep one of each letter. The distinct letters are b, a and n.', 'Count the distinct letters.'],
  slicing: [{'First string': '"ABCDEFG"', 'Second string': '"PYTHON"'}, 'Take indexes 2 through 4 from the first string.', 'Read the second string backwards and print both results on separate lines.'],
  fstrings: [{Product: '"Book"', Quantity: '2', Price: '3.5'}, 'Insert the product, quantity and price into the receipt text. Format 3.5 as 3.50.'],
  'nested-loops': [{Rows: '4', 'Columns per row': '3', Character: '#'}, 'Build a row of three characters inside the outer loop. Print four complete rows.'],
  sorting: [{Names: '["Zoe", "Amy", "Kai"]'}, 'Order the names alphabetically and print the list.', 'Order them in reverse and print the second list.'],
  comprehensions: [{Range: '1 through 9', 'Keep': 'Odd numbers'}, 'Keep 1, 3, 5, 7 and 9. Cube each retained value and collect the results.'],
  exceptions: [{'Example inputs': '"9", "oops"'}, 'Convert the first string and print its number.', 'When the second conversion raises ValueError, catch it and print Invalid.'],
  modules: [{Radius: '3', Formula: 'π × radius²'}, 'Square the radius and multiply it by math.pi. Display the area to two decimal places.'],
  randomness: [{'Example seed': '2', 'Sample': '10 choices from [0, 1]', Heads: '1'}, 'Use a seeded draw to make all ten choices repeatable.', 'Count the 1s. With this example, seven of the flips are heads.'],
  enumerate: [{Tasks: '["code", "test", "save"]', 'First number': '1'}, 'Start the enumeration at 1 and print one numbered task per line.'],
  zip: [{Products: '["pen", "book", "bag"]', Prices: '[2, 7, 12]'}, 'Pair the matching positions, then print one product and its price on each line.'],
  'sets-advanced': [{'Example first club': '{"A", "B", "C"}', 'Second club': '{"B", "D"}'}, 'Find members in both sets, then find members in the first set only.', 'Sort both results so they print in a stable order.'],
  recursion: [{'Example argument': '5', 'Base case': '0'}, 'Add the current number to the result of summing all smaller numbers.', 'The calls return a sum of 5 + 4 + 3 + 2 + 1 + 0. Print the final sum.'],
  classes: [{Class: 'Student', Name: '"Mia"'}, 'Store the name on the Student object. The introduction method uses that same value in its message.'],
  inheritance: [{Parent: 'Shape', Child: 'Rectangle', 'Example dimensions': '5 × 4'}, 'Give Rectangle an area() method. The method multiplies its width and height.'],
  lambda: [{Pairs: '[("Alex", 4), ("Ben", 9), ("Cara", 6)]'}, 'Use the score as the sorting key. Put the largest score first and print the reordered pairs.'],
  generators: [{'Start': '0', 'Stop before': '10', 'Step size': '2'}, 'Yield one even number at a time and collect the yielded values in order for display.'],
  regex: [{'Example text': '"IDs 123 and 999"', 'Match length': 'Three digits'}, 'Find the three-digit groups and keep them as strings in the order they appear.'],
  json: [{'Example JSON': '{"score": 12}'}, 'Parse the text into a dictionary. Read the game score by its key and print it.'],
  testing: [{'Example checks': '(4, 2) → 4\n(3, 8) → 8\n(5, 5) → 5'}, 'Assert the right result for both argument orders and for equal numbers.', 'Print the success message after all three assertions run.'],
  csv: [{'Example scores': '8, 10, 12', 'Target column': 'Final column'}, 'Read the rows and convert the final fields to numbers.', 'Average the scores and display the result as 10.'],
  'binary-search': [{'Example list': '[1, 3, 5, 7, 9]', Target: '6'}, 'Compare the target to the middle value and narrow the search to one side.', 'When the range is empty, return -1 and print that result for this sample.'],
  'type-hints': [{'Example input': '"Python"', Types: 'str → int'}, 'Take a string and return the number of characters. Display the returned integer.'],
  bitwise: [{First: '0b1010', Second: '0b0101', Operation: 'Bitwise OR'}, 'A column gets a 1 when either input has a 1 there. All four columns meet that rule.'],
  'binary-convert': [{Decimal: '29'}, 'Convert 29 to base two and print the text.', 'Convert the text from base two to decimal and print the recovered number.'],
  'hex-convert': [{Binary: '0b11110000'}, 'Group the bits into fours. 1111 is f and 0000 is 0.', 'Print the hexadecimal value and then its decimal equivalent.'],
  'format-round': [{'Example fraction': '7 / 16', 'Decimal places': '1'}, 'Convert the fraction to a percentage. 7 ÷ 16 × 100 gives 43.75.', 'Format with one decimal place and include the percent sign.'],
  'sorting-key': [{Words: '["elephant", "banana", "cat", "dog"]'}, 'Compare each word’s length. Put the shortest words first and keep the original order of ties.'],
  'any-all': [{'Example scores': '[32, 58, 90]'}, 'Check for any score below 40. 32 satisfies this condition.', 'Check whether every score is nonnegative. All three satisfy this condition.'],
  'lambda-func': [{Pairs: '[("A", 6), ("B", 3), ("C", 5)]'}, 'Read the second value in each pair as its key. Sort by that key from smallest to largest.'],
  'dict-comprehension': [{Range: '1 through 5'}, 'Produce one key–value pair for each number. The key is the number and the value is its square.'],
  'regex-intro': [{'Example sentence': '"I like coding and reading."'}, 'Find whole words that end in ing. Keep the matches in the order they appear.'],
  'classes-init': [{'Example first book': 'Python · 200 pages', 'Second book': 'Maths · 180 pages'}, 'Give each book its own title and pages attributes.', 'Print the first book’s page count and the second book’s title.'],
  'file-like': [{'Example text': 'cat\ndog\nbird'}, 'Read all lines from the file-like object. Count the three entries.'],
  'binary-search-idea': [{numbers: '[10, 20, 30, 40, 50]', Target: '40'}, 'The first middle value is 30. Because 40 is larger, search the right half.', 'The next middle value is 40. Print each middle value encountered.'],
  'enumerate-plus': [{Players: '["Mia", "Jo", "Kai"]', 'First number': '1'}, 'Number the names in order, starting at 1. Print each position and name.'],
  'zip-plus': [{Names: '["Mia", "Kai"]', Marks: '[9, 7]'}, 'Pair names and marks in the same positions. Use the names as dictionary keys.'],
  'unpack-plus': [{Before: '5 9'}, 'Read both original values, then assign them in opposite order. Print the new values.'],
  'round-plus': [{Number: '1.234', 'Decimal places': '1'}, 'Round to get a number. Format the original value to get text with one decimal place.', 'Print both representations.'],
  'min-max-plus': [{'Example words': '["cat", "elephant", "dog"]'}, 'Compare words by their character counts. Print the word with the largest count.'],
  'string-count-plus': [{'Example text': '"Py py pY PY"', 'Count this': '"py"'}, 'Convert the text to lowercase, then count occurrences of py.'],
  'counter-plus': [{'Example word': '"banana"'}, 'Count each letter in the word. Pick the two letters with the largest counts and display the pairs.'],
  'json-load-plus': [{'Example JSON': '[5, 9, 7]'}, 'Parse the JSON list, then find and print its largest value.'],
  'json-write-plus': [{Dictionary: '{"level": 2, "ready": True}', Indent: '2 spaces'}, 'Serialize with indentation so each field is on a separate line. The Boolean uses JSON spelling.'],
  'date-plus': [{'Example start': '2026-11-17', 'Days to add': '30'}, 'Add a 30-day duration to the starting date. Display the new date in year–month–day order.'],
  'combinations-plus': [{'Example team members': '["Mia", "Kai", "Jo", "Sam"]', 'Group size': '2'}, 'Make every two-person team once. Count the resulting teams.'],
  'binary-convert-plus': [{Decimal: '42'}, 'Convert 42 to binary and print the text.', 'Convert that text back from base two and print the recovered number.'],
  'hex-convert-plus': [{Hexadecimal: '3F', Base: '16'}, 'Convert 3F to decimal using 3 × 16 + 15.', 'Display the decimal value and its binary representation on separate lines.'],
  'filter-comprehension-plus': [{Range: '1 through 20', 'Keep': 'Multiples of 4'}, 'Keep 4, 8, 12, 16 and 20. Square each retained number and collect the results.'],
  'pathlib-plus': [{Path: 'projects/python/main.py'}, 'Read the suffix of the filename. Read the parent directory from the same path.', 'Print both values on separate lines.'],
  'exceptions-plus': [{'Example age': '-1', 'Valid ages': '0 or higher'}, 'Check the age inside the function. A negative age raises ValueError.', 'Catch the error from the sample call and print Invalid age.']
};

// These tasks print a new line on each pass, so their console can build up.
const printedLines = {
  loops: ['Current number', null, 'Current number'],
  while: ['Counter'],
  'nested-loops': ['Row', null, 'Row'],
  enumerate: ['Index and colour', null, 'Numbered task'],
  zip: ['Name and score', null, 'Product and price'],
  'enumerate-plus': ['Index and colour', null, 'Scoreboard entry'],
  'zip-plus': ['Name and mark'],
  'binary-search-idea': [null, null, 'Middle value']
};

const challenges = {
  'q-factorial': [{Call: 'factorial(4)'}, 'Multiply the positive integers up to n. For 4, multiply 4 × 3 × 2 × 1.', '24'],
  'q-palindrome': [{Call: 'is_palindrome("Race car")'}, 'Remove the space and put the letters into the same case. Compare racecar with its reverse.', 'True'],
  'q-prime': [{Call: 'is_prime(21)'}, 'Check whether a smaller number divides 21 evenly. 3 divides it with no remainder.', 'False'],
  'q-anagrams': [{Call: 'are_anagrams("Dormitory", "Dirty room")'}, 'Remove spaces and match the letter case. Check that both strings contain the same letters in the same quantities.', 'True'],
  'q-frequency': [{Call: 'word_count("Code test code")'}, 'Lowercase and split the text into words. Increase the count each time a word appears.', "{'code': 2, 'test': 1}"],
  'q-fibonacci': [{Call: 'fibonacci(7)'}, 'Start with 0 and 1. Each new value is the sum of the last two. Stop once the list contains seven values.', '[0, 1, 1, 2, 3, 5, 8]'],
  'q-merge': [{Call: 'merge_sorted([1, 5], [1, 3, 8])'}, 'Take the smaller front value from the two lists each time. Both copies of 1 go into the result.', '[1, 1, 3, 5, 8]'],
  'q-caesar': [{Call: 'caesar("Zoo!", 1)'}, 'Move each letter one place forward. The uppercase Z wraps to A, and the punctuation stays in place.', "'App!'"],
  'q-matrix': [{Call: 'transpose([[1, 2, 3], [4, 5, 6]])'}, 'Collect the values in each original column. Each collected column becomes a row in the result.', '[[1, 4], [2, 5], [3, 6]]'],
  'q-binary': [{Call: 'binary_search([2, 4, 6, 8, 10], 8)'}, 'The middle value is 6, so keep the right half. The next middle value is 8 at index 3.', '3'],
  'q-balance': [{Call: 'balanced("([a])")'}, 'Keep track of opening brackets. The closing square bracket matches the last opener, then the parenthesis matches the one before it.', 'True'],
  'q-unique': [{Call: 'first_unique("balloon")'}, 'Count the letters, then scan from the start. b appears once and is the first character.', '0']
};

const buildSteps = (plan, output, lineLabel) => {
  const [values, ...notes] = plan;
  const steps = [
    {phase: 'start', title: 'Starting values', values},
    ...notes.map(note => ({phase: 'work', title: 'Work it out', note}))
  ];
  if (lineLabel) {
    const lines = output.split('\n');
    lines.forEach((line, index) => {
      steps.push({
        phase: 'work', title: 'Print line ' + (index + 1),
        values: {[lineLabel]: line}, output: lines.slice(0, index + 1).join('\n'), outputLabel: 'Console so far'
      });
    });
  }
  return steps;
};

export function lessonPreview(lesson, task = lesson, exercise = 0, worked = '') {
  if (typeof task.expected !== 'string') return [];
  const plan = exercise === 2 ? independent[lesson.id] : core[lesson.id];
  let steps;
  if (exercise === 1 && worked) {
    steps = [
      {phase: 'start', title: 'Read the task', note: 'Use the second worked example from the lesson notes.'},
      {phase: 'work', title: 'Follow the worked example', code: worked, note: task.hint}
    ];
  } else if (plan) {
    steps = buildSteps(plan, task.expected, printedLines[lesson.id]?.[exercise]);
  } else {
    steps = [
      {phase: 'start', title: 'What to build', note: task.prompt},
      {phase: 'work', title: 'Starter code', code: task.starter, note: 'Look for the parts you need to complete.'}
    ];
  }
  return [...steps, {phase: 'result', title: 'Expected output', outputLabel: 'Console', output: task.expected}];
}

export function challengePreview(id) {
  const plan = challenges[id];
  if (!plan) return [];
  const [values, note, output] = plan;
  return [
    {phase: 'start', title: 'Sample input', values},
    {phase: 'work', title: 'What the function does', note},
    {phase: 'result', title: 'Sample return value', outputLabel: 'Returns', output}
  ];
}
