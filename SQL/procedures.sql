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
        -- PROCEDURE 1 NEW USER - TEST CALL -- 
-- ************************************************* -- 
USE `CoClean`;
SET @fname = 'Tester';
SET @sname= 'Testersen';
SET @email='test@test.com';
SET @upassword = 'test123321';

CALL new_user(
            @fname, 
            @sname,
            @email, 
            @upassword,
            @svar1);
            
Select @svar1;

-- SELECT * FROM `User`;
-- SELECT * FROM `Collective`;




-- ************************************************* -- 
            -- PROCEDURE 2 EDIT USER  -- 
-- ************************************************* -- 

USE `CoClean`;
DELIMITER ::
DROP PROCEDURE IF EXISTS edit_user::
CREATE PROCEDURE edit_user(
    IN p_fname VARCHAR(45),
    IN p_sname VARCHAR(45),
    IN p_email VARCHAR(45),
    IN p_password VARCHAR(70),
    
    OUT p_message VARCHAR(150)

)

BEGIN
START TRANSACTION;
    SET @userExists = 0;
    SET @userID_temp = 0;

    SELECT Count(*) 
    FROM `User`
    WHERE `email` = p_email INTO @userExists;


    IF @userExists < 1 THEN
            SELECT CONCAT('User does not exist.') INTO p_message;
    
    ELSEIF (p_email = '') THEN
            SELECT CONCAT('Email required.') INTO p_message;
   
    ELSEIF (p_password = '') THEN
            SELECT CONCAT('Password required.') INTO p_message;
    
    ELSEIF (p_fname = '') THEN
            SELECT CONCAT('First name required.') INTO p_message;
   
    ELSEIF (p_sname = '') THEN
            SELECT CONCAT('Surname required.') INTO p_message;
    
    ELSE
        SELECT `ID` 
        FROM `User` 
        WHERE `email` = p_email INTO @userID_temp;
        
        UPDATE `User`
        SET `email` = p_email,
            `name` = p_fname, 
            `surname` =  p_sname,
            `password` =  p_password
        WHERE `ID` = @userID_temp;
        
        SELECT CONCAT('User updated!') INTO p_message;
    END IF;

COMMIT;
END ::
DELIMITER ;

-- ************************************************* -- 
        -- PROCEDURE 2 EDIT USER TEST CALL -- 
-- ************************************************* -- 
USE `CoClean`;
SET @fname = 'Tester';
SET @sname= 'Testersen';
SET @email='test@test.com';
SET @upassword = 'test123321';

CALL edit_user(
            @fname, 
            @sname,
            @email, 
            @upassword,
            @svar1);
            
            
Select @svar1;

-- SELECT * FROM `User`;
-- SELECT * FROM `Collective`;


-- ************************************************* -- 
                -- PROCEDURE 3 DELETE USER -- 
-- ************************************************* -- 
USE `CoClean`;
DELIMITER ::
DROP PROCEDURE IF EXISTS delete_user::
CREATE PROCEDURE delete_user(
    IN p_email VARCHAR(60),
    IN p_password VARCHAR(140),
    
    OUT p_message VARCHAR(150)
)

BEGIN
START TRANSACTION;
    SET @UserID_TEMP = 0;
    SET @UserPW_TEMP = '';

    SELECT `ID`
    FROM `User`
    WHERE `email` = p_email INTO @UserID_TEMP;

    Select `password`
    FROM `User`
    WHERE @UserID_TEMP = `ID` INTO @UserPW_TEMP;

    IF @UserPW_TEMP = p_password THEN
        DELETE FROM `User`
        WHERE `email` = p_email AND `ID` = @UserID_TEMP;
        SELECT CONCAT('User deleted!') INTO p_message;
    ELSE
        SELECT CONCAT('Wrong password!') INTO p_message;
    END IF;
  
COMMIT;
END ::
DELIMITER ;


-- ************************************************* -- 
        -- PROCEDURE 3 DELETE USER TEST CALL -- 
-- ************************************************* -- 
USE `CoClean`;

SET @email='test@test.com';
SET @upassword = 'test123321';


CALL delete_user(
            @email, 
            @upassword,
            @svar1);     
            
Select @svar1;

-- SELECT * FROM `User`;
-- SELECT * FROM `Collective`;


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
    IN p_email VARCHAR(45),
    
    OUT p_message VARCHAR(150)
)

BEGIN
START TRANSACTION;   
    SET @userExists = 0;
    SET @collectiveExists = 0;
    SET @userID_temp = 0;

    SELECT `ID` INTO @userID_temp
    FROM `User`
    WHERE `email` = p_email;

    SELECT Count(*) 
    FROM `User`
    WHERE `ID` = @userID_temp INTO @userExists;

    SELECT Count(*) 
    FROM `Collective`
    WHERE `name` = p_name INTO @collectiveExists;
          

    IF @userExists < 1 THEN
            SELECT CONCAT('User does not exist.') INTO p_message;

    ELSEIF @collectiveExists > 0 THEN
            SELECT CONCAT('Name already taken.') INTO p_message;
    
    ELSEIF (p_name = '') THEN
            SELECT CONCAT('Name required.') INTO p_message;
   
    ELSE
        INSERT INTO `Collective` (`name`, `key`, `admin_user`, `onduty_user`)  VALUES 
            (p_name, 
            SHA1(NOW()),
            @userID_temp,
            @userID_temp
        );
             
        SELECT CONCAT('Collective created!') INTO p_message;
    END IF;
            
COMMIT;
END ::
DELIMITER ;

-- ************************************************* -- 
                -- PROCEDURE 4 TEST CALL -- 
-- ************************************************* -- 
USE `CoClean`;
SET @name = 'Tester';
SET @user='test@test.com';


CALL new_collective(
            @name,
            @user,
            @svar1);
            
Select @svar1;
-- SELECT * FROM `User`;
-- SELECT * FROM `Collective`;


-- ************************************************* -- 
            -- PROCEDURE 5 CRUD Collective -- 
-- ************************************************* -- 
USE `CoClean`;
DELIMITER ::
DROP PROCEDURE IF EXISTS edit_collective::
CREATE PROCEDURE edit_collective(
    IN p_name VARCHAR(45),
    IN p_email VARCHAR(45),
    IN p_password VARCHAR(140),
    
    OUT p_message VARCHAR(150)

)

BEGIN
START TRANSACTION;
    SET @userExists = 0;
    SET @userID_temp = 0;

    SELECT Count(*) 
    FROM `User`
    WHERE `email` = p_email INTO @userExists;


    IF @userExists < 1 THEN
            SELECT CONCAT('User does not exist.') INTO p_message;

    ELSEIF (p_name = '') THEN
            SELECT CONCAT('Name required.') INTO p_message;
    
    ELSE
        SELECT `ID` 
        FROM `User` 
        WHERE `email` = p_email INTO @userID_temp;
        
        UPDATE `Collective`
        SET
            `name` = p_name
        WHERE `admin_user` = @userID_temp;
        
        SELECT CONCAT('Collective updated!') INTO p_message;
    END IF;

COMMIT;
END ::
DELIMITER ;

-- ************************************************* -- 
            -- PROCEDURE 5 EDIT COLLECTIVE TEST CALL -- 
-- ************************************************* -- 
USE `CoClean`;
SET @name = 'NYTT NAVN';
SET @email='test@test.com';
SET @upassword = 'test123321';

CALL edit_collective(
            @name,
            @email, 
            @upassword,
            @svar1);
            
            
Select @svar1;

-- SELECT * FROM `User`;
-- SELECT * FROM `Collective`;




-- ************************************************* -- 
        -- PROCEDURE 6 DELETE COLLECTIVE -- 
-- ************************************************* -- 
USE `CoClean`;
DELIMITER ::
DROP PROCEDURE IF EXISTS delete_collective::
CREATE PROCEDURE delete_collective(
    IN p_email VARCHAR(45),
    IN p_password VARCHAR(140),
    IN p_name VARCHAR(45),
    
    OUT p_message VARCHAR(150)
)

BEGIN
START TRANSACTION;
    SET @UserID_TEMP = 0;
    SET @adminID = 0;
    SET @UserPW_TEMP = '';

    SELECT `ID` INTO @UserID_TEMP
    FROM `User`
    WHERE `email` = p_email;

    Select `password`  INTO @UserPW_TEMP
    FROM `User`
    WHERE @UserID_TEMP = `ID`;

    Select `admin_user` INTO @adminID
    FROM `Collective`
    WHERE p_name = `name`;



    IF  @UserID_TEMP = @adminID AND @UserPW_TEMP = p_password THEN
        DELETE FROM `Collective`
        WHERE `name` = p_name;
        SELECT CONCAT('Collective deleted!') INTO p_message;
    ELSE
        SELECT CONCAT('Wrong password/name!') INTO p_message;
    END IF;
  
COMMIT;
END ::
DELIMITER ;


-- ************************************************* -- 
        -- PROCEDURE 6 DELETE COLLETIVE TEST CALL -- 
-- ************************************************* -- 
USE `CoClean`;
SET @email='test@test.com';
SET @upassword = 'test123321';
SET @name = 'Tester';

CALL delete_collective(
            @email, 
            @upassword,
            @name,
            @svar1);     
            
Select @svar1;


-- SELECT * FROM `User`;
-- SELECT * FROM `Collective`;





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
    IN p_coll_name VARCHAR(45),
    IN p_title VARCHAR(45),
    IN p_desc TINYTEXT,
    IN p_startdate DATE,
    IN p_frequency INT(11),
    
    OUT p_message VARCHAR(150)
)

BEGIN
START TRANSACTION;   
    SET @collID_temp = 0;
    SET @collectiveExists = 0;


    SELECT `ID` INTO @collID_temp
    FROM `Collective`
    WHERE `name` = p_coll_name;

   
    SELECT Count(*) 
    FROM `Collective`
    WHERE `name` = p_coll_name INTO @collectiveExists;
          

    IF (@collectiveExists < 1) THEN
            SELECT CONCAT('Collective does not exist.') INTO p_message;

    ELSEIF (p_title = '')  THEN
            SELECT CONCAT('Title required.') INTO p_message;
    
    ELSEIF (p_desc = '') THEN
            SELECT CONCAT('Description required.') INTO p_message;

    ELSEIF (p_startdate = NULL) THEN
            SET p_startdate = CURDATE();
    
    ELSEIF (p_frequency = NULL) THEN
            SET p_frequency = 7;

    ELSE
        INSERT INTO `Chore` (`title`, `description`, `collective_ID`, `status`, `start_date`, `frequency`)  VALUES 
            (p_title, 
             p_desc,
             @collID_temp,
             0,
             p_startdate,
             p_frequency
            
        );
             
        SELECT CONCAT('Chore created!') INTO p_message;
    END IF;
            
COMMIT;
END ::
DELIMITER ;

-- ************************************************* -- 
                -- PROCEDURE 7 TEST CALL -- 
-- ************************************************* -- 
USE `CoClean`;
SET @collName = "Tester";
SET @desc = "TEST BRESKRIVELSE";
SET @title = "Støvsuge";
SET @startdate = '2019-08-08';
SET @freq = 9;

CALL new_chore(
            @collName,
            @title,
            @desc,
            @startdate,
            @freq,
            @svar1);
            
Select @svar1;
-- SELECT * FROM `User`;
-- SELECT * FROM `Collective`;
-- SELECT * FROM `Chore`;



-- ************************************************* -- 
            -- PROCEDURE 8 CRUD Chore -- 
-- ************************************************* -- 
USE `CoClean`;
DELIMITER ::
DROP PROCEDURE IF EXISTS edit_chore::
CREATE PROCEDURE edit_chore(
    IN p_coll_name VARCHAR(45),
    IN p_title VARCHAR(45),
    IN p_desc TINYTEXT,
    IN p_freq INT(11),
    
    OUT p_message VARCHAR(150)

)

BEGIN
START TRANSACTION;
    SET @collID_temp = 0;
    SET @choreID_temp = 0;
    SET @choreExists = 0;
    

    SELECT `ID` INTO @collID_temp
    FROM `Collective`
    WHERE `name` = p_coll_name;


    SELECT `ID` INTO @choreID_temp
    FROM `Chore`
    WHERE `title` = p_title
    AND `collective_ID` = @collID_temp;

    SELECT Count(*) INTO @choreExists
    FROM `Chore`
    WHERE `ID` = @choreID_temp; 
    
    IF (@choreExists < 1) THEN
            SELECT CONCAT('Chore does not exist.') INTO p_message;

    ELSEIF (p_desc = '') THEN
            SELECT CONCAT('Description required.') INTO p_message;
    
    ELSEIF (p_freq = NULL) THEN
            SELECT CONCAT('Frequency required.') INTO p_message;

    ELSE
        UPDATE `Chore`
        SET
            `description` = p_desc,
            `frequency` = p_freq
        WHERE `ID` = @choreID_temp;
        
        SELECT CONCAT('Chore updated!') INTO p_message;
    END IF;

COMMIT;
END ::
DELIMITER ;



USE `CoClean`;
SET @collname = 'Tester';
SET @title = 'Støvsuge';
SET @desc = 'NY BESKsdasdasdasdasdRIVELSE MAFAKKA';
SET @freq = 4;

CALL edit_chore(
            @collname,
            @title, 
            @desc,
            @freq,
            @svar1);
            
            
Select @svar1;


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
    IN p_coll_name VARCHAR(45),
    IN p_title VARCHAR(45),
    IN p_password VARCHAR(140),
    
    OUT p_message VARCHAR(150)
)

BEGIN
START TRANSACTION;
    SET @collID_temp = 0;
    SET @choreID_temp = 0;
    SET @choreExists = 0;
    

    SELECT `ID` INTO @collID_temp
    FROM `Collective`
    WHERE `name` = p_coll_name;


    SELECT `ID` INTO @choreID_temp
    FROM `Chore`
    WHERE `title` = p_title
    AND `collective_ID` = @collID_temp;

    SELECT Count(*) INTO @choreExists
    FROM `Chore`
    WHERE `ID` = @choreID_temp; 



    IF  (@choreExists > 0) THEN
        DELETE FROM `Chore`
        WHERE `title` = p_title
        AND `ID` = @choreID_temp;
        SELECT CONCAT('Chore deleted!') INTO p_message;
    ELSE
        SELECT CONCAT('Chore does not exist!') INTO p_message;
    END IF;
  
COMMIT;
END ::
DELIMITER ;


-- ************************************************* -- 
        -- PROCEDURE 9 DELETE CHORE TEST CALL -- 
-- ************************************************* -- 
USE `CoClean`;
SET @collName='Tester';
SET @title = 'Støvsuge';
SET @pw = 'test123321';

CALL delete_chore(
            @collName, 
            @title,
            @pw,
            @svar1);     
            
Select @svar1;


-- SELECT * FROM `User`;
-- SELECT * FROM `Collective`;
-- SELECT * FROM `Chore`;



-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ************************          MEMBER        ***************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --
-- ***************************************************************************** --


-- ************************************************* -- 
                -- PROCEDURE 10 new_member -- 
-- ************************************************* -- 

USE `CoClean`;
DELIMITER ::
DROP PROCEDURE IF EXISTS new_member::
CREATE PROCEDURE new_member(
    IN p_name VARCHAR(45),
    IN p_coll_name VARCHAR(45),
    
    OUT p_message VARCHAR(150)
)

BEGIN
START TRANSACTION;   
    SET @collectiveExists = 0;
    SET @coll_id_temp = -1;
    SET @memberExists = 0;


    SELECT `ID` INTO @coll_id_temp
    FROM `Collective`
    WHERE `name` = p_coll_name;

   
    SELECT Count(*) INTO @collectiveExists
    FROM `Collective`
    WHERE `name` = p_coll_name;
          
    SELECT Count(*) INTO @memberExists
    FROM `Member`
    WHERE `name` = p_name
    AND `collective_ID` = @coll_id_temp;

    IF (@collectiveExists < 1) THEN
            SELECT CONCAT('Collective does not exist.') INTO p_message;

    ELSEIF (@memberExists > 0)  THEN
            SELECT CONCAT('Name already taken.') INTO p_message;

    ELSEIF (p_name = '')  THEN
            SELECT CONCAT('Name required.') INTO p_message;
    
    ELSE
        INSERT INTO `Member` (`name`, `collective_ID`)  VALUES 
            (p_name, 
             @coll_id_temp
            );
             
        SELECT CONCAT('Member added!') INTO p_message;
    END IF;
            
COMMIT;
END ::
DELIMITER ;

-- ************************************************* -- 
                -- PROCEDURE 10 TEST CALL -- 
-- ************************************************* -- 
USE `CoClean`;
SET @name = "CollMember2";
SET @coll_name = "ISak";

CALL new_member(
            @name,
            @coll_name,
            @svar1);
            
Select @svar1;
-- SELECT * FROM `User`;
-- SELECT * FROM `Collective`;
-- SELECT * FROM `Chore`;
-- SELECT * FROM `Member`;



-- ************************************************* -- 
            -- PROCEDURE 11 CRUD Member -- 
-- ************************************************* -- 
USE `CoClean`;
DELIMITER ::
DROP PROCEDURE IF EXISTS edit_member::
CREATE PROCEDURE edit_member(
    IN p_name VARCHAR(45),
    IN p_coll_name VARCHAR(45),
    IN p_newname VARCHAR(45),
    
    OUT p_message VARCHAR(150)

)

BEGIN
START TRANSACTION;
    SET @collectiveExists = 0;
    SET @coll_id_temp = -1;
    SET @memberExists = 0;
    SET @nameTaken = 0;


    SELECT `ID` INTO @coll_id_temp
    FROM `Collective`
    WHERE `name` = p_coll_name;
   
    SELECT Count(*) INTO @collectiveExists
    FROM `Collective`
    WHERE `name` = p_coll_name;
          
    SELECT Count(*) INTO @memberExists
    FROM `Member`
    WHERE `name` = p_name
    AND `collective_ID` = @coll_id_temp;

    SELECT Count(*) INTO @nameTaken
    FROM `Member`
    WHERE `name` = p_newname
    AND `collective_ID` = @coll_id_temp;
    

    IF (@collectiveExists < 1) THEN
            SELECT CONCAT('Collective does not exist.') INTO p_message;

    ELSEIF (p_newname = '') THEN
            SELECT CONCAT('New name required.') INTO p_message;

    ELSEIF (p_name = '') THEN
            SELECT CONCAT('Name required.') INTO p_message;

    ELSEIF (@memberExists < 1) THEN
            SELECT CONCAT('User does not exist.') INTO p_message;
    
    ELSEIF (@nameTaken > 0) THEN
            SELECT CONCAT('Name already taken.') INTO p_message;

    ELSE
        UPDATE `Member`
        SET
            `name` = p_newname
        WHERE `name` = p_name
        AND `collective_ID` = @coll_id_temp;
        
        SELECT CONCAT('Member updated!') INTO p_message;
    END IF;

COMMIT;
END ::
DELIMITER ;

-- ************************************************* -- 
                -- PROCEDURE 11 TEST CALL -- 
-- ************************************************* -- 

USE `CoClean`;
SET @name = 'Collmember';
SET @collName = 'ISak';
SET @newname = 'NyttNavnBruker';

CALL edit_member(
            @name,
            @collname, 
            @newname,
            @svar1);
            
            
Select @svar1;


-- SELECT * FROM `User`;
-- SELECT * FROM `Collective`;
-- SELECT * FROM `Chore`;


-- ************************************************* -- 
        -- PROCEDURE 12 DELETE member -- 
-- ************************************************* -- 
USE `CoClean`;
DELIMITER ::
DROP PROCEDURE IF EXISTS delete_member::
CREATE PROCEDURE delete_member(
    IN p_name VARCHAR(45),
    IN p_coll_name VARCHAR(45),
    
    OUT p_message VARCHAR(150)
)

BEGIN
START TRANSACTION;
    SET @collectiveExists = 0;
    SET @coll_id_temp = -1;
    SET @memberExists = 0;


    SELECT `ID` INTO @coll_id_temp
    FROM `Collective`
    WHERE `name` = p_coll_name;
   
    SELECT Count(*) INTO @collectiveExists
    FROM `Collective`
    WHERE `name` = p_coll_name;
          
    SELECT Count(*) INTO @memberExists
    FROM `Member`
    WHERE `name` = p_name
    AND `collective_ID` = @coll_id_temp;
    

    IF (@collectiveExists < 1) THEN
            SELECT CONCAT('Collective does not exist.') INTO p_message;

    ELSEIF (p_name = '') THEN
            SELECT CONCAT('New name required.') INTO p_message;

    ELSEIF  (@memberExists > 0) THEN
        DELETE FROM `Member`
        WHERE `name` = p_name
        AND `collective_ID` = @coll_id_temp;
        SELECT CONCAT('Member deleted!') INTO p_message;
    ELSE
        SELECT CONCAT('Member does not exist!') INTO p_message;
    END IF;
  
COMMIT;
END ::
DELIMITER ;


-- ************************************************* -- 
        -- PROCEDURE 12 DELETE Member TEST CALL -- 
-- ************************************************* -- 
USE `CoClean`;
SET @name='CollMember2';
SET @collname = 'ISak';

CALL delete_member(
            @name, 
            @collname,
            @svar1);     
            
Select @svar1;



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


-- event for å refreshe chores hver mandag


-- set chore til å være ferdig
    -- samme prosedyre må også telle ned først
    -- om det er mer enn 0 "times_remaining" 
    -- skal den dekrementere, hvis den er 0 sett status ferdig.

-- calculate overdues
    -- hver mandag sjekk om noen chores ikke er complete
    -- insert into overdues
        -- chore ID/title
        -- userID/name

-- event for å sette ny on duty
    -- hver mandag
    -- 













