// The Animate object is responsible
// for all the animations and visuals

var Animate = {
	//Durations
	delay: 1000,
	normaldelay: 500,
	quickdelay: 250,
	veryquickdelay: 125,
	veryveryquickdelay: 62.5,
	
	//Colors
	highlightcolor: "#05D800",
	hovercolor: "#E5E5E5",
	fieldcolor: "#665C56",
	unitFramecolor: "#393939",
	unitAttackcolor: "#fff",
	unitHealthcolor: "#fff",
	panelTextcolor: "#fff",
	metacolor: "#fff",
	panelcolor: "#000",
	hitcolor: "red",
	menucolor: "#fff",
	fadecolor: "#000",
	victoryScreencolor: "#000",
	victoryTextcolor: "#fff",

	//Alphas
	fieldAlpha: 0.3,
	panelAlpha: 0.2,
	menuAlpha: 0.95,
	menuAlphaHover: 0.5,
	creditsAlpha: 0.65,
	victoryScreenAlpha: 0.4,

	//Distances
	menuButtonPadding: 45,

	//Sounds
	hoverVolume: 0.025,
	selectVolume: 0.1,
	menuVolume: 0.2,
	victoryVolume: 0.2,

	//Slideshow
	slideshow:0,

	draw: function(card) {
		createjs.Tween.removeTweens(card);
		
		card.x=Hand.cardPosition(Hand.maxSize-1);
		card.y=Game.stage.canvas.height-325;
		
		Game.stage.addChild(card);

		card.y=Game.stage.canvas.height+100;
		createjs.Tween.get(card)
		.to({y: Game.stage.canvas.height-325}, Animate.quickdelay)
	},

	shiftit: function(card, position) {
		// card.x = position;
		
		createjs.Tween.get(card)
		.to({x: position}, Animate.quickdelay);
	},

	discard: function(card) {
		// card.y=Game.stage.canvas.height+200;
		// Game.stage.removeChild(card);
		// card.setTransform(20,20);
		Animate.unpick(card);
		

		createjs.Tween.get(card)
		.to({y: Game.stage.canvas.height+200}, Animate.quickdelay)
		.call(function(){
			Game.stage.removeChild(card);
		});
	},

	pick: function(card) {


		highlight = new createjs.Shape();
		highlight.graphics.f(this.highlightcolor).dr(-10,25,220,278);
		highlight.alpha=0.7;
		// card.setTransform(card.x-12,card.y-15,1.1,1.1);

		card.addChildAt(highlight, 0);

		createjs.Sound.play("select").volume=Animate.selectVolume;

		createjs.Tween.get(card)
		.to({x: card.x-12, y: card.y-15, scaleX: 1.1, scaleY: 1.1}, Animate.veryquickdelay);
		
		createjs.Tween.get(card.getChildAt(0), {loop:true})
		.to({alpha: 0.2}, 400)
		.to({alpha: 0.7}, 1200);

		for (var i=0; i<Match.battlefieldSize; i++) {
			currentField = Match.players[Match.activePlayer].units[i];
			if (currentField !== null) {
				currentField.alpha=0.6;
			}
		}		
	},

	unpick: function() {
		//If there is anything we can animate
		if (Hand.selected !== null && Hand.cards[Hand.selected] !== null) {
			var card = Hand.cards[Hand.selected].card;
			createjs.Tween.get(card)
				.to({x: card.x+12, y: card.y+15, scaleX: 1, scaleY: 1}, Animate.veryquickdelay);
			
			card.removeChild(highlight)
		}

		createjs.Sound.play("select").volume=Animate.selectVolume;

		//Reset all fields
		for (var j=0; j<Match.players.length; j++) {
			for (var i=0; i<Match.battlefieldSize; i++) {
				currentField = Match.players[j].units[i];
				currentField.alpha=Animate.fieldAlpha;
			}
		}
	},

	hover: function(field) {
		field.removeChild(highlight);
		highlight = new createjs.Shape();
		highlight.graphics.f(this.hovercolor).de(-13,-13,123,155);
		highlight.alpha=0.7;
		field.addChildAt(highlight, 0);

		createjs.Tween.get(field.getChildAt(0), {loop:true})
		.to({alpha: 0.2}, 400)
		.to({alpha: 0.7}, 1200);

		field.miniCard.setTransform(field.x-50, field.y+120, 0.85, 0.85);
		field.miniCard.alpha=0.1;
			
		createjs.Tween.get(field.miniCard)
		.to({scaleX: 1, scaleY: 1, x: field.miniCard.x-8, y: field.miniCard.y+5, alpha: 1}, Animate.veryveryquickdelay);

		Game.stage.addChild(field.miniCard);
		createjs.Sound.play("hover").volume=this.hoverVolume;
	},

	unhover: function(field) {
		field.removeChild(highlight)
	},

	createField: function(player, field){
		xUnit = Game.stage.canvas.width / Match.battlefieldSize;
		yUnit = (Game.stage.canvas.height-350) / Match.players.length;
		xPos=xUnit*field + xUnit / 2;
		yPos=yUnit*player + yUnit / 2;

		field = new createjs.Shape();
		field.graphics.f(this.fieldcolor).de(xPos-63,yPos-63,123,155);
		field.alpha=Animate.fieldAlpha;
		
		return field;
	},

	play: function(who, card, where){
		// Game.stage.removeChild(Match.players[who].units[where]);
		xUnit = Game.stage.canvas.width / Match.battlefieldSize;
		yUnit = (Game.stage.canvas.height-350) / Match.players.length;
		xPos=xUnit*where + xUnit / 2 -50;
		yPos=yUnit*who + yUnit / 2 -50;

		card.unit.setTransform(card.card.x, card.card.y);
		createjs.Tween.get(card.unit)
		.to({x: xPos, y: yPos}, Animate.normaldelay);

		createjs.Tween.get(card.card)
		.to({alpha: 0, scaleX: 1.3, scaleY: 1.3, x: card.card.x-20, y: card.card.y-20}, Animate.normaldelay)
		.call(function(){
			Game.stage.removeChild(card.card);
			card.card.alpha=1;
			card.card.scaleX=1;
			card.card.scaleY=1;
		})

		Game.stage.addChild(card.unit);

		Animate.unpick();
		
	},

	ability: function(card) {
		//grow then shrink
		//play sound
	},

	updateUnit: function(card) {
		card.metaTag.text = card.attack + " / " + card.health;
		Animate.highlightText(card.metaTag, Animate.hitcolor);
	},

	highlightText: function(text, color) {
		originalColor=text.color
		text.color=color;
		createjs.Tween.get(text)
		.to({scaleX: 2, scaleY: 2,}, Animate.normaldelay)
		.to({scaleX: 1, scaleY: 1}, Animate.normaldelay)
		.call(function(){
			text.color=originalColor;
		});
	},

	updateGUI: function() {
		Match.playersHealth.text="";
		for (var i=0; i<Match.players.length; i++) {
			Match.playersHealth.text += Match.players[i].name + ": " + Match.players[i].health;
			if (i== Match.players.length-1) Match.playersHealth.text +=". ";
			else Match.playersHealth.text += ", ";
		}

		Match.turnCounter.text = Match.round + ". round, " + Match.players[Match.activePlayer].name + "'s turn.";
	},

	clearStage: function() {
		Game.stage.removeAllChildren();
	},

	setBackground: function(backgroundPath) {
		
		var background = new createjs.Bitmap(Preloader.pull(backgroundPath)); 
		Game.stage.background=background;
		// Game.stage.background.setTransform(0,0,.385, .37);
		Game.stage.addChildAt(Game.stage.background, 0);
	},

	slideshowBackground: function() {
		backgrounds = ["material/img/menu-02.png", "material/img/menu-03.png", "material/img/menu-04.png", "material/img/menu-01.png"];

		createjs.Tween.get(Game.stage.background)
		.to({scaleX: 1.2, scaleY: 1.2, x: Game.stage.background.x-100, y: Game.stage.background.y-100}, 19000)
		.call(function(){
			createjs.Tween.get(Game.stage.background)
			.to({alpha:0}, 3000)
			.call(function(){
				Animate.slideshowBackground();
				Animate.slideshow++;
				if (Animate.slideshow >= backgrounds.length) Animate.slideshow=0;
			});
			Animate.setBackground(backgrounds[Animate.slideshow]);

		});
	},

	createMenuButton: function(text, order, bold) {
		if (bold) bold="bold"; else bold="";
		button = new createjs.Text(text, bold + " 24px Arial", Animate.menucolor);
		button.alpha=Animate.menuAlpha;
		button.y=order*Animate.menuButtonPadding;
		clickBox = new createjs.Shape();
		clickBox.graphics.f("green").dr(-5,0-5,400,40);
		button.hitArea=clickBox;
		return button;
	},

	hoverMenu: function(button) {
		button.alpha=Animate.menuAlphaHover;
		createjs.Sound.play("select").volume=Animate.selectVolume;
	},

	unhoverMenu: function(button) {
		button.alpha=Animate.menuAlpha;
	},

	fadeIn: function(object) {
		createjs.Tween.get(object)
		.to({alpha: 1, x: 650}, Animate.quickdelay);
	},

	fadeOut: function(object) {
		createjs.Tween.get(object)
		.to({alpha: 0, x: 750}, Animate.quickdelay);
	},

	die: function(card) {
		createjs.Tween.get(card.unit)
		.to({scaleX: 0.1, scaleY: 0.1, x: card.unit.x+45, y: card.unit.y+50}, Animate.quickdelay)
		.call(function(){
			Game.stage.removeChild(card.unit);
		});
		
	},

	announceWinner: function() {
		createjs.Sound.play("victory").volume=Animate.victoryVolume;
		var screen = new createjs.Container();
		var fade = new createjs.Shape();
		fade.graphics.f(Animate.victoryScreencolor).dr(0,0,Game.stage.canvas.width,Game.stage.canvas.height);
		fade.alpha=0;
		fade.setTransform(0,0);
		createjs.Tween.get(fade)
		.to({alpha: Animate.victoryScreenAlpha}, Animate.delay);
		
		var victoryText = new createjs.Text(Match.players[Match.winnerIndex].name + " is victorious!", "bold 32px Arial", Animate.victoryTextcolor);
		victoryText.textAlign = "center";
		victoryText.setTransform(Game.stage.canvas.width/2, Game.stage.canvas.height/2+60);
		createjs.Tween.get(victoryText, {loop: true})
		.to({scaleX:1.2, scaleY: 1.2}, Animate.delay)
		.to({scaleX:1, scaleY: 1}, Animate.delay);
		
		var image = new createjs.Bitmap(Preloader.pull("material/img/victory.png"));
		
		image.setTransform(Game.stage.canvas.width/2-150, Game.stage.canvas.height/2-345);
		createjs.Tween.get(image, {loop: true})
		.to({scaleX:1.2, scaleY: 1.2, x: image.x-25, y: image.y-25}, Animate.delay)
		.to({scaleX:1, scaleY: 1, x: image.x+25, y: image.y+25}, Animate.delay);

		screen.on("click", function(){
			window.location="http://google.com";
		})

		screen.setTransform(0,0);
		screen.addChild(fade, victoryText, image);
		Game.stage.addChild(screen);

		
	}
}