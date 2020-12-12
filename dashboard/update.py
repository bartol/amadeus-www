#!/usr/bin/env python3

import csv, os, shutil

bazadir = 'baza'
bazatmp = 'baza-tmp'

year = 2017

if not os.path.exists(bazatmp):
    os.mkdir(bazatmp)
shutil.copyfile(f"{bazadir}/POD1/MALMAT.TPS", f"{bazatmp}/malmat.tps")
shutil.copyfile(f"{bazadir}/POD1/{year}/malst.tps", f"{bazatmp}/malst.tps")
os.system(f"java -jar tps-to-csv.jar -s {bazatmp}/malmat.tps -t {bazatmp}/malmat.csv")
os.system(f"java -jar tps-to-csv.jar -s {bazatmp}/malst.tps -t {bazatmp}/malst.csv")

with open('baza-tmp/malmat.csv', encoding='cp852') as f:
    reader = csv.reader(f)
    next(reader)
    sviproizvodi = list(reader)

with open('baza-tmp/malst.csv', encoding='cp852') as f:
    reader = csv.reader(f)
    next(reader)
    aktivniproizvodi = list(reader)

for p in aktivniproizvodi:
    try:
        p2 = next(p2 for p2 in sviproizvodi if p2[1] == p[2])
    except:
        continue

    print("sifra:", p[2])
    print("grupa:", p2[3])
    print("naziv:", p2[4].rstrip())
    print("kolicina:", p[14])
    print("nabavna_cijena:", p[18])
    print("marza%:", p[16])
    print("cijena:", p[9])
    print("rabat%:", p[15])
