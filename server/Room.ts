import User from "./User";
let _ = require("underscore");

export default class Room {

    public id: number;
    public isFull: boolean;//房间是否满人
    constructor() {
        this.id = 0;
        this.isFull = false;
    }

    public personList: User [];

    //开始一局
    public start() {
        //
    }

    public joinPerson(people: User) {
        if (this.personList.length >= 4 ){
            console.log("this room is full , ")
            return
        }
        this.personList.push(people);
        console.log("people id -> " + people.id);
    }

    //某人退出了房间
    public leavePerson(people: User) {
        this.personList = _.reject(this.personList, function (item: any) {
            return item.id == people.id;
        });
    }
}