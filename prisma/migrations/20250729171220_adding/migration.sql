/*
  Warnings:

  - You are about to drop the column `correctOption` on the `QuizQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `questionText` on the `QuizQuestion` table. All the data in the column will be lost.
  - Added the required column `correct` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."QuizQuestion" DROP COLUMN "correctOption",
DROP COLUMN "questionText",
ADD COLUMN     "correct" TEXT NOT NULL,
ADD COLUMN     "question" TEXT NOT NULL;
