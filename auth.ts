import NextAuth from "next-auth";
import { z, ZodError } from "zod";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from '@/auth.config';
import bcrypt from "bcryptjs";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

async function getUser(email: string) {
  const response = await fetch(`http://localhost:3000/api/admin/login?email=${email}`);
  if (!response.ok) return null;
  return response.json();
}

export const { handlers, auth,signIn,signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await signInSchema.parseAsync(credentials);
          
          // Ambil user dari API
          const user = await getUser(email);
          if (!user) {
            throw new Error("Invalid credentials.");
          }
          
          // Verifikasi password
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            throw new Error("Invalid credentials.");
          }
          
          return user;
        } catch (error) {
          if (error instanceof ZodError) {
            return null;
          }
          throw error;
        }
      },
    }),
  ],
});
