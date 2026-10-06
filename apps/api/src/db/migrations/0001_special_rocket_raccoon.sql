ALTER TABLE "courses" ADD COLUMN "category" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "badge" varchar(100);--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "is_featured" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "format" varchar(100);--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "cohort_cap" varchar(100);--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;