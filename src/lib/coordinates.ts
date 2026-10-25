/**
 * Converte o texto digitado em número. Aceita vírgula decimal (`-8,1189`), comum para
 * usuários brasileiros, além de ponto. Retorna `null` se vazio ou inválido.
 */
export function parseCoordinate(value: string): number | null {
  const normalized = value.trim().replace(",", ".")
  if (!normalized) return null
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

export const isLatitudeValid = (value: number | null): value is number =>
  value !== null && value >= -90 && value <= 90

export const isLongitudeValid = (value: number | null): value is number =>
  value !== null && value >= -180 && value <= 180

/** Ex.: 1.2 → "1,2 km"; distâncias muito pequenas viram "< 0,1 km" em vez de "0 km". */
export function formatDistanceKm(distanceKm: number): string {
  if (distanceKm < 0.1) return "< 0,1 km"
  return `${distanceKm.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km`
}

/**
 * Centro da praia no formato do Mapbox, `[longitude, latitude]` (a API usa a ordem inversa).
 * Retorna `null` se não houver praia ou se ela ainda não tiver coordenadas.
 */
export function getBeachCenter(
  beach: { latitude?: number | null; longitude?: number | null } | null | undefined
): [number, number] | null {
  if (beach?.latitude == null || beach.longitude == null) return null
  return [beach.longitude, beach.latitude]
}
