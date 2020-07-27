import { RedisCache } from "./redis.cache";
import { LocalCache } from "./local.cache";

class PDQCache implements ICache{
    private localCache:ICache = new LocalCache();
    private redisCache:ICache = new RedisCache();

   public add(key:string, value:any):void {
    let cacheObj = JSON.stringify(value);
    this.localCache.add(key, value);
    this.redisCache.add(key, cacheObj);
   }

   public async get(key:string):Promise<any>{
       let val = this.localCache.get(key);
       if (!val){
            let cacheObj = await this.redisCache.get(key);
           if (cacheObj){
               val = JSON.parse(cacheObj);
                this.localCache.add(key, val);
           }
       }
       return val;
   }
}

export const cache:ICache = new PDQCache();