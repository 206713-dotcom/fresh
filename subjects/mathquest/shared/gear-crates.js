// Shared cosmetic crate rules. The caller supplies the random draw.
// Every opening awards one copy using the original rarity probabilities.
import {CRATES,ITEMS,RARITIES} from '../game-items.js';

export const MAX_PYCOINS = 1_000_000;
const weights = new Map(RARITIES.map(r => [r.id, Math.round(r.chance * 100)]));
export function crateOdds(crateId) {
  const crate = CRATES.find(c => c.id === crateId);
  if (!crate) return null;
  const pool = ITEMS.filter(x => x.crate === crate.id)
    .map(item => ({item, weight: weights.get(item.rarity)}));
  const totalWeight = pool.reduce((sum, x) => sum + x.weight, 0);
  return {crate, pool, totalWeight};
}

// The local wallet calls this before saving the draw.
export function authorizeRandomCrate(wallet, crateId, rollInt) {
  if (typeof crateId !== 'string' || !/^[a-z]+$/.test(crateId))
    throw Object.assign(Error('Unknown crate.'), {status:400});
  if (!wallet || !Number.isSafeInteger(wallet.coins) || wallet.coins < 0 || wallet.coins > MAX_PYCOINS)
    throw Object.assign(Error('Your PyCoin wallet needs administrator review.'), {status:409});
  if (!Array.isArray(wallet.owned) || wallet.owned.length > 150 ||
      wallet.owned.some(id => typeof id !== 'string'))
    throw Object.assign(Error('Your collection needs administrator review.'), {status:409});
  const odds = crateOdds(crateId);
  if (!odds) throw Object.assign(Error('Unknown crate.'), {status:400});
  if (wallet.coins < odds.crate.cost)
    throw Object.assign(Error(`You need ${odds.crate.cost-wallet.coins} more GIS Points to open this crate.`), {status:400});
  const roll = rollInt(odds.totalWeight);
  if (!Number.isInteger(roll) || roll < 0 || roll >= odds.totalWeight)
    throw Error('Invalid random draw.');
  let cutoff = 0;
  const result = odds.pool.find(x => (cutoff += x.weight) > roll);
  if (!result) throw Error('Random draw failed.');
  const gearCounts = Object.fromEntries(wallet.owned.map(id => [id, wallet.gearCounts?.[id] ?? 1]));
  const count = (gearCounts[result.item.id] ?? 0) + 1;
  if (!Number.isSafeInteger(count)) throw Error('Your collection cannot hold another copy of this item.');
  gearCounts[result.item.id] = count;
  return {
    item: result.item,
    spent: odds.crate.cost,
    coins: wallet.coins - odds.crate.cost,
    owned: Object.keys(gearCounts),
    gearCounts
  };
}
