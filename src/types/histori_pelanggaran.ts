export interface HistoriPelanggaran {
    id: number;
    waktu_pelanggaran: Date;
    jenis_pelanggaran: string;
    id_raspberrypi?: number | null;  // Allow null
    image?: string | null;           // Allow null
    createdAt: Date;
    updatedAt: Date;
  }
  