"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Chair = /** @class */ (function () {
    function Chair() {
        this.status = Chair.Free;
    }
    Chair.prototype.sitDown = function (user) {
        this.user = user;
    };
    Chair.prototype.sitUp = function () {
        this.user = null;
    };
    Chair.Free = "free";
    Chair.Busy = "busy";
    return Chair;
}());
exports.Chair = Chair;
