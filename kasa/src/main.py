#!/usr/bin/env python

import webview
import core

from server import server

if __name__ == '__main__':
  window = webview.create_window('amadeus-kasa', server)
  webview.start()