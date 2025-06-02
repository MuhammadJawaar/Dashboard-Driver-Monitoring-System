import { Admin } from "@/types/admin";
import { AdminInput } from "@/types/admin";

const API_PREFIX = "/api/admin";

// GET Semua Admin
export async function getAdminData(): Promise<Admin[]> {
  try {
    const res = await fetch(API_PREFIX, { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Failed to fetch admin data");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching admin data:", error);
    return [];
  }
}

// GET Admin By ID
export async function getAdminById(id: string): Promise<Admin> {
  try {
    const res = await fetch(`${API_PREFIX}/${id}`, { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Failed to fetch admin data");
    }

    return await res.json();
  } catch (error) {
    console.error(`Error fetching admin with ID ${id}:`, error);
    throw error;
  }
}

// CREATE Admin (POST)
export async function createAdmin(adminData: AdminInput): Promise<Admin> {
  try {
    const res = await fetch(API_PREFIX, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(adminData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Gagal menambahkan admin");
    }

    return await res.json();
  } catch (error) {
    console.error("Error creating admin:", error);
    throw error;
  }
}

// UPDATE Admin (PUT)
export async function updateAdmin(id: string, updatedData: Partial<Omit<Admin, "id">>): Promise<Admin> {
  try {
    const res = await fetch(`${API_PREFIX}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to update admin");
    }

    return await res.json();
  } catch (error) {
    console.error(`Error updating admin with ID ${id}:`, error);
    throw error;
  }
}

// DELETE Admin By ID
export async function deleteAdminById(id: string): Promise<void> {
  try {
    const res = await fetch(`${API_PREFIX}/${id}`, { method: "DELETE" });

    if (!res.ok) {
      throw new Error("Failed to delete admin");
    }
  } catch (error) {
    console.error(`Error deleting admin with ID ${id}:`, error);
    throw error;
  }
}
