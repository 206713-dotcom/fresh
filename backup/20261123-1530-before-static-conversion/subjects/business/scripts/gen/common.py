#!/usr/bin/env python3
"""Shared helpers for the 0264 expansion pipeline (Track A / B / C).

Reads the EXISTING banks read-only and builds duplicate-detection sets plus a
deterministic, collision-free business-name allocator.
"""
from __future__ import annotations

import json
import re
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]          # subjects/business
DATA = ROOT / "src" / "lib" / "data"
STAGING = ROOT / "data-staging" / "expansion"

UNITS = {
    1: "Unit 1: Understanding business activity",
    2: "Unit 2: People in business",
    3: "Unit 3: Marketing",
    4: "Unit 4: Operations management",
    5: "Unit 5: Financial information and decisions",
    6: "Unit 6: External influences on business activity",
}

# Legacy capitalisation used by the already-audited Paper 1 bank.
P1_UNITS = {
    1: "Unit 1: Understanding Business Activity",
    2: "Unit 2: People in Business",
    3: "Unit 3: Marketing",
    4: "Unit 4: Operations Management",
    5: "Unit 5: Financial Information and Decisions",
    6: "Unit 6: External Influences on Business Activity",
}

CHAPTERS = {
    1: ["1.1 Business activity", "1.2 Economic sectors", "1.3 Enterprise, business growth and size",
        "1.4 Types of business organisation", "1.5 Business objectives and stakeholder objectives"],
    2: ["2.1 Motivating employees", "2.2 Organisation and management",
        "2.3 Recruitment, selection and training", "2.4 Internal and external communication"],
    3: ["3.1 Marketing, competition and the customer", "3.2 Market research",
        "3.3 Marketing mix", "3.4 Marketing strategy"],
    4: ["4.1 Production of goods and services", "4.2 Technology and production of goods and services",
        "4.3 Sustainable production of goods and services",
        "4.4 Costs, scale of production and break-even analysis",
        "4.5 Quality of goods and services", "4.6 Location decisions"],
    5: ["5.1 Business finance", "5.2 Cash flow forecast", "5.3 Profit and loss",
        "5.4 Statement of financial position", "5.5 Analysis of accounts"],
    6: ["6.1 Economic issues", "6.2 Environmental and ethical issues",
        "6.3 Business and the international economy"],
}

BLACKLIST_TERMS = [
    "boston matrix", "cash cow", "cash dog", "star product", "problem child", "question mark",
    "stratified sampling", "systematic sampling", "cluster sampling", "convenience sampling",
    "snowball sampling", "push strategy", "pull strategy", "ansoff", "porter", "7 ps",
    "physical evidence", "ped formula", "mcgregor", "theory x", "theory y", "vroom",
    "expectancy theory", "mayo", "hawthorne", "adams equity", "mcclelland", "mintzberg",
    "belbin", "tuckman", "paternalistic", "hard hrm", "soft hrm", "zero-hours contract",
    "swot", "pestle", "pest analysis", "core competencies", "critical path", "network diagram",
    "decision tree", "expected monetary value", "emv", "economic order quantity", "eoq",
    "buffer inventory", "gearing", "inventory turnover", "receivables days", "payables days",
    "net present value", "npv", "internal rate of return", "irr", "payback period", "arr",
    "conglomerate", "0450", "examiner guidance", "mark schemes penalise",
]

BLACKLIST_PATTERNS = [(t, re.compile(r"(?<![a-z0-9])" + re.escape(t) + r"(?![a-z0-9])"))
                      for t in BLACKLIST_TERMS]


def money(v: float, dp: int = 0) -> str:
    if dp:
        return "${:,.{d}f}".format(v, d=dp)
    return "${:,.0f}".format(v)


def pct(v: float, dp: int = 1) -> str:
    return "{:.{d}f}%".format(v, d=dp)


def load_mcq(section: int) -> list[dict]:
    text = (DATA / f"mcq-bank-section{section}.ts").read_text(encoding="utf-8")
    m = re.search(r"=\s*(\[.*\]);?\s*$", text, re.S)
    return json.loads(m.group(1))


def load_p1() -> list[dict]:
    return json.loads((DATA / "paper1-database.json").read_text(encoding="utf-8"))


def load_p2() -> list[dict]:
    return json.loads((DATA / "paper2-database.json").read_text(encoding="utf-8"))


_NAME_RE = re.compile(r"([A-Z][A-Za-z&'’.\-]{2,}(?:\s+[A-Z][A-Za-z&'’.\-]{2,}){0,2})\s+"
                      r"(?:Ltd|Limited|Plc|PLC|Inc|Corp|Corporation|GmbH|LLC|Co)\b")


class ExistingIndex:
    """Read-only snapshot of the already-audited banks."""

    def __init__(self) -> None:
        self.mcqs = {s: load_mcq(s) for s in range(1, 7)}
        self.p1 = load_p1()
        self.p2 = load_p2()
        self.blob = " ".join(
            [json.dumps(self.mcqs, ensure_ascii=False),
             json.dumps(self.p1, ensure_ascii=False),
             json.dumps(self.p2, ensure_ascii=False)]
        ).lower()

        self.mcq_ids = {q["id"] for arr in self.mcqs.values() for q in arr}
        self.mcq_stems = {_norm(q["question"]) for arr in self.mcqs.values() for q in arr}
        self.p1_ids = {s["scenario_id"] for s in self.p1}
        self.p1_stems = {_norm(s["scenario_stem"]) for s in self.p1}
        self.p2_ids = {s["scenario_id"] for s in self.p2}
        self.p2_stems = {_norm(s["case_study_insert"]["main_stem"]) for s in self.p2}

        names = set()
        for src in (json.dumps(self.mcqs, ensure_ascii=False),
                    json.dumps(self.p1, ensure_ascii=False),
                    json.dumps(self.p2, ensure_ascii=False)):
            for n in _NAME_RE.findall(src):
                names.add(n[0].strip().lower())
        for s in self.p2:
            ms = re.search(r"\(([A-Z]{2,7})\)", s["case_study_insert"]["main_stem"])
            if ms:
                names.add(ms.group(1).lower())
        self.business_names = names

        self.p2_initials = {
            m.group(1)
            for s in self.p2
            for m in [re.search(r"\(([A-Z]{2,7})\)", s["case_study_insert"]["main_stem"])]
            if m
        }


def _norm(s: str) -> str:
    return re.sub(r"\s+", " ", s.strip().lower())


# ---------------------------------------------------------------- name factory
_PLACE_A = ["Ash", "Bel", "Cor", "Dun", "Elm", "Fen", "Gar", "Hal", "Ing", "Jar",
            "Kel", "Lor", "Mar", "Ner", "Oak", "Pen", "Quin", "Ros", "Sel", "Thorn",
            "Uld", "Val", "Wren", "Yar", "Zel", "Bran", "Cob", "Dray", "Ever", "Fal",
            "Glen", "Hurst", "Iver", "Juni", "Kirk", "Lark", "Moss", "Nor", "Orch", "Pine",
            "Reed", "Stan", "Tarn", "Umb", "Vine", "Whit", "Yew", "Zorn", "Beck", "Cliff",
            "Dale", "East", "Fern", "Gate", "Hol", "Inch", "Jade", "Knap", "Lime", "Mere"]
_PLACE_B = ["field", "ford", "bury", "mere", "wick", "dale", "ton", "hurst", "combe", "stead",
            "bridge", "croft", "gate", "holm", "ley", "moor", "port", "ridge", "shaw", "thorpe",
            "vale", "well", "worth", "by", "don", "ham", "hill", "kirk", "land", "March",
            "ness", "pool", "row", "sea", "side", "stock", "view", "wood", "yard", "bank"]
_TRADE = ["Textiles", "Foods", "Furniture", "Ceramics", "Brewing", "Dairy", "Bakery",
          "Hardware", "Timber", "Printing", "Chemicals", "Plastics", "Packaging", "Metals",
          "Electronics", "Fashion", "Footwear", "Pharmacy", "Optics", "Toys", "Sports",
          "Cycles", "Motors", "Marine", "Aviation", "Rail", "Logistics", "Couriers",
          "Hotels", "Catering", "Cafes", "Tours", "Tickets", "Software", "Systems",
          "Digital", "Media", "Publishing", "Studios", "Games", "Clinics", "Care",
          "Education", "Training", "Salons", "Spa", "Fitness", "Construction", "Quarrying",
          "Mining", "Energy", "Solar", "Recycling", "Water", "Waste", "Nurseries", "Orchards",
          "Vineyards", "Fisheries", "Poultry", "Rooftops", "Interiors", "Kitchens", "Lighting"]


class Names:
    """Deterministic, collision-free business names (checked against existing banks)."""

    def __init__(self, idx: ExistingIndex, sector_hint: str | None = None) -> None:
        self.idx = idx
        self.used: set[str] = set()
        self.sector_hint = sector_hint
        self._iter = self._stream()

    def _stream(self):
        for a in _PLACE_A:
            for b in _PLACE_B:
                base = a + b
                for t in _TRADE:
                    yield base, t

    def take(self, industry_word: str) -> tuple[str, str]:
        """Return (full_name, base_token)."""
        while True:
            base, trade = next(self._iter)
            if industry_word:
                trade = industry_word
            name = f"{base} {trade}"
            low = name.lower()
            if low in self.used or low in self.idx.business_names:
                continue
            if low in self.idx.blob:
                continue
            self.used.add(low)
            return name, base


def initials_for(name: str, used: set[str]) -> str:
    words = [w for w in re.split(r"\s+", name) if w.isalpha()]
    letters = "".join(w[0] for w in words[:3]).upper()
    if len(letters) < 2:
        letters = (letters + "XY")[:2]
    while letters in used:
        letters = letters[:-1] + chr(ord(letters[-1]) + 1 if letters[-1] < "Z" else 65)
    used.add(letters)
    return letters


def seeded(item_index: int, salt: str = "") -> random.Random:
    return random.Random(f"0264|{salt}|{item_index}")


def json_dump(path: Path, obj) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, indent=2, ensure_ascii=False), encoding="utf-8")
