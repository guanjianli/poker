export default class Card {
    public suits: any; //花色
    public id: number;
    public order:number;

    constructor() {
        this.suits = Suits.club;
        this.order = 0;
    }
}