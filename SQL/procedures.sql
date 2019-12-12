-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ************************          USER          ***************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --

-- ************************************************* -- 
                -- PROCEDURE 1  NEW USER-- 
-- ************************************************* -- 

USE `CoClean`;
DELIMITER ::
DROP PROCEDURE IF EXISTS new_user::
CREATE PROCEDURE new_user(
    IN p_fname VARCHAR(45),
    IN p_sname VARCHAR(45),
    IN p_email VARCHAR(45),
    IN p_password VARCHAR(70),
    
    OUT p_message VARCHAR(150)
)

BEGIN
START TRANSACTION;   
    SET @userExists = 0;

    SELECT Count(*) 
    FROM `User`
    WHERE `email` = p_email INTO @userExists;
          

    IF @userExists > 0 THEN
            SELECT CONCAT('Email already in use.') INTO p_message;
    
    ELSEIF (p_email = '') THEN
            SELECT CONCAT('Email required.') INTO p_message;
   
    ELSEIF (p_password = '') THEN
            SELECT CONCAT('Password required.') INTO p_message;
    
    ELSEIF (p_fname = '') THEN
            SELECT CONCAT('First name required.') INTO p_message;
   
    ELSEIF (p_sname = '') THEN
            SELECT CONCAT('Surname required.') INTO p_message;
    
    ELSE
        INSERT INTO `User` (`name` , `surname`, `email`, `password`)  VALUES 
            (p_fname, 
            p_sname, 
            LOWER(p_email),
            p_password
        );
             
        SELECT CONCAT('User created!') INTO p_message;
    END IF;
            
COMMIT;
END ::
DELIMITER ;



-- ************************************************* -- 
            -- PROCEDURE 2 EDIT USER  -- 
-- ************************************************* -- 

USE `CoClean`;
DELIMITER ::
DROP PROCEDURE IF EXISTS edit_user::
CREATE PROCEDURE edit_user(
    IN p_ID INT(11),
    IN p_new_fname VARCHAR(45),
    IN p_new_sname VARCHAR(45),
    IN p_new_email VARCHAR(45),
    IN p_old_password VARCHAR(70),
    IN p_new_password VARCHAR(70),
    
    OUT p_message VARCHAR(150)

)

BEGIN
START TRANSACTION;
    SET @userExists = 0;
    SET @passwordCorrect = 0;
    SET @emailInUse = 0;

    SELECT Count(*) 
    FROM `User`
    WHERE `ID` = p_ID INTO @userExists;

    SELECT Count(*) 
    FROM `User`
    WHERE `email` = p_new_email INTO @emailInUse;
    
    SELECT Count(*) 
    FROM `User`
    WHERE `password` = p_old_password INTO @passwordCorrect;


    IF @userExists < 1 THEN
            SELECT CONCAT('User does not exist.') INTO p_message;
            
    ELSEIF (@passwordCorrect < 1) THEN
            SELECT CONCAT('Incorrect password.') INTO p_message;
    
    ELSEIF (@emailInUse > 0) THEN
            SELECT CONCAT('Email already in use.') INTO p_message;

    ELSEIF (p_new_email = '') THEN
            SELECT CONCAT('Email required.') INTO p_message;
   
    ELSEIF (p_old_password = '') THEN
            SELECT CONCAT('Password required.') INTO p_message;
    
    ELSEIF (p_new_password = '') THEN
            SELECT CONCAT('Password required.') INTO p_message;
    
    ELSEIF (p_new_fname = '') THEN
            SELECT CONCAT('First name required.') INTO p_message;
   
    ELSEIF (p_new_sname = '') THEN
            SELECT CONCAT('Surname required.') INTO p_message;
    
    ELSE    
        UPDATE `User`
        SET `email` = p_new_email,
            `name` = p_new_fname, 
            `surname` =  p_new_sname,
            `password` =  p_new_password
        WHERE `ID` = p_ID
        AND `password` = p_old_password;
        
        SELECT CONCAT('User updated!') INTO p_message;
    END IF;

COMMIT;
END ::
DELIMITER ;





-- ************************************************* -- 
                -- PROCEDURE 3 DELETE USER -- 
-- ************************************************* -- 
USE `CoClean`;
DELIMITER ::
DROP PROCEDURE IF EXISTS delete_user::
CREATE PROCEDURE delete_user(
    IN p_ID VARCHAR(60),
    IN p_password VARCHAR(140),
    
    OUT p_message VARCHAR(150)
)

BEGIN
START TRANSACTION;
    SET @UserPW_TEMP = '';
    SET @Userexists = 0;

    Select `password`
    FROM `User`
    WHERE p_ID = `ID` INTO @UserPW_TEMP;
    
    Select Count(*)
    FROM `User`
    WHERE p_ID = `ID` INTO @Userexists;

    IF (@Userexists < 1) THEN
         SELECT CONCAT('User does not exist!') INTO p_message;
    
    ELSEIF (@UserPW_TEMP = p_password) THEN
        DELETE FROM `User`
        WHERE `ID` = p_ID;
        
        SELECT CONCAT('User deleted!') INTO p_message;
    ELSE
        SELECT CONCAT('Wrong password!') INTO p_message;
    END IF;
  
COMMIT;
END ::
DELIMITER ;




-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ************************       COLLECTIVE       ***************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --




-- ************************************************* -- 
         -- PROCEDURE 4 NEW COLLECTIVE-- 
-- ************************************************* -- 
USE `CoClean`;
DELIMITER ::
DROP PROCEDURE IF EXISTS new_collective::
CREATE PROCEDURE new_collective(
    IN p_name VARCHAR(45),
    IN p_desc TINYTEXT,
    IN p_school VARCHAR(70),
    IN p_ID INT(11),
    
    OUT p_message VARCHAR(150)
)

BEGIN
START TRANSACTION;   
    SET @userExists = 0;
    SET @collectiveExists = 0;
    

    SELECT Count(*) INTO @userExists
    FROM `User`
    WHERE `ID` = p_ID;

    SELECT Count(*) INTO @collectiveExists
    FROM `Collective`
    WHERE `name` = p_name;
          

    IF @userExists < 1 THEN
            SELECT CONCAT('User does not exist.') INTO p_message;

    ELSEIF @collectiveExists > 0 THEN
            SELECT CONCAT('Name already taken.') INTO p_message;
    
    ELSEIF (p_name = '') THEN
            SELECT CONCAT('Name required.') INTO p_message;
    
    ELSE
        INSERT INTO `Collective` (`name`, `key`, `description`, `school`, `admin_user`, `onduty_user`) VALUES 
            (p_name, 
            SHA1(NOW()),
            p_desc,
            p_school,
            p_ID,
            p_ID
        );
             
        SELECT CONCAT('Collective created!') INTO p_message;
    END IF;
            
COMMIT;
END ::
DELIMITER ;


-- ************************************************* -- 
            -- PROCEDURE 5 CRUD Collective -- 
-- ************************************************* -- 
USE `CoClean`;
DELIMITER ::
DROP PROCEDURE IF EXISTS edit_collective::
CREATE PROCEDURE edit_collective(
    IN p_ID INT(11),
    IN p_new_name VARCHAR(45),
    IN p_new_desc TINYTEXT,
    IN p_new_school VARCHAR(70),
    
    OUT p_message VARCHAR(150)

)

BEGIN
START TRANSACTION;
    SET @collectiveExists = 0;
    SET @nameTaken = 0;

    SELECT Count(*) INTO @collectiveExists
    FROM `Collective`
    WHERE `ID` = p_ID;

    SELECT Count(*) INTO @nameTaken
    FROM `Collective`
    WHERE `name` = p_new_name;

    IF @collectiveExists < 1 THEN
            SELECT CONCAT('Collective does not exist.') INTO p_message;
    
    ELSEIF (@nameTaken > 0) THEN
            SELECT CONCAT('Name already taken.') INTO p_message;            

    ELSEIF (p_new_name = '') THEN
            SELECT CONCAT('Name required.') INTO p_message;
    
    ELSE
        UPDATE `Collective`
        SET
            `name` = p_new_name,
            `description` = p_new_desc,
            `school` = p_new_school
        WHERE `ID` = p_ID;
        
        SELECT CONCAT('Collective updated!') INTO p_message;
    END IF;

COMMIT;
END ::
DELIMITER ;






-- ************************************************* -- 
        -- PROCEDURE 6 DELETE COLLECTIVE -- 
-- ************************************************* -- 
USE `CoClean`;
DELIMITER ::
DROP PROCEDURE IF EXISTS delete_collective::
CREATE PROCEDURE delete_collective(
    IN p_ID INT(11),
    
    OUT p_message VARCHAR(150)
)

BEGIN
START TRANSACTION;
    SET @collectiveExists = 0;

    SELECT Count(*) INTO @collectiveExists
    FROM `Collective`
    WHERE `ID` = p_ID;



    IF (@collectiveExists > 0) THEN
        DELETE FROM `Collective`
        WHERE `ID` = p_ID;
        SELECT CONCAT('Collective deleted!') INTO p_message;
    ELSE
        SELECT CONCAT('Collective does not exist.') INTO p_message;
    END IF;
  
COMMIT;
END ::
DELIMITER ;





-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ************************          CHORE         ***************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --





-- ************************************************* -- 
         -- PROCEDURE 7 NEW CHORE-- 
-- ************************************************* -- 

USE `CoClean`;
DELIMITER ::
DROP PROCEDURE IF EXISTS new_chore::
CREATE PROCEDURE new_chore(
    IN p_coll_ID INT(11),
    IN p_title VARCHAR(45),
    IN p_desc TINYTEXT,
    IN p_frequency INT(11),
    
    OUT p_message VARCHAR(150)
)

BEGIN
START TRANSACTION;   
    SET @collectiveExists = 0;
    SET @defaultFreq = 1;

    SELECT Count(*) 
    FROM `Collective`
    WHERE `ID` = p_coll_ID INTO @collectiveExists;
          

    IF (@collectiveExists < 1) THEN
            SELECT CONCAT('Collective does not exist.') INTO p_message;

    ELSEIF (p_title = '')  THEN
            SELECT CONCAT('Title required.') INTO p_message;
    
    ELSEIF (p_frequency > 0) THEN
            SET @defaultFreq = p_frequency;
        
            INSERT INTO `Chore` (`title`, `description`, `collective_ID`, `completed`, `frequency`, `times_completed`)  VALUES 
                (p_title, 
                 p_desc,
                 p_coll_ID,
                 0,
                 @defaultFreq,
                 0
                
            );
             
            SELECT CONCAT('Chore created!') INTO p_message;
    END IF;
            
COMMIT;
END ::
DELIMITER ;





-- ************************************************* -- 
            -- PROCEDURE 8 CRUD Chore -- 
-- ************************************************* -- 
USE `CoClean`;
DELIMITER ::
DROP PROCEDURE IF EXISTS edit_chore::
CREATE PROCEDURE edit_chore(
    IN p_chore_ID INT(11),
    IN p_new_title VARCHAR(45),
    IN p_new_desc TINYTEXT,
    IN p_new_freq INT(11),
    
    OUT p_message VARCHAR(150)

)

BEGIN
START TRANSACTION;
    SET @choreExists = 0;
    SET @defaultFreq = 1;

    SELECT Count(*) INTO @choreExists
    FROM `Chore`
    WHERE `ID` = p_chore_ID; 
    
    IF (p_new_freq > 0) THEN
            SET @defaultFreq = p_new_freq;
    END IF;
   
    IF (@choreExists < 1) THEN
            SELECT CONCAT('Chore does not exist.') INTO p_message;

    ELSEIF (p_new_desc = '') THEN
            SELECT CONCAT('Description required.') INTO p_message;
    
    ELSEIF (p_new_freq = NULL) THEN
            SELECT CONCAT('Frequency required.') INTO p_message;
            
    ELSE
        UPDATE `Chore`
        SET
            `title` = p_new_title,
            `description` = p_new_desc,
            `frequency` = @defaultFreq
        WHERE `ID` = p_chore_ID;
        
        SELECT CONCAT('Chore updated!') INTO p_message;
    END IF;
    


COMMIT;
END ::
DELIMITER ;



-- SELECT * FROM `User`;
-- SELECT * FROM `Collective`;
-- SELECT * FROM `Chore`;


-- ************************************************* -- 
        -- PROCEDURE 9 DELETE CHORE -- 
-- ************************************************* -- 
USE `CoClean`;
DELIMITER ::
DROP PROCEDURE IF EXISTS delete_chore::
CREATE PROCEDURE delete_chore(
    IN p_ID INT(11),
    
    OUT p_message VARCHAR(150)
)

BEGIN
START TRANSACTION;
    SET @choreExists = 0;

    SELECT Count(*) INTO @choreExists
    FROM `Chore`
    WHERE `ID` = p_ID; 

    IF  (@choreExists > 0) THEN
        DELETE FROM `Chore`
        WHERE `ID` = p_ID;
        SELECT CONCAT('Chore deleted!') INTO p_message;
    ELSE
        SELECT CONCAT('Chore does not exist!') INTO p_message;
    END IF;
  
COMMIT;
END ::
DELIMITER ;

-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ************************          MISC          ***************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --


-- ************************************************* -- 
       -- PROCEDURE 10 ADD USER TO COLL --
-- ************************************************* -- 
USE `CoClean`;
DELIMITER ::
DROP PROCEDURE IF EXISTS add_user_coll::
CREATE PROCEDURE add_user_coll(
    IN p_user_ID INT(11),
    IN p_coll_KEY VARCHAR(70),
    
    OUT p_message VARCHAR(150)
)

BEGIN
START TRANSACTION;
    SET @userExists = 0;
    SET @collExists = 0;
    SET @coll_ID_TEMP = 0;
    SET @userInCollective = 0;

    SELECT Count(*) INTO @userExists
    FROM `User`
    WHERE `ID` = p_user_ID;

    SELECT `ID` INTO @coll_ID_TEMP
    FROM `Collective`
    WHERE `key` = p_coll_KEY;

    SELECT Count(*) INTO @collExists
    FROM `Collective`
    WHERE `ID` = @coll_ID_TEMP; 
    
    SELECT Count(*) INTO @userInCollective
    FROM `user_in_collective`
    WHERE `user_ID` = p_user_ID
    AND `collective_ID` = @coll_ID_TEMP; 

    IF (@userExists < 1) THEN
        SELECT CONCAT('User does not exist!') INTO p_message;

    ELSEIF (@collExists < 1) THEN
        SELECT CONCAT('Collective does not exist!') INTO p_message;
    
    ELSEIF (@userInCollective > 0) THEN
        SELECT CONCAT('User already in collective.') INTO p_message;
    
    ELSE
        INSERT INTO `user_in_collective` (`user_ID`, `collective_ID`) VALUES
            (
                p_user_ID,
                @coll_ID_TEMP
            );
        SELECT CONCAT('User added to collective!') INTO p_message;
    END IF;
  
COMMIT;
END ::
DELIMITER ;






-- ************************************************* -- 
       -- PROCEDURE 11 DELETE USER FROM COLL --
-- ************************************************* -- 
USE `CoClean`;
DELIMITER ::
DROP PROCEDURE IF EXISTS delete_user_coll::
CREATE PROCEDURE delete_user_coll(
    IN p_user_ID INT(11),
    IN p_coll_ID INT(11),
    
    OUT p_message VARCHAR(150)
)

BEGIN
START TRANSACTION;
    SET @userExists = 0;
    SET @collExists = 0;
    SET @userInCollective = 0;
    SET @adminID = 0;

    SELECT Count(*) INTO @userExists
    FROM `User`
    WHERE `ID` = p_user_ID;

    SELECT Count(*) INTO @collExists
    FROM `Collective`
    WHERE `ID` = p_coll_ID;

    SELECT Count(*) INTO @userInCollective
    FROM `user_in_collective`
    WHERE `user_ID` = p_user_ID
    AND `collective_ID` = p_coll_ID; 

    SELECT `admin_user` INTO @adminID
    FROM `Collective` 
    WHERE `ID` = p_COLL_ID;

    IF(p_user_ID = @adminID) THEN
        SELECT CONCAT('Admin cannot leave collective, you must delete it.') INTO p_message;

    ELSEIF (@userExists < 1) THEN
        SELECT CONCAT('User does not exist!') INTO p_message;

    ELSEIF (@collExists < 1) THEN
        SELECT CONCAT('Collective does not exist!') INTO p_message;
    
    ELSEIF (@userInCollective < 1) THEN
        SELECT CONCAT('User not found in collective.') INTO p_message;
    ELSE
        DELETE FROM `user_in_collective`
        WHERE `user_ID` = p_user_ID
        AND `collective_ID` = p_coll_ID;
         SELECT CONCAT('User removed from collective.') INTO p_message;
    END IF;
  
COMMIT;
END ::
DELIMITER ;





-- ************************************************* -- 
        -- PROCEDURE 12 INCREMENT CHORE -- 
-- ************************************************* -- 

USE `CoClean`;
DELIMITER ::
DROP PROCEDURE IF EXISTS increment_chore::
CREATE PROCEDURE increment_chore(
    IN p_chore_ID INT(11),
    
    OUT p_message INT(2)

)

BEGIN
START TRANSACTION;
    SET @choreExists = 0;
    SET @timesCompleted = 0;
    SET @frequency = 0;
    SET @alreadyCompleted = 0;

    SELECT Count(*) INTO @choreExists
    FROM `Chore`
    WHERE `ID` = p_chore_ID; 
    
    SELECT `completed` INTO @alreadyCompleted
    FROM `Chore`
    WHERE `ID` = p_chore_ID; 
    
    SELECT `times_completed` INTO @timesCompleted
    FROM `Chore`
    WHERE `ID` = p_chore_ID; 
    
    SELECT `frequency` INTO @frequency
    FROM `Chore`
    WHERE `ID` = p_chore_ID; 
    
   
    IF (@choreExists < 1) THEN
            SELECT 0 INTO p_message;

    ELSEIF (@alreadyCompleted > 0) THEN
            SELECT 0 INTO p_message;
    
    ELSEIF (@timesCompleted = @frequency-1) THEN
            UPDATE `Chore`
        SET
            `times_completed` = `times_completed`+1,
            `completed` = 1
        WHERE `ID` = p_chore_ID;
        
        SELECT 1 INTO p_message;
            
    ELSE
        UPDATE `Chore`
        SET
            `times_completed` = `times_completed`+1
        WHERE `ID` = p_chore_ID;
        
        SELECT 1 INTO p_message;
    END IF;
    


COMMIT;
END ::
DELIMITER ;




-- ************************************************* -- 
                -- PROCEDURE 13 CALC OVERDUES -- 
-- ************************************************* -- 

USE `CoClean`;
DELIMITER ::
DROP PROCEDURE IF EXISTS calc_overdues::
CREATE PROCEDURE calc_overdues(
    
    OUT p_message INT(2)

)

BEGIN

    DECLARE chore_ID INT;
    DECLARE coll_ID INT;
    DECLARE onduty_ID INT;
    DECLARE done INT DEFAULT FALSE;

    DECLARE the_cursor CURSOR FOR
        SELECT
            C.`ID`,
            C.`collective_ID`,
            COL.`onduty_user`
        FROM
            `Chore` AS C, `Collective` AS COL
        WHERE
            C.`completed` = 0
            AND C.`collective_ID` = COL.`ID`;
            
            
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- OPEN CURSOR
    OPEN the_cursor;

        the_loop: LOOP
        
            FETCH the_cursor INTO chore_ID, coll_ID, onduty_ID;
            
            IF done THEN
                LEAVE the_loop;
            END IF;
            
            INSERT INTO
                `Overdue`
            VALUES
                (onduty_ID, chore_ID, coll_ID);
        
        END LOOP;

    -- CLOSE CURSOR
    CLOSE the_cursor;

    SET p_message = "Overdues created";
   
END ::
DELIMITER ;




-- ************************************************* -- 
              -- FUNCTION 1 FIND NEXT ONDUTY  -- 
-- ************************************************* -- 

USE `CoClean`;
DELIMITER ::
DROP FUNCTION IF EXISTS find_next::
CREATE FUNCTION find_next(
    p_coll_ID   INT(11)

)
RETURNS INT(5)
READS SQL DATA

BEGIN
    DECLARE result INT(5);
    
    SELECT
    CASE 
        WHEN C.`onduty_user` = MAX(UIC.`user_ID`) THEN MIN(UIC.`user_ID`)
        ELSE
            (SELECT `user_ID`
            FROM `user_in_collective`AS UIC2, `Collective` AS C2
            WHERE UIC2.`user_ID` > C2.`onduty_user`
            AND `collective_ID` = p_coll_ID
            AND UIC2.`collective_ID` = C2.`ID`
            LIMIT 1)
    END INTO result
    FROM `user_in_collective`AS UIC, `Collective` AS C
    WHERE UIC.`collective_ID` = p_coll_ID
    AND UIC.`collective_ID` = C.`ID`;

    RETURN result;
    
END ::
DELIMITER ;




