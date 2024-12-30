CREATE TABLE `devices` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`device_id` text NOT NULL,
	`user_id` integer,
	`device_type` text NOT NULL,
	`last_sync` text DEFAULT (CURRENT_TIMESTAMP),
	`sync_token` text,
	FOREIGN KEY (`user_id`) REFERENCES `users_table`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `devices_device_id_unique` ON `devices` (`device_id`);--> statement-breakpoint
CREATE TABLE `sync_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`table_name` text NOT NULL,
	`record_id` integer NOT NULL,
	`operation` text NOT NULL,
	`sync_status` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`device_id` text,
	`error_message` text,
	FOREIGN KEY (`device_id`) REFERENCES `devices`(`device_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
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
	`sync_version` integer DEFAULT 0,
	`device_id` integer,
	FOREIGN KEY (`device_id`) REFERENCES `devices`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_server_id_unique` ON `users_table` (`server_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_email_unique` ON `users_table` (`email`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `users_table` (`email`);--> statement-breakpoint
CREATE INDEX `name_age_idx` ON `users_table` (`name`,`age`);--> statement-breakpoint
CREATE INDEX `sync_idx` ON `users_table` (`is_synced`,`sync_version`);--> statement-breakpoint
CREATE INDEX `server_id_idx` ON `users_table` (`server_id`);