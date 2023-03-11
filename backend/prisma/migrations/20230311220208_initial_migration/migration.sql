-- CreateTable
CREATE TABLE `User` (
    `user_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(32) NOT NULL,
    `total_score` INTEGER NOT NULL DEFAULT 0,
    `hashed_pass` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `User_name_key`(`name`),
    INDEX `fk_users_name`(`name`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Win` (
    `win_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(32) NOT NULL,
    `date` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `difficulty` ENUM('very easy', 'easy', 'medium', 'hard', 'very hard') NOT NULL,
    `score` INTEGER NOT NULL,
    `duration` INTEGER NULL,
    `errors` INTEGER NOT NULL,

    INDEX `fk_users_name`(`name`),
    PRIMARY KEY (`win_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Win` ADD CONSTRAINT `fk_users_name` FOREIGN KEY (`name`) REFERENCES `User`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;
