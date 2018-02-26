class User {
    public id: number;
    public name: string;
    public lv:number;
    constructor(obj:any){
        this.name = obj.name;
        this.lv = obj.lv;
        this.id = obj.id;
    }
    //加入一个桌子
    public joinDesk(){

    }
    //离开当前桌子
    public leaveDesk(){

    }
    //准备
    public readyToPlay(){}
    //从准备状态到取消准备
    public escToPlay(){

    }

}