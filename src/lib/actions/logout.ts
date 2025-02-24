'use server';

import { signOut } from '../../../auth';

export async function logout() {  
  try {
    await signOut({ redirect: false }); // Nonaktifkan redirect agar toast bisa tampil
  } catch (error) {
    console.error("Error during logout:", error);
    throw new Error("Logout gagal!"); // Melempar error agar bisa ditangkap di button
  }
}
