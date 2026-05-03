export const ART_DIRECTION = {
  name: 'Unified pixel-painted Joseon trade RPG',
  palette: '48-color brass, teal, hanji and ink pixel-painted palette',
  root: '/assets/painted2d'
} as const;

const SCENE_BY_VISUAL_TYPE: Record<string, string> = {
  south_port: `${ART_DIRECTION.root}/scenes/south-port.webp`,
  west_mudflat: `${ART_DIRECTION.root}/scenes/west-mudflat.webp`,
  inland_city: `${ART_DIRECTION.root}/scenes/inland-city.webp`,
  east_port: `${ART_DIRECTION.root}/scenes/east-port.webp`,
  jeju: `${ART_DIRECTION.root}/scenes/jeju.webp`,
  tsushima: `${ART_DIRECTION.root}/scenes/tsushima.webp`
};

export function sceneAssetForVisualType(visualType?: string, fallback?: string) {
  return SCENE_BY_VISUAL_TYPE[visualType ?? ''] ?? fallback ?? `${ART_DIRECTION.root}/scenes/south-port.webp`;
}

export function npcAsset(pathname: string) {
  if (pathname.startsWith(`${ART_DIRECTION.root}/npc/`)) return pathname;
  return `${ART_DIRECTION.root}/npc/fallback-npc.png`;
}

export function shipAssetForTier(tier: number) {
  return `${ART_DIRECTION.root}/vehicles/ship-tier-${Math.min(4, Math.max(1, tier))}.png`;
}

export function cartAssetForTier(tier: number) {
  return `${ART_DIRECTION.root}/vehicles/cart-tier-${Math.min(4, Math.max(1, tier))}.png`;
}

export function hubIconAsset(name: 'market' | 'office' | 'tavern' | 'shipyard' | 'map' | 'fish') {
  return `${ART_DIRECTION.root}/ui/hub-${name}.svg`;
}

export function resultIconAsset(kind: string) {
  return `${ART_DIRECTION.root}/ui/result-${kind === 'fame' ? 'safe' : kind}.png`;
}

export function goodIconAsset(goodId?: string) {
  return `${ART_DIRECTION.root}/goods/${goodId ?? 'fallback-good'}.png`;
}

export function guideSpiritAsset(mood: 'default' | 'happy' | 'warning' = 'default') {
  return `${ART_DIRECTION.root}/companions/guide-spirit-${mood}.png`;
}

export function seasonArtAsset(month: number) {
  const kind = month >= 3 && month <= 5 ? 'spring'
    : month >= 6 && month <= 8 ? 'summer'
      : month >= 9 && month <= 11 ? 'autumn'
        : 'winter';
  return `${ART_DIRECTION.root}/ui/season-${kind}.svg`;
}

export const TITLE_HARBOR_ASSET = `${ART_DIRECTION.root}/scenes/south-port.webp`;
export const PROTAGONIST_ASSET = `${ART_DIRECTION.root}/characters/protagonist.png`;
