/*
  Warnings:

  - The values [Easy,Medium,Hard] on the enum `Difficulty` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Difficulty_new" AS ENUM ('EASY', 'MEDIUM', 'HARD');
ALTER TABLE "public"."Challenge" ALTER COLUMN "difficulty" TYPE "public"."Difficulty_new" USING ("difficulty"::text::"public"."Difficulty_new");
ALTER TYPE "public"."Difficulty" RENAME TO "Difficulty_old";
ALTER TYPE "public"."Difficulty_new" RENAME TO "Difficulty";
DROP TYPE "public"."Difficulty_old";
COMMIT;
