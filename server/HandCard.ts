class HandCard{
    constructor(){

    }
    public getCardsCount():number{
        return 1
    }
    //获得某一花色的数量
    public getSuitTypeCount(suitType:any):number{
        return 0
    }
    //检查对,三条,四条
    public checkPairs(suitType:any, pairType:any):boolean{
        return false
    }
}