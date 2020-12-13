#!/usr/bin/env python3

import csv
import json
import os, shutil
import psycopg2

bazadir = 'baza'
bazatmpdir = 'baza-tmp'
bazacachedir = 'baza-cache'
year = 2017
dbconn = 'dbname=kasa-testiranje user=postgres'

if not os.path.exists(bazatmpdir):
    os.mkdir(bazatmpdir)
if not os.path.exists(bazacachedir):
    os.mkdir(bazacachedir)

shutil.copyfile(f"{bazadir}/POD1/MALMAT.TPS", f"{bazatmpdir}/malmat.tps")
shutil.copyfile(f"{bazadir}/POD1/{year}/malst.tps", f"{bazatmpdir}/malst.tps")
shutil.copyfile(f"{bazadir}/POD1/GRUPE.TPS", f"{bazatmpdir}/grupe.tps")

os.system(f"java -jar tps-to-csv.jar -s {bazatmpdir}/malmat.tps -t {bazatmpdir}/malmat.csv")
os.system(f"java -jar tps-to-csv.jar -s {bazatmpdir}/malst.tps -t {bazatmpdir}/malst.csv")
os.system(f"java -jar tps-to-csv.jar -s {bazatmpdir}/grupe.tps -t {bazatmpdir}/grupe.csv")

conn = psycopg2.connect(dbconn)
cur = conn.cursor()

with open(f'{bazatmpdir}/malst.csv', encoding='cp852') as f:
    reader = csv.reader(f)
    next(reader)
    cijene = list(reader)

with open(f'{bazatmpdir}/malmat.csv', encoding='cp852') as f:
    reader = csv.reader(f)
    next(reader)
    for p in reader:
        c = []
        for cj in cijene:
            if cj[2] == p[1]:
                c = cj
        if len(c) == 0:
            continue

        product = {
            'sifra': int(p[1]),
            'grupa': int(p[3]),
            'naziv': p[4].rstrip(),
            'kolicina': int(float(c[14])),
            'nabavna_cijena': float(c[18]),
            'marza': float(c[16]),
            'cijena': float(c[9]),
            'rabat': float(c[15])
        }

        new = True
        cachepath = f"{bazacachedir}/{product['sifra']}"
        if os.path.exists(cachepath):
            with open(cachepath) as cf:
                cachedproduct = json.load(cf)
                if cachedproduct == product:
                    continue
                else:
                    diff = set(cachedproduct.items()) ^ set(product.items())
                    print('IZMJENJEN PROIZVOD', product['sifra'], diff)
                    new = False

        if new:
            # insert product
            print('NOVI PROIZVOD', product['sifra'], product['naziv'])
            cur.execute("""
                INSERT INTO proizvodi (sifra,grupa,naziv,kolicina,nabavna_cijena,marza,cijena,rabat)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s);
                """,
                (product['sifra'], product['grupa'], product['naziv'], product['kolicina'],
                product['nabavna_cijena'], product['marza'], product['cijena'], product['rabat']))
        else:
            # update product
            cur.execute("""
                UPDATE proizvodi
                SET grupa = %s,
                    naziv = %s,
                    kolicina = %s,
                    nabavna_cijena = %s,
                    marza = %s,
                    cijena = %s,
                    rabat = %s
                WHERE sifra = %s;
                """,
                (product['grupa'], product['naziv'], product['kolicina'], product['nabavna_cijena'],
                product['marza'], product['cijena'], product['rabat'], product['sifra']))

        conn.commit()

        with open(cachepath, 'w') as cf:
            json.dump(product, cf)


cur.close()
conn.close()

shutil.rmtree(bazatmpdir)
