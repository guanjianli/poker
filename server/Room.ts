import User from "./User";
import UsersPool from "./UsersPool";
let _ = require("underscore");

export default class Room {

    public id: number;
    public isFull: boolean;//房间是否满人
    public timeFlag:any = 0;
    constructor() {
        this.id = 0;
        this.isFull = false;
        this.checkToPlay();
    }

    public personList: User [];

    //开始一局
    public start() {

    }

    public joinPerson(people: User) {
        if (this.personList.length >= 4 ){
            console.error("this room is full , can't join");
            return
        }
        this.personList.push(people);
        this.isFull = this.personList.length >= 4 ;
        people.roomId = this.id;
        console.log("people id -> " + people.id);
    }

    //某人退出了房间
    public leavePerson(people: User) {
        this.personList = _.reject(this.personList, function (item: any) {
            return item.id == people.id;
        });
        this.isFull = this.personList.length >= 4 ;
        people.roomId = 0;
    }

    //房间定时检测,如够人,就开局
    public checkToPlay(){
        this.timeFlag = setInterval(()=>{
            let hadRealUser = false;
            let allReady = true;
            _.map(this.personList, (item:User)=>{
                if (item.isAI == false){
                    hadRealUser = true;
                }
                if (item.isReady == false){
                    allReady = false;
                }
            });
            if (!hadRealUser) return; //如果在座的全是机器人,不做任意事情
            if (allReady){
                //当所有人都准备好了,正式开始游戏
                this.start();
            }
            if (this.personList.length < 4 ){
                console.log("添加一个AI");
                let u = UsersPool.instance.createAI();
                this.joinPerson(u);
            }
        }, 1000);
    }

}