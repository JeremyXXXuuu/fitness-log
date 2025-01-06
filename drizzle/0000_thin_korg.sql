CREATE TABLE `exercises` (
	`uuid` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`id` text,
	`name` text NOT NULL,
	`force` text,
	`level` text,
	`mechanic` text,
	`equipment` text,
	`primary_muscles` text,
	`secondary_muscles` text,
	`instructions` text,
	`category` text,
	`images` text,
	`updated_at` text NOT NULL,
	`is_user_created` integer DEFAULT 0,
	`is_synced` integer DEFAULT 0
);
--> statement-breakpoint
CREATE INDEX `id_idx` ON `exercises` (`id`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `exercises` (`name`);--> statement-breakpoint
CREATE INDEX `level_idx` ON `exercises` (`level`);--> statement-breakpoint
CREATE INDEX `category_idx` ON `exercises` (`category`);--> statement-breakpoint
CREATE INDEX `is_synced_idx` ON `exercises` (`is_synced`);--> statement-breakpoint
CREATE TABLE `users_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`server_id` text,
	`name` text NOT NULL,
	`age` integer NOT NULL,
	`email` text NOT NULL,
	`weight` real DEFAULT 0,
	`height` real DEFAULT 0,
	`body_fat_percentage` real DEFAULT 0,
	`activity_level` text DEFAULT 'Sedentary',
	`calorires_goal` real DEFAULT 0,
	`macros_goal` text,
	`extra` text,
	`auth` text,
	`oauth` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	`deleted_at` text,
	`is_synced` integer DEFAULT 0,
	`sync_version` integer DEFAULT 0
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_server_id_unique` ON `users_table` (`server_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_email_unique` ON `users_table` (`email`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `users_table` (`email`);--> statement-breakpoint
CREATE INDEX `name_age_idx` ON `users_table` (`name`,`age`);--> statement-breakpoint
CREATE INDEX `sync_idx` ON `users_table` (`is_synced`,`sync_version`);--> statement-breakpoint
CREATE INDEX `server_id_idx` ON `users_table` (`server_id`);--> statement-breakpoint
CREATE TABLE `workout_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`exercises` text NOT NULL,
	`notes` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	`deleted_at` text,
	`duration` integer DEFAULT 0,
	`is_synced` integer DEFAULT 0,
	`sync_version` integer DEFAULT 0
);
--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `workout_log` (`user_id`);