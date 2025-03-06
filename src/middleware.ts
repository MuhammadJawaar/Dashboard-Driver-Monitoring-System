import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
 

export default NextAuth(authConfig).auth;
 
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - .swa (Azure Static Web Apps)
     * - api, _next/static, _next/image, and .png files
     */
    '/((?!.swa|api|_next/static|_next/image|.*\\.png$).*)',
  ],
};