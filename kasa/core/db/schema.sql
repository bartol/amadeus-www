CREATE TABLE products (
  product_id INTEGER PRIMARY KEY,
  name TEXT,
  price INTEGER,
  discount INTEGER,
  quantity INTEGER,
  description TEXT,
  url TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE product_images (
  product_image_id INTEGER PRIMARY KEY,
  url TEXT,
  url_type TEXT,
  product_id INTEGER,
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE product_features (
  product_feature_id INTEGER PRIMARY KEY,
  name TEXT,
  required BOOLEAN,
  recommended BOOLEAN
);

CREATE TABLE product_feature_values (
  product_feature_value_id INTEGER PRIMARY KEY,
  value TEXT,
  product_feature_id INTEGER,
  FOREIGN KEY (product_feature_id) REFERENCES product_features(product_feature_id),
  product_id INTEGER,
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE publications (
  publication_id INTEGER PRIMARY KEY,
  name TEXT
);

CREATE TABLE product_publications (
  product_publication_id INTEGER PRIMARY KEY,
  publication_id INTEGER,
  FOREIGN KEY (publication_id) REFERENCES publications(publication_id),
  product_id INTEGER,
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY,
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
  receipt_id INTEGER PRIMARY KEY,
  message TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  customer_id INTEGER,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE receipt_products (
  receipt_product_id INTEGER PRIMARY KEY,
  receipt_id INTEGER,
  FOREIGN KEY (receipt_id) REFERENCES receipts(receipt_id),
  product_id INTEGER,
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE offers (
  offer_id INTEGER PRIMARY KEY,
  message TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  expired_at TIMESTAMP,
  customer_id INTEGER,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE offer_products (
  offer_product_id INTEGER PRIMARY KEY,
  offer_id INTEGER,
  FOREIGN KEY (offer_id) REFERENCES offers(offer_id),
  product_id INTEGER,
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE events (
  event_id INTEGER PRIMARY KEY,
  type TEXT,
  message TEXT,
  created_at TIMESTAMP
);