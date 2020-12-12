#!/usr/bin/env python3

import csv
import os, shutil

bazadir = 'baza'
bazatmp = 'baza-tmp'

year = 2017

if not os.path.exists(bazatmp):
    os.mkdir(bazatmp)
shutil.copyfile(f"{bazadir}/POD1/MALMAT.TPS", f"{bazatmp}/malmat.tps")
shutil.copyfile(f"{bazadir}/POD1/{year}/malst.tps", f"{bazatmp}/malst.tps")
os.system(f"java -jar tps-to-csv.jar -s {bazatmp}/malmat.tps -t {bazatmp}/malmat.csv")
os.system(f"java -jar tps-to-csv.jar -s {bazatmp}/malst.tps -t {bazatmp}/malst.csv")


def parseproducts(malmatpath, malstpath):

    with open(malmatpath, encoding='cp852') as f:
        reader = csv.reader(f)
        next(reader)
        sviproizvodi = list(reader)

    with open(malstpath, encoding='cp852') as f:
        reader = csv.reader(f)
        next(reader)
        aktivniproizvodi = list(reader)

    products = []

    for p in aktivniproizvodi:
        try:
            p2 = next(p2 for p2 in sviproizvodi if p2[1] == p[2])
        except:
            continue

        products.append({
            "sifra": int(p[2]),
            "grupa": int(p2[3]),
            "naziv": p2[4].rstrip(),
            "kolicina": int(float(p[14])),
            "nabavna_cijena": float(p[18]),
            "marza": float(p[16]),
            "cijena": float(p[9]),
            "rabat": float(p[15])
        })

    return products


products = parseproducts(f'{bazatmp}/malmat.csv', f'{bazatmp}/malst.csv')
print(products)
