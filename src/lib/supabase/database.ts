import { createClient, isSupabaseConfigured } from "./client";
import { createAdminClient } from "./admin";

/**
 * Direct Supabase database query helper.
 * Complements Prisma for real-time listeners and Supabase RPC calls.
 */
export function getDbClient(useAdmin: boolean = false) {
  if (useAdmin) {
    return createAdminClient();
  }
  return createClient();
}

/**
 * Subscribes to changes in a specific table (e.g. "orders", "notifications").
 * Returns an unsubscribe callback.
 */
export function subscribeToTable<T = Record<string, unknown>>({
  table,
  event = "*",
  filter,
  callback,
}: {
  table: string;
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  filter?: string;
  callback: (payload: { eventType: string; new: T; old: T }) => void;
}): (() => void) | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const client = createClient();
  const channelName = `realtime:${table}:${Math.random().toString(36).substring(7)}`;

  const channel = client.channel(channelName);

  let subscription = channel.on(
    "postgres_changes" as any,
    {
      event,
      schema: "public",
      table,
      filter,
    },
    (payload: any) => {
      callback({
        eventType: payload.eventType,
        new: payload.new,
        old: payload.old,
      });
    }
  );

  subscription.subscribe();

  return () => {
    client.removeChannel(channel);
  };
}

