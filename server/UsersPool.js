"use strict";
var poker;
(function (poker) {
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
        };
        UsersPool.prototype.removePerson = function (id) {
            this.personList = _.reject(this.personList, function (item) {
                return item.id == id;
            });
        };
        return UsersPool;
    }());
    poker.UsersPool = UsersPool;
})(poker || (poker = {}));
