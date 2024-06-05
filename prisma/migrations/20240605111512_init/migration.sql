/*
  Warnings:

  - Added the required column `detail_id` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "detail_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Detail" (
    "id" SERIAL NOT NULL,
    "price" VARCHAR(10) NOT NULL,
    "description" TEXT NOT NULL,
    "color" VARCHAR(50) NOT NULL,

    CONSTRAINT "Detail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_detail_id_fkey" FOREIGN KEY ("detail_id") REFERENCES "Detail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
