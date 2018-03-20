import User from "./User";

let _ = require("underscore");
import Card from "./Card"

export default class CardsPool {
    private static _instance: CardsPool;

    public static get instance(): CardsPool {
        if (!this._instance) {
            this._instance = new CardsPool();
        }
        return this._instance
    }

    public cardList: Card [];

    constructor() {
        this.cardList = [];
    }

}