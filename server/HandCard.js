"use strict";
var HandCard = /** @class */ (function () {
    function HandCard() {
    }
    HandCard.prototype.getCardsCount = function () {
        return 1;
    };
    //获得某一花色的数量
    HandCard.prototype.getSuitTypeCount = function (suitType) {
        return 0;
    };
    //检查对,三条,四条
    HandCard.prototype.checkPairs = function (suitType, pairType) {
        return false;
    };
    return HandCard;
}());
