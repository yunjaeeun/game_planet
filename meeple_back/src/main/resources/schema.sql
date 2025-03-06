use game_project;

CREATE TABLE `tbl_user` (
                            `user_id`	BIGINT	NOT NULL primary key AUTO_INCREMENT,
                            `user_name`	BIGINT	NOT NULL ,
                            `user_email`	BIGINT	NOT NULL UNIQUE ,
                            `user_password`	VARCHAR(255)	NOT NULL,
                            `user_birthday`	DATE	NOT NULL,
                            `user_nickname`	VARCHAR(50)	NOT NULL,
                            `user_profile_picture_url`	VARCHAR(500)	NULL,
                            `user_tier`	VARCHAR(20)	NULL,
                            `user_level`	INT	NULL,
                            `user_created_at`	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            `user_updated_at`	TIMESTAMP	NULL,
                            `user_deleted_at`	TIMESTAMP	NULL

);