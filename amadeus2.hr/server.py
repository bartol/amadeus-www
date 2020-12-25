#!/usr/bin/env python

from flask import Flask, render_template
import psycopg2
import configparser
from slugify import slugify
import datetime
from dateutil.relativedelta import relativedelta

config = configparser.ConfigParser()
config.read('config.ini')

dbconn = config['global']['dbconn'].strip('"')
conn = psycopg2.connect(dbconn)
cur = conn.cursor()

app = Flask(__name__)

# routes

@app.route('/')
def index():
	grupe = getbase()

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
		WHERE web_istaknut = 't';
	""")
	istaknuti_proizvodi = cur.fetchall()

	cur.execute("""
		SELECT sifra, naziv, web_cijena, web_cijena_s_popustom, kolicina, (
			SELECT link
			FROM slike
			WHERE sifra_proizvoda = p.sifra AND pozicija = 0
		) FROM akcija_dana a
        INNER JOIN proizvodi p ON p.sifra = a.sifra_proizvoda
        WHERE day = %s;
	""", (str(datetime.date.today()),))
	akcija_dana = cur.fetchone()

	return render_template('index.html', grupe=grupe, covers=covers,
		istaknuti_proizvodi=istaknuti_proizvodi, akcija_dana=akcija_dana)

@app.route('/kategorija/<int:id>-<string:slug>')
def category(id, slug):
	return f'kategorija: {id}'

@app.route('/proizvod/<int:id>-<string:slug>')
def product(id, slug):
	grupe = getbase()

	cur.execute("""
		SELECT sifra, naziv, web_cijena, web_cijena_s_popustom, web_opis
		FROM proizvodi
		WHERE amadeus2hr = 'x' AND sifra = %s;
	""", (id,))
	proizvod = cur.fetchone()

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

	return render_template('product.html', grupe=grupe, proizvod=proizvod, slike=slike,
		preporuceni_proizvodi=preporuceni_proizvodi)

@app.route('/search')
def search():
	return 'search'

@app.route('/contact', methods=['POST'])
def contact():
	return 'contact'

@app.route('/cart', methods=['GET', 'POST'])
def cart():
	return 'cart'

@app.route('/checkout', methods=['GET', 'POST'])
def checkout():
	return 'checkout'

# helpers

def getbase():
	cur.execute("""
		SELECT * FROM (
			SELECT sifra, naziv, img_html, (
				SELECT COUNT(*)
				FROM proizvodi
				WHERE grupa = g.sifra AND amadeus2hr = 'x'
			) AS broj_proizvoda
			FROM grupe g
		) x WHERE broj_proizvoda > 0;
	""")
	grupe = cur.fetchall()
	return grupe

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
