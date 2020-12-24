#!/usr/bin/env python

from flask import Flask, render_template
import psycopg2
import configparser
from slugify import slugify

config = configparser.ConfigParser()
config.read('config.ini')

dbconn = config['global']['dbconn'].strip('"')
conn = psycopg2.connect(dbconn)
cur = conn.cursor()

app = Flask(__name__)

# routes

@app.route('/')
def index():
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

	return render_template('index.html', grupe=grupe)

@app.route('/kategorija/<int:id>-<string:slug>')
def category(id, slug):
	return f'kategorija: {id}'

@app.route('/proizvod/<int:id>-<string:slug>')
def product(id, slug):
	return f'proizvod: {id}'

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

@app.template_filter('slugify')
def _slugify(string):
	return slugify(string)

app.run(debug=True, host='0.0.0.0')
