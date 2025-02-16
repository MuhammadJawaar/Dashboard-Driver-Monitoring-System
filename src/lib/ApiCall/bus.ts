import { Bus } from "@/types/bus";

// GET Semua Bus
export async function getBusData(): Promise<Bus[]> {
  try {
    const res = await fetch("http://localhost:3000/api/bus", { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Failed to fetch bus data");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching bus data:", error);
    return [];
  }
}

// GET Bus By ID
export async function getBusDataId(id: string): Promise<Bus> {
  const res = await fetch(`http://localhost:3000/api/bus/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch bus data");
  }

  return res.json();
}

// CREATE Bus (POST)
export async function createBus(busData: Omit<Bus, "id">): Promise<Bus> {
  const res = await fetch("http://localhost:3000/api/bus", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(busData),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Failed to create bus");
  }

  return result;
}

// UPDATE Bus (PUT)
export async function updateBusData(id: string, updatedData: Partial<Omit<Bus, "id">>): Promise<Bus> {
  const res = await fetch(`http://localhost:3000/api/bus/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Failed to update bus");
  }

  return result;
}

// DELETE Bus By ID
export async function deleteBusById(id: string): Promise<void> {
  const res = await fetch(`http://localhost:3000/api/bus/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete bus");
  }
}
