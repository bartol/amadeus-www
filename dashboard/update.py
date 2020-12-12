#!/usr/bin/env python3

import csv
import json
import os, shutil

bazadir = 'baza'
bazatmpdir = 'baza-tmp'
bazacachedir = 'baza-cache'
year = 2017

if not os.path.exists(bazatmpdir): os.mkdir(bazatmpdir)
if not os.path.exists(bazacachedir): os.mkdir(bazacachedir)

shutil.copyfile(f"{bazadir}/POD1/MALMAT.TPS", f"{bazatmpdir}/malmat.tps")
shutil.copyfile(f"{bazadir}/POD1/{year}/malst.tps", f"{bazatmpdir}/malst.tps")
os.system(f"java -jar tps-to-csv.jar -s {bazatmpdir}/malmat.tps -t {bazatmpdir}/malmat.csv")
os.system(f"java -jar tps-to-csv.jar -s {bazatmpdir}/malst.tps -t {bazatmpdir}/malst.csv")

with open(f'{bazatmpdir}/malmat.csv', encoding='cp852') as f:
    reader = csv.reader(f)
    next(reader)
    proizvodi = list(reader)

with open(f'{bazatmpdir}/malst.csv', encoding='cp852') as f:
    reader = csv.reader(f)
    next(reader)
    for p1 in reader:
        try:
            p2 = next(item for item in proizvodi if item[1] == p1[2])
        except:
            continue

        product = {
            'sifra': int(p1[2]),
            'grupa': int(p2[3]),
            'naziv': p2[4].rstrip(),
            'kolicina': int(float(p1[14])),
            'nabavna_cijena': float(p1[18]),
            'marza': float(p1[16]),
            'cijena': float(p1[9]),
            'rabat': float(p1[15])
        }

        cachepath = f"{bazacachedir}/{product['sifra']}"
        if os.path.exists(cachepath):
            with open(cachepath) as cf:
                cachedproduct = json.load(cf)
                if cachedproduct == product:
                    continue
                else:
                    print(product['sifra'])
                    print(set(cachedproduct.items()) ^ set(product.items()))

        with open(cachepath, 'w') as cf:
            json.dump(product, cf)
