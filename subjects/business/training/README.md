# Retrain the 0264 marker (Kaggle, 2 × T4, ~90 min)

## Why

The current fine-tuned ONNX weights (`SemiLunarz/qwen3-0.6b-igcse-0264-onnx`) generate
gibberish in browser tests (`//'//'…`, `PO.인ato&'…`) with both greedy and sampled decoding,
while stock Qwen3-0.6B generates coherent text. The app code, prompts, watchdog and
deterministic caps are fine — the weights are the problem. This pack retrains a fresh
marker from the syllabus-aligned data already in this repository.

## What is in this folder

| File | Purpose |
|---|---|
| `prepare_dataset.py` | Builds the training data from `../data/*.json` (read-only) |
| `dataset/train.jsonl`, `dataset/val.jsonl` | Ready-to-use 4,886-example dataset (~11 MB) |
| `dataset/coverage.json` | Coverage report by section, question type and label |
| `kaggle_train.py` | LoRA fine-tune of Qwen3-0.6B for 2 × T4 |
| `export_onnx.py` | Merge LoRA and export ONNX for Transformers.js |
| `requirements-kaggle.txt` | Pip requirements |
| `kaggle_marker_training.ipynb` | One-click Kaggle notebook |

## Dataset design

- **Source of truth:** the same banks the app serves — `paper1.json` (6,000 sets),
  `paper2.json` (3,000 cases), `verified-questions.json` (189 official/specimen items),
  `syllabus-static.json` (254 statements) and `lessons.json` (24 lessons).
- **Syllabus coverage:** all six 0264 sections (1–6) plus Paper 2 case studies.
  See `dataset/coverage.json` — every section and every question type is represented.
- **Question types:** `paper1_2m`, `paper1_4m`, `paper1_6m`, `paper1_8m`,
  `paper2_8m_a`, `paper2_12m_b` with the same AO caps as `ai-marker.js`.
- **Labels:** strict JSON targets in the exact shape the app parses. Three variants per
  source item: full credit (official model answer), partial (truncated answer) and zero
  (off-task filler). Scores are assigned deterministically from the same AO caps the
  app uses, so the model learns the Cambridge rules, not invented marks.
- **Size:** 4,886 examples (4,642 train / 244 val), 95/5 split, seed 42.
  Mean prompt ≈1.1k characters; `MAX_LEN=1024` tokens is enough.

## Kaggle instructions

1. **Notebook → GPU T4 ×2** (Settings → Accelerator → GPU T4 x2).
2. **Add data:** upload this whole `training` folder as a Kaggle dataset, or open
   `kaggle_marker_training.ipynb` and copy the files into `/kaggle/working`.
3. Install once (this exact cell is already in the notebook — it removes Kaggle's broken
   diffusers/gradio stack and installs the working ONNX exporter):
   ```python
   !pip -q uninstall -y diffusers gradio gradio-client optimum
   !pip -q install -U "transformers>=4.44,<5" peft accelerate sentencepiece "optimum>=2.1,<3" "optimum-onnx>=0.1" onnx onnxruntime-gpu huggingface_hub
   ```
4. Train (two GPUs):
   ```python
   !torchrun --nproc_per_node=2 kaggle_train.py
   ```
   The script defaults to `BATCH=2`, `ACCUM=16`, `MAX_LEN=768` and
   `PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True` so it will not OOM on a 16 GB T4.
   If multi-GPU launching fails, replace with `!python kaggle_train.py` (single T4).
5. Export:
   ```python
   !python export_onnx.py
   ```
   It re-enables `use_cache`, exports `text-generation-with-past` at opset 18, and copies
   `chat_template.jinja` into the output folder.
6. Upload:
   ```python
   !python upload_to_hf.py
   ```
   It uploads weights to `onnx/model_fp16.onnx` and config/tokenizer to the repo root —
   the exact layout Transformers.js needs.

Expected runtime: about **10–25 minutes for training** (4,642 examples × 3 epochs,
effective batch 64) and **10–30 minutes for ONNX export/quantisation** — comfortably
inside a 90-minute T4 ×2 allowance. If your session is slower, set `EPOCHS=2` or
`BATCH=4` environment variables.

## Deploy the new weights

1. Upload `output/onnx` to a Hugging Face model repo (e.g. `yourname/qwen3-0264-marker-v2`).
2. In `subjects/business/js/views/ai-marker.js`, change:
   - `MODEL_ID` to your new repo;
   - `CHAT_TEMPLATE_URL` to that repo's `chat_template.jinja` (or keep the inline template
     if the repo ships the standard Qwen3 template — the trainer uses the standard one);
   - `dtype` in both `createGenerator()` calls to `q4f16` if quantisation succeeded,
     otherwise `fp16` (and name the ONNX file `onnx/model.onnx`).
3. Clear the site's cached model (`transformers-cache-0264-v4` in Cache Storage and the
   `ecbiz_qwen3_cached_v2` localStorage flag), then reload.
4. Smoke test in the browser: load model → mark one 2-mark answer → confirm a parsed JSON
   result and a non-zero score. The old failure signature was a `timed out` message with an
   empty draft panel; that should no longer appear.

## Environment variables

| Variable | Default | Meaning |
|---|---|---|
| `TRAIN_ROOT` | `.` | Folder containing `dataset/` |
| `BASE_MODEL` | `Qwen/Qwen3-0.6B` | Base checkpoint |
| `MAX_LEN` | `1024` | Sequence length |
| `EPOCHS` | `3` | Training epochs |
| `BATCH` | `8` | Per-device batch size |
| `ACCUM` | `4` | Gradient accumulation |
| `LR` | `1e-4` | LoRA learning rate |
| `ONNX_OUT` | `output/onnx` | Export destination |
| `QUANT` | `q4f16` | ONNX quantisation method |

## Caveats

- The labels are rule-derived, not human examiner judgements. Use the dataset to teach the
  **output format and AO caps**, then spot-check marks against real mark schemes before
  trusting it in production.
- The browser's deterministic marker remains the safety net; keep `EC.autoMark` and the
  watchdog code unchanged.
- `prepare_dataset.py` is deterministic and read-only; rerunning it regenerates identical
  files. Edit the quotas at the top of `main()` if you want a larger/smaller dataset.
