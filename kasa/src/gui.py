#!/usr/bin/env python

import webview
from server import server

if __name__ == '__main__':
  window = webview.create_window('amadeus-kasa', server, min_size=(1200, 800))
  webview.start(debug=True)