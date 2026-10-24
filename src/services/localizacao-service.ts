import { apiFetch } from "@/services/http-client"

interface ApiEnvelope<T> {
  response: T
  messages: string[]
}

export async function updateLocalizacao(latitude: number, longitude: number): Promise<void> {
  await apiFetch<ApiEnvelope<unknown>>("/localizacao", {
    method: "PUT",
    body: { latitude, longitude },
  })
}
