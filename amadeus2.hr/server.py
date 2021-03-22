#!venv/bin/python

from flask import Flask, render_template, request, abort, redirect, session, flash, send_from_directory
import psycopg2
import configparser
from slugify import slugify
import datetime
from dateutil.relativedelta import relativedelta
import math, decimal
from drymail import SMTPMailer, Message
from urllib.parse import urlparse
import random
import hashlib
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from waitress import serve

config = configparser.ConfigParser()
config.read('config.ini')

dbconn = config['global']['dbconn'].strip('"')
conn = psycopg2.connect(dbconn)

secret_key = config['global']['secret_key'].strip('"')
wspaykey = config['global']['wspaykey'].strip('"')

mailhost = config['global']['mailhost'].strip('"')
mailport = config['global']['mailport']
mailuser = config['global']['mailuser'].strip('"')
mailpass = config['global']['mailpass'].strip('"')

mail = SMTPMailer(host=mailhost, port=mailport, user=mailuser, password=mailpass, ssl=True)

internal_email = config['global']['internal_email'].strip('"')

pagesize = 60

app = Flask(__name__)
app.secret_key = secret_key

limiter = Limiter(app, key_func=get_remote_address)

# routes

@app.route('/')
def index():
	cur = conn.cursor()
	akcija_dana = getakcijadana()

	cur.execute("""
		SELECT link, promourl
		FROM covers
		WHERE amadeus2hr = 't'
		ORDER BY pozicija ASC;
	""")
	covers = cur.fetchall()

	cur.execute("""
		SELECT sifra, naziv, cijena, web_cijena_s_popustom, (
			SELECT link
			FROM slike
			WHERE sifra_proizvoda = p.sifra AND pozicija = 0
		), kolicina FROM proizvodi p
		WHERE web_istaknut = 't' AND amadeus2hr = 'x';
	""")
	istaknuti_proizvodi = cur.fetchall()

	return render_template('index.html', covers=covers,
		istaknuti_proizvodi=istaknuti_proizvodi, akcija_dana=akcija_dana)

@app.route('/kategorija/<int:id>-<string:slug>')
def category(id, slug):
	cur = conn.cursor()

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
		SELECT DISTINCT z.sifra, z.naziv, vrijednost
		FROM znacajke_vrijednosti v
		INNER JOIN znacajke z ON v.sifra_znacajke = z.sifra
		INNER JOIN proizvodi p ON v.sifra_proizvoda = p.sifra
		WHERE sifra_grupe = %s AND amadeus2hr = 'x'
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
			SELECT sifra, naziv, cijena, web_cijena_s_popustom, (
				SELECT link
				FROM slike
				WHERE sifra_proizvoda = p.sifra AND pozicija = 0
			), kolicina
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

	return render_template('category.html', grupa=grupa, proizvodi=proizvodi,
		znacajke=znacajke, agg=agg, page=page, numofpages=numofpages, cijene=cijene,
		sort=sort, modified=modified)

@app.route('/proizvod/<int:id>-<string:slug>')
def product(id, slug):
	cur = conn.cursor()
	akcija_dana = getakcijadana()

	cur.execute("""
		SELECT p.sifra, p.naziv, cijena, web_cijena_s_popustom, web_opis, g.sifra, g.naziv, kolicina
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
		SELECT p.sifra, naziv, cijena, web_cijena_s_popustom, (
			SELECT link
			FROM slike
			WHERE sifra_proizvoda = p.sifra AND pozicija = 0
		), kolicina FROM slicni_proizvodi s
		INNER JOIN proizvodi p ON s.sifra_slicnog = p.sifra
		WHERE s.sifra = %s;
	""", (id,))
	preporuceni_proizvodi = cur.fetchall()

	cur.execute("""
		SELECT naziv, vrijednost
		FROM znacajke_vrijednosti v
		INNER JOIN znacajke z ON z.sifra = v.sifra_znacajke
		WHERE sifra_proizvoda = %s
		ORDER BY naziv ASC;
	""", (id,))
	znacajke = cur.fetchall()

	web_desc = proizvod[1] + '; '
	for znacajka in znacajke:
		web_desc = web_desc + f'{znacajka[0]}: {znacajka[1]}, '

	return render_template('product.html', proizvod=proizvod, slike=slike, web_desc=web_desc,
		preporuceni_proizvodi=preporuceni_proizvodi, znacajke=znacajke, akcija_dana=akcija_dana)

@app.route('/search')
def search():
	cur = conn.cursor()
	query = request.args.get('q')
	if not query:
		return redirect('/')
	if query.lower() == "dyson":
		return redirect('/static/dyson_digital_demo_zone/index.html')
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
		return render_template('search.html', query=query)

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
		SELECT DISTINCT z.sifra, z.naziv, vrijednost, g.naziv
		FROM znacajke_vrijednosti v
		INNER JOIN znacajke z ON v.sifra_znacajke = z.sifra
		INNER JOIN proizvodi p ON v.sifra_proizvoda = p.sifra
		INNER JOIN grupe g ON g.sifra = sifra_grupe
		WHERE sifra_grupe IN ({",".join(grupearr)}) AND amadeus2hr = 'x'
		ORDER BY z.naziv, vrijednost ASC;
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
			znacajke[z[0]] = { 'naziv': f"{z[1]} ({z[3]})" if len(grupearr) > 1 else z[1], 'vrijednosti': [vrijednost] }
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
			SELECT sifra, ts_headline(naziv, query) AS naziv, cijena, web_cijena_s_popustom, (
				SELECT link
				FROM slike
				WHERE sifra_proizvoda = p.sifra AND pozicija = 0
			), kolicina
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

	return render_template('search.html', query=query, proizvodi=proizvodi,
		znacajke=znacajke, agg=agg, page=page, numofpages=numofpages, cijene=cijene,
		sort=sort, modified=modified, filtergrupe=filtergrupe)

@app.route('/search_autocomplete')
def search_autocomplete():
	cur = conn.cursor()
	query = request.args.get('q')
	if not query:
		return ""

	query += ':*'
	cur.execute("""
		SELECT sifra, ts_headline(naziv, query) AS naziv, cijena, web_cijena_s_popustom, (
			SELECT link
			FROM slike
			WHERE sifra_proizvoda = p.sifra AND pozicija = 0
		), kolicina
		FROM proizvodi p, websearch_to_tsquery(unaccent(%s)) query
		WHERE tsv @@ query AND amadeus2hr = 'x'
		ORDER BY ts_rank(tsv, query) DESC
		LIMIT 4;
	""", (query,))
	proizvodi = cur.fetchall()

	if not len(proizvodi):
		return ""

	return render_template('partials/search_autocomplete.html', proizvodi=proizvodi)

@app.route('/contact', methods=['GET', 'POST'])
def contact():
	if request.method == 'POST':
		customer_email = request.form.get('email')
		customer_message = request.form.get('message')
		url = request.headers.get("Referer")
		if not customer_email or not customer_message:
			return ""
		html = render_template('emails/admin/contact.html', email=customer_email, message=customer_message, url=url)
		message = Message(subject='[amadeus2.hr] Nova poruka', sender=('Amadeus web trgovina', 'web@amadeus2.hr'),
                  receivers=[internal_email], reply_to=[customer_email], bcc=['web@amadeus2.hr'], html=html)
		try:
			mail.send(message)
			return render_template('partials/contact_resp.html', message=customer_message, success=True)
		except:
			return render_template('partials/contact_resp.html', message=customer_message, success=False)

	return render_template('contact.html')

@app.route('/cart', methods=['GET', 'POST'])
def cart():
	cur = conn.cursor()
	# add item
	if request.method == 'POST':
		sifra = request.form.get('sifra', type=int)
		kolicina = request.form.get('kolicina', type=int)

		cart = session.get('cart', default=[])
		idx = find(cart, 'sifra', sifra)

		cur.execute("SELECT kolicina FROM proizvodi WHERE sifra = %s", (sifra,))
		maxkolicina = cur.fetchone()

		if kolicina < 1:
			flash(f'Količina ({kolicina}) za proizvod (šifra: {sifra}) nije valjana', 'danger')
			return redirect(request.referrer)

		if maxkolicina == None:
			flash(f'Proizvod (šifra: {sifra}) ne postoji', 'danger')
			return redirect(request.referrer)

		if idx == -1:
			if kolicina > maxkolicina[0]:
				flash(f'Tražena količina ({kolicina}) za proizvod (šifra: {sifra}, dostupno: {maxkolicina[0]} kom.) nije dostupna', 'danger')
				return redirect(request.referrer)
			cart.append({'sifra': sifra, 'kolicina': kolicina})
		else:
			nova_kolicina = cart[idx]['kolicina'] + kolicina
			if nova_kolicina > maxkolicina[0]:
				flash(f'Tražena količina ({nova_kolicina}) za proizvod (šifra: {sifra}, dostupno: {maxkolicina[0]} kom.) nije dostupna', 'danger')
				return redirect(request.referrer)
			cart[idx]['kolicina'] = nova_kolicina

		session['cart'] = cart
		flash(f'Proizvod (šifra: {sifra}) dodan u košaricu', 'success')
		return redirect('/cart')

	cart, cart_products, cijene = getcart()
	return render_template('cart.html', cart=cart, cart_products=cart_products, cijene=cijene, promo_kod=session.get('promo_kod'))

@app.route('/cart/delete', methods=['POST'])
def cart_delete():
	sifra = request.form.get('sifra', type=int)
	cart = session.get('cart', default=[])
	idx = find(cart, 'sifra', sifra)
	if idx > -1:
		del cart[idx]
	else:
		flash(f'Proizvod (šifra: {sifra}) ne postoji', 'danger')
		return redirect('/cart')
	session['cart'] = cart
	flash(f'Proizvod (šifra: {sifra}) uklonjen iz košarice', 'success')
	return redirect('/cart')

@app.route('/cart/kolicina', methods=['POST'])
def cart_kolicina():
	cur = conn.cursor()
	sifra = request.form.get('sifra', type=int)
	kolicina = request.form.get('kolicina', type=int)

	cart = session.get('cart', default=[])
	idx = find(cart, 'sifra', sifra)

	cur.execute("SELECT kolicina FROM proizvodi WHERE sifra = %s", (sifra,))
	maxkolicina = cur.fetchone()

	if kolicina < 1:
		flash(f'Količina ({kolicina}) za proizvod (šifra: {sifra}) nije valjana', 'danger')
		return redirect('/cart')

	if idx > -1:
		if kolicina > maxkolicina[0]:
			flash(f'Tražena količina ({kolicina}) za proizvod (šifra: {sifra}, dostupno: {maxkolicina[0]} kom.) nije dostupna', 'danger')
			return redirect(request.referrer)
		cart[idx]['kolicina'] = kolicina
	else:
		flash(f'Proizvod (šifra: {sifra}) ne postoji', 'danger')
		return redirect('/cart')
	session['cart'] = cart
	flash(f'Količina ({kolicina}) za proizvod (šifra: {sifra}) uspješno promjenjena', 'success')
	return redirect('/cart')

@app.route('/cart/setmethod', methods=['POST'])
def cart_set_method():
	nacinplacanja = request.form.get('nacinplacanja')
	session['nacinplacanja'] = nacinplacanja

	cart, cart_products, cijene = getcart()
	return render_template('partials/price_table.html', cijene=cijene)

@app.route('/cart/setcard', methods=['POST'])
def cart_set_card():
	card = request.form.get('card')
	session['card'] = card
	brojrata = request.form.get('brojrata', type=int)
	session['brojrata'] = brojrata

	cart, cart_products, cijene = getcart()
	return render_template('partials/price_table.html', cijene=cijene)

def set_checkout(formkey, required, checkbox=False):
	formdata = request.form.get(formkey)
	if checkbox:
		session['checkout'][formkey] = True if formdata else False
		if required and session['checkout'][formkey] == False:
			raise Exception(f'{formkey} not valid')
	if formdata != None:
		session['checkout'][formkey] = formdata
	elif required:
		raise Exception(f'{formkey} not valid')

@app.route('/checkout', methods=['GET', 'POST'])
def checkout():
	ajax = request.form.get('ajax', type=bool, default=False)
	if request.method == 'POST':
		try:
			set_checkout('p-ime', True)
			set_checkout('p-prezime', True)
			set_checkout('p-ulica', True)
			set_checkout('p-postanskibroj', True)
			set_checkout('p-mjesto', True)
			set_checkout('p-drzava', True)
			set_checkout('p-email', True)
			set_checkout('p-mobitel', True)
			set_checkout('terms', True, checkbox=True)
		except:
			abort(400)
		set_checkout('d-notuse', False, checkbox=True)
		set_checkout('d-ime', False)
		set_checkout('d-prezime', False)
		set_checkout('d-ulica', False)
		set_checkout('d-postanskibroj', False)
		set_checkout('d-mjesto', False)
		set_checkout('d-drzava', False)
		set_checkout('d-email', False)
		set_checkout('d-mobitel', False)
		set_checkout('r-use', False, checkbox=True)
		set_checkout('tvrtka', False)
		set_checkout('oib', False)
		set_checkout('napomene', False)
		set_checkout('savedata', False, checkbox=True)

		order_id = f'web-{randomDigits(5)}'
		session['order_id'] = order_id
		cart, cart_products, cijene = getcart()
		if not ajax:
			html = render_template('emails/checkout.html', checkout=session.get('checkout'),
				order_id=order_id, cart=cart, cart_products=cart_products, cijene=cijene,
				card=session.get('card', default='VISA'), brojrata=session.get('brojrata', default=1))
			message = Message(subject=f'[amadeus2.hr] Narudžba ({order_id})', sender=('Amadeus web trgovina', 'web@amadeus2.hr'),
					receivers=[session['checkout'].get('p-email')], reply_to=[internal_email], bcc=[internal_email, 'web@amadeus2.hr'], html=html)
			try:
				mail.send(message)
			except:
				return redirect('/failure')

			session['cart_sum_tmp'] = str(cijene['sum'])
			if not session['checkout'].get('savedata'):
				session['checkout'] = {}
			session['cart'] = []
			session['promo_kod'] = ''
			session['promo_iznos'] = ''

			return redirect('/success')
		else:
			sig_plain = "PIONEERHR" + wspaykey + order_id + wspaykey + "{:.2f}".format(float(cijene['sum'])).replace('.', '') + wspaykey
			countries = {
				'Hrvatska': 'HR'
			}
			country = countries.get(session['checkout'].get('p-drzava'))
			plan = "{:02}00".format(session.get('brojrata', default=1)) if session.get('brojrata', default=1) > 1 else '0000'
			return {
				'order_id': order_id,
				'totalamount': "{:.2f}".format(float(cijene['sum'])).replace('.', ','),
				'signature': hashlib.sha512(sig_plain.encode('utf-8')).hexdigest(),
				'firstname': session['checkout'].get('p-ime'),
				'lastname': session['checkout'].get('p-prezime'),
				'email': session['checkout'].get('p-email'),
				'address': session['checkout'].get('p-ulica'),
				'city': session['checkout'].get('p-mjesto'),
				'zip': session['checkout'].get('p-postanskibroj'),
				'country': country,
				'phone': session['checkout'].get('p-mobitel'),
				'paymentplan': plan,
				'card': session.get('card', default='VISA')
			}
	if not session.get('checkout'):
		session['checkout'] = {}
		session['checkout']['d-notuse'] = "on"
		session['checkout']['savedata'] = "on"
	cart, cart_products, cijene = getcart()
	return render_template('checkout.html', cart=cart, cijene=cijene, checkout=session.get('checkout'))

@app.route('/cart/promocheck', methods=['POST'])
@limiter.limit('20 per hour')
def promocheck():
	cur = conn.cursor()
	kod = request.form.get('kod')
	session['promo_kod'] = kod
	cur.execute("""
	SELECT iznos FROM promo_kodovi WHERE kod = %s
	""", (kod,))
	promo = cur.fetchone()
	if promo == None:
		session['promo_iznos'] = ''
		return render_template('partials/promocheck_resp.html')
	session['promo_iznos'] = str(promo[0])
	return render_template('partials/promocheck_resp.html', success=True, iznos=promo[0])

@app.route('/cart/pricetable', methods=['POST'])
def getpricetable():
	cart, cart_products, cijene = getcart()
	return render_template('partials/price_table.html', cijene=cijene)

@app.route('/cookieconsent', methods=['POST'])
def cookieconsent():
	session['hidecookieconsent'] = True
	return ''

@app.route('/success', methods=['GET', 'POST'])
def success():
	if request.method == 'POST':
		print(request.form)

		order_id = request.form.get('ShoppingCartID')
		session['order_id'] = order_id
		cart, cart_products, cijene = getcart()
		html = render_template('emails/checkout.html', checkout=session.get('checkout'),
			order_id=order_id, cart=cart, cart_products=cart_products, cijene=cijene,
			card=session.get('card', default='VISA'), brojrata=session.get('brojrata', default=1))
		message = Message(subject=f'[amadeus2.hr] Narudžba ({order_id})', sender=('Amadeus web trgovina', 'web@amadeus2.hr'),
				receivers=[session['checkout'].get('p-email')], reply_to=[internal_email], bcc=[internal_email, 'web@amadeus2.hr'], html=html)
		try:
			mail.send(message)
		except:
			return redirect('/failure')

		if not session['checkout'].get('savedata'):
			session['checkout'] = {}
		session['cart'] = []
		session['promo_kod'] = ''
		session['promo_iznos'] = ''

	flash('Narudžba je uspješno zaprimljena. Svi detalji su poslani na Vašu email adresu.', 'success')
	if session.get('nacinplacanja') == 'po-ponudi':
		return redirect('/uplata-na-racun')
	return redirect('/')

@app.route('/uplata-na-racun')
def uplata():
	return render_template('uplata-na-racun.html', order_id=session.get('order_id'),
		sum=decimal.Decimal(session.get('cart_sum_tmp') if session.get('cart_sum_tmp') else 0))

@app.route('/failure', methods=['GET', 'POST'])
def failure():
	if request.method == 'POST':
		print(request.form)

	flash('Dogodila se pogreška prilikom obrade narudžbe. Molimo pokušajte ponovo ili nas kontaktirajte na <a href="mailto:info@pioneer.hr" class="alert-link">info@pioneer.hr</a>.', 'danger')
	return redirect('/checkout')

@app.route('/cancel', methods=['GET', 'POST'])
def cancel():
	if request.method == 'POST':
		print(request.form)

	flash('Narudžba je uspješno otkazana', 'success')
	return redirect('/')

@app.route('/tracking', methods=['GET', 'POST'])
def tracking():
	cur = conn.cursor()
	params = request.form
	if request.method == 'GET':
		params = request.args
	col = params.get('col')
	email = params.get('email')
	current_web_cijena = params.get('current_web_cijena')
	current_web_cijena_s_popustom = params.get('current_web_cijena_s_popustom')
	current_quantity = params.get('current_quantity')
	sifra_proizvoda = params.get('sifra_proizvoda')
	if col == "price":
		cur.execute("""
		INSERT INTO price_tracking (email,current_web_cijena,current_web_cijena_s_popustom,sifra_proizvoda)
		VALUES (%s,%s,%s,%s)
		""", (email, current_web_cijena, current_web_cijena_s_popustom, sifra_proizvoda))
		conn.commit()
		if request.method == 'GET':
			flash('Email uspješno dodan na listu', 'success')
			return redirect('/')
		return render_template('partials/tracking_resp.html', success=True)
	if col == "quantity":
		cur.execute("""
		INSERT INTO quantity_tracking (email,current_quantity,sifra_proizvoda)
		VALUES (%s,%s,%s)
		""", (email, current_quantity, sifra_proizvoda))
		conn.commit()
		if request.method == 'GET':
			flash('Email uspješno dodan na listu', 'success')
			return redirect('/')
		return render_template('partials/tracking_resp.html', success=True)
	if request.method == 'GET':
		flash('Greška prilikom dodavanja na listu', 'danger')
		return redirect('/')
	return render_template('partials/tracking_resp.html')

@app.route('/mailinglist', methods=['POST'])
def mailinglist():
	cur = conn.cursor()
	email = request.form.get('email')
	if not email:
		return render_template('partials/mailinglist_resp.html')
	try:
		cur.execute("INSERT INTO mailing_list (email) VALUES (%s)", (email,))
		conn.commit()
	except Exception as e:
		print(e)
		return render_template('partials/mailinglist_resp.html')
	return render_template('partials/mailinglist_resp.html', success=True)

@app.route('/sitemap.xml')
def sitemap():
	cur = conn.cursor()
	cur.execute("SELECT sifra, naziv FROM proizvodi WHERE amadeus2hr = 'x'")
	proizvodi = cur.fetchall()
	return render_template('sitemap.xml', proizvodi=proizvodi, grupe=getgroup()), 200, {'Content-Type': 'text/xml'}

@app.route('/info/<page>')
def infopage(page):
	if page in ['uvjeti-poslovanja', 'izjava-o-privatnosti', 'izjava-o-sigurnosti', 'dostava', 'povrat-i-zamjena']:
		return render_template('infopage.html', page=page)
	return abort(404)

@app.route('/robots.txt')
def static_from_root():
    return send_from_directory(app.static_folder, request.path[1:])

@app.errorhandler(404)
def page_not_found(e):
    return render_template('errors/404.html'), 404

@app.errorhandler(500)
def internal_server_error(e):
    return render_template('errors/500.html'), 500

# jobs

@app.route('/cron/send_price_tracking_notifications', methods=['POST'])
def price_tracking_job():
	cur = conn.cursor()
	cur.execute("""
	SELECT email, current_web_cijena, current_web_cijena_s_popustom, cijena, web_cijena_s_popustom, p.naziv, p.kolicina, p.sifra, t.sifra
	FROM price_tracking t
	INNER JOIN proizvodi p ON p.sifra = t.sifra_proizvoda
	WHERE sent IS NULL AND (current_web_cijena <> cijena OR current_web_cijena_s_popustom <> web_cijena_s_popustom)
	""")
	trackers = cur.fetchall()
	for tracker in trackers:
		html = render_template('emails/price_tracker.html', tracker=tracker)
		message = Message(subject=f'[amadeus2.hr] Obavijest o promjeni cijene', sender=('Amadeus web trgovina', 'web@amadeus2.hr'),
				receivers=[tracker[0]], reply_to=[internal_email], bcc=['web@amadeus2.hr'], html=html)
		try:
			mail.send(message)
			cur.execute("UPDATE price_tracking SET sent = 't' WHERE sifra = %s", (tracker[8],))
			conn.commit()
		except Exception as e:
			print(e)
			pass
	return ""

@app.route('/cron/send_quantity_tracking_notifications', methods=['POST'])
def quantity_tracking_job():
	cur = conn.cursor()
	cur.execute("""
	SELECT email, current_quantity, cijena, web_cijena_s_popustom, p.naziv, p.kolicina, p.sifra, t.sifra
	FROM quantity_tracking t
	INNER JOIN proizvodi p ON p.sifra = t.sifra_proizvoda
	WHERE sent IS NULL AND (current_quantity <> p.kolicina)
	""")
	trackers = cur.fetchall()
	for tracker in trackers:
		html = render_template('emails/quantity_tracker.html', tracker=tracker)
		message = Message(subject=f'[amadeus2.hr] Obavijest o promjeni dostupnosti', sender=('Amadeus web trgovina', 'web@amadeus2.hr'),
				receivers=[tracker[0]], reply_to=[internal_email], bcc=['web@amadeus2.hr'], html=html)
		try:
			mail.send(message)
			cur.execute("UPDATE quantity_tracking SET sent = 't' WHERE sifra = %s", (tracker[8],))
			conn.commit()
		except Exception as e:
			print(e)
			pass
	return ""

# helpers

def getgroup():
	cur = conn.cursor()
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
	cur = conn.cursor()
	cur.execute("""
		SELECT sifra, naziv, cijena, web_cijena_s_popustom, kolicina, (
			SELECT link
			FROM slike
			WHERE sifra_proizvoda = p.sifra AND pozicija = 0
		) FROM akcija_dana a
        INNER JOIN proizvodi p ON p.sifra = a.sifra_proizvoda
        WHERE day = %s AND amadeus2hr = 'x';
	""", (str(datetime.date.today()),))
	akcija_dana = cur.fetchone()
	return akcija_dana

def getcart():
	cur = conn.cursor()
	cart = session.get('cart', default=[])
	cart_products = []
	for item in cart:
		cur.execute("""
			SELECT sifra, naziv, cijena, web_cijena_s_popustom, (
				SELECT link
				FROM slike
				WHERE sifra_proizvoda = p.sifra AND pozicija = 0
			), kolicina FROM proizvodi p
			WHERE sifra = %s AND amadeus2hr = 'x';
		""", (item['sifra'],))
		cart_product = cur.fetchone()
		cart_products.append(cart_product)

	cijene = {'sum': 0}
	for idx, item in enumerate(cart_products):
		cijene['sum'] = cijene['sum'] + (item[3] * decimal.Decimal(cart[idx]['kolicina']))
	cijene['proizvodi'] = cijene['sum'] * decimal.Decimal(0.8)
	cijene['pdv'] = cijene['sum'] * decimal.Decimal(0.2)

	brojrata = session.get('brojrata', default=1)
	cijene['brojrata'] = brojrata
	nacinplacanja = session.get('nacinplacanja', default='pouzecem')
	cijene['nacinplacanja'] = nacinplacanja

	if brojrata >= 2 and brojrata <= 12 and nacinplacanja == 'karticom':
		cijene['rate-2-12'] = cijene['sum'] * decimal.Decimal(0.08)
		cijene['sum'] = cijene['sum'] + cijene['rate-2-12']
	if brojrata >= 13 and brojrata <= 24 and nacinplacanja == 'karticom':
		cijene['rate-13-24'] = cijene['sum'] * decimal.Decimal(0.1)
		cijene['sum'] = cijene['sum'] + cijene['rate-13-24']

	promostr = session.get('promo_iznos')
	if promostr:
		cijene['promo'] = decimal.Decimal(promostr)
		cijene['sum'] = cijene['sum'] - cijene['promo']

	if cijene['sum'] < 0:
		cijene['sum'] = decimal.Decimal(0)

	card = session.get('card', default='VISA')
	cijene['card'] = card

	return (cart, cart_products, cijene)

# find in list
def find(lst, key, value):
    for i, dic in enumerate(lst):
        if dic[key] == value:
            return i
    return -1

def randomDigits(digits):
    lower = 10**(digits-1)
    upper = 10**digits - 1
    return random.randint(lower, upper)

@app.template_filter('slugify')
def _slugify(string):
	return slugify(string)

@app.template_filter('urlparse')
def _urlparse(string):
	return urlparse(string)

@app.context_processor
def global_stuff():
    return {'grupe': getgroup(),
			'hidecookieconsent': session.get('hidecookieconsent', default=False)}

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
	return {'formatmoney': formatmoney, 'dec': decimal.Decimal}

#app.run(debug=True, host='0.0.0.0')
serve(app)
