DROP TABLE IF EXISTS optreden;
CREATE TABLE IF NOT EXISTS optreden(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    locatie TEXT,
    plaats TEXT,
    landCode TEXT,
    longitude REAL,
    latitude REAL,
    datum TEXT,
    tijd TEXT,
    isBuiten INTEGER,
    isSociaal INTEGER,
    isOpenbaar INTEGER,
    isBesloten INTEGER,
    isWildOp INTEGER,
    aantalBezoekers INTEGER
);
INSERT OR IGNORE INTO optreden VALUES (1, 'Amerpoort', 'Baarn', 'nl', 0.0, 0.0, '2019-07-25', '18:30', 0, 1, 1, 0, 0, 45);
INSERT OR IGNORE INTO optreden VALUES (2, 'Maassluise Muziekweek', 'Maassluis', 'nl', 0.0, 0.0, '2019-07-27', '15:00', 1, 0, 1, 0, 0, 500);

DROP TABLE IF EXISTS stuk;
CREATE TABLE IF NOT EXISTS stuk(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titel TEXT
);
INSERT OR IGNORE INTO stuk VALUES (1, 'Miniaturen voor strijkkwartet');

DROP TABLE IF EXISTS optreden_repertoire;
CREATE TABLE IF NOT EXISTS optreden_repertoire(
    optredenId INTEGER,
    stukId INTEGER,
    PRIMARY KEY (optredenId, stukId)
);
INSERT OR IGNORE INTO optreden_repertoire VALUES (1, 'S');
