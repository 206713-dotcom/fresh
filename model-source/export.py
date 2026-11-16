"""Merge the selected EcBiz Qwen checkpoint for browser inference."""

import sys
from pathlib import Path

import torch
from huggingface_hub import snapshot_download
from peft import PeftModel
from transformers import AutoModelForCausalLM, AutoTokenizer


def export(work):
    base = snapshot_download(
        "Qwen/Qwen2.5-0.5B-Instruct",
        revision="7ae557604adf67be50417f59c2c2f167def9a775",
        allow_patterns=["*.json", "model.safetensors", "LICENSE"],
    )
    model = AutoModelForCausalLM.from_pretrained(base, dtype=torch.float16)
    adapted = PeftModel.from_pretrained(model, work / "adapter", local_files_only=True)
    target = work / "merged"
    adapted.merge_and_unload(safe_merge=True).save_pretrained(target)
    AutoTokenizer.from_pretrained(base).save_pretrained(target)
    assets = work / "assets"
    (assets / "LICENSE").write_bytes((Path(base) / "LICENSE").read_bytes())
    (assets / "NOTICE").write_text(
        "Base model: Qwen/Qwen2.5-0.5B-Instruct (Apache 2.0).\n"
        "Modified by merging the EcBiz Economics marking adapter and quantizing to GGUF Q8_0.\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    export(Path(sys.argv[1]))
