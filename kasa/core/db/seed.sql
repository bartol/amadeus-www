-- brands
INSERT INTO brands (name, url) VALUES
    ('Samsung', 'samsung'),
    ('Sony', 'sony'),
    ('Dell', 'dell'),
    ('HP', 'hp'),
    ('Lenovo', 'lenovo');

-- categories
INSERT INTO categories (name) VALUES
    ('Laptopi'),
    ('Računala'),
    ('Televizije'),
    ('Igraće konzole'),
    ('Klima uređaji');

-- products
INSERT INTO products (name,price,discount,quantity,description,url,recommended,created_at,updated_at,brand_id,category_id) VALUES
    ('PlayStation 4 500GB F Chassis Black',299900,100000,3,'Sony Playstation 4 je napravio veliki hardverski odmak...','playstation-4-500gb-f-chassis-black','t','2020-10-12 17:13:54.287936','2020-10-13 17:13:54.287936',2,4),
    ('Dell Inspiron 5482 2in1, I5I507-273182898',649900,60000,1,'','dell-inspiron-5482-2in1-i5i507-273182898','n','2020-10-12 17:13:54.287936','2020-10-13 17:13:54.287936',3,1),
    ('HP 250 G7 6BP58EA (15.6, i3, 8GB RAM, 256GB SSD, Intel HD, Win10p)',529900,80000,0,'','hp-250-g7-6bp58ea-15-6-i3-8gb-ram-256gb-ssd-intel-hd-win10p','n','2020-10-12 17:13:54.287936','2020-10-14 17:13:54.287936',4,1),
    ('Lenovo ideapad L340-15API, 81LW0047SC',389900,135000,1,'Lenovo ideapad L340-15API, 81LW0047SC, 15.6" FHD (1920x1080) TN 220nits Anti-glare, AMD...','lenovo-ideapad-l340-15api-81lw0047sc','n','2020-10-12 17:13:54.287936','2020-10-15 17:13:54.287936',5,1),
    ('Sony KDL-32WE615 televizor, 32" (82 cm), LED, HD ready, HDR, HEVC (H.265)',289900,0,1,'','sony-kdl-32we615-televizor-32-82-cm-led-hd-ready-hdr-hevc-h265','n','2020-10-12 17:13:54.287936','2020-10-16 17:13:54.287936',2,3);

-- product_images
INSERT INTO product_images (url,product_id) VALUES
    ('https://api.amadeus2.hr/images/253/1137?options=600',1),
    ('https://api.amadeus2.hr/images/255/1139?options=600',2),
    ('https://api.amadeus2.hr/images/255/1140?options=600',2),
    ('https://api.amadeus2.hr/images/255/1141?options=600',2);

-- product_features
INSERT INTO product_features (name,recommended,category_id) VALUES
    ('Procesor','t',1),
    ('Veličina zaslona','t',1),
    ('OS','n',1),
    ('OS','n',2);

-- product_feature_values
INSERT INTO product_feature_values (value,product_feature_id,product_id) VALUES
    ('Intel Core i5 8265U 1,60 GHz Core 4',1,2),
    ('14" inch',2,2),
    ('AMD Ryzen 3 3200U (2C / 4T, 2.6 / 3.5GHz, 1MB L2 / 4MB L3)',1,4),
    ('Free DOS',3,4);

-- publications
INSERT INTO publications (name) VALUES
    ('amadeus2.hr'),
    ('pioneer.hr');

-- product_publications
INSERT INTO product_publications (publication_id,product_id) VALUES
    (1,1),
    (1,4);

-- product_recommendations
INSERT INTO product_recommendations (recommended_product_id,product_id) VALUES
    (2,4),
    (3,4);

-- customers
INSERT INTO customers (name,address,postal_code,city,country,phone,oib,created_at,updated_at) VALUES
    ('Ante Starčević','Vladimira Nazora 45','Ploče','20340','Hrvatska','','','2020-10-12 17:13:54.287936','2020-10-12 17:13:54.287936'),
    ('Marko Marulić','Vladimira Nazora 45','Ploče','20340','Hrvatska','','','2020-10-12 17:13:54.287936','2020-10-12 17:13:54.287936'),
    ('Stjepan Radić','Vladimira Nazora 45','Ploče','20340','Hrvatska','0987654321','','2020-10-12 17:13:54.287936','2020-10-12 17:13:54.287936'),
    ('Amadeus III d.o.o.','Vladimira Nazora 45','Ploče','20340','Hrvatska','','1234567890','2020-10-12 17:13:54.287936','2020-10-13 17:13:54.287936'),
    ('Produžni kablovi d.d.','Vladimira Nazora 45','Ploče','20340','Hrvatska','','1234567891','2020-10-12 17:13:54.287936','2020-10-12 17:13:54.287936');

-- receipts
INSERT INTO receipts (message,created_at,updated_at,customer_id) VALUES
    ('','2020-10-12 17:13:54.287936','2020-10-12 17:13:54.287936',1),
    ('Račun za ponudu #1','2020-10-12 17:13:54.287936','2020-10-12 17:13:54.287936',4);

-- receipt_products
INSERT INTO receipt_products (receipt_id,product_id) VALUES
    (1,1),
    (2,3),
    (2,4);

-- offers
INSERT INTO offers (message,created_at,updated_at,customer_id) VALUES
    ('','2020-10-12 17:13:54.287936','2020-10-12 17:13:54.287936',2),
    ('ponuda za web shop','2020-10-12 17:13:54.287936','2020-10-12 17:13:54.287936',5);

-- offer_products
INSERT INTO offer_products (offer_id,product_id) VALUES
    (1,1),
    (1,5),
    (2,2);
