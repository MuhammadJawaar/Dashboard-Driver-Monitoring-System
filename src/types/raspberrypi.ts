export interface RaspberryPi {
    id: number;
    id_pengemudi?: string | null;
    id_bus?: string | null;
    createdAt: Date;
    updatedAt: Date;
  }

  export type RaspberryPiInput = Omit<RaspberryPi, "id" | "createdAt" | "updatedAt">;