#!/usr/bin/env python3

import table

from flask import Flask, render_template, request, redirect
from flaskwebgui import FlaskUI
import psycopg2
import configparser
import os
import glob

config = configparser.ConfigParser()
config.read('config.ini')

dbconn = config['global']['dbconn'].strip('"')
bazatmpdir = config['baza']['bazatmpdir'].strip('"') + '/table'

app = Flask(__name__, template_folder='.')
ui = FlaskUI(app)

conn = psycopg2.connect(dbconn)
cur = conn.cursor()


@app.route('/')
def index():
    cur.execute("SELECT sifra, naziv FROM grupe;")
    grupe = cur.fetchall()
    return render_template('gui.html', page='index', grupe=grupe)


@app.route('/table/get', methods=['POST'])
def tableget():
    columns = request.form.getlist('columns[]')
    grupe = request.form.getlist('grupe[]')
    query = request.form.get('pretraga')
    only_amadeus2hr = True if request.form.get('only_amadeus2hr') else False
    only_pioneerhr = True if request.form.get('only_pioneerhr') else False
    only_njuskalohr = True if request.form.get('only_njuskalohr') else False
    limit = request.form.get('limit')
    offset = request.form.get('offset')

    condition = []
    if len(grupe) > 0:
        condition.append(f"g.sifra IN ({','.join(grupe)})")
    if query:
        condition.append(f"p.naziv ILIKE '%{query}%'")
    if only_amadeus2hr:
        condition.append("amadeus2hr = 'x'")
    if only_pioneerhr:
        condition.append("pioneerhr = 'x'")
    if only_njuskalohr:
        condition.append("njuskalohr = 'x'")
    conditionstr = ' AND '.join(condition)
    if len(condition) > 0:
        conditionstr = 'WHERE ' + conditionstr
    if limit:
        conditionstr += f' LIMIT {limit}'
    if offset:
        conditionstr += f' OFFSET {offset}'

    table.get(columns=columns, condition=conditionstr)

    return render_template('gui.html', page='success')

@app.route('/table/update', methods=['GET', 'POST'])
def tableupdate():
    if request.method == 'POST':
        tablepath = request.form.get('tablepath')
        try:
            table.update(tablepath)
        except Exception as e:
            return render_template('gui.html', page='err', msg=str(e))
        return render_template('gui.html', page='success')

    files = glob.glob(f"{bazatmpdir}/*.csv")
    files_list = sorted(files, key=lambda x: os.stat(x).st_mtime)[-5:][::-1]
    return render_template('gui.html', page='tableupdate', files=files_list)

@app.route('/table/uploadfile', methods=['POST'])
def tablefileupload():
    uploaded_file = request.files['tablefile']
    uploaded_file.save(f"{bazatmpdir}/{uploaded_file.filename}")
    return redirect('/table/update')

@app.errorhandler(404)
def page_not_found(e):
    return render_template('gui.html', page='404'), 404

ui.run()

# todo:
# https://github.com/ClimenteA/pyvan
