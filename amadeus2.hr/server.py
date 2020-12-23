#!/usr/bin/env python

from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
	return render_template('index.html')

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

app.run(debug=True, host='0.0.0.0')
