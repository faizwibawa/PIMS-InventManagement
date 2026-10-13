import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { projectId, publicAnonKey } from "../../utils/supabase/info"

const storageKey = `pims-${projectId}-auth-token`
const legacyStorageKey = `sb-${projectId}-auth-token`

if (typeof window !== "undefined") {
  try {
    const legacySession = window.localStorage.getItem(legacyStorageKey)
    if (legacySession && !window.localStorage.getItem(storageKey)) {
      window.localStorage.setItem(storageKey, legacySession)
    }
  } catch {
    // Supabase falls back gracefully when storage is unavailable.
  }
}

const globalSupabase = globalThis as typeof globalThis & {
  __pimsSupabase?: SupabaseClient
}

export const supabase =
  globalSupabase.__pimsSupabase ??
  createClient(`https://${projectId}.supabase.co`, publicAnonKey, {
    auth: {
      storageKey,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })

globalSupabase.__pimsSupabase = supabase
