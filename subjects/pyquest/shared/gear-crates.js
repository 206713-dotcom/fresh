// Cosmetic crate and resale rules. The caller supplies the random draw.
import {CRATES,ITEMS,RARITIES,itemById} from '../game-items.js';

const weights = new Map(RARITIES.map(r => [r.id, Math.round(r.chance * 100)]));
const resalePercent = {common: 25, uncommon: 35, rare: 50, legendary: 65, mythic: 75, secret: 85};
const walletLimit = 1_000_000;

export function gearQuantities(wallet) {
  const quantities = {};
  const owned = Array.isArray(wallet?.owned) ? wallet.owned : [];
  for (const id of owned) {
    if (!itemById(id)) continue;
    const quantity = wallet.quantities?.[id];
    quantities[id] = Number.isSafeInteger(quantity) && quantity > 0 ? quantity : 1;
  }
  return quantities;
}

export function gearResalePrice(item) {
  const crate = CRATES.find(crate => crate.slot === item.slot);
  return Math.floor(crate.cost * resalePercent[item.rarity] / 100);
}

export function crateOdds(crateId, owned = []) {
  const crate = CRATES.find(c => c.id === crateId);
  if (!crate) return null;
  const ownedSet = new Set(owned);
  const pool = ITEMS.filter(x => x.crate === crate.id && !ownedSet.has(x.id))
    .map(item => ({item, weight: weights.get(item.rarity)}));
  const totalWeight = pool.reduce((sum, x) => sum + x.weight, 0);
  return {crate, pool, totalWeight};
}

function validateWallet(wallet) {
  if (!wallet || !Number.isSafeInteger(wallet.coins) || wallet.coins < 0 || wallet.coins > walletLimit)
    throw Object.assign(Error('Your PyCoin wallet needs administrator review.'), {status:409});
  if (!Array.isArray(wallet.owned) || wallet.owned.length > 150 ||
      wallet.owned.some(id => typeof id !== 'string'))
    throw Object.assign(Error('Your collection needs administrator review.'), {status:409});
}

// The browser-local collection keeps copies. The school server's wallet still uses distinct items.
export function authorizeRandomCrate(wallet, crateId, rollInt, {duplicates = false} = {}) {
  if (typeof crateId !== 'string' || !/^[a-z]+$/.test(crateId))
    throw Object.assign(Error('Unknown crate.'), {status:400});
  validateWallet(wallet);
  const odds = crateOdds(crateId, duplicates ? [] : wallet.owned);
  if (!odds) throw Object.assign(Error('Unknown crate.'), {status:400});
  if (!odds.pool.length)
    throw Object.assign(Error('You already own every cosmetic in this crate.'), {status:409});
  if (wallet.coins < odds.crate.cost)
    throw Object.assign(Error(`You need ${odds.crate.cost-wallet.coins} more GIS Points to open this crate.`), {status:400});
  const roll = rollInt(odds.totalWeight);
  if (!Number.isInteger(roll) || roll < 0 || roll >= odds.totalWeight)
    throw Error('Invalid server random draw.');
  let cutoff = 0;
  const result = odds.pool.find(x => (cutoff += x.weight) > roll);
  if (!result) throw Error('Random draw failed.');
  const item = result.item;
  const opening = {item, spent: odds.crate.cost, coins: wallet.coins - odds.crate.cost};
  if (!duplicates) return {...opening, owned: [...wallet.owned, item.id]};

  const quantities = gearQuantities(wallet);
  const quantity = (quantities[item.id] ?? 0) + 1;
  if (!Number.isSafeInteger(quantity)) throw Error('Sell a copy of this gear before collecting another.');
  quantities[item.id] = quantity;
  return {...opening, owned: Object.keys(quantities), quantities, quantity};
}

export function authorizeGearSale(wallet, id) {
  validateWallet(wallet);
  const item = itemById(id);
  const quantities = gearQuantities(wallet);
  if (!item || !quantities[id]) throw Error('Choose an item from your collection.');

  const soldFor = gearResalePrice(item);
  const coins = wallet.coins + soldFor;
  if (coins > walletLimit) throw Error('Spend some GIS Points before selling gear. Your wallet holds up to 1,000,000.');

  const equipped = {...wallet.equipped};
  quantities[id]--;
  if (quantities[id] === 0) {
    delete quantities[id];
    if (equipped[item.slot] === id) delete equipped[item.slot];
  }
  return {item, soldFor, coins, owned: Object.keys(quantities), quantities, equipped};
}
