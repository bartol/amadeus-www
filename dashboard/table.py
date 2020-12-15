#!/usr/bin/env python3

import csv
import os
import psycopg2
import configparser
from datetime import datetime

config = configparser.ConfigParser()
config.read('config.ini')

dbconn = config['global']['dbconn'].strip('"')
opencmd = config['table']['opencmd'].strip('"')
bazatmpdir = config['baza']['bazatmpdir'].strip('"') + '/table'

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
            'p.sifra': 'Šifra (read-only)',
            'p.naziv': 'Naziv (read-only)',
            'g.sifra': 'Šifra grupe (read-only)',
            'g.naziv': 'Grupa (read-only)',
            'kolicina': 'Količina (read-only)',
            'nabavna_cijena': 'Nabavna cijena (read-only)',
            'marza': 'Marža (read-only)',
            'cijena': 'Cijena (read-only)',
            'rabat': 'Rabat (read-only)'
        }
        columns[idx] = replacements.get(val, val)
    columns.insert(0, 'šifra')

    # write to file
    time = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    csvpath = f'{bazatmpdir}/{time}.csv'
    with open(csvpath,'w') as f:
        w = csv.writer(f)
        w.writerow(columns)
        for p in products:
            w.writerow(p)

    # open file
    cmd = opencmd.format(os.path.abspath(csvpath))
    os.system(cmd)
