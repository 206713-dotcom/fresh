#!/usr/bin/env python3
"""
Tier 3 deterministic Video Validation Gatekeeper.

Collects only shards carrying BOTH auditor approvals, verifies schema, pacing,
timing continuity, blacklist compliance and visual-density rules, then merges
the survivors into subjects/business/data/videos_manifest.json.

This script NEVER approves content by itself: a shard is eligible only when
audit_syl_u{N}.json says APPROVED_BY_SYL_AUD AND audit_vis_u{N}.json says
APPROVED_BY_VIS_AUD. All other work here is mechanical verification/repair.

Usage:
    python tools/video_gatekeeper.py            # validate + merge
    python tools/video_gatekeeper.py --check    # validate only, no writes
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SHARDS = ROOT / "tmp_shards"
DATA = ROOT / "data"
MANIFEST = DATA / "videos_manifest.json"
REPORT = DATA / "video_validation_report.json"

EXPECTED_FILES = [
    f"vid_u{u:01d}_{i:02d}.json"
    for u, count in [(1, 5), (2, 4), (3, 4), (4, 4), (5, 5), (6, 3)]
    for i in range(1, count + 1)
]

TOP_KEYS = {
    "video_id", "unit_number", "unit_title", "chapter_code", "chapter_title",
    "video_title", "target_duration_sec", "status", "learning_objectives",
    "scenes", "end_of_video_recap_quiz",
}
SCENE_KEYS = {
    "scene_number", "start_sec", "end_sec", "visual_type", "on_screen_title",
    "on_screen_labels", "animation_directives", "voiceover_script",
    "word_count", "syllabus_concepts_tagged",
}
VALID_VISUAL_TYPES = {
    "animated_scenario_hook", "flow_diagram", "interactive_graph_build",
    "split_screen_comparison", "org_chart_morph", "funnel_animation",
    "curve_reveal", "formula_substitution", "timeline_animation",
    "evaluation_split", "recap_quiz", "cycle_animation", "map_reveal",
    "balance_scale", "counter_animation", "comparison_grid",
}
BANNED_VISUAL_TYPES = {"text_slide", "bullet_list", "title_card_only"}

BLACKLIST = [
    "mcgregor", "theory x", "theory y", "mayo", "hawthorne", "ansoff",
    "boston matrix", "bcg", "critical path", "investment appraisal",
    "npv", "net present value", "accounting rate of return",
    "payback period", "internal rate of return", "mendelow",
    "porter's five forces", "porter", "decision tree",
    "share price maximisation", "shareholder value analysis",
    "ped formula", "price elasticity of demand =", "ped =",
    "elasticity calculation", "a-level", "9609", "0450",
    "balance sheet", "profit and loss account", "acid test ratio",
]
# "ARR" and "CPA" are checked as whole tokens to avoid false positives on words.
BLACKLIST_RE = [
    re.compile(r"\barr\b", re.I),
    re.compile(r"\bcpa\b", re.I),
    re.compile(r"\bswot analysis\b", re.I),
    re.compile(r"capital employed\s*=", re.I),  # only banned in Unit 6 context
]

MIN_WPS, MAX_WPS = 2.25, 2.60          # 135–156 words per minute
MIN_SCENE, MAX_SCENE = 8, 40
MAX_LABEL_WORDS, MAX_TITLE_WORDS = 18, 12
HEX_RE = re.compile(r"^#[0-9A-F]{6}$")


def words(text: str) -> list[str]:
    """Canonical word tokenisation: split on whitespace, trim edge punctuation."""
    out = []
    for token in str(text or "").split():
        trimmed = re.sub(r"^[^\w$%]+|[^\w$%]+$", "", token, flags=re.UNICODE)
        if trimmed:
            out.append(trimmed)
    return out


def blacklist_hits(text: str, unit: int | None = None) -> list[str]:
    low = str(text or "").lower()
    hits = [term for term in BLACKLIST if term in low]
    for rx in BLACKLIST_RE[:3]:
        if rx.search(str(text or "")):
            hits.append(rx.pattern)
    if unit == 6 and re.search(r"capital employed\s*=", str(text or ""), re.I):
        hits.append("capital employed = (Unit 6)")
    return sorted(set(hits))


def all_text(shard: dict) -> str:
    parts = [shard.get("video_title", ""), " ".join(shard.get("learning_objectives", []))]
    quiz = shard.get("end_of_video_recap_quiz", {})
    parts += [quiz.get("question", ""), " ".join(map(str, quiz.get("options", []))),
              quiz.get("visual_explanation", "")]
    for sc in shard.get("scenes", []):
        parts += [sc.get("on_screen_title", ""), " ".join(map(str, sc.get("on_screen_labels", []))),
                  sc.get("voiceover_script", ""), " ".join(map(str, sc.get("syllabus_concepts_tagged", [])))]
        ad = sc.get("animation_directives", {})
        parts.append(json.dumps(ad, ensure_ascii=False))
    return "\n".join(parts)


def validate_shard(name: str, shard: dict, seen_ids: set[str], seen_cases: set[str]) -> tuple[list[str], dict]:
    errors: list[str] = []
    repairs: dict = {"word_count_corrections": []}

    # --- top-level schema -------------------------------------------------
    missing = TOP_KEYS - set(shard)
    extra = set(shard) - TOP_KEYS
    if missing:
        errors.append(f"missing top-level keys: {sorted(missing)}")
    if extra:
        errors.append(f"unexpected top-level keys: {sorted(extra)}")
    if shard.get("status") != "UNVERIFIED":
        errors.append(f"status must be UNVERIFIED at gatekeeper input, got {shard.get('status')!r}")
    vid = shard.get("video_id")
    if vid in seen_ids:
        errors.append(f"duplicate video_id {vid}")
    seen_ids.add(vid)
    unit = shard.get("unit_number")
    if not isinstance(unit, int) or not 1 <= unit <= 6:
        errors.append("unit_number must be int 1..6")
    duration = shard.get("target_duration_sec")
    if not isinstance(duration, int) or not 180 <= duration <= 300:
        errors.append(f"target_duration_sec {duration!r} outside 180..300")
    if not isinstance(shard.get("learning_objectives"), list) or len(shard["learning_objectives"]) < 3:
        errors.append("need at least 3 learning_objectives")
    if not re.fullmatch(r"VID_U[1-6]_\d{2}", str(vid or "")):
        errors.append(f"malformed video_id {vid!r}")
    elif unit in (1, 2, 3, 4, 5, 6):
        expected_id = f"VID_U{unit:01d}_{int(name[-7:-5]):02d}"
        if vid != expected_id:
            errors.append(f"video_id {vid!r} does not match expected {expected_id!r} for {name}")

    # --- blacklist --------------------------------------------------------
    hits = blacklist_hits(all_text(shard), unit)
    if hits:
        errors.append("BLACKLIST hits: " + ", ".join(hits))

    # --- global uniqueness of case names ---------------------------------
    case = shard.get("video_title", "")
    if case in seen_cases:
        errors.append(f"duplicate case/video title {case!r}")
    seen_cases.add(case)

    # --- quiz -------------------------------------------------------------
    quiz = shard.get("end_of_video_recap_quiz", {})
    if not isinstance(quiz.get("options"), list) or len(quiz["options"]) != 4:
        errors.append("recap quiz needs exactly 4 options")
    if not isinstance(quiz.get("correct_index"), int) or not 0 <= quiz["correct_index"] <= 3:
        errors.append("recap quiz correct_index must be 0..3")
    if len(str(quiz.get("visual_explanation", "")).strip()) < 15:
        errors.append("recap quiz visual_explanation too short")

    # --- scenes -----------------------------------------------------------
    scenes = shard.get("scenes", [])
    if not 6 <= len(scenes) <= 9:
        errors.append(f"scene count {len(scenes)} outside 6..9")
    cursor = 0
    total_words = 0
    for idx, sc in enumerate(scenes, 1):
        tag = f"scene {idx}"
        if set(sc) != SCENE_KEYS:
            errors.append(f"{tag}: key mismatch {sorted(set(sc) ^ SCENE_KEYS)}")
            continue
        if sc["scene_number"] != idx:
            errors.append(f"{tag}: scene_number {sc['scene_number']} != {idx}")
        s, e = sc["start_sec"], sc["end_sec"]
        if s != cursor:
            errors.append(f"{tag}: start_sec {s} breaks continuity (expected {cursor})")
        if not isinstance(e, (int, float)) or not isinstance(s, (int, float)):
            errors.append(f"{tag}: non-numeric timings")
            continue
        if not MIN_SCENE <= e - s <= MAX_SCENE:
            errors.append(f"{tag}: duration {e - s}s outside {MIN_SCENE}..{MAX_SCENE}s")
        cursor = e
        vt = sc.get("visual_type")
        if vt in BANNED_VISUAL_TYPES or not re.fullmatch(r"[a-z][a-z0-9_]*", str(vt or "")):
            errors.append(f"{tag}: visual_type {vt!r} is not a concrete snake_case visualization primitive")
        if len(words(sc.get("on_screen_title", ""))) > MAX_TITLE_WORDS:
            errors.append(f"{tag}: on_screen_title exceeds {MAX_TITLE_WORDS} words")
        labels = sc.get("on_screen_labels", [])
        if not isinstance(labels, list) or not labels:
            errors.append(f"{tag}: on_screen_labels must be a non-empty array")
        else:
            for li, label in enumerate(labels):
                if len(words(label)) > MAX_LABEL_WORDS:
                    errors.append(f"{tag}: label {li+1} exceeds {MAX_LABEL_WORDS} words")
        ad = sc.get("animation_directives", {})
        if not isinstance(ad.get("layout"), str) or not isinstance(ad.get("camera_motion"), str):
            errors.append(f"{tag}: animation_directives needs layout + camera_motion strings")
        if not isinstance(ad.get("elements"), list) or not ad["elements"]:
            errors.append(f"{tag}: animation_directives.elements must be non-empty")
        if e - s > 15:
            beats = ad.get("visual_beats")
            if not isinstance(beats, list) or len(beats) < 2:
                errors.append(f"{tag}: scene >15s requires animation_directives.visual_beats")
            else:
                marks = [b.get("at_sec") for b in beats if isinstance(b, dict)]
                marks = sorted(m for m in marks if isinstance(m, (int, float)))
                if not marks or marks[0] > s + 15 or any(b - a > 15 for a, b in zip(marks, marks[1:])):
                    errors.append(f"{tag}: visual_beats are missing or spaced >15s")
                if marks and marks[-1] > e:
                    errors.append(f"{tag}: visual_beats extend past scene end")
        # word count + pacing
        actual = len(words(sc.get("voiceover_script", "")))
        total_words += actual
        declared = sc.get("word_count")
        if declared != actual:
            repairs["word_count_corrections"].append(
                {"scene": idx, "declared": declared, "actual": actual}
            )
            sc["word_count"] = actual  # deterministic metadata repair only
        wps = actual / max(e - s, 1)
        if not MIN_WPS <= wps <= MAX_WPS:
            errors.append(f"{tag}: pacing {wps:.2f} w/s ({wps*60:.0f} wpm) outside 135..156 wpm")
        if not sc.get("syllabus_concepts_tagged"):
            errors.append(f"{tag}: no syllabus_concepts_tagged")
    if scenes and cursor != duration:
        errors.append(f"last scene ends at {cursor}s, target is {duration}s")
    if total_words and not 180 * MIN_WPS <= total_words <= 300 * MAX_WPS:
        errors.append(f"total words {total_words} inconsistent with runtime")

    # AO coverage heuristic
    voice = " ".join(sc.get("voiceover_script", "") for sc in scenes).lower()
    for token in ["because", "therefore", "so "]:
        if token in voice:
            break
    else:
        errors.append("no causal chain marker (because/therefore) in voiceover")
    if not any(k in voice for k in ["advantage", "benefit", "however", "limitation", "disadvantage", "drawback", "on the other hand", "on one side", "on the other side", "trade-off", "whereas", "on the plus side", "the downside", "but ", "while ", "although ", "pros and cons"]):
        errors.append("no two-sided evaluation marker in voiceover")

    return errors, repairs


def load_audit(unit: int, prefix: str) -> dict | None:
    # Accept both the spec form (audit_syl_u1.json) and zero-padded form.
    path = SHARDS / f"audit_{prefix}_u{unit}.json"
    if not path.exists():
        path = SHARDS / f"audit_{prefix}_u{unit:02d}.json"
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return None


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true", help="validate only; do not write manifest")
    args = ap.parse_args()

    SHARDS.mkdir(parents=True, exist_ok=True)
    audit_cache: dict[int, tuple[dict | None, dict | None]] = {
        u: (load_audit(u, "syl"), load_audit(u, "vis")) for u in range(1, 7)
    }

    all_results = []
    approved: list[dict] = []
    seen_ids: set[str] = set()
    seen_cases: set[str] = set()

    for name in EXPECTED_FILES:
        path = SHARDS / name
        result = {"file": name, "errors": [], "repairs": {}, "decision": ""}
        if not path.exists():
            result["errors"].append("shard file missing")
            result["decision"] = "MISSING"
            all_results.append(result)
            continue
        try:
            shard = json.loads(path.read_text(encoding="utf-8"))
        except Exception as exc:
            result["errors"].append(f"invalid JSON: {exc}")
            result["decision"] = "INVALID_JSON"
            all_results.append(result)
            continue
        unit = shard.get("unit_number") if isinstance(shard.get("unit_number"), int) else 0
        errors, repairs = validate_shard(name, shard, seen_ids, seen_cases)
        result["errors"] = errors
        result["repairs"] = repairs

        syl, vis = audit_cache.get(unit, (None, None))
        syl_verdict = (syl or {}).get("verdict")
        vis_verdict = (vis or {}).get("verdict")
        syl_shard = ((syl or {}).get("shards") or {}).get(name, {}).get("verdict")
        vis_shard = ((vis or {}).get("shards") or {}).get(name, {}).get("verdict")
        audit_ok = (syl_verdict == "APPROVED_BY_SYL_AUD" and
                    vis_verdict == "APPROVED_BY_VIS_AUD" and
                    syl_shard == "APPROVED_BY_SYL_AUD" and
                    vis_shard == "APPROVED_BY_VIS_AUD")
        if not audit_ok:
            errors.append(
                f"auditor approval missing (syl={syl_verdict}/{syl_shard}, vis={vis_verdict}/{vis_shard})"
            )
        if errors:
            result["decision"] = "REJECTED"
        else:
            result["decision"] = "APPROVED"
            shard["status"] = "APPROVED"
            shard["audits"] = {
                "syllabus": "APPROVED_BY_SYL_AUD",
                "visual_math_render": "APPROVED_BY_VIS_AUD",
                "gatekeeper": "PASS",
            }
            approved.append(shard)
            # Persist deterministic word_count repairs back to the shard copy.
            if repairs["word_count_corrections"]:
                path.write_text(json.dumps(shard, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        all_results.append(result)

    by_unit = {}
    for r in all_results:
        u = int(r["file"][5])  # "vid_u1_01.json" -> "1"
        by_unit.setdefault(u, []).append(r)

    report = {
        "gatekeeper": "video_gatekeeper.py",
        "syllabus": "Cambridge IGCSE Business 0264 (2027–2029)",
        "expected_videos": len(EXPECTED_FILES),
        "approved_videos": len(approved),
        "rejected_videos": len(EXPECTED_FILES) - len(approved),
        "results": all_results,
    }

    if args.check:
        print(json.dumps(report, indent=2, ensure_ascii=False))
        return 0 if len(approved) == len(EXPECTED_FILES) else 1

    DATA.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    manifest = {
        "schema_version": "1.0",
        "syllabus": "Cambridge IGCSE Business 0264 (2027–2029)",
        "title": "Concept-visualization video library",
        "description": "Scene-by-scene animated business simulations. Every entry passed Tier 2A, Tier 2B and the Tier 3 deterministic gatekeeper.",
        "video_count": len(approved),
        "videos": approved,
    }
    MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(f"Gatekeeper: {len(approved)}/{len(EXPECTED_FILES)} videos approved.")
    for u in range(1, 7):
        rs = by_unit.get(u, [])
        ok = sum(1 for r in rs if r["decision"] == "APPROVED")
        print(f"  Unit {u}: {ok}/{len(rs)} approved")
        for r in rs:
            if r["decision"] != "APPROVED":
                print(f"    REJECT {r['file']}: {'; '.join(r['errors'][:4])}")
    print(f"Wrote {MANIFEST.relative_to(ROOT)} and {REPORT.relative_to(ROOT)}")
    return 0 if len(approved) == len(EXPECTED_FILES) else 1


if __name__ == "__main__":
    sys.exit(main())
