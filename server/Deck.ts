import Card from "./Card";

let _ = require("underscore");

//生产一幅牌
export class Deck {
    public cardList: Card [] = [];
    public sequence: number = 0;//这表示牌是第几副牌
    //生产出一副牌
    constructor() {
        for (let i = 1; i <= 54; i++) {
            let c = new Card();
            c.order = i;
            this.cardList.push(c);
        }
        this.cardList = _.shuffle(this.cardList);
    }
}