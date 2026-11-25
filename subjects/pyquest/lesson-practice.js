/* More hands-on coding: two additional self-contained challenges per lesson. */
export const EXTRA_EXERCISES = {
  "hello": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using hello, python!. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "Hello coder\n5",
      "hint": "print() sends output to the console; it does not ask for input or save a value. Strings use quotation marks, while numbers can be printed directly. You can pass several values separated by commas, and Python inserts spaces between them."
    },
    {
      "title": "Independent challenge",
      "prompt": "Change the output to show your name and the result of 6 * 7 on separate lines. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "Coder\n42",
      "hint": "Confusing print(\"3 + 4\") with print(3 + 4): the first displays text while the second calculates 7."
    }
  ],
  "variables": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using variables. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "Score: 10",
      "hint": "Assignment stores a reference under a name. Python executes statements from top to bottom, so reassignment replaces the value you will use next. Meaningful names improve readability, and strings and numbers are different types."
    },
    {
      "title": "Independent challenge",
      "prompt": "Track a points total starting at 10. Add 5, subtract 3 and print the result. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "12",
      "hint": "Writing score + 2 without reassigning it; that expression does not update score."
    }
  ],
  "maths": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using python maths. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "2 17",
      "hint": "Python follows order of operations: powers first, then multiplication and division, then addition and subtraction. / creates division results; // performs floor division; % gives the remainder. Parentheses make intentions clear."
    },
    {
      "title": "Independent challenge",
      "prompt": "Turn 250 seconds into full minutes and remaining seconds with // and %. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "4 10",
      "hint": "Treating ^ as exponentiation. In Python use **; ^ has a different bitwise meaning."
    }
  ],
  "conditions": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using if & else. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "warm",
      "hint": "An if/elif/else chain tests conditions in order and runs the first matching branch. Comparisons use ==, !=, <, <=, > and >=. Indentation tells Python which lines belong to a branch."
    },
    {
      "title": "Independent challenge",
      "prompt": "Write a grade checker with A for 80+, B for 60+, otherwise C. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "B",
      "hint": "Using = instead of == inside a comparison, or forgetting the colon or indentation."
    }
  ],
  "loops": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using loops. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "5\n3\n1",
      "hint": "A for loop takes each value from an iterable in turn. range(start, stop, step) includes start but excludes stop; an optional step can count backwards. The body runs once for each value."
    },
    {
      "title": "Independent challenge",
      "prompt": "Print every even number from 2 to 12 using range, without writing six separate print calls. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "2\n4\n6\n8\n10\n12",
      "hint": "Expecting range(1, 5) to include 5 or forgetting to indent the body."
    }
  ],
  "lists": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using lists. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "9 3",
      "hint": "Lists are mutable ordered collections. Access an element with a zero-based index, use append() to add a value, and len() to count elements. A negative index counts backward from the end."
    },
    {
      "title": "Independent challenge",
      "prompt": "Build a shopping list, append an item, replace the first item and print the last. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "apples",
      "hint": "Using scores[3] when a three-item list only has indexes 0, 1 and 2."
    }
  ],
  "functions": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using functions. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "106.0",
      "hint": "A function groups reusable logic, accepts inputs through parameters and optionally returns a value. print() displays information; return provides a result that callers can store and reuse. Code after return in that branch does not run."
    },
    {
      "title": "Independent challenge",
      "prompt": "Define area_rectangle(w, h) returning w*h; call it twice with different sizes. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "15\n14",
      "hint": "Using print() inside a function when another part of the program needs the returned result."
    }
  ],
  "dictionary": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using dictionaries. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "0\n5",
      "hint": "Dictionaries map unique keys to values. You can retrieve data with square brackets, use get() to avoid an error for missing keys, and update a value through assignment. Dictionaries are useful for structured records and counts."
    },
    {
      "title": "Independent challenge",
      "prompt": "Create a dictionary of subject scores; update one subject and print an average. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "85",
      "hint": "Trying to use a numeric position instead of the key or reading a missing key with brackets."
    }
  ],
  "strings": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using string tricks. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "python",
      "hint": "Strings are immutable sequences of characters. Indexing and slicing select characters, while methods such as strip(), lower(), upper() and replace() create new strings. len() counts characters, including spaces."
    },
    {
      "title": "Independent challenge",
      "prompt": "Take \"  hello WORLD  \", trim the spaces and print it in title case. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "Hello World",
      "hint": "Thinking text.upper() changes text automatically; save or use the returned string."
    }
  ],
  "project": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using mini project. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "League points: 14",
      "hint": "A mini program needs a clear input, a calculation or decision, and an output. Split a problem into smaller steps, choose good variable names, then test normal and edge cases. Debug one stage at a time."
    },
    {
      "title": "Independent challenge",
      "prompt": "Create a tiny quiz score calculator with correct and incorrect answers, then report a percentage. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "70",
      "hint": "Trying to combine input, conditions and output in one complicated statement before testing each piece."
    }
  ],
  "while": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using while loops. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "1\n2\n4\n8",
      "hint": "A while loop repeats while its condition remains true. It is useful when you do not know the number of iterations in advance. Track changing state and decide what ends the loop."
    },
    {
      "title": "Independent challenge",
      "prompt": "Double a number starting at 1 until it reaches at least 100 and print the result. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "128",
      "hint": "Forgetting to change the variable used in the condition, causing an endless loop."
    }
  ],
  "booleans": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using true or false. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "True",
      "hint": "Boolean expressions evaluate to True or False. and requires both parts; or needs at least one; not reverses a result. Use parentheses to make more complex conditions easy to read."
    },
    {
      "title": "Independent challenge",
      "prompt": "Create a condition that allows access only when a student has a pass and has completed the safety check. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "True",
      "hint": "Writing and when you really mean or, or comparing strings and numbers without conversion."
    }
  ],
  "tuples": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using tuples. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "11",
      "hint": "Tuples are ordered and usually used for groups of related, fixed values. They support indexes, iteration and unpacking but not element reassignment. A single-item tuple needs a trailing comma."
    },
    {
      "title": "Independent challenge",
      "prompt": "Store three RGB values in a tuple and unpack them into red, green and blue. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "120 60 240",
      "hint": "Writing (5) and expecting a tuple; the one-item tuple is (5,)."
    }
  ],
  "sets": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using sets. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "['A', 'B']",
      "hint": "Sets store unique hashable items and make membership tests convenient. Their order should not be relied on. Convert a list to a set to remove duplicates; use sorted() when a predictable display order matters."
    },
    {
      "title": "Independent challenge",
      "prompt": "Find how many different letters appear in the word \"banana\". Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "3",
      "hint": "Assuming elements always print in the order they were added."
    }
  ],
  "slicing": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using slicing. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "bd\nfedcba",
      "hint": "For sequence[start:stop:step], start is included and stop is excluded. Missing values use the sequence boundaries. Negative indexes count from the end, and a negative step reverses direction."
    },
    {
      "title": "Independent challenge",
      "prompt": "Use slicing to extract the middle three characters of \"ABCDEFG\" and reverse \"PYTHON\". Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "CDE\nNOHTYP",
      "hint": "Thinking the stop position is included or confusing a slice with a single index."
    }
  ],
  "fstrings": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using f-strings. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "Mia: 85%",
      "hint": "An f-string evaluates expressions inside braces and inserts their results into text. You can format numbers, for example :.2f for two decimal places. Keep quotes balanced and choose readable expressions."
    },
    {
      "title": "Independent challenge",
      "prompt": "Print a receipt with a product, quantity and price formatted to two decimal places. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "Book: 2 x $3.50",
      "hint": "Forgetting the f prefix and printing braces literally."
    }
  ],
  "nested-loops": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using nested loops. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "0 0\n0 1\n0 2\n1 0\n1 1\n1 2",
      "hint": "For each outer-loop iteration, the inner loop runs all of its steps. The total number of iterations often multiplies (rows × columns). A nested loop is useful for grids and comparing pairs."
    },
    {
      "title": "Independent challenge",
      "prompt": "Print a 4 × 3 rectangle of # characters without writing 12 separate prints. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "###\n###\n###\n###",
      "hint": "Putting a line intended for the inner loop at the wrong indentation level."
    }
  ],
  "sorting": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using sorting. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "[9, 1, 4]\n[9, 4, 1]",
      "hint": "sorted(sequence) returns a new ordered list; list.sort() changes the original list in place. Both can take reverse=True or a key function. Know whether you need the old ordering afterwards."
    },
    {
      "title": "Independent challenge",
      "prompt": "Sort some names alphabetically, then sort the same names in reverse. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "['Amy', 'Kai', 'Zoe']\n['Zoe', 'Kai', 'Amy']",
      "hint": "Writing values = values.sort(); sort() returns None."
    }
  ],
  "comprehensions": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using list comprehensions. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "[4, 16]",
      "hint": "[expression for item in iterable if condition] builds a new list. It combines a loop, optional filter and transformation. Write the expanded loop first if the comprehension becomes hard to read."
    },
    {
      "title": "Independent challenge",
      "prompt": "Build a list of cubes of the odd numbers from 1 to 9. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "[1, 27, 125, 343, 729]",
      "hint": "Confusing the filter condition with the transformation expression."
    }
  ],
  "exceptions": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using handle errors. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "0",
      "hint": "Try blocks run code that may fail; an except clause catches a specific error so you can recover. Catch the narrowest relevant exception. A finally block is useful for cleanup even when an error occurs."
    },
    {
      "title": "Independent challenge",
      "prompt": "Ask a user to supply a number and show a clear message if conversion fails (test with preset strings first). Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "9\nInvalid",
      "hint": "Using bare except for every error, which can hide programming mistakes."
    }
  ],
  "modules": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using modules. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "6",
      "hint": "A module contains reusable Python functions and values. import math lets you use math.sqrt; from math import sqrt imports that name directly. Using standard libraries saves writing common algorithms yourself."
    },
    {
      "title": "Independent challenge",
      "prompt": "Use math.pi to calculate the area of a circle with radius 3. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "28.27",
      "hint": "Naming your own file math.py and unintentionally hiding the standard library math module."
    }
  ],
  "randomness": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using random numbers. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "red",
      "hint": "Pseudo-random values are produced by an algorithm; seeding lets you reproduce a sequence for testing. randint(a,b) includes both endpoints, whereas choice() selects from a sequence."
    },
    {
      "title": "Independent challenge",
      "prompt": "Make a repeatable simulation of ten coin flips and count heads. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "7",
      "hint": "Assuming a seeded sequence is secure for passwords or security tokens."
    }
  ],
  "enumerate": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using enumerate. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "1 A\n2 B",
      "hint": "enumerate(iterable, start=0) produces index-value pairs. It removes the need to maintain a separate counter, reducing off-by-one mistakes. The optional start helps with human-friendly numbering."
    },
    {
      "title": "Independent challenge",
      "prompt": "Display a numbered to-do list starting at 1. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "1 code\n2 test\n3 save",
      "hint": "Using for item in names then assuming item is its numeric position."
    }
  ],
  "zip": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using zip lists. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "[('Kai', 8), ('Jo', 9)]",
      "hint": "zip() pairs matching positions from multiple iterables and stops when the shortest runs out. Use it to process corresponding data, but make sure lists align correctly."
    },
    {
      "title": "Independent challenge",
      "prompt": "Pair three products with three prices and print a formatted receipt. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "pen 2\nbook 7\nbag 12",
      "hint": "Expecting zip to keep extra items from a longer list automatically."
    }
  ],
  "sets-advanced": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using set operations. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "[1, 2]\n[1, 2, 3, 4]",
      "hint": "Union combines all distinct values; intersection keeps shared values; difference keeps values from the first set only. Use union, intersection and difference operations or the named methods."
    },
    {
      "title": "Independent challenge",
      "prompt": "Find students who joined both clubs and those who joined only the first club. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "['B']\n['A', 'C']",
      "hint": "Confusing difference (a-b) with symmetric difference (a^b)."
    }
  ],
  "recursion": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using recursion. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "10",
      "hint": "Recursive functions need a base case that stops the process and a recursive step that makes the remaining problem smaller. Each call has its own local values. Without progress towards the base case, recursion fails."
    },
    {
      "title": "Independent challenge",
      "prompt": "Write a recursive function that sums the first n nonnegative integers. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "15",
      "hint": "Writing a recursive call without returning its result or without a base case."
    }
  ],
  "classes": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using classes & objects. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "1",
      "hint": "A class defines the structure and methods of objects; each instance has its own data. __init__ sets initial state and self refers to that specific object. Instances can call methods to update their state."
    },
    {
      "title": "Independent challenge",
      "prompt": "Create a Student class holding a name and a method that introduces them. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "Hi, I am Mia",
      "hint": "Forgetting self in a method or using a local variable instead of self.value."
    }
  ],
  "inheritance": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using inheritance. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "flying",
      "hint": "A subclass reuses behavior from a parent class and may add or override methods. super() calls parent methods when you want to extend rather than replace them. Prefer inheritance for genuine is-a relationships."
    },
    {
      "title": "Independent challenge",
      "prompt": "Build Shape and Rectangle classes where Rectangle has an area() method. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "20",
      "hint": "Assuming a child method and parent method both run automatically after an override."
    }
  ],
  "lambda": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using lambda functions. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "[('B', 2), ('A', 4)]",
      "hint": "lambda parameters: expression makes a short function. It is commonly used as the key for sorted(), map() or filter(). For multiple steps or complicated logic, define a normal function."
    },
    {
      "title": "Independent challenge",
      "prompt": "Sort a list of (name, score) pairs from highest to lowest score. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "[('Ben', 9), ('Cara', 6), ('Alex', 4)]",
      "hint": "Trying to put assignments, loops or many statements inside one lambda expression."
    }
  ],
  "generators": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using generators. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "[0, 1, 4, 9]",
      "hint": "A generator produces items lazily when iteration asks for them, rather than building the full list immediately. yield pauses execution and resumes at the next request. This can help memory usage for long sequences."
    },
    {
      "title": "Independent challenge",
      "prompt": "Create a generator yielding even numbers below 10, then iterate through them. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "[0, 2, 4, 6, 8]",
      "hint": "Trying to index a generator as if it were a list, or forgetting it can be exhausted."
    }
  ],
  "regex": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using pattern matching. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "['ID-42', 'ID-7']",
      "hint": "Regular expressions describe patterns. \\d matches a digit, + means one or more, ^ anchors the start and $ anchors the end. Use raw strings (r\"...\") to make backslashes easier to read."
    },
    {
      "title": "Independent challenge",
      "prompt": "Extract every three-digit number from a string using a suitable pattern. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "['123', '999']",
      "hint": "Assuming . matches only a literal full stop; it normally matches many characters."
    }
  ],
  "json": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using json data. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "True",
      "hint": "JSON represents objects, arrays, strings, numbers, booleans and null. json.loads converts JSON text into Python values; json.dumps converts Python values back to text. JSON keys in objects are strings."
    },
    {
      "title": "Independent challenge",
      "prompt": "Read a JSON string holding a game score and print the score. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "12",
      "hint": "Using single quotes for keys inside JSON text; JSON requires double-quoted string keys."
    }
  ],
  "testing": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using testing with assert. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "OK",
      "hint": "A good test checks expected behavior on ordinary inputs and boundary cases. assert raises AssertionError when a condition is false. Tests should check a function's result, not just whether code runs."
    },
    {
      "title": "Independent challenge",
      "prompt": "Write three asserts for a function that returns the larger of two numbers. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "3 tests passed",
      "hint": "Testing only one successful input while missing zero, negative values and invalid input."
    }
  ],
  "csv": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using csv data. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "['Kai, Jr', '9']",
      "hint": "CSV stores rows as text fields. The csv module correctly handles quotes and embedded separators; manual splitting on commas may fail. StringIO lets you practise the file interface without reading files."
    },
    {
      "title": "Independent challenge",
      "prompt": "Read three CSV rows and calculate the average score in the final column. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "10",
      "hint": "Parsing quoted fields using text.split(\",\") instead of csv.reader."
    }
  ],
  "binary-search": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using binary search. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "3",
      "hint": "Binary search requires sorted data. Compare the target with the middle value, then discard half of the remaining range each time. The time complexity is O(log n) for a list."
    },
    {
      "title": "Independent challenge",
      "prompt": "Write a function returning -1 when the target is absent from a sorted list. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "-1",
      "hint": "Applying binary search to unsorted data or updating left/right without excluding mid."
    }
  ],
  "type-hints": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using type hints. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "10",
      "hint": "Annotations explain expected parameter and return types but do not normally enforce them at runtime. They help readers, editors and static type checkers catch mistakes earlier."
    },
    {
      "title": "Independent challenge",
      "prompt": "Annotate a function that takes a string and returns its length as an integer. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "6",
      "hint": "Believing a type hint automatically converts strings to integers."
    }
  ],
  "bitwise": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using bitwise operators. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "0b1000\n0b110",
      "hint": "Bitwise operators work on binary digits inside integers. AND keeps bits set in both; OR keeps bits set in either; XOR keeps bits set in exactly one. Use bin() to inspect results."
    },
    {
      "title": "Independent challenge",
      "prompt": "Calculate the bitwise OR of 0b1010 and 0b0101 and write the result in binary. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "0b1111",
      "hint": "Confusing bitwise & with boolean and; they operate differently and have different precedence."
    }
  ],
  "binary-convert": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using binary conversion. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "0b1101\n13",
      "hint": "Binary is base 2, using place values 1, 2, 4, 8, 16 and so on. bin(n) returns a string prefixed with 0b; int(text, 2) converts binary text back to an integer."
    },
    {
      "title": "Independent challenge",
      "prompt": "Convert 29 to binary and verify by converting back. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "0b11101\n29",
      "hint": "Writing a binary-looking sequence without specifying base 2 when converting it."
    }
  ],
  "hex-convert": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using hexadecimal. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "0xff\n255",
      "hint": "Hexadecimal is base 16 with digits 0–9 and A–F. One hex digit represents four bits, making it compact for binary values. hex(n) gives text with a 0x prefix."
    },
    {
      "title": "Independent challenge",
      "prompt": "Convert 0b11110000 to hexadecimal and back. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "0xf0\n240",
      "hint": "Assuming hexadecimal 10 means ten in denary; it means sixteen."
    }
  ],
  "format-round": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using rounding and format. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "0.67\n0.67",
      "hint": "Rounding changes how numbers are displayed or approximated. round(x, digits) gives a rounded number, while f\"{x:.2f}\" formats text with exactly two decimal places. Floating-point values can be approximate."
    },
    {
      "title": "Independent challenge",
      "prompt": "Format a computed percentage to one decimal place. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "43.8%",
      "hint": "Using rounded intermediate values for financial totals and expecting exact results."
    }
  ],
  "sorting-key": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using custom sorting. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "['Apple', 'banana', 'pear']",
      "hint": "The key function is called for each element and decides which value to compare. You can sort text without case differences or sort records by a field."
    },
    {
      "title": "Independent challenge",
      "prompt": "Sort words by their lengths, shortest first. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "['cat', 'dog', 'banana', 'elephant']",
      "hint": "Trying to call the key function immediately, e.g. key=str.lower() instead of key=str.lower."
    }
  ],
  "any-all": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using any and all. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "True\nTrue",
      "hint": "any(iterable) checks whether at least one value is truthy; all(iterable) checks whether every value is truthy. These are helpful when checking a list of conditions."
    },
    {
      "title": "Independent challenge",
      "prompt": "Check if any test score is below 40 and whether all scores are nonnegative. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "True\nTrue",
      "hint": "Mixing up any and all, especially when checking whether everyone passed."
    }
  ],
  "lambda-func": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using lambda functions. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "['a', 'cc', 'bbb']",
      "hint": "A lambda can be assigned to a variable, but its most useful role is often passing a short behavior into another function. A def is clearer when there are several steps."
    },
    {
      "title": "Independent challenge",
      "prompt": "Use a lambda to sort pairs by their second number. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "[('B', 3), ('C', 5), ('A', 6)]",
      "hint": "Writing lambda as if it were a multi-statement block."
    }
  ],
  "dict-comprehension": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using dictionary comprehension. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "{'Kai': 3, 'Mia': 3}",
      "hint": "{key_expr: value_expr for item in iterable if condition} builds a dictionary. It is useful for converting lists to lookups or counting simple derived values."
    },
    {
      "title": "Independent challenge",
      "prompt": "Create a dictionary mapping numbers 1–5 to their squares. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "{1: 1, 2: 4, 3: 9, 4: 16, 5: 25}",
      "hint": "Forgetting the colon between key and value expressions."
    }
  ],
  "regex-intro": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using regular expressions. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "['AB12', 'EF56']",
      "hint": "Search patterns can match text without knowing the exact characters. re.search finds one match; re.findall returns matching strings; anchors and character classes make rules more specific."
    },
    {
      "title": "Independent challenge",
      "prompt": "Find all words ending in \"ing\" in a sentence. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "['coding', 'reading']",
      "hint": "Using \\d when you mean a literal letter d, or forgetting raw string notation."
    }
  ],
  "classes-init": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using object initialization. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "5",
      "hint": "__init__ runs when an instance is created. Each object uses self to store its own attributes. Default parameters can provide initial values when arguments are omitted."
    },
    {
      "title": "Independent challenge",
      "prompt": "Make a Book class with title and pages attributes, then create two books. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "200\nMaths",
      "hint": "Forgetting to assign self.coins and creating only a local variable coins."
    }
  ],
  "file-like": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using files with stringio. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "one\none\ntwo",
      "hint": "StringIO offers a file-style interface over a string. readline() reads one line, read() consumes the remaining content and seek(0) rewinds. Use it to practise safe file processing."
    },
    {
      "title": "Independent challenge",
      "prompt": "Read all lines from StringIO and count how many there are. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "3",
      "hint": "Assuming read() starts from the beginning after you already read a line."
    }
  ],
  "binary-search-idea": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using binary search idea. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "30",
      "hint": "Binary search works by maintaining a lower and upper boundary in sorted data. Compare the middle item with the target. Move only the relevant boundary so the search space shrinks."
    },
    {
      "title": "Independent challenge",
      "prompt": "Trace the middle values when searching for 40 in [10,20,30,40,50]. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "30\n40",
      "hint": "Using a middle index based on the full list after changing the search boundaries."
    }
  ],
  "enumerate-plus": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using enumerate. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "10 X\n11 Y",
      "hint": "Instead of manually adding 1 to a counter, enumerate() provides an index alongside each value. The start= argument changes only the labels, not list positions."
    },
    {
      "title": "Independent challenge",
      "prompt": "Display a scoreboard numbered 1, 2, 3 with enumerate(). Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "1 Mia\n2 Jo\n3 Kai",
      "hint": "Assuming enumerate changes the underlying list or its indexes."
    }
  ],
  "zip-plus": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using zip two lists. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "[(1, 'a'), (2, 'b')]",
      "hint": "zip() lazily pairs items from each iterable. Convert it to list if you need all pairs at once; otherwise loop directly. Unequal lengths normally stop at the shortest."
    },
    {
      "title": "Independent challenge",
      "prompt": "Create a dictionary from names and marks with dict(zip(names, marks)). Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "{'Mia': 9, 'Kai': 7}",
      "hint": "Expecting an unpaired third item to be preserved."
    }
  ],
  "unpack-plus": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using unpacking values. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "1 [2, 3] 4",
      "hint": "Unpacking assigns values to several names at once. The number of variables normally must match the number of items; *rest can collect leftovers."
    },
    {
      "title": "Independent challenge",
      "prompt": "Swap two variables without creating a temporary one. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "9 5",
      "hint": "Trying to unpack three values into two variables without a starred target."
    }
  ],
  "round-plus": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using rounding numbers. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "12.35\n12.35",
      "hint": "The second argument of round() is the number of decimal places. Rounding floating-point values can have surprising results because not all decimals are exact in binary."
    },
    {
      "title": "Independent challenge",
      "prompt": "Compare round(1.234, 1) with formatting it to one decimal place. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "1.2\n1.2",
      "hint": "Assuming round() always behaves like decimal rounding learned in primary school."
    }
  ],
  "min-max-plus": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using minimum & maximum. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "4 12",
      "hint": "min() and max() find the lowest and highest values in an iterable. They also accept a key function for more complex items; calling them on an empty sequence raises an error without a default."
    },
    {
      "title": "Independent challenge",
      "prompt": "Find the name of the longest word in a list using max(..., key=len). Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "elephant",
      "hint": "Calling min([]) without handling the empty-list case."
    }
  ],
  "string-count-plus": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using count text matches. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "2",
      "hint": "count(substring) returns the number of nonoverlapping matches inside a string. It is case-sensitive, so lower() helps with case-insensitive counting."
    },
    {
      "title": "Independent challenge",
      "prompt": "Count how often \"py\" occurs in text without caring about letter case. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "4",
      "hint": "Assuming count(\"ana\") counts overlapping appearances separately."
    }
  ],
  "counter-plus": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using collections counter. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "[('red', 2)]",
      "hint": "collections.Counter is a dictionary-like tool that counts hashable items. It supports most_common() for finding frequent entries and treats missing keys as zero."
    },
    {
      "title": "Independent challenge",
      "prompt": "Find the two most common letters in a short word. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "[('a', 3), ('n', 2)]",
      "hint": "Assuming Counter preserves the order of counts when several items tie."
    }
  ],
  "json-load-plus": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using read json. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "2",
      "hint": "json.loads takes JSON text and builds Python dictionaries, lists and values. Invalid JSON raises a JSONDecodeError; make sure quoted keys use double quotes in JSON."
    },
    {
      "title": "Independent challenge",
      "prompt": "Parse a JSON list of scores and find its maximum. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "9",
      "hint": "Confusing loads (string input) with load (file input)."
    }
  ],
  "json-write-plus": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using write json. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "{\"dark\": true, \"volume\": 3}",
      "hint": "json.dumps serializes Python values to JSON text. indent makes it readable; sort_keys orders keys, which can make tests and comparisons predictable."
    },
    {
      "title": "Independent challenge",
      "prompt": "Serialize a dictionary with two fields and an indent of 2. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "{\n  \"level\": 2,\n  \"ready\": true\n}",
      "hint": "Expecting dumps() to return a dictionary instead of a string."
    }
  ],
  "date-plus": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using dates in python. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "2026-01-08",
      "hint": "datetime.date represents a calendar date independently of time. date arithmetic uses timedelta for day changes. weekday() uses 0 for Monday and 6 for Sunday."
    },
    {
      "title": "Independent challenge",
      "prompt": "Compute the date 30 days after a chosen starting date. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "2026-12-17",
      "hint": "Treating weekday() as Sunday=0 or trying to add a plain integer to a date."
    }
  ],
  "combinations-plus": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using combinations. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "[('A', 'B'), ('A', 'C'), ('B', 'C')]",
      "hint": "Combinations choose items without considering order; (A,B) and (B,A) count as the same group. itertools.combinations(iterable,r) generates groups of exactly r items."
    },
    {
      "title": "Independent challenge",
      "prompt": "List all teams of two from four names and count them. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "6",
      "hint": "Mistaking combinations for permutations, where order matters."
    }
  ],
  "binary-convert-plus": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using binary conversion. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "0b10010\n18",
      "hint": "Binary place values double as you move left. bin() adds a 0b prefix to show a base-two representation; int(text,2) reverses the process."
    },
    {
      "title": "Independent challenge",
      "prompt": "Convert 42 to binary, then check that the conversion back gives 42. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "0b101010\n42",
      "hint": "Reading 10010 as a base-ten number during conversion."
    }
  ],
  "hex-convert-plus": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using hexadecimal conversion. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "42\n0x2a",
      "hint": "Hex digits represent 16 possible values, and two hex digits represent one byte. int(hex_text,16) interprets a string as base 16, while hex(number) does the reverse."
    },
    {
      "title": "Independent challenge",
      "prompt": "Convert hexadecimal 3F to denary and binary. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "63\n0b111111",
      "hint": "Reading hex 2A as decimal 2+10 rather than 2×16+10."
    }
  ],
  "filter-comprehension-plus": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using filtering comprehensions. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "[0, 3, 6, 9]",
      "hint": "A filtered comprehension keeps only elements meeting a condition. Put the if after the for clause. Use a separate loop when the rule is complicated or needs multiple statements."
    },
    {
      "title": "Independent challenge",
      "prompt": "Make a list of the squares of numbers 1–20 that are multiples of 4. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "[16, 64, 144, 256, 400]",
      "hint": "Placing the condition before for when you intend a simple filter."
    }
  ],
  "pathlib-plus": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using pathlib basics. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "code.py .py",
      "hint": "PurePosixPath manipulates path strings without touching files. .name returns the last part, .suffix the final file extension, and .parent the directory path."
    },
    {
      "title": "Independent challenge",
      "prompt": "Extract the suffix and parent of \"projects/python/main.py\". Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": ".py\nprojects/python",
      "hint": "Thinking PurePosixPath can read files by itself; it only describes paths."
    }
  ],
  "exceptions-plus": [
    {
      "title": "Guided example",
      "prompt": "Recreate the second worked example using raise exceptions. Make your program display the exact output shown. Explain to yourself why each line is needed.",
      "starter": "# Study the second worked example on the left.\n# Recreate its logic below, then press Check answer.\n",
      "expected": "zero divisor",
      "hint": "Raising an exception tells the caller an operation is invalid. Choose a specific exception type, include a useful message, and let callers catch only errors they can handle."
    },
    {
      "title": "Independent challenge",
      "prompt": "Write a function rejecting negative ages with ValueError and test the catch. Your program should print the result shown below. Write your own code, not just a print statement.",
      "starter": "# Independent practice: write your complete solution here.\n",
      "expected": "Invalid age",
      "hint": "Silently returning an unrelated value instead of explaining invalid input, or catching every error."
    }
  ]
};
