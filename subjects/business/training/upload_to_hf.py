#!/usr/bin/env python3
"""Upload the exported ONNX model to your Hugging Face profile.

Uses HF_TOKEN from the environment (or Kaggle secret via the notebook cell).
Example:
    HF_REPO=SemiLunarz/qwen3-0.6b-igcse-0264-marker-v2 python upload_to_hf.py
"""
from __future__ import annotations

import os
import shutil
from pathlib import Path

ROOT = Path(os.environ.get("TRAIN_ROOT", "."))
ONNX = Path(os.environ.get("ONNX_OUT", str(ROOT / "output" / "onnx")))
MERGED = ROOT / "output" / "merged"
REPO = os.environ.get("HF_REPO", "SemiLunarz/qwen3-0.6b-igcse-0264-marker-v2")
TOKEN = os.environ.get("HF_TOKEN")


def main():
    if not ONNX.exists():
        raise SystemExit(f"Missing ONNX export: {ONNX}. Run export_onnx.py first.")
    if not TOKEN:
        raise SystemExit("Set HF_TOKEN (or add it as a Kaggle secret named HF_TOKEN).")

    # The app fetches chat_template.jinja from the model repo; include it if available.
    template = MERGED / "chat_template.jinja"
    if template.exists():
        shutil.copy2(template, ONNX / "chat_template.jinja")

    from huggingface_hub import HfApi

    api = HfApi(token=TOKEN)
    api.create_repo(repo_id=REPO, exist_ok=True, private=False)

    # Transformers.js looks for onnx/model_<dtype>.onnx, not a root-level model.onnx.
    model_file = ONNX / "model.onnx"
    if model_file.exists():
        api.upload_file(
            path_or_fileobj=str(model_file),
            path_in_repo="onnx/model_fp16.onnx",
            repo_id=REPO,
            commit_message="Upload ONNX weights (fp16)",
        )
    # Config/tokenizer stay at the repo root, where the pipeline expects them.
    api.upload_folder(
        folder_path=str(ONNX),
        repo_id=REPO,
        path_in_repo="",
        ignore_patterns=["*.onnx"],
        commit_message="Upload tokenizer and config",
    )
    print(f"Uploaded {ONNX} -> https://huggingface.co/{REPO}")


if __name__ == "__main__":
    main()
