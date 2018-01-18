import BitmapLabel = eui.BitmapLabel;

class MainPanelView extends eui.Component {
    constructor() {
        super();
        //this.bindUI();
        //this.bindEvent();
        //this.run();
        this.init();
    }

    private mode_1:eui.Group;
    public dispose() {

        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
    }

    public init() {
        this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/game_skins/main/MainPanelSkin.exml";
        this.touchEnabled = false;
    }

    private onComplete() {
        this.bindExtraUI();
        this.bindEvent();

        //this.run();
        this.Done();

    }


    public content:eui.Scroller;

    public power:eui.BitmapLabel;

    private bindExtraUI() {
    }

    private bindEvent() {
       // this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
    }

    private onTouchTap(e):void {
        console.log(e.target.name)
        if (!e.target) { return; }
    }

        private onTouchTapGp(e):void {
        console.log("click on me ")
        
    }

    private userName:string;
    private Done():void{
        this.userName = "wheheheheheheen";
        //this.power.text = "1515";
    }

}

