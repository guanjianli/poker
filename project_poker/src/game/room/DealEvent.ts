class DealEvent extends egret.Event {
	public static DEAL:string = "发牌";
	public _value:string ="black_value_4_png";
	public _shap:string ="shap_1_png";

	public constructor(type:string, bubbles:boolean=false, cancelable:boolean=false) {
		super(type,bubbles,cancelable);
	}
}