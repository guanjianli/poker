"use strict";
var Desk = /** @class */ (function () {
    function Desk() {
        this.chairs = [];
        for (var i = 0; i < 4; i++) {
            this.chairs.push(new Chair());
        }
    }
    return Desk;
}());
