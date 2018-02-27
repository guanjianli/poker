
	class Room extends  eui.Component{
		public self_cards:eui.List; 

		public constructor() {
			super();
			this.init();
		}
 
		public init() {
        this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/game_skins/room/room.exml";
        this.touchEnabled = false;
    	}
		
		private onComplete() {
			this.setPorker();

    	}

		public setPorker():void{
			var cards = new eui.ArrayCollection();
			for(var i=0;i<52;i++){
				cards.addItem({"value":"black_value_1_png","shap":"shap_1_png"});
			}
			console.log(cards);
			console.log(this.self_cards);
			this.self_cards.dataProvider = cards;
			
		}                                       
	}
