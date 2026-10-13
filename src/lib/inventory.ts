import { projectId, publicAnonKey } from "../../utils/supabase/info"
import { supabase } from "./supabase"

export type InventoryStatus = "available" | "borrowed" | "unavailable"
export type LocationType = "Disimpan" | "Dibawa"

export type LocationHistory = {
  id: string
  changedAt: string
  from: string
  to: string
}

export type InventoryItem = {
  id: string
  name: string
  category: string
  quantity: number
  status: InventoryStatus
  borrowedBy: string
  locationId: string
  locationPath: string
  locationType: LocationType
  notes: string
  image: string
  icon: string
  quickSets: string[]
  history: LocationHistory[]
  createdAt: string
  updatedAt: string
}

export type InventoryInput = Omit<InventoryItem, "id" | "history" | "createdAt" | "updatedAt">

export type LocationNode = {
  id: string
  parentId: string | null
  name: string
  level: "Tempat" | "Ruangan" | "Penyimpanan" | "Posisi spesifik"
  type: LocationType
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
    throw new Error(`Inventory request failed: ${response.status}`)
  return response.json()
}

export const inventoryApi = {
  async list() {
    return request<{ items: InventoryItem[] }>("/inventory")
  },
  async create(input: InventoryInput) {
    return request<{ item: InventoryItem }>("/inventory", {
      method: "POST",
      body: JSON.stringify(input),
    })
  },
  async update(id: string, input: Partial<InventoryInput>) {
    return request<{ item: InventoryItem }>(`/inventory/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    })
  },
  async remove(id: string) {
    return request<{ success: true }>(`/inventory/${id}`, {
      method: "DELETE",
    })
  },
  async locations() {
    return request<{ locations: LocationNode[] }>("/locations")
  },
  async createLocation(input: Omit<LocationNode, "id">) {
    return request<{ location: LocationNode }>("/locations", {
      method: "POST",
      body: JSON.stringify(input),
    })
  },
}
