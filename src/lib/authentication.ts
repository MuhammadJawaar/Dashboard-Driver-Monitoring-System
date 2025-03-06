'use server';

import { signIn } from '../../auth';
import { AuthError } from 'next-auth';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return `Authentication error: ${error.type}`;
      }
    }

    if (error instanceof Error) {
      return `Unexpected error: ${error.message}`;
    }

    return 'An unknown error occurred.';
  }
}
