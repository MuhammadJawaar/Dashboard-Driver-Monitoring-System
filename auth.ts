import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

// Fungsi untuk mengambil user dari API
async function getUser(email: string) {
  const response = await fetch(`http://localhost:3000/api/supervisor?email=${email}`);
  if (!response.ok) return null;
  return response.json();
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const schema = z.object({ email: z.string().email(), password: z.string().min(6) });
        const parsed = schema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await getUser(email);
        if (!user || !user.password) return null;

        // Cek password dengan bcryptjs
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return null;

        return { id: user.id, nama: user.nama, email: user.email };
      },
    }),
  ],
});
