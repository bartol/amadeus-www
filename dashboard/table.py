#!/usr/bin/env python3

import csv
import os
import psycopg2
import configparser

config = configparser.ConfigParser()
config.read('config.ini')

dbconn = config['global']['dbconn'].strip('"')
opencmd = config['table']['opencmd'].strip('"')

conn = psycopg2.connect(dbconn)
cur = conn.cursor()

def get(csvpath, columns, condition = ''):
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
            'p.naziv': 'naziv',
            'g.naziv': 'grupa',
            'g.sifra': 'šifra grupe'
        }
        columns[idx] = replacements.get(val, val)
    columns.insert(0, 'šifra')

    # write to file
    with open(csvpath,'w') as f:
        w = csv.writer(f)
        w.writerow(columns)
        for p in products:
            w.writerow(p)

    # open file
    cmd = opencmd.format(os.path.abspath(csvpath))
    os.system(cmd)
