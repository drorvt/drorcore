import {MigrationInterface, QueryRunner} from "typeorm";

export class PostRefactoring1594200418261 implements MigrationInterface {
    name = 'PostRefactoring1594200418261'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` DROP FOREIGN KEY `users_FK`");
        await queryRunner.query("ALTER TABLE `test` CHANGE `id` `id` int NOT NULL");
        await queryRunner.query("ALTER TABLE `test` DROP PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `test` DROP COLUMN `id`");
        await queryRunner.query("ALTER TABLE `test` ADD `id` int NOT NULL PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `test` DROP COLUMN `name`");
        await queryRunner.query("ALTER TABLE `test` ADD `name` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `test` DROP COLUMN `city`");
        await queryRunner.query("ALTER TABLE `test` ADD `city` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `test` DROP COLUMN `age`");
        await queryRunner.query("ALTER TABLE `test` ADD `age` int NOT NULL");
        await queryRunner.query("CREATE INDEX `users_FK` ON `users` (`shop_id`)");
        await queryRunner.query("ALTER TABLE `users` ADD CONSTRAINT `FK_39e0ab619d2865a101db749751a` FOREIGN KEY (`shop_id`) REFERENCES `shops`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` DROP FOREIGN KEY `FK_39e0ab619d2865a101db749751a`");
        await queryRunner.query("DROP INDEX `users_FK` ON `users`");
        await queryRunner.query("ALTER TABLE `test` DROP COLUMN `age`");
        await queryRunner.query("ALTER TABLE `test` ADD `age` varchar(7) NULL");
        await queryRunner.query("ALTER TABLE `test` DROP COLUMN `city`");
        await queryRunner.query("ALTER TABLE `test` ADD `city` varchar(32) NULL");
        await queryRunner.query("ALTER TABLE `test` DROP COLUMN `name`");
        await queryRunner.query("ALTER TABLE `test` ADD `name` varchar(32) NOT NULL");
        await queryRunner.query("ALTER TABLE `test` DROP COLUMN `id`");
        await queryRunner.query("ALTER TABLE `test` ADD `id` int NOT NULL AUTO_INCREMENT");
        await queryRunner.query("ALTER TABLE `test` ADD PRIMARY KEY (`id`)");
        await queryRunner.query("ALTER TABLE `test` CHANGE `id` `id` int NOT NULL AUTO_INCREMENT");
        await queryRunner.query("ALTER TABLE `users` ADD CONSTRAINT `users_FK` FOREIGN KEY (`shop_id`) REFERENCES `shops`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
