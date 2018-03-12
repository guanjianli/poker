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

//创建一个房间
let room = new Room();
//将这个房间加到可匹配的房间列表
RoomsPool.instance.addRoom(room);

