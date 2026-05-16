import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { ENDING_COINS, FULL_MODE_URL, JUNIOR_BOATS, JUNIOR_CITIES, JUNIOR_ROUTES, JUNIOR_STAR_ITEMS, JUNIOR_VEHICLES, getGood, publicAsset } from './juniorData';
import {
  answerQuiz,
  buyBoat,
  buyGood,
  buySelectedGood,
  buyStarItem,
  buyVehicle,
  canTravel,
  chooseGood,
  closeEventResult,
  closeRegionalEvent,
  completeVisitIntro,
  continueAfterEnding,
  finishEnding,
  finishTravel,
  getBuyGoodsForCity,
  getDiscountedBuyPrice,
  getBuyPrice,
  getBestSellCityForGood,
  getCity,
  getConnectedCityIds,
  getMarketGoodsForCity,
  getRoute,
  getRouteScenery,
  getRecommendedMarketGoodId,
  getSelectedEvent,
  getSelectedRegionalEvent,
  getSellPriceForCargo,
  goToCity,
  goToMap,
  goToMarket,
  goToShop,
  loadJuniorSave,
  openEnding,
  prepareHalfPriceTicket,
  resetJuniorGame,
  resolveChoice,
  resolveSimpleEvent,
  saveJuniorGame,
  sellCargoItem,
  startIntro,
  startFastTravel,
  startTravel,
  equipStarItem,
  unequipStarItem,
  useStarConsumable
} from './juniorFlow';
import { useJuniorAudio, type JuniorAudioScene } from './juniorAudio';
import type { JuniorBoat, JuniorCargoItem, JuniorCity, JuniorCityId, JuniorEvent, JuniorGood, JuniorGoodId, JuniorRegionalEvent, JuniorSave, JuniorStarItem, JuniorVehicle } from './juniorTypes';

const eventSceneImages: Record<string, string> = {
  bandit: publicAsset('/assets/scenes/inland-city.webp'),
  pirate: publicAsset('/assets/scenes/south-port.webp'),
  animal: publicAsset('/assets/scenes/east-port.webp'),
  merchant: publicAsset('/assets/scenes/market-street.webp'),
  folktale: publicAsset('/assets/scenes/market-street.webp'),
  rain: publicAsset('/assets/scenes/west-mudflat.webp'),
  dog: publicAsset('/assets/scenes/east-port.webp'),
  cat: publicAsset('/assets/scenes/east-port.webp'),
  child: publicAsset('/assets/scenes/market-street.webp'),
  wind: publicAsset('/assets/scenes/south-port.webp'),
  book: publicAsset('/assets/events/book.svg'),
  map: publicAsset('/assets/events/book.svg'),
  market: publicAsset('/assets/scenes/market-street.webp'),
  home: publicAsset('/assets/events/ending_door.svg'),
  sun: publicAsset('/assets/scenes/south-port.webp'),
  cart: publicAsset('/assets/scenes/market-street.webp'),
  boat: publicAsset('/assets/scenes/south-port.webp'),
  fairy_cloth: publicAsset('/assets/scenes/west-mudflat.webp'),
  rice_cake: publicAsset('/assets/scenes/inland-city.webp'),
  tiger: publicAsset('/assets/scenes/east-port.webp'),
  sea_dragon: publicAsset('/assets/scenes/jeju.webp'),
  north_merchant: publicAsset('/assets/scenes/west-mudflat.webp')
};

const historicalCityNames: Partial<Record<JuniorCityId, string>> = {
  seoul: '한양',
  incheon: '제물포',
  gaeseong: '송도',
  busan: '부산포',
  mokpo: '목포진',
  tongyeong: '통제영',
  jeju: '제주목',
  sinuiju: '의주',
  cheongjin: '경흥',
  china_port: '큰 항구',
  north_port: '북방장'
};

function cityDisplayName(city: JuniorCity) {
  const oldName = historicalCityNames[city.id];
  return oldName && oldName !== city.name ? `${city.name}(${oldName})` : city.name;
}

function useJuniorSave() {
  const [save, setSave] = useState<JuniorSave>(() => loadJuniorSave());
  useEffect(() => {
    saveJuniorGame(save);
  }, [save]);
  return [save, setSave] as const;
}

function useNetworkStatus() {
  const [online, setOnline] = useState(() => typeof navigator === 'undefined' ? true : navigator.onLine);
  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);
  return online;
}

function formatSaveTime(value?: string) {
  if (!value) return '저장 준비 중';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '저장 준비 중';
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function hasContinueInfo(save: JuniorSave) {
  return Boolean(
    save.lastSavedAt
    && (save.completedTutorial || save.tutorialStage > 0 || save.coins !== 30 || save.cargo.length > 0 || save.completedRuns > 0)
  );
}

function handleImageFallback(event: { currentTarget: HTMLImageElement }) {
  const image = event.currentTarget;
  if (image.dataset.fallbackApplied) return;
  image.dataset.fallbackApplied = 'true';
  image.src = publicAsset('/assets/events/book.svg');
}

function NetworkStatus({ online }: { online: boolean }) {
  if (online) return null;
  return (
    <div className="junior-network-banner" role="status">
      인터넷이 잠깐 끊겼어. 저장은 이 화면에서 지켜둘게.
    </div>
  );
}

function getVehicle(save: JuniorSave) {
  return JUNIOR_VEHICLES.find((vehicle) => vehicle.id === save.vehicleId) ?? JUNIOR_VEHICLES[0];
}

function getBoat(save: JuniorSave) {
  return JUNIOR_BOATS.find((boat) => boat.id === save.boatId) ?? JUNIOR_BOATS[0];
}

function getBoatCargoLimit(save: JuniorSave) {
  return getBoat(save).cargoLimit ?? 0;
}

function getRouteCargoCopy(save: JuniorSave, kind?: 'land' | 'sea') {
  const vehicle = getVehicle(save);
  const boat = getBoat(save);
  if (kind === 'sea') {
    return {
      label: '이번 길: 바닷길',
      detail: save.boatId === 'none' ? '배가 필요해!' : '이번 길에는 배 짐칸을 써요.',
      vehicle: `배: ${boat.name} · 바닷길 짐칸 ${boat.cargoLimit}칸`,
      testId: 'route-sea-cargo'
    };
  }
  return {
    label: '이번 길: 땅길',
    detail: '이번 길에는 수레 짐칸을 써요.',
    vehicle: `수레: ${vehicle.name} · 땅길 짐칸 ${vehicle.cargoLimit}칸`,
    testId: 'route-land-cargo'
  };
}

function tutorialLine(save: JuniorSave) {
  if (save.completedTutorial) return undefined;
  if (save.currentStep === 'city' && save.tutorialStage <= 1) return ['정우야, 먼저 장터에서 물건을 사보자.'];
  if (save.currentStep === 'market' && save.tutorialStage <= 3) return ['면포나 건어물을 하나 사보자.'];
  if (save.currentStep === 'map' && save.tutorialStage <= 5) return ['이제 대구로 가보자.'];
  if (save.currentStep === 'event') return ['차분히 보고 바른 말을 골라봐.'];
  if (save.currentStep === 'visitIntro') return undefined;
  return undefined;
}

function fairyLines(save: JuniorSave, event?: JuniorEvent) {
  if (event) return [event.fairyText];
  const tutorial = tutorialLine(save);
  if (tutorial) return tutorial;
  if (save.currentStep === 'travel' && save.destinationCityId) {
    const destination = getCity(save.destinationCityId);
    const route = getRoute(save.currentCityId, save.destinationCityId);
    const scenery = getRouteScenery(save.currentCityId, save.destinationCityId);
    const sceneCopy = getTravelSceneCopy(scenery, route?.kind === 'sea', destination.name);
    return [`정우야, ${cityDisplayName(destination)}으로 가는 중이야.`, sceneCopy.hint];
  }
  if (save.message) return [save.message];
  const lines: Record<string, string[]> = {
    intro: ['정우야, 여긴 조선이야!', '작은 장사를 시작해 보자.'],
    city: ['정우야, 다음 일을 골라봐.'],
    map: ['갈 도시를 골라봐.'],
    travel: ['길을 따라 가는 중이야.'],
    visitIntro: ['처음 온 고을이야.'],
    market: ['사거나 팔 물건을 골라봐.'],
    eventResult: ['잘했어. 이제 다시 움직이자.'],
    regionalEvent: ['고을 이야기를 들어보자.'],
    shop: ['새 수레와 배를 장만할 수 있어.'],
    endingChoice: ['장부가 다 빛났어.', '이제 집으로 갈 수 있어.'],
    ending: ['멋진 꼬마 거상이야!']
  };
  return lines[save.currentStep] ?? ['정우야, 천천히 해보자.'];
}

function audioSceneForStep(step: JuniorSave['currentStep']): JuniorAudioScene {
  if (step === 'market') return 'market';
  if (step === 'map') return 'map';
  if (step === 'travel') return 'travel';
  if (step === 'event' || step === 'eventResult' || step === 'regionalEvent') return 'event';
  if (step === 'shop') return 'shop';
  if (step === 'ending' || step === 'endingChoice') return 'ending';
  return 'city';
}

function TopBar({ save, audio, onStarOpen }: { save: JuniorSave; audio: ReturnType<typeof useJuniorAudio>; onStarOpen: () => void }) {
  const city = getCity(save.currentCityId);
  return (
    <header className="junior-topbar" aria-label="현재 상태">
      <img src={publicAsset('/assets/jeongwoo/jeongwoo.png')} alt="정우" />
      <strong>정우</strong>
      <span className="junior-pill" data-testid="junior-city-name">{cityDisplayName(city)}</span>
      <span className="junior-pill" data-testid="junior-coins">돈 {save.coins}</span>
      <button className="junior-pill junior-star-pill junior-star-button" data-testid="star-chip" title={`모은 별 총 ${save.totalStarsEarned}`} type="button" onClick={onStarOpen}>별 {save.starBalance}</button>
      <span className={`junior-pill ${save.cargo.length >= save.cargoLimit ? 'junior-full-cargo' : ''}`}>짐 {save.cargo.length}/{save.cargoLimit}</span>
      <div className="junior-audio-controls" data-testid="junior-audio-controls" aria-label="소리 설정">
        <button type="button" className={audio.unlocked ? 'ready' : ''} data-testid="junior-audio-prime" onClick={audio.prime}>소리</button>
        <button type="button" className={audio.settings.music ? 'active' : ''} aria-label={audio.settings.music ? '배경음악 끄기' : '배경음악 켜기'} onClick={audio.toggleMusic}>♪</button>
        <button type="button" className={audio.settings.sfx ? 'active' : ''} aria-label={audio.settings.sfx ? '효과음 끄기' : '효과음 켜기'} onClick={audio.toggleSfx}>딸깍</button>
      </div>
    </header>
  );
}

function FairyTalk({ save, lines }: { save: JuniorSave; lines?: string[] }) {
  const talkLines = lines ?? fairyLines(save);
  const isHappy = ['city', 'eventResult', 'shop', 'endingChoice', 'ending'].includes(save.currentStep);
  return (
    <section className="junior-talk" data-testid="fairy-talk" aria-live="polite">
      <img className="junior-fairy-face" src={publicAsset(isHappy ? '/assets/fairy/fairy-happy.png' : '/assets/fairy/fairy-default.png')} alt="바람이" />
      <div className="junior-speech">
        {talkLines.slice(0, 2).map((line) => <p key={line}>{line}</p>)}
      </div>
    </section>
  );
}

function GoodArt({ good }: { good: JuniorGood }) {
  return <img className="junior-good-img" src={good.image} alt="" loading="lazy" onError={handleImageFallback} />;
}

function CargoSlots({ save, pulse = false }: { save: JuniorSave; pulse?: boolean }) {
  return (
    <div className={`junior-cargo-slots ${pulse ? 'pulse' : ''}`} data-testid="cargo-slots" aria-label="짐칸">
      {Array.from({ length: save.cargoLimit }).map((_, index) => {
        const item = save.cargo[index];
        const good = item ? getGood(item.goodId) : undefined;
        return (
          <span className={`junior-cargo-slot ${good ? 'filled' : ''}`} key={index}>
            {good ? <img src={good.image} alt={good.name} /> : <em>빈칸</em>}
          </span>
        );
      })}
    </div>
  );
}

function IntroScreen({ save, onStart }: { save: JuniorSave; onStart: () => void }) {
  const city = getCity(save.currentCityId);
  const showContinue = hasContinueInfo(save);
  return (
    <section className="junior-screen junior-intro" data-testid="screen-intro">
      <div className="junior-book-scene">
        <div className="junior-intro-title">
          <span>라이트 모드</span>
          <strong>정우의 꼬마 거상 모험</strong>
          <small>도시를 돌며 물건을 사고팔아요.</small>
        </div>
        <img src={publicAsset('/assets/jeongwoo/jeongwoo.png')} alt="" onError={handleImageFallback} />
        <img className="junior-book-art" src={publicAsset('/assets/events/book.svg')} alt="" onError={handleImageFallback} />
      </div>
      {showContinue && (
        <div className="junior-continue-card" data-testid="continue-card">
          <strong>이어하기</strong>
          <span>{cityDisplayName(city)} · 돈 {save.coins} · 별 {save.starBalance}</span>
          <small>짐 {save.cargo.length}/{save.cargoLimit} · {formatSaveTime(save.lastSavedAt)}</small>
        </div>
      )}
      <button className="junior-button junior-primary" data-testid="start-play" onClick={onStart}>{showContinue ? '이어하기' : '시작하기'}</button>
    </section>
  );
}

function QuickNav({ save, onCity, onMap, onMarket, onShop }: { save: JuniorSave; onCity: () => void; onMap: () => void; onMarket: () => void; onShop: () => void }) {
  if (['intro', 'pick', 'buy', 'travel', 'visitIntro', 'event', 'eventResult', 'regionalEvent', 'endingChoice', 'ending'].includes(save.currentStep)) return null;
  const itemClass = (step: JuniorSave['currentStep']) => save.currentStep === step ? 'active' : '';
  return (
    <nav className="junior-bottom-nav" aria-label="주요 이동">
      <button className={itemClass('city')} data-testid="nav-city" onClick={onCity}>도시</button>
      <button className={itemClass('map')} data-testid="nav-map" onClick={onMap}>지도</button>
      <button className={itemClass('market')} data-testid="nav-market" onClick={onMarket}>장터</button>
      <button className={itemClass('shop')} data-testid="nav-shop" onClick={onShop}>수레·배</button>
    </nav>
  );
}

function PickScreen({ save, onPick }: { save: JuniorSave; onPick: (good: JuniorGood) => void }) {
  const goods = getBuyGoodsForCity(save.currentCityId).slice(0, 3);
  return (
    <section className="junior-screen junior-pick" data-testid="screen-pick">
      <div className="junior-good-grid">
        {goods.map((good) => (
          <button className="junior-good-card" data-testid={`good-${good.id}`} key={good.id} onClick={() => onPick(good)}>
            <span className="junior-star-label" aria-label="추천">추천</span>
            <GoodArt good={good} />
            <span>
              <strong>{good.name}</strong>
              <small>사는 값 {getBuyPrice(save, save.currentCityId, good.id)}냥</small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function CargoScene({ good, cartImage }: { good?: JuniorGood; cartImage: string }) {
  return (
    <div className="junior-cargo-scene" data-testid="cargo-scene" aria-label="짐 싣기">
      <img className="junior-cart-image" src={cartImage} alt="" />
      {good && <img className="junior-bag-good" src={good.image} alt="" />}
    </div>
  );
}

function BuyScreen({ save, onBuy }: { save: JuniorSave; onBuy: () => void }) {
  const good = save.selectedGoodId ? getGood(save.selectedGoodId) : undefined;
  return (
    <section className="junior-screen junior-buy" data-testid="screen-buy">
      <CargoScene good={good} cartImage={getVehicle(save).image} />
      <button className="junior-button junior-primary" data-testid="buy-good" onClick={onBuy}>짐에 싣기</button>
    </section>
  );
}

const cityMotifs: Partial<Record<JuniorCityId, { color: string; accent: string; motif: 'palace' | 'gate' | 'river' | 'mountain' | 'port' | 'market' | 'paper' | 'field' | 'citrus' | 'fish' | 'salt' | 'herb'; label: string }>> = {
  seoul: { color: '#e9bf74', accent: '#9b3f34', motif: 'palace', label: '궁' },
  gaeseong: { color: '#c99568', accent: '#6d4a28', motif: 'market', label: '상' },
  pyongyang: { color: '#d7b07a', accent: '#596b8e', motif: 'gate', label: '성' },
  sinuiju: { color: '#8ec9b8', accent: '#2e83a6', motif: 'river', label: '강' },
  chuncheon: { color: '#8fca9c', accent: '#4d84a8', motif: 'river', label: '호' },
  gangneung: { color: '#7fb9cf', accent: '#2f7d9b', motif: 'mountain', label: '산' },
  wonsan: { color: '#7bc1d4', accent: '#2d8a9d', motif: 'port', label: '항' },
  hamheung: { color: '#9cc28d', accent: '#6a7b39', motif: 'mountain', label: '산' },
  cheongjin: { color: '#74b9c8', accent: '#265f7d', motif: 'port', label: '북' },
  andong: { color: '#d8c28d', accent: '#7d5a36', motif: 'paper', label: '책' },
  daegu: { color: '#9ac878', accent: '#4d7d35', motif: 'herb', label: '약' },
  jeonju: { color: '#e6d49a', accent: '#916d42', motif: 'paper', label: '한' },
  gwangju: { color: '#c8d47c', accent: '#7b8d34', motif: 'field', label: '쌀' },
  mokpo: { color: '#d7bf94', accent: '#498ca4', motif: 'salt', label: '염' },
  yeosu: { color: '#84c6d8', accent: '#297f9b', motif: 'fish', label: '어' },
  suncheon: { color: '#a9d28e', accent: '#5c8c47', motif: 'field', label: '들' },
  jinju: { color: '#c8b47e', accent: '#775239', motif: 'gate', label: '성' },
  tongyeong: { color: '#80bed4', accent: '#286f91', motif: 'fish', label: '바' },
  busan: { color: '#78bfdb', accent: '#2a7f9e', motif: 'port', label: '배' },
  ulsan: { color: '#86c8ce', accent: '#5c7430', motif: 'port', label: '목' },
  jeju: { color: '#efbd63', accent: '#e07a32', motif: 'citrus', label: '귤' }
};

function CityMotif({ city }: { city: JuniorCity }) {
  const theme = cityMotifs[city.id] ?? cityMotifs.busan!;
  const common = { stroke: 'rgba(65,46,26,.28)', strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg className="junior-city-illustration" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id={`cityGlow-${city.id}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={theme.color} stopOpacity=".45" />
          <stop offset="1" stopColor={theme.accent} stopOpacity=".22" />
        </linearGradient>
      </defs>
      <path d="M0 68 C18 58 32 62 48 55 C64 48 79 52 100 42 L100 100 L0 100 Z" fill={`url(#cityGlow-${city.id})`} />
      <circle cx="80" cy="18" r="9" fill={theme.color} opacity=".32" />
      <circle cx="17" cy="80" r="13" fill="rgba(255,246,210,.22)" />
      {theme.motif === 'palace' && <g><path d="M16 62 L34 50 L52 62 Z" fill={theme.accent} {...common} /><rect x="20" y="62" width="28" height="17" rx="2" fill={theme.color} {...common} /><rect x="29" y="66" width="10" height="13" fill="#5f3d2b" opacity=".75" /></g>}
      {theme.motif === 'gate' && <g><rect x="15" y="58" width="42" height="19" rx="3" fill={theme.color} {...common} /><path d="M12 58 L36 45 L60 58 Z" fill={theme.accent} {...common} /><path d="M29 77 C30 67 42 67 44 77" fill="rgba(64,42,25,.68)" /></g>}
      {theme.motif === 'river' && <g><path d="M0 76 C18 64 34 84 50 70 C66 56 83 72 100 61" fill="none" stroke={theme.accent} strokeWidth="8" opacity=".58" /><path d="M9 66 L48 66" stroke={theme.color} strokeWidth="4" strokeLinecap="round" /></g>}
      {theme.motif === 'mountain' && <g><path d="M8 78 L30 40 L52 78 Z" fill={theme.accent} opacity=".62" {...common} /><path d="M38 78 L62 34 L90 78 Z" fill={theme.color} opacity=".72" {...common} /><path d="M58 43 L63 52 L68 45" fill="none" stroke="#fff6d9" strokeWidth="2.5" /></g>}
      {theme.motif === 'port' && <g><path d="M8 78 C25 70 39 82 57 74 C70 69 84 73 100 66 L100 100 L8 100 Z" fill={theme.accent} opacity=".52" /><path d="M22 67 L38 67 L45 77 L18 77 Z" fill={theme.color} {...common} /><path d="M34 67 L34 46 L49 60 Z" fill="#fff6d9" {...common} /></g>}
      {theme.motif === 'market' && <g><rect x="13" y="59" width="42" height="20" rx="4" fill={theme.color} {...common} /><path d="M13 59 L18 49 H50 L55 59" fill={theme.accent} {...common} /><circle cx="24" cy="79" r="4" fill="#5f3d2b" /><circle cx="45" cy="79" r="4" fill="#5f3d2b" /></g>}
      {theme.motif === 'paper' && <g><rect x="18" y="48" width="36" height="30" rx="5" fill="#fff8d7" {...common} /><path d="M26 55 H46 M26 63 H42 M26 71 H48" stroke={theme.accent} strokeWidth="3" strokeLinecap="round" /></g>}
      {theme.motif === 'field' && <g>{[18, 28, 38, 48, 58].map((x) => <path key={x} d={`M${x} 80 C${x - 6} 70 ${x + 6} 61 ${x} 50`} fill="none" stroke={theme.accent} strokeWidth="3" strokeLinecap="round" />)}<path d="M0 82 H100" stroke={theme.color} strokeWidth="7" opacity=".5" /></g>}
      {theme.motif === 'citrus' && <g>{[[24, 62], [39, 72], [54, 60], [67, 73]].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="8" fill={theme.accent} {...common} />)}<path d="M48 48 C55 41 63 45 66 52" fill="none" stroke="#5e9140" strokeWidth="4" /></g>}
      {theme.motif === 'fish' && <g><path d="M17 66 C31 52 52 52 65 66 C52 80 31 80 17 66 Z" fill={theme.color} {...common} /><path d="M65 66 L84 54 L84 78 Z" fill={theme.accent} {...common} /><circle cx="31" cy="63" r="2.5" fill="#2f2619" /></g>}
      {theme.motif === 'salt' && <g><path d="M15 78 L31 50 L48 78 Z" fill="#fff6d9" {...common} /><path d="M38 78 L54 46 L72 78 Z" fill={theme.color} opacity=".72" {...common} /><path d="M9 82 H84" stroke={theme.accent} strokeWidth="5" strokeLinecap="round" /></g>}
      {theme.motif === 'herb' && <g>{[25, 39, 53, 67].map((x) => <path key={x} d={`M${x} 80 C${x - 10} 62 ${x + 7} 51 ${x} 39 C${x + 14} 51 ${x - 2} 63 ${x} 80`} fill={theme.color} opacity=".75" {...common} />)}</g>}
    </svg>
  );
}

function cityKindLabel(city: JuniorCity) {
  const labels: Record<NonNullable<JuniorCity['kind']>, string> = {
    inland_market: '내륙 장터',
    east_port: '동해 항구',
    south_port: '남해 항구',
    west_port: '서해 항구',
    north_trade_port: '북방 장터',
    island: '섬 거점'
  };
  return city.kind ? labels[city.kind] : '장터 도시';
}

function cityNodeIcon(city: JuniorCity) {
  if (city.kind === 'island') return '섬';
  if (city.kind === 'north_trade_port') return '북';
  if (city.kind?.includes('port')) return '⚓';
  if (city.buyGoodIds.includes('paper')) return '책';
  if (city.buyGoodIds.includes('herbs')) return '잎';
  if (city.buyGoodIds.includes('salt')) return '소';
  return '장';
}

function marketHintForCity(city?: JuniorCity) {
  if (!city) return '다음 장터에서 인기 많아';
  if (city.kind === 'west_port' || city.kind === 'east_port' || city.kind === 'south_port') return `${cityDisplayName(city)}에서 찾는 사람이 많아`;
  if (city.kind === 'north_trade_port') return `${cityDisplayName(city)}에서 값이 좋아`;
  if (city.kind === 'island') return `${cityDisplayName(city)}에서 인기 많아`;
  return `${cityDisplayName(city)} 장터에서 잘 팔려`;
}

type JuniorGoalAction = 'market' | 'map' | 'shop' | 'ending';

function isGoodSalePlace(save: JuniorSave, item: JuniorCargoItem) {
  const city = getCity(save.currentCityId);
  return item.fromCityId !== city.id && !city.buyGoodIds.includes(item.goodId) && (city.sellGoodIds.includes(item.goodId) || city.id === 'seoul');
}

function getNextVehicle(save: JuniorSave) {
  const current = getVehicle(save);
  return JUNIOR_VEHICLES
    .filter((vehicle) => vehicle.id !== 'bundle' && vehicle.cargoLimit > current.cargoLimit)
    .sort((a, b) => a.cost - b.cost)[0];
}

function getNextBoat(save: JuniorSave) {
  const currentIndex = JUNIOR_BOATS.findIndex((boat) => boat.id === save.boatId);
  return JUNIOR_BOATS.find((boat, index) => boat.id !== 'none' && index > currentIndex);
}

function getTodayGoal(save: JuniorSave): { text: string; hint: string; action: JuniorGoalAction; actionLabel: string } {
  const city = getCity(save.currentCityId);
  const firstCargo = save.cargo[0];
  if (save.coins >= ENDING_COINS) {
    return { text: '집으로 돌아가자.', hint: '장부가 반짝이고 있어.', action: 'ending', actionLabel: '집으로' };
  }
  if (firstCargo) {
    const good = getGood(firstCargo.goodId);
    if (isGoodSalePlace(save, firstCargo)) {
      return { text: `${good.name}이 여기서 잘 팔려.`, hint: '여기서 값이 좋아.', action: 'market', actionLabel: '팔기' };
    }
    const bestCity = getBestSellCityForGood(firstCargo.goodId, firstCargo.fromCityId);
    return { text: `${bestCity?.name ?? '다른 장터'}에서 인기 많아.`, hint: `${good.name}을 가져가면 좋아.`, action: 'map', actionLabel: '지도 보기' };
  }
  const nextVehicle = getNextVehicle(save);
  if (nextVehicle && save.coins >= Math.max(70, nextVehicle.cost - 25)) {
    const left = Math.max(0, nextVehicle.cost - save.coins);
    return { text: `${nextVehicle.name}를 장만하자.`, hint: left ? `${left}냥만 더 모으면 돼.` : '지금 살 수 있어.', action: 'shop', actionLabel: '수레·배' };
  }
  const firstGood = getGood(city.buyGoodIds[0]);
  return { text: `${cityDisplayName(city)}에서 ${firstGood.name}을 사자.`, hint: '이 도시 물건이야.', action: 'market', actionLabel: '장터 가기' };
}

function TodayGoalCard({ goal, onAction }: { goal: ReturnType<typeof getTodayGoal>; onAction: () => void }) {
  return (
    <section className={`junior-today-goal goal-${goal.action}`} data-testid="today-goal-card">
      <span>오늘 할 일</span>
      <strong>{goal.text}</strong>
      <small>{goal.hint}</small>
      <button className="junior-button junior-primary" data-testid="today-goal-action" onClick={onAction}>{goal.actionLabel}</button>
    </section>
  );
}

function RouteCard({ save, city }: { save: JuniorSave; city: JuniorCity }) {
  const route = getRoute(save.currentCityId, city.id);
  const canDepart = canTravel(save, city.id);
  const cargoCopy = getRouteCargoCopy(save, route?.kind);
  const label = route?.kind === 'sea'
    ? '바닷길'
    : route?.routeType?.includes('north')
      ? '북방길'
      : route?.scenery === 'mountain'
        ? '산길'
        : '장터길';
  const hint = route?.kind === 'sea'
    ? (save.boatId === 'none' ? '작은 배가 있으면 좋아.' : '파도를 보며 천천히 가자.')
    : route?.fairyText ?? '수레를 끌고 천천히 가자.';
  return (
    <div className={`junior-route-card ${route?.kind ?? 'land'}`} data-testid="route-card-before-travel">
      <b>{label}</b>
      <span>{hint}</span>
      <div className="junior-route-cargo" data-testid={cargoCopy.testId}>
        <strong>{cargoCopy.label}</strong>
        <span>{cargoCopy.vehicle}</span>
        <small>{cargoCopy.detail}</small>
      </div>
      <small>{canDepart ? '출발 준비 끝' : route?.kind === 'sea' ? '작은 나룻배를 장만하면 갈 수 있어.' : '아직 준비가 필요해'}</small>
    </div>
  );
}

function CityScreen({ save, onMarket, onMap, onShop, onEnding, onUseRumor }: { save: JuniorSave; onMarket: () => void; onMap: () => void; onShop: () => void; onEnding: () => void; onUseRumor: () => void }) {
  const [showCargo, setShowCargo] = useState(false);
  const city = getCity(save.currentCityId);
  const cityGoods = city.buyGoodIds.slice(0, 3).map(getGood);
  const tutorial = !save.completedTutorial && save.tutorialStage <= 1;
  const nextGoal = save.coins >= ENDING_COINS
    ? '집으로 갈 수 있어!'
    : save.coins < 100
      ? '100냥을 모아 보자.'
      : save.boatId === 'none'
        ? '배를 장만해 보자.'
        : `${ENDING_COINS}냥까지 조금씩 모으자.`;
  const goal = getTodayGoal(save);
  const runGoal = () => {
    if (goal.action === 'market') onMarket();
    if (goal.action === 'map') onMap();
    if (goal.action === 'shop') onShop();
    if (goal.action === 'ending') onEnding();
  };
  const focusClass = (action: JuniorGoalAction) => goal.action === action ? 'today-focus' : '';
  return (
    <section className={`junior-screen junior-city-dashboard junior-city-${city.id}`} data-testid="screen-city">
      <div className="junior-city-header-card">
        <img src={city.backgroundAsset ?? city.scene} alt="" loading="lazy" onError={handleImageFallback} />
        <div>
          <span>{cityKindLabel(city)}</span>
          <strong>{cityDisplayName(city)} 장터</strong>
          <small>{city.note}</small>
        </div>
      </div>
      <div className="junior-city-info-grid">
        <section className="junior-city-panel junior-city-specialties">
          <b>이곳 특산품</b>
          <div>
            {cityGoods.map((good) => (
              <span key={good.id}>
                <img src={good.image} alt="" />
                {good.name}
              </span>
            ))}
          </div>
        </section>
        <section className="junior-city-panel junior-city-recommend">
          <b>추천 행동</b>
          <span>{save.cargo.length ? '잘 팔리는 장터를 찾아보자.' : '먼저 장터에서 물건을 골라보자.'}</span>
        </section>
      </div>
      <TodayGoalCard goal={goal} onAction={runGoal} />
      {(save.consumableItems.ticket_extra_rumor ?? 0) > 0 && (
        <button className="junior-inline-consumable" data-testid="use-rumor-ticket" onClick={onUseRumor}>소문 듣기</button>
      )}
      {showCargo && (
        <div className="junior-city-cargo" data-testid="cargo-panel">
          <CargoSlots save={save} />
          <span>{save.cargo.length ? '팔 물건이 있어.' : '짐이 비었어.'}</span>
        </div>
      )}
      <div className="junior-city-actions">
        <button className={`junior-action-button ${tutorial ? 'tutorial-focus' : ''} ${focusClass('market')}`} data-testid="open-market" onClick={onMarket}>장터 가기</button>
        <button className={`junior-action-button ${focusClass('map')}`} data-testid="open-map" onClick={onMap}>지도 보기</button>
        {save.coins >= ENDING_COINS ? (
          <button className={`junior-action-button home ${focusClass('ending')}`} data-testid="open-ending" onClick={onEnding}>집으로</button>
        ) : (
          <button className="junior-action-button" data-testid="open-cargo" onClick={() => setShowCargo((value) => !value)}>짐 보기</button>
        )}
        <button className={`junior-action-button ${focusClass('shop')}`} data-testid="open-shop" onClick={onShop}>수레·배</button>
      </div>
      <div className="junior-progress-card" data-testid="junior-progress-card">
        <b>도시 도장 {save.visitedCityIds.length}/{JUNIOR_CITIES.length}</b>
        <div className="junior-city-stamps" data-testid="city-stamp">
          {save.visitedCityIds.slice(-5).map((cityId) => <span key={cityId}>{cityDisplayName(getCity(cityId))}</span>)}
        </div>
        <span>{nextGoal}</span>
        {save.badges.length > 0 && <small>{save.badges.slice(-2).join(' · ')}</small>}
      </div>
    </section>
  );
}

const MAP_ZOOM = 1.28;
const MAP_PAN_LIMIT = 160;

function clampMapPan(value: number) {
  return Math.max(-MAP_PAN_LIMIT, Math.min(MAP_PAN_LIMIT, value));
}

function KoreaMap({ save, selectedCityId, onCity, children }: { save: JuniorSave; selectedCityId?: JuniorCityId; onCity: (city: JuniorCity) => void; children?: ReactNode }) {
  const connected = getConnectedCityIds(save);
  const [pan, setPan] = useState({ x: 0, y: -18 });
  const dragRef = useRef({ active: false, moved: false, startX: 0, startY: 0, panX: 0, panY: 0 });
  const ignoreClickRef = useRef(false);

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    if ((event.target as HTMLElement).closest('button')) return;
    dragRef.current = { active: true, moved: false, startX: event.clientX, startY: event.clientY, panX: pan.x, panY: pan.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.abs(dx) + Math.abs(dy) > 5) {
      drag.moved = true;
      ignoreClickRef.current = true;
    }
    setPan({ x: clampMapPan(drag.panX + dx), y: clampMapPan(drag.panY + dy) });
  };
  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const moved = dragRef.current.moved;
    dragRef.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (moved) window.setTimeout(() => { ignoreClickRef.current = false; }, 90);
  };

  return (
    <div
      className={`junior-map-board ${dragRef.current.active ? 'dragging' : ''}`}
      data-testid="korea-map"
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        className="junior-map-pan-layer"
        data-testid="map-pan-layer"
        style={{ '--map-zoom': MAP_ZOOM, transform: `translate(${pan.x}px, ${pan.y}px) scale(${MAP_ZOOM})` } as CSSProperties}
      >
        <img className="junior-map-bg" src={publicAsset('/assets/maps/korea-approved-map.webp')} alt="" aria-hidden="true" loading="lazy" onError={handleImageFallback} />
        <svg className="junior-map-svg" viewBox="0 0 100 100" aria-hidden="true">
          {JUNIOR_ROUTES.map((route) => {
            const from = getCity(route.from);
            const to = getCity(route.to);
            return <line key={`${route.from}-${route.to}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={route.kind === 'sea' ? 'sea' : 'land'} />;
          })}
        </svg>
        {JUNIOR_CITIES.map((city) => {
          const current = city.id === save.currentCityId;
          const selected = city.id === selectedCityId;
          const unlocked = save.unlockedCities.includes(city.id);
          const connectedUnlocked = connected.includes(city.id) && unlocked;
          const reachable = connectedUnlocked && canTravel(save, city.id);
          const unavailable = !current && connectedUnlocked && !reachable;
          const disabled = !current && !connectedUnlocked;
          return (
            <button
              key={city.id}
              className={`junior-city-dot ${current ? 'current' : ''} ${selected ? 'selected' : ''} ${reachable ? 'reachable' : ''} ${unavailable ? 'unavailable' : ''} ${!unlocked ? 'locked' : ''}`}
              style={{ left: `${city.x}%`, top: `${city.y}%` }}
              disabled={disabled}
              data-testid={`city-${city.id}`}
              aria-label={cityDisplayName(city)}
              onClick={(event) => {
                if (ignoreClickRef.current) {
                  event.preventDefault();
                  event.stopPropagation();
                  return;
                }
                onCity(city);
              }}
            >
              <span aria-hidden="true">{cityNodeIcon(city)}</span>
              <strong>{city.name}</strong>
            </button>
          );
        })}
        {children}
      </div>
    </div>
  );
}

function MapScreen({ save, onDepart, onFastDepart, onBack }: { save: JuniorSave; onDepart: (city: JuniorCity) => void; onFastDepart: (city: JuniorCity) => void; onBack: () => void }) {
  const connectedCities = getConnectedCityIds(save);
  const preferred = !save.completedTutorial
    ? 'daegu'
    : connectedCities.find((cityId) => save.currentCityId === 'busan' && cityId === 'daegu' && canTravel(save, cityId))
      ?? connectedCities.find((cityId) => canTravel(save, cityId));
  const [selectedCityId, setSelectedCityId] = useState<JuniorCityId | undefined>(preferred);
  const selectedCity = selectedCityId ? getCity(selectedCityId) : undefined;
  const goods = selectedCity ? selectedCity.buyGoodIds.slice(0, 2).map(getGood) : [];
  const good = goods[0];
  const route = selectedCity ? getRoute(save.currentCityId, selectedCity.id) : undefined;
  const canDepart = selectedCity ? canTravel(save, selectedCity.id) : false;
  const quickCities = connectedCities
    .filter((cityId) => cityId !== save.currentCityId && canTravel(save, cityId))
    .map(getCity);
  const bubbleStyle = selectedCity
    ? ({ '--map-bubble-x': `${selectedCity.x}%`, '--map-bubble-y': `${selectedCity.y}%` } as CSSProperties)
    : undefined;
  const bubbleClass = selectedCity
    ? `junior-map-bubble ${selectedCity.x > 58 ? 'left' : 'right'} ${selectedCity.y > 68 ? 'up' : 'down'}`
    : 'junior-map-bubble';
  return (
    <section className="junior-screen junior-map-screen" data-testid="screen-map">
      <KoreaMap save={save} selectedCityId={selectedCityId} onCity={(city) => setSelectedCityId(city.id)}>
        {selectedCity && good ? (
          <div className={bubbleClass} style={bubbleStyle} data-testid="map-selection-panel">
            <div className="junior-map-pick">
              <span className="junior-map-region">{selectedCity.region} · {cityKindLabel(selectedCity)}</span>
              <strong>{cityDisplayName(selectedCity)}</strong>
              <span>{selectedCity.note}</span>
              <div className="junior-map-goods" aria-label="대표 물건">
                {goods.map((item) => (
                  <b key={item.id}>
                    <img src={item.image} alt="" />
                    {item.name}
                  </b>
                ))}
              </div>
              <small>{route?.kind === 'sea' ? (save.boatId === 'none' ? '배가 필요해' : '배로 가는 길') : '수레로 가는 길'} · {canDepart ? '갈 수 있어' : '아직 어려워'}</small>
              <RouteCard save={save} city={selectedCity} />
            </div>
            <button className="junior-button junior-primary" data-testid="depart-city" disabled={!canDepart} onClick={() => onDepart(selectedCity)}>출발</button>
            {canDepart && (save.consumableItems.ticket_fast_travel ?? 0) > 0 && (
              <button className="junior-button junior-secondary" data-testid="use-fast-travel-ticket" onClick={() => onFastDepart(selectedCity)}>빠르게 가기</button>
            )}
            <button className="junior-map-back" data-testid="map-back" onClick={onBack}>도시로</button>
          </div>
        ) : (
          <div className="junior-map-bubble junior-map-empty" data-testid="map-selection-panel">
            <strong>도시를 골라봐.</strong>
            <button className="junior-map-back" data-testid="map-back" onClick={onBack}>도시로</button>
          </div>
        )}
      </KoreaMap>
      <div className="junior-map-destination-rail" data-testid="map-destination-rail" aria-label="갈 수 있는 도시">
        {quickCities.map((city) => {
          const nextRoute = getRoute(save.currentCityId, city.id);
          return (
            <button
              type="button"
              key={city.id}
              className={selectedCityId === city.id ? 'selected' : ''}
              data-testid={`map-quick-${city.id}`}
              onClick={() => setSelectedCityId(city.id)}
            >
              <strong>{cityDisplayName(city)}</strong>
              <span>{nextRoute?.kind === 'sea' ? '배길' : '수레길'}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function getTravelSceneCopy(scenery: ReturnType<typeof getRouteScenery>, isSea: boolean, destinationName: string) {
  if (isSea && destinationName === '제주') {
    return {
      label: '제주 뱃길',
      line: '넓은 바다를 지나 섬으로 가는 길이야.',
      hint: '배가 물결 위를 천천히 건너가.'
    };
  }
  if (isSea) {
    return {
      label: '바닷길',
      line: '섬과 포구를 지나 항구로 가는 중이야.',
      hint: '배가 파도에 맞춰 흔들려.'
    };
  }
  const copy = {
    plain: ['들길', '초록 들판 사이로 수레가 지나가.', '먼지가 살짝 일어나.'],
    mountain: ['산길', '고개를 넘어 다음 고을로 가는 길이야.', '수레가 천천히 흔들려.'],
    river: ['강가길', '강가와 다리를 지나가는 중이야.', '물소리가 옆에서 들려.'],
    coast: ['해안길', '바다 냄새가 나는 길을 따라가.', '포구가 점점 가까워져.'],
    sea: ['바닷길', '파도 사이로 배가 나아가.', '물결이 길을 열어줘.'],
    marketRoad: ['장터길', '사람들이 오가는 큰 길이야.', '목적지가 가까워지고 있어.'],
    north: ['북방길', '차가운 강과 산을 따라 가는 길이야.', '먼 길이라 천천히 가자.']
  } as const;
  const [label, line, hint] = copy[scenery] ?? copy.plain;
  return { label, line, hint };
}

function TravelScreen({ save, onDone }: { save: JuniorSave; onDone: () => void }) {
  const destination = save.destinationCityId ? getCity(save.destinationCityId) : getCity(save.currentCityId);
  const fromCity = getCity(save.currentCityId);
  const route = save.destinationCityId ? getRoute(save.currentCityId, save.destinationCityId) : undefined;
  const scenery = save.destinationCityId ? getRouteScenery(save.currentCityId, save.destinationCityId) : 'plain';
  const isSea = route?.kind === 'sea';
  const sceneCopy = getTravelSceneCopy(scenery, isSea, destination.name);
  const routeType = route?.routeType ?? `basic-${scenery}`;
  const routeLine = route?.fairyText ?? sceneCopy.line;
  const routeHint = route?.arrivalHint ?? sceneCopy.hint;
  const routeTerrain = route?.terrain ?? sceneCopy.label;
  const distanceLabel = route?.distance === 3 ? '먼 길' : route?.distance === 2 ? '조금 먼 길' : '가까운 길';
  useEffect(() => {
    const timer = window.setTimeout(onDone, save.activeEffects.fastTravelNextRoute ? 900 : 5800);
    return () => window.clearTimeout(timer);
  }, [onDone, save.activeEffects.fastTravelNextRoute]);
  return (
    <section className={`junior-screen junior-travel ${isSea ? 'sea' : 'land'} scenery-${scenery} route-${routeType} ${destination.id === 'jeju' ? 'to-jeju' : ''}`} data-testid="screen-travel">
      <div className="junior-route-scene" data-testid="travel-scene">
        {route?.travelSceneAsset && <img className="junior-route-art" src={route.travelSceneAsset} alt="" loading="lazy" onError={handleImageFallback} />}
        <span className="junior-route-vignette" />
        <div className="junior-travel-start-card">
          <b>출발</b>
          <span>{cityDisplayName(fromCity)} → {cityDisplayName(destination)}</span>
        </div>
        <div className="junior-travel-guide">
          <strong>{routeTerrain}</strong>
          <span>{save.activeEffects.fastTravelNextRoute ? '바람길을 타고 빠르게 지나가.' : routeLine}</span>
          <small>{distanceLabel}</small>
        </div>
        <span className="junior-travel-sun" />
        <span className="junior-travel-cloud one" />
        <span className="junior-travel-cloud two" />
        <span className="junior-travel-back one" />
        <span className="junior-travel-back two" />
        <span className="junior-travel-mountains" />
        <span className="junior-travel-river" />
        <span className="junior-travel-bridge" />
        <span className="junior-travel-waves one" />
        <span className="junior-travel-waves two" />
        <span className="junior-travel-island one" />
        <span className="junior-travel-island two" />
        <span className="junior-travel-reeds" />
        <span className="junior-travel-cliff" />
        <span className="junior-travel-trees" />
        <span className="junior-travel-marker">{routeHint}</span>
        <span className="junior-town start">{cityDisplayName(fromCity)}</span>
        <span className="junior-road-line" />
        <span className="junior-route-progress" />
        <span className="junior-dust one" />
        <span className="junior-dust two" />
        <img className="junior-moving-cart" src={isSea ? getBoat(save).image : getVehicle(save).image} alt="" />
        <span className="junior-vehicle-shadow" />
        <span className="junior-town end">{cityDisplayName(destination)}</span>
        <div className="junior-travel-arrive-card">
          <b>도착 준비</b>
          <span>{cityDisplayName(destination)} 장터가 보여.</span>
        </div>
      </div>
    </section>
  );
}

function priceLabel(isLocal: boolean, kind: 'buy' | 'sell') {
  if (kind === 'buy') return isLocal ? '여기서 사기 좋아' : '다른 도시에서 인기';
  return isLocal ? '여기서 팔기 좋아' : '팔 수 있어요';
}

function MarketGoodCard({ save, good, city, recommended, onBuy, onPrepareHalfPrice }: { save: JuniorSave; good: JuniorGood; city: JuniorCity; recommended?: boolean; onBuy: (good: JuniorGood) => void; onPrepareHalfPrice: (good: JuniorGood) => void }) {
  const price = getDiscountedBuyPrice(save, city.id, good.id);
  const local = city.buyGoodIds.includes(good.id);
  const countInCargo = save.cargo.filter((item) => item.goodId === good.id).length;
  const buyCount = save.marketPressure.buy[`${city.id}:${good.id}`] ?? 0;
  const bestCity = getBestSellCityForGood(good.id, city.id);
  const halfPriceReady = save.activeEffects.halfPriceNextGoodId === good.id;
  const canPrepareHalfPrice = save.completedTutorial && !halfPriceReady && (save.consumableItems.ticket_half_price_good ?? 0) > 0;
  return (
    <button className={`junior-market-card ${local ? 'good-buy' : ''} ${recommended ? 'recommended' : ''} ${halfPriceReady ? 'half-ready' : ''}`} data-testid={`buy-${good.id}`} onClick={() => canPrepareHalfPrice ? onPrepareHalfPrice(good) : onBuy(good)}>
      {recommended ? <span className="junior-market-ribbon">요정 추천</span> : local && <span className="junior-market-ribbon">사기 좋아</span>}
      <GoodArt good={good} />
      <strong>{good.name}</strong>
      <span>{priceLabel(local, 'buy')}</span>
      <b>{halfPriceReady ? '반값 ' : '산 값 '}{price}냥</b>
      <small>짐에 {countInCargo}개</small>
      <small>{buyCount > 0 ? '값이 조금 올랐어' : marketHintForCity(bestCity)}</small>
      {halfPriceReady && <small data-testid="half-price-ticket-use">반값권을 쓸 물건이야.</small>}
      <em>{halfPriceReady ? '반값으로 사기' : canPrepareHalfPrice ? '반값권 쓸까?' : '사기'}</em>
    </button>
  );
}

function MarketCargoCard({ save, item, good, city, onSell }: { save: JuniorSave; item: JuniorCargoItem; good: JuniorGood; city: JuniorCity; onSell: () => void }) {
  const sameCity = item.fromCityId === city.id;
  const localProduction = city.buyGoodIds.includes(good.id);
  const isGoodPlace = !sameCity && !localProduction && (city.sellGoodIds.includes(good.id) || city.id === 'seoul');
  const price = getSellPriceForCargo(save, city.id, item);
  const sellCount = save.marketPressure.sell[`${city.id}:${good.id}`] ?? 0;
  return (
    <button className={`junior-market-card sell ${isGoodPlace ? 'good-sell' : ''}`} data-testid={`sell-${good.id}`} onClick={onSell}>
      {isGoodPlace && <span className="junior-market-ribbon sell">팔기 좋아</span>}
      <GoodArt good={good} />
      <strong>{good.name}</strong>
      <span>{sameCity ? '산 곳이라 그대로예요' : localProduction ? '여기에도 많아' : priceLabel(isGoodPlace, 'sell')}</span>
      <b>파는 돈 {price}냥</b>
      <em>팔기</em>
      <small>산 값 {item.buyPrice}냥</small>
      {sellCount > 0 && <small>값이 조금 내렸어</small>}
    </button>
  );
}

function MarketScreen({ save, onBuy, onPrepareHalfPrice, onUseMarketTip, onSell, onBack, onMap }: { save: JuniorSave; onBuy: (good: JuniorGood) => void; onPrepareHalfPrice: (good: JuniorGood) => void; onUseMarketTip: () => void; onSell: (cargoId: string) => void; onBack: () => void; onMap: () => void }) {
  const [flyingGood, setFlyingGood] = useState<JuniorGood | undefined>();
  const [sellingGood, setSellingGood] = useState<JuniorGood | undefined>();
  const [cargoPulse, setCargoPulse] = useState(false);
  const [moneyFeedback, setMoneyFeedback] = useState<string | undefined>();
  const city = getCity(save.currentCityId);
  const vehicle = getVehicle(save);
  const buyGoods = getMarketGoodsForCity(city.id);
  const recommendedGoodId = getRecommendedMarketGoodId(save);
  const cargoItems = save.cargo.slice(0, 4);
  const marketItemCount = buyGoods.length + cargoItems.length;
  const densityClass = buyGoods.length >= 6 || marketItemCount >= 7 ? 'junior-market-crowded' : '';

  function handleBuy(good: JuniorGood) {
    const price = getDiscountedBuyPrice(save, city.id, good.id);
    setFlyingGood(good);
    setCargoPulse(true);
    setMoneyFeedback(`-${price}냥`);
    window.setTimeout(() => setFlyingGood(undefined), 520);
    window.setTimeout(() => setCargoPulse(false), 720);
    onBuy(good);
  }

  function handlePrepareHalfPrice(good: JuniorGood) {
    setMoneyFeedback('반값권?');
    window.setTimeout(() => setMoneyFeedback(undefined), 650);
    onPrepareHalfPrice(good);
  }

  function handleSell(item: JuniorCargoItem) {
    const good = getGood(item.goodId);
    const price = getSellPriceForCargo(save, city.id, item);
    setSellingGood(good);
    setCargoPulse(true);
    setMoneyFeedback(`+${price}냥`);
    window.setTimeout(() => setSellingGood(undefined), 520);
    window.setTimeout(() => setCargoPulse(false), 720);
    onSell(item.id);
  }

  return (
    <section className={`junior-screen junior-market ${densityClass}`} data-testid="screen-market">
      <div className="junior-market-hero">
        <img src={city.backgroundAsset ?? city.scene} alt="" loading="lazy" onError={handleImageFallback} />
        <div>
          <strong>{cityDisplayName(city)} 장터</strong>
          <span>{city.note}</span>
        </div>
        <img className="junior-market-cart" src={vehicle.image} alt="" />
      </div>
      <div className={`junior-market-cargo-summary ${cargoPulse || save.cargo.length >= save.cargoLimit ? 'pulse' : ''}`} data-testid="market-cargo-summary">
        <strong>내 짐 {save.cargo.length}/{save.cargoLimit}</strong>
        <div>
          {save.cargo.length ? save.cargo.slice(0, save.cargoLimit).map((item) => {
            const cargoGood = getGood(item.goodId);
            return <span key={item.id}><img src={cargoGood.image} alt="" />{cargoGood.name}</span>;
          }) : <span>짐칸이 비었어</span>}
        </div>
        <small>땅길 짐칸 기준 · 바닷길은 배 {getBoatCargoLimit(save)}칸</small>
      </div>
      {flyingGood && <img className="junior-flying-good" src={flyingGood.image} alt="" />}
      {flyingGood && <span className="junior-cargo-sparkle" aria-hidden="true" />}
      {sellingGood && <img className="junior-selling-good" src={sellingGood.image} alt="" />}
      {moneyFeedback && <span className="junior-money-feedback" data-testid="market-buy-sell-feedback">{moneyFeedback}</span>}
      {(save.consumableItems.ticket_market_tip ?? 0) > 0 && save.activeEffects.marketRecommendCityId !== save.currentCityId && (
        <button className="junior-inline-consumable" data-testid="use-market-recommend-ticket" onClick={onUseMarketTip}>추천 보기</button>
      )}
      <div className="junior-market-list">
        {buyGoods.map((good) => <MarketGoodCard key={good.id} save={save} good={good} city={city} recommended={recommendedGoodId === good.id} onBuy={handleBuy} onPrepareHalfPrice={handlePrepareHalfPrice} />)}
        {cargoItems.map((item) => {
          const good = getGood(item.goodId);
          return <MarketCargoCard key={item.id} save={save} item={item} good={good} city={city} onSell={() => handleSell(item)} />;
        })}
      </div>
      {!save.completedTutorial && (
        <div className="junior-market-actions">
          <button className="junior-button junior-secondary" data-testid="market-map" onClick={onMap}>지도 보기</button>
          <button className="junior-button junior-primary" data-testid="market-back" onClick={onBack}>도시로</button>
        </div>
      )}
    </section>
  );
}

function EventIllustration({ event }: { event: JuniorEvent }) {
  const sceneSrc = eventSceneImages[event.scene] ?? publicAsset('/assets/events/book.svg');
  const symbolLabel = event.quiz ? '맞춤말' : event.type === 'weather' ? '날씨' : event.type === 'kindness' ? '도움' : '이야기';
  return (
    <div className={`junior-event-visual mood-${event.type.includes('quiz') ? 'quiz' : event.type}`}>
      <img className="junior-event-bg" src={sceneSrc} alt="" loading="lazy" onError={handleImageFallback} />
      <img className="junior-event-jeongwoo" src={publicAsset('/assets/jeongwoo/jeongwoo.png')} alt="" />
      <img className="junior-event-fairy" src={publicAsset('/assets/fairy/fairy-default.png')} alt="" />
      <span className="junior-event-symbol">{symbolLabel}</span>
    </div>
  );
}

function EventScreen({ save, onSimple, onChoice, onQuiz, onUseCargoProtect, onUseQuizRetry }: { save: JuniorSave; onSimple: () => void; onChoice: (index: number) => void; onQuiz: (option: string) => void; onUseCargoProtect: () => void; onUseQuizRetry: () => void }) {
  const event = getSelectedEvent(save);
  if (!event) return null;
  return (
    <section className="junior-screen junior-event" data-testid="screen-event">
      <EventIllustration event={event} />
      <div className="junior-event-text">
        <strong>{event.title}</strong>
        <p><b>바람이</b> {event.fairyText}</p>
        {event.quiz && <b data-testid="quiz-question">{event.quiz.question}</b>}
      </div>
      <div className="junior-event-consumables">
        {(save.consumableItems.charm_cargo_guard ?? 0) > 0 && !save.activeEffects.cargoProtectNextEvent && (
          <button type="button" data-testid="use-cargo-protect-charm" onClick={onUseCargoProtect}>짐 보호 부적</button>
        )}
        {event.quiz && (save.consumableItems.ticket_quiz_retry ?? 0) > 0 && !save.activeEffects.quizRetryAvailable && (
          <button type="button" data-testid="use-quiz-retry-ticket" onClick={onUseQuizRetry}>다시풀기권</button>
        )}
      </div>
      <div className="junior-choice-row">
        {event.quiz?.options.map((option) => (
          <button className="junior-choice" data-testid={`quiz-option-${option}`} key={option} onClick={() => onQuiz(option)}>{option}</button>
        ))}
        {event.choices?.map((choice, index) => (
          <button className="junior-choice" key={choice.label} onClick={() => onChoice(index)}>{choice.label}</button>
        ))}
        {!event.quiz && !event.choices && <button className="junior-button junior-primary" data-testid="event-ok" onClick={onSimple}>좋아!</button>}
      </div>
    </section>
  );
}

function EventResultScreen({ save, onClose }: { save: JuniorSave; onClose: () => void }) {
  const chips = save.lastResultChips?.length ? save.lastResultChips : ['괜찮아'];
  return (
    <section className="junior-screen junior-event-result" data-testid="screen-event-result">
      <img className="junior-result-stamp" src={publicAsset('/assets/ui/success-stamp.png')} alt="" />
      <strong>{save.eventResultText ?? '잘했어!'}</strong>
      <div className="junior-result-chips" data-testid="event-result-card">
        {chips.map((chip) => <span key={chip}>{chip}</span>)}
      </div>
      <button className="junior-button junior-primary" data-testid="event-result-ok" onClick={onClose}>계속하기</button>
    </section>
  );
}

function RegionalEventScreen({ event, onClose }: { event: JuniorRegionalEvent; onClose: () => void }) {
  const testId = event.type === 'merchant_rumor'
    ? 'regional-merchant-rumor'
    : event.type === 'dialect'
      ? 'regional-dialect-event'
      : event.type === 'landmark'
        ? 'regional-landmark-event'
        : `regional-${event.type}`;
  const hintGood = event.hintGoodId ? getGood(event.hintGoodId) : undefined;
  const relatedCity = event.relatedCityId ? getCity(event.relatedCityId) : undefined;
  return (
    <section className="junior-screen junior-regional-event" data-testid="screen-regional-event">
      <div className="junior-regional-card" data-testid={testId}>
        <img src={publicAsset(event.type === 'landmark' ? '/assets/events/book.svg' : '/assets/fairy/fairy-happy.png')} alt="" onError={handleImageFallback} />
        <span>{event.title}</span>
        <strong>{event.speaker}</strong>
        <p>{event.text}</p>
        <small>{event.fairyText}</small>
        {(hintGood || relatedCity) && (
          <div className="junior-regional-hint">
            힌트: {hintGood?.name ?? '물건'}{relatedCity ? ` · ${relatedCity.name}에서 인기 많아` : ''}
          </div>
        )}
        <button className="junior-button junior-primary" data-testid="regional-event-ok" onClick={onClose}>알겠어</button>
      </div>
    </section>
  );
}

function VisitIntroScreen({ save, onDone }: { save: JuniorSave; onDone: () => void }) {
  const city = getCity(save.currentCityId);
  const [index, setIndex] = useState(0);
  const line = city.introLines[index] ?? city.introLines[0];
  const isLast = index >= city.introLines.length - 1;
  const speaker = index === 1 ? '정우' : '바람이';
  const portrait = publicAsset(speaker === '정우' ? '/assets/jeongwoo/jeongwoo.png' : '/assets/fairy/fairy-happy.png');
  return (
    <section className={`junior-screen junior-visit junior-city-${city.id}`} data-testid="screen-visit-intro">
      <img className="junior-visit-bg" src={city.scene} alt="" loading="lazy" onError={handleImageFallback} />
      <img className="junior-visit-jeongwoo" src={publicAsset('/assets/jeongwoo/jeongwoo.png')} alt="" />
      <img className="junior-visit-fairy" src={publicAsset('/assets/fairy/fairy-happy.png')} alt="" />
      <div className="junior-visit-card">
        <strong>{cityDisplayName(city)}</strong>
        <div className="junior-visit-dialogue">
          <img src={portrait} alt="" />
          <p><b>{speaker}</b>{line}</p>
        </div>
        <div className="junior-visit-dots">{city.introLines.map((_, dot) => <span className={dot === index ? 'active' : ''} key={dot} />)}</div>
        <button className="junior-button junior-primary" data-testid="visit-next" onClick={() => isLast ? onDone() : setIndex(index + 1)}>{isLast ? '둘러보기' : '다음'}</button>
      </div>
    </section>
  );
}

function BoatTierArt({ boat }: { boat: JuniorBoat }) {
  return (
    <span className={`junior-boat-tier-art junior-boat-tier-${boat.id}`} aria-hidden="true">
      <img src={boat.image} alt="" loading="lazy" onError={handleImageFallback} />
      <i className="junior-boat-sail-main" />
      <i className="junior-boat-sail-back" />
      <i className="junior-boat-cargo" />
      <i className="junior-boat-banner" />
      <i className="junior-boat-wave" />
    </span>
  );
}

function ShopScreen({ save, onVehicle, onBoat }: { save: JuniorSave; onVehicle: (id: JuniorVehicle['id']) => void; onBoat: (id: JuniorBoat['id']) => void }) {
  const vehicle = getVehicle(save);
  const boat = getBoat(save);
  const nextVehicle = getNextVehicle(save);
  const nextBoat = getNextBoat(save);
  const nextGoal = nextVehicle && (!nextBoat || nextVehicle.cost <= nextBoat.cost) ? nextVehicle : nextBoat;
  const shortage = nextGoal ? Math.max(0, nextGoal.cost - save.coins) : 0;
  const celebration = save.message?.includes('장만했어');
  const currentVehicleIndex = JUNIOR_VEHICLES.findIndex((item) => item.id === save.vehicleId);
  const currentBoatIndex = JUNIOR_BOATS.findIndex((item) => item.id === save.boatId);
  const vehicleState = (item: JuniorVehicle, index: number) => {
    if (item.id === save.vehicleId) return '쓰는 중';
    if (index < currentVehicleIndex) return '보유 중';
    if (save.coins >= item.cost) return '살 수 있어';
    return '돈이 부족해';
  };
  const boatState = (item: JuniorBoat, index: number) => {
    if (item.id === save.boatId) return save.boatId === 'none' ? '지금 배' : '쓰는 중';
    if (index < currentBoatIndex) return '보유 중';
    if (item.id === 'none') return '기본';
    if (save.coins >= item.cost) return '살 수 있어';
    return '돈이 부족해';
  };
  return (
    <section className="junior-screen junior-shop" data-testid="screen-shop">
      <div className="junior-shop-summary" data-testid="vehicle-current-status">
        <strong>현재 수레와 배</strong>
        <span>수레: {vehicle.name} · 땅길 짐칸 {vehicle.cargoLimit}칸</span>
        <span>배: {boat.name} · 바닷길 짐칸 {boat.cargoLimit}칸</span>
        <small>다음 목표: {nextGoal ? nextGoal.name : '준비 완료'}</small>
      </div>
      <div className="junior-shop-scroll" data-testid="shop-scroll-area">
      {celebration && (
        <div className="junior-upgrade-celebration" data-testid="upgrade-celebration">
          <b>새로 장만!</b>
          <span>{save.message}</span>
          <small>{save.lastResultChips?.join(' · ')}</small>
        </div>
      )}
      <div className="junior-equipment-goal" data-testid="equipment-goal">
        <b>다음 목표</b>
        <span>{nextGoal ? `${nextGoal.name}까지 ${shortage}냥` : '준비 완료'}</span>
        <small>{nextGoal && 'cargoLimit' in nextGoal ? `${nextGoal.kind === 'boat' ? '바닷길' : '땅길'} 짐칸이 ${nextGoal.cargoLimit}칸이 돼.` : '멀리 떠날 준비가 됐어.'}</small>
      </div>
      <div className="junior-shop-grid junior-vehicle-sections">
        <section className="junior-shop-section" data-testid="vehicle-cart-prices">
          <h3>수레 장만</h3>
          <div className="junior-shop-section-grid">
        {JUNIOR_VEHICLES.map((item, index) => {
          const state = vehicleState(item, index);
          const current = item.id === save.vehicleId;
          const owned = index <= currentVehicleIndex;
          const canBuy = !owned && save.coins >= item.cost;
          return (
          <button className={`junior-shop-card ${current ? 'owned' : ''} ${canBuy ? 'affordable' : ''}`} data-testid={`buy-vehicle-${item.id}`} key={item.id} disabled={!canBuy} onClick={() => onVehicle(item.id)}>
            <img src={item.image} alt="" loading="lazy" onError={handleImageFallback} />
            <span className="junior-shop-badge">{state}</span>
            <strong>{item.name}</strong>
            <small>{item.text}</small>
            <b>가격 {item.cost}냥</b>
            <b>땅길 짐칸 {item.cargoLimit}칸</b>
            <em>{canBuy ? '장만하기' : state}</em>
          </button>
          );
        })}
          </div>
        </section>
        <section className="junior-shop-section" data-testid="vehicle-boat-prices">
          <h3>배 장만</h3>
          <div className="junior-shop-section-grid">
        {JUNIOR_BOATS.map((item, index) => {
          const state = boatState(item, index);
          const current = item.id === save.boatId;
          const owned = index <= currentBoatIndex;
          const canBuy = item.id !== 'none' && !owned && save.coins >= item.cost;
          return (
          <button className={`junior-shop-card boat ${current ? 'owned' : ''} ${canBuy ? 'affordable' : ''}`} data-testid={`buy-boat-${item.id}`} key={item.id} disabled={!canBuy} onClick={() => onBoat(item.id)}>
            <BoatTierArt boat={item} />
            <span className="junior-shop-badge">{state}</span>
            <strong>{item.name}</strong>
            <small>{item.text}</small>
            <b>가격 {item.cost}냥</b>
            <b>바닷길 짐칸 {item.cargoLimit}칸</b>
            <em>{canBuy ? '장만하기' : state}</em>
          </button>
          );
        })}
          </div>
        </section>
      </div>
      <div className="junior-land-sea-summary" data-testid="land-vs-sea-cargo-visible">
        <span>땅길: {vehicle.name} {vehicle.cargoLimit}칸</span>
        <span>바닷길: {boat.name} {boat.cargoLimit}칸</span>
      </div>
      </div>
    </section>
  );
}

type StarRewardMode = 'shop' | 'inventory';
type StarRewardTab = 'cosmetics' | 'fairy' | 'consumables';

const STAR_SLOT_LABELS: Record<JuniorStarItem['slot'], string> = {
  weapon: '무기',
  armor: '옷',
  tool: '도구',
  hat: '모자',
  badge: '배지',
  fairy: '요정',
  cartSkin: '수레',
  boatSkin: '배',
  none: '소모품'
};

function starItemsForTab(tab: StarRewardTab) {
  if (tab === 'fairy') return JUNIOR_STAR_ITEMS.filter((item) => !item.isConsumable && item.slot === 'fairy');
  if (tab === 'consumables') return JUNIOR_STAR_ITEMS.filter((item) => item.isConsumable);
  return JUNIOR_STAR_ITEMS.filter((item) => !item.isConsumable && item.slot !== 'fairy');
}

function getStarItemName(itemId?: string) {
  return itemId ? (JUNIOR_STAR_ITEMS.find((item) => item.id === itemId)?.name ?? '없음') : '없음';
}

function StarRewardScreen({
  save,
  onClose,
  onBuy,
  onEquip,
  onUnequip,
  onUse
}: {
  save: JuniorSave;
  onClose: () => void;
  onBuy: (item: JuniorStarItem) => void;
  onEquip: (item: JuniorStarItem) => void;
  onUnequip: (slot: JuniorStarItem['slot']) => void;
  onUse: (item: JuniorStarItem) => void;
}) {
  const [mode, setMode] = useState<StarRewardMode>('shop');
  const [tab, setTab] = useState<StarRewardTab>('cosmetics');
  const ownedDecorations = JUNIOR_STAR_ITEMS.filter((item) => !item.isConsumable && save.ownedStarItemIds.includes(item.id));
  const ownedConsumables = JUNIOR_STAR_ITEMS.filter((item) => item.isConsumable && (save.consumableItems[item.id] ?? 0) > 0);
  const equippedSlots: JuniorStarItem['slot'][] = ['weapon', 'armor', 'tool', 'badge', 'fairy'];
  const visibleItems = starItemsForTab(tab);

  const shopState = (item: JuniorStarItem) => {
    const owned = save.ownedStarItemIds.includes(item.id);
    const equipped = save.equippedStarItems[item.slot] === item.id;
    const count = save.consumableItems[item.id] ?? 0;
    if (equipped) return '착용 중';
    if (!item.isConsumable && owned) return '보유 중';
    if (item.isConsumable && count >= (item.maxOwned ?? 99)) return '가득 있어';
    if (save.starBalance >= item.starCost) return '얻기';
    return '별이 부족해';
  };

  return (
    <section className="junior-reward-overlay" data-testid="star-reward-screen" aria-label="별 상점과 보물함">
      <div className="junior-reward-panel">
        <header className="junior-reward-header">
          <div>
            <strong>{mode === 'shop' ? '별 상점' : '보물함'}</strong>
            <span>현재 별 {save.starBalance}개 · 모은 별 {save.totalStarsEarned}개</span>
          </div>
          <button type="button" data-testid="close-star-shop" onClick={onClose}>닫기</button>
        </header>

        <div className="junior-reward-fairy">
          <img src={publicAsset('/assets/fairy/fairy-happy.png')} alt="" />
          <p>{mode === 'shop' ? '별로 멋진 장식을 얻을 수 있어.' : '얻은 보물을 살펴보자.'}</p>
        </div>

        <div className="junior-reward-mode-tabs" role="tablist" aria-label="별 메뉴">
          <button className={mode === 'shop' ? 'active' : ''} type="button" data-testid="star-shop-tab" onClick={() => setMode('shop')}>별 상점</button>
          <button className={mode === 'inventory' ? 'active' : ''} type="button" data-testid="inventory-tab" onClick={() => setMode('inventory')}>보물함</button>
        </div>

        {mode === 'shop' && (
          <div className="junior-reward-content" data-testid="star-shop-main">
            <div className="junior-reward-tabs" role="tablist" aria-label="별 상점 종류">
              <button className={tab === 'cosmetics' ? 'active' : ''} type="button" data-testid="star-tab-cosmetics" onClick={() => setTab('cosmetics')}>꾸미기</button>
              <button className={tab === 'fairy' ? 'active' : ''} type="button" data-testid="star-tab-fairy" onClick={() => setTab('fairy')}>요정</button>
              <button className={tab === 'consumables' ? 'active' : ''} type="button" data-testid="star-tab-consumables" onClick={() => setTab('consumables')}>소모품</button>
            </div>
            <div className="junior-reward-grid">
              {visibleItems.map((item) => {
                const state = shopState(item);
                const canBuy = state === '얻기';
                const count = save.consumableItems[item.id] ?? 0;
                return (
                  <button
                    className={`junior-reward-item ${canBuy ? 'affordable' : ''} ${state === '착용 중' || state === '보유 중' ? 'owned' : ''}`}
                    data-testid={`star-item-${item.id}`}
                    type="button"
                    key={item.id}
                    disabled={!canBuy}
                    onClick={() => onBuy(item)}
                  >
                    <img src={item.iconAsset} alt="" onError={handleImageFallback} />
                    <span>{item.isConsumable && count > 0 ? `${count}개 보유` : state}</span>
                    <strong>{item.name}</strong>
                    <small>{item.childDescription}</small>
                    <b>별 {item.starCost}개</b>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {mode === 'inventory' && (
          <div className="junior-reward-content" data-testid="inventory-preview">
            <div className="junior-inventory-preview">
              <article>
                <img src={publicAsset('/assets/jeongwoo/jeongwoo.png')} alt="" />
                <strong>정우</strong>
                <span>무기: {getStarItemName(save.equippedStarItems.weapon)}</span>
                <span>옷: {getStarItemName(save.equippedStarItems.armor)}</span>
                <span>도구: {getStarItemName(save.equippedStarItems.tool)}</span>
              </article>
              <article>
                <img src={publicAsset('/assets/fairy/fairy-happy.png')} alt="" />
                <strong>바람이</strong>
                <span>꾸미기: {getStarItemName(save.equippedStarItems.fairy)}</span>
                <span>배지: {getStarItemName(save.equippedStarItems.badge)}</span>
              </article>
            </div>

            <section className="junior-equipped-list" data-testid="equipped-item">
              <h3>착용 중인 장식</h3>
              {equippedSlots.map((slot) => (
                <div key={slot}>
                  <span>{STAR_SLOT_LABELS[slot]}: {getStarItemName(save.equippedStarItems[slot])}</span>
                  <button type="button" data-testid={`unequip-${slot}`} disabled={!save.equippedStarItems[slot]} onClick={() => onUnequip(slot)}>빼기</button>
                </div>
              ))}
            </section>

            <section className="junior-owned-list">
              <h3>가진 꾸미기</h3>
              {ownedDecorations.length === 0 && <p>아직 가진 장식이 없어.</p>}
              {ownedDecorations.map((item) => {
                const equipped = save.equippedStarItems[item.slot] === item.id;
                return (
                  <div className="junior-owned-row" data-testid={`inventory-item-${item.id}`} key={item.id}>
                    <img src={item.iconAsset} alt="" onError={handleImageFallback} />
                    <span>{item.name}</span>
                    <button type="button" disabled={equipped} onClick={() => onEquip(item)}>{equipped ? '착용 중' : '착용하기'}</button>
                  </div>
                );
              })}
            </section>

            <section className="junior-owned-list" data-testid="consumable-owned-count">
              <h3>가진 소모품</h3>
              {ownedConsumables.length === 0 && <p>아직 가진 소모품이 없어.</p>}
              {ownedConsumables.map((item) => (
                <div className="junior-owned-row" data-testid={`owned-consumable-${item.id}`} key={item.id}>
                  <img src={item.iconAsset} alt="" onError={handleImageFallback} />
                  <span>{item.name} x{save.consumableItems[item.id] ?? 0}</span>
                  <button type="button" onClick={() => onUse(item)}>쓰기</button>
                </div>
              ))}
            </section>
          </div>
        )}

        {save.message && <div className="junior-reward-message" data-testid="star-shop-message">{save.message}</div>}
      </div>
    </section>
  );
}

function EndingChoiceScreen({ onHome, onMore }: { onHome: () => void; onMore: () => void }) {
  return (
    <section className="junior-screen junior-ending-choice" data-testid="screen-ending-choice">
      <div className="junior-book-scene glow">
        <img src={publicAsset('/assets/jeongwoo/jeongwoo.png')} alt="" />
        <img className="junior-book-art" src={publicAsset('/assets/events/ending_door.svg')} alt="" />
      </div>
      <div className="junior-ending-hint" data-testid="ending-hint">
        <b>장부가 반짝여.</b>
        <span>300냥을 모았어. 집으로 돌아갈 수 있어.</span>
      </div>
      <div className="junior-action-row">
        <button className="junior-button junior-primary" data-testid="go-home" onClick={onHome}>집으로 가기</button>
        <button className="junior-button junior-secondary" data-testid="trade-more" onClick={onMore}>조금 더 장사</button>
      </div>
    </section>
  );
}

function EndingScreen({ onAgain, onMore }: { onAgain: () => void; onMore: () => void }) {
  return (
    <section className="junior-screen junior-ending" data-testid="screen-ending">
      <div className="junior-success-party">
        <img className="junior-ending-art" src={publicAsset('/assets/events/ending_door.svg')} alt="" loading="lazy" onError={handleImageFallback} />
        <img className="junior-success-jeongwoo" src={publicAsset('/assets/jeongwoo/jeongwoo.png')} alt="" />
        <img className="junior-success-fairy" src={publicAsset('/assets/fairy/fairy-happy.png')} alt="" />
        <img className="junior-money-bag" src={publicAsset('/assets/ui/money-bag.png')} alt="" />
      </div>
      <strong className="junior-badge">꼬마 거상 정우</strong>
      <div className="junior-success-actions">
        <button className="junior-button junior-primary" data-testid="ending-again" onClick={onAgain}>다시 하기</button>
        <button className="junior-button junior-secondary" data-testid="ending-more" onClick={onMore}>계속 장사</button>
        <a className="junior-button junior-secondary" href={FULL_MODE_URL}>큰 모험 보기</a>
      </div>
    </section>
  );
}

export function JuniorApp() {
  const [save, setSave] = useJuniorSave();
  const [rewardOpen, setRewardOpen] = useState(false);
  const online = useNetworkStatus();
  const selectedGood = useMemo(() => save.selectedGoodId ? getGood(save.selectedGoodId) : undefined, [save.selectedGoodId]);
  const city = getCity(save.currentCityId);
  const event = getSelectedEvent(save);
  const regionalEvent = getSelectedRegionalEvent(save);
  const audio = useJuniorAudio(audioSceneForStep(save.currentStep));

  function update(next: JuniorSave) {
    setSave(next);
  }

  function sell(cargoId: string) {
    audio.playSfx('sell');
    update(sellCargoItem(save, cargoId));
  }

  function marketBuy(good: JuniorGood) {
    audio.playSfx('buy');
    update(buyGood(save, good.id));
  }

  function useConsumable(itemId: JuniorStarItem['id']) {
    audio.playSfx('click');
    update(useStarConsumable(save, itemId));
  }

  function pick(good: JuniorGood) {
    audio.playSfx('click');
    update(chooseGood(save, good.id));
  }

  return (
    <main className={`junior-shell junior-step-${save.currentStep}`} data-testid="junior-app">
      <NetworkStatus online={online} />
      <TopBar save={save} audio={audio} onStarOpen={() => { audio.playSfx('reward'); setRewardOpen(true); }} />
      <FairyTalk save={save} lines={fairyLines(save, event)} />

      <section className="junior-main-card">
        {save.currentStep === 'intro' && <IntroScreen save={save} onStart={() => { void audio.prime(); audio.playSfx('click'); update(startIntro(save)); }} />}
        {save.currentStep === 'pick' && <PickScreen save={save} onPick={pick} />}
        {save.currentStep === 'buy' && <BuyScreen save={save} onBuy={() => { audio.playSfx('buy'); update(buySelectedGood(save)); }} />}
        {save.currentStep === 'city' && <CityScreen save={save} onMarket={() => { audio.playSfx('shop'); update(goToMarket(save)); }} onMap={() => { audio.playSfx('click'); update(goToMap(save)); }} onShop={() => { audio.playSfx('shop'); update(goToShop(save)); }} onEnding={() => { audio.playSfx('reward'); update(openEnding(save)); }} onUseRumor={() => useConsumable('ticket_extra_rumor')} />}
        {save.currentStep === 'map' && <MapScreen save={save} onDepart={(nextCity) => { const route = getRoute(save.currentCityId, nextCity.id); audio.playSfx(route?.kind === 'sea' ? 'depart' : 'cart'); update(startTravel(save, nextCity.id)); }} onFastDepart={(nextCity) => { audio.playSfx('reward'); update(startFastTravel(save, nextCity.id)); }} onBack={() => { audio.playSfx('click'); update(goToCity(save)); }} />}
        {save.currentStep === 'travel' && <TravelScreen save={save} onDone={() => { audio.playSfx('arrive'); update(finishTravel(save)); }} />}
        {save.currentStep === 'visitIntro' && <VisitIntroScreen save={save} onDone={() => { audio.playSfx('click'); update(completeVisitIntro(save)); }} />}
        {save.currentStep === 'market' && <MarketScreen save={save} onBuy={marketBuy} onPrepareHalfPrice={(good) => { audio.playSfx('reward'); update(prepareHalfPriceTicket(save, good.id)); }} onUseMarketTip={() => useConsumable('ticket_market_tip')} onSell={sell} onBack={() => { audio.playSfx('click'); update(goToCity(save)); }} onMap={() => { audio.playSfx('click'); update(goToMap(save)); }} />}
        {save.currentStep === 'event' && <EventScreen save={save} onSimple={() => { audio.playSfx('reward'); update(resolveSimpleEvent(save)); }} onChoice={(index) => { audio.playSfx('click'); update(resolveChoice(save, index)); }} onQuiz={(option) => { const quiz = event?.quiz; audio.playSfx(quiz && option === quiz.answer ? 'correct' : 'wrong'); update(answerQuiz(save, option)); }} onUseCargoProtect={() => useConsumable('charm_cargo_guard')} onUseQuizRetry={() => useConsumable('ticket_quiz_retry')} />}
        {save.currentStep === 'eventResult' && <EventResultScreen save={save} onClose={() => { audio.playSfx('click'); update(closeEventResult(save)); }} />}
        {save.currentStep === 'regionalEvent' && regionalEvent && <RegionalEventScreen event={regionalEvent} onClose={() => { audio.playSfx('click'); update(closeRegionalEvent(save)); }} />}
        {save.currentStep === 'shop' && <ShopScreen save={save} onVehicle={(id) => { audio.playSfx('shop'); update(buyVehicle(save, id)); }} onBoat={(id) => { audio.playSfx('shop'); update(buyBoat(save, id)); }} />}
        {save.currentStep === 'endingChoice' && <EndingChoiceScreen onHome={() => { audio.playSfx('reward'); update(finishEnding(save)); }} onMore={() => { audio.playSfx('click'); update(continueAfterEnding(save)); }} />}
        {save.currentStep === 'ending' && <EndingScreen onAgain={() => { audio.playSfx('click'); update(resetJuniorGame()); }} onMore={() => { audio.playSfx('click'); update(continueAfterEnding(save)); }} />}
      </section>

      {rewardOpen && (
        <StarRewardScreen
          save={save}
          onClose={() => { audio.playSfx('click'); setRewardOpen(false); }}
          onBuy={(item) => { audio.playSfx(save.starBalance >= item.starCost ? 'reward' : 'wrong'); update(buyStarItem(save, item.id)); }}
          onEquip={(item) => { audio.playSfx('reward'); update(equipStarItem(save, item.id)); }}
          onUnequip={(slot) => { audio.playSfx('click'); update(unequipStarItem(save, slot)); }}
          onUse={(item) => useConsumable(item.id)}
        />
      )}

      <QuickNav
        save={save}
        onCity={() => { audio.playSfx('click'); update(goToCity(save)); }}
        onMap={() => { audio.playSfx('click'); update(goToMap(save)); }}
        onMarket={() => { audio.playSfx('shop'); update(goToMarket(save)); }}
        onShop={() => { audio.playSfx('shop'); update(goToShop(save)); }}
      />

      <footer className="junior-goal junior-vehicle-footer" data-testid="vehicle-status-footer" aria-label="목표">
        <span>{cityDisplayName(city)}</span>
        <strong>{save.coins >= ENDING_COINS ? '집으로 갈 수 있어!' : `${ENDING_COINS}냥이면 단서가 보여!`}</strong>
        <span>{selectedGood ? selectedGood.name : `땅길 ${getVehicle(save).cargoLimit}칸 · 바닷길 ${getBoatCargoLimit(save)}칸`}</span>
      </footer>
    </main>
  );
}
