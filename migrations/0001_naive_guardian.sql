ALTER TABLE "funds" ADD COLUMN "contribution_rate" numeric(5, 2) DEFAULT '100.00';--> statement-breakpoint
ALTER TABLE "funds" ADD COLUMN "interest_rate" numeric(4, 2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "funds" ADD COLUMN "approval_type" text DEFAULT 'quorum';--> statement-breakpoint
ALTER TABLE "funds" ADD COLUMN "minimum_quorum" integer DEFAULT 50;