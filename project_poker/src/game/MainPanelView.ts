import BitmapLabel = eui.BitmapLabel;

class MainPanelView extends eui.Component {
    constructor() {
        super();
        //this.bindUI();
        //this.bindEvent();
        //this.run();
        this.init();
    }

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
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
    }

    private onTouchTap(e):void {
        if (!e.target) { return; }
    }

    private userName:string;
    private Done():void{
        this.userName = "wheheheheheheen";
        //this.power.text = "1515";
    }

}

