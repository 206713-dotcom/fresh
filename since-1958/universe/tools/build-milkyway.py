"""Builds the soft Milky Way glow used behind the catalogue stars.

Source: Solar System Scope "stars + Milky Way" sky map (CC BY 4.0), which is in
galactic coordinates with the galactic centre in the middle.

The map's own stars are filtered out (real stars are drawn as sharp points from
a catalogue) and the dark tones are smoothed, because 8-bit steps in a nearly
black image show up as hard-edged patches once the picture is brightened.
The result is stored with a square-root curve to keep the dark tones precise:
the shader squares the value it reads.

Usage: python3 build-milkyway.py 8k_stars_milky_way.jpg out_dir
"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage

Image.MAX_IMAGE_PIXELS = None
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGB").resize((4096, 2048), Image.LANCZOS)
a = np.asarray(im).astype(np.float32) / 255.0

res = np.empty_like(a)
for c in range(3):
    ch = a[..., c]
    # Remove point stars, then smooth. mode="wrap" keeps longitude 180 seamless.
    ch = ndimage.median_filter(ch, size=(9, 9), mode="wrap")
    ch = ndimage.gaussian_filter(ch, sigma=7.0, mode="wrap")
    res[..., c] = ch
# Keep a little of the fine structure near the bright core.
fine = np.stack([ndimage.gaussian_filter(ndimage.median_filter(a[..., c], size=(5, 5), mode="wrap"), sigma=1.8, mode="wrap") for c in range(3)], axis=-1)
w = np.clip((res.mean(axis=-1, keepdims=True) - 0.06) / 0.14, 0.0, 1.0)
res = res * (1 - w) + fine * w

enc = np.sqrt(np.clip(res, 0, 1))
rng = np.random.default_rng(7)
for name, size in (("4k", (4096, 2048)), ("2k", (2048, 1024))):
    img = Image.fromarray(np.clip(enc * 255.0 + rng.uniform(-0.5, 0.5, enc.shape), 0, 255).astype(np.uint8))
    if img.size != size:
        img = img.resize(size, Image.LANCZOS)
    img.save(f"{out}/milkyway_{name}.webp", quality=94, method=6)
    print("wrote", f"milkyway_{name}.webp")
