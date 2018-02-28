
	class Room extends  eui.Component{
		public self_cards:eui.List; 

		public constructor() {
			super();
			this.init();
		}
 
		public init() {
        this.once(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/game_skins/room/room.exml";
        this.touchEnabled = true;
    	}
		
		private onComplete() {
			this.self_cards.dataProvider = this.cards;
			this.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.tapCard,this);
			this.touchCard();
    	}

		private cards = new eui.ArrayCollection();
		private layout_selfCards:eui.TileLayout;
		public addCard(evt:DealEvent) {
			this.cards.addItem({"value":evt._value,"shap":evt._shap});
			this.self_cards.dataProviderRefreshed();
			if(this.cards.length>26) {
				this.layout_selfCards.requestedRowCount = 2;
			}
		}

		public getCard(value,shap) {
			var dealEvent:DealEvent = new DealEvent(DealEvent.DEAL);
			dealEvent._shap = shap;
			dealEvent._value = value;
			this.dispatchEvent(dealEvent);
		}

		public touchCard() {
			var tapItemEvent = new eui.ItemTapEvent(eui.ItemTapEvent.ITEM_TAP,false,false);
			console.log(tapItemEvent.itemRenderer);
			this.dispatchEvent(tapItemEvent);
		}
		public tapCard(evt:eui.ItemTapEvent) {
			console.log(evt.item);

		}
	}
