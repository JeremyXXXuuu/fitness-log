PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_workout_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`exercises` text NOT NULL,
	`notes` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	`deleted_at` text,
	`duration` integer DEFAULT 0,
	`is_synced` integer DEFAULT 0
);
--> statement-breakpoint
INSERT INTO `__new_workout_log`("id", "user_id", "exercises", "notes", "created_at", "updated_at", "deleted_at", "duration", "is_synced") SELECT "id", "user_id", "exercises", "notes", "created_at", "updated_at", "deleted_at", "duration", "is_synced" FROM `workout_log`;--> statement-breakpoint
DROP TABLE `workout_log`;--> statement-breakpoint
ALTER TABLE `__new_workout_log` RENAME TO `workout_log`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `workout_log` (`user_id`);