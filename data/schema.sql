CREATE TABLE IF NOT EXISTS products (
	id INTEGER PRIMARY KEY,
	name TEXT,
	description TEXT,
	quantity INTEGER,
	video TEXT,
	slug TEXT PRIMARY KEY,
	updated_at INTEGER
);

CREATE TABLE IF NOT EXISTS product_prices (
	productid INTEGER REFERENCES products(id),
	type INTEGER,
	amount INTEGER,
	minquantity INTEGER
);

CREATE TABLE IF NOT EXISTS categories (
	id INTEGER PRIMARY KEY,
	name TEXT,
	description TEXT,
	slug TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS featured_products (
	categoryid INTEGER REFERENCES categories(id),
	productid INTEGER REFERENCES products(id),
	label TEXT
);

CREATE TABLE IF NOT EXISTS product_categories (
	productid INTEGER REFERENCES products(id),
	categoryid INTEGER REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS product_images (
	productid INTEGER REFERENCES products(id),
	url TEXT,
	position INTEGER
);

CREATE TABLE IF NOT EXISTS product_features (
	productid INTEGER REFERENCES products(id),
	key TEXT,
	value TEXT,
	filterable INTEGER,
	position INTEGER
);







--CREATE TABLE IF NOT EXISTS related_products (
--	related_product_id INTEGER REFERENCES products(product_id),
--	product_id INTEGER REFERENCES products
--);
--
--CREATE TABLE IF NOT EXISTS product_alerts (
--	product_alert_id INTEGER PRIMARY KEY,
--	email TEXT,
--	product_id INTEGER REFERENCES products
--);
--
--CREATE TABLE IF NOT EXISTS emails (
--	email TEXT PRIMARY KEY
--);
--
--CREATE TABLE IF NOT EXISTS promo_codes (
--	code TEXT PRIMARY KEY,
--	discount INTEGER
--);
--
--CREATE TABLE IF NOT EXISTS promo_pages (
--	promo_page_id INTEGER PRIMARY KEY,
--	name TEXT,
--	image_link TEXT,
--	description TEXT
--);
--
--CREATE TABLE IF NOT EXISTS promo_page_products (
--	promo_page_id INTEGER REFERENCES promo_pages,
--	product_id INTEGER REFERENCES products
--);
