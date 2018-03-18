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
        return _.filter(this.personList, function (item: User) {
            return item.isPlaying == false
        })
    }

    public createAI(){
        let user = new User();
        user.name = "test" + (Math.random() * 100 >> 0);
        user.id = 1000 + (Math.random() * 100 >> 0);
        user.lv = Math.random() * 100 >> 0;
        user.isAI = true;
        UsersPool.instance.addPerson(user);
        return user
    }

}