import type { JuniorBoat, JuniorCity, JuniorCityId, JuniorEvent, JuniorGood, JuniorGoodId, JuniorMainStoryEvent, JuniorMountainStoryLocation, JuniorNotebook, JuniorRegionalEvent, JuniorReward, JuniorRoute, JuniorSave, JuniorStarItem, JuniorStoryCategory, JuniorStoryEvent, JuniorStoryTriggerType, JuniorVehicle } from './juniorTypes';

export const JUNIOR_SAVE_KEY = 'joseon_trade_junior_save_v1';
export const JUNIOR_SAVE_VERSION = 2;
export const FULL_MODE_URL = '../starter/';
export const ENDING_COINS = 300;
export const STORY_ENDING_NOTEBOOK_COUNT = 5;
export const STORY_ENDING_LEDGER_CLUES = 3;
export const STORY_ENDING_STUDY_ROOM_LEVEL = 3;

export const DEFAULT_SEYEON_NOTEBOOK: JuniorNotebook = {
  writing: 'locked',
  math: 'locked',
  map: 'locked',
  weather: 'locked',
  trade: 'locked'
};

export function publicAsset(path: string) {
  if (!path.startsWith('/assets/')) return path;
  const baseUrl = import.meta.env?.BASE_URL ?? '/';
  return `${baseUrl}${path.slice(1)}`;
}

export const JUNIOR_GOODS: JuniorGood[] = [
  { id: 'cotton_cloth', name: '면포', image: publicAsset('/assets/goods/cotton_cloth.png'), baseBuyCoins: 10, baseSellCoins: 16 },
  { id: 'dried_fish', name: '건어물', image: publicAsset('/assets/goods/dried_fish.png'), baseBuyCoins: 9, baseSellCoins: 15 },
  { id: 'salt', name: '소금', image: publicAsset('/assets/goods/salt.png'), baseBuyCoins: 8, baseSellCoins: 14 },
  { id: 'paper', name: '한지', image: publicAsset('/assets/goods/paper.png'), baseBuyCoins: 11, baseSellCoins: 18 },
  { id: 'citrus', name: '귤', image: publicAsset('/assets/goods/citrus.png'), baseBuyCoins: 12, baseSellCoins: 20 },
  { id: 'fresh_fish', name: '생선', image: publicAsset('/assets/goods/fresh_fish.png'), baseBuyCoins: 9, baseSellCoins: 16 },
  { id: 'herbs', name: '약초', image: publicAsset('/assets/goods/herbs.png'), baseBuyCoins: 12, baseSellCoins: 20 },
  { id: 'rice', name: '쌀', image: publicAsset('/assets/goods/rice.png'), baseBuyCoins: 10, baseSellCoins: 17 },
  { id: 'ginseng', name: '인삼', image: publicAsset('/assets/goods/ginseng.png'), baseBuyCoins: 15, baseSellCoins: 24 },
  { id: 'silk', name: '비단', image: publicAsset('/assets/goods/silk.png'), baseBuyCoins: 18, baseSellCoins: 30 },
  { id: 'ceramics', name: '도자기', image: publicAsset('/assets/goods/ceramics.png'), baseBuyCoins: 17, baseSellCoins: 28 },
  { id: 'horse', name: '말', image: publicAsset('/assets/goods/horse.png'), baseBuyCoins: 20, baseSellCoins: 34 }
];

const starItemIcon = (filename: string) => publicAsset(`/assets/star-items/${filename}`);

export const JUNIOR_STAR_ITEMS: JuniorStarItem[] = [
  {
    id: 'decor_blue_dragon_blade',
    name: '청룡언월도 장식',
    category: 'skin',
    slot: 'weapon',
    starCost: 8,
    iconAsset: starItemIcon('blue-dragon-glaive.png'),
    description: '전설 속 무기처럼 멋진 장식이야.',
    childDescription: '멋져 보이는 장식이야. 힘은 그대로야.',
    ownedText: '이미 갖고 있어.',
    equipText: '청룡언월도 장식을 달았어!',
    useText: '장식은 꾸미기에 써.',
    isConsumable: false
  },
  {
    id: 'decor_chungmugong_sword',
    name: '충무공 검 장식',
    category: 'skin',
    slot: 'weapon',
    starCost: 10,
    iconAsset: starItemIcon('admiral-sword.png'),
    description: '용감한 마음을 떠올리게 하는 검 장식이야.',
    childDescription: '정우가 씩씩해 보여. 힘은 그대로야.',
    ownedText: '이미 갖고 있어.',
    equipText: '충무공 검 장식을 달았어!',
    useText: '장식은 꾸미기에 써.',
    isConsumable: false
  },
  {
    id: 'decor_market_staff',
    name: '장터 호신봉 장식',
    category: 'skin',
    slot: 'weapon',
    starCost: 4,
    iconAsset: starItemIcon('market-staff.png'),
    description: '정우가 씩씩해 보이는 장식이야.',
    childDescription: '가벼운 장식이야. 싸우는 물건은 아니야.',
    ownedText: '이미 갖고 있어.',
    equipText: '호신봉 장식을 달았어!',
    useText: '장식은 꾸미기에 써.',
    isConsumable: false
  },
  {
    id: 'skin_general_armor',
    name: '장군 갑옷',
    category: 'skin',
    slot: 'armor',
    starCost: 10,
    iconAsset: starItemIcon('general-armor.png'),
    description: '장군처럼 멋져 보여.',
    childDescription: '멋진 옷 스킨이야. 힘은 그대로야.',
    ownedText: '이미 갖고 있어.',
    equipText: '장군 갑옷을 입었어!',
    useText: '옷 스킨은 꾸미기에 써.',
    isConsumable: false
  },
  {
    id: 'skin_silk_robe',
    name: '비단 도포',
    category: 'skin',
    slot: 'armor',
    starCost: 7,
    iconAsset: starItemIcon('silk-robe.png'),
    description: '큰 장터에 어울리는 고운 옷이야.',
    childDescription: '고운 옷 스킨이야. 능력치는 그대로야.',
    ownedText: '이미 갖고 있어.',
    equipText: '비단 도포를 입었어!',
    useText: '옷 스킨은 꾸미기에 써.',
    isConsumable: false
  },
  {
    id: 'skin_merchant_coat',
    name: '상인 두루마기',
    category: 'skin',
    slot: 'armor',
    starCost: 5,
    iconAsset: starItemIcon('merchant-robe.png'),
    description: '꼬마 상인 정우에게 잘 어울려.',
    childDescription: '장터에 어울리는 옷이야.',
    ownedText: '이미 갖고 있어.',
    equipText: '상인 두루마기를 입었어!',
    useText: '옷 스킨은 꾸미기에 써.',
    isConsumable: false
  },
  {
    id: 'decor_rain_gauge',
    name: '측우기',
    category: 'decoration',
    slot: 'tool',
    starCost: 7,
    iconAsset: starItemIcon('rain-gauge.png'),
    description: '비가 얼마나 왔는지 살피는 옛 도구야.',
    childDescription: '옛 과학 도구 장식이야.',
    ownedText: '이미 갖고 있어.',
    equipText: '측우기를 들었어!',
    useText: '도구 장식은 꾸미기에 써.',
    isConsumable: false
  },
  {
    id: 'decor_compass',
    name: '나침반',
    category: 'decoration',
    slot: 'tool',
    starCost: 6,
    iconAsset: starItemIcon('compass.png'),
    description: '길을 찾는 기분이 드는 장식이야.',
    childDescription: '길잡이 장식이야. 길이 더 쉬워지진 않아.',
    ownedText: '이미 갖고 있어.',
    equipText: '나침반을 들었어!',
    useText: '도구 장식은 꾸미기에 써.',
    isConsumable: false
  },
  {
    id: 'decor_hopae',
    name: '호패',
    category: 'decoration',
    slot: 'badge',
    starCost: 5,
    iconAsset: starItemIcon('hopae.png'),
    description: '정우의 이름표 같은 장식이야.',
    childDescription: '이름표처럼 멋진 장식이야.',
    ownedText: '이미 갖고 있어.',
    equipText: '호패를 달았어!',
    useText: '호패는 꾸미기에 써.',
    isConsumable: false
  },
  {
    id: 'decor_gold_ledger',
    name: '금빛 장부',
    category: 'decoration',
    slot: 'tool',
    starCost: 12,
    iconAsset: starItemIcon('golden-ledger.png'),
    description: '장사 기록이 더 멋져 보여.',
    childDescription: '반짝이는 장부 장식이야.',
    ownedText: '이미 갖고 있어.',
    equipText: '금빛 장부를 들었어!',
    useText: '장부 장식은 꾸미기에 써.',
    isConsumable: false
  },
  {
    id: 'fairy_ribbon',
    name: '요정 리본',
    category: 'decoration',
    slot: 'fairy',
    starCost: 4,
    iconAsset: starItemIcon('fairy-ribbon.png'),
    description: '바람이가 더 귀여워져.',
    childDescription: '바람이에게 달아주는 리본이야.',
    ownedText: '이미 갖고 있어.',
    equipText: '바람이가 리본을 달았어!',
    useText: '요정 꾸미기에 써.',
    isConsumable: false
  },
  {
    id: 'fairy_star_wand',
    name: '요정 별지팡이',
    category: 'decoration',
    slot: 'fairy',
    starCost: 6,
    iconAsset: starItemIcon('fairy-star-wand.png'),
    description: '요정이 반짝반짝해 보여.',
    childDescription: '바람이가 반짝이는 장식을 들어.',
    ownedText: '이미 갖고 있어.',
    equipText: '바람이가 별지팡이를 들었어!',
    useText: '요정 꾸미기에 써.',
    isConsumable: false
  },
  {
    id: 'story_tiger_rice_charm',
    name: '호랑이 떡부적',
    category: 'decoration',
    slot: 'badge',
    starCost: 5,
    iconAsset: starItemIcon('cargo-protect-charm.png'),
    description: '떡을 나눈 마음을 떠올리는 작은 부적이야.',
    childDescription: '호랑이 이야기 뒤에 열리는 부적이야.',
    ownedText: '이미 갖고 있어.',
    equipText: '호랑이 떡부적을 달았어.',
    useText: '이야기 꾸미기에 써.',
    unlockCondition: 'story:E26',
    isConsumable: false
  },
  {
    id: 'story_fairy_ribbon',
    name: '선녀 리본',
    category: 'decoration',
    slot: 'fairy',
    starCost: 5,
    iconAsset: starItemIcon('fairy-ribbon.png'),
    description: '잃어버린 옷감을 돌려준 마음이 담긴 리본이야.',
    childDescription: '선녀의 옷감 이야기 뒤에 열려.',
    ownedText: '이미 갖고 있어.',
    equipText: '선녀 리본을 달았어.',
    useText: '바람이 꾸미기에 써.',
    unlockCondition: 'story:E28',
    isConsumable: false
  },
  {
    id: 'story_hong_headband',
    name: '홍길동 두건',
    category: 'skin',
    slot: 'hat',
    starCost: 6,
    iconAsset: starItemIcon('hopae.png'),
    description: '빠른 발보다 바른 마음을 떠올리는 두건이야.',
    childDescription: '홍길동 이야기 뒤에 열려.',
    ownedText: '이미 갖고 있어.',
    equipText: '홍길동 두건을 썼어.',
    useText: '정우 꾸미기에 써.',
    unlockCondition: 'story:E21',
    isConsumable: false
  },
  {
    id: 'story_im_wood_tag',
    name: '임꺽정 나무패',
    category: 'decoration',
    slot: 'badge',
    starCost: 6,
    iconAsset: starItemIcon('hopae.png'),
    description: '정직한 장부 약속을 적은 나무패야.',
    childDescription: '임꺽정 이야기 뒤에 열려.',
    ownedText: '이미 갖고 있어.',
    equipText: '임꺽정 나무패를 달았어.',
    useText: '이야기 꾸미기에 써.',
    unlockCondition: 'story:E25',
    isConsumable: false
  },
  {
    id: 'story_simcheong_lotus_lamp',
    name: '심청 연꽃등',
    category: 'decoration',
    slot: 'tool',
    starCost: 7,
    iconAsset: starItemIcon('golden-ledger.png'),
    description: '마음을 전하는 연꽃 편지를 닮은 등불이야.',
    childDescription: '심청전 편지 이야기 뒤에 열려.',
    ownedText: '이미 갖고 있어.',
    equipText: '심청 연꽃등을 들었어.',
    useText: '이야기 꾸미기에 써.',
    unlockCondition: 'story:E35',
    isConsumable: false
  },
  {
    id: 'story_gold_axe_decor',
    name: '금도끼 장식',
    category: 'decoration',
    slot: 'tool',
    starCost: 6,
    iconAsset: starItemIcon('golden-ledger.png'),
    description: '정직하게 말한 마음을 기억하는 장식이야.',
    childDescription: '금도끼 이야기 뒤에 열려.',
    ownedText: '이미 갖고 있어.',
    equipText: '금도끼 장식을 들었어.',
    useText: '이야기 꾸미기에 써.',
    unlockCondition: 'story:E06',
    isConsumable: false
  },
  {
    id: 'story_goblin_club_decor',
    name: '도깨비 방망이 장식',
    category: 'decoration',
    slot: 'tool',
    starCost: 6,
    iconAsset: starItemIcon('market-staff.png'),
    description: '물건을 톡톡 정리하던 방망이 장식이야.',
    childDescription: '도깨비 장터 이야기 뒤에 열려.',
    ownedText: '이미 갖고 있어.',
    equipText: '도깨비 방망이 장식을 들었어.',
    useText: '이야기 꾸미기에 써.',
    unlockCondition: 'story:E08',
    isConsumable: false
  },
  {
    id: 'story_rain_gauge',
    name: '측우기',
    category: 'decoration',
    slot: 'tool',
    starCost: 7,
    iconAsset: starItemIcon('rain-gauge.png'),
    description: '비의 양을 살피는 배움 도구야.',
    childDescription: '장영실 이야기 뒤에 열려.',
    ownedText: '이미 갖고 있어.',
    equipText: '측우기를 들었어.',
    useText: '이야기 꾸미기에 써.',
    unlockCondition: 'story:E48',
    isConsumable: false
  },
  {
    id: 'story_admiral_sword_decor',
    name: '충무공 검 장식',
    category: 'skin',
    slot: 'weapon',
    starCost: 8,
    iconAsset: starItemIcon('admiral-sword.png'),
    description: '차분히 준비하는 마음을 떠올리는 검 장식이야.',
    childDescription: '충무공의 바람 이야기 뒤에 열려.',
    ownedText: '이미 갖고 있어.',
    equipText: '충무공 검 장식을 들었어.',
    useText: '정우 꾸미기에 써.',
    unlockCondition: 'story:E42',
    isConsumable: false
  },
  {
    id: 'story_dragon_shell_decor',
    name: '용궁 조개 장식',
    category: 'decoration',
    slot: 'badge',
    starCost: 6,
    iconAsset: starItemIcon('compass.png'),
    description: '바닷길 편지를 담는 반짝 조개야.',
    childDescription: '별주부전 이야기 뒤에 열려.',
    ownedText: '이미 갖고 있어.',
    equipText: '용궁 조개 장식을 달았어.',
    useText: '이야기 꾸미기에 써.',
    unlockCondition: 'story:E38',
    isConsumable: false
  },
  {
    id: 'ticket_fast_travel',
    name: '신속 이동권',
    category: 'consumable',
    slot: 'none',
    starCost: 5,
    iconAsset: starItemIcon('fast-travel-ticket.png'),
    description: '이번 이동을 빠르게 해줘.',
    childDescription: '다음 길을 빠르게 지나가는 표야.',
    ownedText: '표를 갖고 있어.',
    equipText: '표는 필요할 때 써.',
    useText: '다음 이동을 빠르게 해줘.',
    consumableEffect: { type: 'fast_travel', description: '다음 이동 장면을 짧게 줄인다.' },
    maxOwned: 3,
    isConsumable: true
  },
  {
    id: 'ticket_half_price_good',
    name: '물건 1개 반값권',
    category: 'consumable',
    slot: 'none',
    starCost: 6,
    iconAsset: starItemIcon('half-price-ticket.png'),
    description: '물건 하나를 반값에 살 수 있어.',
    childDescription: '다음 물건 하나를 싸게 사는 표야.',
    ownedText: '표를 갖고 있어.',
    equipText: '표는 필요할 때 써.',
    useText: '다음 상품 1개를 반값으로 사.',
    consumableEffect: { type: 'half_price_next_good', description: '다음 상품 1개 구매 가격을 50% 낮춘다.' },
    maxOwned: 2,
    isConsumable: true
  },
  {
    id: 'charm_cargo_guard',
    name: '짐 보호 부적',
    category: 'consumable',
    slot: 'none',
    starCost: 5,
    iconAsset: starItemIcon('cargo-protect-charm.png'),
    description: '길 위 사건에서 짐을 지켜줘.',
    childDescription: '짐을 한 번 지켜주는 부적이야.',
    ownedText: '부적을 갖고 있어.',
    equipText: '부적은 필요할 때 써.',
    useText: '다음 짐 손실을 한 번 막아.',
    consumableEffect: { type: 'protect_cargo', description: '다음 오답/위험 이벤트의 짐 손실 1회를 막는다.' },
    maxOwned: 3,
    isConsumable: true
  },
  {
    id: 'ticket_quiz_retry',
    name: '퀴즈 다시풀기권',
    category: 'consumable',
    slot: 'none',
    starCost: 4,
    iconAsset: starItemIcon('quiz-retry-ticket.png'),
    description: '퀴즈를 한 번 더 풀 수 있어.',
    childDescription: '틀려도 한 번 더 해보는 표야.',
    ownedText: '표를 갖고 있어.',
    equipText: '표는 필요할 때 써.',
    useText: '퀴즈를 한 번 더 풀어.',
    consumableEffect: { type: 'quiz_retry', description: '오답 시 한 번 재도전한다.' },
    maxOwned: 3,
    isConsumable: true
  },
  {
    id: 'ticket_market_tip',
    name: '장터 추천권',
    category: 'consumable',
    slot: 'none',
    starCost: 3,
    iconAsset: starItemIcon('market-recommend-ticket.png'),
    description: '오늘 사기 좋은 물건을 알려줘.',
    childDescription: '추천 물건을 더 잘 보이게 해줘.',
    ownedText: '표를 갖고 있어.',
    equipText: '표는 필요할 때 써.',
    useText: '현재 장터 추천 상품을 알려줘.',
    consumableEffect: { type: 'market_recommendation', description: '현재 장터 추천 상품을 강조한다.' },
    maxOwned: 4,
    isConsumable: true
  },
  {
    id: 'ticket_extra_rumor',
    name: '소문 듣기권',
    category: 'consumable',
    slot: 'none',
    starCost: 3,
    iconAsset: starItemIcon('rumor-ticket.png'),
    description: '상인 소문을 하나 더 들어.',
    childDescription: '장터 이야기를 하나 더 듣는 표야.',
    ownedText: '표를 갖고 있어.',
    equipText: '표는 필요할 때 써.',
    useText: '지역 소문을 하나 더 들어.',
    consumableEffect: { type: 'force_rumor', description: '지역 소문 이벤트를 강제로 연다.' },
    maxOwned: 4,
    isConsumable: true
  }
];

export const JUNIOR_CITIES: JuniorCity[] = [
  {
    id: 'china_port',
    name: '중국 항구',
    region: '바깥 장터',
    kind: 'north_trade_port',
    icon: '비단',
    x: 16,
    y: 22,
    buyGoodIds: ['silk', 'ceramics'],
    sellGoodIds: ['ginseng', 'horse', 'dried_fish'],
    scene: '/assets/scenes/market-street.webp',
    note: '비단과 도자기가 들어와.',
    introLines: ['여긴 중국 항구야.', '비단과 도자기가 유명해.', '북쪽 물건을 가져오면 좋아.', '먼 바닷길은 배가 든든해야 해.']
  },
  {
    id: 'sinuiju',
    name: '신의주',
    region: '평안',
    icon: '강',
    x: 34,
    y: 8,
    buyGoodIds: ['rice', 'herbs'],
    sellGoodIds: ['cotton_cloth', 'paper'],
    scene: '/assets/scenes/west-mudflat.webp',
    note: '강길과 장터가 만나는 곳이야.',
    introLines: ['정우야, 여긴 신의주야.', '큰 강을 따라 물건이 모여.', '쌀과 약초를 살펴보자.', '남쪽 장터에 팔면 좋아.']
  },
  {
    id: 'cheongjin',
    name: '청진',
    region: '함경',
    icon: '바다',
    x: 72,
    y: 10,
    buyGoodIds: ['fresh_fish', 'dried_fish'],
    sellGoodIds: ['rice', 'cotton_cloth'],
    scene: '/assets/scenes/east-port.webp',
    note: '북쪽 바닷가 마을이야.',
    introLines: ['청진은 바다가 가까워.', '생선과 건어물이 많아.', '따뜻한 남쪽으로 가져가 보자.', '바닷길은 배가 든든해.']
  },
  {
    id: 'north_port',
    name: '북방 항구',
    region: '북방',
    kind: 'north_trade_port',
    icon: '말',
    x: 86,
    y: 12,
    buyGoodIds: ['horse', 'fresh_fish'],
    sellGoodIds: ['rice', 'cotton_cloth', 'silk'],
    scene: '/assets/scenes/east-port.webp',
    note: '먼 북쪽 물건이 모여.',
    introLines: ['북방 항구는 아주 먼 곳이야.', '말과 바다 물건을 볼 수 있어.', '쌀과 면포는 귀하게 여겨져.', '청진과 이어진 바닷길이 있어.']
  },
  {
    id: 'pyongyang',
    name: '평양',
    region: '평안',
    icon: '성',
    x: 39,
    y: 19,
    buyGoodIds: ['rice', 'paper'],
    sellGoodIds: ['salt', 'fresh_fish'],
    scene: '/assets/scenes/inland-city.webp',
    note: '큰 성과 장터가 있어.',
    introLines: ['여긴 평양이야.', '북쪽의 큰 장터라 물건이 많아.', '쌀과 한지를 잘 볼 수 있어.', '바닷가 물건을 가져오면 좋아.']
  },
  {
    id: 'nampo',
    name: '남포',
    region: '평안',
    kind: 'west_port',
    icon: '서해',
    x: 31,
    y: 25,
    buyGoodIds: ['salt', 'dried_fish'],
    sellGoodIds: ['rice', 'paper', 'herbs'],
    scene: '/assets/scenes/west-mudflat.webp',
    note: '평양 가까운 서해 항구야.',
    introLines: ['남포는 평양 가까운 항구야.', '서해 바람과 물건이 모여.', '쌀과 한지는 여기서 잘 팔려.', '인천으로 가는 바닷길도 있어.']
  },
  {
    id: 'hamheung',
    name: '함흥',
    region: '함경',
    icon: '산',
    x: 61,
    y: 22,
    buyGoodIds: ['herbs', 'fresh_fish'],
    sellGoodIds: ['paper', 'rice'],
    scene: '/assets/scenes/east-port.webp',
    note: '산과 바다가 가까워.',
    introLines: ['함흥은 산과 바다가 가까워.', '약초와 생선을 찾기 좋아.', '짐칸을 비워 두면 편해.', '큰 장터에서 팔아보자.']
  },
  {
    id: 'wonsan',
    name: '원산',
    region: '함경',
    icon: '항구',
    x: 64,
    y: 32,
    buyGoodIds: ['fresh_fish', 'salt'],
    sellGoodIds: ['paper', 'cotton_cloth'],
    scene: '/assets/scenes/east-port.webp',
    note: '동쪽 바닷길이 열려.',
    introLines: ['원산은 동쪽 항구야.', '생선과 소금이 잘 모여.', '바닷길을 지날 땐 배가 좋아.', '서울 쪽에서 잘 팔릴 거야.']
  },
  {
    id: 'gaeseong',
    name: '개성',
    region: '경기',
    icon: '상점',
    x: 42,
    y: 33,
    buyGoodIds: ['paper', 'cotton_cloth'],
    sellGoodIds: ['citrus', 'fresh_fish'],
    scene: '/assets/scenes/market-street.webp',
    note: '상인이 많이 오가.',
    introLines: ['개성은 상인이 많이 오가.', '면포와 한지를 살펴보자.', '먼 곳 물건도 잘 팔려.', '서울과 이어진 길이 좋아.']
  },
  {
    id: 'seoul',
    name: '서울',
    region: '경기',
    icon: '궁',
    x: 47,
    y: 42,
    buyGoodIds: ['paper', 'rice'],
    sellGoodIds: ['cotton_cloth', 'dried_fish', 'salt', 'paper', 'citrus', 'fresh_fish', 'herbs', 'rice'],
    scene: '/assets/scenes/inland-city.webp',
    note: '여러 물건을 잘 사줘.',
    introLines: ['서울은 아주 큰 장터야.', '여러 물건을 잘 사줘.', '멀리서 가져온 물건이 빛나.', '돈을 모으기 좋은 곳이야.']
  },
  {
    id: 'incheon',
    name: '인천',
    region: '경기',
    kind: 'west_port',
    icon: '서해',
    x: 39,
    y: 44,
    buyGoodIds: ['salt', 'dried_fish', 'silk'],
    sellGoodIds: ['ginseng', 'ceramics', 'horse'],
    scene: '/assets/scenes/west-mudflat.webp',
    note: '서울 옆 서해 항구야.',
    introLines: ['인천은 서울 가까운 항구야.', '서해 바닷길 물건이 들어와.', '북쪽 물건은 여기서 인기야.', '서울과 남포로 길이 이어져.']
  },
  {
    id: 'chuncheon',
    name: '춘천',
    region: '강원',
    icon: '호수',
    x: 57,
    y: 39,
    buyGoodIds: ['herbs', 'rice'],
    sellGoodIds: ['salt', 'dried_fish'],
    scene: '/assets/scenes/inland-city.webp',
    note: '산길이 조용해.',
    introLines: ['춘천은 산과 물이 가까워.', '약초를 찾기 좋아.', '바닷가 물건은 귀해.', '소금이나 건어물을 가져가 보자.']
  },
  {
    id: 'gangneung',
    name: '강릉',
    region: '강원',
    icon: '바다',
    x: 71,
    y: 44,
    buyGoodIds: ['fresh_fish', 'herbs'],
    sellGoodIds: ['paper', 'salt'],
    scene: '/assets/scenes/east-port.webp',
    note: '바다와 산이 가까워.',
    introLines: ['강릉은 동쪽 바닷가야.', '생선과 약초가 좋아.', '한지는 여기서 귀해.', '안동이나 전주 물건을 가져와 보자.']
  },
  {
    id: 'andong',
    name: '안동',
    region: '경상',
    icon: '책',
    x: 59,
    y: 55,
    buyGoodIds: ['paper', 'herbs'],
    sellGoodIds: ['fresh_fish', 'salt'],
    scene: '/assets/scenes/inland-city.webp',
    note: '한지와 약초가 좋아.',
    introLines: ['안동은 조용한 고을이야.', '한지와 약초가 유명해.', '바닷가 물건을 가져오면 좋아.', '대구와 가까운 길이 있어.']
  },
  {
    id: 'daegu',
    name: '대구',
    region: '경상',
    icon: '풀',
    x: 62,
    y: 64,
    buyGoodIds: ['herbs', 'rice'],
    sellGoodIds: ['cotton_cloth', 'salt'],
    scene: '/assets/scenes/daegu-town.webp',
    note: '약초가 많아.',
    introLines: ['대구는 큰 장터가 열려.', '약초와 쌀을 살펴보자.', '면포와 소금은 잘 팔려.', '부산으로 가는 길도 가까워.']
  },
  {
    id: 'ulsan',
    name: '울산',
    region: '경상',
    icon: '항구',
    x: 67,
    y: 63,
    buyGoodIds: ['fresh_fish', 'salt'],
    sellGoodIds: ['paper', 'rice'],
    scene: '/assets/scenes/south-port.webp',
    note: '동남쪽 항구야.',
    introLines: ['울산은 바닷가 고을이야.', '생선과 소금을 보기 좋아.', '쌀이나 한지는 귀해.', '부산과 대구 사이를 이어줘.']
  },
  {
    id: 'busan',
    name: '부산',
    region: '경상',
    icon: '배',
    x: 58,
    y: 72,
    buyGoodIds: ['dried_fish', 'fresh_fish', 'cotton_cloth'],
    sellGoodIds: ['paper', 'herbs', 'rice'],
    scene: '/assets/scenes/busan-port.webp',
    note: '생선과 건어물이 좋아.',
    introLines: ['정우야, 여긴 부산이야.', '바닷길이 열려 있어.', '생선과 건어물이 잘 모여.', '다른 고을에 팔아보자.']
  },
  {
    id: 'jinju',
    name: '진주',
    region: '경상',
    icon: '성',
    x: 50,
    y: 70,
    buyGoodIds: ['rice', 'paper'],
    sellGoodIds: ['fresh_fish', 'salt'],
    scene: '/assets/scenes/inland-city.webp',
    note: '남쪽 들판이 넓어.',
    introLines: ['진주는 남쪽 들판이 넓어.', '쌀과 한지를 보기 좋아.', '바닷가 물건은 귀해.', '통영 물건을 가져오면 좋아.']
  },
  {
    id: 'tongyeong',
    name: '통영',
    region: '경상',
    icon: '물고기',
    x: 50,
    y: 75,
    buyGoodIds: ['dried_fish', 'fresh_fish'],
    sellGoodIds: ['rice', 'salt'],
    scene: '/assets/scenes/south-port.webp',
    note: '생선이 많아.',
    introLines: ['통영은 바다가 가까워.', '생선과 건어물이 많아.', '쌀은 여기서 잘 팔려.', '제주로 가는 바닷길도 있어.']
  },
  {
    id: 'jeonju',
    name: '전주',
    region: '전라',
    icon: '종이',
    x: 40,
    y: 67,
    buyGoodIds: ['paper', 'rice'],
    sellGoodIds: ['fresh_fish', 'dried_fish'],
    scene: '/assets/scenes/market-street.webp',
    note: '한지가 유명해.',
    introLines: ['전주는 한지가 유명해.', '쌀도 살펴볼 수 있어.', '생선과 건어물은 잘 팔려.', '서쪽과 남쪽 길이 이어져.']
  },
  {
    id: 'gwangju',
    name: '광주',
    region: '전라',
    icon: '쌀',
    x: 35,
    y: 73,
    buyGoodIds: ['rice', 'paper'],
    sellGoodIds: ['salt', 'fresh_fish'],
    scene: '/assets/scenes/inland-city.webp',
    note: '넓은 들판 장터야.',
    introLines: ['광주는 들판이 넓어.', '쌀과 한지를 보기 좋아.', '소금은 여기서 귀해.', '목포 물건을 가져와 보자.']
  },
  {
    id: 'suncheon',
    name: '순천',
    region: '전라',
    icon: '들',
    x: 42,
    y: 76,
    buyGoodIds: ['rice', 'herbs'],
    sellGoodIds: ['dried_fish', 'salt'],
    scene: '/assets/scenes/west-mudflat.webp',
    note: '들길과 바닷길이 만나.',
    introLines: ['순천은 들길과 바닷길이 만나.', '쌀과 약초를 볼 수 있어.', '건어물은 잘 팔려.', '여수와 가까운 길이 있어.']
  },
  {
    id: 'yeosu',
    name: '여수',
    region: '전라',
    icon: '파도',
    x: 42,
    y: 76,
    buyGoodIds: ['fresh_fish', 'dried_fish'],
    sellGoodIds: ['rice', 'paper'],
    scene: '/assets/scenes/south-port.webp',
    note: '생선이 좋아.',
    introLines: ['여수는 남쪽 항구야.', '생선과 건어물이 많아.', '쌀과 한지는 잘 팔려.', '통영으로 가는 바닷길이 있어.']
  },
  {
    id: 'mokpo',
    name: '목포',
    region: '전라',
    icon: '소금',
    x: 29,
    y: 76,
    buyGoodIds: ['salt', 'fresh_fish'],
    sellGoodIds: ['cotton_cloth', 'herbs'],
    scene: '/assets/scenes/west-mudflat.webp',
    note: '소금 바람이 불어.',
    introLines: ['목포는 서쪽 바닷가야.', '소금과 생선이 좋아.', '면포와 약초는 잘 팔려.', '제주로 가는 바닷길도 있어.']
  },
  {
    id: 'jeju',
    name: '제주',
    region: '제주',
    icon: '귤',
    x: 42,
    y: 94,
    buyGoodIds: ['citrus'],
    sellGoodIds: ['cotton_cloth', 'rice'],
    scene: '/assets/scenes/jeju.webp',
    note: '귤 향기가 나.',
    introLines: ['제주는 바람이 센 섬이야.', '귤이 아주 유명해.', '면포와 쌀은 잘 팔려.', '배가 있으면 오가기 좋아.']
  },
  {
    id: 'tsushima',
    name: '대마도',
    region: '섬 길',
    kind: 'island',
    icon: '섬',
    x: 79,
    y: 90,
    buyGoodIds: ['dried_fish', 'salt'],
    sellGoodIds: ['silk', 'ceramics', 'cotton_cloth'],
    scene: '/assets/scenes/south-port.webp',
    note: '부산과 중국 항구 사이 섬이야.',
    introLines: ['대마도는 바닷길의 섬 거점이야.', '부산에서 배로 갈 수 있어.', '비단과 도자기가 인기야.', '멀리 중국 항구로 이어져.']
  }
];

const ROUTE_SCENE_ASSETS = {
  busanDaegu: publicAsset('/assets/scenes/daegu-town.webp'),
  daeguJeonju: publicAsset('/assets/scenes/market-street.webp'),
  jeonjuMokpo: publicAsset('/assets/scenes/west-mudflat.webp'),
  mokpoJeju: publicAsset('/assets/scenes/jeju.webp'),
  busanTongyeong: publicAsset('/assets/scenes/south-port.webp'),
  tongyeongJeju: publicAsset('/assets/scenes/jeju.webp'),
  seoulGangneung: publicAsset('/assets/scenes/east-port.webp'),
  seoulPyongyang: publicAsset('/assets/scenes/inland-city.webp'),
  pyongyangSinuiju: publicAsset('/assets/scenes/west-mudflat.webp'),
  wonsanHamheung: publicAsset('/assets/scenes/east-port.webp')
};

function routeMeta(routeType: string, travelSceneAsset: string, terrain: string, eventCategories: string[], fairyText: string, arrivalHint: string, storyArcIds: string[] = []) {
  return { routeType, travelSceneAsset, terrain, eventCategories, fairyText, arrivalHint, storyArcIds };
}

export const JUNIOR_ROUTES: JuniorRoute[] = [
  { from: 'sinuiju', to: 'pyongyang', kind: 'land', scenery: 'north', distance: 2, ...routeMeta('border_river_road', ROUTE_SCENE_ASSETS.pyongyangSinuiju, '압록강 물길과 북방 장터', ['merchant', 'weather', 'north_story'], '강을 따라 북쪽 장사길을 지나가.', '신의주는 강가 물건이 모여.', ['north_merchant']) },
  { from: 'sinuiju', to: 'china_port', kind: 'sea', scenery: 'sea', distance: 2, needsBoat: true, ...routeMeta('china_river_port', publicAsset('/assets/scenes/west-mudflat.webp'), '강 끝에서 큰 항구로 가는 길', ['merchant', 'weather'], '서쪽 물길을 따라 큰 항구로 가.', '중국 항구는 비단과 도자기가 유명해.', ['north_merchant']) },
  { from: 'pyongyang', to: 'gaeseong', kind: 'land', scenery: 'plain', distance: 2 },
  { from: 'pyongyang', to: 'nampo', kind: 'land', scenery: 'river', distance: 1 },
  { from: 'nampo', to: 'incheon', kind: 'sea', scenery: 'sea', distance: 2, needsBoat: true, ...routeMeta('west_sea_capital_route', publicAsset('/assets/scenes/west-mudflat.webp'), '서해를 따라 수도권으로 가는 뱃길', ['pirate', 'weather', 'merchant'], '서해 바람을 따라 남쪽 항구로 내려가.', '인천은 서울 옆 항구야.', ['sea_dragon']) },
  { from: 'gaeseong', to: 'seoul', kind: 'land', scenery: 'marketRoad', distance: 1 },
  { from: 'seoul', to: 'incheon', kind: 'land', scenery: 'marketRoad', distance: 1 },
  { from: 'seoul', to: 'chuncheon', kind: 'land', scenery: 'river', distance: 1 },
  { from: 'seoul', to: 'andong', kind: 'land', scenery: 'mountain', distance: 2 },
  { from: 'seoul', to: 'gangneung', kind: 'land', scenery: 'mountain', distance: 2, ...routeMeta('east_mountain_road', ROUTE_SCENE_ASSETS.seoulGangneung, '한양을 떠나 산을 넘는 동쪽 길', ['animal', 'folktale', 'weather'], '높은 고개를 넘으면 동해 바람이 와.', '강릉은 바다와 솔숲이 가까워.', ['rice_cake_pass']) },
  { from: 'seoul', to: 'pyongyang', kind: 'land', scenery: 'north', distance: 3, ...routeMeta('north_capital_road', ROUTE_SCENE_ASSETS.seoulPyongyang, '성문과 강을 지나는 북방 큰길', ['merchant', 'weather', 'north_story'], '한양을 떠나 북쪽 큰길로 가 보자.', '평양은 큰 강과 장터가 있어.', ['north_merchant']) },
  { from: 'chuncheon', to: 'gangneung', kind: 'land', scenery: 'mountain', distance: 1 },
  { from: 'andong', to: 'gangneung', kind: 'land', scenery: 'mountain', distance: 1 },
  { from: 'gangneung', to: 'wonsan', kind: 'sea', scenery: 'coast', distance: 2, needsBoat: true },
  { from: 'wonsan', to: 'hamheung', kind: 'land', scenery: 'coast', distance: 1, ...routeMeta('northeast_coast_road', ROUTE_SCENE_ASSETS.wonsanHamheung, '동북 바닷가와 산길', ['weather', 'merchant', 'animal'], '바다와 산이 나란히 따라오는 길이야.', '함흥은 산과 약초가 가까워.', ['north_merchant']) },
  { from: 'hamheung', to: 'cheongjin', kind: 'sea', scenery: 'sea', distance: 2, needsBoat: true, ...routeMeta('northeast_cold_road', ROUTE_SCENE_ASSETS.wonsanHamheung, '차가운 북쪽 바닷길', ['weather', 'animal', 'merchant'], '차가운 바람이 불어도 천천히 가자.', '청진은 북쪽 바다 물건이 모여.', ['north_merchant']) },
  { from: 'cheongjin', to: 'north_port', kind: 'sea', scenery: 'sea', distance: 2, needsBoat: true, ...routeMeta('north_sea_trade_route', publicAsset('/assets/scenes/east-port.webp'), '북쪽 바다로 이어지는 먼 뱃길', ['pirate', 'weather', 'merchant'], '차가운 바다를 지나 북방 항구로 가.', '북방 항구에는 말과 먼 길 물건이 있어.', ['north_merchant']) },
  { from: 'seoul', to: 'jeonju', kind: 'land', scenery: 'plain', distance: 2 },
  { from: 'jeonju', to: 'gwangju', kind: 'land', scenery: 'plain', distance: 1 },
  { from: 'jeonju', to: 'mokpo', kind: 'land', scenery: 'river', distance: 2, ...routeMeta('west_river_salt_road', ROUTE_SCENE_ASSETS.jeonjuMokpo, '전주 들길에서 목포 갯벌로 가는 길', ['weather', 'merchant', 'folktale'], '종이 냄새가 소금 바람으로 바뀌고 있어.', '목포는 소금과 바닷길이 좋아.', ['fairy_cloth']) },
  { from: 'incheon', to: 'mokpo', kind: 'sea', scenery: 'sea', distance: 2, needsBoat: true },
  { from: 'gwangju', to: 'mokpo', kind: 'land', scenery: 'river', distance: 1 },
  { from: 'gwangju', to: 'suncheon', kind: 'land', scenery: 'plain', distance: 1 },
  { from: 'suncheon', to: 'yeosu', kind: 'land', scenery: 'coast', distance: 1 },
  { from: 'mokpo', to: 'yeosu', kind: 'sea', scenery: 'sea', distance: 1, needsBoat: true },
  { from: 'yeosu', to: 'tongyeong', kind: 'sea', scenery: 'sea', distance: 1 },
  { from: 'tongyeong', to: 'busan', kind: 'sea', scenery: 'sea', distance: 1, needsBoat: true, ...routeMeta('south_coast_market_road', ROUTE_SCENE_ASSETS.busanTongyeong, '남해 포구와 장터길', ['merchant', 'weather', 'animal'], '포구마다 생선 냄새가 가득해.', '통영은 생선과 건어물이 많아.', ['fairy_cloth']) },
  { from: 'busan', to: 'ulsan', kind: 'sea', scenery: 'coast', distance: 1, needsBoat: true },
  { from: 'ulsan', to: 'gangneung', kind: 'sea', scenery: 'coast', distance: 2, needsBoat: true },
  { from: 'ulsan', to: 'wonsan', kind: 'sea', scenery: 'sea', distance: 3, needsBoat: true },
  { from: 'ulsan', to: 'daegu', kind: 'land', scenery: 'mountain', distance: 1 },
  { from: 'busan', to: 'daegu', kind: 'land', scenery: 'mountain', distance: 1, ...routeMeta('inland_market_road', ROUTE_SCENE_ASSETS.busanDaegu, '바닷가에서 내륙 장터로 들어가는 길', ['merchant', 'bandit', 'guide'], '바다 냄새가 점점 장터 냄새로 바뀌고 있어.', '대구는 약초를 사기 좋아.', ['rice_cake_pass']) },
  { from: 'daegu', to: 'andong', kind: 'land', scenery: 'river', distance: 1 },
  { from: 'daegu', to: 'jinju', kind: 'land', scenery: 'plain', distance: 1 },
  { from: 'jinju', to: 'tongyeong', kind: 'land', scenery: 'coast', distance: 1 },
  { from: 'jeonju', to: 'daegu', kind: 'land', scenery: 'mountain', distance: 2, ...routeMeta('mountain_paper_road', ROUTE_SCENE_ASSETS.daeguJeonju, '한지 고을과 약초 장터 사이 산길', ['bandit', 'animal', 'folktale'], '고개를 넘으면 약초 장터가 가까워져.', '전주는 한지와 쌀이 좋아.', ['rice_cake_pass']) },
  { from: 'mokpo', to: 'jeju', kind: 'sea', scenery: 'sea', distance: 2, needsBoat: true, ...routeMeta('jeju_sea_route', ROUTE_SCENE_ASSETS.mokpoJeju, '넓은 바다와 멀리 보이는 섬', ['pirate', 'weather', 'sea_dragon'], '바람이 세지만 제주가 가까워지고 있어.', '제주는 귤이 유명해.', ['sea_dragon']) },
  { from: 'tongyeong', to: 'jeju', kind: 'sea', scenery: 'sea', distance: 2, needsBoat: true, ...routeMeta('island_sea_route', ROUTE_SCENE_ASSETS.tongyeongJeju, '남해 섬 사이를 지나는 뱃길', ['pirate', 'weather', 'sea_dragon'], '섬 사이로 배가 천천히 지나가.', '제주에 가면 귤을 볼 수 있어.', ['sea_dragon']) },
  { from: 'busan', to: 'jeju', kind: 'sea', scenery: 'sea', distance: 3, needsBoat: true, ...routeMeta('long_jeju_sea_route', ROUTE_SCENE_ASSETS.mokpoJeju, '부산에서 제주로 가는 먼 바닷길', ['pirate', 'weather', 'sea_dragon'], '먼 바닷길이야. 바람을 잘 보자.', '제주는 바람과 귤이 기다려.', ['sea_dragon']) },
  { from: 'busan', to: 'tsushima', kind: 'sea', scenery: 'sea', distance: 1, needsBoat: true, ...routeMeta('tsushima_sea_gate', publicAsset('/assets/scenes/south-port.webp'), '부산에서 섬 거점으로 가는 짧은 뱃길', ['pirate', 'weather', 'merchant'], '부산 앞바다를 지나 작은 섬으로 가.', '대마도는 바닷길 중간 장터야.', ['sea_dragon']) },
  { from: 'tsushima', to: 'china_port', kind: 'sea', scenery: 'sea', distance: 3, needsBoat: true, ...routeMeta('china_trade_sea_route', publicAsset('/assets/scenes/market-street.webp'), '섬을 지나 큰 항구로 가는 먼 바닷길', ['pirate', 'weather', 'merchant'], '먼 바다 끝에 큰 항구가 보여.', '중국 항구는 비단과 도자기가 유명해.', ['sea_dragon']) },
  { from: 'incheon', to: 'gaeseong', kind: 'land', scenery: 'marketRoad', distance: 1 },
  { from: 'gaeseong', to: 'nampo', kind: 'land', scenery: 'river', distance: 1 },
  { from: 'nampo', to: 'sinuiju', kind: 'sea', scenery: 'sea', distance: 2, needsBoat: true },
  { from: 'pyongyang', to: 'hamheung', kind: 'land', scenery: 'north', distance: 2 },
  { from: 'chuncheon', to: 'andong', kind: 'land', scenery: 'mountain', distance: 2 },
  { from: 'andong', to: 'jeonju', kind: 'land', scenery: 'plain', distance: 2 },
  { from: 'andong', to: 'jinju', kind: 'land', scenery: 'plain', distance: 2 },
  { from: 'daegu', to: 'gwangju', kind: 'land', scenery: 'plain', distance: 2 },
  { from: 'daegu', to: 'yeosu', kind: 'land', scenery: 'coast', distance: 2 },
  { from: 'jeonju', to: 'suncheon', kind: 'land', scenery: 'plain', distance: 1 },
  { from: 'jeonju', to: 'jinju', kind: 'land', scenery: 'plain', distance: 2 },
  { from: 'gwangju', to: 'yeosu', kind: 'land', scenery: 'coast', distance: 1 },
  { from: 'mokpo', to: 'suncheon', kind: 'land', scenery: 'river', distance: 1 },
  { from: 'suncheon', to: 'tongyeong', kind: 'sea', scenery: 'sea', distance: 1, needsBoat: true },
  { from: 'yeosu', to: 'busan', kind: 'sea', scenery: 'sea', distance: 2, needsBoat: true },
  { from: 'mokpo', to: 'busan', kind: 'sea', scenery: 'sea', distance: 3, needsBoat: true },
  { from: 'wonsan', to: 'cheongjin', kind: 'sea', scenery: 'sea', distance: 2, needsBoat: true },
  { from: 'china_port', to: 'incheon', kind: 'sea', scenery: 'sea', distance: 3, needsBoat: true }
];

export const JUNIOR_VEHICLES: JuniorVehicle[] = [
  { id: 'bundle', name: '보따리', cost: 0, cargoLimit: 2, text: '처음 짐', image: publicAsset('/assets/vehicles/polished-cart-bundle.png'), kind: 'cart', shortBenefit: '땅길 짐칸 2칸', routeBenefit: '가까운 장터길', childDescription: '처음 쓰는 작은 짐이야.' },
  { id: 'handcart', name: '손수레', cost: 100, cargoLimit: 3, text: '땅길 짐칸 +1', image: publicAsset('/assets/vehicles/polished-cart-handcart.png'), kind: 'cart', shortBenefit: '땅길 짐칸 3칸', routeBenefit: '장터길이 편해', childDescription: '짐을 하나 더 실어.' },
  { id: 'big_cart', name: '큰 수레', cost: 190, cargoLimit: 4, text: '더 많이 실어', image: publicAsset('/assets/vehicles/polished-cart-large.png'), kind: 'cart', shortBenefit: '땅길 짐칸 4칸', routeBenefit: '먼 장터길도 좋아', childDescription: '물건을 더 많이 싣기 좋아.' },
  { id: 'merchant_cart', name: '장사 수레', cost: 300, cargoLimit: 5, text: '먼 장사 가기 좋아', image: publicAsset('/assets/vehicles/polished-cart-merchant.png'), kind: 'cart', shortBenefit: '땅길 짐칸 5칸', routeBenefit: '먼 장사길 준비', childDescription: '먼 길 장사도 든든해.' }
];

export const JUNIOR_BOATS: JuniorBoat[] = [
  { id: 'none', name: '배 없음', cost: 0, cargoLimit: 0, text: '바닷길은 아직 어려워', image: publicAsset('/assets/ui/result-ship.png'), kind: 'boat', shortBenefit: '바닷길 준비 전', routeBenefit: '배가 필요해', childDescription: '작은 나룻배를 장만하면 바닷길을 볼 수 있어.' },
  { id: 'small_ferry', name: '작은 나룻배', cost: 200, cargoLimit: 2, text: '가까운 바닷길에 좋아', image: publicAsset('/assets/boats/small_ferry.png'), kind: 'boat', shortBenefit: '바닷길 짐칸 2칸', routeBenefit: '가까운 바닷길', childDescription: '목포에서 제주 길을 살펴볼 수 있어.' },
  { id: 'sailboat', name: '작은 돛배', cost: 360, cargoLimit: 3, text: '먼 바닷길도 든든해', image: publicAsset('/assets/boats/sailboat.png'), kind: 'boat', shortBenefit: '바닷길 짐칸 3칸', routeBenefit: '섬 길이 편해', childDescription: '섬까지 가는 길이 더 편해져.' },
  { id: 'sturdy_sailboat', name: '튼튼한 돛배', cost: 520, cargoLimit: 4, text: '큰 파도에도 든든해', image: publicAsset('/assets/boats/sturdy_sailboat.png'), kind: 'boat', shortBenefit: '바닷길 짐칸 4칸', routeBenefit: '긴 바닷길 준비', childDescription: '파도가 센 길도 마음이 놓여.' },
  { id: 'merchant_ship', name: '장사배', cost: 720, cargoLimit: 5, text: '멀리 장사 가기 좋아', image: publicAsset('/assets/boats/merchant_ship.png'), kind: 'boat', shortBenefit: '바닷길 짐칸 5칸', routeBenefit: '먼 바다 장사', childDescription: '멀리 물건을 실어 나르기 좋아.' }
];

export const CITY_BACKGROUND_ASSETS: Record<JuniorCityId, string> = {
  china_port: publicAsset('/assets/scenes/market-street.webp'),
  seoul: publicAsset('/assets/scenes/inland-city.webp'),
  incheon: publicAsset('/assets/scenes/west-mudflat.webp'),
  gaeseong: publicAsset('/assets/scenes/market-street.webp'),
  pyongyang: publicAsset('/assets/scenes/inland-city.webp'),
  nampo: publicAsset('/assets/scenes/west-mudflat.webp'),
  sinuiju: publicAsset('/assets/scenes/west-mudflat.webp'),
  chuncheon: publicAsset('/assets/scenes/inland-city.webp'),
  gangneung: publicAsset('/assets/scenes/east-port.webp'),
  wonsan: publicAsset('/assets/scenes/east-port.webp'),
  hamheung: publicAsset('/assets/scenes/east-port.webp'),
  cheongjin: publicAsset('/assets/scenes/east-port.webp'),
  andong: publicAsset('/assets/scenes/inland-city.webp'),
  daegu: publicAsset('/assets/scenes/daegu-town.webp'),
  ulsan: publicAsset('/assets/scenes/south-port.webp'),
  busan: publicAsset('/assets/scenes/busan-port.webp'),
  jinju: publicAsset('/assets/scenes/inland-city.webp'),
  tongyeong: publicAsset('/assets/scenes/south-port.webp'),
  jeonju: publicAsset('/assets/scenes/market-street.webp'),
  gwangju: publicAsset('/assets/scenes/inland-city.webp'),
  suncheon: publicAsset('/assets/scenes/west-mudflat.webp'),
  yeosu: publicAsset('/assets/scenes/south-port.webp'),
  mokpo: publicAsset('/assets/scenes/west-mudflat.webp'),
  jeju: publicAsset('/assets/scenes/jeju.webp'),
  tsushima: publicAsset('/assets/scenes/south-port.webp'),
  north_port: publicAsset('/assets/scenes/east-port.webp')
};

const CITY_KIND_ASSETS: Record<JuniorCityId, NonNullable<JuniorCity['kind']>> = {
  seoul: 'inland_market',
  incheon: 'west_port',
  gaeseong: 'inland_market',
  pyongyang: 'inland_market',
  nampo: 'west_port',
  sinuiju: 'north_trade_port',
  chuncheon: 'inland_market',
  gangneung: 'east_port',
  wonsan: 'east_port',
  hamheung: 'east_port',
  cheongjin: 'north_trade_port',
  andong: 'inland_market',
  daegu: 'inland_market',
  jeonju: 'inland_market',
  gwangju: 'inland_market',
  mokpo: 'west_port',
  yeosu: 'south_port',
  suncheon: 'inland_market',
  jinju: 'inland_market',
  tongyeong: 'south_port',
  busan: 'south_port',
  ulsan: 'east_port',
  jeju: 'island',
  tsushima: 'island',
  china_port: 'north_trade_port',
  north_port: 'north_trade_port'
};

JUNIOR_CITIES.forEach((city) => {
  city.backgroundAsset = CITY_BACKGROUND_ASSETS[city.id];
  city.kind = CITY_KIND_ASSETS[city.id];
});


function spellingEvent(
  id: string,
  type: JuniorEvent['type'],
  routeKind: JuniorEvent['routeKind'],
  title: string,
  scene: string,
  fairyText: string,
  options: string[],
  answer: string,
  correctText: string,
  wrongText: string,
  reward: JuniorReward = { stars: 1 },
  wrongReward: JuniorReward = { coins: -5 },
  storyArcId?: string,
  storyStage?: number,
  routeTypes?: string[]
): JuniorEvent {
  const mood: JuniorEvent['mood'] = type === 'quiz_bandit' || type === 'quiz_pirate' || type === 'quiz_animal' ? 'bad' : type === 'quiz_merchant' ? 'good' : type === 'quiz_folktale' ? 'story' : 'talk';
  const chancePercent: JuniorEvent['chancePercent'] = mood === 'bad' ? 3 : mood === 'good' ? 2 : 1;
  return {
    id,
    type,
    mood,
    chancePercent,
    routeKind,
    routeTypes,
    storyArcId,
    storyStage,
    title,
    scene,
    fairyText,
    quiz: {
      question: '바른 말은?',
      options,
      answer,
      correctText,
      wrongText,
      reward,
      wrongReward
    }
  };
}

export const JUNIOR_EVENTS: JuniorEvent[] = [
  spellingEvent('tutorial_spelling_1', 'quiz_merchant', 'land', '첫 말놀이', 'merchant', '물건 이름을 바르게 골라보자.', ['소금', '소굼'], '소금', '정답! 아주 잘했어.', '괜찮아. 소금은 이렇게 써.', { stars: 1 }, { coins: -1 }),
  spellingEvent('folktale_tiger_3', 'quiz_folktale', 'land', '호랑이 그림자', 'tiger', '정우야, 바른 말을 고르면 고개를 지나갈 수 있어.', ['떡', '덕', '떧'], '떡', '정답! 호랑이가 얌전히 물러났어.', '괜찮아. 떡을 다시 싸 보자.', { stars: 1, storyClues: 1 }, { coins: -5 }, 'rice_cake_pass', 3, ['inland_market_road', 'mountain_paper_road', 'east_mountain_road']),
  spellingEvent('folktale_tiger_4', 'quiz_folktale', 'land', '산길 배지', 'tiger', '마지막으로 고개 이름을 바르게 골라봐.', ['고개', '고게', '고걔'], '고개', '정답! 산길 배지를 받았어.', '괜찮아. 천천히 다시 읽어보자.', { badge: '산길 배지', stars: 1 }, { coins: -5 }, 'rice_cake_pass', 4, ['inland_market_road', 'mountain_paper_road', 'east_mountain_road']),
  spellingEvent('fairy_cloth_3', 'quiz_folktale', 'land', '반짝이는 옷감', 'fairy_cloth', '강가에서 옷감이 반짝여. 바른 말을 골라 돌려주자.', ['돌려줘', '돌려조', '돌려줘요요'], '돌려줘', '정답! 옷감이 하늘빛으로 빛났어.', '괜찮아. 조심히 다시 접어보자.', { storyClues: 1 }, { coins: -5 }, 'fairy_cloth', 3, ['west_river_salt_road', 'south_coast_market_road']),
  spellingEvent('fairy_cloth_4', 'quiz_folktale', 'land', '선녀의 고마움', 'fairy_cloth', '선녀가 고마운 마음을 전하고 있어.', ['고마워', '고마오', '고마워어'], '고마워', '정답! 별빛을 받았어.', '괜찮아. 바람이가 도와줄게.', { stars: 1, storyClues: 1 }, { coins: -5 }, 'fairy_cloth', 4, ['west_river_salt_road', 'south_coast_market_road']),
  spellingEvent('sea_dragon_1', 'quiz_folktale', 'sea', '용왕의 물결', 'sea_dragon', '파도가 높아졌어. 바른 말을 고르면 길이 열려.', ['물결', '물껼', '물결르'], '물결', '정답! 물결이 잔잔해졌어.', '괜찮아. 배를 천천히 돌리자.', { stars: 1 }, { coins: -5 }, 'sea_dragon', 1, ['jeju_sea_route', 'island_sea_route', 'long_jeju_sea_route']),
  spellingEvent('sea_dragon_2', 'quiz_folktale', 'sea', '바다의 약속', 'sea_dragon', '용왕이 쉬운 말을 물어봐.', ['바다', '받아', '바따'], '바다', '정답! 순풍이 불었어.', '괜찮아. 잠깐 쉬어 가자.', { storyClues: 1 }, { coins: -5 }, 'sea_dragon', 2, ['jeju_sea_route', 'island_sea_route', 'long_jeju_sea_route']),
  spellingEvent('sea_dragon_3', 'quiz_folktale', 'sea', '섬 그림자', 'sea_dragon', '멀리 섬이 보여. 바른 말을 골라보자.', ['제주', '재주', '제쥬'], '제주', '정답! 제주가 가까워졌어.', '괜찮아. 다시 방향을 잡자.', { stars: 1 }, { coins: -5 }, 'sea_dragon', 3, ['jeju_sea_route', 'island_sea_route', 'long_jeju_sea_route']),
  spellingEvent('sea_dragon_4', 'quiz_folktale', 'sea', '순풍 선물', 'sea_dragon', '마지막 말만 맞히면 바람이 도와줘.', ['순풍', '순퐁', '숨풍'], '순풍', '정답! 바다 배지를 받았어.', '괜찮아. 파도는 곧 잔잔해져.', { badge: '바다길 배지', stars: 1 }, { coins: -5 }, 'sea_dragon', 4, ['jeju_sea_route', 'island_sea_route', 'long_jeju_sea_route']),
  spellingEvent('north_merchant_1', 'quiz_merchant', 'land', '북방 장사꾼', 'north_merchant', '장사꾼이 물건 이름을 물어봐.', ['인삼', '인쌈', '인삼이이'], '인삼', '정답! 북쪽 길 이야기를 들었어.', '괜찮아. 다음에 다시 물어보자.', { coins: 5 }, { coins: -5 }, 'north_merchant', 1, ['north_capital_road', 'border_river_road', 'northeast_coast_road', 'northeast_cold_road']),
  spellingEvent('north_merchant_2', 'quiz_merchant', 'land', '강가 장터', 'north_merchant', '강가에서 바른 말을 골라봐.', ['강가', '강까', '간가'], '강가', '정답! 장터길을 배웠어.', '괜찮아. 천천히 다시 보자.', { storyClues: 1 }, { coins: -5 }, 'north_merchant', 2, ['north_capital_road', 'border_river_road', 'northeast_coast_road', 'northeast_cold_road']),
  spellingEvent('north_merchant_3', 'quiz_merchant', 'land', '먼 길 추천', 'north_merchant', '상인이 팔기 좋은 말을 물어봐.', ['약초', '약쵸', '약초오'], '약초', '정답! 약초를 기억했어.', '괜찮아. 바람이가 다시 알려줄게.', { coins: 5 }, { coins: -5 }, 'north_merchant', 3, ['north_capital_road', 'border_river_road', 'northeast_coast_road', 'northeast_cold_road']),
  spellingEvent('north_merchant_4', 'quiz_merchant', 'land', '북방 길 배지', 'north_merchant', '마지막으로 바른 인사를 골라봐.', ['고마워', '고마오', '고마워어'], '고마워', '정답! 북방 길 배지를 받았어.', '괜찮아. 다음 길에서 또 해보자.', { badge: '북방 길 배지', stars: 1 }, { coins: -5 }, 'north_merchant', 4, ['north_capital_road', 'border_river_road', 'northeast_coast_road', 'northeast_cold_road']),
  spellingEvent('bandit_spelling_1', 'quiz_bandit', 'land', '길동무의 말놀이', 'bandit', '바른 말을 고르면 지나갈 수 있어.', ['맛춤법', '맞춤법', '맟춤법'], '맞춤법', '정답! 길이 열렸어.', '괜찮아. 짐 하나를 다시 묶었어.', { stars: 1 }, { coins: -5, loseCargo: 1 }),
  spellingEvent('bandit_spelling_2', 'quiz_bandit', 'land', '길동무 말놀이', 'bandit', '길동무가 바른 말을 묻고 있어.', ['괜찮아', '괜찬아', '괜차나'], '괜찮아', '정답! 길동무가 웃었어.', '조금 돌아가느라 돈을 썼어.'),
  spellingEvent('bandit_spelling_3', 'quiz_bandit', 'land', '고개 말놀이', 'bandit', '바른 낱말을 골라보자.', ['어떻게', '어떡해', '어떠케'], '어떻게', '정답! 수레가 지나갔어.', '천천히 다시 가자.', { coins: 5 }, { coins: -5 }),
  spellingEvent('bandit_spelling_4', 'quiz_bandit', 'land', '숲길 말놀이', 'bandit', '헷갈리는 말을 골라야 해.', ['가르치다', '가리키다', '가르키다'], '가르치다', '정답! 길동무가 끄덕였어.', '조금 헤매다 지나갔어.'),
  spellingEvent('bandit_spelling_5', 'quiz_bandit', 'land', '다리 앞 말놀이', 'bandit', '바르게 쓴 말을 찾아보자.', ['며칠', '몇일', '멧일'], '며칠', '정답! 다리를 건넜어.', '돈을 조금 내고 건넜어.'),
  spellingEvent('bandit_spelling_6', 'quiz_bandit', 'land', '장터길 말놀이', 'bandit', '침착하게 바른 말을 골라봐.', ['안 돼', '안 되', '않 돼'], '안 돼', '정답! 길이 환해졌어.', '괜찮아. 다시 묶고 가자.', { stars: 1 }, { coins: -5, loseCargo: 1 }),
  spellingEvent('pirate_spelling_1', 'quiz_pirate', 'sea', '바다 말놀이꾼', 'pirate', '맞춤말을 맞히면 지나갈 수 있어.', ['바닷길', '바다길', '바닫길'], '바닷길', '정답! 바닷길이 열렸어.', '파도가 높아 조금 돌아갔어.'),
  spellingEvent('pirate_spelling_2', 'quiz_pirate', 'sea', '바다 말문제', 'pirate', '바른 말을 고르면 무사히 지나가.', ['돛단배', '돗단배', '돛딴배'], '돛단배', '정답! 바람이 도와줬어.', '배를 천천히 돌렸어.', { stars: 1 }, { coins: -5, loseCargo: 1 }),
  spellingEvent('pirate_spelling_3', 'quiz_pirate', 'sea', '바다 위 퀴즈', 'pirate', '차분히 보고 골라봐.', ['도착', '도작', '도착크'], '도착', '정답! 곧 항구에 닿아.', '조금 늦었지만 괜찮아.', { coins: 5 }, { coins: -5 }),
  spellingEvent('pirate_spelling_4', 'quiz_pirate', 'sea', '안개 속 말놀이', 'pirate', '안개 속에서도 바른 말을 찾아보자.', ['물결', '물껼', '물결르'], '물결', '정답! 물길이 열렸어.', '조금 돌아서 갔어.'),
  spellingEvent('pirate_spelling_5', 'quiz_pirate', 'sea', '섬 앞 말놀이', 'pirate', '섬 이름보다 말을 먼저 골라야 해.', ['괜히', '괜이', '괜히이'], '괜히', '정답! 모두 웃으며 보내줬어.', '돈을 조금 썼어.'),
  spellingEvent('pirate_spelling_6', 'quiz_pirate', 'sea', '큰 파도 말놀이', 'pirate', '바른 말을 고르면 파도를 넘어가.', ['금세', '금새', '금쎄'], '금세', '정답! 금세 지나갔어.', '잠깐 멈췄다가 갔어.'),
  spellingEvent('animal_spelling_1', 'quiz_animal', 'land', '산길의 멧돼지', 'animal', '놀라지 말고 바른 말을 골라봐.', ['멧돼지', '멧되찌', '메돼지'], '멧돼지', '정답! 조용히 지나갔어.', '짐 하나가 흔들렸어.', { stars: 1 }, { loseCargo: 1 }),
  spellingEvent('animal_spelling_2', 'quiz_animal', 'land', '숲속 까치', 'animal', '까치가 글자를 물어봤어.', ['까치', '가치', '깟치'], '까치', '정답! 까치가 길을 알려줬어.', '조금 돌아갔어.'),
  spellingEvent('animal_spelling_3', 'quiz_animal', 'land', '산토끼의 질문', 'animal', '토끼가 뛰기 전에 골라보자.', ['토끼', '토기', '톳끼'], '토끼', '정답! 산길이 편해졌어.', '천천히 따라갔어.'),
  spellingEvent('animal_spelling_4', 'quiz_animal', 'land', '강가의 오리', 'animal', '강가에서 바른 말을 찾아보자.', ['헤엄', '해엄', '헤염'], '헤엄', '정답! 강가를 잘 지났어.', '물이 튀어 조금 늦었어.'),
  spellingEvent('animal_spelling_5', 'quiz_animal', 'any', '길 잃은 강아지', 'animal', '강아지가 바른 말을 찾고 있어.', ['강아지', '강아쥐', '강하지'], '강아지', '정답! 강아지가 고마워했어.', '괜찮아. 다시 찾아보자.', { stars: 1 }, { coins: -5 }),
  spellingEvent('merchant_spelling_1', 'quiz_merchant', 'any', '친절한 상인', 'merchant', '상인이 맞춤말을 물어봐.', ['장터', '장텨', '장터어'], '장터', '정답! 상인이 돈을 보태줬어.', '상인이 다음에 알려준대.', { coins: 5 }, { coins: -5 }),
  spellingEvent('merchant_spelling_2', 'quiz_merchant', 'any', '보따리 상인', 'merchant', '바르게 쓰면 물건을 잘 묶어줘.', ['보따리', '봇다리', '보따리이'], '보따리', '정답! 짐이 단단해졌어.', '묶느라 조금 늦었어.'),
  spellingEvent('merchant_spelling_3', 'quiz_merchant', 'any', '길 안내 상인', 'merchant', '상인이 길말을 물어봐.', ['왼쪽', '왼족', '외쪽'], '왼쪽', '정답! 지름길을 찾았어.', '먼 길로 돌아갔어.'),
  spellingEvent('merchant_spelling_4', 'quiz_merchant', 'any', '장사 선배', 'merchant', '선배 상인이 시험을 냈어.', ['팔기', '팔끼', '팔기이'], '팔기', '정답! 칭찬을 받았어.', '다음에 다시 해보자.'),
  spellingEvent('merchant_spelling_5', 'quiz_merchant', 'any', '웃는 상인', 'merchant', '상인이 쉬운 말을 보여줘.', ['고마워', '고마워어', '고마오'], '고마워', '정답! 별을 받았어.', '상인이 웃으며 보내줬어.', { stars: 1 }, { coins: -5 }),
  spellingEvent('weather_spelling_1', 'quiz_weather', 'land', '비 오는 길', 'rain', '비가 와도 차분히 골라보자.', ['우산', '우싼', '우산느'], '우산', '정답! 비를 잘 피했어.', '비를 피해 조금 쉬었어.'),
  spellingEvent('weather_spelling_2', 'quiz_weather', 'sea', '센 바람', 'wind', '바람 속에서 바른 말을 찾아봐.', ['바람', '바람므', '바람이이'], '바람', '정답! 바람이 도와줬어.', '돛을 잠깐 접었어.'),
  spellingEvent('weather_spelling_3', 'quiz_weather', 'any', '햇살 좋은 날', 'sun', '좋은 날에도 바른 말을 골라봐.', ['햇살', '해살', '햇쌀'], '햇살', '정답! 장터가 환해졌어.', '잠깐 쉬었다 갔어.', { coins: 5 }, { coins: -5 }),
  spellingEvent('folktale_rice_cake_1', 'quiz_folktale', 'land', '떡 고개 이야기', 'rice_cake', '떡을 나누면 고개 길이 환해져.', ['떡', '덕', '떡ㄱ'], '떡', '정답! 고개 길이 열렸어.', '괜찮아. 떡을 다시 싸 보자.', { storyClues: 1 }, { coins: -5 }, 'rice_cake_pass', 1),
  spellingEvent('folktale_rice_cake_2', 'quiz_folktale', 'land', '떡 바구니', 'rice_cake', '바구니 글자를 바르게 골라봐.', ['바구니', '바구니이', '바군이'], '바구니', '정답! 떡 향기가 길을 알려줬어.', '조금 쉬었다 가자.', { stars: 1 }, { coins: -5 }, 'rice_cake_pass', 2),
  spellingEvent('folktale_fairy_cloth_1', 'quiz_folktale', 'any', '선녀의 옷감', 'fairy_cloth', '잃어버린 옷감을 찾아주자.', ['옷감', '옫감', '옷깜'], '옷감', '정답! 선녀가 고마워했어.', '괜찮아. 다시 찾아보자.', { storyClues: 1 }, { coins: -5 }, 'fairy_cloth', 1),
  spellingEvent('folktale_fairy_cloth_2', 'quiz_folktale', 'any', '하늘빛 실', 'fairy_cloth', '하늘빛 실 이름을 골라봐.', ['하늘', '하눌', '하늘르'], '하늘', '정답! 장부가 반짝였어.', '실이 엉켜 잠깐 쉬었어.', { storyClues: 1 }, { coins: -5 }, 'fairy_cloth', 2),
  { id: 'book_glow', type: 'story', mood: 'story', chancePercent: 1, routeKind: 'any', title: '장부가 반짝', scene: 'book', fairyText: '장부가 살짝 빛났어.', reward: { storyClues: 1 } },
  { id: 'cart_goal', type: 'growth', mood: 'talk', chancePercent: 1, routeKind: 'any', title: '새 수레 생각', scene: 'cart', fairyText: '돈을 모으면 더 큰 수레를 장만할 수 있어.' },
  { id: 'home_hint', type: 'ending', mood: 'story', chancePercent: 1, routeKind: 'any', title: '집으로 가는 빛', scene: 'home', fairyText: '300냥을 모으면 장부가 문처럼 열려.' }
];

export const JUNIOR_REGIONAL_EVENTS: JuniorRegionalEvent[] = [
  {
    id: 'busan_merchant_dried_fish',
    cityId: 'busan',
    type: 'merchant_rumor',
    title: '장터 소문',
    speaker: '부산 상인',
    text: '부산은 바닷길이 좋아. 건어물이 많이 모여.',
    fairyText: '정우야, 건어물은 내륙 장터에서 인기야.',
    hintGoodId: 'dried_fish',
    relatedCityId: 'daegu',
    chance: 0.3
  },
  {
    id: 'busan_dialect_welcome',
    cityId: 'busan',
    type: 'dialect',
    title: '지역 말맛',
    speaker: '부산 상인',
    text: '어서 오이소!',
    fairyText: '부산에서는 이렇게 반갑게 말하기도 해.',
    chance: 0.3,
    once: true
  },
  {
    id: 'busan_landmark_port',
    cityId: 'busan',
    type: 'landmark',
    title: '부산 항구',
    speaker: '바람이',
    text: '부산은 큰 항구야. 배와 장터가 늘 바빠.',
    fairyText: '생선과 건어물이 많이 모이는 곳이야.',
    hintGoodId: 'fresh_fish',
    chance: 0.2,
    once: true
  },
  {
    id: 'daegu_merchant_herbs',
    cityId: 'daegu',
    type: 'merchant_rumor',
    title: '장터 소문',
    speaker: '대구 상인',
    text: '대구 장터엔 약초 이야기가 많아.',
    fairyText: '약초는 바닷가 도시에서 찾는 사람이 있어.',
    hintGoodId: 'herbs',
    relatedCityId: 'busan',
    chance: 0.3
  },
  {
    id: 'daegu_landmark_market',
    cityId: 'daegu',
    type: 'landmark',
    title: '대구 장터',
    speaker: '바람이',
    text: '대구는 내륙 장사길의 중심이야.',
    fairyText: '약초와 쌀을 기억해 두자.',
    hintGoodId: 'herbs',
    chance: 0.2,
    once: true
  },
  {
    id: 'jeonju_merchant_paper',
    cityId: 'jeonju',
    type: 'merchant_rumor',
    title: '장터 소문',
    speaker: '전주 상인',
    text: '전주는 한지가 유명해. 종이 물건을 잘 살펴봐.',
    fairyText: '한지는 큰 장터에서 값이 좋아.',
    hintGoodId: 'paper',
    relatedCityId: 'seoul',
    chance: 0.3
  },
  {
    id: 'jeonju_dialect_easy',
    cityId: 'jeonju',
    type: 'dialect',
    title: '지역 말맛',
    speaker: '전주 상인',
    text: '천천히 보고 가셔.',
    fairyText: '전주 장터는 여유로운 느낌이야.',
    chance: 0.3,
    once: true
  },
  {
    id: 'mokpo_merchant_salt',
    cityId: 'mokpo',
    type: 'merchant_rumor',
    title: '장터 소문',
    speaker: '목포 상인',
    text: '목포는 소금 바람이 세지.',
    fairyText: '소금은 내륙으로 가져가면 좋아.',
    hintGoodId: 'salt',
    relatedCityId: 'gwangju',
    chance: 0.3
  },
  {
    id: 'mokpo_landmark_mudflat',
    cityId: 'mokpo',
    type: 'landmark',
    title: '목포 갯벌',
    speaker: '바람이',
    text: '목포는 서해와 갯벌이 가까워.',
    fairyText: '소금과 생선 이야기가 많아.',
    hintGoodId: 'salt',
    chance: 0.2,
    once: true
  },
  {
    id: 'jeju_merchant_citrus',
    cityId: 'jeju',
    type: 'merchant_rumor',
    title: '장터 소문',
    speaker: '제주 상인',
    text: '제주는 귤과 말 이야기가 많아.',
    fairyText: '귤은 멀리 가져가면 좋아.',
    hintGoodId: 'citrus',
    relatedCityId: 'seoul',
    chance: 0.3
  },
  {
    id: 'jeju_dialect_welcome',
    cityId: 'jeju',
    type: 'dialect',
    title: '지역 말맛',
    speaker: '제주 상인',
    text: '혼저 옵서예!',
    fairyText: '제주에서는 어서 오라는 뜻이래.',
    chance: 0.3,
    once: true
  },
  {
    id: 'jeju_landmark_halla',
    cityId: 'jeju',
    type: 'landmark',
    title: '한라산 이야기',
    speaker: '바람이',
    text: '제주는 한라산과 귤이 유명해.',
    fairyText: '바람이 세고 바다가 넓어.',
    hintGoodId: 'citrus',
    chance: 0.2,
    once: true
  },
  {
    id: 'seoul_landmark_palace',
    cityId: 'seoul',
    type: 'landmark',
    title: '한양 이야기',
    speaker: '바람이',
    text: '한양에는 큰 궁과 장터가 있어.',
    fairyText: '사람이 많아서 여러 물건이 잘 팔려.',
    chance: 0.2,
    once: true
  },
  {
    id: 'gangneung_dialect_sea',
    cityId: 'gangneung',
    type: 'dialect',
    title: '지역 말맛',
    speaker: '강릉 상인',
    text: '바닷바람이 세지?',
    fairyText: '동해 쪽 말투도 조금 달라.',
    chance: 0.3,
    once: true
  },
  {
    id: 'gangneung_landmark_east_sea',
    cityId: 'gangneung',
    type: 'landmark',
    title: '동해 바다',
    speaker: '바람이',
    text: '강릉은 동해 바다가 가까워.',
    fairyText: '바닷가에서 생선 이야기가 많아.',
    hintGoodId: 'fresh_fish',
    chance: 0.2,
    once: true
  },
  {
    id: 'andong_landmark_books',
    cityId: 'andong',
    type: 'landmark',
    title: '안동 이야기',
    speaker: '바람이',
    text: '안동에는 고택과 책 이야기가 많아.',
    fairyText: '한지와 글 공부에 어울리는 곳이야.',
    hintGoodId: 'paper',
    chance: 0.2,
    once: true
  },
  {
    id: 'gwangju_landmark_field',
    cityId: 'gwangju',
    type: 'landmark',
    title: '넓은 들',
    speaker: '바람이',
    text: '광주는 넓은 들과 장터가 있어.',
    fairyText: '쌀과 곡식 이야기가 많아.',
    hintGoodId: 'rice',
    chance: 0.2,
    once: true
  },
  {
    id: 'tongyeong_landmark_boats',
    cityId: 'tongyeong',
    type: 'landmark',
    title: '남해 바다',
    speaker: '바람이',
    text: '통영은 남해 바다와 배 이야기가 많아.',
    fairyText: '생선과 건어물이 잘 모여.',
    hintGoodId: 'dried_fish',
    chance: 0.2,
    once: true
  },
  {
    id: 'pyongyang_landmark_river',
    cityId: 'pyongyang',
    type: 'landmark',
    title: '큰 강 이야기',
    speaker: '바람이',
    text: '평양은 큰 강과 장터 이야기가 있어.',
    fairyText: '북쪽 길의 중요한 도시야.',
    chance: 0.2,
    once: true
  },
  {
    id: 'spring_flower_road',
    cityId: 'seoul',
    type: 'season',
    title: '봄길',
    speaker: '바람이',
    text: '길가에 꽃이 피었어.',
    fairyText: '오늘은 장사길이 밝아 보여!',
    chance: 0.15,
    season: 'spring'
  },
  {
    id: 'autumn_leaf_road',
    cityId: 'andong',
    type: 'season',
    title: '가을길',
    speaker: '바람이',
    text: '단풍이 예쁘게 물들었어.',
    fairyText: '정우가 길을 더 잘 기억할 수 있겠어.',
    chance: 0.15,
    season: 'autumn'
  }
];

type JuniorStoryEventSeed = {
  id: string;
  title: string;
  storySource: string;
  category: JuniorStoryCategory;
  regionId: string;
  mountainId?: JuniorStoryEvent['mountainId'];
  routeId?: string;
  triggerType: JuniorStoryTriggerType;
  prerequisiteEventIds?: string[];
  rumorCityIds: JuniorCityId[];
  marker: string;
  rumor: string;
  event: string;
  solution: string;
  choice: string;
  result: string;
  quiz?: JuniorStoryEvent['quiz'];
  requiredGoodId?: JuniorGoodId;
  reward: JuniorReward;
  childSafetyNotes: string;
  chainId?: string;
  chainStep?: number;
};

function juniorStoryEvent(seed: JuniorStoryEventSeed): JuniorStoryEvent {
  return {
    id: seed.id,
    title: seed.title,
    storySource: seed.storySource,
    category: seed.category,
    regionId: seed.regionId,
    mountainId: seed.mountainId,
    routeId: seed.routeId,
    triggerType: seed.triggerType,
    prerequisiteEventIds: seed.prerequisiteEventIds ?? [],
    rumorCityIds: seed.rumorCityIds,
    mapMarker: { label: seed.marker, status: 'rumor' },
    dialogueCuts: [
      { type: 'rumor', speaker: '소문꾼', text: seed.rumor },
      { type: 'event', speaker: '바람이', text: seed.event },
      { type: 'solution', speaker: '정우', text: seed.solution }
    ],
    choices: [{ label: seed.choice, resultText: seed.result, reward: seed.reward }],
    quiz: seed.quiz,
    requiredGoodId: seed.requiredGoodId,
    reward: seed.reward,
    childSafetyNotes: seed.childSafetyNotes,
    once: true,
    chainId: seed.chainId,
    chainStep: seed.chainStep
  };
}

export const JUNIOR_MOUNTAINS: JuniorMountainStoryLocation[] = [
  { id: 'baekdu', name: '백두산', nearbyCityIds: ['cheongjin', 'north_port', 'sinuiju'], routeType: 'northeast_mountain_road', shortDescription: '하얀 산길과 맑은 바람 이야기.', storyEventIds: ['E01', 'E02'] },
  { id: 'taebaek', name: '태백산', nearbyCityIds: ['gangneung', 'wonsan', 'hamheung'], routeType: 'east_mountain_road', shortDescription: '천천히 기다리는 마음을 배우는 산.', storyEventIds: ['E03', 'E04'] },
  { id: 'songni', name: '속리산', nearbyCityIds: ['andong', 'daegu', 'jeonju'], routeType: 'mountain_paper_road', shortDescription: '정직한 마음을 비추는 숲길.', storyEventIds: ['E05', 'E06'] },
  { id: 'gyeryong', name: '계룡산', nearbyCityIds: ['seoul', 'jeonju', 'gaeseong'], routeType: 'inland_market_road', shortDescription: '밤 장터 소문이 도는 산길.', storyEventIds: ['E07', 'E08'] },
  { id: 'deogyu', name: '덕유산', nearbyCityIds: ['jeonju', 'gwangju', 'jinju'], routeType: 'south_inland_road', shortDescription: '서로 나누는 형제 마음 이야기.', storyEventIds: ['E09', 'E10'] },
  { id: 'naejang', name: '내장산', nearbyCityIds: ['jeonju', 'gwangju', 'mokpo'], routeType: 'autumn_leaf_road', shortDescription: '단풍잎에 편지를 싣는 산.', storyEventIds: ['E11', 'E12'] },
  { id: 'mudeung', name: '무등산', nearbyCityIds: ['gwangju', 'suncheon', 'mokpo'], routeType: 'stone_pillar_road', shortDescription: '돌기둥과 약속을 배우는 산.', storyEventIds: ['E13', 'E14'] },
  { id: 'gaya', name: '가야산', nearbyCityIds: ['andong', 'daegu', 'jinju'], routeType: 'book_wind_road', shortDescription: '책장 넘기는 바람이 부는 산.', storyEventIds: ['E15', 'E16'] },
  { id: 'chiak', name: '치악산', nearbyCityIds: ['chuncheon', 'seoul', 'gangneung'], routeType: 'north_capital_road', shortDescription: '작은 도움을 기억하는 산길.', storyEventIds: ['E17', 'E18'] },
  { id: 'wolchul', name: '월출산', nearbyCityIds: ['mokpo', 'gwangju', 'yeosu'], routeType: 'moon_bridge_road', shortDescription: '달과 별을 올려다보는 산.', storyEventIds: ['E19', 'E20'] },
  { id: 'gwanak', name: '관악산', nearbyCityIds: ['seoul', 'incheon', 'gaeseong'], routeType: 'capital_hill_road', shortDescription: '빠른 발보다 바른 마음을 보는 산.', storyEventIds: ['E21', 'E22'] },
  { id: 'guwol', name: '구월산', nearbyCityIds: ['pyongyang', 'nampo', 'sinuiju'], routeType: 'north_market_road', shortDescription: '정직한 장부를 살피는 산.', storyEventIds: ['E23', 'E24', 'E25'] },
  { id: 'jiri', name: '지리산', nearbyCityIds: ['jinju', 'suncheon', 'daegu'], routeType: 'rice_cake_pass', shortDescription: '떡고개와 약속을 잇는 산길.', storyEventIds: ['E26', 'E27'] },
  { id: 'geumgang', name: '금강산', nearbyCityIds: ['wonsan', 'gangneung', 'hamheung'], routeType: 'fairy_cloth_road', shortDescription: '잃어버린 옷감을 돌려주는 산.', storyEventIds: ['E28', 'E29'] },
  { id: 'halla', name: '한라산', nearbyCityIds: ['jeju', 'tongyeong', 'yeosu'], routeType: 'jeju_sea_route', shortDescription: '큰 손과 바람, 말 이야기가 있는 산.', storyEventIds: ['E30', 'E31'] }
];

export const JUNIOR_STORY_EVENTS: JuniorStoryEvent[] = [
  juniorStoryEvent({ id: 'E01', title: '백두산 흰 호랑이 1', storySource: '백두산 호랑이 설화', category: 'mountain_folktale', regionId: 'hamgyeong', mountainId: 'baekdu', routeId: 'northeast_mountain_road', triggerType: 'rumor', rumorCityIds: ['cheongjin', 'north_port'], marker: '백두산 소문', rumor: '백두산 길에 하얀 호랑이가 떡 냄새를 찾는대.', event: '배고픈 호랑이가 떡 보따리를 보고 있어.', solution: '떡을 조금 나누고 길을 물어보자.', choice: '떡을 나누기', result: '호랑이가 고맙다며 눈길 표식을 알려 줬어.', requiredGoodId: 'rice', reward: { stars: 1, storyFragment: 'baekdu_tiger_kindness' }, childSafetyNotes: '호랑이는 배고픈 길동무로 순화한다.', chainId: 'baekdu_tiger', chainStep: 1 }),
  juniorStoryEvent({ id: 'E02', title: '백두산 흰 호랑이 2', storySource: '백두산 호랑이 설화', category: 'mountain_folktale', regionId: 'hamgyeong', mountainId: 'baekdu', routeId: 'northeast_mountain_road', triggerType: 'chain_followup', prerequisiteEventIds: ['E01'], rumorCityIds: ['cheongjin'], marker: '흰 발자국', rumor: '흰 발자국이 장부 빛을 따라간대.', event: '호랑이가 눈 위에 둥근 길표를 남겼어.', solution: '발자국을 따라 장부 조각을 찾아보자.', choice: '발자국 따라가기', result: '장부에 산바람 그림이 남았어.', reward: { coins: 6, storyFragment: 'baekdu_snow_mark' }, childSafetyNotes: '호랑이는 길을 알려 주는 장면으로 만든다.', chainId: 'baekdu_tiger', chainStep: 2 }),
  juniorStoryEvent({ id: 'E03', title: '태백산 곰의 인내 1', storySource: '곰의 인내 설화', category: 'mountain_folktale', regionId: 'gangwon', mountainId: 'taebaek', routeId: 'east_mountain_road', triggerType: 'rumor', rumorCityIds: ['gangneung', 'wonsan'], marker: '태백산 기다림', rumor: '태백산 곰은 천천히 기다리는 법을 안대.', event: '곰이 비가 그칠 때까지 조용히 앉아 있어.', solution: '서두르지 말고 날씨를 살피자.', choice: '기다리기', result: '비가 그치고 길이 반짝였어.', quiz: { question: '비 올 때 먼저 볼 것은?', options: ['날씨', '소리'], answer: '날씨', correctText: '맞아. 날씨를 먼저 봐.', wrongText: '괜찮아. 다시 살펴보자.' }, reward: { seyeonNotebookProgress: 'weather', storyFragment: 'bear_patience' }, childSafetyNotes: '곰은 인내를 알려 주는 친구로 표현한다.', chainId: 'bear_patience', chainStep: 1 }),
  juniorStoryEvent({ id: 'E04', title: '태백산 곰의 인내 2', storySource: '곰의 인내 설화', category: 'mountain_folktale', regionId: 'gangwon', mountainId: 'taebaek', routeId: 'east_mountain_road', triggerType: 'chain_followup', prerequisiteEventIds: ['E03'], rumorCityIds: ['gangneung'], marker: '곰의 표식', rumor: '곰이 기다린 자리에는 작은 돌탑이 선대.', event: '작은 돌탑 옆에 쉬어 가는 길이 있어.', solution: '돌탑을 정리하고 다음 사람을 돕자.', choice: '돌탑 정리', result: '세연이 노트에 기다림 표시가 생겼어.', reward: { stars: 1, storyFragment: 'bear_stone_stack' }, childSafetyNotes: '시련을 강요하지 않고 쉬어 가는 태도로 각색한다.', chainId: 'bear_patience', chainStep: 2 }),
  juniorStoryEvent({ id: 'E05', title: '속리산 금도끼 1', storySource: '금도끼 은도끼', category: 'mountain_folktale', regionId: 'chungcheong', mountainId: 'songni', routeId: 'mountain_paper_road', triggerType: 'rumor', rumorCityIds: ['jeonju', 'andong'], marker: '정직한 샘', rumor: '속리산 샘은 정직한 마음을 비춘대.', event: '샘가에 잃어버린 나무 도끼가 있어.', solution: '주인을 찾아 돌려주자.', choice: '도끼 돌려주기', result: '주인이 고맙다며 길값을 보태 줬어.', reward: { coins: 8, storyFragment: 'honest_axe_return' }, childSafetyNotes: '욕심 비교보다 정직하게 물건을 돌려주는 흐름으로 단순화한다.', chainId: 'honest_axe', chainStep: 1 }),
  juniorStoryEvent({ id: 'E06', title: '속리산 금도끼 2', storySource: '금도끼 은도끼', category: 'mountain_folktale', regionId: 'chungcheong', mountainId: 'songni', routeId: 'mountain_paper_road', triggerType: 'chain_followup', prerequisiteEventIds: ['E05'], rumorCityIds: ['jeonju'], marker: '빛나는 도끼', rumor: '샘물이 반짝이면 장부도 같이 빛난대.', event: '샘 위에 금빛 그림자가 잠깐 떠올랐어.', solution: '진짜 내 것이 아니라고 말하자.', choice: '정직하게 말하기', result: '장부에 정직 표식이 생겼어.', reward: { stars: 1, storyFragment: 'honest_axe_light', cosmeticItemUnlock: 'story_gold_axe_decor' }, childSafetyNotes: '탐내는 장면보다 정직한 선택만 다룬다.', chainId: 'honest_axe', chainStep: 2 }),
  juniorStoryEvent({ id: 'E07', title: '계룡산 도깨비 장터 1', storySource: '도깨비 장터 설화', category: 'market_story', regionId: 'chungcheong', mountainId: 'gyeryong', routeId: 'inland_market_road', triggerType: 'rumor', rumorCityIds: ['seoul', 'jeonju'], marker: '밤 장터', rumor: '계룡산 밤 장터엔 이상한 물건 이름이 많대.', event: '도깨비들이 웃으며 물건 이름 맞히기를 해.', solution: '차분히 이름표를 읽어 주자.', choice: '이름표 읽기', result: '도깨비가 별 모양 콩을 줬어.', quiz: { question: '장터에서 먼저 보는 것은?', options: ['이름표', '구름'], answer: '이름표', correctText: '맞아. 이름표를 보자.', wrongText: '괜찮아. 천천히 보자.' }, reward: { stars: 1, storyFragment: 'goblin_market_names' }, childSafetyNotes: '도깨비는 장난 많은 상인으로 표현하고 겁주는 장면을 빼다.', chainId: 'goblin_market', chainStep: 1 }),
  juniorStoryEvent({ id: 'E08', title: '계룡산 도깨비 방망이 2', storySource: '도깨비 방망이 설화', category: 'market_story', regionId: 'chungcheong', mountainId: 'gyeryong', routeId: 'inland_market_road', triggerType: 'chain_followup', prerequisiteEventIds: ['E07'], rumorCityIds: ['seoul'], marker: '장난 방망이', rumor: '도깨비 방망이는 물건을 정리할 때만 반짝인대.', event: '방망이가 흩어진 물건을 톡톡 정리해.', solution: '필요한 물건만 가지자.', choice: '물건 정리', result: '장터가 깨끗해지고 소문이 좋아졌어.', reward: { rumorUnlock: ['gyeryong_clean_market'], storyFragment: 'goblin_club_sorting', cosmeticItemUnlock: 'story_goblin_club_decor' }, childSafetyNotes: '방망이는 때리는 도구가 아니라 정리 도구로 각색한다.', chainId: 'goblin_market', chainStep: 2 }),
  juniorStoryEvent({ id: 'E09', title: '덕유산 의좋은 형제 1', storySource: '의좋은 형제', category: 'mountain_folktale', regionId: 'jeolla', mountainId: 'deogyu', routeId: 'south_inland_road', triggerType: 'rumor', rumorCityIds: ['jeonju', 'gwangju'], marker: '나눔 볏단', rumor: '덕유산 아래 형제가 서로 쌀을 나눈대.', event: '두 형제가 몰래 볏단을 서로에게 옮기고 있어.', solution: '서로의 마음을 알려 주자.', choice: '마음 전하기', result: '형제가 웃으며 함께 밥을 먹었어.', reward: { coins: 5, storyFragment: 'brothers_share_rice' }, childSafetyNotes: '가난을 슬프게 강조하지 않고 서로 돕는 마음에 초점을 둔다.', chainId: 'good_brothers', chainStep: 1 }),
  juniorStoryEvent({ id: 'E10', title: '덕유산 의좋은 형제 2', storySource: '의좋은 형제', category: 'mountain_folktale', regionId: 'jeolla', mountainId: 'deogyu', routeId: 'south_inland_road', triggerType: 'chain_followup', prerequisiteEventIds: ['E09'], rumorCityIds: ['gwangju'], marker: '함께 짓는 곳간', rumor: '형제가 작은 곳간을 함께 고친대.', event: '곳간 문이 삐걱여 곡식을 넣기 어려워.', solution: '나무판을 잡아 주고 문을 고치자.', choice: '곳간 돕기', result: '함께 쓰는 곳간이 튼튼해졌어.', reward: { stars: 1, storyFragment: 'brothers_storehouse' }, childSafetyNotes: '부족함보다 협동과 나눔을 밝게 보여 준다.', chainId: 'good_brothers', chainStep: 2 }),
  juniorStoryEvent({ id: 'E11', title: '내장산 단풍 편지 1', storySource: '내장산 단풍 설화', category: 'regional_learning', regionId: 'jeolla', mountainId: 'naejang', routeId: 'autumn_leaf_road', triggerType: 'rumor', rumorCityIds: ['jeonju', 'gwangju'], marker: '단풍 편지', rumor: '내장산 단풍잎에는 고운 말이 적힌대.', event: '단풍잎 한 장이 세연이 노트에 내려앉았어.', solution: '짧은 편지를 적어 보자.', choice: '편지 쓰기', result: '세연이가 글 공부를 더 좋아하게 됐어.', requiredGoodId: 'paper', reward: { seyeonNotebookProgress: 'writing', storyFragment: 'maple_letter_start' }, childSafetyNotes: '쓸쓸한 이별 정서 없이 계절 편지로 표현한다.', chainId: 'maple_letter', chainStep: 1 }),
  juniorStoryEvent({ id: 'E12', title: '내장산 단풍 편지 2', storySource: '내장산 단풍 설화', category: 'regional_learning', regionId: 'jeolla', mountainId: 'naejang', routeId: 'autumn_leaf_road', triggerType: 'chain_followup', prerequisiteEventIds: ['E11'], rumorCityIds: ['gwangju'], marker: '붉은 답장', rumor: '단풍잎 답장은 바람을 타고 온대.', event: '세연이의 답장이 장부 사이에 꽂혔어.', solution: '답장을 읽고 노트에 붙이자.', choice: '노트에 붙이기', result: '글 노트가 한 칸 채워졌어.', reward: { stars: 1, storyFragment: 'maple_letter_reply' }, childSafetyNotes: '편지는 따뜻한 소통으로만 다룬다.', chainId: 'maple_letter', chainStep: 2 }),
  juniorStoryEvent({ id: 'E13', title: '무등산 돌기둥 1', storySource: '무등산 주상절리 이야기', category: 'regional_learning', regionId: 'jeolla', mountainId: 'mudeung', routeId: 'stone_pillar_road', triggerType: 'first_visit', rumorCityIds: ['gwangju'], marker: '돌기둥 길', rumor: '무등산 돌기둥은 줄을 맞춰 선 책 같대.', event: '큰 돌기둥들이 나란히 서 있어.', solution: '모양을 세어 산수 노트에 적자.', choice: '기둥 세기', result: '세연이가 수를 세는 법을 익혔어.', reward: { seyeonNotebookProgress: 'math', storyFragment: 'mudeung_pillars_count' }, childSafetyNotes: '자연 지형을 관찰 학습으로 다룬다.', chainId: 'mudeung_pillars', chainStep: 1 }),
  juniorStoryEvent({ id: 'E14', title: '무등산 돌기둥 2', storySource: '무등산 주상절리 이야기', category: 'regional_learning', regionId: 'jeolla', mountainId: 'mudeung', routeId: 'stone_pillar_road', triggerType: 'chain_followup', prerequisiteEventIds: ['E13'], rumorCityIds: ['gwangju', 'suncheon'], marker: '돌그림 지도', rumor: '돌기둥 그림을 이으면 길 모양이 된대.', event: '돌 그림이 지도처럼 이어져 있어.', solution: '돌그림을 따라 안전한 길을 표시하자.', choice: '길 표시하기', result: '지도 노트에 돌길 표시가 생겼어.', reward: { seyeonNotebookProgress: 'map', storyFragment: 'mudeung_stone_map' }, childSafetyNotes: '높은 곳 묘사는 줄이고 관찰 길로 바꾼다.', chainId: 'mudeung_pillars', chainStep: 2 }),
  juniorStoryEvent({ id: 'E15', title: '가야산 책 바람 1', storySource: '가야산과 책 이야기', category: 'regional_learning', regionId: 'gyeongsang', mountainId: 'gaya', routeId: 'book_wind_road', triggerType: 'rumor', rumorCityIds: ['andong', 'daegu'], marker: '책 바람', rumor: '가야산에는 책장을 넘기는 바람이 분대.', event: '바람이 책갈피를 살짝 넘겼어.', solution: '잃어버린 책갈피를 찾아 주자.', choice: '책갈피 찾기', result: '책 주인이 고맙다며 좋은 글귀를 알려 줬어.', requiredGoodId: 'paper', reward: { stars: 1, storyFragment: 'gaya_book_wind' }, childSafetyNotes: '종교적 세부보다 책과 배움의 분위기에 집중한다.', chainId: 'gaya_books', chainStep: 1 }),
  juniorStoryEvent({ id: 'E16', title: '가야산 책 바람 2', storySource: '가야산과 책 이야기', category: 'regional_learning', regionId: 'gyeongsang', mountainId: 'gaya', routeId: 'book_wind_road', triggerType: 'chain_followup', prerequisiteEventIds: ['E15'], rumorCityIds: ['andong'], marker: '바람 책갈피', rumor: '바람 책갈피는 읽은 곳을 기억한대.', event: '책갈피가 세연이 노트 위에 내려앉았어.', solution: '오늘 배운 말을 한 줄 적자.', choice: '한 줄 쓰기', result: '세연이 글 노트가 반짝였어.', reward: { seyeonNotebookProgress: 'writing', storyFragment: 'gaya_bookmark_line' }, childSafetyNotes: '공부 압박이 아니라 발견의 기쁨으로 표현한다.', chainId: 'gaya_books', chainStep: 2 }),
  juniorStoryEvent({ id: 'E17', title: '치악산 은혜 갚은 꿩 1', storySource: '은혜 갚은 꿩', category: 'mountain_folktale', regionId: 'gangwon', mountainId: 'chiak', routeId: 'north_capital_road', triggerType: 'rumor', rumorCityIds: ['chuncheon', 'seoul'], marker: '꿩의 부탁', rumor: '치악산 꿩이 길 잃은 아이를 도와준대.', event: '꿩이 작은 종끈을 부리로 물고 있어.', solution: '끈이 걸린 가지를 풀어 주자.', choice: '가지 풀기', result: '꿩이 고운 울음으로 길을 알려 줬어.', reward: { stars: 1, storyFragment: 'pheasant_helped' }, childSafetyNotes: '걸린 끈을 풀어 주는 도움으로 순화한다.', chainId: 'pheasant_gratitude', chainStep: 1 }),
  juniorStoryEvent({ id: 'E18', title: '치악산 은혜 갚은 꿩 2', storySource: '은혜 갚은 꿩', category: 'mountain_folktale', regionId: 'gangwon', mountainId: 'chiak', routeId: 'north_capital_road', triggerType: 'chain_followup', prerequisiteEventIds: ['E17'], rumorCityIds: ['chuncheon'], marker: '고마운 울음', rumor: '꿩 울음이 들리면 좋은 길이 열린대.', event: '꿩이 종소리 같은 울음으로 쉬운 길을 알려 줘.', solution: '소리를 따라 조용히 이동하자.', choice: '소리 따라가기', result: '먼 길을 편하게 지나갔어.', reward: { coins: 5, storyFragment: 'pheasant_safe_path' }, childSafetyNotes: '보은의 의미만 살리고 공포 요소는 제거한다.', chainId: 'pheasant_gratitude', chainStep: 2 }),
  juniorStoryEvent({ id: 'E19', title: '월출산 달토끼 1', storySource: '달토끼 설화', category: 'mountain_folktale', regionId: 'jeolla', mountainId: 'wolchul', routeId: 'moon_bridge_road', triggerType: 'rumor', rumorCityIds: ['mokpo', 'gwangju'], marker: '달토끼 절구', rumor: '월출산 달빛 아래 토끼가 떡을 빚는대.', event: '달토끼가 작은 떡을 둥글게 만들고 있어.', solution: '쌀 한 줌을 전하고 달 모양을 배우자.', choice: '쌀 전하기', result: '달토끼가 둥근 달 표시를 그려 줬어.', requiredGoodId: 'rice', reward: { stars: 1, storyFragment: 'moon_rabbit_rice' }, childSafetyNotes: '달토끼는 평화로운 밤 친구로 표현한다.', chainId: 'moon_rabbit', chainStep: 1 }),
  juniorStoryEvent({ id: 'E20', title: '월출산 별다리 2', storySource: '월출산 달과 별 이야기', category: 'mountain_folktale', regionId: 'jeolla', mountainId: 'wolchul', routeId: 'moon_bridge_road', triggerType: 'chain_followup', prerequisiteEventIds: ['E19'], rumorCityIds: ['mokpo'], marker: '별다리', rumor: '달토끼가 별을 이어 다리를 놓는대.', event: '별점들이 지도처럼 이어져 있어.', solution: '별을 세고 방향을 적자.', choice: '별 세기', result: '날씨 노트에 밤하늘 칸이 열렸어.', reward: { seyeonNotebookProgress: 'weather', storyFragment: 'moon_star_bridge' }, childSafetyNotes: '밤은 별 관찰 시간으로 다룬다.', chainId: 'moon_rabbit', chainStep: 2 }),
  juniorStoryEvent({ id: 'E21', title: '관악산 홍길동 1', storySource: '홍길동전', category: 'historical', regionId: 'gyeonggi', mountainId: 'gwanak', routeId: 'capital_hill_road', triggerType: 'rumor', rumorCityIds: ['seoul', 'incheon'], marker: '빠른 발 소문', rumor: '관악산 길에 홍길동 이름을 아는 사람이 있대.', event: '홍길동이 빠른 발보다 바른 말을 먼저 보자고 해.', solution: '상인 장부의 틀린 값을 찾아 주자.', choice: '값 확인하기', result: '홍길동이 정직한 장사라며 웃었어.', quiz: { question: '장부에서 먼저 볼 것은?', options: ['값', '색'], answer: '값', correctText: '맞아. 값을 확인해.', wrongText: '괜찮아. 다시 보자.' }, reward: { seyeonNotebookProgress: 'math', storyFragment: 'hong_gildong_honest_count', cosmeticItemUnlock: 'story_hong_headband' }, childSafetyNotes: '홍길동은 싸우는 인물이 아니라 빠르고 공정한 조언자로 표현한다.', chainId: 'hong_gildong', chainStep: 1 }),
  juniorStoryEvent({ id: 'E22', title: '관악산 홍길동 2', storySource: '홍길동전', category: 'historical', regionId: 'gyeonggi', mountainId: 'gwanak', routeId: 'capital_hill_road', triggerType: 'chain_followup', prerequisiteEventIds: ['E21'], rumorCityIds: ['seoul'], marker: '공정한 길', rumor: '홍길동은 빠른 길보다 모두가 편한 길을 고른대.', event: '두 갈래 길 앞에서 아이들이 망설여.', solution: '지도에 쉬운 길을 표시하자.', choice: '쉬운 길 표시', result: '지도 노트에 공정한 길이 생겼어.', reward: { seyeonNotebookProgress: 'map', storyFragment: 'hong_gildong_fair_path' }, childSafetyNotes: '공정함과 길 안내만 남긴다.', chainId: 'hong_gildong', chainStep: 2 }),
  juniorStoryEvent({ id: 'E23', title: '구월산 임꺽정 1', storySource: '임꺽정 이야기', category: 'historical', regionId: 'hwanghae', mountainId: 'guwol', routeId: 'north_market_road', triggerType: 'rumor', rumorCityIds: ['pyongyang', 'nampo'], marker: '정직 시험', rumor: '구월산에 정직한 장사를 묻는 임꺽정 소문이 있어.', event: '임꺽정이 장부 숫자가 맞는지 물어봐.', solution: '산 물건과 판 물건을 차근차근 세자.', choice: '장부 세기', result: '숫자가 맞아서 길이 밝아졌어.', reward: { coins: 7, storyFragment: 'im_kkeokjeong_ledger_check' }, childSafetyNotes: '임꺽정은 정직함을 묻는 인물로 순화한다.', chainId: 'im_kkeokjeong', chainStep: 1 }),
  juniorStoryEvent({ id: 'E24', title: '구월산 임꺽정 2', storySource: '임꺽정 이야기', category: 'historical', regionId: 'hwanghae', mountainId: 'guwol', routeId: 'north_market_road', triggerType: 'chain_followup', prerequisiteEventIds: ['E23'], rumorCityIds: ['nampo'], marker: '나눔 장부', rumor: '임꺽정은 나눌 물건도 장부에 적는대.', event: '길손들이 종이와 소금을 함께 나누고 있어.', solution: '필요한 만큼만 적어 주자.', choice: '나눔 적기', result: '나눔 장부가 깔끔해졌어.', reward: { stars: 1, storyFragment: 'im_kkeokjeong_share_list' }, childSafetyNotes: '의적 서사를 나눔과 기록의 이야기로 바꾼다.', chainId: 'im_kkeokjeong', chainStep: 2 }),
  juniorStoryEvent({ id: 'E25', title: '구월산 임꺽정 3', storySource: '임꺽정 이야기', category: 'main_clue', regionId: 'hwanghae', mountainId: 'guwol', routeId: 'north_market_road', triggerType: 'chain_followup', prerequisiteEventIds: ['E24'], rumorCityIds: ['pyongyang'], marker: '장부 단서', rumor: '구월산 장부에는 돌아갈 문 단서가 있대.', event: '정직한 기록 위에 장부 빛이 떠올랐어.', solution: '빛나는 줄을 따라 단서를 읽자.', choice: '단서 읽기', result: '장부 단서 하나를 찾았어.', reward: { ledgerClue: 1, storyFragment: 'im_kkeokjeong_main_clue', cosmeticItemUnlock: 'story_im_wood_tag' }, childSafetyNotes: '거친 묘사 없이 정직한 기록이 단서를 여는 장면으로 만든다.', chainId: 'im_kkeokjeong', chainStep: 3 }),
  juniorStoryEvent({ id: 'E26', title: '지리산 호랑이 떡고개 1', storySource: '호랑이 떡고개 이야기', category: 'mountain_folktale', regionId: 'gyeongsang', mountainId: 'jiri', routeId: 'rice_cake_pass', triggerType: 'rumor', rumorCityIds: ['jinju', 'suncheon'], marker: '떡고개', rumor: '지리산 고개에 떡을 좋아하는 호랑이가 있대.', event: '호랑이가 떡 냄새를 맡고 배를 만져.', solution: '떡을 나누고 길 약속을 하자.', choice: '떡 나누기', result: '호랑이가 고개 이름을 알려 줬어.', requiredGoodId: 'rice', reward: { stars: 1, storyFragment: 'jiri_rice_cake_pass', cosmeticItemUnlock: 'story_tiger_rice_charm' }, childSafetyNotes: '호랑이는 떡을 찾는 배고픈 친구로 순화한다.', chainId: 'jiri_tiger', chainStep: 1 }),
  juniorStoryEvent({ id: 'E27', title: '지리산 호랑이 약속 2', storySource: '호랑이 떡고개 이야기', category: 'mountain_folktale', regionId: 'gyeongsang', mountainId: 'jiri', routeId: 'rice_cake_pass', triggerType: 'chain_followup', prerequisiteEventIds: ['E26'], rumorCityIds: ['jinju'], marker: '호랑이 약속', rumor: '떡고개 호랑이는 약속을 잘 지킨대.', event: '호랑이가 다음 길손 몫의 떡을 남겨 두었어.', solution: '약속 표식을 장부에 적자.', choice: '약속 적기', result: '장사 노트에 약속 칸이 생겼어.', reward: { seyeonNotebookProgress: 'trade', storyFragment: 'jiri_tiger_promise' }, childSafetyNotes: '원전의 무서운 요소를 약속과 배려 이야기로 바꾼다.', chainId: 'jiri_tiger', chainStep: 2 }),
  juniorStoryEvent({ id: 'E28', title: '금강산 선녀의 옷감 1', storySource: '선녀의 옷감 이야기', category: 'mountain_folktale', regionId: 'gangwon', mountainId: 'geumgang', routeId: 'fairy_cloth_road', triggerType: 'rumor', rumorCityIds: ['wonsan', 'gangneung'], marker: '잃어버린 옷감', rumor: '금강산 바람에 고운 옷감이 날아갔대.', event: '선녀가 잃어버린 옷감을 찾고 있어.', solution: '나뭇가지에 걸린 옷감을 내려 주자.', choice: '옷감 돌려주기', result: '선녀가 고맙다며 바람 길을 알려 줬어.', requiredGoodId: 'cotton_cloth', reward: { stars: 1, storyFragment: 'fairy_cloth_returned', cosmeticItemUnlock: 'story_fairy_ribbon' }, childSafetyNotes: '잃어버린 옷감 돌려주기로만 각색한다.', chainId: 'fairy_cloth_safe', chainStep: 1 }),
  juniorStoryEvent({ id: 'E29', title: '금강산 선녀의 옷감 2', storySource: '선녀의 옷감 이야기', category: 'main_clue', regionId: 'gangwon', mountainId: 'geumgang', routeId: 'fairy_cloth_road', triggerType: 'chain_followup', prerequisiteEventIds: ['E28'], rumorCityIds: ['wonsan'], marker: '옷감 무늬', rumor: '돌려준 옷감 무늬에 장부 글자가 보인대.', event: '옷감 가장자리에 작은 별 무늬가 빛나.', solution: '무늬를 장부에 대 보자.', choice: '무늬 맞추기', result: '장부에 새 바람 글자가 남았어.', reward: { storyFragment: 'fairy_cloth_pattern' }, childSafetyNotes: '선녀는 도움을 받는 독립적인 인물로 표현한다.', chainId: 'fairy_cloth_safe', chainStep: 2 }),
  juniorStoryEvent({ id: 'E30', title: '한라산 설문대할망 1', storySource: '설문대할망 설화', category: 'mountain_folktale', regionId: 'jeju', mountainId: 'halla', routeId: 'jeju_sea_route', triggerType: 'first_visit', rumorCityIds: ['jeju'], marker: '큰 손 이야기', rumor: '한라산에는 큰 손으로 섬을 돌본 할망 이야기가 있대.', event: '설문대할망이 돌길을 고르게 놓아 줘.', solution: '돌을 세며 길 모양을 배우자.', choice: '돌길 살피기', result: '제주 길이 지도에 또렷해졌어.', reward: { cityStamp: 'jeju', storyFragment: 'seolmundae_stone_path' }, childSafetyNotes: '섬을 돌보는 할머니로 표현한다.', chainId: 'seolmundae', chainStep: 1 }),
  juniorStoryEvent({ id: 'E31', title: '한라산 바람과 말 2', storySource: '제주 바람과 말 이야기', category: 'regional_learning', regionId: 'jeju', mountainId: 'halla', routeId: 'jeju_sea_route', triggerType: 'chain_followup', prerequisiteEventIds: ['E30'], rumorCityIds: ['jeju'], marker: '바람과 말', rumor: '한라산 바람은 말의 갈기를 흔든대.', event: '말들이 바람 방향을 보고 천천히 걷고 있어.', solution: '바람 방향을 날씨 노트에 적자.', choice: '바람 적기', result: '날씨 노트에 제주 바람이 생겼어.', reward: { seyeonNotebookProgress: 'weather', storyFragment: 'halla_wind_horse' }, childSafetyNotes: '말은 탈것이 아니라 자연을 알려 주는 친구로 다룬다.', chainId: 'seolmundae', chainStep: 2 }),
  juniorStoryEvent({ id: 'E32', title: '심청전 1 한양 소문', storySource: '심청전 각색', category: 'sea_classic', regionId: 'gyeonggi', routeId: 'west_river_salt_road', triggerType: 'rumor', rumorCityIds: ['seoul'], marker: '연꽃 편지 소문', rumor: '한양에 마음을 전하는 연꽃 편지 소문이 있어.', event: '한양 장터에서 연꽃 무늬 편지를 보았어.', solution: '편지를 보낼 길을 물어보자.', choice: '길 묻기', result: '인천 바닷길 소문을 들었어.', reward: { rumorUnlock: ['simcheong_lotus_letter'], storyFragment: 'simcheong_hanyang_rumor' }, childSafetyNotes: '편지와 마음 전달로 각색한다.', chainId: 'simcheong_letter', chainStep: 1 }),
  juniorStoryEvent({ id: 'E33', title: '심청전 2 인천 연꽃 편지', storySource: '심청전 각색', category: 'sea_classic', regionId: 'gyeonggi', routeId: 'west_river_salt_road', triggerType: 'chain_followup', prerequisiteEventIds: ['E32'], rumorCityIds: ['incheon'], marker: '연꽃 편지', rumor: '인천 물길에 연꽃 편지를 띄우면 마음이 닿는대.', event: '연꽃 편지가 물 위에서 천천히 떠가.', solution: '젖지 않게 종이를 접어 주자.', choice: '편지 접기', result: '편지가 반듯하게 떠갔어.', requiredGoodId: 'paper', reward: { seyeonNotebookProgress: 'writing', storyFragment: 'simcheong_incheon_letter' }, childSafetyNotes: '바다는 편지가 이동하는 길로 표현한다.', chainId: 'simcheong_letter', chainStep: 2 }),
  juniorStoryEvent({ id: 'E34', title: '심청전 3 서해 용궁 우체부', storySource: '심청전 각색', category: 'sea_classic', regionId: 'west_sea', routeId: 'island_sea_route', triggerType: 'chain_followup', prerequisiteEventIds: ['E33'], rumorCityIds: ['mokpo', 'incheon'], marker: '용궁 우체부', rumor: '서해 물결에는 용궁 우체부가 편지를 나른대.', event: '작은 물고기 우체부가 연꽃 편지를 들고 있어.', solution: '받는 곳 이름을 또박또박 써 주자.', choice: '이름 쓰기', result: '우체부가 길을 잃지 않았어.', reward: { stars: 1, storyFragment: 'simcheong_sea_post' }, childSafetyNotes: '용궁은 밝은 우체국처럼 표현한다.', chainId: 'simcheong_letter', chainStep: 3 }),
  juniorStoryEvent({ id: 'E35', title: '심청전 4 마음이 닿은 편지', storySource: '심청전 각색', category: 'main_clue', regionId: 'west_sea', routeId: 'island_sea_route', triggerType: 'chain_followup', prerequisiteEventIds: ['E34'], rumorCityIds: ['mokpo'], marker: '마음 답장', rumor: '연꽃 편지의 답장에 장부 단서가 있대.', event: '연꽃 편지가 따뜻한 답장을 싣고 돌아왔어.', solution: '답장을 장부 사이에 넣어 보자.', choice: '답장 넣기', result: '장부 단서가 반짝였어.', reward: { ledgerClue: 1, storyFragment: 'simcheong_letter_clue', cosmeticItemUnlock: 'story_simcheong_lotus_lamp' }, childSafetyNotes: '가족 마음이 전해지는 편지로 마무리한다.', chainId: 'simcheong_letter', chainStep: 4 }),
  juniorStoryEvent({ id: 'E36', title: '별주부전 1 목포 토끼 소문', storySource: '별주부전 각색', category: 'sea_classic', regionId: 'jeolla_sea', routeId: 'south_coast_market_road', triggerType: 'rumor', rumorCityIds: ['mokpo'], marker: '토끼 소문', rumor: '목포 장터에 말 잘하는 토끼 소문이 있어.', event: '토끼가 바닷길 이야기를 듣고 귀를 쫑긋해.', solution: '토끼에게 길을 천천히 설명하자.', choice: '길 설명하기', result: '토끼가 고맙다며 수수께끼를 냈어.', quiz: { question: '토끼가 잘하는 것은?', options: ['지혜', '소금'], answer: '지혜', correctText: '맞아. 토끼는 지혜로워.', wrongText: '괜찮아. 다시 생각해 보자.' }, reward: { stars: 1, storyFragment: 'rabbit_mokpo_rumor' }, childSafetyNotes: '잡아간다는 설정을 빼고 토끼의 지혜와 대화로 각색한다.', chainId: 'rabbit_turtle', chainStep: 1 }),
  juniorStoryEvent({ id: 'E37', title: '별주부전 2 제주 토끼의 지혜', storySource: '별주부전 각색', category: 'sea_classic', regionId: 'jeju', routeId: 'jeju_sea_route', triggerType: 'chain_followup', prerequisiteEventIds: ['E36'], rumorCityIds: ['jeju'], marker: '토끼의 지혜', rumor: '제주 바람길에서 토끼가 좋은 꾀를 냈대.', event: '토끼가 서로 기분 상하지 않는 말을 고르고 있어.', solution: '부드러운 말을 함께 골라 주자.', choice: '좋은 말 고르기', result: '토끼가 말솜씨 책갈피를 줬어.', reward: { seyeonNotebookProgress: 'trade', storyFragment: 'rabbit_jeju_wisdom' }, childSafetyNotes: '속임수보다 말의 지혜와 예의를 배우는 장면으로 바꾼다.', chainId: 'rabbit_turtle', chainStep: 2 }),
  juniorStoryEvent({ id: 'E38', title: '별주부전 3 용왕의 사과 편지', storySource: '별주부전 각색', category: 'sea_classic', regionId: 'south_sea', routeId: 'jeju_sea_route', triggerType: 'chain_followup', prerequisiteEventIds: ['E37'], rumorCityIds: ['tongyeong', 'jeju'], marker: '사과 편지', rumor: '용왕이 토끼에게 사과 편지를 보냈대.', event: '물결 위에 정중한 편지가 떠 있어.', solution: '편지를 토끼에게 전하자.', choice: '편지 전하기', result: '토끼와 용궁 친구들이 화해했어.', reward: { coins: 6, storyFragment: 'dragon_king_apology', cosmeticItemUnlock: 'story_dragon_shell_decor' }, childSafetyNotes: '사과 편지와 화해로 순화한다.', chainId: 'rabbit_turtle', chainStep: 3 }),
  juniorStoryEvent({ id: 'E39', title: '바다 용왕의 물결 1', storySource: '용왕 설화', category: 'sea_classic', regionId: 'south_sea', routeId: 'island_sea_route', triggerType: 'rumor', rumorCityIds: ['yeosu', 'tongyeong'], marker: '물결 무늬', rumor: '남해 물결에 용왕의 물결 무늬가 보인대.', event: '물결이 길 표시처럼 반짝이고 있어.', solution: '물결 방향을 지도에 적자.', choice: '물결 적기', result: '바닷길 지도가 또렷해졌어.', reward: { seyeonNotebookProgress: 'map', storyFragment: 'sea_king_wave_map' }, childSafetyNotes: '용왕은 바닷길을 알려 주는 존재로 표현한다.', chainId: 'sea_king_wave', chainStep: 1 }),
  juniorStoryEvent({ id: 'E40', title: '바다 용왕의 물결 2', storySource: '용왕 설화', category: 'sea_classic', regionId: 'south_sea', routeId: 'island_sea_route', triggerType: 'chain_followup', prerequisiteEventIds: ['E39'], rumorCityIds: ['tongyeong'], marker: '잔잔한 물결', rumor: '용왕 물결을 읽으면 안전한 때를 알 수 있대.', event: '바람이가 물결이 잔잔한 때를 알려 줘.', solution: '출발하기 좋은 때를 기다리자.', choice: '때 기다리기', result: '배가 편하게 움직였어.', reward: { stars: 1, storyFragment: 'sea_king_calm_wave' }, childSafetyNotes: '거친 파도 대신 기다림과 관찰을 배우는 이야기로 만든다.', chainId: 'sea_king_wave', chainStep: 2 }),
  juniorStoryEvent({ id: 'E41', title: '충무공의 바람 1', storySource: '이순신 장군 이야기', category: 'historical', regionId: 'south_sea', routeId: 'south_coast_market_road', triggerType: 'rumor', rumorCityIds: ['tongyeong', 'yeosu'], marker: '충무공 바람', rumor: '통영 바닷길에는 충무공의 차분한 바람 이야기가 있대.', event: '바람 방향을 살피는 어른들이 조용히 모였어.', solution: '바람과 물때를 노트에 적자.', choice: '바람 적기', result: '세연이가 날씨 보는 법을 배웠어.', reward: { seyeonNotebookProgress: 'weather', storyFragment: 'admiral_wind_note' }, childSafetyNotes: '관찰, 준비, 책임감에 초점을 둔다.', chainId: 'admiral_wind', chainStep: 1 }),
  juniorStoryEvent({ id: 'E42', title: '충무공의 바람 2', storySource: '이순신 장군 이야기', category: 'main_clue', regionId: 'south_sea', routeId: 'south_coast_market_road', triggerType: 'chain_followup', prerequisiteEventIds: ['E41'], rumorCityIds: ['tongyeong'], marker: '바람 단서', rumor: '충무공의 바람길에 장부 단서가 숨었대.', event: '바람 방향표와 장부 무늬가 딱 맞아.', solution: '방향표를 장부 위에 올려 보자.', choice: '방향표 맞추기', result: '장부 단서 하나가 더 빛났어.', reward: { ledgerClue: 1, storyFragment: 'admiral_wind_clue', cosmeticItemUnlock: 'story_admiral_sword_decor' }, childSafetyNotes: '역사 인물은 차분히 준비하는 지도자로 표현한다.', chainId: 'admiral_wind', chainStep: 2 }),
  juniorStoryEvent({ id: 'E43', title: '흥부와 제비 1', storySource: '흥부전', category: 'market_story', regionId: 'jeolla', routeId: 'spring_flower_road', triggerType: 'rumor', rumorCityIds: ['jeonju', 'gwangju'], marker: '제비 소식', rumor: '봄 장터에 흥부와 제비 소식이 들린대.', event: '제비가 작은 박씨를 물고 쉬고 있어.', solution: '제비가 쉴 자리를 마련하자.', choice: '쉴 자리 만들기', result: '제비가 박씨를 살짝 내려놓았어.', reward: { stars: 1, storyFragment: 'heungbu_swallow_rest' }, childSafetyNotes: '쉬어 가는 도움으로 순화한다.', chainId: 'heungbu_seed', chainStep: 1 }),
  juniorStoryEvent({ id: 'E44', title: '흥부와 박씨 2', storySource: '흥부전', category: 'market_story', regionId: 'jeolla', routeId: 'spring_flower_road', triggerType: 'chain_followup', prerequisiteEventIds: ['E43'], rumorCityIds: ['jeonju'], marker: '박씨 선물', rumor: '흥부의 박씨는 욕심보다 나눔을 좋아한대.', event: '작은 박이 열리고 씨앗 봉투가 나왔어.', solution: '씨앗을 필요한 집에 나누자.', choice: '씨앗 나누기', result: '마을 사람들이 함께 밭을 가꾸기로 했어.', reward: { coins: 5, storyFragment: 'heungbu_seed_share' }, childSafetyNotes: '작은 나눔의 기쁨으로 표현한다.', chainId: 'heungbu_seed', chainStep: 2 }),
  juniorStoryEvent({ id: 'E45', title: '콩쥐의 물동이 1', storySource: '콩쥐팥쥐 각색', category: 'market_story', regionId: 'jeolla', routeId: 'west_river_salt_road', triggerType: 'rumor', rumorCityIds: ['jeonju'], marker: '물동이', rumor: '전주 길에 콩쥐의 물동이 이야기가 있대.', event: '콩쥐가 물동이에 금이 갔는지 살피고 있어.', solution: '새는 곳을 천으로 감싸 주자.', choice: '물동이 돕기', result: '물이 새지 않아 밭에 줄 수 있었어.', requiredGoodId: 'cotton_cloth', reward: { stars: 1, storyFragment: 'kongjwi_water_jar' }, childSafetyNotes: '어려운 일을 함께 돕는 장면으로 바꾼다.', chainId: 'kongjwi_kindness', chainStep: 1 }),
  juniorStoryEvent({ id: 'E46', title: '콩쥐의 고운 마음 2', storySource: '콩쥐팥쥐 각색', category: 'market_story', regionId: 'jeolla', routeId: 'west_river_salt_road', triggerType: 'chain_followup', prerequisiteEventIds: ['E45'], rumorCityIds: ['jeonju', 'gwangju'], marker: '고운 마음', rumor: '콩쥐가 고운 마음으로 작은 선물을 나눈대.', event: '콩쥐가 남은 곡식을 필요한 곳에 나누려 해.', solution: '누구에게 필요한지 같이 적자.', choice: '나눔 명단 쓰기', result: '장사 노트에 따뜻한 거래가 적혔어.', reward: { seyeonNotebookProgress: 'trade', storyFragment: 'kongjwi_kind_list' }, childSafetyNotes: '친절과 기록에 집중한다.', chainId: 'kongjwi_kindness', chainStep: 2 }),
  juniorStoryEvent({ id: 'E47', title: '우렁이 논도우미', storySource: '우렁각시 각색', category: 'regional_learning', regionId: 'jeolla', routeId: 'field_rice_road', triggerType: 'market_enter', rumorCityIds: ['gwangju', 'suncheon'], marker: '논도우미', rumor: '논에서 우렁이가 일을 도와준다는 이야기가 있대.', event: '작은 우렁이가 논물 길을 막지 않게 알려 줘.', solution: '물길을 살짝 터 주자.', choice: '물길 터 주기', result: '논물이 고르게 흘렀어.', reward: { coins: 4, storyFragment: 'snail_field_helper' }, childSafetyNotes: '논을 돕는 작은 생명 이야기로 각색한다.' }),
  juniorStoryEvent({ id: 'E48', title: '장영실의 측우기', storySource: '장영실과 측우기', category: 'historical', regionId: 'gyeonggi', routeId: 'capital_rain_road', triggerType: 'city_visit', rumorCityIds: ['seoul'], marker: '측우기', rumor: '한양에 비의 양을 재는 멋진 그릇이 있대.', event: '장영실이 빗물을 재는 방법을 알려 줘.', solution: '눈금과 숫자를 함께 읽자.', choice: '눈금 읽기', result: '세연이가 날씨와 산수를 함께 배웠어.', quiz: { question: '측우기는 무엇을 재나요?', options: ['비', '불'], answer: '비', correctText: '맞아. 비를 재.', wrongText: '괜찮아. 다시 보자.' }, reward: { seyeonNotebookProgress: 'weather', storyFragment: 'jang_yeongsil_rain_gauge', cosmeticItemUnlock: 'story_rain_gauge' }, childSafetyNotes: '역사 인물을 발명과 관찰의 선생님으로 표현한다.' }),
  juniorStoryEvent({ id: 'E49', title: '김만덕의 나눔', storySource: '김만덕 이야기', category: 'historical', regionId: 'jeju', routeId: 'jeju_sea_route', triggerType: 'city_visit', rumorCityIds: ['jeju'], marker: '나눔 장터', rumor: '제주 장터에는 김만덕의 나눔 이야기가 전해진대.', event: '김만덕이 필요한 물건을 공평하게 나누고 있어.', solution: '물건 이름과 수량을 장부에 적자.', choice: '나눔 장부 쓰기', result: '세연이가 좋은 장사의 뜻을 배웠어.', reward: { seyeonNotebookProgress: 'trade', storyFragment: 'kim_mandeok_sharing' }, childSafetyNotes: '나눔과 책임감에 초점을 둔다.' }),
  juniorStoryEvent({ id: 'E50', title: '안동 선비의 책갈피', storySource: '안동 선비와 책 이야기', category: 'regional_learning', regionId: 'gyeongsang', routeId: 'mountain_paper_road', triggerType: 'market_enter', rumorCityIds: ['andong'], marker: '책갈피', rumor: '안동 선비가 잃어버린 책갈피를 찾는대.', event: '책갈피에 고을 이름과 물건 이름이 적혀 있어.', solution: '책갈피를 돌려주고 글자를 읽어 보자.', choice: '책갈피 돌려주기', result: '세연이 글 노트에 새 낱말이 붙었어.', requiredGoodId: 'paper', reward: { seyeonNotebookProgress: 'writing', storyFragment: 'andong_bookmark_words' }, childSafetyNotes: '엄격한 훈계가 아니라 조용히 책을 나누는 이야기로 표현한다.' })
];

export const JUNIOR_MAIN_STORY_EVENTS: JuniorMainStoryEvent[] = [
  {
    id: 'M01',
    title: '장부의 빛',
    summary: '낡은 장부가 빛나고 정우가 조선에 온다.',
    dialogue: [
      { speaker: '장부', icon: 'ledger', text: '낡은 장부가 반짝였어.' },
      { speaker: '정우', icon: 'jeongwoo', text: '여기는 어디지?' },
      { speaker: '바람이', icon: 'fairy', text: '정우야, 여긴 조선이야.' }
    ],
    reward: { storyFragment: 'ledger_light' }
  },
  {
    id: 'M02',
    title: '조선의 세연이',
    summary: '부산 장터에서 세연이를 만난다.',
    dialogue: [
      { speaker: '정우', icon: 'jeongwoo', text: '세연이랑 닮은 아이가 있어!' },
      { speaker: '세연이', icon: 'seyeon', text: '안녕. 나는 세연이야.' },
      { speaker: '바람이', icon: 'fairy', text: '이 만남은 장부가 부른 거야.' }
    ],
    reward: { storyFragment: 'meet_seyeon' }
  },
  {
    id: 'M03',
    title: '배우고 싶은 아이',
    summary: '세연이가 배우고 싶은 마음을 말한다.',
    dialogue: [
      { speaker: '세연이', icon: 'seyeon', text: '나는 글도 배우고 싶어.' },
      { speaker: '세연이', icon: 'seyeon', text: '지도와 날씨도 알고 싶어.' },
      { speaker: '바람이', icon: 'fairy', text: '세연이의 꿈을 도와주자.' }
    ],
    reward: { storyFragment: 'notebook_open' }
  },
  {
    id: 'M04',
    title: '첫 장사',
    summary: '부산 물건을 다른 고을에서 판다.',
    dialogue: [
      { speaker: '정우', icon: 'jeongwoo', text: '물건을 팔아서 돈을 벌었어.' },
      { speaker: '바람이', icon: 'fairy', text: '좋아. 이 돈은 꿈을 돕는 돈이야.' }
    ],
    reward: { stars: 1, storyFragment: 'first_trade' }
  },
  {
    id: 'M05',
    title: '첫 공부 선물',
    summary: '한지와 책 이야기로 글 공부를 시작한다.',
    dialogue: [
      { speaker: '세연이', icon: 'seyeon', text: '종이에 글을 써 보고 싶어.' },
      { speaker: '정우', icon: 'jeongwoo', text: '내가 공부 선물을 보낼게.' }
    ],
    reward: { notebookTopic: 'writing', storyFragment: 'writing_started' }
  },
  {
    id: 'M06',
    title: '산수 장부',
    summary: '장터 계산으로 산수를 배운다.',
    dialogue: [
      { speaker: '바람이', icon: 'fairy', text: '장사는 더하고 빼는 일이야.' },
      { speaker: '세연이', icon: 'seyeon', text: '나도 값을 셀 수 있어.' }
    ],
    reward: { notebookTopic: 'math', storyFragment: 'math_started' }
  },
  {
    id: 'M07',
    title: '팔도 지도',
    summary: '도시 도장으로 지도를 배운다.',
    dialogue: [
      { speaker: '세연이', icon: 'seyeon', text: '지도에는 길이 보여.' },
      { speaker: '정우', icon: 'jeongwoo', text: '우리가 간 고을을 표시하자.' }
    ],
    reward: { notebookTopic: 'map', storyFragment: 'map_started' }
  },
  {
    id: 'M08',
    title: '비와 별',
    summary: '날씨와 별 이야기를 배운다.',
    dialogue: [
      { speaker: '바람이', icon: 'fairy', text: '비는 재고, 별은 길을 알려 줘.' },
      { speaker: '세연이', icon: 'seyeon', text: '하늘도 공부가 되는구나.' }
    ],
    reward: { notebookTopic: 'weather', storyFragment: 'weather_started' }
  },
  {
    id: 'M09',
    title: '장사 배우기',
    summary: '세연이가 작은 장부를 쓴다.',
    dialogue: [
      { speaker: '세연이', icon: 'seyeon', text: '오늘 산 것과 판 것을 적을래.' },
      { speaker: '정우', icon: 'jeongwoo', text: '세연이 장부가 생겼네.' }
    ],
    reward: { notebookTopic: 'trade', storyFragment: 'trade_started' }
  },
  {
    id: 'M10',
    title: '장부 단서 첫 반짝임',
    summary: '서브 이야기에서 장부 단서를 찾는다.',
    dialogue: [
      { speaker: '장부', icon: 'ledger', text: '장부 한쪽이 반짝였어.' },
      { speaker: '바람이', icon: 'fairy', text: '돌아가는 문 단서야.' }
    ],
    reward: { ledgerClues: 1, storyFragment: 'first_ledger_clue' }
  },
  {
    id: 'M11',
    title: '세연이의 공부방',
    summary: '돈과 노트로 공부방을 완성한다.',
    dialogue: [
      { speaker: '세연이', icon: 'seyeon', text: '작은 공부방이 생겼어.' },
      { speaker: '정우', icon: 'jeongwoo', text: '이제 마음껏 배울 수 있어.' }
    ],
    reward: { studyRoomLevel: STORY_ENDING_STUDY_ROOM_LEVEL, storyFragment: 'study_room_done' }
  },
  {
    id: 'M12',
    title: '돌아가는 문',
    summary: '세연이의 꿈을 돕고 돌아갈 문을 연다.',
    dialogue: [
      { speaker: '바람이', icon: 'fairy', text: '문이 열렸어.' },
      { speaker: '세연이', icon: 'seyeon', text: '정우야, 고마워.' },
      { speaker: '정우', icon: 'jeongwoo', text: '세연이의 꿈을 꼭 기억할게.' }
    ],
    reward: { storyFragment: 'door_open' }
  }
];

export const DEFAULT_JUNIOR_SAVE: JuniorSave = {
  saveVersion: JUNIOR_SAVE_VERSION,
  currentStep: 'intro',
  currentCityId: 'busan',
  coins: 30,
  stars: 0,
  totalStarsEarned: 0,
  starBalance: 0,
  ownedStarItemIds: [],
  equippedStarItems: {},
  consumableItems: {},
  activeEffects: {
    fastTravelNextRoute: false,
    cargoProtectNextEvent: false,
    quizRetryAvailable: false
  },
  cargo: [],
  cargoLimit: 2,
  vehicleId: 'bundle',
  boatId: 'none',
  unlockedCities: JUNIOR_CITIES.map((city) => city.id),
  visitedCityIds: ['busan'],
  completedTutorial: false,
  tutorialStage: 0,
  seenEventIds: [],
  seenRegionalEventIds: [],
  storyArcProgress: {},
  mainStoryStage: 0,
  seyeonNotebook: { ...DEFAULT_SEYEON_NOTEBOOK },
  ledgerClues: 0,
  storyFragments: [],
  completedStoryEventIds: [],
  activeStoryEventId: undefined,
  selectedStoryEventId: undefined,
  pendingStoryRumorEventId: undefined,
  storyReturnStep: undefined,
  heardStoryEventIds: [],
  unlockedStarItemIds: [],
  rumorMarkers: {
    mountain: 'available',
    sea: 'available'
  },
  studyRoomLevel: 0,
  quizWrongStreak: 0,
  storyClues: 0,
  badges: [],
  completedEnding: false,
  completedRuns: 0,
  marketPressure: { buy: {}, sell: {} }
};

export function getGood(goodId: JuniorGoodId) {
  return JUNIOR_GOODS.find((good) => good.id === goodId) ?? JUNIOR_GOODS[0];
}
