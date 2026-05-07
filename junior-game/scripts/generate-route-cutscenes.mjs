import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../public/assets/routes');

const routes = [
  { id: 'busan-daegu', mode: 'marketMountain', sky: '#8fd8ee', ground: '#84c36a', road: '#b48343', accent: '#f0b84a' },
  { id: 'daegu-jeonju', mode: 'mountainPaper', sky: '#94d5ee', ground: '#82be64', road: '#ad7d43', accent: '#f2dfaa' },
  { id: 'jeonju-mokpo', mode: 'riverSalt', sky: '#91dcef', ground: '#91c774', road: '#c49354', accent: '#f7f0d0' },
  { id: 'mokpo-jeju', mode: 'jejuSea', sky: '#8fdcf2', sea: '#45b6d6', accent: '#f2a64a' },
  { id: 'busan-tongyeong', mode: 'southCoast', sky: '#8cd9ef', sea: '#59bdd8', ground: '#7fc26d', accent: '#f0bd5c' },
  { id: 'tongyeong-jeju', mode: 'islandSea', sky: '#87d8f0', sea: '#3fb2d4', accent: '#eeb957' },
  { id: 'seoul-gangneung', mode: 'eastMountain', sky: '#90d5ed', ground: '#78b861', road: '#a97941', accent: '#d35f4e' },
  { id: 'seoul-pyongyang', mode: 'northRoad', sky: '#9dcfe4', ground: '#8aa878', road: '#9c784e', accent: '#8a9cb8' },
  { id: 'pyongyang-sinuiju', mode: 'borderRiver', sky: '#9bd0e8', ground: '#8eaa78', road: '#9f7847', accent: '#4aa2bf' },
  { id: 'wonsan-hamheung', mode: 'northCoast', sky: '#93d2e8', sea: '#4aaec9', ground: '#7fa675', accent: '#7e91a9' }
];

function cloud(x, y, s = 1) {
  return `<g opacity=".82" transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="0" rx="52" ry="24" fill="#fff9df"/>
    <ellipse cx="35" cy="-11" rx="38" ry="28" fill="#fff9df"/>
    <ellipse cx="76" cy="2" rx="46" ry="23" fill="#fff9df"/>
  </g>`;
}

function hill(fill, y, scale = 1) {
  return `<path d="M-80 ${y} C140 ${y - 170 * scale} 280 ${y - 90 * scale} 460 ${y - 185 * scale} C640 ${y - 290 * scale} 760 ${y - 120 * scale} 980 ${y - 230 * scale} L980 1600 L-80 1600 Z" fill="${fill}"/>`;
}

function mountains(color = '#6fa35f') {
  return `<g opacity=".92">
    <path d="M-90 980 L170 430 L430 980 Z" fill="${color}"/>
    <path d="M245 980 L515 350 L820 980 Z" fill="#78b568"/>
    <path d="M585 980 L820 455 L1030 980 Z" fill="#5f9673"/>
    <path d="M123 530 L170 430 L214 532 Z M472 450 L515 350 L566 454 Z M780 545 L820 455 L862 545 Z" fill="#fff4d1" opacity=".72"/>
  </g>`;
}

function road(color = '#b48343', curve = 'M80 1510 C210 1180 365 1000 436 740 C520 1015 680 1190 830 1510') {
  return `<path d="${curve}" fill="none" stroke="${color}" stroke-width="92" stroke-linecap="round"/>
  <path d="${curve}" fill="none" stroke="#dfbb74" stroke-width="34" stroke-linecap="round" opacity=".38"/>`;
}

function marketFlags(accent) {
  return `<g opacity=".88">
    <path d="M115 945 h150 v130 h-150z" fill="#f7e2a8"/>
    <path d="M95 945 h190 l-42 -70 h-106z" fill="${accent}"/>
    <path d="M625 980 h150 v120 h-150z" fill="#f3d79b"/>
    <path d="M606 980 h190 l-48 -72 h-96z" fill="#d76450"/>
    <path d="M172 860 v-125 M714 910 v-140" stroke="#6f4b2d" stroke-width="14" stroke-linecap="round"/>
    <path d="M172 746 c50 14 72 -18 122 0 v72 c-50 -18 -72 16 -122 0z" fill="${accent}"/>
    <path d="M714 780 c50 12 72 -20 122 -2 v72 c-48 -17 -74 15 -122 0z" fill="#f7d365"/>
  </g>`;
}

function water(sea = '#45b6d6', y = 665) {
  return `<path d="M-40 ${y} C120 ${y - 35} 250 ${y + 42} 410 ${y} C580 ${y - 48} 735 ${y + 44} 940 ${y - 12} L940 1600 L-40 1600 Z" fill="${sea}"/>
  <g opacity=".52" stroke="#fff7dc" stroke-width="9" stroke-linecap="round">
    <path d="M80 ${y + 130} q55 -24 110 0 t110 0 t110 0"/>
    <path d="M390 ${y + 240} q60 -25 120 0 t120 0 t120 0"/>
    <path d="M145 ${y + 390} q55 -23 110 0 t110 0 t110 0"/>
  </g>`;
}

function islands() {
  return `<g opacity=".85">
    <path d="M100 650 C150 588 225 610 260 655 C210 680 150 682 100 650 Z" fill="#66a963"/>
    <path d="M615 740 C678 660 760 690 815 752 C750 792 675 790 615 740 Z" fill="#5c9e65"/>
    <path d="M680 700 C704 662 740 664 760 708" fill="none" stroke="#fff0c6" stroke-width="8" opacity=".48"/>
  </g>`;
}

function bridge() {
  return `<g opacity=".9">
    <path d="M330 965 C410 860 520 860 604 965" fill="none" stroke="#aa7644" stroke-width="32" stroke-linecap="round"/>
    <path d="M330 965 C410 890 520 890 604 965" fill="none" stroke="#e3b96d" stroke-width="12" stroke-linecap="round"/>
  </g>`;
}

function cartSilhouette(x = 395, y = 1140) {
  return `<g transform="translate(${x} ${y}) scale(.72)" opacity=".13">
    <path d="M-85 10 h140 l42 70 h-210z" fill="#714823"/>
    <circle cx="-42" cy="90" r="28" fill="#3f2a1c"/>
    <circle cx="52" cy="90" r="28" fill="#3f2a1c"/>
    <path d="M70 16 l86 -56" stroke="#714823" stroke-width="18" stroke-linecap="round"/>
  </g>`;
}

function boatSilhouette(x = 370, y = 1030) {
  return `<g transform="translate(${x} ${y}) scale(.78)" opacity=".14">
    <path d="M-150 50 h260 l-48 58 h-162z" fill="#70451f"/>
    <path d="M-22 48 V-190" stroke="#70451f" stroke-width="16" stroke-linecap="round"/>
    <path d="M-12 -166 C85 -115 87 -35 -12 28 Z" fill="#fff0c8"/>
    <path d="M-36 -150 C-118 -96 -116 -30 -36 25 Z" fill="#d9ecf5"/>
  </g>`;
}

function detailFor(route) {
  switch (route.mode) {
    case 'marketMountain':
      return `${mountains()}${marketFlags(route.accent)}${road(route.road)}${cartSilhouette()}`;
    case 'mountainPaper':
      return `${mountains('#739d67')}<g opacity=".72">${paperStacks()}</g>${road(route.road, 'M90 1510 C245 1210 205 1030 375 790 C520 570 655 825 805 1510')}${cartSilhouette()}`;
    case 'riverSalt':
      return `${hill('#8bc76d', 1060, .7)}${water('#55bbd2', 1010)}${bridge()}${saltPiles()}${road(route.road, 'M75 1510 C255 1225 350 1130 420 980 C535 1170 640 1300 815 1510')}${cartSilhouette()}`;
    case 'jejuSea':
      return `${water(route.sea, 565)}${islands()}${jejuMotifs()}${boatSilhouette(405, 1125)}`;
    case 'southCoast':
      return `${water(route.sea, 720)}${hill(route.ground, 900, .55)}${portCrates(route.accent)}${road(route.road, 'M80 1510 C230 1260 308 1115 425 895 C570 1020 706 1265 820 1510')}${cartSilhouette()}`;
    case 'islandSea':
      return `${water(route.sea, 610)}${islands()}${boatSilhouette(390, 1100)}`;
    case 'eastMountain':
      return `${mountains('#6fa368')}${pineTrees()}${road(route.road, 'M90 1510 C250 1180 270 1010 430 760 C560 990 720 1160 820 1510')}${cartSilhouette()}`;
    case 'northRoad':
      return `${mountains('#738f7c')}<path d="M0 1090 C210 1038 380 1108 565 1048 C710 1005 810 1060 930 1020 L930 1600 L0 1600 Z" fill="${route.ground}"/>${road(route.road)}${cartSilhouette()}`;
    case 'borderRiver':
      return `${mountains('#718b81')}${water('#56a9c0', 920)}${bridge()}${road(route.road, 'M86 1510 C244 1280 290 1130 395 950 C562 1090 690 1280 830 1510')}${cartSilhouette()}`;
    case 'northCoast':
      return `${water(route.sea, 680)}${mountains('#718c80')}${portCrates(route.accent)}${road('#9c784e', 'M115 1510 C250 1290 375 1050 510 850 C600 1055 724 1270 825 1510')}${cartSilhouette()}`;
    default:
      return `${hill(route.ground, 980)}${road(route.road)}${cartSilhouette()}`;
  }
}

function paperStacks() {
  return `<g transform="translate(120 880)">
    <rect x="0" y="0" width="150" height="78" rx="18" fill="#fff3c7" stroke="#aa8a51" stroke-width="8"/>
    <rect x="28" y="-58" width="150" height="78" rx="18" fill="#fff8db" stroke="#aa8a51" stroke-width="8"/>
  </g>`;
}

function saltPiles() {
  return `<g opacity=".85">
    <path d="M110 1180 L205 1008 L300 1180 Z" fill="#fff7dc" stroke="#c9b57c" stroke-width="8"/>
    <path d="M655 1200 L735 1040 L830 1200 Z" fill="#fff8e4" stroke="#c9b57c" stroke-width="8"/>
  </g>`;
}

function jejuMotifs() {
  return `<g opacity=".84">
    <circle cx="145" cy="820" r="38" fill="#ec8b35"/>
    <circle cx="225" cy="775" r="30" fill="#f0a348"/>
    <path d="M140 760 C178 690 250 715 276 770" fill="none" stroke="#4f9346" stroke-width="14" stroke-linecap="round"/>
    <path d="M645 700 C690 620 770 670 790 760 C735 738 695 738 645 700 Z" fill="#679c71"/>
  </g>`;
}

function portCrates(accent) {
  return `<g opacity=".86">
    <rect x="92" y="930" width="120" height="82" rx="12" fill="#b7793d" stroke="#714823" stroke-width="8"/>
    <rect x="680" y="915" width="132" height="88" rx="12" fill="${accent}" stroke="#714823" stroke-width="8"/>
    <path d="M112 970 h80 M720 960 h62" stroke="#fff1c2" stroke-width="8" stroke-linecap="round"/>
  </g>`;
}

function pineTrees() {
  return `<g opacity=".82">
    ${[95, 170, 720, 795].map((x, i) => `<g transform="translate(${x} ${860 + i * 26})">
      <path d="M0 0 L-45 80 H45 Z" fill="#437d50"/>
      <path d="M0 -55 L-55 35 H55 Z" fill="#4f935a"/>
      <rect x="-9" y="72" width="18" height="70" fill="#714823"/>
    </g>`).join('')}
  </g>`;
}

function svgFor(route) {
  const sea = route.sea ?? '#5fc1d7';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1600" viewBox="0 0 900 1600">
    <defs>
      <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="${route.sky}"/>
        <stop offset=".58" stop-color="#e8f6d7"/>
        <stop offset="1" stop-color="${route.ground ?? sea}"/>
      </linearGradient>
      <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="16" stdDeviation="8" flood-color="#315033" flood-opacity=".18"/>
      </filter>
    </defs>
    <rect width="900" height="1600" fill="url(#sky)"/>
    ${cloud(130, 160, 1)}${cloud(620, 235, .82)}
    ${hill(route.ground ?? '#76c074', 1125, .45)}
    ${detailFor(route)}
    <g filter="url(#soft)" opacity=".92">
      <circle cx="760" cy="170" r="74" fill="#ffe37a"/>
      <circle cx="760" cy="170" r="104" fill="#ffe37a" opacity=".16"/>
    </g>
    <rect x="0" y="0" width="900" height="1600" fill="rgba(255,255,255,.04)"/>
  </svg>`;
}

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 900, height: 1600 }, deviceScaleFactor: 1 });

for (const route of routes) {
  await page.setContent(`<!doctype html><html><body style="margin:0;background:transparent">${svgFor(route)}</body></html>`);
  await page.locator('svg').screenshot({ path: path.join(outDir, `${route.id}.png`) });
}

await browser.close();
console.log(`Generated ${routes.length} route cutscene PNGs in ${outDir}`);
