// The Game can {initialize}, {be set up},
// {draw its main menu on stage}, {set up choosable decks},

var Game = {

	//Global variables
	handLimits : [4,6],
	battlefieldLimits: [4,6],
	playerLimits: [2,4],
	decks: [],
	scene: 0,
	stage: new createjs.Stage("myCanvas"),
	menu: new createjs.Container(),
	rules: false,
	rulesheet: "",

	//Default preferences	
	battlefieldSize: 5,
	handSize: 5,
	playerSize: 2,
	deckIndex: 2,
	playerpool: ["Rey", "Kylo Ren", "Anakin Skywalker", "Count Dooku", "Jar Jar Binks", "Han Solo", "Jabba", "Boba Fett", "Yoda"],
	
	
	init:function(){
		//Preload everything
		Preloader.preload();
	},
	setup:function(){
		//Set up basics
		scene=0;
		this.stage.enableMouseOver(40);
		createjs.Sound.volume = 1;

		//Define decks
		this.setupDecks();
		
		//Visual - set background, fire slideshow, and draw rules
		Animate.clearStage();
		Animate.setBackground("material/img/menu-01.png");
		Animate.slideshowBackground();
		Game.rulesheet = new createjs.Bitmap(Preloader.pull("material/img/rulesheet.png")),
		Game.rulesheet.setTransform(750,0);
		Game.rulesheet.alpha=0;
		Game.stage.addChild(Game.rulesheet);
		Game.drawMenu();
		
		//Start ticker
		Ticker.start();
	},
	
	drawMenu:function(){
		createjs.Sound.play("menu").volume=Animate.menuVolume;

		//PLay Hot Seat Mode Button
		var playHotSeatButton = Animate.createMenuButton("PLAY IN HOT SEAT MODE", 0, true);
		playHotSeatButton.on("click", function(){
			//Set up match
			createjs.Tween.removeTweens(Game.stage.background);
			Match = new Match(Game.playerSize, Game.decks[Game.deckIndex], Game.handSize, Game.battlefieldSize);
			Match.start();
		});

		//Choose Deck Button
		deckButton = Animate.createMenuButton("CHOOSE A DECK: " + Game.decks[Game.deckIndex].name, 1);
		deckButton.on("click", function(){
			Game.deckIndex++;
			if (Game.deckIndex >= Game.decks.length) Game.deckIndex=0;
			deckButton.text = "CHOOSE A DECK: " + Game.decks[Game.deckIndex].name;
			createjs.Sound.play("draw").volume=Animate.selectVolume;

		});

		//Number of players Button
		playersButton = Animate.createMenuButton("NUMBER OF PLAYERS: " + Game.playerSize, 2);
		playersButton.on("click", function(){
			Game.playerSize++;
			if (Game.playerSize > Game.playerLimits[1]) Game.playerSize=Game.playerLimits[0];
			playersButton.text = "NUMBER OF PLAYERS: " + Game.playerSize;
			createjs.Sound.play("draw").volume=Animate.selectVolume;

		});

		//Size of Hand Button
		var handSizeButton = Animate.createMenuButton("SIZE OF HAND: " + Game.handSize, 3);
		handSizeButton.on("click", function(){
			Game.handSize++;
			if (Game.handSize > Game.handLimits[1]) Game.handSize=Game.handLimits[0];
			handSizeButton.text = "SIZE OF HAND: " + Game.handSize;
			createjs.Sound.play("draw").volume=Animate.selectVolume;
		});

		//Size of Battlefield Button
		battlefieldSizeButton = Animate.createMenuButton("SIZE OF BATTLEFIELD: " + Game.battlefieldSize, 4);
		battlefieldSizeButton.on("click", function(){
			Game.battlefieldSize++;
			if (Game.battlefieldSize > Game.battlefieldLimits[1]) Game.battlefieldSize=Game.battlefieldLimits[0];
			battlefieldSizeButton.text = "SIZE OF BATTLEFIELD: " + Game.battlefieldSize;
			createjs.Sound.play("draw").volume=Animate.selectVolume;
		});

		//Mute Button
		muteButton = Animate.createMenuButton("MUTE: OFF", 5);
		muteButton.on("click", function(){
			createjs.Sound.play("draw").volume=Animate.selectVolume;
			if (createjs.Sound.volume == 1) {
				createjs.Sound.volume = 0;
				muteButton.text = "MUTE: ON";
			} else {
				createjs.Sound.volume=1;
				muteButton.text = "MUTE: OFF";
			}

		});

		//Rules Button
		rulesButton = Animate.createMenuButton("RULES & HELP", 6);
		rulesButton.on("click", function(){
			createjs.Sound.play("draw").volume=Animate.selectVolume;
			if(Game.rules) {
				Animate.fadeOut(Game.rulesheet);
				Game.rules=false;
			}
			else {
				Animate.fadeIn(Game.rulesheet)
				Game.rules=true;
			}

		});

		//Credits
		var credits = new createjs.Text("STAR WARS CARD GAME V0.8 WRITTEN AND DESIGNED BY GABOR PINTER", "16px Arial", Animate.menucolor);
		credits.alpha=Animate.creditsAlpha;
		credits.lineWidth = 240;
		credits.lineHeight = 25;
		credits.y=7*Animate.menuButtonPadding;

		//Call hover effects
		playHotSeatButton.on("mouseover", function() {Animate.hoverMenu(this);});
		playHotSeatButton.on("mouseout", function(){Animate.unhoverMenu(this);});
		playersButton.on("mouseover", function() {Animate.hoverMenu(this);});
		playersButton.on("mouseout", function(){Animate.unhoverMenu(this);});
		handSizeButton.on("mouseover", function() {Animate.hoverMenu(this);});
		handSizeButton.on("mouseout", function(){Animate.unhoverMenu(this);});
		battlefieldSizeButton.on("mouseover", function() {Animate.hoverMenu(this);});
		battlefieldSizeButton.on("mouseout", function(){Animate.unhoverMenu(this);});
		deckButton.on("mouseover", function() {Animate.hoverMenu(this);});
		deckButton.on("mouseout", function(){Animate.unhoverMenu(this);});
		muteButton.on("mouseover", function() {Animate.hoverMenu(this);});
		muteButton.on("mouseout", function(){Animate.unhoverMenu(this);});
		rulesButton.on("mouseover", function() {Animate.hoverMenu(this);});
		rulesButton.on("mouseout", function(){Animate.unhoverMenu(this);});

		//Formulate menu container
		this.menu.addChild(playHotSeatButton, deckButton, playersButton, handSizeButton, battlefieldSizeButton, muteButton, rulesButton, credits);
		this.menu.setTransform(100,Game.stage.canvas.height/2-180);
		this.stage.addChild(this.menu);
	},

	setupDecks: function() {
		var deck = new Deck([
				new Stormtrooper(),
				new Stormtrooper(),
				new Stormtrooper(),
				new Stormtrooper(),
				new Stormtrooper(),
				new Stormtrooper(),
				new Stormtrooper(),
				new Stormtrooper(),
				new Stormtrooper(),
				new Stormtrooper(),
				new Stormtrooper(),
				new Stormtrooper(),
				new Stormtrooper(),
				new Rancor(),
				new Rancor(),
				new Rancor(),
				new Rancor(),
				new Rancor(),
				new Rancor(),
				new Rancor(),
				new Rancor(),
				new Rancor(),
				new Rancor(),
				new Rancor(),
				new Rancor(),
				new Rancor(),
				new Rancor()
			]);

		deck.name="THE FORCE AWAKENS";
		this.decks.push(deck);

		deck = new Deck([
				new Ewok(),
				new Ewok(),
				new Ewok(),
				new Ewok(),
				new Ewok(),
				new Ewok(),
				new Ewok(),
				new Ewok(),
				new Ewok(),
				new Ewok(),
				new Ewok(),
				new Ewok(),
				new Ewok(),
				new ATST(),
				new ATST(),
				new ATST(),
				new ATST(),
				new ATST(),
				new ATST(),
				new ATST(),
				new ATST(),
				new ATST(),
				new ATST()

			]);
		deck.name="RETURN OF THE JEDI";
		this.decks.push(deck);

		deck = new Deck([
				new Ewok(),
				new Ewok(),
				new Ewok(),
				new Ewok(),
				new Ewok(),
				new Ewok(),
				new Ewok(),
				new Ewok(),
				new Ewok(),
				new Ewok(),
				new ATST(),
				new ATST(),
				new ATST(),
				new ATST(),
				new ATST(),
				new ATST(),
				new ATST(),
				new ATST(),
				new Stormtrooper(),
				new Stormtrooper(),
				new Stormtrooper(),
				new Stormtrooper(),
				new Stormtrooper(),
				new Stormtrooper(),
				new Stormtrooper(),
				new Stormtrooper(),
				new Stormtrooper(),
				new Stormtrooper(),
				new Rancor(),
				new Rancor(),
				new Rancor(),
				new Rancor(),
				new Rancor(),
				new Rancor(),
				new Rancor(),
				new Rancor(),
				new Rancor(),
				new Rancor()
			]);
		deck.name="MIXED";
		this.decks.push(deck);
	}
}