import Redis from 'ioredis';
import { env } from '../config/env';

const client = env.REDIS_URL ? new Redis(env.REDIS_URL) : null;

export const cache = {
  get: async <T>(key: string): Promise<T | null> => {
    if (!client) {
      return null;
    }
    const value = await client.get(key);
    return value ? (JSON.parse(value) as T) : null;
  },
  set: async (key: string, value: unknown, ttlSeconds: number) => {
    if (!client) {
      return;
    }
    await client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  },
  del: async (key: string) => {
    if (!client) {
      return;
    }
    await client.del(key);
  },
  invalidateByPrefix: async (prefix: string) => {
    if (!client) {
      return;
    }
    const stream = client.scanStream({ match: `${prefix}*`, count: 100 });
    stream.on('data', (keys: string[]) => {
      if (keys.length) {
        client.del(keys).catch(() => undefined);
      }
    });
  }
};
