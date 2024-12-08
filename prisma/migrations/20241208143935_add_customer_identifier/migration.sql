/*
  Warnings:

  - Added the required column `customerIdentifier` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "customerIdentifier" TEXT NOT NULL;
