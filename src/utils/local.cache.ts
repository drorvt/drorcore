export class LocalCache implements ICache{
     map:any = {};

    public add(key:string, value:any):void {
        this.map[key] = value;
    }

    public get(key:string):any{
        return this.map[key];
    }
}
