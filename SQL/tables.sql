USE `CoClean`;
DROP TABLE IF EXISTS `User`;
CREATE TABLE `User` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `surname` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(70) NOT NULL,

  PRIMARY KEY (`ID`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;


DROP TABLE IF EXISTS `Collective`;
CREATE TABLE `Collective` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL UNIQUE,
  `key` varchar(70) NOT NULL,
  `admin_user` int(11) NOT NULL,
  `onduty_user` int(11) NOT NULL,

  PRIMARY KEY (`ID`),
  FOREIGN KEY (`admin_user`) 
        REFERENCES `User`(`ID`),
  FOREIGN KEY (`onduty_user`) 
        REFERENCES `User`(`ID`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;


DROP TABLE IF EXISTS `Chore`;
CREATE TABLE `Chore` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `description` TINYTEXT NOT NULL,
  `collective_ID` int(11) NOT NULL,
  `status` boolean NOT NULL,
  `start_date` DATE NOT NULL,
  `frequency` int(11),
  `times_remaining` int(11),
  PRIMARY KEY (`ID`),
  FOREIGN KEY (`collective_ID`) 
        REFERENCES `Collective`(`ID`)
        ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;


DROP TABLE IF EXISTS `Overdue`;
CREATE TABLE `Overdue` (
  `user_ID` int(11) NOT NULL,
  `chore_ID` int(11) NOT NULL,
  `collective_ID` int(11) NOT NULL,
  PRIMARY KEY (`user_ID`,`chore_ID`,`collective_ID`),
  FOREIGN KEY (`user_ID`) 
        REFERENCES `User`(`ID`)
        ON DELETE CASCADE,
  FOREIGN KEY (`chore_ID`) 
        REFERENCES `Chore`(`ID`),
  FOREIGN KEY (`collective_ID`) 
        REFERENCES `Collective`(`ID`)
        ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;



DROP TABLE IF EXISTS `Member`;
CREATE TABLE `Member` (
  `name` VARCHAR(45) NOT NULL,
  `collective_ID` int(11) NOT NULL,
  PRIMARY KEY (`name`,`collective_ID`),
  FOREIGN KEY (`collective_ID`) 
        REFERENCES `Collective`(`ID`)
        ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;









