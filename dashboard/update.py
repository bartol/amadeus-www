#!/usr/bin/env python3

import csv
import json
import os, shutil
import psycopg2
import configparser

config = configparser.ConfigParser()
config.read('update.ini')

bazadir = config['settings']['bazadir'].strip('"')
bazatmpdir = config['settings']['bazatmpdir'].strip('"')
bazacachedir = config['settings']['bazacachedir'].strip('"')
year = config['settings']['year']
dbconn = config['settings']['dbconn'].strip('"')

if not os.path.exists(bazatmpdir):
    os.mkdir(bazatmpdir)
if not os.path.exists(bazacachedir):
    os.mkdir(bazacachedir)
    os.mkdir(f'{bazacachedir}/p')
    os.mkdir(f'{bazacachedir}/g')

shutil.copyfile(f"{bazadir}/POD1/MALMAT.TPS", f"{bazatmpdir}/malmat.tps")
shutil.copyfile(f"{bazadir}/POD1/{year}/malst.tps", f"{bazatmpdir}/malst.tps")
shutil.copyfile(f"{bazadir}/POD1/GRUPE.TPS", f"{bazatmpdir}/grupe.tps")

os.system(f"java -jar tps-to-csv.jar -s {bazatmpdir}/malmat.tps -t {bazatmpdir}/malmat.csv")
os.system(f"java -jar tps-to-csv.jar -s {bazatmpdir}/malst.tps -t {bazatmpdir}/malst.csv")
os.system(f"java -jar tps-to-csv.jar -s {bazatmpdir}/grupe.tps -t {bazatmpdir}/grupe.csv")

conn = psycopg2.connect(dbconn)
cur = conn.cursor()

with open(f'{bazatmpdir}/grupe.csv', encoding='cp852') as f:
    reader = csv.reader(f)
    next(reader)
    for g in reader:
        group = {
            'sifra': int(g[1]),
            'naziv': g[2].rstrip()
        }

        cachepath = f"{bazacachedir}/g/{group['sifra']}"
        if os.path.exists(cachepath):
            with open(cachepath) as cf:
                cachedgroup = json.load(cf)
                if cachedgroup == group:
                    continue
                else:
                    diff = set(cachedgroup.items()) ^ set(group.items())
                    print('IZMJENE U GRUPI', group['sifra'], diff)

        cur.execute("""
            SELECT 1
            FROM grupe
            WHERE sifra = %s;
            """, (group['sifra'],))

        if cur.fetchone() == None:
            # insert group
            cur.execute("""
                INSERT INTO grupe (sifra,naziv)
                VALUES (%s,%s);
                """, (group['sifra'], group['naziv']))
            if cur.rowcount == 1:
                print('NOVA GRUPA', group['sifra'], group['naziv'])
        else:
            # update group
            cur.execute("""
                UPDATE grupe
                SET naziv = %s
                WHERE sifra = %s;
                """, (group['naziv'], group['sifra']))
            if cur.rowcount == 1:
                print('IZMJENJENA GRUPA', group['sifra'], group['naziv'])

        conn.commit()

        with open(cachepath, 'w') as cf:
            json.dump(group, cf)


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

        if product['grupa'] == 0:
            product['grupa'] = None

        cachepath = f"{bazacachedir}/p/{product['sifra']}"
        if os.path.exists(cachepath):
            with open(cachepath) as cf:
                cachedproduct = json.load(cf)
                if cachedproduct == product:
                    continue
                else:
                    diff = set(cachedproduct.items()) ^ set(product.items())
                    print('IZMJENE U PROIZVODU', product['sifra'], diff)

        cur.execute("""
            SELECT 1
            FROM proizvodi
            WHERE sifra = %s;
            """, (product['sifra'],))

        if cur.fetchone() == None:
            # insert product
            cur.execute("""
                INSERT INTO proizvodi (sifra,grupa,naziv,kolicina,nabavna_cijena,marza,cijena,rabat)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s);
                """, (product['sifra'], product['grupa'], product['naziv'], product['kolicina'],
                product['nabavna_cijena'], product['marza'], product['cijena'], product['rabat']))
            if cur.rowcount == 1:
                print('NOVI PROIZVOD', product['sifra'], product['naziv'])
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
                """, (product['grupa'], product['naziv'], product['kolicina'],
                product['nabavna_cijena'], product['marza'], product['cijena'],
                product['rabat'], product['sifra']))
            if cur.rowcount == 1:
                print('IZMJENJEN PROIZVOD', product['sifra'], product['naziv'])

        conn.commit()

        with open(cachepath, 'w') as cf:
            json.dump(product, cf)


cur.close()
conn.close()

shutil.rmtree(bazatmpdir)
