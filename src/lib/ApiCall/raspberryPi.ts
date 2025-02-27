import { RaspberryPi } from "@/types/raspberrypi";
import { RaspberryPiInput } from "@/types/raspberrypi";

const BASE_URL = "http://localhost:3000/api/raspberrypi"; // Sesuaikan dengan environment API

// GET Semua Raspberry Pi
export async function getRaspberryPiData(): Promise<RaspberryPi[]> {
  try {
    const res = await fetch(BASE_URL, { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Failed to fetch Raspberry Pi data");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching Raspberry Pi data:", error);
    return [];
  }
}

// GET Raspberry Pi By ID
export async function getRaspberryPiById(id: string): Promise<RaspberryPi> {
  const res = await fetch(`${BASE_URL}/${id}`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch Raspberry Pi data");
  }

  return res.json();
}

// CREATE Raspberry Pi (POST)
export async function createRaspberryPi(raspberryData: RaspberryPiInput): Promise<RaspberryPi> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(raspberryData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Gagal menambahkan Raspberry Pi");
  }

  return res.json();
}

// UPDATE Raspberry Pi (PUT)
export async function updateRaspberryPi(id: string, updatedData: Partial<Omit<RaspberryPi, "id">>): Promise<RaspberryPi> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Failed to update Raspberry Pi");
  }

  return result;
}

// DELETE Raspberry Pi By ID
export async function deleteRaspberryPiById(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete Raspberry Pi");
  }
}
