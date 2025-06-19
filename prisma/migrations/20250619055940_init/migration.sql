-- DropForeignKey
ALTER TABLE "histori_pelanggaran" DROP CONSTRAINT "histori_pelanggaran_id_raspberrypi_fkey";

-- DropForeignKey
ALTER TABLE "raspberrypi" DROP CONSTRAINT "raspberrypi_id_bus_fkey";

-- DropForeignKey
ALTER TABLE "raspberrypi" DROP CONSTRAINT "raspberrypi_id_pengemudi_fkey";

-- AlterTable
ALTER TABLE "Bus" ADD COLUMN     "deletedAt" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "admin" ADD COLUMN     "deletedAt" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "histori_pelanggaran" ADD COLUMN     "merek_bus" VARCHAR,
ADD COLUMN     "nama_pengemudi" VARCHAR,
ADD COLUMN     "plat_bus" VARCHAR;

-- AlterTable
ALTER TABLE "pengemudi" ADD COLUMN     "deletedAt" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "raspberrypi" ADD COLUMN     "deletedAt" TIMESTAMP(6);

-- AddForeignKey
ALTER TABLE "raspberrypi" ADD CONSTRAINT "raspberrypi_id_bus_fkey" FOREIGN KEY ("id_bus") REFERENCES "Bus"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "raspberrypi" ADD CONSTRAINT "raspberrypi_id_pengemudi_fkey" FOREIGN KEY ("id_pengemudi") REFERENCES "pengemudi"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "histori_pelanggaran" ADD CONSTRAINT "histori_pelanggaran_id_raspberrypi_fkey" FOREIGN KEY ("id_raspberrypi") REFERENCES "raspberrypi"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
