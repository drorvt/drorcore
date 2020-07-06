import {ProductManager} from "../src/services/ProductManager";
console.log('start');
let pm:ProductManager  = new ProductManager();

setTimeout(() => {pm.addTest().then(() => {
    console.log('ok!');
}).catch((e) => {
    console.log(e);
});}, 1000);
