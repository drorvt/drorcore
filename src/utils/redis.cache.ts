import { RedisClient, createClient } from "redis";
import { globals } from "../utils/globals";
import { logger } from './logger';

export class RedisCache implements ICache {
    private redis: RedisClient;
    private connected: boolean = false;

    constructor() {
        this.redis = createClient(globals.redis);
        this.redis.on('error', (err: any) => {
            logger.error(err);
        });
    }

    public async ping(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.redis.on('error', (err:any) => {
                logger.error(err);
                return reject(err);
            });
            this.redis.ping((err, res) => {
                if (err) {
                    return reject(err);
                } else {
                    this.connected = true;
                    return resolve(true);
                }
            });
        });
    }

    public async add(key: string, value: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.redis.set(key, value, (err, val) => {
                if (err) {
                    return reject(err);
                } else {
                    this.connected = true;
                }
                return resolve(val);
            });
        });

    }

    public async get(key: string): Promise<any> {
        let p: Promise<any> = new Promise((resolve, reject) => {
            this.redis.get(key, (err, val) => {
                if (err) {
                    return reject(err);
                } else {
                    this.connected = true;
                }
                return resolve(val);
            });
        });
        return p;
    }

    public isConnected():boolean{
        return this.connected;
    }

}
