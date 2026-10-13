import { createClient, isSupabaseConfigured } from "./client";

export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    email?: string;
    fullName?: string;
  };
  error?: string;
  requiresEmailConfirmation?: boolean;
}

/**
 * Sign up a new user with Email and Password via Supabase Auth.
 */
export async function signUpWithSupabase(
  email: string,
  password: string,
  fullName?: string
): Promise<AuthResponse> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: "Supabase credentials are not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  const client = createClient();
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || email.split("@")[0],
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  const user = data.user;
  const requiresEmailConfirmation = Boolean(data.session === null && user);

  return {
    success: true,
    user: user
      ? {
          id: user.id,
          email: user.email,
          fullName: (user.user_metadata?.full_name as string) || fullName,
        }
      : undefined,
    requiresEmailConfirmation,
  };
}

/**
 * Sign in an existing user with Email and Password via Supabase Auth.
 */
export async function signInWithSupabase(
  email: string,
  password: string
): Promise<AuthResponse> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: "Supabase credentials are not configured.",
    };
  }

  const client = createClient();
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  const user = data.user;
  return {
    success: true,
    user: user
      ? {
          id: user.id,
          email: user.email,
          fullName: (user.user_metadata?.full_name as string) || user.email?.split("@")[0],
        }
      : undefined,
  };
}

/**
 * Sign in with Magic Link / OTP via email.
 */
export async function sendMagicLink(email: string, redirectTo?: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase credentials are not configured." };
  }

  const client = createClient();
  const { error } = await client.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo || (typeof window !== "undefined" ? window.location.origin : undefined),
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

/**
 * Sign in with OAuth provider (Google, GitHub, etc.)
 */
export async function signInWithOAuth(provider: "google" | "github", redirectTo?: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase credentials are not configured." };
  }

  const client = createClient();
  const { error } = await client.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectTo || (typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined),
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

/**
 * Sign out from Supabase Auth.
 */
export async function signOutSupabase(): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  const client = createClient();
  const { error } = await client.auth.signOut();
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

/**
 * Get current Supabase user in the browser.
 */
export async function getCurrentSupabaseUser() {
  if (!isSupabaseConfigured()) {
    return null;
  }
  const client = createClient();
  const { data } = await client.auth.getUser();
  return data.user;
}

