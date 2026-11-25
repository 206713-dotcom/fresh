// Exam-focused extra teaching and original practice questions.
export const IGCSE_DEPTH = {
  "1": {
    "sections": [
      [
        "Number systems",
        "Denary uses powers of 10, binary powers of 2 and hexadecimal powers of 16. To convert binary 110101 to denary, add 32 + 16 + 4 + 1 = 53. To convert denary to binary, repeatedly identify the largest power of 2 or divide by 2 and read remainders backwards."
      ],
      [
        "Text, images and sound",
        "Character encoding represents text as codes. A bitmap stores pixels; its approximate uncompressed size is width × height × colour depth in bits. Sound is sampled at regular intervals; more samples per second and more bits per sample generally improve representation but increase file size."
      ],
      [
        "Storage and compression",
        "For binary units, a kibibyte is 1024 bytes; exam questions may specify decimal units instead. Lossless compression can reconstruct the original exactly, while lossy compression discards information to reduce size. Choose based on whether exact reconstruction matters."
      ]
    ],
    "worked": "An uncompressed image with 100 × 50 pixels at 8 bits per pixel needs 100 × 50 × 8 = 40,000 bits = 5,000 bytes, ignoring headers.",
    "mistake": "Confusing bits with bytes (8 bits = 1 byte), or forgetting to check which unit convention a question uses.",
    "exam": "State units at every stage of a file-size calculation. For hex conversions, show the binary groups of four bits.",
    "think": "Why is lossless compression preferred for program source files?",
    "answer": "Every character must be recovered exactly for the code to remain correct.",
    "questions": [
      {
        "question": "What is hexadecimal A in denary?",
        "answers": [
          "8",
          "10",
          "12",
          "16"
        ],
        "correct": 1,
        "hint": "The digit A represents ten.",
        "why": "Hex uses 0–9 then A–F for 10–15."
      },
      {
        "question": "How many bits are needed for an uncompressed image of 20 × 10 pixels at 4 bits per pixel?",
        "answers": [
          "50",
          "80",
          "200",
          "800"
        ],
        "correct": 3,
        "hint": "Multiply the three quantities.",
        "why": "20 × 10 × 4 = 800 bits."
      },
      {
        "question": "Which compression method can reproduce the original data exactly?",
        "answers": [
          "Lossless",
          "Lossy",
          "Sampling",
          "Quantisation"
        ],
        "correct": 0,
        "hint": "Think about exact reconstruction.",
        "why": "Lossless compression is reversible."
      }
    ]
  },
  "2": {
    "sections": [
      [
        "Sending data",
        "Data can be sent serially (bits in sequence) or in parallel (several bits at a time). Serial transmission is practical over long distances. In simplex only one direction is used; half-duplex allows both directions but not at the same time; full-duplex allows simultaneous transfer."
      ],
      [
        "Packets and routing",
        "Packet switching divides a message into units containing payload and control information, such as source, destination and sequence details. Packets may follow different routes and the receiver reassembles them. Missing or damaged packets may need retransmission."
      ],
      [
        "Detecting and protecting",
        "Parity checks add a bit to help detect certain errors; they cannot detect every possible pattern. Checksums and echo checks are other error-detection approaches. Encryption aims to stop unauthorized readers understanding intercepted data; it does not by itself confirm data is correct."
      ]
    ],
    "worked": "For even parity, data 1011001 contains four 1-bits, so a parity bit of 0 keeps the total even.",
    "mistake": "Saying parity can always locate and correct errors; it is mainly a detection technique and can miss some patterns.",
    "exam": "When evaluating a method, describe what it detects, what it misses and when retransmission is needed.",
    "think": "Can two flipped bits pass an even parity check?",
    "answer": "Yes. An even number of bit flips may leave parity unchanged.",
    "questions": [
      {
        "question": "Which mode can send data in both directions at the same time?",
        "answers": [
          "Simplex",
          "Half-duplex",
          "Full-duplex",
          "Serial only"
        ],
        "correct": 2,
        "hint": "Both ways simultaneously.",
        "why": "Full-duplex supports simultaneous two-way communication."
      },
      {
        "question": "Why might data be divided into packets?",
        "answers": [
          "To use packet switching",
          "To remove headers",
          "To avoid destinations",
          "To turn data into sound"
        ],
        "correct": 0,
        "hint": "Each packet can be routed.",
        "why": "Packet switching transmits smaller units."
      },
      {
        "question": "Can an even parity bit detect every two-bit error?",
        "answers": [
          "Yes",
          "No",
          "Only with encryption",
          "Only for sound"
        ],
        "correct": 1,
        "hint": "Consider what happens to an even count after two flips.",
        "why": "Even parity can miss an even number of flips."
      }
    ]
  },
  "3": {
    "sections": [
      [
        "CPU and instruction cycle",
        "The control unit coordinates the fetch–decode–execute cycle. The program counter identifies the next instruction; the memory address register carries an address; the memory data register holds data transferred to or from memory. The ALU performs arithmetic and logic operations."
      ],
      [
        "Memory and storage",
        "RAM is volatile working memory. ROM retains firmware without power. Secondary storage is nonvolatile: solid-state, magnetic and optical devices have different speed, cost and durability trade-offs. Virtual memory uses storage to supplement RAM, normally more slowly."
      ],
      [
        "Input/output and embedded systems",
        "Sensors measure physical quantities and provide inputs. Actuators make physical changes, such as opening a valve. Embedded systems have a dedicated purpose; their hardware and software are chosen for reliability and efficiency."
      ]
    ],
    "worked": "Fetch example: PC points to the instruction address; the address is sent to memory, the instruction is read into a register, decoded, then executed. PC is updated to indicate the next instruction.",
    "mistake": "Treating RAM and SSD as interchangeable; RAM is fast but loses contents without power.",
    "exam": "Use accurate register names and clearly distinguish input, processing, output and storage.",
    "think": "Why is RAM not normally suitable for permanent file storage?",
    "answer": "Its contents disappear when power is removed.",
    "questions": [
      {
        "question": "What does ALU stand for?",
        "answers": [
          "Arithmetic Logic Unit",
          "Address Link Utility",
          "Automatic Load Unit",
          "Array Logic User"
        ],
        "correct": 0,
        "hint": "It performs calculation and logical work.",
        "why": "The ALU handles arithmetic and logic."
      },
      {
        "question": "Which storage is typically nonvolatile?",
        "answers": [
          "RAM",
          "Cache",
          "SSD",
          "CPU register"
        ],
        "correct": 2,
        "hint": "Keeps information without power.",
        "why": "An SSD preserves stored data when off."
      },
      {
        "question": "What is the job of the MDR?",
        "answers": [
          "Stores transferred data",
          "Holds the next instruction address",
          "Displays output",
          "Routes web traffic"
        ],
        "correct": 0,
        "hint": "Think data moving to/from memory.",
        "why": "The Memory Data Register temporarily holds transferred data."
      }
    ]
  },
  "4": {
    "sections": [
      [
        "Types of software",
        "Application software helps users perform tasks; system software manages the computer and supports applications. Operating systems manage memory, processes, files, peripheral devices and interfaces. Utility software handles maintenance tasks."
      ],
      [
        "Program translation",
        "Source code in a high-level language is translated into machine code. A compiler translates a whole program before running it; an interpreter translates and executes instructions during runtime; an assembler converts assembly language to machine code."
      ],
      [
        "Development cycle",
        "A developer writes source code, translates or runs it, tests behavior, then fixes errors. Syntax errors prevent correct translation; logic errors can run but give incorrect results. Testing should include typical, boundary and erroneous inputs."
      ]
    ],
    "worked": "A school spreadsheet is application software. The operating system handles saving its file and allocating memory; the compiler used to build the app is a translator.",
    "mistake": "Claiming an interpreter always makes the source program error-free, or confusing applications with utilities.",
    "exam": "When comparing compiler and interpreter, explain translation timing, error reporting and distribution.",
    "think": "Can a program have a logic error even if it compiles?",
    "answer": "Yes. Valid code may still calculate or display the wrong answer.",
    "questions": [
      {
        "question": "Which translator converts assembly into machine instructions?",
        "answers": [
          "Assembler",
          "Browser",
          "Spreadsheet",
          "Cache"
        ],
        "correct": 0,
        "hint": "The name is related to assembly.",
        "why": "An assembler translates assembly code."
      },
      {
        "question": "Which is system software?",
        "answers": [
          "Operating system",
          "Photo album",
          "Slide presentation",
          "Video file"
        ],
        "correct": 0,
        "hint": "Manages computer resources.",
        "why": "An OS is system software."
      },
      {
        "question": "A program runs but calculates the wrong total. What type of error is likely?",
        "answers": [
          "Logic error",
          "No error",
          "Syntax error only",
          "Hardware upgrade"
        ],
        "correct": 0,
        "hint": "The instructions are valid but the result is wrong.",
        "why": "Logic errors can occur in running programs."
      }
    ]
  },
  "5": {
    "sections": [
      [
        "Internet versus web",
        "The Internet is the worldwide network infrastructure. The World Wide Web is a service that uses it, with browsers, web servers, URLs and HTTP/HTTPS. Other Internet services include email and file transfer."
      ],
      [
        "Addressing and protocols",
        "An IP address identifies a network endpoint. DNS resolves domain names into IP addresses. A browser sends a request to a web server and receives a response. HTTPS uses TLS to help protect data in transit."
      ],
      [
        "Staying safe online",
        "Phishing attempts to trick people into revealing information. Malware can damage systems or misuse data. Better practices include unique passwords, multifactor authentication, updates, backups and verifying a website or message before trusting it."
      ]
    ],
    "worked": "When you open a site, the browser finds its server through DNS, establishes a protected connection when HTTPS is used, requests a resource and displays the returned page.",
    "mistake": "Calling the Internet and WWW the same thing, or assuming HTTPS means a website is trustworthy in every respect.",
    "exam": "Describe a precise threat and a matching protection, rather than only saying “use security”.",
    "think": "Does HTTPS guarantee a website is honest?",
    "answer": "No. HTTPS protects the connection; a malicious site can still use HTTPS.",
    "questions": [
      {
        "question": "What is the World Wide Web?",
        "answers": [
          "A service using the Internet",
          "The whole Internet",
          "One hardware device",
          "A password standard"
        ],
        "correct": 0,
        "hint": "Think of web pages and browsers.",
        "why": "The WWW is a service built on the Internet."
      },
      {
        "question": "What does DNS help find?",
        "answers": [
          "IP address for a domain",
          "CPU clock speed",
          "RAM capacity",
          "Source-code language"
        ],
        "correct": 0,
        "hint": "It translates names to addresses.",
        "why": "DNS resolves domain names."
      },
      {
        "question": "Which practice reduces risk from reused passwords?",
        "answers": [
          "Unique passwords",
          "Sharing logins",
          "Disabling updates",
          "Using simple names"
        ],
        "correct": 0,
        "hint": "Avoid reusing credentials.",
        "why": "Unique passwords limit damage from one compromised account."
      }
    ]
  },
  "6": {
    "sections": [
      [
        "Automated systems",
        "A control system uses sensors to gather data, software to compare readings with a target, and actuators to make changes. Feedback closes the loop by measuring the result again."
      ],
      [
        "Robotics",
        "Robots combine processors, sensors, actuators and programmed rules. A robot may perform repetitive or hazardous tasks with consistent accuracy, but has setup costs, maintenance needs and safety requirements."
      ],
      [
        "Artificial intelligence",
        "AI systems can find patterns in data and support decisions; output quality depends on training data, evaluation and appropriate supervision. Bias, privacy and reliability are important design concerns."
      ]
    ],
    "worked": "A greenhouse sensor reads 31 °C; the controller compares it to the target 25 °C and turns on the fan. A later reading checks whether cooling worked.",
    "mistake": "Treating sensors and actuators as the same thing: one measures, while the other performs an action.",
    "exam": "For control-system questions, describe the input → process → output → feedback cycle.",
    "think": "What is the role of the actuator in an automatic door?",
    "answer": "It physically opens or closes the door when the controller sends a signal.",
    "questions": [
      {
        "question": "In a control system, what performs a physical action?",
        "answers": [
          "Actuator",
          "Sensor",
          "Cache",
          "Monitor only"
        ],
        "correct": 0,
        "hint": "Think motor or valve.",
        "why": "An actuator carries out actions."
      },
      {
        "question": "What does feedback provide?",
        "answers": [
          "New measurement after an action",
          "Permanent storage",
          "A programming language",
          "An IP address"
        ],
        "correct": 0,
        "hint": "The system measures again.",
        "why": "Feedback helps the controller adjust its output."
      },
      {
        "question": "Why should an AI system be evaluated for bias?",
        "answers": [
          "To reduce unfair results",
          "To replace all tests",
          "To eliminate sensors",
          "To guarantee zero mistakes"
        ],
        "correct": 0,
        "hint": "Think about fairness.",
        "why": "Evaluation can identify uneven performance."
      }
    ]
  },
  "7": {
    "sections": [
      [
        "Algorithm design",
        "Decomposition breaks a large problem into smaller tasks. Abstraction focuses on relevant information. Pseudocode and flowcharts communicate instructions without depending on one programming language."
      ],
      [
        "Tracing and testing",
        "A trace table records variable changes for sample inputs and helps spot logical errors. Dry runs test algorithms manually. Test data should include normal, boundary, invalid and exceptional values where relevant."
      ],
      [
        "Searching and sorting",
        "Linear search examines items until it finds a target or reaches the end; it works on unsorted data. Binary search repeatedly halves a sorted search range. Selection, bubble and insertion sorts are common algorithms to trace."
      ]
    ],
    "worked": "Trace SUM ← 0; FOR x FROM 1 TO 3; SUM ← SUM + x. Values of SUM after each iteration are 1, 3 and 6.",
    "mistake": "Using binary search on an unordered list or overlooking the final value of a loop counter.",
    "exam": "Show every important variable change in trace tables. Explain why a method is suitable for the input.",
    "think": "Why is a trace table useful before writing code?",
    "answer": "It lets you reason about the algorithm and detect logic errors manually.",
    "questions": [
      {
        "question": "Which search can work on an unsorted list?",
        "answers": [
          "Linear",
          "Binary only",
          "Neither",
          "Merge only"
        ],
        "correct": 0,
        "hint": "Check items in order.",
        "why": "Linear search needs no ordering."
      },
      {
        "question": "How many loop iterations occur for FOR i FROM 1 TO 4 inclusive?",
        "answers": [
          "3",
          "4",
          "5",
          "8"
        ],
        "correct": 1,
        "hint": "Count 1, 2, 3, 4.",
        "why": "There are four values."
      },
      {
        "question": "Which table helps follow variable changes?",
        "answers": [
          "Trace table",
          "Truth table only",
          "Database table only",
          "Times table"
        ],
        "correct": 0,
        "hint": "Used for manual dry runs.",
        "why": "A trace table records states during execution."
      }
    ]
  },
  "8": {
    "sections": [
      [
        "Programming constructs",
        "Sequence runs instructions in order; selection chooses a branch (IF); iteration repeats instructions (FOR, WHILE, REPEAT). Use the construct that fits the problem rather than putting everything in one condition."
      ],
      [
        "Data types and structures",
        "Choose integer or real for numbers, string for text and Boolean for true/false states. Arrays store indexed collections of same-type values in syllabus-style pseudocode. Constants should not change during execution."
      ],
      [
        "Procedures, functions and testing",
        "Procedures carry out a task; functions return a result. Parameters supply inputs. Validate input to ensure it meets rules, and verify that data was copied or entered correctly. Use meaningful identifiers and comments."
      ]
    ],
    "worked": "FUNCTION Double(n : INTEGER) RETURNS INTEGER; RETURN n * 2; ENDFUNCTION. The call Double(5) returns 10, which can be stored in another variable.",
    "mistake": "Confusing validation with verification, or assuming a procedure and function are identical.",
    "exam": "Use pseudocode keywords and consistent variable names; work through at least one example input.",
    "think": "What is the difference between validation and verification?",
    "answer": "Validation checks whether data satisfies rules; verification checks whether data was copied/entered accurately.",
    "questions": [
      {
        "question": "What does iteration mean?",
        "answers": [
          "Repetition",
          "Assignment",
          "Storage",
          "Comparison only"
        ],
        "correct": 0,
        "hint": "A loop repeats.",
        "why": "Iteration means repeating steps."
      },
      {
        "question": "Which test value is on the edge of an accepted range?",
        "answers": [
          "Boundary value",
          "Random character only",
          "Always zero",
          "An invalid field name"
        ],
        "correct": 0,
        "hint": "Think minimum and maximum accepted values.",
        "why": "Boundary tests examine limits."
      },
      {
        "question": "Which value would normally use a Boolean type?",
        "answers": [
          "HasPassed",
          "Age in years",
          "Family name",
          "Price"
        ],
        "correct": 0,
        "hint": "True or false.",
        "why": "A Boolean holds two logical states."
      }
    ]
  },
  "9": {
    "sections": [
      [
        "Relational records",
        "A table contains records (rows) and fields (columns). Each field has a data type; a primary key uniquely identifies a record. A foreign key links a record to a primary key in another table."
      ],
      [
        "Querying with SQL",
        "SELECT chooses fields, FROM names a table, WHERE filters records and ORDER BY sorts results. Aggregates such as COUNT, SUM and AVG can summarize data. A condition must use correct types and quoting."
      ],
      [
        "Data integrity",
        "A relational database reduces unnecessary duplication by linking tables. Data types, required fields, primary keys and relationships help maintain consistency. Database access controls limit who can read or change records."
      ]
    ],
    "worked": "SELECT Name, Score FROM Students WHERE Score >= 80 ORDER BY Score DESC; returns qualifying names and scores in descending score order.",
    "mistake": "Forgetting that the primary key must be unique or writing a WHERE condition that compares incompatible types.",
    "exam": "Identify fields needed in the output before writing SELECT, then write a precise WHERE condition.",
    "think": "Why might a school table use a unique StudentID as primary key?",
    "answer": "Names can repeat, but a unique identifier can distinguish records reliably.",
    "questions": [
      {
        "question": "Which SQL keyword filters records?",
        "answers": [
          "WHERE",
          "FROM",
          "COUNT",
          "ORDER"
        ],
        "correct": 0,
        "hint": "It restricts rows.",
        "why": "WHERE applies conditions."
      },
      {
        "question": "What does a primary key require?",
        "answers": [
          "Unique values",
          "The same value in every row",
          "Only letters",
          "Only numbers"
        ],
        "correct": 0,
        "hint": "Every record must be distinguishable.",
        "why": "Primary keys identify records uniquely."
      },
      {
        "question": "What does ORDER BY Score DESC do?",
        "answers": [
          "Highest scores first",
          "Lowest scores first",
          "Deletes scores",
          "Changes field names"
        ],
        "correct": 0,
        "hint": "DESC means descending.",
        "why": "Descending sorts largest to smallest."
      }
    ]
  },
  "10": {
    "sections": [
      [
        "Logic gates",
        "AND is true only if all inputs are true. OR is true if at least one input is true. NOT reverses a single input. XOR is true when the inputs differ; NAND and NOR negate AND and OR."
      ],
      [
        "Truth tables",
        "For n binary inputs there are 2^n input combinations. Evaluate each gate stage by stage, especially expressions with parentheses or multiple intermediate outputs."
      ],
      [
        "Boolean expressions",
        "Logic circuits can be represented with expressions: for example, F = (A AND B) OR C. Breaking a complex circuit into intermediate terms helps prevent mistakes."
      ]
    ],
    "worked": "For A = 1, B = 0 and C = 1: (A AND B) OR C = (1 AND 0) OR 1 = 0 OR 1 = 1.",
    "mistake": "Confusing OR with XOR: OR includes the 1,1 case; XOR excludes it.",
    "exam": "Draw all 4 rows for two inputs or 8 for three inputs and label intermediate columns clearly.",
    "think": "What is 1 XOR 1?",
    "answer": "0, because the inputs are the same.",
    "questions": [
      {
        "question": "What is 1 OR 1?",
        "answers": [
          "0",
          "1",
          "2",
          "Undefined"
        ],
        "correct": 1,
        "hint": "At least one true input suffices.",
        "why": "OR outputs 1 when either or both inputs are 1."
      },
      {
        "question": "What is 1 XOR 1?",
        "answers": [
          "0",
          "1",
          "2",
          "Undefined"
        ],
        "correct": 0,
        "hint": "XOR requires different inputs.",
        "why": "Two equal inputs produce 0."
      },
      {
        "question": "How many truth-table rows do three Boolean inputs need?",
        "answers": [
          "4",
          "6",
          "8",
          "16"
        ],
        "correct": 2,
        "hint": "Calculate 2 cubed.",
        "why": "2^3 = 8 input combinations."
      }
    ]
  }
};
