import * as React from "react"

import { uploadImagem, type PastaArquivo } from "@/services/arquivo-service"

/**
 * Estado da imagem escolhida num formulário e o envio dela para a API.
 *
 * - `upload()` envia o arquivo escolhido e devolve a URL pública (ou `undefined` sem arquivo).
 *   Se o salvamento do formulário falhar depois, a próxima chamada reaproveita a URL já
 *   enviada em vez de mandar o arquivo de novo.
 * - Escolher outro arquivo (`setFile`) ou `reset()` descartam a URL guardada.
 * - Erros do upload são lançados (`ApiError` ou `ImageUploadError`), para o formulário
 *   mostrar a mensagem e não chamar o endpoint de criação/edição.
 */
export function useImageUpload(pasta: PastaArquivo) {
  const [file, setFileState] = React.useState<File | null>(null)
  const [uploadedUrl, setUploadedUrl] = React.useState<string | null>(null)
  const [isUploading, setIsUploading] = React.useState(false)

  const setFile = React.useCallback((next: File | null) => {
    setFileState(next)
    setUploadedUrl(null)
  }, [])

  const reset = React.useCallback(() => {
    setFileState(null)
    setUploadedUrl(null)
  }, [])

  async function upload(): Promise<string | undefined> {
    if (!file) return undefined
    if (uploadedUrl) return uploadedUrl

    setIsUploading(true)
    try {
      const { url } = await uploadImagem(pasta, file)
      setUploadedUrl(url)
      return url
    } finally {
      setIsUploading(false)
    }
  }

  return { file, setFile, upload, reset, isUploading }
}
