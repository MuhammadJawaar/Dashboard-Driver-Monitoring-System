/*
  Warnings:

  - Added the required column `updatedAt` to the `Bus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `histori_pelanggaran` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `pengemudi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `penugasan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `supervisor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bus" ADD COLUMN     "updatedAt" TIMESTAMP(6) NOT NULL;

-- AlterTable
ALTER TABLE "histori_pelanggaran" ADD COLUMN     "updatedAt" TIMESTAMP(6) NOT NULL;

-- AlterTable
ALTER TABLE "pengemudi" ADD COLUMN     "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(6) NOT NULL;

-- AlterTable
ALTER TABLE "penugasan" ADD COLUMN     "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(6) NOT NULL;

-- AlterTable
ALTER TABLE "supervisor" ADD COLUMN     "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(6) NOT NULL;
