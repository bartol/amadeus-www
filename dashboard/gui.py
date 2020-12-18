#!/usr/bin/env python3

import table

from flask import Flask, render_template, request, redirect
from flaskwebgui import FlaskUI
import psycopg2
import configparser
import os
import glob
import boto3, botocore
import random
from werkzeug.utils import secure_filename

config = configparser.ConfigParser()
config.read('config.ini')

dbconn = config['global']['dbconn'].strip('"')
bazatmpdir = os.path.join(config['baza']['bazatmpdir'].strip('"'), 'table')

app = Flask(__name__, template_folder='.')
ui = FlaskUI(app)

conn = psycopg2.connect(dbconn)
cur = conn.cursor()

cur.execute("SELECT value FROM cred WHERE key = 'aws_access_key_id';")
aws_access_key_id = cur.fetchone()[0]
cur.execute("SELECT value FROM cred WHERE key = 'aws_secret_access_key';")
aws_secret_access_key = cur.fetchone()[0]
s3 = boto3.client(
   "s3",
   aws_access_key_id=aws_access_key_id,
   aws_secret_access_key=aws_secret_access_key
)

@app.route('/')
def index():
    cur.execute("SELECT sifra, naziv FROM grupe ORDER BY naziv ASC;")
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
    sort = request.form.get('sort')

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
    if sort:
        conditionstr += f' ORDER BY {sort}'
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

    files = glob.glob(os.path.join(bazatmpdir, "*.csv"))
    files_list = sorted(files, key=lambda x: os.stat(x).st_mtime)[-5:][::-1]
    return render_template('gui.html', page='tableupdate', files=files_list)

@app.route('/table/uploadfile', methods=['POST'])
def tablefileupload():
    uploaded_file = request.files['tablefile']
    uploaded_file.save(os.path.join(bazatmpdir, uploaded_file.filename))
    return redirect('/table/update')

@app.route('/product/list')
def productlist():
    if request.args.get('showlist') == "true":
        cur.execute("SELECT sifra, naziv FROM proizvodi ORDER BY naziv ASC;")
        proizvodi = cur.fetchall()
        return render_template('gui.html', page='productlist', proizvodi=proizvodi)
    return render_template('gui.html', page='productlist')

@app.route('/product/detail', methods=['GET', 'POST'])
def productdetail():
    if not request.args.get('product'):
        return redirect(f'/product/list')
    sifra = request.args.get('product')
    if request.method == 'POST':
        opis = request.form.get('opis')
        istaknut = request.form.get('istaknut')
        slike = request.form.getlist('images[]')

        cur.execute("""
            UPDATE proizvodi
            SET web_opis = %s,
                web_istaknut = %s
            WHERE sifra = %s;
        """, (opis, istaknut, sifra))

        cur.execute("DELETE FROM slike WHERE sifra_proizvoda = %s;", (sifra,))

        for idx, link in enumerate(slike):
            cur.execute("""
                INSERT INTO slike (link, pozicija, sifra_proizvoda)
                VALUES (%s, %s, %s);
            """, (link, idx, sifra))

        conn.commit()

        return redirect(f'/product/detail?product={sifra}')

    cur.execute("""
        SELECT sifra, naziv, web_opis, web_istaknut
        FROM proizvodi
        WHERE sifra = %s;
    """, (sifra,))
    product = cur.fetchone()
    if product is None:
        return render_template('gui.html', page='err', msg='proizvod ne postoji')

    cur.execute("""
        SELECT link
        FROM slike
        WHERE sifra_proizvoda = %s
        ORDER BY pozicija ASC;
    """, (sifra,))
    slike = cur.fetchall()

    cur.execute("""
        SELECT naziv, vrijednost
        FROM znacajke_vrijednosti v
        INNER JOIN znacajke z ON z.sifra = v.sifra_znacajke
        WHERE sifra_proizvoda = %s;
    """, (sifra,))
    znacajke = cur.fetchall()

    return render_template('gui.html', page='productdetail',
        product=product, slike=slike, znacajke=znacajke)

@app.route('/product/uploadimg', methods=['POST'])
def uploadimg():
    img = request.files['file']
    imgname = f'{random.randint(1000,9999)}-{secure_filename(img.filename)}'
    try:
        s3.upload_fileobj(img, 'amadeus2.hr', imgname,
            ExtraArgs={"ACL": "public-read", "ContentType": img.content_type})
    except:
        return ""
    return f'https://s3.eu-central-1.amazonaws.com/amadeus2.hr/{imgname}'


@app.errorhandler(404)
def page_not_found(e):
    return render_template('gui.html', page='404'), 404

app.run(debug=True)
ui.run()

# todo:
# https://github.com/ClimenteA/pyvan
