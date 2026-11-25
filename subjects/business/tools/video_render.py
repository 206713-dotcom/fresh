#!/usr/bin/env python3
"""
Tier 3 deterministic asset compiler for the approved video manifest.

Produces, for every APPROVED video:
  * assets/videos/captions/<VIDEO_ID>.vtt          — WebVTT captions (one cue per scene)
  * assets/videos/render/<VIDEO_ID>.render.json    — platform-neutral rendering manifest
                                                     (canvas primitives + Remotion/Manim/FFmpeg mapping)
  * data/video_captions_index.json                 — lookup table used by the browser player

No third-party packages are required. Actual .mp4/.webm encoding is delegated to
the render manifest so it can run wherever FFmpeg / Remotion / Manim is installed;
the browser player renders the same manifest natively with Canvas 2D + Web Speech.
"""

from __future__ import annotations

import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "data" / "videos_manifest.json"
CAPTIONS = ROOT / "assets" / "videos" / "captions"
RENDERS = ROOT / "assets" / "videos" / "render"
INDEX = ROOT / "data" / "video_captions_index.json"

PALETTE = {
    "bg": "#0B1220",
    "panel": "#111C2E",
    "ink": "#F8FAFC",
    "muted": "#94A3B8",
    "accent": "#38BDF8",
    "accent2": "#A78BFA",
    "good": "#10B981",
    "warn": "#F59E0B",
    "bad": "#EF4444",
}


def stamp(seconds: float) -> str:
    ms = max(0, int(round(seconds * 1000)))
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d}.{ms:03d}"


def vtt(video: dict) -> str:
    lines = ["WEBVTT", ""]
    for sc in video["scenes"]:
        lines += [
            f"cue-{video['video_id']}-{sc['scene_number']}",
            f"{stamp(sc['start_sec'])} --> {stamp(sc['end_sec'])}",
            sc["voiceover_script"].strip(),
            "",
        ]
    return "\n".join(lines) + "\n"


def render_manifest(video: dict, caption_rel: str) -> dict:
    scenes = []
    for sc in video["scenes"]:
        ad = sc.get("animation_directives", {})
        scenes.append({
            "scene_number": sc["scene_number"],
            "in": sc["start_sec"],
            "out": sc["end_sec"],
            "visual_type": sc["visual_type"],
            "layout": ad.get("layout"),
            "camera_motion": ad.get("camera_motion"),
            "title": sc["on_screen_title"],
            "labels": sc["on_screen_labels"],
            "elements": ad.get("elements", []),
            "visual_beats": ad.get("visual_beats", []),
            "chart": {k: ad[k] for k in ("axes", "lines", "highlight_intersection", "flow_nodes", "org_chart") if k in ad},
            "narration": {
                "text": sc["voiceover_script"],
                "words": sc["word_count"],
                "wpm": round(sc["word_count"] / (sc["end_sec"] - sc["start_sec"]) * 60, 1),
            },
        })
    return {
        "schema_version": "1.0",
        "video_id": video["video_id"],
        "title": video["video_title"],
        "canvas": {"width": 1280, "height": 720, "background": PALETTE["bg"], "palette": PALETTE},
        "duration_sec": video["target_duration_sec"],
        "fps": 30,
        "caption_file": caption_rel,
        "scenes": scenes,
        "recap_quiz": video["end_of_video_recap_quiz"],
        "targets": {
            "browser": "js/views/videos.js :: CanvasSceneRenderer (native, no dependencies)",
            "remotion": {
                "entry": "VideoComposition.tsx",
                "mapping": "each scene -> <Sequence from={in*30} durationInFrames={(out-in)*30}>",
                "assets": "labels/elements rendered as Remotion primitives; chart.lines -> <Line> with draw_at_sec",
            },
            "manim": {
                "entry": "render_manim.py",
                "mapping": "each scene -> Scene.play() block; chart.lines -> Axes.plot() with Create animation",
            },
            "ffmpeg": {
                "template": "ffmpeg -f lavfi -i color=c=0x0B1220:s=1280x720:r=30 -t {duration} "
                            "-vf \"drawtext=... per-scene overlays, subtitles={caption_file}\" "
                            "-c:v libx264 -pix_fmt yuv420p {output}.mp4",
                "note": "Requires ffmpeg with libass/drawtext; not bundled in this repository.",
            },
        },
    }


def main() -> int:
    if not MANIFEST.exists():
        raise SystemExit("videos_manifest.json not found — run video_gatekeeper.py first")
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    CAPTIONS.mkdir(parents=True, exist_ok=True)
    RENDERS.mkdir(parents=True, exist_ok=True)
    index = {}

    for video in manifest["videos"]:
        vid = video["video_id"]
        caption_rel = f"./assets/videos/captions/{vid}.vtt"
        (CAPTIONS / f"{vid}.vtt").write_text(vtt(video), encoding="utf-8")
        rm = render_manifest(video, caption_rel)
        (RENDERS / f"{vid}.render.json").write_text(
            json.dumps(rm, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
        )
        index[vid] = {
            "caption": caption_rel,
            "render_manifest": f"./assets/videos/render/{vid}.render.json",
            "title": video["video_title"],
            "unit": video["unit_number"],
            "chapter_code": video["chapter_code"],
            "duration_sec": video["target_duration_sec"],
        }

    INDEX.write_text(json.dumps(index, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    ffmpeg = bool(shutil.which("ffmpeg"))
    print(f"Compiled {len(index)} caption files and render manifests.")
    print(f"ffmpeg on PATH: {ffmpeg} (mp4 encoding skipped; manifests are ready for offline rendering)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
