import "reflect-metadata";
import {createConnection, getConnection} from "typeorm";
import {Test} from "../models/Test";

export class ProductManager{

    constructor(){

    }

    // async addTest(){
    //     await getConnection()
    //     .createQueryBuilder()
    //     .insert()
    //     .into(Test)
    //     .values([
    //         { name: "shlomo", city: "Netanya" }, 
    //         { age: 40}
    //      ])
    //     .execute();
    // }

    async addTest(){
        // let con = getConnection();
        let test:Test = new Test();
        test.age = 22;
        test.city = 'Netania';
        test.name = 'shlomo';
        await getConnection().manager.save(test);
        // let qb = con.createQueryBuilder();
        // let i = qb.insert();
        // let inn = i.into(Test);
        // let v = inn.values([
        //     { name: "shlomo", city: "Netanya" }, 
        //     { age: 40}
        //  ])
        // .execute();
    }    
}