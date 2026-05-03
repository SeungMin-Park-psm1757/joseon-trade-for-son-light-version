import fs from 'node:fs';
import path from 'node:path';

const dataDir = path.resolve('public/data');
const requiredFiles = [
  'ports.json',
  'goods.json',
  'ships.json',
  'carts.json',
  'tools.json',
  'companions.json',
  'routes.json',
  'events.json',
  'quests.json',
  'monthly_events.json',
  'port_flavors.json',
  'discoveries.json',
  'ledger_seals.json',
  'asset_manifest.json',
  'game_constants.json',
  'progression.json',
  'map_layers.json'
];

function readJson(file) {
  const fullPath = path.join(dataDir, file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing data file: ${file}`);
  }
  try {
    return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  } catch (error) {
    throw new Error(`Invalid JSON in ${file}: ${error.message}`);
  }
}

const data = Object.fromEntries(requiredFiles.map((file) => [file, readJson(file)]));

function assertArray(file) {
  if (!Array.isArray(data[file])) {
    throw new Error(`${file} must be an array`);
  }
}

for (const file of [
  'ports.json',
  'goods.json',
  'ships.json',
  'carts.json',
  'tools.json',
  'companions.json',
  'routes.json',
  'events.json',
  'quests.json',
  'monthly_events.json',
  'port_flavors.json',
  'discoveries.json',
  'ledger_seals.json',
  'asset_manifest.json',
  'progression.json'
]) {
  assertArray(file);
}

const ids = (file) => new Set(data[file].map((item) => item.id));
const portIds = ids('ports.json');
const goodIds = ids('goods.json');
const shipIds = ids('ships.json');
const cartIds = ids('carts.json');
const routeIds = ids('routes.json');
const toolIds = ids('tools.json');
const companionIds = ids('companions.json');

function ensureUnique(file) {
  const seen = new Set();
  for (const item of data[file]) {
    if (!item.id && file !== 'monthly_events.json') {
      throw new Error(`${file} contains an item without id`);
    }
    if (item.id) {
      if (seen.has(item.id)) throw new Error(`${file} has duplicate id: ${item.id}`);
      seen.add(item.id);
    }
  }
}

for (const file of ['ports.json', 'goods.json', 'ships.json', 'carts.json', 'tools.json', 'companions.json', 'routes.json', 'events.json', 'quests.json', 'port_flavors.json', 'discoveries.json', 'ledger_seals.json', 'asset_manifest.json', 'progression.json']) {
  ensureUnique(file);
}

for (const port of data['ports.json']) {
  if (!port.map || typeof port.map.x !== 'number' || typeof port.map.y !== 'number') {
    throw new Error(`Port ${port.id} is missing normalized map coordinates`);
  }
  if (port.map.x < 0 || port.map.x > 100 || port.map.y < 0 || port.map.y > 100) {
    throw new Error(`Port ${port.id} map coordinates must be within 0..100`);
  }
  if (port.map.labelSide && !['top', 'right', 'bottom', 'left'].includes(port.map.labelSide)) {
    throw new Error(`Port ${port.id} has invalid map.labelSide: ${port.map.labelSide}`);
  }
  if (port.geo) {
    if (typeof port.geo.lat !== 'number' || typeof port.geo.lon !== 'number') {
      throw new Error(`Port ${port.id} geo coordinates must be numeric lat/lon`);
    }
    if (port.geo.lat < 30 || port.geo.lat > 45 || port.geo.lon < 120 || port.geo.lon > 135) {
      throw new Error(`Port ${port.id} geo coordinates are outside the Korea map validation bounds`);
    }
  }
  for (const goodId of [...(port.produces ?? []), ...(port.demands ?? [])]) {
    if (!goodIds.has(goodId)) throw new Error(`Port ${port.id} references unknown good: ${goodId}`);
  }
}

const mapLayers = data['map_layers.json'];
if (mapLayers.abstractMapSize?.width !== 100 || mapLayers.abstractMapSize?.height !== 100) {
  throw new Error('map_layers.json abstractMapSize must be 100x100 to match normalized route rendering');
}
if (mapLayers.coordinateSystem?.units !== 'normalized-percent') {
  throw new Error('map_layers.json coordinateSystem.units must be normalized-percent');
}

for (const route of data['routes.json']) {
  if (!portIds.has(route.from)) throw new Error(`Route ${route.id} has unknown from port: ${route.from}`);
  if (!portIds.has(route.to)) throw new Error(`Route ${route.id} has unknown to port: ${route.to}`);
}

for (const flavor of data['port_flavors.json']) {
  if (!portIds.has(flavor.id)) throw new Error(`port_flavors.json references unknown port: ${flavor.id}`);
  for (const goodId of [...(flavor.goods ?? []), ...(flavor.marketSlots ?? []), ...Object.keys(flavor.stallPositions ?? {})]) {
    if (!goodIds.has(goodId)) throw new Error(`Port flavor ${flavor.id} references unknown good: ${goodId}`);
  }
}

for (const discovery of data['discoveries.json']) {
  if (!portIds.has(discovery.portId)) throw new Error(`Discovery ${discovery.id} references unknown port: ${discovery.portId}`);
}
for (const portId of portIds) {
  if (!data['discoveries.json'].some((discovery) => discovery.portId === portId)) throw new Error(`Missing discovery for port: ${portId}`);
}

for (const seal of data['ledger_seals.json']) {
  for (const requirement of seal.requirements ?? []) {
    for (const portId of requirement.portIds ?? []) {
      if (!portIds.has(portId)) throw new Error(`Ledger seal ${seal.id} references unknown port: ${portId}`);
    }
    for (const goodId of requirement.goodIds ?? []) {
      if (!goodIds.has(goodId)) throw new Error(`Ledger seal ${seal.id} references unknown good: ${goodId}`);
    }
    if (requirement.shipId && !shipIds.has(requirement.shipId)) throw new Error(`Ledger seal ${seal.id} references unknown ship: ${requirement.shipId}`);
    if (requirement.toolId && !toolIds.has(requirement.toolId)) throw new Error(`Ledger seal ${seal.id} references unknown tool: ${requirement.toolId}`);
  }
}

const constants = data['game_constants.json'];
const startingState = constants.startingState;
if (!startingState) throw new Error('game_constants.json missing startingState');
if (!portIds.has(startingState.currentPortId ?? startingState.portId)) throw new Error(`startingState has unknown currentPortId: ${startingState.currentPortId ?? startingState.portId}`);
if (!shipIds.has(startingState.shipId)) throw new Error(`startingState has unknown shipId: ${startingState.shipId}`);
if (!cartIds.has(startingState.cartId)) throw new Error(`startingState has unknown cartId: ${startingState.cartId}`);

const months = new Set(data['monthly_events.json'].map((event) => event.month));
for (let month = 1; month <= 12; month += 1) {
  if (!months.has(month)) throw new Error(`monthly_events.json missing month: ${month}`);
}

console.log(`Validated ${requiredFiles.length} data files.`);
console.log(`Ports: ${portIds.size}, Goods: ${goodIds.size}, Routes: ${routeIds.size}, Tools: ${toolIds.size}, Companions: ${companionIds.size}`);
