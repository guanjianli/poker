let _ = require("underscore");
class Test {
    public id: number;
    public name: string;
    public lv: number;

    constructor() {
        this.id = 0;
        this.name = "";
        this.lv = 0;
    }

    //加入一个桌子
    public joinDesk() {

    }

    //离开当前桌子
    public leaveDesk() {

    }

    //准备
    public readyToPlay() {
    }

    //从准备状态到取消准备
    public escToPlay() {

    }
    public test(){
        console.log(_.random(10,20));
    }
}
export default  Test;