import pandas as pd
import psycopg2

dbconn = ""
conn = psycopg2.connect(dbconn)
cur = conn.cursor()

df = pd.read_excel("Amadeus Bosch MDA asortiman 2021-01.xlsx")
df2 = pd.read_excel("PIMS - Excel export.xls")

for row in df.iterrows():
	df2_filtered = df2[df2["Product code"] == row[1].model]
	if len(df2_filtered) == 0:
		print("Proizvod", row[1].model, "("+row[1].opis+")", "nije pronađen")
		continue
	row2 = df2_filtered.iloc[0]
	name = row2[0]+" "+row2[4]
	img = row2[7]
	price = row[1]["MPC preporučena*"]
	desc = f"""
<div class="loadbeeTabContent"
	data-loadbee-apikey="" 
	data-loadbee-gtin="{row2[3]}"
	data-loadbee-locale="hr_HR"
></div>
<script src="//cdn.loadbee.com/js/loadbee_integration.js"></script>
<script>loadbeeIntegration.init();</script>
	"""

	cur.execute("SELECT max(sifra) FROM proizvodi;")
	zadnja_sifra = cur.fetchone()[0]
	nova_sifra = int(zadnja_sifra) + 1

	cur.execute("""
		INSERT INTO proizvodi (sifra, naziv, grupa, cijena, web_cijena_s_popustom, kolicina, web_opis, amadeus2hr)
		VALUES (%s, %s, 109, %s, %s, 0, %s, 'x');
		""", (nova_sifra, name, price, price, desc))
	cur.execute("""
		INSERT INTO slike (link, pozicija, sifra_proizvoda)
		VALUES (%s, 0, %s);
	""", (img, nova_sifra))
	conn.commit()
	print("Proizvod", "["+str(nova_sifra)+"]", row[1].model, "("+row[1].opis+")", "ubacen")
	
