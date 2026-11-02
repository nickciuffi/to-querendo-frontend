import { ImageLightbox } from "@/components/image-lightbox"
import { getInitials } from "@/lib/utils"

const AVATAR_CLASSES = "size-12 shrink-0 rounded-full ring-2 ring-[#FC800C] ring-offset-2 ring-offset-card"

/**
 * Avatar dos painéis do mapa: a foto de perfil, que amplia ao clicar, ou as iniciais do nome
 * quando a pessoa não tem foto.
 */
export function ProfileAvatar({ name, photoUrl }: { name: string; photoUrl: string | null }) {
  if (photoUrl) {
    return <ImageLightbox src={photoUrl} alt={`Foto de perfil de ${name}`} className={AVATAR_CLASSES} />
  }

  return (
    <span
      className={`${AVATAR_CLASSES} flex items-center justify-center bg-[#FC800C]/15 text-sm font-semibold text-[#FC800C]`}
    >
      {getInitials(name)}
    </span>
  )
}
