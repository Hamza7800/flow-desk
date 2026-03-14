import { createCache } from "cache-manager";
import { Keyv } from "keyv";
import { KeyvCacheableMemory } from "cacheable";

const store = new KeyvCacheableMemory({
  ttl: 100 * 60 * 2,
  lruSize: 500,
});

const keyv = new Keyv({ store });

export const appCache = createCache({
  stores: [keyv],
  ttl: 1000 * 60 * 2,
  refreshThreshold: 1000 * 30,
});

export const cacheWrap = <T>(
  key: string,
  fn: () => Promise<T>,
  ttl?: number,
): Promise<T> => appCache.wrap(key, fn, ttl);

export const cacheDel = (...keys: string[]) =>
  Promise.all(keys.map((k) => appCache.del(k)));
