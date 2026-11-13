# EcBiz Economics games

Open `subjects/economics-games.html#games` or choose Games in the Economics navigation. The game routes end in `/island`, `/market`, `/policy`, `/trade` and `/escape`.

EcBiz serves static assets on GitHub Pages. Games use browser-local storage for unfinished sessions and personal bests. There are no database tables, migrations, account changes or external runtime services. Reverting the release commit removes the navigation link and game files. The existing Economics features use separate storage.

## Coverage and content

| Game | Initial bank | Curriculum links |
|---|---:|---|
| Scarcity Island | 6 allocation events | 1.2, 1.3, 1.4 |
| Market Mayhem | 6 market events | 2.2, 2.3, 2.4, 2.5, 2.6 |
| Policy Panic | 6 crises and 5 policy choices | 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7 |
| Trade Tycoon | 6 fictional trading partners | 6.2, 6.3, 6.4 |
| Economics Escape Room | 19 puzzles | 1.2, 1.3, 1.4, 2.3, 2.4, 2.5, 2.6, 3.5, 3.6, 4.2, 4.6, 4.7, 5.1, 5.2, 5.3, 6.2, 6.3, 6.4 |

Original fictional scenarios aligned to the [Cambridge 0455 syllabus for 2027–2029](https://www.cambridgeinternational.org/Images/718148-2027-2029-syllabus.pdf). This release has a smaller bank than the brief targets and does not cover every syllabus subtopic. Market interventions, advanced trade and development strategies, per-topic mastery tracking and optional timers are outside this release. Challenge mode adds rounds or complexity where available.

Local JavaScript checks exercised 72 combinations of seed, round and mode across the five engines, including feasible allocations, market intersections, trade arithmetic, policy state and puzzle solutions.
