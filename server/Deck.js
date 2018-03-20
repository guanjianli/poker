"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Chair_1 = require("./Chair");
var Desk = /** @class */ (function () {
    function Desk() {
        this.chairs = [];
        for (var i = 0; i < 4; i++) {
            this.chairs.push(new Chair_1.Chair());
        }
    }
    return Desk;
}());
exports.Desk = Desk;
