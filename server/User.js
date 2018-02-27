"use strict";
var User = /** @class */ (function () {
    function User() {
        this.id = 0;
        this.name = "";
        this.lv = 0;
    }
    //加入一个桌子
    User.prototype.joinDesk = function () {
    };
    //离开当前桌子
    User.prototype.leaveDesk = function () {
    };
    //准备
    User.prototype.readyToPlay = function () {
    };
    //从准备状态到取消准备
    User.prototype.escToPlay = function () {
    };
    return User;
}());
module.exports = { User: User };
