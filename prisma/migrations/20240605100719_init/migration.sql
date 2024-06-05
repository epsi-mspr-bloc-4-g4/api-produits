-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "stock" INTEGER NOT NULL,
    "detail_id" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

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
