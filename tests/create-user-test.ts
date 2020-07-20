const expect = require("chai").expect;
import { initDB, buildDemoDB } from './my-test';
import { createConnection } from 'typeorm';
import { User } from "../src/models/User";
import {createUser, findUser} from '../src/services/user.service';
import { assert } from 'chai';

describe('Create User', function() {
    it('Checks that password is hashed', async () => {
        await initDB();

        await createConnection({
            type: "sqlite",
            database: ":memory:",
            dropSchema: true,
            entities: ["../src/models/**/*.js", "src/models/*.js"],
            synchronize: true,
            logging: false
        });
        await buildDemoDB();

        let user:User|undefined = new User();
        user.email = "test@chai.com";
        user.isAdmin = true;
        user.password = "xxx";
        await createUser(user);

        user = await findUser('test@chai.com');
        expect(user?.password?.length).to.be.above(3);
    });

  });