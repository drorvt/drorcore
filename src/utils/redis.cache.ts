import { RedisClient, createClient } from "redis";
import { globals } from "../utils/globals";
import { logger } from './logger';

export class RedisCache implements ICache{
    private redis:RedisClient;

    constructor(){
        this.redis = createClient(globals.redis);
        this.redis.on('error', (err:any) => {
            logger.error(err);
        });
    }

   public async add(key:string, value:any):Promise<any> {
       return new Promise((resolve, reject) => {
        this.redis.set(key, value, (err, val) => {
            if (err){
                return reject(err);
            }
            return resolve(val);
        });
       });
       
   }

   public async get(key:string):Promise<any>{
        let p:Promise<any> = new Promise((resolve, reject) => {
            this.redis.get(key, (err, val) => {
                if (err){
                    return reject(err);
                }
                return resolve(val);
            });
        });
        return p;
    }

}
