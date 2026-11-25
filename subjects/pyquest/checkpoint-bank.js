/* Eight questions per four-lesson group; answers also checked by Firestore rules. */
export const CHECKPOINT_BANK = [
  [
    {
      "q": "Predict the output of the second worked example in lesson 1: Hello, Python!.",
      "a": [
        "Score: 10",
        "warm",
        "Hello coder ↵ 5",
        "2 17"
      ],
      "correct": 2,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What changes if you remove the quotation marks around 2 + 3?",
      "a": [
        "Only the first true branch in the chain runs.",
        "The right-hand side is calculated first, then stored under score.",
        "3 and 2 respectively.",
        "Python evaluates it as an expression instead of printing the literal text."
      ],
      "correct": 3,
      "why": "Python evaluates it as an expression instead of printing the literal text."
    },
    {
      "q": "Predict the output of the second worked example in lesson 2: Variables.",
      "a": [
        "2 17",
        "Hello coder ↵ 5",
        "Score: 10",
        "warm"
      ],
      "correct": 2,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "Why is score = score + 1 valid in Python?",
      "a": [
        "Python evaluates it as an expression instead of printing the literal text.",
        "The right-hand side is calculated first, then stored under score.",
        "3 and 2 respectively.",
        "Only the first true branch in the chain runs."
      ],
      "correct": 1,
      "why": "The right-hand side is calculated first, then stored under score."
    },
    {
      "q": "Predict the output of the second worked example in lesson 3: Python Maths.",
      "a": [
        "2 17",
        "warm",
        "Score: 10",
        "Hello coder ↵ 5"
      ],
      "correct": 0,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What are 17 // 5 and 17 % 5?",
      "a": [
        "The right-hand side is calculated first, then stored under score.",
        "Python evaluates it as an expression instead of printing the literal text.",
        "Only the first true branch in the chain runs.",
        "3 and 2 respectively."
      ],
      "correct": 3,
      "why": "3 and 2 respectively."
    },
    {
      "q": "Predict the output of the second worked example in lesson 4: If & Else.",
      "a": [
        "Hello coder ↵ 5",
        "2 17",
        "warm",
        "Score: 10"
      ],
      "correct": 2,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What happens if two elif conditions could both be true?",
      "a": [
        "Only the first true branch in the chain runs.",
        "Python evaluates it as an expression instead of printing the literal text.",
        "The right-hand side is calculated first, then stored under score.",
        "3 and 2 respectively."
      ],
      "correct": 0,
      "why": "Only the first true branch in the chain runs."
    }
  ],
  [
    {
      "q": "Predict the output of the second worked example in lesson 5: Loops.",
      "a": [
        "106.0",
        "5 ↵ 3 ↵ 1",
        "0 ↵ 5",
        "9 3"
      ],
      "correct": 1,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "How many times does range(2, 11, 2) iterate?",
      "a": [
        "A parameter is the variable in the definition; an argument is the supplied value at a call.",
        "The final element in the list.",
        "Five times: 2, 4, 6, 8 and 10.",
        "get() returns a fallback when a key is missing; brackets raise KeyError."
      ],
      "correct": 2,
      "why": "Five times: 2, 4, 6, 8 and 10."
    },
    {
      "q": "Predict the output of the second worked example in lesson 6: Lists.",
      "a": [
        "9 3",
        "0 ↵ 5",
        "5 ↵ 3 ↵ 1",
        "106.0"
      ],
      "correct": 0,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What does names[-1] select?",
      "a": [
        "The final element in the list.",
        "A parameter is the variable in the definition; an argument is the supplied value at a call.",
        "Five times: 2, 4, 6, 8 and 10.",
        "get() returns a fallback when a key is missing; brackets raise KeyError."
      ],
      "correct": 0,
      "why": "The final element in the list."
    },
    {
      "q": "Predict the output of the second worked example in lesson 7: Functions.",
      "a": [
        "9 3",
        "0 ↵ 5",
        "106.0",
        "5 ↵ 3 ↵ 1"
      ],
      "correct": 2,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "How are a parameter and an argument different?",
      "a": [
        "get() returns a fallback when a key is missing; brackets raise KeyError.",
        "A parameter is the variable in the definition; an argument is the supplied value at a call.",
        "Five times: 2, 4, 6, 8 and 10.",
        "The final element in the list."
      ],
      "correct": 1,
      "why": "A parameter is the variable in the definition; an argument is the supplied value at a call."
    },
    {
      "q": "Predict the output of the second worked example in lesson 8: Dictionaries.",
      "a": [
        "106.0",
        "0 ↵ 5",
        "5 ↵ 3 ↵ 1",
        "9 3"
      ],
      "correct": 1,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "Why is scores.get(\"Art\", 0) safer than scores[\"Art\"]?",
      "a": [
        "get() returns a fallback when a key is missing; brackets raise KeyError.",
        "A parameter is the variable in the definition; an argument is the supplied value at a call.",
        "Five times: 2, 4, 6, 8 and 10.",
        "The final element in the list."
      ],
      "correct": 0,
      "why": "get() returns a fallback when a key is missing; brackets raise KeyError."
    }
  ],
  [
    {
      "q": "Predict the output of the second worked example in lesson 9: String Tricks.",
      "a": [
        "League points: 14",
        "True",
        "1 ↵ 2 ↵ 4 ↵ 8",
        "python"
      ],
      "correct": 3,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What is the length of \"a b\"?",
      "a": [
        "Three characters, because the space counts.",
        "Boundary cases such as zero answers or the maximum score.",
        "When repetition depends on a condition rather than a known count.",
        "True, because True and False is False."
      ],
      "correct": 0,
      "why": "Three characters, because the space counts."
    },
    {
      "q": "Predict the output of the second worked example in lesson 10: Mini Project.",
      "a": [
        "League points: 14",
        "True",
        "python",
        "1 ↵ 2 ↵ 4 ↵ 8"
      ],
      "correct": 0,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What would you test after the normal case?",
      "a": [
        "True, because True and False is False.",
        "Three characters, because the space counts.",
        "Boundary cases such as zero answers or the maximum score.",
        "When repetition depends on a condition rather than a known count."
      ],
      "correct": 2,
      "why": "Boundary cases such as zero answers or the maximum score."
    },
    {
      "q": "Predict the output of the second worked example in lesson 11: While Loops.",
      "a": [
        "1 ↵ 2 ↵ 4 ↵ 8",
        "League points: 14",
        "True",
        "python"
      ],
      "correct": 0,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "When is a while loop better than a for-range loop?",
      "a": [
        "When repetition depends on a condition rather than a known count.",
        "Three characters, because the space counts.",
        "Boundary cases such as zero answers or the maximum score.",
        "True, because True and False is False."
      ],
      "correct": 0,
      "why": "When repetition depends on a condition rather than a known count."
    },
    {
      "q": "Predict the output of the second worked example in lesson 12: True or False.",
      "a": [
        "True",
        "python",
        "1 ↵ 2 ↵ 4 ↵ 8",
        "League points: 14"
      ],
      "correct": 0,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What is not (True and False)?",
      "a": [
        "When repetition depends on a condition rather than a known count.",
        "True, because True and False is False.",
        "Three characters, because the space counts.",
        "Boundary cases such as zero answers or the maximum score."
      ],
      "correct": 1,
      "why": "True, because True and False is False."
    }
  ],
  [
    {
      "q": "Predict the output of the second worked example in lesson 13: Tuples.",
      "a": [
        "Mia: 85%",
        "['A', 'B']",
        "11",
        "bd ↵ fedcba"
      ],
      "correct": 2,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "Can you assign position[0] = 9?",
      "a": [
        "The first three elements: indexes 0, 1 and 2.",
        "The text 3.14.",
        "No. Tuples are immutable.",
        "It naturally prevents counting the same student twice."
      ],
      "correct": 2,
      "why": "No. Tuples are immutable."
    },
    {
      "q": "Predict the output of the second worked example in lesson 14: Sets.",
      "a": [
        "bd ↵ fedcba",
        "Mia: 85%",
        "11",
        "['A', 'B']"
      ],
      "correct": 3,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "Why can a set be useful for attendance?",
      "a": [
        "No. Tuples are immutable.",
        "The first three elements: indexes 0, 1 and 2.",
        "The text 3.14.",
        "It naturally prevents counting the same student twice."
      ],
      "correct": 3,
      "why": "It naturally prevents counting the same student twice."
    },
    {
      "q": "Predict the output of the second worked example in lesson 15: Slicing.",
      "a": [
        "['A', 'B']",
        "bd ↵ fedcba",
        "Mia: 85%",
        "11"
      ],
      "correct": 1,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What does items[:3] include?",
      "a": [
        "The text 3.14.",
        "The first three elements: indexes 0, 1 and 2.",
        "It naturally prevents counting the same student twice.",
        "No. Tuples are immutable."
      ],
      "correct": 1,
      "why": "The first three elements: indexes 0, 1 and 2."
    },
    {
      "q": "Predict the output of the second worked example in lesson 16: F-Strings.",
      "a": [
        "11",
        "bd ↵ fedcba",
        "Mia: 85%",
        "['A', 'B']"
      ],
      "correct": 2,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What does {3.14159:.2f} produce?",
      "a": [
        "It naturally prevents counting the same student twice.",
        "The text 3.14.",
        "The first three elements: indexes 0, 1 and 2.",
        "No. Tuples are immutable."
      ],
      "correct": 1,
      "why": "The text 3.14."
    }
  ],
  [
    {
      "q": "Predict the output of the second worked example in lesson 17: Nested Loops.",
      "a": [
        "0",
        "[9, 1, 4] ↵ [9, 4, 1]",
        "[4, 16]",
        "0 0 ↵ 0 1 ↵ 0 2 ↵ 1 0 ↵ 1 1 ↵ 1 2"
      ],
      "correct": 3,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "How many inner iterations occur for 4 rows and 3 columns?",
      "a": [
        "12.",
        "After the for clause.",
        "No, it creates and returns a new list.",
        "ValueError."
      ],
      "correct": 0,
      "why": "12."
    },
    {
      "q": "Predict the output of the second worked example in lesson 18: Sorting.",
      "a": [
        "[4, 16]",
        "0",
        "[9, 1, 4] ↵ [9, 4, 1]",
        "0 0 ↵ 0 1 ↵ 0 2 ↵ 1 0 ↵ 1 1 ↵ 1 2"
      ],
      "correct": 2,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "Does sorted(values) modify values?",
      "a": [
        "12.",
        "ValueError.",
        "After the for clause.",
        "No, it creates and returns a new list."
      ],
      "correct": 3,
      "why": "No, it creates and returns a new list."
    },
    {
      "q": "Predict the output of the second worked example in lesson 19: List Comprehensions.",
      "a": [
        "0",
        "[4, 16]",
        "0 0 ↵ 0 1 ↵ 0 2 ↵ 1 0 ↵ 1 1 ↵ 1 2",
        "[9, 1, 4] ↵ [9, 4, 1]"
      ],
      "correct": 1,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "Where does the if filter go in a basic list comprehension?",
      "a": [
        "No, it creates and returns a new list.",
        "ValueError.",
        "12.",
        "After the for clause."
      ],
      "correct": 3,
      "why": "After the for clause."
    },
    {
      "q": "Predict the output of the second worked example in lesson 20: Handle Errors.",
      "a": [
        "[9, 1, 4] ↵ [9, 4, 1]",
        "0 0 ↵ 0 1 ↵ 0 2 ↵ 1 0 ↵ 1 1 ↵ 1 2",
        "[4, 16]",
        "0"
      ],
      "correct": 3,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What exception does int(\"cat\") raise?",
      "a": [
        "ValueError.",
        "No, it creates and returns a new list.",
        "After the for clause.",
        "12."
      ],
      "correct": 0,
      "why": "ValueError."
    }
  ],
  [
    {
      "q": "Predict the output of the second worked example in lesson 21: Modules.",
      "a": [
        "1 A ↵ 2 B",
        "6",
        "red",
        "[('Kai', 8), ('Jo', 9)]"
      ],
      "correct": 1,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "Why use math.sqrt(49) instead of writing a square-root algorithm?",
      "a": [
        "The library provides a well-tested implementation.",
        "It makes supposedly random results reproducible for debugging.",
        "The first index is 1 instead of 0.",
        "Normal zip() stops after two pairs."
      ],
      "correct": 0,
      "why": "The library provides a well-tested implementation."
    },
    {
      "q": "Predict the output of the second worked example in lesson 22: Random Numbers.",
      "a": [
        "[('Kai', 8), ('Jo', 9)]",
        "red",
        "6",
        "1 A ↵ 2 B"
      ],
      "correct": 1,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "Why should a test use a fixed seed sometimes?",
      "a": [
        "The library provides a well-tested implementation.",
        "Normal zip() stops after two pairs.",
        "It makes supposedly random results reproducible for debugging.",
        "The first index is 1 instead of 0."
      ],
      "correct": 2,
      "why": "It makes supposedly random results reproducible for debugging."
    },
    {
      "q": "Predict the output of the second worked example in lesson 23: Enumerate.",
      "a": [
        "[('Kai', 8), ('Jo', 9)]",
        "1 A ↵ 2 B",
        "6",
        "red"
      ],
      "correct": 1,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What does enumerate(items, start=1) change?",
      "a": [
        "The library provides a well-tested implementation.",
        "It makes supposedly random results reproducible for debugging.",
        "Normal zip() stops after two pairs.",
        "The first index is 1 instead of 0."
      ],
      "correct": 3,
      "why": "The first index is 1 instead of 0."
    },
    {
      "q": "Predict the output of the second worked example in lesson 24: Zip Lists.",
      "a": [
        "[('Kai', 8), ('Jo', 9)]",
        "red",
        "1 A ↵ 2 B",
        "6"
      ],
      "correct": 0,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What happens if one list has two values and the other has four?",
      "a": [
        "The library provides a well-tested implementation.",
        "The first index is 1 instead of 0.",
        "It makes supposedly random results reproducible for debugging.",
        "Normal zip() stops after two pairs."
      ],
      "correct": 3,
      "why": "Normal zip() stops after two pairs."
    }
  ],
  [
    {
      "q": "Predict the output of the second worked example in lesson 25: Set Operations.",
      "a": [
        "[1, 2] ↵ [1, 2, 3, 4]",
        "1",
        "10",
        "flying"
      ],
      "correct": 0,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What is {1,2} & {2,3}?",
      "a": [
        "The inherited parent method.",
        "It supplies the stopping case and returns 1.",
        "{2}.",
        "Each object stores its own instance state."
      ],
      "correct": 2,
      "why": "{2}."
    },
    {
      "q": "Predict the output of the second worked example in lesson 26: Recursion.",
      "a": [
        "flying",
        "1",
        "[1, 2] ↵ [1, 2, 3, 4]",
        "10"
      ],
      "correct": 3,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "Why does factorial(0) need its own rule?",
      "a": [
        "{2}.",
        "Each object stores its own instance state.",
        "The inherited parent method.",
        "It supplies the stopping case and returns 1."
      ],
      "correct": 3,
      "why": "It supplies the stopping case and returns 1."
    },
    {
      "q": "Predict the output of the second worked example in lesson 27: Classes & Objects.",
      "a": [
        "1",
        "[1, 2] ↵ [1, 2, 3, 4]",
        "flying",
        "10"
      ],
      "correct": 0,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "Why are two Counter() instances separate?",
      "a": [
        "Each object stores its own instance state.",
        "The inherited parent method.",
        "{2}.",
        "It supplies the stopping case and returns 1."
      ],
      "correct": 0,
      "why": "Each object stores its own instance state."
    },
    {
      "q": "Predict the output of the second worked example in lesson 28: Inheritance.",
      "a": [
        "1",
        "10",
        "flying",
        "[1, 2] ↵ [1, 2, 3, 4]"
      ],
      "correct": 2,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "If a subclass does not override a method, which version runs?",
      "a": [
        "The inherited parent method.",
        "It supplies the stopping case and returns 1.",
        "{2}.",
        "Each object stores its own instance state."
      ],
      "correct": 0,
      "why": "The inherited parent method."
    }
  ],
  [
    {
      "q": "Predict the output of the second worked example in lesson 29: Lambda Functions.",
      "a": [
        "[('B', 2), ('A', 4)]",
        "[0, 1, 4, 9]",
        "True",
        "['ID-42', 'ID-7']"
      ],
      "correct": 0,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What is the main limitation of lambda?",
      "a": [
        "Its body is a single expression.",
        "True, the Python boolean.",
        "One or more consecutive digits.",
        "They avoid storing every generated item at once."
      ],
      "correct": 0,
      "why": "Its body is a single expression."
    },
    {
      "q": "Predict the output of the second worked example in lesson 30: Generators.",
      "a": [
        "True",
        "[('B', 2), ('A', 4)]",
        "[0, 1, 4, 9]",
        "['ID-42', 'ID-7']"
      ],
      "correct": 2,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "Why are generators useful for large datasets?",
      "a": [
        "One or more consecutive digits.",
        "They avoid storing every generated item at once.",
        "True, the Python boolean.",
        "Its body is a single expression."
      ],
      "correct": 1,
      "why": "They avoid storing every generated item at once."
    },
    {
      "q": "Predict the output of the second worked example in lesson 31: Pattern Matching.",
      "a": [
        "[0, 1, 4, 9]",
        "True",
        "['ID-42', 'ID-7']",
        "[('B', 2), ('A', 4)]"
      ],
      "correct": 2,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What does \\d+ match?",
      "a": [
        "One or more consecutive digits.",
        "They avoid storing every generated item at once.",
        "True, the Python boolean.",
        "Its body is a single expression."
      ],
      "correct": 0,
      "why": "One or more consecutive digits."
    },
    {
      "q": "Predict the output of the second worked example in lesson 32: JSON Data.",
      "a": [
        "True",
        "[('B', 2), ('A', 4)]",
        "[0, 1, 4, 9]",
        "['ID-42', 'ID-7']"
      ],
      "correct": 0,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What Python value does JSON true become?",
      "a": [
        "Its body is a single expression.",
        "They avoid storing every generated item at once.",
        "One or more consecutive digits.",
        "True, the Python boolean."
      ],
      "correct": 3,
      "why": "True, the Python boolean."
    }
  ],
  [
    {
      "q": "Predict the output of the second worked example in lesson 33: Testing with Assert.",
      "a": [
        "3",
        "10",
        "['Kai, Jr', '9']",
        "OK"
      ],
      "correct": 3,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What does a failing assert tell you?",
      "a": [
        "Each comparison halves the candidate range.",
        "No. Runtime validation is separate.",
        "A claimed condition is false for that test case.",
        "CSV quoting rules can include commas inside a field."
      ],
      "correct": 2,
      "why": "A claimed condition is false for that test case."
    },
    {
      "q": "Predict the output of the second worked example in lesson 34: CSV Data.",
      "a": [
        "3",
        "10",
        "OK",
        "['Kai, Jr', '9']"
      ],
      "correct": 3,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "Why use csv.reader instead of split(\",\")?",
      "a": [
        "CSV quoting rules can include commas inside a field.",
        "No. Runtime validation is separate.",
        "A claimed condition is false for that test case.",
        "Each comparison halves the candidate range."
      ],
      "correct": 0,
      "why": "CSV quoting rules can include commas inside a field."
    },
    {
      "q": "Predict the output of the second worked example in lesson 35: Binary Search.",
      "a": [
        "OK",
        "['Kai, Jr', '9']",
        "10",
        "3"
      ],
      "correct": 3,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "Why is binary search logarithmic?",
      "a": [
        "Each comparison halves the candidate range.",
        "No. Runtime validation is separate.",
        "CSV quoting rules can include commas inside a field.",
        "A claimed condition is false for that test case."
      ],
      "correct": 0,
      "why": "Each comparison halves the candidate range."
    },
    {
      "q": "Predict the output of the second worked example in lesson 36: Type Hints.",
      "a": [
        "OK",
        "3",
        "10",
        "['Kai, Jr', '9']"
      ],
      "correct": 2,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "Will Python reject add(\"2\", \"3\") solely because of hints?",
      "a": [
        "No. Runtime validation is separate.",
        "CSV quoting rules can include commas inside a field.",
        "Each comparison halves the candidate range.",
        "A claimed condition is false for that test case."
      ],
      "correct": 0,
      "why": "No. Runtime validation is separate."
    }
  ],
  [
    {
      "q": "Predict the output of the second worked example in lesson 37: Bitwise Operators.",
      "a": [
        "0xff ↵ 255",
        "0b1101 ↵ 13",
        "0.67 ↵ 0.67",
        "0b1000 ↵ 0b110"
      ],
      "correct": 3,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What is 1 XOR 1?",
      "a": [
        "It produces formatted text in the f-string.",
        "0.",
        "22.",
        "10."
      ],
      "correct": 1,
      "why": "0."
    },
    {
      "q": "Predict the output of the second worked example in lesson 38: Binary Conversion.",
      "a": [
        "0xff ↵ 255",
        "0b1000 ↵ 0b110",
        "0.67 ↵ 0.67",
        "0b1101 ↵ 13"
      ],
      "correct": 3,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What is binary 10110 in denary?",
      "a": [
        "0.",
        "10.",
        "It produces formatted text in the f-string.",
        "22."
      ],
      "correct": 3,
      "why": "22."
    },
    {
      "q": "Predict the output of the second worked example in lesson 39: Hexadecimal.",
      "a": [
        "0xff ↵ 255",
        "0b1000 ↵ 0b110",
        "0.67 ↵ 0.67",
        "0b1101 ↵ 13"
      ],
      "correct": 0,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What denary value does hex A stand for?",
      "a": [
        "22.",
        "10.",
        "It produces formatted text in the f-string.",
        "0."
      ],
      "correct": 1,
      "why": "10."
    },
    {
      "q": "Predict the output of the second worked example in lesson 40: Rounding and Format.",
      "a": [
        "0b1101 ↵ 13",
        "0xff ↵ 255",
        "0.67 ↵ 0.67",
        "0b1000 ↵ 0b110"
      ],
      "correct": 2,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "Does :.2f return a float or a string?",
      "a": [
        "22.",
        "It produces formatted text in the f-string.",
        "0.",
        "10."
      ],
      "correct": 1,
      "why": "It produces formatted text in the f-string."
    }
  ],
  [
    {
      "q": "Predict the output of the second worked example in lesson 41: Custom Sorting.",
      "a": [
        "['Apple', 'banana', 'pear']",
        "{'Kai': 3, 'Mia': 3}",
        "['a', 'cc', 'bbb']",
        "True ↵ True"
      ],
      "correct": 0,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What does sorted(items, key=len) use for comparison?",
      "a": [
        "A colon.",
        "The length of each element.",
        "True (there is no counterexample in an empty iterable).",
        "No, but it can contain expressions like comprehensions."
      ],
      "correct": 1,
      "why": "The length of each element."
    },
    {
      "q": "Predict the output of the second worked example in lesson 42: Any and All.",
      "a": [
        "{'Kai': 3, 'Mia': 3}",
        "True ↵ True",
        "['a', 'cc', 'bbb']",
        "['Apple', 'banana', 'pear']"
      ],
      "correct": 1,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What is all([])?",
      "a": [
        "A colon.",
        "No, but it can contain expressions like comprehensions.",
        "The length of each element.",
        "True (there is no counterexample in an empty iterable)."
      ],
      "correct": 3,
      "why": "True (there is no counterexample in an empty iterable)."
    },
    {
      "q": "Predict the output of the second worked example in lesson 43: Lambda Functions.",
      "a": [
        "True ↵ True",
        "['Apple', 'banana', 'pear']",
        "['a', 'cc', 'bbb']",
        "{'Kai': 3, 'Mia': 3}"
      ],
      "correct": 2,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "Can lambda contain a for loop statement?",
      "a": [
        "A colon.",
        "No, but it can contain expressions like comprehensions.",
        "The length of each element.",
        "True (there is no counterexample in an empty iterable)."
      ],
      "correct": 1,
      "why": "No, but it can contain expressions like comprehensions."
    },
    {
      "q": "Predict the output of the second worked example in lesson 44: Dictionary Comprehension.",
      "a": [
        "['Apple', 'banana', 'pear']",
        "{'Kai': 3, 'Mia': 3}",
        "True ↵ True",
        "['a', 'cc', 'bbb']"
      ],
      "correct": 1,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "Which character separates key and value in a dict comprehension?",
      "a": [
        "The length of each element.",
        "A colon.",
        "True (there is no counterexample in an empty iterable).",
        "No, but it can contain expressions like comprehensions."
      ],
      "correct": 1,
      "why": "A colon."
    }
  ],
  [
    {
      "q": "Predict the output of the second worked example in lesson 45: Regular Expressions.",
      "a": [
        "30",
        "5",
        "['AB12', 'EF56']",
        "one ↵ one ↵ two"
      ],
      "correct": 2,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What does {2} mean in a regex?",
      "a": [
        "As part of constructing a new instance.",
        "It moves the current position back to the beginning.",
        "Exactly two repetitions of the preceding pattern.",
        "Without ordering, comparing the middle gives no reason to discard a half."
      ],
      "correct": 2,
      "why": "Exactly two repetitions of the preceding pattern."
    },
    {
      "q": "Predict the output of the second worked example in lesson 46: Object Initialization.",
      "a": [
        "['AB12', 'EF56']",
        "one ↵ one ↵ two",
        "5",
        "30"
      ],
      "correct": 2,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "When does __init__ run?",
      "a": [
        "Exactly two repetitions of the preceding pattern.",
        "It moves the current position back to the beginning.",
        "As part of constructing a new instance.",
        "Without ordering, comparing the middle gives no reason to discard a half."
      ],
      "correct": 2,
      "why": "As part of constructing a new instance."
    },
    {
      "q": "Predict the output of the second worked example in lesson 47: Files with StringIO.",
      "a": [
        "5",
        "30",
        "one ↵ one ↵ two",
        "['AB12', 'EF56']"
      ],
      "correct": 2,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "Why might seek(0) be needed?",
      "a": [
        "As part of constructing a new instance.",
        "It moves the current position back to the beginning.",
        "Without ordering, comparing the middle gives no reason to discard a half.",
        "Exactly two repetitions of the preceding pattern."
      ],
      "correct": 1,
      "why": "It moves the current position back to the beginning."
    },
    {
      "q": "Predict the output of the second worked example in lesson 48: Binary Search Idea.",
      "a": [
        "one ↵ one ↵ two",
        "['AB12', 'EF56']",
        "30",
        "5"
      ],
      "correct": 2,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "Why must the data be sorted first?",
      "a": [
        "Exactly two repetitions of the preceding pattern.",
        "Without ordering, comparing the middle gives no reason to discard a half.",
        "It moves the current position back to the beginning.",
        "As part of constructing a new instance."
      ],
      "correct": 1,
      "why": "Without ordering, comparing the middle gives no reason to discard a half."
    }
  ],
  [
    {
      "q": "Predict the output of the second worked example in lesson 49: Enumerate.",
      "a": [
        "12.35 ↵ 12.35",
        "1 [2, 3] 4",
        "10 X ↵ 11 Y",
        "[(1, 'a'), (2, 'b')]"
      ],
      "correct": 2,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What is the first number from enumerate(items, 5)?",
      "a": [
        "5.",
        "Swaps the values.",
        "No; use formatting when fixed digits are needed.",
        "Two."
      ],
      "correct": 0,
      "why": "5."
    },
    {
      "q": "Predict the output of the second worked example in lesson 50: Zip Two Lists.",
      "a": [
        "10 X ↵ 11 Y",
        "12.35 ↵ 12.35",
        "1 [2, 3] 4",
        "[(1, 'a'), (2, 'b')]"
      ],
      "correct": 3,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "How many pairs does zip of lengths 3 and 2 produce?",
      "a": [
        "5.",
        "Two.",
        "Swaps the values.",
        "No; use formatting when fixed digits are needed."
      ],
      "correct": 1,
      "why": "Two."
    },
    {
      "q": "Predict the output of the second worked example in lesson 51: Unpacking Values.",
      "a": [
        "[(1, 'a'), (2, 'b')]",
        "10 X ↵ 11 Y",
        "1 [2, 3] 4",
        "12.35 ↵ 12.35"
      ],
      "correct": 2,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What does a, b = b, a do?",
      "a": [
        "Two.",
        "Swaps the values.",
        "No; use formatting when fixed digits are needed.",
        "5."
      ],
      "correct": 1,
      "why": "Swaps the values."
    },
    {
      "q": "Predict the output of the second worked example in lesson 52: Rounding Numbers.",
      "a": [
        "1 [2, 3] 4",
        "10 X ↵ 11 Y",
        "12.35 ↵ 12.35",
        "[(1, 'a'), (2, 'b')]"
      ],
      "correct": 2,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "Does round(x,2) guarantee two printed decimal digits?",
      "a": [
        "Two.",
        "No; use formatting when fixed digits are needed.",
        "Swaps the values.",
        "5."
      ],
      "correct": 1,
      "why": "No; use formatting when fixed digits are needed."
    }
  ],
  [
    {
      "q": "Predict the output of the second worked example in lesson 53: Minimum & Maximum.",
      "a": [
        "[('red', 2)]",
        "No output",
        "4 12",
        "2"
      ],
      "correct": 2,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What does max([3, 9, 2]) return?",
      "a": [
        "A Python list.",
        "0.",
        "9.",
        "No, strings are immutable."
      ],
      "correct": 2,
      "why": "9."
    },
    {
      "q": "Predict the output of the second worked example in lesson 54: Count Text Matches.",
      "a": [
        "4 12",
        "2",
        "No output",
        "[('red', 2)]"
      ],
      "correct": 1,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "Does count() change the original string?",
      "a": [
        "9.",
        "0.",
        "A Python list.",
        "No, strings are immutable."
      ],
      "correct": 3,
      "why": "No, strings are immutable."
    },
    {
      "q": "Predict the output of the second worked example in lesson 55: Collections Counter.",
      "a": [
        "4 12",
        "[('red', 2)]",
        "No output",
        "2"
      ],
      "correct": 1,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What value does Counter()[\"missing\"] return?",
      "a": [
        "No, strings are immutable.",
        "A Python list.",
        "0.",
        "9."
      ],
      "correct": 2,
      "why": "0."
    },
    {
      "q": "Predict the output of the second worked example in lesson 56: Read JSON.",
      "a": [
        "No output",
        "4 12",
        "2",
        "[('red', 2)]"
      ],
      "correct": 2,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What does loads return for a JSON array?",
      "a": [
        "0.",
        "No, strings are immutable.",
        "9.",
        "A Python list."
      ],
      "correct": 3,
      "why": "A Python list."
    }
  ],
  [
    {
      "q": "Predict the output of the second worked example in lesson 57: Write JSON.",
      "a": [
        "[('A', 'B'), ('A', 'C'), ('B', 'C')]",
        "{\"dark\": true, \"volume\": 3}",
        "0b10010 ↵ 18",
        "2026-01-08"
      ],
      "correct": 1,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What JSON word represents Python True?",
      "a": [
        "0.",
        "Six.",
        "true.",
        "16."
      ],
      "correct": 2,
      "why": "true."
    },
    {
      "q": "Predict the output of the second worked example in lesson 58: Dates in Python.",
      "a": [
        "2026-01-08",
        "[('A', 'B'), ('A', 'C'), ('B', 'C')]",
        "0b10010 ↵ 18",
        "{\"dark\": true, \"volume\": 3}"
      ],
      "correct": 0,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What does weekday() return for a Monday?",
      "a": [
        "0.",
        "true.",
        "16.",
        "Six."
      ],
      "correct": 0,
      "why": "0."
    },
    {
      "q": "Predict the output of the second worked example in lesson 59: Combinations.",
      "a": [
        "{\"dark\": true, \"volume\": 3}",
        "0b10010 ↵ 18",
        "[('A', 'B'), ('A', 'C'), ('B', 'C')]",
        "2026-01-08"
      ],
      "correct": 2,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "How many pairs can be formed from four different people?",
      "a": [
        "Six.",
        "true.",
        "0.",
        "16."
      ],
      "correct": 0,
      "why": "Six."
    },
    {
      "q": "Predict the output of the second worked example in lesson 60: Binary Conversion.",
      "a": [
        "{\"dark\": true, \"volume\": 3}",
        "0b10010 ↵ 18",
        "[('A', 'B'), ('A', 'C'), ('B', 'C')]",
        "2026-01-08"
      ],
      "correct": 1,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What is the value of binary 10000?",
      "a": [
        "Six.",
        "true.",
        "16.",
        "0."
      ],
      "correct": 2,
      "why": "16."
    }
  ],
  [
    {
      "q": "Predict the output of the second worked example in lesson 61: Hexadecimal Conversion.",
      "a": [
        "code.py .py",
        "[0, 3, 6, 9]",
        "zero divisor",
        "42 ↵ 0x2a"
      ],
      "correct": 3,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What is hexadecimal F in denary?",
      "a": [
        "When an argument has a valid type but unacceptable value.",
        "15.",
        "It filters which source items are included.",
        ".pdf."
      ],
      "correct": 1,
      "why": "15."
    },
    {
      "q": "Predict the output of the second worked example in lesson 62: Filtering Comprehensions.",
      "a": [
        "zero divisor",
        "[0, 3, 6, 9]",
        "code.py .py",
        "42 ↵ 0x2a"
      ],
      "correct": 1,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What is the purpose of the final if condition?",
      "a": [
        ".pdf.",
        "It filters which source items are included.",
        "When an argument has a valid type but unacceptable value.",
        "15."
      ],
      "correct": 1,
      "why": "It filters which source items are included."
    },
    {
      "q": "Predict the output of the second worked example in lesson 63: Pathlib Basics.",
      "a": [
        "[0, 3, 6, 9]",
        "zero divisor",
        "42 ↵ 0x2a",
        "code.py .py"
      ],
      "correct": 3,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "What does .suffix return for \"report.pdf\"?",
      "a": [
        "When an argument has a valid type but unacceptable value.",
        "15.",
        ".pdf.",
        "It filters which source items are included."
      ],
      "correct": 2,
      "why": ".pdf."
    },
    {
      "q": "Predict the output of the second worked example in lesson 64: Raise Exceptions.",
      "a": [
        "42 ↵ 0x2a",
        "code.py .py",
        "zero divisor",
        "[0, 3, 6, 9]"
      ],
      "correct": 2,
      "why": "Trace the actual variable values and output in the worked example."
    },
    {
      "q": "When would you raise ValueError?",
      "a": [
        "It filters which source items are included.",
        "When an argument has a valid type but unacceptable value.",
        "15.",
        ".pdf."
      ],
      "correct": 1,
      "why": "When an argument has a valid type but unacceptable value."
    }
  ]
];
