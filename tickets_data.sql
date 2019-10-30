/*
SQLyog Community v12.4.3 (32 bit)
MySQL - 10.1.38-MariaDB : Database - yii2basic
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`yii2basic` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `yii2basic`;

/*Table structure for table `country` */

DROP TABLE IF EXISTS `country`;

CREATE TABLE `country` (
  `code` char(2) NOT NULL,
  `name` char(52) NOT NULL,
  `population` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `country` */

insert  into `country`(`code`,`name`,`population`) values 
('AU','Australia',24016400),
('BR','Brazil',205722000),
('CA','Canada',35985751),
('CN','China',1375210000),
('DE','Germany',81459000),
('FR','France',64513242),
('GB','United Kingdom',65097000),
('IN','India',1285400000),
('RU','Russia',146519759),
('US','United States',322976000);

/*Table structure for table `site` */

DROP TABLE IF EXISTS `site`;

CREATE TABLE `site` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(30) NOT NULL,
  `url` varchar(100) NOT NULL DEFAULT '',
  `score` decimal(11,1) NOT NULL DEFAULT '0.0',
  `rating` int(11) NOT NULL DEFAULT '0',
  `reviews` int(11) NOT NULL DEFAULT '0',
  `excellent_reviews` int(11) NOT NULL DEFAULT '0',
  `excellent_rating` int(11) NOT NULL DEFAULT '0',
  `great_reviews` int(11) NOT NULL DEFAULT '0',
  `great_rating` int(11) NOT NULL DEFAULT '0',
  `average_reviews` int(11) NOT NULL DEFAULT '0',
  `average_rating` int(11) NOT NULL DEFAULT '0',
  `poor_reviews` int(11) NOT NULL DEFAULT '0',
  `poor_rating` int(11) NOT NULL DEFAULT '0',
  `bad_reviews` int(11) NOT NULL DEFAULT '0',
  `bad_rating` int(11) NOT NULL DEFAULT '0',
  `scan_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8;

/*Data for the table `site` */

insert  into `site`(`id`,`label`,`url`,`score`,`rating`,`reviews`,`excellent_reviews`,`excellent_rating`,`great_reviews`,`great_rating`,`average_reviews`,`average_rating`,`poor_reviews`,`poor_rating`,`bad_reviews`,`bad_rating`,`scan_date`) values 
(1,'Amadeus external','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(2,'Aigle Azur','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(3,'Kuwait Airways','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(4,'SmartWings','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(5,'Air Caraibes','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(6,'TAP Portugal','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(7,'CityJet','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(8,'Icelandair','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(9,'Braathens','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(10,'Thai Smile Airways','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(11,'Frenchbee','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(12,'Avianca Brazil','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(13,'Hainan Airlines','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(14,'Vayama','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(15,'Travelgenio','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(16,'Tuifly','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(17,'JetCompass','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(18,'Oman Air','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(19,'Gotogate','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(20,'Justairticket','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(21,'El Al','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(22,'AloTrip','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(23,'Kissandfly.com','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(24,'City.Travel','city.travel',7.0,0,0,0,0,0,0,0,0,0,0,0,0,'2019-08-17 04:18:10'),
(25,'Kenya Airways','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(26,'Singapore Airlines','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(27,'SWISS','swiss.com',1.9,100,214,30,14,17,8,7,3,13,6,147,69,'2019-08-17 04:18:13'),
(28,'Flightsmojo','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(29,'FlyFar','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(30,'FlightNetwork','flightnetwork.com',7.5,100,7187,5392,75,772,11,130,2,120,2,773,11,'2019-08-17 04:18:16'),
(31,'Pegasus Airlines','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(32,'Mytrip.com','mytrip.com',4.5,100,9571,3083,32,944,10,471,5,608,6,4465,47,'2019-08-17 04:18:22'),
(33,'KLM/AirFrance','klm.com',2.9,100,1760,600,34,311,18,223,13,181,10,445,25,'2019-08-17 04:18:32'),
(34,'CompassFlights','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(35,'Virgin Australia','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(36,'Cheaptickets.com','cheaptickets.com',0.4,100,240,49,20,14,6,6,2,5,2,166,69,'2019-08-17 04:18:43'),
(37,'eDreams US','edreams.net',6.4,100,1184,742,63,131,11,50,4,54,5,207,17,'2019-08-17 04:18:50'),
(38,'Etihad Airways','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(39,'Expedia','expedia.com',1.0,100,2631,167,6,48,2,32,1,74,3,2310,88,'2019-08-17 04:18:57'),
(40,'Tiket.com','Tiket.com',2.0,100,28,1,4,2,7,2,7,0,0,23,82,'2019-08-17 04:19:10'),
(41,'Qatar Airways','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(42,'Kiwi.com','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(43,'Turisto','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(44,'MyHolidays','myholidays.com',6.4,100,763,378,50,56,7,30,4,18,2,281,37,'2019-08-17 04:19:15'),
(45,'Trip.com','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(46,'SmartFares','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(47,'S7 Airlines','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(48,'EasyJet','easyjet.com',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(49,'Wizz Air','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(50,'Cheapfaremart','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(51,'Cheapflightsfreak','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(52,'FlyUIA.com','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL),
(53,'JustFly','',0.0,0,0,0,0,0,0,0,0,0,0,0,0,NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
