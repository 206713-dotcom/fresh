# SCHEMA, MATH & GROUNDING AUDITOR BRIEF (TECH-AUD)
You verify everything the syllabus auditors cannot. You may use the deterministic gatekeeper, but you must ALSO independently recalculate by hand — the gatekeeper is a floor, not a ceiling.

## READ
- The 10 set files assigned to you (paths in your task).
- `C:\Users\jayde\Documents\GitHub\fresh\paper2\prompts\generator_brief.md` for canonical labels/phrasings.

## PROCEDURE (per set)
1. **Run the gatekeeper on JUST your 10 sets**: copy them to a temp dir or run with `--sets-dir` on a staging folder containing symlinks/copies — simplest: `& "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe" C:\Users\jayde\Documents\GitHub\fresh\paper2\scripts\gatekeeper.py --sets-dir <staged-dir-of-your-10>` where you first create the staging dir and copy the 10 files into it. Paste the gatekeeper block for each set into your report verbatim. If a set FAILS the gatekeeper ⇒ REJECTED, include its errors verbatim.
2. **Independent recalculation** (even for gatekeeper-PASS sets): re-derive break-even output, margin of safety, ATC, contribution, labour productivity from the stem (FC ÷ (SP − VC)); re-derive Appendix 2 ratios (liquidity: CA = Inventories + Trade receivables + Cash; CR = CA/CL; acid = (CA − Inventories)/CL. Profitability: GPM = GP/Rev×100; PM = OpProfit/Rev×100; ROCE = OpProfit/Capital employed×100). Show the arithmetic in your report. Any discrepancy > tolerance ⇒ REJECTED.
3. **JSON structure**: exact keys at every level (see exemplar); 8 questions 1(a)…4(b); marks 8/12/8/12/8/12/8/12; 3(a) sub_parts (i)2 (ii)2 (iii)4; unit = "Paper 2 Case Study"; title/headers/rows exact (`["Financial Metric","2024","2025"]`).
4. **Appendix completeness**: main_stem 110–145 words named business with initials/legal structure/sector/workforce/leadership/capital cost/finance/fixed+variable costs/output/operational problem; appendix 1 ≥4 numeric metrics; appendix 2 six rows 2024 vs 2025 with canonical labels; appendix 3 THREE changes with percentages/figures; appendix 2 gross profit = revenue − cost of sales (profitability sets).
5. **Deterministic grounding**: for EVERY question, each valid_app_words entry (5–8) MUST appear case-insensitively as substring in (a) the combined insert for 1(a),1(b),2(a),2(b),4(a),4(b); (b) insert OR that question's model_answer for 3(a)/3(b). Check by hand for the first 3 questions of each set you audit and state so.
6. **Uniqueness**: initials/names not duplicated within the wave directory `C:\Users\jayde\Documents\GitHub\fresh\paper2\sets\wave_XX` nor in `waves/` outputs nor in other generators' folders (list the sibling folders you checked).
7. **Marking keys**: 5–8 entries, all strings, verbatim-verbatim; no invented values.

## OUTPUT (write exactly one file)
`C:\Users\jayde\Documents\GitHub\fresh\paper2\audits\wave_XX\<AUDITOR-ID>.md`
Contains: gatekeeper verbatim output; per-set recalculation arithmetic; per-set verdict table.
Then print ONLY one line per set to your reply:
`P2_SET_101: APPROVED_BY_TECH_AUD` or `P2_SET_101: REJECTED — <one-line reason>`.
Do NOT fix sets. Do NOT approve a set that fails any single check.
