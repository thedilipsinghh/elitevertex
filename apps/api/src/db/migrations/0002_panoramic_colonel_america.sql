CREATE TYPE "public"."admin_role" AS ENUM('admin', 'editor');--> statement-breakpoint
CREATE TYPE "public"."page_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "mentors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"designation" varchar(255) NOT NULL,
	"bio" text NOT NULL,
	"quote" text,
	"profile_image" text,
	"experience" varchar(100),
	"specialization" varchar(255),
	"accreditation" varchar(255),
	"linkedin" varchar(255),
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "about_page" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"header_title" text,
	"header_subtitle" text,
	"paradigm_title" text,
	"paradigm_paragraph_1" text,
	"paradigm_paragraph_2" text,
	"paradigm_paragraph_3" text,
	"airtime_stat" varchar(50),
	"ratio_stat" varchar(50),
	"paradigm_image" text,
	"vision_title" text,
	"vision_body" text,
	"mission_title" text,
	"mission_body" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campuses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"city" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"address" text NOT NULL,
	"landmark" text,
	"metro_access" text,
	"parking_info" text,
	"map_url" text,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_id" uuid NOT NULL,
	"type" varchar(100) NOT NULL,
	"title" varchar(255),
	"is_visible" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"draft_content" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"published_content" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"meta_title" varchar(255),
	"meta_description" text,
	"status" "page_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "navigation_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"menu_id" uuid NOT NULL,
	"parent_id" uuid,
	"label" varchar(255) NOT NULL,
	"url" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"open_in_new_tab" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "navigation_menus" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"location" varchar(100) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "navigation_menus_location_unique" UNIQUE("location")
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"public_id" text,
	"filename" varchar(255),
	"mime_type" varchar(100),
	"size" integer,
	"width" integer,
	"height" integer,
	"alt" text,
	"caption" text,
	"folder" varchar(255) DEFAULT 'elitevertax/media' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_id" varchar(255),
	"admin_email" varchar(255),
	"action" varchar(100) NOT NULL,
	"entity" varchar(100) NOT NULL,
	"entity_id" text,
	"meta" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admins" ADD COLUMN "role" "admin_role" DEFAULT 'editor' NOT NULL;--> statement-breakpoint
ALTER TABLE "contact_messages" ADD COLUMN "program" varchar(255);--> statement-breakpoint
ALTER TABLE "contact_messages" ADD COLUMN "mode" varchar(50);--> statement-breakpoint
ALTER TABLE "website_settings" ADD COLUMN "hero_tagline" text;--> statement-breakpoint
ALTER TABLE "website_settings" ADD COLUMN "hero_title" text;--> statement-breakpoint
ALTER TABLE "website_settings" ADD COLUMN "hero_subtitle" text;--> statement-breakpoint
ALTER TABLE "website_settings" ADD COLUMN "hero_image" text;--> statement-breakpoint
ALTER TABLE "website_settings" ADD COLUMN "cta_title" text;--> statement-breakpoint
ALTER TABLE "website_settings" ADD COLUMN "cta_subtitle" text;--> statement-breakpoint
ALTER TABLE "website_settings" ADD COLUMN "whatsapp" varchar(100);--> statement-breakpoint
ALTER TABLE "website_settings" ADD COLUMN "working_hours" text;--> statement-breakpoint
ALTER TABLE "website_settings" ADD COLUMN "contact_title" text;--> statement-breakpoint
ALTER TABLE "website_settings" ADD COLUMN "contact_subtitle" text;--> statement-breakpoint
ALTER TABLE "website_settings" ADD COLUMN "contact_tagline" text;--> statement-breakpoint
ALTER TABLE "website_settings" ADD COLUMN "logo_url" text;--> statement-breakpoint
ALTER TABLE "website_settings" ADD COLUMN "favicon_url" text;--> statement-breakpoint
ALTER TABLE "website_settings" ADD COLUMN "linkedin_url" text;--> statement-breakpoint
ALTER TABLE "website_settings" ADD COLUMN "youtube_url" text;--> statement-breakpoint
ALTER TABLE "website_settings" ADD COLUMN "announcement_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "website_settings" ADD COLUMN "announcement_text" text;--> statement-breakpoint
ALTER TABLE "website_settings" ADD COLUMN "announcement_link" text;--> statement-breakpoint
ALTER TABLE "website_settings" ADD COLUMN "seo_meta_title" varchar(255);--> statement-breakpoint
ALTER TABLE "website_settings" ADD COLUMN "seo_meta_description" text;--> statement-breakpoint
ALTER TABLE "page_sections" ADD CONSTRAINT "page_sections_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_menu_id_navigation_menus_id_fk" FOREIGN KEY ("menu_id") REFERENCES "public"."navigation_menus"("id") ON DELETE cascade ON UPDATE no action;