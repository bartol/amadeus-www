#!/usr/bin/env python

import requests, xmltodict, json, decimal, random
import configparser
import psycopg2, boto3, botocore
from werkzeug.utils import secure_filename
from mimetypes import guess_extension

config = configparser.ConfigParser()
config.read('config.ini')

apikey = config['pioneer']['apikey'].strip('"')
dbconn = config['global']['dbconn'].strip('"')

conn = psycopg2.connect(dbconn)
cur = conn.cursor()

cur.execute("SELECT value FROM cred WHERE key = 'aws_access_key_id';")
aws_access_key_id = cur.fetchone()[0]
cur.execute("SELECT value FROM cred WHERE key = 'aws_secret_access_key';")
aws_secret_access_key = cur.fetchone()[0]
s3 = boto3.client(
   "s3",
   aws_access_key_id=aws_access_key_id,
   aws_secret_access_key=aws_secret_access_key
)

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

def migratedata(pioneer_id, sifra):
    product_req = requests.get(f'https://pioneer.hr/api/products/{pioneer_id}', auth=(apikey,''))
    product_xml = xmltodict.parse(product_req.text)
    try:
        opis_short = product_xml['prestashop']['product']['description_short']['language']['#text']
    except:
        opis_short = ''
        pass
    try:
        opis = product_xml['prestashop']['product']['description']['language']['#text']
        if opis_short:
            opis = opis_short + '<br><br>' + opis
        cur.execute("UPDATE proizvodi SET web_opis = %s WHERE sifra = %s", (opis, sifra))
    except Exception as e:
        print(e)
        pass
    try:
        slike = product_xml['prestashop']['product']['associations']['images']['image']
        if not isinstance(slike, list):
            slike = [slike]
    except:
        slike = []
        pass
    for idx, slika in enumerate(slike):
        slika_url = slika['@xlink:href']
        slika_req = requests.get(slika_url, auth=(apikey,''), stream=True)
        filename = slika_url.split("/")[-1]
        ext = guess_extension(slika_req.headers.get('content-type').partition(';')[0].strip())
        imgname = f'img/{random.randint(1000,9999)}-{secure_filename(filename)}{ext}'
        try:
            s3.upload_fileobj(slika_req.raw, 'amadeus2.hr', imgname,
                ExtraArgs={"ACL": "public-read", "ContentType": slika_req.headers.get('content-type')})
            uploaded_url = f'https://s3.eu-central-1.amazonaws.com/amadeus2.hr/{imgname}'
            cur.execute("""
                INSERT INTO slike (link, pozicija, sifra_proizvoda)
                VALUES (%s, %s, %s);
            """, (uploaded_url, idx, sifra))
        except:
            pass
    conn.commit()
