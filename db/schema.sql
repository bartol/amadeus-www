CREATE TABLE proizvodi (
    sifra INT PRIMARY KEY,
    grupa INT,
    naziv TEXT,
    kolicina INT,
    nabavna_cijena DECIMAL(9, 2),
    marza DECIMAL(9, 2),
    cijena DECIMAL(9, 2),
    rabat DECIMAL(9, 2)
)
