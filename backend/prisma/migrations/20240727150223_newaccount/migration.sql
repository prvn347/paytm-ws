/*
  Warnings:

  - You are about to drop the `Balence` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `Merchant` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Balence" DROP CONSTRAINT "Balence_userId_fkey";

-- DropTable
DROP TABLE "Balence";

-- CreateTable
CREATE TABLE "UserBalence" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "locked" INTEGER NOT NULL,

    CONSTRAINT "UserBalence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MerchantBalence" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "locked" INTEGER NOT NULL,

    CONSTRAINT "MerchantBalence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserBalence_userId_key" ON "UserBalence"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MerchantBalence_userId_key" ON "MerchantBalence"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_id_key" ON "Merchant"("id");

-- AddForeignKey
ALTER TABLE "UserBalence" ADD CONSTRAINT "UserBalence_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantBalence" ADD CONSTRAINT "MerchantBalence_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
