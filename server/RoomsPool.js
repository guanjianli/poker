"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("underscore");
var RoomsPool = /** @class */ (function () {
    function RoomsPool() {
        this.roomList = [];
    }
    Object.defineProperty(RoomsPool, "instance", {
        get: function () {
            if (!this._instance) {
                this._instance = new RoomsPool();
            }
            return this._instance;
        },
        enumerable: true,
        configurable: true
    });
    RoomsPool.prototype.addRoom = function (room) {
        this.roomList.push(room);
        console.log("room id -> " + room.id);
    };
    RoomsPool.prototype.destroyRoom = function (id) {
        this.roomList = _.reject(this.roomList, function (item) {
            return item.id == id;
        });
    };
    //获得当前空闲的房间
    RoomsPool.prototype.getNoFullRoom = function () {
        _.filter(this.roomList, function (item) {
            return item.isFull == false;
        });
    };
    return RoomsPool;
}());
exports.default = RoomsPool;
