/*
  Warnings:

  - You are about to drop the column `nomor_telepn` on the `pengemudi` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "pengemudi" DROP COLUMN "nomor_telepn",
ADD COLUMN     "nomor_telepon" VARCHAR;
