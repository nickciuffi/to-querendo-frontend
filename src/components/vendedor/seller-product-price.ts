export const priceFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

export function parsePrice(value: string) {
  return Number(value.replace(",", "."))
}

/**
 * Valida o preço digitado. Quando o preço mínimo do produto base é conhecido,
 * ele também é respeitado (a API faz a mesma checagem).
 */
export function validatePrice(value: string, minPrice: number | null): string | null {
  const parsed = parsePrice(value)
  if (!value.trim() || Number.isNaN(parsed) || parsed <= 0) return "Informe um preço válido."
  if (minPrice !== null && parsed < minPrice) {
    return `O preço deve ser de no mínimo ${priceFormatter.format(minPrice)}.`
  }
  return null
}
