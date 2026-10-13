import { projectId, publicAnonKey } from "../../utils/supabase/info"
import { supabase } from "./supabase"

export type Reminder = {
  enabled: boolean
  days: string[]
  time: string
}

export type CheckResult = {
  checkedIds: string[]
  ignoredIds: string[]
  completedAt: string | null
}

export type QuickSet = {
  id: string
  name: string
  icon: string
  itemIds: string[]
  reminder: Reminder
  lastCheck: CheckResult
  createdAt: string
  updatedAt: string
}

export type QuickSetInput = Pick<QuickSet, "name" | "icon" | "itemIds" | "reminder">

export type AppNotification = {
  id: string
  type: "reminder" | "unchecked" | "borrowed" | "unavailable"
  title: string
  body: string
  read: boolean
  target: "quickset" | "item"
  targetId: string
  createdAt: string
}

const apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-e8f7ac83`

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) throw new Error("Sesi tidak tersedia")
  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
      apikey: publicAnonKey,
      ...init?.headers,
    },
  })
  if (!response.ok)
    throw new Error(`Quick Sets request failed: ${response.status}`)
  return response.json()
}

export const quickSetsApi = {
  list: () => request<{ quickSets: QuickSet[] }>("/quicksets"),
  create: (input: QuickSetInput) =>
    request<{ quickSet: QuickSet }>("/quicksets", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (id: string, input: QuickSetInput) =>
    request<{ quickSet: QuickSet }>(`/quicksets/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),
  remove: (id: string) =>
    request<{ success: true }>(`/quicksets/${id}`, { method: "DELETE" }),
  saveCheck: (id: string, result: Omit<CheckResult, "completedAt">) =>
    request<{ quickSet: QuickSet }>(`/quicksets/${id}/check`, {
      method: "POST",
      body: JSON.stringify(result),
    }),
}

export const notificationsApi = {
  list: () => request<{ notifications: AppNotification[] }>("/notifications"),
  read: (id: string) =>
    request<{ notifications: AppNotification[] }>(`/notifications/${id}/read`, {
      method: "PUT",
    }),
  readAll: () =>
    request<{ notifications: AppNotification[] }>("/notifications/read-all", {
      method: "PUT",
    }),
}
