

-- ************************************************* -- 
         -- EVENT 1 FIND SET NEXT ON DUTY  -- 
-- ************************************************* -- 

USE `CoClean`;
DELIMITER ::
DROP EVENT IF EXISTS update_onduty;
CREATE EVENT update_onduty 
	ON SCHEDULE EVERY 5 HOUR STARTS NOW()
    DO BEGIN
    
        UPDATE `Collective`, `user_in_collective`
        SET `onduty_user` = find_next(`Collective`.`ID`)
        WHERE `Collective`.`ID` = `collective_ID`;

		CALL calc_overdues(
		            @svar1);

        UPDATE `Chore` 
		SET `times_completed` = 0,
		`completed` = 0;
        
    END::
DELIMITER ;



