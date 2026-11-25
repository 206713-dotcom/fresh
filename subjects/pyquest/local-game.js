import {checkpointQuestions, itemById} from './game-items.js';
import {readLocal, mutateLocal, onLocalChange, localRoomsFor} from './local-preview.js';
import {calculateRewards, eligibleClaims, emptyWallet} from './shared/pycoin-logic.js';
import {authorizeRandomCrate, authorizeGearSale} from './shared/gear-crates.js';

export const localGameKey = uid => 'game:' + uid;
const emptyGame = () => ({wallet: emptyWallet(), passedCheckpoints: []});

export function readLocalGame(uid) {
  return readLocal(localGameKey(uid), emptyGame());
}

export function watchLocalGame(uid, onChange) {
  return onLocalChange(localGameKey(uid), onChange);
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
  return mutateLocal(localGameKey(uid), emptyGame(), game => applyRewards(game, uid, progress()));
}

export function passLocalCheckpoint(uid, group, answers, progress) {
  const questions = checkpointQuestions(group);
  if (questions.filter((question, index) => question.correct === answers[index]).length < 6) {
    throw Error('Score at least 6/8 to unlock the next group.');
  }
  return mutateLocal(localGameKey(uid), emptyGame(), game => {
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
  return mutateLocal(localGameKey(uid), emptyGame(), game => {
    const {item, spent, coins, owned, quantities, quantity} = authorizeRandomCrate(
      game.wallet, crateId, randomInt, {duplicates: true}
    );
    Object.assign(game.wallet, {coins, owned, quantities});
    return {item, spent, coins, crateId, quantity};
  });
}

export function sellLocalGear(uid, id) {
  return mutateLocal(localGameKey(uid), emptyGame(), ({wallet}) => {
    const {item, soldFor, coins, owned, quantities, equipped} = authorizeGearSale(wallet, id);
    Object.assign(wallet, {coins, owned, quantities, equipped});
    return {item, soldFor, remaining: quantities[id] ?? 0};
  });
}

export function equipLocalItem(uid, id) {
  const item = itemById(id);
  return mutateLocal(localGameKey(uid), emptyGame(), ({wallet}) => {
    if (!wallet.owned.includes(id)) throw Error('Open this item first.');
    wallet.equipped[item.slot] = item.id;
  });
}

export function removeLocalEquipment(uid, slot) {
  return mutateLocal(localGameKey(uid), emptyGame(), ({wallet}) => {
    delete wallet.equipped[slot];
  });
}
