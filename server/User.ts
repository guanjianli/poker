import RoomsPool from "./RoomsPool";

export default class User {
    public id: number;
    public name: string;
    public lv: number;
    public isPlaying: boolean;
    public isReady:boolean;
    public isAI:boolean = false;
    public roomId:number = 0;
    constructor() {
        this.id = 0;
        this.name = "";
        this.lv = 0;
        this.isPlaying = false;
        this.isReady = false;
    }

    //准备,如果自动匹配过来的,自动加上准备状态
    public readyToPlay() {
        this.isReady = true;
    }

    //从准备状态到取消准备,例如打完一局后
    public escToPlay() {
        this.isReady = false;
    }

    //这个用户很有钱,创建了一个房间
    public createRoom(){
        //检查这个用户的房间卡
        //todo
        //系统打开一个房间
        RoomsPool.instance.createRoom();
    }

    //用户发出指令,要求找到一个空闲的桌子
    public findRreeRoom(){
        return RoomsPool.instance.getFreeRoom();
    }
}