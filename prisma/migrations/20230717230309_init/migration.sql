/*
  Warnings:

  - You are about to drop the column `clicked` on the `UrlAnalytic` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "URL" ALTER COLUMN "lifespan" SET DEFAULT NOW() + interval '1 year';

-- AlterTable
ALTER TABLE "UrlAnalytic" DROP COLUMN "clicked",
ADD COLUMN     "user_agent" TEXT;
