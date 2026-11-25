// Extended explanations and independent practice for all built-in Python lessons.
export const LESSON_DEPTH = {
  "hello": {
    "deep": "print() sends output to the console; it does not ask for input or save a value. Strings use quotation marks, while numbers can be printed directly. You can pass several values separated by commas, and Python inserts spaces between them.",
    "worked": "print(\"Hello\", \"coder\")\nprint(2 + 3)",
    "mistake": "Confusing print(\"3 + 4\") with print(3 + 4): the first displays text while the second calculates 7.",
    "stretch": "Change the output to show your name and the result of 6 * 7 on separate lines.",
    "check": "What changes if you remove the quotation marks around 2 + 3?",
    "answer": "Python evaluates it as an expression instead of printing the literal text."
  },
  "variables": {
    "deep": "Assignment stores a reference under a name. Python executes statements from top to bottom, so reassignment replaces the value you will use next. Meaningful names improve readability, and strings and numbers are different types.",
    "worked": "score = 8\nscore = score + 2\nprint(\"Score:\", score)",
    "mistake": "Writing score + 2 without reassigning it; that expression does not update score.",
    "stretch": "Track a points total starting at 10. Add 5, subtract 3 and print the result.",
    "check": "Why is score = score + 1 valid in Python?",
    "answer": "The right-hand side is calculated first, then stored under score."
  },
  "maths": {
    "deep": "Python follows order of operations: powers first, then multiplication and division, then addition and subtraction. / creates division results; // performs floor division; % gives the remainder. Parentheses make intentions clear.",
    "worked": "minutes = 137\nhours = minutes // 60\nleft = minutes % 60\nprint(hours, left)",
    "mistake": "Treating ^ as exponentiation. In Python use **; ^ has a different bitwise meaning.",
    "stretch": "Turn 250 seconds into full minutes and remaining seconds with // and %.",
    "check": "What are 17 // 5 and 17 % 5?",
    "answer": "3 and 2 respectively."
  },
  "conditions": {
    "deep": "An if/elif/else chain tests conditions in order and runs the first matching branch. Comparisons use ==, !=, <, <=, > and >=. Indentation tells Python which lines belong to a branch.",
    "worked": "temperature = 28\nif temperature >= 30:\n    print(\"hot\")\nelif temperature >= 20:\n    print(\"warm\")\nelse:\n    print(\"cool\")",
    "mistake": "Using = instead of == inside a comparison, or forgetting the colon or indentation.",
    "stretch": "Write a grade checker with A for 80+, B for 60+, otherwise C.",
    "check": "What happens if two elif conditions could both be true?",
    "answer": "Only the first true branch in the chain runs."
  },
  "loops": {
    "deep": "A for loop takes each value from an iterable in turn. range(start, stop, step) includes start but excludes stop; an optional step can count backwards. The body runs once for each value.",
    "worked": "for n in range(5, 0, -2):\n    print(n)",
    "mistake": "Expecting range(1, 5) to include 5 or forgetting to indent the body.",
    "stretch": "Print every even number from 2 to 12 using range, without writing six separate print calls.",
    "check": "How many times does range(2, 11, 2) iterate?",
    "answer": "Five times: 2, 4, 6, 8 and 10."
  },
  "lists": {
    "deep": "Lists are mutable ordered collections. Access an element with a zero-based index, use append() to add a value, and len() to count elements. A negative index counts backward from the end.",
    "worked": "scores = [4, 7]\nscores.append(9)\nscores[0] = 5\nprint(scores[-1], len(scores))",
    "mistake": "Using scores[3] when a three-item list only has indexes 0, 1 and 2.",
    "stretch": "Build a shopping list, append an item, replace the first item and print the last.",
    "check": "What does names[-1] select?",
    "answer": "The final element in the list."
  },
  "functions": {
    "deep": "A function groups reusable logic, accepts inputs through parameters and optionally returns a value. print() displays information; return provides a result that callers can store and reuse. Code after return in that branch does not run.",
    "worked": "def add_tax(price, rate):\n    return price * (1 + rate)\ntotal = add_tax(100, 0.06)\nprint(total)",
    "mistake": "Using print() inside a function when another part of the program needs the returned result.",
    "stretch": "Define area_rectangle(w, h) returning w*h; call it twice with different sizes.",
    "check": "How are a parameter and an argument different?",
    "answer": "A parameter is the variable in the definition; an argument is the supplied value at a call."
  },
  "dictionary": {
    "deep": "Dictionaries map unique keys to values. You can retrieve data with square brackets, use get() to avoid an error for missing keys, and update a value through assignment. Dictionaries are useful for structured records and counts.",
    "worked": "points = {\"Mia\": 3}\npoints[\"Mia\"] += 2\nprint(points.get(\"Alex\", 0))\nprint(points[\"Mia\"])",
    "mistake": "Trying to use a numeric position instead of the key or reading a missing key with brackets.",
    "stretch": "Create a dictionary of subject scores; update one subject and print an average.",
    "check": "Why is scores.get(\"Art\", 0) safer than scores[\"Art\"]?",
    "answer": "get() returns a fallback when a key is missing; brackets raise KeyError."
  },
  "strings": {
    "deep": "Strings are immutable sequences of characters. Indexing and slicing select characters, while methods such as strip(), lower(), upper() and replace() create new strings. len() counts characters, including spaces.",
    "worked": "message = \"  PyQuest  \"\nclean = message.strip().lower()\nprint(clean.replace(\"quest\", \"thon\"))",
    "mistake": "Thinking text.upper() changes text automatically; save or use the returned string.",
    "stretch": "Take \"  hello WORLD  \", trim the spaces and print it in title case.",
    "check": "What is the length of \"a b\"?",
    "answer": "Three characters, because the space counts."
  },
  "project": {
    "deep": "A mini program needs a clear input, a calculation or decision, and an output. Split a problem into smaller steps, choose good variable names, then test normal and edge cases. Debug one stage at a time.",
    "worked": "wins = 4\ndraws = 2\npoints = wins * 3 + draws\nprint(\"League points:\", points)",
    "mistake": "Trying to combine input, conditions and output in one complicated statement before testing each piece.",
    "stretch": "Create a tiny quiz score calculator with correct and incorrect answers, then report a percentage.",
    "check": "What would you test after the normal case?",
    "answer": "Boundary cases such as zero answers or the maximum score."
  },
  "while": {
    "deep": "A while loop repeats while its condition remains true. It is useful when you do not know the number of iterations in advance. Track changing state and decide what ends the loop.",
    "worked": "n = 1\nwhile n < 10:\n    print(n)\n    n *= 2",
    "mistake": "Forgetting to change the variable used in the condition, causing an endless loop.",
    "stretch": "Double a number starting at 1 until it reaches at least 100 and print the result.",
    "check": "When is a while loop better than a for-range loop?",
    "answer": "When repetition depends on a condition rather than a known count."
  },
  "booleans": {
    "deep": "Boolean expressions evaluate to True or False. and requires both parts; or needs at least one; not reverses a result. Use parentheses to make more complex conditions easy to read.",
    "worked": "age = 15\nhas_ticket = True\nallowed = (age >= 13) and has_ticket\nprint(allowed)",
    "mistake": "Writing and when you really mean or, or comparing strings and numbers without conversion.",
    "stretch": "Create a condition that allows access only when a student has a pass and has completed the safety check.",
    "check": "What is not (True and False)?",
    "answer": "True, because True and False is False."
  },
  "tuples": {
    "deep": "Tuples are ordered and usually used for groups of related, fixed values. They support indexes, iteration and unpacking but not element reassignment. A single-item tuple needs a trailing comma.",
    "worked": "position = (3, 8)\nx, y = position\nprint(x + y)",
    "mistake": "Writing (5) and expecting a tuple; the one-item tuple is (5,).",
    "stretch": "Store three RGB values in a tuple and unpack them into red, green and blue.",
    "check": "Can you assign position[0] = 9?",
    "answer": "No. Tuples are immutable."
  },
  "sets": {
    "deep": "Sets store unique hashable items and make membership tests convenient. Their order should not be relied on. Convert a list to a set to remove duplicates; use sorted() when a predictable display order matters.",
    "worked": "names = [\"A\", \"B\", \"A\"]\nunique = set(names)\nprint(sorted(unique))",
    "mistake": "Assuming elements always print in the order they were added.",
    "stretch": "Find how many different letters appear in the word \"banana\".",
    "check": "Why can a set be useful for attendance?",
    "answer": "It naturally prevents counting the same student twice."
  },
  "slicing": {
    "deep": "For sequence[start:stop:step], start is included and stop is excluded. Missing values use the sequence boundaries. Negative indexes count from the end, and a negative step reverses direction.",
    "worked": "letters = \"abcdef\"\nprint(letters[1:5:2])\nprint(letters[::-1])",
    "mistake": "Thinking the stop position is included or confusing a slice with a single index.",
    "stretch": "Use slicing to extract the middle three characters of \"ABCDEFG\" and reverse \"PYTHON\".",
    "check": "What does items[:3] include?",
    "answer": "The first three elements: indexes 0, 1 and 2."
  },
  "fstrings": {
    "deep": "An f-string evaluates expressions inside braces and inserts their results into text. You can format numbers, for example :.2f for two decimal places. Keep quotes balanced and choose readable expressions.",
    "worked": "name = \"Mia\"\nmark = 17 / 20\nprint(f\"{name}: {mark:.0%}\")",
    "mistake": "Forgetting the f prefix and printing braces literally.",
    "stretch": "Print a receipt with a product, quantity and price formatted to two decimal places.",
    "check": "What does {3.14159:.2f} produce?",
    "answer": "The text 3.14."
  },
  "nested-loops": {
    "deep": "For each outer-loop iteration, the inner loop runs all of its steps. The total number of iterations often multiplies (rows × columns). A nested loop is useful for grids and comparing pairs.",
    "worked": "for row in range(2):\n    for col in range(3):\n        print(row, col)",
    "mistake": "Putting a line intended for the inner loop at the wrong indentation level.",
    "stretch": "Print a 4 × 3 rectangle of # characters without writing 12 separate prints.",
    "check": "How many inner iterations occur for 4 rows and 3 columns?",
    "answer": "12."
  },
  "sorting": {
    "deep": "sorted(sequence) returns a new ordered list; list.sort() changes the original list in place. Both can take reverse=True or a key function. Know whether you need the old ordering afterwards.",
    "worked": "values = [9, 1, 4]\nnew = sorted(values, reverse=True)\nprint(values)\nprint(new)",
    "mistake": "Writing values = values.sort(); sort() returns None.",
    "stretch": "Sort some names alphabetically, then sort the same names in reverse.",
    "check": "Does sorted(values) modify values?",
    "answer": "No, it creates and returns a new list."
  },
  "comprehensions": {
    "deep": "[expression for item in iterable if condition] builds a new list. It combines a loop, optional filter and transformation. Write the expanded loop first if the comprehension becomes hard to read.",
    "worked": "numbers = [1, 2, 3, 4]\nsquares_even = [x*x for x in numbers if x%2==0]\nprint(squares_even)",
    "mistake": "Confusing the filter condition with the transformation expression.",
    "stretch": "Build a list of cubes of the odd numbers from 1 to 9.",
    "check": "Where does the if filter go in a basic list comprehension?",
    "answer": "After the for clause."
  },
  "exceptions": {
    "deep": "Try blocks run code that may fail; an except clause catches a specific error so you can recover. Catch the narrowest relevant exception. A finally block is useful for cleanup even when an error occurs.",
    "worked": "try:\n    number = int(\"12x\")\nexcept ValueError:\n    number = 0\nprint(number)",
    "mistake": "Using bare except for every error, which can hide programming mistakes.",
    "stretch": "Ask a user to supply a number and show a clear message if conversion fails (test with preset strings first).",
    "check": "What exception does int(\"cat\") raise?",
    "answer": "ValueError."
  },
  "modules": {
    "deep": "A module contains reusable Python functions and values. import math lets you use math.sqrt; from math import sqrt imports that name directly. Using standard libraries saves writing common algorithms yourself.",
    "worked": "from math import gcd\nprint(gcd(18, 24))",
    "mistake": "Naming your own file math.py and unintentionally hiding the standard library math module.",
    "stretch": "Use math.pi to calculate the area of a circle with radius 3.",
    "check": "Why use math.sqrt(49) instead of writing a square-root algorithm?",
    "answer": "The library provides a well-tested implementation."
  },
  "randomness": {
    "deep": "Pseudo-random values are produced by an algorithm; seeding lets you reproduce a sequence for testing. randint(a,b) includes both endpoints, whereas choice() selects from a sequence.",
    "worked": "import random\nrandom.seed(4)\nprint(random.choice([\"red\", \"blue\", \"green\"]))",
    "mistake": "Assuming a seeded sequence is secure for passwords or security tokens.",
    "stretch": "Make a repeatable simulation of ten coin flips and count heads.",
    "check": "Why should a test use a fixed seed sometimes?",
    "answer": "It makes supposedly random results reproducible for debugging."
  },
  "enumerate": {
    "deep": "enumerate(iterable, start=0) produces index-value pairs. It removes the need to maintain a separate counter, reducing off-by-one mistakes. The optional start helps with human-friendly numbering.",
    "worked": "names = [\"A\", \"B\"]\nfor place, name in enumerate(names, start=1):\n    print(place, name)",
    "mistake": "Using for item in names then assuming item is its numeric position.",
    "stretch": "Display a numbered to-do list starting at 1.",
    "check": "What does enumerate(items, start=1) change?",
    "answer": "The first index is 1 instead of 0."
  },
  "zip": {
    "deep": "zip() pairs matching positions from multiple iterables and stops when the shortest runs out. Use it to process corresponding data, but make sure lists align correctly.",
    "worked": "names = [\"Kai\", \"Jo\"]\nmarks = [8, 9]\nprint(list(zip(names, marks)))",
    "mistake": "Expecting zip to keep extra items from a longer list automatically.",
    "stretch": "Pair three products with three prices and print a formatted receipt.",
    "check": "What happens if one list has two values and the other has four?",
    "answer": "Normal zip() stops after two pairs."
  },
  "sets-advanced": {
    "deep": "Union combines all distinct values; intersection keeps shared values; difference keeps values from the first set only. Use union, intersection and difference operations or the named methods.",
    "worked": "a = {1, 2, 3}\nb = {3, 4}\nprint(sorted(a - b))\nprint(sorted(a.union(b)))",
    "mistake": "Confusing difference (a-b) with symmetric difference (a^b).",
    "stretch": "Find students who joined both clubs and those who joined only the first club.",
    "check": "What is {1,2} & {2,3}?",
    "answer": "{2}."
  },
  "recursion": {
    "deep": "Recursive functions need a base case that stops the process and a recursive step that makes the remaining problem smaller. Each call has its own local values. Without progress towards the base case, recursion fails.",
    "worked": "def total(n):\n    if n == 0:\n        return 0\n    return n + total(n-1)\nprint(total(4))",
    "mistake": "Writing a recursive call without returning its result or without a base case.",
    "stretch": "Write a recursive function that sums the first n nonnegative integers.",
    "check": "Why does factorial(0) need its own rule?",
    "answer": "It supplies the stopping case and returns 1."
  },
  "classes": {
    "deep": "A class defines the structure and methods of objects; each instance has its own data. __init__ sets initial state and self refers to that specific object. Instances can call methods to update their state.",
    "worked": "class Counter:\n    def __init__(self):\n        self.n = 0\n    def add(self):\n        self.n += 1\nc = Counter()\nc.add()\nprint(c.n)",
    "mistake": "Forgetting self in a method or using a local variable instead of self.value.",
    "stretch": "Create a Student class holding a name and a method that introduces them.",
    "check": "Why are two Counter() instances separate?",
    "answer": "Each object stores its own instance state."
  },
  "inheritance": {
    "deep": "A subclass reuses behavior from a parent class and may add or override methods. super() calls parent methods when you want to extend rather than replace them. Prefer inheritance for genuine is-a relationships.",
    "worked": "class Animal:\n    def move(self): return \"moving\"\nclass Bird(Animal):\n    def move(self): return \"flying\"\nprint(Bird().move())",
    "mistake": "Assuming a child method and parent method both run automatically after an override.",
    "stretch": "Build Shape and Rectangle classes where Rectangle has an area() method.",
    "check": "If a subclass does not override a method, which version runs?",
    "answer": "The inherited parent method."
  },
  "lambda": {
    "deep": "lambda parameters: expression makes a short function. It is commonly used as the key for sorted(), map() or filter(). For multiple steps or complicated logic, define a normal function.",
    "worked": "people = [(\"A\", 4), (\"B\", 2)]\nprint(sorted(people, key=lambda p:p[1]))",
    "mistake": "Trying to put assignments, loops or many statements inside one lambda expression.",
    "stretch": "Sort a list of (name, score) pairs from highest to lowest score.",
    "check": "What is the main limitation of lambda?",
    "answer": "Its body is a single expression."
  },
  "generators": {
    "deep": "A generator produces items lazily when iteration asks for them, rather than building the full list immediately. yield pauses execution and resumes at the next request. This can help memory usage for long sequences.",
    "worked": "def squares(n):\n    for i in range(n):\n        yield i*i\nprint(list(squares(4)))",
    "mistake": "Trying to index a generator as if it were a list, or forgetting it can be exhausted.",
    "stretch": "Create a generator yielding even numbers below 10, then iterate through them.",
    "check": "Why are generators useful for large datasets?",
    "answer": "They avoid storing every generated item at once."
  },
  "regex": {
    "deep": "Regular expressions describe patterns. \\d matches a digit, + means one or more, ^ anchors the start and $ anchors the end. Use raw strings (r\"...\") to make backslashes easier to read.",
    "worked": "import re\ntext = \"ID-42 and ID-7\"\nprint(re.findall(r\"ID-\\d+\", text))",
    "mistake": "Assuming . matches only a literal full stop; it normally matches many characters.",
    "stretch": "Extract every three-digit number from a string using a suitable pattern.",
    "check": "What does \\d+ match?",
    "answer": "One or more consecutive digits."
  },
  "json": {
    "deep": "JSON represents objects, arrays, strings, numbers, booleans and null. json.loads converts JSON text into Python values; json.dumps converts Python values back to text. JSON keys in objects are strings.",
    "worked": "import json\nstudent = json.loads('{\"name\":\"Lee\",\"done\":true}')\nprint(student[\"done\"])",
    "mistake": "Using single quotes for keys inside JSON text; JSON requires double-quoted string keys.",
    "stretch": "Read a JSON string holding a game score and print the score.",
    "check": "What Python value does JSON true become?",
    "answer": "True, the Python boolean."
  },
  "testing": {
    "deep": "A good test checks expected behavior on ordinary inputs and boundary cases. assert raises AssertionError when a condition is false. Tests should check a function's result, not just whether code runs.",
    "worked": "def even(n): return n%2==0\nassert even(2) is True\nassert even(3) is False\nprint(\"OK\")",
    "mistake": "Testing only one successful input while missing zero, negative values and invalid input.",
    "stretch": "Write three asserts for a function that returns the larger of two numbers.",
    "check": "What does a failing assert tell you?",
    "answer": "A claimed condition is false for that test case."
  },
  "csv": {
    "deep": "CSV stores rows as text fields. The csv module correctly handles quotes and embedded separators; manual splitting on commas may fail. StringIO lets you practise the file interface without reading files.",
    "worked": "import csv, io\ndata = 'name,mark\\n\"Kai, Jr\",9'\nrows = list(csv.reader(io.StringIO(data)))\nprint(rows[1])",
    "mistake": "Parsing quoted fields using text.split(\",\") instead of csv.reader.",
    "stretch": "Read three CSV rows and calculate the average score in the final column.",
    "check": "Why use csv.reader instead of split(\",\")?",
    "answer": "CSV quoting rules can include commas inside a field."
  },
  "binary-search": {
    "deep": "Binary search requires sorted data. Compare the target with the middle value, then discard half of the remaining range each time. The time complexity is O(log n) for a list.",
    "worked": "a = [2, 4, 6, 8, 10]\nleft, right = 0, len(a)-1\nwhile left <= right:\n    mid = (left+right)//2\n    if a[mid] == 8:\n        print(mid); break\n    if a[mid] < 8: left = mid+1\n    else: right = mid-1",
    "mistake": "Applying binary search to unsorted data or updating left/right without excluding mid.",
    "stretch": "Write a function returning -1 when the target is absent from a sorted list.",
    "check": "Why is binary search logarithmic?",
    "answer": "Each comparison halves the candidate range."
  },
  "type-hints": {
    "deep": "Annotations explain expected parameter and return types but do not normally enforce them at runtime. They help readers, editors and static type checkers catch mistakes earlier.",
    "worked": "def total(marks: list[int]) -> int:\n    return sum(marks)\nprint(total([3, 5, 2]))",
    "mistake": "Believing a type hint automatically converts strings to integers.",
    "stretch": "Annotate a function that takes a string and returns its length as an integer.",
    "check": "Will Python reject add(\"2\", \"3\") solely because of hints?",
    "answer": "No. Runtime validation is separate."
  },
  "bitwise": {
    "deep": "Bitwise operators work on binary digits inside integers. AND keeps bits set in both; OR keeps bits set in either; XOR keeps bits set in exactly one. Use bin() to inspect results.",
    "worked": "a = 0b1100\nb = 0b1010\nprint(bin(a & b))\nprint(bin(a ^ b))",
    "mistake": "Confusing bitwise & with boolean and; they operate differently and have different precedence.",
    "stretch": "Calculate the bitwise OR of 0b1010 and 0b0101 and write the result in binary.",
    "check": "What is 1 XOR 1?",
    "answer": "0."
  },
  "binary-convert": {
    "deep": "Binary is base 2, using place values 1, 2, 4, 8, 16 and so on. bin(n) returns a string prefixed with 0b; int(text, 2) converts binary text back to an integer.",
    "worked": "number = 13\nprint(bin(number))\nprint(int(\"1101\", 2))",
    "mistake": "Writing a binary-looking sequence without specifying base 2 when converting it.",
    "stretch": "Convert 29 to binary and verify by converting back.",
    "check": "What is binary 10110 in denary?",
    "answer": "22."
  },
  "hex-convert": {
    "deep": "Hexadecimal is base 16 with digits 0–9 and A–F. One hex digit represents four bits, making it compact for binary values. hex(n) gives text with a 0x prefix.",
    "worked": "n = 255\nprint(hex(n))\nprint(int(\"FF\", 16))",
    "mistake": "Assuming hexadecimal 10 means ten in denary; it means sixteen.",
    "stretch": "Convert 0b11110000 to hexadecimal and back.",
    "check": "What denary value does hex A stand for?",
    "answer": "10."
  },
  "format-round": {
    "deep": "Rounding changes how numbers are displayed or approximated. round(x, digits) gives a rounded number, while f\"{x:.2f}\" formats text with exactly two decimal places. Floating-point values can be approximate.",
    "worked": "x = 2/3\nprint(round(x, 2))\nprint(f\"{x:.2f}\")",
    "mistake": "Using rounded intermediate values for financial totals and expecting exact results.",
    "stretch": "Format a computed percentage to one decimal place.",
    "check": "Does :.2f return a float or a string?",
    "answer": "It produces formatted text in the f-string."
  },
  "sorting-key": {
    "deep": "The key function is called for each element and decides which value to compare. You can sort text without case differences or sort records by a field.",
    "worked": "words = [\"pear\", \"Apple\", \"banana\"]\nprint(sorted(words, key=str.lower))",
    "mistake": "Trying to call the key function immediately, e.g. key=str.lower() instead of key=str.lower.",
    "stretch": "Sort words by their lengths, shortest first.",
    "check": "What does sorted(items, key=len) use for comparison?",
    "answer": "The length of each element."
  },
  "any-all": {
    "deep": "any(iterable) checks whether at least one value is truthy; all(iterable) checks whether every value is truthy. These are helpful when checking a list of conditions.",
    "worked": "marks = [78, 61, 95]\nprint(any(m>=90 for m in marks))\nprint(all(m>=50 for m in marks))",
    "mistake": "Mixing up any and all, especially when checking whether everyone passed.",
    "stretch": "Check if any test score is below 40 and whether all scores are nonnegative.",
    "check": "What is all([])?",
    "answer": "True (there is no counterexample in an empty iterable)."
  },
  "lambda-func": {
    "deep": "A lambda can be assigned to a variable, but its most useful role is often passing a short behavior into another function. A def is clearer when there are several steps.",
    "worked": "values = [\"a\", \"bbb\", \"cc\"]\nprint(sorted(values, key=lambda s: len(s)))",
    "mistake": "Writing lambda as if it were a multi-statement block.",
    "stretch": "Use a lambda to sort pairs by their second number.",
    "check": "Can lambda contain a for loop statement?",
    "answer": "No, but it can contain expressions like comprehensions."
  },
  "dict-comprehension": {
    "deep": "{key_expr: value_expr for item in iterable if condition} builds a dictionary. It is useful for converting lists to lookups or counting simple derived values.",
    "worked": "names = [\"Kai\", \"Mia\"]\nlengths = {n:len(n) for n in names}\nprint(lengths)",
    "mistake": "Forgetting the colon between key and value expressions.",
    "stretch": "Create a dictionary mapping numbers 1–5 to their squares.",
    "check": "Which character separates key and value in a dict comprehension?",
    "answer": "A colon."
  },
  "regex-intro": {
    "deep": "Search patterns can match text without knowing the exact characters. re.search finds one match; re.findall returns matching strings; anchors and character classes make rules more specific.",
    "worked": "import re\nprint(re.findall(r\"[A-Z]{2}\\d{2}\", \"AB12 cd34 EF56\"))",
    "mistake": "Using \\d when you mean a literal letter d, or forgetting raw string notation.",
    "stretch": "Find all words ending in \"ing\" in a sentence.",
    "check": "What does {2} mean in a regex?",
    "answer": "Exactly two repetitions of the preceding pattern."
  },
  "classes-init": {
    "deep": "__init__ runs when an instance is created. Each object uses self to store its own attributes. Default parameters can provide initial values when arguments are omitted.",
    "worked": "class Player:\n    def __init__(self, coins=0):\n        self.coins = coins\np = Player(5)\nprint(p.coins)",
    "mistake": "Forgetting to assign self.coins and creating only a local variable coins.",
    "stretch": "Make a Book class with title and pages attributes, then create two books.",
    "check": "When does __init__ run?",
    "answer": "As part of constructing a new instance."
  },
  "file-like": {
    "deep": "StringIO offers a file-style interface over a string. readline() reads one line, read() consumes the remaining content and seek(0) rewinds. Use it to practise safe file processing.",
    "worked": "from io import StringIO\nf = StringIO(\"one\\ntwo\")\nprint(f.readline().strip())\nf.seek(0)\nprint(f.read())",
    "mistake": "Assuming read() starts from the beginning after you already read a line.",
    "stretch": "Read all lines from StringIO and count how many there are.",
    "check": "Why might seek(0) be needed?",
    "answer": "It moves the current position back to the beginning."
  },
  "binary-search-idea": {
    "deep": "Binary search works by maintaining a lower and upper boundary in sorted data. Compare the middle item with the target. Move only the relevant boundary so the search space shrinks.",
    "worked": "items = [10, 20, 30, 40, 50]\nlo, hi = 0, len(items)-1\nmid = (lo+hi)//2\nprint(items[mid])",
    "mistake": "Using a middle index based on the full list after changing the search boundaries.",
    "stretch": "Trace the middle values when searching for 40 in [10,20,30,40,50].",
    "check": "Why must the data be sorted first?",
    "answer": "Without ordering, comparing the middle gives no reason to discard a half."
  },
  "enumerate-plus": {
    "deep": "Instead of manually adding 1 to a counter, enumerate() provides an index alongside each value. The start= argument changes only the labels, not list positions.",
    "worked": "letters = [\"X\", \"Y\"]\nfor n, letter in enumerate(letters, start=10):\n    print(n, letter)",
    "mistake": "Assuming enumerate changes the underlying list or its indexes.",
    "stretch": "Display a scoreboard numbered 1, 2, 3 with enumerate().",
    "check": "What is the first number from enumerate(items, 5)?",
    "answer": "5."
  },
  "zip-plus": {
    "deep": "zip() lazily pairs items from each iterable. Convert it to list if you need all pairs at once; otherwise loop directly. Unequal lengths normally stop at the shortest.",
    "worked": "a = [1, 2, 3]\nb = [\"a\", \"b\"]\nprint(list(zip(a, b)))",
    "mistake": "Expecting an unpaired third item to be preserved.",
    "stretch": "Create a dictionary from names and marks with dict(zip(names, marks)).",
    "check": "How many pairs does zip of lengths 3 and 2 produce?",
    "answer": "Two."
  },
  "unpack-plus": {
    "deep": "Unpacking assigns values to several names at once. The number of variables normally must match the number of items; *rest can collect leftovers.",
    "worked": "first, *middle, last = [1,2,3,4]\nprint(first, middle, last)",
    "mistake": "Trying to unpack three values into two variables without a starred target.",
    "stretch": "Swap two variables without creating a temporary one.",
    "check": "What does a, b = b, a do?",
    "answer": "Swaps the values."
  },
  "round-plus": {
    "deep": "The second argument of round() is the number of decimal places. Rounding floating-point values can have surprising results because not all decimals are exact in binary.",
    "worked": "value = 12.3456\nprint(round(value, 2))\nprint(f\"{value:.2f}\")",
    "mistake": "Assuming round() always behaves like decimal rounding learned in primary school.",
    "stretch": "Compare round(1.234, 1) with formatting it to one decimal place.",
    "check": "Does round(x,2) guarantee two printed decimal digits?",
    "answer": "No; use formatting when fixed digits are needed."
  },
  "min-max-plus": {
    "deep": "min() and max() find the lowest and highest values in an iterable. They also accept a key function for more complex items; calling them on an empty sequence raises an error without a default.",
    "worked": "scores = [8, 12, 4]\nprint(min(scores), max(scores))",
    "mistake": "Calling min([]) without handling the empty-list case.",
    "stretch": "Find the name of the longest word in a list using max(..., key=len).",
    "check": "What does max([3, 9, 2]) return?",
    "answer": "9."
  },
  "string-count-plus": {
    "deep": "count(substring) returns the number of nonoverlapping matches inside a string. It is case-sensitive, so lower() helps with case-insensitive counting.",
    "worked": "text = \"Banana banana\"\nprint(text.lower().count(\"ana\"))",
    "mistake": "Assuming count(\"ana\") counts overlapping appearances separately.",
    "stretch": "Count how often \"py\" occurs in text without caring about letter case.",
    "check": "Does count() change the original string?",
    "answer": "No, strings are immutable."
  },
  "counter-plus": {
    "deep": "collections.Counter is a dictionary-like tool that counts hashable items. It supports most_common() for finding frequent entries and treats missing keys as zero.",
    "worked": "from collections import Counter\nc = Counter([\"red\",\"blue\",\"red\"])\nprint(c.most_common(1))",
    "mistake": "Assuming Counter preserves the order of counts when several items tie.",
    "stretch": "Find the two most common letters in a short word.",
    "check": "What value does Counter()[\"missing\"] return?",
    "answer": "0."
  },
  "json-load-plus": {
    "deep": "json.loads takes JSON text and builds Python dictionaries, lists and values. Invalid JSON raises a JSONDecodeError; make sure quoted keys use double quotes in JSON.",
    "worked": "import json\nprint(json.loads('[1,2,3]')[1])",
    "mistake": "Confusing loads (string input) with load (file input).",
    "stretch": "Parse a JSON list of scores and find its maximum.",
    "check": "What does loads return for a JSON array?",
    "answer": "A Python list."
  },
  "json-write-plus": {
    "deep": "json.dumps serializes Python values to JSON text. indent makes it readable; sort_keys orders keys, which can make tests and comparisons predictable.",
    "worked": "import json\nsettings = {\"volume\":3,\"dark\":True}\nprint(json.dumps(settings, sort_keys=True))",
    "mistake": "Expecting dumps() to return a dictionary instead of a string.",
    "stretch": "Serialize a dictionary with two fields and an indent of 2.",
    "check": "What JSON word represents Python True?",
    "answer": "true."
  },
  "date-plus": {
    "deep": "datetime.date represents a calendar date independently of time. date arithmetic uses timedelta for day changes. weekday() uses 0 for Monday and 6 for Sunday.",
    "worked": "from datetime import date, timedelta\nd = date(2026, 1, 1)\nprint(d + timedelta(days=7))",
    "mistake": "Treating weekday() as Sunday=0 or trying to add a plain integer to a date.",
    "stretch": "Compute the date 30 days after a chosen starting date.",
    "check": "What does weekday() return for a Monday?",
    "answer": "0."
  },
  "combinations-plus": {
    "deep": "Combinations choose items without considering order; (A,B) and (B,A) count as the same group. itertools.combinations(iterable,r) generates groups of exactly r items.",
    "worked": "from itertools import combinations\nprint(list(combinations(\"ABC\", 2)))",
    "mistake": "Mistaking combinations for permutations, where order matters.",
    "stretch": "List all teams of two from four names and count them.",
    "check": "How many pairs can be formed from four different people?",
    "answer": "Six."
  },
  "binary-convert-plus": {
    "deep": "Binary place values double as you move left. bin() adds a 0b prefix to show a base-two representation; int(text,2) reverses the process.",
    "worked": "print(bin(18))\nprint(int(\"10010\", 2))",
    "mistake": "Reading 10010 as a base-ten number during conversion.",
    "stretch": "Convert 42 to binary, then check that the conversion back gives 42.",
    "check": "What is the value of binary 10000?",
    "answer": "16."
  },
  "hex-convert-plus": {
    "deep": "Hex digits represent 16 possible values, and two hex digits represent one byte. int(hex_text,16) interprets a string as base 16, while hex(number) does the reverse.",
    "worked": "print(int(\"2A\", 16))\nprint(hex(42))",
    "mistake": "Reading hex 2A as decimal 2+10 rather than 2×16+10.",
    "stretch": "Convert hexadecimal 3F to denary and binary.",
    "check": "What is hexadecimal F in denary?",
    "answer": "15."
  },
  "filter-comprehension-plus": {
    "deep": "A filtered comprehension keeps only elements meeting a condition. Put the if after the for clause. Use a separate loop when the rule is complicated or needs multiple statements.",
    "worked": "nums = range(10)\nprint([n for n in nums if n%3==0])",
    "mistake": "Placing the condition before for when you intend a simple filter.",
    "stretch": "Make a list of the squares of numbers 1–20 that are multiples of 4.",
    "check": "What is the purpose of the final if condition?",
    "answer": "It filters which source items are included."
  },
  "pathlib-plus": {
    "deep": "PurePosixPath manipulates path strings without touching files. .name returns the last part, .suffix the final file extension, and .parent the directory path.",
    "worked": "from pathlib import PurePosixPath\npath = PurePosixPath(\"notes/code.py\")\nprint(path.name, path.suffix)",
    "mistake": "Thinking PurePosixPath can read files by itself; it only describes paths.",
    "stretch": "Extract the suffix and parent of \"projects/python/main.py\".",
    "check": "What does .suffix return for \"report.pdf\"?",
    "answer": ".pdf."
  },
  "exceptions-plus": {
    "deep": "Raising an exception tells the caller an operation is invalid. Choose a specific exception type, include a useful message, and let callers catch only errors they can handle.",
    "worked": "def divide(a,b):\n    if b==0: raise ValueError(\"zero divisor\")\n    return a/b\ntry:\n    print(divide(4,0))\nexcept ValueError as e:\n    print(e)",
    "mistake": "Silently returning an unrelated value instead of explaining invalid input, or catching every error.",
    "stretch": "Write a function rejecting negative ages with ValueError and test the catch.",
    "check": "When would you raise ValueError?",
    "answer": "When an argument has a valid type but unacceptable value."
  }
};
