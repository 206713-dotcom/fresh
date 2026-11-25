# First Language English (0500) implementation checklist

## Delivered

- [x] Keep the existing subject entry point and scope the new interface and browser storage to First Language English.
- [x] Check the Paper 1 and Paper 2 structure, timing, word guidance and mark allocations against the 2027–2029 syllabus and updated specimen materials.
- [x] Cover the written papers’ task types in 12 original exercises, including four composition choices. The comprehension drill uses four practice marks, and the original source texts are shorter than those in a full paper.
- [x] Include source material where relevant, worked examples or excerpts, and task-specific self-marking criteria.
- [x] Add per-task draft saving, word counts, practice timers, text downloads and review tracking.
- [x] Add experimental on-device AI feedback using task-specific criteria and best-fit band guidance. Validate mark bounds and require verbatim answer evidence for positive marks.
- [x] Keep manual review usable when the AI model or WebGPU is unavailable.
- [x] Add a persistent R1–R5 and W1–W5 confidence checklist with links to exercises, plus a persistent light/dark control.
- [x] Add a Reading Lab with exact-phrase highlighting, draft analysis and a personal mistake notebook.
- [x] Add three compare-and-improve workshop activities for writer’s effects, directed writing and descriptive writing, with persistent drafts and links to practice.
- [x] Display objective mappings, the practice rubric version and direct specimen mark-scheme links in the practice workspace.
- [x] Verify mark allocation, Unicode word counting, and mark and evidence validation with `node --test tests/english-0500.test.mjs`.
- [x] Exercise all task selections, self-marking, draft persistence, review tracking, timer controls, draft downloads, mobile layout and AI fallback in Chromium.

- [x] Build the complete Fresh checkout and smoke-test nine site routes. In Chromium, check learning-tool persistence, dark mode, deep links and layouts at 320, 390 and 1440 pixels.

## Pending

- [ ] Finish the plan's sidebar, global search, personalised overview, mobile passage/editor tabs, exam mode, full writing portfolio and draft comparisons.
- [ ] Build the examiner case library, Examiner Lab, authorised anchor retrieval, independent rescoring, appeals, feedback history and teacher moderation.
- [ ] Finish advanced learning tools. The Reading Lab has four original passages and persistent editable annotations. Draft analysis covers counts, sentence-length bands, distinct word ratio and repeated words. The notebook supports manual notes and resolved status. Passage filtering, richer writing analysis, automated error tracking, the personal AI tutor, full-length composition comparisons, adaptive pathways and visual prompts remain pending.
- [ ] Build school-controlled accounts, peer marking, teacher tools, offline revision, custom mocks and the study planner.
- [ ] Validate the on-device marker against teacher-scored anchor scripts across the full mark range. The site labels AI marks as practice estimates while examiner agreement is unmeasured.
- [ ] Test successful live marking across representative WebGPU devices. The first model download requires connectivity, and hardware support varies by device.
- [ ] Add full-length mock papers and dedicated practice for the coursework and speaking routes. The course guide currently explains both routes.

## Content inventory

| Target in the brief | Delivered | Shortfall |
| --- | ---: | ---: |
| Full lessons | 0 of 79 | 79 |
| Fully specified question-bank items | 0 of 2,300 | 2,300 |
| Annotated model answers | 0 of 200 | 200 |
| Vocabulary entries | 0 of 1,000 | 1,000 |
| Flashcards | 0 of 500 | 500 |
| Full mocks | 0 of 30 | 30 |
| Revision games | 0 of 5 | 5 |
| Specialised tools meeting all acceptance criteria | 0 of 12 | 12 |

The branch includes 12 original practice drills with answers or excerpts and six short revision notes. The drills cover all written task types but lack the complete metadata, independent answer review and full responses required by the question-bank specification.

## Verification and dependencies

Run the static build from the repository root with `node build.mjs`. Serve `dist/` over localhost or HTTPS. Run the automated tests with `node --test tests/english-0500.test.mjs`.

The Chromium test environment reached the on-device model download with WebGPU enabled and then hit its browser storage quota. No live inference result or examiner agreement was measured. Examiner calibration requires compatible, authorised anchor scripts and a separate independently teacher-marked evaluation set. The branch bundles original practice material and links to Cambridge resources. It contains no examiner scripts or official candidate marks.

## Cambridge references

- [2027–2029 syllabus](https://www.cambridgeinternational.org/Images/718783-2027-2029-syllabus.pdf)
- [2027 specimen Paper 1 mark scheme](https://www.cambridgeinternational.org/Images/718838-2027-specimen-paper-1-mark-scheme.pdf)
- [2027 specimen Paper 2 mark scheme](https://www.cambridgeinternational.org/Images/718839-2027-specimen-paper-2-mark-scheme.pdf)
- [October 2026 specimen update notice](https://www.cambridgeinternational.org/Images/765261-2027-specimen-materials-update-notice.pdf)
