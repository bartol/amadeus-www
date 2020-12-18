CREATE TABLE IF NOT EXISTS grupe (
    sifra INT PRIMARY KEY,
    naziv TEXT
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
    web_istaknut BOOLEAN
);

-- CREATE INDEX amadeus2hr_idx ON proizvodi(amadeus2hr) WHERE amadeus2hr IS NOT NULL;
-- CREATE INDEX pioneerhr_idx ON proizvodi(pioneerhr) WHERE pioneerhr IS NOT NULL;
-- CREATE INDEX njuskalohr_idx ON proizvodi(njuskalohr) WHERE njuskalohr IS NOT NULL;

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

CREATE TABLE IF NOT EXISTS cred (
    key TEXT PRIMARY KEY,
    value TEXT
);
