/*
  Warnings:

  - You are about to drop the column `id_rasberrypi` on the `histori_pelanggaran` table. All the data in the column will be lost.
  - Made the column `email` on table `supervisor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `supervisor` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "histori_pelanggaran" DROP CONSTRAINT "id_rasberrypi";

-- DropForeignKey
ALTER TABLE "raspberrypi" DROP CONSTRAINT "id_bus";

-- DropForeignKey
ALTER TABLE "raspberrypi" DROP CONSTRAINT "id_pengemudi";

-- AlterTable
ALTER TABLE "histori_pelanggaran" DROP COLUMN "id_rasberrypi",
ADD COLUMN     "id_raspberrypi" INTEGER;

-- AlterTable
ALTER TABLE "supervisor" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "password" SET DEFAULT '';

-- AddForeignKey
ALTER TABLE "histori_pelanggaran" ADD CONSTRAINT "histori_pelanggaran_id_raspberrypi_fkey" FOREIGN KEY ("id_raspberrypi") REFERENCES "raspberrypi"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "raspberrypi" ADD CONSTRAINT "raspberrypi_id_bus_fkey" FOREIGN KEY ("id_bus") REFERENCES "Bus"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "raspberrypi" ADD CONSTRAINT "raspberrypi_id_pengemudi_fkey" FOREIGN KEY ("id_pengemudi") REFERENCES "pengemudi"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
