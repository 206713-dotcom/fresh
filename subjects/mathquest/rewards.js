import {gearSellValue, itemById, slotBuff} from './game-items.js';
import {authorizeRandomCrate, MAX_PYCOINS} from './shared/gear-crates.js';

export const emptyWallet = () => ({coins:0, bonusXp:0, owned:[], gearCounts:{}, equipped:{}, claimed:[]});

export const rates = {lesson:10, quest:20, igcse:3, checkpoint:15, team:15};
const coinSlots = {lesson:'body', quest:'back', checkpoint:'aura', team:'hands'};

export function award(wallet, type, id) {
  const token = type + ':' + id;
  if (wallet.claimed.includes(token)) return 0;
  const value = Math.round(rates[type] * (1 + slotBuff(wallet.equipped, coinSlots[type]) / 100));
  wallet.coins += value;
  wallet.claimed.push(token);
  const xp = {lesson:50, quest:120}[type] ?? 0;
  wallet.bonusXp += Math.round(xp * slotBuff(wallet.equipped, 'legs') / 100);
  return value;
}

export function randomInt(max) {
  const limit = 2 ** 32 - (2 ** 32 % max);
  const draw = new Uint32Array(1);
  do { crypto.getRandomValues(draw); } while (draw[0] >= limit);
  return draw[0] % max;
}

export function openCrate(wallet, crate) {
  const result = authorizeRandomCrate(wallet, crate, randomInt);
  wallet.coins = result.coins;
  wallet.owned = result.owned;
  wallet.gearCounts = result.gearCounts;
  return result.item;
}

export function sellGear(wallet, id) {
  const item = itemById(id);
  const count = wallet.gearCounts[id];
  if (!item || !count) throw new Error('You don’t own a copy of this item.');
  const value = gearSellValue(item);
  if (wallet.coins + value > MAX_PYCOINS) throw new Error('Spend some GIS Points before selling this item.');
  wallet.coins += value;
  if (count > 1) {
    wallet.gearCounts[id] = count - 1;
  } else {
    delete wallet.gearCounts[id];
    wallet.owned = wallet.owned.filter(ownedId => ownedId !== id);
    if (wallet.equipped[item.slot] === id) delete wallet.equipped[item.slot];
  }
  return value;
}
