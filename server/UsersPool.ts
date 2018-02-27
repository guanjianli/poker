module poker {
    export  class UsersPool {
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
        }

        public removePerson(id: number) {
            this.personList = _.reject(this.personList, function (item:any) {
                return item.id == id;
            });
        }
    }
}