"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
var _ = __importStar(require("underscore"));
var User = poker.User;
var UsersPool = poker.UsersPool;
//import UsersPool = poker.UsersPool;
var Main = /** @class */ (function () {
    function Main() {
        _;
        //初始创建四个用户
        for (var i = 0; i < 4; i++) {
            var user = new User();
            user.name = "test" + i;
            user.id = 1000 + i;
            user.lv = Math.random() * 100 >> 0;
            UsersPool.instance.addPerson(user);
        }
    }
    return Main;
}());
new Main();
