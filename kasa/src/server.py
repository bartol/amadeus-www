import webview

from core import getmessage
from flask import Flask

server = Flask(__name__)

@server.route('/')
def landing():
    return getmessage()
