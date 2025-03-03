export interface Admin {
    id: string;
    nama?: string | null;
    nomor_telepon?: string | null;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
export type AdminInput = Omit<Admin, "id" | "createdAt" | "updatedAt">;
