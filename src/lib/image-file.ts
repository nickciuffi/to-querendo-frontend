export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp"
export const IMAGE_MAX_BYTES = 5 * 1024 * 1024

/**
 * Valida a imagem antes do upload (mesmas regras da API). Retorna a mensagem de erro
 * ou `null` se o arquivo é válido.
 */
export function validateImageFile(file: File): string | null {
  if (!IMAGE_ACCEPT.split(",").includes(file.type)) {
    return "Use uma imagem JPEG, PNG ou WEBP."
  }
  if (file.size > IMAGE_MAX_BYTES) return "A imagem deve ter no máximo 5 MB."
  return null
}
