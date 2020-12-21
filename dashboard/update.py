#!/usr/bin/env python3

import csv
import json
import os, shutil
import psycopg2
import configparser

config = configparser.ConfigParser()
config.read('config.ini')

bazadir = config['baza']['bazadir'].strip('"')
bazatmpdir = os.path.join(config['baza']['bazatmpdir'].strip('"'), 'update')
bazacachedir = config['baza']['bazacachedir'].strip('"')
year = config['baza']['year']
dbconn = config['global']['dbconn'].strip('"')
windows = config['global']['windows'].strip('"')

if windows == "yes":
    import sys, io
    sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding = 'utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding = 'utf-8')

os.makedirs(bazatmpdir, exist_ok=True)
os.makedirs(os.path.join(bazacachedir, 'p'), exist_ok=True)
os.makedirs(os.path.join(bazacachedir, 'g'), exist_ok=True)

tmp_malmat = os.path.join(bazatmpdir, 'malmat')
tmp_malst = os.path.join(bazatmpdir, 'malst')
tmp_grupe = os.path.join(bazatmpdir, 'grupe')

shutil.copyfile(os.path.join(bazadir, 'POD1', 'MALMAT.TPS'), f"{tmp_malmat}.tps")
shutil.copyfile(os.path.join(bazadir, 'POD1', year, 'malst.tps'), f"{tmp_malst}.tps")
shutil.copyfile(os.path.join(bazadir, 'POD1', 'GRUPE.TPS'), f"{tmp_grupe}.tps")

os.system(f"java -jar tps-to-csv.jar -s {tmp_malmat}.tps -t {tmp_malmat}.csv")
os.system(f"java -jar tps-to-csv.jar -s {tmp_malst}.tps -t {tmp_malst}.csv")
os.system(f"java -jar tps-to-csv.jar -s {tmp_grupe}.tps -t {tmp_grupe}.csv")

conn = psycopg2.connect(dbconn)
cur = conn.cursor()

with open(f"{tmp_grupe}.csv", encoding='cp852') as f:
    reader = csv.reader(f)
    next(reader)
    for g in reader:
        group = {
            'sifra': int(g[1]),
            'naziv': g[2].rstrip()
        }

        cachepath = os.path.join(bazacachedir, 'g', str(group['sifra']))
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


with open(f"{tmp_malst}.csv", encoding='cp852') as f:
    reader = csv.reader(f)
    next(reader)
    cijene = list(reader)

with open(f"{tmp_malmat}.csv", encoding='cp852') as f:
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

        cur.execute("""
            SELECT 1
            FROM grupe
            WHERE sifra = %s;
            """, (product['grupa'],))

        if cur.fetchone() == None:
            product['grupa'] = None

        cachepath = os.path.join(bazacachedir, 'p', str(product['sifra']))
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

shutil.rmtree(bazatmpdir)
