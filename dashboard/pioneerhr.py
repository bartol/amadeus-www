#!/usr/bin/env python

import requests, xmltodict, json, decimal
import configparser

config = configparser.ConfigParser()
config.read('config.ini')

apikey = config['pioneer']['apikey'].strip('"')

def updateproduct(id, web_cijena, web_cijena_s_popustom, enabled, quantity):
    product_req = requests.get(f'https://pioneer.hr/api/products/{id}', auth=(apikey,''))
    product_xml = xmltodict.parse(product_req.text)
    product_enabled = product_xml['prestashop']['product']['active'] = '1' if enabled else '0'
    product_price_without_tax = product_xml['prestashop']['product']['price'] = "{:.6f}".format(web_cijena * decimal.Decimal(0.8))
    product_xml['prestashop']['product'].pop('quantity')
    product_xml['prestashop']['product'].pop('manufacturer_name')
    product_xml_str = xmltodict.unparse(product_xml)
    requests.put(f'https://pioneer.hr/api/products/{id}', auth=(apikey,''), data=product_xml_str)

    kolicina_url = product_xml['prestashop']['product']['associations']['stock_availables']['stock_available']['@xlink:href']
    kolicina_req = requests.get(kolicina_url, auth=(apikey,''))
    kolicina_xml = xmltodict.parse(kolicina_req.text)
    kolicina_xml['prestashop']['stock_available']['quantity'] = str(quantity)
    kolicina_xml_str = xmltodict.unparse(kolicina_xml)
    requests.put(kolicina_url, auth=(apikey,''), data=kolicina_xml_str)

    popust_id_req = requests.get(f'https://pioneer.hr/api/specific_prices?filter[id_product]=[{id}]', auth=(apikey,''))
    popust_id_xml = xmltodict.parse(popust_id_req.text)
    popust_url = popust_id_xml['prestashop']['specific_prices']['specific_price']['@xlink:href']
    popust_req = requests.get(popust_url, auth=(apikey,''))
    popust_xml = xmltodict.parse(popust_req.text)
    popust = popust_xml['prestashop']['specific_price']['reduction'] = "{:.6f}".format(web_cijena - web_cijena_s_popustom)
    popust_xml['prestashop']['specific_price']['reduction_tax'] = '1'
    popust_xml['prestashop']['specific_price']['reduction_type'] = 'amount'
    popust_xml_str = xmltodict.unparse(popust_xml)
    requests.put(popust_url, auth=(apikey,''), data=popust_xml_str)

