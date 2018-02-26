module poker {
    export class Desk {
        public chairs: Chair []; //四个椅子
        constructor() {
            this.chairs = [];
            for (let i = 0; i < 4; i++) {
                this.chairs.push(new Chair())
            }
        }
    }
}