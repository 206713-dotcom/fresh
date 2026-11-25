# First Language English (0500) implementation checklist

## Delivered

- [x] Keep the existing subject entry point and scope the new interface and browser storage to First Language English.
- [x] Check the Paper 1 and Paper 2 structure, timing, word guidance and mark allocations against the 2027–2029 syllabus and updated specimen materials.
- [x] Cover the written papers’ task types in 12 original exercises, including four composition choices. The comprehension drill uses four practice marks, and the original source texts are shorter than those in a full paper.
- [x] Include source material where relevant, worked examples or excerpts, and task-specific self-marking criteria.
- [x] Add per-task draft saving, word counts, practice timers, text downloads and review tracking.
- [x] Add experimental on-device AI feedback using task-specific criteria and best-fit band guidance. Validate mark bounds and require verbatim answer evidence for positive marks.
- [x] Keep manual review usable when the AI model or WebGPU is unavailable.
- [x] Verify mark allocation, Unicode word counting, and mark and evidence validation with `node --test tests/english-0500.test.mjs`.
- [x] Exercise all task selections, self-marking, draft persistence, review tracking, timer controls, draft downloads, mobile layout and AI fallback in Chromium.

## Pending

- [ ] Reconcile this checklist with the complete plan from the earlier conversation once it is available.
- [ ] Validate the on-device marker against teacher-scored anchor scripts across the full mark range. The site labels AI marks as practice estimates while examiner agreement is unmeasured.
- [ ] Test successful live marking across representative WebGPU devices. The first model download requires connectivity, and hardware support varies by device.
- [ ] Add full-length mock papers and dedicated practice for the coursework and speaking routes. The course guide currently explains both routes.

## Cambridge references

- [2027–2029 syllabus](https://www.cambridgeinternational.org/Images/718783-2027-2029-syllabus.pdf)
- [2027 specimen Paper 1 mark scheme](https://www.cambridgeinternational.org/Images/718838-2027-specimen-paper-1-mark-scheme.pdf)
- [2027 specimen Paper 2 mark scheme](https://www.cambridgeinternational.org/Images/718839-2027-specimen-paper-2-mark-scheme.pdf)
- [October 2026 specimen update notice](https://www.cambridgeinternational.org/Images/765261-2027-specimen-materials-update-notice.pdf)
