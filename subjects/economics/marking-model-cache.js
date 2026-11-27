const modelPath = 'https://raw.githubusercontent.com/206713-dotcom/fresh/8717a83cc4fa19ab8cff01ffee55a1034020f6c2/ecbiz-model/';
export const modelCacheName = 'ecbiz-economics-qwen-v1';

// Checksums from SHA256SUMS at the pinned model revision.
const hashes = [
  '1ad1fd631e7039597daa6ff6f7f2e74333660b40ae8d450d1826f1c7dfb6623e',
  '8909288bd26acee342801565086daaf8f27505f47547b20f9d286bad2fac1d0f',
  '10f889a706d3d3722dd6cad14229e9fb472610130d88ffb30365b1d691a5a802',
  '3b7425bf3d9a1d44c25380353e81c119f50bbd22ab99ede5164aed7666cfc33a',
  '938f1e1f853621bb762a18b057d54404025febedc6f7ef0e1491a26b2276df5b',
  '30b3b38d0fc6a48e6c8a499acc6414c3d04e5ae679e69478e8f40a090769c9a9',
  '6fc766e50a6898ad47f186ef3991faf5c1241eaba7489e073a77ce918617e51c',
  'b4d794b45a4896ac903dce6f131371ad33bb8c1cb6ab7bef0c4f34598cba2241',
  'a64634da7f44ffb3fb3881e5360223272670a78183778ef37761eab917406588',
  '2db986340b9b0961aab74b2a835280af652743e0e8f3b1d6b15709ca25da30ba',
  'a9aab8116e2def0c99e1d28b946c3f794ef00a6e98de90928fb410b2415b1a0d'
];

export const modelParts = hashes.map((hash, index) => ({
  hash, url: modelPath + 'model.part-' + String(index).padStart(2, '0')
}));

export async function hasCachedEconomicsModel() {
  try {
    const storage = globalThis.caches;
    if (!storage || !await storage.has(modelCacheName)) return false;
    const cache = await storage.open(modelCacheName);
    const urls = new Set((await cache.keys()).map(request => request.url));
    return modelParts.every(({url}) => urls.has(url));
  } catch {
    return false;
  }
}
