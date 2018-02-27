"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("underscore");
var Test = /** @class */ (function () {
    function Test() {
        this.id = 0;
        this.name = "";
        this.lv = 0;
    }
    //加入一个桌子
    Test.prototype.joinDesk = function () {
    };
    //离开当前桌子
    Test.prototype.leaveDesk = function () {
    };
    //准备
    Test.prototype.readyToPlay = function () {
    };
    //从准备状态到取消准备
    Test.prototype.escToPlay = function () {
    };
    Test.prototype.test = function () {
        console.log(_.random(10, 20));
    };
    return Test;
}());
exports.default = Test;
