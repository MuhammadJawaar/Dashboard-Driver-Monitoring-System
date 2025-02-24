export interface Supervisor {
    id: string;
    nama?: string | null;
    nomor_telepon?: string | null;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
export type SupervisorInput = Omit<Supervisor, "id" | "createdAt" | "updatedAt">;
