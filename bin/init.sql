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
    (1,	'admin@intradef.gouv.fr',	'$2b$10$ybRuET3doKONEtP3nY4HtOKMR9MjG/uVtPqbPYft.pWHF7NWrPbya');

INSERT INTO `reservations` (email, unite, operation, date_depot, nombre_bouteilles, commentaires) VALUES
    ('cephismer@intradef.gouv.fr', 'CEPHISMER', 'Rinçage', DATE '2024-04-29', 4, 'L54378 B65437'),
    ('cephismer@intradef.gouv.fr', 'CEPHISMER', 'Gonflage', DATE '2024-04-30', 10, 'L54211 B35897'),
    ('lafayette@intradef.gouv.fr', 'LaFayette', 'Rinçage & Gonflage', DATE '2024-07-31', 5, 'L54543 B65991'),
    ('test@intradef.gouv.fr', 'Test', 'Rinçage & Gonflage',DATE '2024-07-31', 1, 'test'),
    ('provence@intradef.gouv.fr', 'Provence', 'Gonflage', DATE '2024-07-31', 10, 'L56543 B76948'),
    ('provence@intradef.gouv.fr', 'Provence', 'Rinçage', DATE '2024-07-31', 5, 'L54543 B65991'),
    ('test@intradef.gouv.fr', 'test', 'Rinçage', DATE '2024-07-26', 50, 'Test commentaire, lyres : L12345, L47462 et blocs : 1234, 1249, 8459, légères déformations sur la bouteille L12345.'),
    ('exemple@intradef.gouv.fr', 'UniteTest', 'Rinçage', DATE '2024-07-08', 12, 'Test commentaire'),
    ('exemple1@intradef.gouv.fr', 'UniteTest1', 'Rinçage', DATE '2024-07-09', 8, 'Test commentaire2'),
    ('exemple1@intradef.gouv.fr', 'UniteTest1', 'Rinçage & Gonflage', DATE '2024-07-09', 5, 'Test commentaire3'),
    ('exemple1@intradef.gouv.fr', 'UniteTest1', 'Gonflage', DATE '2024-07-10', 3, 'Test commentaire4'),
    ('exemple1@intradef.gouv.fr', 'UniteTest1', 'Gonflage', DATE '2024-07-10', 14, 'Test commentaire5'),
    ('exemple1@intradef.gouv.fr', 'UniteTest1', 'Rinçage & Gonflage', DATE '2024-07-11', 24, 'Test commentaire6'),
    ('exemple2@intradef.gouv.fr', 'UniteTest2', 'Gonflage', DATE '2024-07-10', 21, 'Test commentaire7'),
    ('exemple2@intradef.gouv.fr', 'UniteTest2', 'Gonflage', DATE '2024-07-11', 5, 'Test commentaire7'),
    ('exemple2@intradef.gouv.fr', 'UniteTest2', 'Gonflage', DATE '2024-07-12', 41, 'Test commentaire7'),
    ('exemple3@intradef.gouv.fr', 'UniteTest3', 'Gonflage', DATE '2024-07-12', 1, 'Test commentaire7'),
    ('exemple3@intradef.gouv.fr', 'UniteTest3', 'Gonflage', DATE '2024-07-15', 33, 'Test commentaire7'),
    ('exemple3@intradef.gouv.fr', 'UniteTest3', 'Gonflage', DATE '2024-07-15', 6, 'Test commentaire7'),
    ('exemple3@intradef.gouv.fr', 'UniteTest3', 'Gonflage', DATE '2024-07-16', 50, 'Test commentaire7'),
    ('exemple3@intradef.gouv.fr', 'UniteTest3', 'Gonflage', DATE '2024-07-17', 26, 'Test commentaire7');

INSERT INTO `admin` (`manual_suspension_status`, `suspension_dates`, `message`) VALUES (false, '2024-07-31', '')
-- 2024-04-18 11:50:57
