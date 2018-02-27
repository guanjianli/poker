"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var Test_1 = __importDefault(require("./Test"));
// for (var i = 0; i < 4; i++) {
// 	let user = new User();
// 	user.name = "test" + i;
// 	user.id = 1000 + i;
// 	user.lv = Math.random() * 100 >> 0;
// 	UsersPool.instance.addPerson(user);
// }
var user = new Test_1.default();
user.test();
