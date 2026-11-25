// Original practice content inspired by the Cambridge 0478 2026–2028 topic structure.
export const IGCSE_TOPICS = [
  {
    "id": "1",
    "title": "Data representation",
    "subtitle": "Binary, hex, text, images and sound",
    "description": "Convert between denary, binary and hexadecimal; understand how data is stored.",
    "paper": 1,
    "questions": [
      {
        "question": "What is denary 13 in binary?",
        "answers": [
          "1101",
          "1011",
          "1110",
          "1001"
        ],
        "correct": 0,
        "hint": "Break 13 into 8 + 4 + 1.",
        "why": "Binary place values are 8, 4, 2, 1."
      },
      {
        "question": "How many bits are in one byte?",
        "answers": [
          "4",
          "8",
          "16",
          "32"
        ],
        "correct": 1,
        "hint": "Think of two hexadecimal digits.",
        "why": "A byte contains 8 bits."
      }
    ]
  },
  {
    "id": "2",
    "title": "Data transmission",
    "subtitle": "Packets, errors and encryption",
    "description": "Discover packets, serial/parallel transmission and error detection.",
    "paper": 1,
    "questions": [
      {
        "question": "What detects an odd number of bit errors?",
        "answers": [
          "Parity check",
          "Firewall",
          "Cache",
          "Compiler"
        ],
        "correct": 0,
        "hint": "Think about adding an extra bit.",
        "why": "Parity checks compare the number of 1 bits."
      },
      {
        "question": "What is packet switching?",
        "answers": [
          "Sending one continuous signal",
          "Dividing data into individually routed packets",
          "Encrypting all data",
          "Deleting unused bits"
        ],
        "correct": 1,
        "hint": "Large messages are divided into small units.",
        "why": "Packets can take different routes and be reassembled."
      }
    ]
  },
  {
    "id": "3",
    "title": "Hardware",
    "subtitle": "CPU, memory, storage and devices",
    "description": "Learn the fetch–decode–execute cycle and compare types of storage.",
    "paper": 1,
    "questions": [
      {
        "question": "Which CPU register stores the address of the next instruction?",
        "answers": [
          "MAR",
          "PC",
          "ACC",
          "MDR"
        ],
        "correct": 1,
        "hint": "Its name mentions a counter.",
        "why": "The program counter tracks the next instruction address."
      },
      {
        "question": "Which is volatile memory?",
        "answers": [
          "ROM",
          "SSD",
          "RAM",
          "Optical disc"
        ],
        "correct": 2,
        "hint": "It loses stored contents without power.",
        "why": "RAM is volatile."
      }
    ]
  },
  {
    "id": "4",
    "title": "Software",
    "subtitle": "Operating systems and translators",
    "description": "Explore systems software, utilities, compilers and interpreters.",
    "paper": 1,
    "questions": [
      {
        "question": "Which translates a whole program before execution?",
        "answers": [
          "Compiler",
          "Interpreter",
          "Assembler of images",
          "Browser"
        ],
        "correct": 0,
        "hint": "Think about translation before running.",
        "why": "A compiler translates the entire source program."
      },
      {
        "question": "Which software manages hardware and running programs?",
        "answers": [
          "Spreadsheet",
          "Operating system",
          "Image editor",
          "Word processor"
        ],
        "correct": 1,
        "hint": "It controls memory, files and processes.",
        "why": "An OS manages computer resources."
      }
    ]
  },
  {
    "id": "5",
    "title": "The internet and its uses",
    "subtitle": "Networks, DNS, cybersecurity",
    "description": "Study the web, network protocols and common security threats.",
    "paper": 1,
    "questions": [
      {
        "question": "What does DNS do?",
        "answers": [
          "Stores passwords",
          "Converts domain names to IP addresses",
          "Creates programs",
          "Blocks all malware"
        ],
        "correct": 1,
        "hint": "It acts like a directory for website names.",
        "why": "DNS resolves domain names to IP addresses."
      },
      {
        "question": "Which protocol secures HTTP using encryption?",
        "answers": [
          "FTP",
          "SMTP",
          "HTTPS",
          "POP3"
        ],
        "correct": 2,
        "hint": "The secure version has an extra S.",
        "why": "HTTPS uses TLS to protect web connections."
      }
    ]
  },
  {
    "id": "6",
    "title": "Automated and emerging technologies",
    "subtitle": "Sensors, robotics and AI",
    "description": "Explain automated control systems and uses and risks of emerging technology.",
    "paper": 1,
    "questions": [
      {
        "question": "Which device measures a physical quantity?",
        "answers": [
          "Sensor",
          "Actuator",
          "Printer driver",
          "Compiler"
        ],
        "correct": 0,
        "hint": "It provides input from the real world.",
        "why": "Sensors detect measurements such as temperature."
      },
      {
        "question": "What does an actuator do?",
        "answers": [
          "Stores data",
          "Produces a physical action",
          "Encrypts a file",
          "Displays source code"
        ],
        "correct": 1,
        "hint": "Think motor, valve, movement.",
        "why": "An actuator carries out physical actions."
      }
    ]
  },
  {
    "id": "7",
    "title": "Algorithm design and problem-solving",
    "subtitle": "Pseudocode, flowcharts, testing",
    "description": "Develop algorithms, traces and validation and verification methods.",
    "paper": 2,
    "questions": [
      {
        "question": "What is a dry run?",
        "answers": [
          "Executing a program on a server",
          "Tracing an algorithm manually",
          "Deleting test data",
          "Encrypting an algorithm"
        ],
        "correct": 1,
        "hint": "Use a trace table with sample inputs.",
        "why": "A dry run follows steps without executing code."
      },
      {
        "question": "Which search works on an unsorted list?",
        "answers": [
          "Binary search only",
          "Linear search",
          "Neither",
          "Hashing only"
        ],
        "correct": 1,
        "hint": "Check each item in order.",
        "why": "Linear search can find an item without sorting."
      }
    ]
  },
  {
    "id": "8",
    "title": "Programming",
    "subtitle": "Variables, selection, iteration and arrays",
    "description": "Practise program constructs, functions, files and test cases.",
    "paper": 2,
    "questions": [
      {
        "question": "What construct repeats while a condition is true?",
        "answers": [
          "Selection",
          "Iteration",
          "Assignment",
          "Declaration"
        ],
        "correct": 1,
        "hint": "Loops repeat instructions.",
        "why": "Iteration means repetition."
      },
      {
        "question": "What is the purpose of a parameter?",
        "answers": [
          "To pass a value into a procedure",
          "To permanently store data",
          "To end a program",
          "To add indentation"
        ],
        "correct": 0,
        "hint": "Think function inputs.",
        "why": "Parameters let routines receive values."
      }
    ]
  },
  {
    "id": "9",
    "title": "Databases",
    "subtitle": "Tables, keys and SQL",
    "description": "Study records, fields, primary keys and common SQL operations.",
    "paper": 2,
    "questions": [
      {
        "question": "Which key uniquely identifies a table record?",
        "answers": [
          "Foreign word",
          "Primary key",
          "Search tag",
          "Variable"
        ],
        "correct": 1,
        "hint": "No two records should have the same value.",
        "why": "A primary key uniquely identifies each record."
      },
      {
        "question": "Which SQL command retrieves records?",
        "answers": [
          "INSERT",
          "DELETE",
          "SELECT",
          "UPDATE"
        ],
        "correct": 2,
        "hint": "The word means choose.",
        "why": "SELECT queries data from a table."
      }
    ]
  },
  {
    "id": "10",
    "title": "Boolean logic",
    "subtitle": "AND, OR, NOT and truth tables",
    "description": "Evaluate logic expressions and design simple circuits.",
    "paper": 2,
    "questions": [
      {
        "question": "When is AND true?",
        "answers": [
          "If either input is true",
          "Only when both inputs are true",
          "Never",
          "Always"
        ],
        "correct": 1,
        "hint": "Both conditions must pass.",
        "why": "AND outputs 1 only for inputs 1 and 1."
      },
      {
        "question": "What is NOT 0?",
        "answers": [
          "0",
          "1",
          "2",
          "Undefined"
        ],
        "correct": 1,
        "hint": "NOT reverses a bit.",
        "why": "NOT flips 0 to 1."
      }
    ]
  }
];
