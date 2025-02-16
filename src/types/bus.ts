export interface Bus {
    id: string;
    plat_bus?: string | null;
    merek?: string | null;
    kapasitas?: number | null;
    tahun_pembuatan?: number | null;
    // penugasan?: Penugasan[]; // Sesuai dengan relasi array
  }