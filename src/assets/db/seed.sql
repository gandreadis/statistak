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
--INSERT OR IGNORE INTO optreden VALUES (1, 'Amerpoort', 'Baarn', 'nl', 0.0, 0.0, '2019-07-25', '18:30', 0, 1, 1, 0, 0, 45, '', '');
--INSERT OR IGNORE INTO optreden VALUES (2, 'Maassluise Muziekweek', 'Maassluis', 'nl', 0.0, 0.0, '2019-07-27', '15:00', 1, 0, 1, 0, 0, 500, '', 'Hummel fantasie met Sunniva Skaug (altviool)');
--INSERT OR IGNORE INTO optreden VALUES (3, 'Mikes Badhuistheater', 'Amsterdam', 'nl', 0.0, 0.0, '2019-07-27', '19:00', 0, 0, 1, 0, 0, 310, '', '');
--INSERT OR IGNORE INTO optreden VALUES (4, 'Ergens in Georgie', 'Tbilisi', 'ge', 0.0, 0.0, '2019-08-03', '19:00', 0, 1, 0, 1, 0, 30, 'Nana', '');

CREATE TABLE IF NOT EXISTS stuk(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titel TEXT,
    componist TEXT,
    code TEXT,
    metSolistKlarinet INTEGER,
    metSolistZang INTEGER
);
INSERT OR IGNORE INTO stuk VALUES (1, 'Sta op en schitter', 'E. de Boer', '01', 0, 0);
INSERT OR IGNORE INTO stuk VALUES (2, 'Miniatuur', 'A. Giorgobiani', '02', 0, 0);
INSERT OR IGNORE INTO stuk VALUES (3, 'Prometheus ouverture', 'L. van Beethoven', '03', 0, 0);
INSERT OR IGNORE INTO stuk VALUES (4, 'Arabische dans', 'P. Tchaikovsky', '04', 0, 0);
INSERT OR IGNORE INTO stuk VALUES (5, 'Masquerade suite', 'A. Khachaturian', '05', 0, 0);
INSERT OR IGNORE INTO stuk VALUES (6, 'Abesalom da Eteri ouverture', 'Z. Paliashvili', '06', 0, 0);
INSERT OR IGNORE INTO stuk VALUES (7, 'Kaukasische schetsen suite 2', 'M. Ippolitov-Ivanov', '07', 0, 0);
INSERT OR IGNORE INTO stuk VALUES (8, 'Sachidao', 'R. Lagidze (arr. H. Bouma)', '08', 0, 0);
INSERT OR IGNORE INTO stuk VALUES (9, 'Georgia on my mind', 'H. Carmichael (arr. D. Herweg)', '09', 0, 0);
INSERT OR IGNORE INTO stuk VALUES (10, 'Sweet Georgia Brown', 'B. Bernie (arr. R. Scherpenisse)', '10', 0, 0);
INSERT OR IGNORE INTO stuk VALUES (11, 'Procession of the Sardar - Jazz', 'M. Ippolitov-Ivanov (arr. V. Veneman)', '11', 0, 0);
INSERT OR IGNORE INTO stuk VALUES (12, 'The Devil went down to Georgia', 'C. Daniels (arr. D. Nauta)', '12', 0, 0);
INSERT OR IGNORE INTO stuk VALUES (13, 'Tu ase turpa ikavi', 'T. Kevkhishvili (arr. B. Faber)', '13', 0, 0);
INSERT OR IGNORE INTO stuk VALUES (14, 'Chveno Tbilis Kalako', 'G. Tsabadze (arr. G. Rubingh)', '14', 0, 0);
INSERT OR IGNORE INTO stuk VALUES (15, 'Nana', 'Traditional (arr. E. de Boer)', '15', 0, 0);
INSERT OR IGNORE INTO stuk VALUES (16, 'Mzgavruli', 'Traditional (arr. E. de Boer)', '16', 0, 0);
INSERT OR IGNORE INTO stuk VALUES (17, 'De gepikte vogel', 'J. Andriessen', '17', 0, 0);
INSERT OR IGNORE INTO stuk VALUES (18, 'Onleesbaar 3', 'W. Breuker', '18', 0, 0);
INSERT OR IGNORE INTO stuk VALUES (19, 'Kancheliade', 'G. Kancheli (arr. H. Bouma)', '19', 1, 0);
INSERT OR IGNORE INTO stuk VALUES (20, 'Simghera Kutaisze', 'Traditional (arr. A. Giorgobiani)', '20', 1, 0);
INSERT OR IGNORE INTO stuk VALUES (21, 'Romanze', 'D. Toradze (arr. Misha Sporck)', '21', 1, 0);
INSERT OR IGNORE INTO stuk VALUES (22, 'Concerto 2 deel 3', 'S. Davitashvili', '22', 1, 0);
INSERT OR IGNORE INTO stuk VALUES (23, 'Moriro, uit Teseo', 'G. F. Händel (arr. C. Stuit)', '23', 0, 1);
INSERT OR IGNORE INTO stuk VALUES (24, 'Quell amor, uit Teseo', 'G. F. Händel (arr. C. Stuit)', '24', 0, 1);
INSERT OR IGNORE INTO stuk VALUES (25, 'Dolce riposo, uit Teseo', 'G. F. Händel (arr. C. Stuit)', '25', 0, 1);
INSERT OR IGNORE INTO stuk VALUES (26, 'Nine Million Bicycles', 'Katie Melua (arr. A. Hensens)', '26', 0, 1);
INSERT OR IGNORE INTO stuk VALUES (27, 'Eens komt de dag', 'W. Breuker (arr. B. Faber)', '27', 0, 0);
INSERT OR IGNORE INTO stuk VALUES (28, 'Miniaturen voor strijkkwartet', 'S. Tsintsadze', 'S', 0, 0);
INSERT OR IGNORE INTO stuk VALUES (29, 'Clarinet concerto', 'A. Shaw (arr. T. Parson)', 'B', 1, 0);
INSERT OR IGNORE INTO stuk VALUES (30, 'Procession of the Sardar - Origineel', 'M. Ippolitov-Ivanov', 'G', 0, 0);
INSERT OR IGNORE INTO stuk VALUES (31, 'Oopsala', 'G. Kramers', 'L', 0, 0);

CREATE TABLE IF NOT EXISTS optreden_repertoire(
    optredenId INTEGER,
    stukId INTEGER,
    PRIMARY KEY (optredenId, stukId),
    FOREIGN KEY(optredenId) REFERENCES optreden (id) ON DELETE CASCADE,
    FOREIGN KEY(stukId) REFERENCES stuk (id) ON DELETE CASCADE
);
--INSERT OR IGNORE INTO optreden_repertoire VALUES (1, 1);
--INSERT OR IGNORE INTO optreden_repertoire VALUES (1, 2);
--INSERT OR IGNORE INTO optreden_repertoire VALUES (2, 3);
--INSERT OR IGNORE INTO optreden_repertoire VALUES (2, 4);
--INSERT OR IGNORE INTO optreden_repertoire VALUES (3, 3);
--INSERT OR IGNORE INTO optreden_repertoire VALUES (3, 4);
--INSERT OR IGNORE INTO optreden_repertoire VALUES (4, 1);
--INSERT OR IGNORE INTO optreden_repertoire VALUES (4, 2);
--INSERT OR IGNORE INTO optreden_repertoire VALUES (4, 3);
--INSERT OR IGNORE INTO optreden_repertoire VALUES (4, 4);
