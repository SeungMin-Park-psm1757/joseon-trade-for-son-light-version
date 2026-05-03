import fs from 'node:fs';
import path from 'node:path';

const rootDir = path.resolve(process.cwd(), '..');
const starterDir = process.cwd();
const publicDir = path.join(starterDir, 'public');
const runtimeDataDir = path.join(publicDir, 'data');
const mirrorDataDir = path.join(rootDir, 'data');

const errors = [];
const warnings = [];

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    errors.push(`Cannot parse JSON: ${path.relative(rootDir, file)} (${error.message})`);
    return null;
  }
}

function existsPublic(assetPath) {
  if (!assetPath || typeof assetPath !== 'string') return false;
  const cleanPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
  return fs.existsSync(path.join(publicDir, cleanPath));
}

function normalizedJson(value) {
  return JSON.stringify(value);
}

function idSet(items, label) {
  const ids = new Set();
  for (const item of items ?? []) {
    if (!item?.id) {
      errors.push(`${label} contains an item without id`);
      continue;
    }
    if (ids.has(item.id)) errors.push(`${label} contains duplicate id: ${item.id}`);
    ids.add(item.id);
  }
  return ids;
}

function checkRef(id, set, label) {
  if (id && !set.has(id)) errors.push(`${label} references unknown id: ${id}`);
}

const dataFiles = fs.existsSync(runtimeDataDir)
  ? fs.readdirSync(runtimeDataDir).filter((file) => file.endsWith('.json')).sort()
  : [];

if (!dataFiles.length) errors.push('No runtime data files found under starter/public/data');

for (const file of dataFiles) {
  const runtimePath = path.join(runtimeDataDir, file);
  const mirrorPath = path.join(mirrorDataDir, file);
  if (!fs.existsSync(mirrorPath)) {
    errors.push(`Missing root data mirror: data/${file}`);
    continue;
  }
  const runtime = readJson(runtimePath);
  const mirror = readJson(mirrorPath);
  if (runtime && mirror && normalizedJson(runtime) !== normalizedJson(mirror)) {
    errors.push(`Runtime data and root mirror differ: ${file}`);
  }
}

const goods = readJson(path.join(runtimeDataDir, 'goods.json')) ?? [];
const ports = readJson(path.join(runtimeDataDir, 'ports.json')) ?? [];
const routes = readJson(path.join(runtimeDataDir, 'routes.json')) ?? [];
const quests = readJson(path.join(runtimeDataDir, 'quests.json')) ?? [];
const ships = readJson(path.join(runtimeDataDir, 'ships.json')) ?? [];
const carts = readJson(path.join(runtimeDataDir, 'carts.json')) ?? [];
const tools = readJson(path.join(runtimeDataDir, 'tools.json')) ?? [];
const companions = readJson(path.join(runtimeDataDir, 'companions.json')) ?? [];
const portFlavors = readJson(path.join(runtimeDataDir, 'port_flavors.json')) ?? [];
const discoveries = readJson(path.join(runtimeDataDir, 'discoveries.json')) ?? [];
const ledgerSeals = readJson(path.join(runtimeDataDir, 'ledger_seals.json')) ?? [];
const monthlyEvents = readJson(path.join(runtimeDataDir, 'monthly_events.json')) ?? [];
const assetManifest = readJson(path.join(runtimeDataDir, 'asset_manifest.json')) ?? [];

const goodIds = idSet(goods, 'goods.json');
const portIds = idSet(ports, 'ports.json');
const routeIds = idSet(routes, 'routes.json');
const shipIds = idSet(ships, 'ships.json');
const cartIds = idSet(carts, 'carts.json');
const toolIds = idSet(tools, 'tools.json');
idSet(companions, 'companions.json');
idSet(quests, 'quests.json');
idSet(discoveries, 'discoveries.json');
idSet(ledgerSeals, 'ledger_seals.json');
idSet(assetManifest, 'asset_manifest.json');

for (const good of goods) {
  if (!existsPublic(good.iconAsset)) errors.push(`Missing good icon for ${good.id}: ${good.iconAsset}`);
}
if (!existsPublic('/assets/painted2d/goods/fallback-good.png')) errors.push('Missing painted 2D fallback good icon');

for (const port of ports) {
  if (!existsPublic(port.sceneAsset)) errors.push(`Missing scene asset for ${port.id}: ${port.sceneAsset}`);
}

const flavorPortIds = new Set();
for (const flavor of portFlavors) {
  const flavorPortId = flavor.portId ?? flavor.id;
  if (!flavorPortId) {
    errors.push('port_flavors.json contains an item without id or portId');
    continue;
  }
  if (flavorPortIds.has(flavorPortId)) errors.push(`Duplicate port flavor: ${flavorPortId}`);
  flavorPortIds.add(flavorPortId);
  checkRef(flavorPortId, portIds, 'port_flavors.json');
  for (const goodId of flavor.goods ?? []) checkRef(goodId, goodIds, `port flavor ${flavorPortId}`);
  for (const slot of flavor.marketSlots ?? []) checkRef(slot.goodId, goodIds, `market slot ${flavorPortId}`);
}
for (const port of ports) {
  if (!flavorPortIds.has(port.id)) errors.push(`Missing port flavor for port: ${port.id}`);
}

for (const route of routes) {
  checkRef(route.from, portIds, `route ${route.id}.from`);
  checkRef(route.to, portIds, `route ${route.id}.to`);
  if (!['land', 'sea'].includes(route.mode)) errors.push(`Route ${route.id} has unsupported mode: ${route.mode}`);
  if (routeIds.has(route.id) && route.from === route.to) errors.push(`Route ${route.id} loops to the same port`);
}

for (const discovery of discoveries) {
  checkRef(discovery.portId, portIds, `discovery ${discovery.id}`);
  if (!existsPublic(discovery.iconAsset)) errors.push(`Missing discovery icon for ${discovery.id}: ${discovery.iconAsset}`);
}
for (const port of ports) {
  if (!discoveries.some((discovery) => discovery.portId === port.id)) errors.push(`Missing discovery for port: ${port.id}`);
}

for (const seal of ledgerSeals) {
  if (!existsPublic(seal.iconAsset)) errors.push(`Missing ledger seal icon for ${seal.id}: ${seal.iconAsset}`);
  for (const requirement of seal.requirements ?? []) {
    for (const portId of requirement.portIds ?? []) checkRef(portId, portIds, `ledger seal ${seal.id}`);
    for (const goodId of requirement.goodIds ?? []) checkRef(goodId, goodIds, `ledger seal ${seal.id}`);
    if (requirement.shipId) checkRef(requirement.shipId, shipIds, `ledger seal ${seal.id}`);
    if (requirement.toolId) checkRef(requirement.toolId, toolIds, `ledger seal ${seal.id}`);
  }
}

for (const event of monthlyEvents) {
  for (const goodId of [...(event.trendGoods ?? []), ...(event.officialDemandGoods ?? [])]) {
    checkRef(goodId, goodIds, `monthly event ${event.month}`);
  }
}

for (const asset of assetManifest) {
  if (!existsPublic(asset.path)) errors.push(`Asset manifest path missing for ${asset.id}: ${asset.path}`);
}

for (const quest of quests) {
  for (const objective of quest.objectives ?? []) {
    if (objective.good) checkRef(objective.good, goodIds, `quest ${quest.id}`);
    for (const goodId of Object.keys(objective.goods ?? {})) checkRef(goodId, goodIds, `quest ${quest.id}`);
    if (objective.at) checkRef(objective.at, portIds, `quest ${quest.id}`);
    for (const portId of objective.atAny ?? []) checkRef(portId, portIds, `quest ${quest.id}`);
    for (const portId of objective.ports ?? []) checkRef(portId, portIds, `quest ${quest.id}`);
    if (objective.cart) checkRef(objective.cart, cartIds, `quest ${quest.id}`);
    if (objective.ship) checkRef(objective.ship, shipIds, `quest ${quest.id}`);
  }
}

for (const icon of ['money', 'ship', 'cart', 'cargo', 'crew', 'repair', 'time', 'safe', 'plain']) {
  if (!existsPublic(`/assets/painted2d/ui/result-${icon}.png`)) errors.push(`Missing painted 2D result icon: ${icon}.png`);
}

for (const requiredDoc of ['docs/CURRENT_CONTEXT.md', 'docs/NEXT_WORK_ROADMAP.md']) {
  if (!fs.existsSync(path.join(rootDir, requiredDoc))) errors.push(`Missing project continuity doc: ${requiredDoc}`);
}

const packageJson = readJson(path.join(starterDir, 'package.json')) ?? {};
for (const script of ['validate:data', 'audit:consistency', 'build', 'test:smoke', 'test:visual']) {
  if (!packageJson.scripts?.[script]) errors.push(`package.json missing script: ${script}`);
}

if (!fs.existsSync(path.join(rootDir, '.git'))) {
  warnings.push('Workspace is not a Git checkout locally; GitHub Actions workflow is still written for repository use.');
}

if (warnings.length) {
  console.log('Consistency audit warnings:');
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (errors.length) {
  console.error('Consistency audit failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Consistency audit passed: ${dataFiles.length} data files, ${goods.length} goods, ${ports.length} ports, ${routes.length} routes, ${quests.length} quests, ${tools.length} tools, ${companions.length} companions.`);
