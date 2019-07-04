DROP TABLE IF EXISTS optreden;
CREATE TABLE IF NOT EXISTS optreden(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    locatie TEXT,
    plaats TEXT,
    landCode TEXT,
    longitude REAL,
    latitude REAL,
    isBuiten INTEGER,
    isSociaal INTEGER,
    isOpenbaar INTEGER,
    isBesloten INTEGER,
    isWildOp INTEGER,
    aantalBezoekers INTEGER
);
INSERT OR IGNORE INTO optreden VALUES (1, 'Amerpoort', 'Baarn', 'nl', 0.0, 0.0, 0, 1, 1, 0, 0, 45);

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
