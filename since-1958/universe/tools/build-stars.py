"""Packs the star catalogue into a small binary file for Fresh Astronomy.

Source: d3-celestial `data/stars.8.json` (BSD-3-Clause, Olaf Frohn), which lists
every star down to magnitude 8 from the Hipparcos catalogue with its position,
brightness and colour index.

Output: little-endian Int16 records, brightest star first:
    right ascension * 182   (degrees, -180..180)
    declination * 364       (degrees)
    magnitude * 1000
    B-V colour index * 1000
Usage: python3 build-stars.py stars.8.json stars.bin
"""
import json, struct, sys

src, out = sys.argv[1], sys.argv[2]
stars = []
for f in json.load(open(src))["features"]:
    ra, dec = f["geometry"]["coordinates"]
    mag = float(f["properties"]["mag"])
    try:
        bv = float(f["properties"]["bv"])
    except (TypeError, ValueError):
        bv = 0.6  # no colour measured: assume Sun-like
    stars.append((mag, ra, dec, max(-0.4, min(2.0, bv))))
stars.sort()
with open(out, "wb") as fh:
    for mag, ra, dec, bv in stars:
        fh.write(struct.pack("<4h", round(ra * 182), round(dec * 364), round(mag * 1000), round(bv * 1000)))
print(len(stars), "stars ->", out)
print("brightest:", stars[:3])
