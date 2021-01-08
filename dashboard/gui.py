#!venv/bin/python

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
import datetime
import pioneerhr

config = configparser.ConfigParser()
config.read('config.ini')

dbconn = config['global']['dbconn'].strip('"')
bazatmpdir = os.path.join(config['baza']['bazatmpdir'].strip('"'), 'table')
browser_path= os.path.join(config['gui']['browser_path'].strip('"'))

app = Flask(__name__, template_folder='.')
ui = FlaskUI(app, width=1000, height=750, browser_path=browser_path, port=5001)

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
    sifsearch = request.form.get('sifsearch')
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
    if sifsearch:
        condition.append(f"p.sifra = {sifsearch}")
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
        grupa = request.form.get('grupa')
        opis = request.form.get('opis')
        istaknut = request.form.get('istaknut')
        slike = request.form.getlist('images[]')
        feature = request.form.getlist('feature[]')
        feature_value = request.form.getlist('feature_value[]')
        related = request.form.getlist('slicni[]')

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

        cur.execute("DELETE FROM znacajke_vrijednosti WHERE sifra_proizvoda = %s;", (sifra,))

        for idx, naziv in enumerate(feature):
            if naziv == '': continue
            cur.execute("""
                SELECT sifra
                FROM znacajke
                WHERE naziv = %s AND sifra_grupe = %s;
            """, (naziv, grupa))
            feature = cur.fetchone()
            if feature == None:
                cur.execute("""
                    INSERT INTO znacajke (naziv, sifra_grupe)
                    VALUES (%s, %s) RETURNING sifra;
                """, (naziv, grupa))
                feature = cur.fetchone()

            vrijednost = feature_value[idx]
            if vrijednost == '': continue
            cur.execute("""
                INSERT INTO znacajke_vrijednosti (vrijednost, sifra_znacajke, sifra_proizvoda)
                VALUES (%s,%s,%s);
            """, (vrijednost, feature[0], sifra))

        cur.execute("DELETE FROM slicni_proizvodi WHERE sifra = %s", (sifra,))

        for r in related:
            cur.execute("""
                INSERT INTO slicni_proizvodi (sifra, sifra_slicnog)
                VALUES (%s,%s);
            """, (sifra, r))

        conn.commit()

        return redirect(f'/product/detail?product={sifra}')

    cur.execute("""
        SELECT sifra, naziv, web_opis, web_istaknut, grupa
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

    cur.execute("""
        SELECT naziv
        FROM znacajke
        WHERE sifra_grupe = %s;
    """, (product[4],))
    znacajke_grupe = cur.fetchall()

    ostale_znacajke = []
    for zg in znacajke_grupe:
        a = True
        for z in znacajke:
            if zg[0] == z[0]:
                a = False
        if a:
            ostale_znacajke.append(zg[0])

    cur.execute("""
        SELECT sifra_slicnog, naziv
        FROM slicni_proizvodi s
        INNER JOIN proizvodi p ON p.sifra = s.sifra_slicnog
        WHERE s.sifra = %s;
    """, (sifra,))
    slicni = cur.fetchall()

    return render_template('gui.html', page='productdetail', product=product,  slike=slike,
        znacajke=znacajke, ostale_znacajke=ostale_znacajke, slicni=slicni)

@app.route('/product/uploadimg', methods=['POST'])
def uploadimg():
    img = request.files['file']
    imgname = f'img/{random.randint(1000,9999)}-{secure_filename(img.filename)}'
    try:
        s3.upload_fileobj(img, 'amadeus2.hr', imgname,
            ExtraArgs={"ACL": "public-read", "ContentType": img.content_type})
    except:
        return ""
    return f'https://s3.eu-central-1.amazonaws.com/amadeus2.hr/{imgname}'

@app.route('/product/rmimg', methods=['POST'])
def rmimg():
    imgurl = request.args.get('imgurl')
    imgkey = imgurl[len('https://s3.eu-central-1.amazonaws.com/amadeus2.hr/'):]
    s3.delete_object(Bucket='amadeus2.hr', Key=imgkey)
    return ''

@app.route('/pioneerhr_migracija', methods=['POST'])
def pioneerhr_migracija():
    sifra = request.form.get('sifra')
    pioneerhr_id = request.form.get('pioneerhr_id')
    pioneerhr.migratedata(pioneerhr_id, sifra)
    return redirect(f'/product/detail?product={sifra}')

@app.route('/postavke', methods=['GET', 'POST'])
def postavke():
    if request.method == 'POST':
        slike = request.form.getlist('images[]')
        promourls = request.form.getlist('promourl[]')

        cur.execute("DELETE FROM covers WHERE amadeus2hr = 't';")

        for idx, link in enumerate(slike):
            promourl = promourls[idx]
            cur.execute("""
                INSERT INTO covers (link, pozicija, promourl, amadeus2hr)
                VALUES (%s, %s, %s, 't');
            """, (link, idx, promourl))

        sifre_grupe = request.form.getlist('sifre_grupe[]')
        slike_grupe = request.form.getlist('slike_grupe[]')

        for idx, sifra in enumerate(sifre_grupe):
            html = slike_grupe[idx]
            cur.execute("""
                UPDATE grupe
                SET img_html = %s
                WHERE sifra = %s;
            """, (html,sifra))

        datumi = request.form.getlist('datumi[]')
        sifrezadatume = request.form.getlist('sifrezadatume[]')

        for idx, d in enumerate(datumi):
            # check if product exists
            s = sifrezadatume[idx]
            sp = None
            if s != '':
                s = int(s)
                cur.execute("SELECT 1 FROM proizvodi WHERE sifra = %s", (s,))
                if cur.fetchone() != None:
                    sp = s

            # check if date exists
            cur.execute("SELECT 1 FROM akcija_dana WHERE day = %s", (d,))
            if cur.fetchone() == None:
                # insert
                cur.execute("""
                    INSERT INTO akcija_dana (day, sifra_proizvoda)
                    VALUES (%s, %s);
                """, (d, sp))
            else:
                # update
                cur.execute("""
                    UPDATE akcija_dana
                    SET sifra_proizvoda = %s
                    WHERE day = %s;
                """, (sp, d))

        promo_kodovi = request.form.getlist('promo_kod[]')
        promo_iznosi = request.form.getlist('promo_iznos[]')
        cur.execute("DELETE FROM promo_kodovi;")
        for idx, k in enumerate(promo_kodovi):
            iz = promo_iznosi[idx]
            if not k or not iz:
                continue
            cur.execute("""
                INSERT INTO promo_kodovi (kod, iznos)
                VALUES (%s, %s);
            """, (k, iz))

        conn.commit()
        return redirect('/postavke')

    cur.execute("SELECT link,promourl FROM covers WHERE amadeus2hr = 't' ORDER BY pozicija ASC;")
    covers = cur.fetchall()

    cur.execute("""
        SELECT z.sifra, z.naziv, g.naziv FROM znacajke z
        LEFT JOIN grupe g ON g.sifra = z.sifra_grupe
        WHERE NOT EXISTS (
            SELECT 1
            FROM znacajke_vrijednosti
            WHERE sifra_znacajke = z.sifra
        );
    """)
    unused_features = cur.fetchall()

    cur.execute("""
        SELECT sifra, naziv, img_html
        FROM grupe;
    """)
    grupe = cur.fetchall()

    datumi = []
    for n in range(7):
        datumi.append(datetime.date.today() + datetime.timedelta(days=n))

    datumisifre = []
    for d in datumi:
        cur.execute("""
            SELECT sifra_proizvoda, naziv
            FROM akcija_dana a
            LEFT JOIN proizvodi p ON p.sifra = a.sifra_proizvoda
            WHERE day = %s;
        """, (d,))
        akcd = cur.fetchone()
        if akcd is None:
            datumisifre.append((d, '', ''))
        else:
            datumisifre.append((d, akcd[0], akcd[1]))

    cur.execute("SELECT email FROM mailing_list")
    mailing_list = cur.fetchall()

    cur.execute("SELECT kod, iznos FROM promo_kodovi")
    promo_kodovi = cur.fetchall()

    return render_template('gui.html', page='postavke', covers=covers, mailing_list=mailing_list,
        unused_features=unused_features, grupe=grupe, datumi=datumisifre, promo_kodovi=promo_kodovi)

@app.route('/postavke/rmfeature', methods=['POST'])
def rmfeature():
    featureid = request.args.get('featureid')
    cur.execute("DELETE FROM znacajke WHERE sifra = %s", (featureid,))
    return ''

@app.route('/product/getname')
def getname():
    productid = request.args.get('productid')
    cur.execute("SELECT naziv FROM proizvodi WHERE sifra = %s", (productid,))
    product = cur.fetchone()
    if product:
        return product[0]
    return ''

@app.errorhandler(404)
def page_not_found(e):
    return render_template('gui.html', page='404'), 404

# app.run(debug=True)
ui.run()

# todo:
# https://github.com/ClimenteA/pyvan
