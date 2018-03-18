import User from "./User";
import UsersPool from "./UsersPool";
import Room from "./Room";
import RoomsPool from "./RoomsPool";

for (let i = 0; i < 10; i++) {
    UsersPool.instance.createAI();
}

//从用户池中拿到几个用户
//todo 匹配规则





