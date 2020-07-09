export class LoggedInUser{
    userName:string|null;
    id:number;
    store:number|undefined;
    loggedSince: Date;

    constructor(userName:string|null, id:number, store:number|undefined){
        this.userName = userName;
        this.id = id;
        this.store = store;
        this.loggedSince = new Date();
    }
}