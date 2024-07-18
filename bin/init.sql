-- Adminer 4.8.1 MySQL 5.5.5-10.11.7-MariaDB-1:10.11.6+maria~ubu2204 dump
CREATE DATABASE IF NOT EXISTS station;
USE station;

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `reservations`;
CREATE TABLE `reservations` (
                                `id` int(11) NOT NULL AUTO_INCREMENT,
                                `email` varchar(255) NOT NULL,
                                `unite` varchar(100) NOT NULL,
                                `operation` varchar(100) NOT NULL,
                                `date_depot` date NOT NULL,
                                `nombre_bouteilles` int(2) NOT NULL,
                                `commentaires` text NOT NULL,
                                PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
                         `id` int(11) NOT NULL AUTO_INCREMENT,
                         `email` varchar(255) NOT NULL,
                         `password` varchar(100) NOT NULL,
                         PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
                         `manual_suspension_status` BOOLEAN NOT NULL DEFAULT false,
                         `suspension_dates` TEXT,
                         `message` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `users` (`id`, `email`, `password`) VALUES
    (1,	'cephismer_admin_2024',	'$2b$10$uFJe10MiJNSF3JKGcIb6MOAfj/hX7W.HNVUs93R8w/ZY5CZnGb4Uy');

-- 2024-04-18 11:50:57
