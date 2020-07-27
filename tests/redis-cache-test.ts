import { RedisCache } from "../src/utils/redis.cache";
import { expect } from 'chai';

describe('Tests Redis cache', function () {

    it('cache write and read', async () => {
        let cache:RedisCache = new RedisCache();
        await cache.add("123", "test");

        let v = await cache.get("123");
        expect(v).to.equal("test");
        console.log(v);
    });
});