#!/usr/bin/env python

from flask import Flask, render_template, request, abort, redirect
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

	modified = False

	page = request.args.get('p', default=1, type=int)
	offset = (page - 1) * pagesize

	sort = request.args.get('s')
	sort_val = {
		'a-z': 'ORDER BY naziv ASC',
		'z-a': 'ORDER BY naziv DESC',
		'min-max': 'ORDER BY web_cijena_s_popustom ASC',
		'max-min': 'ORDER BY web_cijena_s_popustom DESC'
	}
	sort_sql = sort_val.get(sort, '')

	condition_sql = ''
	cijene = [request.args.get('c-min'), request.args.get('c-max')]
	if cijene[0]: cijene[0] = int(float(cijene[0]))
	if cijene[1]: cijene[1] = int(float(cijene[1]))
	if isinstance(cijene[0], int):
		condition_sql += f'AND web_cijena_s_popustom > {cijene[0]}'
	if isinstance(cijene[1], int):
		condition_sql += f'AND web_cijena_s_popustom < {cijene[1]}'

	if page > 1 or sort or isinstance(cijene[0], int) or isinstance(cijene[1], int):
		modified = True

	cur.execute("""
		SELECT DISTINCT z.sifra, naziv, vrijednost
		FROM znacajke_vrijednosti v
		INNER JOIN znacajke z ON v.sifra_znacajke = z.sifra
		WHERE sifra_grupe = %s
		ORDER BY naziv, vrijednost ASC;
	""", (id,))
	znacajkelist = cur.fetchall()

	znacajke = {}
	sel = {}
	for z in znacajkelist:
		selected = False
		if z[2] in request.args.getlist(f'z-{z[0]}[]'):
			selected = True
			modified = True
		vrijednost = (z[2], selected)
		if z[0] in znacajke:
			znacajke[z[0]]['vrijednosti'].append(vrijednost)
		else:
			znacajke[z[0]] = { 'naziv': z[1], 'vrijednosti': [vrijednost] }
		if selected:
			if z[0] in sel:
				sel[z[0]].append(z[2])
			else:
				sel[z[0]] = [z[2]]

	znacajke_exists_sql = ''
	znacajke_where_sql = ''
	for idx, sifra in enumerate(sel):
		lst = "'" + "','".join(sel[sifra]) + "'"
		znacajke_exists_sql += f',EXISTS (SELECT 1 FROM znacajke_vrijednosti WHERE sifra_proizvoda = p.sifra AND sifra_znacajke = {sifra} AND vrijednost IN ({lst})) AS z{sifra}'
		if znacajke_where_sql == '':
			znacajke_where_sql = f"WHERE z{sifra} = 't'"
		else:
			znacajke_where_sql += f" AND z{sifra} = 't'"

	sql = f"""
		SELECT * FROM (
			SELECT sifra, naziv, web_cijena, web_cijena_s_popustom, (
				SELECT link
				FROM slike
				WHERE sifra_proizvoda = p.sifra AND pozicija = 0
			)
			{znacajke_exists_sql}
			FROM proizvodi p
			WHERE grupa = %s AND amadeus2hr = 'x' {condition_sql}
		) _
		{znacajke_where_sql}
		{sort_sql}
		LIMIT %s OFFSET %s;
	"""
	cur.execute(sql, (id, pagesize, offset))
	proizvodi = cur.fetchall()

	cur.execute("""
		SELECT MIN(web_cijena_s_popustom)::INT, MAX(web_cijena_s_popustom)::INT, COUNT(*)
		FROM proizvodi
		WHERE grupa = %s AND amadeus2hr = 'x';
	""", (id,))
	agg = cur.fetchone()

	numofpages = math.ceil(agg[2] / pagesize)

	return render_template('category.html', grupe=grupe, grupa=grupa, proizvodi=proizvodi,
		znacajke=znacajke, agg=agg, page=page, numofpages=numofpages, cijene=cijene,
		sort=sort, modified=modified)

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
	query = request.args.get('q')
	if not query:
		return redirect('/')

	grupe = getgroup()

	modified = False

	cur.execute("""
	SELECT grupa, naziv FROM (
		SELECT DISTINCT grupa
		FROM proizvodi, plainto_tsquery(unaccent(%s)) query
		WHERE tsv @@ query AND amadeus2hr = 'x'
	) _
	INNER JOIN grupe g ON g.sifra = grupa
	""", (query,))
	filtergrupex = cur.fetchall()

	if len(filtergrupex) == 0:
		return render_template('search.html', grupe=grupe, query=query)

	kategorije = request.args.getlist('g[]', type=int)
	filtergrupe = []
	grupearr = []
	grupeselarr = []
	for grupa in filtergrupex:
		grupearr.append(str(grupa[0]))
		filtergrupe.append([grupa[0], grupa[1], (grupa[0] in kategorije)])
		if grupa[0] in kategorije:
			grupeselarr.append(str(grupa[0]))

	page = request.args.get('p', default=1, type=int)
	offset = (page - 1) * pagesize

	sort = request.args.get('s')
	sort_val = {
		'a-z': 'ORDER BY naziv ASC',
		'z-a': 'ORDER BY naziv DESC',
		'min-max': 'ORDER BY web_cijena_s_popustom ASC',
		'max-min': 'ORDER BY web_cijena_s_popustom DESC'
	}
	sort_sql = sort_val.get(sort, '')

	condition_sql = ''
	cijene = [request.args.get('c-min'), request.args.get('c-max')]
	if cijene[0]: cijene[0] = int(float(cijene[0]))
	if cijene[1]: cijene[1] = int(float(cijene[1]))
	if isinstance(cijene[0], int):
		condition_sql += f'AND web_cijena_s_popustom > {cijene[0]}'
	if isinstance(cijene[1], int):
		condition_sql += f'AND web_cijena_s_popustom < {cijene[1]}'

	if len(grupeselarr) > 0:
		condition_sql += f'AND grupa IN ({",".join(grupeselarr)})'

	if page > 1 or sort or len(grupeselarr) or isinstance(cijene[0], int) or isinstance(cijene[1], int):
		modified = True

	cur.execute(f"""
		SELECT DISTINCT z.sifra, naziv, vrijednost
		FROM znacajke_vrijednosti v
		INNER JOIN znacajke z ON v.sifra_znacajke = z.sifra
		WHERE sifra_grupe IN ({",".join(grupearr)})
		ORDER BY naziv, vrijednost ASC;
	""")
	znacajkelist = cur.fetchall()

	znacajke = {}
	sel = {}
	for z in znacajkelist:
		selected = False
		if z[2] in request.args.getlist(f'z-{z[0]}[]'):
			selected = True
			modified = True
		vrijednost = (z[2], selected)
		if z[0] in znacajke:
			znacajke[z[0]]['vrijednosti'].append(vrijednost)
		else:
			znacajke[z[0]] = { 'naziv': z[1], 'vrijednosti': [vrijednost] }
		if selected:
			if z[0] in sel:
				sel[z[0]].append(z[2])
			else:
				sel[z[0]] = [z[2]]

	znacajke_exists_sql = ''
	znacajke_where_sql = ''
	for idx, sifra in enumerate(sel):
		lst = "'" + "','".join(sel[sifra]) + "'"
		znacajke_exists_sql += f',EXISTS (SELECT 1 FROM znacajke_vrijednosti WHERE sifra_proizvoda = p.sifra AND sifra_znacajke = {sifra} AND vrijednost IN ({lst})) AS z{sifra}'
		if znacajke_where_sql == '':
			znacajke_where_sql = f"WHERE z{sifra} = 't'"
		else:
			znacajke_where_sql += f" AND z{sifra} = 't'"

	sql = f"""
		SELECT * FROM (
			SELECT sifra, ts_headline(naziv, query) AS naziv, web_cijena, web_cijena_s_popustom, (
				SELECT link
				FROM slike
				WHERE sifra_proizvoda = p.sifra AND pozicija = 0
			)
			{znacajke_exists_sql}
			FROM proizvodi p, websearch_to_tsquery(unaccent(%s)) query
			WHERE tsv @@ query AND amadeus2hr = 'x' {condition_sql}
			ORDER BY ts_rank(tsv, query) DESC
		) _
		{znacajke_where_sql}
		{sort_sql}
		LIMIT %s OFFSET %s;
	"""
	cur.execute(sql, (query, pagesize, offset))
	proizvodi = cur.fetchall()

	cur.execute("""
		SELECT MIN(web_cijena_s_popustom)::INT, MAX(web_cijena_s_popustom)::INT, COUNT(*)
		FROM proizvodi, websearch_to_tsquery(unaccent(%s)) query
		WHERE tsv @@ query AND amadeus2hr = 'x'
	""", (query,))
	agg = cur.fetchone()

	numofpages = math.ceil(agg[2] / pagesize)

	return render_template('search.html', grupe=grupe, query=query, proizvodi=proizvodi,
		znacajke=znacajke, agg=agg, page=page, numofpages=numofpages, cijene=cijene,
		sort=sort, modified=modified, filtergrupe=filtergrupe)

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
