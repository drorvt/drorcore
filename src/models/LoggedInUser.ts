export class LoggedInUser{
    userName:string|null;
    id:number;
    loggedSince: Date;

    constructor(userName:string|null, id:number){
        this.userName = userName;
        this.id = id;
        this.loggedSince = new Date();
    }
}