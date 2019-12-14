DROP TABLE IF EXISTS optreden;
CREATE TABLE optreden( id INTEGER PRIMARY KEY AUTOINCREMENT, locatie TEXT, plaats TEXT, landCode TEXT, longitude REAL, latitude REAL, datum TEXT, tijd TEXT, isBuiten INTEGER, isSociaal INTEGER, isOpenbaar INTEGER, isBesloten INTEGER, isWildOp INTEGER, mansen INTEGER, cds INTEGER, groupies INTEGER, aantalBezoekers INTEGER, gastdirigent TEXT, opmerkingen TEXT );
DROP TABLE IF EXISTS stuk;
CREATE TABLE stuk( id INTEGER PRIMARY KEY AUTOINCREMENT, titel TEXT, componist TEXT, code TEXT, metSolist1 INTEGER, metSolist2 INTEGER );
DROP TABLE IF EXISTS `optreden_repertoire`;
CREATE TABLE optreden_repertoire( optredenId INTEGER, stukId INTEGER, PRIMARY KEY (optredenId, stukId), FOREIGN KEY(optredenId) REFERENCES optreden (id) ON DELETE CASCADE, FOREIGN KEY(stukId) REFERENCES stuk (id) ON DELETE CASCADE );
INSERT OR REPLACE INTO optreden(id,locatie,plaats,landCode,longitude,latitude,datum,tijd,isBuiten,isSociaal,isOpenbaar,isBesloten,isWildOp,mansen,cds,groupies,aantalBezoekers,gastdirigent,opmerkingen) VALUES ('1','Theater Sneek (try-out)','Sneek','nl','0','0','2019-10-27','16:30','0','0','1','0','0','0','0','1','260','','');
INSERT OR REPLACE INTO optreden(id,locatie,plaats,landCode,longitude,latitude,datum,tijd,isBuiten,isSociaal,isOpenbaar,isBesloten,isWildOp,mansen,cds,groupies,aantalBezoekers,gastdirigent,opmerkingen) VALUES ('2','AZC','Sneek','nl','0','0','2019-10-28','13:30','0','1','0','1','0','0','0','0','45','Ibrahim','');
INSERT OR REPLACE INTO optreden(id,locatie,plaats,landCode,longitude,latitude,datum,tijd,isBuiten,isSociaal,isOpenbaar,isBesloten,isWildOp,mansen,cds,groupies,aantalBezoekers,gastdirigent,opmerkingen) VALUES ('3','Nut Franeker','Franeker','nl','0','0','2019-10-28','20:00','0','1','0','1','0','0','1','1','225','','');
INSERT OR REPLACE INTO optreden(id,locatie,plaats,landCode,longitude,latitude,datum,tijd,isBuiten,isSociaal,isOpenbaar,isBesloten,isWildOp,mansen,cds,groupies,aantalBezoekers,gastdirigent,opmerkingen) VALUES ('4','Auris de Weerklank','Leiden','nl','0','0','2019-10-29','14:00','0','1','0','1','0','0','0','0','160','Kimberley','');
INSERT OR REPLACE INTO optreden(id,locatie,plaats,landCode,longitude,latitude,datum,tijd,isBuiten,isSociaal,isOpenbaar,isBesloten,isWildOp,mansen,cds,groupies,aantalBezoekers,gastdirigent,opmerkingen) VALUES ('6','AZC','Amsterdam','nl','0','0','2019-10-29','17:15','0','1','1','0','0','0','0','0','110','Hemmo','Loopstuk over het terrein');
INSERT OR REPLACE INTO optreden(id,locatie,plaats,landCode,longitude,latitude,datum,tijd,isBuiten,isSociaal,isOpenbaar,isBesloten,isWildOp,mansen,cds,groupies,aantalBezoekers,gastdirigent,opmerkingen) VALUES ('7','Planetarium','Amsterdam','nl','0','0','2019-10-29','20:00','0','1','1','0','0','1','1','1','195','','');
INSERT OR REPLACE INTO optreden(id,locatie,plaats,landCode,longitude,latitude,datum,tijd,isBuiten,isSociaal,isOpenbaar,isBesloten,isWildOp,mansen,cds,groupies,aantalBezoekers,gastdirigent,opmerkingen) VALUES ('8','Kaj Munk College','Hoofddorp','nl','0','0','2019-10-30','10:15','0','1','1','0','0','0','0','0','185','','');
INSERT OR REPLACE INTO optreden(id,locatie,plaats,landCode,longitude,latitude,datum,tijd,isBuiten,isSociaal,isOpenbaar,isBesloten,isWildOp,mansen,cds,groupies,aantalBezoekers,gastdirigent,opmerkingen) VALUES ('9','Kaj Munk College','Hoofddorp','nl','0','0','2019-10-30','11:15','0','1','1','0','0','0','0','0','200','','');
INSERT OR REPLACE INTO optreden(id,locatie,plaats,landCode,longitude,latitude,datum,tijd,isBuiten,isSociaal,isOpenbaar,isBesloten,isWildOp,mansen,cds,groupies,aantalBezoekers,gastdirigent,opmerkingen) VALUES ('10','Kompas College','Spijkenisse','nl','0','0','2019-10-31','10:00','0','1','0','1','0','0','0','0','55','Djammo','');
INSERT OR REPLACE INTO optreden(id,locatie,plaats,landCode,longitude,latitude,datum,tijd,isBuiten,isSociaal,isOpenbaar,isBesloten,isWildOp,mansen,cds,groupies,aantalBezoekers,gastdirigent,opmerkingen) VALUES ('11','Kompas College','Spijkenisse','nl','0','0','2019-10-31','11:00','0','1','0','1','0','0','0','0','75','Develi','');
INSERT OR REPLACE INTO optreden(id,locatie,plaats,landCode,longitude,latitude,datum,tijd,isBuiten,isSociaal,isOpenbaar,isBesloten,isWildOp,mansen,cds,groupies,aantalBezoekers,gastdirigent,opmerkingen) VALUES ('12','Curio Praktijkschool','Breda','nl','0','0','2019-10-31','18:15','0','1','1','0','0','0','0','0','110','','');
INSERT OR REPLACE INTO optreden(id,locatie,plaats,landCode,longitude,latitude,datum,tijd,isBuiten,isSociaal,isOpenbaar,isBesloten,isWildOp,mansen,cds,groupies,aantalBezoekers,gastdirigent,opmerkingen) VALUES ('13','Theater de Omval','Diemen','nl','0','0','2019-11-01','09:00','0','1','0','1','0','0','0','0','155','','');
INSERT OR REPLACE INTO optreden(id,locatie,plaats,landCode,longitude,latitude,datum,tijd,isBuiten,isSociaal,isOpenbaar,isBesloten,isWildOp,mansen,cds,groupies,aantalBezoekers,gastdirigent,opmerkingen) VALUES ('14','Theater de Omval','Diemen','nl','0','0','2019-11-01','10:00','0','1','0','1','0','0','0','0','190','','');
INSERT OR REPLACE INTO optreden(id,locatie,plaats,landCode,longitude,latitude,datum,tijd,isBuiten,isSociaal,isOpenbaar,isBesloten,isWildOp,mansen,cds,groupies,aantalBezoekers,gastdirigent,opmerkingen) VALUES ('15','Verzorgingshuis','Diemen','nl','0','0','2019-11-01','11:30','0','1','1','0','0','0','0','0','70','Paula','');
INSERT OR REPLACE INTO optreden(id,locatie,plaats,landCode,longitude,latitude,datum,tijd,isBuiten,isSociaal,isOpenbaar,isBesloten,isWildOp,mansen,cds,groupies,aantalBezoekers,gastdirigent,opmerkingen) VALUES ('16','Winkelcentrum Diemerplein','Diemen','nl','0','0','2019-11-01','13:15','0','0','1','0','0','1','0','1','210','','');
INSERT OR REPLACE INTO optreden(id,locatie,plaats,landCode,longitude,latitude,datum,tijd,isBuiten,isSociaal,isOpenbaar,isBesloten,isWildOp,mansen,cds,groupies,aantalBezoekers,gastdirigent,opmerkingen) VALUES ('17','Hyperion Lyceum','Amsterdam','nl','0','0','2019-11-01','15:00','0','1','0','1','0','0','0','0','155','','');
INSERT OR REPLACE INTO optreden(id,locatie,plaats,landCode,longitude,latitude,datum,tijd,isBuiten,isSociaal,isOpenbaar,isBesloten,isWildOp,mansen,cds,groupies,aantalBezoekers,gastdirigent,opmerkingen) VALUES ('18','Huis van de Wijk de Meeuw','Amsterdam','nl','0','0','2019-11-01','19:00','0','0','1','0','0','0','0','0','70','','');
INSERT OR REPLACE INTO optreden(id,locatie,plaats,landCode,longitude,latitude,datum,tijd,isBuiten,isSociaal,isOpenbaar,isBesloten,isWildOp,mansen,cds,groupies,aantalBezoekers,gastdirigent,opmerkingen) VALUES ('19','Kerk en Buurt, Nassaukerk','Amsterdam','nl','0','0','2019-11-02','10:30','0','1','1','0','0','0','0','0','150','','');
INSERT OR REPLACE INTO optreden(id,locatie,plaats,landCode,longitude,latitude,datum,tijd,isBuiten,isSociaal,isOpenbaar,isBesloten,isWildOp,mansen,cds,groupies,aantalBezoekers,gastdirigent,opmerkingen) VALUES ('20','HVO Querido','Amsterdam','nl','0','0','2019-11-02','16:00','0','1','0','1','0','0','0','0','35','Mary','Loopstuk door de gangen');
INSERT OR REPLACE INTO optreden(id,locatie,plaats,landCode,longitude,latitude,datum,tijd,isBuiten,isSociaal,isOpenbaar,isBesloten,isWildOp,mansen,cds,groupies,aantalBezoekers,gastdirigent,opmerkingen) VALUES ('21','Finale Arrangeerwedstrijd, Amstelkerk','Amsterdam','nl','0','0','2019-11-02','20:00','0','0','1','0','0','1','0','1','190','','');
INSERT OR REPLACE INTO optreden(id,locatie,plaats,landCode,longitude,latitude,datum,tijd,isBuiten,isSociaal,isOpenbaar,isBesloten,isWildOp,mansen,cds,groupies,aantalBezoekers,gastdirigent,opmerkingen) VALUES ('22','Bolwerk, Kunstcentrum Sneek','Sneek','nl','0','0','2019-10-26','21:30','0','0','0','0','1','0','0','0','55','','');
INSERT OR REPLACE INTO optreden(id,locatie,plaats,landCode,longitude,latitude,datum,tijd,isBuiten,isSociaal,isOpenbaar,isBesloten,isWildOp,mansen,cds,groupies,aantalBezoekers,gastdirigent,opmerkingen) VALUES ('23','CSG Bogerman','Sneek','nl','0','0','2019-10-28','11:00','0','1','0','1','0','0','0','0','140','Douwe','');
INSERT OR REPLACE INTO optreden(id,locatie,plaats,landCode,longitude,latitude,datum,tijd,isBuiten,isSociaal,isOpenbaar,isBesloten,isWildOp,mansen,cds,groupies,aantalBezoekers,gastdirigent,opmerkingen) VALUES ('24','Fier Leeuwarden','Leeuwarden','nl','0','0','2019-10-28','16:00','0','1','0','1','0','0','0','0','45','Shaira','');
INSERT OR REPLACE INTO optreden(id,locatie,plaats,landCode,longitude,latitude,datum,tijd,isBuiten,isSociaal,isOpenbaar,isBesloten,isWildOp,mansen,cds,groupies,aantalBezoekers,gastdirigent,opmerkingen) VALUES ('25','Winkelcentrum Westmarket','Amsterdam Osdorp','nl','0','0','2019-10-29','16:00','0','0','0','0','1','0','0','0','90','','');
INSERT OR REPLACE INTO optreden(id,locatie,plaats,landCode,longitude,latitude,datum,tijd,isBuiten,isSociaal,isOpenbaar,isBesloten,isWildOp,mansen,cds,groupies,aantalBezoekers,gastdirigent,opmerkingen) VALUES ('26','School de Populier','Den Haag','nl','0','0','2019-10-30','15:15','0','1','1','0','0','0','0','0','135','Isa','');
INSERT OR REPLACE INTO optreden(id,locatie,plaats,landCode,longitude,latitude,datum,tijd,isBuiten,isSociaal,isOpenbaar,isBesloten,isWildOp,mansen,cds,groupies,aantalBezoekers,gastdirigent,opmerkingen) VALUES ('27','Het Muzieklokaal','Utrecht','nl','0','0','2019-10-30','20:30','0','0','1','0','0','1','1','1','65','','');
INSERT OR REPLACE INTO optreden(id,locatie,plaats,landCode,longitude,latitude,datum,tijd,isBuiten,isSociaal,isOpenbaar,isBesloten,isWildOp,mansen,cds,groupies,aantalBezoekers,gastdirigent,opmerkingen) VALUES ('28','Kringloopwinkel Goedkoop & Zo','Breda','nl','0','0','2019-10-31','14:30','0','0','0','0','1','0','0','0','35','','');
INSERT OR REPLACE INTO optreden(id,locatie,plaats,landCode,longitude,latitude,datum,tijd,isBuiten,isSociaal,isOpenbaar,isBesloten,isWildOp,mansen,cds,groupies,aantalBezoekers,gastdirigent,opmerkingen) VALUES ('29','AKV St. Joost','Breda','nl','0','0','2019-10-31','15:30','0','1','1','0','0','1','0','0','90','','');
INSERT OR REPLACE INTO optreden(id,locatie,plaats,landCode,longitude,latitude,datum,tijd,isBuiten,isSociaal,isOpenbaar,isBesloten,isWildOp,mansen,cds,groupies,aantalBezoekers,gastdirigent,opmerkingen) VALUES ('30','Cafe de Ceuvel','Amsterdam','nl','0','0','2019-11-01','17:10','0','0','0','0','1','1','0','1','45','','');
INSERT OR REPLACE INTO optreden(id,locatie,plaats,landCode,longitude,latitude,datum,tijd,isBuiten,isSociaal,isOpenbaar,isBesloten,isWildOp,mansen,cds,groupies,aantalBezoekers,gastdirigent,opmerkingen) VALUES ('31','Huis van de Buurt de Boeg','Amsterdam','nl','0','0','2019-11-02','12:30','0','1','1','0','0','1','0','1','80','Wouter','Loopstuk door de gangen');
INSERT OR REPLACE INTO stuk(id,titel,componist,code,metSolist1,metSolist2) VALUES ('1','Duivelsversen','R. Namavar','01','0','0');
INSERT OR REPLACE INTO stuk(id,titel,componist,code,metSolist1,metSolist2) VALUES ('2','Diabolos','M. Augustijn','02','0','0');
INSERT OR REPLACE INTO stuk(id,titel,componist,code,metSolist1,metSolist2) VALUES ('3','Devils Atmospheres','C.C. van Elst','03','0','0');
INSERT OR REPLACE INTO stuk(id,titel,componist,code,metSolist1,metSolist2) VALUES ('4','La Folia','A. Vivaldi','S','0','0');
INSERT OR REPLACE INTO stuk(id,titel,componist,code,metSolist1,metSolist2) VALUES ('5','Purgatorio','G. Mahler','05','0','0');
INSERT OR REPLACE INTO stuk(id,titel,componist,code,metSolist1,metSolist2) VALUES ('7','Baba-jaga','Anatoli Ljadov','06','0','0');
INSERT OR REPLACE INTO stuk(id,titel,componist,code,metSolist1,metSolist2) VALUES ('8','Mephistos Höllenrufe','J. Strauss jr.','07','0','0');
INSERT OR REPLACE INTO stuk(id,titel,componist,code,metSolist1,metSolist2) VALUES ('9','Groen Trollenland','T. Swagten','14','0','0');
INSERT OR REPLACE INTO stuk(id,titel,componist,code,metSolist1,metSolist2) VALUES ('10','Subednav Neleiwed','J. van Hoogdalem','13','0','0');
INSERT OR REPLACE INTO stuk(id,titel,componist,code,metSolist1,metSolist2) VALUES ('11','joepie joepie','H. Bouma','15','0','0');
INSERT OR REPLACE INTO stuk(id,titel,componist,code,metSolist1,metSolist2) VALUES ('12','Night on Disco Mountain','M. Mussorgski (arr. B. Mathot)','08','0','0');
INSERT OR REPLACE INTO stuk(id,titel,componist,code,metSolist1,metSolist2) VALUES ('13','The Devil Went Back to Georgia','Charlie Daniels Band (arr. D. Nauta)','12','0','0');
INSERT OR REPLACE INTO stuk(id,titel,componist,code,metSolist1,metSolist2) VALUES ('14','Old Devil Moon','B. Lane (arr. D. Herweg)','10','0','0');
INSERT OR REPLACE INTO stuk(id,titel,componist,code,metSolist1,metSolist2) VALUES ('15','Devil in Disguise','E. Presley (arr. P. Davis)','11','0','0');
INSERT OR REPLACE INTO stuk(id,titel,componist,code,metSolist1,metSolist2) VALUES ('16','Bat Out of Hell','Meat Loaf (arr. B. Faber)','09','0','0');
INSERT OR REPLACE INTO stuk(id,titel,componist,code,metSolist1,metSolist2) VALUES ('17','Cruella de Vil','M. Leven (arr. P. Keijsers)','B','0','0');
INSERT OR REPLACE INTO stuk(id,titel,componist,code,metSolist1,metSolist2) VALUES ('18','Rapsodie op een thema van Paganini','S. Rachmaninov (arr. M. van Prooijen)','16','1','0');
INSERT OR REPLACE INTO stuk(id,titel,componist,code,metSolist1,metSolist2) VALUES ('19','Danse Macabre','C. Saint-Saëns','17','1','0');
INSERT OR REPLACE INTO stuk(id,titel,componist,code,metSolist1,metSolist2) VALUES ('20','Romance Del Diablo','A. Piazzolla (arr. L. Zibat)','18','1','0');
INSERT OR REPLACE INTO stuk(id,titel,componist,code,metSolist1,metSolist2) VALUES ('21','Devil Circle','Cracow Klezmer Band (arr. H. Bouma)','19','1','0');
INSERT OR REPLACE INTO stuk(id,titel,componist,code,metSolist1,metSolist2) VALUES ('22','Faust, een duivelse vertelling','Various (samenstelling C. Stuit)','20','1','1');
INSERT OR REPLACE INTO stuk(id,titel,componist,code,metSolist1,metSolist2) VALUES ('23','Loopstuk','','L','0','0');
INSERT OR REPLACE INTO stuk(id,titel,componist,code,metSolist1,metSolist2) VALUES ('24','Hongaarse Mars','H. Berlioz','G','0','0');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('24','7');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('24','8');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('24','12');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('24','14');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('24','11');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('24','17');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('24','24');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('24','23');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('24','4');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('30','16');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('30','14');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('30','17');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('30','4');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('1','15');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('1','10');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('1','19');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('1','20');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('1','17');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('1','4');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('23','3');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('23','16');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('23','15');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('23','19');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('23','20');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('23','21');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('23','17');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('23','24');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('23','23');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('22','12');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('22','16');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('2','2');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('2','5');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('2','14');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('2','9');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('2','18');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('2','20');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('2','24');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('3','1');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('3','2');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('3','5');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('3','7');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('3','12');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('3','16');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('3','14');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('3','15');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('3','13');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('3','10');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('3','20');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('3','21');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('3','17');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('3','4');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('26','8');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('26','16');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('26','15');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('26','10');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('26','9');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('26','11');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('26','19');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('26','20');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('26','21');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('26','17');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('26','24');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('4','14');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('4','10');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('4','9');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('4','18');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('4','20');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('4','17');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('4','24');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('27','14');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('27','15');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('27','19');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('27','20');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('27','21');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('27','17');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('27','4');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('25','7');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('6','3');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('6','5');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('6','12');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('6','16');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('6','15');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('6','19');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('6','21');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('6','24');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('6','23');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('7','1');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('7','2');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('7','3');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('7','12');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('7','14');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('7','15');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('7','13');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('7','10');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('7','11');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('7','18');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('7','20');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('7','21');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('7','23');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('7','4');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('14','22');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('14','23');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('8','22');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('11','16');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('11','10');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('11','19');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('11','20');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('11','21');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('11','24');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('11','23');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('15','8');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('15','14');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('15','15');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('15','19');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('15','20');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('15','24');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('15','4');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('28','12');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('28','15');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('28','20');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('28','23');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('13','22');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('13','23');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('10','7');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('10','12');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('10','15');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('10','20');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('10','24');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('10','23');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('9','22');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('29','2');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('29','5');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('29','14');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('29','11');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('29','18');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('29','20');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('29','21');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('29','23');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('29','4');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('12','12');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('12','13');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('12','21');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('12','22');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('12','17');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('12','23');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('16','2');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('16','7');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('16','12');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('16','10');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('16','18');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('16','21');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('17','12');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('17','13');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('17','21');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('17','22');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('18','1');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('18','7');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('18','12');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('18','16');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('18','11');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('18','18');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('18','19');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('18','21');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('18','17');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('19','1');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('19','14');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('19','13');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('19','18');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('19','21');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('21','1');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('21','7');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('21','14');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('21','13');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('21','10');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('21','9');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('21','11');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('21','18');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('21','19');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('21','20');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('21','21');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('21','17');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('21','4');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('31','5');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('31','12');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('31','14');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('31','15');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('31','9');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('31','19');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('31','20');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('31','17');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('31','24');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('31','23');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('31','4');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('20','12');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('20','14');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('20','15');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('20','18');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('20','20');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('20','17');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('20','24');
INSERT OR REPLACE INTO `optreden_repertoire`(optredenId,stukId) VALUES ('20','23');

