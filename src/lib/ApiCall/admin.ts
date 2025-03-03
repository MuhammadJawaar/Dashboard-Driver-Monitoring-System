import { Admin } from "@/types/admin";
import { AdminInput } from "@/types/admin";

const BASE_URL = "http://localhost:3000/api/admin";

// GET Semua Admin
export async function getAdminData(): Promise<Admin[]> {
  try {
    const res = await fetch(BASE_URL, { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Failed to fetch admin data");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching admin data:", error);
    return [];
  }
}

// GET Admin By ID
export async function getAdminById(id: string): Promise<Admin> {
  const res = await fetch(`${BASE_URL}/${id}`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch admin data");
  }

  return res.json();
}

// CREATE Admin (POST)
export async function createAdmin(adminData: AdminInput): Promise<Admin> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(adminData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Gagal menambahkan admin");
  }

  return res.json();
}

// UPDATE Admin (PUT)
export async function updateAdmin(id: string, updatedData: Partial<Omit<Admin, "id">>): Promise<Admin> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Failed to update admin");
  }

  return result;
}

// DELETE Admin By ID
export async function deleteAdminById(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });

  if (!res.ok) {
    throw new Error("Failed to delete admin");
  }
}
