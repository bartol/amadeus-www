#!/usr/bin/env python3

from flask import Flask, render_template, request
from flaskwebgui import FlaskUI

app = Flask(__name__, template_folder='.')
ui = FlaskUI(app)


@app.route('/')
def index():
    return render_template('gui.html')

@app.route('/table/get', methods=['POST'])
def tableget():
    print(request.data)


ui.run()

# todo:
# https://github.com/ClimenteA/pyvan
