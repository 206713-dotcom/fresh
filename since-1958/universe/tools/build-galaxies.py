#!/usr/bin/env python3
"""Builds data/galaxies.json: every galaxy with a measured distance out to 30 Mpc.

Sources (plain-text tables, as redistributed in github.com/akleroy/galbase, gal_data/):
  lvg_table1.dat        Karachentsev, Makarov & Kaisina 2013, "Updated Nearby Galaxy Catalog"
                        (the Local Volume Galaxy database, AJ 145, 101): galaxies within ~11 Mpc
  EDD_CF3_2017Sep28.txt Cosmicflows-3 distances (Tully, Courtois & Sorce 2016, AJ 152, 50),
                        from the Extragalactic Distance Database
  leda_vlsr5000.txt     HyperLEDA (Makarov et al. 2014): position, type, size, orientation, magnitude

Usage: python3 build-galaxies.py <folder with the three tables> <output json>
"""
import json, math, re, sys
import numpy as np

src, out = sys.argv[1], sys.argv[2]
LIMIT = 30.0          # Mpc
D2R = math.pi / 180

# --- equatorial (J2000) -> galactic -> supergalactic, as rotation matrices
EQ2GAL = np.array([[-0.0548755604, -0.8734370902, -0.4838350155],
                   [+0.4941094279, -0.4448296300, +0.7469822445],
                   [-0.8676661490, -0.1980763734, +0.4559837762]])
def unit(l, b): return np.array([math.cos(b) * math.cos(l), math.cos(b) * math.sin(l), math.sin(b)])
sgz = unit(47.37 * D2R, 6.32 * D2R)            # supergalactic north pole, in galactic coordinates
sgx = unit(137.37 * D2R, 0.0)                  # supergalactic longitude zero
GAL2SG = np.array([sgx, np.cross(sgz, sgx), sgz])
EQ2SG = GAL2SG @ EQ2GAL

MESSIER = {224: 31, 221: 32, 598: 33, 4472: 49, 5194: 51, 4579: 58, 4621: 59, 4649: 60, 4303: 61, 5055: 63, 4826: 64,
           3623: 65, 3627: 66, 628: 74, 1068: 77, 3031: 81, 3034: 82, 5236: 83, 4374: 84, 4382: 85, 4406: 86, 4486: 87,
           4501: 88, 4552: 89, 4569: 90, 4548: 91, 4736: 94, 3351: 95, 3368: 96, 4192: 98, 4254: 99, 4321: 100,
           5457: 101, 4594: 104, 3379: 105, 4258: 106, 3556: 108, 3992: 109, 205: 110}
COMMON = {'M31': 'Andromeda Galaxy', 'M33': 'Triangulum Galaxy', 'M51': 'Whirlpool Galaxy', 'M101': 'Pinwheel Galaxy',
          'M104': 'Sombrero Galaxy', 'M82': 'Cigar Galaxy', 'M81': "Bode's Galaxy", 'NGC 5128': 'Centaurus A',
          'NGC 253': 'Sculptor Galaxy', 'M83': 'Southern Pinwheel', 'M64': 'Black Eye Galaxy', 'M63': 'Sunflower Galaxy',
          'M87': 'Virgo A', 'LMC': 'Large Magellanic Cloud', 'SMC': 'Small Magellanic Cloud', 'NGC 4038': 'Antennae Galaxies',
          'NGC 1316': 'Fornax A', 'M77': 'Squid Galaxy', 'NGC 6822': "Barnard's Galaxy", 'M74': 'Phantom Galaxy',
          'NGC 4631': 'Whale Galaxy', 'NGC 3115': 'Spindle Galaxy', 'M106': 'Messier 106', 'NGC 55': 'String of Pearls',
          'NGC 4565': 'Needle Galaxy', 'NGC 2403': 'NGC 2403', 'NGC 1365': 'Great Barred Spiral', 'M94': "Cat's Eye Galaxy",
          'NGC 4449': 'NGC 4449', 'IC 342': 'Hidden Galaxy', 'M110': 'Messier 110', 'M32': 'Messier 32'}

def tidy(name):
    name = name.strip()
    m = re.fullmatch(r'MESSIER0*(\d+)', name)
    if m: return 'M' + m.group(1)
    m = re.fullmatch(r'(NGC|IC|UGC|UGCA|ESO|PGC|DDO|KK|KKH|KKR|AGC|MCG|CGCG)0*(\d.*)', name)
    if m:
        cat, rest = m.groups()
        if cat == 'NGC' and rest.isdigit() and int(rest) in MESSIER: return 'M%d' % MESSIER[int(rest)]
        return cat + ' ' + rest
    return name

def place(ra_deg, dec_deg, dist):
    v = unit(ra_deg * D2R, dec_deg * D2R)
    return (EQ2SG @ v) * dist

rows = []

# ---------------------------------------------------------------- Local Volume Galaxy catalogue
def num(s):
    s = s.strip().lstrip('<>')
    try: return float(s)
    except ValueError: return None
started = False
for line in open(f'{src}/lvg_table1.dat', encoding='latin-1'):
    if not started:
        started = line.startswith('Note (14)') or started
        continue
    if len(line) < 110 or not re.match(r'\d{6}\.\d[+-]\d{6}', line[19:34]): continue
    name = line[0:18].strip()
    if name == 'Milky Way': continue
    ra = (int(line[19:21]) + int(line[21:23]) / 60 + float(line[23:27]) / 3600) * 15
    dec = (int(line[28:30]) + int(line[30:32]) / 60 + int(line[32:34]) / 3600) * (-1 if line[27] == '-' else 1)
    dist = num(line[107:112])
    if not dist or dist > LIMIT: continue
    a26, ba, ab, bmag, T = num(line[35:41]), num(line[42:46]), num(line[47:51]) or 0, num(line[59:64]), num(line[91:93])
    rows.append(dict(name=tidy(name), ra=ra, dec=dec, dist=dist, T=T, ba=ba, pa=None, src=0,
                     diam=a26 * dist * 1000 * D2R / 60 if a26 else None,
                     M=bmag - ab - 5 * math.log10(dist) - 25 if bmag is not None else None,
                     method=line[113:117].strip()))
n_lvg = len(rows)

# ---------------------------------------------------------------- Cosmicflows-3 distances + HyperLEDA
cf3 = {}
for line in open(f'{src}/EDD_CF3_2017Sep28.txt'):
    if line[0] in '#%': continue
    p = line.split('|')
    cf3[int(p[0])] = (float(p[1]), float(p[4]))

with open(f'{src}/leda_vlsr5000.txt', encoding='latin-1') as f:
    hdr = [h.strip() for h in f.readline().lstrip('#').split('|')]
    col = {h: i for i, h in enumerate(hdr)}
    leda = []
    for line in f:
        p = [x.strip() for x in line.split('|')]
        if len(p) < 34: continue
        g = lambda k: (None if p[col[k]] in ('', 'NaN') else float(p[col[k]]))
        try: pgc = int(p[col['pgc']])
        except ValueError: continue
        leda.append(dict(name=p[col['objname']], pgc=pgc, ra=g('al2000') * 15 if g('al2000') is not None else None, dec=g('de2000'),
                         T=g('t'), logd25=g('logd25'), logr25=g('logr25'), pa=g('pa'), btc=g('btc'), typ=p[col['type']]))
leda = [l for l in leda if l['ra'] is not None and l['dec'] is not None]

# LVG rows take their position angle (and a finer type) from HyperLEDA where the same object is found
lra = np.array([l['ra'] for l in leda]) * D2R; ldec = np.array([l['dec'] for l in leda]) * D2R
def nearest(ra, dec):
    d = np.arccos(np.clip(np.sin(dec * D2R) * np.sin(ldec) + np.cos(dec * D2R) * np.cos(ldec) * np.cos(ra * D2R - lra), -1, 1))
    i = int(np.argmin(d)); return i, d[i] / D2R * 60        # index, separation in arcmin
taken = set()
for r in rows:
    i, sep = nearest(r['ra'], r['dec'])
    tol = max(1.0, 0.04 * (r["diam"] / (r["dist"] * 1000 * D2R / 60)) if r["diam"] else 1.0)
    if sep < tol:
        taken.add(leda[i]['pgc'])
        r['pa'] = leda[i]['pa']
        r['typ'] = leda[i]['typ']
        if r['T'] is None: r['T'] = leda[i]['T']

for l in leda:
    if l['pgc'] in taken or l['pgc'] not in cf3: continue
    dist, edm = cf3[l['pgc']]
    if dist > LIMIT or dist <= 0: continue
    d25 = 0.1 * 10 ** l['logd25'] if l['logd25'] is not None else None       # arcmin
    rows.append(dict(name=tidy(l['name']), ra=l['ra'], dec=l['dec'], dist=dist, T=l['T'], src=1, pa=l['pa'], typ=l['typ'],
                     ba=10 ** -l['logr25'] if l['logr25'] is not None else None,
                     diam=d25 * dist * 1000 * D2R / 60 if d25 else None,
                     M=l['btc'] - 5 * math.log10(dist) - 25 if l['btc'] is not None else None, method='CF3'))

# The two lists sometimes hold the same galaxy under two catalogue numbers or with slightly different
# coordinates. The Local Volume entry is kept; a Cosmicflows entry is dropped when it has the same name,
# or sits on top of a Local Volume galaxy at about the same distance.
local = [r for r in rows if r['src'] == 0]
lv = np.array([[math.cos(r['dec'] * D2R) * math.cos(r['ra'] * D2R), math.cos(r['dec'] * D2R) * math.sin(r['ra'] * D2R), math.sin(r['dec'] * D2R)] for r in local])
names, kept = set(), []
for r in rows:
    if r['name'] in names: continue
    if r['src'] == 1:
        u = np.array([math.cos(r['dec'] * D2R) * math.cos(r['ra'] * D2R), math.cos(r['dec'] * D2R) * math.sin(r['ra'] * D2R), math.sin(r['dec'] * D2R)])
        sep = np.degrees(np.arccos(np.clip(lv @ u, -1, 1))) * 60
        j = int(np.argmin(sep))
        if sep[j] < 2.5 and abs(local[j]['dist'] - r['dist']) < 0.25 * r['dist']: continue
    names.add(r['name'])
    kept.append(r)
rows = kept
n_lvg = sum(r['src'] == 0 for r in rows)

rows.sort(key=lambda r: r['dist'])
r3 = lambda x, n=3: None if x is None else round(float(x), n)
cols = dict(name=[], common=[], x=[], y=[], z=[], ra=[], dec=[], dist=[], T=[], type=[], diam=[], ba=[], pa=[], M=[], src=[], method=[])
for r in rows:
    p = place(r['ra'], r['dec'], r['dist'])
    cols['name'].append(r['name']); cols['common'].append(COMMON.get(r['name'], ''))
    cols['x'].append(r3(p[0])); cols['y'].append(r3(p[1])); cols['z'].append(r3(p[2]))
    cols['ra'].append(r3(r['ra'], 2)); cols['dec'].append(r3(r['dec'], 2)); cols['dist'].append(r3(r['dist'], 2))
    cols['T'].append(r3(r['T'], 1)); cols['type'].append(r.get('typ', '') or '')
    cols['diam'].append(r3(r['diam'], 2)); cols['ba'].append(r3(r['ba'], 2)); cols['pa'].append(r3(r['pa'], 0)); cols['M'].append(r3(r['M'], 1))
    cols['src'].append(r['src']); cols['method'].append(r['method'])
meta = dict(limit_mpc=LIMIT, count=len(rows), local_volume=n_lvg, frame='supergalactic cartesian, Mpc, Milky Way at the origin',
            sources=['Karachentsev, Makarov & Kaisina 2013 (Updated Nearby Galaxy Catalog / Local Volume Galaxy database)',
                     'Tully, Courtois & Sorce 2016 (Cosmicflows-3)', 'Makarov et al. 2014 (HyperLEDA)'])
json.dump(dict(meta=meta, **cols), open(out, 'w'), separators=(',', ':'))
print(len(rows), 'galaxies;', n_lvg, 'from the Local Volume catalogue;', len(rows) - n_lvg, 'from Cosmicflows-3')
