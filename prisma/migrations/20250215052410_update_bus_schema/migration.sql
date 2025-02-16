-- CreateTable
CREATE TABLE "Bus" (
    "id" UUID NOT NULL,
    "plat_bus" VARCHAR NOT NULL,
    "merek" VARCHAR,
    "kapasitas" INTEGER,
    "tahun_pembuatan" INTEGER,

    CONSTRAINT "Bus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "histori_pelanggaran" (
    "id" UUID NOT NULL,
    "waktu_pelanggaran" TIMESTAMP(6) NOT NULL,
    "jenis_pelanggaran" VARCHAR NOT NULL,
    "id_penugasan" INTEGER,

    CONSTRAINT "histori_pelanggaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pengemudi" (
    "id" UUID NOT NULL,
    "nama" VARCHAR,
    "alamat" VARCHAR,
    "nomor_telepn" VARCHAR,
    "tanggal_lahir" DATE,

    CONSTRAINT "pengemudi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penugasan" (
    "id" SERIAL NOT NULL,
    "id_pengemudi" UUID,
    "id_bus" UUID,
    "tanggal_penugasan" DATE,

    CONSTRAINT "penugasan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supervisor" (
    "id" UUID NOT NULL,
    "nama" VARCHAR,
    "nomor_telepon" VARCHAR,
    "email" VARCHAR,
    "password" VARCHAR,

    CONSTRAINT "supervisor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bus_plat_bus_key" ON "Bus"("plat_bus");

-- CreateIndex
CREATE UNIQUE INDEX "supervisor_email_key" ON "supervisor"("email");

-- AddForeignKey
ALTER TABLE "histori_pelanggaran" ADD CONSTRAINT "id_penugasan" FOREIGN KEY ("id_penugasan") REFERENCES "penugasan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "penugasan" ADD CONSTRAINT "id_bus" FOREIGN KEY ("id_bus") REFERENCES "Bus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "penugasan" ADD CONSTRAINT "id_pengemudi" FOREIGN KEY ("id_pengemudi") REFERENCES "pengemudi"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
