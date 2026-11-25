# EcBiz concept-visualization video pipeline (0264, Units 1–6)

A deterministic, append-only production pipeline that turns the Cambridge IGCSE Business 0264 textbook into 25 animated, scene-by-scene video production packages.

## Deliverables

| Path | Purpose |
|---|---|
| `data/videos_manifest.json` | Final merged library (25 approved `VideoModule` entries) |
| `data/video_validation_report.json` | Per-shard gatekeeper results and mechanical repairs |
| `data/video_captions_index.json` | Caption + render-manifest lookup for the player |
| `data/gz/videos_manifest.json.gz`, `data/gz/video_captions_index.json.gz` | Precompressed variants for the existing `fast-load.js` wrapper |
| `assets/videos/captions/VID_U*.vtt` | WebVTT captions, one cue per scene |
| `assets/videos/render/VID_U*.render.json` | Platform-neutral render manifest (Canvas / Remotion / Manim / FFmpeg mappings) |
| `js/views/videos.js` | Library UI + Canvas 2D render runtime + Web Speech voiceover + recap quizzes |
| `tmp_shards/PIPELINE_SPEC.md` | Binding contract shared by all 18 subagents |
| `tmp_shards/vid_u{N}_{NN}.json` | Isolated Tier-1 production shards (status `UNVERIFIED`) |
| `tmp_shards/audit_{syl,vis}_u{N}.json` | Isolated Tier-2 audit verdicts |
| `tools/video_gatekeeper.py` | Tier 3 deterministic validator + merger |
| `tools/video_render.py` | Tier 3 caption/render-manifest compiler |

## Swarm topology

- **Tier 1** — `VID-GEN-01…06`: one Unit Video Creator per unit, writing only its own 4–5 shards.
- **Tier 2A** — `SYL-VID-AUD-01…06`: direct unit assignment; checks blacklist leaks, exact 0264 terminology, AO1–AO4 coverage, misleading analogies.
- **Tier 2B** — `VIS-TECH-AUD-01…06`: orthogonal (reversed) assignment; checks visual density, pacing, arithmetic, schema and global uniqueness.
- **Tier 3** — Main Orchestrator: the only role permitted to set `APPROVED` status, merge, compile assets and wire the UI.

No creator may approve its own work. No auditor may edit a video shard.

## Rebuild sequence

```bash
# 1. Tier 1 writes shards (subagents), Tier 2 writes audit files (subagents)
# 2. Tier 3 gatekeeper: validate + merge
python tools/video_gatekeeper.py
# 3. Tier 3 asset compiler
python tools/video_render.py
# 4. Local narration synthesis (CPU-only; parallel shards then one final index pass)
python tools/video_voice.py --worker 0 --total 3 &
python tools/video_voice.py --worker 1 --total 3 &
python tools/video_voice.py --worker 2 --total 3 &
wait
python tools/video_voice.py --check
```

`--check` on the gatekeeper validates without writing.

## Runtime notes

The player renders each scene from the JSON timeline with Canvas 2D and speaks the narration with the browser's Web Speech API. The canvas uses per-unit visual themes with drifting light pools, scene-specific motifs, floating particles, glass panels, glow accents and soft scene transitions instead of a flat background. Narration is generated locally at build time by `tools/video_voice.py`, producing 213 per-scene WAV clips under `assets/videos/audio/` plus `data/video_audio_index.json`. The HTML audio element plays the matching clip on each scene, time-fitted to the scene duration; Web Speech remains a silent fallback when a clip is missing, but there is no voice picker — the player shows a simple `VOICE · ON` badge. WebVTT files are generated for standard players and for offline FFmpeg/Remotion/Manim rendering. No MP4 encoder is bundled with this repository, so `.mp4`/`.webm` encoding is delegated to the render manifests rather than performed locally.
