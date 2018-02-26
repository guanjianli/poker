import * as _ from 'underscore';
import User = poker.User;
import UsersPool = poker.UsersPool;

//import UsersPool = poker.UsersPool;

class Main {
    constructor() {
        _;
        //初始创建四个用户
        for (var i = 0; i < 4; i++) {
            let user = new User();
            user.name = "test" + i;
            user.id = 1000 + i;
            user.lv = Math.random() * 100 >> 0
            UsersPool.instance.addPerson(user);
        }
    }
}

new Main();


