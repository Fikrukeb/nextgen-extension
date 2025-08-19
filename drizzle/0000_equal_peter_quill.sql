CREATE TABLE "recommendation" (
	"id" serial PRIMARY KEY NOT NULL,
	"crop" varchar(255) NOT NULL,
	"fertilizer_type" varchar(255) NOT NULL,
	"value" double precision,
	"location" geometry(point) NOT NULL,
	"region" varchar(255) NOT NULL,
	"zone" varchar(255) NOT NULL,
	"woreda" varchar(255) NOT NULL,
	"kebebe" varchar(255) NOT NULL,
	"x" integer,
	"y" integer,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE INDEX "spatial_index" ON "recommendation" USING gist ("location");