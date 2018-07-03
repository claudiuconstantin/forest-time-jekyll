//Common abilities shared by Cards
//Cards can {attack}

var Abilities =  {
	attack: function(card) {
		Animate.ability(card);
		var position = Match.players[Match.activePlayer].units.indexOf(card);
		for (var i = 0; i<Match.players.length; i++) {
			if (i!==Match.activePlayer) {
				opponent = Match.players[i].units[position];
				//If it has an opponent
				if (opponent.name) {
					opponent.health -= card.attack;
					console.log(card.name + "(" + position + ") deals " + card.attack + " damage to " + opponent.name + "(" + position +")!");
					Animate.updateUnit(opponent);
				}
				else {
					Match.players[i].health -= card.attack;
					Animate.highlightText(Match.playersHealth, Animate.hitcolor);
				}
			}
		}
	}
}