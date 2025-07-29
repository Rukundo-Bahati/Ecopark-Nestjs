-- AlterTable
ALTER TABLE "public"."Mission" ALTER COLUMN "color" DROP NOT NULL,
ALTER COLUMN "color" SET DEFAULT '#3b9ff6';

-- AlterTable
ALTER TABLE "public"."Reward" ALTER COLUMN "available" DROP NOT NULL,
ALTER COLUMN "available" SET DEFAULT true;

-- AlterTable
ALTER TABLE "public"."Topic" ALTER COLUMN "icon" DROP NOT NULL,
ALTER COLUMN "icon" SET DEFAULT '#ef4444';
