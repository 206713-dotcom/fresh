# <img src="fresh.svg" width="32" height="32" alt=""> Fresh

**Fresh is a student-led organisation building one place to revise for Cambridge IGCSE.** Start with the subject you need today, work through a lesson or question, and come back to your progress in the same browser.

**[Open Fresh](https://gisfresh.me/)** · [Browse subjects](https://gisfresh.me/#subjects) · [Explore Fresh Science](https://gisfresh.me/subjects/science.html) · [Read the privacy notice](https://gisfresh.me/privacy.html)

## Why we built Fresh

Revision can involve finding notes in one place, looking for practice in another, and keeping track of what you have already understood somewhere else. Fresh brings those steps together. Students contribute the subjects they know, and the hub gives each project a place alongside the others. Our aim is for someone to find a topic and start practising without setting up an account.

The directory covers **13 subjects**. Some pages offer short worked examples. The larger subject workspaces also have tools like flashcards, practicals, exam practice and revision planning. You can return to the main Fresh homepage from a subject and use the same GIS Points balance while you study.

## Start here

| If you want to… | Open |
| --- | --- |
| Compare all the subjects | [Subject directory](https://gisfresh.me/#subjects) |
| Study cells, inheritance or ecology, or try Paper 6 practice | [Fresh Biology](https://gisfresh.me/subjects/biology.html) |
| Explore visual lessons in the sciences | [Biology, Chemistry and Physics](https://gisfresh.me/subjects/science.html) |
| Choose between syllabus maths and competitions | [Fresh Mathematics](https://gisfresh.me/subjects/mathematics.html) |
| Write and run a Python program | [PyQuest](https://gisfresh.me/subjects/pyquest/) |
| Draft an exam answer and get feedback | [Business Studies](https://gisfresh.me/subjects/business.html?open=overview) · [Economics](https://gisfresh.me/subjects/economics.html#practice) |
| Review your shared rewards | **GIS Points** on the [Fresh homepage](https://gisfresh.me/) |

## How AI helped

AI coding assistants helped turn subject outlines into the original Fresh pages, build and revise website features, and troubleshoot how the separate apps work on one domain. The subject sections below describe concrete examples from that work. For contributed apps, the Fresh integration is the part we can document from this project. The original creators are credited for their work.

Business Studies and Economics also offer **AI feedback for written exam practice**. A student writes an answer first, tries the marker, and uses the feedback to decide what to revise. The mark is provisional. The question, mark scheme and teacher feedback are useful when judging whether a suggested improvement makes sense. The marker runs inside the browser, and the first use can require model and software downloads. [Fresh privacy notice](https://gisfresh.me/privacy.html#ai)

## Subjects

[Mathematics](#mathematics-0580) · [First Language English](#first-language-english-0500) · [Literature in English](#literature-in-english-0475) · [Biology](#biology-0610) · [Chemistry](#chemistry-0620) · [Physics](#physics-0625) · [Computer Science](#computer-science-0478) · [ICT](#information-and-communication-technology-0417) · [Design and Technology](#design-and-technology-0445) · [Geography](#geography-0460) · [History](#history-0470) · [Economics](#economics-0455) · [Business Studies](#business-studies-0264)

### Mathematics (0580)

The Maths page has worked examples for linear equations, right-angled trigonometry and probability. From there you can choose MathQuest for IGCSE practice or Vertex Maths for competition questions. [Open Fresh Mathematics](https://gisfresh.me/subjects/mathematics.html)

- **MathQuest** has topic lessons, question-by-question practice, a diagnostic level test and a Practice Lab. Try a lesson first, then use a topic checkpoint to see whether you can apply the method across a set of questions. [Open MathQuest](https://gisfresh.me/subjects/mathquest/)
- **Vertex Maths** has contest practice for AMC, AIME and UKMT, an IMO proof track, visual lessons and a Maths Lab. Use it to practise explaining why a solution works. [Open Vertex Maths](https://gisfresh.me/subjects/vertex-maths/)

**How AI helped.** AI helped draft compact worked examples for the Fresh starter page. During integration it helped fit both maths sites under the same domain, test the two launch paths and connect MathQuest rewards to the shared GIS Points balance. Vertex Maths lesson completions and problem practice also contribute to that balance. MathQuest and Vertex Maths were created by [`linze933-spec`](https://github.com/linze933-spec).

### First Language English (0500)

English Studio provides original practice aligned to the Cambridge 2027–2029 written papers. Work with source passages, write timed responses, compare examples and track skills in a browser-based workspace. [Open First Language English](https://gisfresh.me/subjects/english-language.html) · [Implementation checklist](docs/english-0500-checklist.md)

**How AI helps.** The experimental on-device marker uses task-specific criteria and checks that quoted feedback comes from the student’s answer. A self-marking guide is available for each task. Examiner agreement is still unmeasured.

### Literature in English (0475)

Use the introductory exercises to practise interpreting imagery, explaining a structural shift and reading stage directions. Start by naming the feature, then explain what changes for the reader or audience. [Open Literature in English](https://gisfresh.me/subjects/english-literature.html)

**How AI helped.** AI helped draft short examples that students can analyse without needing a whole set text in front of them. The shift from “we” to “I,” for example, gives students a small passage for practising how a change in perspective can affect a reading. Use the same reasoning process with the texts you are studying in class.

### Biology (0610)

Fresh Biology is a full study workspace. The topic index spans **21 topics**, with **99 lessons**, **188 practice questions** and **183 flashcards** in this version. Use the planner to choose what to study, or return to the mistakes list after a practice session. The coverage view shows the available material and its review status so students can choose topics with the detail they need. [Open Fresh Biology](https://gisfresh.me/subjects/biology.html) · [View syllabus coverage](https://gisfresh.me/subjects/biology.html#/coverage)

The practicals hub contains **51 virtual investigations** and **five 40-mark Paper 6 practice mocks**. You can practise interpreting tables and graphs, checking what was controlled and explaining what a result supports. Finish a revision lesson to earn **5 GIS Points**, once per lesson. Your Biology progress and notes stay in the browser, and the workspace supports a JSON backup. [Open Biology practicals](https://gisfresh.me/subjects/biology.html#/practicals)

**How AI helped.** In the Fresh publication work, AI helped check the subject route, trace the lesson completion event to the shared wallet and audit the study and Paper 6 inventories for this guide. Automated checks cover question and flashcard links, mock-paper mark totals, browser-local storage and reward deduplication. [Biology integration by `danny7074210-jpg`](https://github.com/206713-dotcom/fresh/pull/30) · [Biology checks](tests/biology/)

### Chemistry (0620)

Quilio goes from particle models and the periodic table to bonding, reactions and chemical calculations. Topic pages bring together lecture notes, animated films, interactive demonstrations and exam-style questions. Start with a lesson such as states of matter, watch the particle model change and explain the result before opening the worked answer. The Olympiad area provides a further challenge for students who want it. [Open Quilio Chemistry](https://gisfresh.me/subjects/chemistry.html)

**How AI helped.** The early Chemistry prototype was developed with Claude. AI-assisted work helped bring its lecture pages, films and interactions into Fresh, adjust the presentation so the introduction and film have room to read, and keep completion tracking on the device. Marking a lecture complete now earns GIS Points through the same wallet as other subjects.

### Physics (0625)

Geodesic connects worked examples with visual explanations, practical activities and a Study area for revision. Start with an IGCSE topic such as motion or circuits, work through a problem and mark the topic understood when you can explain it. The site also has higher-level physics, maths and Olympiad material for students who want to explore further. [Open Geodesic Physics](https://gisfresh.me/subjects/physics.html)

**How AI helped.** AI supported the original prototype and its move into Fresh, including testing the entry route, loading experience and local completion state. The Fresh Physics answer checker compares numbers and key ideas in the browser. A worked solution gives students a reference when the checker only picks up part of their reasoning. [Physics answer checker](subjects/physics/js/grade.js)

### Computer Science (0478)

PyQuest opens directly to the IGCSE 0478 study area. Choose a topic from Paper 1 Computer Systems or Paper 2 Algorithms, Programming and Logic for notes, worked examples and exam-style questions. [Open IGCSE Computer Science](https://gisfresh.me/subjects/pyquest/#igcse)

**Quick revision.** Practise binary place values, trace tables and Boolean expressions with short worked examples. [Open quick practice](https://gisfresh.me/subjects/computer-science.html)

**Python with PyQuest.** Use lessons and challenges to build up from a first program, or open the Code Lab for your own experiments. PyQuest runs code in the browser and can save exercises, test results and code drafts on the device. Use a local profile backup if you want to move that work to a different browser. [Open PyQuest](https://gisfresh.me/subjects/pyquest/)

**How AI helped.** AI helped draft the starter exercises that link concepts to a checkable result, including tracing a running total across a loop. For the contributed PyQuest app, it helped adapt the navigation, keep the Fresh release browser-local and connect completed coding lessons and game rewards to GIS Points. PyQuest was created by [`linze933-spec`](https://github.com/linze933-spec).

### Information and Communication Technology (0417)

Practise spreadsheet references, database keys and digital safety. Try copying a formula with both relative and fixed references, explain why a primary key must be unique, and decide what to do with a suspicious password-reset message. [Open ICT](https://gisfresh.me/subjects/ict.html)

**How AI helped.** AI helped shape the starter notes into practical questions. The spreadsheet prompt asks students to predict which part of a formula moves when it is copied. The answer shows the new formula and the reason, so students can check their understanding of absolute references.

### Design and Technology (0445)

RM Revise covers Product Design and Resistant Materials. Use the learning path, syllabus checklist, topic quizzes, flashcards and 3D workshop to connect material choices and workshop processes to design decisions. Start by picking a material or process and explaining why it suits a particular product. [Open RM Revise](https://gisfresh.me/subjects/design-and-technology/)

**How AI helped.** AI supported the Fresh integration by checking the app’s routes and assets under the custom domain and linking its shop to the shared balance. Students can earn points in RM Revise and spend points earned while studying another Fresh subject. Alexey Lykosov created and maintains RM Revise. [RM Revise source project](https://github.com/PENGUINPLAZE/RM_REVISION)

### Geography (0460)

Review population change, river processes and map scale. Use the calculation questions to check units and practise the difference between a rate per thousand and a percentage. For a process question, explain the connection between a change in river speed and deposition. [Open Geography](https://gisfresh.me/subjects/geography.html)

**How AI helped.** AI helped draft quick examples with explicit working. The map-scale answer multiplies by the scale factor and then converts centimetres to kilometres, which makes it easier to spot whether an error was in the calculation or the unit conversion.

### History (0470)

Use the starter questions to practise explaining causes, evaluating sources and comparing arguments. When looking at a recruitment poster, consider what the poster shows about persuasion and what other evidence would help you make a claim about enlistment. [Open History](https://gisfresh.me/subjects/history.html)

**How AI helped.** AI helped draft prompts that ask for a judgement supported by evidence. The source question pairs the interpretation of a poster with a concrete follow-up about enlistment figures. This gives students a short way to practise using evidence for a particular question.

### Economics (0455)

Start with syllabus notes and flashcards, then try a topic question, a mock or a revision game. The checklist and progress page help you choose what to revisit. In written practice, try explaining a chain such as how a rise in costs can affect supply, price and quantity. [Open Economics](https://gisfresh.me/subjects/economics.html) · [Open Economics games](https://gisfresh.me/subjects/economics-games.html)

**How AI helped.** AI-assisted development helped improve navigation between practice, checklists and saved work. The written-answer marker gives provisional feedback in the browser. On supported question types, the revision workflow can save a first attempt and help students compare it with a later version. It is useful for identifying one missing step in an explanation before checking the mark scheme. [Economics marking code](subjects/economics/marking.js) · [Fresh privacy notice](https://gisfresh.me/privacy.html#ai)

### Business Studies (0264)

EcBiz combines revision lessons, a syllabus checklist, multiple-choice practice, Paper 1 scenarios and Paper 2 case studies. Use **My progress** to revisit work or **Boss Battle** to practise recalling concepts under time pressure. For case questions, write a specific point about the business and explain how it affects the decision. [Open Business Studies](https://gisfresh.me/subjects/business.html?open=overview) · [Open the checklist](https://gisfresh.me/subjects/business.html?open=checklist) · [Open Boss Battle](https://gisfresh.me/subjects/business.html?open=boss-battle)

**How AI helped.** Jayden Tan designed, built and tested EcBiz with AI coding tools. He documents using Gemini to generate exam-style practice based on model answers, then checking and editing those questions. EcBiz also keeps a verified past-paper archive identified by source. Its browser AI marker gives provisional feedback on responses, and Jayden describes comparing sample marks with Cambridge marking criteria to improve the rules. [Jayden’s development notes and EcBiz credits](subjects/business/README.md)

## Progress, GIS Points and privacy

| Feature | How it works |
| --- | --- |
| **GIS Points** | One balance across Fresh in the same browser. Earn points by studying and open the homepage card to see the balance and recent activity. Subject shops use that balance. |
| **Existing rewards** | Saved Business, MathQuest, PyQuest and RM Revise coin balances on Fresh convert to GIS Points once. |
| **Browser-local progress** | Integrated apps can remember work such as lesson completions, drafts, quiz results and preferences. Use the same browser profile to return to them. |
| **Progress downloads** | Business and Economics offer CSV exports. Biology, PyQuest, MathQuest and Vertex Maths offer local backups, and RM Revise can create a personal sync link. Subject backups keep study data and gear separate from GIS Points. |
| **AI marking** | The Business and Economics markers process your answers in the browser. The first use may fetch model and software files from external hosts. |

Fresh is an independent revision resource. Check the syllabus for your exam year and use the official mark schemes for final exam guidance. [Fresh privacy notice](https://gisfresh.me/privacy.html) · [Cambridge IGCSE subject directory](https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-upper-secondary/cambridge-igcse/subjects/)

## Run Fresh locally

From the repository root, start a local HTTP server with Python 3 and open [localhost:8000](http://localhost:8000/).

```sh
python -m http.server 8000
```

To assemble the static site and run the Biology regression checks with a current Node.js version, use the following commands. The tests check routing, study data, points and build output.

```sh
node build.mjs
node --test tests/biology/integration.test.mjs tests/biology/study.test.mjs
```

## Project layout

| File or folder | What it contains |
| --- | --- |
| [`index.html`](index.html) · [`home.css`](home.css) · [`search.js`](search.js) | Homepage, subject cards and filters |
| [`subjects/science.html`](subjects/science.html) · [`subjects/science.css`](subjects/science.css) | The shared Biology, Chemistry and Physics entry page |
| [`subjects/biology/`](subjects/biology/) | Biology study app, virtual practicals and the Fresh integration |
| [`subjects/business/`](subjects/business/) · [`subjects/economics/`](subjects/economics/) | EcBiz study tools and browser marking code |
| [`gis-points.js`](gis-points.js) | The browser-local GIS Points balance and activity panel |
| [`subjects.json`](subjects.json) · [`build.py`](build.py) | Subject metadata and the original starter-page generator |
| [`build.mjs`](build.mjs) · [`CNAME`](CNAME) | Static build output and GitHub Pages domain |

## Contribute

Fresh grows through student contributions. To report an issue, include the subject, page or question, and what you expected. For a content fix, link the source that supports it. If you used AI while preparing a change, describe the part it helped with and how you checked the result. This makes it easier for the next student to review and build on your work. [Fresh GitHub issues](https://github.com/206713-dotcom/fresh/issues)
