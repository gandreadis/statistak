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
    aantalBezoekers INTEGER,
    gastdirigent TEXT,
    opmerkingen TEXT
);
INSERT OR IGNORE INTO optreden VALUES (1, 'Amerpoort', 'Baarn', 'nl', 0.0, 0.0, '2019-07-25', '18:30', 0, 1, 1, 0, 0, 45, '', '');
INSERT OR IGNORE INTO optreden VALUES (2, 'Maassluise Muziekweek', 'Maassluis', 'nl', 0.0, 0.0, '2019-07-27', '15:00', 1, 0, 1, 0, 0, 500, '', 'Hummel fantasie met Sunniva Skaug (altviool)');
INSERT OR IGNORE INTO optreden VALUES (3, 'Mikes Badhuistheater', 'Amsterdam', 'nl', 0.0, 0.0, '2019-07-27', '19:00', 0, 0, 1, 0, 0, 310, '', '');
INSERT OR IGNORE INTO optreden VALUES (4, 'Ergens in Georgie', 'Tbilisi', 'ge', 0.0, 0.0, '2019-08-03', '19:00', 0, 1, 0, 1, 0, 30, 'Nana', '');

CREATE TABLE IF NOT EXISTS stuk(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titel TEXT,
    componist TEXT,
    code TEXT,
    metSolistKlarinet INTEGER,
    metSolistZang INTEGER
);
INSERT OR IGNORE INTO stuk VALUES (1, 'Miniaturen voor strijkkwartet', 'Sulkhan Tsintsadze', '11', 0, 0);
INSERT OR IGNORE INTO stuk VALUES (2, 'Oopsala', 'Gijs Kramers', 'L', 0, 0);
INSERT OR IGNORE INTO stuk VALUES (3, 'Kancheliade', 'Giya Kancheli', '15', 1, 0);
INSERT OR IGNORE INTO stuk VALUES (4, 'Dolce riposo', 'G.F. Händel', '22', 0, 1);

CREATE TABLE IF NOT EXISTS optreden_repertoire(
    optredenId INTEGER,
    stukId INTEGER,
    PRIMARY KEY (optredenId, stukId),
    FOREIGN KEY(optredenId) REFERENCES optreden (id) ON DELETE CASCADE,
    FOREIGN KEY(stukId) REFERENCES stuk (id) ON DELETE CASCADE
);
INSERT OR IGNORE INTO optreden_repertoire VALUES (1, 1);
INSERT OR IGNORE INTO optreden_repertoire VALUES (1, 2);
INSERT OR IGNORE INTO optreden_repertoire VALUES (2, 3);
INSERT OR IGNORE INTO optreden_repertoire VALUES (2, 4);
INSERT OR IGNORE INTO optreden_repertoire VALUES (3, 3);
INSERT OR IGNORE INTO optreden_repertoire VALUES (3, 4);
INSERT OR IGNORE INTO optreden_repertoire VALUES (4, 1);
INSERT OR IGNORE INTO optreden_repertoire VALUES (4, 2);
INSERT OR IGNORE INTO optreden_repertoire VALUES (4, 3);
INSERT OR IGNORE INTO optreden_repertoire VALUES (4, 4);
