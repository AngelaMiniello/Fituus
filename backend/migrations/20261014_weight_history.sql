BEGIN;
CREATE TABLE IF NOT EXISTS public.weight_entry (
  id SERIAL PRIMARY KEY,
  weight double precision NOT NULL CHECK (weight > 0 AND weight < 1000),
  "recordedAt" timestamptz NOT NULL DEFAULT now(),
  "userId" integer NOT NULL REFERENCES public."user"(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "IDX_weight_entry_user_date"
  ON public.weight_entry ("userId", "recordedAt", id);
-- Existing current weights become starting records dated when history begins.
INSERT INTO public.weight_entry (weight, "userId")
SELECT u.weight, u.id FROM public."user" u
WHERE u.weight > 0 AND u.weight < 1000
AND NOT EXISTS (SELECT 1 FROM public.weight_entry w WHERE w."userId" = u.id);
COMMIT;
