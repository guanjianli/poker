class Chair {
    public static Free = "free";
    public static Busy = "busy";
    public status = Chair.Free;

    public user: any;

    constructor() {
    }

    public sitDown(user: User): void {
        this.user = user;
    }

    public sitUp(): void {
        this.user = null;
    }
}