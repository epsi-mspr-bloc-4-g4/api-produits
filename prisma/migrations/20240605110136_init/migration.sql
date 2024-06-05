/*
  Warnings:

  - You are about to drop the column `detail_id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Detail` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `color` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_detail_id_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "detail_id",
ADD COLUMN     "color" VARCHAR(50) NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "price" VARCHAR(10) NOT NULL;

-- DropTable
DROP TABLE "Detail";
