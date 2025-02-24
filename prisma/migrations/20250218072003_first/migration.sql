/*
  Warnings:

  - The primary key for the `histori_pelanggaran` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_penugasan` on the `histori_pelanggaran` table. All the data in the column will be lost.
  - The `id` column on the `histori_pelanggaran` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `penugasan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "histori_pelanggaran" DROP CONSTRAINT "id_penugasan";

-- DropForeignKey
ALTER TABLE "penugasan" DROP CONSTRAINT "id_bus";

-- DropForeignKey
ALTER TABLE "penugasan" DROP CONSTRAINT "id_pengemudi";

-- AlterTable
ALTER TABLE "histori_pelanggaran" DROP CONSTRAINT "histori_pelanggaran_pkey",
DROP COLUMN "id_penugasan",
ADD COLUMN     "id_rasberrypi" INTEGER,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "histori_pelanggaran_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "penugasan";

-- CreateTable
CREATE TABLE "raspberrypi" (
    "id" SERIAL NOT NULL,
    "id_pengemudi" UUID,
    "id_bus" UUID,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "raspberrypi_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "histori_pelanggaran" ADD CONSTRAINT "id_rasberrypi" FOREIGN KEY ("id_rasberrypi") REFERENCES "raspberrypi"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "raspberrypi" ADD CONSTRAINT "id_bus" FOREIGN KEY ("id_bus") REFERENCES "Bus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "raspberrypi" ADD CONSTRAINT "id_pengemudi" FOREIGN KEY ("id_pengemudi") REFERENCES "pengemudi"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
