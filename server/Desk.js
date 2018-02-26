"use strict";
var poker;
(function (poker) {
    var Desk = /** @class */ (function () {
        function Desk() {
            this.chairs = [];
            for (var i = 0; i < 4; i++) {
                this.chairs.push(new poker.Chair());
            }
        }
        return Desk;
    }());
    poker.Desk = Desk;
})(poker || (poker = {}));
