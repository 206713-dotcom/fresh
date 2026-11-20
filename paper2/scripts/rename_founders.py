#!/usr/bin/env python3
"""Deterministic one-off rename of duplicated founder names / one business prefix.
Exact-string, case-preserving replacement inside each file's raw text, then JSON re-parse."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

RENAMES = [
    # wave_01
    ("sets/wave_01/P2_SET_101.json", [("Priya Raman", "Leila Haddad")]),
    ("sets/wave_01/P2_SET_106.json", [("Daniel Okafor", "Marcus Whitfield")]),
    ("sets/wave_01/P2_SET_107.json", [("Priya Raman", "Sunita Rao")]),
    ("sets/wave_01/P2_SET_118.json", [("Priya Raman", "Meera Kapoor")]),
    ("sets/wave_01/P2_SET_122.json", [("Priya Raman", "Devika Menon")]),
    ("sets/wave_01/P2_SET_126.json", [("Priya Raman", "Ananya Iyer")]),
    ("sets/wave_01/P2_SET_127.json", [("Daniel Okafor", "Elena Petrova"),
                                       ("Kestrel Managed IT Services", "Vireo Managed IT Services"),
                                       ("KMS", "VMS")]),
    ("sets/wave_01/P2_SET_135.json", [("Daniel Okafor", "Kwame Mensah")]),
    # wave_02
    ("sets/wave_02/P2_SET_147.json", [("Priya Raman", "Ramesh Kulkarni"), ("Daniel Okafor", "Tolu Adeyemi")]),
    ("sets/wave_02/P2_SET_157.json", [("Priya Raman", "Farah Qureshi")]),
    ("sets/wave_02/P2_SET_161.json", [("Daniel Okafor", "Idris Bakare")]),
    ("sets/wave_02/P2_SET_163.json", [("Priya Raman", "Nadia Karim")]),
    ("sets/wave_02/P2_SET_167.json", [("Priya Raman", "Chiara Bellucci")]),
]


def main():
    changed_total = 0
    for rel, pairs in RENAMES:
        f = ROOT / rel
        if not f.exists():
            print(f"MISSING: {rel}")
            continue
        raw = f.read_text(encoding="utf-8")
        new = raw
        for old, repl in pairs:
            new = new.replace(old, repl)
        json.loads(new)  # integrity check before writing
        if new != raw:
            f.write_text(new, encoding="utf-8")
            n = sum(raw.count(o) for o, _ in pairs)
            changed_total += n
            print(f"OK {rel}  ({n} replacements)")
        else:
            print(f"NO-OP {rel}")
    # verify none of the old strings survive anywhere
    for banned in ["Priya Raman", "Daniel Okafor", "Kestrel"]:
        hits = [str(p.relative_to(ROOT)) for p in ROOT.glob("sets/wave_*/*.json")
                if banned.lower() in p.read_text(encoding="utf-8").lower()]
        print(f"banned '{banned}' remaining in: {hits or 'NONE'}")
    print(f"Total replacements: {changed_total}")


if __name__ == "__main__":
    main()
