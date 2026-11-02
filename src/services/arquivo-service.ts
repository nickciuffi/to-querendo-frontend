import { ApiError, apiFetch } from "@/services/http-client"

interface ApiEnvelope<T> {
  response: T
  messages: string[]
}

/** Pasta lógica de destino no upload. Cada uma tem a sua regra de permissão na API. */
export type PastaArquivo =
  | "usuarios"
  | "intencoes-compra"
  | "produtos-especificos"
  | "produtos-base"
  | "praias"

export interface ArquivoEnviado {
  /** URL pública completa. É o valor a ser enviado em `urlFoto` / `urlFotoLocal`. */
  url: string
}

/**
 * Falha no envio da imagem com mensagem pronta para o usuário. Os formulários mostram a
 * `message` dela (assim como a de `ApiError`) e usam a própria mensagem genérica para o resto.
 */
export class ImageUploadError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ImageUploadError"
  }
}

/** Envia a imagem para `POST /arquivo` (multipart) e devolve a URL pública dela. */
export async function uploadImagem(pasta: PastaArquivo, arquivo: File): Promise<ArquivoEnviado> {
  const form = new FormData()
  form.append("pasta", pasta)
  form.append("arquivo", arquivo)

  let response: { path: string; url?: string | null }
  try {
    const envelope = await apiFetch<ApiEnvelope<{ path: string; url?: string | null }>>("/arquivo", {
      method: "POST",
      body: form,
    })
    response = envelope.response
  } catch (err) {
    // Erros da API já vêm com mensagem em português; falhas de rede ganham uma genérica.
    if (err instanceof ApiError) throw err
    throw new ImageUploadError("Não foi possível enviar a imagem. Tente novamente.")
  }

  // A `url` só vem quando o servidor tem a URL pública do bucket configurada.
  if (!response.url) {
    throw new ImageUploadError("O servidor não devolveu a URL pública da imagem.")
  }
  return { url: response.url }
}
