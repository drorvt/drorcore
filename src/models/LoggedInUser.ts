import { Shop } from './Shop';

export class LoggedInUser {
    userName: string | null;
    id: number;
    shop: Shop | undefined;
    loggedSince: Date;
    roles: Array<string> = ['read'];

    constructor(userName: string | null, id: number) {
        this.userName = userName;
        this.id = id;
        this.loggedSince = new Date();
    }
}
