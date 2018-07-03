// A Match can {be started}, {pass the turn},
// {have an attack phase}, {check for winner},
// {clear the board, remove dead units}, and {rotate players}

function Match(playerSize, deck, handSize, battlefieldSize) {
	//Set up players
	this.playerSize=playerSize;
	this.players = [];
	this.deck=deck;
	this.handSize=handSize;
	this.battlefieldSize=battlefieldSize;
	this.won=false;
	
	this.winnerIndex = null;

	//Rounds
	this.round=1;
	this.activePlayer=0;
}

//Setting up a new match based on given parameters
Match.prototype.start = function() {
	
	//Clear all graphics
	createjs.Tween.removeTweens(Game.stage.background);
	Animate.clearStage();
	Animate.setBackground("material/img/background-01.png");
	createjs.Sound.stop("menu");

	//Create players with random Star Wars name
	for (var i=0; i<this.playerSize; i++) {
		this.players.push(Game.playerpool[Math.round(Math.random()*(Game.playerpool.length-1))]);
	}

	//Shuffle deck and deal cards
	this.deck.shuffle();
	Hand.newHand();

	//Inside players array > replace strings (random Star Wars names) with Player objects
	for (var i=this.players.length-1; i>=0; i--) {
		var player = new Player(this.players[i]);
		this.players[i] = player;

		//Creating current player's clickable fields
		for (var j=0; j<Match.battlefieldSize; j++) {
			field = Animate.createField(i, j);
			field.owner = i;
			field.position=j;
			Match.players[i].units.push(field);
			
			Game.stage.addChild(Match.players[i].units[j]);
			
			Match.players[i].units[j].on("click", function(){
				if (Match.activePlayer==this.owner)
					Match.players[this.owner].play(this);
			});
		}

	}

	//Add some graphics (panel on top + life and round counter)
	this.panel = new createjs.Shape();
	this.panel.graphics.f(Animate.panelcolor).dr(0,0,Game.stage.canvas.width,40);
	this.panel.alpha=Animate.panelAlpha;

	Game.stage.addChild(this.panel);

	this.playersHealth= new createjs.Text("", "16px Arial", Animate.panelTextcolor);
	this.playersHealth.setTransform(12,12);
	Game.stage.addChild(this.playersHealth);

	this.turnCounter= new createjs.Text("", "16px Arial", Animate.panelTextcolor);
	this.turnCounter.setTransform(Game.stage.canvas.width-12,12);
	this.turnCounter.textAlign="right";
	Game.stage.addChild(this.turnCounter);
	
	Animate.updateGUI();
	
}

//Passing turn to next player (Game phases after playing a card)
Match.prototype.passTurn = function() {
	Match.attack();
	Match.checkForWin();
	Match.checkForUnitDeaths();
	Match.rotatePlayers();
	Hand.unpick();
	if (!Match.won) Hand.cleanUp();
},

//Trigger the abilities of active player's units
Match.prototype.attack = function() {
	currPlayer = Match.players[Match.activePlayer];
	for (var i=0; i<Match.battlefieldSize; i++) {
		if (currPlayer.units[i].name)
			currPlayer.units[i].ability();
	}
}

//Check for last man standing
Match.prototype.checkForWin = function() {
	var aliveNum = 0;

	//Check for deaths and count alive players
	for (var i=0; i<Match.players.length; i++) {
		if (Match.players[i].health <= 0)
			Match.players[i].alive=false;
		else {
			aliveNum++;
			Match.winnerIndex=i;
		}
	}

	//Check for last man standing
	if (aliveNum==1) Match.announceWinner();
},

//Kill units with health 0 or less
Match.prototype.checkForUnitDeaths = function() {
	//Check all fields of all players
	for (var i=0; i<Match.players.length; i++) {
		for (var j=0; j<Match.battlefieldSize; j++) {
			//If unit has 0 or less HP, kill it
			if (Match.players[i].units[j].health <= 0) {
				console.log(Match.players[i].units[j].name + "(" + j + ") controlled by " + Match.players[i].name + " has died!");

				//Animate card, and push it to discard pile
				Match.deck.discardPile.push(Match.players[i].units[j]);
				Animate.die(Match.players[i].units[j]);

				//Replace card with a clickable empty field
				field = Animate.createField(i, j);
				field.owner = i;
				field.position=j;
				Match.players[i].units[j] = field;
				Game.stage.addChild(Match.players[i].units[j]);

				Match.players[i].units[j].on("click", function(){
				if (Match.activePlayer==this.owner)
					Match.players[this.owner].play(this);
				});
			}
		}
	}
},

//Look for the next player who is alive and has room for a new card
Match.prototype.rotatePlayers = function() {
	do {
		Match.activePlayer++;
		
		//Keep index between 0 and numberOfPlayers
		if (Match.activePlayer >= Match.players.length) {
			Match.activePlayer = 0;
			Match.round ++;
			console.log("%c" + Match.round + ". round", "background-color: yellow");
		}

		//Check if player has room for a new card
		var fullBoard = true;
		for (var i=0; i<Match.battlefieldSize && fullBoard; i++) {
			//If it has no name, it's an empty field = board is not full
			if (!Match.players[Match.activePlayer].units[i].name)
				fullBoard = false;
		}

	} while(!Match.players[Match.activePlayer].alive || fullBoard);
	Animate.updateGUI();
},

Match.prototype.announceWinner = function() {
	console.log(Match.players[Match.winnerIndex].name + " has won the match!");
	Match.won=true;
	Animate.announceWinner();
}

