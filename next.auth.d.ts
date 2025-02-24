// next-auth.d.ts
import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";

// Extending NextAuth User type to include custom properties
declare module "next-auth" {
  interface User {
    id: string;
    nama: string; // Add this property
    email: string;
  }

  interface Session {
    user: User;
  }
}
