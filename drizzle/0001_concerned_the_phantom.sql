ALTER TABLE "recommendation" ADD COLUMN "lat" double precision NOT NULL;--> statement-breakpoint
ALTER TABLE "recommendation" ADD COLUMN "lon" double precision NOT NULL;--> statement-breakpoint
ALTER TABLE "recommendation" DROP COLUMN "x";--> statement-breakpoint
ALTER TABLE "recommendation" DROP COLUMN "y";