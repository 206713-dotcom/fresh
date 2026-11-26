import {checkpointQuestions, itemById} from './game-items.js';
import {readLocal, localRecordKey, onLocalChange, localRoomsFor} from './local-preview.js';
import {calculateRewards, eligibleClaims, emptyWallet} from './shared/pycoin-logic.js?v=balanced';
import {authorizeRandomCrate, authorizeGearSale} from './shared/gear-crates.js';

export const localGameKey = uid => 'game:' + uid;
const emptyGame = () => ({wallet: emptyWallet(), passedCheckpoints: []});

export function readLocalGame(uid) {
  const game = readLocal(localGameKey(uid), emptyGame());
  game.wallet.coins = window.FreshPoints.balance();
  return game;
}

export function watchLocalGame(uid, onChange) {
  const stop = onLocalChange(localGameKey(uid), onChange);
  const listen = event => {
    if (event.key === window.FreshPoints.key) onChange();
  };
  window.addEventListener('storage', listen);
  return () => {
    stop();
    window.removeEventListener('storage', listen);
  };
}

function mutateGame(uid, mutate, label) {
  const gameKey = localRecordKey(localGameKey(uid));
  const apply = () => window.FreshPoints.transaction('PyQuest', points => {
    const game = readLocalGame(uid);
    const balance = points.balance();
    game.wallet.coins = balance;
    const output = mutate(game);
    const delta = game.wallet.coins - balance;
    if (delta && !points.adjust(delta, label ?? (delta > 0 ? 'Study reward' : 'Gear purchase'))) {
      throw new Error('The shared GIS Points balance could not be updated.');
    }
    delete game.wallet.coins;
    points.write(gameKey, game);
    return output;
  });
  return navigator.locks ? navigator.locks.request(gameKey, apply) : apply();
}

function applyRewards(game, uid, progress) {
  const passed = game.passedCheckpoints.map(group => 'g' + group);
  const rooms = localRoomsFor(uid).filter(room => room.status === 'done' && room.members.length === 2);
  const eligible = eligibleClaims(progress, passed, rooms.map(room => room.id));
  const {coins, added, bonusXp, newClaims, breakdown, claimed} = calculateRewards(game.wallet, eligible);
  if (newClaims) Object.assign(game.wallet, {coins, bonusXp, claimed});
  return {coins, added, newClaims, breakdown};
}

export function syncLocalRewards(uid, progress) {
  return mutateGame(uid, game => applyRewards(game, uid, progress()));
}

export function passLocalCheckpoint(uid, group, answers, progress) {
  const questions = checkpointQuestions(group);
  if (questions.filter((question, index) => question.correct === answers[index]).length < 6) {
    throw Error('Score at least 6/8 to unlock the next group.');
  }
  return mutateGame(uid, game => {
    if (game.passedCheckpoints.includes(group)) return {coinsAwarded: false, alreadyPassed: true};
    game.passedCheckpoints.push(group);
    const rewards = applyRewards(game, uid, progress());
    return {coinsAwarded: rewards.breakdown.checkpoint > 0, alreadyPassed: false};
  });
}

function randomInt(max) {
  const limit = 2 ** 32 - (2 ** 32 % max);
  const bytes = new Uint32Array(1);
  do {
    crypto.getRandomValues(bytes);
  } while (bytes[0] >= limit);
  return bytes[0] % max;
}

export function openLocalCrate(uid, crateId) {
  return mutateGame(uid, game => {
    const {item, spent, coins, owned, quantities, quantity} = authorizeRandomCrate(
      game.wallet, crateId, randomInt, {duplicates: true}
    );
    Object.assign(game.wallet, {coins, owned, quantities});
    return {item, spent, coins, crateId, quantity};
  });
}

export function sellLocalGear(uid, id) {
  return mutateGame(uid, ({wallet}) => {
    const {item, soldFor, coins, owned, quantities, equipped} = authorizeGearSale(wallet, id);
    Object.assign(wallet, {coins, owned, quantities, equipped});
    return {item, soldFor, remaining: quantities[id] ?? 0};
  }, 'Gear sold');
}

export function equipLocalItem(uid, id) {
  const item = itemById(id);
  return mutateGame(uid, ({wallet}) => {
    if (!wallet.owned.includes(id)) throw Error('Open this item first.');
    wallet.equipped[item.slot] = item.id;
  });
}

export function removeLocalEquipment(uid, slot) {
  return mutateGame(uid, ({wallet}) => {
    delete wallet.equipped[slot];
  });
}
