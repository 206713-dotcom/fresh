#!/usr/bin/env python3
"""Export a single-file q4f16 ONNX model for the browser marker.

No KV-cache/past graph is needed: the app uses a manual token loop, which
avoids WebGPU generate() dtype bugs and works with cache-less graphs.
"""
from __future__ import annotations

import inspect
import json
import os
import shutil
from pathlib import Path

ROOT = Path(os.environ.get("TRAIN_ROOT", "."))
MERGED = ROOT / "output" / "merged"
OUT = Path(os.environ.get("ONNX_OUT", str(ROOT / "output" / "onnx")))


def patch_cache(path: Path) -> None:
    if not path.exists():
        return
    config = json.loads(path.read_text(encoding="utf-8"))
    config["use_cache"] = True
    path.write_text(json.dumps(config, indent=2) + "\n", encoding="utf-8")


def main():
    if not MERGED.exists():
        raise SystemExit(f"Missing merged model: {MERGED}. Run training first.")
    OUT.mkdir(parents=True, exist_ok=True)
    patch_cache(MERGED / "config.json")

    from optimum.exporters.onnx import main_export

    kwargs = dict(
        model_name_or_path=str(MERGED),
        output=str(OUT),
        task="text-generation",
        opset=18,
        device="cuda",
        dtype="fp16",
        monolith=True,
    )
    params = inspect.signature(main_export).parameters
    try:
        from optimum.onnxruntime.configuration import QuantizationConfig
        if "quantization_config" in params:
            kwargs["quantization_config"] = QuantizationConfig(quant_method="q4f16")
            print("Using q4f16 quantisation, single file")
    except Exception as exc:
        print(f"Quantisation unavailable ({exc}); exporting plain FP16")

    try:
        main_export(**kwargs)
    except Exception as exc:
        print(f"q4f16 export failed ({exc}); retrying plain FP16 monolith")
        kwargs.pop("quantization_config", None)
        main_export(**kwargs)

    patch_cache(OUT / "config.json")
    template = ROOT / "chat_template.jinja"
    if template.exists():
        shutil.copy2(template, OUT / "chat_template.jinja")

    print(f"ONNX files written to {OUT}")
    for path in sorted(OUT.rglob("*.onnx")):
        print(f"  {path.relative_to(OUT)}  {path.stat().st_size / 1048576:.1f} MB")
    print("Ready for upload_to_hf.py")


if __name__ == "__main__":
    main()
