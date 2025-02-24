import { Supervisor } from "@/types/supervisor";
import { SupervisorInput } from "@/types/supervisor";

const BASE_URL = "http://localhost:3000/api/supervisor";

// GET Semua Supervisor
export async function getSupervisorData(): Promise<Supervisor[]> {
  try {
    const res = await fetch(BASE_URL, { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Failed to fetch supervisor data");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching supervisor data:", error);
    return [];
  }
}

// GET Supervisor By ID
export async function getSupervisorById(id: string): Promise<Supervisor> {
  const res = await fetch(`${BASE_URL}/${id}`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch supervisor data");
  }

  return res.json();
}

// CREATE Supervisor (POST)
export async function createSupervisor(supervisorData: SupervisorInput): Promise<Supervisor> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(supervisorData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Gagal menambahkan supervisor");
  }

  return res.json();
}

// UPDATE Supervisor (PUT)
export async function updateSupervisor(id: string, updatedData: Partial<Omit<Supervisor, "id">>): Promise<Supervisor> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Failed to update supervisor");
  }

  return result;
}

// DELETE Supervisor By ID
export async function deleteSupervisorById(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });

  if (!res.ok) {
    throw new Error("Failed to delete supervisor");
  }
}
