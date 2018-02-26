"use strict";
var User = /** @class */ (function () {
    function User(obj) {
        this.name = obj.name;
        this.lv = obj.lv;
        this.id = obj.id;
    }
    //加入一个桌子
    User.prototype.joinDesk = function () {
    };
    //离开当前桌子
    User.prototype.leaveDesk = function () {
    };
    //准备
    User.prototype.readyToPlay = function () { };
    //从准备状态到取消准备
    User.prototype.escToPlay = function () {
    };
    return User;
}());
