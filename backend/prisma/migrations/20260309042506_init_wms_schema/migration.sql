/*
  Warnings:

  - You are about to drop the column `code_name` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `TransactionLog` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_date` on the `TransactionLog` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_type` on the `TransactionLog` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `warehouse_type` on the `Warehouse` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tenant_id,sku]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `category` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `type` to the `TransactionLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'TENANT_ADMIN', 'PURCHASING', 'RESOURCES', 'WAREHOUSE_OPERATOR', 'FINANCE', 'PRODUCTION', 'SHIPMENT');

-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('RAW_MATERIAL', 'WIP', 'SUPPLY', 'PACKAGING_MATERIAL', 'FINISHED_GOOD', 'FINISHED_PART');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INBOUND', 'OUTBOUND', 'ADJUSTMENT');

-- DropIndex
DROP INDEX "Location_warehouse_id_idx";

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "code_name",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" "ProductCategory" NOT NULL;

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "TransactionLog" DROP COLUMN "note",
DROP COLUMN "transaction_date",
DROP COLUMN "transaction_type",
ADD COLUMN     "batch_id" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "type" "TransactionType" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'WAREHOUSE_OPERATOR';

-- AlterTable
ALTER TABLE "Warehouse" DROP COLUMN "warehouse_type",
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'Private',
ALTER COLUMN "layout_type" SET DEFAULT 'Garis Lurus Sederhana';

-- CreateIndex
CREATE UNIQUE INDEX "Product_tenant_id_sku_key" ON "Product"("tenant_id", "sku");

-- CreateIndex
CREATE INDEX "TransactionLog_product_id_idx" ON "TransactionLog"("product_id");

-- AddForeignKey
ALTER TABLE "TransactionLog" ADD CONSTRAINT "TransactionLog_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "InventoryBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;
