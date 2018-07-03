// The Hand can {discard a card}, {draw a card (get)}
// {advance its cards (fill up gaps)}, {clean up - combination of drawing and advancing until full hand}
// {burn last card}, {define the position of a card on stage (should be in Animate)}, {draw a new hand},
// {select a card} and {deselect everything}

var Hand = {
	//Set up default values
	maxSize: 0,
	cards: [],
	selected: null,

	discard : function(which) {
		createjs.Tween.removeTweens(Hand.cards[which].card);
		Animate.discard(Hand.cards[which].card);
		Match.deck.discardPile.push(Hand.cards[which]);
		Hand.cards[which]=null;
		Hand.unpick();
	},

	draw : function() {
			if (Hand.cards[Hand.maxSize-1] == null) {
				var newcard = Match.deck.draw();
				newcard.card.order=Hand.maxSize-1;
				
				Hand.cards[Hand.maxSize-1] = newcard;
				Animate.draw(newcard.card);
			}
	},

	advanceCards:function(){
		for (var i=0; i<Hand.maxSize-1; i++) {
			if (Hand.cards[i] == null) {
				for (var j=i+1; j<Hand.maxSize; j++) {
					var shifted=false;
					if (Hand.cards[j] !== null) {
						Hand.cards[i]=Hand.cards[j];
						Hand.cards[i].card.order=i;
						Animate.shiftit(Hand.cards[i].card, Hand.cardPosition(i), 350);
						Hand.cards[j]=null;
						shifted=true;
					}
					if (shifted) break;
				}
			}
		}
	},

	cleanUp: function() {
		Hand.burn();
		for (var i=0; i<Hand.maxSize; i++) {
			Hand.draw();
			Hand.advanceCards();
		}

	},

	burn:function() {
		if (Hand.cards[0] !== null)
			Hand.discard(0);
	},

	cardPosition : function (order) {
		return (Game.stage.canvas.width / this.maxSize * (this.maxSize-order) - 220);
	},

	newHand : function(){
		//Set up hand
		Hand.maxSize=Match.handSize;
		for (var i=0; i<Hand.maxSize-1; i++) {
			Hand.cards.push(null);
		}
		//Draw cards
		Hand.cleanUp();
	},

	pick : function(order) {
		//If nothing is selected, select it
		//When deck is reshuffled this runs twice!!
		if (Hand.selected==null) {
			Hand.selected=order;
			Animate.pick(Hand.cards[order].card);
		} else
		Hand.unpick();
	},

	unpick: function() {
		Animate.unpick();
		Hand.selected=null;
	}
};