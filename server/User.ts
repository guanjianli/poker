class User {
    public id: number;
    public name: string;
    public lv:number;
    constructor(obj:any){
        this.name = obj.name;
        this.lv = obj.lv;
        this.id = obj.id;
    }
}