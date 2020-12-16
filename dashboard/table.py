#!/usr/bin/env python3

import csv
import os
import psycopg2
from psycopg2 import sql
import configparser
from datetime import datetime

config = configparser.ConfigParser()
config.read('config.ini')

dbconn = config['global']['dbconn'].strip('"')
opencmd = config['table']['opencmd'].strip('"')
bazatmpdir = os.path.join(config['baza']['bazatmpdir'].strip('"'), 'table')

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
            'web_cijena': 'Web cijena',
            'web_cijena_s_popustom': 'Web cijena s popustom',
            'amadeus2hr': 'Prikaži na amadeus2.hr',
            'pioneerhr': 'Prikaži na pioneer.hr',
            'njuskalohr': 'Prikaži na njuskalo.hr'
        }
        columns[idx] = replacements.get(val, val)
    columns.insert(0, 'Šifra (read-only)')

    # write to file
    time = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    csvpath = os.path.join(bazatmpdir, f'{time}.csv')

    with open(csvpath, 'w') as f:
        w = csv.writer(f)
        w.writerow(columns)
        for p in products:
            w.writerow(p)

    # open file
    cmd = opencmd.format(os.path.abspath(csvpath))
    os.system(cmd)

def update(tablepath):
    with open(tablepath) as f:
        r = csv.reader(f)
        header = next(r)
        allowed = [
            'Web cijena',
            'Web cijena s popustom',
            'Prikaži na amadeus2.hr',
            'Prikaži na pioneer.hr',
            'Prikaži na njuskalo.hr'
        ]
        replacements = {
            'Web cijena': 'web_cijena',
            'Web cijena s popustom': 'web_cijena_s_popustom',
            'Prikaži na amadeus2.hr': 'amadeus2hr',
            'Prikaži na pioneer.hr': 'pioneerhr',
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
            for col in columns:
                val = row[col[1]]
                if val == '':
                    val = None
                if col[0] in ['amadeus2hr', 'pioneerhr', 'njuskalohr'] and val:
                    val = 'x'
                values.append(val)
            values.append(sifra)

            cur.execute(query, tuple(values))

            if cur.rowcount == 1:
                print('IZMJENJEN PROIZVOD', sifra)

        conn.commit()
