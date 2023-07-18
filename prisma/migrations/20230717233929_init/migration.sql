-- AlterTable
ALTER TABLE "URL" ALTER COLUMN "lifespan" SET DEFAULT NOW() + interval '1 year';
