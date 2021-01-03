CREATE TABLE IF NOT EXISTS grupe (
    sifra INT PRIMARY KEY,
    naziv TEXT,
    img_html TEXT
);

CREATE TABLE IF NOT EXISTS proizvodi (
    -- iz kase
    sifra INT PRIMARY KEY,
    grupa INT,
    FOREIGN KEY (grupa) REFERENCES grupe(sifra),
    naziv TEXT,
    kolicina INT,
    nabavna_cijena DECIMAL(9, 2),
    marza DECIMAL(9, 2),
    cijena DECIMAL(9, 2),
    rabat DECIMAL(9, 2),

    -- mjenjaju se u tablici
    amadeus2hr CHAR(1),
    pioneerhr CHAR(1),
    njuskalohr CHAR(1),
    web_cijena DECIMAL(9, 2),
    web_cijena_s_popustom DECIMAL(9, 2),

    -- mjenjaju se pojedinactno  +znacajke +slike
    web_opis TEXT,
    web_istaknut BOOLEAN,

    moddate timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    tsv TSVECTOR
);

CREATE EXTENSION moddatetime;
CREATE TRIGGER update_moddate
    BEFORE UPDATE ON proizvodi
    FOR EACH ROW
    EXECUTE PROCEDURE moddatetime (moddate);

-- CREATE INDEX amadeus2hr_idx ON proizvodi(amadeus2hr) WHERE amadeus2hr IS NOT NULL;
-- CREATE INDEX pioneerhr_idx ON proizvodi(pioneerhr) WHERE pioneerhr IS NOT NULL;
-- CREATE INDEX njuskalohr_idx ON proizvodi(njuskalohr) WHERE njuskalohr IS NOT NULL;

-- fts -----------------------------------------------------------------------

CREATE EXTENSION unaccent;

CREATE FUNCTION products_trigger() RETURNS trigger AS $$
begin
new.tsv :=
    setweight(to_tsvector(unaccent(coalesce(new.naziv,''))), 'A') ||
    setweight(to_tsvector(unaccent(coalesce(new.web_opis,''))), 'B');
return new;
end
$$ LANGUAGE plpgsql;

CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
ON proizvodi FOR EACH ROW EXECUTE PROCEDURE products_trigger();

CREATE INDEX tsvector_idx ON proizvodi USING GIN (tsv);

------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS slike (
    sifra SERIAL PRIMARY KEY,
    link TEXT,
    pozicija INT,
    sifra_proizvoda INT,
    FOREIGN KEY (sifra_proizvoda) REFERENCES proizvodi(sifra)
);

CREATE TABLE IF NOT EXISTS znacajke (
    sifra SERIAL PRIMARY KEY,
    naziv TEXT,
    sifra_grupe INT,
    FOREIGN KEY (sifra_grupe) REFERENCES grupe(sifra)
);

CREATE TABLE IF NOT EXISTS znacajke_vrijednosti (
    sifra SERIAL PRIMARY KEY,
    vrijednost TEXT,
    sifra_znacajke INT,
    FOREIGN KEY (sifra_znacajke) REFERENCES znacajke(sifra),
    sifra_proizvoda INT,
    FOREIGN KEY (sifra_proizvoda) REFERENCES proizvodi(sifra)
);

CREATE INDEX vrijednost_idx ON znacajke_vrijednosti (vrijednost);

CREATE TABLE IF NOT EXISTS cred (
    key TEXT PRIMARY KEY,
    value TEXT
);

CREATE TABLE IF NOT EXISTS covers (
    sifra SERIAL PRIMARY KEY,
    link TEXT,
    promourl TEXT,
    pozicija INT,
    amadeus2hr BOOLEAN,
    pioneerhr BOOLEAN
);

CREATE TABLE IF NOT EXISTS slicni_proizvodi (
    sifra INT,
    FOREIGN KEY (sifra) REFERENCES proizvodi(sifra),
    sifra_slicnog INT,
    FOREIGN KEY (sifra_slicnog) REFERENCES proizvodi(sifra)
);

CREATE TABLE IF NOT EXISTS akcija_dana (
    day DATE PRIMARY KEY,
    sifra_proizvoda INT,
    FOREIGN KEY (sifra_proizvoda) REFERENCES proizvodi(sifra)
);

CREATE TABLE IF NOT EXISTS price_tracking (
    sifra SERIAL PRIMARY KEY,
    email TEXT,
    current_web_cijena DECIMAL(9, 2),
    current_web_cijena_s_popustom DECIMAL(9, 2),
    sifra_proizvoda INT,
    FOREIGN KEY (sifra_proizvoda) REFERENCES proizvodi(sifra),
    sent BOOLEAN
);

CREATE TABLE IF NOT EXISTS quantity_tracking (
    sifra SERIAL PRIMARY KEY,
    email TEXT,
    current_quantity INT,
    sifra_proizvoda INT,
    FOREIGN KEY (sifra_proizvoda) REFERENCES proizvodi(sifra),
    sent BOOLEAN
);

CREATE TABLE IF NOT EXISTS mailing_list (
    sifra SERIAL PRIMARY KEY,
    email TEXT
);

CREATE TABLE IF NOT EXISTS promo_kodovi (
    sifra SERIAL PRIMARY KEY,
    kod TEXT,
    iznos DECIMAL(9, 2)
);
