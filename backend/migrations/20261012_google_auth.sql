BEGIN;

ALTER TABLE "public"."user"
  ADD COLUMN IF NOT EXISTS "googleId" varchar;

ALTER TABLE "public"."user"
  ALTER COLUMN "password" DROP NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "IDX_user_googleId"
  ON "public"."user" ("googleId");

COMMIT;
