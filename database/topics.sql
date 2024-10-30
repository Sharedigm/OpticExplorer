# ************************************************************
# Sequel Ace SQL dump
# Version 20067
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Host: 127.0.0.1 (MySQL 5.5.5-10.3.34-MariaDB)
# Database: opticexplorer
# Generation Time: 2024-08-07 00:21:17 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table topics
# ------------------------------------------------------------

DROP TABLE IF EXISTS `topics`;

CREATE TABLE `topics` (
  `id` char(36) NOT NULL DEFAULT '',
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(4096) DEFAULT NULL,
  `icon_path` varchar(1024) DEFAULT NULL,
  `keywords` varchar(1024) DEFAULT NULL,
  `user_id` char(36) DEFAULT NULL,
  `public` tinyint(1) NOT NULL DEFAULT 0,
  `private` tinyint(1) NOT NULL DEFAULT 0,
  `required` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `topics_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `topics` WRITE;
/*!40000 ALTER TABLE `topics` DISABLE KEYS */;

INSERT INTO `topics` (`id`, `name`, `description`, `icon_path`, `keywords`, `user_id`, `public`, `private`, `required`, `created_at`, `updated_at`, `deleted_at`)
VALUES
	('595290ac-66e9-c5f6-be23-2ed2ee2dc732','Astronomy','Discussion of astronomical optics.','/Shared/Pictures/Twemoji/Objects/Science/1f52d.svg','astronomy, star, planet, nebula, galaxy','500',1,0,0,'2022-12-23 18:33:18','2022-12-23 18:34:53',NULL),
	('5eeb6558-c1b1-5800-827e-a6346b434286','7Artisans','Discussion about 7Artisans optics.','/Shared/Pictures/Logos/7Artisans Logo.png',NULL,'500',1,0,0,'2023-02-24 23:57:18','2023-02-24 23:57:57',NULL),
	('62ed4723-216a-2af2-1d23-e15cd07a2485','Zeiss','Discussion about Zeiss optics.','/Shared/Pictures/Logos/Zeiss Logo.svg',NULL,'500',1,0,0,'2022-12-23 18:46:40','2022-12-23 18:46:40',NULL),
	('688c842f-0c30-e663-4b4a-0ae383b88401','Edmund Optics','Discussion about Edmund industrial optics.','/Shared/Pictures/Logos/eo_logo.svg',NULL,'500',1,0,0,'2023-01-30 00:15:23','2023-01-30 00:15:23',NULL),
	('72163217-5651-ad09-83fe-54379558cece','Leica','Discussion about Leica optics.','/Shared/Pictures/Logos/Leica Logo.svg',NULL,'500',1,0,0,'2022-12-23 18:43:56','2022-12-23 18:43:56',NULL),
	('86415798-efdb-6657-27bb-8dbc4821ac2c','Meade Instruments','Discussion about Meade astronomical optics.','/Shared/Pictures/Logos/Meade Logo.svg','astronomy, telescopes','500',1,0,0,'2023-01-30 02:08:12','2023-01-30 02:08:12',NULL),
	('932a4693-c62a-8df4-9b74-1febce57ef99','OpticExplorer','Discussion about the OpticExplorer optical simulation platform.','/Shared/Pictures/Logos/Optic Explorer Logo.svg','optics, simulation','5c3dba2f-1317-4f19-7d4e-9047c0f5c823',1,0,1,'2023-04-30 21:21:06','2023-04-30 21:21:06',NULL),
	('9e0d7909-cf47-d8b8-6c67-10f28695734c','Microscopy','Discussion of optics used in microscopy.','/Shared/Pictures/EmojiTwo/Objects/Science/1f52c.svg','microscope, micro','500',1,0,0,'2022-12-23 18:34:25','2022-12-23 18:34:25',NULL),
	('aff6947e-0368-0d7e-e94d-9782265ca0d5','Photography','Discussion about photographic optics.','/Shared/Pictures/EmojiTwo/Objects/Video/1f4f7.svg','photo, photography','500',1,0,0,'2022-12-23 18:32:10','2022-12-23 18:35:06',NULL),
	('c6b6ca1d-d16f-6b2a-f977-6b9373e63bb1','Canon','Discussion about Canon optics.','/Shared/Pictures/Logos/Canon Logo.svg',NULL,'500',1,0,0,'2022-12-23 18:41:54','2022-12-23 18:42:04',NULL),
	('d886945a-4047-d581-e999-067b73005dd2','Celestron','Discussion about Celestron optics.','/Shared/Pictures/Logos/Celestron Logo.svg',NULL,'500',1,0,0,'2022-12-23 18:55:37','2022-12-23 18:55:37',NULL),
	('ee4d1044-c84d-0b7d-07b3-516c77e15ecc','TTArtisan','Discussion about TTArtisan optics.','/Shared/Pictures/Logos/TTArtisan Logo.png',NULL,'500',1,0,0,'2023-02-24 23:58:22','2023-02-24 23:59:00',NULL),
	('fc7e2853-be11-c62e-36cf-2314e5ca9dec','Nikon','Discussion about Nikon optics.','/Shared/Pictures/Logos/Nikon Logo.svg',NULL,'500',1,0,0,'2022-12-23 18:40:59','2022-12-23 18:40:59',NULL);

/*!40000 ALTER TABLE `topics` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
