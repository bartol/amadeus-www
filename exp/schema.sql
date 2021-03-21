CREATE TABLE IF NOT EXISTS categories (
	category_id INTEGER PRIMARY KEY,
	name TEXT,
	image_link TEXT,
	color TEXT
);
CREATE TABLE IF NOT EXISTS brands (
	brand_id INTEGER PRIMARY KEY,
	name TEXT,
	image_link TEXT,
	summary TEXT
);
CREATE TABLE IF NOT EXISTS products (
	product_id INTEGER PRIMARY KEY,
	category_id INTEGER,
	FOREIGN KEY (category_id) REFERENCES categories,
	name TEXT,
	quantity INTEGER,
	in_stock BOOLEAN,
	price DECIMAL(9, 2),
	purchase_price DECIMAL(9, 2),
	discounted_price DECIMAL(9, 2),
	wholesale_price DECIMAL(9, 2),
	summary TEXT,
	updated_at TIMESTAMP,
	tsv TSVECTOR
);
CREATE TABLE IF NOT EXISTS publications (
	publication TEXT PRIMARY KEY
);
CREATE TABLE IF NOT EXISTS product_publications (
	publication TEXT,
	FOREIGN KEY (publication) REFERENCES publications,
	product_id INTEGER,
	FOREIGN KEY (product_id) REFERENCES products
);
CREATE TABLE IF NOT EXISTS product_images (
	product_image_id SERIAL PRIMARY KEY,
	image_link TEXT,
	image_position INTEGER,
	product_id INTEGER,
	FOREIGN KEY (product_id) REFERENCES products
);
CREATE TABLE IF NOT EXISTS product_features (
	product_feature_id SERIAL PRIMARY KEY,
	name TEXT,
	value TEXT,
	product_id INTEGER,
	FOREIGN KEY (product_id) REFERENCES products
);
CREATE TABLE IF NOT EXISTS related_products (
	related_product_id INTEGER,
	FOREIGN KEY (related_product_id) REFERENCES products(product_id),
	product_id INTEGER,
	FOREIGN KEY (product_id) REFERENCES products
);
CREATE TABLE IF NOT EXISTS product_alerts (
	product_alert_id SERIAL PRIMARY KEY,
	email TEXT,
	product_id INTEGER,
	FOREIGN KEY (product_id) REFERENCES products
);
CREATE TABLE IF NOT EXISTS emails (
	email TEXT PRIMARY KEY
);
CREATE TABLE IF NOT EXISTS promo_codes (
	code TEXT PRIMARY KEY,
	discount DECIMAL(9, 2)
);
CREATE TABLE IF NOT EXISTS promo_pages (
	promo_page_id SERIAL PRIMARY KEY,
	name TEXT,
	image_link TEXT,
	color TEXT
);
CREATE TABLE IF NOT EXISTS promo_page_products (
	promo_page_id INTEGER,
	FOREIGN KEY (promo_page_id) REFERENCES promo_pages,
	product_id INTEGER,
	FOREIGN KEY (product_id) REFERENCES products
);
