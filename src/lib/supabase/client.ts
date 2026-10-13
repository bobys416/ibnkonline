import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for client-side components (browser).
 * Re-uses the singleton instance across renders in the browser.
 */
let clientInstance: ReturnType<typeof createBrowserClient> | null = null;

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && anonKey && !url.includes("your-project-ref") && !anonKey.includes("your-anon-key"));
}

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  if (!clientInstance) {
    clientInstance = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }

  return clientInstance;
}

export const supabase = {
  get client() {
    return createClient();
  },
  isConfigured: isSupabaseConfigured,
};

