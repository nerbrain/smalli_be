-- DropForeignKey
ALTER TABLE "URL" DROP CONSTRAINT "URL_userId_fkey";

-- AlterTable
ALTER TABLE "URL" ALTER COLUMN "lifespan" SET DEFAULT NOW() + interval '1 year',
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "URL" ADD CONSTRAINT "URL_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;