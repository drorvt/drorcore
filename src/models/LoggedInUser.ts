export class LoggedInUser{
    userName:string;
    id:number;
    loggedSince: Date;

    constructor(userName:string, id:number){
        this.userName = userName;
        this.id = id;
        this.loggedSince = new Date();
    }
}