#!/usr/bin/env python3

import csv
import os
import psycopg2
from psycopg2 import sql
import configparser
from datetime import datetime
import pioneerhr

config = configparser.ConfigParser()
config.read('config.ini')

dbconn = config['global']['dbconn'].strip('"')
opencmd = config['table']['opencmd'].strip('"')
bazatmpdir = os.path.join(config['baza']['bazatmpdir'].strip('"'), 'table')
windows = config['global']['windows'].strip('"')

if windows == "yes":
    import sys, io
    sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding = 'utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding = 'utf-8')

os.makedirs(bazatmpdir, exist_ok=True)

conn = psycopg2.connect(dbconn)
cur = conn.cursor()

def get(columns, condition = ''):
    # get products
    cur.execute(
        f"""
        SELECT p.sifra,{','.join(columns)}
        FROM proizvodi p
        LEFT JOIN grupe g ON g.sifra = p.grupa
        {condition};
        """)
    products = cur.fetchall()

    # replace some group names
    for idx, val in enumerate(columns):
        replacements = {
            'p.naziv': 'Naziv (read-only)',
            'g.sifra': 'Šifra grupe (read-only)',
            'g.naziv': 'Grupa (read-only)',
            'kolicina': 'Količina (read-only)',
            'nabavna_cijena': 'Nabavna cijena (read-only)',
            'marza': 'Marža (read-only)',
            'cijena': 'Cijena (read-only)',
            'rabat': 'Rabat (read-only)',
            'web_cijena_s_popustom': 'Web cijena s popustom',
            'vp_cijena': 'Veleprodajna cijena',
            'amadeus2hr': 'Prikaži na amadeus2.hr',
            'pioneerhr_id': 'Šifra na pioneer.hr',
            'pioneerhr': 'Prikaži na pioneer.hr',
            'njuskalohr': 'Prikaži na njuskalo.hr'
        }
        columns[idx] = replacements.get(val, val)
    columns.insert(0, 'Šifra (read-only)')

    # write to file
    time = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    csvpath = os.path.join(bazatmpdir, f'{time}.csv')

    with open(csvpath, 'w', encoding="utf-8-sig", newline='') as f:
        w = csv.writer(f)
        w.writerow(columns)
        for p in products:
            w.writerow(p)

    # open file
    cmd = opencmd.format(os.path.abspath(csvpath))
    os.system(cmd)

def update(tablepath):
    with open(tablepath, encoding="utf-8-sig", newline='') as f:
        r = csv.reader(f)
        header = next(r)
        allowed = [
            'Web cijena',
            'Web cijena s popustom',
            'Veleprodajna cijena',
            'Prikaži na amadeus2.hr',
            'Šifra na pioneer.hr',
            'Prikaži na pioneer.hr',
            'Prikaži na njuskalo.hr'
        ]
        replacements = {
            'Web cijena s popustom': 'web_cijena_s_popustom',
            'Veleprodajna cijena': 'vp_cijena',
            'Prikaži na amadeus2.hr': 'amadeus2hr',
            'Prikaži na pioneer.hr': 'pioneerhr',
            'Šifra na pioneer.hr': 'pioneerhr_id',
            'Prikaži na njuskalo.hr': 'njuskalohr'
        }
        columns = []
        for idx, val in enumerate(header):
            if val in allowed:
                columns.append((replacements[val], idx))

        if len(columns) < 2:
            raise Exception('tablica nema dovoljno stupaca')

        query = sql.SQL("UPDATE proizvodi SET {} WHERE sifra = {}").format(
            sql.SQL(', ').join(
                sql.Composed(
                    [sql.Identifier(c[0]), sql.SQL(" = "), sql.Placeholder()]
                ) for c in columns
            ),
            sql.Placeholder()
        )

        for row in r:
            sifra = int(row[0])
            values = []
            update_pioneer = False
            for col in columns:
                val = row[col[1]]
                if col[0] == 'pioneerhr_id' and val:
                    update_pioneer = True
                if val == '':
                    val = None
                if col[0] in ['amadeus2hr', 'pioneerhr', 'njuskalohr'] and val:
                    val = 'x'
                values.append(val)
            values.append(sifra)

            cur.execute(query, tuple(values))

            if cur.rowcount == 1:
                print('IZMJENJEN PROIZVOD', sifra)

            if update_pioneer:
                conn.commit()
                cur.execute("""
                SELECT pioneerhr_id, cijena, web_cijena_s_popustom, pioneerhr, kolicina
                FROM proizvodi
                WHERE sifra = %s
                """, (sifra,))
                p = cur.fetchone()
                pioneerhr.updateproduct(p[0], p[1], p[2], (p[3] == 'x'), p[4])

        conn.commit()
