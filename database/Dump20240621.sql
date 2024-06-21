-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: sosit
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `address` (
  `id_address` int NOT NULL AUTO_INCREMENT,
  `id_credential` int NOT NULL,
  `number` varchar(10) DEFAULT NULL,
  `street` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `postal_code` varchar(10) DEFAULT NULL,
  `complement` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_address`),
  KEY `id_credential` (`id_credential`),
  CONSTRAINT `address_ibfk_1` FOREIGN KEY (`id_credential`) REFERENCES `credential` (`id_credential`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
INSERT INTO `address` VALUES (1,1,'134','Rua Matilde Barnabé Ferreira Leite','Jardim Regente','Indaiatuba','SP','13336-348','Casa','2024-06-15 23:47:05','2024-06-15 23:47:05',NULL),(2,2,'134','Rua Matilde Barnabé Ferreira Leite','Jardim Regente','Indaiatuba','SP','13336-348','Casa','2024-06-15 23:48:08','2024-06-15 23:48:08',NULL),(5,5,'134','Rua Matilde Barnabé Ferreira Leite','Jardim Regente','Indaiatuba','SP','13336-348','Casa','2024-06-19 12:41:38','2024-06-19 12:41:38',NULL),(6,6,'134','Rua Matilde Barnabé Ferreira Leite','Jardim Regente','Indaiatuba','SP','13336-348','Casa','2024-06-19 17:23:12','2024-06-19 17:23:12',NULL),(7,7,'134','Rua Matilde Barnabé Ferreira Leite','Jardim Regente','Indaiatuba','SP','13336-348','Casa','2024-06-19 17:24:27','2024-06-19 17:24:27',NULL),(8,8,'134','Rua Matilde Barnabé Ferreira Leite','Jardim Regente','Indaiatuba','SP','13336-348','Casa','2024-06-19 17:30:14','2024-06-19 17:30:14',NULL),(9,9,'134','Rua Matilde Barnabé Ferreira Leite','Jardim Regente','Indaiatuba','SP','13336-348','Casa','2024-06-19 17:32:42','2024-06-19 17:32:42',NULL);
/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commitment`
--

DROP TABLE IF EXISTS `commitment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `commitment` (
  `id_commitment` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `id_times` int NOT NULL,
  `date_commitment` date NOT NULL,
  `description_commitment` varchar(255) DEFAULT NULL,
  `rating` int DEFAULT '0',
  `comment` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_commitment`),
  KEY `id_user` (`id_user`),
  KEY `id_times` (`id_times`),
  CONSTRAINT `commitment_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`),
  CONSTRAINT `commitment_ibfk_2` FOREIGN KEY (`id_times`) REFERENCES `times` (`id_times`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commitment`
--

LOCK TABLES `commitment` WRITE;
/*!40000 ALTER TABLE `commitment` DISABLE KEYS */;
INSERT INTO `commitment` VALUES (1,1,2,'2024-06-02',NULL,0,NULL,'2024-06-21 21:23:08','2024-06-21 21:23:08',NULL),(2,1,2,'2024-06-09',NULL,0,NULL,'2024-06-21 21:25:47','2024-06-21 21:25:47',NULL);
/*!40000 ALTER TABLE `commitment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company`
--

DROP TABLE IF EXISTS `company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company` (
  `id_company` int NOT NULL AUTO_INCREMENT,
  `id_credential` int NOT NULL,
  `name_company` varchar(50) DEFAULT NULL,
  `cnpj_company` varchar(18) DEFAULT NULL,
  `more_information` varchar(255) DEFAULT NULL,
  `image_company` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_company`),
  UNIQUE KEY `cnpj_company` (`cnpj_company`),
  KEY `id_credential` (`id_credential`),
  CONSTRAINT `company_ibfk_1` FOREIGN KEY (`id_credential`) REFERENCES `credential` (`id_credential`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company`
--

LOCK TABLES `company` WRITE;
/*!40000 ALTER TABLE `company` DISABLE KEYS */;
INSERT INTO `company` VALUES (1,1,'Name Company','94.240.137/0001-67','More Information','Captura de tela 2024-03-05 093922-4fa6d39ed3161da3.png','2024-06-15 23:47:05','2024-06-20 21:27:14',NULL),(2,6,'Name Company 01','00.000.000/0000-01','More Information',NULL,'2024-06-19 17:23:12','2024-06-19 17:23:12',NULL),(3,7,'Name Company 02','00.000.000/0000-02','More Information',NULL,'2024-06-19 17:24:27','2024-06-19 17:24:27',NULL);
/*!40000 ALTER TABLE `company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact`
--

DROP TABLE IF EXISTS `contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact` (
  `id_contact` int NOT NULL AUTO_INCREMENT,
  `id_credential` int NOT NULL,
  `person_name` varchar(50) DEFAULT NULL,
  `email_contact` varchar(100) DEFAULT NULL,
  `phone_contact` varchar(15) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_contact`),
  KEY `id_credential` (`id_credential`),
  CONSTRAINT `contact_ibfk_1` FOREIGN KEY (`id_credential`) REFERENCES `credential` (`id_credential`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact`
--

LOCK TABLES `contact` WRITE;
/*!40000 ALTER TABLE `contact` DISABLE KEYS */;
INSERT INTO `contact` VALUES (1,1,'Person Name','email00@contact.com','(19) 99999-9999','2024-06-15 23:47:05','2024-06-15 23:47:05',NULL),(2,2,'Person Name','email00@contact.com','(19) 99999-9999','2024-06-15 23:48:08','2024-06-15 23:48:08',NULL),(5,5,'Person Name','email01@contact.com','(19) 99999-9999','2024-06-19 12:41:38','2024-06-19 12:41:38',NULL),(6,6,'Person Contact','email01@contact.com','(19) 99999-9999','2024-06-19 17:23:12','2024-06-19 17:23:12',NULL),(7,7,'Person Contact','email02@contact.com','(19) 99999-9999','2024-06-19 17:24:27','2024-06-19 17:24:27',NULL),(8,8,'Person Name','email02@contact.com','(19) 99999-9999','2024-06-19 17:30:14','2024-06-19 17:30:14',NULL),(9,9,'Person Name','email03@contact.com','(19) 99999-9999','2024-06-19 17:32:42','2024-06-19 17:32:42',NULL);
/*!40000 ALTER TABLE `contact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `credential`
--

DROP TABLE IF EXISTS `credential`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `credential` (
  `id_credential` int NOT NULL AUTO_INCREMENT,
  `profile` enum('user','company') NOT NULL,
  `email_login` varchar(100) DEFAULT NULL,
  `password_login` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_credential`),
  UNIQUE KEY `email_login` (`email_login`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `credential`
--

LOCK TABLES `credential` WRITE;
/*!40000 ALTER TABLE `credential` DISABLE KEYS */;
INSERT INTO `credential` VALUES (1,'company','company00@login.com','$2b$10$HmpaSkk0ship6bvd540CLOkIH7GIBG7k8lWtlU/jl1prG.DsMrEwi','2024-06-15 23:47:05','2024-06-21 02:24:57',NULL),(2,'user','user00@login.com','$2b$10$PkSUk3XuLoP9IfqJFlR46Oh1hBp20TZR9wybXnWx/ixZJ7ttWT8Am','2024-06-15 23:48:08','2024-06-15 23:48:08',NULL),(5,'user','user01@login.com','$2b$10$UQwOyjXc6N.rw0m4B.qeK.AGVRz5iLO32Q6U4yLzbsFKTQBaaLw2G','2024-06-19 12:41:38','2024-06-19 12:41:38',NULL),(6,'company','company01@login.com','$2b$10$B0IEazKMVmPL5I6wV07UU.ren/uYT.bacCQuGv9oGn.2NQiqC25cG','2024-06-19 17:23:12','2024-06-19 17:23:12',NULL),(7,'company','company02@login.com','$2b$10$HzFFRDpxJyeSWqrRGDafKOmMVtUi6VM5UssCL5cTNe/weqyYHbwTG','2024-06-19 17:24:27','2024-06-19 17:24:27',NULL),(8,'user','user02@login.com','$2b$10$bcR0nSFaG78ekyX0JGlR..8LsJ2Ht70yt8gExEC.p58dDI4Q/QwPu','2024-06-19 17:30:14','2024-06-19 17:30:14',NULL),(9,'user','user03@login.com','$2b$10$fFajGl84cKLREiSVDFsDMu3Dl1CvscdSVPEhqFegSrw9zrIGqKK6y','2024-06-19 17:32:42','2024-06-19 17:32:42',NULL);
/*!40000 ALTER TABLE `credential` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule`
--

DROP TABLE IF EXISTS `schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedule` (
  `id_schedule` int NOT NULL AUTO_INCREMENT,
  `id_company` int NOT NULL,
  `name_schedule` varchar(50) DEFAULT NULL,
  `service_schedule` varchar(50) DEFAULT NULL,
  `description_schedule` varchar(255) DEFAULT NULL,
  `is_active` tinyint NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_schedule`),
  KEY `id_company` (`id_company`),
  CONSTRAINT `schedule_ibfk_1` FOREIGN KEY (`id_company`) REFERENCES `company` (`id_company`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule`
--

LOCK TABLES `schedule` WRITE;
/*!40000 ALTER TABLE `schedule` DISABLE KEYS */;
INSERT INTO `schedule` VALUES (1,1,'Name Schedule 00','Service Schedule 00','Description Schedule 00',1,'2024-06-20 19:00:19','2024-06-20 23:45:03',NULL),(2,1,'Name Schedule 01','Service Schedule 01','Description Schedule 01',1,'2024-06-20 20:52:18','2024-06-21 04:36:29',NULL);
/*!40000 ALTER TABLE `schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `times`
--

DROP TABLE IF EXISTS `times`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `times` (
  `id_times` int NOT NULL AUTO_INCREMENT,
  `id_schedule` int NOT NULL,
  `status` tinyint NOT NULL DEFAULT '0',
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `day_week` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_times`),
  KEY `id_schedule` (`id_schedule`),
  CONSTRAINT `times_ibfk_1` FOREIGN KEY (`id_schedule`) REFERENCES `schedule` (`id_schedule`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `times`
--

LOCK TABLES `times` WRITE;
/*!40000 ALTER TABLE `times` DISABLE KEYS */;
INSERT INTO `times` VALUES (1,1,0,'01:00:00','02:00:00',1,'2024-06-21 02:26:01','2024-06-21 04:43:37','2024-06-21 04:43:37'),(2,1,0,'02:00:00','03:00:00',0,'2024-06-21 04:07:11','2024-06-21 04:07:11',NULL),(3,1,0,'14:00:00','15:00:00',1,'2024-06-21 04:24:02','2024-06-21 04:24:02',NULL),(4,1,0,'03:30:00','03:31:00',0,'2024-06-21 04:32:28','2024-06-21 04:43:54','2024-06-21 04:43:54'),(5,1,0,'03:30:00','03:31:00',0,'2024-06-21 04:44:24','2024-06-21 04:44:24',NULL);
/*!40000 ALTER TABLE `times` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id_user` int NOT NULL AUTO_INCREMENT,
  `id_credential` int NOT NULL,
  `name_user` varchar(50) DEFAULT NULL,
  `cpf_user` varchar(14) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `image_user` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `cpf_user` (`cpf_user`),
  KEY `id_credential` (`id_credential`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`id_credential`) REFERENCES `credential` (`id_credential`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,2,'Name User 00','557.826.060-88','2000-09-23','avatar-1dcc72561da72cc6.png','2024-06-15 23:48:08','2024-06-20 16:43:23',NULL),(2,5,'Name User','403.140.060-87','2000-09-23',NULL,'2024-06-19 12:41:38','2024-06-20 14:24:51',NULL),(3,8,'Name User 02','000.000.000-02','2002-02-02',NULL,'2024-06-19 17:30:14','2024-06-19 17:30:14',NULL),(4,9,'Name User 03','000.000.000-03','2003-03-03',NULL,'2024-06-19 17:32:42','2024-06-19 17:32:42',NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-21 19:03:25
