import NodeCache from 'node-cache';
import { config } from '../config/env';

class CacheService {
    private cache: NodeCache;

    constructor(ttlSeconds: number) {
        this.cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false });
    }

    public get<T>(key: string): T | undefined {
        const item = this.cache.get<T>(key);
        if (item) {
            console.log(`[CACHE HIT] ${key}`);
        } else {
            console.log(`[CACHE MISS] ${key}`);
        }
        return item;
    }

    public set<T>(key: string, value: T, ttl?: number): boolean {
        if (ttl !== undefined) {
            return this.cache.set(key, value, ttl);
        }
        return this.cache.set(key, value);
    }

    public clean() {
        this.cache.flushAll();
    }
}

export const cacheService = new CacheService(config.cacheTTL);
