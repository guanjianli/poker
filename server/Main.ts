import User from "./User";
import UsersPool from "./UsersPool";
import Room from "./Room";
import RoomsPool from "./RoomsPool";

for (let i = 0; i < 10; i++) {
	let user = new User();
	user.name = "test" + i;
	user.id = 1000 + i;
	user.lv = Math.random() * 100 >> 0;
	UsersPool.instance.addPerson(user);
}

//从用户池中拿到几个用户
//todo 匹配规则

//系统自动打开一个房间,确定是开的
RoomsPool.instance.createRoom();

let room = RoomsPool.instance.getNoFullRoom();

