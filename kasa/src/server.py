from core.message import *
from flask import Flask

server = Flask(__name__)

@server.route('/')
def landing():
    return getmessage()
