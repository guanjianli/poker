"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("underscore");
var UsersPool = /** @class */ (function () {
    function UsersPool() {
        this.personList = [];
    }
    Object.defineProperty(UsersPool, "instance", {
        get: function () {
            if (!this._instance) {
                this._instance = new UsersPool();
            }
            return this._instance;
        },
        enumerable: true,
        configurable: true
    });
    UsersPool.prototype.addPerson = function (user) {
        this.personList.push(user);
        console.log(user.id);
    };
    UsersPool.prototype.removePerson = function (id) {
        this.personList = _.reject(this.personList, function (item) {
            return item.id == id;
        });
    };
    //获得当前空闲的人
    UsersPool.prototype.getFreePerson = function () {
        _.filter(this.personList, function (item) {
            return item.isPlaying == false;
        });
    };
    return UsersPool;
}());
exports.default = UsersPool;
