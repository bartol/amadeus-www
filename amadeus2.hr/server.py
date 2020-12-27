#!/usr/bin/env python

from flask import Flask, render_template, request, abort
import psycopg2
import configparser
from slugify import slugify
import datetime
from dateutil.relativedelta import relativedelta
import math

config = configparser.ConfigParser()
config.read('config.ini')

dbconn = config['global']['dbconn'].strip('"')
conn = psycopg2.connect(dbconn)
cur = conn.cursor()

pagesize = 60

app = Flask(__name__)

# routes

@app.route('/')
def index():
	grupe = getgroup()
	akcija_dana = getakcijadana()

	cur.execute("""
		SELECT link, promourl
		FROM covers
		WHERE amadeus2hr = 't'
		ORDER BY pozicija ASC;
	""")
	covers = cur.fetchall()

	cur.execute("""
		SELECT sifra, naziv, web_cijena, web_cijena_s_popustom, (
			SELECT link
			FROM slike
			WHERE sifra_proizvoda = p.sifra AND pozicija = 0
		) FROM proizvodi p
		WHERE web_istaknut = 't' AND amadeus2hr = 'x';
	""")
	istaknuti_proizvodi = cur.fetchall()

	return render_template('index.html', grupe=grupe, covers=covers,
		istaknuti_proizvodi=istaknuti_proizvodi, akcija_dana=akcija_dana)

@app.route('/kategorija/<int:id>-<string:slug>')
def category(id, slug):
	grupe = getgroup()

	cur.execute("SELECT naziv FROM grupe WHERE sifra = %s", (id,))
	grupa = cur.fetchone()

	page = request.args.get('p', default=1, type=int)
	offset = (page - 1) * pagesize

	cijene = (request.args.get('c-min'), request.args.get('c-max'))
	sort = request.args.get('s')

	cur.execute("""
		SELECT sifra, naziv, web_cijena, web_cijena_s_popustom, (
			SELECT link
			FROM slike
			WHERE sifra_proizvoda = p.sifra AND pozicija = 0
		) FROM proizvodi p
		WHERE grupa = %s AND amadeus2hr = 'x'
		LIMIT %s OFFSET %s;
	""", (id, pagesize, offset))
	proizvodi = cur.fetchall()

	cur.execute("""
		SELECT DISTINCT z.sifra, naziv, vrijednost
		FROM znacajke_vrijednosti v
		INNER JOIN znacajke z ON v.sifra_znacajke = z.sifra
		WHERE sifra_grupe = %s
		ORDER BY naziv, vrijednost ASC;
	""", (id,))
	znacajkelist = cur.fetchall()

	znacajke = {}
	for z in znacajkelist:
		selected = False
		if z[2] in request.args.getlist(f'z-{z[0]}[]'):
			selected = True
		vrijednost = (z[2], selected)
		if z[0] in znacajke:
			znacajke[z[0]]['vrijednosti'].append(vrijednost)
		else:
			znacajke[z[0]] = { 'naziv': z[1], 'vrijednosti': [vrijednost] }

	cur.execute("""
		SELECT MIN(web_cijena_s_popustom)::INT, MAX(web_cijena_s_popustom)::INT, COUNT(*)
		FROM proizvodi
		WHERE grupa = %s AND amadeus2hr = 'x';
	""", (id,))
	agg = cur.fetchone()

	numofpages = math.ceil(agg[2] / pagesize)

	return render_template('category.html', grupe=grupe, grupa=grupa, proizvodi=proizvodi,
		znacajke=znacajke, agg=agg, page=page, numofpages=numofpages, cijene=cijene,
		sort=sort)

@app.route('/proizvod/<int:id>-<string:slug>')
def product(id, slug):
	grupe = getgroup()
	akcija_dana = getakcijadana()

	cur.execute("""
		SELECT p.sifra, p.naziv, web_cijena, web_cijena_s_popustom, web_opis, g.sifra, g.naziv
		FROM proizvodi p
		INNER JOIN grupe g ON p.grupa = g.sifra
		WHERE amadeus2hr = 'x' AND p.sifra = %s;
	""", (id,))
	proizvod = cur.fetchone()
	if not proizvod:
		abort(404)

	cur.execute("""
		SELECT link
		FROM slike
		WHERE sifra_proizvoda = %s
		ORDER BY pozicija ASC;
	""", (id,))
	slike = cur.fetchall()

	cur.execute("""
		SELECT p.sifra, naziv, web_cijena, web_cijena_s_popustom, (
			SELECT link
			FROM slike
			WHERE sifra_proizvoda = p.sifra AND pozicija = 0
		) FROM slicni_proizvodi s
		INNER JOIN proizvodi p ON s.sifra_slicnog = p.sifra
		WHERE s.sifra = %s;
	""", (id,))
	preporuceni_proizvodi = cur.fetchall()

	cur.execute("""
		SELECT naziv, vrijednost
		FROM znacajke_vrijednosti v
		INNER JOIN znacajke z ON z.sifra = v.sifra_znacajke
		WHERE sifra_proizvoda = %s;
	""", (id,))
	znacajke = cur.fetchall()

	return render_template('product.html', grupe=grupe, proizvod=proizvod, slike=slike,
		preporuceni_proizvodi=preporuceni_proizvodi, znacajke=znacajke, akcija_dana=akcija_dana)

@app.route('/search')
def search():
	return 'search'

@app.route('/contact', methods=['GET', 'POST'])
def contact():
	grupe = getgroup()
	return render_template('contact.html', grupe=grupe)

@app.route('/cart', methods=['GET', 'POST'])
def cart():
	return 'cart'

@app.route('/checkout', methods=['GET', 'POST'])
def checkout():
	return 'checkout'

# helpers

def getgroup():
	cur.execute("""
		SELECT * FROM (
			SELECT sifra, naziv, img_html, (
				SELECT COUNT(*)
				FROM proizvodi
				WHERE grupa = g.sifra AND amadeus2hr = 'x'
			) AS broj_proizvoda
			FROM grupe g
		) _
		WHERE broj_proizvoda > 0
		ORDER BY broj_proizvoda DESC;
	""")
	grupe = cur.fetchall()
	return grupe

def getakcijadana():
	cur.execute("""
		SELECT sifra, naziv, web_cijena, web_cijena_s_popustom, kolicina, (
			SELECT link
			FROM slike
			WHERE sifra_proizvoda = p.sifra AND pozicija = 0
		) FROM akcija_dana a
        INNER JOIN proizvodi p ON p.sifra = a.sifra_proizvoda
        WHERE day = %s AND amadeus2hr = 'x';
	""", (str(datetime.date.today()),))
	akcija_dana = cur.fetchone()
	return akcija_dana

@app.template_filter('slugify')
def _slugify(string):
	return slugify(string)

@app.context_processor
def date_stuff():
    return {'today': datetime.date.today(),
			'tomorrow': (datetime.date.today() + datetime.timedelta(days=1)),
			'diffdate': relativedelta,
			'parsedate': datetime.datetime.strptime}

@app.context_processor
def money_stuff():
	def formatmoney(amount):
		m = "{:,.2f}".format(float(amount)).replace(',', '.')
		return f'{m[:-3]},{m[-2:]} kn'
	return {'formatmoney': formatmoney}

app.run(debug=True, host='0.0.0.0')
