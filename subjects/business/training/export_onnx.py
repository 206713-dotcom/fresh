#!/usr/bin/env python3
"""Export the merged LoRA model to the ONNX format Transformers.js loads.

Run on Kaggle after kaggle_train.py, or locally on a CUDA machine:

    pip -q install -U optimum onnx onnxruntime-gpu
    python export_onnx.py

The default output is output/onnx. Upload the resulting folder to a Hugging Face
repo, then point the app at it:
  - subjects/business/js/views/ai-marker.js: MODEL_ID = "<your-user>/<your-repo>"
  - keep dtype 'q4f16' only if the quantised export below succeeded; otherwise
    change both createGenerator() calls to dtype 'fp16' and use onnx/model.onnx.
"""
from __future__ import annotations

import inspect
import os
from pathlib import Path

ROOT = Path(os.environ.get("TRAIN_ROOT", "."))
MERGED = ROOT / "output" / "merged"
OUT = Path(os.environ.get("ONNX_OUT", str(ROOT / "output" / "onnx")))
QUANT = os.environ.get("QUANT", "q4f16")


def main():
    if not MERGED.exists():
        raise SystemExit(f"Missing merged model: {MERGED}. Run kaggle_train.py first.")
    OUT.mkdir(parents=True, exist_ok=True)

    # Training disables the KV cache; Transformers.js generation requires it.
    # Re-enable before export so the ONNX graph includes past-key/value inputs.
    import json
    config_path = MERGED / "config.json"
    config = json.loads(config_path.read_text(encoding="utf-8"))
    config["use_cache"] = True
    config_path.write_text(json.dumps(config, indent=2) + "\n", encoding="utf-8")
    print("Set use_cache=True in output/merged/config.json")

    from optimum.exporters.onnx import main_export

    kwargs = dict(
        model_name_or_path=str(MERGED),
        output=str(OUT),
        task="text-generation",
        opset=17,
        device="cuda",
    )
    # Newer optimum versions accept dtype/quantization_config directly.
    params = inspect.signature(main_export).parameters
    if "dtype" in params:
        kwargs["dtype"] = "fp16"
    if "quantization_config" in params and QUANT:
        try:
            from optimum.onnxruntime.configuration import QuantizationConfig
            kwargs["quantization_config"] = QuantizationConfig(quant_method=QUANT)
        except Exception as exc:  # pragma: no cover - version dependent
            print(f"Could not build QuantizationConfig({QUANT}): {exc}")
    try:
        main_export(**kwargs)
    except TypeError:
        kwargs.pop("quantization_config", None)
        print("Exporting unquantised FP16 weights (quantisation needs a newer optimum).")
        main_export(**kwargs)

    print(f"ONNX files written to {OUT}")
    for path in sorted(OUT.rglob("*.onnx")):
        print(f"  {path.relative_to(OUT)}  {path.stat().st_size / 1048576:.1f} MB")
    print(
        "\nDeploy:\n"
        "  1. Upload output/onnx to a Hugging Face model repo.\n"
        "  2. Set MODEL_ID in js/views/ai-marker.js to that repo.\n"
        "  3. If you exported unquantised weights, set dtype to 'fp16' in both\n"
        "     createGenerator() calls in ai-marker.js.\n"
        "  4. Re-run the browser smoke test: load model, mark one answer, check JSON."
    )


if __name__ == "__main__":
    main()
