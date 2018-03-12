let _ = require("underscore");
import User from "./User"

export default class UsersPool {
    private static _instance: UsersPool;

    public static get instance(): UsersPool {
        if (!this._instance) {
            this._instance = new UsersPool();
        }
        return this._instance
    }

    public personList: User [];

    constructor() {
        this.personList = [];
    }

    public addPerson(user: User) {
        this.personList.push(user);
        console.log(user.id);
    }

    public removePerson(id: number) {
        this.personList = _.reject(this.personList, function (item: any) {
            return item.id == id;
        });
    }

    //获得当前空闲的人
    public getFreePerson() {
        _.filter(this.personList, function (item: User) {
            return item.isPlaying == false
        })
    }
}