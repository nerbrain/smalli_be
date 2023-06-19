-- AlterTable
ALTER TABLE "URL" ALTER COLUMN "lifespan" SET DEFAULT NOW() + interval '1 year';

-- CreateTable
CREATE TABLE "UrlAnalytic" (
    "id" TEXT NOT NULL,
    "url_id" TEXT NOT NULL,
    "clicked" INTEGER NOT NULL,

    CONSTRAINT "UrlAnalytic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UrlAnalytic_url_id_key" ON "UrlAnalytic"("url_id");

-- AddForeignKey
ALTER TABLE "UrlAnalytic" ADD CONSTRAINT "UrlAnalytic_url_id_fkey" FOREIGN KEY ("url_id") REFERENCES "URL"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
