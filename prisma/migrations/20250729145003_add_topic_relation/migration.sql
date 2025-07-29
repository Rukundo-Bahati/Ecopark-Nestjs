/*
  Warnings:

  - Added the required column `color` to the `Mission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Mission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `Mission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `explanation` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `available` to the `Reward` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Reward` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stars` to the `UserQuizAttempt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Group" ADD COLUMN     "activity" TEXT,
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "recentActivity" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."GroupMember" ADD COLUMN     "unreadMessages" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."Mission" ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "duration" TEXT NOT NULL,
ADD COLUMN     "icon" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."QuizQuestion" ADD COLUMN     "explanation" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Reward" ADD COLUMN     "available" BOOLEAN NOT NULL,
ADD COLUMN     "category" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."UserQuizAttempt" ADD COLUMN     "stars" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."Topic" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "lessons" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserTopicProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "progress" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserTopicProgress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."UserTopicProgress" ADD CONSTRAINT "UserTopicProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserTopicProgress" ADD CONSTRAINT "UserTopicProgress_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
