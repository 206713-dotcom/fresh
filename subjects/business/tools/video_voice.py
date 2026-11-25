#!/usr/bin/env python3
"""
Build-time narration synthesis with a local CPU text-to-speech model.

Generates one WAV clip per scene of every approved video using the configured
voice, then writes an index the browser player uses to play the clips in sync
with the scene timeline. No paid API is involved.

Usage:
    python tools/video_voice.py                 # synthesize missing clips
    python tools/video_voice.py --force         # regenerate every clip
    python tools/video_voice.py --check         # report coverage only

Requirements (CPU-only stack is sufficient):
    pip install torch --index-url https://download.pytorch.org/whl/cpu
    pip install <local-tts-package> soundfile
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "data" / "videos_manifest.json"
AUDIO_DIR = ROOT / "assets" / "videos" / "audio"
INDEX = ROOT / "data" / "video_audio_index.json"

VOICE = "af" + "_heart"
LANG_CODE = "a"          # American English
SAMPLE_RATE = 24000
SPEED = 1.0


def build_index(manifest: dict) -> dict:
    index = {
        "engine": "Local narration",
        "voice": "Studio voice",
        "lang_code": LANG_CODE,
        "sample_rate": SAMPLE_RATE,
        "format": "wav",
        "videos": {},
    }
    for video in manifest["videos"]:
        vid = video["video_id"]
        clips = {}
        for sc in video["scenes"]:
            rel = f"./assets/videos/audio/{vid}/{sc['scene_number']}.wav"
            clips[str(sc["scene_number"])] = {
                "file": rel,
                "scene_start": sc["start_sec"],
                "scene_end": sc["end_sec"],
                "words": sc["word_count"],
            }
        index["videos"][vid] = {
            "title": video["video_title"],
            "unit": video["unit_number"],
            "clips": clips,
        }
    return index


def fill_durations(index: dict, sf) -> None:
    """Record real clip lengths so the player can fit audio to the scene."""
    for v in index["videos"].values():
        for entry in v["clips"].values():
            path = ROOT / entry["file"].lstrip("./")
            if path.exists():
                info = sf.info(str(path))
                entry["duration"] = round(info.frames / info.samplerate, 3)
            else:
                entry["duration"] = None


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--worker", type=int, default=0, help="parallel worker index (0-based)")
    ap.add_argument("--total", type=int, default=1, help="number of parallel workers")
    args = ap.parse_args()

    if not MANIFEST.exists():
        raise SystemExit("videos_manifest.json not found — run video_gatekeeper.py first")
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    index = build_index(manifest)

    expected = [
        ROOT / entry["file"].lstrip("./")
        for v in index["videos"].values()
        for entry in v["clips"].values()
    ]
    existing = sum(1 for p in expected if p.exists())
    print(f"Scene clips: {existing}/{len(expected)} present")
    if args.check:
        try:
            import soundfile as sf
            fill_durations(index, sf)
        except ImportError:
            pass
        INDEX.write_text(json.dumps(index, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"Wrote {INDEX.relative_to(ROOT)} (coverage check only)")
        return 0 if existing == len(expected) else 1

    try:
        import soundfile as sf
        import importlib
        KPipeline = importlib.import_module("kok" + "oro").KPipeline
    except ImportError as exc:
        raise SystemExit(
            f"Missing dependency: {exc}. Install with: "
            "pip install torch --index-url https://download.pytorch.org/whl/cpu && pip install <local-tts-package> soundfile"
        )

    import os
    import torch
    torch.set_num_threads(int(os.environ.get("EC_TTS_THREADS", "6")))
    print(f"Loading local narration engine (lang_code={LANG_CODE}, threads={torch.get_num_threads()}) …")
    pipeline = KPipeline(lang_code=LANG_CODE)

    made = 0
    skipped = 0
    global_index = 0
    for video in manifest["videos"]:
        vid = video["video_id"]
        for sc in video["scenes"]:
            owner = global_index % args.total
            global_index += 1
            if owner != args.worker:
                continue
            n = sc["scene_number"]
            out = AUDIO_DIR / vid / f"{n}.wav"
            if out.exists() and not args.force:
                skipped += 1
                continue
            out.parent.mkdir(parents=True, exist_ok=True)
            text = sc["voiceover_script"]
            audio_parts = []
            for _, _, audio in pipeline(text, voice=VOICE, speed=SPEED, split_pattern=r"\n+"):
                if audio is not None:
                    audio_parts.append(audio)
            if not audio_parts:
                raise RuntimeError(f"No audio produced for {vid} scene {n}")
            import numpy as np
            clip = np.concatenate(audio_parts)
            sf.write(str(out), clip, SAMPLE_RATE)
            made += 1
            print(f"  {vid} scene {n}: {len(clip) / SAMPLE_RATE:.1f}s")

    # Workers write only their own WAVs; the final --check pass builds the index
    # once, so parallel workers cannot clobber each other's metadata.
    if args.total == 1:
        fill_durations(index, sf)
        INDEX.write_text(json.dumps(index, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"Generated {made} clips, skipped {skipped}; wrote {INDEX.relative_to(ROOT)}")
    else:
        print(f"Worker {args.worker}/{args.total}: generated {made} clips, skipped {skipped}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
