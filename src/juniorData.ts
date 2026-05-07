import type { JuniorBoat, JuniorCity, JuniorCityId, JuniorEvent, JuniorGood, JuniorGoodId, JuniorReward, JuniorRoute, JuniorSave, JuniorVehicle } from './juniorTypes';

export const JUNIOR_SAVE_KEY = 'joseon_trade_junior_save_v1';
export const JUNIOR_SAVE_VERSION = 2;
export const FULL_MODE_URL = '../starter/';
export const ENDING_COINS = 300;

export function publicAsset(path: string) {
  if (!path.startsWith('/assets/')) return path;
  return `${import.meta.env.BASE_URL}${path.slice(1)}`;
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
    x: 64,
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
    x: 67,
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
    x: 75,
    y: 68,
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
    x: 70,
    y: 75,
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
    x: 54,
    y: 74,
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
    x: 61,
    y: 82,
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
    x: 42,
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
    y: 76,
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
    x: 46,
    y: 82,
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
    x: 50,
    y: 88,
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
    x: 27,
    y: 84,
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
    y: 96,
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
  { from: 'tsushima', to: 'china_port', kind: 'sea', scenery: 'sea', distance: 3, needsBoat: true, ...routeMeta('china_trade_sea_route', publicAsset('/assets/scenes/market-street.webp'), '섬을 지나 큰 항구로 가는 먼 바닷길', ['pirate', 'weather', 'merchant'], '먼 바다 끝에 큰 항구가 보여.', '중국 항구는 비단과 도자기가 유명해.', ['sea_dragon']) }
];

export const JUNIOR_VEHICLES: JuniorVehicle[] = [
  { id: 'bundle', name: '보따리 수레', cost: 0, cargoLimit: 2, text: '처음 쓰는 작은 수레', image: publicAsset('/assets/vehicles/polished-cart-bundle.png') },
  { id: 'handcart', name: '손수레', cost: 100, cargoLimit: 3, text: '짐을 하나 더 실어', image: publicAsset('/assets/vehicles/polished-cart-handcart.png') },
  { id: 'big_cart', name: '큰 수레', cost: 190, cargoLimit: 4, text: '짐을 더 많이 실어', image: publicAsset('/assets/vehicles/polished-cart-large.png') },
  { id: 'merchant_cart', name: '장사 수레', cost: 300, cargoLimit: 5, text: '먼 길도 든든해', image: publicAsset('/assets/vehicles/polished-cart-merchant.png') }
];

export const JUNIOR_BOATS: JuniorBoat[] = [
  { id: 'none', name: '배 없음', cost: 0, text: '아직 바닷길은 어려워', image: publicAsset('/assets/ui/result-ship.png') },
  { id: 'small_ferry', name: '작은 나룻배', cost: 200, text: '바닷길을 건널 때 좋아', image: publicAsset('/assets/boats/small_ferry.png') },
  { id: 'sailboat', name: '작은 돛배', cost: 360, text: '먼 바닷길도 든든해', image: publicAsset('/assets/boats/sailboat.png') },
  { id: 'sturdy_sailboat', name: '튼튼한 돛배', cost: 520, text: '큰 파도에도 든든해', image: publicAsset('/assets/boats/sturdy_sailboat.png') },
  { id: 'merchant_ship', name: '장사배', cost: 720, text: '멀리 장사 가기 좋아', image: publicAsset('/assets/boats/merchant_ship.png') }
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
  spellingEvent('bandit_spelling_1', 'quiz_bandit', 'land', '도적이 길을 막았어', 'bandit', '바른 말을 고르면 지나갈 수 있어.', ['맛춤법', '맞춤법', '맟춤법'], '맞춤법', '정답! 길이 열렸어.', '괜찮아. 짐 하나를 다시 묶었어.', { stars: 1 }, { coins: -5, loseCargo: 1 }),
  spellingEvent('bandit_spelling_2', 'quiz_bandit', 'land', '도적의 말놀이', 'bandit', '도적이 바른 말을 묻고 있어.', ['괜찮아', '괜찬아', '괜차나'], '괜찮아', '정답! 도적이 비켜줬어.', '조금 돌아가느라 돈을 잃었어.'),
  spellingEvent('bandit_spelling_3', 'quiz_bandit', 'land', '고개 길 도적', 'bandit', '바른 낱말을 골라보자.', ['어떻게', '어떡해', '어떠케'], '어떻게', '정답! 수레가 지나갔어.', '천천히 다시 가자.', { coins: 5 }, { coins: -5 }),
  spellingEvent('bandit_spelling_4', 'quiz_bandit', 'land', '숲길 도적', 'bandit', '헷갈리는 말을 골라야 해.', ['가르치다', '가리키다', '가르키다'], '가르치다', '정답! 도적이 놀랐어.', '조금 헤매다 지나갔어.'),
  spellingEvent('bandit_spelling_5', 'quiz_bandit', 'land', '다리 앞 도적', 'bandit', '바르게 쓴 말을 찾아보자.', ['며칠', '몇일', '멧일'], '며칠', '정답! 다리를 건넜어.', '돈을 조금 내고 건넜어.'),
  spellingEvent('bandit_spelling_6', 'quiz_bandit', 'land', '장터길 도적', 'bandit', '침착하게 바른 말을 골라봐.', ['안 돼', '안 되', '않 돼'], '안 돼', '정답! 무사히 지나갔어.', '괜찮아. 다시 묶고 가자.', { stars: 1 }, { coins: -5, loseCargo: 1 }),
  spellingEvent('pirate_spelling_1', 'quiz_pirate', 'sea', '해적이 배를 세웠어', 'pirate', '맞춤말을 맞히면 지나갈 수 있어.', ['바닷길', '바다길', '바닫길'], '바닷길', '정답! 해적이 길을 비켜줬어.', '파도가 높아 조금 돌아갔어.'),
  spellingEvent('pirate_spelling_2', 'quiz_pirate', 'sea', '해적의 말문제', 'pirate', '바른 말을 고르면 무사히 지나가.', ['돛단배', '돗단배', '돛딴배'], '돛단배', '정답! 바람이 도와줬어.', '배를 천천히 돌렸어.', { stars: 1 }, { coins: -5, loseCargo: 1 }),
  spellingEvent('pirate_spelling_3', 'quiz_pirate', 'sea', '바다 위 퀴즈', 'pirate', '차분히 보고 골라봐.', ['도착', '도작', '도착크'], '도착', '정답! 곧 항구에 닿아.', '조금 늦었지만 괜찮아.', { coins: 5 }, { coins: -5 }),
  spellingEvent('pirate_spelling_4', 'quiz_pirate', 'sea', '안개 속 해적', 'pirate', '안개 속에서도 바른 말을 찾아보자.', ['물결', '물껼', '물결르'], '물결', '정답! 물길이 열렸어.', '조금 돌아서 갔어.'),
  spellingEvent('pirate_spelling_5', 'quiz_pirate', 'sea', '섬 앞 해적', 'pirate', '섬 이름보다 말을 먼저 골라야 해.', ['괜히', '괜이', '괜히이'], '괜히', '정답! 해적이 웃으며 보내줬어.', '돈을 조금 잃었어.'),
  spellingEvent('pirate_spelling_6', 'quiz_pirate', 'sea', '큰 파도 해적', 'pirate', '바른 말을 고르면 파도를 넘어가.', ['금세', '금새', '금쎄'], '금세', '정답! 금세 지나갔어.', '잠깐 멈췄다가 갔어.'),
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

export const DEFAULT_JUNIOR_SAVE: JuniorSave = {
  saveVersion: JUNIOR_SAVE_VERSION,
  currentStep: 'intro',
  currentCityId: 'busan',
  coins: 30,
  stars: 0,
  cargo: [],
  cargoLimit: 2,
  vehicleId: 'bundle',
  boatId: 'none',
  unlockedCities: JUNIOR_CITIES.map((city) => city.id),
  visitedCityIds: ['busan'],
  completedTutorial: false,
  tutorialStage: 0,
  seenEventIds: [],
  storyArcProgress: {},
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
