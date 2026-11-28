export const drills = [
  ['Selection', 'What is output when Score is 60?', 'IF Score >= 60 THEN\n    OUTPUT "Pass"\nELSE\n    OUTPUT "Retry"\nENDIF', 'Pass', 'The test includes 60 because it uses >=.'],
  ['Count-controlled loops', 'What value is output?', 'Total ← 0\nFOR I ← 1 TO 4\n    Total ← Total + I\nNEXT I\nOUTPUT Total', '10', 'The loop includes both endpoints: 1 + 2 + 3 + 4 = 10.'],
  ['Validation', 'For inputs 12, 0, 5 in that order, which value is output?', 'REPEAT\n    INPUT Quantity\nUNTIL Quantity >= 1 AND Quantity <= 10\nOUTPUT Quantity', '5', 'The condition becomes true only when the input is 5.'],
  ['Arrays', 'What is output? Values[1:4] contains 8, 3, 11, 6.', 'Largest ← Values[1]\nFOR I ← 2 TO 4\n    IF Values[I] > Largest THEN\n        Largest ← Values[I]\n    ENDIF\nNEXT I\nOUTPUT Largest', '11', 'Initialise from the first item. Only 11 exceeds the running maximum of 8.'],
  ['Functions and MOD', 'What is output?', 'FUNCTION IsEven(N : INTEGER) RETURNS BOOLEAN\n    RETURN N MOD 2 = 0\nENDFUNCTION\nOUTPUT IsEven(9)', 'FALSE', '9 leaves a remainder of 1 when divided by 2.'],
  ['Writing a loop', 'Write pseudocode to input five integers and output how many are negative.', null, null, 'Count ← 0\nFOR I ← 1 TO 5\n    INPUT Number\n    IF Number < 0 THEN\n        Count ← Count + 1\n    ENDIF\nNEXT I\nOUTPUT Count']
];

export const scenarios = [
  {
    id: 'sports', title: 'Sports day results', marks: 15,
    prompt: 'A school records three long-jump distances for each of eight students. Write an algorithm that inputs each student’s name and three distances. Distances must be between 0.50 and 6.00 metres inclusive. Re-enter any invalid distance. Store names and distances in arrays. Output each student’s best distance. Finally output the name and distance of the overall winner. For ties, keep the first student to reach that distance.',
    criteria: [['Input and array storage', 4], ['Range validation and retry', 3], ['Personal best and output', 4], ['Overall winner, tie handling and output', 4]],
    model: `DECLARE Name : ARRAY[1:8] OF STRING
DECLARE Distance : ARRAY[1:8, 1:3] OF REAL
DECLARE Student, Jump, Winner : INTEGER
DECLARE PersonalBest, OverallBest : REAL
OverallBest ← 0
Winner ← 1
FOR Student ← 1 TO 8
    INPUT Name[Student]
    PersonalBest ← 0
    FOR Jump ← 1 TO 3
        REPEAT
            INPUT Distance[Student, Jump]
        UNTIL Distance[Student, Jump] >= 0.50 AND Distance[Student, Jump] <= 6.00
        IF Distance[Student, Jump] > PersonalBest THEN
            PersonalBest ← Distance[Student, Jump]
        ENDIF
    NEXT Jump
    OUTPUT Name[Student], PersonalBest
    IF PersonalBest > OverallBest THEN
        OverallBest ← PersonalBest
        Winner ← Student
    ENDIF
NEXT Student
OUTPUT Name[Winner], OverallBest`
  },
  {
    id: 'library', title: 'Library borrowing summary', marks: 15,
    prompt: 'A library records how many books each of six classes borrowed in four weeks. Write an algorithm that inputs the class names and weekly counts, accepting only integers from 0 to 40 for each count. Store all the input in arrays. Output each class and its four-week total, the names of any classes that borrowed at least 100 books, and the overall total for the library.',
    criteria: [['Nested iteration and storage', 4], ['Validation and retry', 3], ['Per-class total and threshold output', 5], ['Overall accumulation and output', 3]],
    model: `DECLARE ClassName : ARRAY[1:6] OF STRING
DECLARE Borrowed : ARRAY[1:6, 1:4] OF INTEGER
DECLARE ClassIndex, Week, ClassTotal, LibraryTotal : INTEGER
DECLARE Count : REAL
LibraryTotal ← 0
FOR ClassIndex ← 1 TO 6
    INPUT ClassName[ClassIndex]
    ClassTotal ← 0
    FOR Week ← 1 TO 4
        REPEAT
            INPUT Count
        UNTIL Count = INT(Count) AND Count >= 0 AND Count <= 40
        Borrowed[ClassIndex, Week] ← INT(Count)
        ClassTotal ← ClassTotal + Borrowed[ClassIndex, Week]
    NEXT Week
    OUTPUT ClassName[ClassIndex], " total: ", ClassTotal
    IF ClassTotal >= 100 THEN
        OUTPUT ClassName[ClassIndex], " reached 100 books"
    ENDIF
    LibraryTotal ← LibraryTotal + ClassTotal
NEXT ClassIndex
OUTPUT "Library total: ", LibraryTotal`
  }
];

const written = [
  ['packet', 'Packet switching', 3, 'Explain why packets may arrive out of order and how the receiving device can reconstruct the message.', [['Routing explanation', 1], ['Sequence information and reassembly', 2]], 'Packets may take different routes and experience different delays. Each packet carries sequence information in its header. The receiver uses the sequence numbers to put the payloads in the original order.'],
  ['sensors', 'Automatic irrigation', 4, 'Explain how a sensor, a processor, and an actuator can control irrigation when soil moisture is too low.', [['Measurement and processor decision', 2], ['Actuator and feedback', 2]], 'A moisture sensor provides a reading to the processor. The processor compares it with a stored threshold. If the soil is too dry, it sends a signal to an actuator to open a valve. The system takes further readings and closes the valve when the required moisture is reached.'],
  ['backups', 'Recovering files', 5, 'A school keeps a synchronised copy of its shared folder. Explain how this differs from a versioned backup and why a separate backup is useful after accidental deletion.', [['Synchronisation and versioning', 3], ['Recovery and separation', 2]], 'Synchronisation keeps the copies aligned, so deleting a file can also remove it from the synchronised location. A versioned backup retains snapshots from earlier times. The school can restore the file from a snapshot made before the deletion. A separate backup location also helps when the original storage is unavailable.'],
  ['search', 'Searching a list', 6, 'Compare linear search with binary search. Explain the data requirement and how each narrows its search, then recommend one for a large sorted list.', [['Linear search', 2], ['Binary search and sorted requirement', 3], ['Justified recommendation', 1]], 'Linear search checks items one by one until it finds the target or reaches the end and can work on unsorted data. Binary search requires sorted data. It compares the target with the middle item and discards the half where the target cannot be, repeating until it finds a match or no items remain. For a large sorted list I would use binary search because each comparison can halve the remaining search space.'],
  ['sample', 'Digitising sound', 7, 'Explain how an analogue sound is digitised. Discuss how sample rate and bit depth affect quality and file size.', [['Digitisation process', 3], ['Sample rate trade-off', 2], ['Bit depth trade-off', 2]], 'The microphone produces an analogue signal. An analogue-to-digital converter measures it at regular intervals and quantises each measurement to the nearest available level, which is stored in binary. Higher sample rates capture more detail in time and increase the number of values stored per second. Higher bit depths give more amplitude levels and reduce quantisation error, but each sample needs more bits.'],
  ['inventory', 'Database design', 8, 'A shop stores an item code, description, unit price, quantity, and discontinued flag. Recommend a data type for each, explain which field should be the primary key, and explain how a query could find active items with quantity below 5.', [['Suitable field types', 4], ['Primary key choice and justification', 2], ['Query conditions joined correctly', 2]], 'Use a string for item code to retain leading zeroes, a string for description, a real or decimal number for unit price, an integer for quantity, and a Boolean for discontinued. Use item code as the primary key because each item has a unique code and can be located unambiguously. Select records where discontinued is false AND quantity is less than 5.'],

  ['parity', 'Even parity', 3, 'Explain how a receiver uses even parity to detect an error. Give one limitation.', [['Parity test and interpretation', 2], ['Limitation', 1]], 'The receiver counts the 1 bits including the parity bit. An odd count means the received data fails the even-parity check. An even number of flipped bits can leave the total even, so some errors pass undetected.'],
  ['validation', 'Validation and verification', 4, 'A school records student ages from 11 to 18. Describe one suitable validation check and one verification method, applying both to this example.', [['Suitable validation check and application', 2], ['Suitable verification method and application', 2]], 'A range check rejects any age below 11 or above 18. For verification, two independent entries of the age can be compared. A mismatch is flagged so the entries can be checked against the original record.'],
  ['compression', 'Sound compression', 5, 'Compare lossy and lossless compression for a music website that streams previews and stores studio masters. Explain which type suits each use.', [['Difference and effect on data', 3], ['Justified choices for the two uses', 2]], 'Lossy compression removes some audio information permanently, typically allowing a smaller file at the cost of possible quality loss. Lossless compression reconstructs the original exactly, usually with less reduction for audio. Lossy previews require less bandwidth to stream, while lossless masters retain every sample for editing or archiving.'],
  ['cpu', 'Fetch–decode–execute', 6, 'Describe how a CPU fetches and executes a stored instruction. Include the roles of PC, MAR, MDR and CIR.', [['Fetch sequence and registers', 4], ['Decoding and execution', 2]], 'The address in the PC is copied to the MAR. The instruction at that address is read from memory into the MDR, then copied to the CIR. The PC is advanced to the next instruction address. The control unit decodes the instruction in the CIR and issues control signals to execute it, for example directing the ALU to perform an addition.'],
  ['storage', 'Choosing storage', 7, 'Compare magnetic hard disks and solid-state drives. Explain how each stores data, compare speed and durability, and recommend a drive for a field laptop.', [['Storage mechanisms', 2], ['Speed and durability comparison', 4], ['Justified recommendation', 1]], 'A hard disk stores data magnetically on spinning platters. An SSD stores it in flash memory cells. A hard disk must move its head and wait for the platter to rotate, while an SSD accesses cells electronically, so random access is typically faster. Moving parts make hard disks more vulnerable to shocks; an SSD has no moving parts. I would choose an SSD for a field laptop because it is more likely to withstand movement and bumps.'],
  ['tests', 'Testing and debugging', 8, 'A program should accept integer scores from 0 to 100 inclusive and classify scores of at least 50 as Pass. Give four test inputs with expected results covering invalid input, an acceptance boundary and both outcomes. Explain how a trace table helps diagnose a score of 50 being classified incorrectly.', [['Four suitable test inputs and expected results', 4], ['Coverage of the requested cases', 2], ['Trace table explanation applied to the threshold', 2]], '−1 should be rejected. 0 should be accepted and classified Fail. 49 should be accepted and classified Fail. 50 should be accepted and classified Pass. A trace table records the score and behaviour of each decision as the algorithm runs by hand. For 50, it shows where the actual decision differs from the expected true result, for example if the test mistakenly uses > 50 rather than >= 50.']
];

export const writtenQuestions = written.map(([id, title, marks, prompt, criteria, model]) => ({ id, title, marks, prompt, criteria, model }));
