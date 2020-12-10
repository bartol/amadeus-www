CREATE EXTENSION unaccent;

CREATE TABLE brands (
  brand_id SERIAL PRIMARY KEY,
  name TEXT,
  url TEXT
);

CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  name TEXT,
  url TEXT
);

CREATE TABLE products (
  product_id SERIAL PRIMARY KEY,
  name TEXT,
  price INTEGER,
  discount INTEGER,
  quantity INTEGER,
  description TEXT,
  url TEXT,
  recommended BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  tsv TSVECTOR,
  brand_id INTEGER,
  category_id INTEGER,
  FOREIGN KEY (brand_id) REFERENCES brands,
  FOREIGN KEY (category_id) REFERENCES categories
);

CREATE FUNCTION products_trigger() RETURNS trigger AS $$
begin
new.tsv :=
  setweight(to_tsvector(unaccent(new.name)), 'A') ||
  setweight(to_tsvector(unaccent(new.description)), 'B');
return new;
end
$$ LANGUAGE plpgsql;

CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
ON products FOR EACH ROW EXECUTE PROCEDURE products_trigger();

CREATE INDEX tsvector_idx ON products USING GIN (tsv);

CREATE TABLE product_images (
  product_image_id SERIAL PRIMARY KEY,
  url TEXT,
  product_id INTEGER,
  FOREIGN KEY (product_id) REFERENCES products
);

CREATE TABLE product_features (
  product_feature_id SERIAL PRIMARY KEY,
  name TEXT,
  recommended BOOLEAN,
  category_id INTEGER,
  FOREIGN KEY (category_id) REFERENCES categories
);

CREATE TABLE product_feature_values (
  product_feature_value_id SERIAL PRIMARY KEY,
  value TEXT,
  product_feature_id INTEGER,
  product_id INTEGER,
  FOREIGN KEY (product_feature_id) REFERENCES product_features,
  FOREIGN KEY (product_id) REFERENCES products
);

CREATE TABLE publications (
  publication_id SERIAL PRIMARY KEY,
  name TEXT
);

CREATE TABLE product_publications (
  product_publication_id SERIAL PRIMARY KEY,
  publication_id INTEGER,
  product_id INTEGER,
  FOREIGN KEY (publication_id) REFERENCES publications,
  FOREIGN KEY (product_id) REFERENCES products
);

INSERT INTO publications (name) VALUES
  ('amadeus2.hr'),
  ('pioneer.hr');

CREATE TABLE product_recommendations (
  product_recommendation_id SERIAL PRIMARY KEY,
  recommended_product_id INTEGER,
  product_id INTEGER,
  FOREIGN KEY (recommended_product_id) REFERENCES products(product_id),
  FOREIGN KEY (product_id) REFERENCES products
);

CREATE TABLE customer_types (
  customer_type_id SERIAL PRIMARY KEY,
  name TEXT
);

INSERT INTO customer_types (name) VALUES
  ('Fizička osoba'),
  ('Pravna osoba');

CREATE TABLE customers (
  customer_id SERIAL PRIMARY KEY,
  name TEXT,
  address TEXT,
  postal_code TEXT,
  city TEXT,
  country TEXT,
  phone TEXT,
  oib TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  tsv TSVECTOR,
  customer_type_id INTEGER,
  FOREIGN KEY (customer_type_id) REFERENCES customer_types
);

CREATE FUNCTION customers_trigger() RETURNS trigger AS $$
begin
new.tsv :=
  setweight(to_tsvector(unaccent(new.name)), 'A') ||
  setweight(to_tsvector(unaccent(new.address)), 'B') ||
  setweight(to_tsvector(unaccent(new.postal_code)), 'B') ||
  setweight(to_tsvector(unaccent(new.city)), 'B') ||
  setweight(to_tsvector(unaccent(new.country)), 'B') ||
  setweight(to_tsvector(unaccent(new.phone)), 'B') ||
  setweight(to_tsvector(unaccent(new.oib)), 'B');
return new;
end
$$ LANGUAGE plpgsql;

CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
ON customers FOR EACH ROW EXECUTE PROCEDURE customers_trigger();

CREATE INDEX tsvector_idx ON customers USING GIN (tsv);

CREATE TABLE receipts (
  receipt_id SERIAL PRIMARY KEY,
  message TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  customer_id INTEGER,
  FOREIGN KEY (customer_id) REFERENCES customers
);

CREATE TABLE receipt_products (
  receipt_product_id SERIAL PRIMARY KEY,
  receipt_id INTEGER,
  product_id INTEGER,
  FOREIGN KEY (receipt_id) REFERENCES receipts,
  FOREIGN KEY (product_id) REFERENCES products
);

CREATE TABLE offers (
  offer_id SERIAL PRIMARY KEY,
  message TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  customer_id INTEGER,
  FOREIGN KEY (customer_id) REFERENCES customers
);

CREATE TABLE offer_products (
  offer_product_id SERIAL PRIMARY KEY,
  offer_id INTEGER,
  product_id INTEGER,
  FOREIGN KEY (offer_id) REFERENCES offers,
  FOREIGN KEY (product_id) REFERENCES products
);
