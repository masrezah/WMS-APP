/*
  Warnings:

  - You are about to drop the column `name` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `TransactionLog` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `TransactionLog` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `TransactionLog` table. All the data in the column will be lost.
  - You are about to drop the column `layout` on the `Warehouse` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Warehouse` table. All the data in the column will be lost.
  - Added the required column `code_name` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_type` to the `TransactionLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `layout_type` to the `Warehouse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `warehouse_type` to the `Warehouse` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "InventoryBatch_location_id_idx";

-- DropIndex
DROP INDEX "Product_tenant_id_sku_key";

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "name",
ADD COLUMN     "code_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TransactionLog" DROP COLUMN "created_at",
DROP COLUMN "notes",
DROP COLUMN "type",
ADD COLUMN     "note" TEXT,
ADD COLUMN     "transaction_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "transaction_type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Warehouse" DROP COLUMN "layout",
DROP COLUMN "type",
ADD COLUMN     "layout_type" TEXT NOT NULL,
ADD COLUMN     "warehouse_type" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Location_warehouse_id_idx" ON "Location"("warehouse_id");

-- AddForeignKey
ALTER TABLE "TransactionLog" ADD CONSTRAINT "TransactionLog_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
