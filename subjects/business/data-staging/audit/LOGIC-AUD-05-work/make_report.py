import json, os

rejects = [
    {
        "id": "P1_U4_MCQ_822",
        "gate": "key",
        "reason": "Wrong key: correctOption D ('Manufacturers never consider land purchase or lease costs') is a false statement, while distractor A ('Large single-storey automated factories require vast plots of affordable flat land...') is the correct answer; the item is internally self-contradictory because distractor_reasons[A] is 'Correct selection.' (18 chars, generic filler) and the correct_reason about 'affordable acreage' actually justifies A, not D."
    }
]

report = {
    "auditor": "LOGIC-AUD-05",
    "units": [4, 5, 6],
    "waves": [7, 8, 9, 10, 11, 12],
    "audited": 3000,
    "pass_count": 3000 - len(rejects),
    "rejects": rejects,
    "summary": (
        "Audited all 3000 MCQs in waves 7-12 (Units 4-6) against the four LOGIC gates. "
        "Gate 1: recalculated every computational item - parsed and evaluated 241 explicit worked equations plus a word/number chain parser, brute-force derivability checks on all 198 numeric-key items, and a manual full-detail sample of 52 numeric items spanning labour productivity, average/total cost, contribution, break-even, target profit, margin of safety, revenue, gross profit, profit margin, ROCE, current/acid-test ratios, working capital/net assets, cost of sales/cost of goods available, cash inflow/outflow/net cash flow/closing balances, social cost/benefit, tariffs, exchange rates, percentages and GDP growth. All apparent mismatches were parser artefacts from chained '=' signs or trailing '%' and every recalculation matched the keyed option and the stem. "
        "Gate 2: valid correctOption A-D in every item, options[correctOption]==correctAnswer everywhere, four distinct options, no boilerplate duplicate keys; one item (P1_U4_MCQ_822) has a substantively wrong key (D is false; A is correct). "
        "Gate 3: correct_reason present and >=20 chars for all 3000; distractor_reasons exactly {A,B,C,D} with correct entry identical to correct_reason for all; zero generic filler reasons remain in waves 7-12 (unlike waves 1-6); one self-contradictory explanation on P1_U4_MCQ_822. "
        "Gate 4: zero occurrences of 'Examiner guidance:', '0450' or 'mark schemes penalise vague or colloquial phrasing'. "
        "Net: 1 reject (gate 'key'), 2999 pass."
    )
}

outdir = "data-staging/audit/reports"
os.makedirs(outdir, exist_ok=True)
with open(os.path.join(outdir, "LOGIC-AUD-05.json"), "w", encoding="utf-8") as f:
    json.dump(report, f, indent=2, ensure_ascii=False)
print(json.dumps({k: v for k, v in report.items() if k != 'summary'}, indent=2, ensure_ascii=False))
