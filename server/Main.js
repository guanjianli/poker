"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var User_1 = __importDefault(require("./User"));
var UsersPool_1 = __importDefault(require("./UsersPool"));
var Room_1 = __importDefault(require("./Room"));
var RoomsPool_1 = __importDefault(require("./RoomsPool"));
for (var i = 0; i < 10; i++) {
    var user = new User_1.default();
    user.name = "test" + i;
    user.id = 1000 + i;
    user.lv = Math.random() * 100 >> 0;
    UsersPool_1.default.instance.addPerson(user);
}
//从用户池中拿到几个用户
//todo 匹配规则
//创建一个房间
var room = new Room_1.default();
//将这个房间加到可匹配的房间列表
RoomsPool_1.default.instance.addRoom(room);
