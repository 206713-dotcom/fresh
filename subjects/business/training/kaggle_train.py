#!/usr/bin/env python3
"""Kaggle / local LoRA fine-tune of Qwen3-0.6B for the 0264 marker.

Designed for 2 × NVIDIA T4 (16 GB) in well under 90 minutes.

On Kaggle:
  1. New Notebook -> GPU T4 x2.
  2. Add this training folder as a dataset (or copy these files into /kaggle/working).
  3. In a cell: !pip -q install -U transformers peft accelerate sentencepiece
  4. !torchrun --nproc_per_node=2 kaggle_train.py

The script reads dataset/train.jsonl and dataset/val.jsonl produced by
prepare_dataset.py and writes a merged model to output/merged plus the LoRA
adapter to output/adapter. Use export_onnx.py afterwards.
"""
from __future__ import annotations

import json
import math
import os
from pathlib import Path

import torch
from torch.utils.data import Dataset
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    Trainer,
    TrainingArguments,
    set_seed,
)
from peft import LoraConfig, get_peft_model

ROOT = Path(os.environ.get("TRAIN_ROOT", "."))
DATA = ROOT / "dataset"
OUT = ROOT / "output"
MODEL = os.environ.get("BASE_MODEL", "Qwen/Qwen3-0.6B")
SEED = 42
MAX_LEN = int(os.environ.get("MAX_LEN", "1024"))


class MarkerDataset(Dataset):
    def __init__(self, path: Path, tok, max_len: int):
        self.rows = []
        with path.open(encoding="utf-8") as fh:
            for line in fh:
                if line.strip():
                    self.rows.append(json.loads(line))
        self.tok = tok
        self.max_len = max_len

    def __len__(self):
        return len(self.rows)

    def __getitem__(self, i):
        row = self.rows[i]
        system, user, assistant = row["messages"]
        prompt = self.tok.apply_chat_template(
            [{"role": "system", "content": system["content"]},
             {"role": "user", "content": user["content"]}],
            tokenize=False,
            add_generation_prompt=True,
            enable_thinking=False,
        )
        completion = assistant["content"] + self.tok.eos_token
        p_ids = self.tok(prompt, add_special_tokens=False)["input_ids"]
        c_ids = self.tok(completion, add_special_tokens=False)["input_ids"]
        # Leave room for the full completion; truncate the prompt from the left only if needed.
        if len(p_ids) + len(c_ids) > self.max_len:
            keep = self.max_len - len(c_ids)
            p_ids = p_ids[-max(keep, 32):]
        input_ids = p_ids + c_ids
        labels = [-100] * len(p_ids) + c_ids
        return {"input_ids": input_ids, "labels": labels, "attention_mask": [1] * len(input_ids)}


class Collator:
    def __init__(self, pad_id: int):
        self.pad_id = pad_id

    def __call__(self, features):
        size = max(len(f["input_ids"]) for f in features)
        input_ids, labels, masks = [], [], []
        for f in features:
            pad = size - len(f["input_ids"])
            input_ids.append(f["input_ids"] + [self.pad_id] * pad)
            labels.append(f["labels"] + [-100] * pad)
            masks.append(f["attention_mask"] + [0] * pad)
        return {
            "input_ids": torch.tensor(input_ids, dtype=torch.long),
            "labels": torch.tensor(labels, dtype=torch.long),
            "attention_mask": torch.tensor(masks, dtype=torch.long),
        }


def main():
    set_seed(SEED)
    rank = int(os.environ.get("LOCAL_RANK", "0"))
    tok = AutoTokenizer.from_pretrained(MODEL, trust_remote_code=False)
    if tok.pad_token is None:
        tok.pad_token = tok.eos_token

    train_ds = MarkerDataset(DATA / "train.jsonl", tok, MAX_LEN)
    val_ds = MarkerDataset(DATA / "val.jsonl", tok, MAX_LEN)
    if rank == 0:
        print(f"train={len(train_ds)} val={len(val_ds)} max_len={MAX_LEN}", flush=True)

    model = AutoModelForCausalLM.from_pretrained(
        MODEL,
        torch_dtype=torch.float16,
        attn_implementation="sdpa",
        trust_remote_code=False,
    )
    model.config.use_cache = False
    model = get_peft_model(model, LoraConfig(
        r=16,
        lora_alpha=32,
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM",
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    ))
    if rank == 0:
        model.print_trainable_parameters()

    args = TrainingArguments(
        output_dir=str(OUT / "trainer"),
        overwrite_output_dir=True,
        num_train_epochs=float(os.environ.get("EPOCHS", "3")),
        per_device_train_batch_size=int(os.environ.get("BATCH", "8")),
        gradient_accumulation_steps=int(os.environ.get("ACCUM", "4")),
        learning_rate=float(os.environ.get("LR", "1e-4")),
        lr_scheduler_type="cosine",
        warmup_ratio=0.03,
        weight_decay=0.0,
        logging_steps=10,
        save_strategy="epoch",
        save_total_limit=1,
        fp16=True,
        bf16=False,
        optim="adamw_torch_fused",
        dataloader_num_workers=2,
        report_to="none",
        seed=SEED,
        data_seed=SEED,
        remove_unused_columns=False,
        ddp_find_unused_parameters=False,
    )
    trainer = Trainer(
        model=model,
        args=args,
        train_dataset=train_ds,
        data_collator=Collator(tok.pad_token_id),
    )
    trainer.train()

    # Manual validation loss (avoids Trainer eval API differences across versions).
    model.eval()
    total, n = 0.0, 0
    collator = Collator(tok.pad_token_id)
    with torch.no_grad():
        for start in range(0, len(val_ds), 16):
            batch = collator([val_ds[i] for i in range(start, min(start + 16, len(val_ds)))])
            batch = {k: v.cuda() for k, v in batch.items()}
            loss = model(**batch).loss
            total += float(loss)
            n += 1
    if rank == 0:
        print(f"validation loss: {total / max(n, 1):.4f}", flush=True)
        adapter = OUT / "adapter"
        model.save_pretrained(str(adapter))
        tok.save_pretrained(str(adapter))
        merged = model.merge_and_unload()
        merged_dir = OUT / "merged"
        merged.save_pretrained(str(merged_dir), safe_serialization=True)
        tok.save_pretrained(str(merged_dir))
        print(f"saved adapter -> {adapter}\nsaved merged model -> {merged_dir}", flush=True)


if __name__ == "__main__":
    main()
