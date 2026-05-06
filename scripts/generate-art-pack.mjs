import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const assetRoot = join(root, 'public', 'assets');

function writeAsset(path, svg) {
  const fullPath = join(assetRoot, path);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, svg, 'utf8');
}

function svg(width, height, body, extra = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">${extra}${body}</svg>`;
}

function defs(accent = '#f7b24a', sky = '#9eddf0') {
  return `<defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky}"/><stop offset="1" stop-color="#fff3bd"/></linearGradient>
    <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd26b"/><stop offset="1" stop-color="#5caf64"/></linearGradient>
    <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#70cce4"/><stop offset="1" stop-color="#2f9fbd"/></linearGradient>
    <linearGradient id="wood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d59b54"/><stop offset="1" stop-color="#8d5a2f"/></linearGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="8" stdDeviation="5" flood-color="#2b4c35" flood-opacity=".22"/></filter>
    <style>
      .ink{stroke:#5b4228;stroke-width:8;stroke-linecap:round;stroke-linejoin:round}
      .thin{stroke:#5b4228;stroke-width:4;stroke-linecap:round;stroke-linejoin:round}
      .soft{stroke:#fff8cf;stroke-width:5;stroke-linecap:round;stroke-linejoin:round;opacity:.75}
      .accent{fill:${accent}}
    </style>
  </defs>`;
}

function sunClouds() {
  return `<circle cx="660" cy="82" r="40" fill="#ffe77b"/><circle cx="660" cy="82" r="64" fill="#ffe77b" opacity=".18"/>
    <g fill="#fffbe6" opacity=".86"><ellipse cx="160" cy="82" rx="66" ry="24"/><ellipse cx="208" cy="78" rx="48" ry="20"/><ellipse cx="610" cy="138" rx="54" ry="18"/></g>`;
}

function hills() {
  return `<path d="M0 312 C120 238 198 268 304 308 C420 228 566 252 800 302 L800 520 L0 520 Z" fill="url(#ground)"/>
    <path d="M-40 350 C150 285 280 330 438 350 C552 292 676 318 840 340" class="soft" fill="none"/>`;
}

function seaBand() {
  return `<path d="M0 302 C120 288 210 322 338 306 C476 286 616 314 800 296 L800 520 L0 520 Z" fill="url(#sea)"/>
    <g fill="none" stroke="#e9fbff" stroke-width="7" stroke-linecap="round" opacity=".72">
      <path d="M44 365 C98 348 146 384 202 365"/><path d="M286 402 C336 386 386 420 444 402"/><path d="M548 356 C610 338 650 376 720 354"/>
    </g>`;
}

function marketStalls(x = 118, y = 292, color = '#f0c04c') {
  return `<g filter="url(#softShadow)">
    <path d="M${x} ${y} h166 v92 h-166z" fill="#eed59a" class="thin"/>
    <path d="M${x - 10} ${y} h186 l-18 -54 h-150z" fill="${color}" class="thin"/>
    <path d="M${x + 28} ${y + 92} v-54 h62 v54" fill="#9a6135" class="thin"/>
    <path d="M${x + 116} ${y + 92} v-45 h38" fill="none" class="thin"/>
  </g>`;
}

function boat(x = 478, y = 338, scale = 1, sail = true, accent = '#f5bf5a') {
  return `<g transform="translate(${x} ${y}) scale(${scale})" filter="url(#softShadow)">
    <path d="M-96 42 C-54 76 62 76 105 42 C73 102 -64 104 -108 42 Z" fill="url(#wood)" class="thin"/>
    <path d="M-82 42 H92" class="thin" fill="none"/>
    ${sail ? `<path d="M-8 34 V-96" class="thin"/><path d="M2 -88 C50 -58 68 -4 16 22 Z" fill="#fff4c2" class="thin"/><path d="M-12 -76 C-58 -48 -66 -8 -18 20 Z" fill="${accent}" class="thin"/>` : `<path d="M-55 26 C-18 8 25 6 60 26" fill="none" class="thin"/>`}
  </g>`;
}

function cart(x = 454, y = 350, scale = 1) {
  return `<g transform="translate(${x} ${y}) scale(${scale})" filter="url(#softShadow)">
    <path d="M-94 18 H76 L48 72 H-112 Z" fill="url(#wood)" class="thin"/>
    <path d="M-72 18 V-42 H38 L66 18" fill="#c98745" class="thin"/>
    <circle cx="-58" cy="84" r="28" fill="#74472d" class="thin"/><circle cx="34" cy="84" r="28" fill="#74472d" class="thin"/>
    <circle cx="-58" cy="84" r="10" fill="#e9c57a"/><circle cx="34" cy="84" r="10" fill="#e9c57a"/>
    <path d="M78 18 L142 -10" class="thin"/>
  </g>`;
}

function palace(x = 450, y = 286) {
  return `<g filter="url(#softShadow)">
    <path d="M${x - 168} ${y + 76} h336 v92 h-336z" fill="#d7a35b" class="thin"/>
    <path d="M${x - 196} ${y + 76} h392 l-46 -66 h-300z" fill="#62a36a" class="ink"/>
    <path d="M${x - 82} ${y + 168} v-68 h64 v68" fill="#7d4c34" class="thin"/>
    <path d="M${x + 28} ${y + 168} v-68 h64 v68" fill="#7d4c34" class="thin"/>
    <path d="M${x - 130} ${y + 34} h260" class="soft"/>
  </g>`;
}

function hanok(x = 238, y = 302, color = '#6aa36a') {
  return `<g filter="url(#softShadow)">
    <path d="M${x - 112} ${y + 44} h224 v90 h-224z" fill="#ead09b" class="thin"/>
    <path d="M${x - 136} ${y + 48} h272 l-36 -58 h-200z" fill="${color}" class="ink"/>
    <path d="M${x - 38} ${y + 134} v-58 h76 v58" fill="#895c38" class="thin"/>
  </g>`;
}

function river(x = 0, y = 390, rotate = -5) {
  return `<path d="M${x - 80} ${y} C140 ${y - 38} 218 ${y + 36} 346 ${y} C494 ${y - 42} 582 ${y + 28} 884 ${y - 8}" fill="none" stroke="#49b6d4" stroke-width="42" stroke-linecap="round" opacity=".86" transform="rotate(${rotate} 400 ${y})"/>
    <path d="M${x - 60} ${y - 4} C150 ${y - 30} 230 ${y + 24} 360 ${y - 4} C510 ${y - 34} 606 ${y + 18} 850 ${y - 10}" fill="none" stroke="#defbff" stroke-width="8" stroke-linecap="round" opacity=".82" transform="rotate(${rotate} 400 ${y})"/>`;
}

function reeds() {
  return `<g stroke="#6d8c42" stroke-width="6" stroke-linecap="round" opacity=".86">${Array.from({ length: 18 }, (_, i) => `<path d="M${26 + i * 44} 432 C${18 + i * 44} 390 ${36 + i * 44} 374 ${30 + i * 44} 348"/>`).join('')}</g>`;
}

const citySpecs = {
  seoul: { accent: '#6aa36a', sky: '#9eddf0', bg: () => `${hills()}${palace(454, 246)}${marketStalls(92, 318, '#f4c55f')}` },
  gaeseong: { accent: '#e1ad4f', sky: '#a8e2ee', bg: () => `${hills()}${marketStalls(126, 304, '#e2b856')}<g>${hanok(520, 286, '#8cb565')}<circle cx="598" cy="386" r="28" fill="#d0b35a"/><path d="M582 386 C598 354 622 366 612 392" class="thin" fill="none"/></g>` },
  pyongyang: { accent: '#8ab0c4', sky: '#9fd5e8', bg: () => `${hills()}${river(0, 392, -2)}<g>${hanok(390, 250, '#7c9aa9')}<path d="M144 322 h150 v98 h-150z" fill="#b9794a" class="thin"/><path d="M126 320 h186 l-26 -48 h-134z" fill="#7b9d72" class="thin"/></g>` },
  sinuiju: { accent: '#cfa251', sky: '#a6dce8', bg: () => `${hills()}${river(0, 366, -7)}${marketStalls(500, 300, '#dcb052')}<path d="M86 390 C170 352 238 366 300 392" fill="none" stroke="#b98348" stroke-width="20" stroke-linecap="round"/>` },
  chuncheon: { accent: '#6ba87c', sky: '#98dff1', bg: () => `${hills()}<ellipse cx="380" cy="392" rx="248" ry="70" fill="#60bdd5" opacity=".9"/><path d="M138 392 C264 366 462 422 626 390" fill="none" stroke="#e7fbff" stroke-width="9" stroke-linecap="round"/><g>${hanok(548, 286, '#6fa16e')}</g>` },
  gangneung: { accent: '#4fb2a9', sky: '#91dcef', bg: () => `${seaBand()}<path d="M0 338 C110 302 174 318 256 336 L256 520 H0 Z" fill="#80c66e"/><g stroke="#316b52" stroke-width="9" stroke-linecap="round"><path d="M122 316 v-76"/><path d="M96 262 h54"/><path d="M102 232 h42"/></g>${marketStalls(500, 298, '#57b6ad')}` },
  wonsan: { accent: '#4aa8c8', sky: '#91d9ef', bg: () => `${seaBand()}${boat(470, 336, .9, true, '#65b7d5')}<g>${marketStalls(112, 306, '#ddb05e')}<rect x="575" y="284" width="130" height="122" rx="14" fill="#d9b376" class="thin"/></g>` },
  hamheung: { accent: '#7eaa6b', sky: '#a9dbe6', bg: () => `${hills()}<path d="M0 308 C120 202 236 246 334 310 C444 196 610 236 800 300 L800 520 L0 520 Z" fill="#78ae6a" opacity=".92"/><g>${hanok(506, 304, '#789b64')}<path d="M150 410 C170 350 198 332 214 288 C240 338 210 374 226 410" fill="#4e9b62" class="thin"/></g>` },
  cheongjin: { accent: '#6aa6bc', sky: '#bddce7', bg: () => `${seaBand()}<path d="M0 306 C168 214 304 260 452 306 C566 236 672 260 800 292 L800 342 L0 342 Z" fill="#91a989" opacity=".8"/>${boat(520, 356, .8, true, '#86bdd1')}<rect x="88" y="314" width="144" height="90" rx="12" fill="#cba66d" class="thin"/>` },
  andong: { accent: '#d3b15d', sky: '#a8dfe9', bg: () => `${hills()}${hanok(256, 292, '#768f64')}<g filter="url(#softShadow)"><rect x="484" y="278" width="122" height="118" rx="12" fill="#fff6d9" class="thin"/><path d="M510 312 h70 M510 342 h64 M510 372 h54" class="thin"/></g>` },
  daegu: { accent: '#78aa58', sky: '#aee2e9', bg: () => `${hills()}${marketStalls(104, 300, '#9dbd54')}<g>${hanok(558, 288, '#7e9d61')}<path d="M344 424 C326 362 352 332 360 292 C394 334 386 374 410 424" fill="#5ba15c" class="thin"/><path d="M402 424 C386 374 414 342 430 310 C462 356 452 390 474 424" fill="#75b85d" class="thin"/></g>` },
  ulsan: { accent: '#b9864d', sky: '#9eddeb', bg: () => `${seaBand()}<g>${boat(542, 326, .75, false, '#d5b36a')}<path d="M112 394 h270" stroke="#9a6237" stroke-width="26" stroke-linecap="round"/><path d="M166 344 h212" stroke="#c38a4d" stroke-width="18" stroke-linecap="round"/><rect x="96" y="310" width="142" height="86" rx="12" fill="#dbb775" class="thin"/></g>` },
  busan: { accent: '#55b5c6', sky: '#8edceb', bg: () => `${seaBand()}${boat(512, 328, 1, true, '#f4c85d')}${marketStalls(80, 302, '#efbd4e')}<path d="M640 300 l86 30 v100 h-120 v-92z" fill="#d3a66a" class="thin"/>` },
  jinju: { accent: '#8bb66f', sky: '#a7e0e8', bg: () => `${hills()}${river(0, 390, 3)}<g>${hanok(516, 276, '#718b61')}<path d="M118 330 h160 v94 h-160z" fill="#c78f58" class="thin"/><path d="M102 328 h192 l-28 -54 h-136z" fill="#6d8e67" class="thin"/></g>` },
  tongyeong: { accent: '#4cb8c2', sky: '#8fddeb', bg: () => `${seaBand()}${boat(468, 330, .85, true, '#65bfca')}${boat(650, 380, .58, false, '#e2ba67')}<g>${marketStalls(80, 300, '#60b7bd')}<circle cx="252" cy="374" r="18" fill="#cdefff" class="thin"/></g>` },
  jeonju: { accent: '#cfa65d', sky: '#aee3ed', bg: () => `${hills()}${hanok(224, 284, '#7c9469')}<g filter="url(#softShadow)"><rect x="500" y="280" width="94" height="124" rx="10" fill="#fff7dc" class="thin"/><rect x="610" y="304" width="76" height="94" rx="10" fill="#fff2c7" class="thin"/><path d="M522 318 h50 M522 350 h46 M522 382 h38" class="thin"/></g>` },
  gwangju: { accent: '#dfbd62', sky: '#a7dfe9', bg: () => `${hills()}<path d="M0 390 C160 360 250 424 424 386 C560 350 650 390 800 368 L800 520 H0 Z" fill="#d9bf62" opacity=".72"/><g>${marketStalls(478, 292, '#e4bf5a')}<path d="M96 410 h260" stroke="#f3dc7d" stroke-width="18" stroke-linecap="round"/><path d="M110 452 h278" stroke="#e0bd54" stroke-width="18" stroke-linecap="round"/></g>` },
  suncheon: { accent: '#88b65f', sky: '#98dbe9', bg: () => `${seaBand()}${reeds()}<ellipse cx="292" cy="400" rx="226" ry="58" fill="#70c5af" opacity=".55"/><g>${marketStalls(500, 298, '#b7bc58')}</g>` },
  yeosu: { accent: '#4ab0c5', sky: '#8edcea', bg: () => `${seaBand()}<ellipse cx="168" cy="304" rx="64" ry="28" fill="#6db46b"/><ellipse cx="654" cy="330" rx="74" ry="30" fill="#6db46b"/>${boat(430, 340, .9, true, '#63bfd1')}${marketStalls(86, 318, '#65b7c5')}` },
  mokpo: { accent: '#d4b15f', sky: '#acdce7', bg: () => `${seaBand()}<path d="M0 402 C156 378 312 424 480 402 C610 388 710 404 800 390 L800 520 H0 Z" fill="#caa76a"/><g fill="#fff3cf" opacity=".9"><ellipse cx="152" cy="412" rx="42" ry="12"/><ellipse cx="254" cy="444" rx="58" ry="14"/><ellipse cx="606" cy="418" rx="52" ry="13"/></g>${marketStalls(500, 292, '#d6ad57')}` },
  jeju: { accent: '#f3a746', sky: '#91ddea', bg: () => `${seaBand()}<path d="M0 344 C150 266 350 304 518 346 C632 292 708 308 800 332 L800 520 L0 520 Z" fill="#78c36e"/><path d="M252 344 C312 256 438 250 510 344 Z" fill="#819a76" class="thin"/><g fill="#f59d30">${[72,112,152,622,662,704].map((x, i) => `<circle cx="${x}" cy="${394 + (i % 2) * 24}" r="18"/>`).join('')}</g><g>${boat(450, 372, .72, true, '#f3a746')}</g>` }
};

for (const [id, spec] of Object.entries(citySpecs)) {
  writeAsset(`cities/${id}.svg`, svg(800, 520, `<rect width="800" height="520" fill="url(#sky)"/>${sunClouds()}${spec.bg()}<rect x="18" y="18" width="764" height="484" rx="38" fill="none" stroke="#fff8cf" stroke-width="8" opacity=".55"/>`, defs(spec.accent, spec.sky)));
}

const goods = {
  cotton_cloth: `<rect x="66" y="42" width="116" height="154" rx="22" fill="#fff8df" class="ink"/><path d="M84 72 h80 M84 110 h80 M84 148 h80" class="thin" opacity=".45"/><path d="M52 64 C72 26 138 26 190 54" fill="none" stroke="#e5ca95" stroke-width="18" stroke-linecap="round"/>`,
  dried_fish: `<g fill="#b98a54" class="thin"><path d="M48 98 C78 56 132 58 166 96 C132 136 76 136 48 98Z"/><path d="M166 96 l46 -30 v64z"/></g><path d="M74 82 h66 M72 114 h72" class="thin" opacity=".45"/><circle cx="76" cy="92" r="5" fill="#392b1f"/>`,
  salt: `<path d="M48 196 L96 72 L148 196Z" fill="#fff9e8" class="ink"/><path d="M112 196 L158 62 L214 196Z" fill="#d8f0ff" class="ink"/><path d="M34 200 h188" class="ink"/><path d="M98 116 h44" class="soft"/>`,
  paper: `<path d="M74 42 h104 c18 0 30 12 30 30 v112 c0 18-12 30-30 30H74c-18 0-30-12-30-30V72c0-18 12-30 30-30Z" fill="#fff7d8" class="ink"/><path d="M78 84 h92 M78 118 h86 M78 152 h70" class="thin" opacity=".56"/><path d="M178 42 c-22 12-26 34-10 54" fill="none" class="thin"/>`,
  citrus: `<g class="thin"><circle cx="92" cy="128" r="50" fill="#f5a22e"/><circle cx="150" cy="116" r="46" fill="#ffbd39"/><circle cx="138" cy="164" r="42" fill="#f49a2f"/></g><path d="M126 66 C144 38 178 42 190 70 C162 74 148 76 126 66Z" fill="#5fa449" class="thin"/>`,
  fresh_fish: `<path d="M30 130 C72 72 150 76 194 130 C150 184 72 184 30 130Z" fill="#8bcce4" class="ink"/><path d="M194 130 l42 -38 v76z" fill="#64aeca" class="ink"/><path d="M84 94 C112 118 112 142 84 166" fill="none" class="thin"/><circle cx="74" cy="120" r="6" fill="#253043"/>`,
  herbs: `<g class="thin" fill="#64aa54">${[64,92,122,150,180].map((x, i) => `<path d="M${x} 204 C${x - 36} 142 ${x + 26} 98 ${x} 46 C${x + 48} 94 ${x - 12} 144 ${x} 204Z" opacity="${0.82 - i * .04}"/>`).join('')}</g><path d="M70 212 C104 178 142 154 186 116" class="ink" fill="none"/>`,
  rice: `<path d="M62 72 h132 v120 c0 22-18 40-40 40H102c-22 0-40-18-40-40Z" fill="#e9c58a" class="ink"/><path d="M52 78 h154 l-18-40H70z" fill="#b98348" class="ink"/><g fill="#fff6d6">${[92,116,140,164].map((x, i) => `<ellipse cx="${x}" cy="${122 + i * 15}" rx="12" ry="19" transform="rotate(-18 ${x} ${122 + i * 15})"/>`).join('')}</g>`
};

for (const [id, body] of Object.entries(goods)) {
  writeAsset(`goods-v2/${id}.svg`, svg(256, 256, `<rect width="256" height="256" fill="none"/><ellipse cx="128" cy="224" rx="80" ry="18" fill="#2c4730" opacity=".14"/>${body}`, defs('#f2a846')));
}

const boats = {
  no_boat: boat(128, 146, .62, false, '#e9bd65'),
  small_ferry: boat(128, 146, .72, false, '#e9bd65'),
  sailboat: boat(128, 154, .7, true, '#efd06d'),
  sturdy_sailboat: `${boat(128, 154, .76, true, '#70b8d6')}<path d="M68 204 h120" class="thin" opacity=".5"/>`,
  merchant_ship: `${boat(128, 154, .82, true, '#f0b85b')}<rect x="74" y="144" width="98" height="38" rx="8" fill="#d39a55" class="thin"/>`
};

for (const [id, body] of Object.entries(boats)) {
  writeAsset(`boats/${id}.svg`, svg(256, 256, `<rect width="256" height="256" fill="none"/><ellipse cx="128" cy="218" rx="82" ry="16" fill="#2c4730" opacity=".14"/>${body}`, defs('#f0b85b')));
}

const eventBodies = {
  bandit: `${hills()}${cart(188, 342, .48)}<g filter="url(#softShadow)"><circle cx="554" cy="250" r="48" fill="#d49c66" class="thin"/><path d="M490 330 C500 272 610 270 626 330 L626 408 H490Z" fill="#7d6a4e" class="thin"/><path d="M514 222 C540 190 592 196 608 228" fill="none" class="ink"/></g>`,
  pirate: `${seaBand()}${boat(280, 330, .72, true, '#f0bf5f')}<g filter="url(#softShadow)"><path d="M542 276 C586 250 642 274 652 324 C608 342 562 334 542 276Z" fill="#7c5a40" class="thin"/><path d="M560 242 h74 l-18 -34 h-38z" fill="#46556e" class="thin"/></g>`,
  animal: `${hills()}<path d="M0 300 C160 210 280 260 400 302 C548 210 660 252 800 286 L800 520 L0 520Z" fill="#79b866" opacity=".88"/><g filter="url(#softShadow)"><circle cx="548" cy="270" r="48" fill="#d6944e" class="thin"/><path d="M472 360 C498 300 602 298 636 360 L608 424 H500Z" fill="#de9f59" class="thin"/><path d="M516 258 l-32 -32 M584 258 l32 -32" class="thin"/></g>`,
  merchant: `${hills()}${marketStalls(98, 308, '#efc25e')}${cart(552, 348, .52)}<circle cx="454" cy="276" r="34" fill="#d59a63" class="thin"/><path d="M410 370 C420 320 496 318 512 370" fill="#5da06b" class="thin"/>`,
  rain: `<rect width="800" height="520" fill="#91c9db"/>${hills()}<g stroke="#eaf8ff" stroke-width="8" stroke-linecap="round" opacity=".78">${Array.from({ length: 18 }, (_, i) => `<path d="M${42 + i * 46} ${90 + (i % 3) * 20} l-28 72"/>`).join('')}</g>${cart(392, 350, .56)}`,
  wind: `${seaBand()}${boat(382, 326, .82, true, '#f2c75c')}<g fill="none" stroke="#fff8cf" stroke-width="12" stroke-linecap="round" opacity=".8"><path d="M90 142 C210 92 330 164 462 120"/><path d="M178 210 C330 152 494 226 650 174"/></g>`,
  rice_cake: `${hills()}<g filter="url(#softShadow)"><path d="M164 354 C236 252 370 268 420 354 Z" fill="#7da865" class="thin"/><circle cx="534" cy="308" r="54" fill="#e6b36f" class="thin"/><rect x="438" y="350" width="188" height="74" rx="20" fill="#d09a56" class="thin"/><g fill="#fff6d9"><circle cx="482" cy="340" r="22"/><circle cx="530" cy="332" r="20"/><circle cx="576" cy="348" r="22"/></g></g>`,
  fairy_cloth: `${hills()}<g filter="url(#softShadow)"><path d="M438 132 C528 160 584 248 548 340 C476 320 430 250 438 132Z" fill="#f8f2d4" class="thin"/><path d="M374 180 C430 150 506 190 530 260 C462 272 396 250 374 180Z" fill="#88c7e8" class="thin"/><circle cx="292" cy="238" r="42" fill="#f0bd86" class="thin"/></g>`,
  book: `${hills()}<g filter="url(#softShadow)"><rect x="252" y="170" width="296" height="210" rx="28" fill="#b77745" class="ink"/><path d="M400 184 v180" class="thin"/><path d="M294 238 h70 M294 288 h72 M436 238 h74 M436 288 h68" class="soft"/><circle cx="400" cy="274" r="82" fill="#ffe777" opacity=".42"/></g>`,
  ending_door: `<rect width="800" height="520" fill="url(#sky)"/>${hills()}<g filter="url(#softShadow)"><path d="M292 116 h216 c38 0 68 30 68 68v222H224V184c0-38 30-68 68-68Z" fill="#ffe9a8" class="ink"/><path d="M300 192 h200 v214H300Z" fill="#8cd6ee" class="thin"/><path d="M400 190 v214" class="soft"/><circle cx="400" cy="258" r="96" fill="#fff176" opacity=".38"/></g>`
};

for (const [id, body] of Object.entries(eventBodies)) {
  writeAsset(`events/${id}.svg`, svg(800, 520, `<rect width="800" height="520" fill="url(#sky)"/>${sunClouds()}${body}<rect x="18" y="18" width="764" height="484" rx="38" fill="none" stroke="#fff8cf" stroke-width="8" opacity=".5"/>`, defs('#f0b85b')));
}
