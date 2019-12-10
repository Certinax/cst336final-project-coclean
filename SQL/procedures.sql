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
        -- PROCEDURE 2 EDIT USER TEST CALL -- 
-- ************************************************* -- 
USE `CoClean`;
SET @p_ID = 7;
SET @p_fname = 'BarexxTest';
SET @p_sname= 'BarexxTest';
SET @p_email='BareTxxest@test.com';
SET @p_new_upassword = 'test123321';
SET @p_old_upassword = 'lol123321';

CALL edit_user(
            @p_ID,
            @p_fname,
            @p_sname,
            @p_email, 
            @p_old_upassword,
            @p_new_upassword,
            @svar1);
            
         
Select @svar1;


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


-- ************************************************* -- 
        -- PROCEDURE 3 DELETE USER TEST CALL -- 
-- ************************************************* -- 
USE `CoClean`;

SET @ID= 5;
SET @upassword = 'd';


CALL delete_user(
            @ID, 
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
                -- PROCEDURE 4 TEST CALL -- 
-- ************************************************* -- 
USE `CoClean`;
SET @p_name = 'Napa2014';
SET @p_desc = 'fy faen og kaoooos shallabais';
SET @p_ID = 1;
SET @p_school = 'Livets Skole';


CALL new_collective(
            @p_name,
            @p_desc,
            @p_school,
            @p_ID,
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
            -- PROCEDURE 5 EDIT COLLECTIVE TEST CALL -- 
-- ************************************************* -- 
USE `CoClean`;
SET @ID = 1;
SET @name='asd';
SET @desc = 'asd';
SET @school = 'asd';

CALL edit_collective(
            @ID,
            @name, 
            @desc,
            @School,
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


-- ************************************************* -- 
        -- PROCEDURE 6 DELETE COLLETIVE TEST CALL -- 
-- ************************************************* -- 
USE `CoClean`;
SET @ID= 1;


CALL delete_collective(
            @ID,
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
            SET @defaultFreq = p_freq;
           

    ELSE
        INSERT INTO `Chore` (`title`, `description`, `collective_ID`, `status`, `frequency`)  VALUES 
            (p_title, 
             p_desc,
             p_coll_ID,
             0,
             @defaultFreq
            
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
SET @collID = 2;
SET @title = "Støascccdasdvsuge";
SET @desc = "TEST BRESxxx2222xxKRIVELSE";
SET @freq = -1;

CALL new_chore(
            @collID,
            @title,
            @desc,
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

-- ************************************************* -- 
                -- PROCEDURE 8 TEST CALL -- 
-- ************************************************* -- 

USE `CoClean`;
SET @ID = 3;
SET @title = 'KUKsuge';
SET @desc = 'NY BESKsdasdasdasdasdRIVELSE MAFAKKA';
SET @freq = 10;

CALL edit_chore(
            @ID,
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


-- ************************************************* -- 
        -- PROCEDURE 9 DELETE CHORE TEST CALL -- 
-- ************************************************* -- 
USE `CoClean`;
SET @ID = 3;

CALL delete_chore(
            @ID,
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

-- calculate overdues (event)
    -- hver mandag sjekk om noen chores ikke er complete
    -- insert into overdues
        -- chore ID/title
        -- userID/name

-- event for å sette ny on duty
    -- hver mandag
    -- 

-- add user to collective with the collective key

-- lage koblingstabell

-- slette member

-- gå over alle create/CRUD procedures og sørg for at det ikke ekstisterer
-- fra før av, altså kun 1 chore med samme tittel
    -- en bruker med samme email
    -- et collective med samme navn
    -- 


    -- FERDIG MED USER
    -- FERDIG MED COLLECTIVE
    -- 



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

    SELECT Count(*) INTO @userExists
    FROM `User`
    WHERE `ID` = p_user_ID;

    SELECT `ID` INTO @coll_ID_TEMP
    FROM `Collective`
    WHERE `key` = p_coll_KEY;

    SELECT Count(*) INTO @collExists
    FROM `Collective`
    WHERE `ID` = @coll_ID_TEMP; 

    IF (@userExists < 1) THEN
        SELECT CONCAT('User does not exist!') INTO p_message;

    ELSEIF (@collExists < 1) THEN
        SELECT CONCAT('Collective does not exist!') INTO p_message;
    
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
        -- PROCEDURE 10 DELETE CHORE TEST CALL -- 
-- ************************************************* -- 
USE `CoClean`;
SET @user_ID = 1;
SET @coll_key = '804040170501dccb8479fcb835e1da1956870655';

CALL add_user_coll(
            @user_ID,
            @coll_key,
            @svar1);     
            
Select @svar1;


-- ************************************************* -- 
       -- PROCEDURE 11 DELETE USER FROM COLL --
-- ************************************************* -- 
USE `CoClean`;
DELIMITER ::
DROP PROCEDURE IF EXISTS add_user_coll::
CREATE PROCEDURE add_user_coll(
    IN p_user_ID INT(11),
    IN p_coll_ID,
    
    OUT p_message VARCHAR(150)
)

BEGIN
START TRANSACTION;
    SET @userExists = 0;
    SET @collExists = 0;
    SET @userInCollective = 0;

    SELECT Count(*) INTO @userExists
    FROM `user_in_collective`
    WHERE `ID` = p_user_ID;

    SELECT Count(*) INTO @userExists
    FROM `User`
    WHERE `ID` = p_user_ID;

    SELECT Count(*) INTO @collExists
    FROM `Coll`
    WHERE `ID` = @coll_ID_TEMP; 

    IF (@userExists@ < 1) THEN
        SELECT CONCAT('User does not exist!') INTO p_message;

    ELSEIF (@collExists < 1) THEN
        SELECT CONCAT('Collective does not exist!') INTO p_message;
    
    ELSEIF (@userInCollective < 1) THEN
        SELECT CONCAT('User not found in collective.') INTO p_message;
    ELSE
        DELETE FROM `user_in_collective`
        WHERE `user_ID` = p_user_ID
        AND `collective_ID` = p_coll_ID;
    END IF;
  
COMMIT;
END ::
DELIMITER ;


-- ************************************************* -- 
              -- PROCEDURE 11 TEST -- 
-- ************************************************* -- 
USE `CoClean`;
SET @user_ID = 3;
SET @coll_key = "";

CALL add_user_coll(
            @ID,
            @svar1);     
            
Select @svar1;
