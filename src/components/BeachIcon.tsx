import type { IconName } from '../types'

type BeachIconProps = { name: IconName; size?: number }

const glyphs: Record<IconName, string> = {
  search: '⌕', pin: '⌖', bell: '♢', star: '★', home: '⌂', map: '⌗', bag: '▣', user: '●', plus: '+', arrow: '›', coffee: '◒', food: '◈', ice: '❄', umbrella: '◓', sparkles: '✦', waves: '≋', navigation: '➤', clock: '◷', heart: '♡', card: '▤', help: '?', logout: '↪',
}

export function BeachIcon({ name, size = 18 }: BeachIconProps) {
  return <span className="inline-flex items-center justify-center font-bold leading-none" style={{ fontSize: size }} aria-hidden="true">{glyphs[name]}</span>
}
