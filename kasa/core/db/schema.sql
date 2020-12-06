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
  brand_id INTEGER,
  category_id INTEGER,
  FOREIGN KEY (brand_id) REFERENCES brands(brand_id),
  FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE TABLE product_images (
  product_image_id SERIAL PRIMARY KEY,
  url TEXT,
  product_id INTEGER,
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE product_features (
  product_feature_id SERIAL PRIMARY KEY,
  name TEXT,
  recommended BOOLEAN,
  category_id INTEGER,
  FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE TABLE product_feature_values (
  product_feature_value_id SERIAL PRIMARY KEY,
  value TEXT,
  product_feature_id INTEGER,
  product_id INTEGER,
  FOREIGN KEY (product_feature_id) REFERENCES product_features(product_feature_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE publications (
  publication_id SERIAL PRIMARY KEY,
  name TEXT
);

CREATE TABLE product_publications (
  product_publication_id SERIAL PRIMARY KEY,
  publication_id INTEGER,
  product_id INTEGER,
  FOREIGN KEY (publication_id) REFERENCES publications(publication_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE product_recommendations (
  product_recommendation_id SERIAL PRIMARY KEY,
  recommended_product_id INTEGER,
  product_id INTEGER,
  FOREIGN KEY (recommended_product_id) REFERENCES products(product_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

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
  updated_at TIMESTAMP
);

CREATE TABLE receipts (
  receipt_id SERIAL PRIMARY KEY,
  message TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  customer_id INTEGER,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE receipt_products (
  receipt_product_id SERIAL PRIMARY KEY,
  receipt_id INTEGER,
  product_id INTEGER,
  FOREIGN KEY (receipt_id) REFERENCES receipts(receipt_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE offers (
  offer_id SERIAL PRIMARY KEY,
  message TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  customer_id INTEGER,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE offer_products (
  offer_product_id SERIAL PRIMARY KEY,
  offer_id INTEGER,
  product_id INTEGER,
  FOREIGN KEY (offer_id) REFERENCES offers(offer_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);
