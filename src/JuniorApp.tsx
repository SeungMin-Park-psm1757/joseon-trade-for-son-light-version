import { useEffect, useMemo, useState } from 'react';
import { ENDING_COINS, FULL_MODE_URL, JUNIOR_BOATS, JUNIOR_CITIES, JUNIOR_ROUTES, JUNIOR_VEHICLES, getGood, publicAsset } from './juniorData';
import {
  answerQuiz,
  buyBoat,
  buyGood,
  buySelectedGood,
  buyVehicle,
  canTravel,
  chooseGood,
  closeEventResult,
  completeVisitIntro,
  continueAfterEnding,
  finishEnding,
  finishTravel,
  getBuyGoodsForCity,
  getBuyPrice,
  getBestSellCityForGood,
  getCity,
  getConnectedCityIds,
  getRoute,
  getRouteScenery,
  getSelectedEvent,
  getSellPriceForCargo,
  goToCity,
  goToMap,
  goToMarket,
  goToShop,
  loadJuniorSave,
  openEnding,
  resetJuniorGame,
  resolveChoice,
  resolveSimpleEvent,
  saveJuniorGame,
  sellCargoItem,
  startIntro,
  startTravel
} from './juniorFlow';
import { playJuniorSuccessSound } from './juniorAudio';
import type { JuniorBoat, JuniorCargoItem, JuniorCity, JuniorCityId, JuniorEvent, JuniorGood, JuniorGoodId, JuniorSave, JuniorVehicle } from './juniorTypes';

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
    return [`정우야, ${destination.name}으로 가는 중이야.`, sceneCopy.hint];
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
    shop: ['새 수레와 배를 장만할 수 있어.'],
    endingChoice: ['장부가 다 빛났어.', '이제 집으로 갈 수 있어.'],
    ending: ['멋진 꼬마 거상이야!']
  };
  return lines[save.currentStep] ?? ['정우야, 천천히 해보자.'];
}

function TopBar({ save }: { save: JuniorSave }) {
  const city = getCity(save.currentCityId);
  return (
    <header className="junior-topbar" aria-label="현재 상태">
      <img src={publicAsset('/assets/jeongwoo/jeongwoo.png')} alt="정우" />
      <strong>정우</strong>
      <span className="junior-pill" data-testid="junior-city-name">{city.name}</span>
      <span className="junior-pill" data-testid="junior-coins">돈 {save.coins}</span>
      <span className="junior-pill junior-star-pill">별 {save.stars}</span>
      <span className={`junior-pill ${save.cargo.length >= save.cargoLimit ? 'junior-full-cargo' : ''}`}>짐 {save.cargo.length}/{save.cargoLimit}</span>
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
            {good ? <img src={good.image} alt={good.name} /> : <b />}
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
          <span>{city.name} · 돈 {save.coins} · 별 {save.stars}</span>
          <small>짐 {save.cargo.length}/{save.cargoLimit} · {formatSaveTime(save.lastSavedAt)}</small>
        </div>
      )}
      <button className="junior-button junior-primary" data-testid="start-play" onClick={onStart}>{showContinue ? '이어하기' : '시작하기'}</button>
    </section>
  );
}

function QuickNav({ save, onCity, onMap, onMarket, onShop }: { save: JuniorSave; onCity: () => void; onMap: () => void; onMarket: () => void; onShop: () => void }) {
  if (['intro', 'pick', 'buy', 'travel', 'visitIntro', 'event', 'eventResult', 'endingChoice', 'ending'].includes(save.currentStep)) return null;
  const itemClass = (step: JuniorSave['currentStep']) => save.currentStep === step ? 'active' : '';
  return (
    <nav className="junior-bottom-nav" aria-label="주요 이동">
      <button className={itemClass('city')} data-testid="nav-city" onClick={onCity}>도시</button>
      <button className={itemClass('map')} data-testid="nav-map" onClick={onMap}>지도</button>
      <button className={itemClass('market')} data-testid="nav-market" onClick={onMarket}>장터</button>
      <button className={itemClass('shop')} data-testid="nav-shop" onClick={onShop}>탈것</button>
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

const cityMotifs: Record<JuniorCityId, { color: string; accent: string; motif: 'palace' | 'gate' | 'river' | 'mountain' | 'port' | 'market' | 'paper' | 'field' | 'citrus' | 'fish' | 'salt' | 'herb'; label: string }> = {
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
  const theme = cityMotifs[city.id];
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

function CityScreen({ save, onMarket, onMap, onShop, onEnding }: { save: JuniorSave; onMarket: () => void; onMap: () => void; onShop: () => void; onEnding: () => void }) {
  const [showCargo, setShowCargo] = useState(false);
  const city = getCity(save.currentCityId);
  const tutorial = !save.completedTutorial && save.tutorialStage <= 1;
  const nextGoal = save.coins >= ENDING_COINS
    ? '집으로 갈 수 있어!'
    : save.coins < 100
      ? '100냥을 모아 보자.'
      : save.boatId === 'none'
        ? '배를 장만해 보자.'
        : `${ENDING_COINS}냥까지 조금씩 모으자.`;
  return (
    <section className={`junior-screen junior-city-main junior-city-${city.id}`} data-testid="screen-city">
      <img className="junior-city-hero-img" src={city.scene} alt="" loading="lazy" onError={handleImageFallback} />
      <div className="junior-city-shade" />
      <div className="junior-city-title">
        <strong>{city.name}</strong>
        <span>{city.note}</span>
      </div>
      <div className="junior-progress-card" data-testid="junior-progress-card">
        <b>도시 도장 {save.visitedCityIds.length}/21</b>
        <span>{nextGoal}</span>
        {save.badges.length > 0 && <small>{save.badges.slice(-2).join(' · ')}</small>}
      </div>
      {showCargo && (
        <div className="junior-city-cargo" data-testid="cargo-panel">
          <CargoSlots save={save} />
          <span>{save.cargo.length ? '팔 물건이 있어.' : '짐이 비었어.'}</span>
        </div>
      )}
      <div className="junior-city-actions">
        <button className={`junior-action-button ${tutorial ? 'tutorial-focus' : ''}`} data-testid="open-market" onClick={onMarket}>장터 가기</button>
        <button className="junior-action-button" data-testid="open-map" onClick={onMap}>지도 보기</button>
        {save.coins >= ENDING_COINS ? (
          <button className="junior-action-button home" data-testid="open-ending" onClick={onEnding}>집으로</button>
        ) : (
          <button className="junior-action-button" data-testid="open-cargo" onClick={() => setShowCargo((value) => !value)}>짐 보기</button>
        )}
        <button className="junior-action-button" data-testid="open-shop" onClick={onShop}>탈것 장만</button>
      </div>
    </section>
  );
}

function KoreaMap({ save, selectedCityId, onCity }: { save: JuniorSave; selectedCityId?: JuniorCityId; onCity: (city: JuniorCity) => void }) {
  const connected = getConnectedCityIds(save);
  return (
    <div className="junior-map-board" data-testid="korea-map">
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
        const reachable = connected.includes(city.id) && canTravel(save, city.id);
        return (
          <button
            key={city.id}
            className={`junior-city-dot ${current ? 'current' : ''} ${selected ? 'selected' : ''} ${reachable ? 'reachable' : ''} ${!unlocked ? 'locked' : ''}`}
            style={{ left: `${city.x}%`, top: `${city.y}%` }}
            disabled={!current && !reachable}
            data-testid={`city-${city.id}`}
            onClick={() => onCity(city)}
          >
            <span>{city.icon}</span>
            <strong>{city.name}</strong>
          </button>
        );
      })}
    </div>
  );
}

function MapScreen({ save, onDepart, onBack }: { save: JuniorSave; onDepart: (city: JuniorCity) => void; onBack: () => void }) {
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
  return (
    <section className="junior-screen junior-map-screen" data-testid="screen-map">
      <KoreaMap save={save} selectedCityId={selectedCityId} onCity={(city) => setSelectedCityId(city.id)} />
      <div className="junior-map-panel" data-testid="map-selection-panel">
        {selectedCity && good ? (
          <>
            <div className="junior-map-pick">
              <span className="junior-map-region">{selectedCity.region}</span>
              <strong>{selectedCity.name}</strong>
              <span>{selectedCity.note}</span>
              <div className="junior-map-goods" aria-label="대표 물건">
                {goods.map((item) => (
                  <b key={item.id}>
                    <img src={item.image} alt="" />
                    {item.name}
                  </b>
                ))}
              </div>
              <small>{route?.kind === 'sea' ? '배로 가는 길' : '수레로 가는 길'} · {canDepart ? '갈 수 있어' : '아직 어려워'}</small>
            </div>
            <button className="junior-button junior-primary" data-testid="depart-city" disabled={!canDepart} onClick={() => onDepart(selectedCity)}>출발</button>
          </>
        ) : (
          <strong>도시를 골라봐.</strong>
        )}
        <button className="junior-map-back" data-testid="map-back" onClick={onBack}>도시로</button>
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
    const timer = window.setTimeout(onDone, 5800);
    return () => window.clearTimeout(timer);
  }, [onDone]);
  return (
    <section className={`junior-screen junior-travel ${isSea ? 'sea' : 'land'} scenery-${scenery} route-${routeType} ${destination.id === 'jeju' ? 'to-jeju' : ''}`} data-testid="screen-travel">
      <div className="junior-route-scene" data-testid="travel-scene">
        {route?.travelSceneAsset && <img className="junior-route-art" src={route.travelSceneAsset} alt="" loading="lazy" onError={handleImageFallback} />}
        <span className="junior-route-vignette" />
        <div className="junior-travel-start-card">
          <b>출발</b>
          <span>{fromCity.name} → {destination.name}</span>
        </div>
        <div className="junior-travel-guide">
          <strong>{routeTerrain}</strong>
          <span>{routeLine}</span>
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
        <span className="junior-town start">{fromCity.name}</span>
        <span className="junior-road-line" />
        <span className="junior-route-progress" />
        <span className="junior-dust one" />
        <span className="junior-dust two" />
        <img className="junior-moving-cart" src={isSea ? getBoat(save).image : getVehicle(save).image} alt="" />
        <span className="junior-vehicle-shadow" />
        <span className="junior-town end">{destination.name}</span>
        <div className="junior-travel-arrive-card">
          <b>도착 준비</b>
          <span>{destination.name} 장터가 보여.</span>
        </div>
      </div>
    </section>
  );
}

function priceLabel(isLocal: boolean, kind: 'buy' | 'sell') {
  if (kind === 'buy') return isLocal ? '여기서 사기 좋아' : '이번 값';
  return isLocal ? '여기서 팔기 좋아' : '팔 수 있어요';
}

function MarketGoodCard({ save, good, city, onBuy }: { save: JuniorSave; good: JuniorGood; city: JuniorCity; onBuy: (good: JuniorGood) => void }) {
  const price = getBuyPrice(save, city.id, good.id);
  const local = city.buyGoodIds.includes(good.id);
  const countInCargo = save.cargo.filter((item) => item.goodId === good.id).length;
  const buyCount = save.marketPressure.buy[`${city.id}:${good.id}`] ?? 0;
  const bestCity = getBestSellCityForGood(good.id, city.id);
  return (
    <button className={`junior-market-card ${local ? 'good-buy' : ''}`} data-testid={`buy-${good.id}`} onClick={() => onBuy(good)}>
      {local && <span className="junior-market-ribbon">사기 좋아</span>}
      <GoodArt good={good} />
      <strong>{good.name}</strong>
      <span>{priceLabel(local, 'buy')}</span>
      <b>사는 값 {price}냥</b>
      <small>짐에 {countInCargo}개</small>
      <small>{buyCount > 0 ? '값이 조금 올랐어' : bestCity ? `${bestCity.name}에 팔아봐` : '다른 도시로 가보자'}</small>
      <em>사기</em>
    </button>
  );
}

function MarketCargoCard({ save, item, good, city, onSell }: { save: JuniorSave; item: JuniorCargoItem; good: JuniorGood; city: JuniorCity; onSell: () => void }) {
  const sameCity = item.fromCityId === city.id;
  const isGoodPlace = !sameCity && (city.sellGoodIds.includes(good.id) || city.id === 'seoul');
  const price = getSellPriceForCargo(save, city.id, item);
  const sellCount = save.marketPressure.sell[`${city.id}:${good.id}`] ?? 0;
  return (
    <button className={`junior-market-card sell ${isGoodPlace ? 'good-sell' : ''}`} data-testid={`sell-${good.id}`} onClick={onSell}>
      {isGoodPlace && <span className="junior-market-ribbon sell">팔기 좋아</span>}
      <GoodArt good={good} />
      <strong>{good.name}</strong>
      <span>{sameCity ? '산 곳이라 그대로예요' : priceLabel(isGoodPlace, 'sell')}</span>
      <b>파는 돈 {price}냥</b>
      <em>팔기</em>
      <small>산 값 {item.buyPrice}냥</small>
      {sellCount > 0 && <small>값이 조금 내렸어</small>}
    </button>
  );
}

function MarketScreen({ save, onBuy, onSell, onBack, onMap }: { save: JuniorSave; onBuy: (good: JuniorGood) => void; onSell: (cargoId: string) => void; onBack: () => void; onMap: () => void }) {
  const [flyingGood, setFlyingGood] = useState<JuniorGood | undefined>();
  const [sellingGood, setSellingGood] = useState<JuniorGood | undefined>();
  const [cargoPulse, setCargoPulse] = useState(false);
  const city = getCity(save.currentCityId);
  const vehicle = getVehicle(save);
  const buyGoods = getBuyGoodsForCity(city.id).slice(0, 4);
  const cargoItems = save.cargo.slice(0, 4);

  function handleBuy(good: JuniorGood) {
    setFlyingGood(good);
    setCargoPulse(true);
    window.setTimeout(() => setFlyingGood(undefined), 520);
    window.setTimeout(() => setCargoPulse(false), 720);
    onBuy(good);
  }

  function handleSell(item: JuniorCargoItem) {
    const good = getGood(item.goodId);
    setSellingGood(good);
    setCargoPulse(true);
    window.setTimeout(() => setSellingGood(undefined), 520);
    window.setTimeout(() => setCargoPulse(false), 720);
    onSell(item.id);
  }

  return (
    <section className="junior-screen junior-market" data-testid="screen-market">
      <div className="junior-market-hero">
        <img src={city.backgroundAsset ?? city.scene} alt="" loading="lazy" onError={handleImageFallback} />
        <div>
          <strong>{city.name} 장터</strong>
          <span>{city.note}</span>
        </div>
        <img className="junior-market-cart" src={vehicle.image} alt="" />
      </div>
      <CargoSlots save={save} pulse={cargoPulse || save.cargo.length >= save.cargoLimit} />
      {flyingGood && <img className="junior-flying-good" src={flyingGood.image} alt="" />}
      {flyingGood && <span className="junior-cargo-sparkle" aria-hidden="true" />}
      {sellingGood && <img className="junior-selling-good" src={sellingGood.image} alt="" />}
      <div className="junior-market-list">
        {buyGoods.map((good) => <MarketGoodCard key={good.id} save={save} good={good} city={city} onBuy={handleBuy} />)}
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
  return (
    <div className={`junior-event-visual mood-${event.type.includes('quiz') ? 'quiz' : event.type}`}>
      <img className="junior-event-bg" src={sceneSrc} alt="" loading="lazy" onError={handleImageFallback} />
      <img className="junior-event-jeongwoo" src={publicAsset('/assets/jeongwoo/jeongwoo.png')} alt="" />
      <img className="junior-event-fairy" src={publicAsset('/assets/fairy/fairy-default.png')} alt="" />
      <span className="junior-event-symbol">
        {event.type === 'quiz_pirate' ? '배' : event.type === 'quiz_bandit' ? '길' : event.type === 'quiz_animal' ? '숲' : event.type === 'quiz_merchant' ? '장' : event.type === 'quiz_folktale' ? '옛' : '별'}
      </span>
    </div>
  );
}

function EventScreen({ save, onSimple, onChoice, onQuiz }: { save: JuniorSave; onSimple: () => void; onChoice: (index: number) => void; onQuiz: (option: string) => void }) {
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
  return (
    <section className="junior-screen junior-event-result" data-testid="screen-event-result">
      <img className="junior-result-stamp" src={publicAsset('/assets/ui/success-stamp.png')} alt="" />
      <strong>{save.eventResultText ?? '잘했어!'}</strong>
      <button className="junior-button junior-primary" data-testid="event-result-ok" onClick={onClose}>계속하기</button>
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
        <strong>{city.name}</strong>
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

function ShopScreen({ save, onVehicle, onBoat, onBack }: { save: JuniorSave; onVehicle: (id: JuniorVehicle['id']) => void; onBoat: (id: JuniorBoat['id']) => void; onBack: () => void }) {
  const vehicle = getVehicle(save);
  const boat = getBoat(save);
  return (
    <section className="junior-screen junior-shop" data-testid="screen-shop">
      <div className="junior-shop-summary">
        <strong>탈것 장만</strong>
        <span>지금 수레: {vehicle.name} · 짐칸 {save.cargoLimit}칸</span>
        <small>지금 배: {boat.name}</small>
      </div>
      <div className="junior-shop-grid">
        {JUNIOR_VEHICLES.filter((item) => item.id !== 'bundle').map((item) => {
          const owned = save.vehicleId === item.id;
          const canBuy = save.coins >= item.cost;
          return (
          <button className={`junior-shop-card ${owned ? 'owned' : ''} ${canBuy ? 'affordable' : ''}`} data-testid={`buy-vehicle-${item.id}`} key={item.id} onClick={() => onVehicle(item.id)}>
            <img src={item.image} alt="" loading="lazy" onError={handleImageFallback} />
            <strong>{item.name}</strong>
            <small>{item.text}</small>
            <b>짐칸 {item.cargoLimit}칸 · 돈 {item.cost}</b>
            <em>{owned ? '쓰는 중' : canBuy ? '장만하기' : `${item.cost - save.coins}냥 더`}</em>
          </button>
          );
        })}
        {JUNIOR_BOATS.filter((item) => item.id !== 'none').map((item) => {
          const owned = save.boatId === item.id;
          const canBuy = save.coins >= item.cost;
          return (
          <button className={`junior-shop-card boat ${owned ? 'owned' : ''} ${canBuy ? 'affordable' : ''}`} data-testid={`buy-boat-${item.id}`} key={item.id} onClick={() => onBoat(item.id)}>
            <img src={item.image} alt="" loading="lazy" onError={handleImageFallback} />
            <strong>{item.name}</strong>
            <small>{item.text}</small>
            <b>돈 {item.cost}</b>
            <em>{owned ? '쓰는 중' : canBuy ? '장만하기' : `${item.cost - save.coins}냥 더`}</em>
          </button>
          );
        })}
      </div>
      <button className="junior-button junior-primary" data-testid="shop-back" onClick={onBack}>도시로</button>
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
  const online = useNetworkStatus();
  const selectedGood = useMemo(() => save.selectedGoodId ? getGood(save.selectedGoodId) : undefined, [save.selectedGoodId]);
  const city = getCity(save.currentCityId);
  const event = getSelectedEvent(save);

  function update(next: JuniorSave) {
    setSave(next);
  }

  function sell(cargoId: string) {
    playJuniorSuccessSound();
    update(sellCargoItem(save, cargoId));
  }

  function marketBuy(good: JuniorGood) {
    update(buyGood(save, good.id));
  }

  function pick(good: JuniorGood) {
    update(chooseGood(save, good.id));
  }

  return (
    <main className={`junior-shell junior-step-${save.currentStep}`} data-testid="junior-app">
      <NetworkStatus online={online} />
      <TopBar save={save} />

      <section className="junior-main-card">
        {save.currentStep === 'intro' && <IntroScreen save={save} onStart={() => update(startIntro(save))} />}
        {save.currentStep === 'pick' && <PickScreen save={save} onPick={pick} />}
        {save.currentStep === 'buy' && <BuyScreen save={save} onBuy={() => update(buySelectedGood(save))} />}
        {save.currentStep === 'city' && <CityScreen save={save} onMarket={() => update(goToMarket(save))} onMap={() => update(goToMap(save))} onShop={() => update(goToShop(save))} onEnding={() => update(openEnding(save))} />}
        {save.currentStep === 'map' && <MapScreen save={save} onDepart={(nextCity) => update(startTravel(save, nextCity.id))} onBack={() => update(goToCity(save))} />}
        {save.currentStep === 'travel' && <TravelScreen save={save} onDone={() => update(finishTravel(save))} />}
        {save.currentStep === 'visitIntro' && <VisitIntroScreen save={save} onDone={() => update(completeVisitIntro(save))} />}
        {save.currentStep === 'market' && <MarketScreen save={save} onBuy={marketBuy} onSell={sell} onBack={() => update(goToCity(save))} onMap={() => update(goToMap(save))} />}
        {save.currentStep === 'event' && <EventScreen save={save} onSimple={() => update(resolveSimpleEvent(save))} onChoice={(index) => update(resolveChoice(save, index))} onQuiz={(option) => update(answerQuiz(save, option))} />}
        {save.currentStep === 'eventResult' && <EventResultScreen save={save} onClose={() => update(closeEventResult(save))} />}
        {save.currentStep === 'shop' && <ShopScreen save={save} onVehicle={(id) => update(buyVehicle(save, id))} onBoat={(id) => update(buyBoat(save, id))} onBack={() => update(goToCity(save))} />}
        {save.currentStep === 'endingChoice' && <EndingChoiceScreen onHome={() => update(finishEnding(save))} onMore={() => update(continueAfterEnding(save))} />}
        {save.currentStep === 'ending' && <EndingScreen onAgain={() => update(resetJuniorGame())} onMore={() => update(continueAfterEnding(save))} />}
      </section>

      <QuickNav
        save={save}
        onCity={() => update(goToCity(save))}
        onMap={() => update(goToMap(save))}
        onMarket={() => update(goToMarket(save))}
        onShop={() => update(goToShop(save))}
      />

      <FairyTalk save={save} lines={fairyLines(save, event)} />

      <footer className="junior-goal" aria-label="목표">
        <span>{city.name}</span>
        <strong>{save.coins >= ENDING_COINS ? '집으로 갈 수 있어!' : `${ENDING_COINS}냥이면 단서가 보여!`}</strong>
        {selectedGood ? <span>{selectedGood.name}</span> : <span>{getBoat(save).name}</span>}
      </footer>
    </main>
  );
}
