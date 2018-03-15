import User from "./User";

let _ = require("underscore");
import Room from "./Room"

export default class RoomsPool {
    private static _instance: RoomsPool;

    public static get instance(): RoomsPool {
        if (!this._instance) {
            this._instance = new RoomsPool();
        }
        return this._instance
    }

    public roomList: Room [];

    constructor() {
        this.roomList = [];
    }

    public addRoom(room: Room) {
        this.roomList.push(room);
        console.log("room id -> " + room.id);
    }

    public createRoom() {
        //创建一个房间
        let room = new Room();
        room.id = _.random(10000, 99999);
        //将这个房间加到可匹配的房间列表
        RoomsPool.instance.addRoom(room);
    }

    public destroyRoom(room:Room) {
        this.roomList = _.reject(this.roomList, function (item: any) {
            return item.id == room.id;
        });
    }

    //获得当前空闲的房间
    public getNoFullRoom() {
        _.filter(this.roomList, function (item: Room) {
            return item.isFull == false
        })
    }
}