# 0264 Paper 2 — 400-Set Pipeline

Goal: 400 syllabus-compliant 80-mark Paper 2 Case Study sets for Cambridge IGCSE Business (0264), 2027–2029 syllabus, Waves 01–10 of 40 sets each.

## Directory layout
```
paper2/
  scripts/gatekeeper.py        deterministic Python gate (Section 4)
  prompts/generator_brief.md   binding contract for generators
  prompts/syl_auditor_brief.md Tier 2A adversarial syllabus audit
  prompts/tech_auditor_brief.md Tier 2B schema/math/grounding audit
  prompts/syllabus_rules.md    whitelist/blacklist + Paper 2 rules
  prompts/example_set.json     gold exemplar (reference only, not a wave set)
  sets/wave_XX/P2_SET_###.json individual UNVERIFIED sets (written by GEN agents)
  audits/wave_XX/<AUDITOR>.md  audit reports
  waves/0264_Paper_2_Wave_XX.json  combined 40-set release (gatekeeper-passed only)
```

## 16-subagent topology per wave
| Tier | IDs | Assignment |
|------|-----|------------|
| GEN-01 Food/Beverage/Agribusiness | 5 sets | Sets 101–105 (W01) etc., liquidity Appendix 2 |
| GEN-02 Manufacturing & Industrial | 5 sets | … liquidity |
| GEN-03 Retail, Fashion & E-Commerce | 5 sets | … liquidity |
| GEN-04 Hospitality, Leisure & Tourism | 5 sets | … liquidity |
| GEN-05 Transport, Logistics & Energy | 5 sets | … profitability Appendix 2 |
| GEN-06 Technology, Software & Digital | 5 sets | … profitability |
| GEN-07 Healthcare, Education & Consumer Services | 5 sets | … profitability |
| GEN-08 Primary Extraction, Construction & Eco-Materials | 5 sets | … profitability |
| SYL-AUD-09 | GEN-01, GEN-05 | syllabus/hallucination |
| SYL-AUD-10 | GEN-02, GEN-06 | syllabus/hallucination |
| SYL-AUD-11 | GEN-03, GEN-07 | syllabus/hallucination |
| SYL-AUD-12 | GEN-04, GEN-08 | syllabus/hallucination |
| TECH-AUD-13 | GEN-01, GEN-08 | schema/math/grounding |
| TECH-AUD-14 | GEN-02, GEN-07 | schema/math/grounding |
| TECH-AUD-15 | GEN-03, GEN-06 | schema/math/grounding |
| TECH-AUD-16 | GEN-04, GEN-05 | schema/math/grounding |

Cross-pairing is orthogonal: each set is audited by one SYL-AUD and one TECH-AUD, and the GEN↔auditor mapping differs between the two tiers.

## Release procedure (per wave)
1. Spawn 8 GEN agents → they write UNVERIFIED sets.
2. Spawn 8 auditors → per-set APPROVED/REJECTED verdicts with error logs.
3. Fix loop: each REJECTED set re-summons the responsible GEN (with the audit log); re-audit until clean or 3 strikes → escalate to human.
4. Run: `python scripts/gatekeeper.py --wave XX --sets-dir sets/wave_XX --combine` → writes `waves/0264_Paper_2_Wave_XX.json` ONLY if all 40 pass.
5. Gatekeeper enforces: exact schema & keys, 8 questions/80 marks, 3(a) sub-parts, main_stem 110–145 words, ≥4 metrics in App1, 6-row App2 (2024 vs 2025, GP consistency for profitability), ≥3 figures in App3, ratio re-computation (CR/AT or GPM/PM/ROCE) with tolerance, 3(a) recalculation, verbatim `valid_app_words` grounding, evaluative command-word pattern, part (a) application, business-initial uniqueness across waves, scenario-id uniqueness.

## Python
Gatekeeper requires CPython 3.10+. Installed via winget at `%LOCALAPPDATA%\Programs\Python\Python312\python.exe`. If PATH doesn't include `python`, call it by full path.
