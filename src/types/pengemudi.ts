export type Pengemudi = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    nama: string | null;
    alamat: string | null;
    nomor_telepon: string | null;
    tanggal_lahir: Date | null;
    
  };
  
  export type PengemudiInput = Omit<Pengemudi, "id" | "createdAt" | "updatedAt">;
