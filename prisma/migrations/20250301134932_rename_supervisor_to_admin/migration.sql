-- CreateTable
CREATE TABLE "Bus" (
    "id" UUID NOT NULL,
    "plat_bus" VARCHAR NOT NULL,
    "merek" VARCHAR,
    "kapasitas" INTEGER,
    "tahun_pembuatan" INTEGER,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Bus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "histori_pelanggaran" (
    "id" SERIAL NOT NULL,
    "waktu_pelanggaran" TIMESTAMP(6) NOT NULL,
    "jenis_pelanggaran" VARCHAR NOT NULL,
    "id_raspberrypi" INTEGER,
    "image" VARCHAR,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "histori_pelanggaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pengemudi" (
    "id" UUID NOT NULL,
    "nama" VARCHAR,
    "alamat" VARCHAR,
    "nomor_telepon" VARCHAR,
    "tanggal_lahir" DATE,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "pengemudi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raspberrypi" (
    "id" SERIAL NOT NULL,
    "id_pengemudi" UUID,
    "id_bus" UUID,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "raspberrypi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin" (
    "id" UUID NOT NULL,
    "nama" VARCHAR,
    "nomor_telepon" VARCHAR,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bus_plat_bus_key" ON "Bus"("plat_bus");

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");

-- AddForeignKey
ALTER TABLE "histori_pelanggaran" ADD CONSTRAINT "histori_pelanggaran_id_raspberrypi_fkey" FOREIGN KEY ("id_raspberrypi") REFERENCES "raspberrypi"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "raspberrypi" ADD CONSTRAINT "raspberrypi_id_bus_fkey" FOREIGN KEY ("id_bus") REFERENCES "Bus"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "raspberrypi" ADD CONSTRAINT "raspberrypi_id_pengemudi_fkey" FOREIGN KEY ("id_pengemudi") REFERENCES "pengemudi"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
