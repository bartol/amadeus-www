CREATE TABLE IF NOT EXISTS products (
	id INTEGER PRIMARY KEY,
	name TEXT,
	description TEXT,
	quantity INTEGER,
	video_url TEXT,
	slug TEXT,
	updated_at INTEGER
);

CREATE TABLE IF NOT EXISTS product_prices (
	product_id INTEGER REFERENCES products(id),
	type INTEGER,
	amount INTEGER,
	min_quantity INTEGER
);

CREATE TABLE IF NOT EXISTS categories (
	id INTEGER PRIMARY KEY,
	name TEXT,
	description TEXT,
	slug TEXT
);

CREATE TABLE IF NOT EXISTS featured_products (
	category_id INTEGER REFERENCES categories(id),
	product_id INTEGER REFERENCES products(id),
	label TEXT
);

CREATE TABLE IF NOT EXISTS product_categories (
	product_id INTEGER REFERENCES products(id),
	category_id INTEGER REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS product_images (
	product_id INTEGER REFERENCES products(id),
	image_url TEXT,
	position INTEGER
);

CREATE TABLE IF NOT EXISTS product_features (
	product_id INTEGER REFERENCES products(id),
	key TEXT,
	value TEXT,
	filterable INTEGER
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
