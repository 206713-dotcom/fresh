import ast, logging, os, shutil, subprocess, sys, urllib.request
from pathlib import Path

logging.getLogger("onnxruntime").setLevel(logging.ERROR)

subprocess.check_call([
    sys.executable, "-m", "pip", "install", "-q",
    "optimum[onnxruntime]", "onnxconverter-common", "huggingface-hub",
    "transformers", "onnx-ir", "onnxscript"
])

import onnx
import onnxruntime as ort
from huggingface_hub import HfApi
from onnxconverter_common import float16
from onnxruntime.quantization.matmul_nbits_quantizer import MatMulNBitsQuantizer

HF_TOKEN = os.environ.get("HF_TOKEN")
if not HF_TOKEN:
    try:
        from google.colab import userdata
        HF_TOKEN = userdata.get("HF_TOKEN")
        os.environ["HF_TOKEN"] = HF_TOKEN
    except Exception:
        pass

api = HfApi(token=HF_TOKEN)

print("Uploading freshly trained merged model...", flush=True)
TRAINED_REPO = "SemiLunarz/qwen3-0.6b-igcse-0264-trained-colab"
api.create_repo(repo_id=TRAINED_REPO, exist_ok=True, private=False)
api.upload_folder(
    folder_path="/content/training/output/merged",
    repo_id=TRAINED_REPO,
    commit_message="Upload freshly trained 0264 marker weights",
)

candidates = [
    m for m in api.list_models(
        author="SemiLunarz", search="igcse-0264", sort="lastModified", direction=-1
    )
    if not m.id.endswith("-onnx")
]
MODEL_REPO = candidates[0].id if candidates else TRAINED_REPO
ONNX_REPO = "SemiLunarz/qwen3-0.6b-igcse-0264-onnx"
print(f"Using trained model repo: {MODEL_REPO}", flush=True)

src = urllib.request.urlopen(
    "https://huggingface.co/spaces/onnx-community/convert-to-onnx/raw/main/converter.py",
    timeout=30,
).read().decode("utf-8")
tree = ast.parse(src)
fn_node = next(
    n for n in tree.body
    if isinstance(n, ast.FunctionDef) and n.name == "convert_to_float16"
)
ns = {"onnx": onnx, "onnx_float16": float16}
exec(ast.get_source_segment(src, fn_node), ns)
convert_to_float16 = ns["convert_to_float16"]

raw_dir = Path("onnx_raw")
out_dir = Path("tjs_export")
shutil.rmtree(raw_dir, ignore_errors=True)
shutil.rmtree(out_dir, ignore_errors=True)
(out_dir / "onnx").mkdir(parents=True, exist_ok=True)

print("1/3 Exporting raw FP32 ONNX graph...", flush=True)
subprocess.run([
    "optimum-cli", "export", "onnx",
    "--model", MODEL_REPO,
    "--task", "text-generation-with-past",
    "--no-post-process",
    str(raw_dir),
], check=True)

print("2/3 Quantizing to 4-bit and converting to single-file q4f16...", flush=True)
fp32_model = onnx.load(str(raw_dir / "model.onnx"))
quant = MatMulNBitsQuantizer(fp32_model, bits=4, block_size=32, is_symmetric=True)
quant.process()

if isinstance(quant.model, onnx.ModelProto):
    q4_proto = quant.model
elif hasattr(quant.model, "model") and isinstance(quant.model.model, onnx.ModelProto):
    q4_proto = quant.model.model
else:
    import onnx_ir as ir
    q4_proto = ir.serde.serialize_model(quant.model)

for init in q4_proto.graph.initializer:
    init.ClearField("external_data")
    init.data_location = onnx.TensorProto.DEFAULT

q4f16_proto = convert_to_float16(q4_proto)
for init in q4f16_proto.graph.initializer:
    init.ClearField("external_data")
    init.data_location = onnx.TensorProto.DEFAULT

out_onnx = out_dir / "onnx" / "model_q4f16.onnx"
onnx.save(q4f16_proto, str(out_onnx))

sess = ort.InferenceSession(str(out_onnx), providers=["CPUExecutionProvider"])
print(f"ORT validation PASSED ({len(sess.get_inputs())} inputs, single file).", flush=True)

for f in raw_dir.iterdir():
    if f.is_file() and not f.name.startswith("model.onnx"):
        shutil.copy2(f, out_dir / f.name)

print("3/3 Uploading single-file ORT-validated model to Hugging Face...", flush=True)
api.upload_folder(
    folder_path=str(out_dir),
    repo_id=ONNX_REPO,
    repo_type="model",
    delete_patterns="*",
    commit_message=f"Export single-file ORT-validated onnx/model_q4f16.onnx from {MODEL_REPO}",
)
print(f"DONE! {ONNX_REPO}/onnx/model_q4f16.onnx is live.", flush=True)
