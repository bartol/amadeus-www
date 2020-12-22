#!/usr/bin/env python

from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/kategorija/<category>')
def category(category):
	return f'kategorija: {category}'

@app.route('/proizvod/<product>')
def product(product):
	return f'proizvod: {product}'

@app.route('/search')
def search():
	return 'search'

@app.route('/checkout', methods=['GET', 'POST'])
def checkout():
	return 'checkout'

@app.route('/login', methods=['GET', 'POST'])
def login():
	return 'login'

@app.route('/orders', methods=['GET', 'POST', 'DELETE'])
def orders():
	return 'orders'

app.run(debug=True)
