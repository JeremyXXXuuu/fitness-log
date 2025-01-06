PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_workout_log` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`user_id` text NOT NULL,
	`exercises` text NOT NULL,
	`notes` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text,
	`duration` integer DEFAULT 0 NOT NULL,
	`calendar_date` text NOT NULL,
	`is_synced` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_workout_log`("id", "name", "user_id", "exercises", "notes", "created_at", "updated_at", "deleted_at", "duration", "calendar_date", "is_synced") SELECT "id", "name", "user_id", "exercises", "notes", "created_at", "updated_at", "deleted_at", "duration", "calendar_date", "is_synced" FROM `workout_log`;--> statement-breakpoint
DROP TABLE `workout_log`;--> statement-breakpoint
ALTER TABLE `__new_workout_log` RENAME TO `workout_log`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `workout_log` (`user_id`);--> statement-breakpoint
CREATE INDEX `calendar_date_idx` ON `workout_log` (`calendar_date`);