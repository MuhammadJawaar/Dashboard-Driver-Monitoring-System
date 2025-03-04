import { Pengemudi } from "@/types/pengemudi";
import { PengemudiInput } from "@/types/pengemudi";

const BASE_URL = process.env.AUTH_URL || "http://localhost:3000";

// GET Semua Pengemudi
export async function getPengemudiData(): Promise<Pengemudi[]> {
  try {
    const res = await fetch(`{BASE_URL}/api/pengemudi`, { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Failed to fetch pengemudi data");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching pengemudi data:", error);
    return [];
  }
}

// GET Pengemudi By ID
export async function getPengemudiById(id: string): Promise<Pengemudi> {
  const res = await fetch(`${BASE_URL}/api/pengemudi/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch pengemudi data");
  }

  return res.json();
}

// CREATE Pengemudi (POST)
export async function createPengemudi(pengemudiData: PengemudiInput): Promise<Pengemudi> {
    const res = await fetch(`${BASE_URL}/api/pengemudi`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pengemudiData),
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Gagal menambahkan pengemudi");
    }
  
    return res.json();
  }
  

// UPDATE Pengemudi (PUT)
export async function updatePengemudi(id: string, updatedData: Partial<Omit<Pengemudi, "id">>): Promise<Pengemudi> {
  const res = await fetch(`${BASE_URL}/api/pengemudi/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Failed to update pengemudi");
  }

  return result;
}

// DELETE Pengemudi By ID
export async function deletePengemudiById(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/pengemudi/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete pengemudi");
  }
}
